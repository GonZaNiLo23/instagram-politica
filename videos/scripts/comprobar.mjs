// Uso: node videos/scripts/comprobar.mjs NNN-slug [--v=v1]
// Comprueba un render antes de entregarlo (lo llama render.mjs al terminar; también se puede lanzar solo).
// Detecta los fallos mecánicos que más devuelve revisor-video:
//  1. Literalidad: rótulos, notas y sellos de escenas.json que no aparecen tal cual en el guion aprobado.
//  2. Tiempo de lectura: < 1 s por cada 3 palabras (regla 7 del feedback), con rótulos, notas y sellos.
//  3. Borde derecho: algo que entra en x > 960 dentro de la zona segura vertical (regla 4), también al animar.
//  4. Quietud: > 3 s sin movimiento en la zona de contenido, sin contar los subtítulos (regla 5).
//  5. Zona de subtítulos: elementos de escenas.json con y dentro de la franja de los subtítulos.
// Sale con código 0 siempre: imprime "COMPROBAR: OK" o la lista de avisos. Los avisos no sustituyen la revisión.
import fs from 'node:fs';
import path from 'node:path';
import {FFMPEG, RAIZ, RAIZ_VIDEOS, ejecutar, rutaPieza} from './herramientas.mjs';

const [id, ...resto] = process.argv.slice(2);
if (!id) { console.error('Uso: node videos/scripts/comprobar.mjs NNN-slug [--v=v1]'); process.exit(1); }
const version = (resto.find((a) => a.startsWith('--v=')) || '--v=v1').split('=')[1];
const dir = rutaPieza(id);
const video = path.join(RAIZ_VIDEOS, 'renders', `${id}-${version}.mp4`);
const esc = JSON.parse(fs.readFileSync(path.join(dir, 'escenas.json'), 'utf8'));
const avisos = [];
const t2 = (s) => s.toFixed(2);

// ---------- Textos de escenas.json ----------
// Recorre los componentes y devuelve los que llevan texto, con su intervalo visible en tiempo absoluto.
const TEXTO = (c) => [c.texto, ...(Array.isArray(c.lineas) ? c.lineas : [])].filter((x) => typeof x === 'string' && x.trim());
const textos = [];
for (const e of esc.escenas) {
  const comps = (e.componentes || []).filter((c) => c && typeof c === 'object');
  comps.forEach((c, i) => {
    const t = TEXTO(c);
    if (!t.length || c.tipo === 'cierre') return;
    const desde = e.inicio + Math.max(0, c.en ?? 0);
    // Un rótulo posterior en la misma y lo sustituye (patrón de los generadores)
    const sig = comps.slice(i + 1).find((d) => d.tipo === c.tipo && d.y === c.y && (d.en ?? 0) > (c.en ?? 0));
    let hasta = e.fin;
    if (typeof c.hasta === 'number') hasta = Math.min(hasta, e.inicio + c.hasta);
    if (sig) hasta = Math.min(hasta, e.inicio + sig.en);
    textos.push({tipo: c.tipo, texto: t.join(' '), lineas: t, desde, hasta, y: c.y});
  });
}

