// Genera escenas.json de la 005 a partir de tiempos.json (voz real Dani v4). Uso: node _generar-escenas.mjs
// tiempos.json lleva los subtítulos ya con la grafía del guion (PP, Junts, UPN, PNV, A, B); el original fonético está en tiempos-fonetico.json.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const r = (x) => +x.toFixed(2);
const DUR = 90.0;
// primera palabra de cada bloque (segundos reales de la voz)
const W = (txt, desde = 0) => T.palabras.find((w) => w.inicio >= desde && w.t.replace(/[.,;:¿?]/g, '') === txt);
const B = {
  s2: 4.38, s3a: 13.34, s3b: 27.18, s3c: 38.66, s4: 45.66, s4b: 54.38, s4c: 72.17, s5: 81.86,
};
// comprobación de anclas
const chk = (txt, desde, esperado) => { const w = W(txt, desde); if (!w || Math.abs(w.inicio - esperado) > 0.3) throw new Error(`ancla ${txt} ${w?.inicio} != ${esperado}`); };
chk('El', 4.3, 4.48); chk('Llave', 13.3, 13.44); chk('Llave', 27.2, 27.28); chk('Gobierno', 38.7, 38.88); chk('Ojo', 45.7, 45.76);
chk('PP', 54.4, 54.48); chk('Y', 72.2, 72.27); chk('Uno', 81.9, 81.96);

const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0, hasta) => ({tipo: 'notas', lineas, en, ...(hasta !== undefined ? {hasta} : {})});
const llave = (letra, x, y, o = {}) => ({tipo: 'llaveV', letra, x, y, ...o});
const cerr = (x, y, o = {}) => ({tipo: 'cerraduraV', x, y, ...o});
const FIRMA = 'Fuente: BOE, RDL 29/2026';
const FIRMA_B = 'Fuente: BOE, RDL 28/2026';

// 1 · Gancho (0 -> 4,38)
{
  const a = 0, R = (x) => r(x - a);
  esc(a, B.s2, {}, [
    {tipo: 'gancho', texto: 'UNO YA CUENTA. EL OTRO, ¿NUNCA?', y: 330, tamano: 72, en: 0},
    llave('A', 585, 700, {escala: 1.2, en: 0, luz: 0, luzHasta: 2.3, gira: {en: 0.5, dur: 0.5, grados: 35}}),
    cerr(650, 700, {en: 0, marcas: [{tipo: 'check', en: 0.55}]}),
    llave('B', 545, 930, {escala: 1.2, en: 0.15, luz: R(2.76), luzHasta: B.s2, flota: R(3.0)}),
    cerr(650, 930, {en: 0.15, marcas: [{tipo: 'interroga', en: R(3.0)}]}),
  ]);
}

// 2 · Contexto (4,38 -> 13,34)
{
  const a = B.s2, b = B.s3a, R = (x) => r(x - a);
  const p2 = 6.95, p3 = 9.95;
  esc(a, p3, {}, [
    rot('2 OCT: EL CONGRESO LOS TUMBA', 330, 0.05, {hasta: R(p2)}),
    {tipo: 'foto', src: 'F1.jpg', forma: 'rect', x: 495, y: 620, ancho: 900, alto: 230, foco: '50% 60%', zoom: [1.02, 1.12], dur: R(p2), en: 0.1, hasta: R(p2), notas: ['Pleno del Congreso, 2-10-2026'], credito: 'Foto: Antonio.velez · CC BY-SA 3.0 es · Wikimedia Commons'},
    {tipo: 'votosDecretos', y: 750, en: 0, hasta: R(p2), max: 200, compacto: true, filas: [
      {etiqueta: 'A · función social', si: 172, no: 178, en: 0},
      {etiqueta: 'B · prórrogas', si: 166, no: 184, en: 0.5},
    ]},
    rot('6 OCT: APROBADOS DE NUEVO', 330, R(p2), {hasta: R(p3)}),
    {tipo: 'fechasV', y: 520, ranuras: 4, x0: 170, x1: 790, en: R(p2), hasta: R(p3), hitos: [
      {dia: '2', mes: 'OCT', en: R(p2) + 0.2},
      {dia: '6', mes: 'OCT', en: R(7.5)},
      {dia: '12', mes: 'NOV', gris: true, nota: ['prevista', '(prensa)']},
      {dia: '15', mes: 'NOV', en: R(9.0)},
    ]},
    {tipo: 'selloTexto', lineas: ['BOE 7-10'], en: R(7.6), hasta: R(p3), y: 770, x: 285, tamano: 64, angulo: -4},
    {tipo: 'icono', nombre: 'documento', x: 740, y: 850, tamano: 110, en: R(7.7), hasta: R(p3)},
    {tipo: 'icono', nombre: 'documento', x: 850, y: 850, tamano: 110, en: R(7.85), hasta: R(p3)},
    {tipo: 'tarjetaCita', cita: '"mantienen la esencia"', autor: 'Pedro Sánchez · presidente del Gobierno', x: 495, y: 930, deIzq: true, en: R(8.5), hasta: R(p3)},
  ]);
  const a2 = p3, R2 = (x) => r(x - a2);
  esc(a2, b, {}, [
    rot('AHORA DECIDE LA DIPUTACIÓN PERMANENTE', 330, R2(p3)),
    {tipo: 'hemiciclo', y: 590, ancho: 700, leyenda: false, estatico: true, en: 0, grupos: [{nombre: 'Escaños', escanos: 350, color: '#14213D'}],
      apagar: {en: R2(10.45), dur: 1.5, de: '#14213D', a: '#8D99AE'}, resalta: {desde: 168, cuenta: 14, color: '#F2B134', en: R2(10.45), dur: 0.8}},
    rot('Representa a los grupos según su peso', 950, R2(10.95)),
  ]);
}

