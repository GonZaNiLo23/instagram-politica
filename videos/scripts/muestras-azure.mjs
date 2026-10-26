// Uso: node videos/scripts/muestras-azure.mjs [NNN-slug]
// Genera la misma frase con varias voces masculinas de Azure para comparar: videos/muestras/<voz>.mp3
import fs from 'node:fs';
import path from 'node:path';
import {cargarEnv, RAIZ_VIDEOS, rutaPieza} from './herramientas.mjs';
import {hayAzure, sintetizarAzure} from './azure.mjs';

cargarEnv();
if (!hayAzure()) { console.error('Falta AZURE_SPEECH_KEY / AZURE_SPEECH_REGION en videos/.env'); process.exit(2); }

const VOCES = ['es-ES-AlvaroNeural', 'es-ES-TristanMultilingualNeural', 'es-ES-ArnauNeural', 'es-ES-DarioNeural', 'es-ES-SaulNeural'];
const id = process.argv[2] || '004-disturbios-francia';
const txt = path.join(rutaPieza(id), 'voz.txt');
const texto = fs.existsSync(txt)
  ? fs.readFileSync(txt, 'utf8').trim().split(/(?<=[.?!])\s+/).slice(0, 3).join(' ')
  : 'Ese saqueo francés que te ha llegado es de Los Ángeles. Lo del sábado sí fue real.';

const dir = path.join(RAIZ_VIDEOS, 'muestras');
fs.mkdirSync(dir, {recursive: true});
for (const voz of VOCES) {
  try {
    await sintetizarAzure(texto, path.join(dir, `${voz}.mp3`), {voz});
    console.log(`OK  ${voz}`);
  } catch (e) {
    console.log(`--  ${voz}: ${e.message}`);
  }
}
console.log(`Muestras en ${dir}\nTexto: ${texto}`);
