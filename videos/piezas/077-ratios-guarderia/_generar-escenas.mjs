// 077 · Ratios en guarderías: 4/6/8 niños por profesional (0-1, 1-2, 2-3 años), Consejo de Ministros 24-11,
// vigor 2-1-2027, 2027-28 primer curso, 2029-30 todos los cursos. Fuente: Moncloa.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T.duracion + 1.5);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const NB = ' ';

// Índices: 6 Pero · 12 Menos · 17 De uno · 21 seis · 22 De dos · 26 ocho · 27 El Gobierno · 33 Entrará · 40 Llegará · 45 en 2029 · 47 Las comunidades · 55 administraciones · 61 ¿Cuatro · 70 Síguenos
const b1 = S(12), b2 = S(27), b3 = S(33), b4 = S(47), b5 = S(61), b6 = S(70);

// 1 · Gancho
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `4${NB}BEBÉS… PERO${NB}AÚN${NB}NO`, y: 320, tamano: 110, en: -1},
  {tipo: 'cunasG', y: 800, dosFilas: false, fases: [{n: 4, en: -1, bebe: 1}]},
  {tipo: 'ejeG', etiqueta: '2027-28', y: 1090, en: t(6) - 0.2},
  {tipo: 'selloTexto', lineas: ['AÚN NO'], x: 400, y: 905, tamano: 72, angulo: -5, desde: 0, en: t(7) - 0.1},
]);
// 2 · Primera prueba
esc(b1, b2, {fondo: 'crema'}, [
  rot('0-1 AÑO: 4', 330, 0.05),
  rot('1-2 AÑOS: 6', 420, rel(b1, 17) - 0.1),
  rot('2-3 AÑOS: 8', 510, rel(b1, 22) - 0.1),
  rot('Máximo por profesional', 605, rel(b1, 23), {tamano: 64}),
  {tipo: 'cunasG', y: 920, fases: [{n: 4, en: -1, bebe: 0.8}, {n: 6, en: rel(b1, 21) - 0.1, bebe: 1}, {n: 8, en: rel(b1, 26) - 0.1, bebe: 1.25}]},
]);
// 2b · Contexto
esc(b2, b3, {fondo: 'crema'}, [
  rot(`Consejo de Ministros, 24-11`, 330, 0.05),
  {tipo: 'calendarioX', mes: 'NOVIEMBRE', primer: 6, dias: 30, y: 720, cw: 100, ch: 72, fuente: 44, aro: {d: 24, en: 0.4}, en: 0.1},
  {tipo: 'fuente', texto: 'Fuente: Moncloa', en: 0.5},
]);
// 3 · Explicación
esc(b3, b4, {fondo: 'crema'}, [
  {tipo: 'hitosG', y: 470, paso: 240, items: [
    {lineas: ['En vigor:', '2-1-2027'], en: 0.05},
    {lineas: ['2027-28:', 'primer curso'], en: rel(b3, 40) - 0.1},
    {lineas: ['2029-30:', 'todos los cursos'], en: rel(b3, 45) - 0.1},
  ]},
  {tipo: 'selloTexto', lineas: ['POR CURSOS'], x: 500, y: 1060, tamano: 72, angulo: -3, desde: 60, en: rel(b3, 42)},
]);
// 4 · Giro
esc(b4, b5, {fondo: 'crema'}, [
  rot('CCAA: pueden bajar más', 330, 0.05),
  rot('Recursos: a garantizar', 440, rel(b4, 55) - 0.1),
  {tipo: 'bajaG', y: 780, en: 0.5, enMonedas: rel(b4, 58)},
  {tipo: 'fuente', texto: 'Fuente: Moncloa', en: 1},
]);
// 5a · Pregunta
esc(b5, b6, {fondo: 'crema'}, [
  rot(`¿4 o menos?`, 330, 0.05, {tamano: 96}),
  {tipo: 'abSerie', a: '4', b: 'MENOS', y: 560, en: rel(b5, 66)},
  {tipo: 'cunasG', y: 1080, dosFilas: false, fases: [{n: 4, en: -1, bebe: 1}]},
]);
// 5b · Cierre
esc(b6, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: `¿4${NB}O${NB}MENOS?`, cta: 'siguenos', tamano: 84, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `4${NB}BEBÉS… PERO${NB}AÚN${NB}NO`, y: 340, tamano: 110, en: -1},
  {tipo: 'cunasG', y: 830, dosFilas: false, fases: [{n: 4, en: -1, bebe: 1}]},
  {tipo: 'ejeG', etiqueta: '2027-28', y: 1130, en: -1},
  {tipo: 'selloTexto', lineas: ['AÚN NO'], x: 400, y: 935, tamano: 72, angulo: -5, desde: 0, en: 0},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'wallpaper.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
