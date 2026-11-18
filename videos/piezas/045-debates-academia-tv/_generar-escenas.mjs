// 045 · Debate Sánchez–Feijóo organizado por la Academia de TV. Flash ~33 s.
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
const NB = ' ';
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.2) => ({tipo: 'notas', lineas, en, tamano: 40});
const ic = (nombre, x, y, tamano, en = 0.2, o = {}) => ({tipo: 'icono', nombre, x, y, tamano, en, ...o});
const tj = (titular, y, en, entra = 'izq', alto = 200) => ({tipo: 'tarjetaE', titular, y, alto, ancho: 880, x: 60, en, entra, icono: false});

// 1 · Gancho (0–3,8 s)
const b0 = S(4);
const b1 = S(8);
esc(0, b0, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `NINGUNA CADENA LO${NB}ORGANIZA`, y: 330, tamano: 100, en: -1},
  ic('megafono', 540, 1000, 340, 0.2),
]);
esc(b0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `CUALQUIERA PUEDE EMITIRLO`, y: 330, tamano: 110, en: -1},
  ic('megafono', 330, 1000, 340, 0, {}),
  ic('cartel', 760, 1000, 340, 0.4),
]);

// 2 · Primera prueba
const b2 = S(20);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`HOY 19-11 · 22:00`, 330, 0.05),
  rot(`CARA A${NB}CARA`, 430, rel(b1, 13) - 0.1),
  ic('reloj', 540, 980, 480, 0.3),
]);

// 2b · Quién
const b3 = S(31);
esc(b2, b3, {fondo: 'crema'}, [
  rot(`ACADEMIA DE${NB}TELEVISIÓN`, 330, 0.05),
  rot(`Moderadora: María${NB}Casado`, 500, rel(b2, 26) - 0.1),
  ic('megafono', 540, 980, 440, 0.3),
]);

// 3 · Cinco bloques (31–46)
const b4 = S(46);
const fila = (n, txt, i, y, en) => ({tipo: 'rotulo', texto: `${n} ${txt}`, y, en, tamano: 58});
esc(b3, b4, {fondo: 'crema'}, [
  rot(`CINCO BLOQUES PACTADOS`, 330, 0.05),
  fila(1, 'Vivienda', 40, 430, 1.4),
  fila(2, `Economía y${NB}fiscalidad`, 40, 520, 1.9),
  fila(3, `Política social y servicios${NB}públicos`, 41, 610, 2.4),
  fila(4, `Corrupción y regeneración${NB}democrática`, 42, 800, 3.0),
  fila(5, `Migración y política${NB}exterior`, 44, 990, 3.6),
  ic('palacio', 180, 1480, 150, 1.4), ic('hucha', 360, 1480, 150, 1.9), ic('aula', 540, 1480, 150, 2.4), ic('balanzaSaco', 720, 1480, 150, 3.0), ic('pin', 900, 1480, 150, 3.6),
]);

// 3b · Sorteo (46–53)
const b5 = S(53);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`SORTEO`, 330, 0.05),
  tj(`ABRE: FEIJÓO`, 520, rel(b4, 48) - 0.2, 'izq'),
  tj(`CIERRA: SÁNCHEZ`, 760, rel(b4, 51) - 0.2, 'abajo'),
]);

// 4 · Señal (53–59)
const b6 = S(59);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`SEÑAL INSTITUCIONAL DE LA${NB}ACADEMIA`, 330, 0.05),
  ic('megafono', 250, 980, 240, 0.3),
  ic('tarjetas', 540, 980, 240, rel(b5, 55)),
  ic('cartel', 830, 980, 240, rel(b5, 57)),
]);

// 4b · Cadenas (59–69)
const b7 = S(69);
esc(b6, b7, {fondo: 'crema'}, [
  rot(`YA LO HAN ANUNCIADO`, 330, 0.05),
  tj(`La 1`, 480, rel(b6, 59) - 0.1, 'izq', 160),
  tj(`Antena 3`, 680, rel(b6, 61) - 0.1, 'abajo', 160),
  tj(`laSexta`, 880, rel(b6, 64) - 0.1, 'izq', 160),
]);

// 5 · A/B (69–80)
const b8 = S(80);
esc(b7, b8, {fondo: 'crema'}, [
  rot(`¿DIRECTO O${NB}RESUMEN?`, 330, 0.05),
  tj(`A · En directo`, 560, rel(b7, 72) - 0.2, 'izq', 230),
  tj(`B · En el resumen`, 860, rel(b7, 76) - 0.2, 'abajo', 230),
]);
esc(b8, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierre', frase: `¿DIRECTO${NB}O RESUMEN?`, tamano: 84, pulso: true}]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `NINGUNA CADENA LO${NB}ORGANIZA`, y: 330, tamano: 100, en: -1},
  rot(`El cara a cara, explicado`, 800, -1),
  ic('cartel', 540, 1050, 340, -1),
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'hidden-agenda.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
