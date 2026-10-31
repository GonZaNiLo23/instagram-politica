// Genera escenas.json desde tiempos.json (tiempos reales de palabra). Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (a, abs) => r(abs - a);
const DUR = r(T.duracion + 3);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.1, o = {}) => ({tipo: 'notas', lineas, en, ...o});
const mar = (estado, en = -1) => ({tipo: 'marcadorP', estado, en});

const GANCHO = '¿Cuántos parados hay?';
const N_A = 13, N_B = 12; // colas proporcionales a 2,59 y 2,38 millones (13/12 = 1,08; 2,59/2,38 = 1,09)
const Y = {chipA: 560, colaA: 735, chipB: 855, colaB: 1030}; // diseño común a gancho y cierre (bucle)
const MOST = '#F2B134', TURQ = '#2A9D8F', PIEDRA = '#8D99AE';

const i17 = S(17), i21 = S(21), i28 = S(28), i40 = S(40), i45 = S(45), i52 = S(52), i62 = r(S(62) - 0.1), i69 = S(69), i80 = S(80), i84 = S(84);

// 1 · Gancho (0 → "Las dos son oficiales")
const gEnd = rel(0, S(5));
esc(0, i17, {}, [
  {tipo: 'gancho', texto: GANCHO, y: 340, tamano: 84, en: -1, hasta: gEnd},
  rot('¿Cuál es la buena?', 340, gEnd + 0.05, {pastilla: true}),
  mar('ninguna', gEnd + 0.1),
  {tipo: 'cifraP', texto: '2,59 millones', sub: 'EPA jul–sep', y: Y.chipA, fondo: MOST, en: 0.05, pulsos: [r(t(7) - 0.1)]},
  {tipo: 'colaP', y: Y.colaA, n: N_A, en: 0.1},
  {tipo: 'cifraP', texto: '2,38 millones', sub: 'Registro sept.', y: Y.chipB, fondo: TURQ, color: '#F4EFE6', en: 0.2, pulsos: [r(t(14) - 0.1)]},
  {tipo: 'colaP', y: Y.colaB, n: N_B, en: 0.25},
]);
// 2 · Contexto
esc(i17, i21, {}, [
  rot('LAS DOS SON OFICIALES', 385, 0.05),
  mar('ninguna'),
  {tipo: 'colaP', y: 560, n: N_A, en: -1, base: MOST},
  {tipo: 'igualP', y: 680, en: 0.1},
  {tipo: 'colaP', y: 910, n: N_B, en: -1, base: TURQ},
]);
// 3 · CIFRA 1 · EPA
const I28 = r(i28 + 1.5);
esc(i21, I28, {}, [
  rot('CIFRA 1 · EPA (INE)', 385, 0.05),
  rot('Encuesta a hogares', 475, 0.7, {tamano: 64}),
  mar(1),
  {tipo: 'casasP', y: 545, en: 0.15, paso: 0.35},
  rot('PARADO EPA: sin empleo y buscándolo', 950, 0.6, {izq: 270, ancho: 690}),
  nota(['EPA = Encuesta de Población Activa', 'INE = Instituto Nacional de Estadística', 'Fuente: INE, EPA 3T 2026 (jul–sep)'], 0.1),
]);
// 3 · CIFRA 2 · Registro + definición EPA (sin voz)
esc(I28, i40, {}, [
  rot('CIFRA 2 · PARO REGISTRADO', 385, 0.05),
  rot('Inscritos en las oficinas de empleo', 555, 0.35),
  mar(2),
  {tipo: 'ventanillaP', x: 300, y: 880, tam: 260, en: 0.3},
  nota(['EPA = Encuesta de Población Activa', 'INE = Instituto Nacional de Estadística', 'Fuente: Ministerio de Trabajo, 2-10-2026'], -1),
]);
// 3 · Ejemplo
esc(i40, i45, {}, [
  {tipo: 'ejemploP'},
  rot('Buscas empleo · sin inscribirte', 340, 0.05),
  {tipo: 'pasaP', y: 800, en: 0.1},
]);
esc(i45, i52, {}, [
  {tipo: 'ejemploP'},
  rot('ENCUESTA: puede contarte · REGISTRO: no', 340, 0.05),
  {tipo: 'cifraP', texto: 'ENCUESTA', y: 560, fondo: MOST, en: -1, tam: 48},
  {tipo: 'colaP', y: 650, n: N_A, en: -1, base: PIEDRA, luz: [{t: rel(i45, t(46)), color: MOST}], nuevo: {en: rel(i45, t(46)) + 0.2, color: MOST}},
  {tipo: 'cifraP', texto: 'REGISTRO', y: 800, fondo: PIEDRA, en: -1, tam: 48},
  {tipo: 'colaP', y: 890, n: N_B, en: -1, base: PIEDRA},
  nota(['Si te encuestan'], 0.1),
]);
// 4 · Balance
esc(i52, i62, {}, [
  rot('EPA 3T vs 2T: +95.900 parados', 385, 0.05),
  mar(1),
  {tipo: 'flechaP', dir: 'sube', texto: '+95.900', color: '#14213D', y: 730, en: 0.1},
  rot('Tasa: 10,18 % (+0,31 puntos)', 950, 0.5),
  nota(['Fuente: INE, EPA 3T 2026'], 0.1),
]);
esc(i62, i69, {}, [
  rot('EPA 3T 2026 vs 3T 2025: −21.900 parados', 385, 0),
  mar(1),
  {tipo: 'flechaP', dir: 'baja', texto: '−21.900', color: TURQ, sub: 'Ocupados: +465.500', y: 730, en: 0.1},
  nota(['Fuente: INE, EPA 3T 2026'], 0.1),
]);
// 5 · Giro
esc(i69, i80, {}, [
  rot('REGISTRO: septiembre más bajo desde 2007', 385, 0.05),
  mar(2),
  {tipo: 'cifraP', texto: '2.379.505 parados', y: 670, fondo: TURQ, color: '#F4EFE6', en: 0.2, tam: 76},
  {tipo: 'tiempoP', y: 830, en: 0.3, enciende: rel(i69, t(73)) },
  {tipo: 'colaP', y: 1010, n: N_B, en: 0.3, base: TURQ},
  {tipo: 'sello', valor: 'DATO', en: rel(i69, t(76)), x: 660, y: 985, tamano: 96, angulo: -6, desde: 40, reboteMax: 0},
  nota(['Fuente: Ministerio de Trabajo, 2-10-2026'], 0.1),
]);
// 6 · Cierre: bucle con el gancho
esc(i80, i84, {}, [
  rot('¿EPA o REGISTRO?', 385, 0.05),
  mar('ambas'),
  {tipo: 'cifraP', texto: 'Encuesta (EPA)', y: Y.chipA, fondo: MOST, en: -1, tam: 56},
  {tipo: 'colaP', y: Y.colaA, n: N_A, en: -1, luz: [{t: 0.1, color: MOST}, {t: 0.9, color: '#14213D'}]},
  {tipo: 'cifraP', texto: 'Registro (paro registrado)', y: Y.chipB, fondo: TURQ, color: '#F4EFE6', en: -1, tam: 48},
  {tipo: 'colaP', y: Y.colaB, n: N_B, en: -1, luz: [{t: 0.9, color: TURQ}]},
]);
esc(i84, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '¿EPA o REGISTRO?', pregunta: '2 FORMAS DE MEDIR EL PARO', tamano: 104, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'gancho', texto: GANCHO, y: 340, tamano: 100, en: -1},
  {tipo: 'cifraP', texto: '2,59 millones', sub: 'EPA jul–sep', y: Y.chipA, fondo: MOST, en: -1},
  {tipo: 'colaP', y: Y.colaA, n: N_A, en: -1},
  {tipo: 'cifraP', texto: '2,38 millones', sub: 'Registro sept.', y: Y.chipB, fondo: TURQ, color: '#F4EFE6', en: -1},
  {tipo: 'colaP', y: Y.colaB, n: N_B, en: -1},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
ESC.forEach((e, i) => { console.log(i + 1, e.inicio, (e.fin - e.inicio).toFixed(2)); });
