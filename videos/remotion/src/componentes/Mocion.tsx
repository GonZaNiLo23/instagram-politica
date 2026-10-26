import React from 'react';
import {interpolate, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, W} from '../tema';
import {useSalida} from './util';

const cl = (x: number) => Math.min(1, Math.max(0, x));

/** Línea vertical discontinua en mostaza (borde tinta) con etiqueta opcional encima. Se dibuja de arriba abajo en `en` (s de la escena). */
export const LineaMeta: React.FC<{x: number; y1: number; y2: number; en?: number; dur?: number; etiqueta?: string; hasta?: number}> = ({x, y1, y2, en = 0, dur = 0.5, etiqueta, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useSalida(hasta);
  const p = cl((frame / fps - en) / dur);
  const largo = (y2 - y1) * p;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 1920, opacity: s, pointerEvents: 'none'}}>
      <svg width={W} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={x} y1={y1} x2={x} y2={y1 + largo} stroke={C.tinta} strokeWidth={16} strokeLinecap="round" strokeDasharray="22 18" />
        <line x1={x} y1={y1} x2={x} y2={y1 + largo} stroke={C.mostaza} strokeWidth={9} strokeLinecap="round" strokeDasharray="22 18" />
      </svg>
      {etiqueta && p > 0.5 ? <div style={{position: 'absolute', left: x - 120, width: 240, top: y1 - 72, textAlign: 'center', fontFamily: F.cifra, fontWeight: 700, fontSize: 64, color: C.tinta, lineHeight: 1.1}}>{etiqueta}</div> : null}
    </div>
  );
};

type Pasos = [number, number][];
const valorEn = (t: number, pasos: Pasos) => interpolate(t, pasos.map((p) => p[0]), pasos.map((p) => p[1]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});

/**
 * Barras horizontales SÍ (turquesa) / NO (piedra) sobre un eje de 0 a `max` con la línea de `meta` (176).
 * `si`/`no`: pasos [[segundo, valor], ...] (segundos desde el inicio de la escena). `parpadeo` = [desde, hasta] la barra SÍ parpadea.
 * El eje lleva rótulos 0 · meta · max de 48 px bajo las barras. Eje siempre desde 0.
 */
export const Votacion: React.FC<{y?: number; max?: number; meta?: number; en?: number; hasta?: number; alto?: number; si: {pasos: Pasos}; no?: {pasos: Pasos}; parpadeo?: [number, number]}> = ({
  y = 600, max = 350, meta = 176, en = 0, hasta, alto = 80, si, no, parpadeo,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const sal = useSalida(hasta);
  const x0 = 220;
  const w = 700;
  const xm = x0 + (w * meta) / max;
  const ent = cl((t - en) / 0.4);
  const filas = no ? 2 : 1;
  const alt = filas * alto + (filas - 1) * 40;
  const vSi = valorEn(t, si.pasos);
  const vNo = no ? valorEn(t, no.pasos) : 0;
  const parp = parpadeo && t >= parpadeo[0] && t < parpadeo[1] ? (Math.floor((t - parpadeo[0]) * 6) % 2 === 0 ? 1 : 0.25) : 1;
  const fila = (top: number, etiqueta: string, valor: number, color: string, op = 1) => (
    <>
      <div style={{position: 'absolute', left: 60, top: top + (alto - 70) / 2, width: 150, fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: '70px', color: C.tinta}}>{etiqueta}</div>
      <div style={{position: 'absolute', left: x0, top, width: w, height: alto, background: 'rgba(141,153,174,0.22)', borderRadius: 10}} />
      <div style={{position: 'absolute', left: x0, top, width: Math.max(0, (w * valor) / max), height: alto, background: color, borderRadius: 10, opacity: op}} />
    </>
  );
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 1920, opacity: sal * ent}}>
      {fila(y, 'SÍ', vSi, C.turquesa, parp)}
      {no ? fila(y + alto + 40, 'NO', vNo, C.piedra) : null}
      <svg width={W} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={xm} y1={y - 28} x2={xm} y2={y + alt + 28} stroke={C.tinta} strokeWidth={16} strokeLinecap="round" strokeDasharray="22 18" />
        <line x1={xm} y1={y - 28} x2={xm} y2={y + alt + 28} stroke={C.mostaza} strokeWidth={9} strokeLinecap="round" strokeDasharray="22 18" />
      </svg>
      {[[x0, '0'], [xm, String(meta)], [x0 + w, String(max)]].map(([x, l], i) => (
        <div key={i} style={{position: 'absolute', left: (x as number) - 70, width: 140, textAlign: 'center', top: y + alt + 38, fontFamily: F.cifra, fontWeight: 700, fontSize: 48, color: C.tinta, lineHeight: 1.1}}>{l}</div>
      ))}
    </div>
  );
};

export type Columna = {etiqueta: string; valor: number; /** hito encendido (s absolutos) */ hito: number; /** inicio de la barra (s) */ barra?: number; durBarra?: number; /** pasa a gris atenuado (s) */ gris?: number; /** se enciende en mostaza (s) */ mostaza?: number};

/**
 * Línea de tiempo de las mociones con barras verticales de síes (eje desde 0 hasta `max`, línea `meta` a escala real).
 * Todos los tiempos (`t0` = inicio de la escena en el vídeo; hito/barra/gris/mostaza) son ABSOLUTOS en segundos del vídeo,
 * así el mismo gráfico se repite idéntico en escenas consecutivas.
 */
