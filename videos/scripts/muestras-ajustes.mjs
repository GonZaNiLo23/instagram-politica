// Uso: node videos/scripts/muestras-ajustes.mjs
// Genera la misma frase con la voz de videos/.env y distintos ajustes (estabilidad, estilo, velocidad)
// para elegir de oído: videos/muestras/ajustes-<letra>.mp3
import fs from 'node:fs';
import path from 'node:path';
import {cargarEnv, RAIZ_VIDEOS} from './herramientas.mjs';

cargarEnv();
const key = process.env.ELEVENLABS_API_KEY;
const voz = process.env.ELEVENLABS_VOICE_ID;
const modelo = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2';
if (!key || !voz) { console.error('Falta ELEVENLABS_API_KEY o ELEVENLABS_VOICE_ID en videos/.env'); process.exit(2); }

const texto = '¿Cómo acaba una convocatoria de TikTok con ciento veintiocho detenidos en Barcelona? Sábado, cuatro de la tarde: los Mossos ya vigilan la plaza de Cataluña. Hacia las seis empiezan los incidentes. Contenedores ardiendo, barricadas… y tiendas saqueadas.';
const variantes = {
  a: null, // lo de ahora: ajustes por defecto de la voz
  b: {stability: 0.35, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true},
  c: {stability: 0.3, similarity_boost: 0.75, style: 0.5, use_speaker_boost: true},
  d: {stability: 0.4, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true, speed: 0.92},
};

const dir = path.join(RAIZ_VIDEOS, 'muestras');
fs.mkdirSync(dir, {recursive: true});
for (const [letra, ajustes] of Object.entries(variantes)) {
  const body = {text: texto, model_id: modelo, ...(ajustes ? {voice_settings: ajustes} : {})};
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voz}?output_format=mp3_44100_128`, {
    method: 'POST', headers: {'xi-api-key': key, 'Content-Type': 'application/json'}, body: JSON.stringify(body),
  });
  if (!r.ok) { console.log(`--  ${letra}: ElevenLabs ${r.status} ${(await r.text()).slice(0, 200)}`); continue; }
  const f = path.join(dir, `ajustes-${letra}.mp3`);
  fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
  console.log(`OK  ${f} · ${ajustes ? JSON.stringify(ajustes) : 'por defecto'}`);
}
