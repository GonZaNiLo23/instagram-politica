import React from 'react';
import {Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useSalida} from './util';

/**
 * Pieza 081 (devolución 14 días). SVG a lienzo completo; `en` en segundos desde el inicio de la ESCENA.
 * REGISTRO_081: calDev (rejilla de 14 días), plazoDev (pago gris, recepción, 14 días), reembDev (paquete, tienda, tarjeta),
 * envioDev (furgoneta con etiqueta tú/tienda e interruptor), excluidosDev (3 iconos con aspa debajo).
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
const T = (p: {x: number; y: number; s: number; w?: number; a?: string; f?: string; o?: number; fill?: string; children: React.ReactNode}) => (
  <text x={p.x} y={p.y} textAnchor={(p.a as any) ?? 'middle'} fontFamily={p.f ?? F.texto} fontWeight={p.w ?? 800} fontSize={p.s} fill={p.fill ?? C.tinta} opacity={p.o ?? 1}>{p.children}</text>
);
const Aspa: React.FC<{x: number; y: number; r?: number; k?: number}> = ({x, y, r = 38, k = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${0.3 + 0.7 * k})`} opacity={k}>
    <circle r={r} fill={C.teja} stroke={C.tinta} strokeWidth={5} />
    <path d={`M${-r * 0.4} ${-r * 0.4} L${r * 0.4} ${r * 0.4} M${r * 0.4} ${-r * 0.4} L${-r * 0.4} ${r * 0.4}`} stroke={C.crema} strokeWidth={10} strokeLinecap="round" />
  </g>
);

/** Rejilla de 14 casillas (4 columnas) que se rellenan una a una; pulso rotatorio después. Sin cifras intermedias. */
export const CalDev: React.FC<{y?: number; x?: number; en?: number; hasta?: number; cel?: number}> = ({y = 700, x = 565, en = 0.1, hasta, cel = 84}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const bal = Math.sin(t * 2.4) * 6;
  const gap = Math.round(cel * 0.12);
  const llenas = Math.min(14, Math.max(0, (t - en) / 0.12));
  const pulso = Math.floor(t * 6) % 14;
  return lienzo(
    <g transform={`translate(0 ${bal})`}>
      {Array.from({length: 14}).map((_, i) => {
        const cx = x + (i % 4) * (cel + gap);
        const cy = y + Math.floor(i / 4) * (cel + gap);
        const on = ease(llenas, i, i + 1);
        const brillo = llenas >= 14 && pulso === i ? 1 : 0;
        return (
          <g key={i} transform={`translate(${cx} ${cy - brillo * 6})`}>
            <rect width={cel} height={cel} rx={10} fill={on > 0.5 ? C.mostaza : C.crema} stroke={C.tinta} strokeWidth={5} />
            {on > 0.5 ? <path transform={`scale(${cel / 84})`} d="M18 44 L36 62 L68 24" fill="none" stroke={C.tinta} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" /> : null}
          </g>
        );
      })}
    </g>,
    s,
  );
};

/** Pago en gris, recepción en mostaza y barra de 14 casillas desde la recepción. */
export const PlazoDev: React.FC<{y?: number; en?: number; hasta?: number; arranque?: number}> = ({y = 980, en = 0.2, hasta, arranque = 1.0}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const bal = Math.sin(t * 2.4) * 6;
  const a = ease(t, en, en + 0.4);
  const b = ease(t, en + 0.5, en + 0.9);
  const x0 = 470;
  const cw = 32;
  const llenas = Math.min(14, Math.max(0, (t - arranque) / 0.11));
  const pulso = Math.floor(t * 5) % 14;
  return lienzo(
    <g transform={`translate(0 ${bal})`}>
      <line x1={100} y1={y} x2={940} y2={y} stroke={C.piedra} strokeWidth={10} />
      <g opacity={a}>
        <circle cx={160} cy={y} r={38} fill={C.piedra} stroke={C.tinta} strokeWidth={6} />
        <T x={160} y={y + 110} s={54} o={0.6}>PAGO</T>
      </g>
      <g opacity={b} transform={`translate(0 ${(1 - b) * 20})`}>
        <circle cx={x0} cy={y} r={46} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
        <T x={x0} y={y + 110} s={54}>RECEPCIÓN</T>
      </g>
      {Array.from({length: 14}).map((_, i) => {
        const on = ease(llenas, i, i + 1);
        const br = llenas >= 14 && pulso === i ? 10 : 0;
        return <rect key={i} x={x0 + 20 + i * cw} y={y - 130 - br} width={cw - 4} height={100} fill={on > 0.5 ? C.mostaza : C.crema} stroke={C.tinta} strokeWidth={4} />;
      })}
      <g opacity={ease(t, arranque, arranque + 0.3)}>
        <T x={x0 + 20 + 7 * cw} y={y - 160} s={68} f={F.cifra}>14 DÍAS</T>
      </g>
    </g>,
    s,
  );
};

const Tarjeta: React.FC<{x: number; y: number; k: number}> = ({x, y, k}) => (
  <g transform={`translate(${x} ${y})`} opacity={k}>
    <rect x={-110} y={-70} width={220} height={140} rx={18} fill={C.turquesa} stroke={C.tinta} strokeWidth={6} />
    <rect x={-110} y={-36} width={220} height={26} fill={C.tinta} />
    <rect x={-84} y={20} width={60} height={30} rx={6} fill={C.mostaza} stroke={C.tinta} strokeWidth={3} />
  </g>
);
const Tienda: React.FC<{x: number; y: number; k: number}> = ({x, y, k}) => (
  <g transform={`translate(${x} ${y})`} opacity={k}>
    <rect x={-110} y={-30} width={220} height={130} fill={C.crema} stroke={C.tinta} strokeWidth={6} />
    <rect x={-30} y={20} width={60} height={80} fill={C.tinta} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={-120 + i * 60} y={-90} width={60} height={60} fill={i % 2 ? C.crema : C.teja} stroke={C.tinta} strokeWidth={5} />)}
  </g>
);

