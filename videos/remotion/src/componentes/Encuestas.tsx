import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, PARTIDOS} from '../tema';
import {useEntrada, useSalida} from './util';

/**
 * Componentes de la pieza 012 (encuestas CIS y privadas). Lienzo 1080x1920; `en`/`hasta`/tiempos en segundos de la ESCENA.
 * Los objetos reales (olla, cámara, paellas, sede) van con `recorte` y `foto`; aquí solo gráficos, iconos de interfaz y mecánica.
 */
const T = C.tinta;
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const cl = (x: number) => Math.min(1, Math.max(0, x));
const easeIO = (u: number) => u * u * (3 - 2 * u);
const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};

const Capa: React.FC<{en?: number; hasta?: number; bob?: number; children: React.ReactNode}> = ({en = 0, hasta, bob = 6, children}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const f = useCurrentFrame();
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: (en < 0 ? 1 : Math.min(p, 1)) * s, transform: `translateY(${bob * Math.sin((f / 30) * 2.2)}px)`}}>{children}</svg>;
};

const Persona: React.FC<{cx: number; cy: number; s: number; fill?: string}> = ({cx, cy, s, fill = T}) => (
  <g>
    <circle cx={cx} cy={cy - 0.26 * s} r={0.21 * s} fill={fill} />
    <path d={`M${cx - 0.4 * s} ${cy + 0.42 * s} Q${cx - 0.4 * s} ${cy + 0.02 * s} ${cx} ${cy + 0.02 * s} Q${cx + 0.4 * s} ${cy + 0.02 * s} ${cx + 0.4 * s} ${cy + 0.42 * s} Z`} fill={fill} />
  </g>
);

/* ------------------------------------------------------------------ Balanza plana inclinada con pastillas */
/** Balanza plana. `baja`: lado que baja ('izq' | 'der'). `inclinaEn`: segundo en que se inclina (negativo: ya inclinada). Pastillas SIN color de partido. */
export const BalanzaE: React.FC<{x?: number; y?: number; R?: number; baja: 'izq' | 'der'; izq: string; der: string; inclinaEn?: number; grados?: number; en?: number; hasta?: number; seco?: boolean}> = ({
  x = 290, y = 800, R = 115, baja, izq, der, inclinaEn = 0.15, grados = 22, en = 0, hasta, seco = false,
}) => {
  const t = useT();
  const k = inclinaEn < 0 ? 1 : Easing.out(Easing.back(1.8))(cl((t - inclinaEn) / 0.65));
  const phi = ((baja === 'izq' ? -1 : 1) * grados * k + (inclinaEn < 0 || t > inclinaEn + 0.9 ? 1.1 * Math.sin(t * 2.3) : 0)) * (Math.PI / 180);
  const Lx = x - R * Math.cos(phi), Ly = y - R * Math.sin(phi);
  const Rx = x + R * Math.cos(phi), Ry = y + R * Math.sin(phi);
  const col = 120;
  const plato = (px: number, py: number, txt: string) => {
    const w = 44 + 40 * txt.length;
    return (
      <g>
        <path d={`M${px} ${py} L${px - w / 2 + 10} ${py + col} M${px} ${py} L${px + w / 2 - 10} ${py + col}`} fill="none" {...sw} strokeWidth={5} />
        <rect x={px - w / 2} y={py + col} width={w} height={90} rx={20} fill={C.crema} {...sw} strokeWidth={7} />
        <text x={px} y={py + col + 66} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={64} fill={T}>{txt}</text>
        <path d={`M${px - w / 2 - 12} ${py + col + 100} H${px + w / 2 + 12}`} {...sw} strokeWidth={8} />
      </g>
    );
  };
  return (
    <Capa en={seco ? -1 : en} hasta={hasta} bob={0}>
      <path d={`M${x} ${y} V${y + 300}`} {...sw} strokeWidth={13} />
      <path d={`M${x - 70} ${y + 300} H${x + 70}`} {...sw} strokeWidth={14} />
      <path d={`M${Lx} ${Ly} L${Rx} ${Ry}`} {...sw} strokeWidth={13} />
      {plato(Lx, Ly, izq)}
      {plato(Rx, Ry, der)}
      <circle cx={x} cy={y} r={20} fill={C.mostaza} {...sw} />
    </Capa>
  );
};

