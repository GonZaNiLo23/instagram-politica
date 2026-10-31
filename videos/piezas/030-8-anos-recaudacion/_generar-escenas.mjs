// 030 · 8 años en cifras · Cifra 1 (recaudación). Genera escenas.json desde tiempos.json (tiempos reales de palabra).
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
const NB = ' ';

// === Cifras (se cambian aquí en los próximos episodios) ===
const N = 1; // número de episodio
const A = {anio: '2018', val: 208685}, B = {anio: '2025', val: 325356};
const CR = 'Imagen de archivo: Luis García, CC BY-SA 2.0';
const RANGO = `2018: 208.685${NB}M€ →${NB}2025: 325.356${NB}M€`;

// Índices de palabra clave
const i11 = 11, i18 = 18, i22 = 22, i30 = 30, i36 = 36, i40 = 40, i45 = 45, i67 = 67, i78 = 78, i92 = 92, i106 = 106, i110 = 110;

// ===== 1 · Gancho =====
const b1 = S(i22);
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'cifraSerie', n: N, en: -1},
  rot(`2018: 208.685${NB}M€`, 520, -1),
  rot(`2025: 325.356${NB}M€`, 600, -1),
  {tipo: 'contadorSerie', valA: A.val, valB: B.val, etiqA: A.anio, etiqB: B.anio, base: 1080, hMax: 270, etiqBYa: true, cuentaEn: 1.0, cuentaDur: r(t(17) + 0.5 - 1.0), signo: r(t(i18) - 0.1)},
]);
// ===== 2 · De dónde sale =====
const b2 = S(i45);
esc(b1, b2, {fondo: 'crema'}, [
  {tipo: 'cifraGrandeSerie', valor: '+56 %', sub: '(cálculo propio)', y: 330, en: 0.05},
  rot('Ingresos tributarios, año completo', 640, rel(b1, i30)),
  {tipo: 'fichaSerie', filas: ['2018 · 208.685', '2025 · 325.356'], y: 830, en: rel(b1, i30) + 0.3, paso: 0.6, tam: 56},
  rot('No incluye cotizaciones', 1050, rel(b1, i36)),
  {tipo: 'selloTexto', lineas: ['MISMA', 'MEDIDA'], x: 730, y: 860, tamano: 46, desde: 40, en: rel(b1, i40) + 0.1},
  {tipo: 'notas', lineas: ['AEAT, Informe anual de recaudación 2018 y 2025'], en: rel(b1, i30)},
]);
// ===== 3a · Comparación (barras con eje en cero) =====
const b3 = S(i67);
esc(b2, b3, {fondo: 'crema'}, [
  {tipo: 'barrasHSerie', titulo: 'CRECIMIENTO 2018–2025', max: 60, paso: 20, y0: 330, alto: 190, dur: 0.9, filas: [
    {etiqueta: 'PRECIOS +22 % (IPCA)', valor: 22, color: '#B4BBC8', en: rel(b2, 46)},
    {etiqueta: 'PIB +39 % (euros corrientes)', valor: 39, color: '#8D99AE', en: rel(b2, 54)},
    {etiqueta: 'RECAUDACIÓN +56 %', valor: 56, color: '#F2B134', en: rel(b2, 60)},
  ]},
]);
// ===== 3b · Tarta de la economía =====
const b4 = S(i78);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`17 %${NB}→${NB}19 %${NB}del PIB`, 330, 0.05),
  {tipo: 'tartaSerie', de: 17, a: 19, cx: 540, cy: 860, r: 250, en: 0.2, dur: 1.8},
  {tipo: 'sello', valor: 'DATO', x: 540, y: 1000, tamano: 110, desde: 60, en: rel(b3, 76) },
  {tipo: 'notas', lineas: ['Cálculo propio con datos oficiales'], en: 0.2},
]);
// ===== 4 · Lo que dice el Gobierno =====
const b5 = S(i92);
esc(b4, b5, {fondo: 'crema'}, [
  rot('SEGÚN HACIENDA (2025): crecimiento y empleo', 330, 0.05),
  rot('Inflación: 1,3 puntos del +10,4 % de 2025', 520, rel(b4, 84)),
  {tipo: 'empleoSerie', x: 60, y: 700, escala: 0.9, en: 0.4},
  {tipo: 'foto', src: 'hacienda.jpg', forma: 'rect', x: 700, y: 881, ancho: 480, alto: 340, en: 0.3, dur: rel(b4, 92) , zoom: [1.0, 1.12], credito: CR, notas: ['Ministerio de Hacienda, 31-3-2026']},
]);
// ===== 5 · Lo que no mide =====
const b6 = S(i106);
esc(b5, b6, {fondo: 'crema'}, [
  rot('NO ES LO QUE PAGA CADA UNO', 330, 0.05),
  rot(`Euros corrientes · más${NB}ocupados`, 510, rel(b5, 95)),
  {tipo: 'barraFigurasSerie', n: 10, y: 900, en: 0.2, divide: rel(b5, 97)},
  {tipo: 'selloTexto', lineas: ['NO MIDE'], x: 540, y: 800, desde: 40, angulo: -5, en: rel(b5, 99)},
]);
// ===== 6a · Pregunta A/B =====
const b7 = S(i110);
esc(b6, b7, {fondo: 'crema'}, [
  rot('¿TRUCO O CRECIMIENTO?', 330, 0.05),
  {tipo: 'contadorSerie', valA: A.val, valB: B.val, base: 800, hMax: 220, cuentaEn: -5, cuentaDur: 1, signo: 0.2, valores: false, etiquetas: false},
  {tipo: 'abSerie', a: 'TRUCO', b: 'CRECIMIENTO', y: 880, en: 0.9},
]);
// ===== 6b · Cierre de serie =====
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierreSerie', siguiente: N + 1},
]);

const DY=90;
ESC.slice(1,6).forEach(e=>e.componentes.forEach(c=>{if(c.tipo==='notas')return;if(c.tipo==='barrasHSerie'){c.y0+=DY;return;}if(c.tipo==='tartaSerie'){c.cy+=DY;return;}if(typeof c.y==='number'&&c.y>330)c.y+=DY;}));
const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'cifraSerie', n: N, en: -1},
  {tipo: 'gancho', texto: '208.685 → 325.356', y: 520, tamano: 104, en: -1},
  {tipo: 'contadorSerie', valA: A.val, valB: B.val, etiqA: A.anio, etiqB: B.anio, base: 1100, hMax: 270, cuentaEn: -5, cuentaDur: 1, signo: -1, valores: false},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
