// Genera escenas.json desde tiempos.json (tiempos reales de palabra). Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const DUR = r(T.duracion + 2.5);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.1, o = {}) => ({tipo: 'notas', lineas, en, ...o});
const CR1 = 'Foto: Américo Toledano · CC BY-SA 4.0 · Wikimedia Commons';
const A = S(15), Bq = S(28), Cq = S(41), Dq = S(49), Eq = S(60), Fq = S(66), Gq = r(S(72) - 0.4), Hq = S(80), Iq = S(87);
const rel = (a, abs) => r(abs - a);
const GANCHO = '¿TIENES QUE PEDIR EL VOTO DESDE FUERA?';
const PTO_LEJANO = {lon: 135, lat: -25};

// 1 · Gancho
esc(0, A, {}, [
  {tipo: 'gancho', texto: GANCHO, y: 335, tamano: 88, en: -1, hasta: rel(0, S(14)) - 0.05},
  rot('DEPENDE', 335, rel(0, S(14))),
  {tipo: 'mundoX', x: 500, y: 830, ancho: 860, en: -1, interrogante: {...PTO_LEJANO, tam: 260, en: -1, fuera: rel(0, S(14)) + 0.05}},
  {tipo: 'casillaX', texto: 'RESIDES', x: 310, y: 1075, w: 380, h: 110, fs: 64, desde: -1, en: rel(0, S(14)) + 0.3},
  {tipo: 'casillaX', texto: 'DE PASO', x: 710, y: 1075, w: 380, h: 110, fs: 64, desde: -1, en: rel(0, S(14)) + 0.3},
]);
// 2 · Residentes (CERA)
esc(A, Bq, {}, [
  rot('RESIDES FUERA: INSCRITO EN EL CERA', 335, 0.05),
  {tipo: 'casillaX', texto: 'RESIDES', x: 540, y: 800, w: 760, h: 210, fs: 100, fill: '#F2B134', en: 0.05, checkEn: rel(A, t(24))},
  {tipo: 'selloTexto', lineas: ['NO PIDES NADA'], x: 480, y: 990, tamano: 68, angulo: -4, desde: 40, fondo: '#2A9D8F', en: rel(A, S(25))},
  nota(['CERA = censo de residentes ausentes'], 0.1),
]);
esc(Bq, Cq, {}, [
  rot('DESDE 2022: SE ENVÍA DE OFICIO', 335, 0.05),
  {tipo: 'mundoX', x: 500, y: 800, ancho: 860, en: 0.1, oficina: {en: 0.3}, vuelo: {de: [-3, 40], a: [-64, -34], en: rel(Bq, t(36)) - 0.1, dur: 1.2, alto: 30}},
  {tipo: 'fechaX', texto: '24–30 OCT', x: 540, y: 1060, tam: 64, en: rel(Bq, t(36)) - 0.1},
  nota(['LO 12/2022, art. 75 LOREG', 'Envío de la documentación · Exteriores'], 0.1),
]);
esc(Cq, Dq, {}, [
  rot('2011–2022: HABÍA QUE PEDIRLO', 335, 0.05),
  {tipo: 'formularioX', x: 500, y: 780, tam: 400, en: 0.1, tachaEn: rel(Cq, t(46)) - 0.05},
  nota(['LO 2/2011 → LO 12/2022'], 0.1),
]);
// 3 · Cómo se vota
const e55 = rel(Dq, t(55));
esc(Dq, Eq, {}, [
  rot('EN URNA: 21–26 NOV', 335, 0.05),
  {tipo: 'foto', src: 'F1.jpg', x: 500, y: 790, ancho: 880, alto: 540, foco: '50% 50%', zoom: [1.0, 1.12], dur: 2.2, en: 0.1, hasta: 2.3, notas: ['Imagen de archivo · Andalucía 2015', 'Foto: Américo Toledano', 'CC BY-SA 4.0 · Wikimedia Commons']},
  {tipo: 'calendarioX', mes: 'NOVIEMBRE', primer: 6, dias: 30, x: 540, y: 470, en: 2.2, rellenos: [{d0: 21, d1: 26, en: 2.4, paso: 0.15}], grises: [29]},
  {tipo: 'etiquetaSobreX', texto: 'O POR CORREO', x: 150, y: 1075, en: 3.1},
  nota(['O por correo · art. 75 LOREG'], 2.4),
]);
// 4 · Giro
esc(Eq, Fq, {}, [
  rot('¿DE PASO?', 335, 0.05),
  {tipo: 'casillaX', texto: 'DE PASO', x: 540, y: 600, w: 520, h: 120, fs: 72, fill: '#F2B134', en: 0.05},
  {tipo: 'mundoX', x: 500, y: 880, ancho: 860, en: 0.1, puntos: [{lon: 139, lat: 36, en: 0.3}]},
  {tipo: 'maletaX', x: 826, y: 758, tam: 130, en: 0.45},
]);
esc(Fq, Gq, {}, [
  rot('PÍDELO EN EL CONSULADO', 335, 0.05),
  {tipo: 'sobreX', x: 480, y: 800, tam: 380, clip: true, en: 0.1},
  {tipo: 'selloTexto', lineas: ['SOLICITUD'], x: 600, y: 930, tamano: 64, angulo: -6, desde: 40, en: 0.9},
  nota(['Inscrito como no residente'], 0.1),
]);
esc(Gq, Hq, {}, [
  rot('PLAZO: SÁBADO 31 OCT', 335, 0.05),
  {tipo: 'calendarioX', mes: 'OCTUBRE', primer: 3, dias: 31, x: 540, y: 470, en: 0.1, aro: {d: 31, en: rel(Gq, t(75)) - 0.1}},
  nota(['Entrega en persona · mira el horario de tu consulado'], 0.1),
]);
esc(Hq, Iq, {}, [
  rot('¿SIN PEDIRLO?', 335, 0.05),
  {tipo: 'mundoX', x: 500, y: 830, ancho: 860, en: 0.05, interrogante: {...PTO_LEJANO, tam: 260, en: 0.1}},
]);
// 5 · Cierre
esc(Iq, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '¿DEBERÍA RECIBIRLO TAMBIÉN QUIEN ESTÁ DE PASO?', tamano: 80, pulso: true},
]);

const DY = 110;
const NO = new Set(['rotulo', 'notas', 'gancho', 'cierre']);
for (const e of ESC) for (const c of e.componentes) {
  if (NO.has(c.tipo)) continue;
  if (typeof c.y === 'number' && !(c.texto === 'NO PIDES NADA' || (c.lineas && c.lineas[0] === 'NO PIDES NADA') || (c.tipo === 'casillaX' && c.y === 1075))) c.y += DY;
  if (c.tipo === 'foto') c.alto += 60;
}
const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'gancho', texto: GANCHO, y: 350, tamano: 100, en: -1},
  {tipo: 'mundoX', x: 500, y: 960, ancho: 860, en: -1, interrogante: {...PTO_LEJANO, tam: 280, en: -1}},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, musica: {pista: 'hidden-agenda.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
ESC.forEach((e, i) => { const d = e.fin - e.inicio; if (d < 1.3) console.log('corta', i + 1, e.inicio, d.toFixed(2)); });
