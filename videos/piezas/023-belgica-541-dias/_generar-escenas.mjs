// Genera escenas.json desde tiempos.json (tiempos reales de palabra). Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const DUR = r(T.duracion + 1.9);
const rel = (a, abs) => r(abs - a);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.1, o = {}) => ({tipo: 'notas', lineas, en, ...o});
const CR1 = 'Foto: Trougnouf (Benoit Brummer) · CC BY 4.0 · Wikimedia Commons';
const CR2 = 'Foto: Davidh820 · CC BY-SA 4.0 · Wikimedia Commons';
const FGW = 'Fuente: Guinness World Records';
const FESP = 'Fuente: Constitución, art. 99 · LOREG, art. 162 · RD 806/2026';
const B = {a: 0, b1: S(16), b2: S(22), b3: S(29) - 0.1, b4: S(32) - 0.25, b5: S(36), b6: S(48), b7: S(59) - 0.28, b8: S(68), b9: S(81), b10: S(83)};

// 1 · Gancho
const fotoGancho = (dur, extra = {}) => ({tipo: 'foto', src: 'F1.jpg', x: 500, y: 690, ancho: 880, alto: 300, foco: '50% 50%', zoom: [1.0, 1.12], dur, en: -1, credito: CR1, ...extra});
esc(0, B.b1, {}, [
  rot('541 DÍAS SIN FORMAR GOBIERNO', 335, -1, {hasta: 3.72}),
  rot('RÉCORD GUINNESS EN TIEMPO DE PAZ', 335, 3.85),
  fotoGancho(B.b1, {notas: [FGW]}),
  {tipo: 'contador', desde: 300, hasta: 541, en: -1, espera: 1, dur: 2.1, y: 880, tamano: 190},
  {tipo: 'trofeoBe', x: 490, y: 975, tam: 150, en: 3.85},
  {tipo: 'selloTexto', lineas: ['RÉCORD'], x: 690, y: 915, tamano: 56, angulo: -4, desde: 100, en: 3.9},
]);
// 2 · Contexto
const FUENTE2 = 'Fuente: Guinness World Records · Cámara de Representantes (7-12-2011)';
esc(B.b1, B.b2, {}, [
  rot('13-6-2010 · ELECCIONES', 335, 0.05),
  {tipo: 'lineaBe', y: 900, a: 0.3, en: 0.1},
  {tipo: 'icono', nombre: 'urnaSin', x: 250, y: 660, tamano: 260, en: 0.2, animEn: 0.3},
  nota([FUENTE2]),
]);
esc(B.b2, B.b3, {}, [
  rot('6-12-2011 · JURA EL GOBIERNO DI RUPO', 335, 0.05),
  {tipo: 'lineaBe', y: 900, a: -1, b: 0.2, barra: {en: 0.1, dur: 1.1}, llave: 1.4, en: -1},
  {tipo: 'icono', nombre: 'urnaSin', x: 250, y: 660, tamano: 260, en: -1, animEn: -1},
  {tipo: 'icono', nombre: 'documento', x: 720, y: 660, tamano: 260, en: 0.2, animEn: 0.3},
  nota([FUENTE2]),
]);
// 3 · Explicación
esc(B.b3, B.b4, {}, [
  rot('¿Y QUIÉN MANDABA?', 335, 0.05),
  {tipo: 'foto', src: 'F2.jpg', x: 500, y: 800, ancho: 880, alto: 640, foco: '50% 50%', zoom: [1.0, 1.1], dur: rel(B.b3, B.b4), en: 0.15, credito: CR2, notas: [FGW]},
  {tipo: 'selloTexto', lineas: ['?'], x: 770, y: 560, tamano: 160, angulo: 6, desde: 100, en: 0.4},
]);
esc(B.b4, B.b5, {}, [
  rot('GOBIERNO LETERME, EN FUNCIONES', 335, 0.05),
  rot('= provisional, gestiona el día a día', 500, 0.45),
  {tipo: 'carpetaH', x: 250, y: 830, tam: 200, en: 0.3},
  {tipo: 'carpetaH', x: 540, y: 830, tam: 200, en: 0.6},
  {tipo: 'carpetaH', x: 830, y: 830, tam: 200, en: 0.9},
  {tipo: 'selloTexto', lineas: ['EN FUNCIONES'], x: 480, y: 990, tamano: 64, angulo: -3, fondo: '#8D99AE', desde: 100, en: 1.1},
  nota([FGW]),
]);
// 4 · Giro
const tb = (i) => rel(B.b5, t(i));
esc(B.b5, B.b6, {}, [
  rot('BRUSELAS: GOBIERNO REGIONAL', 335, 0.05, {hasta: 1.4}),
  rot('MÁS DE 600 DÍAS (2024⁠–⁠2026)', 335, 1.6),
  {tipo: 'mapaBe', x: 540, y: 1000, w: 340, divideEn: 0.3, bruselasEn: tb(37), en: 0.1},
  {tipo: 'contador', desde: 541, hasta: 541, en: 1.6, dur: 0.1, y: 540, tamano: 130, izq: 60, etiqueta: 'FEDERAL'},
  {tipo: 'contador', desde: 0, hasta: 600, sufijo: '+', en: 1.9, espera: r(tb(41) - 1.9), dur: 1.1, y: 540, tamano: 130, izq: 540, color: '#2A9D8F'},
  rot('REGIONAL', 684, 1.9, {izq: 540, ancho: 420}),
  nota(['Región de Bruselas-Capital, no el Gobierno federal'], 1.6, {y: 775}),
  nota(['Elecciones 9-6-2024 → jura 14-2-2026', 'Fuente: VRT y BX1 (14-2-2026)'], 1.6),
]);
// 5 · España
esc(B.b6, B.b7, {}, [
  rot('¿Y EN ESPAÑA, TRAS EL 29‑N?', 335, 0.7),
  {tipo: 'mapaH', paises: ['es'], x: 300, y: 800, k: 36, en: 0.65},
  {tipo: 'icono', nombre: 'calendario', x: 770, y: 800, tamano: 300, mes: 'NOV', dia: '29', en: 0.9},
  nota([FESP], 0.7),
  {tipo: 'barridoBe', en: 0, dur: 0.6},
]);
esc(B.b7, B.b8, {}, [
  rot('INVESTIDURA: VOTA EL CONGRESO', 335, 0.05),
  rot('candidato propuesto por el Rey', 500, 0.8),
  {tipo: 'icono', nombre: 'congreso', x: 270, y: 900, tamano: 330, en: 0.2, animEn: 0.3},
  {tipo: 'plumaCorona', x: 760, y: 900, tamano: 330, en: rel(B.b7, t(65)) - 0.3},
  nota([FESP], 0.1),
]);
esc(B.b8, B.b9, {}, [
  rot('2 MESES SIN INVESTIDURA = ELECCIONES', 335, 0.05),
  {tipo: 'icono', nombre: 'relojArena', x: 290, y: 650, tamano: 250, en: 0.2, animEn: 0.3, dur: 3.0},
  {tipo: 'hemiciclo', grupos: [{nombre: 'Congreso', escanos: 350, color: '#8D99AE'}], ancho: 600, y: 800, dur: 1.4, en: 0.1, leyenda: false},
  {tipo: 'icono', nombre: 'urnaSin', x: 790, y: 650, tamano: 250, en: rel(B.b8, t(79)) - 0.2, animEn: rel(B.b8, t(79))},
  nota(['plazo desde la 1.ª votación', FESP], 0.1),
]);
// 6 · Cierre
esc(B.b9, B.b10, {}, [
  rot('¿LO SABÍAS?', 335, 0.05),
  fotoGancho(rel(B.b9, B.b10) + 1),
  {tipo: 'contador', desde: 541, hasta: 541, en: -1, dur: 0.1, y: 880, tamano: 190},
]);
esc(B.b10, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '541 DÍAS', tamano: 120, yGuardalo: 1200, yFuentes: 1310, pulso: true},
  {tipo: 'foto', src: 'F1.jpg', x: 500, y: 840, ancho: 880, alto: 300, foco: '50% 50%', zoom: [1.0, 1.1], dur: 3, en: 0.2, credito: CR1},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'foto', src: 'F1.jpg', forma: 'completa', velo: 0.45, foco: '50% 50%', zoom: [1.0, 1.0], dur: 3, en: -1, sobre: 'oscuro', credito: CR1},
  {tipo: 'gancho', texto: '541 DÍAS SIN FORMAR GOBIERNO', y: 470, tamano: 104, color: '#F4EFE6', en: -1},
  {tipo: 'contador', desde: 541, hasta: 541, en: -1, dur: 0.1, y: 960, tamano: 220, color: '#F2B134'},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
ESC.forEach((e, i) => { const d = e.fin - e.inicio; if (d < 1.4) console.log('corta', i + 1, e.inicio, d.toFixed(2)); });
