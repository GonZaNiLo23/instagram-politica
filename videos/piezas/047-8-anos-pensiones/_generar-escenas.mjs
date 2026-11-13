// 047 · 8 años en cifras · Cifra 8 (gasto en vejez, % PIB). Cifras: 2018 ES 9,3 / UE 10,3; 2024 ES 10,4 (provisional) / UE 10,6; distancia 1,0 -> 0,2 (cálculo propio).
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
const N = 8;
const TINTA = '#14213D', MOST = '#F2B134';

const MAX = 12;
const barra = (etiqueta, valor, color, en, o = {}) => ({etiqueta, valor, color, en, dur: 0.05, dec: true, prefijo: '', ...o});
const GAN = `ESPAÑA 10,4${NB}% · UE 10,6${NB}%`;
const barrasG = (en) => ({tipo: 'barrasVSerie', max: MAX, base: 1120, hMax: 130, w: 200, centros: [300, 780], tamEtiqueta: 64, vivo: true, barras: [
  barra('ESPAÑA', 10.4, TINTA, en), barra('UE', 10.6, MOST, en)]});
const ganchoComp = (vivo) => [
  {tipo: 'cifraSerie', n: N, en: -1},
  {tipo: 'gancho', texto: GAN, y: 505, tamano: 104, en: -1},
  rot(`GASTO PÚBLICO EN VEJEZ · %${NB}DEL${NB}PIB · 2024`, 760, -1),
];
const b1 = S(14);
esc(0, b1, {fondo: 'crema'}, [...ganchoComp(), barrasG(-1)]);
const b2 = S(22);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`EUROSTAT · COFOG 10.2${NB}VEJEZ`, 330, 0.05),
  {tipo: 'fichaSerie', filas: [`SIN VIUDEDAD`, `NI INCAPACIDAD`], y: 700, en: rel(b1, 20) - 0.4, paso: 0.5},
]);
const b3 = S(35);
esc(b2, b3, {fondo: 'crema'}, [
  rot(`2018: 9,3${NB}% · UE 10,3${NB}%`, 330, 0.05),
  {tipo: 'barrasVSerie', max: MAX, base: 1050, hMax: 270, w: 200, centros: [300, 780], tamEtiqueta: 64, vivo: true,
    barras: [barra('ESPAÑA', 9.3, TINTA, rel(b2, 27) - 0.2), barra('UE', 10.3, MOST, rel(b2, 32) - 0.2)]},
]);
const b4 = S(47);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`2024: 10,4${NB}% · UE 10,6${NB}%`, 330, 0.05),
  {tipo: 'barrasVSerie', max: MAX, base: 1050, hMax: 270, w: 200, centros: [300, 780], tamEtiqueta: 64, vivo: true,
    barras: [barra('ESPAÑA', 10.4, TINTA, rel(b3, 39) - 0.2), barra('UE', 10.6, MOST, rel(b3, 44) - 0.2)]},
  nota([`DISTANCIA: 1,0 → 0,2${NB}PUNTOS (cálculo${NB}propio)`], 1.0),
]);
const b5 = S(56);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`ESPAÑA 2024:${NB}PROVISIONAL`, 330, 0.05),
  {tipo: 'barrasVSerie', max: MAX, base: 1050, hMax: 270, w: 200, centros: [540], tamEtiqueta: 64, vivo: true,
    barras: [barra('2024', 10.4, MOST, 0.1)]},
  {tipo: 'selloTexto', lineas: ['PROVISIONAL'], x: 380, y: 560, desde: 40, angulo: -5, tamano: 80, en: 0.7},
]);
const b6 = S(62);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`¿IMPUESTOS O${NB}COTIZACIONES?`, 330, 0.05),
  {tipo: 'abSerie', a: 'IMPUESTOS', b: 'COTIZACIONES', y: 700, en: 0.5},
]);
esc(b6, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierreSerie', siguiente: N + 1}]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [...ganchoComp(), barrasG(-1)]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
