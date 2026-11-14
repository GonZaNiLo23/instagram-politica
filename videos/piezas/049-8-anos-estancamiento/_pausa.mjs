// Inserta 2,6 s de silencio antes de la palabra 17 ("En dos mil diecisiete") para que la escena "Qué es" (sin voz) se lea.
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const P = 2.6, CORTE = 7.45;
const T = JSON.parse(fs.readFileSync('tiempos-orig.json', 'utf8'));
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', 'voz-orig.mp3', '-f', 'lavfi', '-t', String(P), '-i', 'anullsrc=r=44100:cl=mono',
  '-filter_complex', `[0:a]atrim=0:${CORTE},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono[a];[0:a]atrim=${CORTE},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono[b];[a][1:a][b]concat=n=3:v=0:a=1[o]`,
  '-map', '[o]', '-b:a', '192k', 'voz.mp3']);
T.palabras = T.palabras.map((p, i) => (i >= 17 ? {...p, inicio: +(p.inicio + P).toFixed(2), fin: +(p.fin + P).toFixed(2)} : p));
T.duracion = +(T.duracion + P).toFixed(2);
fs.writeFileSync('tiempos.json', JSON.stringify(T));
console.log('duración', T.duracion);
