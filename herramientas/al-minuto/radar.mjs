// Radar del agente "Al minuto" horario (lo ejecuta .github/workflows/al-minuto.yml cada hora).
// 1. Lee los reels recientes de las cuentas de cuentas.json con la API oficial de Instagram (Business Discovery)
//    y los vídeos nuevos de La Moncloa; añade los enlaces del buzón (estado/buzon-al-minuto.md).
// 2. Calcula la viralidad (me gusta + 2·comentarios por hora, relativa a los seguidores de la cuenta).
// 3. Descarga los N mejores no vistos a <salida>/<id>.mp4 y deja la lista en <salida>/candidatos.json.
// La transcripción la hace transcribir.py; la elección y el guion, la rutina de la nube.
// Uso: node herramientas/al-minuto/radar.mjs --salida=/tmp/am [--n=5] [--horas=8]
import '../publicar-api/ocultar.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(aqui, '..', '..');
const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').split('=').slice(1).join('=') || d;
const salida = arg('salida', path.join(RAIZ, '_radar'));
const N = Number(arg('n', '5'));
const HORAS = Number(arg('horas', '8'));
fs.mkdirSync(salida, {recursive: true});

// Claves: secretos de la nube o herramientas/publicar-api/.env (en local)
const envF = path.join(RAIZ, 'herramientas', 'publicar-api', '.env');
if (fs.existsSync(envF)) for (const l of fs.readFileSync(envF, 'utf8').split('\n')) {
  const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const {IG_USER_ID, IG_ACCESS_TOKEN} = process.env;
const GRAPH = `https://graph.facebook.com/${process.env.GRAPH_VERSION || 'v23.0'}`;
if (!IG_USER_ID || !IG_ACCESS_TOKEN) { console.error('Faltan IG_USER_ID o IG_ACCESS_TOKEN'); process.exit(2); }

const vistosF = path.join(RAIZ, 'estado', 'al-minuto', 'vistos.json');
const vistos = fs.existsSync(vistosF) ? JSON.parse(fs.readFileSync(vistosF, 'utf8')) : {};
const cuentas = JSON.parse(fs.readFileSync(path.join(aqui, 'cuentas.json'), 'utf8'));
const ahora = Date.now();
const traer = (u) => fetch(u, {signal: AbortSignal.timeout(30000)});
const candidatos = [];
const porCodigo = {}; // shortcode de Instagram → reel (para los enlaces del buzón)
const codigo = (u) => (u.match(/instagram\.com\/(?:[^/]+\/)?(?:reel|reels|p)\/([A-Za-z0-9_-]+)/) || [])[1];

// --- Instagram: Business Discovery (API oficial; solo cuentas profesionales) ---
for (const c of cuentas.instagram) {
  const campos = `business_discovery.username(${c.usuario}){username,name,followers_count,media.limit(12){id,media_type,media_product_type,timestamp,like_count,comments_count,permalink,caption,media_url}}`;
  const url = `${GRAPH}/${IG_USER_ID}?fields=${encodeURIComponent(campos)}&access_token=${IG_ACCESS_TOKEN}`;
  let j;
  try { j = await (await traer(url)).json(); } catch (e) { console.log(`@${c.usuario}: error de red`); continue; }
  if (j.error) { console.log(`@${c.usuario}: ${j.error.message.slice(0, 80)}`); continue; }
  const b = j.business_discovery;
  for (const m of b.media?.data || []) {
    if (m.media_type !== 'VIDEO' || !m.media_url) continue;
    const horas = (ahora - Date.parse(m.timestamp)) / 36e5;
    const id = `ig-${m.id}`;
    const viral = ((m.like_count || 0) + 2 * (m.comments_count || 0)) / Math.max(horas, 0.5) / Math.max(b.followers_count / 1e5, 0.2);
    const cand = {id, fuente: 'instagram', cuenta: `@${b.username}`, nombre: b.name, espacio: c.espacio, seguidores: b.followers_count,
      fecha: m.timestamp, horas: +horas.toFixed(1), me_gusta: m.like_count, comentarios: m.comments_count, viral: +viral.toFixed(1),
      enlace: m.permalink, texto: (m.caption || '').slice(0, 600), descarga: m.media_url, credito: `Vídeo: @${b.username}`};
    porCodigo[codigo(m.permalink || '')] = cand;
    if (horas > HORAS || vistos[id]) continue;
    candidatos.push(cand);
  }
}

// --- La Moncloa: vídeos de hoy y ayer (aviso legal: reutilización citando la fuente) ---
const dd = (d) => `${String(d.getUTCDate()).padStart(2, '0')}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCFullYear()).slice(2)}`;
const dias = [dd(new Date(ahora)), dd(new Date(ahora - 864e5))];
try {
  const html = await (await traer('https://www.lamoncloa.gob.es/multimedia/videos/Paginas/index.aspx')).text();
  const paginas = [...new Set([...html.matchAll(/href="(\/multimedia\/videos\/[^"]+\/Paginas\/\d{4}\/(\d{6})-[^"]+\.aspx)"/g)].filter((m) => dias.includes(m[2])).map((m) => m[1]))];
  for (const p of paginas) {
    const id = `moncloa-${path.basename(p, '.aspx')}`;
    if (vistos[id]) continue;
    const pag = await (await traer(`https://www.lamoncloa.gob.es${p}`)).text();
    const hls = pag.match(/https?:\/\/smultimedia\.lamoncloa\.gob\.es\/[^"' ]+?playlist\.m3u8/)?.[0] || (pag.match(/smultimedia\.lamoncloa\.gob\.es\/[^"' ]+?playlist\.m3u8/) ? `https://${pag.match(/smultimedia\.lamoncloa\.gob\.es\/[^"' ]+?playlist\.m3u8/)[0]}` : null);
    if (!hls) continue;
    const titulo = (pag.match(/<title>\s*([^<]+?)\s*<\/title>/) || [])[1] || p;
    // Sin métricas de viralidad: puntuación base para que compita con los reels; la relevancia la decide la rutina
    candidatos.push({id, fuente: 'moncloa', cuenta: 'La Moncloa', espacio: 'gobierno', fecha: new Date(ahora).toISOString(), viral: 50,
      enlace: `https://www.lamoncloa.gob.es${p}`, texto: titulo, descarga: hls, credito: 'Vídeo: La Moncloa'});
  }
} catch (e) { console.log(`La Moncloa: ${String(e.message).slice(0, 80)}`); }

