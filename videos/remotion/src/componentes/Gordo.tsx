import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {useSalida} from './util';

/**
 * Pieza 083 (Gordo y Hacienda). SVG a lienzo completo; `en` en segundos desde el inicio de la ESCENA.
 * REGISTRO_083: barraGordo (barra 0-400.000 € que se parte en tramos con etiqueta y valor completos), flujoGordo (ventanilla -> persona / Hacienda),
 * compartidoGordo (décimo que se parte en dos titulares al 50 %).
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
const X0 = 100;
const W = 780;
const miles = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

type Seg = {v: number; et: string; color?: string};

/**
 * Barra con eje 0-`total` (mismo eje en todas las barras). Hasta `partir` (s) es un bloque entero con `entera` dentro; luego se parte con un tajo
 * en `segs` y cada tramo lleva su etiqueta y su valor completo. `partir` < 0 = ya partida desde el primer fotograma.
 */
export const BarraGordo: React.FC<{
  y: number; segs: Seg[]; total?: number; titulo?: string; entera?: string; partir?: number; en?: number; hasta?: number; vivo?: boolean; alto?: number;
}> = ({y, segs, total = 400000, titulo, entera = '400.000 €', partir = -1, en = -1, hasta, vivo = true, alto = 110}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k0 = en < 0 ? 1 : ease(t, en, en + 0.35);
  const k = partir < 0 ? 1 : ease(t, partir, partir + 0.45);
  const yTit = y + 44;
  const yTick = y + (titulo ? 96 : 40);
  const yb = yTick + 22;
  const bal = vivo ? Math.sin(t * 2.4) * 5 : 0;
  const gap = 12 * k;
  const x1 = X0 + (segs[0].v / total) * W;
  const cols = [C.turquesa, C.piedra];
  const yl = yb + alto + 50;
  return lienzo(
    <g opacity={k0} transform={`translate(0 ${bal})`}>
      {titulo ? <text x={SEGURA.izq} y={yTit} fontFamily={F.texto} fontWeight={800} fontSize={44} fill={C.tinta}>{titulo}</text> : null}
      <text x={X0} y={yTick} fontFamily={F.texto} fontWeight={700} fontSize={36} fill={C.tinta}>0 €</text>
      <text x={X0 + W} y={yTick} textAnchor="end" fontFamily={F.texto} fontWeight={700} fontSize={36} fill={C.tinta}>{miles(total)} €</text>
      {/* bloque entero */}
      <rect x={X0} y={yb} width={W} height={alto} fill={C.piedra} stroke={C.tinta} strokeWidth={5} opacity={1 - k} />
      {k < 1 ? <text x={X0 + W / 2} y={yb + alto / 2 + 22} textAnchor="middle" fontFamily={F.titular} fontSize={64} fill={C.tinta} opacity={1 - k}>{entera}</text> : null}
      {/* tramos */}
      <g opacity={k}>
        {segs.map((sg, i) => {
          const a = X0 + (segs.slice(0, i).reduce((p, q) => p + q.v, 0) / total) * W;
          const w = (sg.v / total) * W;
          const dx = i === 0 ? -gap / 2 : gap / 2;
          return <rect key={i} x={a + dx + (i === 0 ? 0 : 0)} y={yb} width={Math.max(1, w - gap / 2)} height={alto} fill={sg.color ?? (i === 0 ? cols[0] : cols[1])} stroke={C.tinta} strokeWidth={5} />;
        })}
      </g>
      {/* tajo */}
      {k > 0 && k < 1 ? <line x1={x1} y1={yb - 30 * (1 - k)} x2={x1} y2={yb + alto + 30 * (1 - k)} stroke={C.teja} strokeWidth={10} strokeLinecap="round" opacity={1 - k} /> : null}
      {/* etiquetas completas */}
      <g opacity={k}>
        {segs.map((sg, i) => {
          const izq = i === 0;
          const x = izq ? X0 : X0 + W;
          return (
            <g key={i}>
              {sg.et.split('|').map((ln, j) => <text key={j} x={x} y={yl + j * 44} textAnchor={izq ? 'start' : 'end'} fontFamily={F.texto} fontWeight={700} fontSize={40} fill={C.tinta}>{ln}</text>)}
              <text x={x} y={yl + 44 * sg.et.split('|').length + 16} textAnchor={izq ? 'start' : 'end'} fontFamily={F.titular} fontSize={56} fill={C.tinta}>{miles(sg.v)} €</text>
            </g>
          );
        })}
      </g>
    </g>,
    s,
  );
};

const Persona: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle cx={0} cy={-54} r={30} fill={C.tinta} />
    <path d="M -56 40 Q -56 -14 0 -14 Q 56 -14 56 40 Z" fill={C.tinta} />
  </g>
);
const Edificio: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -80 -20 L 0 -80 L 80 -20 Z" fill={C.tinta} />
    {[-56, -20, 16, 52].map((cx) => <rect key={cx} x={cx} y={-10} width={20} height={70} fill={C.tinta} />)}
    <rect x={-90} y={64} width={180} height={14} fill={C.tinta} />
  </g>
);

