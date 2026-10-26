import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, interpolateColors, Easing} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';
import {puntosHemiciclo} from './Hemiciclo';

/** Componentes de la pieza 014 (28-O de 1982). Tiempos en segundos de la ESCENA. */
const cl = (x: number) => Math.min(1, Math.max(0, x));
const T = C.tinta;

export const COL_UCD = '#E08A2E';
export const COL_PSOE = '#D8493E';
export const COL_AP = '#3B8EDB';
export const COL_OTROS = '#8D99AE';

type Grupo = {n: number; color: string; nombre?: string};
type Fase = {en: number; grupos: Grupo[]; leyenda?: boolean};

/**
 * Hemiciclo de 350 puntos con fases (cada fase recolorea los puntos en cascada), leyenda por fase,
 * contador en el hueco central, línea de mayoría y etiqueta.
 * cuenta: {desde, hasta, en, dur, etiqueta, color, apaga} (apaga: los puntos del primer grupo por encima de la cifra pasan a gris).
 */
export const HemiU: React.FC<{
  y?: number; ancho?: number; total?: number; en?: number; hasta?: number; estatico?: boolean;
  fases: Fase[];
  cuenta?: {desde: number; hasta: number; en: number; dur: number; etiqueta: string; color?: string; apaga?: boolean; tam?: number; visibleEn?: number};
  mayoria?: {en: number; etiqueta?: string; etiquetaEn?: number};
  yLeyenda?: number;
}> = ({y = 640, ancho = 720, total = 350, en = 0, hasta, estatico = false, fases, cuenta, mayoria, yLeyenda}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const p = useEntrada(en);
  const sal = useSalida(hasta);
  const filas = 10;
  const radio = ancho / 2;
  const pts = useMemo(() => puntosHemiciclo(total, filas, radio), [total, radio]);
  const dot = ((radio * 0.58) / (filas - 1)) * 0.46;
  const cx = 540;
  const base = y + radio;
  const hueco = radio * 0.42;
  const bob = 8 * Math.sin(t * 2.2);
  // color por punto en cada fase
  const colores = useMemo(() => fases.map((f) => {
    const arr: string[] = [];
    f.grupos.forEach((g) => { for (let i = 0; i < g.n; i++) arr.push(g.color); });
    while (arr.length < total) arr.push(C.piedra);
    return arr;
  }), [fases, total]);
  let fi = -1;
  fases.forEach((f, i) => { if (t >= f.en) fi = i; });
  const colorDe = (i: number) => {
    if (fi < 0) return colores[0][i];
    let c = colores[fi][i];
    if (fi > 0) {
      const k = cl((t - fases[fi].en - (i / total) * 0.7) / 0.35);
      c = interpolateColors(k, [0, 1], [colores[fi - 1][i], colores[fi][i]]);
    }
    return c;
  };
  const v = cuenta
    ? interpolate(t, [cuenta.en, cuenta.en + cuenta.dur], [cuenta.desde, cuenta.hasta], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)})
    : 0;
  const faseLey = fases[Math.max(fi, 0)];
  const ley = faseLey.leyenda === false ? [] : faseLey.grupos.filter((g) => g.nombre);
  const mayK = mayoria ? cl((t - mayoria.en) / 0.6) : 0;
  const etK = mayoria?.etiqueta ? useEntrada(mayoria.etiquetaEn ?? mayoria.en + 0.6) : 0;
  const yL = yLeyenda ?? base + 40;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(p, 1) * sal, transform: `translateY(${bob}px)`}}>
      {pts.map((q, i) => {
        const ini = (i / total) * 0.8;
        const s = estatico ? 1 : interpolate(t - en, [ini, ini + 0.25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
        let c = colorDe(i);
        if (cuenta?.apaga && i >= Math.round(v) && i < cuenta.desde) c = C.piedra;
        return <div key={i} style={{position: 'absolute', left: cx + q.x - dot, top: base + q.y - dot, width: dot * 2, height: dot * 2, borderRadius: dot, background: c, transform: `scale(${s})`}} />;
      })}
      {mayoria ? (
        <>
          <div style={{position: 'absolute', left: cx - 5, top: y - 30, width: 10, height: (base - hueco + 12 - (y - 30)) * mayK, background: C.mostaza, borderRadius: 5, boxShadow: `0 0 0 3px ${T}`}} />
          {mayoria.etiqueta ? (
            <div style={{position: 'absolute', left: cx + 28, top: y - 70, opacity: Math.min(etK, 1), transform: `scale(${0.8 + 0.2 * Math.min(etK, 1)})`, transformOrigin: 'left center', fontFamily: F.cifra, fontWeight: 700, fontSize: 64, color: T, background: C.mostaza, padding: '0 20px', borderRadius: 14, lineHeight: '80px'}}>{mayoria.etiqueta}</div>
          ) : null}
        </>
      ) : null}
      {cuenta && t >= (cuenta.visibleEn ?? 0) ? (
        <div style={{position: 'absolute', left: cx - hueco, width: hueco * 2, top: base - (cuenta.tam ?? 100) - 56, textAlign: 'center'}}>
          <div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: cuenta.tam ?? 100, lineHeight: 1, color: cuenta.color ?? T, fontVariantNumeric: 'tabular-nums'}}>{Math.round(v)}</div>
          <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 44, lineHeight: 1.2, color: T}}>{cuenta.etiqueta}</div>
        </div>
      ) : null}
      {ley.length ? (
        <div style={{position: 'absolute', left: 60, width: 900, top: yL, display: 'flex', flexWrap: 'wrap', gap: '6px 26px'}}>
          {ley.map((g, i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: F.texto, fontWeight: 700, fontSize: 44, color: T, whiteSpace: 'nowrap'}}>
              <div style={{width: 26, height: 26, borderRadius: 13, background: g.color}} />{g.nombre} {g.n}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

/** Hoja de calendario plana que cae sobre la pantalla. */
export const HojaU: React.FC<{y?: number; en?: number; hasta?: number}> = ({y = 560, en = 0, hasta}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sal = useSalida(hasta);
  const k = cl((f / fps - en) / 0.55);
  const caida = -(1 - k) * (1 - k) * 900;
  const rebote = f / fps > en + 0.55 ? 14 * Math.exp(-(f / fps - en - 0.55) * 5) * Math.sin((f / fps - en - 0.55) * 22) : 0;
  const giro = -4 + (k < 1 ? (1 - k) * -12 : 0) + 1.2 * Math.sin(f / 18);
  return (
    <div style={{position: 'absolute', left: 190, top: y, width: 660, height: 470, opacity: k > 0 ? sal : 0, transform: `translateY(${caida + rebote}px) rotate(${giro}deg)`, transformOrigin: '50% 0%'}}>
      <div style={{position: 'absolute', inset: 0, background: C.crema, border: `10px solid ${T}`, borderRadius: 26, boxShadow: '0 16px 0 rgba(20,33,61,0.25)', overflow: 'hidden'}}>
        <div style={{height: 120, background: C.teja, borderBottom: `10px solid ${T}`, display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
          <div style={{width: 26, height: 26, borderRadius: 13, background: C.crema, border: `6px solid ${T}`}} />
          <div style={{fontFamily: F.titular, fontSize: 78, color: C.crema, letterSpacing: 4}}>OCT</div>
          <div style={{width: 26, height: 26, borderRadius: 13, background: C.crema, border: `6px solid ${T}`}} />
        </div>
        <div style={{textAlign: 'center', fontFamily: F.titular, fontSize: 230, lineHeight: 1.05, color: T, marginTop: 14}}>28</div>
        <div style={{textAlign: 'center', fontFamily: F.cifra, fontWeight: 700, fontSize: 86, color: T}}>1982</div>
      </div>
    </div>
  );
};

/** Pastilla grande con las siglas del partido. */
export const SiglasU: React.FC<{texto: string; color?: string; y?: number; x?: number; en?: number; hasta?: number; tamano?: number}> = ({texto, color = COL_UCD, y = 640, x = 540, en = 0, hasta, tamano = 230}) => {
  const p = useEntrada(en, 9);
  const s = useSalida(hasta);
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: x - 420, width: 840, top: y, display: 'flex', justifyContent: 'center', opacity: Math.min(p, 1) * s, transform: `scale(${0.6 + 0.4 * p}) rotate(${-3 + Math.sin(f / 20)}deg)`}}>
      <div style={{fontFamily: F.titular, fontSize: tamano, lineHeight: 1.1, color: T, background: color, border: `10px solid ${T}`, borderRadius: 30, padding: '10px 70px', boxShadow: '0 14px 0 rgba(20,33,61,0.25)'}}>{texto}</div>
    </div>
  );
};

/** Línea de tiempo corta con hitos que se encienden/apagan. hitos: {x, texto, enciende, apaga?} */
export const LineaU: React.FC<{y?: number; en?: number; hasta?: number; hitos: {x: number; texto: string; enciende: number; apaga?: number}[]}> = ({y = 548, en = 0, hasta, hitos}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const f = useCurrentFrame();
  const t = f / 30;
  const x0 = Math.min(...hitos.map((h) => h.x)) - 120;
  const x1 = Math.max(...hitos.map((h) => h.x)) + 70;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(p, 1) * s}}>
      <line x1={x0} y1={y} x2={x0 + (x1 - x0) * Math.min(p, 1)} y2={y} stroke={T} strokeWidth={8} strokeLinecap="round" />
      {hitos.map((h, i) => {
        const on = t >= h.enciende && !(h.apaga !== undefined && t >= h.apaga);
        const k = on ? 1 + 0.25 * Math.exp(-(t - h.enciende) * 6) * Math.max(0, Math.sin((t - h.enciende) * 18)) : 1;
        return (
          <g key={i}>
            <circle cx={h.x} cy={y} r={on ? 20 : 14} fill={on ? C.mostaza : C.crema} stroke={T} strokeWidth={7} transform={`translate(${h.x} ${y}) scale(${k}) translate(${-h.x} ${-y})`} />
            <text x={h.x} y={y - 38} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={42} fill={on ? T : C.piedra}>{h.texto}</text>
          </g>
        );
      })}
    </svg>
  );
};

