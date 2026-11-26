import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {useSalida} from './util';

/**
 * Pieza 080 (IVA anual autónomos). SVG a lienzo completo; `en` en segundos desde el inicio de la ESCENA.
 * REGISTRO_080: calIva (4 trimestres, tachado y 3 pagos), topeIva (barra con tope 85.000 €), facturaIva, candadoIva, tlIva (línea de tiempo), dosIva (dos opciones).
 */
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
const T = (p: {x: number; y: number; s: number; w?: number; a?: string; f?: string; o?: number; children: React.ReactNode}) => (
  <text x={p.x} y={p.y} textAnchor={(p.a as any) ?? 'middle'} fontFamily={p.f ?? F.texto} fontWeight={p.w ?? 800} fontSize={p.s} fill={C.tinta} opacity={p.o ?? 1}>{p.children}</text>
);

const Moneda: React.FC<{x: number; y: number; r: number; txt: string}> = ({x, y, r, txt}) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
    <T x={x} y={y + r * 0.35} s={r * 1.05} f={F.cifra}>{txt}</T>
  </g>
);

/**
 * Cuatro trimestres. `tacha`: instante en que se tachan. `pagos`: [{mes, en}] casillas que se iluminan (índices 0,1,3) con moneda y "¼" si `moneda`.
 */
export const CalIva: React.FC<{
  y?: number; tacha?: number; pagos?: number[]; moneda?: boolean; hasta?: number;
}> = ({y = 700, tacha = -1, pagos = [], moneda = false, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const bal = Math.sin(t * 2.4) * 6;
  const etq = ['ABR', 'JUL', 'OCT'];
  return lienzo(
    <g transform={`translate(0 ${bal})`}>
      {[0, 1, 2, 3].map((i) => {
        const x = 90 + i * 200;
        const tk = tacha < 0 ? 0 : ease(t, tacha + i * 0.12, tacha + i * 0.12 + 0.25);
        return (
          <g key={i}>
            <rect x={x} y={y} width={180} height={200} fill={C.crema} stroke={C.tinta} strokeWidth={5} opacity={1 - 0.45 * tk} />
            <T x={x + 90} y={y + 120} s={72} f={F.cifra} o={1 - 0.45 * tk}>T{i + 1}</T>
            <line x1={x + 14} y1={y + 14} x2={x + 14 + 152 * tk} y2={y + 14 + 172 * tk} stroke={C.teja} strokeWidth={10} />
            <line x1={x + 166} y1={y + 14} x2={x + 166 - 152 * tk} y2={y + 14 + 172 * tk} stroke={C.teja} strokeWidth={10} />
          </g>
        );
      })}
      {pagos.map((en, i) => {
        const x = 90 + 90 + (i + 1) * 200 + 0; // centro; casillas en T1,T2,T4 -> abril, julio, octubre
        const k = ease(t, en, en + 0.35);
        const cx = 90 + (i + 1) * 200 + 90;
        return (
          <g key={i} opacity={k} transform={`translate(0 ${(1 - k) * -30})`}>
            <rect x={cx - 90} y={y + 250} width={180} height={150} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
            <T x={cx} y={y + 345} s={64} f={F.cifra}>{etq[i]}</T>
            {moneda ? <Moneda x={cx + 70} y={y + 250} r={44} txt="¼" /> : null}
            <line x1={cx} y1={y + 200} x2={cx} y2={y + 250} stroke={C.tinta} strokeWidth={5} />
            <rect x={x - 90} y={y + 250} width={0} height={0} />
          </g>
        );
      })}
    </g>,
    s,
  );
};

/** Barra 0-85.000 € con tope y tick; cifras desde el primer fotograma. */
export const TopeIva: React.FC<{y?: number; en?: number; hasta?: number; esc?: number}> = ({y = 640, en = 0, hasta, esc = 1}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.9);
  const bal = Math.sin(t * 2.4) * 6;
  const X0 = 100;
  const W = 700;
  const tick = ease(t, en + 0.9, en + 1.2);
  return lienzo(
    <g transform={`translate(0 ${bal}) translate(540 ${y}) scale(${esc}) translate(-540 ${-y})`}>
      <rect x={X0} y={y} width={W} height={110} fill={C.piedra} stroke={C.tinta} strokeWidth={5} />
      <rect x={X0} y={y} width={Math.max(0.001, W * k)} height={110} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
      <T x={X0} y={y + 170} s={44} a="middle">0 €</T>
      <T x={X0 + W} y={y + 170} s={44} a="middle">85.000 €</T>
      <g opacity={tick} transform={`translate(${X0 + W * 0.5} ${y + 260 - (1 - tick) * 20})`}>
        <circle cx={0} cy={0} r={70} fill={C.turquesa} stroke={C.tinta} strokeWidth={6} />
        <path d="M-32 2 L-10 26 L34 -24" fill="none" stroke={C.crema} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>,
    s,
  );
};