// --- Buzón de enlaces (estado/buzon-al-minuto.md): enlaces de Instagram de cuentas profesionales o de La Moncloa ---
const buzonF = path.join(RAIZ, 'estado', 'buzon-al-minuto.md');
if (fs.existsSync(buzonF)) for (const u of fs.readFileSync(buzonF, 'utf8').match(/https?:\/\/\S+/g) || []) {
  const ig = codigo(u) && porCodigo[codigo(u)];
  if (ig) { if (!vistos[ig.id]) candidatos.push({...ig, viral: 1e6, prioridad: 'buzón'}); continue; }
  const id = `buzon-${Buffer.from(u).toString('base64url').slice(-16)}`;
  if (vistos[id]) continue;
  // Solo se pueden descargar reels de las cuentas de cuentas.json (API oficial) y vídeos de La Moncloa
  candidatos.push({id, fuente: 'buzon', enlace: u, viral: 1e6, prioridad: 'buzón', texto: /instagram.com/.test(u) ? 'Reel de una cuenta que no está en cuentas.json (o no es profesional): añádela allí' : 'Fuente no admitida para descarga automática', credito: ''});
}

// --- Los N mejores: descarga ---
candidatos.sort((a, b) => b.viral - a.viral);
const elegidos = [];
for (const c of candidatos) {
  if (elegidos.length >= N) break;
  const f = path.join(salida, `${c.id}.mp4`);
  let r;
  try {
  if (c.fuente === 'instagram') {
    const res = await traer(c.descarga);
    if (!res.ok) { console.log(`${c.id}: descarga HTTP ${res.status}`); continue; }
    fs.writeFileSync(f, Buffer.from(await res.arrayBuffer()));
  } else if (c.fuente === 'moncloa') {
    // Primeros 10 min como máximo, en la mejor variante de hasta 1080p
    const maestra = await (await traer(c.descarga)).text();
    const variantes = [...maestra.matchAll(/#EXT-X-STREAM-INF:[^\n]*?BANDWIDTH=(\d+)[^\n]*?(?:RESOLUTION=\d+x(\d+))?[^\n]*\n([^\n#]+)/g)]
      .map((m) => ({bw: +m[1], alto: +(m[2] || 0), url: new URL(m[3].trim(), c.descarga).href})).filter((v) => v.alto <= 1080).sort((a, b) => b.bw - a.bw);
    r = spawnSync('ffmpeg', ['-y', '-v', 'error', '-rw_timeout', '20000000', '-i', variantes[0]?.url || c.descarga, '-t', '600', '-c', 'copy', f], {encoding: 'utf8', timeout: 300000});
    if (r.status !== 0) { console.log(`${c.id}: ffmpeg no pudo bajar el vídeo`); continue; }
  } else {
    // Buzón: no se descarga aquí; la rutina decide si la fuente se puede usar (se avisa en el informe)
    elegidos.push({...c, archivo: null});
    continue;
  }
  } catch (e) { console.log(`${c.id}: no se pudo descargar (${String(e.message).slice(0, 60)})`); continue; }
  const d = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], {encoding: 'utf8'});
  c.duracion = +Number(d.stdout.trim() || 0).toFixed(1);
  delete c.descarga; // las URL de descarga de Meta llevan firma: no se guardan en el repositorio
  elegidos.push({...c, archivo: path.basename(f)});
}
for (const c of elegidos) delete c.descarga;
fs.writeFileSync(path.join(salida, 'candidatos.json'), JSON.stringify({generado: new Date(ahora).toISOString(), total_detectados: candidatos.length, candidatos: elegidos}, null, 2));
console.log(`Radar: ${candidatos.length} vídeos nuevos detectados · ${elegidos.length} elegidos para transcribir`);
for (const c of elegidos) console.log(`  ${c.viral}\t${c.cuenta || c.fuente}\t${c.duracion ?? '-'} s\t${(c.texto || '').slice(0, 70).replace(/\n/g, ' ')}`);
