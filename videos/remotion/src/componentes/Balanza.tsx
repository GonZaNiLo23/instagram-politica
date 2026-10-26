import React from 'react';
import {interpolate, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';

/**
 * Balanza de dos platos. Izquierda: tic turquesa "CONVALIDA". Derecha: cruz gris piedra "DEROGA" (nunca teja).
 * x,y = pivote central. `ticEn`/`cruzEn` = segundos en que aparecen los símbolos. `oscila` = segundos en que el astil oscila (amortiguado).
 * `mover` desplaza y reduce la balanza ({x,y,escala,en,dur}). `etiquetasHasta` = segundo en que se retiran los rótulos.
 */
export const Balanza: React.FC<{x?: number; y?: number; escala?: number; en?: number; hasta?: number; ticEn?: number; cruzEn?: number; oscila?: number[]; mover?: {x: number; y: number; escala: number; en: number; dur: number}; inclina?: {en: number; grados: number}; etiquetas?: boolean; etiquetasHasta?: number; etiquetaIzq?: string; etiquetaDer?: string}> = ({
  x = 540, y = 780, escala = 1, en = 0, hasta, ticEn, cruzEn, oscila = [], mover, etiquetas = true, etiquetasHasta, etiquetaIzq = 'CONVALIDA', etiquetaDer = 'DEROGA', inclina,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const p = useEntrada(en);
  const sal = useSalida(hasta);
  const salEt = useSalida(etiquetasHasta);
  let m = 0;
  if (mover) m = interpolate(frame, [mover.en * fps, (mover.en + mover.dur) * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const px = mover ? x + (mover.x - x) * m : x;
  const py = mover ? y + (mover.y - y) * m : y;
  const esc = mover ? escala + (mover.escala - escala) * m : escala;
  // astil: oscilación amortiguada tras cada instante de `oscila`
  let ang = 0;
  if (inclina) ang += inclina.grados * Math.min(1, Math.max(0, (t - inclina.en) / 0.5)) * (1 - 0.0);
  oscila.forEach((o) => {
    const q = t - o;
    if (q >= 0) ang += 11 * Math.exp(-q * 2.2) * Math.sin(q * 7.5);
  });
  const rad = (ang * Math.PI) / 180;
  const R = 270;
  const cx = 350;
  const cy = 110;
  const Lx = cx - R * Math.cos(rad);
  const Ly = cy - R * Math.sin(rad);
  const Rx = cx + R * Math.cos(rad);
  const Ry = cy + R * Math.sin(rad);
  const cuelga = 150;
  const aparece = (e?: number) => (e === undefined ? 0 : interpolate(t, [e, e + 0.3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))}));
  const tic = aparece(ticEn);
  const cruz = aparece(cruzEn);
  const sw = {stroke: C.tinta, strokeWidth: 8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const plato = (ex: number, ey: number) => (
    <g>
      <path d={`M${ex} ${ey} L${ex - 80} ${ey + cuelga} M${ex} ${ey} L${ex + 80} ${ey + cuelga}`} fill="none" {...sw} strokeWidth={5} />
      <path d={`M${ex - 100} ${ey + cuelga} h200 a100 56 0 0 1 -200 0 z`} fill={C.crema} {...sw} />
    </g>
  );
  return (
    <div style={{position: 'absolute', left: px - cx, top: py - cy, width: 700, height: 560, opacity: Math.min(p, 1) * sal, transform: `scale(${esc * (0.85 + 0.15 * p)})`, transformOrigin: `${cx}px ${cy}px`}}>
      <svg width="700" height="560" viewBox="0 0 700 560" style={{overflow: 'visible'}}>
        <path d={`M${cx - 18} ${cy} L${cx - 56} 400 h112 L${cx + 18} ${cy} z`} fill={C.piedra} {...sw} />
        <rect x={cx - 80} y="398" width="160" height="26" rx="10" fill={C.tinta} />
        <path d={`M${Lx} ${Ly} L${Rx} ${Ry}`} stroke={C.tinta} strokeWidth={20} strokeLinecap="round" />
        {plato(Lx, Ly)}
        {plato(Rx, Ry)}
        <circle cx={cx} cy={cy} r="24" fill={C.mostaza} {...sw} />
        <g transform={`translate(${Lx} ${Ly + cuelga - 20}) scale(${tic})`}>
          <circle r="46" cy="-46" fill={C.turquesa} {...sw} />
          <path d="M-22 -46 L-6 -28 L24 -64" fill="none" stroke={C.crema} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g transform={`translate(${Rx} ${Ry + cuelga - 20}) scale(${cruz})`}>
          <circle r="46" cy="-46" fill={C.piedra} {...sw} />
          <path d="M-22 -68 L22 -24 M22 -68 L-22 -24" fill="none" stroke={C.crema} strokeWidth={13} strokeLinecap="round" />
        </g>
      </svg>
      {etiquetas ? (
        <>
          <div style={{position: 'absolute', left: cx - R - 200, width: 400, top: cy + cuelga + 74, textAlign: 'center', fontFamily: F.texto, fontWeight: 700, fontSize: 64, color: C.tinta, opacity: salEt}}>{etiquetaIzq}</div>
          <div style={{position: 'absolute', left: cx + R - 200, width: 400, top: cy + cuelga + 74, textAlign: 'center', fontFamily: F.texto, fontWeight: 700, fontSize: 64, color: C.tinta, opacity: salEt}}>{etiquetaDer}</div>
        </>
      ) : null}
    </div>
  );
};
