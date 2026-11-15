// 051 · IPC octubre 2026 (INE 13-11): inflación 4,9 %, comida 2,4 %, vivienda 7,6 %, transporte 10,3 %, subyacente 3,1 %.
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
const TINTA = '#14213D', MOST = '#F2B134', TEJA = '#C8553D';
const f = (etiqueta, valor, color, en) => ({etiqueta, valor, color, en});
const H = (filas, y0, alto) => ({tipo: 'barrasHSerie', vivo: true, filas, max: 12, paso: 4, y0, alto, x0: 110, largo: 760, dur: 0.9, tamano: 64});
const INF = (en) => f(`INFLACIÓN 4,9${NB}%`, 4.9, TINTA, en);
const COM = (en) => f(`COMIDA 2,4${NB}%`, 2.4, MOST, en);

const gancho = [
  {tipo: 'gancho', texto: `INFLACIÓN 4,9${NB}%`, y: 320, tamano: 110, en: -1},
  {tipo: 'gancho', texto: `COMIDA 2,4${NB}%`, y: 570, tamano: 110, en: -1},
  rot(`Tasa anual · octubre${NB}2026 · INE`, 690, -1),
  H([INF(-1), COM(0.1)], 920, 130),
  nota(['Comida = alimentos y bebidas sin alcohol'], -1),
  {tipo: 'selloTexto', lineas: ['?'], x: 760, y: 850, desde: 40, angulo: -5, tamano: 150, en: rel(0, 11) - 0.05},
];
const b1 = S(14);
esc(0, b1, {fondo: 'crema'}, gancho);
const b2 = S(22);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`Tasa anual de cada grupo (INE,${NB}13-11)`, 330, 0.05),
  H([INF(-1), COM(-1), f(`VIVIENDA 7,6${NB}%`, 7.6, TEJA, rel(b1, 14) - 0.1), f(`TRANSPORTE 10,3${NB}%`, 10.3, TEJA, rel(b1, 18) - 0.1)], 500, 140),
]);
const b3 = S(31) + 1.0;
esc(b2, b3, {fondo: 'crema'}, [
  rot(`VIVIENDA: LA SUBIDA DEL${NB}GAS`, 330, 0.05),
  nota([`Más que en octubre de 2025 (INE)`], 0.9),
  {tipo: 'filaIneG', y: 600, x: 120, sube: true, iconos: ['gas'], en: 0.2},
  H([f(`VIVIENDA 7,6${NB}%`, 7.6, TEJA, -1)], 950, 150),
]);
const b4 = S(45);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`SUBYACENTE 3,1${NB}%`, 330, 0.05),
  rot(`Sin energía ni alimentos no${NB}elaborados`, 450, rel(b3, 34) - 0.3),
  H([INF(-1), f(`SUBYACENTE 3,1${NB}%`, 3.1, MOST, rel(b3, 36) - 0.1)], 600, 160),
]);
const b5 = S(52);
esc(b4, b5, {fondo: 'crema'}, [
  rot('Tu inflación depende de en qué gastas'.slice(0,0)+'SUBYACENTE 3,1 %', 330, -1),
  H([INF(-1), f('SUBYACENTE 3,1 %', 3.1, MOST, -1)], 600, 160),
]);
const b6 = S(59);
esc(b5, b6, {fondo: 'crema'}, [
  rot('¿COMIDA O VIVIENDA?', 330, 0.05),
  {tipo: 'abSerie', a: 'COMIDA', b: 'VIVIENDA', y: 700, en: 0.4},
]);
esc(b6, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierre', frase: '¿COMIDA O VIVIENDA?', cta: 'siguenos', tamano: 80, pulso: true}]);
const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: gancho.slice(0, 4)}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
