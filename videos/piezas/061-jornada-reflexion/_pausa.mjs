// Dos pausas (1,6 s antes de la palabra 26 y 1,3 s antes de la 47) para leer las citas literales de los arts. 51.3 y 53.
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const T = JSON.parse(fs.readFileSync('tiempos-orig.json', 'utf8'));
const P1 = 1.6, P2 = 1.3, I1 = 26, I2 = 47;
const C1 = +(T.palabras[I1].inicio - 0.05).toFixed(2), C2 = +(T.palabras[I2].inicio - 0.05).toFixed(2);
const f = 'aformat=sample_rates=44100:channel_layouts=mono';
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', 'voz-orig.mp3', '-f', 'lavfi', '-t', String(P1), '-i', 'anullsrc=r=44100:cl=mono', '-f', 'lavfi', '-t', String(P2), '-i', 'anullsrc=r=44100:cl=mono',
  '-filter_complex', `[0:a]atrim=0:${C1},asetpts=PTS-STARTPTS,${f}[a];[0:a]atrim=${C1}:${C2},asetpts=PTS-STARTPTS,${f}[b];[0:a]atrim=${C2},asetpts=PTS-STARTPTS,${f}[c];[a][1:a][b][2:a][c]concat=n=5:v=0:a=1[o]`,
  '-map', '[o]', '-b:a', '192k', 'voz.mp3']);
T.palabras = T.palabras.map((p, i) => { const d = (i >= I1 ? P1 : 0) + (i >= I2 ? P2 : 0); return d ? {...p, inicio: +(p.inicio + d).toFixed(2), fin: +(p.fin + d).toFixed(2)} : p; });
T.duracion = +(T.duracion + P1 + P2).toFixed(2);
fs.writeFileSync('tiempos.json', JSON.stringify(T));
console.log('duración', T.duracion);
