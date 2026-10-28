// Genera escenas.json desde tiempos.json (tiempos reales de palabra). Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T.duracion + 2.6);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});

// === Cifras que pueden cambiar (se editan aquí y se vuelve a ejecutar) ===
const ADAMUZ_MUERTOS = '45'; // "al menos"; actualizar si cambia
const URDA_VICTIMAS = '?'; // cifra aún no definitiva: "?" hasta que haya dato oficial
const TITULAR = `ADAMUZ: ${ADAMUZ_MUERTOS} MUERTOS · CAUSA SIN CERRAR`;

// 1 · Gancho (tinta)
const b2 = S(24);
esc(0, b2, {fondo: 'tinta'}, [
  rot(TITULAR, 335, -1, {tamano: 72, hasta: rel(0, 14) - 0.1}),
  rot('El tren desde 2023', 335, rel(0, 14) - 0.05, {tamano: 72}),
  {tipo: 'numTr', x: 540, y: 880, valor: ADAMUZ_MUERTOS, tam: 380, en: -1},
  {tipo: 'trenTr', x: 300, y: 960, esc: 0.9, en: -1, llega: 0.01, sobreOscuro: true},
]);

// 2a · Ministro desde el 21-11-2023
const b2b = S(39);
esc(b2, b2b, {}, [
  rot('MINISTRO DESDE EL 21-11-2023', 335, 0.05),
  {tipo: 'tlTr', y: 640, en: 0.2, dur: 1.4, hitos: [{x: 90, etiqueta: '21-11-2023', en: 0.4}]},
  {tipo: 'siluetaTr', x: 330, y: 1010, esc: 0.95, en: 0.3},
]);
// 2b · Aviso: no es un balance completo; causas en manos de CIAF y jueces
const b3 = S(58);
esc(b2b, b3, {}, [
  rot('NO ES UN BALANCE COMPLETO', 335, 0.05, {hasta: rel(b2b, 49) - 0.15}),
  rot('CAUSAS: CIAF Y JUZGADO', 335, rel(b2b, 49) - 0.05),
  {tipo: 'lupaMazoTr', x: 540, y: 830, en: 0.2, mazoEn: rel(b2b, 49) - 0.1},
]);

// 3a · Toledo: robo de cable y detenidos
const b3b = S(97);
esc(b3, b3b, {}, [
  rot('4-5-2025 · ROBO DE CABLE', 335, 0.05, {hasta: rel(b3, 77) - 0.15}),
  rot('MILES DE VIAJEROS AFECTADOS', 335, rel(b3, 77) - 0.05, {hasta: rel(b3, 85) - 0.15}),
  rot('JULIO: 2 DETENIDOS POR EL ROBO', 335, rel(b3, 85) - 0.05),
  {tipo: 'toledoTr', y: 70, en: 0.15, corteEn: rel(b3, 65) - 0.1, esposasEn: rel(b3, 90) - 0.1},
]);
// 3b · Adamuz
const b3c = S(121);
esc(b3b, b3c, {}, [
  rot('18-1-2026 · ADAMUZ (CÓRDOBA)', 335, 0.05),
  {tipo: 'viasTr', y: 620, en: 0.1, descarrilaEn: rel(b3b, 108) - 0.2, chocaEn: rel(b3b, 118) - 0.1, bEn: rel(b3b, 114) - 0.4},
]);
// 3c · Gelida y Rodalies
const b3d = S(145);
esc(b3c, b3d, {}, [
  rot('20-1-2026 · GELIDA (BARCELONA)', 335, 0.05, {hasta: rel(b3c, 135) - 0.15}),
  rot('1 MUERTO: MAQUINISTA EN PRÁCTICAS', 335, rel(b3c, 135) - 0.05, {hasta: rel(b3c, 140) - 0.15}),
  rot('RODALIES PARADA DOS DÍAS', 335, rel(b3c, 140) - 0.05),
  {tipo: 'muroTr', y: 720, en: 0.1, luto: rel(b3c, 135) - 0.1, paradaEn: rel(b3c, 140) - 0.1},
]);
// 3d · Huelga de Semaf
const b4 = S(168);
esc(b3d, b4, {}, [
  rot('HUELGA 9–11 FEB · DESCONVOCADA EL 9', 335, 0.05),
  {tipo: 'calTr', x: 90, y: 560, en: 0.2, diasEn: [rel(b3d, 153) - 0.15, rel(b3d, 154) - 0.05, rel(b3d, 155) - 0.15], desconvocaEn: rel(b3d, 159) - 0.1},
]);

// 4 · Giro: aviso de Semaf y comparecencia
const b5 = S(205);
esc(b4, b5, {}, [
  rot('AGOSTO DE 2025: SEMAF AVISA A ADIF', 335, 0.05, {hasta: rel(b4, 192) - 0.15}),
  rot('3-2-2026: PUENTE EN EL CONGRESO', 335, rel(b4, 192) - 0.05, {hasta: rel(b4, 202) - 0.15}),
  rot('Prometió máxima transparencia', 335, rel(b4, 202) - 0.05),
  {tipo: 'giroTr', y: 570, en: 0.2, atrilEn: rel(b4, 192) - 0.1},
  rot('según Reuters', 1048, rel(b4, 190) - 0.05, {hasta: rel(b4, 192) - 0.1}),
]);

// 5a · Urda
const b5b = S(219);
esc(b5, b5b, {}, [
  rot('28-10: CHOQUE EN URDA (TOLEDO)', 335, 0.05),
  {tipo: 'puntoTr', y: 70, en: 0.15},
]);
// 5b · Cifras
const b5c = S(229);
esc(b5b, b5c, {}, [
  rot('CIFRA DE VÍCTIMAS SIN CERRAR', 335, 0.05),
  {tipo: 'duoTr', y: 820, valorA: ADAMUZ_MUERTOS, etiquetaA: 'ADAMUZ', valorB: URDA_VICTIMAS, etiquetaB: 'URDA', en: 0.2, enB: rel(b5b, 224) - 0.1},
]);
// 5c · Pregunta
const b6 = S(237);
esc(b5c, b6, {}, [
  rot('¿RESPONSABILIDADES ANTES DEL INFORME?', 335, 0.05),
  {tipo: 'botonesTr', y: 790, en: 0.3},
]);
// 5d · Cierre
esc(b6, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '¿RESPONSABILIDADES ANTES DEL INFORME?', tamano: 68, pulso: true, guardaEn: 0.6},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'tinta', componentes: [
  {tipo: 'gancho', texto: `ADAMUZ: ${ADAMUZ_MUERTOS} MUERTOS, CAUSA SIN CERRAR`, y: 340, tamano: 100, en: -1},
  rot('El tren desde 2023', 760, -1, {tamano: 80}),
  {tipo: 'numTr', x: 540, y: 1150, valor: ADAMUZ_MUERTOS, tam: 340, en: -1},
  {tipo: 'trenTr', x: 300, y: 1230, esc: 0.9, en: -1, llega: 0.01, sobreOscuro: true},
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, musica: {pista: 'hidden-agenda.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
