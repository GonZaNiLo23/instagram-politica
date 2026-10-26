import React from 'react';
import {C, F, SEGURA, H} from '../tema';
import {useEntrada, useSalida} from './util';

/** Notas, fuentes y créditos de 36 px, alineados por abajo (termina en y=1494, dentro de la zona segura). Máx. 3 líneas visibles. `en`/`hasta` en segundos de la escena. */
export const Notas: React.FC<{lineas: string[]; sobre?: 'claro' | 'oscuro'; en?: number; hasta?: number; y?: number; izq?: number; ancho?: number; tamano?: number}> = ({lineas, sobre = 'claro', en = 0, hasta, y, izq = SEGURA.izq, ancho = SEGURA.ancho, tamano = 36}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  return (
    <div style={{position: 'absolute', left: izq, width: ancho, ...(y === undefined ? {bottom: H - 1488} : {top: y}), opacity: Math.min(p, 1) * s}}>
      {lineas.map((l, i) => (
        <div key={i} style={{fontFamily: F.texto, fontWeight: 600, fontSize: tamano, lineHeight: `${Math.round(tamano * 1.22)}px`, color: sobre === 'claro' ? C.tinta : C.crema}}>{l}</div>
      ))}
    </div>
  );
};