// 3a · Llave A (13,34 -> 27,18)
{
  const a = B.s3a, b = B.s3b, R = (x) => r(x - a);
  const p2 = 17.02, p3 = 20.02, p4 = 22.98;
  esc(a, b, {}, [
    llave('A', 300, 360, {escala: 0.7, en: 0.1}),
    rot('LLAVE A · EN VIGOR DESDE 8-10', 420, 0.1, {hasta: R(p2)}),
    {tipo: 'foto', src: 'F3.jpg', forma: 'rect', x: 495, y: 860, ancho: 900, alto: 480, foco: '50% 33%', zoom: [1.03, 1.14], dur: R(p2), en: 0.15, hasta: R(p2), notas: ['RDL 29/2026'], credito: 'Foto: Luis García (Zaqarbal) · CC BY-SA 3.0 es · Wikimedia Commons'},
    rot('SUBIDA MÁXIMA: 2 %', 420, R(p2), {hasta: R(p3)}),
    {tipo: 'reciboTecho', x: 540, y: 830, tamano: 420, en: R(p2), hasta: R(p3), subeEn: R(p2) + 0.3, selloEn: R(19.0), techoEn: R(19.4)},
    nota(['Sin pacto · hasta 31-12-2027', FIRMA], R(p2), R(p3)),
    rot('+2 AÑOS DE CONTRATO', 420, R(p3), {hasta: R(p4)}),
    {tipo: 'calendarioMas', x: 380, y: 830, tamano: 400, en: R(p3), hasta: R(p4), masEn: R(21.45)},
    rot('8 meses al día', 760, R(20.5), {izq: 600, ancho: 340, hasta: R(p4)}),
    nota(['Si vence antes de 2029 · 8 meses al día · con excepciones', FIRMA], R(p3), R(p4)),
    rot('FRENO A DESAHUCIOS VULNERABLES', 420, R(p4)),
    {tipo: 'casaEscudo', x: 540, y: 830, tamano: 420, en: R(p4), casaEn: R(p4) + 0.1, escudoEn: R(24.7)},
    nota(['Algunos casos · hasta 2030', FIRMA], R(p4)),
  ]);
}

