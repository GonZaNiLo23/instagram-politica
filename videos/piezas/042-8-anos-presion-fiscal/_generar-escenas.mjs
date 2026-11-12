// 042 · 8 años en cifras · Cifra 3 (presión fiscal). Genera escenas.json desde tiempos.json.
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
const NB = ' ';
const N = 3;
const A = 35.2, B = 38.1;
const CT = (o) => ({tipo: 'contadorSerie', valA: A, valB: B, etiqA: '2018', etiqB: '2025', dec: true, xA: 110, xB: 590, w: 260, ...o});
const GRIS = '#8D99AE', TINTA = '#14213D', MOST = '#F2B134';

// 1 · Gancho (palabra 13 = "Treinta" de 2018 -> escena 2)
const b1 = S(13);
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'cifraSerie', n: N, en: -1},
  {tipo: 'gancho', texto: `IMPUESTOS 38,1${NB}% DEL${NB}PIB`, y: 470, tamano: 104, en: -1},
  rot(`impuestos y cotizaciones · 2025 · Eurostat`, 790, -1, {tamano: 44}),
  CT({base: 1120, hMax: 240, etiqBYa: true, valores: false, cuentaEn: 0.3, cuentaDur: 1.0}),
]);
// 2 · Primera prueba
const b2 = S(18);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`2018: 35,2${NB}%`, 330, 0.05),
  rot(`2025: 38,1${NB}%`, 420, 1.0),
  CT({base: 1100, hMax: 230, etiqBYa: true, valBFin: true, cuentaEn: -5, cuentaDur: 1}),
  {tipo: 'sello', valor: 'DATO', x: 230, y: 560, tamano: 80, desde: 60, reboteMax: 0, en: 0.9},
]);
// 3 · De dónde sale
const b3 = S(27);
esc(b2, b3, {fondo: 'crema'}, [
  rot('EUROSTAT · IMPUESTOS + COTIZACIONES', 330, 0.05, {tamano: 56}),
  rot(`% del PIB · datos de 29-10-2026`, 520, 1.0, {tamano: 48}),
  CT({base: 1100, hMax: 230, etiqBYa: true, cuentaEn: -5, cuentaDur: 1}),
]);
// 4 · La UE
const b4 = S(41);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`UE: 41,1${NB}% → 40,7${NB}%`, 330, 0.05),
  {tipo: 'barrasHSerie', max: 50, paso: 10, y0: 480, alto: 140, dur: 0.7, tamano: 56, filas: [
    {etiqueta: `ES 2018: 35,2${NB}%`, valor: 35.2, color: TINTA, en: 0.1},
    {etiqueta: `ES 2025: 38,1${NB}%`, valor: 38.1, color: TINTA, en: 0.4},
    {etiqueta: `UE 2018: 41,1${NB}%`, valor: 41.1, color: GRIS, en: rel(b3, 33)},
    {etiqueta: `UE 2025: 40,7${NB}%`, valor: 40.7, color: MOST, en: rel(b3, 38)},
  ]},
]);
// 5 · La brecha
const b5 = S(51);
esc(b4, b5, {fondo: 'crema'}, [
  rot('BRECHA CON LA UE (2025)', 330, 0.05),
  {tipo: 'cifraGrandeSerie', valor: `2,6${NB}PUNTOS`, y: 470, tam: 128, en: rel(b4, 47) - 0.3},
  nota([`40,7 − 38,1 · cálculo propio`], rel(b4, 47)),
  {tipo: 'barrasVSerie', max: 41.1, base: 1100, hMax: 300, w: 200, centros: [300, 780], tamEtiqueta: 48, barras: [
    {etiqueta: 'ESPAÑA', valor: 38.1, color: TINTA, en: 0.1, dur: 0.5, dec: true, prefijo: ''},
    {etiqueta: 'UE', valor: 40.7, color: MOST, en: 0.3, dur: 0.5, dec: true, prefijo: ''},
  ]},
]);
// 6 · Último año
const b6 = S(66);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`2024: 37,2${NB}% → 2025: 38,1${NB}%`, 330, 0.05, {tamano: 56}),
  {tipo: 'cifraGrandeSerie', valor: `+0,9${NB}PUNTOS`, y: 470, tam: 110, en: rel(b5, 62) - 0.3},
  {tipo: 'barrasVSerie', max: 38.1, base: 1100, hMax: 300, w: 200, centros: [300, 780], tamEtiqueta: 48, barras: [
    {etiqueta: '2024', valor: 37.2, color: GRIS, en: 0.1, dur: 0.6, dec: true, prefijo: ''},
    {etiqueta: '2025', valor: 38.1, color: MOST, en: rel(b5, 59), dur: 0.7, dec: true, prefijo: ''},
  ]},
]);
// 7 · Contexto UE
const b7 = S(76);
esc(b6, b7, {fondo: 'crema'}, [
  rot('ENTRE LAS MAYORES SUBIDAS DE LA UE', 330, 0.05, {tamano: 56}),
  {tipo: 'fichaSerie', filas: ['Alemania', 'Malta', 'España', 'Francia'], y: 640, paso: 0.55, tam: 72, en: 0.7},
  nota(['Eurostat · 2025'], 0.3),
]);
// 8 · Lo que no mide
const b8 = S(89);
esc(b7, b8, {fondo: 'crema'}, [
  rot('NO ES LO QUE PAGAS TÚ', 330, 0.05),
  rot('Mide recaudación total sobre el PIB', 440, 0.9, {tamano: 48}),
  {tipo: 'barraFigurasSerie', n: 10, y: 880, en: 0.5, divide: 1.5},
  {tipo: 'selloTexto', lineas: ['NO MIDE'], x: 540, y: 640, desde: 40, angulo: -5, tamano: 80, en: 1.3},
]);
// 9 · Quién recauda
const b9 = S(103);
esc(b8, b9, {fondo: 'crema'}, [
  {tipo: 'barrasHSerie', titulo: 'DEL TOTAL (2025)', max: 60, paso: 20, y0: 330, alto: 190, dur: 0.9, filas: [
    {etiqueta: `Estado central: 42,7${NB}%`, valor: 42.7, color: MOST, en: 0.3},
    {etiqueta: `Comunidades: 16,6${NB}%`, valor: 16.6, color: GRIS, en: rel(b8, 100)},
  ]},
]);
// 10a · Pregunta A/B
const b10 = S(108);
esc(b9, b10, {fondo: 'crema'}, [
  rot('¿MENOS IMPUESTOS O MÁS SERVICIOS?', 330, 0.05, {tamano: 56}),
  CT({base: 800, hMax: 200, etiqBYa: true, cuentaEn: -5, cuentaDur: 1, valores: false, etiquetas: false}),
  {tipo: 'abSerie', a: 'MENOS IMPUESTOS', b: 'MÁS SERVICIOS', y: 880, en: 0.7},
]);
// 10b · Cierre
esc(b10, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierreSerie', siguiente: N + 1}]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'cifraSerie', n: N, en: -1},
  {tipo: 'gancho', texto: `IMPUESTOS 38,1${NB}% DEL${NB}PIB`, y: 470, tamano: 104, en: -1},
  rot(`2018: 35,2${NB}% · UE 40,7${NB}%`, 790, -1, {tamano: 48}),
  CT({base: 1150, hMax: 270, etiqBYa: true, cuentaEn: -5, cuentaDur: 1}),
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
