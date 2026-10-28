// Genera escenas.json desde tiempos.json (tiempos reales de palabra). Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const DUR = r(T.duracion + 1.6);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.1, o = {}) => ({tipo: 'notas', lineas, en, ...o});
const CR = 'Foto: Martin Falbisoner / Wikimedia Commons, CC BY-SA 3.0';
const NB = ' ';
const AZUL = '#2F6FB5';
const ROJO = '#D6322E';
const MOST = '#F2B134';
const rel = (base, i) => r(t(i) - base);
const DATOS = 'Datos a 27-10-2026';

// 1 · Gancho: 4 escaños (Senado)
const b2 = S(15);
esc(0, b2, {}, [
  {tipo: 'gancho', texto: '4 ESCAÑOS', y: 335, tamano: 124, en: -1},
  rot('para controlar el Senado', 520, -1),
  {tipo: 'hemiM', total: 100, filas: 5, x: 500, y: 1075, radio: 340, punto: 30, en: -1, ent: 0.6,
    tramos: [{hasta: 47, color: '#B4BBC8', en: -1}, {hasta: 51, color: MOST, en: 0.5, pop: true}, {hasta: 100, color: '#B4BBC8', en: -1}]},
]);

// 2a · Capitolio recortado + calendario
const b2b = S(26);
esc(b2, b2b, {}, [
  rot('MARTES 3 DE NOVIEMBRE', 335, 0.05),
  rot('ELECCIONES DE MITAD DE MANDATO', 415, rel(b2, 21) - 0.1),
  {tipo: 'icono', nombre: 'calendario', x: 215, y: 1010, tamano: 260, en: 0.2, mes: 'NOV', dia: '3', animEn: 0.3},
  {tipo: 'recorte', src: 'capitolio.png', x: 640, y: 880, ancho: 520, giro: -2, desde: 'abajo', en: 0.1, credito: CR},
]);
// 2b · Trump fuera de la papeleta, el Congreso dentro
const b3 = S(45);
esc(b2b, b3, {}, [
  rot('Trump no está', 335, 0.05),
  rot('en la papeleta', 415, 0.05),
  {tipo: 'papeletaM', x: 500, y: 890, en: 0.1, siluetaEn: rel(b2b, 26) - 0.1, aspaEn: rel(b2b, 31) - 0.1, congresoEn: rel(b2b, 40) - 0.2},
]);

// 3a · Cámara: 435
const b3b = S(85);
const hemiCamara = {tipo: 'hemiM', total: 435, filas: 9, x: 500, y: 1075, radio: 340, punto: 21, en: 0.15, ent: 1.2,
  titulo: 'Escaños en la Cámara hoy', yTitulo: 700,
  tramos: [
    {hasta: 214, color: AZUL, en: rel(b3, 70) - 0.05},
    {hasta: 216, color: '#14213D', hueco: true, en: rel(b3, 83) - 0.1},
    {hasta: 217, color: ROJO, anillo: true, en: rel(b3, 75) - 0.1},
    {hasta: 435, color: ROJO, en: rel(b3, 64) - 0.05},
  ],
  linea: {idx: 218, en: rel(b3, 57), etiqueta: '218'},
  leyenda: {en: rel(b3, 64), y: 1118, items: [{color: ROJO, texto: 'Republicanos'}, {color: AZUL, texto: 'Demócratas'}]}};
esc(b3, b3b, {}, [
  rot('CÁMARA: 435 ESCAÑOS', 335, 0.05),
  rot('MAYORÍA: 218', 415, rel(b3, 57) - 0.1, {hasta: rel(b3, 63) - 0.1}),
  rot(`R${NB}218${NB}·${NB}D${NB}214`, 415, rel(b3, 63) - 0.05),
  rot(`1${NB}ind.${NB}(con${NB}R)${NB}·${NB}2${NB}vacantes`, 495, rel(b3, 74) - 0.05),
  hemiCamara,
  nota([DATOS], 0.1),
]);

// 3b · Senado: 35 de 100
const b3c = S(128);
const hemiSenado = {tipo: 'hemiM', total: 100, filas: 5, x: 500, y: 1075, radio: 340, punto: 30, en: 0.15, ent: 1,
  titulo: 'Senado hoy; 35 en juego', yTitulo: 700,
  tramos: [
    {hasta: 45, color: AZUL, en: rel(b3b, 108) - 0.05},
    {hasta: 47, color: AZUL, anillo: true, en: rel(b3b, 112) - 0.05},
    {hasta: 100, color: ROJO, en: rel(b3b, 100) - 0.05},
  ],
  parpadeo: {n: 35, desde: rel(b3b, 92) - 0.05, fijo: true},
  linea: {idx: 51, en: rel(b3b, 119), etiqueta: '51', dy: 0},
  leyenda: {en: rel(b3b, 98), y: 1118, items: [{color: ROJO, texto: 'Republicanos'}, {color: AZUL, texto: `Demócratas + ind.`}]}};
