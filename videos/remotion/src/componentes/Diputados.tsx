import React from 'react';
import {Easing, interpolate, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {puntosHemiciclo} from './Hemiciclo';
import {miles, useEntrada, useSalida} from './util';

/**
 * Componentes propios de la pieza 003 (por qué 350 diputados). Nombres nuevos: no tocan el comportamiento
 * de los componentes compartidos. Se registran en REGISTRO_003 y se mezclan en `index.tsx`.
 */

const cl = (x: number) => Math.min(1, Math.max(0, x));
const CX = SEGURA.izq + SEGURA.ancho / 2; // 510

/**
 * Hemiciclo de 350 puntos (tinta) con un anillo opcional de 50 puntos mostaza en el borde exterior (350 -> 400).
 * `base` = y de la línea base. `contador` sube dentro del hemiciclo. `pulso` hace parpadear el anillo.
 * `mayoria`: del segundo `en`, los `cuenta` primeros puntos (de izquierda a derecha) pasan a turquesa y el anillo se apaga.
 */
export const HemicicloBorde: React.FC<{
  base?: number; ancho?: number; en?: number; dur?: number; estatico?: boolean; anillo?: {en: number; dur: number; estatico?: boolean};
  contador?: {desde: number; hasta: number; en: number; dur: number}; centro?: string; centroColor?: string; centroDisco?: boolean;
  pulso?: {en: number; hasta?: number}; mayoria?: {en: number; cuenta: number; dur: number}; hasta?: number;
}> = ({base = 1010, ancho = 780, en = 0, dur = 1.2, estatico = false, anillo, contador, centro, centroColor = C.tinta, centroDisco = false, pulso, mayoria, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const sal = useSalida(hasta);
  const radio = ancho / 2;
  const pts = React.useMemo(() => puntosHemiciclo(350, 10, radio), [radio]);
  const dot = ((radio * 0.58) / 9) * 0.42;
  const R2 = radio + 38;
  const N2 = 50;
  const valor = contador ? Math.round(interpolate(t, [contador.en, contador.en + contador.dur], [contador.desde, contador.hasta], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)})) : null;
  const texto = mayoria && t >= mayoria.en + 0.1 ? String(mayoria.cuenta) : centro ?? (valor !== null ? String(valor) : null);
  const anilloOp = mayoria ? 1 - 0.85 * cl((t - mayoria.en) / 0.4) : 1;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: sal}}>
      {pts.map((p, i) => {
        const ini = (en + (i / 350) * dur) * fps;
        const s = estatico ? 1 : interpolate(frame, [ini, ini + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
        let c: string = C.tinta;
        if (mayoria && i < mayoria.cuenta) c = interpolateColors(cl((t - mayoria.en - (i / mayoria.cuenta) * mayoria.dur) / 0.25), [0, 1], [C.tinta, C.turquesa]);
        return <div key={i} style={{position: 'absolute', left: CX + p.x - dot, top: base + p.y - dot, width: dot * 2, height: dot * 2, borderRadius: dot, background: c, transform: `scale(${s})`}} />;
      })}
      {anillo
        ? Array.from({length: N2}, (_, j) => {
            const ang = Math.PI * (1 - j / (N2 - 1));
            const k = Math.min(j, N2 - 1 - j) / (N2 / 2); // 0 en los extremos, 1 arriba
            const ini = (anillo.en + k * anillo.dur) * fps;
            let s = anillo.estatico ? 1 : interpolate(frame, [ini, ini + 9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2.2))});
            if (pulso && t >= pulso.en && (pulso.hasta === undefined || t < pulso.hasta)) {
              const q = ((t - pulso.en) % 0.9) / 0.9;
              s *= 1 + 0.45 * Math.sin(Math.PI * Math.min(1, q * 1.6));
            }
            return <div key={j} style={{position: 'absolute', left: CX + R2 * Math.cos(ang) - dot, top: base - R2 * Math.sin(ang) - dot, width: dot * 2, height: dot * 2, borderRadius: dot, background: C.mostaza, border: `3px solid ${C.tinta}`, boxSizing: 'border-box', opacity: anilloOp, transform: `scale(${s})`}} />;
          })
        : null}
      {centroDisco ? <div style={{position: 'absolute', left: CX - 150, top: base - 150, width: 300, height: 150, borderRadius: '150px 150px 0 0', background: C.tinta}} /> : null}
      {texto !== null ? (
        <div style={{position: 'absolute', left: CX - 200, width: 400, top: base - (centroDisco ? 118 : 120), textAlign: 'center', fontFamily: F.cifra, fontWeight: 700, fontSize: centroDisco ? 104 : 110, lineHeight: 1, color: centroColor}}>{texto}</div>
      ) : null}
    </div>
  );
};

