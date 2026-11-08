import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {miles, useSalida} from './util';
import {MAPA_ES} from './datosMapaSenado';

/**
 * Serie "8 años en cifras", episodio 2 (036, lista de espera). Tiempos en segundos desde el inicio de la ESCENA.
 * columnasEspera: dos columnas de siluetas (altura proporcional al total) con la parte nueva en mostaza.
 * mapaCcaa: mapa de España por comunidades (provincias del mapa de la 021), con valores por comunidad, globos y flechas a una caja.
 */
const usa = () => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {fr, fps, t: fr / fps};
};
const ease = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
const lienzo = (children: React.ReactNode, s: number) => (
  <div style={{opacity: s}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>{children}</svg>
  </div>
);

/* ------------------------------------------------------------------ Columnas de siluetas */
const Sil: React.FC<{x: number; y: number; s: number; color: string}> = ({x, y, s, color}) => (
  <g>
    <circle cx={x} cy={y - 0.26 * s} r={0.21 * s} fill={color} />
    <path d={`M${x - 0.4 * s} ${y + 0.44 * s} Q${x - 0.4 * s} ${y + 0.04 * s} ${x} ${y + 0.04 * s} Q${x + 0.4 * s} ${y + 0.04 * s} ${x + 0.4 * s} ${y + 0.44 * s} Z`} fill={color} />
  </g>
);

/**
 * Dos columnas de siluetas. `a` y `b` son los totales (misma escala: la mayor mide `hMax`).
 * `extraEn`: segundo en que la parte de `b` por encima de `a` se tiñe de mostaza (si <0, ya teñida).
 * `valores`: muestra el total y el año de cada columna ({enA, enB}); `etiquetaA/B`: texto bajo la columna.
 */
export const ColumnasEspera: React.FC<{
  a: number; b: number; etiqA?: string; etiqB?: string; x?: number[]; base?: number; hMax?: number; w?: number; tile?: number;
  crece?: {en: number; dur: number}; extraEn?: number; valores?: {enA: number; enB: number}; tamEtiq?: number; hasta?: number;
}> = ({a, b, etiqA = '2018', etiqB = '2025', x = [300, 780], base = 1060, hMax = 300, w = 260, tile = 52, crece = {en: 0, dur: 1.4}, extraEn = -1, valores, tamEtiq = 56, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const mx = Math.max(a, b);
  const hA = (a / mx) * hMax, hB = (b / mx) * hMax;
  const kk = ease(t, crece.en, crece.en + crece.dur);
  const extraOn = extraEn < 0 || t >= extraEn;
  const cols = Math.floor(w / tile);
  const col = (cx: number, h: number, i: number) => {
    const alto = h * (i === 0 ? 1 : kk);
    const filas = Math.ceil(h / tile);
    const els: React.ReactNode[] = [];
    for (let r = 0; r < filas; r++) {
      for (let c = 0; c < cols; c++) {
        const px = cx - w / 2 + tile / 2 + c * tile;
        const py = base - tile * 0.55 - r * tile;
        const arriba = base - py > hA + 2 && i === 1;
        els.push(<Sil key={`${r}-${c}`} x={px} y={py} s={tile * 0.95} color={arriba && extraOn ? C.mostaza : i === 0 ? C.tinta : C.tinta} />);
      }
    }
    return (
      <g>
        <clipPath id={`clip-esp-${i}`}><rect x={cx - w / 2} y={base - alto} width={w} height={alto} /></clipPath>
        <g clipPath={`url(#clip-esp-${i})`}>{els}</g>
      </g>
    );
  };
  return lienzo(
    <g transform={`translate(0 ${Math.sin(t * 2.4) * 4})`}>
      <line x1={60} y1={base} x2={960} y2={base} stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />
      {col(x[0], hA, 0)}
      {col(x[1], hB, 1)}
      <text x={x[0]} y={base + 58} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={tamEtiq} fill={C.tinta}>{etiqA}</text>
      <text x={x[1]} y={base + 58} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={tamEtiq} fill={C.tinta}>{etiqB}</text>
      {valores ? (
        <g>
          {t >= valores.enA ? <text x={x[0]} y={base - hA - 22} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={56} fill={C.tinta}>{miles(a)}</text> : null}
          {t >= valores.enB ? <text x={x[1]} y={base - hB - 22} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={56} fill={C.tinta}>{miles(b)}</text> : null}
        </g>
      ) : null}
    </g>,
    s,
  );
};

/* ------------------------------------------------------------------ Mapa por comunidades */
const M = MAPA_ES as any;
const CCAA: Record<string, string[]> = {
  Galicia: ['A Coruña', 'Lugo', 'Ourense', 'Pontevedra'],
  Asturias: ['Asturias'], Cantabria: ['Cantabria'],
  'País Vasco': ['Araba/Álava', 'Gipuzkoa/Guipúzcoa', 'Bizkaia/Vizcaya'],
  Navarra: ['Navarra'], 'La Rioja': ['La Rioja'],
  Aragón: ['Huesca', 'Teruel', 'Zaragoza'],
  Cataluña: ['Girona', 'Barcelona', 'Lleida', 'Tarragona'],
  'Castilla y León': ['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'],
  Madrid: ['Madrid'],
  'Castilla-La Mancha': ['Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Toledo'],
  Extremadura: ['Badajoz', 'Cáceres'],
  'C. Valenciana': ['Alacant/Alicante', 'Castelló/Castellón', 'València/Valencia'],
  Murcia: ['Murcia'],
  Andalucía: ['Málaga', 'Almería', 'Cádiz', 'Jaén', 'Córdoba', 'Granada', 'Huelva', 'Sevilla'],
};
const bbox = (d: string) => {
  const n = (d.match(/-?\d+\.?\d*/g) || []).map(Number);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (let i = 0; i + 1 < n.length; i += 2) { x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]); y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]); }
  return [x0, y0, x1, y1];
};
const centro = (nombre: string): [number, number] => {
  const bs = CCAA[nombre].map((p) => bbox(M.prov[p].d));
  const x0 = Math.min(...bs.map((b) => b[0])), x1 = Math.max(...bs.map((b) => b[2]));
  const y0 = Math.min(...bs.map((b) => b[1])), y1 = Math.max(...bs.map((b) => b[3]));
  return [(x0 + x1) / 2, (y0 + y1) / 2];
};
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mezcla = (a: string, b: string, k: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`;
};
const CLARO = '#D6D2C8';
const MIN_D = 50, MAX_D = 173;
export const colorDias = (d: number) => mezcla(C.mostaza, C.tinta, (d - MIN_D) / (MAX_D - MIN_D));

/**
 * Mapa de España por comunidades. Origen: (x, y) = esquina superior izquierda; `esc` px por px horneado (0,33 → ~700 px de ancho).
 * modo 'uno': todas las comunidades en un tono (`tono`). modo 'dias': las de `valores` se pintan por días (escala 50–173), el resto en gris claro desde `pintaEn`.
 * globos: [{ccaa, texto, dx, dy, en}] pastillas tinta con texto crema unidas por línea al centro de la comunidad (dx/dy en px de pantalla).
 * flechas: {desde: [ccaa…], caja: {x, y, w, h, lineas}, en}: flechas de esas comunidades a una caja (coordenadas de pantalla).
 * leyenda: {y, en, media}: barra mostaza→tinta con 50, media nacional y 173.
 */
export const MapaCcaa: React.FC<{
  x?: number; y?: number; esc?: number; en?: number; modo?: 'uno' | 'dias'; tono?: string; valores?: Record<string, number>; pintaEn?: number;
  globos?: {ccaa: string; texto: string; dx: number; dy: number; en: number; tam?: number}[];
  flechas?: {desde: string[]; caja: {x: number; y: number; w: number; h: number; lineas: string[]; tam?: number}; en: number};
  leyenda?: {y: number; en: number; media: number; x?: number; w?: number};
  canarias?: boolean; hasta?: number;
}> = ({x = 190, y = 560, esc = 0.33, en = 0, modo = 'uno', tono = C.piedra, valores = {}, pintaEn = 0, globos = [], flechas, leyenda, canarias = true, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.5);
  const pinta = modo === 'dias' && t >= pintaEn;
  const colorDe = (cc: string) => {
    if (modo === 'uno') return tono;
    if (!pinta) return tono;
    return valores[cc] !== undefined ? colorDias(valores[cc]) : CLARO;
  };
  const ccDe: Record<string, string> = {};
  Object.keys(CCAA).forEach((cc) => CCAA[cc].forEach((p) => { ccDe[p] = cc; }));
  const sx = (bx: number) => x + bx * esc;
  const sy = (by: number) => y + by * esc;
  const base = modo === 'uno' || !pinta ? tono : CLARO;
  const fondoI = pinta ? CLARO : tono;
  const can = M.canarias;
  const csc = 0.55, cx0 = 30, cy0 = 1290;
  return lienzo(
    <g opacity={k} transform={`translate(0 ${(1 - k) * 30 + Math.sin(t * 2.4) * 3})`}>
      <g transform={`translate(${x} ${y}) scale(${esc})`}>
        {Object.keys(M.prov).map((p) => (
          <path key={p} d={M.prov[p].d} fill={ccDe[p] ? colorDe(ccDe[p]) : base} stroke={C.crema} strokeWidth={3 / esc * 0.5} fillRule="evenodd" strokeLinejoin="round" />
        ))}
        {['mallorca', 'menorca', 'ibiza', 'formentera'].map((n) => <path key={n} d={M.islas[n].d} fill={fondoI} stroke={C.crema} strokeWidth={3} />)}
        <path d={M.ceuta.d} fill={fondoI} stroke={fondoI} strokeWidth={14} />
        <path d={M.melilla.d} fill={fondoI} stroke={fondoI} strokeWidth={14} />
        {canarias ? (
          <g>
            <rect x={cx0 - 16} y={cy0 - 20} width={M.canBB[2] * csc + 32} height={M.canBB[3] * csc + 40} rx={14} fill="none" stroke={C.tinta} strokeWidth={5} strokeDasharray="14 14" opacity={0.45} />
            <g transform={`translate(${cx0} ${cy0}) scale(${csc})`}>
              {Object.keys(can).map((n) => <path key={n} d={can[n].d} fill={fondoI} stroke={C.crema} strokeWidth={3} />)}
            </g>
          </g>
        ) : null}
      </g>
      {flechas ? (() => {
        const e = ease(t, flechas.en, flechas.en + 0.8);
        const cj = flechas.caja;
        return (
          <g opacity={e > 0 ? 1 : 0}>
            {flechas.desde.map((cc, i) => {
              const [bx, by] = centro(cc);
              const x1 = sx(bx), y1 = sy(by);
              const tx = cj.x + cj.w * (0.25 + 0.5 * (i / Math.max(1, flechas.desde.length - 1)));
              const ty = cj.y;
              const ex = x1 + (tx - x1) * e, ey = y1 + (ty - y1) * e;
              const ang = Math.atan2(ey - y1, ex - x1);
              const hx = (r: number) => ex - Math.cos(ang + r) * 26, hy = (r: number) => ey - Math.sin(ang + r) * 26;
              return (
                <g key={cc}>
                  <circle cx={x1} cy={y1} r={9} fill={C.mostaza} stroke={C.tinta} strokeWidth={4} />
                  <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={C.tinta} strokeWidth={9} strokeLinecap="round" />
                  <path d={`M ${hx(-0.5)} ${hy(-0.5)} L ${ex} ${ey} L ${hx(0.5)} ${hy(0.5)}`} fill="none" stroke={C.tinta} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              );
            })}
            <g transform={`translate(0 ${(1 - e) * 20})`} opacity={e}>
              <rect x={cj.x} y={cj.y} width={cj.w} height={cj.h} rx={20} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
              {cj.lineas.map((l, i) => (
                <text key={i} x={cj.x + cj.w / 2} y={cj.y + (cj.tam ?? 44) + 12 + i * ((cj.tam ?? 44) + 6)} textAnchor="middle" fontFamily={F.titular} fontSize={cj.tam ?? 44} fill={C.tinta}>{l}</text>
              ))}
            </g>
          </g>
        );
      })() : null}
      {globos.map((g, i) => {
        const e = ease(t, g.en, g.en + 0.4);
        if (e <= 0) return null;
        const [bx, by] = centro(g.ccaa);
        const cx = sx(bx), cy = sy(by);
        const tam = g.tam ?? 64;
        const wTxt = g.texto.length * tam * 0.62 + 44;
        const gx = cx + g.dx, gy = cy + g.dy;
        return (
          <g key={i} opacity={e} transform={`translate(0 ${(1 - e) * 16})`}>
            <line x1={cx} y1={cy} x2={gx} y2={gy} stroke={C.tinta} strokeWidth={6} />
            <circle cx={cx} cy={cy} r={10} fill={C.crema} stroke={C.tinta} strokeWidth={5} />
            <rect x={gx - wTxt / 2} y={gy - tam * 0.75} width={wTxt} height={tam * 1.3} rx={18} fill={C.tinta} />
            <text x={gx} y={gy + tam * 0.25} textAnchor="middle" fontFamily={F.titular} fontSize={tam} fill={C.crema}>{g.texto}</text>
          </g>
        );
      })}
      {leyenda ? (() => {
        const e = ease(t, leyenda.en, leyenda.en + 0.5);
        const lx = leyenda.x ?? 190, lw = leyenda.w ?? 700, ly = leyenda.y;
        const pos = (d: number) => lx + ((d - MIN_D) / (MAX_D - MIN_D)) * lw;
        return (
          <g opacity={e}>
            <defs><linearGradient id="grad-esp"><stop offset="0" stopColor={C.mostaza} /><stop offset="1" stopColor={C.tinta} /></linearGradient></defs>
            <rect x={lx} y={ly} width={lw} height={34} rx={8} fill="url(#grad-esp)" stroke={C.tinta} strokeWidth={4} />
            <text x={pos(MIN_D)} y={ly + 82} textAnchor="start" fontFamily={F.cifra} fontWeight={700} fontSize={48} fill={C.tinta}>50</text>
            <text x={pos(173)} y={ly + 82} textAnchor="end" fontFamily={F.cifra} fontWeight={700} fontSize={48} fill={C.tinta}>173</text>
            <line x1={pos(leyenda.media)} y1={ly - 14} x2={pos(leyenda.media)} y2={ly + 48} stroke={C.teja} strokeWidth={8} />
            <text x={pos(leyenda.media)} y={ly + 96} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={44} fill={C.tinta}>{`Media nacional: ${leyenda.media}`}</text>
          </g>
        );
      })() : null}
    </g>,
    s,
  );
};

export const REGISTRO_ESPERA: Record<string, React.FC<any>> = {
  columnasEspera: ColumnasEspera, mapaCcaa: MapaCcaa,
};
