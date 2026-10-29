// Pasos de un encargo de render de Al minuto horario (los llama .github/workflows/render.yml).
//  node herramientas/al-minuto/encargo.mjs clip <cola/render/x.json>     → baja el vídeo de origen del release
//       "fuentes-alminuto" y prepara clips/clip.mp4 con videos/scripts/clip.mjs (tramos, modo, foco, pixelado)
//  node herramientas/al-minuto/encargo.mjs encolar <cola/render/x.json>  → si "publicar": true, mete la pieza en
//       estado/cola-publicacion.json para ya (publicación directa autorizada por la persona usuaria el 2026-10-29)
// Formato del encargo: {"pieza": "am20261029-1605-slug", "version": "v1", "publicar": true,
//   "clip": {"asset": "ig-123.mp4", "tramos": "12.3-40.1", "modo": "recorte", "foco": 0.5, "pixelar": ""}}
import '../publicar-api/ocultar.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const [orden, archivo] = process.argv.slice(2);
const e = JSON.parse(fs.readFileSync(archivo, 'utf8'));
const corre = (cmd, args) => { const r = spawnSync(cmd, args, {encoding: 'utf8', stdio: 'inherit'}); if (r.status !== 0) process.exit(r.status || 1); };

if (orden === 'clip') {
  if (!e.clip) process.exit(0);
  const {asset, tramos, modo = 'recorte', foco = 0.5, pixelar = ''} = e.clip;
  if (!/^[a-z0-9._-]+\.mp4$/i.test(asset) || !/^[\d.]+-[\d.]+(,[\d.]+-[\d.]+)*$/.test(tramos)) { console.error('Encargo con asset o tramos no válidos'); process.exit(1); }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'am-'));
  corre('gh', ['release', 'download', 'fuentes-alminuto', '-p', asset, '-D', dir, '--clobber']);
  const args = [path.join(RAIZ, 'videos', 'scripts', 'clip.mjs'), e.pieza, path.join(dir, asset), `--tramos=${tramos}`, `--modo=${modo}`, `--foco=${foco}`];
  if (pixelar) args.push(`--pixelar=${pixelar}`);
  corre(process.execPath, args);
} else if (orden === 'encolar') {
  if (!e.publicar) process.exit(0);
  const colaF = path.join(RAIZ, 'estado', 'cola-publicacion.json');
  const cola = fs.existsSync(colaF) ? JSON.parse(fs.readFileSync(colaF, 'utf8')) : [];
  if (cola.some((x) => x.pieza === e.pieza && x.version === e.version)) process.exit(0);
  // Se publica en punto (decisión de la persona usuaria: 16:00, 17:00, 18:00…): la próxima hora en punto
  // (si el render acaba con hasta 15 min de retraso sobre la hora, se publica ya)
  const t = Date.now(), ini = Math.floor(t / 36e5) * 36e5;
  const enPunto = new Date(t - ini < 15 * 60e3 ? t : ini + 36e5).toISOString();
  cola.push({pieza: e.pieza, version: e.version || 'v1', hora: enPunto, estado: 'pendiente',
    aprobacion: 'Al minuto horario: publicación directa sin revisores, autorizada por la persona usuaria el 2026-10-29 (respeta estado/vetos.md)'});
  fs.writeFileSync(colaF, JSON.stringify(cola, null, 2) + '\n');
  console.log(`${e.pieza}: en la cola para publicar a las ${enPunto}`);
} else { console.error('Uso: encargo.mjs clip|encolar <encargo.json>'); process.exit(1); }
