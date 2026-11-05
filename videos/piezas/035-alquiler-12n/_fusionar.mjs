import fs from 'node:fs';
const T = JSON.parse(fs.readFileSync(new URL('./tiempos-fonetico.json', import.meta.url)));
const out = [];
for (let i = 0; i < T.palabras.length; i++) {
  const w = T.palabras[i];
  if (w.t === 'pe' && T.palabras[i + 1]?.t === 'ene') { const u = T.palabras[i + 2]; out.push({...w, t: 'PNV' + u.t.replace(/^uve/, ''), fin: u.fin}); i += 2; continue; }
  if (w.t === 'Boks') { out.push({...w, t: 'Vox'}); continue; }
  if (w.t === 'yunts') { out.push({...w, t: 'Junts'}); continue; }
  if (w.t === '…') continue;
  out.push(w);
}
fs.writeFileSync(new URL('./tiempos.json', import.meta.url), JSON.stringify({...T, palabras: out}));
console.log(out.length);
