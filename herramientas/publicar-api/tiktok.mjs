// TikTok por la Content Posting API (app "Occidente Publicador", modo Sandbox): sube un vídeo a la BANDEJA DE BORRADORES
// de la cuenta; la persona usuaria lo publica desde la app (descripción y botón final). Nunca publica directamente.
// Uso:
//   node herramientas/publicar-api/tiktok.mjs autorizar             → imprime el enlace para autorizar la app con tu TikTok
//   node herramientas/publicar-api/tiktok.mjs codigo <code>         → canjea el "code" de la URL de vuelta y guarda el token en .env
//   node herramientas/publicar-api/tiktok.mjs borrador <video.mp4>  → sube el vídeo a la bandeja de borradores
// Variables (herramientas/publicar-api/.env o secretos de GitHub): TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_REFRESH_TOKEN.
// El token de acceso dura 24 h: cada subida pide uno nuevo con el refresh token (válido 365 días; renovar antes de que caduque).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const envF = path.join(aqui, '.env');
if (fs.existsSync(envF)) {
  for (const l of fs.readFileSync(envF, 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const E = process.env;
const VUELTA = 'https://github.com/GonZaNiLo23';
const API = 'https://open.tiktokapis.com/v2';
const [modo, arg] = process.argv.slice(2);
const falta = (...ks) => { const f = ks.filter((k) => !E[k]); if (f.length) { console.error(`Faltan en .env: ${f.join(', ')}`); process.exit(2); } };

function guardarEnv(k, v) {
  let t = fs.existsSync(envF) ? fs.readFileSync(envF, 'utf8') : '';
  t = new RegExp(`^${k}=`, 'm').test(t) ? t.replace(new RegExp(`^${k}=.*$`, 'm'), `${k}=${v}`) : `${t.replace(/\n?$/, '\n')}${k}=${v}\n`;
  fs.writeFileSync(envF, t);
}

async function token(params) {
  const r = await fetch(`${API}/oauth/token/`, {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({client_key: E.TIKTOK_CLIENT_KEY, client_secret: E.TIKTOK_CLIENT_SECRET, ...params})});
  const j = await r.json();
  if (!j.access_token) throw new Error(`TikTok no dio token: ${j.error_description || j.error || JSON.stringify(j).slice(0, 200)}`);
  return j;
}

if (modo === 'autorizar') {
  falta('TIKTOK_CLIENT_KEY');
  const u = new URL('https://www.tiktok.com/v2/auth/authorize/');
  u.search = new URLSearchParams({client_key: E.TIKTOK_CLIENT_KEY, scope: 'user.info.basic,video.upload', response_type: 'code', redirect_uri: VUELTA, state: 'occidente'});
  console.log(`Abre este enlace, autoriza con la cuenta de TikTok y copia el valor "code" de la dirección a la que vuelve (${VUELTA}?code=…):\n${u}`);
} else if (modo === 'codigo') {
  falta('TIKTOK_CLIENT_KEY', 'TIKTOK_CLIENT_SECRET');
  if (!arg) { console.error('Uso: tiktok.mjs codigo <code>'); process.exit(1); }
  const j = await token({code: decodeURIComponent(arg), grant_type: 'authorization_code', redirect_uri: VUELTA});
  guardarEnv('TIKTOK_REFRESH_TOKEN', j.refresh_token);
  console.log(`Autorizado (open_id …${String(j.open_id).slice(-6)}; permisos: ${j.scope}). Refresh token guardado en .env, válido ${Math.round(j.refresh_expires_in / 86400)} días.`);
} else if (modo === 'borrador') {
  falta('TIKTOK_CLIENT_KEY', 'TIKTOK_CLIENT_SECRET', 'TIKTOK_REFRESH_TOKEN');
  if (!arg || !fs.existsSync(arg)) { console.error('Uso: tiktok.mjs borrador <video.mp4>'); process.exit(1); }
  const {access_token} = await token({grant_type: 'refresh_token', refresh_token: E.TIKTOK_REFRESH_TOKEN});
  const datos = fs.readFileSync(arg);
  // Un solo trozo hasta 64 MB (límite de la API por trozo); los vídeos de la cuenta pesan < 30 MB
  if (datos.length > 64 * 1024 * 1024) throw new Error('Vídeo de más de 64 MB: hay que trocearlo');
  const ini = await (await fetch(`${API}/post/publish/inbox/video/init/`, {method: 'POST',
    headers: {Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json; charset=UTF-8'},
    body: JSON.stringify({source_info: {source: 'FILE_UPLOAD', video_size: datos.length, chunk_size: datos.length, total_chunk_count: 1}})})).json();
  if (ini.error?.code !== 'ok') throw new Error(`init: ${ini.error?.message || JSON.stringify(ini).slice(0, 200)}`);
  const r = await fetch(ini.data.upload_url, {method: 'PUT', body: datos,
    headers: {'Content-Type': 'video/mp4', 'Content-Range': `bytes 0-${datos.length - 1}/${datos.length}`}});
  if (!r.ok) throw new Error(`subida: HTTP ${r.status}`);
  console.log(`BORRADOR TikTok ${ini.data.publish_id}: ${path.basename(arg)} en la bandeja (notificación en la app; publícalo desde allí)`);
} else {
  console.error('Uso: tiktok.mjs autorizar | codigo <code> | borrador <video.mp4>');
  process.exit(1);
}
