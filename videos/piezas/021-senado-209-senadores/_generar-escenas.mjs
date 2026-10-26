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
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.1, o = {}) => ({tipo: 'notas', lineas, en, ...o});
const CR1 = 'Foto: El Pantera · CC BY-SA 4.0 · Wikimedia Commons';
const CR2 = 'Foto: Rastrojo · CC BY-SA 4.0 · Wikimedia Commons';
const NB = ' ';
const B = {a: 0, b1: S(8), b2: S(18), b3: S(28), b3c: S(37), b4: S(51), b4b: S(66), b5: S(75), b5c: S(82)};
const R = (base, i) => r(t(i) - base);

// 1 · Gancho: recorte de la cabecera de la papeleta real
const fotoGancho = (dur, extra = {}) => ({tipo: 'foto', src: 'F1c.jpg', x: 500, y: 640, ancho: 880, alto: 160, foco: '50% 50%', zoom: [1.0, 1.05], dur, en: -1, credito: CR1, ...extra});
esc(0, B.b1, {}, [
  rot('HASTA 3 NOMBRES EN EL SENADO', 335, -1),
  fotoGancho(B.b1, {notas: ['Papeleta real: Cádiz, 2019 (recortada)']}),
  {tipo: 'crucesS', x: 500, y: 830, lado: 220, en: -1, n: 3},
]);
// 1b + 2 · Papeleta de ejemplo con 4 cruces y voto nulo
const b1 = B.b1;
esc(b1, B.b2, {}, [
  rot('¿Y SI MARCAS 4?', 335, 0.05, {hasta: R(b1, 12) - 0.1}),
  rot('VOTO NULO', 335, R(b1, 12) - 0.02),
  rot('no cuenta para nadie', 420, R(b1, 14) - 0.05),
  {tipo: 'papeletaS', x: 540, y: 900, w: 720, en: 0, cruces: [0.1, 0.3, 0.5, R(b1, 11) - 0.1], grisEn: R(b1, 14), sale: {en: R(b1, 14), dur: 0.7, dx: -160, dy: 0, esc: 0.82}, bob: 4},
  {tipo: 'selloNuloS', x: 540, y: 900, d: 380, en: R(b1, 13), angulo: -12, sale: {en: R(b1, 14), dur: 0.7, dx: -160, dy: 0, esc: 0.82}},
  {tipo: 'icono', nombre: 'urnaSin', x: 790, y: 960, tamano: 270, en: R(b1, 14), animEn: R(b1, 14) + 0.1},
  {tipo: 'flechaEsquivaS', x1: 420, y1: 800, x2: 900, y2: 800, alto: 220, en: R(b1, 15), dur: 0.8},
  nota(['En provincias. En islas, Ceuta y Melilla, menos'], 0.1, {hasta: R(b1, 12)}),
  nota(['Fuente: LOREG, art. 96.3'], R(b1, 12)),
]);
// 3a · Sepia vs blanca
const b2 = B.b2;
esc(b2, B.b3, {}, [
  rot('SENADO: SEPIA · CONGRESO: BLANCA', 335, 0.05),
  {tipo: 'dosPapeletasS', y: 860, en: 0, sepiaEn: 0.1, blancaEn: R(b2, 23) - 0.15, avanzaEn: R(b2, 26)},
  nota(['Fuente: RD 605/1999, art. 4.2 · La Moncloa (20-10-2026)'], 0.1),
]);
// 3b · Se vota a personas
const b3 = B.b3;
const FIN3 = r(B.b3c + 0.4);
esc(b3, FIN3, {}, [
  rot('SE VOTA A PERSONAS', 335, 0.05),
  rot('de uno o varios partidos', 420, 0.3),
  {tipo: 'columnasS', x: 500, y: 900, w: 820, fs: 28, en: 0, cruces: [R(b3, 29), R(b3, 31) + 0.1, R(b3, 36)]},
]);
// 3c · Tope de cruces (mapa)
const b4c = FIN3;
esc(b4c, B.b4, {}, [
  rot('TOPE DE CRUCES POR PAPELETA', 335, 0.05),
  rot('PROVINCIAS: 3', 500, 0.5),
  rot('3 ISLAS MAYORES,', 577, R(b4c, 39) - 0.1),
  rot(`CEUTA${NB}Y${NB}MELILLA:${NB}2`, 654, R(b4c, 39) - 0.1),
  rot('RESTO DE ISLAS: 1', 731, R(b4c, 46) - 0.1),
  {tipo: 'mapaTopeS', x: 500, y: 805, esc: 0.85, en: 0.2, dosEn: R(b4c, 39), unoEn: R(b4c, 46)},
  nota(['Fuente: La Moncloa (20-10-2026) · LOREG, art. 166'], 0.1),
]);
// 4 · Giro: 209
const b4 = B.b4;
esc(b4, B.b4b, {}, [
  rot('209 SENADORES EN LAS URNAS', 335, 0.05),
  {tipo: 'foto', src: 'F2.jpg', x: 500, y: 790, ancho: 880, alto: 420, foco: '50% 55%', zoom: [1.0, 1.15], dur: R(b4, 66), en: 0.1},
  {tipo: 'cuentaS', x: 60, y: 1030, en: 0.1, sube: R(b4, 57) - 0.1, tamano: 170},
  nota(['Elegidos en las urnas. Además, los parlamentos autonómicos designan otros', CR2], 0.1),
]);
// 4b · Formentera
const b4b = B.b4b;
esc(b4b, B.b5, {}, [
  rot('SENADORES QUE ELIGE CADA ISLA', 335, 0.05),
  rot('FORMENTERA: SENADOR PROPIO', 500, R(b4b, 72) - 0.15),
  {tipo: 'mapaBalearesS', x: 500, y: 620, w: 540, en: 0.2, partirEn: R(b4b, 72) - 0.05, zoomPit: true},
  nota(['Antes, Ibiza-Formentera elegía uno', 'Fuente: Reforma del art. 69.3 CE (BOE 20-5-2026) · LO 2/2026 · senado.es (2023)'], 0.1),
]);
// 5 · Cierre en bucle
const b5 = B.b5;
esc(b5, B.b5c, {}, [
  rot('UN NOMBRE DE MÁS = NULO', 335, 0.05),
  {tipo: 'papeletaS', x: 540, y: 900, w: 720, en: -1, cruces: [-1, -1, -1, -1], bob: 4},
  {tipo: 'selloNuloS', x: 540, y: 900, d: 380, en: R(b5, 80) - 0.1, angulo: -12},
]);
esc(B.b5c, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', cta: 'guardalo', frase: 'UN NOMBRE DE MÁS = NULO', guardaloLinea2: 'PARA EL 29‑N', tamano: 104, yGuardalo: 1180, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'rotulo', texto: '¿4 CRUCES', y: 420, en: -1, tamano: 120, pastilla: true},
  {tipo: 'rotulo', texto: `EN${NB}EL${NB}SENADO?`, y: 570, en: -1, tamano: 120, pastilla: true},
  {tipo: 'foto', src: 'F1c.jpg', x: 500, y: 930, ancho: 880, alto: 150, foco: '50% 50%', zoom: [1.0, 1.0], dur: 3, en: -1, credito: CR1},
  {tipo: 'crucesS', x: 480, y: 1060, lado: 170, en: -1},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', musica: {pista: 'wallpaper.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
ESC.forEach((e, i) => { const d = e.fin - e.inicio; if (d < 1.4) console.log('corta', i + 1, e.inicio, d.toFixed(2)); });
