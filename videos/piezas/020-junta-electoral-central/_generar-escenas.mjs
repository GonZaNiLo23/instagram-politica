// Genera escenas.json desde tiempos-fonetico.json (índices originales de la voz). Escribe tiempos.json con "JEC" fusionado. Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const fon = path.join(dir, 'tiempos-fonetico.json');
if (!fs.existsSync(fon)) fs.copyFileSync(path.join(dir, 'tiempos.json'), fon);
const T = JSON.parse(fs.readFileSync(fon, 'utf8'));
// fusiona "jota e ce." (21-23) en "JEC."
{
  const out = JSON.parse(JSON.stringify(T));
  const a = T.palabras[21], c = T.palabras[23];
  out.palabras.splice(21, 3, {t: 'JEC.', inicio: a.inicio, fin: c.fin});
  fs.writeFileSync(path.join(dir, 'tiempos.json'), JSON.stringify(out));
}
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const DUR = 71;
const rel = (a, abs) => r(abs - a);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.1, o = {}) => ({tipo: 'notas', lineas, en, ...o});
const B = {b2: S(15), b2b: S(24), re: S(34), m: S(37), c: S(48), p: S(60), s: S(70), q: r(S(79) - 0.4), q2: r(t(82) + 0.05), r2: S(86), e: S(95), a5: S(105), a5b: S(118), g1: S(129), g2: S(134), z: S(152), z2: S(164), cie: S(177)};