// 3b · Llave B (27,18 -> 38,66)
{
  const a = B.s3b, b = B.s3c, R = (x) => r(x - a);
  const p2 = 29.6, p3 = 34.06, p4 = 36.55;
  esc(a, b, {}, [
    rot('LLAVE B · AÚN NO EN VIGOR', 420, 0.1, {hasta: R(p2)}),
    llave('B', 480, 820, {escala: 1.2, en: 0.2, hasta: R(p2), flota: 0.8}),
    cerr(580, 820, {en: 0.2, hasta: R(p2), marcas: [{tipo: 'interroga', en: 0.6}]}),
    nota(['RDL 28/2026'], 0.1, R(p2)),
    llave('B', 940, 360, {escala: 0.7, en: R(p2)}),
    rot('PRÓRROGAS DE 5 AÑOS, EN CADENA', 420, R(p2), {hasta: R(p3)}),
    {tipo: 'contratoBucle', x: 540, y: 780, tamano: 340, en: R(p2), hasta: R(p3)},
    {tipo: 'cadenaAnios', y: 975, pasos: [R(31.4), R(32.3), R(33.2)], hasta: R(p3)},
    nota(['7 si el casero es una empresa', FIRMA_B], R(p2), R(p3)),
    rot('NO RENOVAR: 6 MESES DE AVISO', 420, R(p3), {hasta: R(p4)}),
    {tipo: 'icono', nombre: 'relojArena', x: 540, y: 820, tamano: 340, en: R(p3), hasta: R(p4), animEn: R(34.2), dur: 2.2, etiqueta: '6 meses'},
    nota([FIRMA_B], R(p3), R(p4)),
    rot('INDEMNIZACIÓN: MÍN. 12 MENSUALIDADES', 420, R(p4)),
    {tipo: 'sobreBilletes', x: 540, y: 820, tamano: 420, en: R(p4) + 0.1},
    nota(['Valor de referencia · con excepciones', FIRMA_B], R(p4)),
  ]);
}

// 3c · Lo que defiende el Gobierno (38,66 -> 45,66)
{
  const a = B.s3c, b = B.s4, R = (x) => r(x - a);
  const p2 = 40.4, p3 = 42.1;
  esc(a, b, {}, [
    rot('EL GOBIERNO DEFIENDE:', 340, 0.05),
    {tipo: 'foto', src: 'F4.jpg', forma: 'rect', x: 495, y: 840, ancho: 900, alto: 460, foco: '50% 55%', zoom: [1.03, 1.14], dur: R(p2), en: 0.15, hasta: R(p2), notas: ['Exposición de motivos, RDL 28 y 29/2026'], credito: 'Foto: Yeray Díaz Zbida · CC BY 2.0 · Wikimedia Commons'},
    rot('Gobierno', 650, 0.3, {izq: 90, ancho: 400, pastilla: 'tinta', hasta: R(p2)}),
    rot('EL ALQUILER SUBE AL RENOVAR', 430, R(p2), {hasta: R(p3)}),
    {tipo: 'contratoFin', x: 540, y: 860, tamano: 400, en: R(p2), hasta: R(p3), finEn: R(41.15), saltaEn: R(41.45)},
    rot('NINGÚN DESAHUCIO SIN ALTERNATIVA', 430, R(p3)),
    {tipo: 'casasAlternativa', x: 540, y: 860, tamano: 460, en: R(p3), puertaEn: R(42.6), flechaEn: R(43.5)},
    nota(['Exposición de motivos, RDL 28 y 29/2026'], R(p2)),
  ]);
}

// 4 · Giro (45,66 -> 54,38)
{
  const a = B.s4, b = B.s4b, R = (x) => r(x - a);
  const p2 = 48.9, p3 = 51.5;
  esc(a, b, {}, [
    rot('OJO: LA LLAVE B AÚN NO ABRE', 330, 0.05, {hasta: R(p2)}),
    rot('EN VIGOR: 15 NOV · VOTACIÓN: ANTES', 330, R(p2), {hasta: R(p3)}),
    rot('SI CAE, CERO DÍAS APLICADO', 330, R(p3)),
    {tipo: 'fechasV', y: 640, ranuras: 3, x0: 200, x1: 760, en: 0.1, hitos: [
      {dia: '6', mes: 'OCT', ya: true},
      {dia: '12', mes: 'NOV', gris: true, nota: ['prevista', '(prensa)']},
      {dia: '15', mes: 'NOV', en: R(48.0)},
    ]},
    cerr(790, 555, {escala: 0.5, en: 0.2}),
    llave('B', 300, 555, {escala: 0.7, en: 0.3, pasos: [{x: 700, en: 0.4, dur: 8}], hasta: R(51.8)}),
    {tipo: 'corchete', x0: 230, x1: 540, y: 985, en: R(49.4), dur: 1.4, etiqueta: 'plazo para votar', hasta: R(p3)},
    {tipo: 'cuentaCero', y: 985, en: R(51.7), texto: '0 días', tamano: 150},
    nota([FIRMA_B.replace('Fuente: BOE, RDL 28/2026', 'Fuente: BOE, RDL 28/2026, disp. final 2.ª · CE, art. 86.2')], 0.1, R(p2)),
    nota(['Plazo: 30 días hábiles (CE, art. 86.2) · prevista el 12-11, según la prensa'], R(p2), R(p3)),
    nota(['Fuente: BOE, RDL 28/2026, disp. final 2.ª · CE, art. 86.2'], R(p3)),
  ]);
}