/** Paquete (recorte) viaja a la tienda y después el dinero vuelve a la tarjeta. Tiempos de ESCENA. */
export const ReembDev: React.FC<{y?: number; en?: number; viaje?: number; dinero?: number; hasta?: number; src?: string}> = ({y = 980, en = 0.2, viaje = 3.2, dinero = 4.3, hasta, src = 'paquete.png'}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const bal = Math.sin(t * 2.4) * 6;
  const k1 = ease(t, en, en + 0.4);
  const k2 = ease(t, en + 0.2, en + 0.6);
  const k3 = ease(t, en + 0.4, en + 0.8);
  const pv = ease(t, viaje, viaje + 0.9);
  const dv = ease(t, dinero, dinero + 0.9);
  const E = 1.2;
  const px = 170 + (470 - 170) * pv; // centro del paquete
  const pulso = 1 + Math.sin(t * 4) * 0.04;
  return (
    <div style={{opacity: s}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={`translate(0 ${bal})`}>
          <g transform={`translate(470 ${y}) scale(${E}) translate(-470 ${-y})`}><Tienda x={470} y={y - 10} k={k2} /></g>
          <g transform={`translate(790 ${y}) scale(${E}) translate(-790 ${-y})`}><Tarjeta x={790} y={y} k={k3} /></g>
          <g opacity={ease(t, en + 0.3, en + 0.7)} transform={`translate(640 ${y - 190}) scale(${pulso})`}>
            <circle r={62} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
            <T x={0} y={26} s={72} f={F.cifra}>14</T>
          </g>
          {dv > 0 ? (
            <g transform={`translate(${470 + (790 - 470) * dv} ${y - 130 * Math.sin(Math.PI * dv)})`} opacity={Math.min(1, dv * 5)}>
              <circle r={44} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
              <T x={0} y={16} s={50} f={F.cifra}>€</T>
            </g>
          ) : null}
        </g>
      </svg>
      <Img src={staticFile(`imagenes/${src}`)} style={{position: 'absolute', left: px - 120, top: y + bal - 112, width: 240, opacity: k1 * (1 - ease(t, viaje + 0.8, viaje + 1.0)), transform: `rotate(${-4 + 6 * pv}deg)`}} />
    </div>
  );
};

/** Furgoneta con etiqueta "tú"; el interruptor pasa a "tienda" en `cambia`. */
export const EnvioDev: React.FC<{y?: number; cambia?: number; hasta?: number}> = ({y = 600, cambia = 2.5, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const bal = Math.sin(t * 2.4) * 6;
  const k = ease(t, 0.15, 0.55);
  const sw = ease(t, cambia, cambia + 0.5);
  const tic = ease(t, 0.7, 1.0);
  const kx = 215 + (865 - 215) * sw;
  const rueda = t * 220;
  return lienzo(
    <g transform={`translate(0 ${bal})`}>
      <g opacity={k} transform={`translate(490 ${y}) scale(1.25) translate(-490 ${-y}) translate(${(1 - k) * -120} 0)`}>
        <rect x={250} y={y} width={340} height={170} rx={10} fill={sw > 0.5 ? C.turquesa : C.crema} stroke={C.tinta} strokeWidth={6} />
        <T x={420} y={y + 115} s={96} fill={sw > 0.5 ? C.crema : C.tinta}>{sw > 0.5 ? 'tienda' : 'tú'}</T>
        <path d={`M590 ${y + 40} H680 L730 ${y + 100} V${y + 170} H590 Z`} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} strokeLinejoin="round" />
        <path d={`M610 ${y + 58} H668 L698 ${y + 98} H610 Z`} fill={C.crema} stroke={C.tinta} strokeWidth={4} />
        {[360, 660].map((cx, i) => (
          <g key={i} transform={`translate(${cx} ${y + 178}) rotate(${rueda})`}>
            <circle r={36} fill={C.tinta} />
            <circle r={14} fill={C.crema} />
            <line x1={-14} y1={0} x2={14} y2={0} stroke={C.tinta} strokeWidth={5} />
          </g>
        ))}
      </g>
      {/* tic al lado de la furgoneta: rojo mientras la paga el cliente, verde cuando la asume la tienda */}
      <g opacity={tic} transform={`translate(895 ${y + 120}) scale(${0.4 + 0.6 * tic})`}>
        <circle r={50} fill={sw > 0.5 ? C.turquesa : C.teja} stroke={C.tinta} strokeWidth={6} />
        <path d="M-24 2 L-8 20 L26 -20" fill="none" stroke={C.crema} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* interruptor */}
      <g opacity={ease(t, 0.9, 1.3)}>
        <rect x={140} y={y + 330} width={800} height={130} rx={65} fill={C.crema} stroke={C.tinta} strokeWidth={6} />
        <T x={370} y={y + 412} s={64} o={sw > 0.5 ? 0.35 : 1}>tú</T>
        <T x={700} y={y + 412} s={64} o={sw > 0.5 ? 1 : 0.35}>tienda</T>
        <circle cx={kx} cy={y + 395} r={52} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
      </g>
    </g>,
    s,
  );
};

