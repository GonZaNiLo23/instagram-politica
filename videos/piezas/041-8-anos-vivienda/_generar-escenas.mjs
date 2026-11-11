// 041 · 8 años en cifras · Cifra 2 (vivienda). Genera escenas.json desde tiempos.json (tiempos reales de palabra).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T.duracion + 0.3);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.2, o = {}) => ({tipo: 'notas', lineas, en, tamano: 40, ...o});
const NB = ' ';
const N = 2;
const GA = '#8DA0B8'; // UE (gris azulado)
const MOS = '#F2B134';
const TINTA = '#14213D';
const CH = {max: 60, base: 1170, hMax: 560, x0: 130, x1: 830};
const ES = (en, dur = 1.6) => ({nombre: 'ESPAÑA', final: 52, color: TINTA, en, dur});
const UE = (en, dur = 1.4) => ({nombre: 'UE', final: 41, color: GA, en, dur, pos: 'abajo'});
const SAL = (en, dur = 1.4) => ({nombre: 'COSTE SALARIAL', final: 24, color: MOS, en, dur, pos: 'abajo', tam: 44});
const L = (series) => ({tipo: 'lineasSerie', ...CH, series});

// 1 · Gancho
const b1 = S(11);
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'cifraSerie', n: N, en: -1},
  {tipo: 'gancho', texto: `COMPRAR CASA${NB}+52${NB}%`, y: 470, tamano: 112, en: -1},
  rot('precio de la vivienda · 2018 → 2025 · Eurostat', 710, -1, {tamano: 40}),
  {...L([ES(0, 2.2)]), hMax: 340},
  rot('¿UE?', 830, rel(0, 8) - 0.1, {tamano: 110, x: 80, color: MOS}),
]);
// 2 · Primera prueba
const b2 = S(21);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`UE${NB}+41${NB}%`, 330, 0.05),
  rot(`ESPAÑA${NB}+52${NB}%`, 430, 0.9),
  L([ES(-1, 0.01), UE(0.1, 1.8)]),
  ]);
// 3 · De dónde sale
const b3 = S(32);
esc(b2, b3, {fondo: 'crema'}, [
  rot('EUROSTAT', 330, 0.05, {tamano: 52}),
  rot(`ESPAÑA 118,6 → 180,6 · UE 114,8 → 161,9`, 440, 0.3, {tamano: 44}),
  L([ES(-1, 0.01), UE(-1, 0.01)]),
]);
// 4 · Lo último
const b4 = S(50);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`ÚLTIMO AÑO: +12,2${NB}%`, 330, 0.05),
  rot('2T-2026 frente a 2T-2025', 440, 0.1, {tamano: 44}),
  rot('Todas las comunidades suben', 540, 1.2, {tamano: 44}),
  L([ES(-1, 0.01), UE(-1, 0.01)]),
]);
// 5 · Sueldos
const b5 = S(55);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`COSTE SALARIAL POR TRABAJADOR +24${NB}%`, 330, 0.05),
  rot('INE, ETCL · cálculo propio', 530, 0.3, {tamano: 44}),
  L([ES(-1, 0.01), UE(-1, 0.01), SAL(0.3, 1.8)]),
]);
// 6a · Alquiler
const b6 = S(67);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`ALQUILER (IPC) +11,8${NB}%`, 330, 0.05),
    rot('2018 → 2025 · Eurostat', 430, 0.2, {tamano: 44}),
  {tipo: 'barrasVSerie', max: 52, base: 1170, hMax: 480, tamEtiqueta: 44, w: 180, centros: [190, 510, 800], barras: [
    {etiqueta: 'VIVIENDA', valor: 52, color: TINTA, en: -1, dur: 0.01, prefijo: '+', sufijo: ' %'},
    {etiqueta: 'ALQUILER', valor: 11.8, color: MOS, en: 0.2, dur: 1.0, prefijo: '+', sufijo: ' %', dec: true},
    {etiqueta: 'ZONA EURO', valor: 14.8, color: GA, en: 1.0, dur: 1.0, prefijo: '+', sufijo: ' %', dec: true},
  ]},
]);
// 6b · Contratos
const b7 = S(77);
esc(b6, b7, {fondo: 'crema'}, [
  rot('CONTRATOS EN VIGOR, NO SOLO NUEVOS', 330, 0.05),
  {tipo: 'contratosSerie', y: 900, en: 0.2},
]);
// 7 · Quién decide
const b8 = S(87);
esc(b7, b8, {fondo: 'crema'}, [
  rot('SUELO Y VIVIENDA: COMUNIDADES Y AYUNTAMIENTOS', 330, 0.05),
  rot('ESTADO: LEYES Y AYUDAS', 560, 1.2, {tamano: 52}),
  {tipo: 'mapaCcaa', modo: 'uno', x: 130, y: 760, esc: 0.42, en: 0.1, tono: '#C9CED8'},
]);
// 8 · Gobierno
const b9 = S(102);
esc(b8, b9, {fondo: 'crema'}, [
  rot('LEY DE VIVIENDA (2023)', 330, 0.05),
  rot('SEGÚN SU PREÁMBULO: FACILITAR EL ACCESO', 430, rel(b8, 94) - 0.2, {tamano: 56}),
  {tipo: 'fichaSerie', filas: ['BOE, Ley 12/2023'], y: 800, en: 0.3, tam: 56},
]);
// 9 · Lo que no mide
const b10 = S(109);
esc(b9, b10, {fondo: 'crema'}, [
  rot('NO ES TU ESFUERZO', 330, 0.05),
    {tipo: 'barraFigurasSerie', y: 960, en: 0.1, divide: 1.0},
  {tipo: 'sello', valor: 'NO MIDE', x: 400, y: 560, tamano: 72, desde: 40, reboteMax: 0, en: 0.4},
]);
// 10a · Pregunta
const b11 = S(117);
esc(b10, b11, {fondo: 'crema'}, [
  rot('¿MÁS DIFÍCIL: COMPRAR O ALQUILAR?', 330, 0.05),
  {tipo: 'abSerie', a: 'COMPRAR', b: 'ALQUILAR', y: 840, en: 0.7},
]);
// 10b · Cierre
esc(b11, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierreSerie', siguiente: N + 1}]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'cifraSerie', n: N, en: -1},
  {tipo: 'gancho', texto: `COMPRAR CASA${NB}+52${NB}%`, y: 520, tamano: 112, en: -1},
  rot('¿Y EN EUROPA? UE +41 %', 800, -1, {tamano: 64}),
  {tipo: 'lineasSerie', ...CH, base: 1250, hMax: 400, series: [ES(-1, 0.01), UE(-1, 0.01)]},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 80, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
