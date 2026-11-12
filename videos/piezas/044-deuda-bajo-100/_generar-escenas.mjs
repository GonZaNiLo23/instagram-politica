// 044 · Deuda bajo el 100 % del PIB (Estándar, Economía). Genera escenas.json desde tiempos.json.
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
const NB = '\u00A0';

// Índices: 12 Agosto · 13 noventa · 22 Y(un billón) · 31 El(PIB) · 42 Si(tu sueldo) · 54 En(un año) · 59 subió · 66 Pero · 72 bajó · 77 Desde · 92 ¿Qué · 102 Síguenos
const b2 = S(12), b3 = S(31), b4 = S(54), b4b = S(66), b5 = S(77), b6 = S(92), b7 = S(102);

const G1 = {tipo: 'gancho', texto: `BAJA LA${NB}DEUDA${NB}↓`, y: 330, tamano: 110, en: -1};
const G2 = {tipo: 'gancho', texto: `SUBE LA${NB}DEUDA${NB}↑`, y: 590, tamano: 110, en: -1};

// 1 · Gancho
esc(0, b2, {fondo: 'crema', fuente: 'Banco de España, agosto 2026'}, [
  G1, G2,
  {tipo: 'flechasD', y: 1010, en: 0},
]);
// 2 · Primera prueba
esc(b2, b3, {fondo: 'crema'}, [
  {tipo: 'duoD', y: 340, paso: 270, enA: rel(b2, 13) - 0.1, enB: rel(b2, 22) - 0.1},
  {tipo: 'notas', lineas: [`Deuda de las Administraciones Públicas (PDE), agosto${NB}2026`], en: 0.3},
]);
// 3 · Qué es el PIB + ejemplo (EJEMPLO desde el inicio)
const PIB = `PIB = LO QUE PRODUCE EL${NB}PAÍS EN UN${NB}AÑO`;
esc(b3, b4, {fondo: 'crema'}, [
  rot(PIB, 330, 0.05),
  {tipo: 'ejemploP'},
  {tipo: 'sueldoCasaD', y: 800, en: 0.3, creceEn: rel(b3, 42) - 0.1},
]);
// 4a · Dato en euros
esc(b4, b4b, {fondo: 'crema'}, [
  rot(`DEUDA EN EUROS +2,9${NB}% (interanual)`, 330, 0.05),
  {tipo: 'separanD', y: 770, en: rel(b4, 59) - 0.1, enB: rel(b4, 72) - 0.1},
  {tipo: 'notas', lineas: [`Agosto 2026 frente a agosto${NB}2025`], en: 0.3},
]);
// 4b · Dato en % del PIB (la escena conserva rótulo 1 y línea)
esc(b4b, b5, {fondo: 'crema'}, [
  rot(`DEUDA EN EUROS +2,9${NB}% (interanual)`, 330, -1),
  rot(`% DEL${NB}PIB −3,1${NB}PUNTOS (interanual)`, 520, 0.05),
  {tipo: 'separanD', y: 770, en: -5, enB: rel(b4b, 72) - 0.1},
  {tipo: 'notas', lineas: [`Agosto 2026 frente a agosto${NB}2025`], en: -1},
]);
// 5 · Giro
esc(b5, b6, {fondo: 'crema'}, [
  rot(`BAJO 100${NB}%: PRIMERA VEZ DESDE FEB-2020`, 330, 0.05),
  {tipo: 'foto', src: 'bde.jpg', x: 500, y: 725, ancho: 880, alto: 290, foco: '55% 45%', zoom: [1.02, 1.12], dur: 4.2, en: 0.3, notas: ['Estimación del Banco de España (avance)'], credito: 'Foto: Sanva1959, CC BY-SA 3.0 es, Wikimedia Commons'},
  {tipo: 'bandaD', y: 940, en: 0.5, paso: 0.1, ultimoEn: rel(b5, 83) - 0.1},
]);
// 6 · Pregunta A/B + bucle con el gancho
esc(b6, b7, {fondo: 'crema'}, [
  rot(`¿EUROS O${NB}% DEL${NB}PIB?`, 330, 0.05, {tamano: 80}),
  {tipo: 'flechasD', y: 880, en: 0.2, choque: true},
]);
// 7 · Cierre
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: `¿EUROS O${NB}% DEL${NB}PIB?`, tamano: 96, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {...G1, tamano: 118}, {...G2, tamano: 118, y: 600},
  {tipo: 'flechasD', y: 1060, en: -1},
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 90, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
