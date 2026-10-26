import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useSalida} from './util';
import {MAPA_ES} from './datosMapaSenado';

// Pieza 021 (Senado). Todo SVG/CSS plano. Tiempos `en`/`hasta` en segundos desde el inicio de la escena.
const SEPIA = '#DCC79A';
const GRIS = '#B4BBC8';
const TEJA = C.teja;

const usa = () => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {fr, fps, t: fr / fps};
};
const muelle = (fr: number, fps: number, en: number, damping = 10) => spring({frame: fr - Math.round(en * fps), fps, config: {damping, stiffness: 200, mass: 0.6}});
const ease = (fr: number, fps: number, a: number, b: number) => interpolate(fr, [a * fps, b * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});

/** Etiqueta EJEMPLO (tinta sobre crema, 64 px): fija mientras dure el dibujo con datos inventados. */
const TagEjemplo: React.FC<{left: number; top: number; visible?: boolean; opacity?: number}> = ({left, top, visible = true, opacity = 1}) => (
  <div style={{position: 'absolute', left, top, opacity: visible ? opacity : 0, fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: '70px', color: C.crema, background: C.tinta, padding: '2px 22px', borderRadius: 14, whiteSpace: 'nowrap'}}>EJEMPLO</div>
);

const Cruz: React.FC<{cx: number; cy: number; r: number; color: string; p: number; tr?: number}> = ({cx, cy, r, color, p, tr = 0}) => (
  <g transform={`translate(${cx + tr} ${cy}) scale(${Math.max(p, 0)})`}>
    <path d={`M${-r} ${-r}L${r} ${r}M${r} ${-r}L${-r} ${r}`} stroke={C.tinta} strokeWidth={r * 0.9} strokeLinecap="round" fill="none" />
    <path d={`M${-r} ${-r}L${r} ${r}M${r} ${-r}L${-r} ${r}`} stroke={color} strokeWidth={r * 0.45} strokeLinecap="round" fill="none" />
  </g>
);

const Silueta: React.FC<{cx: number; cy: number; s?: number; color?: string}> = ({cx, cy, s = 1, color = C.tinta}) => (
  <g transform={`translate(${cx} ${cy}) scale(${s})`} fill={color} opacity={0.75}>
    <circle cx={0} cy={-9} r={8} />
    <path d="M-14 16 C-14 2 -8 0 0 0 C8 0 14 2 14 16 Z" />
  </g>
);

/** Papeleta del Senado de ejemplo (sepia), cuatro casillas. `cruces`: instantes de cada cruz (4.ª en teja con temblor). */
export const PapeletaS: React.FC<{
  x?: number; y?: number; w?: number; en?: number; hasta?: number; cruces?: number[]; tejaDesde?: number; grisEn?: number;
  sale?: {en: number; dur: number; dx: number; dy: number; esc: number}; ejemplo?: boolean; bob?: number; filas?: number;
}> = ({x = 540, y = 800, w = 700, en = 0, hasta, cruces = [], tejaDesde = 3, grisEn, sale, ejemplo = true, bob = 5, filas = 4}) => {
  const {fr, fps, t} = usa();
  const s = useSalida(hasta);
  const h = (w * 540) / 760;
  const ent = muelle(fr, fps, en, 12);
  const g = grisEn === undefined ? 0 : ease(fr, fps, grisEn, grisEn + 0.3);
  const k = sale ? ease(fr, fps, sale.en, sale.en + sale.dur) : 0;
  const esc = (0.88 + 0.12 * Math.min(ent, 1)) * (sale ? 1 + (sale.esc - 1) * k : 1);
  const cx = x + (sale ? sale.dx * k : 0);
  const cy = y + (sale ? sale.dy * k : 0) + Math.sin(t * 2.4) * bob;
  const fill = g > 0 ? `rgb(${Math.round(220 + (180 - 220) * g)},${Math.round(199 + (187 - 199) * g)},${Math.round(154 + (200 - 154) * g)})` : SEPIA;
  const sc = 760 / 760;
  return (
    <div style={{opacity: s}}>
      <div style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, transform: `scale(${esc * sc})`, filter: 'drop-shadow(0 14px 0 rgba(20,33,61,0.25))'}}>
        <svg width={w} height={h} viewBox="0 0 760 540">
          <rect x={4} y={4} width={752} height={532} rx={18} fill={fill} stroke={C.tinta} strokeWidth={7} />
          <rect x={70} y={36} width={620} height={20} rx={8} fill={C.tinta} opacity={0.55} />
          <rect x={120} y={68} width={520} height={14} rx={6} fill={C.tinta} opacity={0.35} />
          {Array.from({length: filas}).map((_, i) => {
            const yy = 118 + i * 100;
            return (
              <g key={i}>
                <rect x={60} y={yy} width={66} height={66} rx={8} fill={C.crema} stroke={C.tinta} strokeWidth={6} />
                <Silueta cx={176} cy={yy + 42} s={1.5} />
                <rect x={216} y={yy + 14} width={300 + (i % 2) * 70} height={22} rx={9} fill={C.tinta} opacity={0.5} />
                <rect x={216} y={yy + 46} width={190 + ((i + 1) % 2) * 80} height={14} rx={7} fill={C.tinta} opacity={0.28} />
              </g>
            );
          })}
          {cruces.map((ce, i) => {
            const yy = 118 + i * 100;
            const teja = i >= tejaDesde;
            const p = fr >= Math.round(ce * fps) ? muelle(fr, fps, ce, teja ? 7 : 9) : 0;
            const tr = teja && t > ce && t < ce + 0.7 ? Math.sin((t - ce) * 55) * 7 * (1 - (t - ce) / 0.7) : 0;
            return <Cruz key={i} cx={93} cy={yy + 33} r={26} color={teja ? TEJA : C.mostaza} p={p} tr={tr} />;
          })}
        </svg>
      </div>
      {ejemplo ? <TagEjemplo left={cx - (w * esc) / 2} top={cy - (h * esc) / 2 - 78} /> : null}
    </div>
  );
};