/* ------------------------------------------------------------------ Barras horizontales con eje desde 0 (escala fija entre gráficos) */
export type FilaE = {etiqueta?: string; valor?: number; texto?: string; color?: string; y: number; en: number; dur?: number; cab?: string};
/** `escala` px por unidad (igual en todos los gráficos de la pieza). La cifra aparece al terminar la barra (nunca cifras intermedias). Eje vertical en x0+col. */
export const BarrasE: React.FC<{filas: FilaE[]; x0?: number; col?: number; escala?: number; alto?: number; eje?: boolean; en?: number; hasta?: number}> = ({filas, x0 = 60, col = 200, escala = 11, alto = 58, eje = true, en = 0, hasta}) => {
  const t = useT();
  const s = useSalida(hasta);
  const barras = filas.filter((f) => !f.cab);
  const yMin = Math.min(...barras.map((f) => f.y)) - 6, yMax = Math.max(...barras.map((f) => f.y)) + alto + 6;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: s}}>
      {eje && barras.length ? <div style={{position: 'absolute', left: x0 + col - 3, top: yMin, width: 6, height: (yMax - yMin) * cl((t - barras[0].en + 0.1) / 0.3), background: T, borderRadius: 3}} /> : null}
      {filas.map((f, i) => {
        const e = Math.min(cl((t - f.en) / 0.25), 1);
        if (f.cab) {
          return <div key={i} style={{position: 'absolute', left: x0, top: f.y, whiteSpace: 'nowrap', fontFamily: F.texto, fontWeight: 700, fontSize: 64, letterSpacing: -1.6, color: T, opacity: e, transform: `translateX(${(1 - e) * -40}px)`}}>{f.cab}</div>;
        }
        const dur = f.dur ?? 0.8;
        const p = Easing.out(Easing.cubic)(cl((t - f.en) / dur));
        const pop = cl((t - f.en - dur) / 0.2);
        return (
          <div key={i}>
            <div style={{position: 'absolute', left: x0, top: f.y - 3, width: col - 14, textAlign: 'right', fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: `${alto}px`, color: T, opacity: e}}>{f.etiqueta}</div>
            <div style={{position: 'absolute', left: x0 + col, top: f.y, height: alto, width: (f.valor ?? 0) * escala * p, background: f.color ?? T, borderRadius: '0 10px 10px 0'}} />
            <div style={{position: 'absolute', left: x0 + col + (f.valor ?? 0) * escala + 18, top: f.y - 3, fontFamily: F.cifra, fontWeight: 700, fontSize: 64, lineHeight: `${alto}px`, color: T, opacity: pop, transform: `scale(${0.85 + 0.15 * pop})`, transformOrigin: 'left center', whiteSpace: 'nowrap'}}>{f.texto}</div>
          </div>
        );
      })}
    </div>
  );
};
export const COL_PSOE = PARTIDOS.PSOE;
export const COL_PP = PARTIDOS.PP;

/* ------------------------------------------------------------------ Tarjetas (postura / texto) con icono de silueta */
/** Tarjeta de 900 px con silueta plana (sin foto) y rótulo de 64 px. `entra`: 'izq' (desliza) | 'der' (barrido desde la derecha, sin salirse del lienzo) | 'abajo'. */
export const TarjetaE: React.FC<{titular: string; y: number; alto?: number; entra?: 'izq' | 'der' | 'abajo'; icono?: boolean; en?: number; hasta?: number; ancho?: number; x?: number}> = ({titular, y, alto = 270, entra = 'izq', icono = true, en = 0, hasta, ancho = 900, x = 60}) => {
  const e = Math.min(useEntrada(en), 1);
  const s = useSalida(hasta);
  const t = useT();
  const u = easeIO(cl((t - en) / 0.45));
  const dx = entra === 'izq' ? -(1 - e) * 420 : 0;
  const dy = entra === 'abajo' ? (1 - e) * 60 : 0;
  const clip = entra === 'der' ? `inset(0 0 0 ${(1 - u) * 100}%)` : undefined;
  return (
    <div style={{position: 'absolute', left: x, width: ancho, top: y, height: alto, boxSizing: 'border-box', padding: '14px 26px', display: 'flex', alignItems: 'center', gap: 26, borderRadius: 28, border: `6px solid ${T}`, background: '#FBF8F1', boxShadow: '0 12px 0 rgba(20,33,61,0.2)', opacity: entra === 'der' ? s : Math.min(e, 1) * s, transform: `translate(${dx}px, ${dy}px)`, clipPath: clip}}>
      {icono ? (
        <svg width={150} height={150} viewBox="0 0 150 150" style={{flex: '0 0 auto'}}>
          <circle cx={75} cy={75} r={68} fill={C.mostaza} stroke={T} strokeWidth={7} />
          <Persona cx={75} cy={82} s={96} fill={T} />
        </svg>
      ) : null}
      <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: '74px', color: T}}>{titular}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ Línea de dos pasos */
