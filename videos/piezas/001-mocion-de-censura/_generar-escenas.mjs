// Genera escenas.json de la pieza 001 a partir de tiempos.json (marcas reales de palabra). Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const f = (i) => T.palabras[i].fin;
const r = (x) => +x.toFixed(2);
const FIN_VOZ = Math.max(T.duracion, f(T.palabras.length - 1));
const DUR = r(FIN_VOZ + 3.0); // la plantilla de cierre se mantiene ~3 s tras la voz (guion)

// Límites de escena (s absolutos), justo antes de la primera palabra de cada bloque
const B = {
  d: r(t(14) - 0.1), e: r(t(29) - 0.1), f: r(t(43) - 0.1), g: r(t(51) - 0.1), h: r(t(56) - 0.1), i: r(t(65) - 0.1),
  jk: r(t(79) - 0.1), l: r(t(93) - 0.1), m: r(t(99) - 0.1), n: r(t(112) - 0.1), o: r(t(118) - 0.12), p: r(t(122) - 0.1),
  q: r(t(129) - 0.1 - 0.34), r: r(t(134) - 0.1), s: r(t(140) - 0.1), t: r(t(160) - 0.1),
};
const ESC = [];
const rel = (a, abs) => r(abs - a);
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const ic = (nombre, x, y, tamano, en, o = {}) => ({tipo: 'icono', nombre, x, y, tamano, en, ...o});
const rot = (texto, y, en = 0, o = {}) => ({tipo: 'rotulo', texto, y, en, ...o});
const nota = (lineas, en = 0, hasta, o = {}) => ({tipo: 'notas', lineas, en, ...(hasta !== undefined ? {hasta} : {}), ...o});
const FUENTE_CONGRESO = 'Fuente: Congreso de los Diputados';
const CRED_MONCLOA = (autor, fecha) => [`Foto: Pool Moncloa/${autor} · ${fecha} ·`, 'Ministerio de la Presidencia. Gobierno de España ·', 'Wikimedia Commons'];

