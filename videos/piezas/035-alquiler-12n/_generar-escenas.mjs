// 035 · Alquiler 12-N (estándar). Genera escenas.json desde tiempos.json (voz Rafalupi, grafías del guion).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const r = (x) => +x.toFixed(2);
const DUR = r(T.duracion + 2.0);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0, hasta) => ({tipo: 'notas', lineas, en, ...(hasta !== undefined ? {hasta} : {})});
// segundos absolutos de anclas (comprobadas contra la voz)
const W = (txt, desde) => { const w = T.palabras.find((p) => p.inicio >= desde - 0.05 && p.t.replace(/[.,;:¿?]/g, '') === txt); if (!w) throw new Error('ancla ' + txt + ' ' + desde); return w.inicio; };
const B1 = 6.0, B2b = 17.0, B3a = 23.6, B3b = 33.1, B3c = 41.3, B3d = 54.0, B4 = 64.9, B5 = 74.2, B5b = 81.3, B5c = 85.2;
W('Hoy', 6); W('Es', 17); W('Con', 23.7); W('Para', 33.2); W('Según', 41.3); W('El', 54); W('Los', 64.9); W('Si', 74.2); W('Prefieres', 81.4); W('Síguenos', 85.2);

// 1 · Gancho (0 -> 6,0)
{
  const a = 0, R = (x) => r(x - a);
  esc(a, B1, {}, [
    {tipo: 'gancho', texto: '¿TU ALQUILER SE RENUEVA SOLO?', y: 330, tamano: 96, en: -1},
    nota(['Decreto-ley 28/2026 · si se convalida'], -1),
    {tipo: 'contratoBucle', x: 290, y: 960, tamano: 300, en: -1},
    {tipo: 'icono', nombre: 'calendario', mes: 'AÑO', dia: '1', x: 780, y: 960, tamano: 270, en: -1, hasta: R(2.3)},
    {tipo: 'icono', nombre: 'calendario', mes: 'AÑOS', dia: '5', x: 780, y: 960, tamano: 270, en: R(2.3), animEn: R(2.3)},
    {tipo: 'balanza', x: 540, y: 1040, escala: 0.55, en: R(3.9), etiquetas: false},
    {tipo: 'icono', nombre: 'papeleta', x: 540, y: 700, tamano: 170, en: R(4.8), mover: {x: 540, y: 940, en: R(4.96), dur: 0.5}},
  ]);
}

// 2 · Primera prueba (6,0 -> 17,0)
{
  const a = B1, R = (x) => r(x - a);
  const p2 = 11.6;
  esc(a, B2b, {}, [
    rot('HOY: A LOS 5 AÑOS, +1 HASTA 3', 330, 0.05, {hasta: R(p2)}),
    nota(['Art. 10.1 LAU · 7 años si el casero es empresa'], 0.1, R(p2)),
    rot('DECRETO: +5 AÑOS, Y +5…', 330, R(p2)),
    nota(['RDL 28/2026 · mientras nadie avise'], R(p2)),
    {tipo: 'tiemposA', y: 560, en: 0.1, hoyEn: [R(7.1), R(9.3), R(9.8), R(10.3)], topeEn: R(10.9), filaDecEn: R(p2), decEn: [R(12.0), R(13.3), R(14.6)], puntosEn: R(15.5)},
  ]);
}

// 2b · Contexto (17,0 -> 23,6)
{
  const a = B2b, R = (x) => r(x - a);
  const p2 = 19.2;
  esc(a, B3a, {}, [
    rot('RDL 28/2026', 330, 0.05, {hasta: R(p2)}),
    rot('6 OCT: APROBADO DE NUEVO', 330, R(p2)),
    {tipo: 'foto', src: 'F1.jpg', forma: 'rect', x: 495, y: 700, ancho: 900, alto: 300, foco: '50% 62%', zoom: [1.02, 1.12], dur: R(B3a), en: 0.1},
    {tipo: 'fechasV', y: 800, ranuras: 2, x0: 230, x1: 700, en: R(p2) - 1.3, hitos: [
      {dia: '2', mes: 'OCT', en: R(p2) - 1.0},
      {dia: '6', mes: 'OCT', en: R(20.5)},
    ]},
    {tipo: 'selloTexto', lineas: ['BOE 7-10'], en: R(21.0), y: 1045, x: 640, tamano: 64, angulo: -4},
    nota(['Foto: Antonio.velez · CC BY-SA 3.0 es · Wikimedia Commons', 'BOE 7-10-2026 · el Congreso derogó otro el 2-10'], 0.2),
  ]);
}

