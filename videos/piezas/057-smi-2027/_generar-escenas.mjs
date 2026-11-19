// 057 · SMI 2027. Lee tiempos.json y escribe escenas.json.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T0 = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T0.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T0.duracion + 1.6);
const NB = ' ';
const TINTA = '#14213D', MOST = '#F2B134';
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.2) => ({tipo: 'notas', lineas, en, tamano: 40});
const dib = (nombre, x, y, tamano, en, o = {}) => ({tipo: 'dib', nombre, x, y, tamano, en, ...o});
const barra = (etiqueta, valor, color, en, o = {}) => ({etiqueta, valor, color, en, dur: 0.6, sinValor: true, ...o});
const BV = (base, hMax, centros, barras, max = 130) => ({tipo: 'barrasVSerie', max, base, hMax, w: 170, centros, tamEtiqueta: 64, vivo: true, barras});

// 1 · Gancho
const b1 = S(12);
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `MÍNIMO: +65${NB}€`, y: 330, tamano: 120, en: -1},
  nota([`Brutos al mes · desde 1-1-2027 · Moncloa,${NB}BOE`], 0.1),
  BV(1150, 560, [180, 450, 720], [
    barra('', 100, TINTA, -1, {dur: 0.8}),
    barra('', 118, MOST, 0.4, {dur: 0.8}),
    {etiqueta: '', valor: 0, en: 1.2, contorno: true, altoContorno: 220},
  ], 120),
]);

// 2 · Primera prueba
const b2 = S(24);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`1.286${NB}€/MES · DESDE${NB}1‑1‑2027`, 330, 0.05),
  rot(`+5,3${NB}% · 18.004${NB}€/año`, 490, 0.1),
  nota([`RD 1013/2026 (BOE,${NB}19-11)`], 0.1),
  BV(1120, 400, [200], [barra('', 100, MOST, 0.1, {dur: 1.6})], 100),
  {tipo: 'selloTexto', lineas: ['APROBADO'], x: 520, y: 880, tamano: 72, angulo: -6, en: 1.4, desde: 40},
]);

// 3 · Explicación
const b3 = S(44);
esc(b2, b3, {fondo: 'crema'}, [
  rot(`DEDUCCIÓN IRPF: HASTA 1.033,58${NB}€/AÑO`, 330, 0.05),
  {...nota([`RDL 38/2026 · IRPF = impuesto de${NB}la${NB}renta`], 0.1), hasta: rel(b2, 34) - 0.1},
  nota([`Hacienda: sin retención en${NB}el${NB}SMI`], rel(b2, 34) - 0.05),
  {tipo: 'nominaH', x: 300, y: 900, esc: 1, en: 0.3},
  {tipo: 'pastillaH', texto: 'retención', x: 500, y: 920, ancho: 400, en: rel(b2, 39) - 0.1},
  {tipo: 'selloTexto', lineas: ['DATO'], x: 560, y: 700, tamano: 72, angulo: -6, en: rel(b2, 28), desde: 40},
]);

// 4a · Falta la convalidación
const b4 = S(54);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`FALTA: CONVALIDACIÓN`, 330, 0.05),
  rot(`SIN SESIÓN${NB}CONVOCADA`, 430, rel(b3, 50) - 0.3),
  nota([`Congreso,${NB}19-11`], rel(b3, 50) - 0.2),
  {tipo: 'tarjetaE', titular: 'APROBADO', sub: 'RD del SMI', marca: 'ok', y: 600, alto: 240, ancho: 880, en: 0.3, entra: 'izq'},
  {tipo: 'tarjetaE', titular: 'PENDIENTE', sub: 'Convalidación del RDL', marca: 'espera', y: 870, alto: 240, ancho: 880, en: rel(b3, 47), entra: 'izq'},
]);

// 4b · La condición
const b5 = S(68);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`CONDICIÓN: OTRAS RENTAS ≤${NB}6.500${NB}€`, 330, 0.05),
  nota([`(excluidas las${NB}exentas)`], 0.2),
  dib('sobre', 540, 900, 300, 0.3),
  {tipo: 'cifraGrandeSerie', valor: `6.500${NB}€`, y: 1060, tam: 140, en: rel(b4, 64)},
]);

// 5 · Giro
const b6 = S(82);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`2026: 590,89${NB}€ → 2027: 1.033,58${NB}€`, 330, 0.05),
  rot(`Máximo anual · si se${NB}convalida`, 500, 0.15),
  nota([`AEAT /${NB}BOE`], 0.2),
  BV(1110, 420, [300, 700], [barra('2026', 590.89, TINTA, 0.2), barra('2027', 1033.58, MOST, rel(b5, 75) - 0.2)], 1033.58),
  {tipo: 'selloTexto', lineas: ['DATO'], x: 330, y: 780, tamano: 80, angulo: -6, en: rel(b5, 78), desde: 40},
]);

// 6a · Pregunta A/B
const b7 = S(89);
esc(b6, b7, {fondo: 'crema'}, [
  rot(`¿MÁS SUELDO O MENOS${NB}RETENCIÓN?`, 330, 0.05),
  {tipo: 'tarjetaE', titular: 'Más sueldo bruto', y: 600, alto: 250, ancho: 880, en: 0.3, entra: 'izq'},
  {tipo: 'tarjetaE', titular: 'Menos retención', y: 890, alto: 250, ancho: 880, en: rel(b6, 86), entra: 'abajo'},
]);
// 6b · Cierre
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierre', frase: `¿MÁS${NB}SUELDO O MENOS${NB}RETENCIÓN?`, tamano: 72, pulso: true}]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: 'MÍNIMO:', y: 330, tamano: 120, en: -1},
  {tipo: 'gancho', texto: `+65${NB}€ BRUTOS`, y: 490, tamano: 104, en: -1},
  BV(1130, 340, [180, 450, 720], [barra('', 100, TINTA, -1, {dur: 0.01}), barra('', 118, MOST, -1, {dur: 0.01}), {etiqueta: '', valor: 0, en: -1, contorno: true, altoContorno: 150}], 120),
  {tipo: 'selloTexto', lineas: ['¿QUÉ FALTA?'], x: 480, y: 1250, tamano: 80, angulo: -6, en: -1, desde: 0},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'hidden-agenda.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR);
