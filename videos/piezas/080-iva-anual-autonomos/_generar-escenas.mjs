// 080 · IVA anual autónomos: 1 declaración, 3 pagos (abril, julio, octubre), voluntario hasta 85.000 €, renuncia 3 años
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T.duracion + 2.4);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.2) => ({tipo: 'notas', lineas, en, tamano: 40});
const NB = ' ';
const H = '‑';

// Índices: 13 Abril · 14 julio · 16 octubre · 28 Es · 30 hasta · 41 No · 48 Si · 57 Aplica · 63 el Congreso · 70 ¿IVA
const b1 = S(13), b2 = S(28), b3 = S(41), b4 = S(48), b5 = S(57), b6 = S(70);

esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `IVA ANUAL.${NB}TRES PAGOS`, y: 330, tamano: 112, en: -1},
  {tipo: 'calIva', y: 780, tacha: 1.3, pagos: [2.3, 2.9, 3.5]},
]);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`Abril · julio · octubre`, 330, 0.05),
  rot(`Cada pago: ¼ de la${NB}cuota anterior`, 450, rel(b1, 17) - 0.2),
  {tipo: 'calIva', y: 700, tacha: 0.01, pagos: [rel(b1, 13), rel(b1, 14), rel(b1, 16)], moneda: true},
]);
esc(b2, b3, {fondo: 'crema'}, [
  rot(`Voluntario`, 330, 0.05, {hasta: rel(b2, 30) - 0.2}),
  rot(`Hasta 85.000 €${NB}de operaciones`, 330, rel(b2, 30) - 0.1),
  {tipo: 'topeIva', y: 820, esc: 1.15, en: rel(b2, 30) - 0.1},
  nota(['BOE, RDL 43/2026'], 0.4),
]);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`No es exención`, 330, 0.05),
  {tipo: 'facturaIva', y: 760, esc: 1.15},
]);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`Renuncia: mínimo 3${NB}años`, 330, 0.05),
  {tipo: 'candadoIva', y: 680},
]);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`Desde 1${H}1${H}2027`, 330, 0.05, {hasta: rel(b5, 63) - 0.35}),
  rot(`Falta convalidación`, 330, rel(b5, 63) - 0.1),
  {tipo: 'tlIva', y: 950, hitos: [
    {fecha: `BOE 25${H}11`, en: 0.3},
    {fecha: `VIGOR 26${H}11`, en: 1.0},
    {fecha: `30 DÍAS`, en: rel(b5, 63) + 0.2, resalta: true},
  ]},
  nota([`Convalidar: plazo de 30${NB}días`], rel(b5, 63) + 0.2),
]);
esc(b6, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: `¿ANUAL O${NB}TRIMESTRAL?`, cta: 'siguenos', tamano: 84, pulso: true, sinFuentes: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `IVA ANUAL.${NB}TRES PAGOS`, y: 340, tamano: 112, en: -1},
  {tipo: 'calIva', y: 800, tacha: -1, pagos: [-1, -1, -1]},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'hidden-agenda.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
