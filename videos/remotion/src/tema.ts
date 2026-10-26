import {loadFont as loadArchivo} from '@remotion/google-fonts/ArchivoBlack';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

const archivo = loadArchivo();
const inter = loadInter('normal', {weights: ['600', '700'], subsets: ['latin', 'latin-ext']});
const mono = loadMono('normal', {weights: ['700'], subsets: ['latin', 'latin-ext']});

export const C = {
  crema: '#F4EFE6',
  tinta: '#14213D',
  mostaza: '#F2B134',
  turquesa: '#2A9D8F',
  piedra: '#8D99AE',
  teja: '#C8553D', // solo sello MITO y aspas de "no"
} as const;

export const F = {
  titular: `${archivo.fontFamily}, sans-serif`,
  texto: `${inter.fontFamily}, sans-serif`,
  cifra: `${mono.fontFamily}, monospace`,
};

// Lienzo 1080x1920 y zonas seguras de Instagram (guia de estilo)
export const W = 1080;
export const H = 1920;
export const SEGURA = {
  arriba: 250,
  abajo: H - 420, // 1500
  izq: 60,
  der: W - 120, // 960
  ancho: W - 120 - 60, // 900
};
// Banda de subtitulos (guia: y ~ 1150-1400)
export const SUBS = {y: 1150, alto: 250};

export type Fondo = 'crema' | 'tinta' | 'mostaza';
export const colorFondo = (f: Fondo) => C[f];
export const colorTextoSobre = (f: Fondo) => (f === 'tinta' ? C.crema : C.tinta);

// Colores de partidos: SOLO para hemiciclos. Misma saturacion, siempre con nombre en rotulo.
export const PARTIDOS: Record<string, string> = {
  PP: '#3B8EDB',
  PSOE: '#D8493E',
  VOX: '#5BAA4B',
  SUMAR: '#C9488A',
  ERC: '#E5A93C',
  JUNTS: '#2FB5B0',
  BILDU: '#9ACD32',
  PNV: '#3D8A5C',
  OTROS: '#8D99AE',
};
