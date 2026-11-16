// 054 · Audiencias de los cara a cara (Barlovento/Kantar vía EFE). Flash ~34 s.
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
const H = (filas, y0, alto) => ({tipo: 'barrasHSerie', vivo: true, filas, max: 16, paso: 4, sufijoEje: ' M', y0, alto, x0: 110, largo: 760, dur: 0.9, tamano: 64});
const B08 = (en) => f('2008', 13, TINTA, en);
const B23 = (en) => f('2023', 5.9, MOST, en);

const gancho = [
  {tipo: 'gancho', texto: `13${NB}M`, y: 320, tamano: 130, en: -1},
  {tipo: 'gancho', texto: `5,9${NB}M`, y: 520, tamano: 130, en: rel(0, 10) - 0.1},
  rot('Audiencia media', 700, -1),
  H([B08(0.1), B23(rel(0, 10) - 0.1)], 800, 150),
  nota(['Fuente: Barlovento/Kantar vía EFE'], -1),
];
const b1 = S(13);
esc(0, b1, {fondo: 'crema'}, gancho);
const b2 = S(24);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`25-2-2008`, 330, 0.05),
  rot(`>13${NB}M (59,1${NB}%)`, 450, 0.3),
  H([B08(-1)], 700, 190),
]);
const b3 = S(41);
esc(b2, b3, {fondo: 'crema'}, [
  rot(`11-7-2023`, 330, 0.05),
  rot(`5,9${NB}M (46,5${NB}%)`, 450, 0.3),
  H([B08(-1), B23(0.1)], 740, 160),
  rot(`Menos visto de los 7 en${NB}TV`, 570, rel(b2, 33) - 0.1),
]);
const b4 = S(53);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`NO COMPARABLE SIN${NB}MATIZ`, 330, 0.05),
  {tipo: 'fichaSerie', filas: [`2008: 22${NB}cadenas`, `2023: 2 (Antena${NB}3 y${NB}La${NB}Sexta)`], y: 620, ancho: 880, tam: 52, en: rel(b3, 46) - 0.2},
  nota(['Medición y hábitos distintos'], 3.0),
]);
const b5 = S(69);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`2023: 11,4${NB}M al menos 1${NB}min`, 330, 0.05),
  H([f(`MEDIA 5,9${NB}M`, 5.9, MOST, -1), f(`≥ 1 MIN 11,4${NB}M`, 11.4, TINTA, 0.3)], 620, 170),
  nota(['≈1,9 veces'], rel(b4, 63) - 0.1),
]);
const b6 = S(75);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`Jueves 19-11`, 330, 0.05),
  rot(`Señal de la Academia de${NB}TV`, 450, 0.3),
  H([B08(-1), B23(-1)], 800, 150),
]);
esc(b6, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierre', frase: '¿Lo verás en la tele o en el móvil?', cta: 'siguenos', tamano: 72, pulso: true}]);
const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `13${NB}M`, y: 320, tamano: 130, en: -1},
  {tipo: 'gancho', texto: `5,9${NB}M`, y: 520, tamano: 130, en: -1},
  rot('Audiencia media', 700, -1),
  H([B08(-1), B23(-1)], 800, 150)]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'wallpaper.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