/** Regla 300—400 con un marcador que recorre `pasos` [[segundo, fracción 0..1], ...] y se queda en la última. */
export const ReglaRango: React.FC<{y?: number; min?: number; max?: number; pasos: [number, number][]; en?: number; hasta?: number}> = ({y = 930, min = 300, max = 400, pasos, en = 0, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const p = useEntrada(en);
  const sal = useSalida(hasta);
  const x0 = 170;
  const x1 = 850;
  const f = interpolate(t, pasos.map((q) => q[0]), pasos.map((q) => q[1]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const x = x0 + (x1 - x0) * f;
  const v = Math.round(min + (max - min) * f);
  const fin = t >= pasos[pasos.length - 1][0];
  return (
    <div style={{position: 'absolute', left: 0, top: y, width: 1080, opacity: Math.min(p, 1) * sal}}>
      <div style={{position: 'absolute', left: x - 120, width: 240, textAlign: 'center', top: 0, fontFamily: F.cifra, fontWeight: 700, fontSize: 64, lineHeight: 1, color: C.tinta, transform: fin ? 'scale(1.1)' : undefined}}>{v}</div>
      <div style={{position: 'absolute', left: x0, top: 96, width: x1 - x0, height: 14, borderRadius: 7, background: C.piedra}} />
      <div style={{position: 'absolute', left: x0, top: 96, width: x - x0, height: 14, borderRadius: 7, background: C.tinta}} />
      {[x0, x1].map((xx, i) => <div key={i} style={{position: 'absolute', left: xx - 6, top: 80, width: 12, height: 46, borderRadius: 6, background: C.tinta}} />)}
      <div style={{position: 'absolute', left: x - 26, top: 79, width: 52, height: 52, borderRadius: 26, background: C.mostaza, border: `8px solid ${C.tinta}`, boxSizing: 'border-box'}} />
      <div style={{position: 'absolute', left: x0 - 80, width: 160, textAlign: 'center', top: 140, fontFamily: F.cifra, fontWeight: 700, fontSize: 64, lineHeight: 1, color: C.tinta}}>{min}</div>
      <div style={{position: 'absolute', left: x1 - 80, width: 160, textAlign: 'center', top: 140, fontFamily: F.cifra, fontWeight: 700, fontSize: 64, lineHeight: 1, color: C.tinta}}>{max}</div>
    </div>
  );
};

// Escaños de cada una de las 50 provincias (suma 348); a cada casilla caen escaños-2 puntos (suma 248).
// Aproximación proporcional a la población, sin nombres en pantalla; el orden de las casillas es solo ilustrativo.
const ESC_PROV = [6, 9, 6, 7, 5, 5, 11, 12, 3, 3, 7, 7, 8, 8, 7, 5, 3, 4, 4, 3, 4, 3, 2, 5, 3, 4, 5, 3, 3, 6, 32, 6, 4, 6, 12, 5, 16, 5, 4, 8, 4, 4, 7, 37, 10, 5, 4, 6, 8, 4];
const LLUVIA_REPARTO: {cell: number; slot: number}[] = (() => {
  const l: {cell: number; slot: number}[] = [];
  ESC_PROV.forEach((e, cell) => { for (let slot = 0; slot < e - 2; slot++) l.push({cell, slot}); });
  return l.sort((a, b) => a.slot - b.slot || a.cell - b.cell);
})();

/**
 * Reparto de escaños (cartograma, NO mapa geográfico): 52 casillas (50 provincias + Ceuta + Melilla) que reciben
 * 2 puntos cada una (1 Ceuta y Melilla) y una "lluvia" de 248 puntos que cae sobre un montón.
 * 102 + 248 = 350. Tiempos en segundos de la escena.
 */
export const Reparto: React.FC<{y?: number; dosEn?: number; dosDur?: number; ceutaEn?: number; lluviaEn?: number; lluviaDur?: number; yMonton?: number; hasta?: number}> = ({y = 520, dosEn = 0.3, dosDur = 1.2, ceutaEn = 1.6, lluviaEn = 2, lluviaDur = 1.4, yMonton = 915, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const sal = useSalida(hasta);
  const cols = 13;
  const paso = 69;
  const lado = 58;
  const x0 = CX - (cols * paso - (paso - lado)) / 2;
  const casillas = Array.from({length: 52}, (_, i) => ({i, col: i % cols, fila: Math.floor(i / cols), esCM: i >= 50}));
  const lluvia = LLUVIA_REPARTO;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: sal}}>
      {casillas.map((c) => {
        const ini = (c.esCM ? ceutaEn : dosEn + (c.i / 50) * dosDur) * fps;
        const a = interpolate(frame, [ini, ini + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
        const dots = c.esCM ? [0] : [-1, 1];
        // Casillas que se rellenan por niveles: cuantos más puntos han caído en la casilla, más alto y más oscuro el relleno.
        const llegados = lluvia.reduce((acc, d, n) => acc + (d.cell === c.i && frame >= (lluviaEn + (n / lluvia.length) * lluviaDur) * fps + 12 ? 1 : 0), 0);
        const frac = Math.min(1, llegados / 35);
        const alturaRelleno = llegados > 0 ? (lado - 10) * (0.14 + 0.86 * frac) : 0;
        return (
          <div key={c.i} style={{position: 'absolute', left: x0 + c.col * paso, top: y + c.fila * paso, width: lado, height: lado, borderRadius: 12, border: `5px solid ${c.esCM ? C.mostaza : C.piedra}`, boxSizing: 'border-box', background: c.esCM ? 'rgba(242,177,52,0.18)' : 'transparent', overflow: 'hidden'}}>
            {alturaRelleno > 0 && <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: alturaRelleno, background: '#2A9D8F', opacity: 0.4 + 0.6 * frac}} />}
            {dots.map((d, k) => <div key={k} style={{position: 'absolute', left: lado / 2 - 5 + d * 11 - 5, top: lado / 2 - 5 - 5, width: 20, height: 20, borderRadius: 10, zIndex: 2, background: C.tinta, border: `2px solid ${C.crema}`, boxSizing: 'border-box', transform: `scale(${a})`}} />)}
          </div>
        );
      })}
      {lluvia.map((d, n) => {
        const ini = (lluviaEn + (n / lluvia.length) * lluviaDur) * fps;
        const q = interpolate(frame, [ini, ini + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)});
        if (q <= 0 || q >= 1) return null;
        const c = casillas[d.cell];
        const cx0 = x0 + c.col * paso + lado / 2;
        const cy0 = y + c.fila * paso + lado / 2;
        return <div key={n} style={{position: 'absolute', left: cx0 - 11, top: cy0 - 11 - 130 * (1 - q), width: 22, height: 22, borderRadius: 11, zIndex: 3, background: '#2A9D8F', boxShadow: `0 0 0 3px ${C.tinta}`, opacity: Math.min(1, q * 3)}} />;
      })}
    </div>
  );
};

