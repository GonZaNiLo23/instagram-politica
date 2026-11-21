// Inserta 1,2 s de silencio antes de la palabra 68 ("Lo fija un decreto") para leer la nota de votos.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const dir = path.dirname(fileURLToPath(import.meta.url));
const P = 1.2, I = 68;
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos-orig.json'), 'utf8'));
const CORTE = +(T.palabras[I].inicio - 0.1).toFixed(2);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(dir, 'voz-orig.mp3'), '-f', 'lavfi', '-t', String(P), '-i', 'anullsrc=r=44100:cl=mono',
  '-filter_complex', `[0:a]atrim=0:${CORTE},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono[a];[0:a]atrim=${CORTE},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono[b];[a][1:a][b]concat=n=3:v=0:a=1[o]`,
  '-map', '[o]', '-b:a', '192k', path.join(dir, 'voz.mp3')]);
T.palabras = T.palabras.map((p, i) => (i >= I ? {...p, inicio: +(p.inicio + P).toFixed(2), fin: +(p.fin + P).toFixed(2)} : p));
T.duracion = +(T.duracion + P).toFixed(2);
fs.writeFileSync(path.join(dir, 'tiempos-fonetico.json'), JSON.stringify(T));
console.log('duración', T.duracion);
