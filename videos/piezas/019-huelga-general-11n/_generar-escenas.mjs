// Genera tiempos.json (grafía del guion) y escenas.json de la 019. Uso: node _generar-escenas.mjs
// Lee tiempos-fonetico.json (índices originales de la voz: "ce ce o o" = 20-23, etc.).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const P = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos-fonetico.json'), 'utf8'));
// tiempos.json con la grafía del guion: siglas fusionadas
const FUS = {20: [23, 'CCOO,'], 24: [26, 'UGT'], 44: [47, 'CCOO'], 49: [51, 'UGT'], 155: [157, 'CEOE'], 184: [186, 'CEOE'], 202: [204, 'CEOE']};
const pal = [];
for (let i = 0; i < P.palabras.length; i++) {
  const w = P.palabras[i];
  if (FUS[i]) { pal.push({t: FUS[i][1], inicio: w.inicio, fin: P.palabras[FUS[i][0]].fin}); i = FUS[i][0]; continue; }
  pal.push({...w, t: w.t.replace('duda…', 'duda:').replace('ocurra.…', 'ocurra.')});
}
fs.writeFileSync(path.join(dir, 'tiempos.json'), JSON.stringify({...P, palabras: pal}));
const t = (i) => P.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const DUR = +(P.duracion + 1.5).toFixed(1);
const ESC = [];
let cur = 0;
const esc = (a, b, extra, fn) => { cur = a; ESC.push({inicio: a, fin: b, ...extra, componentes: fn()}); };
const at = (abs) => r(abs - cur); // segundo de escena
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.1, o = {}) => ({tipo: 'notas', lineas, en, ...o});
// secuencia de rótulos (y, textos con ventana [a,b] en tiempos de voz) sin solaparse: sale en b-0.1 y entra el siguiente en b-0.05
const seq = (items, y, endAbs) => items.flatMap(([texto, a, b, notaL, o]) => {
  const en = Math.max(0.05, at(a - 0.1) + (a === items[0][1] ? 0 : 0.05));
  const hasta = b === undefined ? undefined : at(b - 0.1);
  const out = [rot(texto, y, en, {...(hasta !== undefined ? {hasta} : {}), ...(o || {})})];
  if (notaL) out.push(nota(notaL, en + 0.05, hasta !== undefined ? {hasta} : {}));
  return out;
});
const FUENTE = 'Fuente: BOE, RDL 17/1977 · ET';
const NB = '‑';

