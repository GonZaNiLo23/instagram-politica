// Transcribe un vídeo o audio con tiempos por palabra usando whisper.cpp en local (gratis, sin clave).
// Uso: node videos/scripts/transcribir.mjs <origen.mp4|.mp3> [--salida=ruta/sin-extension] [--modelo=small]
// Deja <salida>.txt (frases con tiempos) y <salida>.json (tiempos por palabra). Por defecto, junto al origen.
// Requiere whisper.cpp en %USERPROFILE%\whisper (bin\Release\whisper-cli.exe + ggml-<modelo>.bin) o WHISPER_DIR.
// En la nube no está instalado: allí hace falta otra vía (p. ej. ElevenLabs speech-to-text con permiso en la clave).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {FFMPEG, ejecutar} from './herramientas.mjs';

const [origen, ...resto] = process.argv.slice(2);
const arg = (k, d) => (resto.find((a) => a.startsWith(`--${k}=`)) || '').split('=').slice(1).join('=') || d;
if (!origen || !fs.existsSync(origen)) { console.error('Uso: node videos/scripts/transcribir.mjs <origen> [--salida=…] [--modelo=small]'); process.exit(1); }
const dirW = process.env.WHISPER_DIR || path.join(os.homedir(), 'whisper');
const cli = path.join(dirW, 'bin', 'Release', 'whisper-cli.exe');
const modelo = path.join(dirW, `ggml-${arg('modelo', 'small')}.bin`);
if (!fs.existsSync(cli) || !fs.existsSync(modelo)) { console.error(`No encuentro whisper.cpp en ${dirW}`); process.exit(1); }
const salida = arg('salida', origen.replace(/\.[^.]+$/, '') + '-transcripcion');

// whisper.cpp solo lee WAV 16 kHz mono
const wav = path.join(os.tmpdir(), `transcribir-${process.pid}.wav`);
let r = ejecutar(FFMPEG, ['-y', '-v', 'error', '-i', origen, '-ar', '16000', '-ac', '1', wav]);
if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
// Dos pasadas: frases (lectura cómoda) y palabra a palabra (tiempos para cortes y citas)
r = ejecutar(cli, ['-m', modelo, '-l', 'es', '-t', String(Math.max(2, os.cpus().length - 1)), '-f', wav, '-np', '-otxt', '-of', salida + '-frases']);
const frases = r.stdout.split('\n').filter((l) => l.startsWith('['));
r = ejecutar(cli, ['-m', modelo, '-l', 'es', '-t', String(Math.max(2, os.cpus().length - 1)), '-f', wav, '-np', '-ml', '1', '-sow', '-ojf', '-of', salida]);
fs.rmSync(wav, {force: true});
fs.rmSync(salida + '-frases.txt', {force: true});
if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
fs.writeFileSync(salida + '.txt', frases.join('\n') + '\n');
console.log(`Transcripción: ${salida}.txt (${frases.length} frases) y ${salida}.json (por palabra). Revisa nombres propios: Whisper se equivoca a veces.`);
