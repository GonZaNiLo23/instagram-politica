// 052 · Voto por correo el 29-N. Lee tiempos-fonetico.json (índices originales, "de ene i") y escribe tiempos.json (DNI fusionado) y escenas.json.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const fon = path.join(dir, 'tiempos-fonetico.json');
if (!fs.existsSync(fon)) fs.copyFileSync(path.join(dir, 'tiempos.json'), fon);
const T0 = JSON.parse(fs.readFileSync(fon, 'utf8'));
// Fusión "de ene i" -> "DNI"
const pal = [];
for (let i = 0; i < T0.palabras.length; i++) {
  const w = T0.palabras[i];
  if (w.t === 'de' && T0.palabras[i + 1]?.t === 'ene' && T0.palabras[i + 2]?.t.startsWith('i')) {
    const u = T0.palabras[i + 2];
    pal.push({t: 'DNI' + u.t.slice(1), inicio: w.inicio, fin: u.fin});
    i += 2;
  } else pal.push(w);
}
fs.writeFileSync(path.join(dir, 'tiempos.json'), JSON.stringify({...T0, palabras: pal}, null, 2));
const t = (i) => T0.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T0.duracion + 2.4);
const NB = ' ';
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const urn = (x, y, tamano, en) => ({tipo: 'icono', nombre: 'urnaSin', x, y, tamano, en});
const dib = (nombre, x, y, tamano, en, o = {}) => ({tipo: 'dib', nombre, x, y, tamano, en, ...o});

// 1 · Gancho
const b1 = r(S(13) + 0.3), cambio = 2.1;
const gancho = [
  {tipo: 'gancho', texto: `TE ACEPTAN EL VOTO POR${NB}CORREO`, y: 330, tamano: 110, en: -1, hasta: cambio},
  {tipo: 'gancho', texto: `YA NO VOTAS EN TU${NB}MESA`, y: 330, tamano: 110, en: cambio},
  urn(540, 960, 300, -1),
  dib('sobre', 540, 740, 260, -1, {hasta: cambio, animEn: 0, mover: {x: 540, y: 880, en: 0, dur: 0.7, arco: 60}}),
  dib('sobreCandado', 540, 880, 260, cambio, {animEn: cambio}),
];
esc(0, b1, {fondo: 'crema', fuente: 'Interior, 20-10-2026'}, gancho);

// 2 · Plazo
const b2 = S(27);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`PLAZO: JUEVES${NB}19\u201111`, 330, 0.05),
  {tipo: 'calendarioX', mes: 'NOVIEMBRE', primer: 6, dias: 30, y: 420, cw: 98, ch: 56, aro: {d: 19, en: rel(b1, 21) - 0.2}, en: 0.3},
  {tipo: 'casillaX', texto: '1', x: 260, y: 1030, w: 190, h: 100, desde: 0, en: rel(b1, 24)},
  {tipo: 'casillaX', texto: '2', x: 540, y: 1030, w: 190, h: 100, desde: 0, en: rel(b1, 24)},
  {tipo: 'casillaX', texto: '3', x: 820, y: 1030, w: 190, h: 100, desde: 0, en: rel(b1, 24)},
  {tipo: 'notas', lineas: ['Para solicitarlo · Interior'], en: 0.3},
]);

// 3a · Fecha 1
const b3 = S(65);
esc(b2, b3, {fondo: 'crema'}, [
  rot(`1 · PEDIRLO HASTA EL${NB}19\u201111`, 330, 0.05),
  rot(`EN CORREOS O EN SU${NB}WEB`, 520, 0.05, {hasta: rel(b2, 42) - 0.15}),
  rot(`ONLINE: DNI ELECTRÓNICO O${NB}CERTIFICADO`, 520, rel(b2, 42) - 0.1, {hasta: rel(b2, 52) - 0.15}),
  rot(`DOCUMENTACIÓN: DESDE EL${NB}9\u201111`, 520, rel(b2, 52) - 0.1),
  dib('oficina', 540, 880, 330, rel(b2, 33) - 0.1, {hasta: rel(b2, 42) - 0.15}),
  dib('portatil', 300, 880, 300, rel(b2, 42) - 0.1, {hasta: rel(b2, 52) - 0.15}),
  dib('dni', 700, 880, 300, rel(b2, 46), {hasta: rel(b2, 52) - 0.15}),
  dib('oficina', 290, 880, 300, rel(b2, 52) - 0.1),
  dib('sobre', 290, 880, 200, rel(b2, 61) - 0.3, {mover: {x: 740, y: 880, en: rel(b2, 61) - 0.2, dur: 1.4, arco: 80}}),
  {tipo: 'notas', lineas: ['Oficina del Censo Electoral'], en: 0.3},
]);

