import React from 'react';
import {C, F, SEGURA} from '../tema';
import {useEntrada, useSalida} from './util';

/** Texto en pantalla (64-80 px, máx. 7 palabras, mínimo 48 px). */
export const Rotulo: React.FC<{texto: string; en?: number; hasta?: number; y?: number; tamano?: number; color?: string; pastilla?: boolean | 'tinta' | string; align?: 'left' | 'center'; izq?: number; ancho?: number}> = ({
  texto, en = 0, hasta, y = 560, tamano = 72, color = C.tinta, pastilla = false, align = 'left', izq = SEGURA.izq, ancho = SEGURA.ancho,
}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  if (texto.trim().split(/\s+/).length > 7) {
    console.warn(`AVISO: rótulo con más de 7 palabras: "${texto}"`);
  }
  return (
    <div style={{
      position: 'absolute', left: izq, width: ancho, top: y, textAlign: align,
      opacity: Math.min(p, 1) * s, transform: `translateX(${(1 - p) * -60}px)`,
    }}>
      <span style={{
        fontFamily: F.texto, fontWeight: 700, fontSize: Math.max(tamano, 48), lineHeight: 1.2, color,
        ...(pastilla ? {background: pastilla === 'tinta' ? C.tinta : typeof pastilla === 'string' && pastilla.startsWith('#') ? pastilla : C.mostaza, color: pastilla === 'tinta' ? C.crema : C.tinta, padding: '6px 22px', borderRadius: 14, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'} : {}),
      }}>{texto}</span>
    </div>
  );
};
