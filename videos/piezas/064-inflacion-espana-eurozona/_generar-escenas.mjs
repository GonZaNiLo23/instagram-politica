// 064 · IPCA octubre 2026 (Eurostat 18-11-2026): ES 4,9 (5,0), DE 2,9 (3,3), IT 5,6 (4,2), FR 3,7, EZ 4,0, energía 1,89 pp.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T.duracion + 2.4);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.2) => ({tipo: 'notas', lineas, en, tamano: 40});
const NB = ' ';
const TINTA = '#14213D', MOST = '#F2B134', PIE = '#8A8F98';
const H = (filas, y0, alto, o = {}) => ({tipo: 'barrasHSerie', vivo: true, filas, max: 6, paso: 2, y0, alto, x0: 110, largo: 760, dur: 0.9, tamano: 64, ...o});
const fila = (etiqueta, valor, color, en, o = {}) => ({etiqueta, valor, color, en, ...o});

// Índices: 13 Italia · 17 Francia · 21 Eurozona · 25 Tasas · 32 En la eurozona · 44 Por qué · 56 Ojo · 65 En octubre · 70 ¿Dónde · 82 Síguenos
const b1 = S(13), b2 = S(25), b3 = S(32), b4 = S(44), b5 = S(56), b5b = S(65) - 0.1, b6 = S(70), b7 = S(82);

// 1 · Gancho
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `ESPAÑA${NB}4,9${NB}%`, y: 320, tamano: 100, en: -1},
  {tipo: 'gancho', texto: `ALEMANIA${NB}2,9${NB}%`, y: 440, tamano: 100, en: -1},
  H([fila('ESPAÑA', 4.9, MOST, -1, {dur: 1.0}), fila('ALEMANIA', 2.9, TINTA, -1, {dur: 1.0})], 640, 190, {dur: 1.0}),
  nota([`Inflación anual (IPCA) · octubre 2026`, `· Eurostat`], 0.2),
]);
// 2 · Primera prueba
esc(b1, b2, {fondo: 'crema'}, [
  H([
    fila(`ESPAÑA 4,9${NB}%`, 4.9, MOST, -1, {dur: 0.05}),
    fila(`ALEMANIA 2,9${NB}%`, 2.9, TINTA, -1, {dur: 0.05}),
    fila(`ITALIA 5,6${NB}%`, 5.6, PIE, 0.1),
    fila(`FRANCIA 3,7${NB}%`, 3.7, PIE, rel(b1, 17) - 0.1),
    fila(`EUROZONA 4,0${NB}%`, 4.0, TINTA, rel(b1, 21) - 0.1),
  ], 340, 140),
  nota([`Tasa anual, octubre 2026`], 0.3),
]);
// 2b · Contexto
esc(b2, b3, {fondo: 'crema'}, [
  rot(`TASA ANUAL ≠${NB}NIVEL DE PRECIOS`, 330, 0.05),
  H([fila(`EUROZONA 4,0${NB}%`, 4.0, TINTA, -1, {dur: 0.05})], 700, 190),
  nota([`Eurostat, 18-11-2026`], 0.4),
]);
// 3a · Energía
esc(b3, b4, {fondo: 'crema'}, [
  rot(`ENERGÍA: 1,89${NB}PUNTOS`, 330, 0.05),
  H([
    fila(`ENERGÍA 1,89`, 1.89, MOST, 0.3),
    fila(`RESTO 2,11`, 2.11, TINTA, rel(b3, 38)),
  ], 560, 180),
  nota([`Mide cuánto suben los precios,`, `no cuáles son más altos`], 0.6),
]);
// 3b · El hueco
esc(b4, b5, {fondo: 'crema'}, [
  rot(`¿POR QUÉ +0,9? EUROSTAT NO${NB}LO${NB}DICE`, 330, 0.05),
  H([
    fila(`EUROZONA 4,0${NB}%`, 4.0, TINTA, -1, {dur: 0.05}),
    fila(`ESPAÑA 4,9${NB}%`, 4.9, MOST, -1, {dur: 0.05}),
  ], 560, 180),
  {tipo: 'selloTexto', lineas: ['?'], x: 820, y: 590, desde: 40, angulo: -5, tamano: 150, en: rel(b4, 46)},
  nota([`0,9 puntos más que la eurozona`], 0.6),
]);
// 4a · Giro: septiembre
esc(b5, b5b, {fondo: 'crema'}, [
  rot(`ITALIA: 4,2${NB}% → 5,6${NB}%`, 330, 0.05),
  H([
    fila(`ITALIA 4,2${NB}%`, 4.2, MOST, 0.2),
    fila(`ESPAÑA 5,0${NB}%`, 5.0, PIE, 0.5),
    fila(`ALEMANIA 3,3${NB}%`, 3.3, PIE, 0.8),
  ], 520, 190),
  nota([`Septiembre → octubre (tasa anual)`], 0.3),
]);
// 4b · Giro: octubre
esc(b5b, b6, {fondo: 'crema'}, [
  rot(`ITALIA: 4,2${NB}% → 5,6${NB}%`, 330, -1),
  H([
    fila(`ITALIA 5,6${NB}%`, 5.6, MOST, -1, {dur: 0.7}),
    fila(`ESPAÑA 4,9${NB}%`, 4.9, PIE, -1, {dur: 0.05}),
    fila(`ALEMANIA 2,9${NB}%`, 2.9, PIE, -1, {dur: 0.05}),
  ], 520, 190, {dur: 0.7}),
  nota([`Septiembre → octubre (tasa anual)`], -1),
]);
// 5a · Pregunta
esc(b6, b7, {fondo: 'crema'}, [
  rot(`¿SÚPER O${NB}LUZ?`, 330, 0.05, {tamano: 72}),
  {tipo: 'abSerie', a: 'SÚPER', b: 'LUZ', y: 700, en: 0.3},
]);
// 5b · Cierre
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: `¿SÚPER O${NB}LUZ?`, cta: 'siguenos', tamano: 76, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `ESPAÑA${NB}4,9${NB}%`, y: 340, tamano: 100, en: -1},
  {tipo: 'gancho', texto: `ALEMANIA${NB}2,9${NB}%`, y: 460, tamano: 100, en: -1},
  H([fila('ESPAÑA', 4.9, MOST, -1, {dur: 0.05}), fila('ALEMANIA', 2.9, TINTA, -1, {dur: 0.05})], 700, 190, {dur: 0.05}),
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
