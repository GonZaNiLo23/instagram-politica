// Pausas: 5,7 s antes de "Si no pactáis" (escena del calendario) y 1,2 s antes de "Lo fija un decreto" (leer la nota de votos).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const dir = path.dirname(fileURLToPath(import.meta.url));
const PAUSAS = [[55, 5.7], [66, 1.2]];
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos-orig.json'), 'utf8'));
const cortes = PAUSAS.map(([i]) => +(T.palabras[i].inicio - 0.1).toFixed(2));
const fmt = 'aformat=sample_rates=44100:channel_layouts=mono';
const ins = ['-i', path.join(dir, 'voz-orig.mp3')];
PAUSAS.forEach(([, P]) => ins.push('-f', 'lavfi', '-t', String(P), '-i', 'anullsrc=r=44100:cl=mono'));
const seg = [`[0:a]atrim=0:${cortes[0]},asetpts=PTS-STARTPTS,${fmt}[s0]`, `[0:a]atrim=${cortes[0]}:${cortes[1]},asetpts=PTS-STARTPTS,${fmt}[s1]`, `[0:a]atrim=${cortes[1]},asetpts=PTS-STARTPTS,${fmt}[s2]`];
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...ins, '-filter_complex', seg.join(';') + ';[s0][1:a][s1][2:a][s2]concat=n=5:v=0:a=1[o]', '-map', '[o]', '-b:a', '192k', path.join(dir, 'voz.mp3')]);
T.palabras = T.palabras.map((p, k) => { const d = PAUSAS.filter(([i]) => k >= i).reduce((a, [, P]) => a + P, 0); return {...p, inicio: +(p.inicio + d).toFixed(2), fin: +(p.fin + d).toFixed(2)}; });
T.duracion = +(T.duracion + PAUSAS.reduce((a, [, P]) => a + P, 0)).toFixed(2);
fs.writeFileSync(path.join(dir, 'tiempos-fonetico.json'), JSON.stringify(T));
console.log('duración', T.duracion);
