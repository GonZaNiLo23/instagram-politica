// 062 · Alquiler: IPC oct-2026 4,9 %, IRAV 2,57 %, tope 2 % hasta 31-12-2027 (RDL 29/2026), convalidado 12-11 (35-34).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos-fonetico.json'), 'utf8'));
// grafía del guion en subtítulos
T.palabras[25].t = 'IRAV.';
T.palabras[30].t = 'INE:';
fs.writeFileSync(path.join(dir, 'tiempos.json'), JSON.stringify(T));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T.duracion + 2.0);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.2, o = {}) => ({tipo: 'notas', lineas, en, tamano: 40, ...o});
const NB = ' ';
const TINTA = '#14213D', MOST = '#F2B134';
const f = (etiqueta, valor, color, en) => ({etiqueta, valor, color, en});
const IPC = (en) => f(`IPC GENERAL 4,9${NB}%`, 4.9, TINTA, en);
const IRAV = (en) => f(`IRAV 2,57${NB}%`, 2.57, MOST, en);
const H = (filas, y0, alto, o = {}) => ({tipo: "barrasHSerie", vivo: true, filas, max: 5, paso: 1, y0, alto, x0: 110, largo: 760, dur: 0.9, tamano: 64, ...o});

const b2 = S(11), b2b = S(26), b3 = S(40), b3a2 = r(S(55) - 5.7), b3b = r(S(55) - 0.9), b4 = r(S(66) - 1.2), b5 = S(75), b6 = S(84);

// 1 · Gancho
esc(0, b2, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `INFLACIÓN (IPC):${NB}4,9${NB}%`, y: 320, tamano: 110, en: -1, hasta: rel(0, 6) - 0.15},
  {tipo: 'gancho', texto: `¿CUÁNTO PUEDE SUBIR TU${NB}ALQUILER?`, y: 320, tamano: 100, en: rel(0, 6) - 0.05},
  nota(['IPC de octubre · INE, 13-11-2026'], -1),
  {tipo: 'llaveV', letra: 'A', x: 690, y: 900, escala: 3, en: -1, hasta: rel(0, 10), flota: 0.3, rot: -10},
  {tipo: 'cerraduraV', x: 540, y: 900, escala: 3.2, en: rel(0, 10)},
]);
// 2a · Primera prueba: contrato
esc(b2, b2b, {fondo: 'crema'}, [
  rot(`FIRMADO TRAS EL${NB}26-5-2023`, 330, 0.05),
  rot(`TOPE:${NB}IRAV`, 500, rel(b2, 22) - 0.1),
  nota([`IRAV = índice de referencia para actualizar el alquiler`], 0.3),
  {tipo: 'contratoH', x: 540, y: 900, esc: 1.5, check: rel(b2, 22), en: 0.1},
]);
// 2b · IRAV vs IPC
esc(b2b, b3, {fondo: 'crema'}, [
  rot(`IRAV OCTUBRE:${NB}2,57${NB}%`, 330, 0.05),
  rot(`Octubre 2026, variación${NB}anual`, 430, 0.05),
  H([IPC(0.3), IRAV(rel(b2b, 31) - 0.2)], 640, 190),
  nota([`INE, 13-11 · mínimo entre IPC, subyacente y media ajustada`], 0.05),
]);
// 3a · Segundo tope
esc(b3, b3a2, {fondo: 'crema'}, [
  rot(`HASTA 31-12-2027,${NB}TODOS LOS${NB}CONTRATOS`, 330, 0.05),
  H([IPC(-1), IRAV(-1)], 560, 190),
  nota([`contratos de vivienda (LAU), firmados en cualquier fecha`], 0.1),
]);
// 3a2 · Calendario del segundo tope (pausa de voz)
esc(b3a2, b3b, {fondo: 'crema'}, [
  rot(`HASTA 31-12-2027,${NB}TODOS LOS${NB}CONTRATOS`, 330, -1),
  {tipo: 'calendarioX', mes: 'DICIEMBRE 2027', primer: 2, dias: 31, cw: 114, ch: 90, x: 540, y: 600, aro: {d: 31, en: 0.8}, en: -1},
  nota([`RDL 29/2026, disp. final 6.ª · subidas que toquen entre el 8-10-2026 y el 31-12-2027`], -1),
]);
// 3b · Sin pacto
esc(b3b, b4, {fondo: 'crema'}, [
  rot(`SIN NUEVO PACTO:${NB}MÁXIMO 2${NB}%`, 330, 0.05),
  H([IRAV(-1), f(`MÁXIMO 2${NB}%`, 2, TINTA, rel(b3b, 63) - 0.1)], 530, 150),
  nota([`si supera el índice de precios de referencia de su zona: sin subida`], 0.05),
  rot('EJEMPLO', 890, rel(b3b, 60) - 0.1, {color: TINTA}),
  rot(`800${NB}€ → +16${NB}€/mes como máximo`, 965, rel(b3b, 60) - 0.1),
]);
// 4 · Giro
esc(b4, b5, {fondo: 'crema'}, [
  rot(`CONVALIDADO EL${NB}12-11`, 330, 0.05),
  rot(`Votos en la Diputación${NB}Permanente${NB}(69)`, 430, 0.1),
  H([f('A FAVOR 35', 35, TINTA, 0.3), f('EN CONTRA 34', 34, MOST, 0.5)], 600, 150, {max: 40, paso: 10, sufijoEje: ''}),
  {tipo: 'selloTexto', lineas: ['BOE 13-11'], x: 440, y: 990, desde: 40, angulo: -5, tamano: 72, en: 0.9},
  nota([`Diputación Permanente del Congreso · 35 a favor, 34 en contra · BOE 13-11`], 0.1),
]);
// 5 · Pregunta A/B
esc(b5, b6, {fondo: 'crema'}, [
  rot(`¿TOPE FIJO O LIGADO A LA${NB}INFLACIÓN?`, 330, 0.05, {tamano: 72}),
  rot('TOPE FIJO', 570, 0.4, {pastilla: 'tinta', color: '#F4EFE6'}),
  rot(`LIGADO A LA${NB}INFLACIÓN`, 720, 0.65, {pastilla: MOST}),
  {tipo: 'gancho', texto: `4,9${NB}%`, y: 950, tamano: 110, en: 1.0},
]);
// 6 · Cierre
esc(b6, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: `¿TOPE FIJO O LIGADO A LA${NB}INFLACIÓN?`, cta: 'siguenos', tamano: 68, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `INFLACIÓN (IPC):${NB}4,9${NB}%`, y: 340, tamano: 104, en: -1},
  {tipo: 'gancho', texto: '', resalta: `¿TU ALQUILER?`, y: 640, tamano: 104, en: -1},
  {tipo: 'cerraduraV', x: 540, y: 1050, escala: 2.4, en: -1},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