/** Factura que sigue ahí: calendario pequeño tachado a la izquierda y factura con "IVA" que pulsa. */
export const FacturaIva: React.FC<{y?: number; hasta?: number; esc?: number}> = ({y = 640, hasta, esc = 1}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const bal = Math.sin(t * 2.4) * 8;
  const p = 1 + Math.sin(t * 4) * 0.03;
  const k = ease(t, 0.3, 0.8);
  return lienzo(
    <g transform={`translate(0 ${bal}) translate(330 ${y}) scale(${esc}) translate(-330 ${-y})`}>
      <g opacity={1 - 0.5 * k}>
        <rect x={100} y={y + 60} width={220} height={240} fill={C.crema} stroke={C.tinta} strokeWidth={5} />
        <rect x={100} y={y + 60} width={220} height={60} fill={C.piedra} stroke={C.tinta} strokeWidth={5} />
        <T x={210} y={y + 235} s={60} f={F.cifra}>1/año</T>
      </g>
      <g transform={`translate(560 ${y + 180}) scale(${p})`}>
        <path d="M-130 -190 H130 V190 L100 170 L65 190 L30 170 L0 190 L-30 170 L-65 190 L-100 170 L-130 190 Z" fill={C.crema} stroke={C.tinta} strokeWidth={6} />
        <T x={0} y={-60} s={96} f={F.cifra}>IVA</T>
        {[10, 70, 130].map((d, i) => <line key={i} x1={-90} y1={d} x2={90} y2={d} stroke={C.piedra} strokeWidth={10} strokeLinecap="round" />)}
      </g>
    </g>,
    s,
  );
};

/** Candado con "3 años". */
export const CandadoIva: React.FC<{y?: number; hasta?: number}> = ({y = 720, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, 0.2, 0.8);
  const bal = Math.sin(t * 2.4) * 8;
  return lienzo(
    <g transform={`translate(0 ${bal})`}>
      <g transform={`translate(540 ${y + 150}) scale(${0.6 + 0.4 * k})`} opacity={k}>
        <path d="M-90 -40 V-110 A90 90 0 0 1 90 -110 V-40" fill="none" stroke={C.tinta} strokeWidth={28} strokeLinecap="round" />
        <rect x={-150} y={-50} width={300} height={240} rx={22} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
        <circle cx={0} cy={55} r={26} fill={C.tinta} />
        <rect x={-10} y={65} width={20} height={70} fill={C.tinta} />
      </g>
      <g opacity={ease(t, 0.7, 1.1)}>
        <T x={540} y={y + 470} s={110} f={F.cifra}>3 años</T>
      </g>
    </g>,
    s,
  );
};

/** Línea de tiempo de tres hitos con icono final de hemiciclo (puntos). */
export const TlIva: React.FC<{y?: number; hitos: {fecha: string; en: number; resalta?: boolean}[]; hasta?: number}> = ({y = 700, hitos, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const bal = Math.sin(t * 2.4) * 6;
  const xs = [140, 460, 780];
  const n = hitos.length;
  const prog = n ? Math.max(...hitos.map((h, i) => ease(t, h.en, h.en + 0.4) * (i + 1))) : 0;
  const largo = Math.min(prog, n - 1) / (n - 1);
  return lienzo(
    <g transform={`translate(0 ${bal})`}>
      <line x1={xs[0]} y1={y} x2={xs[n - 1]} y2={y} stroke={C.piedra} strokeWidth={10} />
      <line x1={xs[0]} y1={y} x2={xs[0] + (xs[n - 1] - xs[0]) * largo} y2={y} stroke={C.tinta} strokeWidth={10} />
      {hitos.map((h, i) => {
        const k = ease(t, h.en, h.en + 0.3);
        return (
          <g key={i} opacity={k} transform={`translate(0 ${(1 - k) * 20})`}>
            <circle cx={xs[i]} cy={y} r={h.resalta ? 34 : 26} fill={h.resalta ? C.mostaza : C.crema} stroke={C.tinta} strokeWidth={6} />
            <T x={xs[i]} y={y + 100} s={42} f={F.cifra}>{h.fecha}</T>
          </g>
        );
      })}
      <g opacity={ease(t, hitos[n - 1].en + 0.2, hitos[n - 1].en + 0.6)}>
        {[0, 1, 2, 3, 4].map((i) => {
          const a = Math.PI * (1 - i / 4);
          return <circle key={i} cx={xs[2] + Math.cos(a) * 110} cy={y - 150 - Math.sin(a) * 80} r={20} fill={i < 3 ? C.tinta : C.mostaza} stroke={C.tinta} strokeWidth={3} />;
        })}
      </g>
    </g>,
    s,
  );
};

/** Dos tarjetas para elegir: calendario de 3 pagos frente a 4 trimestres. */
export const DosIva: React.FC<{y?: number; a: string; b: string; hasta?: number}> = ({y = 700, a, b, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const bal = Math.sin(t * 2.4) * 6;
  return lienzo(
    <g transform={`translate(0 ${bal})`}>
      {[a, b].map((txt, i) => {
        const k = ease(t, 0.2 + i * 0.3, 0.6 + i * 0.3);
        const x = 90 + i * 410;
        return (
          <g key={i} opacity={k}>
            <rect x={x} y={y} width={380} height={300} fill={i === 0 ? C.mostaza : C.crema} stroke={C.tinta} strokeWidth={6} />
            <T x={x + 190} y={y + 150} s={150} f={F.cifra}>{i === 0 ? '3' : '4'}</T>
            <T x={x + 190} y={y + 240} s={52}>{txt}</T>
          </g>
        );
      })}
    </g>,
    s,
  );
};

export const REGISTRO_080: Record<string, React.FC<any>> = {calIva: CalIva, topeIva: TopeIva, facturaIva: FacturaIva, candadoIva: CandadoIva, tlIva: TlIva, dosIva: DosIva};
