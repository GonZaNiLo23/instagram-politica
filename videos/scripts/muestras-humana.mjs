// Uso: node videos/scripts/muestras-humana.mjs
// Segunda ronda de muestras para que la voz suene más a persona: texto escrito para hablar, ajustes "c" algo más lentos,
// el modelo v3 con etiquetas de emoción y otras voces conversacionales de España. Salida: videos/muestras/humana-*.mp3
import fs from 'node:fs';
import path from 'node:path';
import {cargarEnv, RAIZ_VIDEOS} from './herramientas.mjs';

cargarEnv();
const key = process.env.ELEVENLABS_API_KEY;
const dani = process.env.ELEVENLABS_VOICE_ID;
const H = {'xi-api-key': key, 'Content-Type': 'application/json'};
const dir = path.join(RAIZ_VIDEOS, 'muestras');
fs.mkdirSync(dir, {recursive: true});

// Mismo contenido que la 024, escrito para el oído: frases de largo variado, pausas marcadas y una muletilla de conversación
const hablado = '¿Cómo acaba una convocatoria de TikTok… con ciento veintiocho detenidos en Barcelona? Te lo cuento. Sábado, cuatro de la tarde. Los Mossos ya están vigilando la plaza de Cataluña. Y hacia las seis, empiezan los incidentes: contenedores ardiendo, barricadas… y tiendas saqueadas.';
const conEtiquetas = '[curioso] ¿Cómo acaba una convocatoria de TikTok… con ciento veintiocho detenidos en Barcelona? [tono cercano] Te lo cuento. Sábado, cuatro de la tarde. Los Mossos ya están vigilando la plaza de Cataluña. [serio] Y hacia las seis, empiezan los incidentes: contenedores ardiendo, barricadas… y tiendas saqueadas.';
const c = {stability: 0.3, similarity_boost: 0.75, style: 0.5, use_speaker_boost: true};

async function tts(voz, modelo, texto, ajustes, nombre) {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voz}?output_format=mp3_44100_128`, {
    method: 'POST', headers: H, body: JSON.stringify({text: texto, model_id: modelo, ...(ajustes ? {voice_settings: ajustes} : {})}),
  });
  if (!r.ok) return console.log(`--  ${nombre}: ${r.status} ${(await r.text()).slice(0, 160)}`);
  fs.writeFileSync(path.join(dir, `${nombre}.mp3`), Buffer.from(await r.arrayBuffer()));
  console.log(`OK  ${nombre}.mp3 · ${modelo} · ${ajustes ? JSON.stringify(ajustes) : 'por defecto'}`);
}

await tts(dani, 'eleven_v4', hablado, c, 'humana-1-dani-texto-hablado');
await tts(dani, 'eleven_v4', hablado, {...c, speed: 0.94}, 'humana-2-dani-texto-hablado-lento');
await tts(dani, 'eleven_v3', conEtiquetas, {stability: 0.5}, 'humana-3-dani-v3-emociones');

// Otras voces de la biblioteca: masculinas, España, pensadas para conversación o redes
const q = new URLSearchParams({language: 'es', gender: 'male', use_cases: 'conversational', sort: 'usage_character_count_1y', page_size: '40'});
const r = await fetch(`https://api.elevenlabs.io/v1/shared-voices?${q}`, {headers: H});
if (!r.ok) { console.log(`--  biblioteca: ${r.status} ${(await r.text()).slice(0, 160)}`); process.exit(0); }
const {voices = []} = await r.json();
const espana = voices.filter((v) => v.voice_id !== dani && /spain|peninsular|castilian|españa/i.test(`${v.accent} ${v.locale} ${v.description}`)).slice(0, 3);
for (const v of espana) {
  const add = await fetch(`https://api.elevenlabs.io/v1/voices/add/${v.public_owner_id}/${v.voice_id}`, {method: 'POST', headers: H, body: JSON.stringify({new_name: v.name})});
  const id = add.ok ? (await add.json()).voice_id : v.voice_id;
  const nombre = `humana-voz-${v.name.replace(/[^\p{L}\p{N}]+/gu, '-').slice(0, 25)}`;
  await tts(id, 'eleven_v4', hablado, c, nombre);
  console.log(`    voice_id=${id} · ${v.accent || '?'} · ${(v.description || '').slice(0, 80)}`);
}
