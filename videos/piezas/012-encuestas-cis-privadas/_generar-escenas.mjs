// Genera escenas.json desde tiempos.json (tiempos reales de palabra). Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const DUR = r(Math.max(T.duracion + 3.2, 86.5));
const rel = (a, abs) => r(abs - a);
const ESC = [];
const AVISOS = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.1, o = {}) => ({tipo: 'notas', lineas, en, ...o});
const CR_F1 = 'Foto: Luis García (Zaqarbal) · CC BY-SA 3.0 es · Wikimedia Commons (recorte)';
const COL = {PSOE: '#D8493E', PP: '#3B8EDB'}; // PARTIDOS de tema.ts; mismo tratamiento, siempre con el nombre al lado
const A = {n: S(0)};
// Escala común (px por unidad) en todos los gráficos de barras: 11
const filaPSOE = (y, en, valor, texto, extra = {}) => ({etiqueta: 'PSOE', valor, texto, color: COL.PSOE, y, en, ...extra});
const filaPP = (y, en, valor, texto, extra = {}) => ({etiqueta: 'PP', valor, texto, color: COL.PP, y, en, ...extra});

const B = {g1: 0, g2: S(10), g3: S(14), c1: S(17), c2: S(24), c3: S(31), c4: S(36), c5: S(49), d1: S(59), d2: S(66), d3: S(77), d4: S(84), d5: S(93), d6: S(103), d7: S(113), d8: S(123),
  e1: S(130), e2: S(135), e3: S(143), e4: S(156), e5: S(166), e6: S(173), f1: S(184), f2: S(195), f3: S(205), f4: S(216)};
const bal1 = (inc, en = 0) => ({tipo: 'balanzaE', x: 290, y: 800, baja: 'izq', izq: 'PSOE', der: 'PP', inclinaEn: inc, en});
const bal2 = (inc, en = 0) => ({tipo: 'balanzaE', x: 760, y: 800, baja: 'der', izq: 'PSOE', der: 'PP', inclinaEn: inc, en});