// 1. Literalidad frente al guion aprobado (normaliza mayúsculas, espacios duros y guiones especiales)
const guionF = path.join(RAIZ, 'guiones', 'aprobados', `${id}.md`);
if (fs.existsSync(guionF)) {
  const norm = (s) => s.normalize('NFC').toLowerCase()
    .replace(/[   ]/g, ' ').replace(/[‐‑‒–—]/g, '-').replace(/⁠/g, '')
    .replace(/[*"“”«»`]/g, '').replace(/\s+/g, ' ').trim();
  const guion = norm(fs.readFileSync(guionF, 'utf8'));
  const vistos = new Set();
  for (const x of textos) for (const l of x.lineas) {
    const n = norm(l);
    if (n.length < 4 || vistos.has(n)) continue;
    vistos.add(n);
    if (!guion.includes(n)) avisos.push(`LITERAL: "${l}" (${x.tipo}, ${t2(x.desde)} s) no aparece tal cual en el guion`);
  }
} else avisos.push(`LITERAL: no encuentro ${guionF}; no se comprobó la literalidad`);

// 2. Tiempo de lectura: ≥ 1 s por cada 3 palabras (mínimo 0,7 s para rótulos de 1–2 palabras)
for (const x of textos) {
  const palabras = x.texto.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  const necesita = Math.max(0.7, palabras / 3);
  const dura = x.hasta - x.desde;
  if (dura + 0.05 < necesita) avisos.push(`LECTURA: "${x.texto.slice(0, 50)}" (${x.tipo}) ${palabras} pal. en ${t2(dura)} s, necesita ${t2(necesita)} s (${t2(x.desde)}–${t2(x.hasta)} s)`);
}

// 5. Franja de subtítulos: textos o elementos con y declarada dentro de ella
const subY0 = 1180 + (esc.subDy ?? 0), subY1 = 1330 + (esc.subDy ?? 0);
for (const e of esc.escenas) for (const c of e.componentes || []) {
  if (typeof c?.y === 'number' && c.y >= subY0 - 40 && c.y <= subY1 && c.tipo !== 'notas') {
    avisos.push(`SUBTÍTULOS: ${c.tipo} con y=${c.y} en ${t2(e.inicio + Math.max(0, c.en ?? 0))}–${t2(e.fin)} s cae en la franja de subtítulos (${subY0}–${subY1}); míralo en un fotograma`);
  }
}

// ---------- Comprobaciones sobre píxeles ----------
if (!fs.existsSync(video)) {
  avisos.push(`VÍDEO: no existe ${video}; solo se comprobó escenas.json`);
} else {
  const tiemposSelect = (vf) => {
    const r = ejecutar(FFMPEG, ['-hide_banner', '-i', video, '-vf', `${vf},showinfo`, '-an', '-f', 'null', '-']);
    return [...(r.stderr || '').matchAll(/pts_time:([\d.]+)/g)].map((m) => +m[1]);
  };
  const intervalos = (ts, hueco) => {
    const out = [];
    for (const t of ts) {
      const u = out[out.length - 1];
      if (u && t - u[1] <= hueco) u[1] = t; else out.push([t, t]);
    }
    return out;
  };

  // 3. Borde derecho (x 961–1079, y 250–1500): cambios en la franja que no son un cambio de fondo de toda la pantalla
  const borde = tiemposSelect("crop=118:1250:961:250,select='gt(scene,0.0005)'");
  const cortes = tiemposSelect("select='gt(scene,0.25)'");
  const enBorde = borde.filter((t) => t > 0.1 && !cortes.some((c) => Math.abs(c - t) <= 0.15));
  for (const [a, b] of intervalos(enBorde, 0.2)) {
    avisos.push(`BORDE: algo cruza x 960 entre ${t2(a)} y ${t2(b + 1 / 30)} s; míralo con crop=200:1250:880:250 en ese momento`);
  }

  // 4. Quietud en la zona de contenido (y 250–1150, sin subtítulos), muestreando a 2 fps
  const mov = tiemposSelect("crop=1080:900:0:250,fps=2,select='gt(scene,0.004)'");
  const dur = parseFloat((ejecutar(FFMPEG, ['-hide_banner', '-i', video, '-f', 'null', '-']).stderr.match(/Duration: (\d+):(\d+):([\d.]+)/) || []).slice(1).reduce((s, x, i) => s + x * [3600, 60, 1][i], 0));
  // El cierre de plantilla es estático por diseño: se mide hasta que empieza
  const cierre = esc.escenas.find((e) => (e.componentes || []).some((c) => c?.tipo === 'cierre'));
  const finMedida = cierre ? cierre.inicio : dur;
  const puntos = [0, ...mov.filter((t) => t < finMedida), finMedida];
  for (let i = 1; i < puntos.length; i++) {
    if (puntos[i] - puntos[i - 1] > 3) avisos.push(`QUIETUD: ${t2(puntos[i] - puntos[i - 1])} s sin movimiento en la zona de contenido (${t2(puntos[i - 1])}–${t2(puntos[i])} s)`);
  }
}

if (avisos.length) {
  console.log(`COMPROBAR: ${avisos.length} aviso(s). Corrígelos o justifica cada uno al coordinador:`);
  avisos.forEach((a) => console.log(`- ${a}`));
} else console.log('COMPROBAR: OK (literalidad, lectura, borde, quietud y franja de subtítulos)');
