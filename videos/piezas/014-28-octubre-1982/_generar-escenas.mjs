// Genera escenas.json desde tiempos.json (tiempos reales de palabra). Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const DUR = r(T.duracion + 3);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.1, o = {}) => ({tipo: 'notas', lineas, en, ...o});
const NB = '\u00A0';
const UCD = '#E08A2E', PSOE = '#D8493E', AP = '#3B8EDB', OTROS = '#8D99AE';
const R = (base, i) => r(t(i) - base);

// 1 · Gancho (0 -> "escaños")
const b1 = S(9);
const hemiGancho = (extra) => ({tipo: 'hemiU', y: 520, ancho: 860, estatico: true, en: -1, fases: [{en: 0, grupos: [{n: 168, color: UCD}]}], ...extra});
esc(0, b1, {}, [
  rot(`¿DEL${NB}GOBIERNO${NB}A${NB}11 ESCAÑOS?`, 335, -1),
  hemiGancho({cuenta: {desde: 168, hasta: 11, en: 0.5, dur: r(t(7) - 0.65), etiqueta: 'UCD', apaga: true, tam: 120}}),
]);
// 2a · Fecha
const b2 = S(18);
esc(b1, b2, {}, [
  rot('28 DE OCTUBRE DE 1982', 335, 0.05),
  {tipo: 'hojaU', y: 600, en: 0.1},
]);
// 2b · UCD
const b3 = S(25);
esc(b2, b3, {}, [
  rot('UCD = UNIÓN DE CENTRO DEMOCRÁTICO', 335, 0.05),
  {tipo: 'siglasU', texto: 'UCD', y: 640, en: 0.1},
  rot('Partido del Gobierno en 1982', 960, R(b2, 20) - 0.15, {tamano: 56}),
]);
// 2c + 3 · Hemiciclos 1979 -> 1982 -> mayoría
const b4 = S(51);
const f2 = R(b3, 33) - 0.1; // pasa a 1982
const fm = R(b3, 43) - 0.1; // mayoría
esc(b3, b4, {}, [
  rot('1979: 168 DIPUTADOS', 335, 0.05, {hasta: f2}),
  rot('PSOE: 202 DE 350', 335, f2 + 0.1, {hasta: fm}),
  rot('Partido Socialista Obrero Español', 420, R(b3, 36) - 0.05, {tamano: 48, hasta: fm}),
  rot(`MAYORÍA ABSOLUTA: 176 (MITAD${NB}+${NB}1)`, 335, fm + 0.1),
  {tipo: 'lineaU', y: 560, en: 0.1, hitos: [
    {x: 190, texto: 'MARZO 1979', enciende: 0.3, apaga: f2},
    {x: 500, texto: 'OCT 1982', enciende: f2 + 0.1},
  ]},
  {tipo: 'hemiU', y: 650, ancho: 720, en: 0.1, fases: [
    {en: 0, grupos: [{n: 121, color: PSOE, nombre: 'PSOE'}, {n: 168, color: UCD, nombre: 'UCD'}, {n: 61, color: OTROS, nombre: 'Otros'}]},
    {en: f2, grupos: [{n: 202, color: PSOE, nombre: 'PSOE'}, {n: 11, color: UCD, nombre: 'UCD'}, {n: 107, color: AP, nombre: 'AP-PDP'}, {n: 30, color: OTROS, nombre: 'Otros'}]},
  ], cuenta: {desde: 121, hasta: 202, en: R(b3, 38) - 0.05, dur: 0.85, etiqueta: 'PSOE', tam: 100, visibleEn: R(b3, 38) - 0.05},
    mayoria: {en: R(b3, 47) - 0.1, etiqueta: '+26', etiquetaEn: R(b3, 50) - 0.3}, yLeyenda: 1010},
  nota(['Fuente: Ministerio del Interior'], 0.1, {hasta: f2}),
  nota(['AP-PDP = Alianza Popular–Partido Demócrata Popular', 'Fuente: Ministerio del Interior'], f2 + 0.1),
]);
// 4 · Barras
const b5 = S(76);
esc(b4, b5, {}, [
  rot(`48${NB}% DE LOS VOTOS VÁLIDOS`, 335, 0.05, {hasta: R(b4, 63) - 0.1}),
  rot(`CASI 58${NB}% DE LOS ESCAÑOS`, 335, R(b4, 63) + 0.0),
  {tipo: 'barrasU', y: 540, en: 0.1,
    v1: {etiqueta: 'Votos válidos', valor: 48.1, texto: '48,1 %', en: 0.2, dur: 1.7, color: C_TURQ()},
    v2: {etiqueta: 'Escaños', valor: 57.7, texto: '57,7 %', en: R(b4, 65) - 0.1, dur: 1.8, color: C_MOST()}},
  {tipo: 'sello', valor: 'DATO', en: R(b4, 72) + 0.1, y: 985, x: 540, tamano: 110, reboteMax: 20, desde: -120},
  nota(['Fuente: Ministerio del Interior (escaños: 202 de 350)'], 0.1),
]);
// 5 · Cierre
const b6 = S(83);
esc(b5, b6, {}, [
  rot('168 → 11', 335, 0.05, {tamano: 130}),
  hemiGancho({en: 0, cuenta: {desde: 168, hasta: 11, en: R(b5, 81) - 0.15, dur: 0.55, etiqueta: 'UCD', apaga: true, tam: 120}}),
]);
esc(b6, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', cta: 'guardalo', frase: `¿PODRÍA REPETIRSE HOY?`, tamano: 104, yFrase: 460, yGuardalo: 1180, pulso: true},
]);

function C_TURQ() { return '#2A9D8F'; }
function C_MOST() { return '#F2B134'; }

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'rotulo', texto: `¿DEL${NB}GOBIERNO`, y: 420, en: -1, tamano: 104, pastilla: true},
  {tipo: 'rotulo', texto: `A${NB}11${NB}ESCAÑOS?`, y: 560, en: -1, tamano: 104, pastilla: true},
  {tipo: 'hemiU', y: 780, ancho: 860, estatico: true, en: -1, fases: [{en: 0, grupos: [{n: 11, color: UCD}]}], cuenta: {desde: 11, hasta: 11, en: 0, dur: 1, etiqueta: 'UCD', tam: 120}},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', musica: {pista: 'wallpaper.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
ESC.forEach((e, i) => { const d = e.fin - e.inicio; if (d < 1.4) console.log('corta', i + 1, e.inicio, d.toFixed(2)); });