/** Sello NULO: circular, tinta sobre crema, doble anillo. Distinto del sello MITO (rectángulo teja). */
export const SelloNuloS: React.FC<{x?: number; y?: number; d?: number; en?: number; hasta?: number; angulo?: number; sale?: {en: number; dur: number; dx: number; dy: number; esc: number}}> = ({x = 540, y = 800, d = 380, en = 0, hasta, angulo = -14, sale}) => {
  const {fr, fps} = usa();
  const kk = sale ? ease(fr, fps, sale.en, sale.en + sale.dur) : 0;
  const s = useSalida(hasta);
  const p = muelle(fr, fps, en, 9);
  const vis = fr >= Math.round(en * fps);
  return (
    <div style={{position: 'absolute', left: x - d / 2 + (sale ? sale.dx * kk : 0), top: y - d / 2 + (sale ? sale.dy * kk : 0), width: d, height: d, opacity: vis ? s : 0, transform: `rotate(${angulo}deg) scale(${(1 + (1 - Math.min(p, 1.05)) * 1.1) * (sale ? 1 + (sale.esc - 1) * kk : 1)})`}}>
      <svg width={d} height={d} viewBox="0 0 380 380">
        <circle cx={190} cy={190} r={178} fill="rgba(244,239,230,0.94)" stroke={C.tinta} strokeWidth={14} />
        <circle cx={190} cy={190} r={146} fill="none" stroke={C.tinta} strokeWidth={5} strokeDasharray="3 13" strokeLinecap="round" />
        <text x={190} y={232} textAnchor="middle" fontFamily={F.titular} fontSize={116} fill={C.tinta}>NULO</text>
        <path d="M110 126 L270 126" stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />
        <path d="M110 254 L270 254" stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />
      </svg>
    </div>
  );
};