// 3b · Fecha 2
const b4 = S(124);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`2 · ENVIARLO HASTA EL${NB}25\u201111`, 330, 0.05),
  rot(`CERTIFICADO Y${NB}GRATIS`, 520, rel(b3, 71) - 0.2, {hasta: rel(b3, 87) - 0.15}),
  {tipo: 'calendarioX', mes: 'NOVIEMBRE', primer: 6, dias: 30, y: 640, cw: 90, ch: 52, rellenos: [{d0: 19, d1: 25, en: rel(b3, 66), paso: 0.3}], aro: {d: 25, en: rel(b3, 76) - 0.3}, en: 0.2, hasta: rel(b3, 87) - 0.15},
  {tipo: 'selloTexto', lineas: ['CERTIFICADO'], x: 640, y: 1050, tamano: 56, angulo: -4, en: rel(b3, 71) + 0.3, desde: 40, hasta: rel(b3, 87) - 0.15},
  rot(`EN CORREOS, CON TU${NB}DNI`, 520, rel(b3, 87) - 0.1, {hasta: rel(b3, 102) - 0.15}),
  dib('persona', 300, 900, 300, rel(b3, 87) - 0.1, {forma: 'cuadrado', hasta: rel(b3, 102) - 0.15}),
  dib('dni', 690, 900, 280, rel(b3, 93), {hasta: rel(b3, 102) - 0.15}),
  rot(`SI VA OTRA${NB}PERSONA:`, 520, rel(b3, 102) - 0.1),
  rot(`AUTORIZACIÓN FIRMADA + COPIA DEL${NB}DNI`, 620, rel(b3, 108) - 0.2),
  dib('persona', 200, 980, 250, rel(b3, 102) - 0.1, {forma: 'circulo'}),
  dib('persona', 500, 980, 250, rel(b3, 104) - 0.1, {forma: 'triangulo'}),
  dib('firma', 200, 980, 200, rel(b3, 109) - 0.2, {mover: {x: 500, y: 980, en: rel(b3, 110), dur: 1.2, arco: 60}, hasta: rel(b3, 118) - 0.2}),
  dib('dni', 800, 1010, 210, rel(b3, 114)),
  dib('lista', 800, 800, 200, rel(b3, 118) - 0.1),
]);

// 3c · Fecha 3
const b5 = S(133);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`3 · DOMINGO 29\u201111: MESA CERRADA PARA${NB}TI`, 330, 0.05),
  urn(700, 900, 340, 0.3),
  {tipo: 'candadoMostaza', x: 700, y: 900, tamano: 200, en: rel(b4, 128) - 0.3},
  dib('persona', 180, 900, 280, 0.3, {mover: {x: 360, y: 900, en: rel(b4, 126), dur: 1.2}}),
  {tipo: 'notas', lineas: ['No podrás votar en tu mesa · Interior'], en: 0.3},
]);

// 4 · Giro
const b6 = S(150);
esc(b5, b6, {fondo: 'crema', fuente: 'Interior, 20-10-2026'}, [
  rot(`EN EL SOBRE DE VOTO,`, 330, 0.05, {hasta: rel(b5, 143) - 0.2}),
  rot(`NADA DE${NB}DNI`, 420, 0.05, {hasta: rel(b5, 143) - 0.2}),
  rot(`SI LO METES: VOTO${NB}NULO`, 330, rel(b5, 143) - 0.1),
  dib('sobre', 440, 900, 340, 0.2),
  dib('dni', 840, 760, 220, rel(b5, 139) - 0.3, {mover: {x: 560, y: 900, en: rel(b5, 139), dur: 0.8}, hasta: rel(b5, 139) + 1.0}),
  dib('dni', 560, 900, 220, rel(b5, 139) + 1.0, {mover: {x: 840, y: 1010, en: rel(b5, 139) + 1.0, dur: 0.8, arco: 60}, rot: 12, animEn: rel(b5, 139) + 1.0}),
  {tipo: 'selloTexto', lineas: ['NULO'], x: 500, y: 1040, tamano: 72, angulo: -8, en: rel(b5, 148) - 0.1, desde: 40},
]);

// 5a · Resumen
const b7 = S(163);
esc(b6, b7, {fondo: 'crema'}, [
  rot(`PEDIR${NB}19\u201111`, 330, 0.05),
  rot(`ENVIAR HASTA${NB}25\u201111`, 450, rel(b6, 154) - 0.1),
  rot(`29\u201111: MESA${NB}CERRADA`, 570, rel(b6, 158) - 0.1),
  dib('sobre', 300, 960, 280, 0.3),
  urn(720, 960, 300, rel(b6, 158) - 0.1),
]);
// 5b · Cierre
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierre', frase: `¿CORREO O${NB}URNA?`, tamano: 104, pulso: true}]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `VOTO POR${NB}CORREO:`, y: 330, tamano: 120, en: -1},
  {tipo: 'gancho', texto: `3${NB}FECHAS`, y: 590, tamano: 130, en: -1, resalta: '3'},
  {tipo: 'casillaX', texto: '1', x: 260, y: 960, w: 190, h: 100, desde: 0, en: -1},
  {tipo: 'casillaX', texto: '2', x: 540, y: 960, w: 190, h: 100, desde: 0, en: -1},
  {tipo: 'casillaX', texto: '3', x: 820, y: 960, w: 190, h: 100, desde: 0, en: -1},
  dib('sobre', 540, 1180, 320, -1),
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'wallpaper.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T0.duracion.toFixed(2));
