// Genera escenas.json a partir de tiempos-original.json (marcas reales de palabra de la voz). Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos-original.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const DUR = r(78.5);

// Límites de escena (s): justo antes de la primera palabra de cada bloque
const B = {
  s2: r(t(20) - 0.1), s3: r(t(49) - 0.06), s4: r(t(114) - 0.1), s4b: r(t(145) - 0.1), s4c: r(t(155) - 0.1),
  s5: r(t(166) - 0.1), s5b: r(t(182) - 0.1), s5c: r(t(193) - 0.1),
};
const ESC = [];
const rel = (a, abs) => r(abs - a);
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 72, ...o});
const nota = (lineas, en = 0, hasta) => ({tipo: 'notas', lineas, en, ...(hasta ? {hasta} : {})});
const CALC = 'Cálculo propio · partidos inventados';

// 1 · Gancho
esc(0, B.s2, {}, [
  {tipo: 'dhEtiqueta', en: -0.4},
  {tipo: 'gancho', texto: '14 % de votos = 0 escaños', y: 340, tamano: 110, en: -0.5},
  {tipo: 'dhGancho', modo: 'gancho', tSube: 0.45, tSubeFin: 2.3, tAsientos: r(t(12) - 0.1), tCero: r(t(13) - 0.05), tDiv: r(t(18) - 0.0)},
]);

// 2 · Contexto: fotos F1-F4 + pizarra
{
  const a = B.s2;
  const R = (x) => rel(a, x);
  const f1f2 = t(24) - 0.05;       // "reparte"
  const f2f3 = t(27) + 0.1;        // "con"
  const f3f4 = t(32) + 0.0;        // "Se"
  const f4pz = t(42) - 0.02;       // "Te lo enseño"
  esc(a, B.s3, {}, [
    {tipo: 'foto', src: 'F1.jpg', forma: 'rect', x: 540, y: 775, ancho: 900, alto: 640, foco: '50% 40%', zoom: [1.04, 1.16], pan: [-30, 0], dur: R(f1f2), en: 0.02, hasta: R(f1f2), credito: 'Foto: Vickybol · CC BY-SA 3.0 · Wikimedia Commons'},
    {tipo: 'foto', src: 'F2c.jpg', forma: 'rect', x: 540, y: 775, ancho: 760, alto: 676, foco: '50% 50%', zoom: [1.02, 1.12], dur: R(f2f3) - R(f1f2), en: R(f1f2), hasta: R(f2f3), credito: 'Foto: MiguelAlanCS · CC BY-SA 4.0 · Wikimedia Commons'},
    {tipo: 'foto', src: 'F3c.jpg', forma: 'rect', x: 540, y: 775, ancho: 900, alto: 640, foco: '50% 40%', zoom: [1.02, 1.12], dur: R(f3f4) - R(f2f3), en: R(f2f3), hasta: R(f3f4), credito: 'Foto: JJ Merelo · CC BY-SA 2.0 · Wikimedia Commons'},
    rot("Sistema D'Hondt", 330, R(f2f3) + 0.1, {hasta: R(f3f4)}),
    {tipo: 'hemiciclo', grupos: [{nombre: 'Escaños', escanos: 350, color: '#14213D'}], total: 350, en: R(f3f4) - 0.62, dur: 0.4, y: 640, ancho: 860, leyenda: false, hasta: R(f3f4)},
    {tipo: 'dhOvalo', src: 'F4.jpg', x: 400, y: 830, ancho: 340, alto: 450, en: R(f3f4) + 0.04, hasta: R(f4pz), dur: R(f4pz) - R(f3f4)},
    rot("Victor D'Hondt · jurista belga, s. XIX", 330, R(f3f4) + 0.08, {tamano: 64, hasta: R(f4pz)}),
    nota(['Grabado anónimo (Revue mensuelle, n.º 20, 1901)', 'Dominio público · Wikimedia Commons'], R(f3f4) + 0.04, R(f4pz)),
    {tipo: 'dhPizarra', en: R(f4pz) + 0.04},
    rot('Ejemplo inventado', 330, R(f4pz) + 0.04),
    nota(['Fuente: LOREG art. 163'], R(f4pz) + 0.04),
  ]);
}

