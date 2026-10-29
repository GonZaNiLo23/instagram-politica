// Métricas de Instagram por la API oficial (sustituye a Chrome + Metricool en la recogida diaria). Solo lectura.
// Uso: node herramientas/publicar-api/metricas.mjs [AAAA-MM-DD]
// Escribe publicado/metricas-api/AAAA-MM-DD.json: seguidores de la cuenta y, por publicación, sus métricas.
// Una métrica que la API no da para ese tipo de publicación queda en null (nunca se estima).
// Variables: IG_USER_ID, IG_ACCESS_TOKEN (herramientas/publicar-api/.env o secretos de GitHub).
import './ocultar.mjs';
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
if (!E.IG_USER_ID || !E.IG_ACCESS_TOKEN) { console.error('Faltan IG_USER_ID o IG_ACCESS_TOKEN'); process.exit(2); }
const GRAPH = `https://graph.facebook.com/${E.GRAPH_VERSION || 'v23.0'}`;
const fecha = process.argv[2] || new Date().toISOString().slice(0, 10);

async function get(ruta, params = {}) {
  const r = await fetch(`${GRAPH}/${ruta}?${new URLSearchParams({...params, access_token: E.IG_ACCESS_TOKEN})}`);
  const j = await r.json();
  if (j.error) throw new Error(j.error.message);
  return j;
}

// Cada métrica por separado: si una no existe para ese tipo de publicación, las demás siguen
const METRICAS = ['views', 'reach', 'saved', 'shares', 'likes', 'comments', 'total_interactions', 'follows', 'profile_visits', 'ig_reels_avg_watch_time', 'ig_reels_video_view_total_time'];
async function insights(id) {
  const out = {};
  for (const m of METRICAS) {
    try {
      const {data} = await get(`${id}/insights`, {metric: m});
      out[m] = data?.[0]?.values?.[0]?.value ?? data?.[0]?.total_value?.value ?? null;
    } catch { out[m] = null; }
  }
  return out;
}

const cuenta = await get(E.IG_USER_ID, {fields: 'username,followers_count,follows_count,media_count'});
const publicaciones = [];
let pagina = await get(`${E.IG_USER_ID}/media`, {fields: 'id,caption,media_product_type,media_type,timestamp,permalink,like_count,comments_count', limit: '50'});
while (pagina) {
  for (const p of pagina.data) {
    publicaciones.push({
      id: p.id, tipo: p.media_product_type, publicado: p.timestamp, enlace: p.permalink,
      texto: (p.caption || '').split('\n')[0].slice(0, 80),
      edad_h: Math.round((Date.now() - Date.parse(p.timestamp)) / 36e5),
      ...(await insights(p.id)),
    });
  }
  pagina = pagina.paging?.next ? await (await fetch(pagina.paging.next)).json() : null;
}

const dir = path.join(aqui, '..', '..', 'publicado', 'metricas-api');
fs.mkdirSync(dir, {recursive: true});
const f = path.join(dir, `${fecha}.json`);
fs.writeFileSync(f, JSON.stringify({leido: new Date().toISOString(), cuenta, publicaciones}, null, 2) + '\n');
console.log(`@${cuenta.username}: ${cuenta.followers_count} seguidores · ${publicaciones.length} publicaciones → ${path.relative(process.cwd(), f)}`);
