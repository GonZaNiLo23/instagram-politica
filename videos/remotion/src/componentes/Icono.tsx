import React from 'react';
import {interpolate, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, W} from '../tema';
import {DIBUJOS_INSTITUCIONES} from './DibujosInstituciones';
import {DIBUJOS_FRANCIA} from './IconosFrancia';
import {DIBUJOS_MOCION} from './DibujosMocion';
import {useEntrada, useSalida} from './util';

const T = C.tinta;
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

const Llama: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -46 C 14 -24 30 -14 24 10 C 20 26 -20 26 -24 10 C -28 -4 -12 -10 -6 -26 C -4 -34 -2 -40 0 -46 Z" fill={C.teja} {...sw} />
    <path d="M2 -14 C 10 -4 16 2 10 14 C 6 20 -8 20 -10 12 C -12 4 0 0 2 -14 Z" fill={C.mostaza} {...sw} strokeWidth={4} />
  </g>
);

/** Iconos vectoriales planos (viewBox 200x200). `p` = progreso 0..1 de la animación interna. */
const DIBUJOS: Record<string, (p: number, o: Record<string, any>) => React.ReactNode> = {
  // Móvil con globo de chat y rectángulo de vídeo GENÉRICO con "play" (no reproduce ningún vídeo real)
  movil: (p) => (
    <g>
      <rect x="50" y="8" width="100" height="184" rx="20" fill={C.crema} {...sw} />
      <rect x="86" y="16" width="28" height="6" rx="3" fill={T} />
      <g transform={`translate(0 ${(1 - p) * 30})`} opacity={Math.min(1, p * 2)}>
        <path d="M60 52 h80 a10 10 0 0 1 10 10 v82 a10 10 0 0 1 -10 10 h-50 l-18 16 v-16 h-12 a10 10 0 0 1 -10 -10 v-82 a10 10 0 0 1 10 -10z" fill={C.turquesa} {...sw} />
        <rect x="68" y="68" width="64" height="48" rx="6" fill={C.piedra} {...sw} strokeWidth={5} />
        <path d="M92 80 L92 104 L114 92 Z" fill={C.crema} stroke={T} strokeWidth={4} strokeLinejoin="round" />
        <rect x="70" y="126" width="50" height="7" rx="3.5" fill={C.crema} />
        <rect x="70" y="140" width="34" height="7" rx="3.5" fill={C.crema} />
      </g>
    </g>
  ),
  calendario: (p, o) => (
    <g>
      <rect x="14" y="30" width="172" height="152" rx="16" fill={C.crema} {...sw} />
      <path d="M14 46 a16 16 0 0 1 16 -16 h140 a16 16 0 0 1 16 16 v34 h-172 z" fill={C.teja} {...sw} />
      <rect x="52" y="12" width="14" height="36" rx="7" fill={T} />
      <rect x="134" y="12" width="14" height="36" rx="7" fill={T} />
      <text x="100" y="70" textAnchor="middle" fontFamily={F.titular} fontSize="30" fill={C.crema}>{o.mes ?? 'OCT'}</text>
      <text x="100" y="150" textAnchor="middle" fontFamily={F.titular} fontSize="80" fill={T}>{o.dia ?? '17'}</text>
    </g>
  ),
  carrito: (p) => (
    <g>
      <path d="M12 40 h28 l22 90 h92 l16 -62 h-120" fill="none" {...sw} />
      <path d="M52 68 h110 l-14 56 h-82 z" fill={C.mostaza} stroke="none" opacity={0.9} />
      <circle cx="78" cy="160" r="14" fill={T} />
      <circle cx="140" cy="160" r="14" fill={T} />
      <g transform={`translate(118 ${64 - p * 46}) rotate(12)`}>
        <path d="M-30 -18 h40 l22 18 l-22 18 h-40 z" fill={C.crema} {...sw} strokeWidth={5} />
        <circle cx="-20" cy="0" r="4" fill={T} />
        <text x="-8" y="8" fontFamily={F.cifra} fontWeight={700} fontSize="22" fill={T}>€</text>
      </g>
      <g transform={`translate(176 ${150 - p * 90})`}>
        <path d="M0 0 v-30 m-12 12 l12 -14 l12 14" fill="none" stroke={C.teja} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  ),
  edificioLlamas: (p) => (
    <g>
      <path d="M20 90 L100 38 L180 90 Z" fill={C.piedra} {...sw} />
      <rect x="32" y="90" width="136" height="14" fill={C.crema} {...sw} />
      {[44, 78, 112, 146].map((x) => <rect key={x} x={x} y="108" width="14" height="52" fill={C.crema} {...sw} strokeWidth={5} />)}
      <rect x="22" y="162" width="156" height="18" fill={C.piedra} {...sw} />
      <circle cx="100" cy="72" r="9" fill={C.crema} {...sw} strokeWidth={4} />
      <g opacity={Math.min(1, p * 3)}>
        <Llama x={52} y={88 - 6 * Math.sin(p * 20)} s={1.0} />
        <Llama x={104} y={70 - 8 * Math.sin(p * 20 + 1)} s={1.3} />
        <Llama x={152} y={90 - 6 * Math.sin(p * 20 + 2)} s={0.9} />
      </g>
    </g>
  ),
  palacio: () => (
    <g>
      <path d="M14 84 L100 34 L186 84 Z" fill={C.piedra} {...sw} />
      <rect x="26" y="84" width="148" height="12" fill={C.crema} {...sw} />
      {[40, 70, 100, 130, 160].map((x, i) => <rect key={i} x={x - 7} y="98" width="14" height="60" fill={C.crema} {...sw} strokeWidth={5} />)}
      <rect x="18" y="158" width="164" height="20" fill={C.piedra} {...sw} />
      <rect x="10" y="178" width="180" height="12" rx="4" fill={T} />
      <path d="M100 34 v-24 h22 v12 h-22" fill={C.teja} {...sw} strokeWidth={4} />
    </g>
  ),
  lupaPlaca: (p) => (
    <g>
      <path d="M58 20 h60 l22 24 v54 c0 34 -28 54 -52 66 c-24 -12 -52 -32 -52 -66 v-54 z" fill={C.tinta} {...sw} />
      <path d="M88 52 l8 18 l20 2 l-15 13 l5 20 l-18 -11 l-18 11 l5 -20 l-15 -13 l20 -2 z" fill={C.mostaza} transform="translate(0 4)" />
      <g transform={`translate(${(1 - p) * 40} ${(1 - p) * 30})`}>
        <circle cx="122" cy="118" r="38" fill="rgba(244,239,230,0.55)" stroke={C.mostaza} strokeWidth={12} />
        <circle cx="122" cy="118" r="44" fill="none" stroke={T} strokeWidth={4} />
        <path d="M152 150 L186 184" stroke={C.mostaza} strokeWidth={16} strokeLinecap="round" />
      </g>
    </g>
  ),
  pancarta: () => (
    <g>
      <rect x="22" y="28" width="10" height="164" rx="5" fill={T} />
      <rect x="168" y="28" width="10" height="164" rx="5" fill={T} />
      <rect x="22" y="40" width="156" height="84" rx="8" fill={C.mostaza} {...sw} />
      <rect x="44" y="64" width="112" height="10" rx="5" fill={T} />
      <rect x="44" y="88" width="80" height="10" rx="5" fill={T} />
    </g>
  ),
  casco: () => (
    <g>
      <path d="M26 100 C 26 46 60 18 100 18 C 140 18 174 46 174 100 Z" fill={C.tinta} {...sw} />
      <rect x="14" y="96" width="172" height="20" rx="10" fill={C.piedra} {...sw} />
      <rect x="44" y="36" width="40" height="10" rx="5" fill={C.crema} opacity={0.5} />
      <path d="M66 126 h68 v30 c0 14 -16 24 -34 30 c-18 -6 -34 -16 -34 -30 z" fill={C.mostaza} {...sw} />
      <path d="M100 138 l5 11 l12 1 l-9 8 l3 12 l-11 -7 l-11 7 l3 -12 l-9 -8 l12 -1 z" fill={T} />
    </g>
  ),
  check: (p) => (
    <g>
      <circle cx="100" cy="100" r="86" fill={C.turquesa} {...sw} />
      <path d="M58 104 L88 134 L144 70" fill="none" stroke={C.crema} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={140} strokeDashoffset={140 * (1 - p)} />
    </g>
  ),
  aspa: (p) => (
    <g>
      <circle cx="100" cy="100" r="86" fill={C.teja} {...sw} />
      <path d="M68 68 L132 132 M132 68 L68 132" fill="none" stroke={C.crema} strokeWidth={18} strokeLinecap="round" strokeDasharray={100} strokeDashoffset={100 * (1 - p)} />
    </g>
  ),
};

