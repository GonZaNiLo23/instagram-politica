import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';

/** Casilla numerada: vacía (borde discontinuo) hasta `llenaEn`, luego se rellena (el contenido es un Icono encima). x = centro. */
export const Casilla: React.FC<{numero: string; x: number; y?: number; ancho?: number; alto?: number; en?: number; hasta?: number; llenaEn?: number}> = ({numero, x, y = 580, ancho = 380, alto = 520, en = 0, hasta, llenaEn}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = useEntrada(en, 10);
  const s = useSalida(hasta);
  const llena = llenaEn !== undefined && frame >= llenaEn * fps;
  return (
    <div style={{position: 'absolute', left: x - ancho / 2, top: y, width: ancho, height: alto, borderRadius: 28, boxSizing: 'border-box', border: `8px ${llena ? 'solid' : 'dashed'} ${C.tinta}`, background: llena ? 'rgba(242,177,52,0.22)' : 'transparent', opacity: Math.min(p, 1) * s, transform: `scale(${0.7 + 0.3 * p})`}}>
      <div style={{position: 'absolute', left: 22, top: 6, fontFamily: F.cifra, fontWeight: 700, fontSize: 84, color: C.tinta, lineHeight: 1.1}}>{numero}</div>
    </div>
  );
};
