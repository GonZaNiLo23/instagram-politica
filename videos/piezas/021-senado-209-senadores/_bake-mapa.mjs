// Genera remotion/src/componentes/datosMapaSenado.ts a partir de un GeoJSON de provincias (click_that_hood, Natural Earth/IGN simplificado).
// Uso: node _bake-mapa.mjs <geojson> <salida.ts>
import fs from 'node:fs';
const [,, inp, out] = process.argv;
const g = JSON.parse(fs.readFileSync(inp, 'utf8'));
const K = 200, COS = Math.cos(40 * Math.PI / 180);
const pr = (lon, lat, lon0, lat1) => [(lon - lon0) * COS * K, (lat1 - lat) * K];
const dp0 = (pts, tol) => {
  if (pts.length < 3) return pts;
  const keep = new Array(pts.length).fill(false); keep[0] = keep[pts.length - 1] = true;
  const st = [[0, pts.length - 1]];
  while (st.length) {
    const [a, b] = st.pop(); let mx = 0, mi = -1;
    const [ax, ay] = pts[a], [bx, by] = pts[b]; const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1e-9;
    for (let i = a + 1; i < b; i++) { const d = Math.abs(dy * (pts[i][0] - ax) - dx * (pts[i][1] - ay)) / L; if (d > mx) { mx = d; mi = i; } }
    if (mx > tol && mi > 0) { keep[mi] = true; st.push([a, mi], [mi, b]); }
  }
  return pts.filter((_, i) => keep[i]);
};
const dp = (pts, tol) => {
  const a = pts[0], b = pts[pts.length - 1];
  if (pts.length > 4 && Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-6) {
    let mi = 1, mx = 0; pts.forEach((p, i) => { const d = Math.hypot(p[0] - a[0], p[1] - a[1]); if (d > mx) { mx = d; mi = i; } });
    return [...dp0(pts.slice(0, mi + 1), tol), ...dp0(pts.slice(mi), tol).slice(1)];
  }
  return dp0(pts, tol);
};
const cen = (ring) => [ring.reduce((s, p) => s + p[0], 0) / ring.length, ring.reduce((s, p) => s + p[1], 0) / ring.length];
const area = (ring) => Math.abs(ring.reduce((s, p, i) => { const q = ring[(i + 1) % ring.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0) / 2);
const rings = (f) => { const c = f.geometry.coordinates; return f.geometry.type === 'Polygon' ? [c] : c; }; // lista de polígonos [anillos]
const grupos = {}; // nombre -> lista de anillos [lon,lat]
const add = (n, ring) => ((grupos[n] ||= []).push(ring));
const byName = (n) => g.features.find((f) => f.properties.name === n);
for (const f of g.features) {
  const n = f.properties.name;
  if (n === 'Illes Balears') {
    for (const poly of rings(f)) for (const [i, ring] of poly.entries()) {
      const [lo, la] = cen(ring);
      const k = i > 0 ? null : lo > 3.6 ? 'menorca' : (lo < 1.75 && la > 38.95) ? 'ibiza' : (lo < 1.75) ? 'formentera' : 'mallorca';
      if (k) add(k, ring); else add('_hueco', ring);
    }
  } else if (n === 'Las Palmas' || n === 'Santa Cruz De Tenerife') {
    for (const poly of rings(f)) { const ring = poly[0]; const [lo, la] = cen(ring);
      let k;
      if (lo < -17.8 && la < 28.0) k = 'hierro'; else if (lo < -17.5) k = 'palma'; else if (lo < -17.0) k = 'gomera'; else if (lo < -16.0) k = 'tenerife'; else if (lo < -15.0) k = 'gcanaria'; else if (lo < -13.75) k = 'fuerteventura'; else k = 'lanzarote';
      add(k, ring); }
  } else if (n === 'Ceuta' || n === 'Melilla') {
    for (const poly of rings(f)) { const [lo] = cen(poly[0]); if (n === 'Ceuta' && lo > -5.0) continue; add(n.toLowerCase(), poly[0]); }
  } else {
    for (const poly of rings(f)) for (const ring of poly) add('prov:' + n, ring);
  }
}
const ruta = (rs, lon0, lat1, tol) => rs.map((r) => 'M' + dp(r.map(([lo, la]) => pr(lo, la, lon0, lat1)), tol).map(([x, y]) => x.toFixed(1) + ' ' + y.toFixed(1)).join('L') + 'Z').join('');
const bb = (rs, lon0, lat1) => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of rs) for (const [lo, la] of r) { const [x, y] = pr(lo, la, lon0, lat1); a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y); } return [a, b, c, d].map((v) => +v.toFixed(1)); };
// marco principal: lon0=-9.5, lat1=44.0 (península + Baleares + Ceuta + Melilla)
const L0 = -9.5, A1 = 44.0;
// islotes diminutos (ranuras de 5 puntos) producian aristas y trazos sueltos: se descartan en las islas Baleares
for (const k of ['mallorca', 'menorca', 'ibiza', 'formentera']) { const keep = grupos[k].filter((r) => area(r.map(([lo, la]) => pr(lo, la, L0, A1))) > 40); grupos[k] = keep.length ? keep : grupos[k]; }
const res = {prov: {}, islas: {}, ceuta: null, melilla: null, canarias: {}};
for (const [k, rs] of Object.entries(grupos)) {
  if (k.startsWith('prov:')) res.prov[k.slice(5)] = {d: ruta(rs, L0, A1, 3), c: cen(rs.reduce((a, r) => (area(r) > area(a) ? r : a), rs[0])).map((v) => +v.toFixed(3))};
  else if (['mallorca', 'menorca', 'ibiza', 'formentera'].includes(k)) res.islas[k] = {d: ruta(rs, L0, A1, 0.9), bb: bb(rs, L0, A1)};
  else if (k === 'ceuta' || k === 'melilla') res[k] = {d: ruta(rs, L0, A1, 0.3), bb: bb(rs, L0, A1)};
}
// Canarias: marco propio
const cl = ['hierro', 'palma', 'gomera', 'tenerife', 'gcanaria', 'fuerteventura', 'lanzarote'];
const all = cl.flatMap((k) => grupos[k]);
let mnLo = 1e9, mxLa = -1e9; for (const r of all) for (const [lo, la] of r) { mnLo = Math.min(mnLo, lo); mxLa = Math.max(mxLa, la); }
for (const k of cl) res.canarias[k] = {d: ruta(grupos[k], mnLo, mxLa, 0.9), bb: bb(grupos[k], mnLo, mxLa)};
res.canBB = bb(all, mnLo, mxLa);
res.bb = bb(Object.entries(grupos).filter(([k]) => k.startsWith('prov:')).flatMap(([, v]) => v), L0, A1);
res.bbBal = bb(['mallorca', 'menorca', 'ibiza', 'formentera'].flatMap((k) => grupos[k]), L0, A1);
fs.writeFileSync(out, '// Generado por piezas/021-senado-209-senadores/_bake-mapa.mjs (px a 200 px/grado, proyección equirrectangular cos 40°)\nexport const MAPA_ES = ' + JSON.stringify(res) + ' as const;\n');
console.log('provincias', Object.keys(res.prov).length, 'bytes', fs.statSync(out).size, 'bb', res.bb, 'bal', res.bbBal, 'can', res.canBB, 'ceuta', res.ceuta.bb, 'melilla', res.melilla.bb, 'hueco', grupos._hueco?.length);
