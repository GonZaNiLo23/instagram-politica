// Genera escenas.json de la 010 a partir de tiempos.json (marcas reales de palabra de la voz).
// Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const RAW = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => RAW.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const DUR = r(RAW.duracion + 3.0);
const rel = (a, abs) => r(abs - a);
const B = {
  S1a: 0, S1b: r(t(4) - 0.1), S2a: r(t(11) - 0.1), S2b: r(t(17) - 0.1), S3a: r(t(26) - 0.1), S3b: r(t(36) - 0.1),
  S4a: r(t(43) - 0.1), S4b: r(t(52) - 0.1), S5a: r(t(60) - 0.1), S5b: r(t(68) - 0.1), S5c: r(t(77) - 0.1),
};
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0, o = {}) => ({tipo: 'notas', lineas, en, ...o});

const CR = {
  U1: 'Foto: Antonio Augusto/Secom/TSE · Dominio público · Wikimedia Commons',
  U2: 'Foto: Alexandresena · CC BY-SA 4.0 · Wikimedia Commons',
  U3: 'Foto: LauraHale (Madrid, 2019) · CC BY-SA 3.0 · Wikimedia Commons',
};

// 1a · Gancho
esc(B.S1a, B.S1b, {}, [
  {tipo: 'gancho', texto: '¿NO VOTAS? SIN PASAPORTE NUEVO', y: 330, tamano: 100, en: 0},
  {tipo: 'pasaporte', x: 540, y: 900, tamano: 440, en: -1, sello: 0.2, selloDur: 0.6},
]);
// 1b · Foto de la urna
{
  const a = B.S1b, b = B.S2a;
  esc(a, b, {}, [
    rot('EN BRASIL, ES LA LEY', 330, 0.05),
    {tipo: 'foto', src: 'U1.jpg', x: 500, y: 760, ancho: 880, alto: 480, foco: '58% 62%', zoom: [1.02, 1.32], dur: rel(a, b), en: 0.1, revela: 0.45, credito: CR.U1},
    {tipo: 'pasaporte', x: 150, y: 1065, tamano: 130, en: 0.5, sello: -1},
  ]);
}
// 2a · Domingo 25 OCT, segunda vuelta
{
  const a = B.S2a, b = B.S2b;
  esc(a, b, {}, [
    {tipo: 'mapaBrasil', x: 540, y: 800, tamano: 560, en: 0.05},
    rot('DOMINGO 25 OCT · SEGUNDA VUELTA', 330, 0.05),
    {tipo: 'icono', nombre: 'calendario', x: 340, y: 780, tamano: 300, mes: 'OCT', dia: '25', en: 0.3},
    {tipo: 'icono', nombre: 'urnaSin', x: 740, y: 800, tamano: 250, en: 0.5},
    rot('BRASIL', 1045, rel(a, t(13)) - 0.1, {align: 'center'}),
    nota(['Fuente: calendario electoral del TSE'], 0.1),
  ]);
}
// 2b · Obligatorio de 18 a 70
{
  const a = B.S2b, b = B.S3a;
  esc(a, b, {}, [
    rot('OBLIGATORIO: DE 18 A 70', 330, 0.05),
    rot('VOLUNTARIO: 16-17, +70, ANALFABETOS', 415, rel(a, t(22)) - 0.2, {tamano: 52}),
    {tipo: 'barraEdades', x0: 90, y: 650, dib: 0.5, dur: 2.4, en: 0.2},
    {tipo: 'icono', nombre: 'libro', x: 150, y: 960, tamano: 150, en: rel(a, t(24)) - 0.1},
    rot('analfabetos: voluntario', 930, rel(a, t(24)) - 0.1, {tamano: 52, izq: 250, ancho: 700}),
    nota(['Fuente: Constitución de Brasil, art. 14'], 0.1),
  ]);
}
// 3a · Multa
{
  const a = B.S3a, b = B.S3b;
  const cuenta = rel(a, t(30)) - 0.1;
  esc(a, b, {}, [
    rot('MULTA: HASTA 3,5 REALES', 330, 0.1),
    {tipo: 'foto', src: 'U2.jpg', x: 500, y: 740, ancho: 880, alto: 360, foco: '60% 50%', zoom: [1.12, 1.24], pan: [-50, 0], dur: rel(a, b), en: 0.1, notas: ['Fuente: Agência Senado (31-08-2026)'], credito: CR.U2},
    {tipo: 'cuentaReales', hasta: 3.51, x: 500, y: 990, ancho: 880, en: cuenta - 0.3, empieza: 0.3, dur: 1.3},
    nota(['Hasta R$ 3,51 por vuelta'], cuenta + 0.8, {y: 1062}),
  ]);
}
// 3b · Lista de iconos con aspa
{
  const a = B.S3b, b = B.S4a;
  const e2 = rel(a, t(40)) - 0.2, e3 = rel(a, t(42)) - 0.3;
  const fila = (y, en, nombre, texto, dy = 36) => [
    rot(texto, y - dy, en + 0.05, {izq: 230, ancho: 640}),
    {tipo: 'icono', nombre: 'aspa', x: 905, y, tamano: 96, en: en + 0.35, dur: 0.35},
  ];
  esc(a, b, {}, [
    rot('NI PASAPORTE NUEVO NI OPOSICIONES', 330, 0.05),
    {tipo: 'pasaporte', x: 130, y: 640, tamano: 150, en: 0.15, sello: -1},
    ...fila(640, 0.15, null, 'PASAPORTE'),
    {tipo: 'dib', nombre: 'dni', x: 130, y: 830, tamano: 170, en: e2, sinTexto: true},
    ...fila(830, e2, null, 'CARNÉ DE IDENTIDAD', 74),
    {tipo: 'icono', nombre: 'carpeta', x: 130, y: 1000, tamano: 170, en: e3},
    ...fila(1000, e3, null, 'OPOSICIONES'),
    nota(['Fuente: Código Electoral de Brasil, art. 7'], 0.1),
  ]);
}
// 4a · Tres elecciones, baja
{
  const a = B.S4a, b = B.S4b;
  const U = [200, 500, 800];
  const tA = [t(43), t(45), t(46)].map((x) => rel(a, x) + 0.1);
  esc(a, b, {}, [
    rot('3 ELECCIONES SEGUIDAS = BAJA', 330, 0.05),
    rot('Se cancela la inscripción electoral', 490, 0.9, {tamano: 52}),
    ...U.map((x, i) => ({tipo: 'icono', nombre: 'urnaSin', x, y: 720, tamano: 190, en: 0.1 + i * 0.1})),
    ...U.map((x, i) => ({tipo: 'icono', nombre: 'aspa', x: x + 75, y: 650, tamano: 80, en: tA[i], dur: 0.35})),
    {tipo: 'tituloElector', x: 380, y: 980, ancho: 600, en: rel(a, t(46)) + 0.1, parte: rel(a, t(51)) - 0.1},
    {tipo: 'sello', valor: 'DATO', x: 800, y: 1085, tamano: 62, angulo: 4, seco: true, en: rel(a, t(51)) + 0.45},
    nota(['Fuente: Código Electoral de Brasil, art. 7 § 3'], 0.1),
  ]);
}
// 4b · Cada vuelta cuenta (EJEMPLO)
{
  const a = B.S4b, b = B.S5a;
  const U = [200, 500, 800];
  const l1 = rel(a, t(54)) - 0.2, l2 = rel(a, t(55)) + 0.1;
  esc(a, b, {}, [
    rot('CADA VUELTA = UNA ELECCIÓN', 330, 0.05),
    rot('EJEMPLO', 545, 0, {pastilla: 'tinta', ancho: 320}),
    ...U.map((x, i) => ({tipo: 'icono', nombre: 'urnaSin', x, y: 790, tamano: 190, en: 0.1 + i * 0.1})),
    {tipo: 'icono', nombre: 'aspa', x: 275, y: 720, tamano: 80, en: l1 + 0.1, dur: 0.35},
    {tipo: 'icono', nombre: 'aspa', x: 575, y: 720, tamano: 80, en: l2 + 0.1, dur: 0.35},
    rot('1.ª VUELTA', 890, l1, {tamano: 48, izq: 60, ancho: 280, align: 'center'}),
    rot('2.ª VUELTA', 890, l2, {tamano: 48, izq: 360, ancho: 280, align: 'center'}),
    {tipo: 'cifraGrande', texto: '2 DE 3', x: 540, y: 1045, tamano: 120, en: rel(a, t(58)) - 0.2},
    nota(['Fuente: Agência Senado (31-08-2026)'], 0.1),
  ]);
}
// 5a · ¿Y en España? Urna del Senado (mitad derecha)
{
  const a = B.S5a, b = B.S5b;
  const h = rel(a, t(63)) - 0.1;
  esc(a, b, {}, [
    {tipo: 'mapaBrasil', x: 540, y: 800, tamano: 560, en: -1, sale: 0.05},
    rot('¿Y EN ESPAÑA?', 330, 0.05, {hasta: h}),
    rot('VOTAR: UN DERECHO, NO OBLIGACIÓN', 330, h + 0.05),
    {tipo: 'foto', src: 'U3c.jpg', x: 500, y: 810, ancho: 880, alto: 560, foco: '50% 50%', zoom: [1.02, 1.16], dur: rel(a, b), en: 0.45, revela: 0.5, notas: ['Fuente: LOREG, art. 5 (BOE)'], credito: CR.U3},
  ]);
}
// 5b · Mesa electoral obligatoria
{
  const a = B.S5b, b = B.S5c;
  esc(a, b, {}, [
    rot('LA MESA, SI TE TOCA: OBLIGATORIA', 330, 0.05),
    {tipo: 'foto', src: 'U4c.jpg', x: 350, y: 825, ancho: 560, alto: 620, foco: '45% 30%', zoom: [1.0, 1.22], dur: rel(a, b), en: 0.2, notas: ['Fuente: LOREG, art. 27.1 (BOE)'], credito: CR.U3},
    {tipo: 'candadoMostaza', x: 790, y: 810, tamano: 260, en: rel(a, t(74)) - 0.2},
  ]);
}
// 5c · Cierre con bucle del pasaporte
{
  const a = B.S5c;
  esc(a, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
    {tipo: 'cierre', frase: '¿Y SI FUERA CON TU PASAPORTE?', tamano: 88, yGuardalo: 1200, yFuentes: 1310, pulso: true},
    {tipo: 'pasaporte', x: 540, y: 940, tamano: 300, en: 0.3, interroga: 0.8, sello: 2.3, selloDur: 0.5, latido: true},
  ]);
}

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'gancho', texto: 'EN BRASIL, NO VOTAR = SIN PASAPORTE', y: 320, tamano: 92, en: -1},
  {tipo: 'foto', src: 'U1.jpg', x: 400, y: 1010, ancho: 660, alto: 440, foco: '50% 60%', zoom: [1.0, 1.0], dur: 3, en: -1},
  {tipo: 'candadoMostaza', x: 830, y: 1010, tamano: 240, en: -1},
]}]};

const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'fin de voz', RAW.duracion.toFixed(2));
ESC.forEach((e, i) => console.log(i + 1, e.inicio, e.fin, (e.fin - e.inicio).toFixed(2)));