/** Dos barras horizontales sobre una regla 0-100 % con línea discontinua en el 50 %. */
export const BarrasU: React.FC<{y?: number; en?: number; hasta?: number;
  v1: {etiqueta: string; valor: number; texto: string; en: number; dur: number; color: string};
  v2: {etiqueta: string; valor: number; texto: string; en: number; dur: number; color: string}}> = ({y = 560, en = 0, hasta, v1, v2}) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const x0 = 60;
  const W = 840;
  const bloque = (b: typeof v1, yy: number) => {
    const k = interpolate(t, [b.en, b.en + b.dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
    const fin = t >= b.en + b.dur;
    const ancho = (b.valor / 100) * W * k;
    return (
      <g key={b.etiqueta} opacity={t >= b.en - 0.05 ? 1 : 0}>
        <text x={x0} y={yy + 44} fontFamily={F.texto} fontWeight={700} fontSize={50} fill={T}>{b.etiqueta}</text>
        <rect x={x0} y={yy + 62} width={Math.max(ancho, 0.001)} height={92} rx={10} fill={b.color} stroke={T} strokeWidth={6} />
        {fin ? <text x={x0 + (b.valor / 100) * W + 22} y={yy + 132} fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>{b.texto}</text> : null}
      </g>
    );
  };
  const yB2 = y + 170;
  const yReg = yB2 + 175;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(p, 1) * s}}>
      <line x1={x0} y1={yReg} x2={x0 + W} y2={yReg} stroke={T} strokeWidth={6} />
      {[0, 50, 100].map((v) => (
        <g key={v}>
          <line x1={x0 + (v / 100) * W} y1={yReg - 8} x2={x0 + (v / 100) * W} y2={yReg + 10} stroke={T} strokeWidth={6} />
          <text x={v === 0 ? x0 : v === 100 ? x0 + W - 5 : x0 + W / 2} y={yReg + 52} textAnchor={v === 0 ? 'start' : v === 100 ? 'end' : 'middle'} fontFamily={F.cifra} fontWeight={700} fontSize={40} fill={T}>{v} %</text>
        </g>
      ))}
      <line x1={x0 + W / 2} y1={y + 20} x2={x0 + W / 2} y2={yReg} stroke={T} strokeWidth={5} strokeDasharray="16 12" />
      {bloque(v1, y)}
      {bloque(v2, yB2)}
    </svg>
  );
};

export const REGISTRO_014: Record<string, React.FC<any>> = {
  hemiU: HemiU, hojaU: HojaU, siglasU: SiglasU, lineaU: LineaU, barrasU: BarrasU,
};
