// Genera escenas.json desde tiempos.json (026 v2: fotos reales de archivo + hilo "3 preguntas"). Uso: node _generar-escenas.mjs
// LA CIFRA OFICIAL SE CAMBIA AQUÍ (se recomprueba antes de publicar):
const DATO = {cifra: '30', fuente: 'Junta de Castilla-La Mancha', hora: '10:30'};
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const r = (x) => +x.toFixed(2);
const W = (i) => T.palabras[i].inicio;
const S = (i) => r(Math.max(0, W(i) - 0.1)); // inicio de escena en la palabra i
const DUR = r(T.duracion + 1.9);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const GANCHO = 'Choque de trenes en Urda (Toledo)';
const IA = 'Imagen de archivo';
const CR = {
  a1: 'Foto: Javier Perez Montes · CC BY-SA 4.0 · Commons',
  a2: 'Foto: MNXANL · CC BY-SA 4.0 · Commons',
  a5: 'Foto: Julen Iturbe-Ormaetxe · CC BY-SA 2.0 · Commons',
  a6: 'Foto: Zarateman · CC0 · Commons',
  a8: 'Foto: Javier Perez Montes · CC BY-SA 4.0 · Commons',
  a9: 'Foto: Liberaler Humanist · CC BY-SA 3.0 · Commons',
};
// Foto de archivo con Ken Burns entre dos instantes ABSOLUTOS (s); sc = inicio de la escena
const ft = (sc, k, a, b, o = {}) => {
  const {nota, ...resto} = o;
  return {tipo: 'foto', src: `${k}.jpg`, x: 500, y: 860, ancho: 880, alto: 560, en: r(a - sc), hasta: r(b - sc), dur: r(b - a), notas: [nota ?? IA], credito: CR[k], ...resto};
};
const MK = (e, p) => ({tipo: 'marcadorU', estados: e, pops: p ?? [null, null, null], en: -1});

const s = {A: 0, B: S(20), C: S(29), D: S(33), E: S(48), G: S(60), H: S(86), I: S(99), J: S(112), L: S(137), M: S(150), N: S(163), O: S(191), P: S(204), Q: S(219), R: S(226)};
const rel = (sc, t) => r(t - sc);

