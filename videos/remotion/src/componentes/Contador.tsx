import React from 'react';
import {interpolate, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {useEntrada, miles} from './util';

/** Cifra con el separador de miles estrechado (que no ocupe una casilla entera de la fuente monoespaciada). */
const Cifra: React.FC<{texto: string}> = ({texto}) => (
  <>
    {texto.split('').map((ch, i) =>
      ch === '.' ? <span key={i} style={{display: 'inline-block', width: '0.15em', height: '0.15em', borderRadius: '50%', background: 'currentColor', margin: '0 0.09em'}} /> : <React.Fragment key={i}>{ch}</React.Fragment>,
    )}
  </>
);

/**
 * Cifra que sube (JetBrains Mono Bold). `en`, `espera` y `dur` en segundos.
 * La etiqueta pasa de `etiquetaDesde` a `etiqueta` en el MISMO fotograma en que empieza la cuenta (en + espera).
 * `salto`: sin cifras intermedias; la cifra pasa de `desde` a `hasta` de golpe en ese fotograma (con un pequeño rebote).
 */
export const Contador: React.FC<{desde?: number; hasta: number; en?: number; dur?: number; prefijo?: string; sufijo?: string; etiqueta?: string; etiquetaDesde?: string; espera?: number; salto?: boolean; tamEtiqueta?: number; izq?: number; y?: number; tamano?: number; color?: string}> = ({
  desde = 0, hasta, en = 0, dur = 1.5, prefijo = '', sufijo = '', etiqueta, etiquetaDesde, espera = 0, salto = false, tamEtiqueta = 64, izq = SEGURA.izq, y = 640, tamano = 190, color = C.tinta,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = useEntrada(en);
  const f0 = Math.round((en + espera) * fps);
  const v = salto
    ? (frame < f0 ? desde : hasta)
    : interpolate(frame, [f0, f0 + dur * fps], [desde, hasta], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const rebote = salto && frame >= f0 ? 1 + 0.14 * Math.exp(-(frame - f0) / 4) : 1;
  const lab = etiquetaDesde && frame < f0 ? etiquetaDesde : etiqueta;
  return (
    <div style={{position: 'absolute', left: izq, width: SEGURA.izq + SEGURA.ancho - izq, top: y, opacity: Math.min(p, 1), transform: `scale(${(0.9 + 0.1 * p) * rebote})`, transformOrigin: 'left center'}}>
      <div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: tamano, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1}}>{prefijo}<Cifra texto={miles(v)} />{sufijo}</div>
      {lab ? <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: tamEtiqueta, lineHeight: 1.15, color, marginTop: 14}}>{lab}</div> : null}
    </div>
  );
};
