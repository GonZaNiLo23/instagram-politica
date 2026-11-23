import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useSalida} from './util';

/**
 * Pieza 067 (DNI digital el 29-N). SVG a lienzo completo; tiempos `en`/`hasta` en segundos desde el inicio de la ESCENA.
 * REGISTRO_067: movilDni, lectorDni, docDni, horasDni.
 */
const usa = () => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {t: fr / fps, fr};
};
const ease = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
const lienzo = (children: React.ReactNode, s: number) => (
  <div style={{opacity: s}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>{children}</svg>
  </div>
);
const sw = {stroke: C.tinta, strokeWidth: 6, strokeLinejoin: 'round' as const};

/** Patrón de QR sencillo (decorativo, determinista) de 7x7 celdas con tres esquinas. */
const Qr: React.FC<{x: number; y: number; lado: number; p: number}> = ({x, y, lado, p}) => {
  const n = 9;
  const c = lado / n;
  const celdas: React.ReactNode[] = [];
  const dato = (i: number, j: number) => ((i * 7 + j * 13 + i * j) % 3) !== 0;
  const esquina = (i: number, j: number) => (i < 3 && j < 3) || (i > 5 && j < 3) || (i < 3 && j > 5);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const on = esquina(i, j) ? !(i % 3 === 1 && j % 3 === 1 && false) && !((i === 1 || i === 7) && (j === 1)) && !(i === 1 && j === 7) : dato(i, j);
      if (!on) continue;
      const k = (i * n + j) / (n * n);
      celdas.push(<rect key={`${i}-${j}`} x={x + i * c} y={y + j * c} width={c + 0.5} height={c + 0.5} fill={C.tinta} opacity={ease(p, k * 0.6, k * 0.6 + 0.4)} />);
    }
  }
  return <g>{celdas}</g>;
};

/** Móvil (centro x,y; ancho base 200) que abre la app y muestra un QR temporal con golpe. */
const MovilDni: React.FC<{x?: number; y?: number; esc?: number; en?: number; hasta?: number; qrEn?: number; zoomDesde?: number; temporal?: boolean}> = ({
  x = 540, y = 900, esc = 1.6, en = 0, hasta, qrEn = 0.5, zoomDesde = 1, temporal = true,
}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  if (t < en) return null;
  const a = ease(t, en, en + 0.5);
  const z = zoomDesde + (1 - zoomDesde) * a;
  const qp = ease(t, en + qrEn, en + qrEn + 0.7);
  const pulso = temporal ? 1 + 0.03 * Math.sin((t - en) * 5) : 1;
  const flota = Math.sin((t - en) * 2.2) * 8;
  return lienzo(
    <g transform={`translate(${x} ${y + flota}) scale(${esc * z * a})`}>
      <rect x={-105} y={-185} width={210} height={370} rx={30} fill={C.tinta} {...sw} />
      <rect x={-90} y={-165} width={180} height={330} rx={18} fill={C.crema} />
      <rect x={-22} y={-178} width={44} height={8} rx={4} fill={C.crema} />
      <rect x={-90} y={-165} width={180} height={44} rx={0} fill={C.turquesa} />
      <rect x={-72} y={-150} width={60} height={14} rx={7} fill={C.crema} />
      <g transform={`scale(${pulso})`}>
        <Qr x={-63} y={-100} lado={126} p={qp} />
      </g>
      <rect x={-63} y={50} width={126} height={14} rx={7} fill={C.mostaza} opacity={ease(t, en + qrEn + 0.5, en + qrEn + 0.9)} />
      <rect x={-45} y={80} width={90} height={14} rx={7} fill={C.piedra} opacity={ease(t, en + qrEn + 0.6, en + qrEn + 1)} />
    </g>,
    s,
  );
};

/** Móvil de lectura que escanea (tick verde al final). Centro x,y; mira hacia el otro móvil con un haz. */
const LectorDni: React.FC<{x?: number; y?: number; esc?: number; en?: number; hasta?: number; tick?: number; haz?: number}> = ({
  x = 780, y = 900, esc = 1.2, en = 0, hasta, tick = 1.2, haz = 0.4,
}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  if (t < en) return null;
  const a = ease(t, en, en + 0.5);
  const tk = ease(t, en + tick, en + tick + 0.35);
  const barrido = Math.sin((t - en - haz) * 6) * 40;
  const flota = Math.sin((t - en) * 2.2 + 1) * 8;
  return lienzo(
    <g transform={`translate(${x} ${y + flota}) scale(${esc * a})`}>
      <rect x={-105} y={-185} width={210} height={370} rx={30} fill={C.tinta} {...sw} />
      <rect x={-90} y={-165} width={180} height={330} rx={18} fill={C.piedra} />
      {t >= en + haz && tk < 1 && <rect x={-80} y={-20 + barrido} width={160} height={8} rx={4} fill={C.mostaza} />}
      <g opacity={tk} transform={`scale(${0.6 + 0.4 * tk})`}>
        <circle cx={0} cy={0} r={62} fill={C.turquesa} {...sw} />
        <path d="M-30 4 L-8 28 L32 -22" fill="none" stroke={C.crema} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>,
    s,
  );
};

