// Pausas para leer: 2,7 s antes de "Cálculo" (palabra 58) y 1,0 s antes de "¿Media" (66).
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const T = JSON.parse(fs.readFileSync('tiempos-orig.json', 'utf8'));
const cortes = [[58, 2.7], [66, 1.0]].map(([i, p]) => [+(T.palabras[i].inicio - 0.05).toFixed(2), p, i]);
const [c1, p1] = cortes[0], [c2, p2] = cortes[1];
const f = (a, b) => `atrim=${a}${b ? ':' + b : ''},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono`;
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', 'voz-orig.mp3', '-f', 'lavfi', '-t', String(p1), '-i', 'anullsrc=r=44100:cl=mono', '-f', 'lavfi', '-t', String(p2), '-i', 'anullsrc=r=44100:cl=mono',
  '-filter_complex', `[0:a]${f(0, c1)}[a];[0:a]${f(c1, c2)}[b];[0:a]${f(c2)}[c];[a][1:a][b][2:a][c]concat=n=5:v=0:a=1[o]`, '-map', '[o]', '-b:a', '192k', 'voz.mp3']);
T.palabras = T.palabras.map((p, i) => { const d = (i >= 58 ? p1 : 0) + (i >= 66 ? p2 : 0); return d ? {...p, inicio: +(p.inicio + d).toFixed(2), fin: +(p.fin + d).toFixed(2)} : p; });
T.duracion = +(T.duracion + p1 + p2).toFixed(2);
fs.writeFileSync('tiempos.json', JSON.stringify(T));
console.log('duración', T.duracion);
