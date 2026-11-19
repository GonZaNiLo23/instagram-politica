// 058 · Compraventas vs precios: INE ETDP sept-2026 (-13,4 %, 54.548, acumulado -3,6 %), IPV 2T-2026 +12,2 %, IPV 3T el 4-12.
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
const TINTA = '#14213D', MOST = '#F2B134';
const f = (etiqueta, valor, color, en) => ({etiqueta, valor, color, en});
const H = (filas, y0, alto) => ({tipo: 'barrasHSerie', vivo: true, filas, max: 15, paso: 5, y0, alto, x0: 110, largo: 760, dur: 0.9, tamano: 64});
const COMP = (en) => f(`COMPRAVENTAS −13,4${NB}%`, 13.4, TINTA, en);

// Índices: 11 En septiembre · 30 El precio · 44 Son dos · 53 En lo que · 68 Falta · 74 Si buscaras · 82 Síguenos
const b1 = S(11), b2 = S(30), b3 = S(44), b4 = S(53), b5 = S(68), b6 = S(74), b7 = S(82);

const gancho = [
  {tipo: 'gancho', texto: `COMPRAVENTAS −13${NB}%`, y: 320, tamano: 90, en: -1},
  rot(`septiembre 2026 vs${NB}septiembre${NB}2025 · INE`, 570, -1),
  H([f(`SEP-26 −13,4${NB}%`, 13.4, TINTA, -1)], 830, 260),
];
// 1 · Gancho
esc(0, b1, {fondo: 'crema'}, [
  ...gancho,
  {tipo: 'selloTexto', lineas: ['?'], x: 800, y: 740, desde: 20, angulo: -5, tamano: 100, en: rel(0, 10) - 0.05},
]);
// 2 · Primera prueba
esc(b1, b2, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: '54.548', y: 330, tamano: 130, en: 0.05},
  rot('COMPRAVENTAS INSCRITAS', 510, 0.15, {tamano: 60}),
  rot(`−13,4${NB}% ANUAL · SEP-2026`, 640, rel(b1, 17) - 0.1),
  rot(`DATOS DE 2026: PROVISIONALES`, 770, rel(b1, 21) - 0.1),
  nota(["Registros de la Propiedad"], rel(b1, 21)),
  {tipo: 'selloTexto', lineas: ['DATO'], x: 190, y: 940, desde: 40, angulo: -6, tamano: 80, en: rel(b1, 13)},
  {tipo: 'selloTexto', lineas: ['PROVISIONAL'], x: 520, y: 1050, desde: 40, angulo: 4, tamano: 56, en: rel(b1, 21)},
]);
// 3 · El precio
esc(b2, b3, {fondo: 'crema'}, [
  rot(`PRECIO DE LA VIVIENDA +12,2${NB}%`, 330, 0.05),
  H([COMP(-1), f(`PRECIO +12,2${NB}%`, 12.2, MOST, rel(b2, 36) - 0.1)], 610, 245),
  nota([`2T-2026 (ABRIL–JUNIO) vs 2T-2025 · INE, IPV`], rel(b2, 33)),
  {tipo: 'selloTexto', lineas: ['DATO'], x: 360, y: 1040, desde: 40, angulo: -6, tamano: 84, en: rel(b2, 38)},
]);
// 4 · Dos relojes
esc(b3, b4, {fondo: 'crema'}, [
  rot(`UN MES ≠ UN${NB}TRIMESTRE`, 330, 0.05),
  rot(`SEP-2026 · 2T-2026`, 470, rel(b3, 48) - 0.1),
  {tipo: 'relojSerie', cx: 245, cy: 900, r: 170, meses: 1},
  {tipo: 'relojSerie', cx: 765, cy: 900, r: 170, meses: 3},
  rot('1 MES', 1100, rel(b3, 48), {izq: 60, ancho: 380, align: 'center'}),
  rot('3 MESES', 1100, rel(b3, 48), {izq: 575, ancho: 380, align: 'center'}),
  {tipo: 'selloTexto', lineas: ['≠'], x: 505, y: 860, desde: 40, angulo: 0, tamano: 120, en: rel(b3, 48)},
]);
// 5 · Giro: acumulado
esc(b4, b5, {fondo: 'crema'}, [
  rot(`ENERO–SEPTIEMBRE: −3,6${NB}%`, 330, 0.05),
  H([f(`SEP-26 −13,4${NB}%`, 13.4, TINTA, 0.3), f(`ENE–SEP −3,6${NB}%`, 3.6, MOST, rel(b4, 63) - 0.2)], 610, 245),
  nota([`COMPRAVENTAS DE VIVIENDA:`, `DOS CIFRAS, DOS PERIODOS · INE`], 0.4),
  {tipo: 'selloTexto', lineas: ['DATO'], x: 560, y: 1040, desde: 40, angulo: -6, tamano: 84, en: rel(b4, 65)},
]);
// 6 · Límites
esc(b5, b6, {fondo: 'crema'}, [
  rot(`IPV 3T-2026: SE PUBLICA EL${NB}4-12`, 330, 0.05),
  {tipo: 'calendarioX', mes: 'DICIEMBRE 2026', primer: 1, dias: 31, cw: 114, ch: 90, x: 540, y: 590, aro: {d: 4, en: 0.8}, en: 0.2},
]);
// 7 · Pregunta A/B
esc(b6, b7, {fondo: 'crema'}, [
  rot('¿COMPRAR YA O ESPERAR?', 330, 0.05, {tamano: 80}),
  {tipo: 'abSerie', a: 'COMPRAR YA', b: 'ESPERAR', y: 720, en: 0.35},
]);
// 8 · Cierre
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: `¿COMPRAR YA O${NB}ESPERAR?`, cta: 'siguenos', tamano: 76, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `COMPRAVENTAS −13${NB}%`, y: 340, tamano: 104, en: -1},
  {tipo: 'gancho', texto: '', resalta: '¿Y EL PRECIO?', y: 560, tamano: 104, en: -1},
  rot(`sep-26 vs${NB}sep-25`, 780, -1),
  H([f(`SEP-26 −13,4${NB}%`, 13.4, TINTA, -1)], 960, 150),
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
