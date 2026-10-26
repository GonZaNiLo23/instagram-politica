// Genera escenas.json desde tiempos.json (tiempos reales de palabra). Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const DUR = r(T.duracion + 2.6);
const rel = (a, abs) => r(abs - a);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.1, o = {}) => ({tipo: 'notas', lineas, en, ...o});
const CR = 'Imagen de archivo · Foto: Esetena · CC BY-SA 3.0 · Wikimedia Commons';
const F155 = 'Fuente: Constitución, art. 155.1 (BOE)';
const SEN = (o) => ({tipo: 'recorte', src: 'senado.png', giro: -2, ...o});
const GOB = ['GOBIERNO DE ESPAÑA'];
// Cortes (absolutos)
const B = {b2: S(17), b2b: S(32), b3a: S(45), b3b: S(54), b3c: S(65), b3d: S(77), b4a: S(92), b4b: r(t(103) - 0.1), b4c: r(t(103) + 1.9), b5a: S(115), b5b: S(128), b5c: S(137), b6a: S(152), b6b: S(167), b7a: S(179), b7b: S(185)};
const ESCALERA = (a) => ({tipo: 'escaleraS', x: 640, y: 1125, paso: [rel(a, B.b3a), rel(a, B.b3b), rel(a, B.b3c)].map((v) => Math.max(0, v)), en: -1});
const paso = (k) => [0, 1, 2].map((i) => (i <= k ? 0 : 99));
const escalera = (k, fl) => ({tipo: 'escaleraS', x: 640, y: 1125, paso: paso(k), en: -1, flecha: fl});