// 3a · Cómo se aprueba (23,6 -> 33,1)
{
  const a = B3a, R = (x) => r(x - a);
  const p2 = 28.0, p3 = 29.9;
  esc(a, B3b, {}, [
    rot('LA DIPUTACIÓN PERMANENTE DEBE CONVALIDARLO', 330, 0.05, {hasta: R(p2)}),
    nota(['CE, art. 78 y 86.2'], 0.1, R(p2)),
    rot('SI NO, CAE', 330, R(p2), {hasta: R(p3)}),
    rot('SI SÍ: EN VIGOR 15 NOV', 330, R(p3)),
    nota(['Disp. final 2.ª RDL 28/2026'], R(p3)),
    {tipo: 'hemiciclo', y: 720, ancho: 700, leyenda: false, estatico: true, en: 0, grupos: [{nombre: 'Escaños', escanos: 350, color: '#14213D'}],
      apagar: {en: R(24.4), dur: 1.5, de: '#14213D', a: '#8D99AE'}, resalta: {desde: 140, cuenta: 69, color: '#F2B134', en: R(24.4), dur: 0.9}},
    {tipo: 'icono', nombre: 'cruzPiedra', x: 280, y: 1010, tamano: 200, en: R(p2) + 0.1, hasta: R(p3)},
    {tipo: 'icono', nombre: 'calendario', mes: 'NOV', dia: '15', x: 800, y: 1030, tamano: 200, en: R(p3) + 0.1},
  ]);
}

// 3b · Qué te cambia (33,1 -> 41,3)
{
  const a = B3b, R = (x) => r(x - a);
  const p2 = 35.65;
  esc(a, B3c, {}, [
    rot('CASERO: AVISO DE 6 MESES', 330, 0.05, {hasta: R(p2)}),
    nota(['Hoy son 4'], 0.1, R(p2)),
    {tipo: 'icono', nombre: 'relojArena', x: 300, y: 740, tamano: 340, en: 0.1, hasta: R(p2), animEn: R(34.0), dur: 2.2, etiqueta: '6 meses'},
    {tipo: 'icono', nombre: 'relojArena', x: 760, y: 780, tamano: 230, en: R(35.0), hasta: R(p2), etiqueta: '4'},
    rot('INDEMNIZACIÓN: DESDE 12 MENSUALIDADES', 330, R(p2)),
    nota(['Salvo excepciones: p. ej., si necesita el piso él o su familia · inquilino: 2 meses, como hoy'], R(p2)),
    {tipo: 'sobreBilletes', x: 400, y: 800, tamano: 420, en: R(37.1)},
    {tipo: 'iconoA', nombre: 'llave', x: 780, y: 760, tamano: 220, en: R(38.0)},
    {tipo: 'pildora', texto: 'excepciones', y: 980, en: R(38.24)},
  ]);
}

// 3c · Quién decide (41,3 -> 54,0)
{
  const a = B3c, R = (x) => r(x - a);
  const p2 = 45.9;
  esc(a, B3d, {}, [
    rot('VOTACIÓN PREVISTA: 12 NOV, SEGÚN LA PRENSA', 330, 0.05, {hasta: R(p2)}),
    nota(['Sin convocar a 2026-11-05'], 0.1, R(p2)),
    rot('A FAVOR: 34 · EN CONTRA: 35', 330, R(p2)),
    nota(['Recuento de Público (7-10) si se repiten las posiciones · PNV: no, 6-10 · PSOE, Sumar, ERC, Bildu, Podemos / PP, Vox, Junts, PNV'], R(p2)),
    {tipo: 'votosA', y: 1080, en: 0, pnvEn: R(50.1), pnvDur: 0.8, etiquetaEn: R(49.5)},
    {tipo: 'rotulo', texto: 'Votos en la Diputación Permanente (69)', y: 490, en: R(p2), tamano: 48},
  ]);
}