/** Dos paradas numeradas (1 · 2) de izquierda a derecha; se encienden en `enc1`/`enc2` (negativo: ya encendida; null: apagada). Icono de teléfono en la 1; la 2 la acompaña la olla (recorte). */
export const PasosE: React.FC<{y?: number; enc1?: number | null; enc2?: number | null; en?: number; hasta?: number}> = ({y = 600, enc1 = 0.3, enc2 = null, en = 0, hasta}) => {
  const t = useT();
  const lit = (e: number | null) => (e === null ? 0 : e < 0 ? 1 : easeIO(cl((t - e) / 0.3)));
  const a = lit(enc1), b = lit(enc2);
  const dot = (cx: number, n: number, l: number) => (
    <g>
      <circle cx={cx} cy={y} r={50 + 6 * Math.sin(l * Math.PI)} fill={l > 0.5 ? C.mostaza : C.crema} stroke={l > 0.5 ? T : C.piedra} strokeWidth={8} />
      <text x={cx} y={y + 22} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={l > 0.5 ? T : C.piedra}>{n}</text>
    </g>
  );
  return (
    <Capa en={en} hasta={hasta} bob={0}>
      <path d={`M${160} ${y} H${620}`} stroke={C.piedra} strokeWidth={8} strokeDasharray="4 18" strokeLinecap="round" />
      <path d={`M${160} ${y} H${160 + 460 * b}`} stroke={T} strokeWidth={8} strokeLinecap="round" />
      {dot(110, 1, a)}
      {dot(670, 2, b)}
      {/* teléfono (icono de interfaz) */}
      <g opacity={a} transform={`translate(${300} ${y - 52})`}>
        <rect x={0} y={0} width={64} height={104} rx={14} fill={C.crema} {...sw} strokeWidth={6} />
        <path d="M14 18 H50" {...sw} strokeWidth={5} />
        <circle cx={32} cy={84} r={7} fill={T} />
        <path d="M80 20 q22 32 0 64 M96 8 q36 44 0 88" fill="none" {...sw} strokeWidth={6} opacity={0.5 + 0.5 * Math.sin(t * 8)} />
      </g>
    </Capa>
  );
};

