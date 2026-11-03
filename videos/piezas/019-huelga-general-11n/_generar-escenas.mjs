// Genera tiempos.json (grafía del guion) y escenas.json de la 019. Uso: node _generar-escenas.mjs
// Lee tiempos-fonetico.json (índices originales de la voz: "ce ce o o" = 20-23, etc.).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const P = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos-fonetico.json'), 'utf8'));
// tiempos.json con la grafía del guion: siglas fusionadas
const FUS = {41: [44, 'CCOO,'], 45: [47, 'UGT'], 65: [68, 'CCOO'], 70: [72, 'UGT'], 160: [162, 'CEOE'], 189: [191, 'CEOE'], 207: [209, 'CEOE']};
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
const FUENTE = 'BOE, RDL 17/1977 · ET';
const NB = '‑';


// 1 · Gancho (0 - 4,9): nómina en zoom desde el fotograma 0, la cifra cae en "no cobras"; sanción tachada y escudo en "no te pueden sancionar"
esc(0, S(14) - 0.15, {}, () => [
  {tipo: 'gancho', texto: 'SI HACES HUELGA: ESE DÍA NO COBRAS', y: 330, tamano: 112, en: -1, hasta: at(t(7) - 0.1)},
  rot('PERO SIN SANCIÓN', 335, at(t(7) - 0.05)),
  nota(['RDL 17/1977, arts. 6.1 y 6.2'], at(t(7))),
  {tipo: 'nominaH', x: 300, y: 990, esc: 0.85, zoom: 1.45, zoomDur: 1.3, cifra: '−1 día', cifraS: 60, caida: 70, cifraEn: at(t(5) - 0.15), en: -1},
  {tipo: 'sancionH', x: 700, y: 760, tacha: at(t(11) - 0.1), en: at(t(8) - 0.15)},
  {tipo: 'escudoH', x: 700, y: 990, esc: 0.95, entra: at(t(11) + 0.1), en: at(t(8) - 0.15)},
]);
// 2a · Primera prueba (4,9 - 9,3)
esc(S(14) - 0.15, S(27) + 0.12, {}, () => [
  ...seq([
    ['TU CONTRATO NO SE ACABA', t(14), t(19) - 0.1, ['RDL 17/1977, art. 6.1']],
    ['SIGUES DE ALTA EN LA SEGURIDAD SOCIAL', t(19) - 0.15, undefined, ['Alta especial, sin cotizar ese día · art. 6.3']],
  ], 335),
  {tipo: 'contratoH', x: 540, y: 880, check: at(t(17)), en: at(t(14) - 0.1), hasta: at(t(19) - 0.2)},
  {tipo: 'casillaSSH', y: 880, check: at(t(22)), en: at(t(19) - 0.15)},
]);
// 2b · Contexto
esc(S(27) + 0.12, S(35), {}, () => [
  rot('HUELGA GENERAL: 11 DE NOVIEMBRE', 335, 0.05),
  nota(['Preaviso CGT'], 0.1),
  {tipo: 'calendarioH', x: 540, y: 900, lado: 360, mes: 'NOV', dia: '11', cae: at(t(32) - 0.2), en: 0.05},
]);
esc(S(35), S(51), {}, () => [
  rot('REGISTRADA EL 19 DE OCTUBRE', 335, 0.05),
  nota(['Ministerio de Trabajo · EFE, 19-10-2026'], 0.1),
  {tipo: 'calendarioH', x: 240, y: 770, lado: 290, mes: 'OCT', dia: '19', cae: -1, marca: at(t(38)), en: 0.1},
  {tipo: 'sobreCarpetaH', x: 630, y: 770, sobreEn: at(t(36)), selloEn: at(t(40)), en: 0.15},
  {tipo: 'pastillaH', texto: 'CCOO', x: 60, y: 970, ancho: 250, caps: true, en: at(t(41) - 0.1)},
  {tipo: 'pastillaH', texto: 'UGT', x: 340, y: 960, ancho: 250, caps: true, en: at(t(45) - 0.1)},
  {tipo: 'pastillaH', texto: 'otras organizaciones', x: 60, y: 1060, en: at(t(49) - 0.1)},
]);
esc(S(51), S(58), {}, () => [
  rot('PIDEN: VIVIENDA Y SUELDOS', 335, 0.05),
  {tipo: 'llaveBilleteH', y: 780, llaveEn: at(t(52) - 0.1), billeteEn: at(t(55) - 0.1), en: 0.05},
]);
esc(S(58), S(77), {}, () => [
  rot('1.ª CONJUNTA DE CCOO Y UGT DESDE 2012', 335, 0.05),
  nota(['Al Jazeera y El País, 07-10 · la anterior, 14-11-2012'], 0.1),
  {tipo: 'fechasH', y: 780, hitos: [{x: 240, etiq: '2012', en: at(t(74) - 0.1)}, {x: 720, etiq: '2026', en: at(t(76) + 0.2)}], unir: at(t(76) + 0.2), en: 0.1},
]);
esc(S(77), S(84), {}, () => [
  rot('¿PUEDE PARARLA LA PATRONAL?', 335, 0.05),
  {tipo: 'mazoH', x: 200, y: 830, interroga: at(t(80) - 0.1), en: 0.1},
]);
// 3a · Si la secundas
esc(S(84), S(112), {}, () => [
  rot('SI LA SECUNDAS', 335, 0.05, {pastilla: true}),
  ...seq([
    ['SIN SANCIÓN', t(87), t(102) - 0.5, ['Salvo falta durante la huelga · RDL art. 6.1', FUENTE]],
    ['ESE DÍA, SIN SUELDO', t(102) - 0.5, undefined, ['Contrato suspendido · ET 45.1.l · RDL art. 6.2', FUENTE]],
  ], 430),
  {tipo: 'contratoH', x: 540, y: 870, escudo: at(t(90)), mueve: at(t(93) - 0.5), x2: 250, en: at(t(87) - 0.1), hasta: at(t(102) - 0.6)},
  {tipo: 'sancionH', x: 690, y: 780, tacha: at(t(94)), chispa: at(t(98)), en: at(t(93) - 0.2), hasta: at(t(102) - 0.6)},
  {tipo: 'nominaH', x: 540, y: 820, esc: 1.1, cifra: '0 €', cifraEn: at(t(105) - 0.1), dia: 'ese día', en: at(t(102) - 0.55)},
]);
// 3b · Si prefieres trabajar
esc(S(112), S(135), {fondo: 'mostaza'}, () => [
  ...seq([
    ['¿Y SI PREFIERES TRABAJAR?', t(112), t(116)],
    ['LIBERTAD DE TRABAJO', t(116), t(123), ['RDL art. 6.4']],
    ['SIN SUSTITUIR A HUELGUISTAS', t(123), undefined, ['Personal ajeno a la empresa · art. 6.5']],
  ], 335),
  {tipo: 'puertaH', x: 540, y: 900, check: at(t(118)), en: 0.1, hasta: at(t(123) - 0.1)},
  {tipo: 'sillasH', y: 900, flecha: at(t(127)), bloqueo: at(t(131) + 0.1), en: at(t(123) - 0.05)},
]);
// 3c · Servicios mínimos
esc(S(135), S(155), {}, () => [
  ...seq([
    ['EL LÍMITE: SERVICIOS MÍNIMOS', t(135), t(140)],
    ['LOS PUEDE FIJAR LA ADMINISTRACIÓN', t(140), t(148), ['RDL art. 10 · STC 11/1981, FJ 18']],
    ['SE PUEDEN RECURRIR', t(148), undefined, ['Ante los tribunales']],
  ], 335),
  {tipo: 'balanzaH', y: 700, izqEn: 0.3, derEn: at(t(139)), en: 0.1, hasta: at(t(148) - 0.1)},
  {tipo: 'resolucionH', y: 840, selloEn: at(t(148) + 0.3), golpes: [at(t(151)), at(t(153) + 0.2)], en: at(t(148) - 0.05)},
]);
// 4 · Giro
esc(S(155), S(170), {}, () => [
  rot('LOS SINDICATOS DICEN: NO HAY ACUERDO SALARIAL', 335, 0.05),
  nota(['EFE, 22-10-2026'], 0.1),
  {tipo: 'pastillaH', texto: 'CEOE', x: 60, y: 650, ancho: 250, caps: true, en: at(t(160) - 0.1)},
  {tipo: 'pastillaH', texto: 'Sindicatos', x: 500, y: 650, ancho: 410, en: at(t(156) - 0.1)},
  {tipo: 'acuerdoH', x: 540, y: 890, en: at(t(164) - 0.1)},
]);
esc(S(170), S(184), {}, () => [
  rot('LA LEY: ILEGAL SI ES POLÍTICA', 335, 0.05),
  nota(['RDL 17/1977, art. 11.a: motivos políticos o ajenos al interés profesional'], 0.1),
  {tipo: 'claveH', lineas: [
    {t: 'motivos políticos', y: 770, en: at(t(177) - 0.1), w: 600},
    {t: 'ajenos al interés', y: 890, en: at(t(180) - 0.1), w: 600},
    {t: 'profesional', y: 975, en: at(t(182) - 0.1), w: 385},
  ], en: 0.1},
]);
esc(S(184), S(218), {}, () => [
  ...seq([
    [`CEOE 19${NB}10: ES ELECTORAL`, t(184), t(201), ['Paráfrasis, según EFE']],
    [`22${NB}10: NO LA RECURRIRÁ ANTES DEL 11${NB}N`, t(201), undefined, ['Fuentes de la CEOE a EFE y a elDiario.es']],
  ], 335),
  {tipo: 'lineaCeoeH', y: 860, tarjeta: at(t(189) - 0.1), hito2: at(t(207) - 0.1), renuncia: at(t(214)), en: 0.1},
]);
esc(S(218), S(227), {}, () => [
  rot('SEGUIRÁ LA JORNADA', 335, 0.05),
  {tipo: 'calendarioH', x: 380, y: 840, lado: 360, mes: 'NOV', dia: '11', cae: -1, en: 0.1},
  {tipo: 'lupaH', x: 690, y: 840, etiqueta: 'seguimiento', etiquetaY: 1085, en: at(t(220) - 0.1)},
]);
// 5 · Qué viene ahora
esc(S(227), S(253), {}, () => [
  ...seq([
    ['¿QUÉ VIENE AHORA?', t(227), t(230)],
    [`11${NB}N: HUELGA Y MANIFESTACIONES`, t(230), t(243), ['Según Sordo (CCOO) y Álvarez (UGT) · EFE, 22-10']],
    [`13${NB}N: ARRANCA LA CAMPAÑA`, t(243), undefined, ['RD 806/2026 · elecciones: 29-11']],
  ], 335),
  {tipo: 'novH', y: 860, hito11: at(t(231)), campana: at(t(243) + 0.7), urna: at(t(252)), en: 0.1},
]);
// 6 · Cierre
esc(S(253), S(264), {}, () => [
  rot('SI LA SECUNDAS: SIN SUELDO, CON CONTRATO', 335, 0.05),
  {tipo: 'calendarioH', x: 190, y: 870, lado: 260, mes: 'NOV', dia: '11', cae: 0.15, en: 0.1},
  {tipo: 'nominaH', x: 470, y: 870, esc: 0.8, cifra: '0 €', cifraEn: at(t(256) - 0.1), dia: 'ese día', en: 0.15},
  {tipo: 'contratoH', x: 790, y: 870, esc: 0.8, check: at(t(261)), en: 0.2},
]);
esc(S(264), DUR, {fondo: 'mostaza', sinSubtitulos: true}, () => [
  {tipo: 'cierre', frase: '¿LA SECUNDARÍAS?', tamano: 88, pulso: true, guardaEn: Math.max(1.0, at(t(271)) - 0.15)},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'gancho', texto: 'HUELGA 11‑N: NO COBRAS, SIN SANCIÓN', y: 340, tamano: 104, en: -1},
  {tipo: 'nominaH', x: 300, y: 1090, esc: 1.05, cifra: '−1 día', cifraS: 60, cifraEn: -1, en: -1},
  {tipo: 'escudoH', x: 740, y: 1090, esc: 1, entra: -1, en: -1},
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, musica: {pista: 'hidden-agenda.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', P.duracion.toFixed(2));
ESC.forEach((e, i) => { const d = e.fin - e.inicio; console.log(i + 1, e.inicio, d.toFixed(2)); });
