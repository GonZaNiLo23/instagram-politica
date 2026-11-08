// 036 · 8 años en cifras · Cifra 2 (lista de espera quirúrgica). Genera escenas.json desde tiempos.json (tiempos reales de palabra).
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
const nota = (lineas, en = 0.2, o = {}) => ({tipo: 'notas', lineas, en, tamano: 40, ...o});
const NB = ' ';
const N = 2;
const A = 668288, B = 853740;
const COL = {a: A, b: B, x: [300, 780], w: 260, tile: 52};

// ===== 1 · Gancho (0 - "A finales") =====
const b1 = S(16);
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'cifraSerie', n: N, en: -1},
  {tipo: 'gancho', texto: `+185.000 EN${NB}LISTA`, y: 500, tamano: 124, en: -1},
  rot(`2018 → 2025`, 780, -1),
  {tipo: 'columnasEspera', ...COL, base: 1090, hMax: 250, crece: {en: 0.3, dur: 1.6}, extraEn: 1.9, tile: 44, w: 220},
]);
// ===== 2 · Primera prueba =====
const b2 = S(41);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`PACIENTES EN LISTA: 668.288 → 853.740`, 330, 0.05),
  rot(`31-12-2018 y 31-12-2025 · Ministerio de Sanidad`, 540, 0.3, {tamano: 44}),
  {tipo: 'columnasEspera', ...COL, base: 1090, hMax: 290, crece: {en: -1, dur: 0.01}, extraEn: -1, valores: {enA: rel(b1, 23) - 0.3, enB: rel(b1, 36) - 0.3}},
  nota([`Se compara con 31-12-2018: junio de 2018 no es comparable (rotura de serie)`], 1.0),
]);
// ===== 3 · El giro (¿Y los días? - "ahora.") =====
const b3 = S(50);
esc(b2, b3, {fondo: 'crema'}, [
  rot(`ESPERA MEDIA: 129 → 122 DÍAS`, 330, 0.05),
  rot(`Más de 6 meses: 20,0${NB}% → 21,6${NB}%`, 530, rel(b2, 44) - 0.3, {tamano: 52}),
  {tipo: 'barrasVSerie', max: 129, base: 1040, hMax: 280, tamEtiqueta: 56, barras: [
    {etiqueta: '2018', valor: 129, color: '#14213D', prefijo: '', sufijo: '', en: rel(b2, 44) - 0.1, dur: 1.0},
    {etiqueta: '2025', valor: 122, color: '#F2B134', prefijo: '', sufijo: '', en: rel(b2, 47) - 0.1, dur: 1.0},
  ]},
  {tipo: 'sello', valor: 'DATO', x: 560, y: 600, tamano: 76, desde: 60, reboteMax: 0, en: rel(b2, 47) + 0.9},
  nota(['Espera media = días que llevan en lista los pacientes pendientes'], 0.4, {y: 1090}),
]);
// ===== 4 · Remate =====
const b4 = S(53);
esc(b3, b4, {fondo: 'crema'}, [
  {tipo: 'barrasVSerie', max: 129, base: 1040, hMax: 280, tamEtiqueta: 56, barras: [
    {etiqueta: '2018', valor: 129, color: '#14213D', prefijo: '', sufijo: '', en: -1, dur: 0.01},
    {etiqueta: '2025', valor: 122, color: '#F2B134', prefijo: '', sufijo: '', en: -1, dur: 0.01},
  ], flecha: {barra: 1, hasta: 122, en: 0.1}},
  {tipo: 'cifraGrandeSerie', valor: `−7${NB}DÍAS`, y: 380, tam: 190, en: 0.0, pill: true},
]);
// ===== 5 · Quién gestiona =====
const b5 = S(65);
esc(b4, b5, {fondo: 'crema'}, [
  rot('LAS GESTIONAN LAS COMUNIDADES', 330, 0.05),
  rot('Sanidad recopila sus datos', 530, rel(b4, 60) - 0.15, {tamano: 52}),
  {tipo: 'mapaCcaa', modo: 'uno', x: 190, y: 620, esc: 0.33, en: 0, flechas: {
    desde: ['Galicia', 'Andalucía', 'Cataluña', 'Madrid'], en: rel(b4, 60) + 0.2,
    caja: {x: 600, y: 1005, w: 360, h: 120, lineas: ['MINISTERIO', 'DE SANIDAD'], tam: 44},
  }},
]);
// ===== 6 · Brecha =====
const b6 = S(88);
esc(b5, b6, {fondo: 'crema'}, [
  rot('ESPERA MEDIA POR COMUNIDAD', 330, 0.05),
  rot('(31-12-2025)', 485, 0.2, {tamano: 52}),
  {tipo: 'mapaCcaa', modo: 'dias', x: 190, y: 580, esc: 0.33, en: -1, pintaEn: 0.1, valores: {Madrid: 50, Cataluña: 142, Andalucía: 173},
    globos: [
      {ccaa: 'Madrid', texto: 'Madrid 50', dx: -130, dy: -110, en: rel(b5, 75)},
      {ccaa: 'Cataluña', texto: 'Cataluña 142', dx: -60, dy: -150, en: rel(b5, 78)},
      {ccaa: 'Andalucía', texto: 'Andalucía 173', dx: -10, dy: 110, en: rel(b5, 83)},
    ],
    leyenda: {y: 1050, en: 0.6, media: 122}},
  nota(['Cada comunidad aplica sus criterios de cómputo'], rel(b5, 83) + 0.2, {y: 1210}),
]);
// ===== 7a · Pregunta A/B =====
const b7 = S(98);
esc(b6, b7, {fondo: 'crema'}, [
  rot('¿TU COMUNIDAD O EL ESTADO?', 330, 0.05),
  {tipo: 'abSerie', a: 'TU COMUNIDAD', b: 'EL ESTADO', y: 640, en: 0.7},
  {tipo: 'mapaCcaa', modo: 'uno', x: 330, y: 960, esc: 0.2, en: 0.2, tono: '#B4BBC8', canarias: false},
]);
// ===== 7b · Cierre de serie =====
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierreSerie', siguiente: N + 1},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'cifraSerie', n: N, en: -1},
  {tipo: 'gancho', texto: `185.000 PACIENTES MÁS EN${NB}LISTA`, y: 520, tamano: 92, en: -1},
  {tipo: 'columnasEspera', ...COL, base: 1250, hMax: 400, crece: {en: -1, dur: 0.01}, extraEn: -1, tile: 56, w: 270},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