/** Icono plano centrado en (x, y). `en`/`hasta` en segundos desde el inicio de la escena.
 *  Nombres base: movil, calendario, carrito, edificioLlamas, palacio, lupaPlaca, pancarta, casco, check, aspa.
 *  Instituciones: interruptor, documento, selloBoe, atril, carpetas, sirena, documentoRayo, congreso, candado (simbolo: libro|mapa|urna),
 *  surtidor, gota, libroCuentas, carpeta, cruzPiedra.
 *  `etiqueta`: texto 64 px bajo el icono (sobre fondo plano). `mover`: {x, y, en, dur, arco} desplaza el icono (arco = salto en px). */
export const Icono: React.FC<{nombre: string; x?: number; y?: number; tamano?: number; en?: number; hasta?: number; dur?: number; mes?: string; dia?: string; simbolo?: string; etiqueta?: string; anchoEtiqueta?: number; animEn?: number; disco?: boolean; vibra?: [number, number]; color?: string; mover?: {x: number; y: number; en: number; dur: number; arco?: number}}> = ({
  nombre, x = W / 2, y = 700, tamano = 420, en = 0, hasta, dur = 1.2, mes, dia, simbolo, etiqueta, anchoEtiqueta, animEn, mover, disco, vibra, color,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const p = interpolate(frame, [(animEn ?? en + 0.2) * fps, ((animEn ?? en + 0.2) + dur) * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const d = DIBUJOS[nombre] ?? DIBUJOS_INSTITUCIONES[nombre] ?? DIBUJOS_FRANCIA[nombre] ?? DIBUJOS_MOCION[nombre];
  if (!d) throw new Error(`Icono desconocido: ${nombre}`);
  let dx = 0;
  let dy = 0;
  if (mover) {
    const m = interpolate(frame, [mover.en * fps, (mover.en + mover.dur) * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
    dx = m * (mover.x - x);
    dy = m * (mover.y - y) - (mover.arco ?? 0) * Math.sin(Math.PI * m);
  }
  const aEt = anchoEtiqueta ?? Math.max(tamano, 420);
  return (
    <div style={{position: 'absolute', left: x - tamano / 2 + dx, top: y - tamano / 2 + dy, width: tamano, height: tamano, opacity: Math.min(e, 1) * s, transform: `scale(${0.6 + 0.4 * e}) rotate(${vibra && frame >= vibra[0] * fps && frame < vibra[1] * fps ? 4 * Math.sin(frame * 1.9) * Math.min(1, (frame - vibra[0] * fps) / 6) : 0}deg)`}}>
      {disco ? <div style={{position: 'absolute', left: -tamano * 0.1, top: -tamano * 0.1, width: tamano * 1.2, height: tamano * 1.2, borderRadius: '50%', background: C.crema}} /> : null}
      <svg viewBox="0 0 200 200" width={tamano} height={tamano} style={{overflow: 'visible', position: 'relative'}}>{d(p, {mes, dia, simbolo, color})}</svg>
      {etiqueta ? (
        <div style={{position: 'absolute', left: (tamano - aEt) / 2, width: aEt, top: tamano + 6, textAlign: 'center', fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: C.tinta}}>{etiqueta}</div>
      ) : null}
    </div>
  );
};
