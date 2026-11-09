// 039 · 8 años en cifras · Cifra 4 (las bajas). Genera escenas.json desde tiempos.json.
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
const N = 4;
const A = 5.2, B = 8.5;
const CT = (o) => ({tipo: 'contadorSerie', valA: A, valB: B, etiqA: '2T-2018', etiqB: '2T-2026', dec: true, xA: 110, xB: 590, w: 260, ...o});

// 1 · Gancho
const b1 = S(12);
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'cifraSerie', n: N, en: -1},
  {tipo: 'gancho', texto: `8,5${NB}H DE BAJA AL MES`, y: 520, tamano: 104, en: -1},
  rot('por trabajador, de media · 2T-2026 · INE', 790, -1, {tamano: 48}),
  CT({base: 1100, hMax: 230, etiqBYa: true, valores: false, cuentaEn: 0.3, cuentaDur: 1.0}),
]);
// 2 · Primera prueba
const b2 = S(20);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`2T-2018: 5,2${NB}H`, 330, 0.05),
  rot(`2T-2026: 8,5${NB}H`, 420, 1.3),
  CT({base: 1100, hMax: 230, etiqBYa: true, valBFin: true, cuentaEn: 1.3, cuentaDur: 0.6}),
  {tipo: 'sello', valor: 'DATO', x: 230, y: 560, tamano: 80, desde: 60, reboteMax: 0, en: 1.9},
]);
// 3 · Equivalencia
const b3 = S(38);
esc(b2, b3, {fondo: 'crema'}, [
  rot(`MÁS DE UNA JORNADA DE 8${NB}H`, 330, 0.05),
  {tipo: 'cifraGrandeSerie', valor: `+63${NB}%`, y: 470, tam: 150, en: rel(b2, 29) - 0.3},
  nota(['(cálculo propio: 8,5 ÷ 5,2)'], rel(b2, 32)),
  CT({base: 1100, hMax: 230, etiqBYa: true, cuentaEn: -5, cuentaDur: 1, marca: {valor: 8, texto: `8${NB}H`, en: 0.5}}),
]);
// 4 · Fuente y qué mide
const b4 = S(62);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`HORAS NO TRABAJADAS POR BAJA MÉDICA (IT)`, 330, 0.05),
  rot('INE · Encuesta Trimestral de Coste Laboral · industria, construcción y servicios', 520, 1.0, {tamano: 48}),
  rot(`Horas/trabajador·mes · 2T con 2T`, 740, 2.6, {tamano: 48}),
  CT({base: 1085, hMax: 180, etiqBYa: true, cuentaEn: -5, cuentaDur: 1}),
]);
// 5 · Contexto AIReF
const b5 = S(89);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`AIReF (4-2-2026): BAJAS COMUNES POR 1.000 AFILIADOS`, 330, 0.05),
  rot('OTRA MEDIDA: CASOS, NO HORAS', 575, 0.6),
  rot(`2017: 21,4 → 2024: 33,9 (+58,4${NB}%)`, 770, rel(b4, 75) - 0.3, {tamano: 48}),
  {tipo: 'barrasVSerie', max: 33.9, base: 1090, hMax: 190, w: 220, centros: [300, 780], tamEtiqueta: 56, barras: [
    {etiqueta: '2017', valor: 21.4, color: '#8D99AE', en: 1.9, dur: 0.8, sinValor: true},
    {etiqueta: '2024', valor: 33.9, color: '#14213D', en: rel(b4, 75) - 0.2, dur: 1.0, sinValor: true},
  ]},
  {tipo: 'sello', valor: 'DATO', x: 230, y: 850, tamano: 80, desde: 60, reboteMax: 0, en: rel(b4, 83)},
]);
// 6a · Giro
const b6 = S(97);
esc(b5, b6, {fondo: 'crema'}, [
  rot('AIReF: MÁS SUPERVISIÓN DE LA PRESTACIÓN', 330, 0.05),
  {tipo: 'supervisionSerie', y: 860, en: 0.3},
]);
// 6b · Límite
const b7 = S(108);
esc(b6, b7, {fondo: 'crema'}, [
  rot('NO DICE LOS MOTIVOS · NO PRUEBA ABUSO', 330, 0.05),
  CT({base: 1100, hMax: 180, etiqBYa: true, cuentaEn: -5, cuentaDur: 1}),
  {tipo: 'selloTexto', lineas: ['NO MIDE', 'MOTIVOS'], x: 540, y: 610, desde: 40, angulo: -5, tamano: 72, en: 0.9},
]);
// 7a · Pregunta A/B
const b8 = S(117);
esc(b7, b8, {fondo: 'crema'}, [
  rot('¿MÁS CONTROL O COMO ESTÁ?', 330, 0.05),
  CT({base: 800, hMax: 200, etiqBYa: true, cuentaEn: -5, cuentaDur: 1, valores: false, etiquetas: false}),
  {tipo: 'abSerie', a: 'MÁS CONTROL', b: 'COMO ESTÁ', y: 880, en: 0.7},
]);
// 7b · Cierre
esc(b8, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierreSerie', siguiente: N + 1}]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'cifraSerie', n: N, en: -1},
  {tipo: 'gancho', texto: `8,5${NB}H DE BAJA AL MES`, y: 520, tamano: 104, en: -1},
  CT({base: 1150, hMax: 270, etiqBYa: true, cuentaEn: -5, cuentaDur: 1}),
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
