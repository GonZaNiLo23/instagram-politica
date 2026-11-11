// 040 · Tu Casa: 50.000 € sin intereses que nadie puede pedir (estándar, Economía). Genera escenas.json desde tiempos.json.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T.duracion + 1.5);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const NB = ' ';
const nota = (lineas, en, hasta) => ({tipo: 'notas', lineas, en, ...(hasta ? {hasta} : {})});
const CRED1 = 'Antonio.velez · CC BY-SA 3.0 es · Wikimedia Commons';
const CRED2 = 'FDV · CC BY-SA 3.0 · Wikimedia Commons';

// Índices: 9 Hoy · 13 Se · 21 menor · 23 veinte · 29 cincuenta · 31 euros · 32 Cero · 36 pero · 40 Está · 49 El(Gobierno) · 53 seis · 57 El(Congreso) · 67 ¿Por
// 72 Falta · 79 Según · 88 No(consta) · 93 Con · 105 Lo(vota) · 112 Si · 122 Y · 130 Lo(que sí) · 137 aval · 140 No(te da) · 150 Es · 163 Tu · 168 La · 179 En · 193 Hoy,(el préstamo) · 205 ¿Aceptarías · 219 Síguenos
const b1 = 0, b2 = S(13), b2c = S(32), b2b = S(40), b3a = S(67), b3b = S(93), b3c = S(130), b4 = S(163), b5 = S(193), b5b = S(205), b6 = S(219);

