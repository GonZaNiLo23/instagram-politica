// 043 · Récord de afiliados y más parados (flash, Economía). Genera escenas.json desde tiempos.json.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T.duracion + 1.4);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const NB = ' ';
const VERDE = '#2A9D8F', NARANJA = '#E07B39';

// Índices: 7 Octubre · 16 Y(más de cuarenta) · 28 Afiliado · 39 Parado · 51 Regularización · 66 Otra · 77 Y(más de quinientos) · 86 desde · 91 ¿Te · 101 Síguenos
const b2 = S(7), b2b = S(28), b3 = S(39), b4 = S(51), b5 = S(66), b5b = S(77), b6 = S(91), b7 = S(101);

const barras = (max, hMax, valores, en, dur, extra = {}) => ({
  tipo: 'barrasVSerie', max, base: 1150, hMax, tamEtiqueta: 56, centros: [300, 720], barras: [
    {etiqueta: 'AFILIADOS', valor: valores[0], color: VERDE, sinValor: true, en: en[0], dur},
    {etiqueta: 'PARADOS', valor: valores[1], color: NARANJA, sinValor: true, en: en[1], dur},
  ], ...extra,
});

// 1 · Gancho
esc(0, b2, {fondo: 'crema', fuente: 'Seguridad Social y Trabajo, 4-11-2026'}, [
  {tipo: 'gancho', texto: `RÉCORD DE${NB}AFILIADOS`, y: 330, tamano: 110, en: -1},
  {tipo: 'gancho', texto: `MÁS${NB}PARADOS`, y: 610, tamano: 110, en: -1},
  barras(100, 260, [100, 60], [-1, -1], 1.2, {vivo: true}),
]);
// 2 · Primera prueba (las barras siguen durante "No miden lo mismo")
esc(b2, b2b, {fondo: 'crema'}, [
  rot(`AFILIADOS +186.612${NB}(media${NB}mensual)`, 330, 0.05),
  rot(`PARADO REGISTRADO +43.128${NB}(−21.133${NB}en${NB}un${NB}año)`, 500, rel(b2, 16) - 0.1),
  barras(186612, 300, [186612, 43128], [-1, rel(b2, 16)], 0.8),
]);
// 3 · Qué mide cada una
esc(b2b, b3, {fondo: 'crema'}, [
  rot(`AFILIADO = EN${NB}ALTA EN${NB}LA SEGURIDAD${NB}SOCIAL`, 330, 0.05),
  {tipo: 'tarjetaSS', y: 700, tam: 560, en: 0.3},
]);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`PARADO REGISTRADO = PARADO INSCRITO EN${NB}EL${NB}SERVICIO${NB}DE${NB}EMPLEO`, 330, 0.05),
  {tipo: 'ventanillaP', y: 720, tam: 560, en: 0.3, vivo: true},
]);
// 4 · Regularización
esc(b4, b5, {fondo: 'crema', fuente: 'Seguridad Social'}, [
  rot(`490.586${NB}AFILIADOS EN${NB}ALTA`, 330, 0.05),
  rot(`Regularización · fin${NB}de${NB}octubre`, 500, rel(b4, 51) + 0.2),
  {tipo: 'embudoR', y: 700, tiers: [
    {valor: 1174978, en: 99, color: VERDE}, {valor: 557410, en: 99, color: VERDE}, {valor: 490586, en: 0.5, color: VERDE},
  ]},
]);
// 5 · Giro
esc(b5, b5b, {fondo: 'crema'}, [
  rot(`1.174.978${NB}SOLICITUDES (plazo${NB}cerrado${NB}el${NB}30-6)`, 330, 0.05),
  {tipo: 'embudoR', y: 700, tiers: [
    {valor: 1174978, en: rel(b5, 70) - 0.1, color: NARANJA}, {valor: 557410, en: 99, color: VERDE}, {valor: 490586, en: -1, color: VERDE},
  ]},
]);
esc(b5b, b6, {fondo: 'crema'}, [
  rot(`557.410${NB}EN${NB}ALTA ALGÚN DÍA DESDE${NB}ABRIL`, 330, 0.05),
  rot('Tres cifras, tres cosas', 570, rel(b5b, 86) - 0.2),
  {tipo: 'embudoR', y: 700, tiers: [
    {valor: 1174978, en: -1, color: NARANJA}, {valor: 557410, en: rel(b5b, 80) - 0.1, color: VERDE}, {valor: 490586, en: -1, color: VERDE},
  ]},
]);
// 6 · Pregunta y bucle
esc(b6, b7, {fondo: 'crema'}, [
  rot('¿PARO REGISTRADO O AFILIADOS?', 330, 0.05, {tamano: 80}),
  barras(100, 360, [100, 60], [-1, -1], 0.01),
]);
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '¿PARO REGISTRADO O AFILIADOS?', tamano: 72, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `RÉCORD DE${NB}AFILIADOS… MÁS${NB}PARADOS`, y: 330, tamano: 104, en: -1},
  barras(100, 260, [100, 60], [-1, -1], 0.01),
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 90, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
