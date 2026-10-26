// Genera escenas.json desde tiempos.json (tiempos reales de palabra de la voz). Uso: node _generar-escenas.mjs
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
const nota = (lineas, en = 0.1) => ({tipo: 'notas', lineas, en});
const CR = {
  F1: 'Foto: David Iliff · CC BY-SA 3.0 · Wikimedia Commons · Hemiciclo de Estrasburgo (foto de 2014)',
  F2: 'Foto: Guy Delsaut · CC BY-SA 4.0 · Wikimedia Commons · Edificio Europa, sede del Consejo (2017)',
  F3: 'Foto: Diego Delso · CC BY-SA 4.0 · Wikimedia Commons',
  F4: 'Foto: Tamorlan · CC BY-SA 3.0 · Wikimedia Commons',
};
const B = {
  a1: 0, b1: S(13), c1: S(21), s2a: S(24), s2b: S(35), s2c: S(41), s2d: S(53), s2e: S(65), s2f: S(71), s2g: S(84), s2h: S(94),
  s3a: S(105), s3b: S(115), s3c: S(122), s4a: S(126), s4b: S(134), s4c: S(143), s4d: S(155),
  s5a: S(163), s5b: S(175), s5c: S(186), s5d: S(191), s5e: S(202),
  s6a: S(213), s6b: S(215), s7a: S(221), s7b: S(223), s7c: S(237), s7d: S(248),
  s8a: S(261), s8b: S(271), s8c: S(279),
};

