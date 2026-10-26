import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';

/**
 * Componentes de la pieza 010 (Brasil: voto obligatorio). Se registran en REGISTRO_010 y se mezclan en `index.tsx`.
 * Tiempos en segundos desde el inicio de la escena. Coordenadas absolutas de pantalla (1080x1920).
 */
const T = C.tinta;
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};
const prog = (t: number, a: number, d: number, e: (x: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(t, [a, a + d], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const Lienzo: React.FC<{opacity?: number; children: React.ReactNode}> = ({opacity = 1, children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity}}>{children}</svg>
);

/** Pasaporte plano genérico (sin escudo real). Altura = tamano. `sello`: segundo en que cae el sello teja con aspa; `interroga`: aparece "?" mostaza. */
export const Pasaporte: React.FC<{x?: number; y?: number; tamano?: number; en?: number; hasta?: number; sello?: number; selloDur?: number; interroga?: number; latido?: boolean}> = ({
  x = 540, y = 900, tamano = 420, en = 0, hasta, sello, selloDur = 0.6, interroga, latido = false,
}) => {
  const t = useT();
  const e = Math.min(useEntrada(en), 1);
  const s = useSalida(hasta);
  const k = tamano / 200;
  const ps = sello === undefined ? 0 : prog(t, sello, selloDur, Easing.in(Easing.quad));
  const qi = interroga === undefined ? 0 : Math.min(useEntrada(interroga), 1.15);
  const pul = latido ? 1 + 0.05 * Math.sin(t * 5) : 1;
  return (
    <Lienzo opacity={e * s}>
      <g transform={`translate(${x} ${y}) scale(${k * pul * (0.9 + 0.1 * e)}) translate(-70 -100)`}>
        <rect x="0" y="0" width="140" height="200" rx="10" fill={T} {...sw} strokeWidth={5} />
        <rect x="8" y="8" width="124" height="184" rx="6" fill="none" stroke={C.mostaza} strokeWidth="2" opacity="0.6" />
        <circle cx="70" cy="74" r="30" fill="none" stroke={C.mostaza} strokeWidth="5" />
        <path d="M40 74 H100 M70 44 V104 M49 53 Q70 74 91 95 M91 53 Q70 74 49 95" fill="none" stroke={C.mostaza} strokeWidth="3" />
        <rect x="32" y="128" width="76" height="9" rx="4.5" fill={C.mostaza} />
        <rect x="46" y="146" width="48" height="7" rx="3.5" fill={C.mostaza} opacity="0.7" />
        {ps > 0 ? (
          <g transform={`translate(96 150) rotate(-14) scale(${2.8 - 1.8 * ps})`} opacity={Math.min(1, ps * 2.5)}>
            <circle cx="0" cy="0" r="44" fill="rgba(200,85,61,0.12)" stroke={C.teja} strokeWidth="9" />
            <path d="M-24 -24 L24 24 M24 -24 L-24 24" stroke={C.teja} strokeWidth="13" strokeLinecap="round" />
          </g>
        ) : null}
      </g>
      {qi > 0 ? (
        <g transform={`translate(${x + tamano * 0.34} ${y - tamano * 0.42}) scale(${qi})`}>
          <circle cx="0" cy="0" r={tamano * 0.2} fill={C.mostaza} {...sw} />
          <text x="0" y={tamano * 0.1} textAnchor="middle" fontFamily={F.titular} fontSize={tamano * 0.28} fill={T}>?</text>
        </g>
      ) : null}
    </Lienzo>
  );
};

/** Silueta plana de Brasil (aproximada). `sale`: segundo en que sale por la izquierda. */
const PUNTOS: Array<[number, number]> = [
  [-60.2, 5.3], [-51.6, 4.3], [-50, 1.7], [-48.5, -1.2], [-44, -2.4], [-39, -3], [-35.2, -5.2], [-34.8, -8], [-37, -11.5], [-39, -14],
  [-39.2, -18], [-40.5, -21], [-42, -23], [-44.5, -23.5], [-48, -25.5], [-48.7, -28], [-50.5, -30.5], [-53.5, -33.7], [-53.2, -32],
  [-57.6, -30.2], [-55.5, -28], [-53.8, -26.3], [-54.6, -25.5], [-57.5, -25.3], [-58.2, -22.5], [-57.7, -20], [-58.2, -17.5], [-60, -16],
  [-60, -13.5], [-65, -11], [-68, -11], [-72.5, -9.8], [-73.8, -7.5], [-70.5, -4.3], [-69.8, -1], [-67, 1.5], [-69.5, 2], [-64, 4],
];
export const RUTA = PUNTOS.map(([lo, la], i) => `${i ? 'L' : 'M'}${((lo + 74) * 5).toFixed(1)} ${((5.5 - la) * 5).toFixed(1)}`).join(' ') + ' Z';
export const MapaBrasil: React.FC<{x?: number; y?: number; tamano?: number; en?: number; hasta?: number; sale?: number}> = ({x = 540, y = 780, tamano = 560, en = 0, hasta, sale}) => {
  const t = useT();
  const e = Math.min(useEntrada(en), 1);
  const s = useSalida(hasta);
  const dx = sale === undefined ? 0 : -prog(t, sale, 0.55, Easing.in(Easing.cubic)) * 1300;
  const k = tamano / 200;
  return (
    <Lienzo opacity={e * s}>
      <g transform={`translate(${x + dx} ${y}) scale(${k}) translate(-100 -97)`}>
        <path d={RUTA} fill={C.turquesa} fillOpacity="0.45" stroke={C.turquesa} strokeWidth={5 / k} strokeLinejoin="round" />
      </g>
    </Lienzo>
  );
};

/** Barra de edades 0 → 90 que se dibuja: 16-17 voluntario, 18-70 obligatorio (mostaza, con candado), +70 voluntario. */
export const BarraEdades: React.FC<{x0?: number; y?: number; en?: number; hasta?: number; dib?: number; dur?: number}> = ({x0 = 90, y = 650, en = 0, hasta, dib = 0.2, dur = 1.6}) => {
  const t = useT();
  const e = Math.min(useEntrada(en), 1);
  const s = useSalida(hasta);
  const ppy = 800 / 90;
  const X = (a: number) => x0 + a * ppy;
  const alto = 96;
  const w = prog(t, dib, dur, Easing.inOut(Easing.cubic)) * (X(90) - x0);
  const mostrar = (edad: number) => (x0 + w >= X(edad) ? 1 : 0);
  const txt = {fontFamily: F.texto, fontWeight: 700 as const, fill: T};
  return (
    <Lienzo opacity={e * s}>
      <defs><clipPath id="clipEdades"><rect x={x0 - 4} y={y - 10} width={w + 8} height={alto + 20} /></clipPath></defs>
      <rect x={x0} y={y} width={X(90) - x0} height={alto} rx={14} fill="none" stroke={C.piedra} strokeWidth={3} strokeDasharray="8 10" opacity={0.7} />
      <g clipPath="url(#clipEdades)">
        <rect x={X(16)} y={y} width={X(18) - X(16)} height={alto} fill={C.piedra} stroke={T} strokeWidth={6} />
        <rect x={X(18)} y={y} width={X(70) - X(18)} height={alto} fill={C.mostaza} stroke={T} strokeWidth={6} />
        <rect x={X(70)} y={y} width={X(90) - X(70)} height={alto} fill={C.piedra} stroke={T} strokeWidth={6} />
      </g>
      <g opacity={mostrar(18)}>
        <text x={X(18)} y={y - 18} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={44} fill={T}>18</text>
      </g>
      <g opacity={mostrar(70)}>
        <text x={X(70)} y={y - 18} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={44} fill={T}>70</text>
      </g>
      <text x={x0} y={y - 18} fontFamily={F.cifra} fontWeight={700} fontSize={44} fill={C.piedra}>0</text>
      <g opacity={mostrar(60)}>
        <g transform={`translate(${X(18) + 24} ${y + 14}) scale(0.34)`}>
          <path d="M44 84 v-26 a42 42 0 0 1 84 0 v26" fill="none" {...sw} strokeWidth={16} />
          <rect x="22" y="80" width="128" height="100" rx="18" fill={T} />
          <circle cx="86" cy="126" r="14" fill={C.mostaza} />
        </g>
        <text x={X(18) + 120} y={y + 63} fontSize={46} {...txt}>obligatorio</text>
      </g>
      <g opacity={mostrar(17)}>
        <path d={`M${X(17)} ${y + alto + 6} V${y + alto + 38}`} stroke={T} strokeWidth={4} />
        <text x={x0} y={y + alto + 84} fontSize={46} {...txt}>voluntario</text>
      </g>
      <g opacity={mostrar(88)}>
        <text x={X(80)} y={y + alto + 84} textAnchor="middle" fontSize={46} {...txt}>voluntario</text>
      </g>
    </Lienzo>
  );
};

/** Tarjeta plana "TÍTULO DE ELECTOR" (genérica) que se parte en dos en `parte`. */
export const TituloElector: React.FC<{x?: number; y?: number; ancho?: number; en?: number; hasta?: number; parte?: number}> = ({x = 540, y = 980, ancho = 660, en = 0, hasta, parte}) => {
  const t = useT();
  const e = Math.min(useEntrada(en), 1);
  const s = useSalida(hasta);
  const alto = ancho * 0.44;
  const p = parte === undefined ? 0 : prog(t, parte, 0.55, Easing.out(Easing.back(1.6)));
  const zig = (lado: 'i' | 'd') => {
    const mid: Array<[number, number]> = [[0.5, 0], [0.45, 0.2], [0.55, 0.4], [0.45, 0.6], [0.55, 0.8], [0.5, 1]];
    const pts: Array<[number, number]> = lado === 'i' ? [[0, 0], ...mid, [0, 1]] : [[1, 0], ...mid, [1, 1]];
    return pts.map(([a, b]) => `${a * ancho},${b * alto}`).join(' ');
  };
  const carta = (
    <g>
      <rect x="0" y="0" width={ancho} height={alto} rx="22" fill={C.crema} {...sw} />
      <rect x="0" y="0" width={ancho} height={alto * 0.26} rx="22" fill={C.mostaza} {...sw} />
      <rect x="3" y={alto * 0.13} width={ancho - 6} height={alto * 0.13 - 3} fill={C.mostaza} />
      <path d={`M0 ${alto * 0.26} H${ancho}`} stroke={T} strokeWidth="7" />
      <text x={ancho / 2} y={alto * 0.64} textAnchor="middle" fontFamily={F.titular} fontSize="46" fill={T}>TÍTULO DE ELECTOR</text>
      <rect x={ancho * 0.12} y={alto * 0.78} width={ancho * 0.5} height="12" rx="6" fill={C.piedra} />
    </g>
  );
  return (
    <Lienzo opacity={e * s}>
      <defs>
        <clipPath id="clipTI"><polygon points={zig('i')} /></clipPath>
        <clipPath id="clipTD"><polygon points={zig('d')} /></clipPath>
      </defs>
      <g transform={`translate(${x - ancho / 2} ${y - alto / 2})`}>
        <g transform={`translate(${-50 * p} ${14 * p}) rotate(${-8 * p} 0 ${alto})`}><g clipPath="url(#clipTI)">{carta}</g></g>
        <g transform={`translate(${50 * p} ${14 * p}) rotate(${8 * p} ${ancho} ${alto})`}><g clipPath="url(#clipTD)">{carta}</g></g>
      </g>
    </Lienzo>
  );
};

/** Contador de reales: sube de 0 a `hasta` con dos decimales (coma), en pastilla crema con borde tinta. */
export const CuentaReales: React.FC<{hasta: number; prefijo?: string; x?: number; y?: number; ancho?: number; en?: number; empieza?: number; dur?: number; fuera?: number}> = ({hasta, prefijo = 'hasta R$ ', x = 510, y = 990, ancho = 900, en = 0, empieza = 0.4, dur = 1.3, fuera}) => {
  const t = useT();
  const e = Math.min(useEntrada(en), 1);
  const s = useSalida(fuera);
  const v = hasta * prog(t, empieza, dur);
  const txt = v.toFixed(2).replace('.', ',');
  return (
    <div style={{position: 'absolute', left: x - ancho / 2, top: y - 60, width: ancho, height: 120, borderRadius: 26, background: C.crema, border: `8px solid ${T}`, boxSizing: 'border-box', boxShadow: '0 10px 0 rgba(20,33,61,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: e * s, transform: `scale(${0.94 + 0.06 * e})`}}>
      <span style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 76, color: T, whiteSpace: 'nowrap'}}>{prefijo}{txt}</span>
    </div>
  );
};

/** Cifra grande en mostaza (p. ej. "2 DE 3") con contorno tinta. */
export const CifraGrande: React.FC<{texto: string; x?: number; y?: number; tamano?: number; en?: number; hasta?: number}> = ({texto, x = 540, y = 950, tamano = 150, en = 0, hasta}) => {
  const e = Math.min(useEntrada(en), 1.1);
  const s = useSalida(hasta);
  return (
    <div style={{position: 'absolute', left: x - 450, width: 900, top: y - tamano / 2, textAlign: 'center', fontFamily: F.titular, fontSize: tamano, lineHeight: 1, color: C.mostaza, WebkitTextStroke: `6px ${T}`, paintOrder: 'stroke fill', opacity: Math.min(e, 1) * s, transform: `scale(${0.8 + 0.2 * e})`}}>{texto}</div>
  );
};

/** Candado plano mostaza que se cierra (el arco baja). Centrado en (x, y); tamano = alto. */
export const CandadoMostaza: React.FC<{x?: number; y?: number; tamano?: number; en?: number; hasta?: number}> = ({x = 790, y = 800, tamano = 260, en = 0, hasta}) => {
  const t = useT();
  const e = Math.min(useEntrada(en), 1);
  const s = useSalida(hasta);
  const cierra = prog(t, en + 0.35, 0.4, Easing.out(Easing.back(2)));
  const k = tamano / 200;
  return (
    <Lienzo opacity={e * s}>
      <g transform={`translate(${x} ${y}) scale(${k * (0.85 + 0.15 * e)}) translate(-100 -100)`}>
        <path d={`M54 100 V${70 - 22 * (1 - cierra)} a46 46 0 0 1 92 0 V100`} fill="none" {...sw} strokeWidth={16} />
        <rect x="28" y="92" width="144" height="102" rx="20" fill={C.mostaza} {...sw} />
        <circle cx="100" cy="134" r="13" fill={T} />
        <rect x="94" y="140" width="12" height="28" rx="5" fill={T} />
      </g>
    </Lienzo>
  );
};

export const REGISTRO_010: Record<string, React.FC<any>> = {
  candadoMostaza: CandadoMostaza,
  pasaporte: Pasaporte,
  mapaBrasil: MapaBrasil,
  barraEdades: BarraEdades,
  tituloElector: TituloElector,
  cuentaReales: CuentaReales,
  cifraGrande: CifraGrande,
};