/** Documento plano (dni, pasaporte, permiso, resguardo) o cartera; marca tick (turquesa) o cruz (teja) a un lado. */
const DocDni: React.FC<{doc: 'dni' | 'pasaporte' | 'permiso' | 'resguardo' | 'cartera'; x?: number; y?: number; esc?: number; en?: number; hasta?: number; marca?: 'tick' | 'cruz'; marcaEn?: number; marcaDx?: number; marcaDy?: number}> = ({
  doc: tipo, x = 540, y = 800, esc = 1.4, en = 0, hasta, marca, marcaEn = 0.4, marcaDx = 0, marcaDy = 150,
}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  if (t < en) return null;
  const a = ease(t, en, en + 0.45);
  const flota = Math.sin((t - en) * 2 + x) * 6;
  const m = marca ? ease(t, en + marcaEn, en + marcaEn + 0.35) : 0;
  const color = tipo === 'pasaporte' ? C.tinta : tipo === 'permiso' ? C.piedra : tipo === 'cartera' ? C.teja : C.turquesa;
  const cuerpo = (() => {
    if (tipo === 'pasaporte') {
      return (
        <g>
          <rect x={-80} y={-110} width={160} height={220} rx={12} fill={C.tinta} {...sw} />
          <circle cx={0} cy={-20} r={36} fill="none" stroke={C.mostaza} strokeWidth={8} />
          <rect x={-46} y={50} width={92} height={12} rx={6} fill={C.mostaza} />
        </g>
      );
    }
    if (tipo === 'cartera') {
      return (
        <g>
          <rect x={-120} y={-70} width={240} height={150} rx={20} fill={C.teja} {...sw} />
          <rect x={20} y={-15} width={100} height={50} rx={14} fill={C.mostaza} {...sw} />
          <circle cx={45} cy={10} r={8} fill={C.tinta} />
        </g>
      );
    }
    return (
      <g>
        <rect x={-130} y={-82} width={260} height={164} rx={16} fill={color === C.turquesa ? C.crema : C.crema} {...sw} />
        <rect x={-130} y={-82} width={260} height={34} rx={0} fill={color} />
        <rect x={-108} y={-24} width={64} height={78} rx={8} fill={tipo === 'resguardo' ? C.crema : C.piedra} {...sw} strokeWidth={4} strokeDasharray={tipo === 'resguardo' ? '10 8' : undefined} />
        <rect x={-20} y={-18} width={120} height={12} rx={6} fill={C.tinta} />
        <rect x={-20} y={8} width={90} height={12} rx={6} fill={C.piedra} />
        <rect x={-20} y={34} width={70} height={12} rx={6} fill={C.piedra} />
      </g>
    );
  })();
  return lienzo(
    <g>
      <g transform={`translate(${x} ${y + flota}) scale(${esc * a})`}>{cuerpo}</g>
      {marca === 'tick' && (
        <g transform={`translate(${x + marcaDx} ${y + marcaDy}) scale(${m})`}>
          <circle r={42} fill={C.turquesa} {...sw} />
          <path d="M-20 2 L-6 18 L22 -14" fill="none" stroke={C.crema} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {marca === 'cruz' && (
        <g transform={`translate(${x + marcaDx} ${y + marcaDy}) scale(${m})`}>
          <circle r={50} fill={C.teja} {...sw} />
          <path d="M-22 -22 L22 22 M22 -22 L-22 22" fill="none" stroke={C.crema} strokeWidth={13} strokeLinecap="round" />
        </g>
      )}
    </g>,
    s,
  );
};

/** Barra horaria 9:00-20:00 que se rellena, con marcas. Ancho 800 (x 140-940). */
const HorasDni: React.FC<{y?: number; en?: number; hasta?: number; dur?: number}> = ({y = 900, en = 0, hasta, dur = 2}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  if (t < en) return null;
  const a = ease(t, en, en + 0.4);
  const p = ease(t, en + 0.3, en + 0.3 + dur);
  const x0 = 140, w = 760;
  const sol = Math.sin((t - en) * 3) * 4;
  return lienzo(
    <g opacity={a}>
      <rect x={x0} y={y} width={w} height={60} rx={30} fill={C.crema} {...sw} />
      <rect x={x0} y={y} width={Math.max(2, w * p)} height={60} rx={30} fill={C.mostaza} {...sw} />
      <text x={x0} y={y + 120} textAnchor="start" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={C.tinta}>9:00</text>
      <text x={x0 + w} y={y + 120} textAnchor="end" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={C.tinta}>20:00</text>
      <g transform={`translate(${x0 + w * p} ${y - 70 + sol})`}>
        <circle r={36} fill={C.mostaza} {...sw} />
        <path d="M0 -20 V0 L14 10" fill="none" stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />
      </g>
    </g>,
    s,
  );
};

/** Etiqueta de 64 px centrada en x (para pantalla partida), con entrada. */
const EtiquetaDni: React.FC<{texto: string; x: number; y: number; en?: number; hasta?: number}> = ({texto, x, y, en = 0, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  if (t < en) return null;
  const a = ease(t, en, en + 0.35);
  return lienzo(
    <text x={x} y={y + (1 - a) * 30} textAnchor="middle" fontFamily={F.titular} fontWeight={800} fontSize={64} fill={C.tinta} opacity={a}>{texto}</text>,
    s,
  );
};

/** Línea divisoria vertical de pantalla partida. */
const LineaDni: React.FC<{x?: number; y0: number; y1: number; en?: number; hasta?: number}> = ({x = 510, y0, y1, en = 0, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  if (t < en) return null;
  const a = ease(t, en, en + 0.5);
  return lienzo(<line x1={x} y1={y0} x2={x} y2={y0 + (y1 - y0) * a} stroke={C.tinta} strokeWidth={6} strokeLinecap="round" strokeDasharray="2 16" />, s);
};

export const REGISTRO_067: Record<string, React.FC<any>> = {
  movilDni: MovilDni,
  lectorDni: LectorDni,
  docDni: DocDni,
  horasDni: HorasDni,
  etiquetaDni: EtiquetaDni,
  lineaDni: LineaDni,
};
