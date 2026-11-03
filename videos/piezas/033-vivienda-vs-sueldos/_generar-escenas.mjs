// 033 · Vivienda vs. sueldos (flash, Economía). Genera escenas.json desde tiempos.json (tiempos reales de palabra).
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
const NB = ' ';

// Índices de palabra: 13 Imagina · 31 nueve · 37 diez · 40 ¿Se · 45 íne · 50 comprar · 51 no · 53 alquilar · 54 Trabajo · 62 La · 64 frena · 65 era · 74 cuadruplica · 80 ¿Comprarías · 84 Síguenos
const b1 = S(13), b2 = S(40), b3 = S(54), b3b = S(54), b4 = S(62), b5 = S(80), b6 = S(84);

// ===== 1 · Gancho (movimiento desde el fotograma 0) =====
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `CASA +12,2${NB}%`, y: 320, tamano: 104, en: -1},
  rot(`SUELDOS PACTADOS +3,01${NB}%`, 450, -1),
  {tipo: 'barrasCasa', base: 1100, k: 22, creceCasa: 0.4, creceSueldo: 3.2, pulsoEn: 1.2},
  {tipo: 'notas', lineas: ['Compra, INE · Convenios hasta junio, Trabajo'], en: -1},
]);
// ===== 2 · Primera prueba =====
esc(b1, b2, {fondo: 'crema'}, [
  {tipo: 'ejemploP'},
  rot(`Casa: 9,8 →${NB}10,7 años de${NB}sueldo`, 330, rel(b1, 31) - 0.1),
  {tipo: 'ejemploCasa', y: 760, yFila: 1060, en: rel(b1, 15) - 0.1, llena9: rel(b1, 31), llena10: rel(b1, 37), enBillete: rel(b1, 21) - 0.1, enSlots: rel(b1, 28)},
  {tipo: 'notas', lineas: ['Cálculo propio con datos de INE y Trabajo'], en: 0.2},
]);
// ===== 3a · Qué compara: INE =====
esc(b2, b3, {fondo: 'crema'}, [
  {tipo: 'barrasCasa', base: 1100, k: 24, creceCasa: 0.01, creceSueldo: 0.01, signo: 0.2, hasta: rel(b2, 44) , iconos: true},
  rot('INE: precio de compra,', 330, rel(b2, 44)),
  rot(`2.º trim. 2026 (no${NB}alquiler)`, 415, rel(b2, 44)),
  {tipo: 'compraCasa', y: 700, enCompra: rel(b2, 50) - 0.2, enAlquiler: rel(b2, 51) - 0.1},
]);
// ===== 3b · Qué compara: Trabajo =====
esc(b3, b4, {fondo: 'crema'}, [
  rot(`TRABAJO: convenios hasta${NB}junio${NB}2026`, 330, 0.05),
  rot(`Dos medidas distintas, mismo${NB}corte:${NB}junio`, 520, rel(b3, 57) - 0.1),
  {tipo: 'corteCasa', y: 900, en: 0.4},
]);
// ===== 4 · Giro =====
esc(b4, b5, {fondo: 'crema'}, [
  {tipo: 'barrasCasa', base: 1100, k: 30, casaDe: 12.9, valCasa: 12.2, bajaEn: rel(b4, 64), bajaDur: 0.9, sueldosEn: rel(b4, 72), creceSueldo: 0.5, copias: {en: rel(b4, 74), paso: 0.5}, iconos: false},
  rot(`12,9${NB}% →${NB}12,2${NB}%`, 330, rel(b4, 65) - 0.1, {tamano: 96}),
  rot(`(1.er →${NB}2.º trim.)`, 450, rel(b4, 65) - 0.1),
  rot(`≈ 4 veces (cálculo${NB}propio)`, 590, rel(b4, 74) - 0.1),
]);
// ===== 5 · Pregunta A/B =====
esc(b5, b6, {fondo: 'crema'}, [
  rot('¿COMPRAR O ALQUILAR?', 330, 0.05, {tamano: 80}),
  {tipo: 'abSerie', a: 'COMPRAR', b: 'ALQUILAR', y: 560, en: 0.35},
  {tipo: 'barrasCasa', base: 1100, k: 20, creceCasa: 0.01, creceSueldo: 0.01, iconos: false},
]);
// ===== 6 · Cierre =====
esc(b6, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '¿COMPRAR O ALQUILAR?', tamano: 96, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `CASA +12,2${NB}%`, y: 340, tamano: 104, en: -1},
  rot(`SUELDOS PACTADOS +3,01${NB}%`, 490, -1),
  {tipo: 'barrasCasa', base: 1120, k: 22, creceCasa: 0.01, creceSueldo: 0.01},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 90, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
