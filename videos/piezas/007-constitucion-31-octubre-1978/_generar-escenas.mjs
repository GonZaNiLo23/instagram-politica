// Genera escenas.json a partir de tiempos.json (marcas reales de palabra). Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const DUR = r(T.duracion + 1.5);
const rel = (a, abs) => r(abs - a);
const B = {
  S2: r(t(12) - 0.1), // "El treinta y uno"
  S3: r(t(25) - 0.1), // "En el Senado"
  S4a: r(t(36) - 0.1), // "Pero todavía no valía"
  S4b: r(t(46) - 0.1), // "Seis de diciembre"
  S4c: r(t(50) - 0.1), // "El veintisiete"
  S4d: r(t(56) - 0.1), // "Y el veintinueve"
  S5: r(t(67) - 0.1), // "Votada"
  S6: r(t(72) - 0.1), // "¿Cuál es..."
};
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, y, en = 0, o = {}) => ({tipo: 'notas', lineas, y, en, ...o});
const FECHAS = ['31-10', '6-12', '27-12', '29-12'];
const FUENTE_4 = 'Fuente: Ley 1/1977, art. 3 · RD 2560/1978 · BOE 29-12-1978';

// 1 · Gancho: tarta con 4 velas apagadas sobre el libro; calendario 6 DIC que rebobina hasta 31 OCT 1978
{
  const a = 0, b = B.S2;
  esc(a, b, {}, [
    {tipo: 'gancho', texto: '4 CUMPLEAÑOS', y: 330, tamano: 100, en: 0, hasta: 2.5},
    rot('¿SOLO EL 6 DE DICIEMBRE?', 330, 2.5, {tamano: 72}),
    {tipo: 'tarta', x: 330, y: 640, ancho: 520, en: -1},
    {tipo: 'calendarioHojas', x: 800, y: 640, tamano: 280, en: 2.55, hojas: [
      {mes: 'DIC', dia: '6', en: 0},
      {mes: '', dia: '', en: 3.25},
      {mes: '', dia: '', en: 3.7},
      {mes: 'OCT 1978', dia: '31', en: 4.1},
    ]},
    {tipo: 'flechaAtras', x: 800, y: 880, tamano: 110, en: 3.0},
  ]);
}
// 2 · Contexto: pantalla partida Congreso / Senado
{
  const a = B.S2, b = B.S3;
  const ok = rel(a, t(18)) + 1.3;
  esc(a, b, {}, [
    rot('31 OCT 1978 ·', 330, 0.05),
    rot('CONGRESO Y SENADO', 405, 0.15),
    {tipo: 'icono', nombre: 'congreso', x: 150, y: 600, tamano: 150, en: 0.3},
    rot('CONGRESO', 550, 0.35, {izq: 270, ancho: 600}),
    {tipo: 'divisoria', y: 722, en: 0.5},
    {tipo: 'icono', nombre: 'palacio', x: 150, y: 795, tamano: 150, en: 0.7},
    rot('SENADO', 740, 0.75, {izq: 270, ancho: 600}),
    {tipo: 'icono', nombre: 'check', x: 840, y: 600, tamano: 110, en: ok, animEn: ok + 0.05, dur: 0.4},
    rot('APROBADA', 615, ok + 0.15, {izq: 270, ancho: 600}),
    {tipo: 'icono', nombre: 'check', x: 840, y: 795, tamano: 110, en: ok + 0.35, animEn: ok + 0.4, dur: 0.4},
    rot('APROBADA', 805, ok + 0.5, {izq: 270, ancho: 600}),
    {tipo: 'velasLinea', y: 950, fechas: FECHAS, velas: [0.9, null, null, null], en: 0.4},
    nota(['Fuente: RD 2560/1978 (BOE)'], 1450, 0.1),
  ]);
}
// 3 · Dato: Senado 226 - 5 - 8
{
  const a = B.S3, b = B.S4a;
  esc(a, b, {}, [
    rot('SENADO: 226 SÍ · 5 NO', 330, 0.05),
    rot('8 abstenciones', 415, rel(a, t(33)) + 0.75),
    {tipo: 'barrasContadas', max: 226, x0: 60, ancho: 560, filas: [
      {etiqueta: 'A favor', valor: 226, y: 600, color: '#2A9D8F', en: rel(a, t(28)) - 0.15, dur: rel(a, t(31)) + 0.25 - (rel(a, t(28)) - 0.15)},
      {etiqueta: 'En contra', valor: 5, y: 770, color: '#8D99AE', en: rel(a, t(32)) + 0.05, dur: 0.5},
      {etiqueta: 'Abstenciones', valor: 8, y: 940, color: '#C5CBD6', en: rel(a, t(33)) + 0.1, dur: 0.6},
    ]},
    {tipo: 'sello', valor: 'DATO', en: rel(a, t(32)) - 0.45, y: 700, x: 740, tamano: 100, angulo: 4, seco: true},
    nota(['Fuente: Diario de Sesiones del Senado, n.º 68 (31-10-1978)'], 1450, 0.1),
  ]);
}
// 4a · Aún no valía: candado sobre el libro + urna
{
  const a = B.S4a, b = B.S4b;
  esc(a, b, {}, [
    rot('AÚN NO VALÍA', 330, 0.05, {tamano: 72}),
    {tipo: 'libroCandado', x: 290, y: 600, tamano: 300, en: 0.15, cierra: 0.9},
    {tipo: 'urnaPapeleta', x: 760, y: 610, tamano: 270, en: 0.5, cae: 999},
    nota(['La ley de 1977 exigía referéndum antes de la sanción'], 775, 0.9),
    {tipo: 'velasLinea', y: 950, fechas: FECHAS, velas: [-1, null, null, null], en: -1},
    nota([FUENTE_4], 1450, 0.1),
  ]);
}
// 4b · 6 DIC · REFERÉNDUM
{
  const a = B.S4b, b = B.S4c;
  const v2 = rel(a, t(49)) - 0.05;
  esc(a, b, {}, [
    rot('6 DIC · REFERÉNDUM', 330, 0.05),
    {tipo: 'urnaPapeleta', x: 540, y: 620, tamano: 330, en: 0.1, cae: rel(a, t(48)), desde: -10},
    {tipo: 'velasLinea', y: 950, fechas: FECHAS, velas: [-1, v2, null, null], en: -1},
    nota([FUENTE_4], 1450, 0.1),
  ]);
}
// 4c · 27 DIC · SANCIÓN = FIRMA DEL REY
{
  const a = B.S4c, b = B.S4d;
  const v3 = rel(a, t(53)) - 0.05;
  esc(a, b, {}, [
    rot('27 DIC · SANCIÓN =', 330, 0.05),
    rot('FIRMA DEL REY', 405, 0.15),
    {tipo: 'plumaCorona', x: 290, y: 710, tamano: 340, en: 0.2},
    rot('Rey Juan Carlos I', 660, 0.5, {izq: 490, ancho: 470}),
    {tipo: 'velasLinea', y: 950, fechas: FECHAS, velas: [-1, -1, v3, null], en: -1},
    nota([FUENTE_4], 1450, 0.1),
  ]);
}
// 4d · 29 DIC · BOE: ENTRA EN VIGOR
{
  const a = B.S4d, b = B.S5;
  const v4 = rel(a, t(62)) - 0.05;
  esc(a, b, {}, [
    rot('29 DIC · BOE:', 330, 0.05),
    rot('ENTRA EN VIGOR', 405, 0.15),
    {tipo: 'boePortada', x: 310, y: 700, ancho: 480, en: rel(a, t(59)) - 0.2},
    {tipo: 'libroCandado', x: 790, y: 700, tamano: 290, en: -1, abre: rel(a, t(64))},
    {tipo: 'velasLinea', y: 950, fechas: FECHAS, velas: [-1, -1, -1, v4], en: -1},
    nota([FUENTE_4], 1450, 0.1),
  ]);
}
// 5 · Votada, ratificada, sancionada y publicada: tarta con las cuatro velas
{
  const a = B.S5, b = B.S6;
  const w = [67, 68, 69, 71].map((i) => rel(a, t(i)) - 0.05);
  esc(a, b, {}, [
    rot('VOTADA ·', 330, w[0]),
    rot('RATIFICADA ·', 407, w[1]),
    rot('SANCIONADA ·', 484, w[2]),
    rot('PUBLICADA', 561, w[3]),
    {tipo: 'tarta', x: 510, y: 830, ancho: 860, libro: false, en: -1, velas: w, fechas: FECHAS},
  ]);
}
// 6 · Cierre
{
  const a = B.S6;
  esc(a, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
    {tipo: 'cierre', frase: '¿Cuál es su verdadero cumpleaños?', tamano: 88, pulso: true},
  ]);
}

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'gancho', texto: 'LA CONSTITUCIÓN TIENE 4 CUMPLEAÑOS', y: 330, tamano: 96, en: -1},
  {tipo: 'tarta', x: 540, y: 960, ancho: 600, en: -1, velas: [-1, -1, -1, -1]},
]}]};

const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'fin de voz', T.duracion.toFixed(2));
ESC.forEach((e, i) => console.log(i + 1, e.inicio, e.fin, (e.fin - e.inicio).toFixed(2)));
