import React from 'react';
import {C, F, SEGURA} from '../tema';
import {useEntrada, useSalida} from './util';

/** "Fuente: ..." en 36 px, abajo dentro de la zona segura (termina antes de y=1500; si ocupa dos líneas, sube). `en`/`hasta` en segundos de la escena. */
export const Fuente: React.FC<{texto: string; sobre?: 'claro' | 'oscuro'; en?: number; hasta?: number; nota?: boolean; y?: number}> = ({texto, sobre = 'claro', en, hasta, nota = false, y}) => {
  const p = useEntrada(en ?? 0);
  const s = useSalida(hasta);
  const t = nota || /^(Fuente|Según)/.test(texto) ? texto : `Fuente: ${texto}`;
  const lineas = t.length > 46 ? 2 : 1;
  const op = (en === undefined ? 1 : Math.min(p, 1)) * s;
  return (
    <div style={{
      position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: y ?? SEGURA.abajo - 12 - lineas * 44,
      fontFamily: F.texto, fontWeight: 600, fontSize: 36, lineHeight: '44px', color: sobre === 'claro' ? C.tinta : C.crema, opacity: 0.9 * op,
    }}>{t}</div>
  );
};
