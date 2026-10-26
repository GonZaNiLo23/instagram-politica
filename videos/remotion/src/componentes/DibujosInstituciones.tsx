import React from 'react';
import {interpolateColors} from 'remotion';
import {C, F} from '../tema';

const T = C.tinta;
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const cl = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

const Carpeta: React.FC<{x: number; y: number; color: string; w?: number}> = ({x, y, color, w = 120}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M0 10 a8 8 0 0 1 8 -8 h34 l12 14 h${w - 54} a8 8 0 0 1 8 8 v${w * 0.58} a8 8 0 0 1 -8 8 h-${w - 16} a8 8 0 0 1 -8 -8 z`} fill={color} {...sw} strokeWidth={6} />
    <rect x="14" y="40" width={w - 40} height="7" rx="3.5" fill={T} opacity={0.55} />
    <rect x="14" y="56" width={(w - 40) * 0.6} height="7" rx="3.5" fill={T} opacity={0.55} />
  </g>
);

/** Iconos de instituciones y trámites (viewBox 200x200). `p` = progreso 0..1 de la animación interna. */
export const DIBUJOS_INSTITUCIONES: Record<string, (p: number, o: Record<string, any>) => React.ReactNode> = {
  // Interruptor: la palanca baja con p
  interruptor: (p) => (
    <g>
      <rect x="44" y="10" width="112" height="180" rx="22" fill={C.crema} {...sw} />
      <rect x="82" y="44" width="36" height="112" rx="18" fill={T} />
      <g transform={`rotate(${-34 + 68 * p} 100 100)`}>
        <rect x="86" y="48" width="28" height="56" rx="14" fill={p > 0.5 ? C.piedra : C.mostaza} {...sw} strokeWidth={6} />
        <circle cx="100" cy="100" r="16" fill={C.crema} {...sw} strokeWidth={6} />
      </g>
    </g>
  ),
  documento: () => (
    <g>
      <path d="M44 12 h82 l32 32 v140 a8 8 0 0 1 -8 8 h-106 a8 8 0 0 1 -8 -8 v-164 a8 8 0 0 1 8 -8z" fill={C.crema} {...sw} />
      <path d="M126 12 v32 h32" fill={C.piedra} {...sw} strokeWidth={6} />
      {[70, 96, 122, 148].map((y, i) => <rect key={y} x="62" y={y} width={i === 3 ? 44 : 76} height="9" rx="4.5" fill={T} opacity={0.6} />)}
    </g>
  ),
  // Sello "BOE" que cae con un golpe seco (p rápido)
  selloBoe: (p) => {
    const caida = (1 - p) * -90;
    return (
      <g transform={`translate(0 ${caida}) rotate(${(1 - p) * -10} 100 100)`}>
        <rect x="84" y="4" width="32" height="50" rx="12" fill={T} />
        <rect x="52" y="50" width="96" height="14" rx="6" fill={T} />
        <rect x="30" y="64" width="140" height="84" rx="12" fill={C.mostaza} {...sw} />
        <text x="100" y="124" textAnchor="middle" fontFamily={F.titular} fontSize="58" fill={T}>BOE</text>
      </g>
    );
  },
  // Atril con micrófono que se tacha
  atril: (p) => (
    <g>
      <path d="M56 70 h88 l16 112 h-120 z" fill={C.piedra} {...sw} />
      <path d="M44 70 h112 l-8 -22 h-96 z" fill={T} {...sw} />
      <path d="M100 48 v-26" stroke={T} strokeWidth={8} strokeLinecap="round" />
      <rect x="86" y="2" width="28" height="30" rx="14" fill={C.mostaza} {...sw} strokeWidth={6} />
      <path d="M22 28 L178 178" fill="none" stroke={C.teja} strokeWidth={16} strokeLinecap="round" strokeDasharray={240} strokeDashoffset={240 * (1 - p)} />
    </g>
  ),
  // Pila de carpetas "proyecto de ley" que se vuelven grises y caen a una papelera
  carpetas: (p) => {
    const gris = cl(p / 0.35);
    const caida = cl((p - 0.35) / 0.65);
    const col = interpolateColors(gris, [0, 1], [C.mostaza, C.piedra]);
    const dy = caida * caida * 118;
    return (
      <g>
        <g opacity={1 - cl((caida - 0.8) / 0.2) * 0.0}>
          <g transform={`translate(0 ${dy * 1.0}) rotate(${-8 * caida} 100 60)`}><Carpeta x={38} y={30} color={col} /></g>
          <g transform={`translate(0 ${dy * 0.85}) rotate(${6 * caida} 100 60)`}><Carpeta x={48} y={14} color={col} /></g>
          <g transform={`translate(0 ${dy * 0.7})`}><Carpeta x={42} y={0} color={col} /></g>
        </g>
        <path d="M34 120 h132 l-12 70 a8 8 0 0 1 -8 7 h-92 a8 8 0 0 1 -8 -7 z" fill={C.crema} {...sw} />
        <rect x="26" y="108" width="148" height="16" rx="8" fill={T} />
        {[70, 100, 130].map((x) => <path key={x} d={`M${x} 140 v38`} stroke={T} strokeWidth={6} strokeLinecap="round" opacity={0.5} />)}
      </g>
    );
  },
  sirena: (p) => (
    <g>
      <rect x="40" y="150" width="120" height="30" rx="8" fill={T} />
      <path d="M58 150 v-34 a42 42 0 0 1 84 0 v34 z" fill={C.mostaza} {...sw} />
      <rect x="82" y="86" width="14" height="40" rx="7" fill={C.crema} opacity={0.7} />
      {[[-1, 0], [0, -1], [1, 0]].map(([dx, dy], i) => {
        const a = (0.5 + 0.5 * Math.sin(p * 18 + i)) ;
        const cx = 100 + dx * 78 + (dx === 0 ? 0 : 0);
        const cy = dy === 0 ? 108 : 22;
        return <path key={i} d={dx === 0 ? 'M100 24 v-18' : `M${cx} ${cy} h${dx * 18}`} stroke={T} strokeWidth={9} strokeLinecap="round" opacity={0.35 + 0.65 * a} />;
      })}
    </g>
  ),
  documentoRayo: () => (
    <g>
      <path d="M44 12 h82 l32 32 v140 a8 8 0 0 1 -8 8 h-106 a8 8 0 0 1 -8 -8 v-164 a8 8 0 0 1 8 -8z" fill={C.crema} {...sw} />
      <path d="M126 12 v32 h32" fill={C.piedra} {...sw} strokeWidth={6} />
      <path d="M112 62 L74 118 h26 l-12 48 l44 -64 h-28 z" fill={C.mostaza} {...sw} strokeWidth={6} />
    </g>
  ),
  congreso: () => (
    <g>
      <path d="M52 78 a48 44 0 0 1 96 0 z" fill={C.piedra} {...sw} />
      <path d="M100 34 v-24" stroke={T} strokeWidth={7} strokeLinecap="round" />
      <path d="M100 10 h20 v12 h-20" fill={C.mostaza} {...sw} strokeWidth={4} />
      <rect x="22" y="78" width="156" height="12" fill={C.crema} {...sw} />
      {[40, 70, 100, 130, 160].map((x) => <rect key={x} x={x - 7} y="92" width="14" height="62" fill={C.crema} {...sw} strokeWidth={5} />)}
      <rect x="14" y="154" width="172" height="20" fill={C.piedra} {...sw} />
      <rect x="6" y="174" width="188" height="14" rx="4" fill={T} />
    </g>
  ),
  // Candado con símbolo (libro / mapa / urna). p = cierre del candado
  candado: (p, o) => {
    const s = o.simbolo ?? 'libro';
    const alza = (1 - p) * 22;
    return (
      <g>
        <rect x="26" y="6" width="148" height="124" rx="18" fill={C.crema} {...sw} />
        {s === 'libro' ? (
          <g>
            <path d="M54 30 h40 a6 6 0 0 1 6 6 v72 h-46 z" fill={C.turquesa} {...sw} strokeWidth={5} />
            <path d="M146 30 h-40 a6 6 0 0 0 -6 6 v72 h46 z" fill={C.mostaza} {...sw} strokeWidth={5} />
            <rect x="124" y="30" width="12" height="34" fill={T} />
          </g>
        ) : null}
        {s === 'mapa' ? (
          <g>
            <path d="M44 40 L82 26 L110 42 L148 28 L158 100 L120 114 L86 98 L48 112 Z" fill={C.turquesa} {...sw} strokeWidth={5} />
            <path d="M82 26 L86 98 M110 42 L120 114" stroke={T} strokeWidth={5} fill="none" />
            <path d="M82 26 L110 42 L120 114 L86 98 Z" fill={C.mostaza} {...sw} strokeWidth={5} />
          </g>
        ) : null}
        {s === 'urna' ? (
          <g>
            <rect x="52" y="52" width="96" height="64" rx="8" fill={C.turquesa} {...sw} strokeWidth={5} />
            <rect x="72" y="62" width="56" height="9" rx="4.5" fill={T} />
            <g transform="rotate(-8 100 40)"><rect x="80" y="14" width="40" height="46" rx="4" fill={C.mostaza} {...sw} strokeWidth={5} /></g>
          </g>
        ) : null}
        <path d={`M72 ${126 - alza} v-18 a28 28 0 0 1 56 0 v18`} fill="none" stroke={T} strokeWidth={13} strokeLinecap="round" />
        <rect x="52" y="124" width="96" height="68" rx="14" fill={T} />
        <circle cx="100" cy="150" r="9" fill={C.mostaza} />
        <rect x="95" y="152" width="10" height="20" rx="4" fill={C.mostaza} />
      </g>
    );
  },
  surtidor: () => (
    <g>
      <rect x="40" y="14" width="86" height="164" rx="12" fill={C.mostaza} {...sw} />
      <rect x="54" y="30" width="58" height="42" rx="6" fill={C.crema} {...sw} strokeWidth={5} />
      <rect x="28" y="176" width="110" height="14" rx="5" fill={T} />
      <path d="M126 56 h14 a14 14 0 0 1 14 14 v62 a10 10 0 0 0 20 0 v-52 l-14 -18" fill="none" stroke={T} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M72 122 c-14 -20 -14 -26 0 -42 c14 16 14 22 0 42z" fill={T} />
    </g>
  ),
  // Gota de agua con nube de lluvia
  gota: (p) => (
    <g>
      <path d="M48 98 a30 30 0 0 1 8 -58 a40 40 0 0 1 76 8 a28 28 0 0 1 4 50 z" fill={C.piedra} {...sw} />
      {[0, 1, 2].map((i) => {
        const f = (p * 3 + i / 3) % 1;
        return <path key={i} d={`M${64 + i * 36} ${116 + f * 40} v14`} stroke={C.turquesa} strokeWidth={9} strokeLinecap="round" opacity={1 - f * 0.6} />;
      })}
      <path d="M100 118 c-26 28 -26 40 0 62 c26 -22 26 -34 0 -62z" fill={C.turquesa} {...sw} strokeWidth={6} />
    </g>
  ),
  // Libro de cuentas (Proyecto de Presupuestos)
  libroCuentas: () => (
    <g>
      <rect x="30" y="14" width="140" height="172" rx="12" fill={T} {...sw} />
      <rect x="44" y="14" width="10" height="172" fill={C.mostaza} opacity={0.9} />
      <rect x="66" y="34" width="86" height="64" rx="8" fill={C.crema} />
      <text x="109" y="86" textAnchor="middle" fontFamily={F.titular} fontSize="58" fill={T}>€</text>
      <rect x="66" y="116" width="86" height="9" rx="4.5" fill={C.crema} opacity={0.7} />
      <rect x="66" y="136" width="56" height="9" rx="4.5" fill={C.crema} opacity={0.7} />
    </g>
  ),
  carpeta: () => (
    <g transform="translate(14 22) scale(1.4)">
      <Carpeta x={0} y={0} color={C.mostaza} w={120} />
    </g>
  ),
  cruzPiedra: (p) => (
    <g>
      <circle cx="100" cy="100" r="86" fill={C.piedra} {...sw} />
      <path d="M68 68 L132 132 M132 68 L68 132" fill="none" stroke={C.crema} strokeWidth={18} strokeLinecap="round" strokeDasharray={100} strokeDashoffset={100 * (1 - p)} />
    </g>
  ),
};
