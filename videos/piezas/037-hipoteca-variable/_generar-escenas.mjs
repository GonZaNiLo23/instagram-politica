// 037 · Hipoteca variable (flash, Economía). Genera escenas.json desde tiempos.json.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T.duracion + 1.9);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const NB = ' ';

// Índices: 14 Imagina · 15 ciento · 19 veinticinco · 21 euríbor · 28 Euríbor · 32 dos · 37 Ahora · 43 tres · 45 dos · 48 La · 55 casi · 59 uno. · 60 Al · 65 euros. · 66 Tu · 73 ¿Hipoteca · 80 Síguenos
const b1 = S(14), b2 = S(28), b3 = S(37), b3b = S(48), b4 = S(59), b4b = r(t(66) - 0.3), b5 = S(73), b6 = S(80);

// 1 · Gancho
esc(0, b1, {fondo: 'crema', fuente: 'Banco de España'}, [
  {tipo: 'gancho', texto: `+84${NB}€ al${NB}mes`, y: 330, tamano: 130, en: -1},
  rot('Hipoteca variable', 665, -1),
  rot(`EJEMPLO: 150.000${NB}€ · 25${NB}años`, 765, -1),
  {tipo: 'cuotaH', y: 960},
]);
// 2 · Primera prueba
esc(b1, b2, {fondo: 'crema'}, [
  {tipo: 'ejemploP'},
  {tipo: 'fichasH', y: 340, paso: 240, alto: 210, items: [
    {icono: 'importe', lineas: [`150.000${NB}€`], en: rel(b1, 15) - 0.1},
    {icono: 'plazo', lineas: [`25${NB}años`], en: rel(b1, 19) - 0.1},
    {icono: 'dif', lineas: ['Euríbor +', `0,75${NB}puntos`], en: rel(b1, 21) - 0.1},
  ]},
  rot('Cuota fija mensual', 1090, rel(b1, 24)),
]);
// 2b · Contexto
esc(b2, b3, {fondo: 'crema', fuente: 'Banco de España, 3-11-2025'}, [
  rot(`Euríbor 12 meses · octubre${NB}2025`, 330, 0.05),
  {tipo: 'termoH', y: 900, a: 2.187, sube: 0.1, dur: 1.3, cifraEn: rel(b2, 32)},
]);
// 3 · Ahora
esc(b3, b3b, {fondo: 'crema', fuente: 'Banco de España, 3-11-2026'}, [
  rot(`Euríbor 12 meses · octubre${NB}2026`, 330, 0.05),
  {tipo: 'termoH', y: 900, de: 2.187, a: 3.239, sube: 0.4, dur: 1.4, cifraEn: rel(b3, 43) - 0.1, marca: 2.187},
  rot(`+1,052 puntos porcentuales`, 540, rel(b3, 45)),
]);
// 3b · Cuenta
esc(b3b, b4, {fondo: 'crema'}, [
  rot(`706,41${NB}€ → 790,84${NB}€ al${NB}mes`, 330, 0.05),
  {tipo: 'barrasCuotaH', base: 1180, k: 0.62, difEn: rel(b3b, 55) - 0.1},
  {tipo: 'notas', lineas: ['Cálculo propio'], en: 0.2},
]);
// 4 · Giro
esc(b4, b4b, {fondo: 'crema'}, [
  rot(`84,43${NB}€ × 12 = 1.013${NB}€/año`, 330, 0.1),
  {tipo: 'huchaH', y: 580, en: 0.6, paso: 0.12, cifraEn: 2.0},
  {tipo: 'notas', lineas: ['Cálculo propio'], en: 0.2},
]);
// 4b · Matiz
esc(b4b, b5, {fondo: 'crema'}, [
  rot(`Tu cuota cambia en tu${NB}revisión`, 330, 0.05),
  rot('Mira tu contrato', 500, 0.05),
  {tipo: 'calendarioH', y: 630, marca: 6, marcaEn: 1.0},
]);
// 5 · Pregunta A/B
esc(b5, b6, {fondo: 'crema'}, [
  rot('¿FIJA O VARIABLE?', 330, 0.05, {tamano: 80}),
  {tipo: 'abSerie', a: 'FIJA', b: 'VARIABLE', y: 560, en: 0.35},
]);
// 6 · Cierre
esc(b6, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '¿FIJA O VARIABLE?', tamano: 96, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `Hipoteca variable: +84${NB}€ al${NB}mes`, y: 330, tamano: 110, en: -1},
  {tipo: 'cuotaH', y: 900, de: 790.84, a: 790.84, sube: 0, dur: 0.01, golpe: 0},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 90, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
