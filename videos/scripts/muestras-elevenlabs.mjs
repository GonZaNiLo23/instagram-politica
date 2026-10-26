// Uso: node videos/scripts/muestras-elevenlabs.mjs [N=4]
// Busca en la Biblioteca de voces de ElevenLabs voces masculinas jóvenes en español de España,
// ordenadas por uso, las añade a "Mis voces" y genera la misma frase con cada una: videos/muestras/el-<nombre>.mp3
import fs from 'node:fs';
import path from 'node:path';
import {cargarEnv, RAIZ_VIDEOS} from './herramientas.mjs';

cargarEnv();
const key = process.env.ELEVENLABS_API_KEY;
if (!key) { console.error('Falta ELEVENLABS_API_KEY en videos/.env'); process.exit(2); }
const N = +(process.argv[2] || 4);
const H = {'xi-api-key': key, 'Content-Type': 'application/json'};
const texto = 'El sábado, más de medio millón de personas salieron a la calle en Francia. Protestaban contra la vida cara. Pero la jornada acabó con saqueos, incendios y casi dos mil cuatrocientos detenidos. ¿Cómo se ha llegado hasta aquí? Vamos por partes.';

const q = new URLSearchParams({language: 'es', gender: 'male', age: 'young', sort: 'usage_character_count_1y', page_size: '30'});
const r = await fetch(`https://api.elevenlabs.io/v1/shared-voices?${q}`, {headers: H});
if (!r.ok) { console.error(`ElevenLabs respondió ${r.status}: ${(await r.text()).slice(0, 200)}`); process.exit(2); }
const {voices = []} = await r.json();
// Preferimos acento de España
const espana = voices.filter((v) => /spain|peninsular|castilian|european|españa/i.test(`${v.accent} ${v.locale} ${v.description}`));
const elegidas = (espana.length >= N ? espana : voices).slice(0, N);

const dir = path.join(RAIZ_VIDEOS, 'muestras');
fs.mkdirSync(dir, {recursive: true});
for (const v of elegidas) {
  const nombre = v.name.replace(/[^\p{L}\p{N}]+/gu, '-').slice(0, 30);
  try {
    const add = await fetch(`https://api.elevenlabs.io/v1/voices/add/${v.public_owner_id}/${v.voice_id}`, {method: 'POST', headers: H, body: JSON.stringify({new_name: v.name})});
    const idPropio = add.ok ? (await add.json()).voice_id : v.voice_id;
    const tts = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${idPropio}?output_format=mp3_44100_128`, {
      method: 'POST', headers: H,
      body: JSON.stringify({text: texto, model_id: 'eleven_multilingual_v2', voice_settings: {stability: 0.45, similarity_boost: 0.8, style: 0.25}}),
    });
    if (!tts.ok) throw new Error(`TTS ${tts.status}`);
    fs.writeFileSync(path.join(dir, `el-${nombre}.mp3`), Buffer.from(await tts.arrayBuffer()));
    console.log(`OK  el-${nombre}.mp3 · voice_id=${idPropio} · acento: ${v.accent || '?'} · uso: ${v.usage_character_count_1y ?? '?'}`);
  } catch (e) {
    console.log(`--  ${v.name}: ${e.message}`);
  }
}
