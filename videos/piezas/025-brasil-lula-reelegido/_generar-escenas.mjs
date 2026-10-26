// Genera tiempos.json (grafía del guion) y escenas.json de la 025. Uso: node _generar-escenas.mjs
// Lee tiempos-fonetico.json (índices originales de la voz: "pe ele" = 52-53).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const P = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos-fonetico.json'), 'utf8'));
// tiempos.json con la grafía del guion (PL, Zanin, Fachin)
const pal = [];
P.palabras.forEach((w, i) => {
  if (i === 52) pal.push({t: 'PL,', inicio: w.inicio, fin: P.palabras[53].fin});
  else if (i === 53) return;
  else pal.push({...w, t: w.t.replace('Zanín', 'Zanin').replace('Fashín', 'Fachin')});
});
fs.writeFileSync(path.join(dir, 'tiempos.json'), JSON.stringify({...P, palabras: pal}));
const t = (i) => P.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const DUR = r(P.duracion + 5.5);
const rel = (a, abs) => r(abs - a);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.1, o = {}) => ({tipo: 'notas', lineas, en, ...o});

// ===== BLOQUE 6 (editable a las 20:00 si cambia la situación de la petición de anulación) =====
const B6 = {
  rotuloEstado: 'A 26-10: no consta la petición', // si ya está presentada: p. ej. 'Presentada la petición' (con la fuente exacta)
  notaEstado: 'Comprobado el 26-10',
};
// ================================================================================================

const CR_LULA = 'Foto: Ricardo Stuckert/PR · CC BY 2.0 · Wikimedia Commons';
const CR_FLAVIO = 'Foto: Agência Senado · uso libre con atribución · Wikimedia Commons';
const CR_URNA = 'Foto: Antonio Augusto/TSE · dominio público';
const AV = 'Imagen de archivo';
const ZL = (src) => (src === 'ret-lula.jpg' ? 1.1 : 1);
const retrato = (src, y, en) => ({tipo: 'foto', src, forma: 'circulo', x: 195, y, alto: 250, zoom: [1.0 * ZL(src), 1.06 * ZL(src)], dur: 5, en});
const B = {
  a2: S(14), b1: S(28), b2: S(34), b3: S(49), b4: S(63), c1: S(71), c2: S(75), c3: S(91), c4: S(99), c5: S(113),
  d1: S(126), d2: S(130), d3: S(143), d4: S(155), d5: S(170), d6: S(184), d7: S(198), e1: S(208), e2: S(223),
  f1: S(236), f2: S(238), f3: S(245), f4: S(253), g1: S(268), g2: S(277),
};

