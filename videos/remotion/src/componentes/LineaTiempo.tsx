import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {useEntrada, useSalida} from './util';

export type Hito = {etiqueta: string; detalle?: string; en: number; /** hito gris: no se enciende nunca en esta escena */ apagado?: boolean; /** ya encendido desde el primer fotograma */ ya?: boolean};

/**
 * Línea de tiempo horizontal con hitos que se encienden (`en` en segundos de la escena).
 * - `tramos`: la barra avanza de un hito encendido al siguiente (útil si hay hitos ya encendidos o apagados).
 * - `cursor`: marcador que recorre la línea; `pasos` = [[segundo, fracción 0..1], ...] (0 = primer hito, 1 = último).
 * - `compacta`: sin detalle bajo las etiquetas.
 */
export const LineaTiempo: React.FC<{hitos: Hito[]; y?: number; tramos?: boolean; cursor?: {pasos: [number, number][]; etiqueta?: string}; hasta?: number}> = ({hitos, y = 700, tramos = false, cursor, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrada = useEntrada(0);
  const sal = useSalida(hasta);
  const x0 = SEGURA.izq + 150;
  const x1 = SEGURA.der - 150;
  const n = hitos.length;
  const t = frame / fps;
  let prog: number;
  if (tramos) {
    prog = 0;
    for (let i = 0; i < n - 1; i++) {
      const a = hitos[i];
      const b = hitos[i + 1];
      if (a.apagado || b.apagado) continue;
      if (!(a.ya || t >= a.en)) continue;
      const f = b.ya ? 1 : interpolate(t, [a.en, b.en], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      prog = Math.max(prog, (i + f) / (n - 1));
    }
  } else {
    const ult = n ? hitos[n - 1].en : 0;
    prog = ult > 0 ? interpolate(frame, [0, ult * fps], [0, 1], {extrapolateRight: 'clamp'}) : 1;
  }
  const cur = cursor ? interpolate(t, cursor.pasos.map((p) => p[0]), cursor.pasos.map((p) => p[1]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : null;
  return (
    <div style={{position: 'absolute', left: 0, top: y, width: 1080, opacity: Math.min(entrada, 1) * sal}}>
      <div style={{position: 'absolute', left: x0, top: 36, width: x1 - x0, height: 10, background: C.piedra, borderRadius: 5}} />
      <div style={{position: 'absolute', left: x0, top: 36, width: (x1 - x0) * prog, height: 10, background: C.tinta, borderRadius: 5}} />
      {hitos.map((h, i) => {
        const x = n === 1 ? (x0 + x1) / 2 : x0 + ((x1 - x0) * i) / (n - 1);
        const on = !h.apagado && (h.ya || frame >= h.en * fps);
        const s = h.ya ? 1 : interpolate(frame, [h.en * fps, h.en * fps + 8], [0.6, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <div key={i} style={{position: 'absolute', left: x - 150, width: 300, textAlign: 'center', top: 0}}>
            <div style={{margin: '0 auto', width: 80, height: 80, borderRadius: 40, background: on ? C.mostaza : C.crema, border: `8px solid ${on ? C.tinta : C.piedra}`, transform: `scale(${on ? s : 0.8})`}} />
            <div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 64, color: C.tinta, opacity: on ? 1 : 0.6, marginTop: 12, lineHeight: 1.1}}>{h.etiqueta}</div>
            {h.detalle ? <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 64, color: C.tinta, opacity: on ? 1 : 0.6, lineHeight: 1.05, marginTop: i % 2 ? 72 : 0, transform: i % 2 ? 'translateX(-34px)' : undefined}}>{h.detalle}</div> : null}
          </div>
        );
      })}
      {cur !== null ? (
        <svg width="80" height="64" viewBox="0 0 80 64" style={{position: 'absolute', left: x0 + (x1 - x0) * cur - 40, top: -52, overflow: 'visible'}}>
          <path d="M6 4 H74 L40 60 Z" fill={C.tinta} stroke={C.tinta} strokeWidth={6} strokeLinejoin="round" />
          <path d="M20 12 H60 L40 44 Z" fill={C.mostaza} />
        </svg>
      ) : null}
    </div>
  );
};
