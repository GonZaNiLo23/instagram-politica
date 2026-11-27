// 081 · Devolución 14 días en compras online
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T.duracion + 1.6);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const NB = ' ';

// Índices: 13 Cuentan · 19 no(desde) · 23 La · 33 avisas · 37 recibir · 40 Ojo · 48 Salvo · 58 No vale · 63 personalizados · 64 perecederos · 66 precintados · 71 Si
const b1 = S(13), b2 = S(23), b3 = S(40), b4 = S(48), b5 = S(58), b6 = S(71);

const FOTO = 'Foto: HireAHelper (CC BY 2.0)';
esc(0, b1, {fondo: 'crema'}, [
  {tipo: 'gancho', texto: `14${NB}DÍAS PARA${NB}ECHARTE ATRÁS`, y: 330, tamano: 104, en: -1},
  {tipo: 'calDev', y: 700, x: 530, cel: 92, en: 0.1},
  {tipo: 'recorte', src: 'paquete.png', x: 285, y: 920, ancho: 400, giro: -4, desde: 'abajo', en: 0.05, notas: ['Compra online · Fuente: BOE'], credito: FOTO},
]);
esc(b1, b2, {fondo: 'crema'}, [
  rot(`Plazo: desde la${NB}recepción`, 330, 0.05),
  rot(`Oferta o no: no es${NB}excepción`, 510, rel(b1, 19) - 0.9),
  {tipo: 'plazoDev', y: 980, en: 0.2, arranque: rel(b1, 16)},
]);
esc(b2, b3, {fondo: 'crema'}, [
  rot(`Reembolso: 14 días${NB}desde tu aviso`, 330, 0.05),
  rot(`Mismo medio de pago`, 510, rel(b2, 34) - 0.5),
  {tipo: 'reembDev', y: 980, en: 0.2, viaje: rel(b2, 36), dinero: rel(b2, 36) + 1.0},
]);
esc(b3, b5, {fondo: 'crema'}, [
  rot(`Devolución: la pagas${NB}tú`, 330, 0.05, {hasta: rel(b3, 48) - 0.15}),
  rot(`Salvo que la tienda lo${NB}asuma`, 330, rel(b3, 48) - 0.05),
  {tipo: 'envioDev', y: 600, cambia: rel(b3, 48) + 0.1},
]);
esc(b5, b6, {fondo: 'crema'}, [
  rot(`Fuera: a medida, perecederos, precintados`, 330, 0.05),
  {tipo: 'selloTexto', lineas: ['art. 103'], x: 540, y: 590, en: 0.4, desde: 40, angulo: -4},
  {tipo: 'excluidosDev', y: 760, ens: [0.6, rel(b5, 64) - 0.1, rel(b5, 66) - 0.1]},
]);
esc(b6, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: `¿LO DEVUELVES O${NB}TE LO QUEDAS?`, cta: 'siguenos', tamano: 84, yGuardalo: 1240, pulso: true, sinFuentes: true},
  {tipo: 'recorte', src: 'paquete.png', x: 540, y: 985, ancho: 460, giro: -3, desde: 'escala', en: 0.1},
  {tipo: 'abSerie', a: 'Lo devuelves', b: 'Te lo quedas', y: 800, en: rel(b6, 76) },
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', sinMarca: true, componentes: [
  {tipo: 'gancho', texto: `14${NB}DÍAS PARA${NB}ECHARTE ATRÁS`, y: 340, tamano: 104, en: -1},
  {tipo: 'calDev', y: 710, x: 530, cel: 92, en: -5},
  {tipo: 'recorte', src: 'paquete.png', x: 285, y: 930, ancho: 400, giro: -4, desde: 'escala', en: -5},
]}]};
const out = {plantilla: 'flash', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, subDy: 45, musica: {pista: 'wallpaper.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
