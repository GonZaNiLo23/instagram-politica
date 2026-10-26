import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {useSalida} from './util';

/** Sello rectangular mostaza con borde tinta y texto en varias líneas (p. ej. SPOILER). Cae ligeramente girado. Solo rótulo. */
export const SelloTexto: React.FC<{lineas: string[]; en?: number; hasta?: number; y?: number; angulo?: number; tamano?: number; fondo?: string; x?: number; /** px desde los que cae (por defecto 700: sale de arriba) */ desde?: number}> = ({lineas, en = 0, hasta, y = 640, angulo = -4, tamano = 64, fondo = C.mostaza, x = 540, desde = 700}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - Math.round(en * fps), fps, config: {damping: 9, stiffness: 160, mass: 0.7}});
  const s = useSalida(hasta);
  return (
    <div style={{position: 'absolute', left: x - SEGURA.ancho / 2, width: SEGURA.ancho, top: y, display: 'flex', justifyContent: 'center', opacity: frame >= Math.round(en * fps) ? s : 0}}>
      <div style={{
        fontFamily: F.titular, fontSize: tamano, lineHeight: 1.2, color: C.tinta, background: fondo, padding: '18px 24px', borderRadius: 18, textAlign: 'center',
        border: `10px solid ${C.tinta}`, transform: `translateY(${(1 - p) * -desde}px) rotate(${angulo}deg) scale(${1 + (1 - p) * 0.5})`, boxShadow: '0 14px 0 rgba(20,33,61,0.25)',
      }}>{lineas.map((l, i) => <div key={i}>{l}</div>)}</div>
    </div>
  );
};