// 1 · Gancho
esc(0, B.g2, {}, [
  rot('CIS: PSOE +11,8 PUNTOS', 335, -1),
  nota(['Ventaja en estimación de voto · CIS, barómetro de octubre 2026'], -1),
  {...bal1(0.0, -1), seco: true},
]);
esc(B.g2, B.g3, {}, [
  rot('PRIVADAS: PP PRIMERO', 335, 0.05),
  nota(['Encuestas privadas de octubre · según Euronews, 14-10-2026'], 0.05),
  {...bal1(-1), seco: true},
  {...bal2(0.05), seco: true},
]);
esc(B.g3, B.c1, {}, [
  rot('¿QUIÉN TIENE RAZÓN?', 335, 0.05),
  {...bal1(-1), seco: true},
  {...bal2(-1), seco: true},
  {tipo: 'cifraGrande', texto: '?', x: 540, y: 640, tamano: 230, en: 0.1},
]);
// 2 · Contexto
const NOTA_CIS = ['CIS = Centro de Investigaciones Sociológicas, organismo público · estudio 3582 · campo 1–6 oct · estimación, % sobre voto válido'];
esc(B.c1, B.c2, {}, [
  rot('CIS octubre: PSOE 34 %', 335, 0.05),
  {tipo: 'foto', src: 'F1c.jpg', x: 500, y: 790, ancho: 880, alto: 480, foco: '50% 40%', zoom: [1.0, 1.12], dur: rel(B.c1, B.c2) + 0.5, en: 0.1, hasta: rel(B.c1, B.c2) - 0.02},
  nota([CR_F1], 0.1, {y: 1040, hasta: rel(B.c1, B.c2) - 0.02}),
  nota(NOTA_CIS, 0.1),
]);
esc(B.c2, B.c3, {}, [
  rot('CIS octubre: PSOE 34 %', 335, -1),
  {tipo: 'foto', src: 'F1c.jpg', x: 230, y: 900, ancho: 340, alto: 185, foco: '50% 40%', zoom: [1.0, 1.0], dur: 1, en: -1},
  nota([CR_F1], -1, {y: 1010}),
  nota(NOTA_CIS, -1),
  {tipo: 'barrasE', filas: [filaPSOE(540, rel(B.c2, t(25)) - 0.1, 34, '34 %', {dur: 0.9})], en: 0},
  {tipo: 'sello', valor: 'DATO', x: 720, y: 690, tamano: 90, angulo: 4, desde: -170, en: rel(B.c2, t(28))},
]);
esc(B.c3, B.c4, {}, [
  rot('PP 22,2 %', 335, 0.05),
  nota(['Fuente: CIS, estudio 3582'], 0.05),
  {tipo: 'barrasE', filas: [filaPSOE(540, -5, 34, '34 %'), filaPP(640, 0.15, 22.2, '22,2 %', {dur: 0.8})], en: -1},
  {tipo: 'tarjetaE', titular: 'Privadas de octubre (40dB, GAD3…): PP primero', x: 210, ancho: 750, y: 790, alto: 250, icono: false, entra: 'abajo', en: 0.45},
  nota(['Según Euronews, 14-10-2026'], 0.45, {y: 1060}),
]);
esc(B.c4, B.c5, {}, [
  rot('PP: el CIS ha perdido credibilidad', 335, 0.05),
  {tipo: 'tarjetaE', titular: 'Juan Bravo, vicesecretario del PP', y: 560, entra: 'izq', en: 0.1},
  nota(['Juan Bravo, vicesecretario del PP · 14-10-2026 · según Artículo14'], 0.1),
]);
esc(B.c5, B.d1, {}, [
  rot('CIS: teléfonos al azar + cuotas', 335, 0.05),
  {tipo: 'tarjetaE', titular: 'Juan Bravo, vicesecretario del PP', y: 560, entra: 'izq', en: -1},
  {tipo: 'tarjetaE', titular: 'Centro de Investigaciones Sociológicas', y: 860, entra: 'der', en: 0.1},
  nota(['Ficha técnica del CIS, estudio 3582: teléfonos al azar y cuotas de sexo y edad'], 0.1),
]);
// 3 · Explicación
const rejilla = {tipo: 'personasE', n: 36, cols: 12, y: 720, tam: 54, paso: 62};
esc(B.d1, B.d2, {}, [
  rot('2 PASOS · 1: PREGUNTAR', 335, 0.05),
  {tipo: 'pasosE', y: 620, enc1: rel(B.d1, t(64)) - 0.1, en: 0.1},
  {...rejilla, aparece: {en: rel(B.d1, t(65)) - 0.1, dur: 1.2}},
]);
esc(B.d2, B.d3, {}, [
  rot('CIS: más de 5.000 entrevistas', 335, 0.05),
  {tipo: 'pasosE', y: 620, enc1: -1, en: -1},
  {...rejilla, aparece: {en: -9, dur: 1}},
  {tipo: 'contador', desde: 0, hasta: 5024, en: 0.2, espera: rel(B.d2, t(68)) - 0.2, dur: 2.4, etiqueta: 'entrevistas', y: 905, tamano: 100},
  nota(['5.024 entrevistas (datos definitivos, 20-10) · teléfono (CATI), 1–6 oct · error ±1,4 % · CIS, estudio 3582'], 0.1),
]);
esc(B.d3, B.d4, {}, [
  rot('VOTO DIRECTO = lo que contestan', 335, 0.05),
  {tipo: 'pasosE', y: 620, enc1: -1, en: -1},
  {...rejilla, aparece: {en: -9, dur: 1}, burbujas: {en: rel(B.d3, t(79)) - 0.1}},
]);
esc(B.d4, B.d5, {}, [
  rot('Voto directo CIS: PSOE 25,3 · PP 14,7', 335, 0.05),
  nota(['% sobre todos los entrevistados · CIS, estudio 3582, pregunta 17'], 0.1),
  {tipo: 'barrasE', filas: [filaPSOE(560, rel(B.d4, t(87)) - 0.1, 25.3, '25,3 %'), filaPP(660, rel(B.d4, t(91)) - 0.1, 14.7, '14,7 %')], en: 0},
  {tipo: 'sello', valor: 'DATO', x: 640, y: 820, tamano: 100, angulo: 4, desde: -170, en: rel(B.d4, t(88))},
]);
esc(B.d5, B.d6, {}, [
  rot('17 de cada 100: "no sabe todavía"', 335, 0.05),
  nota(['17,3 % · CIS, estudio 3582, pregunta 17'], 0.1),
  {tipo: 'personasE', n: 100, cols: 20, y: 780, tam: 34, paso: 38, aparece: {en: 0.1, dur: 0.9}, grises: {n: 17, en: rel(B.d5, t(94)) - 0.1}},
]);
esc(B.d6, B.d7, {}, [
  rot('2: ESTIMAR (la "cocina")', 335, 0.05),
  {tipo: 'pasosE', y: 600, enc1: -1, enc2: 0.1, en: -1},
  {tipo: 'ollaE', x: 540, y: 950, ancho: 520, giro: -2, desde: 'abajo', en: 0.3},
  {tipo: 'lluviaOllaE', xOlla: 540, yOlla: 790, items: [
    {tipo: 'barras', x: 330, en: 0.9}, {tipo: 'interro', x: 760, en: 1.25}, {tipo: 'interro', x: 450, en: 1.6}, {tipo: 'barras', x: 700, en: 1.95},
    {tipo: 'interro', x: 360, en: 2.3}, {tipo: 'interro', x: 640, en: 2.65}], en: -1},
]);
const OLLA_MINI = (en) => ({tipo: 'ollaE', x: 830, y: 612, ancho: 150, giro: 0, desde: 'escala', en});
esc(B.d7, B.d8, {}, [
  rot('¿Quién vota? ¿Qué harán los indecisos?', 335, 0.05),
  nota(['CIS: modelo propio «de escenarios»'], 0.1),
  {tipo: 'pasosE', y: 612, enc1: -1, enc2: -1, en: -1},
  OLLA_MINI(-1),
  {tipo: 'repartoE', y: 850, repartoEn: 0.9, en: 0.1},
]);
const pE = rel(B.d8, t(127)) - 0.1;
esc(B.d8, B.e1, {}, [
  rot('EJEMPLO · mismos ingredientes, dos platos', 335, -1),
  {tipo: 'ejemploE', y: 690, yPlatos: 985, xs: [270, 750], enT: 0.2, platosEn: pE, platos: true, en: -1},
]);
// 4 · Giro
esc(B.e1, B.e2, {fondo: 'tinta'}, [
  rot('RECUERDO DE VOTO', 335, 0.05),
  {tipo: 'calendarioE', texto: '2023', x: 540, y: 850, ancho: 420, luzEn: 0.7, oscuro: true, en: 0.15},
]);
esc(B.e2, B.e3, {}, [
  rot('¿Qué votaste en 2023?', 335, 0.05),
  {tipo: 'personasE', n: 3, cols: 3, y: 820, tam: 150, paso: 250, x0: 210, aparece: {en: 0.1, dur: 0.6}, burbujas: {en: rel(B.e2, t(137)) - 0.1, texto: '2023'}},
]);
const hA = 500;
const parA = (en, ya = false) => [
  {cab: 'Lo que dice la muestra', y: hA, en: ya ? -5 : 0.05},
  filaPSOE(hA + 85, ya ? -5 : en[0], 38.2, '38,2 %'),
  filaPP(hA + 163, ya ? -5 : en[1], 19.5, '19,5 %'),
];
const hB = 880;
const notaA = 'Recuerdo de voto 2023 · % sobre entrevistados que dicen haber votado · CIS, estudio 3582, pregunta 24a';
esc(B.e3, B.e4, {}, [
  rot('Muestra CIS: PSOE 38,2 · PP 19,5', 335, 0.05),
  nota([notaA], 0.1),
  {tipo: 'barrasE', filas: parA([rel(B.e3, t(148)) - 0.1, rel(B.e3, t(152)) - 0.1]), en: 0},
  {tipo: 'sello', valor: 'DATO', x: 700, y: 745, tamano: 80, angulo: 4, desde: -170, en: rel(B.e3, t(149))},
]);
const parB = (en1, en2) => [
  {cab: 'Lo que salió en las urnas', y: hB, en: 0.05},
  filaPP(hB + 85, en1, 33.1, '33,1 %'),
  filaPSOE(hB + 163, en2, 31.7, '31,7 %'),
];
esc(B.e4, B.e5, {}, [
  rot('Urnas 2023: PP 33,1 %', 335, 0.05),
  nota(['Generales 23-7-2023 · % sobre votos válidos · Ministerio del Interior'], 0.1),
  {tipo: 'barrasE', filas: parA([0, 0], true), en: -1},
  {tipo: 'barrasE', filas: parB(rel(B.e4, t(160)) - 0.1, 99).slice(0, 2), en: 0},
]);
esc(B.e5, B.e6, {}, [
  rot('PSOE 31,7 %', 335, 0.05),
  nota(['Bases distintas'], 0.1),
  {tipo: 'barrasE', filas: parA([0, 0], true), en: -1},
  {tipo: 'barrasE', filas: parB(-5, rel(B.e5, t(168)) - 0.1), en: -1},
  {tipo: 'sello', valor: 'DATO', x: 640, y: 761, tamano: 40, angulo: 0, desde: 0, reboteMax: 0, en: rel(B.e5, t(170))},
]);
esc(B.e6, B.f1, {}, [
  rot('Cómo se corrige: lo decide cada casa', 335, 0.05),
  {tipo: 'barrasE', filas: parA([0, 0], true), en: -1},
  {tipo: 'barrasE', filas: parB(-5, -5), en: -1},
  {tipo: 'ollaE', x: 290, y: 818, ancho: 190, giro: -2, desde: 'escala', en: 0.15},
  {tipo: 'llaveE', x: 600, y: 822, tam: 120, en: rel(B.e6, t(180)) - 0.1},
]);
// 5 · Cierre
esc(B.f1, B.f2, {}, [
  rot('CIS: datos en abierto para recalcular', 335, 0.05),
  nota(['«…cualquiera puede aplicar sus propios modelos» · nota metodológica, estudio 3582'], 0.1),
  {tipo: 'carpetaE', x: 540, y: 600, abreEn: rel(B.f1, t(188)), xs: [180, 500, 820], yOllas: 1040, cuchOff: 450, etiquetaDy: 215, en: 0.1},
  {tipo: 'ollaE', x: 180, y: 1050, ancho: 210, giro: -3, desde: 'abajo', en: 0.3},
  {tipo: 'ollaE', x: 500, y: 1050, ancho: 210, giro: 2, desde: 'abajo', en: 0.45},
  {tipo: 'ollaE', x: 820, y: 1050, ancho: 210, giro: -2, desde: 'abajo', en: 0.6},
]);
esc(B.f2, B.f3, {}, [
  rot('FOTO + RECETA ≠ RESULTADO', 335, 0.05),
  nota(['El CIS avisa: su estimación «no posee intención prospectiva» (no es predicción)'], 0.1),
  {tipo: 'camaraE', x: 280, y: 700, ancho: 270, giro: -3, desde: 'izquierda', en: 0.1},
  {tipo: 'ollaE', x: 770, y: 700, ancho: 300, giro: 2, desde: 'escala', en: 0.25},
  {tipo: 'polaroidE', x: 560, y: 960, xFlash: 280, yFlash: 715, clicEn: rel(B.f2, t(199)) - 0.1, en: -1},
]);
esc(B.f3, B.f4, {}, [
  rot('¿QUIÉN TIENE RAZÓN? → 29-N', 335, 0.05),
  nota(['Elecciones generales convocadas: RD 806/2026 · encuestas publicables hasta el 23-11'], 0.1),
  {...bal1(-1, -1), y: 860, seco: true},
  {...bal2(-1, -1), y: 860, seco: true},
  {tipo: 'calendarioE', texto: '29 NOV', x: 540, y: 640, ancho: 330, luzEn: rel(B.f3, t(213)) - 0.1, en: 0.1},
]);
esc(B.f4, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '¿CIS O PRIVADAS?', tamano: 104, pulso: true, yFrase: 560},
  {tipo: 'lupaFichaE', x: 540, y: 1010, en: 0.3},
]);

