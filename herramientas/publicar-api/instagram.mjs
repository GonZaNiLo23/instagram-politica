// Publica en Instagram por la API oficial de Meta (Content Publishing API), sin navegador.
// Uso:
//   node herramientas/publicar-api/instagram.mjs historia <imagen.png|video.mp4> [más archivos…]   → una historia por archivo, en orden
//   node herramientas/publicar-api/instagram.mjs reel <video.mp4> --texto=<archivo.txt> [--portada=<imagen.png>]
//   Añade --prueba para subir los archivos y crear los contenedores sin publicar.
// Flujo: sube cada archivo a Cloudflare R2 (URL pública: la API no recibe archivos, los descarga) → crea el contenedor
// en Instagram → espera a que esté listo → publica → comprueba el enlace.
// Variables (en herramientas/publicar-api/.env o en los secretos de la nube; nunca en el repositorio):
//   IG_USER_ID, IG_ACCESS_TOKEN, [GRAPH_VERSION=v23.0]
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL (p. ej. https://pub-xxxx.r2.dev)
// Autorización: solo se ejecuta por encargo del coordinador con la aprobación correspondiente (CLAUDE.md, Convenciones).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const envF = path.join(aqui, '.env');
if (fs.existsSync(envF)) {
  for (const l of fs.readFileSync(envF, 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const E = process.env;
const faltan = ['IG_USER_ID', 'IG_ACCESS_TOKEN', 'R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET', 'R2_PUBLIC_URL'].filter((k) => !E[k]);
if (faltan.length) { console.error(`Faltan variables: ${faltan.join(', ')}`); process.exit(2); }

const [modo, ...resto] = process.argv.slice(2);
const opc = Object.fromEntries(resto.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const archivos = resto.filter((a) => !a.startsWith('--'));
const prueba = 'prueba' in opc;
if (!['historia', 'reel'].includes(modo) || !archivos.length) { console.error('Uso: instagram.mjs historia|reel <archivos…> [--texto=…] [--portada=…] [--prueba]'); process.exit(1); }

const GRAPH = `https://graph.facebook.com/${E.GRAPH_VERSION || 'v23.0'}`;
const r2 = new S3Client({region: 'auto', endpoint: `https://${E.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: {accessKeyId: E.R2_ACCESS_KEY_ID, secretAccessKey: E.R2_SECRET_ACCESS_KEY}});
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const tipo = (f) => ({'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.mp4': 'video/mp4'})[path.extname(f).toLowerCase()];

async function subir(f) {
  const clave = `${new Date().toISOString().slice(0, 10)}/${Date.now()}-${path.basename(f)}`;
  await r2.send(new PutObjectCommand({Bucket: E.R2_BUCKET, Key: clave, Body: fs.readFileSync(f), ContentType: tipo(f)}));
  return `${E.R2_PUBLIC_URL.replace(/\/$/, '')}/${clave}`;
}

async function graph(ruta, params, metodo = 'POST') {
  const url = new URL(`${GRAPH}/${ruta}`);
  const body = new URLSearchParams({...params, access_token: E.IG_ACCESS_TOKEN});
  const r = metodo === 'GET' ? await fetch(`${url}?${body}`) : await fetch(url, {method: 'POST', body});
  const j = await r.json();
  if (j.error) throw new Error(`Graph API: ${j.error.message} (código ${j.error.code}${j.error.error_subcode ? '/' + j.error.error_subcode : ''})`);
  return j;
}

async function esperarListo(id) {
  // Los vídeos tardan en procesarse; las imágenes suelen estar listas al momento
  for (let i = 0; i < 60; i++) {
    const {status_code: s, status} = await graph(id, {fields: 'status_code,status'}, 'GET');
    if (s === 'FINISHED') return;
    if (s === 'ERROR' || s === 'EXPIRED') throw new Error(`El contenedor ${id} falló: ${status}`);
    await espera(5000);
  }
  throw new Error(`El contenedor ${id} no estuvo listo en 5 minutos`);
}

async function publicar(contenedor) {
  await esperarListo(contenedor);
  if (prueba) return console.log(`PRUEBA: contenedor ${contenedor} listo, sin publicar`);
  const {id} = await graph(`${E.IG_USER_ID}/media_publish`, {creation_id: contenedor});
  const {permalink} = await graph(id, {fields: 'permalink'}, 'GET').catch(() => ({}));
  console.log(`PUBLICADO ${id}${permalink ? ' · ' + permalink : ''}`);
}

if (modo === 'historia') {
  for (const f of archivos) {
    const url = await subir(f);
    const esVideo = tipo(f) === 'video/mp4';
    const {id} = await graph(`${E.IG_USER_ID}/media`, {media_type: 'STORIES', [esVideo ? 'video_url' : 'image_url']: url});
    console.log(`Historia ${path.basename(f)} → contenedor ${id}`);
    await publicar(id);
  }
} else {
  const texto = opc.texto ? fs.readFileSync(opc.texto, 'utf8').trim() : '';
  if ([...texto].length > 2200) { console.error(`El texto tiene ${[...texto].length} caracteres (máx. 2.200)`); process.exit(1); }
  const params = {media_type: 'REELS', video_url: await subir(archivos[0]), caption: texto, share_to_feed: 'true'};
  if (opc.portada) params.cover_url = await subir(opc.portada);
  const {id} = await graph(`${E.IG_USER_ID}/media`, params);
  console.log(`Reel ${path.basename(archivos[0])} → contenedor ${id}`);
  await publicar(id);
}
