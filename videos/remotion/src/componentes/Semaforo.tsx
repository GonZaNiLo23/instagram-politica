import React from 'react';
import {interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';

/**
 * Semáforo vertical de dos luces: "Competencias plenas" (turquesa) y "En funciones" (mostaza).
 * Hasta `cambioEn` (segundos de la escena) luce la primera; en ese instante cambia a la segunda.
 * `x`,`y` = esquina superior izquierda; `escala` reduce el conjunto; `etiquetas:false` quita los rótulos (versión mini).
 */
export const Semaforo: React.FC<{x?: number; y?: number; escala?: number; en?: number; hasta?: number; cambioEn?: number; etiquetas?: boolean; etiqueta1?: string; etiqueta2?: string; luz?: number}> = ({
  x = 70, y = 520, escala = 1, en = 0, hasta, cambioEn, etiquetas = true, etiqueta1 = 'Competencias plenas', etiqueta2 = 'En funciones', luz = 150,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = useEntrada(en);
  const sal = useSalida(hasta);
  const f0 = cambioEn === undefined ? Infinity : Math.round(cambioEn * fps);
  const k = (n: number) => Math.min(1, Math.max(0, n));
  const c = k((frame - f0) / 5); // 0 -> 1 en 5 fotogramas
  const luz1 = interpolateColors(c, [0, 1], [C.turquesa, C.piedra]);
  const luz2 = interpolateColors(c, [0, 1], [C.piedra, C.mostaza]);
  const rebote = frame >= f0 ? 1 + 0.12 * Math.exp(-(frame - f0) / 4) : 1;
  const L = luz;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 900, opacity: Math.min(p, 1) * sal, transform: `scale(${escala * (0.92 + 0.08 * p)})`, transformOrigin: 'left top'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: L + 50, height: 2 * L + 90, borderRadius: 40, background: C.tinta}} />
      {[luz1, luz2].map((col, i) => (
        <div key={i} style={{position: 'absolute', left: 25, top: 30 + i * (L + 30), width: L, height: L, borderRadius: L / 2, background: col, border: `6px solid ${C.crema}`, boxSizing: 'border-box', transform: `scale(${i === 1 ? rebote : 1})`}} />
      ))}
      {etiquetas ? (
        <>
          <div style={{position: 'absolute', left: L + 90, top: 30, width: 560, height: L, display: 'flex', alignItems: 'center', fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: C.tinta, opacity: c < 0.5 ? 1 : 0.55}}>{etiqueta1}</div>
          <div style={{position: 'absolute', left: L + 90, top: 30 + L + 30, width: 560, height: L, display: 'flex', alignItems: 'center', fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: C.tinta, opacity: c >= 0.5 ? 1 : 0.55}}>{etiqueta2}</div>
        </>
      ) : null}
    </div>
  );
};
