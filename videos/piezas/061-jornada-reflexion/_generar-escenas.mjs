// 061 · Jornada de reflexión (flash, curiosidad). Citas: LOREG art. 51.3 y art. 53. Sábado 28-11-2026.
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
const nb = ' ';
// Índices: 7 Será · 15 Lo fija · 26 Desde ese · 41 Es el artículo 53 · 47 Curiosidad · 57 Es el nombre · 65 ¿Un día · 75 Síguenos
const b1 = S(7), b2 = S(15), b3 = S(26), b4 = S(47), b5 = S(65), b6 = S(75);

esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `SÁBADO${nb}28:`, y: 290, tamano: 120, en: -1},
  {tipo: 'gancho', texto: `SIN${nb}CAMPAÑA`, y: 430, tamano: 120, en: -1},
  {tipo: 'calendarioX', mes: '', primer: 6, dias: 30, diaMin: 23, diaMax: 29, x: 540, y: 600, cw: 112, ch: 110, fuente: 48, rellenos: [{d0: 28, d1: 28, en: 0.5}], aro: {d: 28, en: 0.5}, en: 0},
  {tipo: 'icono', nombre: 'megafono', x: 540, y: 1000, tamano: 240, en: 1.2},
]);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`00:00 · sábado 28`, 330, 0.05, {tamano: 76}),
  {tipo: 'relojH', x: 500, y: 760, r: 170, hora: 1, salto: 0.6, delta: 1, flecha: false},
  {tipo: 'icono', nombre: 'megafono', x: 250, y: 1080, tamano: 200, en: 0.2, hasta: 1.6},
  {tipo: 'icono', nombre: 'urna', x: 540, y: 1080, tamano: 200, en: 0.3, hasta: 1.9},
  {tipo: 'icono', nombre: 'cartel', x: 830, y: 1080, tamano: 200, en: 0.4, hasta: 2.2},
]);
esc(b2, b3, {fondo: 'crema'}, [
  rot(`Art. 51.3 LOREG`, 330, 0.05, {tamano: 80}),
  rot(`«Termina, en todo caso, a las cero horas del día inmediatamente anterior a la votación»`, 500, 0),
  {tipo: 'icono', nombre: 'documento', x: 440, y: 1040, tamano: 200, en: 0.4, mover: {x: 640, y: 1040, en: 0.8, dur: 4.2, arco: 50}},
]);
esc(b3, b4, {fondo: 'crema'}, [
  {tipo: 'icono', nombre: 'cartel', x: 240, y: 400, tamano: 200, en: 0.3, mover: {x: 300, y: 400, en: 1.5, dur: 7, arco: 40}},
  {tipo: 'icono', nombre: 'aspa', x: 430, y: 400, tamano: 120, en: rel(b3, 35), mover: {x: 490, y: 400, en: 1.5, dur: 7, arco: 40}},
  {tipo: 'icono', nombre: 'atril', x: 700, y: 400, tamano: 200, en: rel(b3, 36), mover: {x: 640, y: 400, en: 1.5, dur: 7, arco: 40}},
  rot(`Art. 53 LOREG: «No puede difundirse propaganda electoral ni realizarse acto alguno de campaña electoral una vez que ésta haya legalmente terminado»`, 560, 0.1),
]);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`«Reflexión»: no está en la LOREG`, 330, 0.05, {tamano: 72}),
  {tipo: 'icono', nombre: 'lupaPlaca', x: 300, y: 900, tamano: 380, en: 0.3, mover: {x: 420, y: 900, en: 0.8, dur: 3, arco: 40}},
  {tipo: 'icono', nombre: 'aspa', x: 790, y: 900, tamano: 180, en: rel(b4, 57)},
]);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`¿Sí o no?`, 330, 0.05, {tamano: 96}),
  {tipo: 'botonesTr', y: 800, en: 0.3},
]);
esc(b6, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: `¿SÍ O NO?`, cta: 'siguenos', tamano: 76, pulso: true},
]);
const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `SÁBADO${nb}28:`, y: 340, tamano: 120, en: -1},
  {tipo: 'gancho', texto: '', resalta: `SIN${nb}CAMPAÑA`, y: 490, tamano: 120, en: -1},
  {tipo: 'calendarioX', mes: '', primer: 6, dias: 30, diaMin: 23, diaMax: 29, x: 540, y: 700, cw: 112, ch: 110, fuente: 48, rellenos: [{d0: 28, d1: 28, en: 0}], aro: {d: 28, en: 0}, en: 0},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'wallpaper.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