// 3 · Explicación: provincia, fichas, tabla de cocientes
{
  const a = B.s3;
  const R = (x) => rel(a, x);
  const finProv = t(54) - 0.12;
  const iniTabla = t(67) + 0.02;   // "Dividimos"
  esc(a, B.s4, {}, [
    rot('Provincia: 5 escaños', 330, 0.1, {hasta: R(finProv)}),
    {tipo: 'dhProvincia', numero: '5', x: 540, y: 760, tam: 520, en: 0.15, hasta: R(finProv)},
    {tipo: 'dhFichas', y: 450, paso: 150, hasta: R(iniTabla - 0.2), fichas: [
      {forma: 'circulo', valor: 100000, enFicha: R(t(54) + 0.1), enValor: R(t(58) - 0.05)},
      {forma: 'triangulo', valor: 80000, enFicha: R(t(54) + 0.5), enValor: R(t(62) - 0.05)},
      {forma: 'cuadrado', valor: 30000, enFicha: R(t(55) + 0.0), enValor: R(t(65) - 0.05)},
    ]},
    rot('÷1 ÷2 ÷3 ÷4', 330, R(iniTabla), {hasta: R(t(79) + 0.5)}),
    rot('Los 5 más altos', 330, R(t(79) + 0.6)),
    {tipo: 'dhTabla', enCab: R(iniTabla + 0.05), enFilas: [R(t(74) - 0.05), R(t(76) - 0.15), R(t(78) - 0.2), R(t(78) + 0.55)],
      luces: [
        {col: 0, row: 0, en: R(t(88) - 0.05), orden: 0},
        {col: 1, row: 0, en: R(t(92) - 0.05), orden: 1},
        {col: 0, row: 1, en: R(t(96) - 0.05), orden: 2},
        {col: 1, row: 1, en: R(t(101) - 0.05), orden: 3},
        {col: 0, row: 2, en: R(t(109) - 0.1), orden: 4},
      ]},
    nota([CALC], R(finProv)),
  ]);
}

// 4a · Giro: barras votos vs escaños
{
  const a = B.s4;
  const R = (x) => rel(a, x);
  esc(a, B.s4b, {}, [
    rot('48 % de votos → 60 % de escaños', 330, R(t(115) - 0.2), {tamano: 64}),
    rot('Triángulo: 38 % → 40 %', 500, R(t(126) + 0.8), {tamano: 64}),
    {tipo: 'dhBarras', y: 620, enIconos: R(t(114) + 0.2), filas: [
      {forma: 'circulo', votos: 48, escanos: 60, enV: R(t(118) - 0.05), enE: R(t(130) - 0.05)},
      {forma: 'triangulo', votos: 38, escanos: 40, enV: R(t(126) + 0.7), enE: R(t(133) + 0.3)},
      {forma: 'cuadrado', votos: 14, escanos: 0, enV: R(t(140) - 0.05), enE: R(t(143) - 0.05)},
    ]},
    nota([CALC], 0.1),
  ]);
}

// 4b · La tabla vuelve: Cuadrado se queda fuera por 3.334 votos
{
  const a = B.s4b;
  const R = (x) => rel(a, x);
  esc(a, B.s4c, {}, [
    rot('Le faltan 3.334 votos', 330, 0.1),
    {tipo: 'dhTabla', estatico: true, duelo: {en: 0.1, dur: 0.7, flechaEn: R(t(150) + 0.15), resultadoEn: R(t(152) + 0.1)},
      luces: [
        {col: 0, row: 0, en: 0, orden: 0}, {col: 1, row: 0, en: 0, orden: 1}, {col: 0, row: 1, en: 0, orden: 2}, {col: 1, row: 1, en: 0, orden: 3}, {col: 0, row: 2, en: 0, orden: 4},
      ]},
    nota([CALC], 0.1),
  ]);
}

// 4c · Menos escaños, más efecto
{
  const a = B.s4c;
  const R = (x) => rel(a, x);
  esc(a, B.s5, {}, [
    rot('Menos escaños, más efecto', 330, 0.1, {tamano: 64}),
    {tipo: 'dhDosProvincias', enPeq: 0.15, enPeqEt: R(t(158) + 0.1), enGra: R(t(161) + 0.2), enGraEt: R(t(163) + 0.3)},
  ]);
}

// 5a · Mínimo de 2 escaños por provincia (mapa)
{
  const a = B.s5;
  const R = (x) => rel(a, x);
  esc(a, B.s5b, {}, [
    rot('Mínimo: 2 escaños por provincia', 330, R(t(172) + 0.1), {tamano: 64}),
    {tipo: 'dhMapaMinimo', x: 500, y: 505, ancho: 700, enMapa: 0.1, enAros: 0.5, enPuntos: R(t(180) - 0.05)},
    nota(['LOREG art. 162.2 · CE art. 68.2'], R(t(172) + 0.1)),
  ]);
}

// 5b · Bucle con el gancho
esc(B.s5b, B.s5c, {}, [
  {tipo: 'dhEtiqueta', en: 0.1},
  {tipo: 'dhGancho', modo: 'bucle'},
]);

// 5c · Cierre
esc(B.s5c, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '14 % y 0 escaños: ya sabes por qué', pregunta: '¿Lo hacemos con los resultados reales de tu provincia?', tamano: 84, yGuardalo: 1345, yFuentes: 1432},
]);

// Portada: titular + subtítulo + urna con cuadrado fuera del mini-hemiciclo (todo dentro del recorte 4:5)
const portada = {escenas: [{inicio: 0, fin: 3, componentes: [
  {tipo: 'dhEtiqueta', en: -0.4},
  {tipo: 'gancho', texto: '14 % de votos. 0 escaños.', y: 340, tamano: 110, en: -0.5},
  {tipo: 'dhGancho', modo: 'portada'},
  rot("Así funciona D'Hondt", 1150, -0.5),
]}]};

const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.6, marca: '@loquepasaenunminuto', portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'fin de voz', T.duracion.toFixed(2));
ESC.forEach((e, i) => console.log(i + 1, e.inicio, e.fin, (e.fin - e.inicio).toFixed(2)));