export const Mociones: React.FC<{t0: number; columnas: Columna[]; base?: number; altoMax?: number; max?: number; meta?: number; x0?: number; x1?: number; lineaEn?: number; hasta?: number}> = ({
  t0, columnas, base = 1010, altoMax = 340, max = 350, meta = 176, x0 = 60, x1 = 960, lineaEn = 0, hasta,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = t0 + frame / fps;
  const sal = useSalida(hasta);
  const n = columnas.length;
  const col = (x1 - x0) / n;
  const bw = 84;
  const yMeta = base - (meta / max) * altoMax;
  const yTope = base - altoMax;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 1920, opacity: sal}}>
      <svg width={W} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={x0} y1={yTope} x2={x1 - 90} y2={yTope} stroke={C.piedra} strokeWidth={4} strokeDasharray="4 12" strokeLinecap="round" />
        <line x1={x0} y1={base} x2={x1} y2={base} stroke={C.tinta} strokeWidth={8} strokeLinecap="round" />
        <line x1={x0} y1={yMeta} x2={x1} y2={yMeta} stroke={C.tinta} strokeWidth={14} strokeLinecap="round" strokeDasharray="22 18" opacity={T >= lineaEn ? 1 : 0} />
        <line x1={x0} y1={yMeta} x2={x1} y2={yMeta} stroke={C.mostaza} strokeWidth={7} strokeLinecap="round" strokeDasharray="22 18" opacity={T >= lineaEn ? 1 : 0} />
      </svg>
      <div style={{position: 'absolute', left: x1 - 90, width: 90, textAlign: 'right', top: yTope - 26, fontFamily: F.cifra, fontWeight: 700, fontSize: 48, color: C.tinta, lineHeight: 1.1}}>350</div>
      <div style={{position: 'absolute', left: x1 - 150, width: 150, textAlign: 'right', top: yMeta - 62, fontFamily: F.cifra, fontWeight: 700, fontSize: 48, color: C.tinta, lineHeight: 1.1}}>176</div>
      {columnas.map((c, i) => {
        const cx = x0 + col * (i + 0.5);
        const on = T >= c.hito;
        const pop = on ? 1 + 0.5 * Math.exp(-(T - c.hito) * 14) * Math.cos((T - c.hito) * 30) : 1;
        const p = c.barra === undefined ? 0 : Easing.out(Easing.cubic)(cl((T - c.barra) / (c.durBarra ?? 0.6)));
        const g = c.gris === undefined ? 0 : cl((T - c.gris) / 0.35);
        const m = c.mostaza === undefined ? 0 : cl((T - c.mostaza) / 0.2);
        const h = (c.valor / max) * altoMax * p;
        const relleno = m > 0 ? C.mostaza : g > 0 ? C.piedra : C.tinta;
        const topFinal = base - (c.valor / max) * altoMax - 74;
        const cruza = topFinal + 66 > yMeta - 16 && topFinal < yMeta + 16;
        const topCifra = cruza ? yMeta - 16 - 66 : base - h - 74;
        const lit = m > 0 ? C.mostaza : on ? C.tinta : C.crema;
        return (
          <div key={i}>
            {h > 0 ? (
              <>
                <div style={{position: 'absolute', left: cx - bw / 2, width: bw, top: base - h, height: h, background: relleno, border: m > 0 ? `6px solid ${C.tinta}` : 'none', boxSizing: 'border-box', borderRadius: '10px 10px 0 0', opacity: 1 - 0.4 * g}} />
                <div style={{position: 'absolute', left: cx - 66, width: 132, textAlign: 'center', top: topCifra, fontFamily: F.cifra, fontWeight: 700, fontSize: 64, color: C.tinta, lineHeight: '66px', background: C.crema, borderRadius: 12, opacity: cl((p - 0.55) / 0.45) * (1 - 0.4 * g)}}>{c.valor}</div>
              </>
            ) : null}
            <div style={{position: 'absolute', left: cx - 18, top: base - 18, width: 36, height: 36, borderRadius: 18, background: lit, border: `7px solid ${on ? C.tinta : C.piedra}`, boxSizing: 'border-box', transform: `scale(${on ? pop : 0.8})`}} />
            <div style={{position: 'absolute', left: cx - 75, width: 150, textAlign: 'center', top: base + 22, fontFamily: F.cifra, fontWeight: 700, fontSize: 64, letterSpacing: -5, color: C.tinta, opacity: on ? 1 - 0.35 * g : 0.45, lineHeight: 1.1}}>{c.etiqueta}</div>
          </div>
        );
      })}
    </div>
  );
};

/** Barrido de corte: una banda de color cubre la pantalla y se retira de izquierda a derecha en `dur` s desde el inicio de la escena. */
export const Barrido: React.FC<{color?: string; dur?: number; en?: number}> = ({color = C.mostaza, dur = 0.4, en = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = Easing.inOut(Easing.cubic)(cl((frame / fps - en) / dur));
  if (p >= 1) return null;
  return (
    <div style={{position: 'absolute', left: W * p, top: 0, width: W, height: 1920, background: color}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 18, height: 1920, background: C.tinta}} />
    </div>
  );
};

/** Registro de los componentes de la pieza 001 (se mezcla en REGISTRO). */
export const REGISTRO_001: Record<string, React.FC<any>> = {votacion: Votacion, lineaMeta: LineaMeta, mociones: Mociones, barrido: Barrido};
