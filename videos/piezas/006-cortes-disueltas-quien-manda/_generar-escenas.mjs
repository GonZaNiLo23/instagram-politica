// Reanclaje del montaje v1 (aprobado) a la voz definitiva. Origen: _prov/escenas.json (tiempos de la voz provisional x1.1).
// Cambios del informe v1: CTA en pantalla (prop pregunta del cierre), pin 📌 (ya en Cierre.tsx), subtítulos sin palabra huérfana.
import fs from 'node:fs';
const d = new URL('.', import.meta.url);
const rd = (f) => JSON.parse(fs.readFileSync(new URL(f, d), 'utf8'));
const P = rd('_prov/tiempos.json').palabras, N = rd('tiempos.json');
const knots = [[0, 0], ...P.map((w, i) => [w.inicio * 1.1, N.palabras[i].inicio])];
const finNuevo = +(N.duracion + 1.9).toFixed(2);
knots.push([84, finNuevo]);
const f = (x) => {
  for (let i = 1; i < knots.length; i++) {
    if (x <= knots[i][0] + 1e-9) { const [a, b] = knots[i - 1], [c, e] = knots[i]; return c === a ? e : b + ((x - a) / (c - a)) * (e - b); }
  }
  return knots.at(-1)[1];
};
const r2 = (x) => +x.toFixed(2);
const REL = new Set(['en', 'hasta', 'animEn', 'ocultarEn']);
const warp = (o, ini, nIni) => {
  if (Array.isArray(o)) return o.map((x) => warp(x, ini, nIni));
  if (o && typeof o === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(o)) {
      if (REL.has(k) && typeof v === 'number' && v >= 0 && v < 50) out[k] = Math.max(0, r2(f(ini + v) - nIni));
      else out[k] = warp(v, ini, nIni);
    }
    return out;
  }
  return o;
};
const E = rd('_prov/escenas.json');
const bordes = E.escenas.map((s) => s.inicio).concat(E.escenas.at(-1).fin).map((x) => r2(f(x)));
E.escenas = E.escenas.map((s, i) => {
  const n = {...warp(s, s.inicio, bordes[i]), inicio: bordes[i], fin: bordes[i + 1]};
  const cierre = n.componentes.find((c) => c.tipo === 'cierre');
  if (cierre) cierre.pregunta = 'Cuéntamelo en comentarios';
  return n;
});
E.duracion = bordes.at(-1);
E.subSinHuerfanas = true;
fs.writeFileSync(new URL('escenas.json', d), JSON.stringify(E, null, 2));
console.log(E.escenas.map((s) => s.inicio + '-' + s.fin).join(' '), E.duracion);

// Vuelta 3: rótulo 8 hasta 36,9 s (cronómetro +0,35 s), cierre estático < 3 s, fuente del cierre sin prefijo.
{
  const E2 = rd('escenas.json'), S = E2.escenas;
  const i8 = S.findIndex((s) => s.componentes.some((c) => (c.texto || '').startsWith('NO PUEDE AFECTAR')));
  const dd = +(36.9 - S[i8].fin).toFixed(2);
  S[i8].fin = 36.9; S[i8 + 1].inicio = 36.9;
  const sh = (o) => { if (Array.isArray(o)) o.forEach(sh); else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { if (REL.has(k) && typeof v === 'number' && v >= 0 && v < 50) o[k] = Math.max(0, r2(v - dd)); else sh(v); } };
  sh(S[i8 + 1].componentes);
  const cr = S[i8 + 1].componentes.find((c) => c.tipo === 'cronometro'); cr.en = 0.18; // abs 37,08 s = 36,73 + 0,35
  S.at(-1).fin = 78.0; E2.duracion = 78.0;
  const f17 = S.find((s) => (s.fuente || '').startsWith('Fuente: RD 806/2026, art. 5'));
  f17.fuente = f17.fuente.replace(/^Fuente: /, ''); f17.fuenteSinPrefijo = true;
  fs.writeFileSync(new URL("escenas.json", d), JSON.stringify(E2, null, 2));
}
