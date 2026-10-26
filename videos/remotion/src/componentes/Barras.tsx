import React from 'react';
import {interpolate, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {miles, useSalida} from './util';

export type DatoBarra = {etiqueta: string; valor: number; color?: string; texto?: string};

/** Barras horizontales con cifra al final. Eje SIEMPRE desde 0, escala proporcional a `max` (por defecto el mayor valor). */
export const Barras: React.FC<{datos: DatoBarra[]; max?: number; en?: number; y?: number; alto?: number; sufijo?: string; color?: string; hasta?: number}> = ({datos, max, en = 0, y = 600, alto = 90, sufijo = '', color = C.tinta, hasta}) => {
  const sal = useSalida(hasta);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const m = max ?? Math.max(...datos.map((d) => d.valor));
  const anchoMax = SEGURA.ancho - 330; // sitio para la cifra
  return (
    <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: y, opacity: sal}}>
      {datos.map((d, i) => {
        const ini = (en + i * 0.35) * fps;
        const p = interpolate(frame, [ini, ini + 0.9 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
        return (
          <div key={i} style={{marginBottom: 44, opacity: p > 0 ? 1 : 0}}>
            <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 64, color, marginBottom: 6, lineHeight: 1.1}}>{d.etiqueta}</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <div style={{width: (d.valor / m) * anchoMax * p, height: alto, background: d.color ?? (i % 2 ? C.piedra : C.tinta), borderRadius: 10}} />
              <div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 64, color}}>{d.texto ?? `${miles(d.valor)}${sufijo}`}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