// ===== 1 · Gancho (0 -> D): silla que tiembla, busto que sale despedido, "1" =====
{
  const a = 0, b = B.d;
  const fin1 = rel(a, t(6) - 0.1); // 2.38: acaba la pregunta
  const fin2 = rel(a, t(8) - 0.1); // 3.34: empieza "Pero solo ha pasado una vez"
  esc(a, b, {}, [
    {tipo: 'gancho', texto: '¿Echar al presidente sin elecciones?', y: 330, tamano: 100, en: -1, hasta: fin1},
    ic('silla', 540, 960, 340, -1, {vibra: [0.5, fin1], mover: {x: 290, y: 930, en: fin2, dur: 0.5}}),
    ic('bustoSilla', 540, 960, 340, 0.4, {color: '#8D99AE', vibra: [0.5, fin1], mover: {x: 1500, y: 560, en: fin1 + 0.04, dur: 0.2, arco: 220}, hasta: fin1 + 0.45}),
    rot('SE PUEDE', 340, fin1 + 0.02, {tamano: 96, hasta: fin2}),
    rot('SOLO UNA VEZ', 340, fin2, {tamano: 96}),
    {tipo: 'contador', desde: 1, hasta: 1, salto: true, en: fin2 + 0.05, espera: 0, y: 540, tamano: 420, izq: 590},
    {tipo: 'sello', valor: 'DATO', en: fin2 + 0.75, y: 960, tamano: 100, x: 700},
    nota([FUENTE_CONGRESO], fin2 + 0.1),
  ]);
}
// ===== 2 · Moción de censura / artículo 113 (F1 + libro) =====
{
  const a = B.d, b = B.e;
  const cambio = rel(a, t(23) - 0.06); // "artículo" (8.1)
  esc(a, b, {}, [
    rot('MOCIÓN DE CENSURA', 340, 0.05, {hasta: cambio}),
    ic('silla', 290, 930, 340, -1, {mover: {x: -260, y: 930, en: 0.0, dur: 0.45}, hasta: 0.6}),
    {tipo: 'foto', src: 'F1.jpg', forma: 'rect', x: 540, y: 770, ancho: 900, alto: 520, foco: '50% 40%', zoom: [1.04, 1.16], dur: cambio - 0.1, en: 0.15, hasta: cambio, credito: 'Foto: Vickybol · CC BY-SA 3.0 · Wikimedia Commons'},
    rot('Artículo 113', 340, cambio),
    ic('libro', 540, 770, 540, cambio, {animEn: cambio + 0.25, dur: 0.8}),
    nota(['Fuente: Constitución, art. 113'], cambio + 0.05),
  ]);
}
// ===== 3 · Una décima parte: 35 diputados (F2 -> hemiciclo) =====
{
  const a = B.e, b = B.f;
  const cambio = rel(a, t(36)); // "Congreso:" -> "al menos treinta y cinco"
  const foto = rel(a, t(34) + 0.1); // fin de la foto
  const treinta = rel(a, t(39) - 0.06);
  esc(a, b, {}, [
    rot('1 de cada 10 diputados', 340, 0.05, {hasta: cambio + 0.1}),
    rot('Mínimo: 35 firmas', 340, cambio + 0.1),
    {tipo: 'foto', src: 'F2.jpg', forma: 'rect', x: 540, y: 770, ancho: 900, alto: 560, foco: '50% 45%', zoom: [1.04, 1.16], dur: foto, en: 0.1, hasta: foto,
      notas: CRED_MONCLOA('Fernando Calvo', '2018-12-06').slice(0, 2), credito: 'Wikimedia Commons'},
    {tipo: 'hemiciclo', grupos: [{nombre: 'Diputados', escanos: 350, color: '#8D99AE'}], total: 350, y: 500, ancho: 880, leyenda: false, en: foto - 0.2, dur: 1.0, zoom: {a: 1.05, en: foto - 0.2, dur: 3.2, oy: 0},
      resalta: {desde: 157, cuenta: 35, color: '#F2B134', en: treinta, dur: 0.7}},
    {tipo: 'contador', desde: 0, hasta: 35, en: treinta - 0.05, espera: 0.1, dur: 0.9, y: 985, tamano: 130, izq: 220},
    ic('boligrafo', 700, 1035, 170, treinta + 0.1, {dur: 0.9}),
  ]);
}
// ===== 4 · Moción constructiva (barrido + ladrillos) =====
{
  const a = B.f, b = B.g;
  esc(a, b, {}, [
    rot('MOCIÓN "CONSTRUCTIVA"', 340, 0.3),
    ic('muro', 540, 810, 560, 0.3, {animEn: 0.45, dur: 2.4}),
    {tipo: 'barrido', dur: 0.4},
  ]);
}
// ===== 5 · No vale con decir "fuera" =====
{
  const a = B.g, b = B.h;
  esc(a, b, {}, [
    rot('No vale con decir "fuera"', 340, 0.05),
    ic('bocadillo', 540, 790, 560, 0.1, {animEn: rel(a, t(55)) - 0.15, dur: 0.4}),
  ]);
}
// ===== 6 · Candidato alternativo (documento de la moción) =====
{
  const a = B.h, b = B.i;
  const cambio = rel(a, t(62) + 0.4);
  esc(a, b, {}, [
    rot('Candidato alternativo', 340, 0.05, {hasta: cambio}),
    ic('busto', 540, 740, 400, 0.1, {color: '#2A9D8F', etiqueta: 'CANDIDATO', hasta: cambio}),
    rot('Dentro de la moción', 340, cambio),
    ic('documentoMocion', 540, 760, 540, cambio, {animEn: cambio + 0.25, dur: 0.6}),
    nota(['Fuente: Constitución, art. 113.2'], 0.2),
  ]);
}
// ===== 7 · Mayoría absoluta: 176 =====
{
  const a = B.i, b = B.jk;
  const cambio = rel(a, t(72) - 0.1); // "ciento setenta y seis"
  esc(a, b, {}, [
    rot('Mayoría absoluta', 340, 0.05, {hasta: cambio}),
    {tipo: 'hemiciclo', grupos: [{nombre: 'Diputados', escanos: 350, color: '#8D99AE'}], total: 350, y: 560, ancho: 880, leyenda: false, en: 0.1, dur: 1.0, hasta: cambio},
    {tipo: 'lineaMeta', x: 510, y1: 540, y2: 1030, en: 1.1, etiqueta: '176', hasta: cambio},
    rot('176 SÍES', 340, cambio),
    {tipo: 'contador', desde: 0, hasta: 176, en: cambio, espera: 0.12, dur: 1.0, y: 440, tamano: 200, izq: 80},
    {tipo: 'votacion', y: 700, en: cambio, si: {pasos: [[cambio + 0.1, 0], [cambio + 1.2, 176]]}},
  ]);
}
// ===== 8 · No basta con más síes que noes / investido automáticamente =====
{
  const a = B.jk, b = B.l;
  const cambio = rel(a, t(86) - 0.1);
  const cruza = cambio + 0.6;
  const llega = rel(a, t(91)) - 0.05;
  esc(a, b, {}, [
    rot('No basta: más síes que noes', 340, 0.05, {hasta: cambio}),
    rot('Investido automáticamente', 340, cambio),
    {tipo: 'votacion', y: 570, alto: 70, en: 0.05, si: {pasos: [[0.1, 0], [1.0, 150], [cambio + 0.5, 150], [cambio + 1.2, 196]]}, no: {pasos: [[0.35, 0], [1.2, 100]]}, parpadeo: [rel(a, t(84)) - 0.1, cambio]},
    ic('silla', 300, 985, 240, -1),
    ic('check', 830, 985, 150, cambio + 0.8, {animEn: cambio + 0.85, dur: 0.5}),
    ic('busto', 640, 985, 170, llega - 0.5, {color: '#2A9D8F', mover: {x: 300, y: 990, en: llega - 0.45, dur: 0.6}, hasta: llega + 0.15}),
    ic('bustoSilla', 300, 985, 240, llega + 0.1, {color: '#2A9D8F'}),
    nota(['Ejemplo ilustrativo'], 0.3, cambio),
    nota(['Fuente: Constitución, art. 114.2'], cambio + 0.1),
  ]);
}
// ===== 9 · Sin otra votación y sin urnas =====
{
  const a = B.l, b = B.m;
  esc(a, b, {}, [
    rot('Sin otra votación · sin urnas', 340, 0.05),
    ic('papeleta', 300, 830, 340, 0.1, {animEn: rel(a, t(95)) - 0.1, dur: 0.4}),
    ic('urna', 780, 830, 340, 0.8, {animEn: rel(a, t(97)) - 0.1, dur: 0.4}),
  ]);
}
// ===== 10 · Por eso cuesta tanto: 176 votos para un mismo nombre =====
{
  const a = B.m, b = B.n;
  const cambio = rel(a, t(103) - 0.06);
  const luz = rel(a, t(103)) + 0.1;
  const nombre = rel(a, t(109)) - 0.05;
  esc(a, b, {}, [
    rot('Por eso cuesta tanto', 340, 0.05, {hasta: cambio}),
    rot('176 votos, UN nombre', 340, cambio),
    {tipo: 'hemiciclo', grupos: [{nombre: 'Diputados', escanos: 350, color: '#8D99AE'}], total: 350, y: 560, ancho: 880, leyenda: false, en: 0.1, dur: 0.9,
      resalta: {desde: 0, cuenta: 176, color: '#F2B134', en: luz, dur: 1.1}},
    {tipo: 'lineaMeta', x: 510, y1: 540, y2: 1030, en: 0.4, etiqueta: '176'},
    ic('tarjetaNombre', 510, 905, 200, nombre),
  ]);
}
// ===== 11 · 6 mociones (línea de tiempo) =====
const COL = (anio, valor, hito, extra = {}) => ({etiqueta: String(anio), valor, hito, ...extra});
const barrasT = [44.75, 44.9, 45.05, 45.2, 45.35];
const GRIS = 46.05;
const columnas = [
  COL(1980, 152, 42.4, {barra: barrasT[0], gris: GRIS}),
  COL(1987, 66, 42.8, {barra: barrasT[1], gris: GRIS}),
  COL(2017, 82, 43.2, {barra: barrasT[2], gris: GRIS}),
  COL(2018, 180, 43.6, {barra: 49.45, durBarra: 0.9, mostaza: r(t(127) - 0.1)}),
  COL(2020, 52, 44.0, {barra: barrasT[3], gris: GRIS}),
  COL(2023, 53, 44.4, {barra: barrasT[4], gris: GRIS}),
];
const grafico = (a, extra = {}) => ({tipo: 'mociones', t0: a, columnas, lineaEn: 42.3, ...extra});
{
  const a = B.n, b = B.o;
  esc(a, b, {}, [
    rot('6 MOCIONES', 340, 0.05),
    {tipo: 'contador', desde: 0, hasta: 6, en: 0.1, espera: 0.2, dur: 1.8, y: 450, tamano: 200, izq: 80},
    ic('documentoMocion', 760, 560, 220, 0.2, {animEn: 0.5, dur: 0.6}),
    grafico(a),
    nota([FUENTE_CONGRESO], 0.1),
  ]);
}
// ===== 12 · 5 fracasaron =====
{
  const a = B.o, b = B.p;
  esc(a, b, {}, [
    rot('5 fracasaron', 340, 0.05),
    {tipo: 'contador', desde: 6, hasta: 5, salto: true, en: -1, espera: 1.1, y: 450, tamano: 200, izq: 80},
    ic('aspa', 760, 560, 200, 0.2, {animEn: 0.35, dur: 0.4}),
    grafico(a),
    nota([FUENTE_CONGRESO], 0.1),
  ]);
}
// ===== 13 · 1 aprobada (F3: debate de la moción de 2018) =====
{
  const a = B.p, b = B.q;
  esc(a, b, {}, [
    rot('1 APROBADA', 340, 0.05),
    {tipo: 'foto', src: 'F3.jpg', forma: 'rect', x: 540, y: 605, ancho: 660, alto: 350, foco: '83% 69%', zoom: [1.55, 1.8], dur: rel(a, b), en: 0.1,
      notas: CRED_MONCLOA('Diego Crespo', '2018-05-31').slice(0, 2), credito: 'Wikimedia Commons'},
    grafico(a),
  ]);
}
// ===== 14 · 2018 · 180 síes =====
{
  const a = B.q, b = B.r;
  const sube = r(49.45 - a);
  esc(a, b, {}, [
    rot('2018 · 180 síes', 340, 0.05),
    {tipo: 'contador', desde: 0, hasta: 180, en: 0.1, espera: sube - 0.1, dur: 0.9, y: 450, tamano: 200, izq: 80},
    {tipo: 'sello', valor: 'DATO', en: sube + 1.0, y: 470, tamano: 90, x: 750},
    grafico(a),
    nota([FUENTE_CONGRESO], 0.1),
  ]);
}
// ===== 15 · Rajoy -> Sánchez (retratos con el mismo tratamiento) =====
{
  const a = B.r, b = B.s;
  const h = 260;
  const tx = {izq: 370, ancho: 590, tamano: 64};
  esc(a, b, {}, [
    rot('Rajoy → Sánchez', 340, 0.05),
    {tipo: 'foto', src: 'ret-rajoy.jpg', forma: 'circulo', x: 195, y: 600, alto: h, zoom: [1.0, 1.15], dur: rel(a, b), en: 0.1},
    rot('Mariano Rajoy · presidente hasta 2018', 492, 0.2, tx),
    ic('flechaAbajo', 195, 772, 72, 1.0),
    {tipo: 'foto', src: 'ret-sanchez.jpg', forma: 'circulo', x: 195, y: 940, alto: h, zoom: [1.0, 1.15], dur: rel(a, b), en: 0.5},
    rot('Pedro Sánchez · presidente desde 2018', 832, 0.6, tx),
    nota(CRED_MONCLOA('Diego Crespo', '2018-06-01'), 0.2),
  ]);
}
// ===== 16 · Cierre (a): bucle de la silla =====
{
  const a = B.s, b = B.t;
  const c1 = rel(a, t(146) - 0.4); // 56.6
  const c2 = rel(a, 58.1);
  const sale = rel(a, t(152)) + 0.0;
  const otro = rel(a, t(157)) - 0.2;
  esc(a, b, {}, [
    rot('MOCIÓN DE CENSURA', 340, 0.05, {hasta: c1}),
    rot('No basta con echar…', 340, c1, {hasta: c2}),
    rot('No basta con echar: hay que reemplazar', 340, c2),
    ic('silla', 540, 830, 380, 0.1, {vibra: [0.6, sale]}),
    ic('bustoSilla', 540, 830, 380, 0.3, {color: '#8D99AE', vibra: [0.6, sale], mover: {x: 1500, y: 450, en: sale + 0.02, dur: 0.2, arco: 220}, hasta: sale + 0.4}),
    ic('bustoSilla', 540, 830, 380, otro, {color: '#2A9D8F', etiqueta: 'CANDIDATO'}),
  ]);
}
// ===== 17 · Plantilla de cierre =====
{
  const a = B.t, b = DUR;
  esc(a, b, {fondo: 'mostaza', sinSubtitulos: true}, [
    {tipo: 'cierre', frase: 'No basta con echar: hay que reemplazar', pregunta: '¿Qué mecanismo explicamos ahora?', tamano: 76},
    ic('silla', 540, 865, 150, 0.2, {vibra: [0.8, 4.6]}),
    ic('bustoSilla', 540, 865, 150, 0.5, {color: '#2A9D8F', vibra: [0.8, 4.6]}),
  ]);
}

// ---- Portada: titular y silla en tinta, dentro del recorte central 4:5 ----
const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'gancho', texto: '¿Echar al presidente sin elecciones?', y: 360, tamano: 108, en: -1},
  ic('silla', 540, 1140, 460, -1),
]}]};

const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.2, marca: '@loquepasaenunminuto', portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'fin de voz', FIN_VOZ.toFixed(2));
ESC.forEach((e, i) => console.log(i + 1, e.inicio, e.fin, (e.fin - e.inicio).toFixed(2)));
