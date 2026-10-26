// Guarda tiempos-original.json (voz tal cual) y reescribe tiempos.json para los SUBTÍTULOS:
// "de Hont." -> "D'Hondt." y "De Hont" -> "D'Hondt" (una sola palabra con los tiempos de las dos).
// _generar-escenas.mjs usa siempre tiempos-original.json (índices de voz.txt). Ejecutar tras voz.mjs --voz.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const orig = path.join(dir, 'tiempos-original.json');
const tj = path.join(dir, 'tiempos.json');
if (!fs.existsSync(orig)) fs.copyFileSync(tj, orig);
const T = JSON.parse(fs.readFileSync(orig, 'utf8'));
const out = [];
for (let i = 0; i < T.palabras.length; i++) {
  const w = T.palabras[i], n = T.palabras[i + 1];
  if (/^de$/i.test(w.t) && n && /^hont/i.test(n.t)) {
    out.push({t: "D'Hondt" + n.t.slice(4), inicio: w.inicio, fin: n.fin});
    i++;
  } else out.push(w);
}
fs.writeFileSync(tj, JSON.stringify({...T, palabras: out}, null, 2) + '\n');
console.log('subtítulos:', out.length, 'palabras;', out.filter((p) => p.t.startsWith("D'Hondt")).length, "D'Hondt");
