// Genera escenas.json desde tiempos.json (tiempos reales de palabra). Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const DUR = r(Math.max(T.duracion + 2.9, 67.2));
const rel = (a, abs) => r(abs - a);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.1, o = {}) => ({tipo: 'notas', lineas, en, ...o});
const CR1 = 'Foto: Américo Toledano · CC BY-SA 4.0 · Wikimedia Commons';
const CR2 = 'Foto: Txo · CC BY-SA 4.0 · Wikimedia Commons';
const B = {g1: S(12), b2: S(13), b2b: 8.25, b2c: 10.45, b3a: S(40), b3p: S(52), b3r: S(58), b3l: S(67), b3b: S(81), c1: S(84), c2: S(91), c3: S(94), d1: S(105), d2: 39.9, d3: S(121), d4: S(131), e1: S(138), e2: S(151), e3: S(158), f1: S(167), f2: S(177)};

// 1 · Gancho
esc(0, B.b2, {}, [
  {tipo: 'gancho', texto: '¿TE TOCA MESA EL 29‑N?', y: 335, tamano: 104, en: -1, hasta: B.g1 - 0.05},
  rot('ES OBLIGATORIO', 335, B.g1, {}),
  nota(['LOREG, art. 27.1'], B.g1),
  {tipo: 'bomboM', x: 300, y: 920, tam: 320, en: -1},
  {tipo: 'mesaUrnaM', x: 760, y: 1010, tam: 380, en: -1},
  {tipo: 'fichaM', texto: '¿TÚ?', r: 100, tamTexto: 60, rebote: true, ruta: [
    {t: 0.2, x: 300, y: 920, e: 0.3}, {t: 1.5, x: 540, y: 930, e: 1.45}, {t: 2.0, x: 540, y: 930, e: 1.45}, {t: 3.0, x: 760, y: 905, e: 0.75, g: true}]},
  {tipo: 'selloTexto', lineas: ['OBLIGATORIO'], x: 540, y: 560, tamano: 64, angulo: -5, desde: 300, en: B.g1 + 0.1},
]);
// 2 · Contexto
const L2 = B.b2;
esc(B.b2, B.b2b, {}, [
  rot('SORTEO: 31 OCT – 4 NOV', 335, 0.05),
  {tipo: 'lineaM', y: 880, hitos: [{x: 200, etiqueta: '31 OCT', en: rel(L2, t(18)) - 0.1}, {x: 520, etiqueta: '4 NOV', en: rel(L2, t(25)) - 0.1}, {x: 800, etiqueta: '29 NOV', en: 0, gris: true}],
    barra: {de: 200, a: 520, en: rel(L2, t(20)), dur: rel(L2, t(25)) - rel(L2, t(20))}, en: 0.1},
  {tipo: 'bomboM', x: 360, y: 700, tam: 200, en: 0.2, gira: 1.4},
  nota(['Días 25 a 29 tras la convocatoria · LOREG, art. 26.4'], 0.1),
]);
esc(B.b2b, B.b2c, {}, [
  rot('SORTEO PÚBLICO EN TU AYUNTAMIENTO', 335, 0.05),
  {tipo: 'ayuntM', x: 340, y: 810, tam: 400, en: 0.15},
  {tipo: 'altavozM', x: 760, y: 780, tam: 260, en: 0.5},
  nota(['Supervisa la Junta Electoral de Zona'], 0.1),
]);
esc(B.b2c, B.b3a, {}, [
  rot('NOTIFICACIÓN: EN 3 DÍAS', 335, 0.05),
  {tipo: 'ayuntM', x: 250, y: 740, tam: 330, en: 0.1},
  {tipo: 'correoM', x: 800, y: 740, tam: 260, en: 0.1, sobre: {de: [260, 700], en: 0.5, dur: 1.5, alto: 150}},
  {tipo: 'cifraGrande', texto: '3 DÍAS', x: 540, y: 1010, tamano: 130, en: rel(B.b2c, t(38)) - 0.1},
  nota(['Con el manual de instrucciones · art. 27.2', 'Fuente: BOE, LOREG · La Moncloa, 20-10-2026'], 0.1),
]);
// 3a · Quién
esc(B.b3a, B.b3p, {}, [
  rot('1 PRESIDENTE + 2 VOCALES', 335, 0.05),
  {tipo: 'siluetasM', yMesa: 950, presEn: rel(B.b3a, t(43)) - 0.2, vocEn: rel(B.b3a, t(45)) - 0.2, suplEn: rel(B.b3a, t(50)) - 0.2, en: 0},
  nota(['Cada uno, con 2 suplentes · arts. 25 y 26.3'], 0.1),
]);
esc(B.b3p, B.b3r, {}, [
  rot('1 PRESIDENTE + 2 VOCALES', 335, 0.05),
  {tipo: 'foto', src: 'F1.jpg', x: 500, y: 830, ancho: 880, alto: 640, foco: '46% 70%', zoom: [1.0, 1.3], dur: rel(B.b3p, B.b3r), en: 0.1, credito: CR1, notas: ['Imagen de archivo · Andalucía 2015']},
]);
esc(B.b3r, B.b3l, {}, [
  rot('MENOS DE 70 AÑOS', 335, 0.05, {hasta: rel(B.b3r, t(62)) - 0.1}),
  {tipo: 'reglaEdadM', y: 900, xTope: 600, en: 0.1, hasta: rel(B.b3r, t(62)) - 0.1, t0: 0.15},
  rot('SABER LEER Y ESCRIBIR', 335, rel(B.b3r, t(62)) - 0.05),
  {tipo: 'lapizLibroM', x: 420, y: 800, tam: 320, en: rel(B.b3r, t(62)) - 0.05, checkEn: rel(B.b3r, t(65))},
  nota(['Electores de esa mesa · art. 26.2'], rel(B.b3r, t(62)) - 0.05),
]);
esc(B.b3l, B.b3b, {}, [
  rot('PRESIDENCIA: BACHILLER O FP 2.º GRADO', 335, 0.05),
  {tipo: 'siluetasM', yMesa: 950, presEn: -1, vocEn: -1, suplEn: -1, birreteEn: rel(B.b3l, t(74)) - 0.1, en: -1},
  nota(['Si no, Graduado Escolar o equivalente · art. 26.2'], 0.1),
]);
// 3b · Cómo librarte
esc(B.b3b, B.c1, {}, [
  rot('¿NO PUEDES IR?', 335, 0.05),
  {tipo: 'cifraGrande', texto: '?', x: 540, y: 800, tamano: 420, en: 0.15},
]);
const casT = [0, 1, 2, 3, 4, 5, 6].map((i) => rel(B.c1, t(85)) + 0.2 + i * 0.27);
esc(B.c1, B.c2, {}, [
  rot('7 DÍAS PARA ALEGAR', 335, 0.05),
  {tipo: 'casillasM', y: 760, n: 7, tachan: casT, en: 0.1},
  nota(['Ante la Junta Electoral de Zona · art. 27.3'], 0.1),
]);
esc(B.c2, B.c3, {}, [
  rot('CAUSA JUSTIFICADA Y DOCUMENTADA', 335, 0.05),
  {tipo: 'documentoM', x: 300, y: 830, tam: 380, en: 0.1},
  {tipo: 'selloTexto', lineas: ['JUSTIFICADA'], x: 640, y: 780, tamano: 64, angulo: -6, desde: 300, en: rel(B.c2, t(92)) - 0.1},
  nota(['La Junta resuelve en 5 días, sin recurso'], 0.1),
]);
esc(B.c3, B.d1, {}, [
  rot('65 O MÁS: PUEDES RENUNCIAR', 335, 0.05),
  {tipo: 'bomboM', x: 290, y: 740, tam: 260, en: 0.1},
  {tipo: 'fichaM', texto: '65+', r: 80, tamTexto: 56, ruta: [{t: 0.8, x: 290, y: 740, e: 0.4}, {t: 1.6, x: 560, y: 780, e: 1.1}]},
  {tipo: 'botonM', texto: 'RENUNCIAR', x: 480, y: 1030, en: rel(B.c3, t(100)) - 0.2, checkEn: rel(B.c3, t(100)) + 0.6},
  nota(['Plazo de 7 días · art. 26.2'], 0.1),
]);
// 3c · El día
esc(B.d1, B.d2, {}, [
  rot('8:00: SE CONSTITUYE LA MESA', 335, 0.05, {hasta: rel(B.d1, 38.72)}),
  nota(['LOREG, art. 80.1'], 0.05, {hasta: rel(B.d1, 38.72)}),
  rot('VOTACIÓN: 9:00–20:00', 335, rel(B.d1, 38.75)),
  nota(['art. 84.1'], rel(B.d1, 38.75)),
  {tipo: 'relojM', x: 300, y: 790, tam: 340, puntos: [{t: 0, h: 8}, {t: rel(B.d1, 38.75) + 0.1, h: 9}, {t: rel(B.d1, B.d2) - 0.45, h: 20}], yFranja: 1040, en: 0.1},
]);
esc(B.d2, B.d3, {}, [
  rot('DESPUÉS, EL RECUENTO', 335, 0.05, {hasta: rel(B.d2, t(117)) - 0.1}),
  rot('DIETA: 75 €', 335, rel(B.d2, t(117)) - 0.05),
  {tipo: 'foto', src: 'F2.jpg', x: 500, y: 800, ancho: 880, alto: 640, foco: '50% 55%', zoom: [1.0, 1.15], dur: rel(B.d2, B.d3), en: 0, credito: CR2, notas: ['Imagen de archivo · Bizkaia 2023']},
]);
esc(B.d3, B.d4, {}, [
  rot('DIETA: 75 €', 335, 0.05),
  {tipo: 'billeteM', texto: '75 €', x: 540, y: 800, tam: 480, sube: 160, en: rel(B.d3, t(121)) - 0.1},
  nota(['Orden INT/650/2026'], 0.1),
]);
esc(B.d4, B.e1, {}, [
  rot('AL DÍA SIGUIENTE: 5 HORAS MENOS', 335, 0.05),
  {tipo: 'jornadaM', x: 540, y: 790, yBarra: 1020, n: 5, apagan: [0, 1, 2, 3, 4].map((i) => rel(B.d4, t(135)) + i * 0.3), en: 0.15},
  nota(['Por cuenta ajena o funcionario · art. 28.1'], 0.1),
]);
// 4 · Giro
esc(B.e1, B.e2, {}, [
  rot('75 € ÍNTEGROS, DURE LO QUE DURE', 335, 0.05),
  {tipo: 'billeteM', texto: '75 €', x: 540, y: 850, tam: 480, orbita: true, en: -1},
  nota(['Orden INT/650/2026, art. 3'], 0.1),
]);
esc(B.e2, B.e3, {}, [
  rot('FALTAR SIN CAUSA: DELITO', 335, 0.05),
  {tipo: 'siluetasM', yMesa: 950, presEn: -1, vocEn: -1, ausenteEn: rel(B.e2, t(152)) + 0.3, en: -1},
  nota(['También abandonar la mesa · LOREG, art. 143'], 0.1),
]);
esc(B.e3, B.f1, {}, [
  rot('PRISIÓN 3 MESES–1 AÑO, O MULTA', 335, 0.05),
  {tipo: 'balanzaM', y: 640, izq: ['PRISIÓN', '3 M–1 A'], der: ['MULTA'], cx: 500, sep: 285, panW: 320, oEn: rel(B.e3, t(165)) - 0.1, en: 0.1},
  nota(['Multa de 6 a 24 meses · art. 143'], 0.1),
]);
// 5 · Cierre
esc(B.f1, B.f2, {}, [
  rot('SORTEO · 7 DÍAS · 75 €', 335, 0.05),
  {tipo: 'bomboM', x: 300, y: 860, tam: 340, en: -1},
  {tipo: 'fichaM', texto: '¿TÚ?', r: 90, tamTexto: 56, ruta: [{t: 0.9, x: 300, y: 860, e: 0.4}, {t: 2.0, x: 700, y: 880, e: 1.2}]},
]);
esc(B.f2, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '¿TE HA TOCADO ALGUNA VEZ?', tamano: 104, pulso: true},
]);

const DY = 90;
const NO = new Set(['rotulo', 'notas', 'gancho', 'cierre', 'foto']);
for (const e of ESC) for (const c of e.componentes) {
  if (NO.has(c.tipo)) continue;
  for (const k of ['y', 'yMesa', 'yBarra', 'yFranja']) if (typeof c[k] === 'number') c[k] += DY;
  if (c.ruta) c.ruta.forEach((p) => { if (typeof p.y === 'number') p.y += DY; });
  if (c.sobre && c.sobre.de) c.sobre.de[1] += DY;
}
const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'gancho', texto: '¿TE TOCA MESA EL 29‑N?', y: 350, tamano: 112, en: -1},
  {tipo: 'foto', src: 'F1.jpg', x: 500, y: 1010, ancho: 880, alto: 600, foco: '46% 70%', zoom: [1.05, 1.05], dur: 3, en: -1, credito: CR1, notas: ['Imagen de archivo · Andalucía 2015']},
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 90, musica: {pista: 'hidden-agenda.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
ESC.forEach((e, i) => { const d = e.fin - e.inicio; if (d < 1.3) console.log('corta', i + 1, e.inicio, d.toFixed(2)); });
