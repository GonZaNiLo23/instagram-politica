// Genera escenas.json a partir de tiempos.json (marcas reales de palabra). Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const DUR = r(T.duracion + 2.0);
const rel = (a, abs) => r(abs - a);

// Límites de escena: justo antes de la primera palabra de cada bloque
const B = {
  A: r(t(10) - 0.1), // "La Constitución solo dice"
  Bq: r(t(18) - 0.1), // "El trescientos cincuenta"
  C: r(t(34) - 0.1), // "Dos escaños por provincia"
  D: r(t(44) - 0.1), // "Soria elige"
  E: r(t(64) - 0.1), // "¿Subir a cuatrocientos?"
  F: r(t(74) - 0.1), // "¿Lo harías?"
};
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, y, en = 0, o = {}) => ({tipo: 'notas', lineas, y, en, ...o});
const FUENTE_B2 = 'Fuente: CE art. 68 · Ley 1/1977 · LOREG art. 162';
const CRED_F1 = 'Foto: Pool Moncloa/Fernando Calvo · Ministerio de la Presidencia. Gobierno de España · 2018-12-06 · Wikimedia Commons';

// 1 · Gancho: hemiciclo 350 -> 400, libro con candado
{
  const a = 0, b = B.A;
  esc(a, b, {}, [
    {tipo: 'gancho', texto: '¿400 DIPUTADOS?', y: 345, tamano: 100, en: 0},
    {tipo: 'hemicicloBorde', base: 1010, estatico: true, anillo: {en: 1.0, dur: 0.9}, contador: {desde: 350, hasta: 400, en: 1.0, dur: 1.4}, pulso: {en: 3.0}},
    {tipo: 'icono', nombre: 'candado', simbolo: 'libro', x: 125, y: 1088, tamano: 100, en: 2.6, animEn: 2.9, dur: 0.6},
    rot('Constitución', 1052, 2.7, {izq: 195, ancho: 700}),
  ]);
}
// 2a · Constitución: mínimo 300, máximo 400 (F1 + regla)
{
  const a = B.A, b = B.Bq;
  esc(a, b, {}, [
    rot('Constitución: mínimo 300, máximo 400', 330, 0.05),
    {tipo: 'foto', src: 'F1.jpg', forma: 'rect', x: 540, y: 700, ancho: 780, alto: 380, foco: '50% 55%', zoom: [1.04, 1.32], dur: rel(a, b), en: 0.15},
    {tipo: 'reglaRango', y: 930, en: 0.5, pasos: [[1.4, 0.5], [rel(a, t(14)) + 0.2, 0], [rel(a, t(17)) - 0.5, 1], [rel(a, b) - 0.3, 0.5]]},
    nota([CRED_F1], 1318, 0.15),
    nota(['Fuente: CE art. 68'], 1450, 0.15),
  ]);
}
// 2b · Línea de tiempo 1977 / 1978 / 1985 (F2 sobre 1977)
{
  const a = B.Bq, b = B.C;
  esc(a, b, {}, [
    {tipo: 'lineaTiempo', y: 760, hitos: [
      {etiqueta: '1977: 350', en: rel(a, t(19)) - 0.1},
      {etiqueta: '1978: 300–400', en: rel(a, t(28)) - 0.1},
      {etiqueta: '1985: 350', en: rel(a, t(32)) - 0.1},
    ]},
    {tipo: 'foto', src: 'F2.png', forma: 'rect', x: 270, y: 520, ancho: 420, alto: 300, foco: '50% 50%', zoom: [1.0, 1.25], dur: 3.1, en: rel(a, t(23)) - 0.15, hasta: rel(a, t(23)) + 3.1},
    nota(['Sobre electoral de 1977 · dominio público'], 1406, rel(a, t(23)) - 0.15, {hasta: rel(a, t(23)) + 3.1}),
    // Rótulos de hito del guion (64 px, literales), uno detrás de otro en la misma columna derecha
    nota(['1977 ·', 'Ley para la', 'Reforma', 'Política'], 392, rel(a, t(19)) - 0.1, {izq: 510, ancho: 450, tamano: 64, hasta: rel(a, t(28)) - 0.1}),
    nota(['1978 ·', 'Constitución'], 392, rel(a, t(28)) - 0.1, {izq: 510, ancho: 450, tamano: 64, hasta: rel(a, t(32)) - 0.1}),
    nota(['1985 ·', 'LOREG:', 'se mantiene'], 392, rel(a, t(32)) - 0.1, {izq: 510, ancho: 450, tamano: 64}),
    {tipo: 'flechaCircular', x: 860, y: 480, tamano: 110, en: rel(a, t(32)) - 0.05},
    nota([FUENTE_B2], 1450, 0.1),
  ]);
}
// 2c · Reparto: 2 por provincia + 248 por población
{
  const a = B.C, b = B.D;
  esc(a, b, {}, [
    rot('2 por provincia + 248 por población', 330, 0.05),
    {tipo: 'reparto', y: 520, dosEn: 0.2, dosDur: 1.3, ceutaEn: 1.3, lluviaEn: rel(a, t(40)) - 0.1, lluviaDur: 1.5},
    rot('Ceuta y Melilla: 1 cada una', 805, 1.3),
    nota([FUENTE_B2], 1450, 0.1),
  ]);
}
// 3 · Giro: habitantes por diputado (F3 Soria, F4 Madrid)
{
  const a = B.D, b = B.E;
  const cambio = rel(a, t(55)) - 0.15;
  const SORIA = 45117, MADRID = 187817;
  esc(a, b, {}, [
    rot('HABITANTES POR DIPUTADO', 330, 0.05),
    {tipo: 'barrasHab', max: MADRID, x0: 330, ancho: 600, filas: [
      {etiqueta: 'SORIA ≈ 45.000', valor: SORIA, y: 630, yEt: 530, en: 0.2, enBarra: 0.6, durBarra: rel(a, t(53)) + 0.3 - 0.6, color: '#2A9D8F'},
      {etiqueta: 'MADRID ≈ 188.000', valor: MADRID, y: 970, yEt: 870, en: cambio + 0.15, enBarra: rel(a, t(59)) - 0.1, color: '#8D99AE'},
    ]},
    {tipo: 'foto', src: 'F3.jpg', forma: 'circulo', x: 180, y: 640, alto: 240, foco: '50% 40%', zoom: [1.05, 1.4], dur: cambio, en: 0.1, hasta: cambio},
    {tipo: 'foto', src: 'F4.jpg', forma: 'circulo', x: 180, y: 980, alto: 240, foco: '50% 40%', zoom: [1.05, 1.4], dur: rel(cambio, rel(a, b)), en: cambio + 0.05},
    nota(['Foto: Misburg3014 · CC BY 3.0 · Wikimedia Commons'], 1362, 0.1, {hasta: cambio}),
    nota(['Foto: Diego Delso · CC BY-SA 4.0 · Wikimedia Commons'], 1362, cambio + 0.05),
    nota(['Fuente: INE, padrón 2025 · escaños 29-N (BOE)'], 1450, 0.1),
    {tipo: 'sello', valor: 'DATO', en: rel(a, t(62)) - 0.55, y: 650, x: 700, tamano: 100, angulo: 4, seco: true},
  ]);
}
// 4 · Bucle con el gancho: ley orgánica, mayoría absoluta
{
  const a = B.E, b = B.F;
  const m = rel(a, t(71)) - 0.15;
  esc(a, b, {}, [
    {tipo: 'hemicicloBorde', base: 1010, estatico: true, anillo: {en: 0, dur: 0.01, estatico: true}, centro: '400', pulso: {en: 0.2, hasta: m}, mayoria: {en: m, cuenta: 176, dur: 0.8}},
    rot('Basta una ley orgánica', 330, rel(a, t(67)) - 0.15, {hasta: m}),
    rot('Mayoría absoluta del Congreso', 330, m + 0.1),
    {tipo: 'icono', nombre: 'papeleta', x: 235, y: 1088, tamano: 100, en: m + 0.25, animEn: m + 0.3, dur: 0.6},
    rot('176 de 350', 1052, m + 0.25, {izq: 60, ancho: 900, align: 'center'}),
  ]);
}
// 5 · Cierre
{
  const a = B.F;
  esc(a, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
    {tipo: 'cierre', frase: '¿Subirías, bajarías o lo dejarías?', tamano: 88},
  ]);
}

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'gancho', texto: '¿POR QUÉ 350 DIPUTADOS?', y: 330, tamano: 118, en: 0},
  {tipo: 'hemicicloBorde', base: 1330, ancho: 880, estatico: true, centroDisco: true, centro: '350', centroColor: '#F2B134'},
]}]};

const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'fin de voz', T.duracion.toFixed(2));
ESC.forEach((e, i) => console.log(i + 1, e.inicio, e.fin, (e.fin - e.inicio).toFixed(2)));