// 4b · Qué dicen unos y otros (54,38 -> 72,17)
{
  const a = B.s4b, b = B.s4c, R = (x) => r(x - a);
  const p2 = 58.5, p3 = 63.3, p4 = 68.4, p1b = 61.45;
  const BOC = {ancho: 600, alto: 220};
  esc(a, b, {}, [
    rot('QUÉ DICEN UNOS Y OTROS', 330, 0.05),
    // P1
    rot('PP, VOX, JUNTS, UPN: NO A AMBOS', 420, 0.2, {hasta: R(p2)}),
    {tipo: 'foto', src: 'F5.jpg', forma: 'rect', x: 495, y: 880, ancho: 900, alto: 440, foco: '50% 40%', zoom: [1.03, 1.14], dur: R(p2), en: 0.15, hasta: R(p2), notas: ['Votación del 2-10-2026 · Civio'], credito: 'Foto: Yann Droneaud · CC BY-SA 2.0 · Wikimedia Commons'},
    {tipo: 'pildoras', y: 720, ancho: 212, hueco: 14, x0: 62, hasta: R(p2), items: [{texto: 'PP', en: 0.1}, {texto: 'Vox', en: 0.82}, {texto: 'Junts', en: 1.46}, {texto: 'UPN', en: 2.1}]},
    // P2
    rot('VOX Y JUNTS: MENOS PISOS EN ALQUILER', 420, R(p2), {hasta: R(p1b)}),
    {tipo: 'bocadillo', lineas: ['Vox · Junts'], y: 760, en: R(58.7), hasta: R(p1b), ...BOC},
    nota(['Debate del 2-10-2026 · Europa Press'], R(p2), R(p1b)),
    rot('PP: LLEGAN TARDE', 420, R(p1b), {hasta: R(p3)}),
    {tipo: 'bocadillo', lineas: ['PP'], y: 760, en: R(p1b) + 0.05, hasta: R(p3), ...BOC},
    nota(['Juan Bravo (PP), debate del 2-10-2026'], R(p1b), R(p3)),
    // P3
    rot('PNV Y CC: NO AL DE PRÓRROGAS', 420, R(p3), {hasta: R(p4)}),
    {tipo: 'pildoras', y: 650, ancho: 212, hueco: 14, x0: 321, en: 0, hasta: R(p4), items: [{texto: 'PNV', en: R(63.5)}, {texto: 'CC', en: R(63.9)}]},
    {tipo: 'bocadillo', lineas: ['PNV'], y: 820, en: R(66.24), hasta: R(p4), ...BOC},
    nota(['PNV: penaliza al pequeño propietario · 1-10-2026'], R(p3), R(p4)),
    // P4
    rot('INQUILINAS: "UNA MEDIDA DE MÍNIMOS"', 420, R(p4)),
    {tipo: 'bocadillo', lineas: ['Sindicato de', 'Inquilinas'], y: 620, en: R(68.55), ...BOC},
    {tipo: 'icono', nombre: 'calendario', mes: 'NOV', dia: '11', x: 300, y: 1000, tamano: 240, en: R(70.7)},
    rot('11 NOV · huelga general', 920, R(70.7), {izq: 450, ancho: 510}),
    nota(['Alicia del Río, 2-10-2026 · huelga general 11-11: convocan CCOO, UGT y otros'], R(p4)),
  ]);
}

