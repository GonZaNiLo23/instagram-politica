// 038 · 8 años en cifras · Cifra 3 (la comida). Genera escenas.json desde tiempos.json (tiempos reales de palabra).
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
const NB = '\u00a0';
const N = 3;
const COMIDA = {etiqueta: 'COMIDA', valor: 39, color: '#14213D'};
const PRECIOS = {etiqueta: 'PRECIOS', valor: 22, color: '#8D99AE'};
const SUELDO = {etiqueta: 'SUELDO', valor: 24, color: '#F2B134'};

// ===== 1 · Gancho (0 - "Los precios") =====
const b1 = S(11);
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'cifraSerie', n: N, en: -1},
  {tipo: 'gancho', texto: `COMIDA +39${NB}%`, y: 520, tamano: 104, en: -1},
  rot(`2018 → 2025`, 665, -1),
  nota(['Alimentos y bebidas sin alcohol · Eurostat', 'Cálculo propio con datos oficiales'], -1),
  {tipo: 'barrasVSerie', max: 39, base: 1060, hMax: 240, centros: [300, 780], barras: [
    {...COMIDA, en: 0, dur: 1.5},
    {etiqueta: '¿SUELDO?', valor: 24, contorno: true, altoContorno: 130, en: r(t(8) - 0.1)},
  ]},
]);
// ===== 2 · Primera prueba: precios +22 % =====
const b2 = S(19);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`PRECIOS EN GENERAL +22${NB}%`, 330, 0.05),
  rot('IPCA, índice de precios armonizado de la UE', 500, 0.2, {tamano: 48}),
  {tipo: 'barrasVSerie', max: 39, base: 1060, hMax: 240, barras: [
    {...COMIDA, en: -1, dur: 0.01},
    {etiqueta: '¿SUELDO?', valor: 24, contorno: true, altoContorno: 130, en: -1},
    {...PRECIOS, en: 0.05, dur: 1.2},
  ], lineaRef: {valor: 22, en: 1.3}},
  {tipo: 'sello', valor: 'DATO', x: 700, y: 650, tamano: 80, desde: 60, en: 1.8},
  nota(['Cálculo propio con datos oficiales']),
]);
// ===== 3a · Fuente =====
const b3a = S(30);
esc(b2, b3a, {fondo: 'crema'}, [
  rot('EUROSTAT', 330, 0.05, {tamano: 96, pastilla: true}),
  rot('Media anual 2018 y 2025', 500, 0.3),
  {tipo: 'cifraGrandeSerie', valor: '2018 → 2025', y: 700, tam: 112, en: 0.6},
]);
// ===== 3b · Comparación con la zona euro =====
const b3 = S(49);
esc(b3a, b3, {fondo: 'crema'}, [
  {tipo: 'barrasHSerie', titulo: 'COMIDA 2018–2025', max: 40, paso: 20, y0: 330, alto: 190, dur: 1.0, filas: [
    {etiqueta: `ESPAÑA +39${NB}%`, valor: 39, color: '#14213D', en: 0.1},
    {etiqueta: `ZONA EURO +36${NB}%`, valor: 36, color: '#8D99AE', en: rel(b3a, 38)},
  ]},
  rot(`Precios en general: ES +22${NB}% · zona euro +24${NB}%`, 940, rel(b3a, 40) - 0.3, {tamano: 48}),
  nota(['Cálculo propio con datos oficiales'], 0.2),
]);
// ===== 4 · Sueldos =====
const b4 = S(72);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`COSTE SALARIAL POR TRABAJADOR +24${NB}%`, 330, 0.05),
  rot(`2018: 1.919${NB}€ → 2025: 2.377${NB}€ al mes (media de los 4 trimestres)`, 520, 0.2, {tamano: 44}),
  {tipo: 'barrasVSerie', max: 39, base: 1060, hMax: 240, barras: [
    {...COMIDA, en: -1, dur: 0.01},
    {...SUELDO, en: rel(b3, 58) - 0.3, dur: 1.0},
    {...PRECIOS, en: -1, dur: 0.01},
  ], lineaRef: {valor: 39, en: rel(b3, 63)}, flecha: {barra: 1, hasta: 39, en: rel(b3, 68)}},
  {tipo: 'sello', valor: 'DATO', x: 760, y: 660, tamano: 80, desde: 60, reboteMax: 0, en: rel(b3, 62)},
  nota(['INE, Encuesta Trimestral de Coste Laboral · cálculo propio']),
]);
// ===== 5 · Lo que dice el Gobierno =====
const b5 = S(100);
esc(b4, b5, {fondo: 'crema'}, [
  rot('IVA DE ALIMENTOS BÁSICOS: REBAJA 2023–2024', 330, 0.05),
  {tipo: 'ivaSerie', x: 540, y: 705, fases: [
    {en: 0.3, a: '4 %', b: '10 %', anio: '2022'},
    {en: rel(b4, 76), a: '0 %', b: '5 %', anio: '2023–24'},
    {en: 7.2, a: '4 %', b: '10 %', anio: '2025'},
  ]},
  rot('En 2025, vuelta al 4 % (aceite de oliva: 4 % fijo)', 855, rel(b4, 84), {tamano: 44}),
  rot('SEGÚN HACIENDA (25-6-2024): respuesta a la inflación por la invasión de Ucrania', 975, rel(b4, 87) - 0.7, {tamano: 48}),
  nota(['Ministerio de Hacienda, nota del 25-6-2024']),
]);
// ===== 6 · Lo que no mide =====
const b6 = S(107);
esc(b5, b6, {fondo: 'crema'}, [
  rot('NO ES TU SUELDO', 330, 0.05),
  rot('Media de todos los trabajadores', 430, 0.25, {tamano: 52}),
  {tipo: 'barrasVSerie', max: 39, base: 1060, hMax: 240, barras: [
    {...COMIDA, en: -1, dur: 0.01},
    {...SUELDO, en: -1, dur: 0.01},
    {...PRECIOS, en: -1, dur: 0.01},
  ], fragmenta: {barra: 1, en: 0.3, n: 10}},
  {tipo: 'selloTexto', lineas: ['NO MIDE'], x: 540, y: 620, desde: 40, angulo: -5, tamano: 72, en: 1.2},
]);
// ===== 7a · Pregunta A/B =====
const b7 = S(117);
esc(b6, b7, {fondo: 'crema'}, [
  rot('¿TU SUELDO: MÁS O MENOS QUE TU COMPRA?', 330, 0.05),
  {tipo: 'barrasVSerie', max: 39, base: 800, hMax: 150, tamEtiqueta: 44, barras: [
    {...COMIDA, en: -1, dur: 0.01},
    {...SUELDO, en: -1, dur: 0.01},
  ]},
  {tipo: 'abSerie', a: 'MÁS', b: 'MENOS', y: 900, en: 0.7},
]);
// ===== 7b · Cierre de serie =====
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierreSerie', siguiente: N + 1},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'cifraSerie', n: N, en: -1},
  {tipo: 'gancho', texto: '¿Y TU SUELDO?', y: 520, tamano: 84, en: -1},
  {tipo: 'cifraGrandeSerie', valor: `+39${NB}%`, sub: 'COMIDA', y: 690, tam: 200, en: -1, pill: true},
  {tipo: 'cifraGrandeSerie', valor: `+24${NB}%`, sub: 'COSTE SALARIAL', y: 1000, tam: 200, en: -1},
  rot('2018 → 2025', 1310, -1),
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
