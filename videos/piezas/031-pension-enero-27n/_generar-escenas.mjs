// 031 · Pensión de enero y 27-N. Genera escenas.json desde tiempos.json.
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
const GANCHO = `IPC OCT 4,9${NB}% ≠ TU SUBIDA`;

const b1 = S(13), b2 = S(38), b3 = S(55), b4 = S(70), b5 = S(93), b6 = S(136), b7 = S(169), b8 = S(191);

// 1 · Gancho: sobre con zoom desde el fotograma 0, "?" que late y, a 1 s, casilla vacía
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: GANCHO, y: 340, tamano: 112, en: -1},
  {tipo: 'sobreP', y: 640, casillaEn: 1.0},
]);
// 2 · Primera prueba: 12 casillas
esc(b1, b2, {fondo: 'crema'}, [
  rot(`MEDIA DE${NB}12${NB}MESES DE${NB}INFLACIÓN`, 330, 0.05),
  rot('Pensiones contributivas', 510, 1.4),
  rot(`DIC${NB}→${NB}NOV`, 610, rel(b1, 26)),
  {tipo: 'mesesP', y: 880, en: 0.2, llenan: Array.from({length: 11}, (_, i) => r(rel(b1, 26) + 0.2 + i * 0.27)), parpadeo: rel(b1, 35)},
]);
// 2b · Contexto (3 escenas)
esc(b2, b3, {fondo: 'crema'}, [
  rot('LEY GENERAL DE LA SEGURIDAD SOCIAL', 330, 0.05),
  rot('art. 58', 510, 1.2),
  {tipo: 'libroP', x: 300, y: 700, en: 0.2},
]);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`2019: aplazada por Gobierno en${NB}funciones`, 330, 0.05),
  rot(`(RDL${NB}18/2019)`, 520, 1.0),
  {tipo: 'aplazadoP', x: 60, y: 700, en: 0.3, empuja: rel(b3, 63), cobroEn: rel(b3, 65)},
]);
esc(b4, b5, {fondo: 'crema'}, [
  {tipo: 'tlP', y: 400, hitos: [
    {tipo: 'grafica', etiqueta: `27-N${NB}·${NB}avance IPC`, en: 0.2},
    {tipo: 'urna', etiqueta: `29-N${NB}·${NB}elecciones`, en: rel(b4, 79)},
    {tipo: 'calendario', etiqueta: `15-D${NB}·${NB}dato|definitivo`, en: rel(b4, 85)},
  ]},
  {tipo: 'notas', lineas: ['INE, calendario 2026'], en: 0.2},
]);
// 3 · Cifra
esc(b5, b6, {fondo: 'crema'}, [
  rot(`OCT:${NB}1.376,1${NB}€/mes (Seguridad${NB}Social)`, 330, 0.05),
  {tipo: 'barraPensionP', y: 540, en: 0.3, segEn: rel(b5, 122), yCont: 835, directo: true},
  rot(`SI${NB}NOV${NB}=${NB}4,9${NB}%${NB}→${NB}≈${NB}3,6${NB}%`, 690, rel(b5, 108)),
  {tipo: 'selloTexto', lineas: ['CÁLCULO PROPIO,', 'NO OFICIAL'], x: 500, y: 985, tamano: 48, desde: 40, angulo: -3, en: rel(b5, 128)},
  {tipo: 'notas', lineas: ['Con datos del INE · cálculo propio'], en: 0.2},
]);
// 4 · Giro
esc(b6, b7, {fondo: 'crema'}, [
  rot(`OCT${NB}2026:${NB}4,9${NB}%${NB}(avance)`, 330, 0.05),
  rot(`DIC${NB}2025:${NB}2,9${NB}%`, 560, rel(b6, 149) - 0.1),
  {tipo: 'ipcMediaP', y0: 400, y1: 760, media: 4.2, mediaEn: rel(b6, 159), filas: [
    {y: 430, valor: 4.9, en: 0.3, color: '#F2B134'},
    {y: 650, valor: 2.9, en: rel(b6, 149), color: '#8D99AE'},
  ]},
  rot('SUBIDA = MEDIA, NO EL ÚLTIMO MES', 800, rel(b6, 159)),
  {tipo: 'selloTexto', lineas: ['NO ES LA ÚLTIMA'], x: 480, y: 1010, tamano: 52, desde: 40, angulo: -4, en: rel(b6, 162)},
]);
// 5 · Pregunta A/B
esc(b7, b8, {fondo: 'crema'}, [
  rot('¿INFLACIÓN O PARLAMENTO?', 330, 0.05),
  {tipo: 'casillaP', x: 420, y: 560, tam: 240, en: 0.2},
  {tipo: 'abSerie', a: 'INFLACIÓN', b: 'PARLAMENTO', y: 900, en: rel(b7, 177)},
]);
esc(b8, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '¿INFLACIÓN O PARLAMENTO?', tamano: 96, pulso: true},
]);

const DY = 70;
ESC.slice(1, 8).forEach((e) => e.componentes.forEach((c) => {
  if (c.tipo === 'notas') return;
  if (typeof c.y === 'number' && c.y > 330) c.y += DY;
  if (c.yCont) c.yCont += DY;
  if (c.y0) { c.y0 += DY; c.y1 += DY; c.filas.forEach((q) => q.y += DY); }
}));
const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: GANCHO, y: 330, tamano: 112, en: -1},
  {tipo: 'sobreP', y: 680, casillaEn: -5},
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 90, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
