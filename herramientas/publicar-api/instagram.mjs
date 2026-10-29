// Publica en Instagram por la API oficial de Meta (Content Publishing API), sin navegador.
// Uso:
//   node herramientas/publicar-api/instagram.mjs historia <imagen.png|video.mp4> [más archivos…]   → una historia por archivo, en orden
//   node herramientas/publicar-api/instagram.mjs reel <video.mp4> --texto=<archivo.txt> [--portada-ms=<ms del fotograma de portada>]
//   Añade --prueba para subir los archivos y crear los contenedores sin publicar.
// Flujo (sin alojamiento externo, 0 €): crea el contenedor con upload_type=resumable → sube el vídeo directamente a
// rupload.facebook.com → espera a que esté listo → publica → comprueba el enlace.
// Las imágenes (historias) se convierten antes en un vídeo de 5 s con ffmpeg: la subida directa solo admite vídeo.
// Variables (en herramientas/publicar-api/.env o en los secretos de la nube; nunca en el repositorio):
//   IG_USER_ID, IG_ACCESS_TOKEN, [GRAPH_VERSION=v23.0], [FFMPEG=ruta a ffmpeg]
//   IG_ACCESS_TOKEN es el token de la página de Facebook vinculada (no caduca). App de Meta: Occidente Publicador.
// Autorización: solo se ejecuta por encargo del coordinador con la aprobación correspondiente (CLAUDE.md, Convenciones).
import './ocultar.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import os from 'node:os';
import {spawnSync} from 'node:child_process';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const envF = path.join(aqui, '.env');
if (fs.existsSync(envF)) {
  for (const l of fs.readFileSync(envF, 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const E = process.env;
const faltan = ['IG_USER_ID', 'IG_ACCESS_TOKEN'].filter((k) => !E[k]);
if (faltan.length) { console.error(`Faltan variables: ${faltan.join(', ')}`); process.exit(2); }

const [modo, ...resto] = process.argv.slice(2);
const opc = Object.fromEntries(resto.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const archivos = resto.filter((a) => !a.startsWith('--'));
const prueba = 'prueba' in opc;
if (!['historia', 'reel'].includes(modo) || !archivos.length) { console.error('Uso: instagram.mjs historia|reel <archivos…> [--texto=…] [--portada-ms=…] [--prueba]'); process.exit(1); }

const GRAPH = `https://graph.facebook.com/${E.GRAPH_VERSION || 'v23.0'}`;
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const tipo = (f) => ({'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.mp4': 'video/mp4'})[path.extname(f).toLowerCase()];

// Imagen → vídeo vertical de 5 s (historias): la subida reanudable solo acepta vídeo
function aVideo(f) {
  if (tipo(f) === 'video/mp4') return f;
  const out = path.join(os.tmpdir(), `${path.basename(f, path.extname(f))}-${Date.now()}.mp4`);
  const r = spawnSync(E.FFMPEG || 'ffmpeg', ['-y', '-loop', '1', '-i', f, '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-t', '5',
    '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,format=yuv420p',
    '-c:v', 'libx264', '-r', '30', '-c:a', 'aac', '-shortest', out], {stdio: 'ignore'});
  if (r.status !== 0) throw new Error(`ffmpeg no pudo convertir ${f} en vídeo`);
  return out;
}

// Crea el contenedor reanudable y sube el vídeo directamente a Meta
async function contenedor(f, params) {
  const datos = fs.readFileSync(aVideo(f));
  const {id} = await graph(`${E.IG_USER_ID}/media`, {...params, upload_type: 'resumable'});
  // Sin versión en la ruta. Recién creado, el contenedor a veces responde ProcessingFailedError: se espera y se reintenta (2026-10-28)
  let j = {};
  for (let i = 0; i < 4; i++) {
    await espera(5000);
    const r = await fetch(`https://rupload.facebook.com/ig-api-upload/${id}`, {
      method: 'POST', body: datos,
      headers: {Authorization: `OAuth ${E.IG_ACCESS_TOKEN}`, offset: '0', file_size: String(datos.length)},
    });
    j = await r.json().catch(() => ({}));
    if (r.ok && j.success !== false) return id;
  }
  throw new Error(`Subida de ${path.basename(f)} fallida: ${JSON.stringify(j).slice(0, 200)}`);
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
    const id = await contenedor(f, {media_type: 'STORIES'});
    console.log(`Historia ${path.basename(f)} → contenedor ${id}`);
    await publicar(id);
  }
} else {
  const texto = opc.texto ? fs.readFileSync(opc.texto, 'utf8').trim() : '';
  if ([...texto].length > 2200) { console.error(`El texto tiene ${[...texto].length} caracteres (máx. 2.200)`); process.exit(1); }
  const params = {media_type: 'REELS', caption: texto, share_to_feed: 'true'};
  if (opc['portada-ms']) params.thumb_offset = opc['portada-ms'];
  const id = await contenedor(archivos[0], params);
  console.log(`Reel ${path.basename(archivos[0])} → contenedor ${id}`);
  await publicar(id);
}
