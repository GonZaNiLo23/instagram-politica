import React from 'react';
import {C, F, SEGURA} from '../tema';

/** Etiqueta mostaza "NUESTRA LECTURA" fija arriba a la izquierda durante todo el bloque de opinión. */
export const EtiquetaLectura: React.FC = () => (
  <div style={{position: 'absolute', left: SEGURA.izq, top: SEGURA.arriba + 96}}>
    <span style={{fontFamily: F.titular, fontSize: 48, color: C.tinta, background: C.mostaza, padding: '8px 24px', borderRadius: 10}}>NUESTRA LECTURA</span>
  </div>
);