// 1 · Gancho
const GANCHO = 'Datos';
void GANCHO;
esc(B.a1, B.b1, {}, [
  rot('2019: VOTARON QUITARLO · DOMINGO: OTRA VEZ', 335, 0),
  {tipo: 'relojH', x: 300, y: 780, r: 190, hora: 3, flecha: false, en: 0},
  {tipo: 'hemiH', x: 740, y: 880, w: 400, checkEn: 0.5, en: 0.1},
  {tipo: 'selloTexto', lineas: ['2019'], x: 690, y: 925, tamano: 100, angulo: -6, desde: 300, en: rel(B.a1, t(12)) - 0.35},
]);
esc(B.b1, B.c1, {}, [
  rot('…Y ESTE DOMINGO, OTRA VEZ', 335, 0.05),
  {tipo: 'relojH', x: 300, y: 780, r: 190, hora: 3, salto: rel(B.b1, t(18)), en: -1},
  {tipo: 'hemiH', x: 740, y: 880, w: 400, checkEn: -1, grisEn: 0, en: -1},
]);
esc(B.c1, B.s2a, {}, [
  rot('¿QUÉ HA PASADO?', 335, 0.05),
  {tipo: 'relojH', x: 540, y: 640, r: 150, hora: 2, flecha: false, en: -1},
  {tipo: 'tlH', y: 860, hitos: [{e: '2018'}, {e: '2019'}, {e: '2025'}, {e: 'HOY'}], en: 0.3},
]);
// 2 · Consulta
esc(B.s2a, B.s2b, {}, [
  rot('2018: CONSULTA DE LA COMISIÓN EUROPEA', 335, 0.05),
  {tipo: 'foto', src: 'F3.jpg', x: 510, y: 690, ancho: 900, alto: 290, foco: '60% 92%', zoom: [1.0, 1.1], dur: rel(B.s2a, B.s2b), en: 0.25, credito: CR.F3, notas: ['Del 4 de julio al 16 de agosto de 2018']},
  {tipo: 'tlH', y: 860, hitos: [{e: '2018', en: 0.2}, {e: '2019'}, {e: '2025'}, {e: 'HOY'}], en: 0.1},
]);
esc(B.s2b, B.s2c, {}, [
  rot('4,6 MILLONES DE RESPUESTAS', 335, 0.05),
  {tipo: 'sobresH', x: 280, y: 900, cifra: '4,6 M', xCifra: 720, yCifra: 780, cifraEn: rel(B.s2b, t(36)) - 0.1, en: 0},
  nota(['Fuente: Comisión Europea, resultados preliminares (31-8-2018)']),
]);
esc(B.s2c, B.s2d, {}, [
  rot('84 %: DEJAR DE CAMBIAR LA HORA', 335, 0.05),
  {tipo: 'barra84H', y: 600, crece: rel(B.s2c, t(42)) - 0.1, en: 0.1},
  nota(['De quienes respondieron · Fuente: Comisión Europea']),
]);
esc(B.s2d, B.s2e, {}, [
  rot('ALEMANIA: 3,79 % DE SU POBLACIÓN', 335, 0.05),
  {tipo: 'paisesH', y: 600, alemaniaEn: rel(B.s2d, t(55)) - 0.1, en: 0.1},
  nota(['Participación por país, en % de habitantes · Fuente: Comisión Europea']),
]);
esc(B.s2e, B.s2f, {}, [
  rot('ESPAÑA: 0,19 %', 335, 0.05),
  {tipo: 'paisesH', y: 600, alemaniaEn: -1, espanaEn: rel(B.s2e, t(66)) - 0.2, en: -1},
  nota(['Participación en % de habitantes · misma fuente']),
]);
esc(B.s2f, B.s2g, {}, [
  rot('12-9-2018: PROPUESTA DE LEY', 335, 0.05),
  {tipo: 'proponeH', x: 230, y: 680, sale: rel(B.s2f, t(76)) - 0.4, haciaX: 780, en: 0.1},
  {tipo: 'tlH', y: 880, hitos: [{e: '2018', ya: true}, {e: '2019'}, {e: '2025'}, {e: 'HOY'}], en: -1},
  nota(['Directiva para acabar con el cambio estacional · COM(2018) 639']),
]);
esc(B.s2g, B.s2h, {}, [
  rot('26-3-2019: 410 A FAVOR', 335, 0.05),
  {tipo: 'foto', src: 'F1.jpg', x: 510, y: 640, ancho: 900, alto: 280, foco: '50% 100%', zoom: [1.25, 1.4], dur: rel(B.s2g, B.s2h), en: 0.2, credito: CR.F1, notas: ['410 a favor · 192 en contra · 51 abstenciones · Fuente: Parlamento Europeo']},
  {tipo: 'votosH', x: 540, y: 1100, R: 300, llenaEn: rel(B.s2g, t(89)) - 0.3, dur: 2.0, en: 0.3},
]);
esc(B.s2h, B.s3a, {}, [
  rot('CADA PAÍS ELIGE: VERANO O INVIERNO', 335, 0.05),
  {tipo: 'partidoH', x: 540, y: 740, r: 190, partidoEn: rel(B.s2h, t(96)) - 0.2, yEt: 1010, en: 0.1},
  nota(['Último cambio previsto: 2021']),
]);
// 3 · Consejo
esc(B.s3a, B.s3b, {}, [
  rot('FALTA OTRO SÍ: EL DEL CONSEJO', 335, 0.05),
  {tipo: 'casillasH', y: 560, checkEn: 0.3, en: 0.1},
]);
esc(B.s3b, B.s3c, {}, [
  rot('CONSEJO = LOS 27 GOBIERNOS', 335, 0.05),
  {tipo: 'foto', src: 'F2.jpg', x: 510, y: 650, ancho: 900, alto: 280, foco: '50% 15%', zoom: [1.0, 1.1], dur: rel(B.s3b, B.s3c), en: 0.2, credito: CR.F2},
  {tipo: 'mesaH', x: 540, y: 990, r: 75, en: rel(B.s3b, t(118)) - 0.4},
]);
esc(B.s3c, B.s4a, {}, [
  rot('ATASCADO DESDE 2019', 335, 0.05),
  {tipo: 'casillasH', y: 560, parada: true, checkEn: -1, en: -1},
  {tipo: 'icono', nombre: 'relojArena', x: 820, y: 1010, tamano: 170, en: 0.5, animEn: 0.6},
  nota(['Fuente: Consejo de la UE, nota 10045/26']),
]);
esc(B.s4a, B.s4b, {}, [
  rot('MOTIVO 1: PEDÍAN MÁS ESTUDIOS', 335, 0.05),
  {tipo: 'carpetaH', x: 540, y: 690, tam: 270, en: 0.2},
  {tipo: 'mesaH', x: 540, y: 990, r: 70, ilumina: rel(B.s4a, t(129)), en: 0.1},
  nota(['La mayoría apoyaba quitarlo; algunos, como Portugal y Grecia, preferían mantener el cambio (Graz, 2018) · Fuentes: Consejo de la UE, informe 14224/18; Presidencia austriaca']),
]);
esc(B.s4b, B.s4c, {}, [
  rot('MOTIVO 2: EVITAR UN MOSAICO DE HORARIOS', 335, 0.05),
  {tipo: 'mosaicoH', x: 540, y: 810, w: 800, mosaicoEn: rel(B.s4b, t(140)) - 0.2, aspaEn: rel(B.s4b, t(142)) + 0.2, en: 0.1},
  nota(["'Time zone patchworks' en el mercado interior · Consejo de la UE, 14224/18"]),
]);
esc(B.s4c, B.s4d, {}, [
  {tipo: 'ejemploH', y: 345, en: 0},
  rot('EJEMPLO: FRANCIA VERANO, ESPAÑA INVIERNO', 440, 0.05),
  {tipo: 'mapaH', paises: ['fr', 'es'], x: 540, y: 880, k: 31, relojes: true, en: 0.1},
]);
esc(B.s4d, B.s5a, {}, [
  {tipo: 'ejemploH', y: 345, en: -1},
  rot('UNA HORA DE DIFERENCIA EN LA FRONTERA', 440, 0.05),
  {tipo: 'fronteraH', dy: 90, dur: rel(B.s4d, B.s5a) - 1.4, en: 0.1},
]);
// 4 · Qué pasó después
esc(B.s5a, B.s5b, {}, [
  rot('2025: PROPUESTA DE PRUEBA', 335, 0.05),
  {tipo: 'calendarioH', x: 540, y: 700, w: 300, hojas: ['2025'], en: 0.15},
  {tipo: 'tlH', y: 880, hitos: [{e: '2018', ya: true}, {e: '2019', ya: true}, {e: '2025', en: 0.3}, {e: 'HOY'}], en: 0.1},
  nota(['Presidencia polaca del Consejo de la UE']),
]);
esc(B.s5b, B.s5c, {}, [
  rot('2 AÑOS CON HORARIO DE VERANO FIJO', 335, 0.05),
  {tipo: 'calendarioH', x: 330, y: 810, w: 250, hojas: ['AÑO 1', 'AÑO 2'], sol: true, en: 0.15},
  {tipo: 'relojH', x: 810, y: 810, r: 115, hora: 3, flecha: false, en: 0.3},
  nota(['Prueba en toda la UE · Fuente: Consejo de la UE, nota 10045/26']),
]);
esc(B.s5c, B.s5d, {}, [
  rot('LOS GOBIERNOS: MÁS ANÁLISIS', 335, 0.05),
  {tipo: 'mesaH', x: 540, y: 810, r: 125, en: 0.1},
  {tipo: 'carpetaH', x: 540, y: 810, tam: 190, en: 0.5},
]);
esc(B.s5d, B.s5e, {}, [
  rot('GOBIERNO DE ESPAÑA: ACABAR CON EL CAMBIO', 335, 0.05),
  {tipo: 'mapaH', paises: ['es'], x: 290, y: 740, k: 36, etiquetaEs: 'Gobierno de España', en: 0.1},
  {tipo: 'flechaH', x1: 480, y1: 720, x2: 625, y2: 720, en: rel(B.s5d, t(197)) - 0.2},
  {tipo: 'mesaH', x: 800, y: 720, r: 85, en: 0.4},
  nota(['20-10-2025 · Lo planteó en el Consejo de Energía de la UE']),
]);
esc(B.s5e, B.s6a, {}, [
  rot('SÁNCHEZ: EL AHORRO YA NO LO JUSTIFICA', 335, 0.05),
  {tipo: 'tarjetaBustoH', y: 530, l1: 'Pedro Sánchez ·', l2: 'presidente del', l3: 'Gobierno', en: 0.1},
  {tipo: 'energiaH', x: 540, y: 990, en: rel(B.s5e, t(206)) - 0.4},
  nota(['Pedro Sánchez, presidente del Gobierno (20-10-2025) · No eligió entre verano e invierno · Fuente: La Moncloa']),
]);
// 5 · Hoy
esc(B.s6a, B.s6b, {}, [
  rot('¿Y HOY?', 335, 0.05),
  {tipo: 'tlH', y: 640, hitos: [{e: '2018', ya: true}, {e: '2019', ya: true}, {e: '2025', ya: true}, {e: 'HOY', en: 0.3}], en: 0.05},
]);
esc(B.s6b, B.s7a, {}, [
  rot('CONSEJO: SIN POSTURA COMÚN', 335, 0.05),
  {tipo: 'casillasH', y: 560, parada: false, checkEn: -1, en: 0.1},
  nota(['A fecha de 2026-10-22 · Fuente: Parlamento Europeo, Observatorio Legislativo']),
]);
esc(B.s7a, B.s7b, {fondo: 'crema'}, [
  rot('¿LO CURIOSO?', 335, 0.05),
  {tipo: 'icono', nombre: 'tarjetas', x: 540, y: 780, tamano: 380, en: 0.1, animEn: 0.2},
]);
esc(B.s7b, B.s7c, {}, [
  rot('CALENDARIO DE CAMBIOS: HASTA 2031', 335, 0.05),
  {tipo: 'calendarioH', x: 300, y: 760, w: 300, hojas: ['2027'], anios: [
    {t: 0.3, txt: '2027'}, {t: 0.95, txt: '2028'}, {t: 1.6, txt: '2029'}, {t: 2.25, txt: '2030'}, {t: rel(B.s7b, t(234)) - 0.15, txt: '2031'}], chips: true, en: 0.1},
  {tipo: 'foto', src: 'F3.jpg', x: 770, y: 760, ancho: 340, alto: 420, foco: '75% 93%', zoom: [1.0, 1.12], dur: rel(B.s7b, B.s7c), en: 0.3, credito: CR.F3, notas: ['Diario Oficial de la UE, C/2026/1660 (18-3-2026)']},
]);
esc(B.s7c, B.s7d, {}, [
  rot('TRÁMITE OBLIGATORIO CADA 5 AÑOS', 335, 0.05),
  {tipo: 'calendarioH', x: 300, y: 760, w: 300, hojas: ['2031'], anios: [{t: -1, txt: '2031'}], chips: true, cierraEn: rel(B.s7c, t(240)) - 0.3, en: -1},
  {tipo: 'selloTexto', lineas: ['TRÁMITE'], x: 540, y: 880, tamano: 96, angulo: -4, fondo: '#8D99AE', en: rel(B.s7c, t(240)) + 0.2},
  nota(['Directiva 2000/84/CE, art. 4']),
]);
esc(B.s7d, B.s8a, {}, [
  rot('ESTUDIO DE LA COMISIÓN: FINALES DE 2026', 335, 0.05),
  {tipo: 'mesaH', x: 790, y: 700, r: 80, en: 0.1},
  {tipo: 'carpetaH', x: 250, y: 700, tam: 220, a: {x: 790, y: 700, en: rel(B.s7d, t(254)), dur: 2.0}, en: 0.2},
  {tipo: 'tlH', y: 860, hitos: [{e: '2018', ya: true}, {e: '2019', ya: true}, {e: '2025', ya: true}, {e: 'HOY', ya: true}], previsto: rel(B.s7d, t(257)) - 0.2, en: 0.1},
  nota(['Lanzado en febrero de 2026 · Verano o invierno fijos · Fuente: Consejo de la UE, nota 10045/26']),
]);
// 6 · Cierre
esc(B.s8a, B.s8b, {}, [
  rot('DOMINGO 25: LAS 3 SERÁN LAS 2', 335, 0.05),
  {tipo: 'relojH', x: 260, y: 700, r: 150, hora: 3, salto: rel(B.s8a, t(268)) - 0.2, en: 0.1},
  {tipo: 'foto', src: 'F4.jpg', x: 740, y: 690, ancho: 420, alto: 340, foco: '50% 62%', zoom: [1.0, 1.12], dur: rel(B.s8a, B.s8b), en: 0.25, credito: CR.F4, notas: ['Fuente: BOE, Orden PCM/186/2022']},
  {tipo: 'icono', nombre: 'calendario', x: 540, y: 1010, tamano: 200, mes: 'OCT', dia: '25', en: 0.5},
]);
esc(B.s8b, B.s8c, {}, [
  rot('CANARIAS: A LAS 2, SERÁ LA 1', 335, 0.05),
  {tipo: 'canariasH', x: 290, y: 760, en: 0.1},
  {tipo: 'relojH', x: 770, y: 760, r: 125, hora: 2, salto: rel(B.s8b, t(276)) - 0.1, en: 0.3},
  nota(['Fuente: BOE, Orden PCM/186/2022']),
]);
esc(B.s8c, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '¿VERANO O INVIERNO?', tamano: 88, yGuardalo: 1200, yFuentes: 1310, pulso: true},
  {tipo: 'partidoH', x: 540, y: 920, r: 150, partidoEn: 0.5, yEt: 1130, en: 0.2},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'foto', src: 'F4.jpg', forma: 'completa', velo: 0.4, foco: '50% 55%', zoom: [1.0, 1.0], dur: 3, en: -1, sobre: 'oscuro', credito: CR.F4},
  {tipo: 'gancho', texto: '¿POR QUÉ SEGUIMOS CAMBIANDO LA HORA?', y: 470, tamano: 104, color: '#F4EFE6', en: -1},
  {tipo: 'flechaAtrasH', x: 800, y: 1230, r: 85, en: -1},
]}]};

const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
ESC.forEach((e, i) => { const d = e.fin - e.inicio; if (d < 1.4) console.log('corta', i + 1, e.inicio, d.toFixed(2)); });
