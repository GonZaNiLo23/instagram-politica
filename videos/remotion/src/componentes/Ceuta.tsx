import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {miles, useSalida} from './util';

/**
 * 050 (serie "8 años en cifras"): Ceuta. Tiempos `en` en segundos desde el inicio de la ESCENA. Opt-in.
 * contadorCeuta (0 -> 70.000, con prefijo fijo y paso a gris), mapaCeuta (Estrecho vectorial, Ceuta marcada, flecha de vuelta),
 * huecoCeuta (casilla vacía con X), calendarioCeuta (27-31 de julio con 30 y 31 resaltados y sello FUERA),
 * informeCeuta (hoja con línea resaltada), barra90Ceuta (barra 90 % / resto sin rotular), casillaXCeuta (casilla con X).
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
const GRIS = '#B4BBC8';

export const ContadorCeuta: React.FC<{x?: number; y?: number; tam?: number; dur?: number; ini?: number; grisEn?: number; hasta?: number}> = ({x = 60, y = 800, tam = 150, dur = 1.1, ini = 0.15, grisEn, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = Math.min(1, ini + (1 - ini) * ease(t, 0, dur));
  const v = 70000 * k;
  const g = grisEn === undefined ? 0 : ease(t, grisEn, grisEn + 0.3);
  const col = g > 0.5 ? GRIS : C.tinta;
  const pop = 1 + 0.04 * Math.sin(t * 3);
  return (
    <div style={{opacity: s}}>
      <div style={{position: 'absolute', left: x, top: y - 70, fontFamily: F.texto, fontWeight: 700, fontSize: 64, color: C.tinta}}>{g > 0.5 ? 'NO SUMAN' : 'UNAS'}</div>
      <div style={{position: 'absolute', left: x, top: y, fontFamily: F.titular, fontSize: tam, lineHeight: 1.1, color: col, transform: `scale(${pop})`, transformOrigin: 'left center'}}>{miles(v)}</div>
    </div>
  );
};

export const MapaCeuta: React.FC<{x?: number; y?: number; sc?: number; en?: number; vuelta?: number; hasta?: number}> = ({x = 590, y = 760, sc = 1, en = 0, vuelta, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.4);
  const pulso = (t * 0.9) % 1;
  const vv = vuelta === undefined ? 0 : ease(t, vuelta, vuelta + 0.8);
  const bal = Math.sin(t * 2.2) * 3;
  return lienzo(
    <g transform={`translate(${x} ${y + bal}) scale(${sc})`} opacity={k}>
      <rect x={0} y={0} width={360} height={260} rx={24} fill="#DDE6EE" stroke={C.tinta} strokeWidth={5} />
      <path d="M0 0 L360 0 L360 38 C300 44 262 70 214 62 C160 54 120 40 70 70 C40 88 20 80 0 96 Z" fill={C.piedra} stroke={C.tinta} strokeWidth={4} />
      <path d="M0 260 L360 260 L360 168 C320 152 270 160 236 150 C214 144 196 150 170 160 C120 178 60 168 0 196 Z" fill={C.piedra} stroke={C.tinta} strokeWidth={4} />
      <circle cx={204} cy={146} r={14 + 34 * pulso} fill="none" stroke={C.mostaza} strokeWidth={6} opacity={1 - pulso} />
      <circle cx={204} cy={146} r={13} fill={C.mostaza} stroke={C.tinta} strokeWidth={4} />
      <text x={204} y={118} textAnchor="middle" fontFamily={F.texto} fontWeight={800} fontSize={34} fill={C.tinta}>CEUTA</text>
      {vv > 0 ? (
        <g opacity={vv}>
          <line x1={204} y1={166} x2={204 + 70 * vv} y2={166 + 70 * vv} stroke={C.turquesa} strokeWidth={8} strokeLinecap="round" />
          <text x={180} y={248} fontFamily={F.texto} fontWeight={800} fontSize={34} fill={C.tinta}>MARRUECOS</text>
        </g>
      ) : null}
    </g>,
    s,
  );
};

export const HuecoCeuta: React.FC<{texto: string; x?: number; y?: number; ancho?: number; alto?: number; en?: number; xEn?: number; hasta?: number}> = ({texto, x = 60, y = 980, ancho = 880, alto = 130, en = 0, xEn, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.4);
  const kx = xEn === undefined ? 0 : ease(t, xEn, xEn + 0.35);
  const bal = Math.sin(t * 2.4) * 4;
  return lienzo(
    <g transform={`translate(0 ${bal + (1 - k) * 40})`} opacity={k}>
      <rect x={x} y={y} width={ancho} height={alto} rx={20} fill="none" stroke={C.tinta} strokeWidth={6} strokeDasharray="18 12" />
      <text x={x + 34} y={y + alto / 2 + 22} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={C.tinta}>{texto}</text>
      {kx > 0 ? (
        <g transform={`translate(${x + ancho - 80} ${y + alto / 2}) scale(${kx})`}>
          <line x1={-30} y1={-30} x2={30} y2={30} stroke={C.teja} strokeWidth={14} strokeLinecap="round" />
          <line x1={30} y1={-30} x2={-30} y2={30} stroke={C.teja} strokeWidth={14} strokeLinecap="round" />
        </g>
      ) : null}
    </g>,
    s,
  );
};

export const CalendarioCeuta: React.FC<{y?: number; en?: number; fuera?: number; hasta?: number}> = ({y = 820, en = 0, fuera = 1.5, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.4);
  const kf = ease(t, fuera, fuera + 0.3);
  const dias = [27, 28, 29, 30, 31];
  const bal = Math.sin(t * 2.4) * 4;
  return lienzo(
    <g transform={`translate(0 ${bal + (1 - k) * 40})`} opacity={k}>
      <rect x={60} y={y} width={880} height={210} rx={20} fill={C.crema} stroke={C.tinta} strokeWidth={6} />
      <rect x={60} y={y} width={880} height={70} rx={20} fill={C.tinta} />
      <text x={90} y={y + 52} fontFamily={F.texto} fontWeight={800} fontSize={44} fill={C.crema}>JULIO</text>
      {dias.map((d, i) => {
        const cx = 130 + i * 175;
        const res = d >= 30;
        return (
          <g key={d}>
            <rect x={cx - 70} y={y + 90} width={140} height={100} rx={14} fill={res ? C.mostaza : 'none'} stroke={C.tinta} strokeWidth={res ? 5 : 3} />
            <text x={cx} y={y + 160} textAnchor="middle" fontFamily={F.titular} fontSize={64} fill={C.tinta}>{d}</text>
          </g>
        );
      })}
      {kf > 0 ? (
        <g transform={`translate(700 ${y + 110}) rotate(-8) scale(${0.8 + 0.2 * kf})`} opacity={kf}>
          <rect x={-150} y={-52} width={300} height={104} rx={12} fill={C.crema} stroke={C.teja} strokeWidth={8} />
          <text y={26} textAnchor="middle" fontFamily={F.titular} fontSize={72} fill={C.teja}>FUERA</text>
        </g>
      ) : null}
    </g>,
    s,
  );
};

export const InformeCeuta: React.FC<{y?: number; en?: number; resalta?: number; hasta?: number}> = ({y = 800, en = 0, resalta = 0.8, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.4);
  const kr = ease(t, resalta, resalta + 0.6);
  const bal = Math.sin(t * 2.4) * 4;
  return lienzo(
    <g transform={`translate(0 ${bal + (1 - k) * 40})`} opacity={k}>
      <rect x={160} y={y} width={700} height={300} rx={16} fill={C.crema} stroke={C.tinta} strokeWidth={6} />
      <rect x={200} y={y + 34} width={300} height={22} rx={6} fill={C.tinta} />
      <rect x={200} y={y + 84} width={620} height={16} rx={6} fill={GRIS} />
      <rect x={200} y={y + 124} width={540} height={16} rx={6} fill={GRIS} />
      <rect x={196} y={y + 170} width={628 * kr} height={44} rx={8} fill={C.mostaza} />
      <rect x={200} y={y + 178} width={560} height={26} rx={6} fill={C.tinta} opacity={kr} />
      <rect x={200} y={y + 236} width={420} height={16} rx={6} fill={GRIS} />
    </g>,
    s,
  );
};

export const Barra90Ceuta: React.FC<{y?: number; en?: number; dur?: number; vuelta?: number; hasta?: number}> = ({y = 900, en = 0, dur = 1.3, vuelta, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + dur);
  const e = ease(t, en, en + 0.3);
  const vv = vuelta === undefined ? 0 : ease(t, vuelta, vuelta + 0.9);
  const W = 880, X = 60;
  const bal = Math.sin(t * 2.4) * 4;
  return lienzo(
    <g transform={`translate(0 ${bal})`} opacity={e}>
      <rect x={X} y={y} width={W} height={110} fill="none" stroke={C.tinta} strokeWidth={5} strokeDasharray="16 12" />
      <rect x={X} y={y} width={W * 0.9 * k} height={110} fill={C.turquesa} stroke={C.tinta} strokeWidth={5} />
      <text x={X + 20} y={y + 170} fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={C.tinta} opacity={k > 0.95 ? 1 : 0}>90 % ya habían vuelto</text>
      <text x={X + 20} y={y + 240} fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={C.tinta} opacity={k > 0.95 ? 1 : 0}>(según Sánchez)</text>
      {vv > 0 ? (
        <g opacity={vv}>
          <line x1={X + W * 0.3} y1={y - 60} x2={X + W * 0.3 + 230 * vv} y2={y - 60} stroke={C.tinta} strokeWidth={8} strokeLinecap="round" />
          <text x={X + W * 0.3 + 240} y={y - 40} fontFamily={F.texto} fontWeight={800} fontSize={44} fill={C.tinta} opacity={vv > 0.9 ? 1 : 0}>MARRUECOS</text>
        </g>
      ) : null}
    </g>,
    s,
  );
};

export const CasillaXCeuta: React.FC<{filas: string[]; y?: number; en?: number; paso?: number; hasta?: number}> = ({filas, y = 900, en = 0, paso = 1.2, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const bal = Math.sin(t * 2.4) * 4;
  return lienzo(
    <g transform={`translate(0 ${bal})`}>
      {filas.map((f, i) => {
        const a = en + i * paso;
        const k = ease(t, a, a + 0.35);
        const kx = ease(t, a + 0.35, a + 0.7);
        const yy = y + i * 150;
        return (
          <g key={i} opacity={k} transform={`translate(${(1 - k) * -60} 0)`}>
            <rect x={60} y={yy} width={880} height={120} rx={20} fill={C.crema} stroke={C.tinta} strokeWidth={6} />
            <text x={90} y={yy + 76} fontFamily={F.texto} fontWeight={700} fontSize={50} fill={C.tinta}>{f}</text>
            <g transform={`translate(860 ${yy + 60}) scale(${kx})`}>
              <line x1={-26} y1={-26} x2={26} y2={26} stroke={C.teja} strokeWidth={12} strokeLinecap="round" />
              <line x1={26} y1={-26} x2={-26} y2={26} stroke={C.teja} strokeWidth={12} strokeLinecap="round" />
            </g>
          </g>
        );
      })}
    </g>,
    s,
  );
};

export const REGISTRO_050: Record<string, React.FC<any>> = {
  contadorCeuta: ContadorCeuta, mapaCeuta: MapaCeuta, huecoCeuta: HuecoCeuta, calendarioCeuta: CalendarioCeuta, informeCeuta: InformeCeuta, barra90Ceuta: Barra90Ceuta, casillaXCeuta: CasillaXCeuta,
};
