// Publica en Instagram las piezas de estado/cola-publicacion.json cuya hora ha llegado (lo ejecuta GitHub Actions cada 15 min).
// Uso: node herramientas/publicar-api/cola.mjs [--prueba]
// Cada entrada: {"pieza": "NNN-slug", "version": "v1", "hora": "2026-10-30T19:00:00+01:00", "aprobacion": "<cita o regla>",
//               "estado": "pendiente"}. Al publicarse pasa a "publicado" (con id y enlace); si falla, a "error".
// Reglas de seguridad (CLAUDE.md, Convenciones):
//  - sin "aprobacion" no se publica nada;
//  - si la pieza aparece en estado/vetos.md (veto de la persona usuaria), pasa a "vetado";
//  - con más de 3 h de retraso no se publica ("caducado"): la actualidad puede haber cambiado; lo revisa el coordinador.
// El vídeo sale de videos/renders/ o, si no está, del release "listos" del repositorio (lo sube el flujo de render).
// El texto del post es la sección "## Texto del post" de publicado/NNN-slug.md.
import './ocultar.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const colaF = path.join(RAIZ, 'estado', 'cola-publicacion.json');
const vetosF = path.join(RAIZ, 'estado', 'vetos.md');
const registroF = path.join(RAIZ, 'estado', 'registro-publicacion.md');
const prueba = process.argv.includes('--prueba');
if (!fs.existsSync(colaF)) { console.log('Sin cola de publicación'); process.exit(0); }

const cola = JSON.parse(fs.readFileSync(colaF, 'utf8'));
// Vetos: cualquier línea de vetos.md que no sea título ni comentario y nombre la pieza
const vetos = fs.existsSync(vetosF) ? fs.readFileSync(vetosF, 'utf8').split('\n').filter((l) => l.trim() && !/^\s*(#|>)/.test(l)) : [];
const vetada = (p) => vetos.some((l) => l.includes(p));
const registro = (t) => fs.appendFileSync(registroF, `- ${new Date().toISOString()} · ${t}\n`);
const ahora = Date.now();
let cambios = 0;

function textoPost(pieza) {
  const f = path.join(RAIZ, 'publicado', `${pieza}.md`);
  if (!fs.existsSync(f)) throw new Error(`no existe publicado/${pieza}.md`);
  const m = fs.readFileSync(f, 'utf8').match(/## Texto del post\s*\n([\s\S]*?)(?=\n## |$)/);
  if (!m || !m[1].trim()) throw new Error(`publicado/${pieza}.md no tiene "## Texto del post"`);
  const t = path.join(os.tmpdir(), `${pieza}-post.txt`);
  fs.writeFileSync(t, m[1].trim());
  return t;
}

function video(pieza, version) {
  const nombre = `${pieza}-${version}.mp4`;
  const local = path.join(RAIZ, 'videos', 'renders', nombre);
  if (fs.existsSync(local)) return local;
  fs.mkdirSync(path.dirname(local), {recursive: true});
  const r = spawnSync('gh', ['release', 'download', 'listos', '-p', nombre, '-D', path.dirname(local), '--clobber'], {encoding: 'utf8'});
  if (r.status !== 0 || !fs.existsSync(local)) throw new Error(`no encuentro ${nombre} ni en videos/renders ni en el release "listos"`);
  return local;
}

for (const e of cola) {
  if (e.estado !== 'pendiente') continue;
  const hora = Date.parse(e.hora);
  if (!e.aprobacion) { e.estado = 'error'; e.error = 'sin aprobación'; registro(`${e.pieza}: NO publicada, sin aprobación`); cambios++; continue; }
  if (vetada(e.pieza)) { e.estado = 'vetado'; registro(`${e.pieza}: vetada en estado/vetos.md, no se publica`); cambios++; continue; }
  if (!(hora <= ahora)) continue;
  if (ahora - hora > 3 * 36e5) { e.estado = 'caducado'; registro(`${e.pieza}: más de 3 h de retraso, no se publica (revisar y reprogramar)`); cambios++; continue; }
  try {
    const args = [path.join(RAIZ, 'herramientas', 'publicar-api', 'instagram.mjs'), 'reel', video(e.pieza, e.version), `--texto=${textoPost(e.pieza)}`];
    if (e.portada_ms) args.push(`--portada-ms=${e.portada_ms}`);
    if (prueba) args.push('--prueba');
    const r = spawnSync(process.execPath, args, {encoding: 'utf8'});
    const salida = `${r.stdout}${r.stderr}`;
    if (r.status !== 0) throw new Error(salida.split('\n').filter((l) => /Error|fallid/.test(l)).slice(-1)[0] || `código ${r.status}`);
    if (prueba) { console.log(`PRUEBA ${e.pieza}: ${salida.trim().split('\n').pop()}`); continue; }
    const m = salida.match(/PUBLICADO (\S+)(?: · (\S+))?/);
    Object.assign(e, {estado: 'publicado', id: m?.[1], enlace: m?.[2], publicado_en: new Date().toISOString()});
    registro(`${e.pieza} ${e.version}: PUBLICADA en Instagram ${m?.[2] || m?.[1] || ''}`);
    // TikTok: el mismo vídeo va a la bandeja de borradores; la persona usuaria lo publica desde la app
    if (process.env.TIKTOK_REFRESH_TOKEN && e.tiktok !== false) {
      const t = spawnSync(process.execPath, [path.join(RAIZ, 'herramientas', 'publicar-api', 'tiktok.mjs'), 'borrador', video(e.pieza, e.version)], {encoding: 'utf8'});
      e.tiktok_estado = t.status === 0 ? 'borrador' : 'error';
      registro(`${e.pieza}: TikTok ${t.status === 0 ? 'en la bandeja de borradores (falta publicarlo desde la app)' : 'ERROR: ' + `${t.stdout}${t.stderr}`.trim().split('\n').pop()}`);
    }
  } catch (err) {
    Object.assign(e, {estado: 'error', error: String(err.message).slice(0, 300)});
    registro(`${e.pieza}: ERROR al publicar: ${e.error}`);
  }
  cambios++;
}

if (cambios && !prueba) fs.writeFileSync(colaF, JSON.stringify(cola, null, 2) + '\n');
console.log(`Cola revisada: ${cambios} cambio(s)`);
