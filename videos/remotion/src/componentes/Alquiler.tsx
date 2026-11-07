import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';

/**
 * Componentes de la pieza 035 (alquiler y decreto 12-N). Todos usan tiempo de ESCENA (segundos desde el inicio de la escena).
 * REGISTRO_035: tiemposA (dos barras de prórroga), votosA (hemiciclo de 69 puntos), bandasA (2019-2030), iconoA (casa, llave, contrato).
 */
const T = C.tinta;
const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number, a: number, b: number) => Easing.out(Easing.cubic)(cl((t - a) / (b - a)));

const Lienzo: React.FC<{en?: number; hasta?: number; children: React.ReactNode}> = ({en = 0, hasta, children}) => {
  const e = useEntrada(en);
  const s = useSalida(hasta);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: Math.min(e, 1) * s, overflow: 'visible'}}>
      {children}
    </svg>
  );
};

/** Dos barras de tiempo con la misma escala (1 año = 46 px): hoy se detienen en un tope; con el decreto se encadenan sin tope. */
export const TiemposA: React.FC<{y: number; en?: number; hasta?: number; hoyEn: number[]; topeEn: number; decEn: number[]; puntosEn: number; filaDecEn: number}> = ({y, en = 0, hasta, hoyEn, topeEn, decEn, puntosEn, filaDecEn}) => {
  const t = useT();
  const A = 46;
  const x0 = 90;
  const H = 92;
  const bloque = (x: number, w: number, yy: number, k: number, fill: string, txt?: string) => (
    <g opacity={k} transform={`translate(0 ${(1 - k) * -26})`}>
      <rect x={x} y={yy} width={w} height={H} rx={8} fill={fill} stroke={T} strokeWidth={6} />
      {txt ? <text x={x + w / 2} y={yy + 66} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>{txt}</text> : null}
    </g>
  );
  const yH = y + 80;
  const yD = y + 330;
  const kT = ease(t, topeEn, topeEn + 0.35);
  const kF = ease(t, filaDecEn, filaDecEn + 0.35);
  const kP = ease(t, puntosEn, puntosEn + 0.4);
  return (
    <Lienzo en={en} hasta={hasta}>
      <text x={x0} y={y + 62} fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>HOY</text>
      {bloque(x0, 5 * A, yH, ease(t, hoyEn[0], hoyEn[0] + 0.3), C.piedra, '5')}
      {[1, 2, 3].map((i) => bloque(x0 + (4 + i) * A, A, yH, ease(t, hoyEn[i], hoyEn[i] + 0.3), C.turquesa))}
      <g opacity={kT}>
        <rect x={x0 + 8 * A + 12} y={yH - 26} width={14} height={H + 52} rx={5} fill={T} />
        <text x={x0 + 8 * A + 50} y={yH + 66} fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>TOPE</text>
      </g>
      <g opacity={kF}>
        <text x={x0} y={yD - 18} fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>DECRETO</text>
      </g>
      {bloque(x0, 5 * A, yD, ease(t, decEn[0], decEn[0] + 0.3), C.piedra, '5')}
      {bloque(x0 + 5 * A, 5 * A, yD, ease(t, decEn[1], decEn[1] + 0.3), C.turquesa, '+5')}
      {bloque(x0 + 10 * A, 5 * A, yD, ease(t, decEn[2], decEn[2] + 0.3), C.turquesa, '+5')}
      <text x={x0 + 15 * A + 20} y={yD + 66} fontFamily={F.cifra} fontWeight={700} fontSize={80} fill={T} opacity={kP * (0.6 + 0.4 * Math.abs(Math.sin(t * 4)))}>…</text>
    </Lienzo>
  );
};

