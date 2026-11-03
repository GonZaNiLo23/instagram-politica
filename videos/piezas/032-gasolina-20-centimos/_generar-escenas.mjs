// 032 · Gasolina -20 cts. Genera escenas.json desde tiempos.json.
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
const NB = '\u00A0';
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});

const b1 = S(16), b2 = S(26), b3 = S(45), b4 = S(56), b5 = S(64), b6 = S(74), b7 = S(80);

// 1 · Gancho (movimiento desde el fotograma 0)
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `-20${NB}cts de impuesto por litro`, y: 330, tamano: 110, en: -1},
  rot(`Gasolina y diésel · noviembre${NB}2026`, 690, -1),
  {tipo: 'surtidorG', x: 60, y: 870, esc: 0.68, zoom: true, texto: '20 cts', tacha: 0.5},
  {tipo: 'ipcG', x: 440, y: 930, texto: `4,9${NB}%`, etiqueta: 'IPC', en: 1.2, pulsos: [2.6, 3.6, 4.6]},
  {tipo: 'notas', lineas: ['Fuente: Agencia Tributaria'], en: 0},
]);
// 2 · Primera prueba
esc(b1, b2, {fondo: 'crema'}, [
  {tipo: 'ejemploP'},
  rot(`50${NB}l × 0,20${NB}€ = 10${NB}€`, 400, -1),
  {tipo: 'surtidorG', x: 60, y: 780, esc: 0.8, en: -1, litros: {en: rel(b1, 19) - 0.3, dur: 1.9, hasta: 50}},
  {tipo: 'monedasG', x: 440, y: 800, n: 10, en: rel(b1, 21), paso: 0.17},
  {tipo: 'notas', lineas: ['Cálculo propio'], en: 0},
]);
// 2b · Contexto
esc(b2, b3, {fondo: 'crema'}, [
  rot('Impuesto sobre Hidrocarburos', 330, 0.05),
  rot(`Noviembre${NB}2026`, 490, 0.3),
  rot(`IMPUESTO ≠ PRECIO${NB}FINAL`, 650, rel(b2, 38) - 0.1),
  {tipo: 'precioG', x: 60, y: 860, en: 0.4, resalta: rel(b2, 30)},
  {tipo: 'notas', lineas: ['AEAT, 20-10-2026'], en: 0.2},
]);
// 3 · INE
esc(b3, b5, {fondo: 'crema'}, [
  {tipo: 'filaIneG', y: 350, sube: false, iconos: ['surtidor'], en: 0.1},
  rot(`Carburantes: bajan más que en${NB}oct.${NB}2025`, 350, 0.2, {izq: 440, ancho: 520}),
  {tipo: 'filaIneG', y: 800, sube: true, iconos: ['gas'], en: rel(b3, 56)},
  rot('Gas y combustibles líquidos: suben', 800, rel(b3, 56) + 0.1, {izq: 440, ancho: 520}),
  {tipo: 'notas', lineas: ['INE, IPC adelantado octubre 2026 (30-10)'], en: 0.2},
]);
// 4 · Giro
esc(b5, b6, {fondo: 'crema'}, [
  rot(`IPC general: sept.${NB}4,9${NB}%${NB}→${NB}oct.${NB}4,9${NB}%`, 330, 0.05),
  rot(`Subyacente: 3,1${NB}%`, 560, 1.0),
  rot('Dato adelantado', 650, 1.5),
  {tipo: 'barrasIgualG', x: 80, base: 1170, en: 0.5, valor: 4.9, etiquetas: ['SEPT.', 'OCT.']},
  {tipo: 'ipcG', x: 570, y: 860, tam: 96, texto: `4,9${NB}%`, etiqueta: 'IPC', en: 1.5},
  {tipo: 'selloTexto', lineas: ['IGUAL'], x: 690, y: 1090, tamano: 64, desde: 40, en: 2.0, angulo: -5},
]);
// 5 · Cierre: pregunta
esc(b6, b7, {fondo: 'crema'}, [
  rot('¿LOS NOTAS AL REPOSTAR?', 330, 0.05),
  {tipo: 'surtidorG', x: 60, y: 780, esc: 0.8, en: -1, texto: '20 cts', tacha: -5},
  {tipo: 'interrogaG', x: 520, y: 760, en: 0.3},
]);
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '¿LOS NOTAS AL REPOSTAR?', tamano: 96, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `-20${NB}cts de impuesto por litro`, y: 330, tamano: 110, en: -1},
  {tipo: 'surtidorG', x: 60, y: 830, esc: 0.75, en: -1, texto: '20 cts', tacha: -5},
  {tipo: 'ipcG', x: 440, y: 930, texto: `4,9${NB}%`, etiqueta: 'IPC', en: -1},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 90, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