/* ------------------------------------------------------------------ Cuadrícula de personas */
/** Cuadrícula de n personas (silueta). `aparece` {en, dur}; `burbujas` {en, texto?}: bocadillo con ✓ (o texto) en las `conBurbuja` primeras; `grises` {n, en}: las n primeras pasan a gris piedra con "?". */
export const PersonasE: React.FC<{n: number; cols: number; y: number; tam?: number; paso?: number; x0?: number; aparece?: {en: number; dur: number}; burbujas?: {en: number; texto?: string; cuantas?: number}; grises?: {n: number; en: number}; en?: number; hasta?: number}> = ({
  n, cols, y, tam = 64, paso, x0, aparece = {en: 0, dur: 1}, burbujas, grises, en = 0, hasta,
}) => {
  const t = useT();
  const pa = paso ?? tam * 1.15;
  const rows = Math.ceil(n / cols);
  const xi = x0 ?? (540 - (cols * pa) / 2 + pa / 2);
  const els = [];
  for (let i = 0; i < n; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    const cx = xi + c * pa, cy = y + r * pa * 1.15;
    const e = Easing.out(Easing.back(2))(cl((t - aparece.en - (i / n) * aparece.dur) / 0.3));
    const g = grises && i < grises.n ? easeIO(cl((t - grises.en - (i / grises.n) * 0.8) / 0.25)) : 0;
    if (e <= 0) continue;
    els.push(
      <g key={i} transform={`translate(${cx} ${cy}) scale(${e}) translate(${-cx} ${-cy})`}>
        <Persona cx={cx} cy={cy} s={tam} fill={g > 0.5 ? C.piedra : T} />
        {g > 0.5 ? <text x={cx} y={cy + 0.1 * tam} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={tam * 0.55} fill={C.crema}>?</text> : null}
      </g>,
    );
    if (burbujas && i < (burbujas.cuantas ?? n)) {
      const b = Easing.out(Easing.back(2.2))(cl((t - burbujas.en - (i / Math.min(n, burbujas.cuantas ?? n)) * 0.6) / 0.3));
      if (b > 0) {
        const bw = burbujas.texto ? 190 : tam * 0.62, bh = burbujas.texto ? 100 : tam * 0.5;
        const bx = cx + tam * 0.2, by = cy - tam * 0.85;
        els.push(
          <g key={`b${i}`} transform={`translate(${bx} ${by}) scale(${b})`}>
            <path d={`M0 0 h${bw} a${bh * 0.3} ${bh * 0.3} 0 0 1 ${bh * 0.3} ${bh * 0.3} v${bh * 0.7} a${bh * 0.3} ${bh * 0.3} 0 0 1 ${-bh * 0.3} ${bh * 0.3} H${bw * 0.3} l${-bw * 0.12} ${bh * 0.35} v${-bh * 0.35} H0 z`} fill={C.crema} stroke={T} strokeWidth={burbujas.texto ? 6 : 3} strokeLinejoin="round" transform={`translate(${-bh * 0.3} ${-bh * 0.3})`} />
            {burbujas.texto ? <text x={bw / 2 - bh * 0.3} y={bh * 0.55} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>{burbujas.texto}</text>
              : <path d={`M${bw * 0.12} ${bh * 0.5} l${bw * 0.2} ${bh * 0.24} l${bw * 0.42} ${-bh * 0.5}`} fill="none" stroke={C.turquesa} strokeWidth={Math.max(4, tam * 0.1)} strokeLinecap="round" strokeLinejoin="round" transform={`translate(${-bh * 0.3} ${-bh * 0.3})`} />}
          </g>,
        );
      }
    }
  }
  void rows;
  return <Capa en={en} hasta={hasta} bob={3}>{els}</Capa>;
};

/* ------------------------------------------------------------------ Ingredientes que caen en la olla */
/** Fichas que caen sobre (xOlla, yOlla): `barras` = dos barritas sin color; `interro` = ficha gris con "?". Desaparecen al llegar a la tapa. */
export const LluviaOllaE: React.FC<{xOlla: number; yOlla: number; items: {tipo: 'barras' | 'interro'; x: number; en: number}[]; en?: number; hasta?: number}> = ({xOlla, yOlla, items, en = 0, hasta}) => {
  const t = useT();
  const els = items.map((it, i) => {
    const u = cl((t - it.en) / 0.75);
    if (u <= 0 || u >= 1) return null;
    const e = u * u;
    const px = it.x + (xOlla - it.x) * e, py = yOlla - 300 + (300 - 40) * e;
    const o = u > 0.82 ? (1 - u) / 0.18 : 1;
    return (
      <g key={i} opacity={o} transform={`translate(${px} ${py}) rotate(${(1 - u) * (i % 2 ? 18 : -18)}) scale(${1 - 0.25 * u})`}>
        {it.tipo === 'barras' ? (
          <g>
            <rect x={-70} y={-48} width={140} height={96} rx={16} fill={C.crema} {...sw} strokeWidth={6} />
            <rect x={-52} y={-30} width={96} height={22} rx={5} fill={T} />
            <rect x={-52} y={4} width={56} height={22} rx={5} fill={C.piedra} />
          </g>
        ) : (
          <g>
            <circle r={44} fill={C.piedra} {...sw} strokeWidth={6} />
            <text y={20} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={C.crema}>?</text>
          </g>
        )}
      </g>
    );
  });
  return <Capa en={en} hasta={hasta} bob={0}>{els}</Capa>;
};

