// 056 · 8 años en cifras · Cifra 12 (vivienda). Eurostat prc_hpi_a: ES 118,6->180,6 (+52,3); UE 114,8->161,9 (+41,0).
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
const N = 12;
const TINTA = '#14213D', MOST = '#F2B134', TEJA = '#C8553D';
const LIN = {max: 60, base: 1100, hMax: 430};
const ES = (en = -5, o = {}) => ({nombre: 'ESPAÑA', final: 52.3, color: TINTA, en, dec: true, ...o});
const UE = (en = -5, o = {}) => ({nombre: 'UE', final: 41.0, color: MOST, en, dec: true, ...o});
const f = (etiqueta, valor, color, en) => ({etiqueta, valor, color, en});
const H = (filas, y0, alto, max = 60, paso = 20) => ({tipo: 'barrasHSerie', vivo: true, filas, max, paso, y0, alto, x0: 110, largo: 700, dur: 0.9, tamano: 64});

const gancho = [
  {tipo: 'cifraSerie', n: N, en: -1},
  {tipo: 'gancho', texto: `COMPRAR CASA: +52${NB}%`, y: 480, tamano: 104, en: -1},
  rot(`¿Y EN EUROPA?`, 760, -1, {tamano: 88}),
  rot(`2018 → 2025 · Eurostat`, 860, -1, {tamano: 52}),
  {tipo: 'lineasSerie', ...LIN, hMax: 110, base: 1100, series: [ES(0.1, {dur: 2.2})]},
];
const b1 = S(12);
esc(0, b1, {fondo: 'crema'}, gancho);
const b2 = S(24);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`ESPAÑA 118,6 → 180,6 (+52${NB}%)`, 330, 0.05),
  rot(`UE 114,8 → 161,9 (+41${NB}%)`, 450, rel(b1, 17) - 0.1),
  nota([`Media anual 2018 (Sánchez, desde 2‑6‑2018)`], 0.3),
  {tipo: 'lineasSerie', ...LIN, hMax: 480, series: [ES(0.2, {dur: 2.5}), UE(rel(b1, 17) - 0.1, {dur: 1.8, pos: 'abajo', ldy: 120, tam: 48})]},
]);
const b3 = S(37);
esc(b2, b3, {fondo: 'crema'}, [
  rot(`HACE UN AÑO`, 330, 0.05),
  rot(`INE, IPV 2T-2026`, 430, 0.4, {tamano: 52}),
  {tipo: 'lineasSerie', ...LIN, hMax: 360, series: [ES(-5), UE(-5, {pos: 'abajo', ldy: 120, tam: 48})]},
  {tipo: 'selloTexto', lineas: ['+12,2 % EN UN AÑO'], x: 540, y: 545, desde: 40, angulo: -3, tamano: 60, en: 0.3},
]);
const b4 = S(47);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`REMUNERACIÓN POR ASALARIADO`, 330, 0.05),
  H([f(`VIVIENDA +52${NB}%`, 52.3, TEJA, -1), f(`REMUNERACIÓN +30${NB}%`, 30.1, MOST, rel(b3, 44) - 0.1)], 600, 170),
  nota([`Eurostat, valores corrientes, incluye cotizaciones`, `(cálculo propio)`], 0.5),
]);
const b5 = S(74);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`ALQUILER IPC: +11,8${NB}%`, 330, 0.05),
  rot(`Zona euro +14,8${NB}%`, 450, rel(b4, 59) - 0.2),
  H([f(`ESPAÑA +11,8${NB}%`, 11.8, TINTA, 0.3), f(`ZONA EURO +14,8${NB}%`, 14.8, MOST, rel(b4, 59) - 0.1)], 640, 150, 20, 10),
  {tipo: 'selloTexto', lineas: ['CONTRATOS VIVOS', 'NO LOS NUEVOS'], x: 540, y: 1035, desde: 40, angulo: -4, tamano: 50, en: 0.4},
]);
const b6 = S(86);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`URBANISMO Y VIVIENDA: CCAA Y AYUNTAMIENTOS`, 330, 0.05),
  rot(`Estado: Ley de Vivienda 2023 y${NB}ayudas`, 560, rel(b5, 79) - 0.2, {tamano: 52}),
  {tipo: 'mapaCcaa', modo: 'uno', x: 160, y: 760, esc: 0.37, en: 0.1, tono: '#C9CED8'},
]);
const b7 = S(93);
esc(b6, b7, {fondo: 'crema'}, [
  rot(`¿COMPRAR O ALQUILAR?`, 330, 0.05),
  {tipo: 'abSerie', a: 'COMPRAR', b: 'ALQUILAR', y: 700, en: 0.5},
]);
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierreSerie', siguiente: N + 1}]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: gancho}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
