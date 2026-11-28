// 084 · Multa DGT: pronto pago 20 días, 200 € → 100 €, renuncia a alegar, recargo hasta 20 %
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
const TINTA = '#14213D', MOST = '#F2B134';
const MAX = 240, BASE = 1100, HMAX = 400;
const bar = (etiqueta, valor, color, en, o = {}) => ({etiqueta, valor, color, en, dur: 0.05, dec: false, prefijo: '', sufijo: ' €', ...o});
const V = (extra) => ({tipo: 'barrasVSerie', max: MAX, base: BASE, hMax: HMAX, w: 200, tamEtiqueta: 44, vivo: true, centros: [290, 740], ...extra});
const EJ = (y, en = 0.05) => rot('EJEMPLO', y, en, {color: TINTA});

// Índices: 0 Multa · 10 La ley · 21 Son · 32 Pero · 39 Si · 53 Si no pagas · 67 ¿Pagarías
const b2 = S(10), b3 = S(21), b4 = S(32), b5 = S(39), b6 = S(53), b7 = S(67);

esc(0, b2, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `MULTA DE 200${NB}€ →${NB}100${NB}€`, y: 320, tamano: 104, en: -1},
  EJ(600, -1),
  {tipo: 'sobreM', y: 930, en: -1, parte: rel(0, 8) - 0.1},
]);
esc(b2, b3, {fondo: 'crema'}, [
  rot(`−50${NB}% SI PAGAS A${NB}TIEMPO`, 330, 0.05),
  EJ(520, 0.05),
  V({barras: [
    bar('SIN PRONTO PAGO', 200, TINTA, -1),
    bar('CON PRONTO PAGO', 100, MOST, 0.4),
  ]}),
  nota([`Fuente: RDL 6/2015, art. 94 (BOE)`], 0.3),
]);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`20 DÍAS NATURALES`, 330, 0.05),
  rot(`DESDE EL DÍA SIGUIENTE A LA${NB}NOTIFICACIÓN`, 440, rel(b3, 24) - 0.5),
  {tipo: 'casillasM', y: 700, ini: 0.6, dur: 2.8},
  nota([`También vale pagar en el acto de la denuncia`], 0.6),
]);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`PAGAR = RENUNCIAR A${NB}ALEGAR`, 330, 0.05),
  rot(`PAGAR: 100${NB}€ Y SE${NB}CIERRA`, 560, 0.3),
  rot(`ALEGAR: SIN DESCUENTO`, 760, rel(b4, 35) - 0.3),
]);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`SI PAGAS, TUS ALEGACIONES NO${NB}CUENTAN`, 330, 0.05, {hasta: rel(b5, 47) - 0.2}),
  rot(`SOLO CABE RECURSO CONTENCIOSO-ADMINISTRATIVO`, 330, rel(b5, 47) - 0.1),
  {tipo: 'docM', y: 700, cae: rel(b5, 42)},
  nota([`Fuente: art. 94 b) y d)`], 0.3),
]);
esc(b6, b7, {fondo: 'crema'}, [
  rot(`SI NO PAGAS: COBRO POR${NB}HACIENDA`, 330, 0.05),
  rot(`+20${NB}% MÁXIMO`, 520, rel(b6, 60) - 0.1),
  EJ(620, 0.05),
  V({centros: [270, 620], barras: [
    bar('MULTA', 200, TINTA, -1),
    bar('CON RECARGO', 240, MOST, rel(b6, 60) + 0.1, {prefijo: 'hasta ', sufijo: ' € (+20 %)', tamValor: 40}),
  ], tamValor: 44}),
  nota([`Fuente: DGT; LGT art. 28`], 0.3),
]);
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: `¿PAGAR CON DESCUENTO O${NB}ALEGAR?`, cta: 'siguenos', tamano: 76, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `200${NB}€ →${NB}100${NB}€: 20${NB}DÍAS`, y: 340, tamano: 104, en: -1},
  EJ(620, -1),
  {tipo: 'sobreM', y: 950, en: -1, parte: -1},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'wallpaper.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
