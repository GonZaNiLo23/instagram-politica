import React from 'react';
import {C} from '../tema';
import {useEntrada, useSalida} from './util';

/** Caja plana (pastilla) tinta semitransparente para dar contraste a un texto sobre una foto. x,y = esquina superior izquierda. */
export const Caja: React.FC<{x?: number; y: number; ancho?: number; alto: number; color?: string; opacidad?: number; radio?: number; en?: number; hasta?: number}> = ({x = 40, y, ancho = 1000, alto, color = C.tinta, opacidad = 0.8, radio = 28, en = 0, hasta}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  return <div style={{position: 'absolute', left: x, top: y, width: ancho, height: alto, background: color, opacity: opacidad * Math.min(p, 1) * s, borderRadius: radio}} />;
};
