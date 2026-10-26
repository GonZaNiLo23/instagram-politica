import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, SEGURA} from '../tema';
import {useSalida} from './util';

export type Bloque = {n: number; color: string; borde?: string};

/** Puntos agrupados en bloques de distinto tamaño (colores neutros de marca). Brotan con retraso por bloque. */
export const Bloques: React.FC<{bloques?: Bloque[]; y?: number; punto?: number; hueco?: number; separacion?: number; en?: number; hasta?: number}> = ({
  bloques = [{n: 24, color: C.tinta}, {n: 18, color: C.turquesa}, {n: 12, color: C.mostaza}, {n: 9, color: C.piedra}, {n: 6, color: C.crema, borde: C.tinta}],
  y = 700, punto = 32, hueco = 8, separacion = 44, en = 0, hasta,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sal = useSalida(hasta);
  const paso = punto + hueco;
  const dots = useMemo(() => {
    const out: {x: number; y: number; c: string; b?: string; k: number; ord: number}[] = [];
    let cx = 0;
    let cy = 0;
    let altoFila = 0;
    let ord = 0;
    bloques.forEach((b, bi) => {
      const cols = Math.ceil(Math.sqrt(b.n * 1.3));
      const filas = Math.ceil(b.n / cols);
      const w = cols * paso - hueco;
      const h = filas * paso - hueco;
      if (cx > 0 && cx + w > SEGURA.ancho) { cx = 0; cy += altoFila + separacion; altoFila = 0; }
      for (let i = 0; i < b.n; i++) out.push({x: cx + (i % cols) * paso, y: cy + Math.floor(i / cols) * paso, c: b.color, b: b.borde, k: bi, ord: ord++});
      cx += w + separacion;
      altoFila = Math.max(altoFila, h);
    });
    return out;
  }, [bloques, paso, hueco, separacion]);
  return (
    <div style={{position: 'absolute', left: SEGURA.izq, top: y, width: SEGURA.ancho, opacity: sal}}>
      {dots.map((d, i) => {
        const ini = (en + d.k * 0.25 + (d.ord / dots.length) * 0.5) * fps;
        const s = interpolate(frame, [ini, ini + 9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
        return <div key={i} style={{position: 'absolute', left: d.x, top: d.y, width: punto, height: punto, borderRadius: punto / 2, background: d.c, border: d.b ? `4px solid ${d.b}` : 'none', boxSizing: 'border-box', transform: `scale(${s})`}} />;
      })}
    </div>
  );
};