/* ------------------------------------------------------------------ Quién vota / qué harán los indecisos */
/** Persona con "?" y una flecha que reparte fichas "?" grises entre cuatro vasitos sin color. */
export const RepartoE: React.FC<{y?: number; en?: number; hasta?: number; repartoEn?: number}> = ({y = 820, en = 0, hasta, repartoEn = 1.0}) => {
  const t = useT();
  const copas = [400, 550, 700, 850];
  const reparto = [3, 4, 2, 3];
  const tokens: {cup: number; k: number}[] = [];
  reparto.forEach((n, c) => { for (let k = 0; k < n; k++) tokens.push({cup: c, k}); });
  const pe = Easing.out(Easing.back(2))(cl((t - 0.15) / 0.4));
  return (
    <Capa en={en} hasta={hasta} bob={4}>
      <g transform={`translate(0 0) scale(1)`} opacity={pe}>
        <circle cx={170} cy={y} r={92} fill={C.crema} {...sw} />
        <Persona cx={170} cy={y + 8} s={110} />
        <g transform={`translate(215 ${y - 110})`}>
          <circle r={46} fill={C.mostaza} {...sw} strokeWidth={6} />
          <text y={22} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>?</text>
        </g>
      </g>
      <path d={`M${280} ${y} H${330}`} {...sw} strokeWidth={10} opacity={cl((t - 0.5) / 0.3)} />
      <path d={`M${322} ${y - 24} L${350} ${y} L${322} ${y + 24}`} fill="none" {...sw} strokeWidth={10} opacity={cl((t - 0.5) / 0.3)} />
      {copas.map((cx, i) => {
        const e = Easing.out(Easing.back(2))(cl((t - 0.4 - i * 0.12) / 0.35));
        return (
          <g key={i} transform={`translate(${cx} ${y + 150}) scale(${e})`}>
            <path d="M-52 -80 L-40 70 H40 L52 -80" fill={C.crema} {...sw} />
          </g>
        );
      })}
      {tokens.map((tk, i) => {
        const u = cl((t - repartoEn - i * 0.13) / 0.55);
        if (u <= 0) return null;
        const cx = copas[tk.cup];
        const ex = cx + ((tk.k % 2) - 0.5) * 36, ey = y + 190 - Math.floor(tk.k / 2) * 40;
        const sx = 360, sy = y - 10;
        const e = easeIO(u);
        const px = sx + (ex - sx) * e, py = sy + (ey - sy) * e - Math.sin(u * Math.PI) * 120;
        return (
          <g key={i} transform={`translate(${px} ${py})`}>
            <circle r={19} fill={C.piedra} {...sw} strokeWidth={4} />
            <text y={9} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={26} fill={C.crema}>?</text>
          </g>
        );
      })}
    </Capa>
  );
};

