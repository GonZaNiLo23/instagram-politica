// 053 · Compra ahora, paga después (directiva 2023/2225). Estándar ~45 s. Sin componentes nuevos.
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
const nota = (lineas, en = 0.3) => ({tipo: 'notas', lineas, en, tamano: 40});
const ico = (nombre, x, y, tamano, en, o = {}) => ({tipo: 'icono', nombre, x, y, tamano, en, ...o});
const dib = (nombre, x, y, tamano, en, o = {}) => ({tipo: 'dib', nombre, x, y, tamano, en, ...o});
const cas = (texto, x, y, en, o = {}) => ({tipo: 'casillaX', texto, x, y, w: 230, h: 110, desde: 0, en, ...o});

// 1 · Gancho
const b1 = S(14);
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `¿Pagas en 3${NB}plazos?`, y: 330, tamano: 120, en: -1},
  ico('movil', 540, 950, 320, -1, {hasta: 1.0}),
  cas('1/3', 220, 950, 1.0, {hasta: 2.3}), cas('1/3', 520, 950, 1.0, {hasta: 2.3}), cas('1/3', 820, 950, 1.0, {hasta: 2.3}),
  rot(`Viernes 20-11 · Directiva UE${NB}2023/2225`, 620, 2.4),
  ico('calendario', 540, 1000, 300, 2.4, {mes: 'VIE', dia: '20'}),
]);
// 2 · Primera prueba
const b2 = S(34);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`Compra ahora, paga después =${NB}crédito`, 330, 0.05),
  nota([`Con un prestamista de por medio · cons.${NB}16`], 0.5),
  ico('carrito', 200, 1040, 200, 0.4), ico('documento', 540, 1040, 200, rel(b1, 18)), dib('persona', 840, 1040, 200, rel(b1, 22), {forma: 'circulo'}),
  {tipo: 'selloTexto', lineas: ['CRÉDITO'], x: 540, y: 560, tamano: 80, angulo: -5, en: rel(b1, 28) - 0.1, desde: 40},
  {tipo: 'selloTexto', lineas: [`0${NB}%`, 'INTERESES'], x: 440, y: 720, tamano: 56, angulo: 4, en: rel(b1, 30) - 0.1, desde: 40},
]);
// 2b · Lo que cambia
const b3 = S(52);
esc(b2, b3, {fondo: 'crema'}, [
  rot(`Ley española 2011:${NB}fuera`, 330, 0.05, {hasta: rel(b2, 47) - 0.15}),
  rot(`UE: dentro (con${NB}excepciones)`, 330, rel(b2, 47) - 0.1),
  rot(`Menos de 200${NB}€`, 520, 0.3),
  ico('aspa', 300, 840, 220, 0.8, {etiqueta: 'ES'}),
  ico('check', 740, 840, 220, rel(b2, 47) - 0.1, {etiqueta: 'UE'}),
  nota([`Ley 16/2011, art. 3.c · Directiva, art.${NB}2`], 0.2),
]);
// 2c · España
const b4 = S(68);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`Plazo UE:${NB}20-11-2025`, 330, 0.05),
  rot(`España: anteproyecto${NB}7-1-2026`, 470, rel(b3, 59) - 0.1),
  rot(`Aún no es${NB}ley`, 650, rel(b3, 64) - 0.1),
  ico('calendario', 160, 800, 200, 0.3, {mes: 'NOV', dia: '20', etiqueta: '2025', anchoEtiqueta: 280}),
  ico('documento', 450, 800, 200, rel(b3, 59) - 0.1),
  ico('calendario', 740, 800, 200, rel(b3, 64) - 0.1, {mes: 'NOV', dia: '20', etiqueta: '2026', anchoEtiqueta: 280}),
  {tipo: 'selloTexto', lineas: ['SIN LEY'], x: 450, y: 1000, tamano: 84, angulo: -5, en: rel(b3, 64) + 0.2, desde: 40},
]);
// 3 · Explicación
const b5 = S(100);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`1 · Evaluar si puedes${NB}pagar`, 330, 0.05, {hasta: rel(b4, 80) - 0.15}),
  rot(`2 · TAE antes de${NB}firmar`, 330, rel(b4, 80) - 0.1, {hasta: rel(b4, 92) - 0.15}),
  rot(`3 · 14 días para echarte${NB}atrás`, 330, rel(b4, 92) - 0.1),
  rot(`Coste total, % anual`, 520, rel(b4, 87) - 0.1, {hasta: rel(b4, 92) - 0.15}),
  ico('lupaPlaca', 540, 900, 340, 0.3, {hasta: rel(b4, 80) - 0.15}),
  {tipo: 'selloTexto', lineas: ['TAE'], x: 540, y: 900, tamano: 140, angulo: -4, en: rel(b4, 80) + 0.1, desde: 40, hasta: rel(b4, 92) - 0.15},
  ico('calendario', 540, 900, 320, rel(b4, 92) - 0.1, {mes: 'DÍAS', dia: '14'}),
  nota([`Directiva, arts. 18, 10 y${NB}26`], 0.3),
]);
// 4 · Giro
const b6 = S(110);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`Créditos vigentes el 20-11: en general,${NB}fuera`, 330, 0.05),
  dib('oficina', 250, 1000, 200, 0.4),
  {tipo: 'selloTexto', lineas: ['VIGENTE'], x: 400, y: 780, tamano: 56, angulo: -6, en: 0.9, desde: 40},
  ico('calendario', 800, 1000, 200, 0.6, {mes: 'NOV', dia: '20'}),
  nota([`Salvo los de duración indefinida, en parte (art.${NB}2.2.l)`], 0.2),
]);
// 5 · Cierre
const b7 = S(119);
esc(b6, b7, {fondo: 'crema'}, [
  rot(`¿Crédito… o solo un${NB}pago?`, 330, 0.05),
  cas('A', 260, 900, 0.05, {w: 240, h: 150}), cas('B', 700, 900, 0.3, {w: 240, h: 150}),
]);
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierre', frase: `¿Crédito… o solo un${NB}pago?`, cta: 'siguenos', tamano: 72, pulso: true}]);
// Tercio inferior: bajar y ampliar iconos y casillas
for (const e of ESC) for (const c of e.componentes) { if (['icono','dib','casillaX','selloTexto'].includes(c.tipo)) { c.y += 80; if (c.tamano >= 200 && c.tipo !== 'selloTexto') c.tamano = Math.round(c.tamano * 1.1); } }
const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `¿Pagas en 3${NB}plazos?`, y: 330, tamano: 120, en: -1},
  cas('1/3', 220, 950, -1), cas('1/3', 520, 950, -1), cas('1/3', 820, 950, -1),
  rot(`Viernes 20-11 · Directiva UE${NB}2023/2225`, 620, -1)]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 120, musica: {pista: 'wallpaper.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