// 1 · Gancho: Iryo, AVE, Iryo (sin marcador todavía)
esc(s.A, s.B, {}, [
  rot(GANCHO, 335, -1, {tamano: 72}),
  ft(0, 'a1', 0, W(9) - 0.05, {foco: '22% 88%', zoom: [1.5, 1.9], pan: [30, 0]}),
  ft(0, 'a2', W(9), W(16), {foco: '45% 50%', zoom: [1.0, 1.25]}),
  ft(0, 'a8', W(16), s.B, {foco: '28% 78%', zoom: [1.2, 1.55], pan: [-30, 0]}),
]);
// 1b · Mapa y las tres preguntas
esc(s.B, s.C, {}, [
  rot('3 preguntas: balance · viaje · causa', 335, 0.05),
  {tipo: 'mapaU', x: 480, y: 760, sc: 0.38, en: -1, toledoEn: 0.6, urdaEn: 1.0, zoom: {en: 1.4, dur: 1.5, escala: 1.3}},
  {tipo: 'marcadorU', estados: ['pend', 'pend', 'pend'], aparece: [rel(s.B, W(26)), rel(s.B, W(27)) + 0.05, rel(s.B, W(28))], en: -1},
]);
// 2 · Balance
esc(s.C, s.D, {}, [
  rot('1 · Balance', 335, 0.05, {tamano: 96}),
  MK(['act', 'pend', 'pend'], [0.05, null, null]),
]);
esc(s.D, s.E, {}, [
  {tipo: 'datoU', ...DATO, y: 400, en: 0.05, fuenteEn: rel(s.D, W(39)) - 0.1, sinEn: 99},
  MK(['act', 'pend', 'pend']),
]);
esc(s.E, s.G, {}, [
  rot('Cifras más altas: sin confirmar', 335, 0.05),
  ft(s.E, 'a5', s.E, W(56) - 0.05, {nota: 'Imagen de archivo: Urda', foco: '30% 55%', zoom: [1.05, 1.3], pan: [-40, 0]}),
  ft(s.E, 'a5', W(56), s.G, {nota: 'Imagen de archivo: Urda', foco: '85% 40%', zoom: [1.3, 1.1], pan: [40, 10]}),
  MK(['act', 'pend', 'pend']),
]);
// 3 · Tu viaje
const cortada = rel(s.G, W(73));
const tAdif = W(73) + 0.35, tRenfe = W(76) + 0.3, tIryo = W(78) + 0.9;
esc(s.G, s.H, {}, [
  rot('2 · Tu viaje', 335, 0.05, {tamano: 96, hasta: rel(s.G, W(63)) - 0.05}),
  rot('Alta velocidad Madrid-Andalucía: cortada', 335, rel(s.G, W(63)), {}),
  {tipo: 'mapaU', x: 480, y: 800, sc: 0.38, en: rel(s.G, W(63)), hasta: rel(s.G, tAdif), toledoEn: 0, urdaEn: 0, linea: {en: rel(s.G, W(63)) + 0.4, grisEn: cortada - 0.7, tachaEn: cortada - 0.4}},
  ft(s.G, 'a6', tAdif, tRenfe, {foco: '50% 30%', zoom: [1.0, 1.25]}),
  ft(s.G, 'a9', tRenfe, tIryo, {foco: '40% 55%', zoom: [1.0, 1.3], pan: [-30, 0]}),
  ft(s.G, 'a8', tIryo, s.H, {foco: '30% 80%', zoom: [1.3, 1.5], pan: [-20, 0]}),
  MK(['ok', 'act', 'pend'], [null, 0.05, null]),
]);
esc(s.H, s.I, {}, [
  rot('Consulta con tu compañía', 335, 0.05),
  ft(s.H, 'a1', s.H, W(94), {foco: '22% 88%', zoom: [1.6, 1.3], pan: [-30, 0]}),
  ft(s.H, 'a2', W(94), s.I, {foco: '30% 60%', zoom: [1.1, 1.4], pan: [40, 0]}),
  MK(['ok', 'act', 'pend']),
]);
// 4 · Causa
esc(s.I, s.J, {}, [
  rot('3 · La causa', 335, 0.05, {tamano: 96}),
  ft(s.I, 'a8', s.I, W(105) - 0.05, {foco: '40% 78%', zoom: [1.5, 1.9]}),
  ft(s.I, 'a9', W(105), s.J, {foco: '70% 30%', zoom: [1.1, 1.4], pan: [-30, 20]}),
  MK(['ok', 'ok', 'act'], [null, null, 0.05]),
]);
const noConf = rel(s.J, W(127));
esc(s.J, s.L, {}, [
  rot('¿Qué es un alcance?', 335, 0.05, {hasta: rel(s.J, W(131)) - 0.05}),
  rot('Sin determinar', 335, rel(s.J, W(131))),
  {tipo: 'alcanceU', y: 680, en: 0.1, llegaEn: rel(s.J, W(124)), dur: 6.5},
  {tipo: 'selloTexto', lineas: ['NO', 'CONFIRMADO'], x: 440, y: 960, tamano: 64, angulo: -4, desde: 40, en: noConf + 0.3},
  MK(['ok', 'ok', 'act']),
]);
// 5 · Seguridad
esc(s.L, s.M, {}, [
  rot('Sistemas de frenado automático', 335, 0.05),
  {tipo: 'seguridadU', y: 680, en: 0.1, pasos: [0.5, rel(s.L, W(142)), rel(s.L, W(147))]},
  MK(['ok', 'ok', 'act']),
]);
esc(s.M, s.N, {}, [
  rot('En este tramo: lo dirá la investigación', 335, 0.05),
  ft(s.M, 'a1', s.M, W(156), {foco: '22% 88%', zoom: [1.9, 1.5], pan: [20, 0]}),
  ft(s.M, 'a8', W(156), s.N, {foco: '45% 78%', zoom: [1.3, 1.7], pan: [-30, 0]}),
  MK(['ok', 'ok', 'act']),
]);
// 6 · Investigación
esc(s.N, s.O, {}, [
  rot('CIAF: causas, no culpables', 335, 0.05),
  {tipo: 'mapaU', x: 480, y: 800, sc: 0.38, en: 0.05, hasta: rel(s.N, W(182)) - 0.05, toledoEn: 0, urdaEn: 0.4, zoom: {en: 1.2, dur: 4.5, escala: 1.5}},
  ft(s.N, 'a9', W(182), s.O, {foco: '85% 30%', zoom: [1.0, 1.4], pan: [-40, 0]}),
  MK(['ok', 'ok', 'act']),
]);
esc(s.O, s.P, {}, [
  rot('Informe final: 12 meses, por regla general', 335, 0.05),
  {tipo: 'plazoU', y: 700, en: 0.1, hitoEn: rel(s.O, W(201))},
  MK(['ok', 'ok', 'act']),
]);
// 7 · Política y cierre
esc(s.P, s.Q, {}, [
  {tipo: 'pastillasU', items: [
    {texto: 'PP', en: rel(s.P, W(204)), y: 480},
    {texto: 'PSOE', en: rel(s.P, W(205)), y: 640},
    {texto: 'Frente Amplio', en: rel(s.P, W(207)), y: 800},
    {texto: 'Vox', en: rel(s.P, W(214)), y: 1000},
  ]},
  MK(['ok', 'ok', 'act']),
]);
esc(s.Q, s.R, {}, [
  {tipo: 'resumenU', y: 480, filas: [
    {texto: 'Balance abierto', en: rel(s.Q, W(219))},
    {texto: 'Línea cortada', en: rel(s.Q, W(221))},
    {texto: 'Causa: por determinar', en: rel(s.Q, W(223))},
  ]},
  {tipo: 'marcadorU', estados: ['ok', 'ok', 'ok'], pops: [rel(s.Q, W(219)), rel(s.Q, W(221)), rel(s.Q, W(223))], en: -1},
]);
esc(s.R, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierre', frase: 'Causa: por determinar', tamano: 88, pulso: true}]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'gancho', texto: GANCHO, y: 330, tamano: 96, en: -1},
  {tipo: 'foto', src: 'a8.jpg', x: 500, y: 1010, ancho: 880, alto: 640, foco: '28% 78%', zoom: [1.2, 1.2], dur: 0.01, en: -1, notas: [IA], credito: CR.a8},
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, musica: {pista: 'hidden-agenda.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
