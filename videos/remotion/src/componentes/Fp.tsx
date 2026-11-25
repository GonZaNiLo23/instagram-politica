import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {useSalida} from './util';

/**
 * Pieza 078 (FP online privada). SVG a lienzo completo; `en` en segundos desde el inicio de la ESCENA.
 * REGISTRO_078: barraFp (barra 0-100 % con una franja de rango, valores desde el primer fotograma), topeFp (tres barras de tope, eje en 0).
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
const X0 = 100;
const W = 780;

/** Barra 0-100 %: etiqueta de 64 px arriba, franja `a`-`b` con sus cifras desde que entra. `ghost` la deja atenuada. */
export const BarraFp: React.FC<{
  y: number; etiqueta: string; a: number; b: number; en?: number; enBarra?: number; etiBanda?: string; hasta?: number; vivo?: boolean; ghost?: boolean; alto?: number;
}> = ({y, etiqueta, a, b, en = 0, enBarra = -1, etiBanda, hasta, vivo = true, ghost = false, alto = 90}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const eB = enBarra < 0 ? 1 : ease(t, enBarra, enBarra + 0.3);
  const k = ease(t, en, en + 0.5);
  const xa = X0 + (a / 100) * W;
  const xb = X0 + (b / 100) * W;
  const yb = y + (etiBanda ? 150 : 100);
  const yl = yb + alto + 55;
  const bal = vivo ? Math.sin(t * 2.4) * 6 : 0;
  const ym = yb + alto / 2;
  const pulso = 1 + (vivo ? Math.sin(t * 4) * 0.03 : 0);
  return lienzo(
    <g opacity={ghost ? 0.55 : 1} transform={`translate(0 ${bal})`}>
      <g opacity={eB}>
        <text x={SEGURA.izq} y={y + 62} fontFamily={F.texto} fontWeight={800} fontSize={64} fill={C.tinta}>{etiqueta}</text>
        <rect x={X0} y={yb} width={W} height={alto} fill={C.piedra} stroke={C.tinta} strokeWidth={5} />
        <text x={X0} y={yl} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={40} fill={C.tinta}>0 %</text>
        <text x={X0 + W} y={yl} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={40} fill={C.tinta}>100 %</text>
      </g>
      <g opacity={k} transform={`translate(${(xa + xb) / 2} ${ym}) scale(${pulso} ${0.4 + 0.6 * k}) translate(${-(xa + xb) / 2} ${-ym})`}>
        <rect x={xa} y={yb - 12} width={xb - xa} height={alto + 24} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
      </g>
      <g opacity={k}>
        <text x={xa} y={yl} textAnchor="middle" fontFamily={F.texto} fontWeight={800} fontSize={40} fill={C.tinta}>{a} %</text>
        <text x={xb} y={yl} textAnchor="middle" fontFamily={F.texto} fontWeight={800} fontSize={40} fill={C.tinta}>{b} %</text>
        {etiBanda ? <text x={(xa + xb) / 2} y={yb - 28} textAnchor="middle" fontFamily={F.texto} fontWeight={800} fontSize={40} fill={C.tinta}>{etiBanda}</text> : null}
      </g>
    </g>,
    s,
  );
};

/** Tres barras de tope de alumnos por docente (eje en 0, máximo 80). Cada fila entra en su `en`; valor y curso visibles desde que entra. */
export const TopeFp: React.FC<{
  filas: {valor: number; curso: string; en: number; resalta?: boolean}[]; y?: number; paso?: number; hasta?: number;
}> = ({filas, y = 600, paso = 190, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const max = 80;
  const largo = 640;
  const bal = Math.sin(t * 2.4) * 6;
  return lienzo(
    <g transform={`translate(0 ${bal})`}>
      <line x1={X0} y1={y - 20} x2={X0} y2={y + filas.length * paso - 40} stroke={C.tinta} strokeWidth={6} />
      {filas.map((f, i) => {
        const e = ease(t, f.en, f.en + 0.3);
        const k = ease(t, f.en, f.en + 0.6);
        const yb = y + i * paso;
        return (
          <g key={i} opacity={e}>
            <text x={X0 + 16} y={yb + 38} fontFamily={F.texto} fontWeight={700} fontSize={44} fill={C.tinta}>Curso {f.curso}</text>
            <rect x={X0} y={yb + 56} width={Math.max(0.001, (f.valor / max) * largo * k)} height={80} fill={f.resalta ? C.mostaza : C.piedra} stroke={C.tinta} strokeWidth={5} />
            <text x={X0 + (f.valor / max) * largo + 24} y={yb + 120} fontFamily={F.cifra} fontWeight={800} fontSize={80} fill={C.tinta} opacity={k}>{f.valor}</text>
          </g>
        );
      })}
    </g>,
    s,
  );
};

export const REGISTRO_078: Record<string, React.FC<any>> = {barraFp: BarraFp, topeFp: TopeFp};