// 3d · Posturas (54,0 -> 64,9)
{
  const a = B3d, R = (x) => r(x - a);
  const p2 = 57.5, p3 = 61.2;
  esc(a, B4, {}, [
    rot('QUÉ DICEN UNOS Y OTROS', 330, 0.05),
    rot('PNV: PENALIZA AL PEQUEÑO PROPIETARIO', 420, 0.2, {hasta: R(p2)}),
    nota(['1 y 6-10-2026'], 0.2, R(p2)),
    rot('VOX Y JUNTS: MENOS PISOS EN ALQUILER', 420, R(p2), {hasta: R(p3)}),
    nota(['Debate del 2-10-2026 · PP, Vox y Junts votaron no'], R(p2), R(p3)),
    rot('GOBIERNO: SUBE AL RENOVAR', 420, R(p3)),
    nota(['Preámbulo RDL 28/2026'], R(p3)),
    {tipo: 'iconoA', nombre: 'casa', x: 205, y: 800, tamano: 240, en: 0.4},
    {tipo: 'iconoA', nombre: 'llave', x: 540, y: 800, tamano: 240, en: R(57.7)},
    {tipo: 'iconoA', nombre: 'contrato', x: 835, y: 800, tamano: 240, en: R(61.5)},
  ]);
}

// 4 · Giro (64,9 -> 74,2)
{
  const a = B4, R = (x) => r(x - a);
  esc(a, B5, {}, [
    rot('CONTRATOS 2019–2022 → VENCEN 2027–2030', 330, 0.05),
    nota(['Preámbulo del RDL 28/2026: «el mayor volumen de contratos vigentes»'], 0.2),
    {tipo: 'bandasA', y: 650, en: 0.1, bandaEn: R(65.4), mueveEn: R(71.0)},
    {tipo: 'icono', nombre: 'lupaPlaca', x: 260, y: 990, tamano: 200, en: R(66.0), mover: {x: 700, y: 990, en: R(66.3), dur: 3.6}},
  ]);
}

// 5a · Cierre de contenido (74,2 -> 81,3)
{
  const a = B5, R = (x) => r(x - a);
  const p2 = 76.9;
  esc(a, B5b, {}, [
    rot('SI CAE: NI UN DÍA APLICADO', 330, 0.05, {hasta: R(p2)}),
    rot('¿5 AÑOS MÁS? DEPENDE DE UN VOTO', 330, R(p2)),
    {tipo: 'contratoBucle', x: 290, y: 850, tamano: 330, en: 0.1},
    {tipo: 'balanza', x: 700, y: 900, escala: 0.62, en: 0.2, etiquetas: false},
    {tipo: 'icono', nombre: 'papeleta', x: 700, y: 640, tamano: 170, en: R(77.0), mover: {x: 700, y: 800, en: R(80.0), dur: 0.5}},
  ]);
}

// 5b · Pregunta A/B (81,3 -> 85,2)
esc(B5b, B5c, {}, [
  rot('¿PRÓRROGA LARGA O RENEGOCIAR?', 330, 0.05),
  {tipo: 'abSerie', a: 'PRÓRROGA LARGA', b: 'RENEGOCIAR', y: 640, en: 0.3},
]);

// 5c · Cierre
esc(B5c, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '¿PRÓRROGA LARGA O RENEGOCIAR?', tamano: 84, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'marca'},
  {tipo: 'gancho', texto: '¿TU ALQUILER SE RENUEVA SOLO?', y: 420, tamano: 112, en: -1},
  {tipo: 'contratoBucle', x: 540, y: 1130, tamano: 420, en: -1},
]}]};

const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.2, marca: '@loquepasaenunminuto', subSinHuerfanas: true, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
