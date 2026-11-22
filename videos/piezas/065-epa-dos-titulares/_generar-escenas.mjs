// 065 · EPA 3T-2026: +95.900 en el trimestre, -21.900 en un año, estacionalidad, +0,14 % desestacionalizado, +465.500 ocupados.
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

// Índices: 8 Frente · 19 Frente(año) · 23 veintiún · 27 El tercer · 40 Eso · 49 Corregido · 61 Y en un año · 65 cuatrocientos · 73 ¿Qué · 83 Síguenos
const b1 = S(8), b2 = S(27), b3 = S(40), b4 = S(49), b5 = S(61), b6 = S(73), b7 = S(83) - 0.1;

// 1 · Gancho
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: 'PARO:', y: 320, tamano: 130, en: -1},
  {tipo: 'flechasEpa', dividir: 1.2},
  nota(['EPA 3T-2026 · INE · publicada el 27-10'], 0.3),
]);
// 2 · Primera prueba
esc(b1, b2, {fondo: 'crema'}, [
  {tipo: 'mitadesEpa', izq: 0.1, izqFig: rel(b1, 12) - 0.1, der: rel(b1, 19) - 0.1, derFig: rel(b1, 23) - 0.1, tasaEn: rel(b1, 25) - 0.1},
]);
// 3 · Estacionalidad
esc(b2, b3, {fondo: 'crema'}, [
  rot(`3T: PARO VS. TRIMESTRE${NB}ANTERIOR`, 330, 0.05),
  {tipo: 'barrasTrimEpa', en: 0.2, paso: 0.55},
  nota(['Variación del paro en cada', 'tercer trimestre (miles). Fuente: INE'], 0.4),
]);
// 4 · Qué es la estacionalidad
esc(b3, b4, {fondo: 'crema'}, [
  rot(`ESTACIONALIDAD = LO QUE SE REPITE CADA${NB}AÑO`, 330, 0.05),
  {tipo: 'barrasTrimEpa', en: -1},
  {tipo: 'ondaEpa', en: 0.2, dur: 2.4},
  nota(['Fuente: INE'], 0.4),
]);
// 5 · Corregida
esc(b4, b5, {fondo: 'crema'}, [
  rot(`SIN ESTACIONALIDAD:`, 330, 0.05),
  {tipo: 'tarjetaEpa', y: 520, en: 0.2},
  nota(['variación trimestral, serie desestacionalizada (INE)'], 0.5),
]);
// 6 · Giro
esc(b5, b6, {fondo: 'crema'}, [
  rot(`OCUPADOS EN 12 MESES:`, 330, 0.05),
  {tipo: 'maletinEpa', cuentaEn: rel(b5, 65) - 0.1, cuentaDur: 1.8, totalEn: rel(b5, 71)},
]);
// 7a · Pregunta
esc(b6, b7, {fondo: 'crema'}, [
  rot(`¿TRIMESTRE O${NB}AÑO?`, 330, 0.05, {tamano: 72}),
  {tipo: 'abSerie', a: 'TRIMESTRE', b: 'AÑO', y: 700, en: 0.3},
  nota(['Fuentes en la descripción'], 0.4),
]);
// 7b · Cierre
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: `¿TRIMESTRE O${NB}AÑO?`, cta: 'siguenos', tamano: 84, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: 'PARO:', y: 320, tamano: 130, en: -1},
  {tipo: 'flechasEpa', dividir: 0},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
