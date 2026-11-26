// 079 · Tope del 22 % TAE al crédito (RDL 44/2026, BOE 25-11-2026)
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
const H = '‑';

// Índices: 12 Lo fija · 20 La TAE · 31 Empieza · 43 Los créditos · 57 Quedan fuera · 71 Es transitorio · 76 ¿Tope
const b1 = S(12), b2 = S(20), b3 = S(31), b3b = S(43), b4 = S(57), b4b = S(71), b5 = S(76);

// 1 · Gancho
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `TAE MÁXIMA: 22${NB}%`, y: 330, tamano: 120, en: -1},
  rot(`DESDE FEB. 2027`, 590, 0.1),
  {tipo: 'contador', desde: 0, hasta: 22, sufijo: ' %', etiqueta: 'TAE', en: -1, espera: 1, dur: 1.6, y: 730, tamano: 150, izq: 60},
  {tipo: 'productosTae', x: 600, y: 800, paso: 150, r: 58, gris: true, en: 0.3},
  {tipo: 'topeTae', y: 1000, alto: 110, en: -1, espera: 1, dur: 1.6},
  nota([`Fuente: BOE, 25${H}11${H}2026`], 0.3),
]);
// 2 · Primera prueba
esc(b1, b2, {fondo: 'crema'}, [
  rot(`Real Decreto${H}ley 44/2026`, 330, 0.05),
  rot(`BOE 25${H}11${H}2026`, 420, 0.5),
  {tipo: 'docTae', x: 360, y: 515, en: 0.1},
  {tipo: 'selloTexto', lineas: ['PENDIENTE DE', 'CONVALIDAR'], y: 960, x: 490, en: rel(b1, 17) - 0.2, desde: 40},
]);
// 2b · Contexto
esc(b2, b3, {fondo: 'crema'}, [
  rot('TAE = coste total anual', 330, 0.05),
  {tipo: 'tartaTae', y: 780, cx: 490, en: rel(b2, 28) - 0.4},
]);
// 3 · Explicación
esc(b3, b3b, {fondo: 'crema'}, [
  rot(`Desde feb. 2027 (cálculo${NB}propio)`, 330, 0.05),
  {tipo: 'lineaTae', y: 740, en: 0.2},
]);
esc(b3b, b4, {fondo: 'crema'}, [
  rot(`Revolving actuales: interés${NB}≤${NB}22${NB}%`, 330, 0.05, {hasta: 2.9}),
  rot(`Revolving = crédito que se renueva${NB}solo`, 330, 2.9),
  {tipo: 'productosTae', items: ['tarjeta'], x: 540, y: 740, r: 120, gris: false, en: 0.2},
  {tipo: 'topeTae', y: 960, alto: 100, en: 0.4, espera: 0, dur: 1.2},
]);
// 4 · Giro
esc(b4, b4b, {fondo: 'crema'}, [
  rot(`Fuera: descubiertos y alto${NB}coste`, 330, 0.05),
  {tipo: 'fueraTae', y: 760, en: 0.4},
]);
esc(b4b, b5, {fondo: 'crema'}, [
  rot('Transitorio hasta reglamento', 330, 0.05),
  {tipo: 'icono', nombre: 'relojArena', x: 540, y: 760, tamano: 420, en: 0.1, animEn: 0.3, dur: 2},
]);
// 5 · Cierre
esc(b5, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: `¿TOPE O MERCADO${NB}LIBRE?`, cta: 'siguenos', tamano: 76, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `TU PRÓXIMO CRÉDITO: TOPE DEL 22${NB}%`, y: 340, tamano: 96, en: -1},
  {tipo: 'contador', desde: 22, hasta: 22, dur: 0.05, sufijo: ' %', etiqueta: 'TAE', en: -1, y: 760, tamano: 170, izq: 60},
  {tipo: 'topeTae', y: 1010, alto: 110, en: -2, espera: 0, dur: 0.1},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 80, musica: {pista: 'wallpaper.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
