// 050 · 8 años en cifras · Cifra 10 (Ceuta: los dos días que no suman). Genera escenas.json desde tiempos.json.
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
const NB = ' ';
const N = 10;

const gancho = [
  {tipo: 'cifraSerie', n: N, en: -1},
  {tipo: 'gancho', texto: `ENTRARON EN CEUTA`, y: 500, tamano: 120, en: -1},
  {tipo: 'contadorCeuta', x: 60, y: 880, tam: 130, grisEn: 2.5},
  {tipo: 'mapaCeuta', x: 650, y: 800, sc: 0.8, en: -1},
  rot(`Cifra del presidente, 3-9`, 1040, -1),
  rot(`hay estimaciones mayores`, 1110, -1, {tamano: 64}),
];

// 1 · Gancho (hasta "Interior")
const b1 = S(13);
esc(0, b1, {fondo: 'crema'}, gancho);
// 2 · Primera prueba
const b2 = r(S(26) + 0.3);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`Informe de Interior (31-7)`, 330, 0.05),
  rot(`"no incluyen cifras del día 30 y 31 de${NB}julio"`, 500, 0.7),
  {tipo: 'calendarioCeuta', y: 930, en: 0.3, fuera: rel(b1, 24)},
]);
// 3 · Análisis específico
const b3 = S(34);
esc(b2, b3, {fondo: 'crema'}, [
  rot(`Interior, informes de agosto: "análisis${NB}específico"`, 330, 0.05),
  {tipo: 'informeCeuta', y: 790, en: 0.2, resalta: rel(b2, 31) - 0.3},
  {tipo: 'huecoCeuta', texto: '30–31 julio', y: 1090 - 0, ancho: 880, alto: 110, en: 0.5, xEn: rel(b2, 32)},
]);
// 4 · Frontex
const b4 = S(43);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`Frontex = agencia UE de${NB}fronteras`, 330, 0.05),
  {tipo: 'huecoCeuta', texto: 'Frontex: 30–31 julio', y: 640, ancho: 880, alto: 130, en: 0.3, xEn: rel(b3, 40)},
  {tipo: 'mapaCeuta', x: 360, y: 900, en: 0.5},
]);
// 5 · Sánchez
const b5 = S(53);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`Sánchez (3-9):`, 330, 0.05),
  rot(`"más del 90${NB}%"`, 430, 0.05),
  rot(`volvió en 72${NB}h`, 540, rel(b4, 49) - 0.3),
  {tipo: 'barra90Ceuta', y: 800, en: rel(b4, 44) - 0.1, vuelta: rel(b4, 49) + 0.3},
]);
// 6 · Frontex e Interior sin los días
const b6 = S(65);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`Frontex, 13-11: sin el 30–31 de${NB}julio`, 330, 0.05),
  rot(`Interior a 31-10: sin esos días (según${NB}Euronews)`, 560, 2.4),
  {tipo: 'casillaXCeuta', filas: ['Frontex 13-11', 'Interior 31-10 (Euronews)'], y: 920, en: 0.3, paso: 1.5},
]);
// 7a · Pregunta A/B
const b7 = S(74);
esc(b6, b7, {fondo: 'crema'}, [
  rot(`¿Se suman… o van${NB}aparte?`, 330, 0.05),
  {tipo: 'abSerie', a: 'SUMAN', b: 'APARTE', y: 780, en: 0.7},
]);
// 7b · Cierre
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierreSerie', siguiente: N + 1}]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: gancho}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
