import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {useSalida} from './util';

/**
 * Pieza 033 (vivienda vs. sueldos). Componentes SVG a lienzo completo; tiempos `en` en segundos desde el inicio de la ESCENA.
 * REGISTRO_033: barrasCasa, ejemploCasa, compraCasa, corteCasa, conveniosCasa.
 */
const usa = () => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {t: fr / fps};
};
const ease = (t: number, a: number, b: number, out = false) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: out ? Easing.out(Easing.cubic) : Easing.inOut(Easing.cubic)});
const lienzo = (children: React.ReactNode, s: number) => (
  <div style={{opacity: s}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>{children}</svg>
  </div>
);
const T = (props: {x: number; y: number; children: React.ReactNode; fill?: string; size?: number; anchor?: 'start' | 'middle' | 'end'; titular?: boolean}) => (
  <text x={props.x} y={props.y} textAnchor={props.anchor ?? 'middle'} fontFamily={props.titular ? F.titular : F.texto} fontWeight={700} fontSize={props.size ?? 64} fill={props.fill ?? C.tinta}>{props.children}</text>
);

/** Casa vectorial plana de 200 px de ancho; (cx, ybase) = centro de la base. */
const CasaIcono: React.FC<{cx: number; yb: number; esc?: number; color?: string}> = ({cx, yb, esc = 1, color = C.mostaza}) => (
  <g transform={`translate(${cx} ${yb}) scale(${esc})`}>
    <rect x={-80} y={-110} width={160} height={110} fill={color} stroke={C.tinta} strokeWidth={6} />
    <polygon points="-105,-105 0,-190 105,-105" fill={C.tinta} />
    <rect x={-22} y={-66} width={44} height={66} fill={C.tinta} />
    <rect x={44} y={-92} width={28} height={28} fill={C.crema} stroke={C.tinta} strokeWidth={4} />
    <rect x={-72} y={-92} width={28} height={28} fill={C.crema} stroke={C.tinta} strokeWidth={4} />
  </g>
);
/** Billete vectorial plano; (cx, yb) = centro de la base. */
const BilleteIcono: React.FC<{cx: number; yb: number; w?: number; esc?: number; color?: string; relleno?: number}> = ({cx, yb, w = 200, esc = 1, color = C.crema, relleno = 1}) => {
  const h = w * 0.55;
  return (
    <g transform={`translate(${cx} ${yb}) scale(${esc})`} opacity={relleno}>
      <rect x={-w / 2} y={-h} width={w} height={h} rx={w * 0.06} fill={color} stroke={C.tinta} strokeWidth={Math.max(3, w * 0.03)} />
      <circle cx={0} cy={-h / 2} r={h * 0.27} fill="none" stroke={C.tinta} strokeWidth={Math.max(3, w * 0.03)} />
      <text x={0} y={-h / 2 + h * 0.13} textAnchor="middle" fontFamily={F.titular} fontSize={h * 0.36} fill={C.tinta}>€</text>
    </g>
  );
};
const LlaveIcono: React.FC<{cx: number; cy: number; esc?: number}> = ({cx, cy, esc = 1}) => (
  <g transform={`translate(${cx} ${cy}) scale(${esc}) rotate(-35)`}>
    <circle cx={-80} cy={0} r={62} fill={C.mostaza} stroke={C.tinta} strokeWidth={8} />
    <circle cx={-80} cy={0} r={22} fill={C.crema} stroke={C.tinta} strokeWidth={6} />
    <rect x={-20} y={-14} width={190} height={28} fill={C.tinta} />
    <rect x={110} y={14} width={22} height={50} fill={C.tinta} />
    <rect x={146} y={14} width={22} height={36} fill={C.tinta} />
  </g>
);

/**
 * Dos barras verticales con eje en cero (misma escala: `k` px por 1 %). Casa (mostaza) sube de golpe; sueldos (tinta) crece despacio.
 * `casaDe`/`baja`: la casa baja de un valor a otro (escalón). `copias`: cuatro segmentos de la barra de sueldos que llenan la de la casa.
 * `sueldosEn`: segundo en que aparece la barra de sueldos. `signo`: segundo del "?". `iconos`/`etiquetas`: opcionales.
 */
export const BarrasCasa: React.FC<{
  base?: number; k?: number; xA?: number; xB?: number; w?: number;
  valCasa?: number; valSueldo?: number; casaDe?: number; bajaEn?: number; bajaDur?: number;
  creceCasa?: number; creceSueldo?: number; sueldosEn?: number; signo?: number;
  copias?: {en: number; paso: number}; iconos?: boolean; etiquetas?: boolean; pulsoEn?: number; hasta?: number;
}> = ({base = 1080, k = 31, xA = 130, xB = 560, w = 300, valCasa = 12.2, valSueldo = 3.01, casaDe, bajaEn = 0, bajaDur = 0.9, creceCasa = 0.45, creceSueldo = 2.8, sueldosEn = 0, signo, copias, iconos = true, etiquetas = true, pulsoEn, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const vaiven = Math.sin(t * 2.4) * 3;
  const cc = ease(t, 0, creceCasa, true);
  const vCasa = casaDe !== undefined ? casaDe + (valCasa - casaDe) * ease(t, bajaEn, bajaEn + bajaDur) : valCasa;
  const hA = vCasa * k * cc;
  const ks = ease(t, sueldosEn, sueldosEn + creceSueldo);
  const hB = valSueldo * k * ks;
  const pop = pulsoEn !== undefined ? 1 + 0.18 * Math.max(0, Math.sin(Math.min(1, Math.max(0, (t - pulsoEn) / 0.6)) * Math.PI)) : 1;
  const sg = signo === undefined ? 0 : ease(t, signo, signo + 0.4);
  const mostrarB = t >= sueldosEn;
  const segs = copias ? [0, 1, 2, 3].map((i) => ({i, k: ease(t, copias.en + i * copias.paso, copias.en + i * copias.paso + 0.3, true)})) : [];
  return lienzo(
    <g transform={`translate(0 ${vaiven})`}>
      <line x1={xA - 40} y1={base} x2={xB + w + 40} y2={base} stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />
      <rect x={xA} y={base - hA} width={w} height={hA} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
      {segs.map((sg2) => {
        const h = valSueldo * k;
        const y = base - (sg2.i + 1) * h;
        return sg2.k > 0 ? <rect key={sg2.i} x={xA + 8} y={y - (1 - sg2.k) * 120} width={w - 16} height={h - 4} fill={C.tinta} stroke={C.crema} strokeWidth={3} opacity={sg2.k} /> : null;
      })}
      {mostrarB ? <rect x={xB} y={base - hB} width={w} height={hB} fill={C.tinta} stroke={C.tinta} strokeWidth={5} /> : null}
      {iconos ? <CasaIcono cx={xA + w / 2} yb={base - hA - 6} esc={pop} /> : null}
      {iconos && mostrarB ? <BilleteIcono cx={xB + w / 2} yb={base - hB - 10} esc={1} /> : null}
      {etiquetas ? <T x={xA + w / 2} y={base + 76}>CASA</T> : null}
      {etiquetas && mostrarB ? <T x={xB + w / 2} y={base + 76}>SUELDOS</T> : null}
      {sg > 0 ? (
        <g transform={`translate(${(xA + w + xB) / 2} ${base - 250}) scale(${sg})`}>
          <circle r={56} fill={C.tinta} />
          <text y={32} textAnchor="middle" fontFamily={F.titular} fontSize={88} fill={C.mostaza}>?</text>
        </g>
      ) : null}
    </g>,
    s,
  );
};

/** Bloque 2: casa de 200.000 € y billete de 21.000 €/año (izda.) y fila de 11 billetes que se llena: 9,8 y luego 10,7 sueldos. */
export const EjemploCasa: React.FC<{y?: number; en?: number; yFila?: number; llena9?: number; llena10?: number; enBillete?: number; enSlots?: number; hasta?: number}> = ({y = 700, en = 0, yFila = 1060, llena9 = 4.5, llena10 = 7.2, enBillete = 1.5, enSlots = 3, hasta}) => {
  const { t } = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.5, true);
  const kb = ease(t, enBillete, enBillete + 0.5, true);
  const bob = Math.sin(t * 3) * 7;
  const anchoB = 78, paso = 82, x0 = 100;
  const f10 = ease(t, llena10, llena10 + 0.5, true);
  const fila = Array.from({length: 11}, (_, i) => {
    const base9 = Math.min(1, Math.max(0, 9.8 - i));
    const base10 = Math.min(1, Math.max(0, 10.7 - i));
    return {i, v9: base9 * ease(t, llena9 + i * 0.045, llena9 + i * 0.045 + 0.25, true), x9: base9, nuevo: (base10 - base9) * f10};
  });
  const mas = ease(t, llena10 + 0.4, llena10 + 0.9, true);
  return lienzo(
    <g>
      <g opacity={k}><CasaIcono cx={270} yb={y + 40 + (1 - k) * 40 + bob} esc={1.25} /><T x={270} y={y + 130}>200.000 €</T></g>
      <g opacity={kb}><BilleteIcono cx={720} yb={y + 40 + (1 - kb) * 40 - bob} w={320} /><T x={720} y={y + 130} size={60}>21.000 €/año</T></g>
      {fila.map((f) => {
        const x = x0 + f.i * paso;
        const yy = yFila;
        const h = anchoB * 0.55;
        return (
          <g key={f.i}>
            <rect x={x - anchoB / 2} y={yy - h} width={anchoB} height={h} rx={5} opacity={ease(t, enSlots + f.i * 0.12, enSlots + f.i * 0.12 + 0.2, true)} fill="none" stroke={C.tinta} strokeWidth={3} strokeDasharray="8 6" opacity={0.6} />
            {f.v9 > 0 ? <rect x={x - anchoB / 2} y={yy - h} width={anchoB * f.v9} height={h} rx={5} fill={C.crema} stroke={C.tinta} strokeWidth={4} /> : null}
            {f.nuevo > 0 ? <rect x={x - anchoB / 2 + anchoB * f.x9} y={yy - h} width={anchoB * f.nuevo} height={h} rx={5} fill={C.mostaza} stroke={C.tinta} strokeWidth={4} /> : null}
          </g>
        );
      })}
      {mas > 0 ? (
        <g opacity={mas} transform={`translate(0 ${(1 - mas) * 20})`}>
          <rect x={SEGURA.izq} y={yFila + 36} width={330} height={92} rx={22} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
          <T x={SEGURA.izq + 165} y={yFila + 104} size={64} titular>+0,9 años</T>
        </g>
      ) : null}
    </g>,
    s,
  );
};

/** Bloque 3a: llave (COMPRA) y ALQUILER tachado. */
export const CompraCasa: React.FC<{y?: number; enCompra?: number; enAlquiler?: number; hasta?: number}> = ({y = 760, enCompra = 0, enAlquiler = 1.4, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const a = ease(t, enCompra, enCompra + 0.45, true);
  const b = ease(t, enAlquiler, enAlquiler + 0.4, true);
  const tach = ease(t, enAlquiler + 0.35, enAlquiler + 0.8);
  return lienzo(
    <g>
      <g opacity={a} transform={`translate(0 ${(1 - a) * 40})`}>
        <LlaveIcono cx={250} cy={y + 90} esc={1.2} />
        <rect x={490} y={y + 20} width={390} height={120} rx={26} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
        <T x={685} y={y + 104} titular>COMPRA</T>
      </g>
      <g opacity={b} transform={`translate(0 ${(1 - b) * 40})`}>
        <rect x={490} y={y + 190} width={440} height={120} rx={26} fill={C.crema} stroke={C.tinta} strokeWidth={6} />
        <T x={710} y={y + 274} titular fill={C.tinta}>ALQUILER</T>
        <line x1={510} y1={y + 250} x2={510 + 400 * tach} y2={y + 250} stroke="#C0392B" strokeWidth={12} strokeLinecap="round" />
      </g>
    </g>,
    s,
  );
};

/** Bloque 3b: dos barras horizontales (INE y Trabajo) que acaban en la misma línea de corte. */
export const CorteCasa: React.FC<{y?: number; en?: number; etiqueta?: string; hasta?: number}> = ({y = 1000, en = 0, etiqueta = 'junio 2026', hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const a = ease(t, en, en + 0.9);
  const b = ease(t, en + 0.35, en + 1.25);
  const xCorte = 800;
  const lin = ease(t, en + 1.3, en + 1.7);
  return lienzo(
    <g>
      <rect x={SEGURA.izq} y={y} width={(xCorte - SEGURA.izq) * a} height={50} rx={10} fill={C.tinta} />
      <rect x={SEGURA.izq} y={y + 80} width={(xCorte - SEGURA.izq) * b} height={50} rx={10} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
      {a > 0.9 ? <T x={SEGURA.izq + 16} y={y + 40} anchor="start" size={40} fill={C.crema}>INE</T> : null}
      {b > 0.9 ? <T x={SEGURA.izq + 16} y={y + 120} anchor="start" size={40}>TRABAJO</T> : null}
      <line x1={xCorte} y1={y - 40} x2={xCorte} y2={y - 40 + 220 * lin} stroke="#C0392B" strokeWidth={8} strokeDasharray="14 10" />
      <g opacity={lin}><T x={xCorte - 40} y={y + 232} anchor="middle" size={64}>{etiqueta}</T></g>
    </g>,
    s,
  );
};

/** Documento "convenio" (hojas + sello) para la ficha de Trabajo. */
export const ConveniosCasa: React.FC<{cx?: number; cy?: number; en?: number; hasta?: number}> = ({cx = 540, cy = 760, en = 0, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const a = ease(t, en, en + 0.5, true);
  return lienzo(
    <g opacity={a} transform={`translate(${cx} ${cy + (1 - a) * 40})`}>
      <rect x={-110} y={-150} width={220} height={290} rx={14} fill={C.tinta} transform="rotate(-8)" />
      <rect x={-110} y={-150} width={220} height={290} rx={14} fill={C.crema} stroke={C.tinta} strokeWidth={8} />
      {[-90, -50, -10, 30].map((yy) => <rect key={yy} x={-70} y={yy} width={140} height={14} rx={7} fill={C.tinta} />)}
      <circle cx={50} cy={90} r={30} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
      <text x={50} y={102} textAnchor="middle" fontFamily={F.titular} fontSize={36} fill={C.tinta}>%</text>
    </g>,
    s,
  );
};

export const REGISTRO_033: Record<string, React.FC<any>> = {
  barrasCasa: BarrasCasa, ejemploCasa: EjemploCasa, compraCasa: CompraCasa, corteCasa: CorteCasa, conveniosCasa: ConveniosCasa,
};