/* ------------------------------------------------------------------ Ejemplo: mismos ingredientes, dos platos */
/** EJEMPLO inventado: un cesto, dos cocineros en silueta y dos platos (fotos reales, aparte) con DISTINTO reparto de los mismos ingredientes (barra apilada de 3 colores neutros). */
export const EjemploE: React.FC<{y?: number; yPlatos?: number; xs?: [number, number]; enT?: number; platosEn?: number; en?: number; hasta?: number}> = ({y = 640, yPlatos = 930, xs = [290, 770], enT = 0.3, platosEn = 2.2, en = 0, hasta}) => {
  const t = useT();
  const cols = [C.mostaza, C.turquesa, C.piedra];
  const reparto = [[0.55, 0.15, 0.3], [0.2, 0.55, 0.25]];
  const e = Easing.out(Easing.back(2))(cl((t - enT) / 0.4));
  const fichas: React.ReactNode[] = [];
  [0, 1].forEach((p) => {
    for (let i = 0; i < 9; i++) {
      const u = cl((t - (enT + 0.5) - i * 0.18 - p * 0.07) / 0.8);
      if (u <= 0) continue;
      const kind = (i % 3);
      const sx = 540, sy = y + 10;
      const ex = xs[p] + ((i * 5) % 7 - 3) * 22, ey = yPlatos + ((i * 3) % 5 - 2) * 34;
      const m = easeIO(u);
      const px = sx + (ex - sx) * m, py = sy + (ey - sy) * m - Math.sin(u * Math.PI) * 70;
      fichas.push(<circle key={`${p}-${i}`} cx={px} cy={py} r={13} fill={cols[kind]} stroke={T} strokeWidth={3} opacity={u > 0.92 ? (1 - u) / 0.08 : 1} />);
    }
  });
  const bar = (p: number) => {
    const w = 330, x0 = xs[p] - w / 2, yb = yPlatos - 226;
    const k = easeIO(cl((t - platosEn - 0.15) / 0.5));
    let acc = 0;
    return (
      <g key={p} opacity={k}>
        {reparto[p].map((r, i) => {
          const rx = x0 + acc * w; acc += r;
          return <rect key={i} x={rx} y={yb} width={r * w * k + 0.5} height={34} fill={cols[i]} stroke={T} strokeWidth={4} />;
        })}
      </g>
    );
  };
  return (
    <Capa en={en} hasta={hasta} bob={3}>
      {/* cesto */}
      <g transform={`translate(540 ${y}) scale(${e})`}>
        <path d="M-70 -30 L-52 60 H52 L70 -30 Z" fill={C.mostaza} {...sw} />
        <path d="M-60 0 H60 M-56 30 H56" {...sw} strokeWidth={4} />
        <path d="M-70 -30 Q0 -90 70 -30" fill="none" {...sw} strokeWidth={6} />
      </g>
      {/* cocineros en silueta: sin rasgos, sin color de partido */}
      {xs.map((x, p) => (
        <g key={p} opacity={e}>
          <Persona cx={x + (p ? 150 : -150)} cy={y + 8} s={120} />
          <path d={`M${x + (p ? 150 : -150) - 36} ${y - 62} q36 -46 72 0 v14 h-72 z`} fill={C.crema} {...sw} strokeWidth={5} />
        </g>
      ))}
      {xs.map((x, p) => <circle key={`o${p}`} cx={x} cy={yPlatos} r={170} fill="none" stroke={C.piedra} strokeWidth={8} strokeDasharray="6 20" strokeLinecap="round" opacity={(1 - cl((t - platosEn) / 0.2)) * e} />)}
      {fichas}
      {[0, 1].map(bar)}
    </Capa>
  );
};

/* ------------------------------------------------------------------ Calendario con texto */
/** Calendario plano con texto grande (p. ej. "2023", "29 NOV"). Se ilumina en mostaza en `luzEn`. `oscuro`: para fondo tinta. */
export const CalendarioE: React.FC<{texto: string; x?: number; y?: number; ancho?: number; luzEn?: number; oscuro?: boolean; en?: number; hasta?: number}> = ({texto, x = 540, y = 800, ancho = 400, luzEn = 0.8, oscuro = false, en = 0, hasta}) => {
  const t = useT();
  const l = easeIO(cl((t - luzEn) / 0.4));
  const h = ancho * 0.8;
  return (
    <Capa en={en} hasta={hasta} bob={5}>
      <g transform={`translate(${x - ancho / 2} ${y - h / 2})`}>
        <rect x={0} y={0} width={ancho} height={h} rx={26} fill={l > 0.5 ? C.mostaza : C.crema} stroke={oscuro ? C.crema : T} strokeWidth={8} />
        <path d={`M0 ${h * 0.28} H${ancho}`} stroke={oscuro ? C.crema : T} strokeWidth={8} />
        <rect x={0} y={0} width={ancho} height={h * 0.28} rx={26} fill={oscuro ? C.crema : T} opacity={0.95} />
        <rect x={0} y={h * 0.18} width={ancho} height={h * 0.1} fill={oscuro ? C.crema : T} />
        <rect x={ancho * 0.22} y={-26} width={16} height={52} rx={8} fill={C.piedra} stroke={T} strokeWidth={5} />
        <rect x={ancho * 0.78 - 16} y={-26} width={16} height={52} rx={8} fill={C.piedra} stroke={T} strokeWidth={5} />
        <text x={ancho / 2} y={h * 0.72} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={texto.length > 5 ? 82 : 100} fill={T}>{texto}</text>
      </g>
    </Capa>
  );
};

