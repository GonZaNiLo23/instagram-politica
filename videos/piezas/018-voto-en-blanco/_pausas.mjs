// Inserta pausas cortas (sin regenerar la voz) en voz-orig.mp3 / tiempos-orig.json -> voz.mp3 / tiempos.json.
// Uso: node _pausas.mjs   (idempotente: parte siempre de los originales)
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {FFMPEG} from '../../scripts/herramientas.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos-orig.json'), 'utf8'));
const PAUSA = 0.5;
const ANTES = [16, 55, 75, 105, 142, 159, 172]; // índice de la primera palabra tras cada pausa
const cortes = ANTES.map((i) => +((T.palabras[i - 1].fin + T.palabras[i].inicio) / 2).toFixed(3));
const partes = [];
let prev = 0;
cortes.forEach((c, k) => {
  partes.push(`[0:a]atrim=${prev}:${c},asetpts=PTS-STARTPTS[a${k}]`);
  partes.push(`anullsrc=r=44100:cl=mono,atrim=0:${PAUSA},asetpts=PTS-STARTPTS[s${k}]`);
  prev = c;
});
partes.push(`[0:a]atrim=${prev},asetpts=PTS-STARTPTS[aN]`);
const ins = cortes.map((_, k) => `[a${k}][s${k}]`).join('') + '[aN]';
const fc = partes.join(';') + `;${ins}concat=n=${cortes.length * 2 + 1}:v=0:a=1[o]`;
const r = spawnSync(FFMPEG, ['-loglevel', 'error', '-y', '-i', path.join(dir, 'voz-orig.mp3'), '-filter_complex', fc, '-map', '[o]', '-ar', '44100', '-ac', '1', '-b:a', '192k', path.join(dir, 'voz.mp3')], {stdio: 'inherit'});
if (r.status !== 0) process.exit(1);
const desp = (i) => ANTES.filter((a) => i >= a).length * PAUSA;
const palabras = T.palabras.map((p, i) => ({...p, inicio: +(p.inicio + desp(i)).toFixed(3), fin: +(p.fin + desp(i)).toFixed(3)}));
const duracion = +(T.duracion + ANTES.length * PAUSA).toFixed(2);
fs.writeFileSync(path.join(dir, 'tiempos.json'), JSON.stringify({...T, palabras, duracion}, null, 2) + '\n');
console.log('pausas', ANTES.length, 'duración', duracion);
