import React from 'react';
import {interpolate, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';

/** Cronómetro que cuenta atrás de `desde` a `hasta` (días) entre `inicio` y `inicio+dur` (segundos de la escena). Cifra en JetBrains Mono. */
export const Cronometro: React.FC<{x?: number; y?: number; tamano?: number; en?: number; ocultarEn?: number; desde?: number; hasta?: number; inicio?: number; dur?: number; unidad?: string}> = ({
  x = 540, y = 780, tamano = 340, en = 0, ocultarEn, desde = 30, hasta = 0, inicio = 0.4, dur = 2, unidad = 'días',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = useEntrada(en);
  const sal = useSalida(ocultarEn);
  const q = interpolate(frame, [inicio * fps, (inicio + dur) * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const n = Math.round(desde + (hasta - desde) * q);
  const fin = q >= 1;
  const ang = q * 2 * Math.PI;
  return (
    <div style={{position: 'absolute', left: x - tamano / 2, top: y - tamano / 2, width: tamano, height: tamano, opacity: Math.min(p, 1) * sal, transform: `scale(${0.7 + 0.3 * p})`}}>
      <svg viewBox="0 0 200 200" width={tamano} height={tamano} style={{overflow: 'visible'}}>
        <rect x="88" y="-6" width="24" height="18" rx="5" fill={C.tinta} />
        <rect x="76" y="-12" width="48" height="10" rx="5" fill={C.tinta} />
        <circle cx="100" cy="106" r="86" fill={C.crema} stroke={C.tinta} strokeWidth={9} />
        {q > 0 && q < 1 ? (
          <path d={`M100 106 L100 32 A 74 74 0 ${q > 0.5 ? 1 : 0} 1 ${100 + 74 * Math.sin(ang)} ${106 - 74 * Math.cos(ang)} Z`} fill={C.mostaza} opacity={0.6} />
        ) : null}
        {fin ? <circle cx="100" cy="106" r="74" fill={C.turquesa} opacity={0.35} /> : null}
        {Array.from({length: 12}, (_, i) => <rect key={i} x="97" y="26" width="6" height="10" fill={C.tinta} transform={`rotate(${i * 30} 100 106)`} />)}
        <g transform={`rotate(${q * 360} 100 106)`}><rect x="96" y="36" width="8" height="70" rx="4" fill={C.tinta} /></g>
        <circle cx="100" cy="106" r="9" fill={C.tinta} />
      </svg>
      <div style={{position: 'absolute', left: tamano * 0.2, width: tamano * 0.6, top: tamano * 0.6, textAlign: 'center', fontFamily: F.cifra, fontWeight: 700, fontSize: tamano * 0.27, lineHeight: 1.05, color: C.tinta, background: C.crema, borderRadius: 14, border: `5px solid ${C.tinta}`}}>{n}</div>
      <div style={{position: 'absolute', left: 0, width: tamano, top: tamano + 4, textAlign: 'center', fontFamily: F.texto, fontWeight: 700, fontSize: 64, color: C.tinta}}>{unidad}</div>
    </div>
  );
};