/* ------------------------------------------------------------------ Llave inglesa con interrogante */
export const LlaveE: React.FC<{x?: number; y?: number; tam?: number; en?: number; hasta?: number}> = ({x = 540, y = 800, tam = 200, en = 0, hasta}) => {
  const t = useT();
  const e = Easing.out(Easing.back(2))(cl((t - en) / 0.45));
  const k = tam / 200;
  return (
    <Capa en={0} hasta={hasta} bob={0}>
      <g transform={`translate(${x} ${y}) scale(${k * e}) rotate(${-32 + 8 * Math.sin(t * 3)})`}>
        <rect x={-100} y={-17} width={140} height={34} rx={17} fill={C.mostaza} {...sw} />
        <path d="M30 -52 a52 52 0 1 1 0 104 a52 52 0 1 1 0 -104 M30 -52 v34 h30 v-34 z" fill={C.mostaza} {...sw} />
        <path d="M60 -52 V-18 H30 V-52" fill={C.crema} stroke="none" />
      </g>
      <g transform={`translate(${x + 120 * k} ${y - 100 * k}) scale(${e})`}>
        <circle r={46} fill={C.crema} {...sw} strokeWidth={6} />
        <text y={22} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>?</text>
      </g>
    </Capa>
  );
};

/* ------------------------------------------------------------------ Carpeta de microdatos + cucharones */
/** Carpeta que se abre y tres cucharones que salen hacia tres ollas (recortes aparte) en `xs`. Etiqueta de 64 px "microdatos CIS". */
export const CarpetaE: React.FC<{x?: number; y?: number; etiqueta?: string; abreEn?: number; xs: number[]; yOllas: number; en?: number; hasta?: number}> = ({x = 540, y = 620, etiqueta = 'microdatos CIS', abreEn = 0.6, xs, yOllas, en = 0, hasta}) => {
  const t = useT();
  const a = easeIO(cl((t - abreEn) / 0.5));
  return (
    <Capa en={en} hasta={hasta} bob={3}>
      <g transform={`translate(${x - 140} ${y - 100})`}>
        <path d="M0 40 V10 a14 14 0 0 1 14 -14 H100 L128 24 H266 a14 14 0 0 1 14 14 V190 H0 z" fill={C.mostaza} {...sw} />
        <g style={{transformOrigin: '0px 190px'}} transform={`translate(0 190) skewX(${-12 * a}) scale(1 ${1 - 0.28 * a}) translate(0 -190)`}>
          <path d="M0 52 H280 V190 H0 z" fill={C.crema} {...sw} />
          <rect x={20} y={72} width={240} height={12} rx={6} fill={C.piedra} />
          <rect x={20} y={100} width={170} height={12} rx={6} fill={C.piedra} />
        </g>
      </g>
      <text x={x} y={y + 175} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={64} fill={T} opacity={cl((t - 0.2) / 0.3)}>{etiqueta}</text>
      {xs.map((ex, i) => {
        const u = cl((t - abreEn - 0.7 - i * 0.35) / 0.8);
        if (u <= 0) return null;
        const m = easeIO(u);
        const px = x + (ex - x) * m, py = y + 190 + (yOllas - 140 - (y + 190)) * m - Math.sin(u * Math.PI) * 60;
        return (
          <g key={i} transform={`translate(${px} ${py}) rotate(${(ex - x) / 14})`} opacity={u > 0.9 ? (1 - u) / 0.1 : 1}>
            <circle cx={0} cy={0} r={24} fill={C.piedra} {...sw} strokeWidth={5} />
            <path d="M0 -24 L0 -64" {...sw} strokeWidth={8} />
          </g>
        );
      })}
    </Capa>
  );
};

