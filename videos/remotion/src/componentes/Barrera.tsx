import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../tema';
import {useEntrada, useSalida} from './util';

/** Valla vertical a rayas (tinta/mostaza) con pie: corta el paso a lo que avanza hacia la derecha. `golpes` = segundos en que vibra. */
export const Barrera: React.FC<{x?: number; y?: number; alto?: number; ancho?: number; en?: number; hasta?: number; golpes?: number[]}> = ({
  x = 600, y = 620, alto = 440, ancho = 44, en = 0, hasta, golpes = [],
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = useEntrada(en);
  const s = useSalida(hasta);
  let dx = 0;
  golpes.forEach((g) => {
    const f = frame - g * fps;
    if (f >= 0 && f < 14) dx += 14 * Math.exp(-f / 4) * Math.cos(f * 1.6);
  });
  const franjas = Math.round(alto / 55);
  return (
    <div style={{position: 'absolute', left: x - ancho / 2 + dx, top: y, width: ancho, height: alto, opacity: Math.min(p, 1) * s, transform: `scaleY(${0.3 + 0.7 * Math.min(p, 1)})`, transformOrigin: 'bottom'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: ancho, height: alto - 20, borderRadius: 10, border: `6px solid ${C.tinta}`, boxSizing: 'border-box', overflow: 'hidden', background: C.crema}}>
        {Array.from({length: franjas}, (_, i) => (
          <div key={i} style={{width: ancho, height: (alto - 20) / franjas, background: i % 2 ? C.mostaza : C.tinta}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: -22, top: alto - 24, width: ancho + 44, height: 24, borderRadius: 8, background: C.tinta}} />
    </div>
  );
};
