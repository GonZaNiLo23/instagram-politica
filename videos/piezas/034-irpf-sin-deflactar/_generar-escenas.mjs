// 034 · IRPF sin deflactar. Genera escenas.json desde tiempos.json (tiempos reales de palabra).
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
const nota = (lineas, en = 0.1, o = {}) => ({tipo: 'notas', lineas, en, ...o});
const EJ = {tipo: 'ejemploP'};
const NB = ' ';

// ===== 1 · Gancho: tres barras, EJEMPLO desde el fotograma 1 =====
const b1 = S(8);
esc(0, b1, {fondo: 'crema'}, [
  EJ,
  {tipo: 'barrasI', y: 330, tam: 96, iEn: 1.2},
  nota(['Precios: IPC adelantado de octubre, INE (30-10)'], 0),
]);
// ===== 2 · Primera prueba =====
const b2 = S(32);
esc(b1, b2, {fondo: 'crema'}, [
  EJ,
  rot(`EJEMPLO: tributas por 20.000${NB}€`, 385, 0.05),
  {tipo: 'tarjetaAnioI', y: 556, h: 164, l1: 'Año 0: 20.000 €', l2: '→ IRPF 3.123 €', en: rel(b1, 11), en2: rel(b1, 11) + 0.3},
  {tipo: 'tarjetaAnioI', y: 735, h: 164, l1: 'Año 1: 20.980 €', l2: '→ IRPF 3.405 €', en: rel(b1, 16), en2: rel(b1, 25), fondo: '#FBE3A8'},
  {tipo: 'chipI', y: 918, texto: 'Sueldo +4,9 %', ancho: 600, en: rel(b1, 18), fondo: C_TINTA()},
  {tipo: 'chipI', y: 1024, texto: 'IRPF +9 %', ancho: 440, en: rel(b1, 27), fondo: '#F2B134', color: '#14213D'},
  nota(['Cálculo propio · soltero, sin hijos, < 65 años · base liquidable · escala autonómica = estatal (p. ej., C.-La Mancha)'], rel(b1, 12)),
]);
function C_TINTA() { return '#14213D'; }
// ===== 2b · Tramos, progresividad en frío, deflactar =====
const b3 = S(80);
esc(b2, b3, {fondo: 'crema'}, [
  EJ,
  {tipo: 'escalonI', vivo: true, y0: 1090, en: rel(b2, 37) - 0.3, paso: 0.9, barraEn: rel(b2, 43), sube: rel(b2, 54), luz: rel(b2, 60), atenua: rel(b2, 66) - 0.1, vuelve: rel(b2, 71) - 0.1, desplaza: rel(b2, 72) + 0.3},
  rot(`TRAMOS: 19${NB}% · 24${NB}% · 30${NB}%`, 560, 0.05, {hasta: rel(b2, 43)}),
  rot('Los tramos no se ajustan solos', 560, rel(b2, 43), {hasta: rel(b2, 66) - 0.05}),
  rot('PROGRESIVIDAD EN FRÍO', 560, rel(b2, 66) - 0.05, {hasta: rel(b2, 71) - 0.05}),
  {tipo: 'copoI', x: 540, y: 880, r: 190, en: rel(b2, 66) - 0.05, hasta: rel(b2, 71) - 0.05},
  rot(`DEFLACTAR = ajustar al${NB}IPC`, 560, rel(b2, 71) - 0.05),
]);
// ===== 3 · El ejemplo en euros =====
const b4 = S(95);
esc(b3, b4, {fondo: 'crema'}, [
  EJ,
  rot('+129 € DE IRPF', 385, rel(b3, 83) - 0.1, {tamano: 96, color: '#14213D'}),
  {tipo: 'comparaI', enB: 0.1, enA: rel(b3, 89) - 0.4, enDif: rel(b3, 89) + 0.5},
  nota(['Cálculo propio con la tarifa del IRPF (art. 57 y 63 LIRPF)'], 0.2),
]);
// ===== 3b · Banco de España =====
const b5 = S(110);
esc(b4, b5, {fondo: 'crema'}, [
  rot('BANCO DE ESPAÑA · 2019‑2023', 385, 0.05),
  {tipo: 'edificioI', x: 540, y: 640, ancho: 520, en: 0.3},
  nota(['Fuente: Doc. Ocasional 2422 (14-6-2024)'], 0.3),
]);
const b6 = S(125);
esc(b5, b6, {fondo: 'crema'}, [
  rot('≈ la mitad de la subida de IRPF/PIB', 385, 0.05),
  {tipo: 'mitadI', vivo: true, y: 700, en: 0.4},
  nota(['Fuente: Doc. Ocasional 2422 (14-6-2024)'], 0.3),
]);
const b7 = S(139);
esc(b6, b7, {fondo: 'crema'}, [
  rot('Más en rentas medias y medias-altas', 385, 0.05, {hasta: rel(b6, 132)}),
  rot('Reduce la desigualdad de renta neta', 385, rel(b6, 132)),
  {tipo: 'rentasI', base: 1100, hMax: 330, luz: 0.9, comprime: rel(b6, 133) + 0.2},
  nota(['Fuente: Doc. Ocasional 2422 (14-6-2024)'], 0.3),
]);
// ===== 4 · Giro: informe a Bruselas =====
const b8 = S(149);
esc(b7, b8, {fondo: 'crema'}, [
  rot('INFORME DE PROGRESO ANUAL 2026', 385, 0.05),
  {tipo: 'caratulaI', y: 700, en: 0.3},
  nota(['Gobierno de España, Informe de Progreso Anual 2026'], 0),
]);
const b9 = S(163);
esc(b8, b9, {fondo: 'crema'}, [
  {tipo: 'informeI', directo: true, valor: 2294, etiqueta: 'No deflactar en 2025', cuentaEn: 0.3, cuentaDur: 3.1, yCifra: 640, yPartes: 880,
    partes: [{texto: 'Estado 1.137', en: 3.5}, {texto: 'CCAA 1.157', en: 3.8}]},
  {tipo: 'sello', valor: 'DATO', x: 715, y: 560, tamano: 88, angulo: -6, desde: 40, en: 3.4, reboteMax: 0},
  nota(['Gobierno de España, Informe de Progreso Anual 2026 (pp. 23 y 44)'], 0),
]);
const b10 = S(172);
esc(b9, b10, {fondo: 'crema'}, [
  rot(`Hasta 2028: cuenta como${NB}ingresos`, 385, 0.05),
  {tipo: 'aniosI', y: 800, en: 0.3, dur: 2.4},
  nota(['Gobierno de España, Informe de Progreso Anual 2026'], 0),
]);
// ===== 5 · Posturas =====
const b11 = S(178);
esc(b10, b11, {fondo: 'crema'}, [
  rot('PP: deflactar el IRPF (moción, 22-4-2026)', 385, 0.05),
  {tipo: 'escaleraIcoI', x: 520, y: 960, esc: 1.35, en: 0.1},
]);
const b12 = S(191);
esc(b11, b12, {fondo: 'crema'}, [
  rot('HACIENDA: ya actualizado con el SMI', 385, 0.05),
  {tipo: 'nominaI', x: 540, y: 660, en: 0.1},
  nota(['Arcadi España, entrevista en elDiario.es (29-4-2026)'], 0.3),
]);
// ===== 6 · Cierre =====
const b13 = S(210);
esc(b12, b13, {fondo: 'crema'}, [
  EJ,
  {tipo: 'barrasI', y: 340, tam: 72, base: 1100, hMax: 380, iEn: 1.0, paso: 96},
]);
const b14 = S(220);
esc(b13, b14, {fondo: 'crema'}, [
  EJ,
  rot('¿AJUSTAR O DEJAR?', 340, 0.05, {tamano: 96}),
  {tipo: 'barrasI', rot: false, base: 840, hMax: 220, iEn: -5, dur: 0.01, preg: 0.4},
  {tipo: 'abSerie', a: 'AJUSTAR AL IPC', b: 'DEJAR COMO ESTÁ', y: 880, en: 0.9},
]);
esc(b14, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '¿AJUSTAR O DEJAR?', tamano: 104, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  EJ,
  {tipo: 'barrasI', y: 330, tam: 96, iEn: -5, dur: 0.01},
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