// 1 · Gancho (0 - 4,9)
esc(0, S(14), {}, () => [
  {tipo: 'gancho', texto: 'HUELGA GENERAL: 11 DE NOVIEMBRE', y: 335, tamano: 84, en: -1, hasta: 3.1},
  {tipo: 'calendarioH', x: 540, y: 930, lado: 340, mes: 'NOV', dia: '11', cae: 0.05, mueve: 3.2, x2: 270, y2: 840, dur: 0.7, en: -1},
  rot('¿TE DESCUENTAN EL DÍA?', 335, 3.15),
  {tipo: 'nominaH', x: 730, y: 840, esc: 0.9, interroga: true, interEn: 3.6, en: 3.35},
]);
// 2 · Contexto
esc(S(14), S(30), {}, () => [
  rot('REGISTRADA EL 19 DE OCTUBRE', 335, 0.05),
  nota(['Ministerio de Trabajo · EFE, 19-10-2026'], 0.1),
  {tipo: 'calendarioH', x: 240, y: 770, lado: 290, mes: 'OCT', dia: '19', cae: -1, marca: at(t(17)), en: 0.1},
  {tipo: 'sobreCarpetaH', x: 700, y: 770, sobreEn: at(t(15)), selloEn: at(t(19)), en: 0.15},
  {tipo: 'pastillaH', texto: 'CCOO', x: 60, y: 970, ancho: 250, caps: true, en: at(t(20) - 0.1)},
  {tipo: 'pastillaH', texto: 'UGT', x: 60, y: 1060, ancho: 250, caps: true, en: at(t(24) - 0.1)},
  {tipo: 'pastillaH', texto: 'otras organizaciones', x: 60, y: 1150, en: at(t(28) - 0.1)},
]);
esc(S(30), S(37), {}, () => [
  rot('PIDEN: VIVIENDA Y SUELDOS', 335, 0.05),
  {tipo: 'llaveBilleteH', y: 780, llaveEn: at(t(31) - 0.1), billeteEn: at(t(34) - 0.1), en: 0.05},
]);
esc(S(37), S(56), {}, () => [
  rot('1.ª CONJUNTA DE CCOO Y UGT DESDE 2012', 335, 0.05),
  nota(['Al Jazeera y El País, 07-10 · la anterior, 14-11-2012'], 0.1),
  {tipo: 'fechasH', y: 780, hitos: [{x: 240, etiq: '2012', en: at(t(52) - 0.1)}, {x: 720, etiq: '2026', en: at(t(55) + 0.1)}], unir: at(t(55) + 0.1), en: 0.1},
]);
esc(S(56), S(63), {}, () => [
  rot('¿PUEDE PARARLA LA PATRONAL?', 335, 0.05),
  {tipo: 'mazoH', x: 200, y: 830, interroga: at(t(59) - 0.1), en: 0.1},
]);
// 3a · Si la secundas
esc(S(63), S(107), {}, () => [
  rot('SI LA SECUNDAS', 335, 0.05, {pastilla: true}),
  ...seq([
    ['EL CONTRATO NO SE ACABA', t(66), t(74), ['RDL 17/1977, art. 6.1', FUENTE]],
    ['SIN SANCIÓN', t(74), t(89), ['Salvo falta durante la huelga', FUENTE]],
    ['ESE DÍA, SIN SUELDO', t(89), t(100), ['Contrato suspendido · ET 45.1.l · RDL art. 6.2', FUENTE]],
    ['SIGUES DE ALTA EN LA SEGURIDAD SOCIAL', t(100), undefined, ['Alta especial, sin cotizar ese día · RDL art. 6.3', FUENTE]],
  ], 430),
  {tipo: 'contratoH', x: 540, y: 870, check: at(t(70)), escudo: at(t(77)), mueve: at(t(74)), x2: 250, en: at(t(66) - 0.1), hasta: at(t(89) - 0.1)},
  {tipo: 'sancionH', x: 690, y: 780, tacha: at(t(78)), chispa: at(t(85)), en: at(t(75) - 0.1), hasta: at(t(89) - 0.1)},
  {tipo: 'nominaH', x: 540, y: 820, esc: 1.1, cifra: '0 €', cifraEn: at(t(93) - 0.1), dia: 'ese día', en: at(t(89) - 0.05), hasta: at(t(100) - 0.1)},
  {tipo: 'casillaSSH', y: 880, check: at(t(102)), en: at(t(100) - 0.05)},
]);
// 3b · Si prefieres trabajar
esc(S(107), S(130), {fondo: 'mostaza'}, () => [
  ...seq([
    ['¿Y SI PREFIERES TRABAJAR?', t(107), t(111)],
    ['LIBERTAD DE TRABAJO', t(111), t(118), ['RDL art. 6.4']],
    ['SIN SUSTITUIR A HUELGUISTAS', t(118), undefined, ['Personal ajeno a la empresa · art. 6.5']],
  ], 335),
  {tipo: 'puertaH', x: 540, y: 900, check: at(t(113)), en: 0.1, hasta: at(t(118) - 0.1)},
  {tipo: 'sillasH', y: 900, flecha: at(t(122)), bloqueo: at(t(126) + 0.1), en: at(t(118) - 0.05)},
]);
// 3c · Servicios mínimos
esc(S(130), S(150), {}, () => [
  ...seq([
    ['EL LÍMITE: SERVICIOS MÍNIMOS', t(130), t(135)],
    ['LOS PUEDE FIJAR LA ADMINISTRACIÓN', t(135), t(143), ['RDL art. 10 · STC 11/1981, FJ 18']],
    ['SE PUEDEN RECURRIR', t(143), undefined, ['Ante los tribunales']],
  ], 335),
  {tipo: 'balanzaH', y: 700, izqEn: 0.3, derEn: at(t(134)), en: 0.1, hasta: at(t(143) - 0.1)},
  {tipo: 'resolucionH', y: 840, selloEn: at(t(143) + 0.3), golpes: [at(t(146)), at(t(148) + 0.2)], en: at(t(143) - 0.05)},
]);
// 4 · Giro
esc(S(150), S(165), {}, () => [
  rot('LOS SINDICATOS DICEN: NO HAY ACUERDO SALARIAL', 335, 0.05),
  nota(['EFE, 22-10-2026'], 0.1),
  {tipo: 'pastillaH', texto: 'CEOE', x: 60, y: 650, ancho: 250, caps: true, en: at(t(155) - 0.1)},
  {tipo: 'pastillaH', texto: 'Sindicatos', x: 500, y: 650, ancho: 410, en: at(t(151) - 0.1)},
  {tipo: 'acuerdoH', x: 540, y: 890, en: at(t(159) - 0.1)},
]);
esc(S(165), S(179), {}, () => [
  rot('LA LEY: ILEGAL SI ES POLÍTICA', 335, 0.05),
  nota(['RDL 17/1977, art. 11.a: motivos políticos o ajenos al interés profesional'], 0.1),
  {tipo: 'claveH', lineas: [
    {t: 'motivos políticos', y: 770, en: at(t(172) - 0.1), w: 600},
    {t: 'ajenos al interés', y: 890, en: at(t(175) - 0.1), w: 600},
    {t: 'profesional', y: 975, en: at(t(177) - 0.1), w: 385},
  ], en: 0.1},
]);
esc(S(179), S(213), {}, () => [
  ...seq([
    [`CEOE 19${NB}10: ES ELECTORAL`, t(179), t(196), ['Paráfrasis, según EFE']],
    [`22${NB}10: NO LA RECURRIRÁ ANTES DEL 11${NB}N`, t(196), undefined, ['Fuentes de la CEOE a EFE y a elDiario.es']],
  ], 335),
  {tipo: 'lineaCeoeH', y: 860, tarjeta: at(t(184) - 0.1), hito2: at(t(202) - 0.1), renuncia: at(t(209)), en: 0.1},
]);
esc(S(213), S(222), {}, () => [
  rot('SEGUIRÁ LA JORNADA', 335, 0.05),
  {tipo: 'calendarioH', x: 380, y: 840, lado: 360, mes: 'NOV', dia: '11', cae: -1, en: 0.1},
  {tipo: 'lupaH', x: 690, y: 840, etiqueta: 'seguimiento', etiquetaY: 1085, en: at(t(215) - 0.1)},
]);
// 5 · Qué viene ahora
esc(S(222), S(248), {}, () => [
  ...seq([
    ['¿QUÉ VIENE AHORA?', t(222), t(225)],
    [`11${NB}N: HUELGA Y MANIFESTACIONES`, t(225), t(238), ['Según Sordo (CCOO) y Álvarez (UGT) · EFE, 22-10']],
    [`13${NB}N: ARRANCA LA CAMPAÑA`, t(238), undefined, ['RD 806/2026 · elecciones: 29-11']],
  ], 335),
  {tipo: 'novH', y: 860, hito11: at(t(226)), campana: at(t(238) + 0.7), urna: at(t(247)), en: 0.1},
]);
// 6 · Cierre
esc(S(248), S(259), {}, () => [
  rot('SI LA SECUNDAS: SIN SUELDO, CON CONTRATO', 335, 0.05),
  {tipo: 'calendarioH', x: 190, y: 870, lado: 260, mes: 'NOV', dia: '11', cae: 0.15, en: 0.1},
  {tipo: 'nominaH', x: 470, y: 870, esc: 0.8, cifra: '0 €', cifraEn: at(t(251) - 0.1), dia: 'ese día', en: 0.15},
  {tipo: 'contratoH', x: 790, y: 870, esc: 0.8, check: at(t(256)), en: 0.2},
]);
esc(S(259), DUR, {fondo: 'mostaza', sinSubtitulos: true}, () => [
  {tipo: 'cierre', frase: '¿LA SECUNDARÍAS?', tamano: 88, pulso: true, guardaEn: Math.max(1.0, at(t(266)) - 0.15)},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'gancho', texto: 'HUELGA GENERAL: 11 DE NOVIEMBRE', y: 340, tamano: 100, en: -1},
  rot('¿TE DESCUENTAN EL DÍA?', 800, -1, {tamano: 72}),
  {tipo: 'calendarioH', x: 270, y: 1190, lado: 330, mes: 'NOV', dia: '11', cae: -1, en: -1},
  {tipo: 'nominaH', x: 720, y: 1190, esc: 0.85, interroga: true, interEn: -10.4, en: -1},
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, musica: {pista: 'hidden-agenda.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', P.duracion.toFixed(2));
ESC.forEach((e, i) => { const d = e.fin - e.inicio; console.log(i + 1, e.inicio, d.toFixed(2)); });