// 4c · Qué viene ahora (72,17 -> 81,86)
{
  const a = B.s4c, b = B.s5, R = (x) => r(x - a);
  const q2 = 73.0, q3 = 76.3, q4 = 78.9;
  esc(a, b, {}, [
    rot('¿Y AHORA?', 320, 0.02, {hasta: R(q2)}),
    rot('SE VOTAN LOS DOS DECRETOS', 320, R(q2), {hasta: R(q3)}),
    rot('SI CAE LA A, FUERA DE VIGOR', 320, R(q3), {hasta: R(q4)}),
    rot('29 NOV: ELECCIONES GENERALES', 320, R(q4)),
    {tipo: 'fechasV', y: 520, ranuras: 5, x0: 150, x1: 810, en: 0.05, cursor: [[0, 1], [0.35, 1], [0.85, 2]], cursorHasta: R(q2) + 0.1, hitos: [
      {dia: '2', mes: 'OCT', ya: true},
      {dia: '6', mes: 'OCT', ya: true},
      {dia: '12', mes: 'NOV', gris: true, nota: ['prevista', '(prensa)']},
      {dia: '15', mes: 'NOV', ya: true},
      {dia: '29', mes: 'NOV', en: R(79.1), aparece: R(q4)},
    ]},
    // llaves hacia la urna del 12 NOV (carril propio bajo la línea de fechas)
    llave('A', 320, 868, {escala: 1.1, en: R(q2) - 0.1, pasos: [{x: 500, en: R(q2) + 0.1, dur: 0.9}, {x: 410, en: R(76.5), dur: 0.6}], disc: R(76.5), hasta: R(q4)}),
    llave('B', 320, 955, {escala: 1.1, en: R(q2), pasos: [{x: 500, en: R(q2) + 0.2, dur: 0.9}, {x: 430, en: R(q4), dur: 0.6}], flota: R(79.6)}),
    {tipo: 'urna2', x: 620, y: 910, tamano: 250, en: R(73.4), hasta: R(q4)},
    {tipo: 'pildora', texto: 'solo si la derogan', y: 1025, en: R(77.4), hasta: R(q4)},
    // 29 NOV
    cerr(600, 868, {escala: 0.7, en: R(q4), marcas: [{tipo: 'check', en: R(q4) + 0.2}]}),
    llave('A', 520, 868, {escala: 1.1, en: R(q4)}),
    {tipo: 'urna2', x: 840, y: 910, tamano: 250, en: R(79.3), ranuras: 1},
    nota(['Prevista el 12-11, según la prensa · sin convocar a 2026-10-20'], R(q2), R(q3)),
    nota(['CE, art. 86.2: convalidación o derogación'], R(q3), R(q4)),
    nota(['RD 806/2026 · campaña del 13 al 27-11'], R(q4)),
  ]);
}

// 5 · Cierre (81,86 -> 90)
{
  const a = B.s5;
  esc(a, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
    {tipo: 'cierre', frase: 'UNO YA CUENTA. EL OTRO, EN EL AIRE.', pregunta: '¿TE AFECTA ALGUNO?', tamano: 84, pulso: true},
    llave('A', 170, 880, {escala: 0.55, en: 0.2}),
    cerr(200, 880, {escala: 0.55, en: 0.2, dx: 70, marcas: [{tipo: 'check', en: 0.4}]}),
    llave('B', 570, 880, {escala: 0.55, en: 0.3, flota: 0.8}),
    cerr(600, 880, {escala: 0.55, en: 0.3, dx: 70, marcas: [{tipo: 'interroga', en: 0.5}]}),
  ]);
}

// Portada: titular y las dos llaves, dentro del recorte 1080x1350 (y 285-1635)
const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'marca'},
  {tipo: 'gancho', texto: 'DECRETOS DE VIVIENDA: ¿QUÉ TE CAMBIA?', y: 420, tamano: 112, en: -1},
  llave('A', 560, 1090, {escala: 1.3, en: -1}),
  {tipo: 'rotulo', texto: 'YA', y: 1040, en: -1, tamano: 120, izq: 620, ancho: 340},
  llave('B', 560, 1300, {escala: 1.3, en: -1}),
  {tipo: 'rotulo', texto: '¿?', y: 1250, en: -1, tamano: 120, izq: 620, ancho: 340},
]}]};

// los rótulos nunca cruzan el fin de escena
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.2, marca: '@loquepasaenunminuto', subSinHuerfanas: true, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'fin de voz', T.duracion);
ESC.forEach((e, i) => console.log(i + 1, e.inicio, e.fin, (e.fin - e.inicio).toFixed(2)));
