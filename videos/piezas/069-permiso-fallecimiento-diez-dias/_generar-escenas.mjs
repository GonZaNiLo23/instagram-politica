// 069 · Permiso por fallecimiento: 2 días (4 si viajas) frente a 10 días laborables anunciados. Fusiona "ce o e" en "CEOE".
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const fon = path.join(dir, 'tiempos-fonetico.json');
if (!fs.existsSync(fon)) fs.copyFileSync(path.join(dir, 'tiempos.json'), fon);
const T0 = JSON.parse(fs.readFileSync(fon, 'utf8'));
const pal = [];
for (let i = 0; i < T0.palabras.length; i++) {
  const w = T0.palabras[i], n1 = T0.palabras[i + 1], n2 = T0.palabras[i + 2];
  if (w.t === 'ce' && n1?.t === 'o' && n2?.t.startsWith('e')) {
    pal.push({t: 'CEOE' + n2.t.slice(1), inicio: w.inicio, fin: n2.fin});
    i += 2;
  } else pal.push(w);
}
fs.writeFileSync(path.join(dir, 'tiempos.json'), JSON.stringify({...T0, palabras: pal}, null, 2));
// Índices originales (fonético)
const t = (i) => T0.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T0.duracion + 1.9);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.2, o = {}) => ({tipo: 'notas', lineas, en, tamano: 40, ...o});
const NB = ' ';
const cal = (y, rellenos, o = {}) => ({tipo: 'calendarioX', mes: 'DÍAS LABORABLES', primer: 0, dias: 14, cw: 120, ch: 100, fuente: 40, x: 480, y, grises: [6, 7, 13, 14], rellenos, en: 0.05, ...o});

// 12 Hoy · 22 anunció · 45 En 2025 · 65 Después · 78 ¿Dos · 85 Síguenos
const b1 = S(12), b2 = S(21), b3 = S(45), b4 = S(65), b5 = S(78), b6 = S(85);

// 1 · Gancho
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: '2 DÍAS…', y: 330, tamano: 120, en: -1},
  {tipo: 'gancho', texto: '', resalta: '¿O 10?', y: 480, tamano: 120, en: rel(0, 8) - 0.1},
  cal(640, [{d0: 1, d1: 2, en: 0.2, paso: 0.2}, {d0: 3, d1: 12, en: rel(0, 9) , paso: 0.1}]),
]);
// 2 · Primera prueba
esc(b1, b2, {fondo: 'crema'}, [
  rot(`Asalariados: 2 días (4 si${NB}viajas)`, 330, 0.05),
  cal(520, [{d0: 1, d1: 2, en: 0.2, paso: 0.2}, {d0: 3, d1: 4, en: rel(b1, 15), paso: 0.2}]),
  {tipo: 'maletaX', x: 480, y: 1020, tam: 150, en: rel(b1, 15)},
  nota(['Fuente: Estatuto de los Trabajadores, art. 37.3'], 0.3),
]);
// 3 · Contexto
const fam = [['circulo', 'PAREJA', 30], ['cuadrado', 'PADRES', 34], ['triangulo', 'HIJOS', 36]];
esc(b2, b3, {fondo: 'crema'}, [
  rot(`10 días laborables`, 330, 0.05, {hasta: rel(b2, 37) - 0.05}),
  rot(`Gobierno: más tiempo para el${NB}duelo`, 330, rel(b2, 37)),
  rot(`Anunciado el 23‑11`, 505, rel(b2, 22), {}),
  cal(650, [{d0: 1, d1: 12, en: rel(b2, 26), paso: 0.12}], {cw: 110, ch: 90}),
  ...fam.flatMap(([f, l, i], k) => [
    {tipo: 'dib', nombre: 'persona', forma: f, x: 220 + k * 280, y: 1015, tamano: 110, en: rel(b2, i) - 0.1},
    rot(l, 1070, rel(b2, i) - 0.1, {izq: 90 + k * 280, ancho: 260, align: 'center'}),
  ]),
  nota(['decreto ley = norma con rango de ley que aprueba el Gobierno', 'y el Congreso debe confirmar'], rel(b2, 24)),
]);
// 4 · Explicación
esc(b3, b4, {fondo: 'crema'}, [
  rot(`CEOE (patronal), 2025: rechazo`, 330, 0.05),
  rot(`Motivo: coste para${NB}empresas`, 510, rel(b3, 54) - 0.1),
  {tipo: 'balanzaM', y: 680, izq: ['TRABAJADOR'], der: ['EMPRESA'], cx: 480, sep: 250, panW: 390, oEn: 99, en: 0.2},
]);
// 5 · Giro
esc(b4, b5, {fondo: 'crema'}, [
  rot('Falta: convalidación', 330, 0.05),
  rot(`Entrada en vigor: sin${NB}confirmar`, 440, rel(b4, 71) - 0.1),
  cal(690, [{d0: 1, d1: 12, en: 0.1, paso: 0.05}], {en: 0.05}),
  {tipo: 'selloTexto', lineas: ['PENDIENTE'], x: 470, y: 1050, desde: 40, angulo: -5, tamano: 80, en: rel(b4, 71)},
]);
// 6 · Pregunta A/B
esc(b5, b6, {fondo: 'crema'}, [
  rot('¿2 o 10 días?', 330, 0.05, {tamano: 80}),
  {tipo: 'abSerie', a: '2 DÍAS', b: '10 DÍAS', y: 800, en: 0.35},
]);
// 7 · Cierre
esc(b6, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: `¿2 O 10${NB}DÍAS?`, cta: 'siguenos', tamano: 76, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: '2 DÍAS…', y: 340, tamano: 120, en: -1},
  {tipo: 'gancho', texto: '', resalta: '¿O 10?', y: 500, tamano: 120, en: -1},
  rot('permiso por fallecimiento', 700, -1),
  cal(800, [{d0: 1, d1: 12, en: -1, paso: 0}], {en: -1, ch: 70}),
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, musica: {pista: 'hidden-agenda.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T0.duracion.toFixed(2));
