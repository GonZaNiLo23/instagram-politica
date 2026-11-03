import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useSalida} from './util';

// 031 · Pensión de enero. Todos los tiempos (en, llenan, segEn...) son segundos desde el inicio de la ESCENA.
const usa = () => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {fr, fps, t: fr / fps};
};
const ease = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
const lienzo = (children: React.ReactNode, s = 1) => (
  <div style={{opacity: s}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>{children}</svg>
  </div>
);
const GRIS = '#B4BBC8';

/** Casilla de calendario (cuadrado con franja superior y anillas). `parpadeo`: parpadea en mostaza desde ese segundo. */
const Casilla: React.FC<{x: number; y: number; tam: number; k?: number; t?: number; parpadeo?: number; letra?: string}> = ({x, y, tam, k = 1, t = 0, parpadeo, letra}) => {
  const on = parpadeo !== undefined && t >= parpadeo && Math.floor((t - parpadeo) / 0.35) % 2 === 0;
  const f = tam / 200;
  return (
    <g transform={`translate(${x} ${y}) scale(${(k || 0.001) * f})`} opacity={Math.min(k, 1)}>
      <rect x={0} y={0} width={200} height={200} rx={22} fill={on ? C.mostaza : C.crema} stroke={C.tinta} strokeWidth={9} />
      <rect x={0} y={0} width={200} height={52} rx={22} fill={C.tinta} />
      <rect x={0} y={26} width={200} height={26} fill={C.tinta} />
      <rect x={46} y={-14} width={16} height={44} rx={8} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
      <rect x={138} y={-14} width={16} height={44} rx={8} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
      {letra ? <text x={100} y={148} textAnchor="middle" fontFamily={F.titular} fontSize={96} fill={C.tinta}>{letra}</text> : null}
    </g>
  );
};

/** Sobre de nómina que entra con zoom desde el fotograma 0 y se abre; sale un "?" mostaza que late y, en `casillaEn`, se convierte en una casilla vacía. */
export const SobreP: React.FC<{x?: number; y?: number; esc?: number; casillaEn?: number; hasta?: number}> = ({x = 130, y = 620, esc = 0.72, casillaEn = 1.0, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const z = esc * (0.55 + 0.45 * ease(t, 0, 0.7));
  const abre = ease(t, 0.15, 0.6);
  const sale = ease(t, 0.5, 0.95);
  const late = 1 + 0.07 * Math.sin(t * 9);
  const aQ = ease(t, casillaEn, casillaEn + 0.3);
  const ocupado = 1 - aQ;
  return lienzo(
    <g>
      <g transform={`translate(${x + 410} ${y + 360}) scale(${z}) translate(-410 -360)`} opacity={1 - 0.85 * aQ}>
        {/* cuerpo del sobre */}
        <rect x={0} y={150} width={820} height={420} rx={26} fill={C.crema} stroke={C.tinta} strokeWidth={10} />
        {/* "?" saliendo */}
        <g transform={`translate(410 ${560 - 230 * sale}) scale(${late * ocupado + 0.0001})`} opacity={sale * ocupado}>
          <text x={0} y={0} textAnchor="middle" fontFamily={F.titular} fontSize={420} fill={C.mostaza} stroke={C.tinta} strokeWidth={10} paintOrder="stroke">?</text>
        </g>
        <path d="M0 176 L410 420 L820 176 L820 570 L0 570 Z" fill={C.crema} stroke={C.tinta} strokeWidth={10} strokeLinejoin="round" />
        {/* solapa: se abre girando hacia arriba */}
        <g transform={`translate(0 150) scale(1 ${1 - 2 * abre})`}>
          <path d="M0 26 Q0 0 26 0 L794 0 Q820 0 820 26 L410 270 Z" fill={C.mostaza} stroke={C.tinta} strokeWidth={10} strokeLinejoin="round" />
        </g>
        {/* líneas de la nómina */}
        <rect x={80} y={460} width={300} height={22} rx={11} fill={C.tinta} opacity={0.7} />
        <rect x={80} y={500} width={200} height={22} rx={11} fill={GRIS} />
        <text x={720} y={520} textAnchor="end" fontFamily={F.titular} fontSize={64} fill={C.tinta}>€</text>
      </g>
      <Casilla x={x + 260} y={y + 210} tam={300} k={aQ} t={t} parpadeo={casillaEn + 0.5} />
    </g>,
    s,
  );
};

/** Casilla de calendario vacía que parpadea (cierre). */
export const CasillaP: React.FC<{x?: number; y?: number; tam?: number; en?: number; parpadeo?: number; letra?: string; hasta?: number}> = ({x = 60, y = 600, tam = 240, en = 0, parpadeo = 0.3, letra, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = spring({frame: Math.round((t - en) * 30), fps: 30, config: {damping: 11, stiffness: 140, mass: 0.7}});
  return lienzo(<Casilla x={x} y={y} tam={tam} k={t < en ? 0 : k} t={t - en} parpadeo={parpadeo} letra={letra} />, s);
};

const MESES = ['D', 'E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N'];
/** 12 meses (dic→nov) en dos filas de 6. `llenan`: segundos en que se rellenan los 11 primeros; el 12.º (noviembre) queda vacío y parpadea desde `parpadeo`. */
export const MesesP: React.FC<{y?: number; en?: number; llenan: number[]; parpadeo: number; hasta?: number}> = ({y = 820, en = 0, llenan, parpadeo, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const L = 130, G = 16;
  return lienzo(
    <g>
      {MESES.map((m, i) => {
        const col = i % 6, fila = Math.floor(i / 6);
        const x = 60 + col * (L + G), yy = y + fila * (L + G);
        const ult = i === 11;
        const li = llenan[i] ?? 9999;
        const k = ease(t, li, li + 0.22);
        const ap = spring({frame: Math.round((t - en) * 30 - i * 2), fps: 30, config: {damping: 13, stiffness: 140, mass: 0.7}});
        const on = ult && t >= parpadeo && Math.floor((t - parpadeo) / 0.35) % 2 === 0;
        const rell = ult ? (on ? C.mostaza : C.crema) : (k > 0.5 ? C.tinta : C.crema);
        return (
          <g key={i} transform={`translate(${x + L / 2} ${yy + L / 2}) scale(${t < en ? 0.001 : Math.max(ap, 0.001)}) translate(${-L / 2} ${-L / 2})`}>
            <rect x={0} y={0} width={L} height={L} rx={20} fill={rell} stroke={C.tinta} strokeWidth={8} strokeDasharray={ult ? '16 10' : undefined} />
            <text x={L / 2} y={L / 2 + 24} textAnchor="middle" fontFamily={F.titular} fontSize={64} fill={ult ? C.tinta : (k > 0.5 ? C.crema : C.tinta)}>{m}</text>
          </g>
        );
      })}
    </g>,
    s,
  );
};

/** Libro de la ley (icono ≥ 240 px) con marcador. */
export const LibroP: React.FC<{x?: number; y?: number; en?: number; hasta?: number}> = ({x = 300, y = 640, en = 0, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = spring({frame: Math.round((t - en) * 30), fps: 30, config: {damping: 11, stiffness: 120, mass: 0.8}});
  const pasa = ease(t, en + 0.5, en + 1.2);
  return lienzo(
    <g transform={`translate(${x + 240} ${y + 200 + 8 * Math.sin(t * 3)}) scale(${Math.max(k, 0.001)}) translate(-240 -200)`}>
      <rect x={0} y={0} width={480} height={400} rx={26} fill={C.tinta} />
      <rect x={30} y={24} width={420} height={352} rx={14} fill={C.crema} />
      <rect x={228} y={24} width={24} height={352} fill={C.tinta} opacity={0.25} />
      {[70, 120, 170, 220, 270].map((yy, i) => (
        <g key={i}>
          <rect x={64} y={yy} width={130} height={16} rx={8} fill={GRIS} />
          <rect x={286} y={yy} width={i % 2 ? 100 : 130} height={16} rx={8} fill={GRIS} />
        </g>
      ))}
      <rect x={286} y={310} width={130} height={22} rx={11} fill={C.mostaza} opacity={pasa} />
      <path d="M392 24 V150 L416 128 L440 150 V24 Z" fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
    </g>,
    s,
  );
};

/** Calendario aplazado: la hoja se desplaza a la derecha ("aplazó") y, en `cobroEn`, caen monedas ("se cobró después, con atrasos"). */
export const AplazadoP: React.FC<{x?: number; y?: number; empuja?: number; cobroEn?: number; en?: number; hasta?: number}> = ({x = 60, y = 640, empuja = 1.0, cobroEn = 3.0, en = 0, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.4);
  const d = ease(t, empuja, empuja + 0.8);
  const monedas = [0, 1, 2, 3, 4];
  return lienzo(
    <g opacity={k}>
      <Casilla x={x} y={y} tam={300} k={1} t={t} />
      <path d={`M${x + 120} ${y + 360} H${x + 120 + 280 * d} `} stroke={C.mostaza} strokeWidth={22} strokeLinecap="round" fill="none" />
      <path d={`M${x + 120 + 280 * d - 26} ${y + 332} L${x + 120 + 280 * d + 12} ${y + 360} L${x + 120 + 280 * d - 26} ${y + 388}`} stroke={C.mostaza} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={d} />
      <Casilla x={x + 480 * d} y={y} tam={300} k={d} t={t} parpadeo={undefined} />
      {monedas.map((i) => {
        const ti = cobroEn + i * 0.25;
        const p = ease(t, ti, ti + 0.5);
        return (
          <g key={i} transform={`translate(${x + 520 + (i % 3) * 110} ${y + 440 - 150 * p - Math.floor(i / 3) * 90})`} opacity={p > 0 ? 1 : 0}>
            <circle r={46} fill={C.mostaza} stroke={C.tinta} strokeWidth={7} />
            <text y={20} textAnchor="middle" fontFamily={F.titular} fontSize={56} fill={C.tinta}>€</text>
          </g>
        );
      })}
    </g>,
    s,
  );
};

const IconoTl: React.FC<{tipo: 'grafica' | 'urna' | 'calendario'; x: number; y: number}> = ({tipo, x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={0} width={220} height={200} rx={26} fill={C.crema} stroke={C.tinta} strokeWidth={8} />
    {tipo === 'grafica' ? (
      <g>
        <rect x={34} y={110} width={30} height={60} rx={6} fill={C.tinta} />
        <rect x={84} y={74} width={30} height={96} rx={6} fill={C.tinta} />
        <rect x={134} y={36} width={30} height={134} rx={6} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
      </g>
    ) : tipo === 'urna' ? (
      <g>
        <rect x={40} y={80} width={140} height={96} rx={10} fill={C.tinta} />
        <rect x={74} y={96} width={72} height={10} rx={5} fill={C.crema} />
        <rect x={86} y={22} width={48} height={72} rx={6} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
      </g>
    ) : (
      <g>
        <rect x={34} y={40} width={152} height={130} rx={14} fill={C.crema} stroke={C.tinta} strokeWidth={6} />
        <rect x={34} y={40} width={152} height={34} rx={14} fill={C.tinta} />
        <circle cx={110} cy={124} r={26} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
      </g>
    )}
  </g>
);

/** Línea de tiempo vertical con tres hitos: icono + etiqueta (64 px). Cada hito entra en su `en`. */
export const TlP: React.FC<{y?: number; hitos: {tipo: 'grafica' | 'urna' | 'calendario'; etiqueta: string; en: number}[]; paso?: number; hasta?: number}> = ({y = 420, hitos, paso = 235, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const n = hitos.length;
  const ult = hitos[n - 1].en;
  const largo = (n - 1) * paso;
  const prog = interpolate(t, hitos.map((h) => h.en), hitos.map((_, i) => i / (n - 1)), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  void ult;
  return (
    <div style={{opacity: s}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        <rect x={160} y={y + 100} width={10} height={largo} rx={5} fill={GRIS} />
        <rect x={160} y={y + 100} width={10} height={largo * prog} rx={5} fill={C.mostaza} />
        {hitos.map((h, i) => {
          const k = spring({frame: Math.round((t - h.en) * 30), fps: 30, config: {damping: 12, stiffness: 140, mass: 0.7}});
          const on = t >= h.en;
          return (
            <g key={i} transform={`translate(0 ${y + i * paso})`} opacity={on ? Math.min(k, 1) : 0.25}>
              <g transform={`translate(${60 + 110} 100) scale(${on ? Math.max(k, 0.001) : 1}) translate(-110 -100)`}><IconoTl tipo={h.tipo} x={0} y={0} /></g>
              <text x={310} y={h.etiqueta.includes('|') ? 96 : 118} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={on ? C.tinta : GRIS}>{h.etiqueta.split('|').map((l, j) => <tspan key={j} x={310} dy={j ? 74 : 0}>{l}</tspan>)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const eur = (n: number) => n.toFixed(1).replace('.', ',');
/** Barra de la pensión media (eje en cero, 800 px = 1.376,1 €) y, tras ella, el segmento discontinuo de +49,5 € a escala (≈ 28,8 px). Contador con su etiqueta desde el primer fotograma. */
export const BarraPensionP: React.FC<{y?: number; en?: number; segEn: number; yCont?: number; hasta?: number; directo?: boolean}> = ({y = 560, en = 0, segEn, yCont = 960, hasta, directo = false}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const W0 = 800, X0 = 60, H = 110;
  const kb = ease(t, en, en + 0.8);
  const ks = ease(t, segEn, segEn + 0.7);
  const wSeg = (49.5 / 1376.1) * W0;
  const cont = directo ? 49.5 : 49.5 * ease(t, segEn, segEn + 1.6);
  return lienzo(
    <g transform={`translate(0 ${6 * Math.sin(t * 2.6)})`}>
      <rect x={X0} y={y} width={W0 * kb} height={H} rx={14} fill={C.tinta} />
      <line x1={X0} y1={y - 16} x2={X0} y2={y + H + 16} stroke={C.tinta} strokeWidth={6} />
      <rect x={X0 + W0 * kb + 2} y={y} width={wSeg * ks} height={H} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} strokeDasharray="10 8" opacity={ks > 0 ? 1 : 0} />
      <g opacity={ks}>
        <text x={X0} y={yCont} fontFamily={F.titular} fontSize={84} fill={C.tinta}>≈ +{eur(cont)} €/mes</text>
      </g>
    </g>,
    s,
  );
};

/** Dos barras horizontales (eje en 0, escala común) y la línea de la media que cae entre ambas sin cifra. */
export const IpcMediaP: React.FC<{filas: {y: number; valor: number; en: number; color: string}[]; max?: number; media: number; mediaEn: number; y0: number; y1: number; hasta?: number}> = ({filas, max = 6, media, mediaEn, y0, y1, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const X0 = 60, W0 = 820;
  const k = spring({frame: Math.round((t - mediaEn) * 30), fps: 30, config: {damping: 8, stiffness: 110, mass: 0.8}});
  const xm = X0 + (media / max) * W0;
  return lienzo(
    <g transform={`translate(0 ${6 * Math.sin(t * 2.6)})`}>
      <line x1={X0} y1={y0 - 10} x2={X0} y2={y1 + 10} stroke={C.tinta} strokeWidth={6} />
      {filas.map((f, i) => {
        const kb = ease(t, f.en, f.en + 0.7);
        return <rect key={i} x={X0} y={f.y} width={(f.valor / max) * W0 * kb} height={92} rx={12} fill={f.color} stroke={C.tinta} strokeWidth={6} />;
      })}
      <g opacity={t >= mediaEn ? 1 : 0} transform={`translate(0 ${(1 - Math.min(k, 1.1)) * -260})`}>
        <line x1={xm} y1={y0} x2={xm} y2={y1} stroke={C.tinta} strokeWidth={10} strokeDasharray="22 14" />
        <circle cx={xm} cy={y0} r={14} fill={C.tinta} />
      </g>
    </g>,
    s,
  );
};

export const REGISTRO_031: Record<string, React.FC<any>> = {
  sobreP: SobreP, casillaP: CasillaP, mesesP: MesesP, libroP: LibroP, aplazadoP: AplazadoP, tlP: TlP, barraPensionP: BarraPensionP, ipcMediaP: IpcMediaP,
};
