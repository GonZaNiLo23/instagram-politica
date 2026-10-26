// Utilidades comunes: rutas, localizar ffmpeg/ffprobe, cargar videos/.env (nunca se imprime ninguna clave).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

export const RAIZ_VIDEOS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const RAIZ = path.resolve(RAIZ_VIDEOS, '..');
export const REMOTION = path.join(RAIZ_VIDEOS, 'remotion');

export function cargarEnv() {
  const f = path.join(RAIZ_VIDEOS, '.env');
  if (!fs.existsSync(f)) return;
  for (const l of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

function buscarWinget(exe) {
  const base = path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages');
  if (!fs.existsSync(base)) return null;
  const pila = [base];
  while (pila.length) {
    const d = pila.pop();
    for (const e of fs.readdirSync(d, {withFileTypes: true})) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) pila.push(p);
      else if (e.name.toLowerCase() === exe) return p;
    }
  }
  return null;
}

function localiza(nombre) {
  const r = spawnSync(nombre, ['-version'], {stdio: 'ignore'});
  if (!r.error) return nombre;
  return buscarWinget(nombre + '.exe') || nombre;
}
export const FFMPEG = localiza('ffmpeg');
export const FFPROBE = localiza('ffprobe');

export function ejecutar(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {encoding: 'utf8', maxBuffer: 1 << 28, ...opts});
  if (r.error) throw r.error;
  return r;
}

export function duracionAudio(f) {
  const r = ejecutar(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]);
  return parseFloat(r.stdout);
}

export function rutaPieza(id) {
  return path.join(RAIZ_VIDEOS, 'piezas', id);
}