// 1 · Gancho
esc(0, B.b2, {}, [
  {tipo: 'gancho', texto: 'ARTÍCULO 155: CASI 39 AÑOS SIN APLICARSE', y: 335, tamano: 64, en: -1, hasta: S(7) - 0.05},
  rot('214 SÍ · 47 NO · 1 ABSTENCIÓN', 335, S(7)),
  SEN({x: 290, y: 690, ancho: 440, desde: 'escala', en: 0.1, credito: CR}),
  {tipo: 'tarjetaS', lineas: ['155'], x: 760, y: 535, ancho: 360, alto: 310, tamano: 190, titular: true, en: 0.4},
  {tipo: 'anioS', desde: 1978, hasta: 2017, x: 60, y: 880, tamano: 170, en: 0.3, dur: 1.9, salida: S(7)},
  {tipo: 'votosS', y: 870, en: S(7) + 0.05},
]);
// 2 · Contexto
esc(B.b2, B.b2b, {}, [
  rot('155: EL GOBIERNO PUEDE OBLIGAR A CUMPLIR', 335, 0.05),
  {tipo: 'tarjetaS', lineas: GOB, y: 540, alto: 130, en: 0.2, luz: rel(B.b2, t(25))},
  {tipo: 'tarjetaS', lineas: ['COMUNIDAD AUTÓNOMA'], y: 830, alto: 130, en: 0.3, luz: rel(B.b2, t(29))},
  {tipo: 'flechaS', x1: 540, y1: 690, x2: 540, y2: 810, en: rel(B.b2, t(26)) - 0.1, dur: 0.8, candado: {x: 760, y: 770, en: rel(B.b2, t(31)) - 0.2}},
  nota(['Fuente: Constitución, art. 155.1 (BOE)'], 0.1),
]);
esc(B.b2b, B.b3a, {}, [
  {tipo: 'casillasS', y: 380, sep: 'O', items: [
    {texto: 'INCUMPLE LA CONSTITUCIÓN O LAS LEYES', n: 3, en: rel(B.b2b, t(33)) - 0.1},
    {texto: 'ATENTA GRAVEMENTE AL INTERÉS GENERAL', n: 2, en: rel(B.b2b, t(40)) - 0.1},
  ]},
  nota(['Fuente: Constitución, art. 155.1 (BOE)'], 0.1),
]);
// 3 · Explicación (escalera de 3 peldaños)
const FUENTE3 = 'Fuente: Constitución, art. 155.1 (BOE) · Reglamento del Senado, art. 189.5';
esc(B.b3a, B.b3b, {}, [
  rot('1 · REQUERIMIENTO AL PRESIDENTE', 335, 0.05),
  {tipo: 'sobreS', de: [540, 620], a: [540, 720], en: 0.1, dur: 0.9, ancho: 330},
  {tipo: 'selloTexto', lineas: ['REQUERIMIENTO'], x: 520, y: 840, tamano: 64, angulo: -4, desde: 160, en: rel(B.b3a, t(53)) - 0.1},
  escalera(0),
  nota([FUENTE3], 0.1),
]);
esc(B.b3b, B.b3c, {}, [
  rot('2 · SI NO LO ATIENDE: AL SENADO', 335, 0.05),
  SEN({x: 715, y: 790, ancho: 400, desde: 'derecha', en: 0.15, credito: CR}),
  {tipo: 'carpetaS', lineas: ['SOLICITUD', 'DEL', 'GOBIERNO'], de: [285, 790], a: [715, 800], en: 0.1, dur: Math.max(0.8, rel(B.b3b, t(63)) - rel(B.b3b, t(58)) - 0.3), ancho: 450, alto: 310, entra: true},
  escalera(1),
]);
esc(B.b3c, B.b3d, {}, [
  rot('3 · MAYORÍA ABSOLUTA: MÁS DE LA MITAD', 335, 0.05),
  {tipo: 'barraMitadS', y: 700, en: 0.1, partEn: rel(B.b3c, t(70)) - 0.1},
  escalera(2),
  nota([FUENTE3], 0.1),
]);
esc(B.b3d, B.b4a, {}, [
  rot('→ MEDIDAS: OBLIGAR A CUMPLIR O PROTEGER', 335, 0.05),
  {tipo: 'tarjetaS', lineas: GOB, y: 520, alto: 110, en: 0.1, hasta: rel(B.b3d, t(85)) - 0.1},
  {tipo: 'tarjetaS', lineas: ['COMUNIDAD AUTÓNOMA'], y: 770, alto: 110, en: 0.1, hasta: rel(B.b3d, t(85)) - 0.1},
  {tipo: 'carpetaS', lineas: ['MEDIDAS'], de: [540, 700], a: [540, 830], en: 0.2, dur: Math.max(0.8, rel(B.b3d, t(85)) - 1.4), ancho: 400, alto: 150, abreEn: rel(B.b3d, t(85)) - 0.5, hasta: rel(B.b3d, t(85)) - 0.1},
  {tipo: 'casillasS', y: 560, items: [
    {texto: 'OBLIGAR A CUMPLIR', n: 1, en: rel(B.b3d, t(85)) + 0.05},
    {texto: 'PROTEGER EL INTERÉS GENERAL', n: 2, en: rel(B.b3d, t(88)) - 0.1},
  ]},
  escalera(2, rel(B.b3d, t(77)) - 0.05),
  nota([FUENTE3], 0.1),
]);
// 4 · Cómo se aplicó
const FUENTE4 = 'Fuente: Diario de Sesiones del Senado, 27-10-2017 · Moncloa 19-10-2017';
const LT = (a, h) => ({tipo: 'lineaS', y: 1090, en: -1, hitos: [{x: 190, etiqueta: '11-OCT', en: h[0]}, {x: 540, etiqueta: '19-OCT', en: h[1]}, {x: 890, etiqueta: '27-OCT', en: h[2]}]});
esc(B.b4a, B.b4b, {}, [
  rot('11-OCT-2017: REQUERIMIENTO', 335, 0.05),
  {tipo: 'tarjetaS', lineas: GOB, y: 510, alto: 170, en: 0.1, luz: 0.3},
  {tipo: 'tarjetaS', lineas: ['GENERALITAT', 'DE CATALUNYA'], y: 770, alto: 170, en: 0.1, luz: rel(B.b4a, B.b4b) - 0.2},
  {tipo: 'sobreS', de: [540, 725], a: [540, 855], en: 0.5, dur: rel(B.b4a, B.b4b) - 0.8, ancho: 200, escalaFin: 0.5},
  LT(0, [0.3, 99, 99]),
  nota([FUENTE4], 0.1),
]);
esc(B.b4b, B.b4c, {}, [
  rot('19-OCT: NO ATENDIDO, SEGÚN EL GOBIERNO', 335, 0.05),
  {tipo: 'tarjetaS', lineas: GOB, y: 510, alto: 170, en: -1},
  {tipo: 'tarjetaS', lineas: ['GENERALITAT', 'DE CATALUNYA'], y: 770, alto: 170, en: -1},
  {tipo: 'sobreS', de: [540, 855], a: [540, 725], en: 0.2, dur: 0.9, ancho: 200, escalaFin: 0.8},
  {tipo: 'selloTexto', lineas: ['NO ATENDIDO'], x: 640, y: 700, tamano: 64, angulo: -5, desde: 120, en: Math.max(1.1, rel(B.b4b, t(105)) - 0.1)},
  LT(0, [0, 0.1, 99]),
  nota([FUENTE4], 0.1),
]);
esc(B.b4c, B.b5a, {}, [
  rot('VOTOS EN EL SENADO, 27-10-2017', 335, 0.05),
  {tipo: 'votosS', y: 560, en: 0.2},
  LT(0, [0, 0, 0.1]),
  nota([FUENTE4], 0.1),
]);
// 5 · Las dos posturas (tarjetas iguales, sin edificio ni retratos)
const FUENTE5 = 'Fuente: Diario de Sesiones del Senado, 27-10-2017 · STC 89/2019 y 90/2019 (BOE)';
const cardG = (y, o) => ({tipo: 'tarjetaS', lineas: ['GOBIERNO', 'DE', 'ESPAÑA'], x: 275, y, ancho: 430, alto: 250, en: -1, ...o});
const cardP = (y, o) => ({tipo: 'tarjetaS', lineas: ['PARLAMENT', 'DE', 'CATALUNYA'], x: 725, y, ancho: 430, alto: 250, en: -1, ...o});
esc(B.b5a, B.b5b, {}, [
  rot('GOBIERNO: LA GENERALITAT INCUMPLÍA', 335, 0.05),
  cardG(505, {en: 0.1, luz: 0.3}),
  cardP(505, {en: 0.1}),
  {tipo: 'casillasS', y: 770, items: [
    {texto: 'INCUMPLE LA CONSTITUCIÓN', n: 2, en: rel(B.b5a, t(120)) - 0.1},
    {texto: 'REQUERIMIENTO NO ATENDIDO', n: 2, en: rel(B.b5a, t(124)) - 0.1},
  ]},
  nota([FUENTE5], 0.1),
]);
esc(B.b5b, B.b5c, {}, [
  rot('RECURRIERON: DIPUTADOS DE UNIDOS PODEMOS Y PARLAMENT', 335, 0.05),
  cardG(590, {luz: 0}),
  cardP(590, {luz: rel(B.b5b, t(134)) - 0.1}),
  {tipo: 'casillasS', y: 860, items: [{texto: 'RECURSO ANTE EL CONSTITUCIONAL', n: 2, en: rel(B.b5b, t(135)) - 0.1}]},
  nota([FUENTE5], 0.1),
]);
esc(B.b5c, B.b6a, {}, [
  rot('NO PERMITE SUSTITUIR GOBIERNO NI DISOLVER PARLAMENTO', 335, 0.05),
  {tipo: 'casillasS', y: 620, items: [
    {texto: 'OBLIGAR A CUMPLIR', n: 1, en: rel(B.b5c, t(140)) - 0.1, tipo: 'ok'},
    {texto: 'SUSTITUIR AL GOBIERNO CATALÁN', n: 2, en: rel(B.b5c, t(144)) - 0.1, tipo: 'no'},
    {texto: 'DISOLVER EL PARLAMENTO', n: 2, en: rel(B.b5c, t(149)) - 0.1, tipo: 'no'},
  ]},
  nota([FUENTE5], 0.1),
]);
// 6 · Giro (fondo mostaza)
esc(B.b6a, B.b6b, {fondo: 'mostaza'}, [
  rot('2019: TRIBUNAL CONSTITUCIONAL AVALA', 335, 0.05),
  rot('ANULA SOLO UNA REGLA', 520, rel(B.b6a, t(164)) - 0.1),
  {tipo: 'docS', x: 60, y: 730, ancho: 400, en: 0.2, tachaEn: rel(B.b6a, t(165)) - 0.1},
  {tipo: 'selloTexto', lineas: ['UNANIMIDAD'], x: 640, y: 790, tamano: 64, angulo: -6, desde: 160, en: rel(B.b6a, t(163)) - 0.2},
  nota(['Fuente: Tribunal Constitucional, nota informativa 89/2019'], 0.1),
]);
esc(B.b6b, B.b7a, {fondo: 'mostaza'}, [
  rot('LÍMITE: NI SUPRIMIR NI SUSPENDER SIN FIN', 335, 0.05),
  {tipo: 'autonomiaS', y: 620, en: 0.2, tachaA: rel(B.b6b, t(173)), tachaB: rel(B.b6b, t(177)) - 0.2, mantieneEn: rel(B.b6b, t(178)) - 0.1},
  nota(['Fuente: Tribunal Constitucional, nota informativa 89/2019'], 0.1),
]);
// 7 · Cierre
esc(B.b7a, B.b7b, {}, [
  rot('¿POR QUÉ ELLOS? MAYORÍA ABSOLUTA DEL SENADO', 335, 0.05),
  SEN({x: 290, y: 690, ancho: 440, desde: 'escala', en: 0.1, credito: CR}),
  {tipo: 'votosS', y: 870, en: 0.3},
  {tipo: 'selloTexto', lineas: ['MAYORÍA', 'ABSOLUTA'], x: 730, y: 585, tamano: 64, angulo: -5, desde: 200, en: rel(B.b7a, t(183)) - 0.2},
]);
esc(B.b7b, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '¿LO MANTENDRÍAS O LO REFORMARÍAS?', pregunta: 'Requerimiento · Senado · medidas', tamano: 96, pulso: true, guardaEn: rel(B.b7b, t(193)) - 0.15},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'gancho', texto: 'CASI 39 AÑOS SIN APLICARSE', y: 340, tamano: 104, en: -1},
  SEN({x: 540, y: 930, ancho: 860, desde: 'escala', en: -1, flota: false, credito: 'Imagen de archivo'}),
  {tipo: 'tarjetaS', lineas: ['ARTÍCULO 155'], x: 540, y: 1265, ancho: 860, alto: 170, tamano: 80, titular: true, en: -1},
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, musica: {pista: 'wallpaper.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
ESC.forEach((e, i) => { const d = e.fin - e.inicio; console.log(i + 1, e.inicio, d.toFixed(2)); });