// Comprobación de tiempo de lectura (1 s por cada 3 palabras de rótulo)
ESC.forEach((e, i) => {
  const d = e.fin - e.inicio;
  e.componentes.forEach((c) => {
    if (c.tipo === 'rotulo' || c.tipo === 'tarjetaE') {
      const txt = c.texto ?? c.titular;
      const w = txt.trim().split(/\s+/).length;
      const vis = d - Math.max(0, c.en ?? 0);
      if (vis < w / 3 + 0.05) AVISOS.push(`lectura escena ${i + 1} (${e.inicio.toFixed(1)}): "${txt}" ${w} pal en ${vis.toFixed(2)} s (necesita ${(w / 3).toFixed(2)})`);
    }
  });
});

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'gancho', texto: '¿POR QUÉ NO COINCIDEN LAS ENCUESTAS?', y: 380, tamano: 104, en: -1},
  {tipo: 'barrasE', filas: [
    {etiqueta: '', valor: 55, texto: '', color: '#14213D', y: 900, en: -9}, {etiqueta: '', valor: 38, texto: '', color: '#8D99AE', y: 975, en: -9}, {etiqueta: '', valor: 22, texto: '', color: '#14213D', y: 1050, en: -9}], x0: 70, col: 0, escala: 7, eje: true, en: -1},
  {tipo: 'barrasE', filas: [
    {etiqueta: '', valor: 22, texto: '', color: '#14213D', y: 900, en: -9}, {etiqueta: '', valor: 38, texto: '', color: '#8D99AE', y: 975, en: -9}, {etiqueta: '', valor: 55, texto: '', color: '#14213D', y: 1050, en: -9}], x0: 560, col: 0, escala: 7, eje: true, en: -1},
  {tipo: 'cucharonE', x: 540, y: 1250, ancho: 360, giro: -35, en: -1},
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
ESC.forEach((e, i) => { const d = e.fin - e.inicio; if (d < 1.3) console.log('corta', i + 1, e.inicio, d.toFixed(2)); });
AVISOS.forEach((a) => console.log('AVISO', a));