/** Ventanilla (SELAE) arriba con flecha que se divide: `cobras` hacia la persona y `retencion` hacia Hacienda. */
export const FlujoGordo: React.FC<{y: number; cobras: string; retencion: string; en?: number; hasta?: number}> = ({y, cobras, retencion, en = 0, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.4);
  const f = ease(t, en + 0.5, en + 1.2);
  const bal = Math.sin(t * 2.4) * 5;
  const xP = 250, xH = 730;
  const yV = y, yI = y + 300;
  return lienzo(
    <g opacity={k} transform={`translate(0 ${bal})`}>
      <rect x={xP + 20} y={yV} width={xH - xP - 40} height={110} rx={16} fill={C.crema} stroke={C.tinta} strokeWidth={6} />
      <rect x={xP + 60} y={yV + 22} width={90} height={66} fill={C.piedra} stroke={C.tinta} strokeWidth={5} />
      <text x={xP + 190} y={yV + 72} fontFamily={F.titular} fontSize={52} fill={C.tinta}>SELAE</text>
      <g opacity={f}>
        <path d={`M ${xP + 140} ${yV + 110} L ${xP} ${yI - 110}`} stroke={C.tinta} strokeWidth={14} strokeLinecap="round" fill="none" />
        <path d={`M ${xH - 140} ${yV + 110} L ${xH} ${yI - 110}`} stroke={C.mostaza} strokeWidth={14} strokeLinecap="round" fill="none" />
      </g>
      <g opacity={f}>
        <Persona x={xP} y={yI} />
        <Edificio x={xH} y={yI - 20} />
        <text x={xP} y={yI + 110} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={40} fill={C.tinta}>Cobras</text>
        <text x={xP} y={yI + 172} textAnchor="middle" fontFamily={F.titular} fontSize={56} fill={C.tinta}>{cobras}</text>
        <text x={xH} y={yI + 110} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={40} fill={C.tinta}>Hacienda</text>
        <text x={xH} y={yI + 172} textAnchor="middle" fontFamily={F.titular} fontSize={56} fill={C.tinta}>{retencion}</text>
      </g>
    </g>,
    s,
  );
};

/** Décimo que se parte en dos mitades (50 % y 50 %) y el tramo exento de 40.000 € se divide en dos de 20.000 €. */
export const CompartidoGordo: React.FC<{y: number; en?: number; parte?: number; hasta?: number}> = ({y, en = 0, parte = 1, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.4);
  const p = ease(t, en + parte, en + parte + 0.5);
  const bal = Math.sin(t * 2.4) * 5;
  const wT = 330, hT = 200, yT = y + 60;
  const dx = 22 * p;
  const caja = (x: number, lado: string) => (
    <g>
      <rect x={x} y={yT} width={wT} height={hT} rx={14} fill={C.crema} stroke={C.tinta} strokeWidth={6} />
      <text x={x + wT / 2} y={yT + 86} textAnchor="middle" fontFamily={F.titular} fontSize={72} fill={C.tinta}>50 %</text>
      <text x={x + wT / 2} y={yT + 150} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={40} fill={C.tinta}>{lado}</text>
    </g>
  );
  return lienzo(
    <g opacity={k} transform={`translate(0 ${bal})`}>
      <text x={540} y={y + 24} textAnchor="middle" fontFamily={F.texto} fontWeight={800} fontSize={44} fill={C.tinta}>Un décimo, 2 titulares</text>
      {caja(210 - dx, 'Titular 1')}
      {caja(540 + dx, 'Titular 2')}
      <g opacity={p}>
        <rect x={210 - dx} y={yT + hT + 40} width={wT} height={110} rx={14} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
        <rect x={540 + dx} y={yT + hT + 40} width={wT} height={110} rx={14} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
        <text x={210 - dx + wT / 2} y={yT + hT + 95} textAnchor="middle" fontFamily={F.titular} fontSize={52} fill={C.tinta}>20.000 €</text>
        <text x={540 + dx + wT / 2} y={yT + hT + 95} textAnchor="middle" fontFamily={F.titular} fontSize={52} fill={C.tinta}>20.000 €</text>
        <text x={210 - dx + wT / 2} y={yT + hT + 136} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={34} fill={C.tinta}>exentos</text>
        <text x={540 + dx + wT / 2} y={yT + hT + 136} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={34} fill={C.tinta}>exentos</text>
      </g>
    </g>,
    s,
  );
};

/** Etiqueta EJEMPLO fija a la derecha, a la altura `y` (por defecto 262). */
export const EjemploG: React.FC<{y?: number}> = ({y = 262}) => (
  <div style={{position: 'absolute', right: 140, top: y, fontFamily: F.texto, fontWeight: 700, fontSize: 40, padding: '2px 18px', borderRadius: 12, background: C.tinta, color: C.crema}}>EJEMPLO</div>
);

export const REGISTRO_083: Record<string, React.FC<any>> = {barraGordo: BarraGordo, flujoGordo: FlujoGordo, compartidoGordo: CompartidoGordo, ejemploG: EjemploG};