/** Flecha curva que esquiva un obstáculo (se dibuja en `dur` s). */
export const FlechaEsquivaS: React.FC<{x1: number; y1: number; x2: number; y2: number; alto?: number; en?: number; dur?: number; hasta?: number}> = ({x1, y1, x2, y2, alto = 220, en = 0, dur = 0.8, hasta}) => {
  const {fr, fps} = usa();
  const s = useSalida(hasta);
  const k = ease(fr, fps, en, en + dur);
  const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - alto;
  const d = `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
  const ang = Math.atan2(y2 - my, x2 - mx);
  const ah = 34;
  const hx = x2, hy = y2;
  const head = `M${hx} ${hy} L${hx - ah * Math.cos(ang - 0.5)} ${hy - ah * Math.sin(ang - 0.5)} M${hx} ${hy} L${hx - ah * Math.cos(ang + 0.5)} ${hy - ah * Math.sin(ang + 0.5)}`;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: s}}>
      <path d={d} pathLength={1} stroke={C.tinta} strokeWidth={24} fill="none" strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - k} />
      <path d={d} pathLength={1} stroke={C.mostaza} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - k} />
      {k > 0.96 ? <><path d={head} stroke={C.tinta} strokeWidth={24} fill="none" strokeLinecap="round" /><path d={head} stroke={C.mostaza} strokeWidth={12} fill="none" strokeLinecap="round" /></> : null}
    </svg>
  );
};

/** Papeleta de dibujo vertical (sin cruces) para la comparación Senado/Congreso. */
const HojaV: React.FC<{w: number; fondo: string; filas?: number}> = ({w, fondo, filas = 4}) => {
  const h = w * 1.36;
  return (
    <svg width={w} height={h} viewBox="0 0 360 490">
      <rect x={4} y={4} width={352} height={482} rx={16} fill={fondo} stroke={C.tinta} strokeWidth={7} />
      <rect x={40} y={34} width={280} height={18} rx={8} fill={C.tinta} opacity={0.55} />
      <rect x={80} y={62} width={200} height={12} rx={6} fill={C.tinta} opacity={0.3} />
      {Array.from({length: filas}).map((_, i) => (
        <g key={i}>
          <rect x={36} y={104 + i * 90} width={50} height={50} rx={7} fill={C.crema} stroke={C.tinta} strokeWidth={5} />
          <rect x={106} y={112 + i * 90} width={190 - (i % 2) * 40} height={18} rx={8} fill={C.tinta} opacity={0.5} />
          <rect x={106} y={140 + i * 90} width={120} height={12} rx={6} fill={C.tinta} opacity={0.28} />
        </g>
      ))}
    </svg>
  );
};

/** Dos papeletas lado a lado (SENADO sepia, CONGRESO blanca con borde tinta); la sepia avanza al primer plano. */
export const DosPapeletasS: React.FC<{y?: number; en?: number; sepiaEn?: number; blancaEn?: number; avanzaEn?: number; hasta?: number}> = ({y = 840, en = 0, sepiaEn = 0.1, blancaEn = 1.5, avanzaEn = 2.5, hasta}) => {
  const {fr, fps, t} = usa();
  const s = useSalida(hasta);
  const w = 360;
  const h = w * 1.36;
  const a = ease(fr, fps, avanzaEn, avanzaEn + 0.6);
  const ps = muelle(fr, fps, sepiaEn, 12);
  const pb = muelle(fr, fps, blancaEn, 12);
  const bob = Math.sin(t * 2.4) * 5;
  const cxS = 290 + 70 * a, cxB = 760 - 10 * a;
  const escS = 1 + 0.16 * a;
  const lab = (txt: string, cx: number, vis: boolean, color: string) => (
    <div style={{position: 'absolute', left: cx - 230, width: 460, top: y - h / 2 - 76, textAlign: 'center', fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: '70px', color, opacity: vis ? 1 : 0}}>{txt}</div>
  );
  return (
    <div style={{opacity: s}}>
      <div style={{position: 'absolute', left: cxB - w / 2, top: y - h / 2 + bob, width: w, height: h, opacity: fr >= Math.round(blancaEn * fps) ? 1 : 0, transform: `scale(${0.9 + 0.1 * Math.min(pb, 1)})`, filter: 'drop-shadow(0 14px 0 rgba(20,33,61,0.25))'}}><HojaV w={w} fondo="#FFFFFF" /></div>
      <div style={{position: 'absolute', left: cxS - w / 2, top: y - h / 2 - bob, width: w, height: h, transform: `scale(${(0.9 + 0.1 * Math.min(ps, 1)) * escS})`, filter: 'drop-shadow(0 14px 0 rgba(20,33,61,0.25))'}}><HojaV w={w} fondo={SEPIA} /></div>
      {lab('SENADO', cxS, true, C.tinta)}
      {lab('CONGRESO', cxB, fr >= Math.round(blancaEn * fps), C.tinta)}
      <TagEjemplo left={540 - 120} top={y + h / 2 - 96} />
    </div>
  );
};

/** Papeleta de ejemplo con tres columnas de candidaturas ficticias (Círculo, Triángulo, Cuadrado) y una cruz por columna. */
export const ColumnasS: React.FC<{x?: number; y?: number; w?: number; en?: number; cruces?: number[]; hasta?: number}> = ({x = 500, y = 830, w = 860, en = 0, cruces = [0.6, 1.2, 1.8], hasta}) => {
  const {fr, fps, t} = usa();
  const s = useSalida(hasta);
  const h = (w * 470) / 860;
  const ent = muelle(fr, fps, en, 12);
  const esc = 0.9 + 0.1 * Math.min(ent, 1);
  const cy = y + Math.sin(t * 2.4) * 5;
  const nombres = [['Candidata A', 'Candidato B'], ['Candidata C', 'Candidato D'], ['Candidata E', 'Candidato F']];
  const colores = [C.piedra, C.turquesa, C.piedra];
  const forma = (i: number, cx: number, cyy: number) => {
    const c = colores[i];
    if (i === 0) return <circle cx={cx} cy={cyy} r={34} fill={c} stroke={C.tinta} strokeWidth={6} />;
    if (i === 1) return <path d={`M${cx} ${cyy - 38} L${cx + 40} ${cyy + 32} L${cx - 40} ${cyy + 32} Z`} fill={c} stroke={C.tinta} strokeWidth={6} strokeLinejoin="round" />;
    return <rect x={cx - 33} y={cyy - 33} width={66} height={66} rx={4} fill={c} stroke={C.tinta} strokeWidth={6} />;
  };
  const marcaFila = [0, 1, 0];
  return (
    <div style={{opacity: s}}>
      <div style={{position: 'absolute', left: x - w / 2, top: cy - h / 2, width: w, height: h, transform: `scale(${esc})`, filter: 'drop-shadow(0 14px 0 rgba(20,33,61,0.25))'}}>
        <svg width={w} height={h} viewBox="0 0 860 470">
          <rect x={4} y={4} width={852} height={462} rx={18} fill={SEPIA} stroke={C.tinta} strokeWidth={7} />
          {[0, 1, 2].map((i) => {
            const x0 = 24 + i * 280;
            return (
              <g key={i}>
                {i > 0 ? <line x1={x0 - 6} y1={24} x2={x0 - 6} y2={446} stroke={C.tinta} strokeWidth={3} opacity={0.4} /> : null}
                {forma(i, x0 + 130, 76)}
                {nombres[i].map((n, j) => {
                  const yy = 180 + j * 124;
                  return (
                    <g key={j}>
                      <rect x={x0 + 6} y={yy - 8} width={42} height={42} rx={6} fill={C.crema} stroke={C.tinta} strokeWidth={5} />
                      <Silueta cx={x0 + 74} cy={yy + 16} s={1.3} color={colores[i] === C.piedra ? C.tinta : C.turquesa} />
                      <text x={x0 + 98} y={yy + 28} fontFamily={F.texto} fontWeight={600} fontSize={34} fill={C.tinta}>{n}</text>
                      <rect x={x0 + 98} y={yy + 44} width={110} height={10} rx={5} fill={C.tinta} opacity={0.25} />
                    </g>
                  );
                })}
              </g>
            );
          })}
          {cruces.map((ce, i) => {
            const x0 = 24 + i * 280;
            const yy = 180 + marcaFila[i] * 124;
            const p = fr >= Math.round(ce * fps) ? muelle(fr, fps, ce, 9) : 0;
            return <Cruz key={i} cx={x0 + 27} cy={yy + 13} r={21} color={C.mostaza} p={p} />;
          })}
        </svg>
      </div>
      <TagEjemplo left={x - (w * esc) / 2} top={cy - (h * esc) / 2 - 78} />
    </div>
  );
};

// ---------------- Mapas ----------------
const M = MAPA_ES as any;
const ORDEN_PROV = Object.keys(M.prov).sort((a, b) => M.prov[a].c[0] - M.prov[b].c[0]); // de oeste a este

const Badge: React.FC<{cx: number; cy: number; txt: string; bg: string; fg: string; p: number; r?: number}> = ({cx, cy, txt, bg, fg, p, r = 40}) => (
  <g transform={`translate(${cx} ${cy}) scale(${Math.max(p, 0)})`}>
    <circle r={r} fill={bg} stroke={C.tinta} strokeWidth={6} />
    <text y={r * 0.34} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={r * 1.12} fill={fg}>{txt}</text>
  </g>
);

/** Mapa plano de España (provincias en tinta que se encienden en mostaza "3"; Gran Canaria, Mallorca, Tenerife, Ceuta y Melilla en turquesa "2"; resto de islas en piedra "1"). */
export const MapaTopeS: React.FC<{x?: number; y?: number; en?: number; dosEn?: number; unoEn?: number; hasta?: number}> = ({x = 540, y = 650, en = 0, dosEn = 1, unoEn = 2, hasta}) => {
  const {fr, fps, t} = usa();
  const s = useSalida(hasta);
  const SC = 0.2; // px por px horneado
  const W = 900, Hh = 380;
  const tx = 330, ty = 8;
  const col = (activo: number, on: string) => (activo > 0 ? on : C.tinta);
  const dos = fr >= Math.round(dosEn * fps) ? 1 : 0;
  const uno = fr >= Math.round(unoEn * fps) ? 1 : 0;
  const prov = ORDEN_PROV.map((n, i) => {
    const ent = en + 0.1 + (i / ORDEN_PROV.length) * 0.7;
    const on = fr >= Math.round(ent * fps);
    return <path key={n} d={M.prov[n].d} fill={on ? C.mostaza : C.tinta} stroke={C.crema} strokeWidth={4} fillRule="evenodd" strokeLinejoin="round" />;
  });
  const pos = (bx: number, by: number) => [tx + bx * SC, ty + by * SC];
  const cC = pos(636, 1621), mC = pos(1004, 1741);
  const mallorcaBB = M.islas.mallorca.bb;
  const mp = pos((mallorcaBB[0] + mallorcaBB[2]) / 2, mallorcaBB[1]);
  const bal = M.bbBal;
  const unoBal = pos(bal[2] - 60, bal[3] + 30);
  const can = M.canarias;
  const csc = 0.34, cx0 = 14, cy0 = 238;
  const cpos = (bx: number, by: number) => [cx0 + bx * csc, cy0 + by * csc];
  const gcBB = can.gcanaria.bb, tfBB = can.tenerife.bb;
  const dosCan = cpos((gcBB[0] + tfBB[2]) / 2 - 40, Math.min(gcBB[1], tfBB[1]) - 6);
  const pDos = muelle(fr, fps, dosEn, 8), pUno = muelle(fr, fps, unoEn, 8), pTres = muelle(fr, fps, en + 0.5, 8);
  const mad = M.prov['Madrid'].c; // lon/lat
  const madPos = pos((mad[0] + 9.5) * 0.766 * 200 - 20, (44.0 - mad[1]) * 200 - 130);
  return (
    <div style={{position: 'absolute', left: x - W / 2, top: y, width: W, height: Hh, opacity: s}}>
      <svg width={W} height={Hh} viewBox={`0 0 ${W} ${Hh}`} style={{overflow: 'visible', transform: `translateY(${Math.sin(t * 2.4) * 4}px)`}}>
        <g transform={`translate(${tx} ${ty}) scale(${SC})`}>
          {prov}
          {['mallorca'].map((k) => <path key={k} d={M.islas[k].d} fill={col(dos, C.turquesa)} stroke={C.crema} strokeWidth={3} />)}
          {['menorca', 'ibiza', 'formentera'].map((k) => <path key={k} d={M.islas[k].d} fill={col(uno, C.piedra)} stroke={C.crema} strokeWidth={3} />)}
        </g>
        <circle cx={cC[0]} cy={cC[1]} r={11} fill={col(dos, C.turquesa)} stroke={C.crema} strokeWidth={3} />
        <circle cx={mC[0]} cy={mC[1]} r={11} fill={col(dos, C.turquesa)} stroke={C.crema} strokeWidth={3} />
        <rect x={cx0 - 8} y={cy0 - 10} width={M.canBB[2] * csc + 16} height={M.canBB[3] * csc + 20} rx={10} fill="none" stroke={C.tinta} strokeWidth={3} strokeDasharray="8 8" opacity={0.5} />
        <g transform={`translate(${cx0} ${cy0}) scale(${csc})`}>
          {Object.keys(can).map((k) => <path key={k} d={can[k].d} fill={k === 'gcanaria' || k === 'tenerife' ? col(dos, C.turquesa) : col(uno, C.piedra)} stroke={C.crema} strokeWidth={3} />)}
        </g>
        <Badge cx={madPos[0]} cy={madPos[1]} txt="3" bg={C.crema} fg={C.tinta} p={pTres} r={44} />
        <Badge cx={mp[0] - 10} cy={mp[1] - 50} txt="2" bg={C.turquesa} fg={C.crema} p={pDos} />
        <Badge cx={cC[0] - 52} cy={cC[1] + 26} txt="2" bg={C.turquesa} fg={C.crema} p={pDos} />
        <Badge cx={mC[0] + 52} cy={mC[1] + 22} txt="2" bg={C.turquesa} fg={C.crema} p={pDos} />
        <Badge cx={dosCan[0]} cy={dosCan[1] - 28} txt="2" bg={C.turquesa} fg={C.crema} p={pDos} />
        <Badge cx={unoBal[0]} cy={unoBal[1] + 14} txt="1" bg={C.piedra} fg={C.tinta} p={pUno} />
        <Badge cx={cx0 + M.canBB[2] * csc + 56} cy={cy0 + M.canBB[3] * csc * 0.5} txt="1" bg={C.piedra} fg={C.tinta} p={pUno} />
      </svg>
    </div>
  );
};

/** Baleares: Ibiza y Formentera unidas por un óvalo con "1"; el óvalo se parte en dos y Formentera se ilumina en mostaza. */
export const MapaBalearesS: React.FC<{x?: number; y?: number; w?: number; en?: number; partirEn?: number; hasta?: number}> = ({x = 540, y = 520, w = 900, en = 0, partirEn = 2, hasta}) => {
  const {fr, fps, t} = usa();
  const s = useSalida(hasta);
  const bb = M.bbBal;
  const pad = 90;
  const vb = [bb[0] - pad - 80, bb[1] - pad, bb[2] - bb[0] + 2 * pad + 80, bb[3] - bb[1] + 2 * pad];
  const Hh = (w * vb[3]) / vb[2];
  const k = w / vb[2];
  const part = ease(fr, fps, partirEn, partirEn + 0.5);
  const ib = M.islas.ibiza.bb, fo = M.islas.formentera.bb;
  const ux = [Math.min(ib[0], fo[0]), Math.min(ib[1], fo[1]), Math.max(ib[2], fo[2]), Math.max(ib[3], fo[3])];
  const ov = (b: number[], p: number) => ({cx: (b[0] + b[2]) / 2, cy: (b[1] + b[3]) / 2, rx: (b[2] - b[0]) / 2 + p, ry: (b[3] - b[1]) / 2 + p});
  const U = ov(ux, 34), I = ov(ib, 26), Fo = ov(fo, 26);
  const pop = muelle(fr, fps, en + 0.3, 8);
  const pop2 = muelle(fr, fps, partirEn + 0.1, 8);
  const formOn = fr >= Math.round(partirEn * fps);
  const oval = (o: ReturnType<typeof ov>, key: string, op = 1) => <ellipse key={key} cx={o.cx} cy={o.cy} rx={o.rx} ry={o.ry} fill="rgba(244,239,230,0.35)" stroke={C.tinta} strokeWidth={9} opacity={op} />;
  const badge = (cx: number, cy: number, p: number) => (
    <g transform={`translate(${cx} ${cy}) scale(${Math.max(p, 0) / k})`}>
      <circle r={44} fill={C.crema} stroke={C.tinta} strokeWidth={6} />
      <text y={16} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={50} fill={C.tinta}>1</text>
    </g>
  );
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, height: Hh, opacity: s}}>
      <svg width={w} height={Hh} viewBox={vb.join(' ')} style={{overflow: 'visible', transform: `translateY(${Math.sin(t * 2.4) * 4}px)`}}>
        {['mallorca', 'menorca'].map((kk) => <path key={kk} d={M.islas[kk].d} fill={C.piedra} stroke={C.crema} strokeWidth={4} />)}
        <path d={M.islas.ibiza.d} fill={C.tinta} stroke={C.crema} strokeWidth={4} />
        <path d={M.islas.formentera.d} fill={formOn ? C.mostaza : C.tinta} stroke={formOn ? C.tinta : C.crema} strokeWidth={formOn ? 8 : 4} />
        {part < 0.5 ? oval(U, 'u', 1) : null}
        {part >= 0.5 ? <>{oval(I, 'i')}{oval(Fo, 'f')}</> : null}
        {part < 0.5 ? badge(U.cx - U.rx - 54, U.cy, pop) : <>{badge(I.cx - I.rx - 54, I.cy - 20, pop2)}{badge(Fo.cx - Fo.rx - 54, Fo.cy + 10, pop2)}</>}
      </svg>
    </div>
  );
};

/** Contador 208 -> 209 con "+1" mostaza, en fila: año | cifra | +1. La etiqueta (año) cambia en el mismo fotograma que la cifra. */
export const CuentaS: React.FC<{x?: number; y?: number; en?: number; sube?: number; hasta?: number; tamano?: number}> = ({x = 60, y = 880, en = 0, sube = 1.2, hasta, tamano = 170}) => {
  const {fr, fps} = usa();
  const s = useSalida(hasta);
  const p = muelle(fr, fps, en, 12);
  const flip = fr >= Math.round(sube * fps);
  const pf = flip ? muelle(fr, fps, sube, 8) : 0;
  const pm = flip ? muelle(fr, fps, sube + 0.1, 7) : 0;
  const vis = fr >= Math.round(en * fps) ? Math.min(p, 1) * s : 0;
  return (
    <div style={{opacity: s}}>
      <div style={{position: 'absolute', left: x, top: y + 50, fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: '70px', color: C.tinta, opacity: vis}}>{flip ? '2026' : '2023'}</div>
      <div style={{position: 'absolute', left: x + 190, top: y, fontFamily: F.cifra, fontWeight: 700, fontSize: tamano, lineHeight: 1.1, color: C.tinta, opacity: vis, transform: `scale(${flip ? 1 + 0.16 * Math.max(0, 1 - pf) : 1})`, transformOrigin: 'left center'}}>{flip ? '209' : '208'}</div>
      <div style={{position: 'absolute', left: x + 190 + 340, top: y + 28, fontFamily: F.cifra, fontWeight: 700, fontSize: 100, lineHeight: 1.1, color: C.tinta, background: C.mostaza, padding: '0 20px', borderRadius: 18, border: `8px solid ${C.tinta}`, opacity: flip ? 1 : 0, transform: `scale(${Math.max(pm, 0)}) rotate(-6deg)`}}>+1</div>
    </div>
  );
};

/** Fila de cuatro casillas con cruz (3 mostaza + la 4.ª en teja) para la portada. */
export const CrucesS: React.FC<{y?: number; x?: number; lado?: number; en?: number; hasta?: number; n?: number; vacias?: boolean}> = ({y = 980, x = 480, lado = 170, en = 0, n = 4, vacias = false}) => {
  const {fr, fps} = usa();
  const gap = 28;
  const total = n * lado + (n - 1) * gap;
  return (
    <>
      {Array.from({length: n}).map((_, i) => {
        const p = vacias ? 0 : en < 0 ? 1 : muelle(fr, fps, en + i * 0.2, 9);
        return (
          <svg key={i} width={lado + 20} height={lado + 20} style={{position: 'absolute', left: x - total / 2 + i * (lado + gap), top: y, overflow: 'visible', filter: 'drop-shadow(0 8px 0 rgba(20,33,61,0.3))'}}>
            <rect x={4} y={4} width={lado} height={lado} rx={16} fill={C.crema} stroke={C.tinta} strokeWidth={9} />
            <Cruz cx={lado / 2 + 4} cy={lado / 2 + 4} r={lado * 0.27} color={i === 3 ? TEJA : C.mostaza} p={p} />
          </svg>
        );
      })}
    </>
  );
};

export const REGISTRO_021: Record<string, React.FC<any>> = {
  papeletaS: PapeletaS,
  selloNuloS: SelloNuloS,
  flechaEsquivaS: FlechaEsquivaS,
  dosPapeletasS: DosPapeletasS,
  columnasS: ColumnasS,
  mapaTopeS: MapaTopeS,
  mapaBalearesS: MapaBalearesS,
  cuentaS: CuentaS,
  crucesS: CrucesS,
};
