import React from 'react';
import {interpolate, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';

export type DatoBarraV = {etiqueta: string; valor: number; color?: string; texto?: string};

/** Barras verticales con eje desde 0 y escala proporcional a `max`. x = centro del grupo; `ancho` total; cifras y etiquetas de 64 px. `base` = y de la línea base. */
export const BarrasV: React.FC<{datos: DatoBarraV[]; max: number; x?: number; base?: number; altoMax?: number; ancho?: number; en?: number}> = ({datos, max, x = 540, base = 1000, altoMax = 420, ancho = 440, en = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = datos.length;
  const colW = Math.min(170, ancho / n - 40);
  const top0 = base - altoMax;
  return (
    <div style={{position: 'absolute', left: x - ancho / 2, top: top0, width: ancho, height: altoMax + 110}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: altoMax, height: 8, background: C.tinta, borderRadius: 4}} />
      {datos.map((d, i) => {
        const ini = (en + i * 0.45) * fps;
        const p = interpolate(frame, [ini, ini + 0.8 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
        const h = (d.valor / max) * altoMax * p;
        const cx = ((i + 0.5) * ancho) / n;
        return (
          <div key={i} style={{opacity: p > 0 ? 1 : 0}}>
            <div style={{position: 'absolute', left: cx - colW / 2, width: colW, top: altoMax - h, height: h, background: d.color ?? (i % 2 ? C.tinta : C.piedra), borderRadius: '10px 10px 0 0'}} />
            <div style={{position: 'absolute', left: cx - 160, width: 320, textAlign: 'center', top: altoMax - h - 76, fontFamily: F.cifra, fontWeight: 700, fontSize: 64, color: C.tinta, opacity: p}}>{d.texto ?? d.valor}</div>
            <div style={{position: 'absolute', left: cx - 160, width: 320, textAlign: 'center', top: altoMax + 18, fontFamily: F.texto, fontWeight: 700, fontSize: 64, color: C.tinta, lineHeight: 1.1}}>{d.etiqueta}</div>
          </div>
        );
      })}
    </div>
  );
};
