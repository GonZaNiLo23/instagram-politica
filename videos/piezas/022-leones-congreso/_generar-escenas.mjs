// Genera escenas.json desde tiempos.json (tiempos reales de palabra de la voz). Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const DUR = r(T.duracion + 1.65);
const rel = (a, abs) => r(abs - a);

const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.1, o = {}) => ({tipo: 'notas', lineas, en, ...o});
const CR = {
  A: 'Foto: Javier Pérez Montes · CC BY-SA 4.0 · Wikimedia Commons',
  B: 'Foto: David Adam Kess · CC BY-SA 4.0 · Wikimedia Commons',
  CD: 'Fotos: Alta Falisa · CC BY-SA 4.0 · Wikimedia Commons',
};
const B = {
  s1: 0, s2a: S(10), s2b: S(16), s2c: S(28) - 0.8, s3a: S(37), s3b: S(44), s4a: S(56), s4b: S(68), s5a: S(77), s5b: S(80),
};

// 1 · Gancho: foto A desde el fotograma 1; rótulo legible al 100 % desde el principio
const tCan = rel(B.s1, t(8)) - 0.1;
esc(B.s1, B.s2a, {}, [
  {tipo: 'foto', src: 'A.jpg', forma: 'completa', velo: 0.15, foco: '46% 38%', zoom: [1.0, 1.15], dur: B.s2a, en: -1, sobre: 'oscuro', credito: CR.A},
  {tipo: 'degradadoL', desde: 1180},
  rot('¿DE QUÉ ESTÁN HECHOS?', 335, -1, {pastilla: 'tinta', tamano: 72, hasta: tCan - 0.05}),
  {tipo: 'ganchoL', texto: 'DE CAÑONES', y: 335, tamano: 106, en: tCan},
  {tipo: 'canonL', x: 330, y: 620, s: 1.15, llegaEn: tCan, dur: 0.55, en: 0},
]);
// 2 · Contexto
esc(B.s2a, B.s2b, {}, [
  rot('ESCULTOR: PONCIANO PONZANO', 335, 0.05),
  {tipo: 'escultorL', x: 420, y: 920, en: 0.15},
]);
esc(B.s2b, B.s2c, {}, [
  rot('CAÑONES TOMADOS AL ENEMIGO', 335, 0.05),
  {tipo: 'coladaL', x: 520, y: 700, cae1: 0.5, cae2: 1.0, vierteEn: 1.5, llenaDur: 1.0, en: 0.1},
]);
esc(B.s2c, B.s3a, {}, [
  rot('BATALLA DE WAD-RAS (SEGÚN LA RAE)', 335, 0.05),
  {tipo: 'foto', src: 'B.jpg', x: 500, y: 710, ancho: 880, alto: 380, foco: '70% 100%', zoom: [1.0, 1.35], dur: 1.5, en: 0.15},
  {tipo: 'subrayadoL', x1: 430, y1: 776, x2: 925, y2: 699, grosor: 10, en: 1.75, dur: 0.7},
  nota(['FUNDIDO CON CAÑONES TOMADOS AL ENEMIGO EN LA GUERRA DE ÁFRICA EN 1860'], 0.7, {y: 925}),
  nota([CR.B], 0.15, {y: 1030}),
  nota(['Fuente: RAE (Diccionario panhispánico del español jurídico) · Congreso de los Diputados'], 0.1),
]);
// 3 · Nombres
esc(B.s3a, B.s3b, {}, [
  {tipo: 'foto', src: 'C.jpg', x: 500, y: 520, ancho: 880, alto: 340, foco: '50% 45%', zoom: [1.0, 1.1], dur: rel(B.s3a, B.s3b), en: 0.1},
  rot('DAOÍZ Y VELARDE', 722, 0.2),
  {tipo: 'foto', src: 'D.jpg', x: 500, y: 960, ancho: 880, alto: 320, foco: '50% 40%', zoom: [1.0, 1.1], dur: rel(B.s3a, B.s3b), en: 0.1},
  nota([CR.CD, 'Fuente: Congreso de los Diputados'], 0.1),
]);
const tM = rel(B.s3b, t(49)) - 0.15;
esc(B.s3b, B.s4a, {}, [
  rot('Capitanes Luis Daoíz y Pedro Velarde', 335, 0.05),
  {tipo: 'foto', src: 'C.jpg', forma: 'circulo', x: 150, y: 640, alto: 170, foco: '50% 45%', zoom: [1.0, 1.1], dur: 3.5, en: 0.1},
  {tipo: 'foto', src: 'D.jpg', forma: 'circulo', x: 830, y: 640, alto: 170, foco: '50% 40%', zoom: [1.0, 1.1], dur: 3.5, en: 0.1},
  {tipo: 'hitoL', x1: 290, x2: 690, y: 600, etiqueta: '2 MAYO 1808', hitoEn: tM, en: 0.1},
  {tipo: 'bustoL', x: 450, y: 880, tam: 170, en: 0.5},
  {tipo: 'bustoL', x: 630, y: 880, tam: 170, en: 0.5},
  rot('2 DE MAYO DE 1808', 1010, tM),
  nota([CR.CD, 'Fuente: Congreso de los Diputados'], 0.1),
]);
// 4 · Giro
function C_TURQ() { return '#F2B134'; }
const tAl = rel(B.s4a, t(60)) - 0.1;
esc(B.s4a, B.s4b, {}, [
  {tipo: 'rotuloL', partes: [{t: 'DAOÍZ Y VELARDE', en: 0}], y: 440, yHasta: 335, yEn: tAl, grisEn: tAl, en: 0.05},
  {tipo: 'rotuloL', partes: [{t: 'AL PRINCIPIO:', en: tAl}], y: 440, tamano: 68, en: tAl},
  {tipo: 'rotuloL', partes: [{t: 'HIPÓMENES', en: rel(B.s4a, t(65)) - 0.15}, {t: ' Y ', en: rel(B.s4a, t(66)) - 0.1}, {t: 'ATALANTA', en: rel(B.s4a, t(67)) - 0.15}], y: 530, tamano: 68, en: tAl},
  {tipo: 'grecaL', y: 700, en: 0.2, dur: 1.4},
  {tipo: 'vasijaL', x: 540, y: 910, alto: 240, en: 0.6},
  {tipo: 'grecaL', y: 1040, x1: 70, x2: 930, en: 1.0, dur: 1.4},
  nota(['Fuente: RAE (Diccionario panhispánico del español jurídico)'], 0.1),
]);
esc(B.s4b, B.s5a, {}, [
  rot('MITO GRIEGO: CONVERTIDOS EN LEONES', 335, 0.05),
  {tipo: 'ceramicaL', y: 1010, transEn: rel(B.s4b, t(74)) - 0.1, en: 0.1},
  nota(['Mito: Ovidio, Metamorfosis, libro X'], 0.1),
]);
// 5 · Cierre
esc(B.s5a, B.s5b, {}, [
  {tipo: 'foto', src: 'A.jpg', forma: 'completa', velo: 0.15, foco: '46% 38%', zoom: [1.0, 1.08], dur: rel(B.s5a, B.s5b), en: -1, sobre: 'oscuro', credito: CR.A},
  {tipo: 'degradadoL', desde: 1180},
  rot('RECUERDA: SON CAÑONES', 335, 0.05, {pastilla: 'tinta', tamano: 72}),
  {tipo: 'canonL', x: 330, y: 620, s: 1.15, llegaEn: 0.3, dur: 0.55, en: 0},
]);
esc(B.s5b, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: 'Leones de bronce, bronce de cañones', pregunta: '¿LOS CONOCÍAS POR SUS NOMBRES?', tamano: 88, yGuardalo: 1200, yFuentes: 1310, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'foto', src: 'A.jpg', forma: 'completa', velo: 0.4, foco: '46% 38%', zoom: [1.35, 1.35], pan: [0, 250], dur: 0.01, en: -1, sobre: 'oscuro', credito: CR.A},
  {tipo: 'gancho', texto: 'LOS LEONES DEL CONGRESO SON CAÑONES', y: 400, tamano: 104, color: '#F4EFE6', en: -1},
  {tipo: 'canonL', color: '#F2B134', x: 250, y: 1290, s: 0.95, llegaEn: -5, dur: 0.1, en: -1},
]}]};

const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
ESC.forEach((e, i) => { const d = e.fin - e.inicio; console.log(i + 1, e.inicio, d.toFixed(2)); });
