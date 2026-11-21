// 063 · Salarios de convenio vs IPC: convenios 3,06 % (Trabajo, hasta oct.), IPC oct. 4,9 %, media ene-oct 3,5 % (cálculo propio),
// firmados 2026 3,60 %, años anteriores 2,91 %, 3.162 convenios, 9,58 M trabajadores, hueco 1,84 pp.
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
const TINTA = '#14213D', MOST = '#F2B134';
const MAX = 6, BASE = 1100, HMAX = 400;
const bar = (etiqueta, valor, color, en, o = {}) => ({etiqueta, valor, color, en, dur: 0.05, dec: 2, prefijo: '', ...o});
const V = (extra) => ({tipo: 'barrasVSerie', max: MAX, base: BASE, hMax: HMAX, w: 200, tamEtiqueta: 64, vivo: true, ...extra});
const L35 = (en) => ({valor: 3.5, en, color: '#14213D'});
const L49 = (en) => ({valor: 4.9, en});

// Índices: 10 Los convenios · 17 Los precios · 25 De enero · 38 Y depende · 44 Los firmados · 53 Los de años · 62 ¿Se firmó · 68 Síguenos
const b1 = S(10), b2 = S(25), b3 = S(38), b4 = S(44), b5 = S(53), b6 = S(62) - 0.3, b7 = S(68);

// 1 · Gancho
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: '¿TU CONVENIO SUBE MENOS?', y: 320, tamano: 104, en: -1},
  V({centros: [290, 730], barras: [
    {etiqueta: 'CONVENIOS', valor: 3.06, color: TINTA, en: -1, dur: 1.0, sinValor: true},
    {etiqueta: 'PRECIOS', valor: 4.9, color: MOST, en: 1.2, dur: 0.6, sinValor: true},
  ]}),
  nota([`Convenios registrados hasta octubre (Trabajo)`, `· IPC de octubre (INE)`], 0.2),
]);
// 2 · Primera prueba
esc(b1, b2, {fondo: 'crema'}, [
  rot(`SUBIDA PACTADA +3,06${NB}%`, 330, 0.05),
  rot(`IPC OCT. +4,9${NB}%`, 520, rel(b1, 17) - 0.1),
  V({centros: [290, 730], barras: [
    bar('CONVENIOS', 3.06, TINTA, 0.1),
    bar('PRECIOS', 4.9, MOST, rel(b1, 22) - 0.1, {dec: 1}),
  ], flecha: {barra: 0, hasta: 4.9, en: rel(b1, 22) + 0.3, dx: 220, dy0: 0}}),
  nota([`9,58 M de trabajadores`, `Hueco con octubre: 1,84 puntos (cálculo propio)`], 1.4),
]);
// 3 · La media del año
esc(b2, b3, {fondo: 'crema'}, [
  rot(`IPC MEDIO ENE–OCT: 3,5${NB}%`, 330, 0.05),
  V({centros: [290, 730], lineasRef: [L35(rel(b2, 33) - 0.2), L49(rel(b2, 28) - 0.2)], barras: [
    bar('CONVENIOS', 3.06, TINTA, -1, {sinValor: true}),
    bar('PRECIOS', 4.9, MOST, -1, {dec: 1}),
  ]}),
  nota([`(cálculo propio)`, `Octubre, la tasa más alta del año`], rel(b2, 26)),
]);
// 4a · Giro
esc(b3, b4, {fondo: 'crema'}, [
  rot(`3.162 convenios${NB}en${NB}total`, 330, 0.05),
  V({centros: [290, 730], lineasRef: [L35(-1), L49(-1)], barras: [
    bar('CONVENIOS', 3.06, TINTA, -1, {sinValor: true}),
    bar('', 0, TINTA, 99, {sinValor: true}),
  ]}),
]);
// 4b · Los dos grupos
esc(b4, b6, {fondo: 'crema'}, [
  rot(`FIRMADOS EN${NB}2026: +3,60${NB}%`, 330, 0.05),
  rot(`DE AÑOS ANTERIORES: +2,91${NB}%`, 520, rel(b4, 53) - 0.1),
  V({centros: [290, 740], lineasRef: [L35(-1), L49(-1)], barras: [
    bar('EN 2026', 3.6, MOST, 0.15, {sinValor: true}),
    bar('ANTERIORES', 2.91, TINTA, rel(b4, 55) - 0.2, {sinValor: true}),
  ]}),
]);
// 5a · Pregunta
esc(b6, b7, {fondo: 'crema'}, [
  rot(`¿SE FIRMÓ EL TUYO ESTE${NB}AÑO?`, 330, 0.05, {tamano: 72}),
  {tipo: 'abSerie', a: 'SÍ', b: 'NO', c: 'NO LO SÉ', y: 700, en: 0.3},
  nota(['Fuentes en la descripción'], 0.4),
]);
// 5b · Cierre
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: `¿SE FIRMÓ EL TUYO${NB}ESTE${NB}AÑO?`, cta: 'siguenos', tamano: 76, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: '¿TU CONVENIO SUBE MENOS?', y: 340, tamano: 104, en: -1},
  V({base: 1150, hMax: 330, centros: [290, 730], barras: [
    {etiqueta: 'CONVENIOS', valor: 3.06, color: TINTA, en: -1, dur: 0.05, sinValor: true},
    {etiqueta: 'PRECIOS', valor: 4.9, color: MOST, en: -1, dur: 0.05, sinValor: true},
  ]}),
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
