// 068 · Calendario tras el 29-N. Lee tiempos.json y escribe escenas.json.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T0 = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T0.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T0.duracion + 1.6);
const NB = ' ';
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const cal = (extra) => ({tipo: 'calendarioX', mes: 'DICIEMBRE', primer: 1, dias: 31, x: 480, y: 520, cw: 108, ch: 62, en: 0.1, ...extra});

// 1 · Gancho
const b1 = S(9);
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: 'VOTAS 29‑N', y: 330, tamano: 100, en: -1},
  {tipo: 'gancho', texto: '→ CORTES 23‑D', y: 450, tamano: 100, en: -1},
  {tipo: 'foto', src: 'urna.jpg', x: 500, y: 1000, ancho: 880, alto: 760, foco: '50% 50%', zoom: [1.0, 1.12], pan: [0, -20], dur: 3, en: -1, credito: 'Foto: Américo Toledano / Wikimedia Commons, CC BY-SA 4.0'},
]);

// 2 · Primera prueba
const b2 = S(22);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`29-N · RECUENTO${NB}EN LA MESA`, 330, 0.05),
  {tipo: 'mesaH', x: 540, y: 600, r: 78, ilumina: 0.6, en: 0.1},
  {tipo: 'calendarioX', mes: 'NOVIEMBRE', primer: 6, dias: 30, diaMin: 22, x: 480, y: 770, cw: 108, ch: 60, aro: {d: 29, en: 0.8}, en: 0.2},
]);

// 3a · Escrutinio general
const b3b = S(35);
esc(b2, b3b, {fondo: 'crema'}, [
  rot(`4–7 DIC · ESCRUTINIO GENERAL (juntas${NB}provinciales)`, 330, 0.05),
  cal({y: 580, rellenos: [{d0: 4, d1: 7, en: rel(b2, 23), paso: 0.3}]}),
]);

// 3b · Resultado definitivo (mapa)
const b4 = S(40);
esc(b3b, b4, {fondo: 'crema'}, [
  rot(`4–7 DIC · ESCRUTINIO GENERAL (juntas${NB}provinciales)`, 330, 0.0),
  {tipo: 'mapaH', paises: ['es'], x: 520, y: 900, k: 70, en: 0.1},
]);

// 4 · Hito
const b5 = S(50);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`23-D · 10:00 · SE CONSTITUYEN LAS${NB}CORTES`, 330, 0.05),
  cal({rellenos: [{d0: 23, d1: 23, en: rel(b4, 41)}], aro: {d: 23, en: rel(b4, 41)}}),
  {tipo: 'contador', desde: 24, hasta: 24, dur: 0.05, sufijo: ' días', etiqueta: 'desde el 29-N', y: 1000, tamano: 90, en: 0.1, izq: 80},
]);

// 5 · Giro
const b6 = S(66);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`MÁXIMO: 25 DÍAS → 24-12 (cálculo${NB}propio)`, 330, 0.05),
  cal({rellenos: [{d0: 23, d1: 23, en: 0}], aro: {d: 24, en: rel(b5, 62)}}),
  {tipo: 'contador', desde: 25, hasta: 25, dur: 0.05, sufijo: ' días', etiqueta: 'máximo', y: 1000, tamano: 90, en: 0.1, izq: 80},
]);

// 6 · Pregunta A/B
const b7 = S(73);
esc(b6, b7, {fondo: 'crema'}, [
  rot(`¿24 DÍAS: MUCHOS${NB}O POCOS?`, 330, 0.05),
  {tipo: 'abSerie', a: 'MUCHOS', b: 'POCOS', y: 780, en: 0.5},
]);

// Cierre
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierre', frase: `¿24 DÍAS: MUCHOS${NB}O POCOS?`, tamano: 84, pulso: true}]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `VOTAS EL 29.`, y: 330, tamano: 120, en: -1},
  {tipo: 'gancho', texto: 'CORTES: EL 23‑D', y: 500, tamano: 92, en: -1},
  {tipo: 'foto', src: 'urna.jpg', x: 500, y: 1060, ancho: 880, alto: 640, foco: '50% 50%', en: -1, credito: 'Foto: Américo Toledano / Wikimedia Commons, CC BY-SA 4.0'},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'wallpaper.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR);
