import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useSalida} from './util';

/** Pieza 084 (multa pronto pago). REGISTRO_084: casillasM (20 casillas que se vacían), docM (alegaciones con candado), sobreM. `en`/tiempos en segundos de la ESCENA. */
const usa = () => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {t: fr / fps};
};
const ease = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
const lienzo = (children: React.ReactNode, s = 1) => (
  <div style={{opacity: s}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>{children}</svg>
  </div>
);

/** 20 casillas (2 filas de 10) que se vacían de izquierda a derecha; contador 20→0 con la etiqueta "DÍAS" desde el primer fotograma. */
export const CasillasM: React.FC<{y?: number; en?: number; ini?: number; dur?: number; hasta?: number}> = ({y = 760, en = 0.1, ini = 0.8, dur = 2.6, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, ini, ini + dur);
  const quedan = Math.max(0, Math.round(20 - 20 * k));
  const bal = Math.sin(t * 2.4) * 6;
  const w = 78, g = 10;
  return lienzo(
    <g transform={`translate(0 ${bal})`} opacity={ease(t, en, en + 0.3)}>
      <text x={470} y={y + 150} textAnchor="end" fontFamily={F.cifra} fontWeight={800} fontSize={300} fill={C.tinta}>{quedan}</text>
      <text x={500} y={y + 150} textAnchor="start" fontFamily={F.texto} fontWeight={800} fontSize={80} fill={C.tinta}>DÍAS</text>
      {Array.from({length: 20}).map((_, i) => {
        const fila = Math.floor(i / 10), col = i % 10;
        const vacia = i < 20 - quedan;
        return <rect key={i} x={60 + col * (w + g)} y={y + 260 + fila * (w + g)} width={w} height={w} rx={10} fill={vacia ? 'none' : C.mostaza} stroke={C.tinta} strokeWidth={5} strokeDasharray={vacia ? '10 8' : undefined} />;
      })}
    </g>,
    s,
  );
};

/** Documento de alegaciones que se atenúa al pagar, con candado al lado (no encima). */
export const DocM: React.FC<{y?: number; cae?: number; hasta?: number}> = ({y = 700, cae = 1.2, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, 0.2, 0.7);
  const d = ease(t, cae, cae + 0.6);
  const bal = Math.sin(t * 2.4) * 8;
  return lienzo(
    <g transform={`translate(0 ${bal})`}>
      <g transform={`translate(300 ${y})`} opacity={(1 - 0.65 * d) * k}>
        <rect x={-170} y={0} width={340} height={440} rx={14} fill={C.crema} stroke={C.tinta} strokeWidth={6} />
        {[70, 130, 190, 250, 310].map((yy) => <rect key={yy} x={-120} y={yy} width={240} height={16} rx={8} fill={C.tinta} />)}
        <text x={0} y={400} textAnchor="middle" fontFamily={F.texto} fontWeight={800} fontSize={36} fill={C.tinta}>ALEGACIONES</text>
      </g>
      <g transform={`translate(700 ${y + 120}) scale(${0.6 + 0.4 * d})`} opacity={d}>
        <path d="M-80 -30 V-100 A80 80 0 0 1 80 -100 V-30" fill="none" stroke={C.tinta} strokeWidth={26} strokeLinecap="round" />
        <rect x={-130} y={-40} width={260} height={210} rx={20} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
        <circle cx={0} cy={45} r={22} fill={C.tinta} />
        <rect x={-9} y={55} width={18} height={60} fill={C.tinta} />
      </g>
    </g>,
    s,
  );
};

/** Sobre de multa genérico (sin logos ni matrícula) con zoom de entrada; pensado para el bucle gancho-cierre. */
export const SobreM: React.FC<{y?: number; en?: number; hasta?: number; parte?: number}> = ({y = 800, en = 0, hasta, parte = 2.0}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const p = ease(t, parte, parte + 0.4);
  const z = 0.7 + 0.3 * ease(t, en, en + 0.5);
  const bal = Math.sin(t * 2.4) * 8;
  return lienzo(
    <g transform={`translate(540 ${y + bal}) scale(${z})`} opacity={ease(t, en, en + 0.2)}>
      <rect x={-330} y={-170} width={660} height={400} rx={18} fill={C.crema} stroke={C.tinta} strokeWidth={8} />
      <path d="M-330 -170 L0 60 L330 -170" fill="none" stroke={C.tinta} strokeWidth={8} strokeLinejoin="round" />
      <rect x={170} y={100} width={130} height={90} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
      <text x={-160} y={170} textAnchor="middle" fontFamily={F.cifra} fontWeight={800} fontSize={80 + 20 * p} fill={p > 0.5 ? C.mostaza : C.tinta} stroke={p > 0.5 ? C.tinta : 'none'} strokeWidth={3} paintOrder="stroke">{p > 0.5 ? '100 €' : '200 €'}</text>
    </g>,
    s,
  );
};

export const REGISTRO_084: Record<string, React.FC<any>> = {casillasM: CasillasM, docM: DocM, sobreM: SobreM};
