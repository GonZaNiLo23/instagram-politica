// 055 · Cinco días sin encuestas. Lee tiempos.json y escribe escenas.json.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T0 = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T0.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T0.duracion + 2.4);
const NB = ' ';
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const dib = (nombre, x, y, tamano, en, o = {}) => ({tipo: 'dib', nombre, x, y, tamano, en, ...o});

// 1 · Gancho
const b1 = S(14);
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `PUBLICAR ENCUESTAS: ILEGAL 5${NB}DÍAS`, y: 330, tamano: 110, en: -1},
  {tipo: 'barrasE', x0: 120, col: 0, escala: 7, alto: 75, eje: true, filas: [
    {etiqueta: '', valor: 90, texto: '', y: 740, en: 0.05, dur: 0.5},
    {etiqueta: '', valor: 60, texto: '', y: 830, en: 0.15, dur: 0.5},
    {etiqueta: '', valor: 40, texto: '', y: 920, en: 0.25, dur: 0.5},
  ]},
  {tipo: 'selloTexto', lineas: ['PROHIBIDO', 'PUBLICAR'], x: 520, y: 900, tamano: 68, angulo: -8, en: 1.0, desde: 40},
  {tipo: 'candadoMostaza', x: 830, y: 930, tamano: 150, en: 2.0},
  {tipo: 'candadoMostaza', x: 830, y: 770, tamano: 150, en: t(10) - 0.1},
]);

// 2 · Primera prueba
const b2 = S(27);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`ART. 69.7${NB}LOREG`, 330, 0.05),
  dib('lista', 280, 930, 300, 0.3),
  dib('portatil', 740, 930, 280, rel(b1, 17) - 0.3),
  {tipo: 'candadoMostaza', x: 740, y: 1140, tamano: 150, en: rel(b1, 19)},
  {tipo: 'candadoMostaza', x: 280, y: 1140, tamano: 150, en: rel(b1, 22)},
  {tipo: 'notas', lineas: ['«queda prohibida la publicación […] de sondeos', 'electorales por cualquier medio de comunicación»'], en: 0.3},
]);

// 2b · Contexto: calendario
const b3 = S(43);
const cal = (aro, en, hasta) => ({tipo: 'calendarioX', mes: 'NOVIEMBRE', primer: 6, dias: 30, y: 700, x: 500, cw: 110, ch: 120, fuente: 52, diaMin: 16, diaMax: 29, aroPad: 0, grises: [24, 25, 26, 27, 28], aro: {d: aro, en: en + 0.4}, en, ...(hasta ? {hasta} : {})});
esc(b2, b3, {fondo: 'crema'}, [
  rot(`24–28${NB}NOV: PROHIBIDO`, 330, 0.05),
  rot(`LUNES 23: ÚLTIMO${NB}DÍA`, 430, rel(b2, 35) - 0.1),
  rot(`VOTACIÓN: DOMINGO${NB}29`, 530, rel(b2, 40) - 0.1),
  cal(23, 0.3, rel(b2, 40) + 0.1),
  cal(29, rel(b2, 40) - 0.1),
]);

// 3 · Explicación
const b4 = S(63);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`PROHIBIDO: PUBLICAR. NO: HACERLAS`, 330, 0.05, {hasta: rel(b3, 52) - 0.15}),
  dib('portatil', 270, 880, 260, 0.3, {hasta: rel(b3, 52) - 0.15}),
  {tipo: 'candadoMostaza', x: 270, y: 1090, tamano: 150, en: rel(b3, 47) , hasta: rel(b3, 52) - 0.15},
  dib('lista', 700, 880, 280, rel(b3, 50) - 0.3, {hasta: rel(b3, 52) - 0.15}),
  rot(`MULTA: 3.000–30.000${NB}€`, 330, rel(b3, 52) - 0.1),
  {tipo: 'balanzaE', x: 540, y: 880, baja: 'der', izq: '3.000 €', der: '30.000 €', inclinaEn: rel(b3, 57), en: rel(b3, 52) - 0.1},
  {tipo: 'notas', lineas: ['Art. 153.2', 'Fuente: BOE'], en: rel(b3, 52)},
]);

// 4 · Giro
const b5 = S(72);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`QUIÉN LA HACE, QUIÉN LA ENCARGA,${NB}PREGUNTAS`, 330, 0.05),
  {tipo: 'lupaFichaE', y: 820, en: 0.3},
  {tipo: 'notas', lineas: ['Art. 69.1'], en: 0.3},
]);

// 5a · Pregunta A/B
const b6 = S(79);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`¿PROTEGE O QUITA${NB}INFORMACIÓN?`, 330, 0.05),
  {tipo: 'tarjetaE', titular: 'Protege al votante', y: 570, alto: 270, ancho: 880, en: 0.3, entra: 'izq'},
  {tipo: 'tarjetaE', titular: 'Quita información', y: 880, alto: 270, ancho: 880, en: rel(b5, 75) , entra: 'abajo'},
]);
// 5b · Cierre
esc(b6, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierre', frase: `¿PROTEGE${NB}O${NB}QUITA INFORMACIÓN?`, tamano: 76, pulso: true}]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `CINCO DÍAS`, y: 330, tamano: 120, en: -1},
  {tipo: 'gancho', texto: `SIN${NB}ENCUESTAS`, y: 490, tamano: 100, en: -1},
  {tipo: 'calendarioX', mes: 'NOVIEMBRE', primer: 6, dias: 30, y: 600, cw: 98, ch: 56, grises: [24, 25, 26, 27, 28], aro: {d: 23, en: -1}, en: -1},
  {tipo: 'selloTexto', lineas: ['PROHIBIDO', 'PUBLICAR'], x: 430, y: 1140, tamano: 80, angulo: -8, en: -1, desde: 0},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'wallpaper.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR);
