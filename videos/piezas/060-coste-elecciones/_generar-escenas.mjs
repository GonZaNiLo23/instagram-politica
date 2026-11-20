// 060 · Coste de las elecciones: ~270 M€ (estimación base 2023, Euronews), 0,81 €/voto y 21.167,64 €/escaño (Orden HAC/1062/2026), 7 €/elector (cálculo propio).
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
const nota = (lineas, en = 0.2, y) => ({tipo: 'notas', lineas, en, tamano: 40, ...(y ? {y} : {})});
const NB = ' ';
// Índices: 9 Un partido · 23 Y más · 31 Si no · 39 Pero · 47 En dos mil · 59 Total · 67 Respuesta · 73 Síguenos
const b1 = S(9), b2 = S(23), b3 = S(31), b4 = S(39), b5 = S(47), b6 = S(59), b7 = S(67), b8 = S(73);

const ganchoComp = [
  {tipo: 'gancho', texto: `VOTAR COSTARÁ`, y: 340, tamano: 92, en: -1},
  {tipo: 'icono', nombre: 'urnaSin', x: 330, y: 650, tamano: 300, en: -1},
  {tipo: 'icono', nombre: 'hucha', x: 740, y: 650, tamano: 260, en: -1, animEn: 0},
  {tipo: 'contador', desde: 0, hasta: 270, dur: 3.4, prefijo: '+', sufijo: ` M€`, etiqueta: 'ESTIMACIÓN', y: 830, tamano: 150, en: -1},
];
esc(0, b1, {fondo: 'crema'}, [...ganchoComp, nota([`ESTIMACIÓN · base 2023 (Euronews)`], 2.0)]);
esc(b1, b2, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `0,81${NB}€`, y: 330, tamano: 150, en: 0.05},
  rot(`POR VOTO AL CONGRESO`, 540, 0.15),
  {tipo: 'icono', nombre: 'papeletaSin', x: 540, y: 900, tamano: 380, en: 0.3},
  {tipo: 'selloTexto', lineas: ['DATO'], x: 600, y: 1030, desde: 40, angulo: -6, tamano: 84, en: rel(b1, 14)},
  nota([`Orden HAC/1062/2026, art. 1.b · BOE 8-10-2026`], 0.4),
]);
esc(b2, b3, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `+21.167,64${NB}€`, y: 330, tamano: 120, en: 0.05},
  rot(`POR ESCAÑO`, 540, 0.15),
  {tipo: 'icono', nombre: 'congreso', x: 540, y: 900, tamano: 380, en: 0.3},
  nota([`art. 1.a`], 0.4),
]);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`SIN DIPUTADOS,`, 330, 0.05, {tamano: 72}),
  rot(`NO COBRA POR VOTO`, 450, rel(b3, 34) - 0.4, {tamano: 72}),
  {tipo: 'gancho', texto: `0${NB}€`, y: 600, tamano: 240, en: 0.4},
  {tipo: 'icono', nombre: 'urnaSin', x: 540, y: 960, tamano: 300, en: 0.6},
  nota([`Orden HAC/1062/2026, art. 1.b`], 0.5),
]);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`EL GRUESO: LOGÍSTICA`, 330, 0.05),
  {tipo: 'icono', nombre: 'urnaSin', x: 540, y: 800, tamano: 420, en: 0.3},
  nota([`Estimación basada en 2023`], 0.4),
]);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`CORREOS 2023: +100${NB}M€ (estimación)`, 330, 0.05),
  {tipo: 'icono', nombre: 'carpetas', x: 540, y: 900, tamano: 380, en: 0.3},
  {tipo: 'selloTexto', lineas: ['ESTIMACIÓN'], x: 560, y: 1040, desde: 40, angulo: -5, tamano: 60, en: rel(b5, 51)},
  nota([`Euronews, 8-10-2026`], 0.4),
]);
esc(b6, b7, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `≈ 7${NB}€`, y: 330, tamano: 180, en: 0.05},
  rot(`POR ELECTOR`, 560, 0.15),
  rot(`38.728.356 ELECTORES (INE)`, 700, rel(b6, 62) - 0.2, {tamano: 56}),
  {tipo: 'icono', nombre: 'hucha', x: 340, y: 950, tamano: 300, en: 0.5},
  {tipo: 'selloTexto', lineas: ['CÁLCULO', 'PROPIO'], x: 620, y: 900, desde: 40, angulo: -5, tamano: 64, en: rel(b6, 64)},
  nota([`270 M€ ÷ 38.728.356 electores`], 0.4),
]);
esc(b7, b8, {fondo: 'crema'}, [
  rot(`¿QUIÉN COBRA?`, 330, 0.05, {tamano: 80}),
  rot(`QUIEN LOGRA DIPUTADOS`, 520, rel(b7, 69) - 0.2, {tamano: 72}),
  {tipo: 'icono', nombre: 'urnaSin', x: 540, y: 900, tamano: 400, en: 0.3},
]);
esc(b8, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: `¿QUIÉN COBRA?`, cta: 'siguenos', tamano: 76, pulso: true},
]);
const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `VOTAR CUESTA`, y: 340, tamano: 92, en: -1},
  {tipo: 'gancho', texto: '', resalta: `+270${NB}MILLONES`, y: 480, tamano: 92, en: -1},
  {tipo: 'icono', nombre: 'urnaSin', x: 540, y: 900, tamano: 340, en: -1},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
