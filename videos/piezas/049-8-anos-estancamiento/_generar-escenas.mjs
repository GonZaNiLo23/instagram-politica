// 049 · 8 años en cifras · Cifra 9 (PIB por habitante frente a la UE). Eurostat nama_10_pc (UE-27 = 100), datos en Pib.tsx.
// La voz lleva 2,6 s de pausa antes de la palabra 17 (_pausa.mjs) para la escena "Qué es" (sin voz).
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
const N = 9;
const G = {base: 1120, hMax: 280, anios: false, refTam: 0};
const P = {base: 1100, hMax: 380, refDerecha: true};

const gancho = [
  {tipo: 'cifraSerie', n: N, en: -1},
  rot(`PIB POR HABITANTE`, 500, -1),
  {tipo: 'gancho', texto: `ESPAÑA / UE`, y: 590, tamano: 120, en: -1},
  rot(`Eurostat`, 750, -1),
  {tipo: 'pibSerie', ...G, en: -5, i0: [0, 0], i1: [11, 11], etiquetas: [3, 4, 11],
    flechas: [{desde: 3, en: 0.2, dur: 1.4, etiqueta: `2017`}, {desde: 4, en: r(t(11) - 0.1), dur: 1.4, etiqueta: `2018`}]},
];

// 1 · Gancho (hasta que acaba "acerca")
const b1 = r(t(16) + 0.4);
esc(0, b1, {fondo: 'crema'}, gancho);
// 2 · Qué es (sin voz)
const b2 = S(17);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`PIB POR HABITANTE, EN PODER DE${NB}COMPRA`, 330, 0.05),
  {tipo: 'pibSerie', ...P, en: -5, i0: [0, 0], i1: [11, 11], flechas: [], provisional: true},
]);
// 3 · 2017
const b3 = S(26);
esc(b2, b3, {fondo: 'crema'}, [
  rot(`2017: 92,3`, 330, 0.05),
  {tipo: 'pibSerie', ...P, en: 0.1, dur: 0.6, i0: [3, 3], i1: [3, 3], etiquetas: [3]},
]);
// 4 · 2018
const b4 = S(33);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`2018: 90,8`, 330, 0.05),
  {tipo: 'pibSerie', ...P, en: 0.1, dur: 1.2, i0: [3, 3], i1: [3, 4], etiquetas: [3, 4]},
]);
// 5 · 2025
const b5 = S(43);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`2025: 91,4 (provisional)`, 330, 0.05),
  nota([`Eurostat, nama_10_pc (11-11-2026)`], 1.6),
  {tipo: 'pibSerie', ...P, en: 0.2, dur: 2.2, i0: [3, 0], i1: [4, 11], etiquetas: [3, 4, 6, 11], marca2020: 1.2},
]);
// 6 · Dos lecturas
const b6 = S(60);
const full = {...P, en: -5, i0: [0, 0], i1: [11, 11], etiquetas: [3, 4, 6, 11]};
esc(b5, b6, {fondo: 'crema'}, [
  rot(`DESDE 2017: −0,9${NB}(92,3${NB}→${NB}91,4)`, 330, rel(b5, 43) - 0.3),
  rot(`DESDE 2018: +0,6${NB}(90,8${NB}→${NB}91,4)`, 495, rel(b5, 51) - 0.3),
  {tipo: 'pibSerie', ...full, marca2020: -1, flechas: [{desde: 3, en: rel(b5, 46), dur: 1.4}, {desde: 4, en: rel(b5, 54), dur: 1.4}]},
]);
// 7 · Giro
const b7 = S(70);
esc(b6, b7, {fondo: 'crema'}, [
  rot(`Recuperó 2020; aún por debajo de${NB}2017`, 330, 0.05),
  {tipo: 'pibSerie', ...full, marca2020: -1, flechas: [{desde: 3, en: -5}, {desde: 4, en: -5}]},
  {tipo: 'selloTexto', lineas: [`AMBAS CIERTAS`], x: 430, y: 545, desde: 40, angulo: -5, tamano: 64, en: rel(b6, 64) - 0.1},
]);
// 8a · Pregunta A/B
const b8 = S(82);
esc(b7, b8, {fondo: 'crema'}, [
  rot(`¿UN AÑO O LA SERIE${NB}ENTERA?`, 330, 0.05),
  {tipo: 'abSerie', a: 'UN AÑO', b: 'LA SERIE', y: 700, en: 0.6},
]);
// 8b · Cierre
esc(b8, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierreSerie', siguiente: N + 1}]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: gancho}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