/** Barras horizontales de "habitantes por diputado": eje común en x0 (valor 0), escala proporcional a `max`. Etiqueta literal sobre cada barra. */
export const BarrasHab: React.FC<{filas: {etiqueta: string; valor: number; y: number; yEt: number; en: number; enBarra?: number; durBarra?: number; color?: string}[]; max: number; x0?: number; ancho?: number; alto?: number; hasta?: number}> = ({filas, max, x0 = 330, ancho = 630, alto = 90, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sal = useSalida(hasta);
  const yMin = Math.min(...filas.map((f) => f.y));
  const yMax = Math.max(...filas.map((f) => f.y));
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: sal}}>
      <div style={{position: 'absolute', left: x0 - 4, top: yMin - 8, width: 8, height: yMax - yMin + alto + 16, background: C.tinta, borderRadius: 4}} />
      {filas.map((f, i) => {
        const ini = (f.enBarra ?? f.en) * fps;
        const p = interpolate(frame, [ini, ini + (f.durBarra ?? 0.9) * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
        const e = interpolate(frame, [f.en * fps - 4, f.en * fps + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <div key={i} style={{opacity: e}}>
            <div style={{position: 'absolute', left: x0 + 28, top: f.yEt, width: 960 - x0, fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: C.tinta, whiteSpace: 'nowrap'}}>{f.etiqueta}</div>
            <div style={{position: 'absolute', left: x0, top: f.y, width: (f.valor / max) * ancho * p, height: alto, background: f.color ?? C.tinta, borderRadius: '0 10px 10px 0'}} />
          </div>
        );
      })}
    </div>
  );
};

/** Flecha circular ("se mantiene"), icono plano de 120 px por defecto. */
export const FlechaCircular: React.FC<{x?: number; y?: number; tamano?: number; en?: number; hasta?: number}> = ({x = 810, y = 560, tamano = 130, en = 0, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = useEntrada(en);
  const sal = useSalida(hasta);
  const giro = interpolate(frame, [en * fps, (en + 1.2) * fps], [-120, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', left: x - tamano / 2, top: y - tamano / 2, width: tamano, height: tamano, opacity: Math.min(p, 1) * sal, transform: `scale(${0.6 + 0.4 * p}) rotate(${giro}deg)`}}>
      <svg viewBox="0 0 200 200" width={tamano} height={tamano} style={{overflow: 'visible'}}>
        <path d="M100 30 A70 70 0 1 1 34 78" fill="none" stroke={C.tinta} strokeWidth={22} strokeLinecap="round" />
        <path d="M32 30 L66 88 L6 84 Z" fill={C.mostaza} stroke={C.tinta} strokeWidth={9} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export const REGISTRO_003: Record<string, React.FC<any>> = {
  hemicicloBorde: HemicicloBorde,
  reglaRango: ReglaRango,
  reparto: Reparto,
  barrasHab: BarrasHab,
  flechaCircular: FlechaCircular,
};

// miles se importa para uso futuro en etiquetas numéricas
void miles;
