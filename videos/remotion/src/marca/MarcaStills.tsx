import React from 'react';
import {AbsoluteFill} from 'remotion';
import '../tema'; // carga las fuentes
import {simboloInterior, logoInterior} from './simbolos.mjs';

export type MarcaProps = {variante: string; tono: 'claro' | 'oscuro'; fondo: string; escala?: number};

/** Cuadrado 1080x1080: avatar / propuestas. Simbolo centrado con margen para el recorte circular. */
export const MarcaCuadrado: React.FC<MarcaProps> = ({variante, tono, fondo, escala = 0.52}) => (
  <AbsoluteFill style={{background: fondo === 'transparente' ? 'transparent' : fondo, alignItems: 'center', justifyContent: 'center'}}>
    <svg width={1080 * escala} height={1080 * escala} viewBox="0 0 200 200" dangerouslySetInnerHTML={{__html: simboloInterior(variante, tono)}} />
  </AbsoluteFill>
);

/** Logo horizontal 1440x480 con fondo transparente. */
export const MarcaHorizontal: React.FC<MarcaProps> = ({variante, tono}) => (
  <AbsoluteFill style={{background: 'transparent'}}>
    <svg width={1440} height={480} viewBox="0 0 720 240" dangerouslySetInnerHTML={{__html: logoInterior(variante, tono)}} />
  </AbsoluteFill>
);
