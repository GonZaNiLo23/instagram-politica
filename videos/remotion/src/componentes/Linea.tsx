import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, W} from '../tema';

/** Línea divisoria horizontal (p. ej. pantalla partida). Crece desde el centro. */
export const Linea: React.FC<{y: number; ancho?: number; grosor?: number; en?: number; color?: string}> = ({y, ancho = 700, grosor = 4, en = 0, color = C.tinta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = interpolate(frame, [en * fps, (en + 0.3) * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{position: 'absolute', left: (W - ancho * p) / 2, width: ancho * p, top: y, height: grosor, background: color, borderRadius: grosor / 2}} />;
};
