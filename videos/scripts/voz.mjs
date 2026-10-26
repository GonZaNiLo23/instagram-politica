// Uso: node videos/scripts/voz.mjs NNN-slug [--voz]
// Genera piezas/NNN-slug/voz.mp3 + tiempos.json (palabras con inicio/fin en segundos).
//  - Con ELEVENLABS_API_KEY y ELEVENLABS_VOICE_ID en videos/.env: voz de ElevenLabs con marcas de tiempo (prioridad).
//  - Si no, con AZURE_SPEECH_KEY y AZURE_SPEECH_REGION: voz neuronal de Azure (azure.mjs).
//  - Sin clave: voz PROVISIONAL (voz del sistema de Windows si hay voz en español; si no, silencio),
//    con tiempos estimados a 150 palabras/min y "provisional": true. Nunca publicar con ella.
// El texto sale de piezas/NNN-slug/voz.txt (editable) o, si no existe, del bloque "Texto de voz limpio" del guion aprobado.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {cargarEnv, RAIZ, rutaPieza, ejecutar, FFMPEG, duracionAudio} from './herramientas.mjs';
import {hayAzure, sintetizarAzure} from './azure.mjs';

cargarEnv();
const id = process.argv[2];
const regenerar = process.argv.includes('--voz');
if (!id) { console.error('Uso: node videos/scripts/voz.mjs NNN-slug [--voz]'); process.exit(1); }

const dir = rutaPieza(id);
fs.mkdirSync(dir, {recursive: true});
const mp3 = path.join(dir, 'voz.mp3');
const tiemposPath = path.join(dir, 'tiempos.json');
if (fs.existsSync(tiemposPath) && fs.existsSync(mp3) && !regenerar) {
  console.log(`Ya existe la voz de ${id}. Usa --voz para regenerarla.`);
  process.exit(0);
}

// 1. Texto
const txtPath = path.join(dir, 'voz.txt');
let texto;
if (fs.existsSync(txtPath)) {
  texto = fs.readFileSync(txtPath, 'utf8').trim();
} else {
  const guion = path.join(RAIZ, 'guiones', 'aprobados', `${id}.md`);
  if (!fs.existsSync(guion)) { console.error(`No encuentro el guion aprobado: ${guion}`); process.exit(1); }
  const md = fs.readFileSync(guion, 'utf8');
  const m = md.match(/## Texto de voz limpio\s*\n([\s\S]*?)(?=\n## |$)/);
  if (!m) { console.error("El guion no tiene el bloque '## Texto de voz limpio'."); process.exit(1); }
  texto = m[1].split('\n').filter((l) => !l.startsWith('(') && !l.startsWith('Recuento por frase') && !l.startsWith('>')).join('\n').trim();
  fs.writeFileSync(txtPath, texto + '\n');
  console.log(`Texto extraído del guion a ${txtPath} (puedes editarlo y volver a ejecutar con --voz).`);
}

// 2a. Voz real (ElevenLabs): tiene prioridad si hay clave y voz
if (process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}/with-timestamps?output_format=mp3_44100_192`;
  const modelo = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2';
  // v3/v4: estabilidad 0.5 = modo "Natural", sin exagerar el estilo. Modelos antiguos: ajustes clásicos.
  const ajustes = /^eleven_v[34]/.test(modelo)
    ? {stability: 0.5, similarity_boost: 0.75, style: 0, speed: 1.0}
    : {stability: 0.45, similarity_boost: 0.8, style: 0.25, speed: 1.0};
  const r = await fetch(url, {
    method: 'POST',
    headers: {'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json'},
    body: JSON.stringify({text: texto, model_id: modelo, voice_settings: ajustes}),
  });
  if (!r.ok) { console.error(`ElevenLabs respondió ${r.status}: ${(await r.text()).slice(0, 200)}`); process.exit(2); }
  const j = await r.json();
  fs.writeFileSync(mp3, Buffer.from(j.audio_base64, 'base64'));
  // caracteres -> palabras
  const a = j.alignment || j.normalized_alignment;
  const palabras = [];
  let cur = null;
  a.characters.forEach((ch, i) => {
    if (/\s/.test(ch)) { if (cur) { palabras.push(cur); cur = null; } return; }
    if (!cur) cur = {t: '', inicio: a.character_start_times_seconds[i], fin: 0};
    cur.t += ch;
    cur.fin = a.character_end_times_seconds[i];
  });
  if (cur) palabras.push(cur);
  const duracion = duracionAudio(mp3);
  fs.writeFileSync(tiemposPath, JSON.stringify({palabras, duracion, provisional: false, motor: 'elevenlabs', voz: process.env.ELEVENLABS_VOICE_ID}, null, 2) + '\n');
  console.log(`Voz ElevenLabs: ${palabras.length} palabras, ${duracion.toFixed(1)} s -> ${mp3}`);
  process.exit(0);
}

// 2b. Voz real (Azure)
if (hayAzure()) {
  const {palabras, voz} = await sintetizarAzure(texto, mp3);
  const duracion = palabras.length ? palabras[palabras.length - 1].fin : 0;
  fs.writeFileSync(tiemposPath, JSON.stringify({palabras, duracion, provisional: false, motor: 'azure', voz}, null, 2) + '\n');
  console.log(`Voz Azure (${voz}): ${palabras.length} palabras, ${duracion.toFixed(1)} s -> ${mp3}`);
  process.exit(0);
}

// 3. Sin clave: voz PROVISIONAL. Nunca sobrescribe una voz ya generada (provisional o Azure).
if (fs.existsSync(mp3)) {
  console.error(`No hay clave de Azure y ya existe ${mp3}: no la sobrescribo. Para regenerarla con Azure, pon la clave en videos/.env.`);
  process.exit(2);
}
const palabras = texto.split(/\s+/).filter(Boolean);
const porPalabra = 60 / 150;
const tiempos = palabras.map((t, i) => ({t, inicio: +(0.1 + i * porPalabra).toFixed(3), fin: +(0.1 + (i + 1) * porPalabra).toFixed(3)}));
const duracion = tiempos.length ? tiempos[tiempos.length - 1].fin : 0;

let audioOk = false;
if (process.platform === 'win32') {
  const wav = path.join(dir, '_provisional.wav');
  const r = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(RAIZ, 'videos', 'scripts', 'sapi.ps1'), '-TextoFile', txtPath, '-Salida', wav], {encoding: 'utf8'});
  if (r.status === 0 && !(r.stdout || '').includes('SIN_VOZ_ES') && fs.existsSync(wav)) {
    ejecutar(FFMPEG, ['-y', '-v', 'error', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '192k', mp3]);
    fs.unlinkSync(wav);
    audioOk = true;
  }
}
if (!audioOk) {
  ejecutar(FFMPEG, ['-y', '-v', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=mono', '-t', String(duracion.toFixed(3)), '-codec:a', 'libmp3lame', '-b:a', '192k', mp3]);
  console.warn('No hay voz en español del sistema: el audio provisional es silencio.');
}
fs.writeFileSync(tiemposPath, JSON.stringify({palabras: tiempos, duracion, provisional: true, motor: 'provisional'}, null, 2) + '\n');
console.log(`Voz PROVISIONAL: ${palabras.length} palabras, ${duracion.toFixed(1)} s estimados. Nunca publicar con esta voz.`);
