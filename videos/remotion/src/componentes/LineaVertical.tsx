import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {useEntrada, useSalida} from './util';

export type FilaV = {fecha: string; texto: string; nota?: string; en: number; salto?: boolean};

/** Línea de tiempo vertical: punto + fecha (cifra) + texto a 64 px; la fila se enciende en `en`. `nota` = 36 px bajo la fila. */
export const LineaVertical: React.FC<{filas: FilaV[]; y?: number; paso?: number; hasta?: number; en?: number}> = ({filas, y = 560, paso = 112, hasta, en = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const extra = (i: number) => filas.slice(0, i).reduce((a, f) => a + (f.nota ? 44 : 0) + (f.salto ? 76 : 0), 0);
  const alto = filas.length * paso + extra(filas.length) + 0;
  const ult = filas[filas.length - 1].en;
  const prog = interpolate(frame, [filas[0].en * fps, ult * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: SEGURA.izq, top: y, width: SEGURA.ancho, height: alto, opacity: Math.min(e, 1) * s, visibility: frame < en * fps ? 'hidden' : 'visible'}}>
      <div style={{position: 'absolute', left: 32, top: 40, width: 10, height: alto - 90, background: C.piedra, borderRadius: 5}} />
      <div style={{position: 'absolute', left: 32, top: 40, width: 10, height: (alto - 90) * prog, background: C.tinta, borderRadius: 5}} />
      {filas.map((f, i) => {
        const on = frame >= f.en * fps;
        const k = interpolate(frame, [f.en * fps, f.en * fps + 8], [0.6, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <div key={i} style={{position: 'absolute', left: 0, top: i * paso + extra(i), width: SEGURA.ancho, opacity: on ? 1 : 0.35}}>
            <div style={{position: 'absolute', left: 0, top: 6, width: 74, height: 74, borderRadius: 37, boxSizing: 'border-box', background: on ? C.mostaza : C.crema, border: `8px solid ${on ? C.tinta : C.piedra}`, transform: `scale(${on ? k : 0.8})`}} />
            <div style={{position: 'absolute', left: 100, top: 0, fontFamily: F.cifra, fontWeight: 700, fontSize: 64, lineHeight: '86px', color: C.tinta, whiteSpace: 'nowrap'}}>
              {f.fecha}{f.salto ? null : <span style={{fontFamily: F.texto, marginLeft: 22}}>{f.texto}</span>}
            </div>
            {f.salto ? <div style={{position: 'absolute', left: 100, top: 80, fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: '76px', color: C.tinta, whiteSpace: 'nowrap'}}>{f.texto}</div> : null}
            {f.nota ? <div style={{position: 'absolute', left: 100, top: f.salto ? 158 : 82, fontFamily: F.texto, fontWeight: 600, fontSize: 36, lineHeight: '40px', color: C.tinta}}>{f.nota}</div> : null}
          </div>
        );
      })}
    </div>
  );
};