// 1 · Gancho
esc(b1, b2, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `HASTA 50.000${NB}€ SIN${NB}INTERESES`, y: 330, tamano: 110, en: -1},
  rot(`HOY: NADIE PUEDE PEDIRLOS`, 700, 1.0),
  {tipo: 'chequeT', y: 835, esc: 0.8},
  {tipo: 'selloTexto', lineas: ['NO SOLICITABLE'], y: 1095, x: 520, tamano: 50, en: 1.4, angulo: -4, desde: 100},
  nota([`Para primera vivienda habitual con hipoteca · Art. 19 RDL 29/2026`], 0.3),
]);
// 2 · Primera prueba (Tu Casa / el menor)
esc(b2, b2c, {fondo: 'crema'}, [
  rot('TU CASA', 330, 0.05, {tamano: 96, hasta: rel(b2, 21) - 0.05}),
  rot('EL MENOR:', 330, rel(b2, 21), {tamano: 72}),
  rot(`20${NB}% DEL VALOR O 50.000${NB}€`, 420, rel(b2, 23) - 0.1),
  {tipo: 'menorT', y: 700, enA: rel(b2, 23) - 0.1, enB: rel(b2, 29) - 0.1, enMenor: rel(b2, 31) + 0.3},
  nota(['Art. 19.3 RDL 29/2026'], rel(b2, 21)),
]);
// 2 · interés
esc(b2c, b2b, {fondo: 'crema'}, [
  rot(`0${NB}% · SIN COMISIONES · SE DEVUELVE`, 330, 0.05),
  {tipo: 'interesT', y: 640, enCero: 0.1, enSin: rel(b2c, 34), enDevuelve: rel(b2c, 36) - 0.1},
]);
// 2b · Contexto
const b2d = r(b2b + 1.8);
esc(b2b, b2d, {fondo: 'crema'}, [
  rot(`ART. 19 · RDL 29/2026`, 330, 0.05),
  {tipo: 'foto', src: 'f1.jpg', forma: 'rect', x: 500, y: 790, ancho: 880, alto: 460, foco: '50% 30%', zoom: [1.04, 1.16], dur: r(b2d - b2b), en: 0.1, credito: CRED1},
]);
esc(b2d, b3a, {fondo: 'crema'}, [
  rot(`ART. 19 · RDL 29/2026`, 330, 0.05, {hasta: rel(b2d, 49) - 0.05}),
  rot(`6 OCT: APROBADO`, 330, rel(b2d, 49), {hasta: rel(b2d, 57) - 0.05}),
  rot(`2 OCT: CAE EL RDL 26/2026`, 330, rel(b2d, 57)),
  {tipo: 'lineaTiempo', y: 850, hitos: [
    {etiqueta: '2 OCT', detalle: 'DEROGADO', en: rel(b2d, 59)},
    {etiqueta: '6 OCT', detalle: 'BOE 7-10', en: rel(b2d, 53) - 0.1},
  ]},
  nota([`BOE 7-10 (RDL 29/2026) · BOE-A-2026-20526: derogación del 26/2026 el 2-10 · Art. 19.1 del 26/2026 ya creaba «TU CASA»`], 0.1),
]);
// 3a · Por qué no se puede
esc(b3a, b3b, {fondo: 'crema'}, [
  rot(`¿POR QUÉ NO PUEDES PEDIRLO?`, 330, 0.05, {hasta: rel(b3a, 72) + 0.1}),
  rot(`FALTA UN ACUERDO DEL CONSEJO DE MINISTROS`, 330, rel(b3a, 72) + 0.15, {hasta: rel(b3a, 88) - 0.05}),
  rot(`ACUERDO: NO CONSTA`, 330, rel(b3a, 88)),
  {tipo: 'listaT', y: 620, paso: 0, items: [
    {texto: ['Decreto aprobado'], estado: 'ok', en: rel(b3a, 69)},
    {texto: ['Acuerdo del', 'Consejo de', 'Ministros'], estado: 'no', en: rel(b3a, 74), parpadea: true},
    {texto: ['ICO abre solicitud'], estado: 'no', en: rel(b3a, 88)},
  ]},
  nota(['Art. 19.5: objeto, beneficiarios, límites, características e importe inicial'], rel(b3a, 79), rel(b3a, 88) - 1.05),
  nota(['Revisado el 11-11-2026 en BOE, Congreso y prensa'], rel(b3a, 88) - 1.0),
]);
// 3b · Qué falta
esc(b3b, b3c, {fondo: 'crema'}, [
  rot(`LAS CORTES, DISUELTAS: DECIDE LA DIPUTACIÓN PERMANENTE`, 330, 0.05, {hasta: rel(b3b, 105) - 0.05}),
  rot(`VOTACIÓN: JUEVES 12 NOV`, 330, rel(b3b, 105), {hasta: rel(b3b, 112) - 0.05}),
  rot(`SI NO SE CONVALIDA: CAE`, 330, rel(b3b, 112), {hasta: rel(b3b, 122) - 0.05}),
  rot(`SI SE CONVALIDA: FALTA EL ACUERDO`, 330, rel(b3b, 122)),
  {tipo: 'diputT', y: 590, enApaga: 0.8, enFlechas: rel(b3b, 112), enSi: rel(b3b, 122)},
  nota(['CE, arts. 78 y 86.2'], 0.2, rel(b3b, 105) - 0.05),
  nota(['Orden del día, Diputación Permanente, sesión n.º 10 · Congreso'], rel(b3b, 105)),
]);
// 3c · Lo que sí existe
esc(b3c, b4, {fondo: 'crema'}, [
  rot(`HOY SÍ: AVAL ICO`, 330, 0.05, {hasta: rel(b3c, 140) - 0.05}),
  rot(`NO ES DINERO: GARANTÍA PARCIAL DE LA HIPOTECA`, 330, rel(b3c, 140), {hasta: rel(b3c, 150) - 0.05}),
  rot(`≤${NB}35 AÑOS O FAMILIAS CON MENORES`, 330, rel(b3c, 150)),
  {tipo: 'tarjetasT', y: 700, enA: 0.2, enB: rel(b3c, 136), enLuz: rel(b3c, 137) - 0.1},
  nota(['«El plazo para formalizar… finalizará el 31 de diciembre de 2027» · ICO'], 0.2, 4.6),
  nota([`Cubre hasta el 20${NB}% del préstamo, o el 25${NB}% con certificado energético D o mejor`], 4.6),
]);
// 4 · Giro
const b4d = S(168);
esc(b4, b4d, {fondo: 'crema'}, [
  rot(`TU CASA TIENE UNA CONDICIÓN`, 330, 0.05),
  {tipo: 'foto', src: 'f2.jpg', forma: 'rect', x: 500, y: 790, ancho: 880, alto: 440, foco: '50% 30%', zoom: [1.02, 1.12], dur: r(b4d - b4), en: 0.1, credito: CRED2},
]);
esc(b4d, b5, {fondo: 'crema'}, [
  rot(`PRECIO MÁXIMO DE VENTA, PERMANENTE`, 330, 0.05, {hasta: rel(b4d, 179) - 0.05}),
  rot(`VENTAS POSTERIORES:`, 330, rel(b4d, 179)),
  rot(`PRECIO DE COMPRA + IPC, COMO MÁXIMO`, 420, rel(b4d, 183) - 0.1),
  {tipo: 'topeT', y: 680, enCandado: rel(b4d, 170), enTope: rel(b4d, 179) + 0.2},
  nota(['Art. 19.13 «quedarán sujetas permanentemente a un precio máximo de transmisión»'], 0.1, rel(b4d, 179) - 0.05),
  nota(['Se inscribe en el Registro de la Propiedad · puede sumarse el valor de ciertas rehabilitaciones'], rel(b4d, 179)),
]);
// 5 · Cierre previo
esc(b5, b5b, {fondo: 'crema'}, [
  rot(`EN EL BOE, NO EN TU BANCO`, 330, 0.05),
  {tipo: 'chequeT', y: 780, zoom: false, esc: 0.8},
  {tipo: 'selloTexto', lineas: ['NO SOLICITABLE'], y: 1075, x: 540, tamano: 46, en: rel(b5, 203) - 0.2, angulo: -4, desde: 60},
]);
// 5 · Pregunta A/B
esc(b5b, b6, {fondo: 'crema'}, [
  rot(`¿PRECIO MÁXIMO A CAMBIO DE 50.000${NB}€?`, 330, 0.05),
  {tipo: 'botonesT', y: 760, en: 0.5},
]);
// 6 · Cierre
esc(b6, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: `¿PRECIO MÁXIMO A CAMBIO DE 50.000${NB}€?`, tamano: 72, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `HASTA 50.000${NB}€ SIN${NB}INTERESES`, y: 330, tamano: 110, en: -1},
  rot(`HOY: NADIE PUEDE PEDIRLOS`, 620, -1),
  {tipo: 'foto', src: 'f2.jpg', forma: 'rect', x: 500, y: 1000, ancho: 880, alto: 440, foco: '50% 30%', zoom: [1.02, 1.02], dur: 0.01, en: -1, credito: CRED2},
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 90, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
