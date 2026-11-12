// 046 · 8 años en cifras · Cifra 7 (paro juvenil). Genera escenas.json desde tiempos.json.
// Cifras: media anual 2018 34,3 %; 2025 24,9 %; UE 2025 15,2 %; brecha 17,6 -> 9,7 puntos; punto mensual sept. 2026 22,8 % (NO comparable con la media anual: va en su propia escena).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T.duracion + 1.9);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.2) => ({tipo: 'notas', lineas, en, tamano: 40});
const NB = ' ';
const N = 7;
const TINTA = '#14213D', MOST = '#F2B134';
const MAX = 34.3;
const barra = (etiqueta, valor, color, en, o = {}) => ({etiqueta, valor, color, en, dur: 0.05, dec: true, prefijo: '', ...o});

// 1 · Gancho (palabra 11 = "Lo mide" -> escena 2)
const b1 = S(11);
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'cifraSerie', n: N, en: -1},
  {tipo: 'gancho', texto: `PARO JUVENIL 34,3${NB}%`, y: 470, tamano: 104, en: -1},
  rot('MEDIA ANUAL 2018', 740, -1),
  {tipo: 'barrasVSerie', max: MAX, base: 1150, hMax: 250, w: 200, centros: [300, 780], tamEtiqueta: 64, vivo: true, barras: [
    barra('2018', 34.3, TINTA, -1, {dur: 1}),
    {etiqueta: '¿Y hoy?', valor: 0, en: rel(b1, 9) - 0.1, contorno: true, altoContorno: 150},
  ]},
]);
// 2 · Fuente
const b2 = S(31);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`EUROSTAT · <25${NB}años · %${NB}de${NB}la${NB}población${NB}activa`, 330, 0.05),
  rot(`Definición distinta desde 2021 (marca${NB}de${NB}Eurostat)`, 640, rel(b1, 24) - 0.4),
  {tipo: 'cifraGrandeSerie', valor: '2021', y: 960, tam: 170, en: rel(b1, 24) - 0.2},
]);
// 3 · Lo bueno
const b3 = S(45);
esc(b2, b3, {fondo: 'crema'}, [
  rot(`2025: 24,9${NB}%`, 330, 0.05),
  {tipo: 'barrasVSerie', max: MAX, base: 1030, hMax: 270, w: 200, centros: [300, 780], tamEtiqueta: 64, vivo: true,
    flecha: {barra: 0, hasta: 24.9, en: rel(b2, 38)},
    barras: [barra('2018', 34.3, TINTA, 0.1), barra('2025', 24.9, MOST, rel(b2, 35) - 0.2)]},
  {tipo: 'selloTexto', lineas: ['MEJORA'], x: 540, y: 470, desde: 40, angulo: -5, tamano: 80, en: rel(b2, 42) - 0.2},
  nota([`RESTA: 9,4${NB}PUNTOS (cálculo${NB}propio)`, `definición distinta desde${NB}2021`], rel(b2, 38) - 0.5),
]);
// 4 · Último dato (punto mensual, escena y escala propia: no se compara con la media anual)
const b4 = S(57);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`SEPT.${NB}2026: 22,8${NB}%`, 330, 0.05),
  rot(`dato mensual desestacionalizado, no comparable con la media${NB}anual`, 440, 0.9),
  {tipo: 'barrasVSerie', max: MAX, base: 1150, hMax: 220, w: 200, centros: [540], tamEtiqueta: 64, vivo: true,
    barras: [barra(`SEPT.${NB}2026`, 22.8, MOST, rel(b3, 54) - 0.2)]},
]);
// 5 · La UE
const b5 = S(64);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`UE 2025: 15,2${NB}%`, 330, 0.05),
  {tipo: 'barrasVSerie', max: MAX, base: 1150, hMax: 270, w: 200, centros: [300, 780], tamEtiqueta: 64, vivo: true,
    barras: [barra('ESPAÑA', 24.9, TINTA, 0.1), barra('UE', 15.2, MOST, rel(b4, 61) - 0.2)]},
]);
// 6 · Brecha
const b6 = S(79);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`BRECHA: 17,6 → 9,7${NB}PUNTOS`, 330, 0.05),
  nota(['cálculo propio'], 0.3),
  {tipo: 'barrasVSerie', max: 17.6, base: 1050, hMax: 330, w: 200, centros: [300, 780], tamEtiqueta: 64, vivo: true,
    flecha: {barra: 0, hasta: 9.7, en: rel(b5, 76) - 0.3},
    barras: [barra('2018', 17.6, TINTA, 0.1, {sufijo: ''}), barra('2025', 9.7, MOST, rel(b5, 76) - 0.4, {sufijo: ''})]},
]);
// 7 · Lo que no mide
const b7 = S(91);
esc(b6, b7, {fondo: 'crema'}, [
  rot(`NO MIDE: INACTIVOS (no${NB}buscan${NB}empleo)`, 330, 0.05),
  {tipo: 'barraFigurasSerie', n: 10, y: 940, en: 0.5, divide: 1.5},
  {tipo: 'selloTexto', lineas: ['NO MIDE'], x: 540, y: 690, desde: 40, angulo: -5, tamano: 80, en: 1.0},
]);
// 8a · Pregunta A/B
const b8 = S(98);
esc(b7, b8, {fondo: 'crema'}, [
  rot('¿SUFICIENTE?', 330, 0.05),
  {tipo: 'abSerie', a: 'MEJORA SUFICIENTE', b: 'AÚN LEJOS DE EUROPA', y: 700, en: 0.5},
]);
// 8b · Cierre
esc(b8, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierreSerie', siguiente: N + 1}]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'cifraSerie', n: N, en: -1},
  {tipo: 'gancho', texto: `PARO JUVENIL 34,3${NB}%`, y: 470, tamano: 104, en: -1},
  rot('MEDIA ANUAL 2018', 740, -1),
  {tipo: 'barrasVSerie', max: MAX, base: 1150, hMax: 250, w: 200, centros: [300, 780], tamEtiqueta: 64, barras: [
    barra('2018', 34.3, TINTA, -1, {dur: 1}),
    {etiqueta: '¿Y hoy?', valor: 0, en: -1, contorno: true, altoContorno: 150},
  ]},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