// 1 · Gancho (fotograma 0: barras ya con cifras; "GANÓ" al decir "ganar")
const FILA = (o) => ({tipo: 'barrasL', fila: true, y0: 700, paso: 150, barAlto: 110, ...o});
esc(0, B.a2, {}, [
  {tipo: 'gancho', texto: 'SEGUNDO EN LA 1.ª VUELTA… GANÓ', y: 335, tamano: 84, en: -1},
  FILA({items: [
    {nombre: 'FLÁVIO', valor: 47.0, color: '#F2B134', en: -1, dur: 0},
    {nombre: 'LULA', valor: 45.2, color: '#2A9D8F', en: -1, dur: 0, gano: r(t(9) - 0.1)},
  ], en: -1}),
  nota(['1.ª vuelta · 4-10'], 0.1),
]);
esc(B.a2, B.b1, {}, [
  rot('Su rival no lo reconoce', 335, 0.05),
  retrato('ret-lula.jpg', 600, 0.1),
  {tipo: 'textoL', x: 350, y: 490, en: 0.2, lineas: [{t: 'Lula · PT'}, {t: AV, tam: 36, peso: 600}, {t: CR_LULA, tam: 36, peso: 600}]},
  retrato('ret-flavio.jpg', 910, 0.25),
  {tipo: 'textoL', x: 350, y: 780, en: 0.3, lineas: [{t: 'Flávio Bolsonaro · PL'}, {t: AV, tam: 36, peso: 600}, {t: CR_FLAVIO, tam: 36, peso: 600}]},
  {tipo: 'interrogaL', x: 300, y: 810, r: 44, en: 0.6},
  nota(['Según Agência Brasil, 25-10'], 0.1),
]);
// 2 · Resultado
esc(B.b1, B.b2, {}, [
  rot('DOM. 25-10 · 2.ª VUELTA', 335, 0.05),
  {tipo: 'calendarioL', dia: 25, x: 540, y: 760, lado: 420, marca: Math.max(0.5, rel(B.b1, t(29)) - 0.05), en: 0.1},
]);
const NOTA_L = 'Votos válidos, 99,99 % escrutado · TSE, vía Bloomberg Línea e InfoMoney';
const ITEM_L = (o) => ({nombre: 'LULA', valor: 51.8, color: '#2A9D8F', ...o});
const ITEM_F = (o) => ({nombre: 'FLÁVIO', valor: 48.2, color: '#F2B134', ...o});
esc(B.b2, B.b3, {}, [
  rot('Lula 51,8 %', 335, 0.05),
  {tipo: 'barrasL', items: [ITEM_L({en: 0.2, dur: 1.6})], mapa: true, y0: 520, en: 0},
  nota([NOTA_L], 0.1),
]);
esc(B.b3, B.b4, {}, [
  rot('Flávio 48,2 %', 335, 0.05),
  {tipo: 'barrasL', items: [ITEM_L({en: -1, dur: 0}), ITEM_F({en: 0.2, dur: 1.5})], mapa: true, y0: 520, en: -1},
  nota([NOTA_L], 0.1),
]);
esc(B.b4, B.c1, {}, [
  rot('+4,4 millones de votos', 335, 0.05),
  {tipo: 'barrasL', items: [ITEM_L({en: -1, dur: 0}), ITEM_F({en: -1, dur: 0})], corchete: {en: 0.5, texto: '+4,4 M'}, mapa: true, y0: 520, en: -1},
  nota(['Diferencia: 4,43 millones · Fuente: TSE, vía Bloomberg Línea'], 0.1),
]);
// 3 · Remontada
esc(B.c1, B.c2, {}, [
  rot('¿CÓMO LLEGÓ?', 520, 0.05, {tamano: 110}),
  {tipo: 'flechaAtrasH', x: 540, y: 1000, r: 120, en: 0.1},
]);
const F1 = (o) => ({nombre: 'FLÁVIO', valor: 47.03, dec: 2, color: '#F2B134', ...o});
const L1 = (o) => ({nombre: 'LULA', valor: 45.16, dec: 2, color: '#2A9D8F', ...o});
const FILA3 = (items) => ({tipo: 'barrasL', fila: true, y0: 900, paso: 140, barAlto: 100, items, en: -1});
esc(B.c2, B.c3, {}, [
  rot('1.ª vuelta, 4-10: Flávio 47,03 %', 335, 0.05),
  {tipo: 'calendarioL', dia: 4, x: 540, y: 690, lado: 340, marca: 0.8, en: 0.1},
  FILA3([F1({en: 0.3, dur: 1.5})]),
  nota(['Votos válidos · Fuente: TSE, vía Diário do Grande ABC'], 0.1),
]);
esc(B.c3, B.c4, {}, [
  rot('Lula 45,16 %', 335, 0.05),
  {tipo: 'calendarioL', dia: 4, x: 540, y: 690, lado: 340, en: -1},
  FILA3([F1({en: -1, dur: 0}), L1({en: 0.2, dur: 1.4})]),
  nota(['Votos válidos · Fuente: TSE, vía Diário do Grande ABC'], 0.1),
]);
esc(B.c4, B.c5, {}, [
  rot('−2,2 M → +4,4 M', 335, 0.05),
  {tipo: 'diferenciaL', y0: 520, eje: 330, b: Math.max(1.0, rel(B.c4, t(108)) - 0.1), flecha: Math.max(0.9, rel(B.c4, t(107)) - 0.1), en: 0},
  nota(['Votos distintos en cada vuelta · Fuente: TSE'], 0.1),
]);
esc(B.c5, B.d1, {}, [
  rot('Remontada inédita', 335, 0.05),
  {tipo: 'lineaEleccionesL', y: 800, selloEn: Math.max(1.0, rel(B.c5, t(116)) - 0.1), en: 0.1},
  nota(['Según Agência Brasil e InfoMoney'], 0.1),
]);
// 4 · Flávio
esc(B.d1, B.d2, {}, [
  rot('¿QUÉ DICE FLÁVIO?', 335, 0.05),
  {tipo: 'foto', src: 'ret-flavio.jpg', forma: 'circulo', x: 540, y: 800, alto: 520, zoom: [1.0, 1.08], dur: 3, en: 0.1, notas: [AV], credito: CR_FLAVIO},
]);
esc(B.d2, B.d3, {}, [
  {tipo: 'bocadilloL', lineas: ['Flávio: imposible', 'reconocer el resultado'], x: 505, y: 580, ancho: 880, colaX: 230, colaY: 830, en: 0.05},
  retrato('ret-flavio.jpg', 960, 0.2),
  {tipo: 'textoL', x: 350, y: 880, en: 0.3, lineas: [{t: AV, tam: 36, peso: 600}, {t: CR_FLAVIO, tam: 36, peso: 600}]},
  nota(['Anunció que pedirá la anulación · Agência Brasil, 25-10'], 0.1),
]);
esc(B.d3, B.d4, {}, [
  rot('Su queja: la prórroga del horario', 335, 0.05),
  {tipo: 'relojL', x: 400, y: 790, r: 190, h0: 17, h1: 19, marca: Math.max(0.8, rel(B.d3, t(150)) - 0.1), en: 0.1},
]);
esc(B.d4, B.d5, {}, [
  rot('Zanin (STF): votación hasta las 19:00 (Brasilia)', 335, 0.05),
  {tipo: 'tarjetaL', lineas: ['Cristiano Zanin', 'ministro del Supremo'], x: 505, y: 700, en: 0.15},
  {tipo: 'relojL', x: 200, y: 1010, r: 100, h0: 17, h1: 19, salta: Math.max(0.8, rel(B.d4, t(161)) - 0.1), digitalDx: 290, digitalDy: 24, en: 0.3},
  nota(['Supremo Tribunal Federal · Agência Brasil, 25-10'], 0.1),
]);
esc(B.d5, B.d6, {}, [
  rot('Tras la queja de la campaña de Lula', 335, 0.05),
  {tipo: 'autobusL', x: 300, y: 720, ancho: 400, aspaEn: Math.max(0.6, rel(B.d5, t(180)) - 0.1), en: 0.1},
  {tipo: 'tarjetaL', lineas: ['Campaña de Lula'], x: 505, y: 1000, en: 0.3},
  nota(['Por restricciones del transporte público · Agência Brasil'], 0.1),
]);
esc(B.d6, B.d7, {}, [
  {tipo: 'bocadilloL', lineas: ['Flávio: reglas', 'cambiadas con', 'urnas cerradas'], x: 505, y: 600, ancho: 880, colaX: 400, colaY: 850, en: 0.05},
  {tipo: 'recorte', src: 'urna.png', x: 400, y: 1000, ancho: 440, giro: -3, desde: 'escala', en: 0.3, notas: ['Según InfoMoney, 25-10'], credito: CR_URNA},
  {tipo: 'candadoMostaza', x: 800, y: 1000, tamano: 200, en: Math.max(0.8, rel(B.d6, t(195)) - 0.3)},
]);
esc(B.d7, B.e1, {}, [
  rot('Zanin: solo urnas aún abiertas', 335, 0.05),
  rot('Dónde valía la prórroga', 505, 0.15),
  {tipo: 'mapaL', gris: true, x: 270, y: 900, tamano: 420, leyenda: [520, 860], en: 0.2},
  nota(['Fuente: Agência Brasil, Bloomberg Línea'], 0.1),
]);
// 5 · Otras voces
esc(B.e1, B.e2, {}, [
  rot('Flávio también pidió prórroga local', 335, 0.05),
  {tipo: 'tarjetaL', lineas: ['Campaña de Flávio'], x: 505, y: 720, en: 0.15},
  {tipo: 'relojL', x: 200, y: 1010, r: 100, h0: 17, texto: '+2 h', digitalDx: 220, digitalDy: 24, en: 0.4},
  {tipo: 'nubeL', x: 730, y: 1020, ancho: 340, en: 0.6},
  nota(['Al TSE, por lluvias · Poder360, InfoMoney, Reuters'], 0.1),
]);
esc(B.e2, B.f1, {}, [
  rot('Fachin (STF): respetar', 335, 0.05),
  rot('la voluntad de los electores', 420, 0.05),
  {tipo: 'tarjetaL', lineas: ['Edson Fachin', 'presidente del Supremo'], x: 505, y: 770, en: 0.15},
  nota(['Agência Brasil, 25-10'], 0.1),
]);
// 6 · Qué viene
esc(B.f1, B.f2, {}, [
  rot('¿Y AHORA?', 335, 0.03, {tamano: 96}),
  {tipo: 'calendarioL', dia: 26, pasa: true, x: 540, y: 800, lado: 420, en: 0.05},
]);
esc(B.f2, B.f3, {}, [
  rot('Iría al Tribunal Superior Electoral', 335, 0.05),
  {tipo: 'fachadaL', x: 540, y: 760, ancho: 600, en: 0.1},
  {tipo: 'carpetaS', lineas: [], de: [150, 1060], a: [460, 960], en: 0.2, dur: Math.max(1.0, rel(B.f2, B.f3) - 1.0), ancho: 300, alto: 200},
  nota(['TSE · según InfoMoney'], 0.1),
]);
esc(B.f3, B.f4, {}, [
  rot(B6.rotuloEstado, 335, 0.05),
  {tipo: 'fachadaL', x: 540, y: 760, ancho: 600, en: -1},
  {tipo: 'carpetaS', lineas: [], de: [460, 960], en: -1, ancho: 300, alto: 200},
  {tipo: 'relojL', x: 790, y: 980, r: 100, h0: 17, gira: true, digital: false, en: 0.2},
  nota([B6.notaEstado], 0.1),
]);
esc(B.f4, B.g1, {}, [
  rot('Posesión: 5-1-2027 · 4 años', 335, 0.05),
  {tipo: 'posesionL', y: 760, enciende: 0.3, barra: Math.max(1.0, rel(B.f4, t(266)) - 0.4), en: 0.1},
  nota(['Constitución de Brasil, art. 82 (EC 111/2021)'], 0.1),
]);
// 7 · Cierre
esc(B.g1, B.g2, {}, [
  rot('1.ª vuelta: 2.º · 2.ª vuelta: 1.º', 335, 0.05),
  {tipo: 'barrasL', fila: true, y0: 560, paso: 150, barAlto: 110, en: 0.1, items: [
    {nombre: 'FLÁVIO', valor: 47.0, color: '#F2B134', en: -1, dur: 0},
    {nombre: 'LULA', valor: 45.2, color: '#2A9D8F', en: -1, dur: 0, gano: 0.5},
  ]},
]);
esc(B.g2, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '¿ANULAR O RESPETAR EL RESULTADO?', tamano: 96, pulso: true, guardaEn: Math.max(1.0, rel(B.g2, t(292)) - 0.15)},
  {tipo: 'botonesL', a: 'ANULAR', b: 'RESPETAR', y: 900, en: 0.5},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'gancho', texto: 'SEGUNDO EN LA 1.ª VUELTA… GANÓ', y: 340, tamano: 100, en: -1},
  {tipo: 'foto', src: 'ret-lula.jpg', forma: 'circulo', x: 270, y: 880, alto: 400, zoom: [1.1, 1.1], dur: 3, en: -1},
  {tipo: 'foto', src: 'ret-flavio.jpg', forma: 'circulo', x: 730, y: 880, alto: 400, zoom: [1, 1], dur: 3, en: -1},
  {tipo: 'textoL', x: 140, y: 1120, en: -1, lineas: [{t: 'Lula', tam: 72}]},
  {tipo: 'textoL', x: 560, y: 1120, en: -1, lineas: [{t: 'Flávio', tam: 72}]},
  {tipo: 'textoL', x: 180, y: 1210, en: -1, lineas: [{t: AV, tam: 36, peso: 600}]},
  {tipo: 'textoL', x: 590, y: 1210, en: -1, lineas: [{t: AV, tam: 36, peso: 600}]},
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, musica: {pista: 'hidden-agenda.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', P.duracion.toFixed(2));
ESC.forEach((e, i) => { const d = e.fin - e.inicio; console.log(i + 1, e.inicio, d.toFixed(2)); });