const Prenda: React.FC = () => (
  <g>
    <path d="M-70 -80 L-30 -100 Q0 -70 30 -100 L70 -80 L110 -30 L70 -5 L60 -25 V90 H-60 V-25 L-70 -5 L-110 -30 Z" fill={C.crema} stroke={C.tinta} strokeWidth={6} strokeLinejoin="round" />
    <g transform="translate(40 30) rotate(8)">
      <rect x={-34} y={-24} width={68} height={48} fill={C.mostaza} stroke={C.tinta} strokeWidth={4} />
      {[-20, -8, 4, 16].map((d, i) => <line key={i} x1={d} y1={-24} x2={d} y2={-8 + (i % 2) * -6} stroke={C.tinta} strokeWidth={3} />)}
      <line x1={-26} y1={10} x2={26} y2={10} stroke={C.tinta} strokeWidth={4} />
    </g>
  </g>
);
const Fruta: React.FC = () => (
  <g>
    <path d="M0 -70 Q60 -100 100 -40 Q120 40 60 90 Q30 108 0 94 Q-30 108 -60 90 Q-120 40 -100 -40 Q-60 -100 0 -70 Z" fill={C.teja} stroke={C.tinta} strokeWidth={6} />
    <path d="M0 -68 Q-4 -100 14 -116" fill="none" stroke={C.tinta} strokeWidth={8} strokeLinecap="round" />
    <path d="M10 -96 Q50 -130 78 -100 Q44 -80 10 -96 Z" fill={C.turquesa} stroke={C.tinta} strokeWidth={5} />
  </g>
);
const CajaPrecinto: React.FC = () => (
  <g>
    <rect x={-100} y={-70} width={200} height={160} fill={C.crema} stroke={C.tinta} strokeWidth={6} />
    <rect x={-100} y={-70} width={200} height={50} fill={C.piedra} stroke={C.tinta} strokeWidth={6} />
    <rect x={-22} y={-70} width={44} height={160} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
    <circle cx={60} cy={40} r={24} fill={C.turquesa} stroke={C.tinta} strokeWidth={4} />
    <path d="M48 40 L57 50 L74 30" fill="none" stroke={C.crema} strokeWidth={6} strokeLinecap="round" />
  </g>
);

/** Tres tarjetas con icono (prenda a medida, fruta, caja precintada) y aspa debajo. `ens`: instantes de entrada de cada una. */
export const ExcluidosDev: React.FC<{y?: number; ens?: number[]; hasta?: number}> = ({y = 720, ens = [0.5, 1.4, 2.4], hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const bal = Math.sin(t * 2.4) * 6;
  const xs = [220, 510, 800];
  return lienzo(
    <g transform={`translate(0 ${bal})`}>
      {[Prenda, Fruta, CajaPrecinto].map((Ic, i) => {
        const k = ease(t, ens[i], ens[i] + 0.4);
        const a = ease(t, ens[i] + 0.5, ens[i] + 0.8);
        return (
          <g key={i}>
            <g opacity={k} transform={`translate(${xs[i]} ${y + 170 + (1 - k) * 40})`}>
              <rect x={-130} y={-150} width={260} height={300} rx={18} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} opacity={0.35} />
              <g transform="scale(1.3)"><Ic /></g>
            </g>
            <Aspa x={xs[i]} y={y + 385} k={a} />
          </g>
        );
      })}
    </g>,
    s,
  );
};

export const REGISTRO_081: Record<string, React.FC<any>> = {calDev: CalDev, plazoDev: PlazoDev, reembDev: ReembDev, envioDev: EnvioDev, excluidosDev: ExcluidosDev};
