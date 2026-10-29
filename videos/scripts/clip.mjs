// Prepara el clip real de una pieza "Al minuto": une los tramos elegidos, lo pasa a vertical 1080×1920 (recorte centrado o
// con fondo desenfocado) y pixela caras de particulares con cajas.
// Uso: node videos/scripts/clip.mjs NNN-slug <origen.mp4> --tramos=12-24,65-73 [--modo=recorte|fondo] [--foco=0.5]
//        [--pixelar=x,y,ancho,alto@desde-hasta;…] [--salida=clip.mp4]
//  --tramos   segundos del vídeo ORIGINAL (inicio-fin), en orden; se concatenan.
//  --modo     recorte: llena la pantalla recortando los lados (por defecto); fondo: vídeo entero centrado sobre una copia desenfocada.
//  --foco     0..1, posición horizontal del recorte (0,5 = centro).
//  --pixelar  cajas en px del vídeo FINAL 1080×1920 y segundos del vídeo FINAL. Para caras de particulares (guía de estilo).
// Deja videos/piezas/NNN-slug/clips/<salida> y un fotograma de control por tramo en clips/control-*.png.
import '../../herramientas/publicar-api/ocultar.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {FFMPEG, ejecutar, rutaPieza} from './herramientas.mjs';

const [id, origen, ...resto] = process.argv.slice(2);
const arg = (k, d) => (resto.find((a) => a.startsWith(`--${k}=`)) || '').split('=').slice(1).join('=') || d;
if (!id || !origen || !fs.existsSync(origen)) { console.error('Uso: node videos/scripts/clip.mjs NNN-slug <origen.mp4> --tramos=a-b,c-d [--modo=recorte|fondo] [--foco=0.5] [--pixelar=x,y,w,h@a-b;…]'); process.exit(1); }
const tramos = arg('tramos', '').split(',').filter(Boolean).map((t) => t.split('-').map(Number));
if (!tramos.length || tramos.some(([a, b]) => !(b > a))) { console.error('--tramos no válido (p. ej. 12-24,65-73)'); process.exit(1); }
const modo = arg('modo', 'recorte');
const foco = Number(arg('foco', '0.5'));
const cajas = arg('pixelar', '').split(';').filter(Boolean).map((c) => {
  const [r, t] = c.split('@');
  const [x, y, w, h] = r.split(',').map(Number);
  const [a, b] = (t || '0-9999').split('-').map(Number);
  return {x, y, w, h, a, b};
});
const dir = path.join(rutaPieza(id), 'clips');
fs.mkdirSync(dir, {recursive: true});
const salida = path.join(dir, arg('salida', 'clip.mp4'));

// 1. Tramos → vertical, cada uno por separado (mismo formato) y concatenados
const vert = modo === 'fondo'
  ? '[v0]split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:3,eq=brightness=-0.15[f];[b]scale=1080:-2[c];[f][c]overlay=(W-w)/2:(H-h)/2'
  : `[v0]scale=-2:1920,crop=1080:1920:(iw-1080)*${foco}:0`;
const partes = tramos.map(([a, b], i) => {
  const p = path.join(dir, `_tramo${i}.mp4`);
  const r = ejecutar(FFMPEG, ['-y', '-v', 'error', '-ss', String(a), '-to', String(b), '-i', origen,
    '-filter_complex', `[0:v]fps=30,setsar=1[v0];${vert},format=yuv420p[v]`, '-map', '[v]', '-map', '0:a?',
    '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-c:a', 'aac', '-ar', '48000', '-ac', '2', '-b:a', '192k', p]);
  if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
  return p;
});
const lista = path.join(dir, '_lista.txt');
fs.writeFileSync(lista, partes.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
const unido = cajas.length ? path.join(dir, '_unido.mp4') : salida;
let r = ejecutar(FFMPEG, ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', unido]);
if (r.status !== 0) { console.error(r.stderr); process.exit(1); }

// 2. Pixelado de caras (bloques de ~24 px) en las cajas y tiempos indicados
if (cajas.length) {
  let fc = '[0:v]null[b0]';
  cajas.forEach((c, i) => {
    fc += `;[0:v]crop=${c.w}:${c.h}:${c.x}:${c.y},scale=${Math.max(2, Math.round(c.w / 24))}:-2,scale=${c.w}:${c.h}:flags=neighbor[p${i}]`;
    fc += `;[b${i}][p${i}]overlay=${c.x}:${c.y}:enable='between(t,${c.a},${c.b})'[b${i + 1}]`;
  });
  r = ejecutar(FFMPEG, ['-y', '-v', 'error', '-i', unido, '-filter_complex', fc, '-map', `[b${cajas.length}]`, '-map', '0:a?',
    '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-c:a', 'copy', salida]);
  if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
  fs.rmSync(unido, {force: true});
}
for (const p of [...partes, lista]) fs.rmSync(p, {force: true});

// 3. Control: un fotograma a mitad de cada tramo
let t0 = 0;
tramos.forEach(([a, b], i) => {
  ejecutar(FFMPEG, ['-y', '-v', 'error', '-ss', String(t0 + (b - a) / 2), '-i', salida, '-frames:v', '1', path.join(dir, `control-${i + 1}.png`)]);
  t0 += b - a;
});
const total = tramos.reduce((s, [a, b]) => s + b - a, 0);
console.log(`Clip: ${salida} · ${total.toFixed(1)} s · ${tramos.length} tramo(s) · ${cajas.length} caja(s) pixelada(s) · control en ${dir}`);
