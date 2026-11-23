// 067 · DNI digital el 29-N. Lee tiempos-fonetico.json (índices originales, "de ene i" / "mi de ene i") y escribe tiempos.json (DNI, MiDNI fusionados) y escenas.json.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const fon = path.join(dir, 'tiempos-fonetico.json');
if (!fs.existsSync(fon)) fs.copyFileSync(path.join(dir, 'tiempos.json'), fon);
const T0 = JSON.parse(fs.readFileSync(fon, 'utf8'));
const pal = [];
for (let i = 0; i < T0.palabras.length; i++) {
  const w = T0.palabras[i];
  const n1 = T0.palabras[i + 1], n2 = T0.palabras[i + 2], n3 = T0.palabras[i + 3];
  const lw = w.t.toLowerCase().replace('¿', '');
  if (lw === 'mi' && n1?.t === 'de' && n2?.t === 'ene' && n3?.t.startsWith('i')) {
    pal.push({t: 'MiDNI' + n3.t.slice(1), inicio: w.inicio, fin: n3.fin});
    i += 3;
  } else if (lw === 'de' && n1?.t === 'ene' && n2?.t.startsWith('i')) {
    pal.push({t: (w.t.startsWith('¿') ? '¿' : '') + 'DNI' + n2.t.slice(1), inicio: w.inicio, fin: n2.fin});
    i += 2;
  } else pal.push(w);
}
fs.writeFileSync(path.join(dir, 'tiempos.json'), JSON.stringify({...T0, palabras: pal}, null, 2));
const t = (i) => T0.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T0.duracion + 1.8);
const NB = ' ';
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});

// 1 · Gancho (palabra 13 = "La")
const b1 = S(13);
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `DNI DIGITAL EN${NB}LA MESA`, y: 330, tamano: 120, en: -1},
  {tipo: 'movilDni', x: 540, y: 900, esc: 1.4, en: -1, qrEn: 0.7, zoomDesde: 1.5},
]);

// 2 · Primera prueba (13 "La" -> 42 "Son")
const b2 = S(42);
esc(b1, b2, {fondo: 'crema'}, [
  {tipo: 'foto', src: 'urna.jpg', x: 500, y: 960, ancho: 880, alto: 560, foco: '50% 50%', velo: 0.55, en: 0},
  {tipo: 'notas', lineas: ['Fuente: Interior, 6-11-2026', 'Foto: Américo Toledano, CC BY-SA 4.0'], en: 0.2},
  rot(`Código QR${NB}temporal`, 330, 0.05),
  {tipo: 'movilDni', x: 320, y: 930, esc: 1.2, en: 0.1, qrEn: 0.4},
  {tipo: 'lectorDni', x: 740, y: 930, esc: 1.2, en: rel(b1, 28), tick: 2.3, haz: 0.3},
]);

// 3 · Terminales (42 "Son" -> 50 "También")
const b3 = S(50);
esc(b2, b3, {fondo: 'crema'}, [
  {tipo: 'contador', desde: 60000, hasta: 60000, prefijo: 'Más de ', etiqueta: 'terminales', y: 420, tamano: 104, en: 0.05, dur: 0.05},
  {tipo: 'lectorDni', x: 250, y: 960, esc: 1.0, en: 0.2, tick: 0.8, haz: 0.1},
  {tipo: 'lectorDni', x: 540, y: 960, esc: 1.0, en: 0.5, tick: 1.1, haz: 0.1},
  {tipo: 'lectorDni', x: 830, y: 960, esc: 1.0, en: 0.8, tick: 1.4, haz: 0.1},
]);

// 4 · Documentos (50 "También" -> 65 "El")
const b4 = S(65);
esc(b3, b4, {fondo: 'crema'}, [
  rot(`Valen: DNI · pasaporte${NB}· permiso`, 330, 0.05),
]);
const doc = (nombre, x, a, extra = {}) => ({tipo: 'docDni', tipoDoc: nombre, x, y: 950, esc: 1.0, en: a, marca: 'tick', marcaEn: 0.5, marcaDy: 170, ...extra});
ESC[ESC.length - 1].componentes.push(
  doc('dni', 230, rel(b3, 53) - 0.2),
  doc('pasaporte', 520, rel(b3, 58) - 0.2),
  doc('permiso', 800, rel(b3, 61) - 0.2),
);

// 5 · Giro (65 "El" -> 78 "Se")
const b5 = S(78);
esc(b4, b5, {fondo: 'crema'}, [
  rot(`Resguardo del DNI:${NB}no vale`, 330, 0.05),
  {tipo: 'docDni', tipoDoc: 'resguardo', x: 400, y: 900, esc: 1.6, en: 0.2, marca: 'cruz', marcaEn: rel(b4, 73) - 0.1 - 0.2, marcaDx: 350, marcaDy: 0},
]);

// 6a · Horas (78 "Se" -> 85 "¿DNI")
const b6 = S(85);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`Domingo 29‑N${NB}· 9:00–20:00`, 330, 0.05),
  {tipo: 'horasDni', y: 900, en: 0.3, dur: rel(b5, 84) - 0.3},
]);

// 6b · Pregunta (85 -> 95 "Síguenos")
const b7 = S(95);
esc(b6, b7, {fondo: 'crema'}, [
  {tipo: 'lineaDni', x: 540, y0: 380, y1: 1120, en: 0.1},
  {tipo: 'movilDni', x: 290, y: 820, esc: 1.2, en: 0.2, qrEn: 0.3},
  {tipo: 'docDni', tipoDoc: 'cartera', x: 760, y: 820, esc: 1.4, en: 0.4},
  {tipo: 'etiquetaDni', texto: 'MÓVIL', x: 290, y: 1110, en: rel(b6, 88) - 0.1},
  {tipo: 'etiquetaDni', texto: 'CARTERA', x: 780, y: 1110, en: rel(b6, 93) - 0.1},
]);

// Cierre
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [{tipo: 'cierre', frase: `¿MÓVIL O${NB}CARTERA?`, tamano: 104, pulso: true}]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `DNI EN EL MÓVIL:`, y: 330, tamano: 110, en: -1},
  {tipo: 'gancho', texto: `ASÍ SE VOTA`, y: 640, tamano: 120, en: -1},
  {tipo: 'movilDni', x: 540, y: 1200, esc: 1.35, en: -1, qrEn: -1},
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'wallpaper.mp3', volumen: -16}, portada, escenas: ESC};
// Los docDni usan `tipo` como nombre del componente: el documento va en `doc`
for (const e of ESC) for (const c of e.componentes) if (c.tipoDoc) { c.doc = c.tipoDoc; delete c.tipoDoc; }
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T0.duracion.toFixed(2));
