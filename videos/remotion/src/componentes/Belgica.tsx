import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';

/** Componentes de la pieza 023 (Bélgica, 541 días). Lienzo 1080x1920; `en`/`hasta`/tiempos en segundos de la ESCENA. */
const T = C.tinta;
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const cl = (x: number) => Math.min(1, Math.max(0, x));
const easeIO = (u: number) => u * u * (3 - 2 * u);

const Capa: React.FC<{en?: number; hasta?: number; children: React.ReactNode}> = ({en = 0, hasta, children}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const f = useCurrentFrame();
  const bob = 10 * Math.sin((f / 30) * 2.2); // movimiento suave continuo
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(p, 1) * s, transform: `translateY(${bob}px)`}}>{children}</svg>;
};

/**
 * Línea de tiempo horizontal con dos hitos (A a la izquierda, B a la derecha), barra que los une y llave con "541 DÍAS".
 * `a`/`b`: segundo en que se enciende cada hito (-1 = ya encendido). `barra`: {en, dur}. `llave`: segundo en que aparece.
 */
export const LineaBe: React.FC<{y?: number; x1?: number; x2?: number; a?: number; b?: number; barra?: {en: number; dur: number}; llave?: number; textoLlave?: string; en?: number; hasta?: number}> = ({
  y = 880, x1 = 170, x2 = 790, a = 0, b, barra, llave, textoLlave = '541 DÍAS', en = 0, hasta,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const nodo = (x: number, e: number | undefined) => {
    const u = e === undefined ? 0 : cl((t - e) / 0.35);
    const k = u === 0 ? 0 : 1 + 0.35 * Math.sin(Math.PI * Math.min(1, u)) * (e! >= 0 ? 1 : 0);
    return <circle cx={x} cy={y} r={28 * k + (u > 0 ? 0 : 0)} fill={u > 0 ? C.mostaza : C.crema} {...sw} />;
  };
  const prog = barra ? easeIO(cl((t - barra.en) / barra.dur)) : 0;
  const ll = llave === undefined ? 0 : easeIO(cl((t - llave) / 0.5));
  const yl = y + 56;
  return (
    <Capa en={en} hasta={hasta}>
      <path d={`M${x1 - 70} ${y} L${x2 + 70} ${y}`} stroke={T} strokeWidth={10} strokeLinecap="round" opacity={0.35} />
      {barra ? <path d={`M${x1} ${y} L${x1 + (x2 - x1) * prog} ${y}`} stroke={C.mostaza} strokeWidth={18} strokeLinecap="round" /> : null}
      {nodo(x1, a)}
      {b !== undefined ? nodo(x2, b) : <circle cx={x2} cy={y} r={20} fill={C.crema} {...sw} opacity={0.6} />}
      {ll > 0 ? (
        <g opacity={ll}>
          <path d={`M${x1} ${yl} q 0 34 40 34 L${(x1 + x2) / 2 - 34} ${yl + 34} q 34 0 34 28 q 0 -28 34 -28 L${x2 - 40} ${yl + 34} q 40 0 40 -34`} fill="none" {...sw} />
          <text x={(x1 + x2) / 2} y={yl + 150} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={84} fill={T}>{textoLlave}</text>
        </g>
      ) : null}
    </Capa>
  );
};

/** Trofeo genérico (sin el logotipo de Guinness) con la palabra RÉCORD debajo. */
export const TrofeoBe: React.FC<{x?: number; y?: number; tam?: number; en?: number; hasta?: number}> = ({x = 780, y = 960, tam = 240, en = 0, hasta}) => {
  const f = useCurrentFrame();
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const sc = tam / 200;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(e, 1) * s}}>
      <g transform={`translate(${x - 100 * sc} ${y - 100 * sc}) scale(${sc * (0.7 + 0.3 * Math.min(e, 1)) * (1 + 0.03 * Math.sin(f / 5))})`} style={{transformOrigin: '100px 100px'}}>
        <path d="M56 24 H144 V80 Q144 124 100 128 Q56 124 56 80 Z" fill={C.mostaza} {...sw} />
        <path d="M56 40 H30 Q26 82 62 92" fill="none" {...sw} />
        <path d="M144 40 H170 Q174 82 138 92" fill="none" {...sw} />
        <rect x="90" y="128" width="20" height="26" fill={C.mostaza} {...sw} />
        <rect x="64" y="154" width="72" height="22" rx="6" fill={C.mostaza} {...sw} />
      </g>
    </svg>
  );
};

/** Mapa plano y simplificado de Bélgica (400x300): tres regiones en gris piedra; Bruselas se ilumina en mostaza. */
export const MapaBe: React.FC<{x?: number; y?: number; w?: number; divideEn?: number; bruselasEn?: number; en?: number; hasta?: number}> = ({x = 540, y = 940, w = 340, divideEn = 0.4, bruselasEn = 1.0, en = 0, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const sc = w / 400;
  const d = easeIO(cl((t - divideEn) / 0.5));
  const b = cl((t - bruselasEn) / 0.35);
  const bob = 8 * Math.sin((frame / 30) * 2.2);
  const flandes = 'M18 78 L70 40 L130 22 L200 14 L262 32 L318 44 L372 62 L388 100 L360 126 L300 120 L252 132 L212 124 L176 134 L132 130 L96 142 L60 122 Z';
  const valonia = 'M96 142 L132 130 L176 134 L212 124 L252 132 L300 120 L360 126 L388 100 L396 150 L384 212 L346 244 L300 270 L262 246 L214 262 L160 244 L110 226 L70 196 L56 168 L60 122 Z';
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(e, 1) * s, transform: `translateY(${bob}px)`}}>
      <g transform={`translate(${x - 200 * sc} ${y - 150 * sc}) scale(${sc})`}>
        <path d={valonia} fill={C.piedra} fillOpacity={0.35 + 0.35 * d} stroke={T} strokeWidth={9} strokeLinejoin="round" />
        <path d={flandes} fill={C.piedra} fillOpacity={0.35 + 0.15 * d} stroke={T} strokeWidth={9} strokeLinejoin="round" />
        <circle cx={205} cy={126} r={8 + 22 * b} fill={b > 0 ? C.mostaza : C.piedra} stroke={T} strokeWidth={5} opacity={Math.max(d, b)} />
      </g>
    </svg>
  );
};

/** Barrido mostaza que cruza la pantalla de derecha a izquierda (transición); no lleva texto. */
export const BarridoBe: React.FC<{en?: number; dur?: number}> = ({en = 0, dur = 0.5}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = interpolate(frame, [en * fps, (en + dur) * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (u <= 0 || u >= 1) return null;
  return <div style={{position: 'absolute', top: 0, left: 0, width: 1080, height: 1920, background: C.mostaza, transform: `translateX(${(1 - 2 * u) * 1080}px)`, opacity: 0.95}} />;
};

export const REGISTRO_023: Record<string, React.FC<any>> = {lineaBe: LineaBe, trofeoBe: TrofeoBe, mapaBe: MapaBe, barridoBe: BarridoBe};
