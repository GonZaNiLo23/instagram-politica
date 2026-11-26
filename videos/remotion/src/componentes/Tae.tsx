import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {useSalida} from './util';

/**
 * Pieza 079 (tope 22 % TAE). SVG a lienzo completo; `en` en segundos desde el inicio de la ESCENA.
 * REGISTRO_079: topeTae (barra 0-30 con muro en 22 que se llena a la vez que el contador), productosTae (iconos de producto),
 * docTae (portada del decreto), tartaTae (TAE abierta en intereses + comisiones), lineaTae (25-11-2026 → tres meses → feb. 2027),
 * fueraTae (cuenta y alto coste con aspa).
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
const T = {fontFamily: F.texto, fill: C.tinta} as const;

/** Barra con escala 0-30 %; se llena de 0 a 22 con la misma curva que `Contador` (en/espera/dur) y topa contra el muro. */
export const TopeTae: React.FC<{y?: number; en?: number; espera?: number; dur?: number; alto?: number; hasta?: number}> = ({y = 960, en = -1, espera = 1, dur = 1.6, alto = 120, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const X0 = 100, W = 780, X22 = X0 + (22 / 30) * W;
  const k = ease(t, en + espera, en + espera + dur);
  const dt = t - (en + espera + dur);
  const ciclo = dt > 0 ? dt % 1.4 : 0;
  const golpe = dt > 0 ? Math.exp(-ciclo * 4) * Math.sin(ciclo * 32) * 12 : 0;
  const pulso = 0.5 + 0.5 * Math.sin(t * 5);
  return lienzo(
    <g>
      <rect x={X0} y={y} width={W} height={alto} fill={C.piedra} stroke={C.tinta} strokeWidth={5} />
      <rect x={X0} y={y} width={(X22 - X0) * k} height={alto} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
      {dt > 0 ? <rect x={X0 + 5 + ((X22 - X0 - 150) * ((dt % 1.4) / 1.4))} y={y + 5} width={140} height={alto - 10} fill="#fff6d8" opacity={0.55} /> : null}
      <g transform={`translate(${golpe} 0)`}>
        <rect x={X22} y={y - 40} width={22} height={alto + 56} fill={C.tinta} />
        <rect x={X22 - 4} y={y - 40} width={30} height={14} fill={C.mostaza} opacity={pulso} />
      </g>
      <text x={X0} y={y + alto + 100} textAnchor="middle" fontWeight={700} fontSize={40} {...T}>0 %</text>
      <text x={X22 + 11} y={y + alto + 100} textAnchor="middle" fontWeight={800} fontSize={40} {...T}>22 %</text>
    </g>,
    s,
  );
};

type Prod = 'prestamo' | 'tarjeta' | 'plazos';
const Producto: React.FC<{p: Prod; cx: number; cy: number; r: number; col: string; fondo: string}> = ({p, cx, cy, r, col, fondo}) => {
  const k = r / 100;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${k})`}>
      {p === 'prestamo' ? (
        <>
          <rect x={-95} y={-55} width={190} height={110} rx={10} fill={fondo} stroke={C.tinta} strokeWidth={7} />
          <circle cx={0} cy={0} r={34} fill={col} stroke={C.tinta} strokeWidth={6} />
          <text x={0} y={16} textAnchor="middle" fontFamily={F.texto} fontWeight={800} fontSize={48} fill={C.tinta}>€</text>
          <circle cx={-68} cy={0} r={8} fill={C.tinta} /><circle cx={68} cy={0} r={8} fill={C.tinta} />
        </>
      ) : null}
      {p === 'tarjeta' ? (
        <>
          <rect x={-95} y={-62} width={190} height={124} rx={14} fill={fondo} stroke={C.tinta} strokeWidth={7} />
          <rect x={-95} y={-34} width={190} height={26} fill={col} stroke={C.tinta} strokeWidth={5} />
          <rect x={-72} y={22} width={70} height={14} rx={5} fill={C.tinta} />
        </>
      ) : null}
      {p === 'plazos' ? (
        <>
          <path d="M-100 -70 L-70 -70 L-44 40 L70 40 L88 -36 L-60 -36" fill={fondo} stroke={C.tinta} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={-26} cy={78} r={14} fill={col} stroke={C.tinta} strokeWidth={6} />
          <circle cx={52} cy={78} r={14} fill={col} stroke={C.tinta} strokeWidth={6} />
          <circle cx={14} cy={-6} r={20} fill={col} stroke={C.tinta} strokeWidth={5} />
        </>
      ) : null}
    </g>
  );
};

/** Iconos de producto en fila; `gris` los deja en piedra (sin color) y `entra` los hace aparecer de uno en uno. */
export const ProductosTae: React.FC<{items?: Prod[]; x?: number; y?: number; paso?: number; r?: number; gris?: boolean; en?: number; hasta?: number}> = ({items = ['prestamo', 'tarjeta', 'plazos'], x = 560, y = 780, paso = 160, r = 64, gris = true, en = 0.2, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  return lienzo(
    <g>
      {items.map((p, i) => {
        const e = ease(t, en + i * 0.25, en + i * 0.25 + 0.35);
        const bal = Math.sin(t * 3 + i * 1.3) * 12;
        return (
          <g key={i} opacity={e} transform={`translate(0 ${(1 - e) * 40 + bal})`}>
            <Producto p={p} cx={x + i * paso} cy={y} r={r} col={gris ? '#b8b2a4' : C.mostaza} fondo={gris ? '#d9d4c7' : '#fffaf0'} />
          </g>
        );
      })}
    </g>,
    s,
  );
};

/** Portada de documento con cabecera BOE y número; cae y se asienta. */
export const DocTae: React.FC<{y?: number; x?: number; en?: number; hasta?: number}> = ({y = 640, x = 540, en = 0.1, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const e = ease(t, en, en + 0.5);
  const bal = Math.sin(t * 2.4) * 6;
  return lienzo(
    <g transform={`translate(${x} ${y + (1 - e) * -80 + bal}) rotate(${-2 + (1 - e) * -6})`} opacity={e}>
      <rect x={-210} y={0} width={420} height={560} fill="#fffaf0" stroke={C.tinta} strokeWidth={7} />
      <rect x={-210} y={0} width={420} height={96} fill={C.tinta} />
      <text x={0} y={68} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={60} fill="#fffaf0">BOE</text>
      {[130, 168, 206].map((yy, i) => <rect key={i} x={-170} y={yy} width={i === 2 ? 220 : 340} height={14} fill={C.piedra} />)}
      <text x={0} y={330} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={80} fill={C.tinta}>44/2026</text>
      {[380, 418, 456, 494].map((yy, i) => <rect key={i} x={-170} y={yy} width={i === 3 ? 180 : 340} height={14} fill={C.piedra} />)}
    </g>,
    s,
  );
};

/** Círculo TAE que se abre en dos mitades: intereses + comisiones. */
export const TartaTae: React.FC<{y?: number; cx?: number; en?: number; hasta?: number}> = ({y = 780, cx = 490, en = 0.5, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.7);
  const bal = Math.sin(t * 2.6) * 6;
  const r = 200;
  const sep = 20 + 90 * k;
  return lienzo(
    <g transform={`translate(0 ${bal})`}>
      <g transform={`translate(${cx - sep} ${y})`}>
        <path d={`M0 ${-r} A${r} ${r} 0 0 0 0 ${r} Z`} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
      </g>
      <g transform={`translate(${cx + sep} ${y})`}>
        <path d={`M0 ${-r} A${r} ${r} 0 0 1 0 ${r} Z`} fill={C.piedra} stroke={C.tinta} strokeWidth={6} />
      </g>
      <text x={cx} y={y + 22} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={C.tinta} opacity={1 - k}>TAE</text>
      <text x={cx} y={y + 22} textAnchor="middle" fontWeight={800} fontSize={72} {...T} opacity={k}>+</text>
      <text x={cx - sep - r / 2 - 10} y={y + r + 90} textAnchor="middle" fontWeight={800} fontSize={64} {...T} opacity={k}>intereses</text>
      <text x={cx + sep + r / 2 + 10} y={y + r + 90} textAnchor="middle" fontWeight={800} fontSize={64} {...T} opacity={k}>comisiones</text>
    </g>,
    s,
  );
};

/** Línea de tiempo 25-11-2026 → tres meses → feb. 2027, con contratos nuevos en color y los anteriores atenuados. */
export const LineaTae: React.FC<{y?: number; en?: number; hasta?: number}> = ({y = 700, en = 0.2, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const X0 = 130, X1 = 830;
  const k = ease(t, en, en + 1.4);
  const xe = X0 + (X1 - X0) * k;
  const bal = Math.sin(t * 2.6) * 6;
  const pts = [
    {x: X0, a: '25‑11‑2026', b: '', c: 0.0},
    {x: (X0 + X1) / 2, a: 'tres meses', b: '', c: 0.45},
    {x: X1, a: 'feb. 2027', b: '', c: 0.95},
  ];
  const ek = ease(t, en + 1.6, en + 2.2);
  return lienzo(
    <g transform={`translate(0 ${bal})`}>
      <line x1={X0} y1={y} x2={X1 + 40} y2={y} stroke={C.piedra} strokeWidth={10} />
      <line x1={X0} y1={y} x2={xe} y2={y} stroke={C.tinta} strokeWidth={10} />
      {pts.map((p, i) => {
        const v = k >= p.c ? 1 : 0;
        return (
          <g key={i} opacity={0.2 + 0.8 * v}>
            <circle cx={p.x} cy={y} r={i === 2 ? 26 : 20} fill={i === 2 ? C.mostaza : '#fffaf0'} stroke={C.tinta} strokeWidth={6} />
            <text x={p.x} y={y + (i === 1 ? -50 : 80)} textAnchor="middle" fontWeight={800} fontSize={40} {...T}>{p.a}</text>
          </g>
        );
      })}
      <g opacity={ek} transform={`translate(0 ${(1 - ek) * 30})`}>
        <Producto p="prestamo" cx={280} cy={y + 300} r={90} col={C.piedra} fondo="#d9d4c7" />
        <Producto p="tarjeta" cx={520} cy={y + 300} r={90} col={C.mostaza} fondo="#fffaf0" />
        <Producto p="plazos" cx={760} cy={y + 300} r={90} col={C.mostaza} fondo="#fffaf0" />
        <text x={640} y={y + 450} textAnchor="middle" fontWeight={800} fontSize={40} {...T}>contratos nuevos</text>
      </g>
    </g>,
    s,
  );
};

const Aspa: React.FC<{cx: number; cy: number; k: number}> = ({cx, cy, k}) => (
  <g transform={`translate(${cx} ${cy}) scale(${0.4 + 0.6 * k})`} opacity={k}>
    <line x1={-78} y1={-78} x2={78} y2={78} stroke="#b3261e" strokeWidth={22} strokeLinecap="round" />
    <line x1={78} y1={-78} x2={-78} y2={78} stroke="#b3261e" strokeWidth={22} strokeLinecap="round" />
  </g>
);

/** Cuenta (descubierto) y crédito de alto coste con aspa al lado; el aspa va sobre un hueco propio, sin tapar el icono. */
export const FueraTae: React.FC<{y?: number; en?: number; hasta?: number}> = ({y = 760, en = 0.3, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const bal = Math.sin(t * 2.6) * 10;
  const k1 = ease(t, en, en + 0.4), k2 = ease(t, en + 0.9, en + 1.3);
  return lienzo(
    <g transform={`translate(0 ${bal})`}>
      <g opacity={k1}>
        <rect x={150} y={y - 90} width={240} height={180} rx={14} fill="#fffaf0" stroke={C.tinta} strokeWidth={7} />
        <rect x={150} y={y - 90} width={240} height={44} fill={C.piedra} stroke={C.tinta} strokeWidth={5} />
        <rect x={180} y={y - 10} width={120} height={14} fill={C.tinta} /><rect x={180} y={y + 24} width={180} height={14} fill={C.piedra} />
      </g>
      <Aspa cx={470} cy={y} k={k1} />
      <g opacity={k2}>
        <Producto p="prestamo" cx={650} cy={y} r={100} col={C.mostaza} fondo="#fffaf0" />
      </g>
      <Aspa cx={850} cy={y} k={k2} />
      <text x={270} y={y + 170} textAnchor="middle" fontWeight={800} fontSize={44} {...T} opacity={k1}>descubiertos</text>
      <text x={650} y={y + 170} textAnchor="middle" fontWeight={800} fontSize={44} {...T} opacity={k2}>alto coste</text>
    </g>,
    s,
  );
};

export const REGISTRO_079 = {topeTae: TopeTae, productosTae: ProductosTae, docTae: DocTae, tartaTae: TartaTae, lineaTae: LineaTae, fueraTae: FueraTae};
void SEGURA;
