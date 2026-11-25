// 078 · FP online privada: virtual 15–39 % presencial, semipresencial 40–60 %, tope 80 → 65 → 50 (2028-29, 2029-30, 2031-32)
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

// Índices: 9 La virtual · 23 El Consejo · 31 La semipresencial · 43 decreto · 48 Y en la virtual · 53 tope · 58 bajará · 60 ochenta · 63 ¿Debería
const b1 = S(9), b2 = r(t(23) - 0.7), b3 = S(31), b4 = S(48), b5 = S(63);
const b3b = r(t(43) - 0.1);

// 1 · Gancho
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: 'FP ONLINE PRIVADA: CON CLASES PRESENCIALES', y: 330, tamano: 96, en: -1},
  {tipo: 'barraFp', y: 780, alto: 170, etiqueta: '100 % ONLINE', a: 15, b: 39, en: 0.3, etiBanda: 'PRESENCIAL'},
]);
// 2 · Primera prueba
esc(b1, b2, {fondo: 'crema'}, [
  rot(`VIRTUAL: 15–\u206039${NB}%${NB}PRESENCIAL`, 330, 0.05),
  {tipo: 'barraFp', y: 700, alto: 170, etiqueta: 'VIRTUAL', a: 15, b: 39, en: rel(b1, 14) - 0.2, etiBanda: 'PRESENCIAL'},
  nota(['Centros privados de FP'], 0.3),
]);
// 2b · Contexto
esc(b2, b3, {fondo: 'crema'}, [
  rot(`CONSEJO DE MINISTROS · 24${H}11${H}2026`, 330, 0.05),
  {tipo: 'selloTexto', lineas: [`24${H}11${H}2026`], y: 800, en: 0.5, desde: 40, x: 540},
  nota(['Pendiente de publicarse en el BOE'], 0.4),
]);
// 3 · Explicación
esc(b3, b4, {fondo: 'crema'}, [
  rot(`SEMIPRESENCIAL: 40–60${NB}%`, 330, 0.05, {hasta: rel(b3, 43) - 0.35}),
  rot(`DECRETO DE GARANTÍA DE${NB}CALIDAD`, 330, rel(b3, 43) - 0.1),
  {tipo: 'barraFp', y: 500, etiqueta: 'VIRTUAL', a: 15, b: 39, en: -1, enBarra: -1, ghost: true, vivo: false},
  {tipo: 'barraFp', y: 800, etiqueta: 'SEMIPRESENCIAL', a: 40, b: 60, en: rel(b3, 35) - 0.3, etiBanda: 'PRESENCIAL'},
]);
// 4 · Giro
esc(b4, b5, {fondo: 'crema'}, [
  rot(`VIRTUAL: 80 → 65 → 50${NB}ALUMNOS/DOCENTE`, 330, 0.05),
  {tipo: 'topeFp', y: 560, paso: 200, filas: [
    {valor: 80, curso: '2028-29', en: rel(b4, 53)},
    {valor: 65, curso: '2029-30', en: rel(b4, 58)},
    {valor: 50, curso: '2031-32', en: rel(b4, 60) + 0.3, resalta: true},
  ]},
  nota([`Cursos 2028-29, 2029-30 y 2031-32`], 0.3),
]);
// 5 · Cierre
esc(b5, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: `¿TAMBIÉN A LA FP${NB}PÚBLICA?`, cta: 'siguenos', tamano: 76, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: 'FP ONLINE: HASTA 39 % PRESENCIAL', y: 340, tamano: 96, en: -1},
  {tipo: 'barraFp', y: 900, alto: 100, etiqueta: '100 % ONLINE', a: 15, b: 39, en: -1, etiBanda: 'PRESENCIAL', vivo: false},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'hidden-agenda.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