/* ------------------------------------------------------------------ Polaroid con barras + clic de cámara */
/** Destello (clic) en (x,y) y una polaroid que sale hacia abajo con tres barras neutras. */
export const PolaroidE: React.FC<{x?: number; y?: number; xFlash?: number; yFlash?: number; clicEn?: number; en?: number; hasta?: number}> = ({x = 540, y = 960, xFlash = 300, yFlash = 700, clicEn = 0.9, en = 0, hasta}) => {
  const t = useT();
  const q = t - clicEn;
  const flash = q >= 0 && q < 0.5 ? Math.max(0, 1 - q / 0.5) : 0;
  const u = easeIO(cl((q - 0.15) / 0.7));
  return (
    <>
      {flash > 0 ? <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, background: '#fff', opacity: 0.35 * flash * flash, pointerEvents: 'none'}} /> : null}
      <Capa en={en} hasta={hasta} bob={0}>
        {flash > 0 ? [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * Math.PI * 2, r1 = 70 + 80 * (1 - flash), r2 = r1 + 50;
          return <path key={i} d={`M${xFlash + Math.cos(a) * r1} ${yFlash + Math.sin(a) * r1} L${xFlash + Math.cos(a) * r2} ${yFlash + Math.sin(a) * r2}`} stroke={C.mostaza} strokeWidth={10} strokeLinecap="round" opacity={flash} />;
        }) : null}
        {u > 0 ? (
          <g transform={`translate(${x} ${y - 260 + 260 * u}) rotate(${-4 * u})`} opacity={cl(u * 3)}>
            <rect x={-140} y={-150} width={280} height={330} rx={10} fill="#FBF8F1" {...sw} strokeWidth={7} />
            <rect x={-116} y={-126} width={232} height={230} fill={C.crema} stroke={T} strokeWidth={4} />
            <rect x={-96} y={-96} width={150} height={34} fill={T} />
            <rect x={-96} y={-48} width={96} height={34} fill={C.piedra} />
            <rect x={-96} y={0} width={190} height={34} fill={C.mostaza} stroke={T} strokeWidth={3} />
            <path d="M-96 -112 V60" stroke={T} strokeWidth={4} />
          </g>
        ) : null}
      </Capa>
    </>
  );
};

/* ------------------------------------------------------------------ Lupa sobre ficha con casillas (cierre) */
export const LupaFichaE: React.FC<{x?: number; y?: number; en?: number; hasta?: number}> = ({x = 540, y = 640, en = 0.2, hasta}) => {
  const t = useT();
  const e = Easing.out(Easing.back(2))(cl((t - en) / 0.5));
  const mueve = Math.sin(t * 1.8) * 26;
  const filas = [0, 1, 2];
  return (
    <Capa en={0} hasta={hasta} bob={0}>
      <g transform={`translate(${x} ${y}) scale(${e})`}>
        <rect x={-190} y={-130} width={380} height={260} rx={22} fill="#FBF8F1" {...sw} />
        {filas.map((i) => (
          <g key={i}>
            <rect x={-150} y={-90 + i * 74} width={44} height={44} rx={8} fill={C.crema} {...sw} strokeWidth={6} />
            <path d={`M-142 ${-66 + i * 74} l12 14 l20 -26`} fill="none" stroke={C.turquesa} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={cl((t - en - 0.6 - i * 0.5) / 0.3)} />
            <rect x={-84} y={-80 + i * 74} width={190 - i * 20} height={22} rx={8} fill={C.piedra} />
          </g>
        ))}
        <g transform={`translate(${mueve} ${mueve * 0.3})`}>
          <circle cx={60} cy={20} r={80} fill="rgba(244,239,230,0.35)" {...sw} strokeWidth={13} />
          <path d="M118 78 L190 150" {...sw} strokeWidth={22} />
        </g>
      </g>
    </Capa>
  );
};

export const REGISTRO_012: Record<string, React.FC<any>> = {
  balanzaE: BalanzaE, barrasE: BarrasE, tarjetaE: TarjetaE, pasosE: PasosE, personasE: PersonasE, lluviaOllaE: LluviaOllaE, repartoE: RepartoE,
  ejemploE: EjemploE, calendarioE: CalendarioE, llaveE: LlaveE, carpetaE: CarpetaE, polaroidE: PolaroidE, lupaFichaE: LupaFichaE,
};
void interpolate;