/** Hemiciclo de 69 puntos: 34 a un lado, 34 al otro y un punto aparte (PNV) que cruza y deja 34 / 35. */
export const VotosA: React.FC<{y: number; en?: number; hasta?: number; pnvEn: number; pnvDur?: number; etiquetaEn?: number}> = ({y, en = 0, hasta, pnvEn, pnvDur = 0.9, etiquetaEn = 0.4}) => {
  const t = useT();
  const cx = 515;
  const filas = [{R: 420, n: 24}, {R: 340, n: 20}, {R: 260, n: 15}, {R: 180, n: 10}];
  const seats: {x: number; y: number; a: number}[] = [];
  filas.forEach((f) => {
    for (let i = 0; i < f.n; i++) {
      const a = Math.PI - (Math.PI * i) / (f.n - 1);
      seats.push({x: cx + f.R * Math.cos(a), y: y - f.R * Math.sin(a), a});
    }
  });
  seats.sort((p, q) => q.a - p.a);
  const centro = seats[34];
  const q = interpolate(t, [pnvEn, pnvEn + pnvDur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const ini = {x: 330, y: y - 470};
  const px = ini.x + (centro.x - ini.x) * q;
  const py = ini.y + (centro.y - ini.y) * q - 90 * Math.sin(Math.PI * q);
  const llega = t >= pnvEn + pnvDur;
  const pulsa = llega ? 1 + 0.5 * Math.max(0, 1 - (t - pnvEn - pnvDur) * 3) : 1;
  const nContra = llega ? 35 : 34;
  return (
    <Lienzo en={en} hasta={hasta}>
      {seats.map((s, i) => {
        if (i === 34) {
          return <circle key={i} cx={s.x} cy={s.y} r={21} fill="none" stroke={T} strokeWidth={4} strokeDasharray="6 7" opacity={llega ? 0 : 0.7} />;
        }
        const k = ease(t, 0.05 + (i / 69) * 0.9, 0.35 + (i / 69) * 0.9);
        const wob = 1 + 0.07 * Math.sin(t * 3 + i * 0.7);
        return <circle key={i} cx={s.x} cy={s.y} r={21 * k * wob} fill={i < 34 ? C.turquesa : T} stroke={T} strokeWidth={3} />;
      })}
      <g opacity={ease(t, etiquetaEn, etiquetaEn + 0.4)}>
        <circle cx={px} cy={py} r={21 * pulsa} fill={C.mostaza} stroke={T} strokeWidth={5} />
        {!llega ? <text x={px + 36} y={py + 22} fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>PNV</text> : null}
      </g>
      <text x={cx - 80} y={y - 40} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={84} fill={C.turquesa} stroke={T} strokeWidth={0}>34</text>
      <text x={cx + 80} y={y - 40} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={84} fill={T}>{nContra}</text>
    </Lienzo>
  );
};

/** Eje 2019-2030: la banda de contratos firmados 2019-2022 se desplaza a 2027-2030 (vencen). */
export const BandasA: React.FC<{y: number; en?: number; hasta?: number; bandaEn: number; mueveEn: number}> = ({y, en = 0, hasta, bandaEn, mueveEn}) => {
  const t = useT();
  const x0 = 130;
  const P = 700 / 11;
  const X = (a: number) => x0 + (a - 2019) * P;
  const m = Easing.inOut(Easing.cubic)(cl((t - mueveEn) / 1.3));
  const llega = m >= 1;
  const bx = X(2019) + (X(2027) - X(2019)) * m;
  const kB = ease(t, bandaEn, bandaEn + 0.4);
  const pulso = 6 * Math.sin(t * 5);
  const kAnio = ease(t, mueveEn + 0.5, mueveEn + 1.0);
  const anio = (a: number, k: number) => (
    <text x={X(a)} y={y + 210} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T} opacity={k}>{a}</text>
  );
  return (
    <Lienzo en={en} hasta={hasta}>
      <rect x={x0} y={y + 80} width={700} height={12} rx={6} fill={T} />
      {Array.from({length: 12}).map((_, i) => (
        <rect key={i} x={X(2019 + i) - 3} y={y + 70} width={6} height={32} fill={T} />
      ))}
      {anio(2019, kB)}
      {anio(2022, kB)}
      {anio(2027, kAnio)}
      {anio(2030, kAnio)}
      <rect x={X(2019)} y={y + 20} width={3 * P} height={70} rx={8} fill="none" stroke={T} strokeWidth={4} strokeDasharray="8 8" opacity={m > 0.02 ? kB : 0} />
      <g opacity={kB}>
        <rect x={bx} y={y + 14 - pulso / 2} width={3 * P} height={82 + pulso} rx={8} fill={llega ? C.teja : C.mostaza} stroke={T} strokeWidth={6} />
        <text x={bx + 1.5 * P} y={y - 12} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>{llega ? 'vencen' : 'firmados'}</text>
      </g>
    </Lienzo>
  );
};

/** Iconos planos para las pastillas: casa, llave, contrato. Pequeño balanceo continuo. */
export const IconoA: React.FC<{nombre: 'casa' | 'llave' | 'contrato'; x: number; y: number; tamano?: number; en?: number; hasta?: number}> = ({nombre, x, y, tamano = 220, en = 0, hasta}) => {
  const t = useT();
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
  return (
    <div style={{position: 'absolute', left: x - tamano / 2, top: y - tamano / 2, width: tamano, height: tamano, opacity: Math.min(e, 1) * s, transform: `scale(${0.6 + 0.4 * Math.min(e, 1)}) rotate(${3 * Math.sin(t * 3)}deg)`}}>
      <svg viewBox="0 0 200 200" width={tamano} height={tamano} style={{overflow: 'visible'}}>
        {nombre === 'casa' ? (
          <g>
            <path d="M20 96 L100 28 L180 96 V176 H20 Z" fill={C.mostaza} {...sw} />
            <rect x={80} y={118} width={40} height={58} rx={4} fill={C.crema} {...sw} />
            <rect x={132} y={102} width={26} height={26} rx={3} fill={C.crema} {...sw} strokeWidth={5} />
          </g>
        ) : null}
        {nombre === 'llave' ? (
          <g>
            <circle cx={64} cy={100} r={40} fill={C.mostaza} {...sw} />
            <circle cx={64} cy={100} r={12} fill={C.crema} {...sw} strokeWidth={5} />
            <path d="M104 100 H184 M156 100 v30 M178 100 v22" fill="none" {...sw} strokeWidth={14} />
          </g>
        ) : null}
        {nombre === 'contrato' ? (
          <g>
            <rect x={44} y={14} width={112} height={172} rx={10} fill={C.crema} {...sw} />
            <rect x={64} y={44} width={72} height={9} rx={4.5} fill={T} />
            <rect x={64} y={68} width={72} height={9} rx={4.5} fill={T} />
            <rect x={64} y={92} width={46} height={9} rx={4.5} fill={T} />
            <path d="M70 148 q14 -22 30 0 t30 -4" fill="none" stroke={C.turquesa} strokeWidth={8} strokeLinecap="round" />
          </g>
        ) : null}
      </svg>
    </div>
  );
};

export const REGISTRO_035: Record<string, React.FC<any>> = {
  tiemposA: TiemposA,
  votosA: VotosA,
  bandasA: BandasA,
  iconoA: IconoA,
};
