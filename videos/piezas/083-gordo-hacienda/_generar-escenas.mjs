// 083 · Premio de 400.000 € en un décimo (EJEMPLO): exento 40.000 €, 20 % del exceso = 72.000 € de retención, cobras 328.000 €
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
const EJ = {tipo: 'ejemploP'};

// Índices: 8 retiene · 13 Los · 23 Solo · 31 Trescientos · 43 Te · 48 La · 59 Si · 73 ¿Retener · 83 Síguenos
const b1 = S(13), b2 = S(31), b3 = S(48), b4 = S(59), b5 = S(73);

const SEG_RET = [{v: 328000, et: 'Cobras', color: '#2A9D8F'}, {v: 72000, et: 'Retención del 20 %|sobre el exceso', color: '#F2B134'}];
const SEG_EXE = [{v: 40000, et: 'Exento', color: '#2A9D8F'}, {v: 360000, et: 'Sujeto al 20 %', color: '#8D99AE'}];

// 1 · Gancho
esc(0, b1, {fondo: 'crema'}, [
  EJ,
  {tipo: 'gancho', texto: `400.000${NB}€ EN UN${NB}DÉCIMO`, y: 330, tamano: 112, en: -1},
  rot(`RETENCIÓN:${NB}72.000${NB}€`, 640, rel(0, 8) - 0.1),
  nota(['Por décimo, un solo titular'], 1.0),
  {tipo: 'barraGordo', y: 760, segs: SEG_RET, entera: '400.000 €', partir: rel(0, 8) - 0.1, en: -1},
]);
// 2 · Primera prueba
esc(b1, b2, {fondo: 'crema'}, [
  EJ,
  rot(`Exento: hasta 40.000${NB}€ por${NB}décimo`, 330, 0.05, {hasta: rel(b1, 23) - 0.35}),
  rot(`El exceso tributa al 20${NB}%`, 330, rel(b1, 23) - 0.1),
  {tipo: 'barraGordo', y: 680, titulo: 'Premio íntegro: 400.000 €', segs: SEG_EXE, entera: '400.000 €', partir: 0.8, en: 0.1},
  nota(['Gravamen especial · Ley 35/2006, DA 33.ª', 'Por cada décimo, fracción o cupón'], 0.4),
]);
// 2b · Contexto
esc(b2, b3, {fondo: 'crema'}, [
  EJ,
  rot(`360.000${NB}€ × 20${NB}% = 72.000${NB}€`, 330, 0.05, {hasta: rel(b2, 43) - 0.35}),
  rot(`400.000${NB}€ − 72.000${NB}€ = 328.000${NB}€`, 330, rel(b2, 43) - 0.1),
  {tipo: 'barraGordo', y: 700, titulo: 'Premio íntegro: 400.000 €', segs: SEG_EXE, partir: -1, en: -1, hasta: rel(b2, 43) - 0.2},
  {tipo: 'barraGordo', y: 700, titulo: 'Premio íntegro: 400.000 €', segs: SEG_RET, entera: '400.000 €', partir: rel(b2, 43) + 0.4, en: rel(b2, 43) - 0.1},
  nota(['Cálculo propio con la norma'], 0.4),
]);
// 3 · Explicación
esc(b3, b4, {fondo: 'crema', fuente: 'Ley 35/2006, disp. adic. 33.ª (BOE) · Agencia Tributaria · Cálculo propio'}, [
  EJ,
  rot(`Retiene: Loterías y Apuestas del Estado (SELAE)`, 330, 0.05),
  {tipo: 'flujoGordo', y: 520, cobras: '328.000 €', retencion: '72.000 €', en: 0.3},
  {tipo: 'selloTexto', lineas: ['Contribuyentes del IRPF'], y: 1010, en: 1.0, desde: 40, x: 540, tamano: 40},
]);
// 4 · Giro
esc(b4, b5, {fondo: 'crema'}, [
  EJ,
  rot(`Décimo compartido: los 40.000${NB}€ se prorratean`, 330, 0.05),
  {tipo: 'compartidoGordo', y: 600, en: 0.3, parte: 1.2},
  nota(['Ej.: 2 titulares al 50 % → 20.000 € exentos cada uno'], 0.4),
]);
// 5 · Cierre
esc(b5, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'ejemploG', y: 350},
  {tipo: 'cierre', frase: `¿72.000${NB}€ DE 400.000${NB}€: MUCHO O${NB}POCO?`, cta: 'siguenos', tamano: 76, pulso: true, yFrase: 420},
  {tipo: 'abSerie', a: 'Mucho', b: 'Poco', y: 800, en: 0.6},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  EJ,
  {tipo: 'gancho', texto: `400.000${NB}€: HACIENDA RETIENE 72.000${NB}€`, y: 340, tamano: 96, en: -1},
  {tipo: 'barraGordo', y: 900, segs: SEG_RET, partir: -1, en: -1, vivo: false},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
