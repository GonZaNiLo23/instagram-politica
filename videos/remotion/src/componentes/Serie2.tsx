import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {useSalida} from './util';

/**
 * Serie "8 años en cifras" (041): lineasSerie (líneas de variación % desde 2018, eje en 0) y contratosSerie (rejilla de contratos).
 * Tiempos `en` en segundos desde el inicio de la ESCENA. Opt-in.
 */
const usa = () => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {t: fr / fps};
};
const ease = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
const lienzo = (children: React.ReactNode, s: number) => (
  <div style={{opacity: s}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>{children}</svg>
  </div>
);

type SerieL = {nombre: string; final: number; color: string; en: number; dur?: number; pos?: 'arriba' | 'abajo'; tam?: number};

export const LineasSerie: React.FC<{series: SerieL[]; max?: number; base?: number; hMax?: number; x0?: number; x1?: number; hasta?: number; anios?: boolean}> = ({series, max = 60, base = 1100, hMax = 400, x0 = 130, x1 = 850, hasta, anios = true}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  return lienzo(
    <g transform={`translate(0 ${Math.sin(t * 2.2) * 3})`}>
      <line x1={x0 - 30} y1={base} x2={x1 + 40} y2={base} stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />
      {anios ? (
        <>
          <text x={x0} y={base + 56} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={48} fill={C.tinta}>2018</text>
          <text x={x1} y={base + 56} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={48} fill={C.tinta}>2025</text>
        </>
      ) : null}
      {series.map((sr, i) => {
        const k = ease(t, sr.en, sr.en + (sr.dur ?? 1.6));
        const e = ease(t, sr.en, sr.en + 0.3);
        const xe = x0 + (x1 - x0) * k;
        const ye = base - (sr.final * k / max) * hMax;
        const v = (sr.final * k).toFixed(0);
        const tam = sr.tam ?? 52;
        const ly0 = sr.pos === 'abajo' ? ye + tam + 24 : ye - 30;
        const ly = sr.pos === 'abajo' ? Math.min(ly0, base - 20) : ly0;
        const ew = ease(k, 0.4, 0.55);
        const anc = (sr.nombre.length + 8) * tam * 0.58;
        const pulso = 1 + 0.12 * Math.sin(t * 5 + i);
        return (
          <g key={i} opacity={e}>
            <line x1={x0} y1={base} x2={xe} y2={ye} stroke={sr.color} strokeWidth={16} strokeLinecap="round" />
            <circle cx={xe} cy={ye} r={20 * pulso} fill={sr.color} stroke={C.tinta} strokeWidth={5} />
            <text opacity={ew} x={Math.max(Math.min(xe + 90, 940), anc + 30)} y={ly} textAnchor="end" fontFamily={F.cifra} fontWeight={700} fontSize={tam} fill={C.tinta} stroke={C.crema} strokeWidth={8} paintOrder="stroke">{`${sr.nombre} +${v} %`}</text>
          </g>
        );
      })}
    </g>,
    s,
  );
};

const Doc: React.FC<{x: number; y: number; nuevo: boolean; k: number}> = ({x, y, nuevo, k}) => (
  <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * k})`} opacity={k}>
    <path d="M -34 -44 H 14 L 34 -24 V 44 H -34 Z" fill={nuevo ? C.mostaza : C.crema} stroke={C.tinta} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 14 -44 V -24 H 34" fill="none" stroke={C.tinta} strokeWidth={5} strokeLinejoin="round" />
    <line x1={-18} y1={-4} x2={18} y2={-4} stroke={C.tinta} strokeWidth={5} strokeLinecap="round" />
    <line x1={-18} y1={14} x2={18} y2={14} stroke={C.tinta} strokeWidth={5} strokeLinecap="round" />
    <line x1={-18} y1={32} x2={4} y2={32} stroke={C.tinta} strokeWidth={5} strokeLinecap="round" />
  </g>
);

/** Rejilla de contratos: todos se encienden; unos pocos (`nuevos`) en mostaza, el resto tinta/crema. Ocupa x 130..950. */
export const ContratosSerie: React.FC<{cols?: number; filas?: number; nuevos?: number; y?: number; en?: number; hasta?: number}> = ({cols = 6, filas = 3, nuevos = 3, y = 820, en = 0, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const n = cols * filas;
  const paso = 150;
  const x0 = 540 - ((cols - 1) * paso) / 2;
  return lienzo(
    <g transform={`translate(0 ${Math.sin(t * 2.2) * 4})`}>
      {Array.from({length: n}).map((_, i) => {
        const k = ease(t, en + i * 0.06, en + i * 0.06 + 0.3);
        const nuevo = i >= n - nuevos;
        return <Doc key={i} x={x0 + (i % cols) * paso} y={y + Math.floor(i / cols) * 170} nuevo={nuevo} k={k} />;
      })}
    </g>,
    s,
  );
};

export const REGISTRO_041: Record<string, React.FC<any>> = {lineasSerie: LineasSerie, contratosSerie: ContratosSerie};
