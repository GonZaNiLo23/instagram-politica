// 082 · Puente del 7 de diciembre: festivo en 10 territorios (9 CCAA + Melilla), martes 8 festivo en las 19
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T.duracion + 3.0);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.4) => ({tipo: 'notas', lineas, en, tamano: 36});
const NB = ' ';
const H = '‑';

// Índices: 6 Depende · 10 Según · 23 En(las otras) · 35 El(seis) · 40 Cada · 44 ese · 46 por · 50 El(martes) · 54 libra · 57 Puente · 59 cuatro · 65 solo · 69 ¿Prefieres
const b2 = S(10), b3 = S(23), b4 = S(35), b5 = S(50), b6 = S(69);
const MAPA = {x: 80, y: 580, esc: 0.34};

esc(0, b2, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `¿LIBRAS EL${NB}LUNES 7?`, y: 330, tamano: 120, en: -1},
  {tipo: 'calPuente', y: 600, zoom: true, hasta: rel(0, 6) + 0.1},
  {tipo: 'mapaPuente', ...MAPA, en: rel(0, 6) + 0.15, cajaEn: rel(0, 6) + 0.4},
]);
esc(b2, b3, {fondo: 'crema'}, [
  rot(`FESTIVO EL LUNES 7:${NB}10${NB}TERRITORIOS`, 330, 0.05),
  {tipo: 'mapaPuente', ...MAPA, en: -1, cajaEn: 0.3, festEn: 0.5, paso: 0.25, restoEn: 99, leyenda: rel(b2, 16), contador: {valor: '10', etiqueta: 'festivo', color: '#2A9D8F', en: 0.5}},
  nota([`Fuente: BOE 28${H}10${H}2025`], 0.6),
]);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`LAS OTRAS 9:${NB}NO FIGURA COMO${NB}FESTIVO`, 330, 0.05),
  {tipo: 'mapaPuente', ...MAPA, en: -1, cajaEn: 0.3, festEn: -9, paso: 0.1, restoEn: 0.2, etiquetas: 0.4, leyenda: -1, contador: {valor: '9', etiqueta: 'no figura', color: '#8D99AE', en: 0.2}},
]);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`6 DIC${NB}=${NB}DOMINGO`, 330, 0.05, {hasta: rel(b4, 40) - 0.2}),
  rot(`CADA COMUNIDAD DECIDE`, 330, rel(b4, 40) - 0.05),
  {tipo: 'calPuente', y: 500, filas: 2, cw: 118, ch: 175, en: 0.05, zoom: false, marca6: rel(b4, 36), flecha: rel(b4, 44), desvio: rel(b4, 41)},
  nota([`Fuente: BOE, fund. 2.º (RD 2001/1983, art. 45.3)`], 0.5),
]);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`MARTES 8: FESTIVO${NB}EN${NB}LAS${NB}19`, 330, 0.05, {hasta: rel(b5, 57) - 0.25}),
  rot(`PUENTE DE 4 DÍAS:${NB}SOLO EN${NB}10`, 330, rel(b5, 57) - 0.1),
  {tipo: 'barraDias', y: 520, en: 0.05, mar8: rel(b5, 52), cuatro: rel(b5, 59)},
  {tipo: 'mapaPuente', x: 230, y: 730, esc: 0.29, en: -1, cajaEn: 0.3, festEn: -9, paso: 0.1, restoEn: -9, todasEn: rel(b5, 54), vuelveEn: rel(b5, 65)},
  nota([`Salvo convenio o fiesta local propios`], rel(b5, 61)),
]);
esc(b6, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: `¿LUNES FESTIVO O${NB}FIESTA PROPIA?`, cta: 'siguenos', tamano: 76, pulso: true},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `¿LIBRAS EL${NB}LUNES 7?`, y: 340, tamano: 120, en: -1},
  {tipo: 'calPuente', y: 640, zoom: false, en: -1},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'wallpaper.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