const cambio = rel(b3b, 118) - 0.1;
esc(b3b, b3c, {}, [
  rot('SENADO: 35 DE 100', 335, 0.05, {hasta: cambio}),
  rot(`R${NB}53${NB}·${NB}D${NB}45${NB}+${NB}2${NB}ind.`, 415, rel(b3b, 98) - 0.05, {hasta: cambio}),
  rot('MAYORÍA: 51', 335, cambio + 0.1),
  rot('(empata el vicepresidente)', 415, rel(b3b, 122) - 0.05),
  hemiSenado,
  nota([DATOS], 0.1),
]);

// 3c · 36 gobernadores
const b4 = S(138);
esc(b3c, b4, {}, [
  rot('36 GOBERNADORES DE ESTADO', 335, rel(b3c, 131) - 0.1),
  {tipo: 'mapaGobM', x: 40, y: 555, paso: 70, en: 0.1, luzEn: rel(b3c, 131) - 0.1, dur: 1.4, titulo: 'Estados que eligen gobernador', yTitulo: 535},
  nota([DATOS], 0.1),
]);

// 4 · Por qué importa
const b4b = S(148);
esc(b4, b4b, {}, [
  rot('UNA LEY NECESITA LAS DOS CÁMARAS', 335, 0.05),
  {tipo: 'leyM', x: 500, y: 790, en: rel(b4, 139) - 0.3, unenEn: rel(b4, 146) - 0.1},
]);
const b4c = S(162);
esc(b4b, b4c, {}, [
  rot('SENADO: CONFIRMA NOMBRAMIENTOS', 335, 0.05),
  {tipo: 'juezM', x: 500, y: 880, en: 0.15, selloEn: rel(b4b, 151) - 0.1},
]);
const b5 = S(169);
esc(b4c, b5, {}, [
  rot('CONGRESO: GASTO FEDERAL', 335, 0.05),
  {tipo: 'billeteM', texto: '$', x: 500, y: 840, tam: 520, sube: 500, en: 0.2},
]);

// 5 · Patrón
const b6 = S(210);
esc(b5, b6, {}, [
  rot('Y hay un patrón', 335, 0.05, {hasta: rel(b5, 184) - 0.15}),
  rot('DESDE 1934: SOLO 3 EXCEPCIONES', 335, rel(b5, 184) - 0.05, {hasta: rel(b5, 195) - 0.1}),
  rot(`MEDIA${NB}1934–2018:`, 335, rel(b5, 195) - 0.05, {hasta: rel(b5, 204) - 0.15}),
  rot('Tendencia, no garantía', 335, rel(b5, 204) - 0.05),
  {tipo: 'tlM', x: 70, y: 590, en: rel(b5, 173) - 0.1, dur: 3.4, excEn: rel(b5, 193) - 0.1, marcaEn: rel(b5, 190) - 0.1},
  {tipo: 'contador', desde: 0, hasta: 28, prefijo: '−', salto: true, en: rel(b5, 201) - 0.1, etiqueta: 'ESCAÑOS', izq: 60, y: 830, tamano: 170, tamEtiqueta: 64},
]);

// 6 · Cierre
const b6b = S(222);
esc(b6, b6b, {}, [
  {tipo: 'hemiM', total: 100, filas: 5, x: 500, y: 1075, radio: 340, punto: 30, en: -1, ent: 0.5,
    tramos: [{hasta: 47, color: AZUL, en: -1}, {hasta: 51, color: MOST, pop: true, en: rel(b6, 216) - 0.1}, {hasta: 100, color: ROJO, en: -1}],
    linea: {idx: 51, en: rel(b6, 219) - 0.1}},
  {tipo: 'sumaM', x: 500, y: 560, en: 0.1, sumaEn: rel(b6, 216) - 0.1, totalEn: rel(b6, 219) - 0.1, tam: 130},
]);
esc(b6b, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '¿VOLVERÁ A PERDER ESCAÑOS EN LA CÁMARA?', tamano: 92, pulso: true, guardaEn: Math.max(0.8, rel(b6b, 233) - 0.15)},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'gancho', texto: '4 ESCAÑOS PARA CAMBIAR EL SENADO', y: 340, tamano: 96, en: -1},
  {tipo: 'recorte', src: 'capitolio.png', x: 540, y: 1070, ancho: 560, giro: -2, desde: 'escala', en: -1, flota: false, credito: CR},
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, musica: {pista: 'hidden-agenda.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
