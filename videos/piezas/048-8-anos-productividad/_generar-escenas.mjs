// 048 · 8 años en cifras · Cifra 8 (productividad por hora). Genera escenas.json desde tiempos.json.
// Cifras (Eurostat nama_10_lp_ulc, 2015=100): España 101,0 -> 103,3 (+2,2 %); UE 103,0 -> 107,4 (+4,3 %).
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
const N = 8;
const TINTA = '#14213D', MOST = '#F2B134';
const LIN = {max: 5, base: 1100, hMax: 400};
const ES = (en = -5, o = {}) => ({nombre: 'ESPAÑA', final: 2.2, color: TINTA, en, dec: true, ...o});
const UE = (en, o = {}) => ({nombre: 'UE', final: 4.3, color: MOST, en, dec: true, ...o});

const gancho = [
  {tipo: 'cifraSerie', n: N, en: -1},
  {tipo: 'gancho', texto: `UNA HORA RINDE +2,2${NB}%`, y: 470, tamano: 104, en: -1},
  rot(`España, 2018 → 2025 · Eurostat`, 740, -1),
  {tipo: 'relojSerie', cx: 330, cy: 990, r: 140, cajas: true},
];

// 1 · Gancho (palabra 10 "Es" -> escena 2)
const b1 = S(10);
esc(0, b1, {fondo: 'crema'}, gancho);
// 2 · Qué es
const b2 = S(23);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`PRODUCTIVIDAD = PRODUCCIÓN${NB}POR${NB}HORA`, 330, 0.05),
  rot(`volumen real, 2015${NB}=${NB}100`, 540, rel(b1, 15) - 0.3),
  {tipo: 'relojSerie', cx: 330, cy: 900, r: 120, cajas: true},
]);
// 3 · Dato España
const b3 = S(39);
esc(b2, b3, {fondo: 'crema'}, [
  rot(`ESPAÑA: 101,0 → 103,3`, 330, 0.05),
  {tipo: 'lineasSerie', ...LIN, series: [ES(0.4, {dur: 1.8})]},
]);
// 4 · Lo que mejora
const b4 = S(54);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`2025: provisional`, 330, rel(b3, 44) - 0.3),
  rot(`MÁXIMO DE LA SERIE (1995–2025)`, 450, rel(b3, 47) - 0.3),
  {tipo: 'lineasSerie', ...LIN, series: [ES()]},
  {tipo: 'selloTexto', lineas: ['MEJORA'], x: 440, y: 660, desde: 40, angulo: -5, tamano: 80, en: 0.05},
]);
// 5 · UE
const b5 = S(64);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`UE: 103,0 → 107,4`, 330, 0.05),
  {tipo: 'lineasSerie', ...LIN, series: [ES(-5, {pos: 'abajo'}), UE(0.5, {dur: 1.8})]},
]);
// 6 · Ojo
const b6 = S(75);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`No compara euros por${NB}hora`, 330, rel(b5, 70) - 0.4),
  {tipo: 'lineasSerie', ...LIN, series: [ES(-5, {pos: 'abajo'}), UE(-5)]},
  {tipo: 'selloTexto', lineas: ['ÍNDICE,', 'NO NIVEL'], x: 440, y: 520, desde: 40, angulo: -5, tamano: 80, en: 0.05},
]);
// 7a · Pregunta A/B
const b7 = S(81);
esc(b6, b7, {fondo: 'crema'}, [
  rot(`¿LO NOTAS EN TU TRABAJO?`, 330, 0.05),
  {tipo: 'abSerie', a: 'SÍ', b: 'NO', y: 700, en: 0.5},
]);
// 7b · Cierre
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierreSerie', siguiente: N + 1}]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: gancho}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
