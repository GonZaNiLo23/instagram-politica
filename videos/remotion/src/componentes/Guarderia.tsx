import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useSalida} from './util';

/**
 * Pieza 077 (ratios en guarderías). SVG a lienzo completo; `en` en segundos desde el inicio de la ESCENA.
 * REGISTRO_077: cunasG, hitosG, ejeG, bajaG.
 */
const usa = () => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {t: fr / fps};
};
const ease = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
const lienzo = (children: React.ReactNode, s = 1) => (
  <div style={{opacity: s}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>{children}</svg>
  </div>
);

const Cuna: React.FC<{cx: number; yb: number; esc?: number; bebe?: number; bob?: number}> = ({cx, yb, esc = 1, bebe = 1, bob = 0}) => (
  <g transform={`translate(${cx} ${yb}) scale(${esc})`}>
    <g transform={`translate(0 ${bob})`}>
      <circle cx={0} cy={-70} r={30 * bebe} fill="#F6C9A0" stroke={C.tinta} strokeWidth={5} />
      <circle cx={-10 * bebe} cy={-73} r={3.5} fill={C.tinta} />
      <circle cx={10 * bebe} cy={-73} r={3.5} fill={C.tinta} />
      <path d={`M ${-8 * bebe} ${-60} Q 0 ${-52} ${8 * bebe} ${-60}`} fill="none" stroke={C.tinta} strokeWidth={3.5} />
      <rect x={-44} y={-52} width={88} height={22} rx={8} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
    </g>
    <rect x={-60} y={-60} width={120} height={14} fill="none" />
    {[-52, -26, 0, 26, 52].map((x) => <line key={x} x1={x} y1={-84} x2={x} y2={-8} stroke={C.tinta} strokeWidth={5} />)}
    <rect x={-66} y={-30} width={132} height={22} rx={6} fill={C.tinta} />
    <rect x={-62} y={-92} width={8} height={92} fill={C.tinta} />
    <rect x={54} y={-92} width={8} height={92} fill={C.tinta} />
    <rect x={-66} y={-8} width={12} height={12} fill={C.tinta} />
    <rect x={54} y={-8} width={12} height={12} fill={C.tinta} />
  </g>
);

const Educadora: React.FC<{cx: number; yb: number}> = ({cx, yb}) => (
  <g transform={`translate(${cx} ${yb}) scale(1.3)`}>
    <path d="M -50 0 L -38 -110 Q 0 -128 38 -110 L 50 0 Z" fill={C.tinta} />
    <circle cx={0} cy={-150} r={30} fill="#F6C9A0" stroke={C.tinta} strokeWidth={5} />
    <path d="M -32 -152 Q -30 -190 0 -186 Q 32 -190 32 -152 Q 20 -170 0 -168 Q -20 -170 -32 -152 Z" fill={C.tinta} />
    <rect x={-22} y={-100} width={44} height={14} rx={7} fill={C.mostaza} />
  </g>
);

/**
 * Sala de cunas con una educadora fija. `fases`: [{n, en, bebe}] (n cunas ocupadas desde `en`; `bebe` = tamaño del niño).
 * Las cunas 1-4 en la fila de arriba (y), las 5-8 en la de abajo (y + 190). `en: -1` = ya presentes desde el primer fotograma.
 */
export const CunasG: React.FC<{fases: {n: number; en: number; bebe?: number}[]; y?: number; hasta?: number; dosFilas?: boolean}> = ({fases, y = 780, hasta, dosFilas = true}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  let n = 0;
  let bebe = 1;
  let tf = 0;
  for (const f of fases) if (t >= f.en) { n = f.n; bebe = f.bebe ?? 1; tf = f.en; }
  const cunas: React.ReactNode[] = [];
  const total = Math.max(...fases.map((f) => f.n));
  for (let i = 0; i < total; i++) {
    const fila = dosFilas ? Math.floor(i / 4) : 0;
    const col = i % 4;
    // aparición escalonada de las cunas nuevas
    const llegada = i < (fases.find((f) => f.en <= tf)?.n ?? 0) ? 0 : 0;
    const primera = fases.find((f) => f.n > i);
    const en0 = primera ? Math.max(primera.en, 0) + (primera.en < 0 ? 0 : (i - (fases[fases.indexOf(primera) - 1]?.n ?? 0)) * 0.12) : 0;
    const pr = primera && primera.en < 0 ? ease(t, 0, 0.5 + i * 0.12) : ease(t, en0, en0 + 0.35);
    if (i >= n && pr <= 0) continue;
    const sc = Math.min(1, pr) * (1 + (pr > 0 && pr < 1 ? 0.15 * (1 - pr) : 0));
    cunas.push(<Cuna key={i} cx={340 + col * 165} yb={y + fila * 240 + (1 - pr) * -40} esc={sc * 1.2} bebe={bebe} bob={Math.sin(t * 3 + i) * 9 + llegada} />);
  }
  return lienzo(
    <>
      <rect x={60} y={y + (dosFilas ? 240 : 0) + 30} width={840} height={10} rx={5} fill={C.tinta} opacity={0.25} />
      <Educadora cx={160} yb={y + (dosFilas && total > 4 ? 240 : 0)} />
      {cunas}
    </>,
    s,
  );
};

/** Línea de tiempo vertical con hitos que se encienden uno a uno. items: [{lineas, en}]. */
export const HitosG: React.FC<{items: {lineas: string[]; en: number}[]; y?: number; paso?: number; hasta?: number}> = ({items, y = 520, paso = 190, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const ultimo = Math.max(...items.map((i) => i.en));
  const alto = (items.length - 1) * paso;
  const prog = items.reduce((a, it, k) => (t >= it.en ? k : a), -1);
  return lienzo(
    <>
      <line x1={110} y1={y + 30} x2={110} y2={y + 30 + alto} stroke={C.tinta} strokeWidth={8} opacity={0.2} />
      <line x1={110} y1={y + 30} x2={110} y2={y + 30 + (prog >= 0 ? Math.min(prog, ease(t, items[Math.max(prog, 0)].en, items[Math.max(prog, 0)].en + 0.6) * 0 + prog) * paso : 0)} stroke={C.mostaza} strokeWidth={8} />
      {items.map((it, k) => {
        const p = ease(t, it.en, it.en + 0.35);
        const cy = y + 30 + k * paso;
        const pulso = t >= it.en && k === prog && t > ultimo ? 1 + Math.sin(t * 5) * 0.08 : 1;
        return (
          <g key={k} opacity={t >= it.en - 0.02 ? 1 : 0.35}>
            <circle cx={110} cy={cy} r={(22 + (1 - p) * 14) * pulso} fill={t >= it.en ? C.mostaza : C.crema} stroke={C.tinta} strokeWidth={7} />
            {it.lineas.map((l, j) => (
              <text key={j} x={170} y={cy + 12 + j * 70 - (it.lineas.length - 1) * 30} fontFamily={F.titular} fontWeight={700} fontSize={64} fill={C.tinta} opacity={p}>{l}</text>
            ))}
          </g>
        );
      })}
    </>,
    s,
  );
};

/** Eje horizontal hoy -> año con marca final etiquetada (gancho). */
export const EjeG: React.FC<{etiqueta: string; y?: number; en?: number; hasta?: number}> = ({etiqueta, y = 1080, en = 0, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const p = ease(t, en, en + 0.8);
  const x1 = 100 + 620 * p;
  return lienzo(
    <>
      <line x1={100} y1={y} x2={x1} y2={y} stroke={C.tinta} strokeWidth={8} strokeLinecap="round" />
      <circle cx={100} cy={y} r={18} fill={C.tinta} />
      <circle cx={720} cy={y} r={22 + (p >= 1 ? Math.sin(t * 5) * 4 : 0)} fill={p >= 1 ? C.mostaza : C.crema} stroke={C.tinta} strokeWidth={7} />
      <text x={720} y={y + 80} textAnchor="middle" fontFamily={F.titular} fontWeight={700} fontSize={64} fill={C.tinta} opacity={p}>{etiqueta}</text>
    </>,
    s,
  );
};

/** Un 4 con flecha hacia abajo (las comunidades pueden bajarlo) y monedas. */
export const BajaG: React.FC<{y?: number; en?: number; enMonedas?: number; hasta?: number}> = ({y = 700, en = 0, enMonedas = 3, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const p = ease(t, en, en + 0.5);
  const q = ease(t, en + 0.4, en + 1.3);
  const m = ease(t, enMonedas, enMonedas + 0.5);
  const bal = Math.sin(t * 3) * 6;
  return lienzo(
    <>
      <g opacity={p}>
        <rect x={110} y={y} width={230} height={230} rx={28} fill={C.mostaza} stroke={C.tinta} strokeWidth={10} />
        <text x={225} y={y + 180} textAnchor="middle" fontFamily={F.titular} fontSize={190} fontWeight={700} fill={C.tinta}>4</text>
      </g>
      <g opacity={q} transform={`translate(0 ${q * 30 + bal})`}>
        <rect x={420} y={y + 10} width={46} height={110} fill={C.tinta} />
        <polygon points={`388,${y + 115} 498,${y + 115} 443,${y + 195}`} fill={C.tinta} />
      </g>
      <g opacity={m} transform={`translate(0 ${(1 - m) * -30})`}>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <ellipse cx={720} cy={y + 200 - i * 36} rx={90} ry={26} fill={C.mostaza} stroke={C.tinta} strokeWidth={7} />
            <rect x={630} y={y + 200 - i * 36} width={180} height={0} fill="none" />
          </g>
        ))}
        <text x={720} y={y + 215} textAnchor="middle" fontFamily={F.titular} fontSize={44} fontWeight={700} fill={C.tinta}>€</text>
      </g>
    </>,
    s,
  );
};

export const REGISTRO_077: Record<string, React.FC<any>> = {cunasG: CunasG, hitosG: HitosG, ejeG: EjeG, bajaG: BajaG};
