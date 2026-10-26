import React from 'react';
import {C, F, SEGURA} from '../tema';
import {useEntrada, useSalida} from './util';

/** Texto grande de gancho (110-140 px) con entrada de muelle. */
export const Gancho: React.FC<{texto: string; en?: number; hasta?: number; y?: number; tamano?: number; color?: string; resalta?: string}> = ({
  texto, en = 0, hasta, y = 600, tamano = 124, color = C.tinta, resalta,
}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  return (
    <div style={{
      position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: y,
      fontFamily: F.titular, fontSize: tamano, lineHeight: 1.06, color, textTransform: 'uppercase',
      opacity: Math.min(p, 1) * s, transform: `translateY(${(1 - p) * 90}px) scale(${0.94 + 0.06 * p})`,
    }}>
      {resalta ? <span style={{background: C.mostaza, color: C.tinta, padding: '0 14px'}}>{resalta}</span> : null}
      {resalta ? ' ' : null}{texto}
    </div>
  );
};
