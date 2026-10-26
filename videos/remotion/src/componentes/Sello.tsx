import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {useSalida} from './util';

/** Sello MITO (teja) / DATO (tinta sobre mostaza) que cae sobre la pantalla. */
export const Sello: React.FC<{valor: 'MITO' | 'DATO'; en?: number; y?: number; angulo?: number; tamano?: number; x?: number; hasta?: number; /** px máximos que puede bajar de su posición final al rebotar (solo vertical) */ reboteMax?: number; /** altura inicial de la caída (por defecto -700) */ desde?: number; /** entrada sin rebote: frena y para en seco en la posición final */ seco?: boolean}> = ({valor, en = 0, y = 760, angulo = -8, tamano = 170, x = 510, hasta, reboteMax, seco, desde = -700}) => {
  const sal = useSalida(hasta);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - Math.round(en * fps), fps, config: {damping: 9, stiffness: 160, mass: 0.7}});
  const ts = Math.min(1, Math.max(0, (frame - Math.round(en * fps)) / (0.4 * fps)));
  const caidaSeca = -700 * Math.pow(1 - ts, 3);
  const mito = valor === 'MITO';
  const bg = mito ? C.teja : C.mostaza;
  const fg = mito ? C.crema : C.tinta;
  return (
    <div style={{position: 'absolute', left: x - SEGURA.ancho / 2, width: SEGURA.ancho, top: y, display: 'flex', justifyContent: 'center', opacity: frame >= Math.round(en * fps) ? sal : 0}}>
      <div style={{
        fontFamily: F.titular, fontSize: tamano, color: fg, background: bg, padding: '10px 54px', borderRadius: 18,
        border: `10px solid ${fg}`, transform: `translateY(${seco ? caidaSeca : Math.min((1 - p) * desde, reboteMax ?? Infinity)}px) rotate(${angulo}deg) scale(${seco ? 1 : 1 + (reboteMax === undefined ? (1 - p) * 0.5 : Math.max(0, 1 - p) * 0.15)})`,
        boxShadow: '0 14px 0 rgba(20,33,61,0.25)',
      }}>{valor}</div>
    </div>
  );
};
