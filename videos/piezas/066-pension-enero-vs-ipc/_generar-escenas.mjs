// 066 · Pensión en enero vs IPC: IPC oct 4,9 %, pensión ≈ 3,5 % (media dic-25..nov-26, art. 58 LGSS), media 11 meses 3,47 % (cálculo propio),
// noviembre se publica el 27-11, pensión media 1.376 €: ≈ 48 €/mes (3,5 %) frente a ≈ 67 €/mes (4,9 %).
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

// Índices: 12 ¿Por qué · 27 Se promedian · 38 Con once · 50 Falta · 66 ¿Media · 75 Síguenos
const b1 = S(12), b2 = S(27), b3 = S(38), b4 = S(50), b5 = S(66), b6 = S(75);
const b4a = r(b4 + 2.3), b4b = S(58);

// Gancho: dos barras
const G = (extra) => ({tipo: 'barrasVSerie', max: 6, base: 1100, hMax: 360, w: 200, tamEtiqueta: 64, vivo: true, centros: [290, 730], ...extra});
// 12 barras: tasas anuales publicadas dic-25..oct-26 y noviembre vacía
const TASAS = [2.9, 2.3, 2.3, 3.4, 3.2, 3.2, 3.2, 3.6, 4.3, 4.9, 4.9];
const CEN = Array.from({length: 12}, (_, i) => 100 + i * 72);
const MES = ['DIC', 'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV'];
const D = (extra, enFn, nov = {}) => ({tipo: 'barrasVSerie', max: 6, base: 1100, hMax: 540, w: 52, tamEtiqueta: 36, tamValor: 38, vivo: true, centros: CEN,
  barras: [...TASAS.map((v, i) => ({etiqueta: MES[i], valor: v, color: v >= 4.9 ? MOST : TINTA, en: enFn(i), dur: 0.05, dec: 1, prefijo: '', sufijo: ''})),
    {etiqueta: 'NOV', valor: 3, color: TINTA, en: 0.1, contorno: true, altoContorno: 200, sinValor: true, ...nov}], ...extra});

// 1 · Gancho
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: 'PRECIOS +4,9 %', y: 320, tamano: 110, en: -1},
  rot('PENSIÓN ≈ +3,5 %', 640, rel(0, 6) - 0.1),
  G({barras: [
    {etiqueta: 'PRECIOS', valor: 4.9, color: MOST, en: -1, dur: 0.6, sinValor: true},
    {etiqueta: 'PENSIÓN', valor: 3.5, color: TINTA, en: -1, dur: 0.6, sinValor: true},
  ]}),
  nota([`IPC octubre, el más alto del año`, `Cálculo propio con datos del INE`], 0.2),
]);
// 2 · Primera prueba: las 12 casillas
esc(b1, b2, {fondo: 'crema'}, [
  rot(`LA LEY: MEDIA DE 12${NB}MESES`, 330, 0.05),
  D({}, (i) => 0.4 + i * 0.22),
  nota([`IPC anual, % · fuente INE`], 0.3),
]);
// 3 · Explicación
esc(b2, b3, {fondo: 'crema'}, [
  rot(`ART. 58 LGSS${NB}· SEGURIDAD${NB}SOCIAL`, 330, 0.05),
  D({}, () => -1),
  nota([`IPC anual, % · fuente INE`], 0.3),
]);
// 4 · Cálculo
esc(b3, b4, {fondo: 'crema'}, [
  rot(`MEDIA 11 MESES: 3,47${NB}%`, 330, 0.05),
  D({lineasRef: [{valor: 3.47, en: 0.4, color: '#B4452A', etiqueta: '3,47 %'}]}, () => -1),
  nota([`Cálculo propio con datos del INE`], 0.3),
]);
// 5a · Falta noviembre
esc(b4, b4a, {fondo: 'crema'}, [
  rot(`NOVIEMBRE: 27 DE${NB}NOVIEMBRE`, 330, 0.05),
  D({lineasRef: [{valor: 3.47, en: -1, color: '#B4452A', etiqueta: '3,47 %'}]}, () => -1),
  nota([`Cifra oficial: IPC definitivo 15-12`], 0.6),
]);
// 5b · Escenario
esc(b4a, b4b, {fondo: 'crema'}, [
  rot(`CON NOVIEMBRE ENTRE 3 Y${NB}4,9${NB}%`, 330, 0.05),
  rot(`MEDIA 3,4–3,6${NB}%`, 520, 2.3),
  D({lineasRef: [{valor: 3.47, en: -1, color: '#B4452A', etiqueta: '3,47 %'}], flecha: {barra: 11, hasta: 4.9, en: 0.5, dx: 0, dy0: -20}}, () => -1,
    {contorno: false, color: MOST, en: 0.1, dur: 0.4, sinValor: true}),
]);
// 5c · Euros al mes
esc(b4b, b5, {fondo: 'crema'}, [
  rot(`≈ 48 €/MES (3,5${NB}%)`, 330, 0.05),
  rot(`≈ 67 €/MES (4,9${NB}%)`, 520, 1.5),
  {tipo: 'barrasVSerie', max: 80, base: 1100, hMax: 480, w: 200, tamEtiqueta: 64, vivo: true, centros: [290, 730], barras: [
    {etiqueta: '3,5 %', valor: 48, color: TINTA, en: 0.2, dur: 0.05, sinValor: true},
    {etiqueta: '4,9 %', valor: 67, color: MOST, en: 1.5, dur: 0.05, sinValor: true},
  ]},
  nota([`Pensión media: 1.376 €`, `Cálculo propio`], 0.3),
]);
// 6a · Pregunta
esc(b5, b6, {fondo: 'crema'}, [
  rot(`¿MEDIA DE 12 MESES O${NB}ÚLTIMO${NB}IPC?`, 330, 0.05, {tamano: 72}),
  {tipo: 'abSerie', a: 'MEDIA 12 M.', b: 'ÚLTIMO IPC', y: 700, en: 0.3},
]);
// 6b · Cierre
esc(b6, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: `¿MEDIA DE 12 MESES O${NB}ÚLTIMO${NB}IPC?`, cta: 'siguenos', tamano: 76, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: 'PRECIOS +4,9 %', y: 340, tamano: 110, en: -1},
  rot('PENSIÓN ≈ +3,5 %', 660, -1),
  G({base: 1150, hMax: 360, barras: [
    {etiqueta: 'PRECIOS', valor: 4.9, color: MOST, en: -1, dur: 0.05, sinValor: true},
    {etiqueta: 'PENSIÓN', valor: 3.5, color: TINTA, en: -1, dur: 0.05, sinValor: true},
  ]}),
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
