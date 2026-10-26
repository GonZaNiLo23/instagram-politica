// Imprime solo las secciones pedidas de un .md (para no leer guiones o propuestas enteros).
// Uso: node seccion.js <archivo.md> "Guion por bloques" "Imágenes" ...
//      node seccion.js <archivo.md>            → lista los títulos con su número de línea
// Coincide con cualquier título (#, ##, ###…) que contenga el texto, sin distinguir mayúsculas,
// y llega hasta el siguiente título del mismo nivel o superior.
const fs = require('fs');
const [archivo, ...buscados] = process.argv.slice(2);
if (!archivo) { console.error('Uso: node seccion.js <archivo.md> "sección" ...'); process.exit(1); }
const lineas = fs.readFileSync(archivo, 'utf8').split('\n');
const titulos = lineas.map((l, i) => ({ i, nivel: (l.match(/^(#{1,6}) /) || [])[1]?.length || 0, texto: l })).filter(t => t.nivel);

if (!buscados.length) {
  for (const t of titulos) console.log(`${t.i + 1}: ${t.texto}`);
  process.exit(0);
}
let encontradas = 0;
for (const b of buscados) {
  for (const t of titulos.filter(t => t.texto.toLowerCase().includes(b.toLowerCase()))) {
    const fin = titulos.find(o => o.i > t.i && o.nivel <= t.nivel);
    console.log(lineas.slice(t.i, fin ? fin.i : lineas.length).join('\n').trimEnd() + '\n');
    encontradas++;
  }
}
if (!encontradas) { console.error(`Ninguna sección coincide con: ${buscados.join(', ')}`); process.exit(1); }