// 1 · Gancho
const ocupan = Array.from({length: 13}, (_, i) => r(0.2 + i * 0.22));
esc(0, B.b2, {}, [
  {tipo: 'gancho', texto: '13 VOCALES VIGILAN LA CAMPAÑA', y: 335, tamano: 96, en: -1, hasta: rel(0, t(10)) - 0.05},
  rot('8 SON MAGISTRADOS DEL SUPREMO', 335, rel(0, t(10)) - 0.05),
  nota(['LOREG, art. 9.1'], rel(0, t(10)) - 0.05),
  {tipo: 'mesaJ', yMesa: 1090, ocupanEn: ocupan, togaEn: rel(0, t(10)), bandaEn: rel(0, t(12)), cifra: '13', yCifra: 940, en: -1},
]);
// 2 · Contexto
esc(B.b2, B.b2b, {}, [
  rot('JUNTA ELECTORAL CENTRAL (JEC)', 335, 0.05),
  nota(['LOREG, art. 9.1 · sede en Madrid, art. 8.3'], 0.1),
  {tipo: 'mesaJ', yMesa: 1090, ocupanEn: undefined, togaEn: -1, bandaEn: -1, en: -1},
  {tipo: 'placaJ', x: 540, y: 730, ancho: 420, en: rel(B.b2, t(17))},
]);
esc(B.b2b, B.re, {}, [
  rot('ÓRGANO PERMANENTE', 335, 0.05),
  nota(['LOREG, art. 9.1 · sede en Madrid, art. 8.3'], 0.1),
  {tipo: 'mesaJ', yMesa: 1090, togaEn: -1, birreteEn: undefined, bandaEn: -1, en: -1},
  {tipo: 'placaJ', x: 540, y: 730, ancho: 420, en: -1},
  {tipo: 'aniosJ', y: 925, anios: ['2019', '2023', '2026'], pasan: [0.15, 0.95, 1.75], dur: 1.7, en: 0},
  {tipo: 'selloTexto', lineas: ['PERMANENTE'], x: 540, y: 540, tamano: 64, angulo: -5, desde: 40, en: rel(B.b2b, t(33)) - 0.2},
]);
// 3 · Explicación
esc(B.re, B.m, {}, [
  {tipo: 'mesaJ', modo: 'dos', dosEn: 0.1, yA: 920, yB: 1070, togaEn: -1, bandaEn: -1, en: -1},
]);
esc(B.m, B.c, {}, [
  rot('8 MAGISTRADOS DEL SUPREMO', 335, 0.05),
  nota(['Elegidos por sorteo · CGPJ · art. 9.1.a'], 0.1),
  {tipo: 'mesaJ', modo: 'dos', togaEn: -1, bandaEn: -1, foco: 'mag', en: -1},
  {tipo: 'bomboM', x: 280, y: 700, tam: 200, en: 0.1},
  {tipo: 'fichaM', texto: 'TS', r: 48, tamTexto: 42, ruta: [{t: 0.6, x: 280, y: 700, e: 0.4}, {t: 1.6, x: 520, y: 700, e: 1}]},
  {tipo: 'etiquetaJ', texto: 'CGPJ', x: 740, y: 700, tam: 56, en: 1.2},
]);
esc(B.c, B.p, {}, [
  rot('5 CATEDRÁTICOS', 335, 0.05),
  nota(['Derecho o Ciencias Políticas y Sociología'], 0.1),
  {tipo: 'mesaJ', modo: 'dos', togaEn: -1, bandaEn: -1, birreteEn: 0.2, foco: 'cat', en: -1},
  {tipo: 'libroJ', x: 540, y: 680, tam: 240, en: 0.3},
]);
esc(B.p, B.s, {}, [
  rot('PROPUESTOS POR LOS PARTIDOS DEL CONGRESO', 335, 0.05),
  nota(['De forma conjunta · art. 9.1.b'], 0.1),
  {tipo: 'propuestaJ', papelEn: rel(B.p, t(62)), aparecen: [64, 65, 66, 67, 68].map((i, k) => rel(B.p, t(i)) + (i === 64 ? 0 : 0)), en: 0},
]);
esc(B.s, B.q, {}, [
  rot('SECRETARIO: EL DEL CONGRESO', 335, 0.05),
  nota(['Secretario general · art. 9.6'], 0.1),
  {tipo: 'mesaJ', modo: 'dos', togaEn: -1, bandaEn: -1, birreteEn: -1, foco: 'sec', secSilla: true, secEn: rel(B.s, t(72)), en: -1},
  {tipo: 'hemiJ', x: 640, y: 730, tam: 300, en: rel(B.s, t(72)) - 0.1},
]);
// 4 · Funciones
esc(B.q, B.q2, {}, [
  rot('¿QUÉ HACE LA JEC?', 335, 0.05),
  {tipo: 'cifraGrande', texto: '?', x: 540, y: 820, tamano: 420, en: 0.1},
]);
esc(B.q2, B.r2, {}, [
  rot('RESUELVE QUEJAS Y RECURSOS', 335, 0.05),
  nota(['LOREG, art. 19.1.h'], 0.1),
  {tipo: 'carpetasJ', y: 860, en: 0.1, checkEn: 2.0},
]);
esc(B.r2, B.e, {}, [
  rot('INSTRUCCIONES OBLIGATORIAS', 335, 0.05),
  nota(['Para las juntas provinciales · art. 19.1.c'], 0.1),
  {tipo: 'instruccionJ', en: 0.1, baja: rel(B.r2, t(89)) - 0.4, dur: 2.7},
]);
esc(B.e, B.a5, {}, [
  rot('VELA POR LAS ENCUESTAS', 335, 0.05),
  nota(['Art. 69.2'], 0.1),
  {tipo: 'encuestaJ', y: 1000, lupaEn: 0.6, checkEn: rel(B.e, t(102)), en: 0},
]);
// 5 · Ejemplo de hoy
esc(B.a5, B.a5b, {}, [
  rot('26-OCT: REPARTO DE ESPACIOS GRATIS', 335, 0.05),
  nota(['Instrucción 2/2026 · JEC'], 0.1),
  {tipo: 'calendarioJ', x: 540, y: 860, marcaEn: rel(B.a5, t(106)), en: 0.1},
]);
esc(B.a5b, B.g1, {}, [
  rot('SEGÚN LOS VOTOS ANTERIORES', 335, 0.05),
  nota(['LOREG, art. 64.1'], 0.1),
  {tipo: 'franjaJ', y: 850, tramosEn: rel(B.a5b, t(124)) - 0.2, en: 0},
]);
// 6 · Giro
esc(B.g1, B.g2, {}, [
  rot('TAMBIÉN LAS TELES PRIVADAS', 335, 0.05),
  {tipo: 'platoJ', x: 540, y: 830, esc: 1, en: 0.2},
]);
esc(B.g2, B.z, {}, [
  rot('DEBATES Y ENTREVISTAS: 4 REGLAS', 335, 0.05),
  nota(['Pluralismo · igualdad · proporcionalidad · neutralidad · LOREG, art. 66.2 e instrucciones de la JEC'], 0.1),
  {tipo: 'platoJ', x: 540, y: 640, esc: 0.5, en: -1},
  {tipo: 'reglasJ', y0: 790, paso: 100, tiempos: [t(142), t(143), t(144), t(146)].map((x) => rel(B.g2, x) - 0.1), en: 0.1},
]);
// 7 · Cierre
esc(B.z, B.z2, {}, [
  rot('13 VOCALES + 1 SECRETARIO', 335, 0.05),
  {tipo: 'mesaJ', yMesa: 1090, togaEn: -1, birreteEn: -1, bandaEn: -1, cifra: '13', cifra2: '+1', yCifra: 940, secSilla: true, secEn: rel(B.z, t(156)) - 0.2, en: -1},
]);
esc(B.z2, B.cie, {}, [
  rot('¿TELES PRIVADAS CON LAS MISMAS REGLAS?', 335, 0.05),
  {tipo: 'platoJ', x: 540, y: 800, esc: 0.8, en: 0.1},
]);
esc(B.cie, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '13 VOCALES + 1 SECRETARIO', tamano: 104, pulso: true, cta: 'guardalo', guardaloLinea2: 'y síguenos'},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'gancho', texto: '13 VOCALES VIGILAN LA CAMPAÑA', y: 350, tamano: 104, en: -1},
  {tipo: 'mesaJ', yMesa: 1090, togaEn: -1, bandaEn: -1, birreteEn: -1, cifra: '13', yCifra: 950, en: -1},
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 90, musica: {pista: 'wallpaper.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
ESC.forEach((e, i) => { const d = e.fin - e.inicio; if (d < 1.3) console.log('corta', i + 1, e.inicio, d.toFixed(2)); });
