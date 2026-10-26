import React from 'react';
import {useCurrentFrame, useVideoConfig, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';

/**
 * Componentes de la pieza 024 (disturbios de Barcelona, 24-O). Lienzo 1080x1920; `en`/`hasta`/tiempos en segundos de la ESCENA.
 * Todo es dibujo plano: ninguna cara, matrícula ni logotipo reales.
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

/** Lienzo SVG completo con balanceo vertical suave (evita quietud) y entrada/salida. */
const Capa: React.FC<{en?: number; hasta?: number; children: React.ReactNode; bob?: boolean}> = ({en = 0, hasta, children, bob = true}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const f = useCurrentFrame();
  const b = bob ? 8 * Math.sin((f / 30) * 2.2) : 0;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(p, 1) * s, transform: `translateY(${b}px)`}}>
      {children}
    </svg>
  );
};

const Llama: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M0 -46 C 14 -24 30 -14 24 10 C 20 26 -20 26 -24 10 C -28 -4 -12 -10 -6 -26 C -4 -34 -2 -40 0 -46 Z" fill={C.teja} {...sw} />
    <path d="M2 -14 C 10 -4 16 2 10 14 C 6 20 -8 20 -10 12 C -12 4 0 0 2 -14 Z" fill={C.mostaza} {...sw} strokeWidth={4} />
  </g>
);

const Busto: React.FC<{x: number; y: number; r: number; fondo?: string}> = ({x, y, r, fondo = C.piedra}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={fondo} {...sw} strokeWidth={6} />
    <clipPath id={`cb${Math.round(x)}${Math.round(y)}${Math.round(r)}`}><circle r={r - 3} /></clipPath>
    <g clipPath={`url(#cb${Math.round(x)}${Math.round(y)}${Math.round(r)})`}>
      <circle cx={0} cy={-r * 0.2} r={r * 0.3} fill={T} />
      <path d={`M${-r} ${r} Q${-r} ${r * 0.28} 0 ${r * 0.24} Q${r} ${r * 0.28} ${r} ${r} Z`} fill={T} />
    </g>
  </g>
);

/* ------------------------------------------------------------------ móvil */

/**
 * Móvil plano. `notif`: notificación genérica (nota musical plana, sin logotipo). `rompe`: segundo en que la pantalla se rompe en esquirlas.
 * `tarjetas`: {en, n} tarjetas de vídeo genéricas (gris piedra con play) que caen; `lupa`: {en, dur} una lupa pasa y deja interrogaciones.
 */
export const MovilBcn: React.FC<{x?: number; y?: number; w?: number; en?: number; hasta?: number; notif?: boolean; rompe?: number; tarjetas?: {en: number; n?: number; sinCaida?: boolean}; lupa?: {en: number; dur?: number}}> = ({
  x = 540, y = 840, w = 330, en = 0, hasta, notif, rompe, tarjetas, lupa,
}) => {
  const t = useT();
  const h = w * 1.7;
  const roto = rompe !== undefined && t >= rompe;
  const q = roto ? cl((t - (rompe as number)) / 0.7) : 0;
  const shards = [[-1, -1.2, 40, 70], [0.2, -1.5, 90, 60], [1, -1, 130, 80], [-1.2, 0.2, 50, 120], [1.3, 0.3, 120, 130], [-0.8, 1.2, 40, 200], [0.3, 1.5, 100, 210], [1, 1.2, 130, 170]];
  const nT = tarjetas?.n ?? 3;
  const lp = lupa ? cl((t - lupa.en) / (lupa.dur ?? 2)) : 0;
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x - w / 2} ${y - h / 2})`}>
        {!roto ? (
          <>
            <rect x={0} y={0} width={w} height={h} rx={44} fill={C.crema} {...sw} />
            <rect x={w / 2 - 40} y={20} width={80} height={12} rx={6} fill={T} />
          </>
        ) : (
          shards.map(([dx, dy, sx, sy], i) => (
            <polygon key={i} points={`${sx},${sy} ${sx + 70},${sy + 10} ${sx + 30},${sy + 80}`} fill={i % 2 ? C.mostaza : C.crema} {...sw} strokeWidth={5}
              transform={`translate(${dx * q * 130} ${dy * q * 130}) rotate(${dx * q * 120} ${sx + 40} ${sy + 40})`} opacity={1 - q} />
          ))
        )}
        {notif && !roto ? (
          <g transform={`translate(0 ${(1 - easeIO(cl((t - 0.1) / 0.5))) * -40})`} opacity={cl((t - 0.1) / 0.3)}>
            <rect x={22} y={90} width={w - 44} height={150} rx={22} fill={C.mostaza} {...sw} strokeWidth={6} />
            <circle cx={70} cy={165} r={30} fill={T} />
            <path d="M80 182 V140 L98 146" fill="none" stroke={C.crema} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={74} cy={184} r={8} fill={C.crema} />
            <text x={118} y={150} fontFamily={F.texto} fontWeight={700} fontSize={32} fill={T}>Sábado ·</text>
            <text x={118} y={192} fontFamily={F.texto} fontWeight={700} fontSize={32} fill={T}>plaça</text>
            <text x={118} y={228} fontFamily={F.texto} fontWeight={700} fontSize={32} fill={T}>Catalunya</text>
          </g>
        ) : null}
        {tarjetas ? Array.from({length: nT}).map((_, i) => {
          const e0 = tarjetas.en + i * 0.35;
          const u = tarjetas.sinCaida ? 1 : easeIO(cl((t - e0) / 0.55));
          const yf = 70 + i * 150;
          const yy = tarjetas.sinCaida ? yf : -260 + (yf + 260) * u;
          return (
            <g key={i} transform={`translate(${40} ${yy})`} opacity={tarjetas.sinCaida ? 1 : cl((t - e0) / 0.15)}>
              <rect width={w - 80} height={120} rx={14} fill={C.piedra} {...sw} strokeWidth={6} />
              <path d={`M${(w - 80) / 2 - 16} 36 L${(w - 80) / 2 - 16} 84 L${(w - 80) / 2 + 24} 60 Z`} fill={C.crema} stroke={T} strokeWidth={5} strokeLinejoin="round" />
              {lupa && lp * 3 > i + 0.5 ? <text x={w - 80 - 40} y={50} fontFamily={F.cifra} fontWeight={700} fontSize={56} fill={C.mostaza} stroke={T} strokeWidth={2}>?</text> : null}
            </g>
          );
        }) : null}
        {lupa ? (
          <g transform={`translate(${-30 + lp * (w + 20)} ${h * 0.35 + 60 * Math.sin(lp * Math.PI * 3)})`}>
            <circle r={52} fill="rgba(244,239,230,0.35)" {...sw} />
            <path d="M38 38 L90 90" {...sw} strokeWidth={14} />
          </g>
        ) : null}
      </g>
    </Capa>
  );
};

/* ------------------------------------------------------------------ mapa */

const PELAI = [[350, 215], [40, 180]];
const calle = (d: string) => <path d={d} fill="none" stroke={T} strokeWidth={16} strokeLinecap="round" opacity={0.55} />;

/** Pseudoaleatorio determinista. */
const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const MiniIcono: React.FC<{k: string; x: number; y: number; en: number; t: number}> = ({k, x, y, en, t}) => {
  const u = cl((t - en) / 0.4);
  if (u <= 0) return null;
  const sc = 0.5 + 0.5 * u + 0.12 * Math.sin(u * Math.PI);
  return (
    <g transform={`translate(${x} ${y}) scale(${sc * 1.0})`} opacity={u}>
      {k === 'contenedor' ? (
        <g>
          <rect x={-40} y={-20} width={80} height={52} rx={8} fill={C.piedra} {...sw} />
          <rect x={-46} y={-30} width={92} height={14} rx={6} fill={T} />
          <Llama x={0} y={-44} s={1.0} />
        </g>
      ) : null}
      {k === 'barricada' ? (
        <g>
          <path d="M-46 28 L36 -26" {...sw} strokeWidth={14} />
          <path d="M-36 -26 L46 28" {...sw} strokeWidth={14} stroke={C.teja} />
          <path d="M-52 34 H52" {...sw} strokeWidth={12} />
        </g>
      ) : null}
      {k === 'escaparate' ? (
        <g>
          <rect x={-46} y={-34} width={92} height={70} rx={6} fill={C.crema} {...sw} />
          <path d="M-6 -34 L8 -6 L-12 6 L6 36" fill="none" {...sw} strokeWidth={6} />
          <path d="M-46 -4 L-18 -2 M46 8 L20 4" fill="none" {...sw} strokeWidth={5} />
        </g>
      ) : null}
    </g>
  );
};

type MapaProps = {
  x?: number; y?: number; en?: number; hasta?: number;
  furgones?: {en: number; de: [number, number]; a: [number, number]}[];
  corredores?: {en: number; dur?: number; n?: number};
  puntos?: {en: number; dur?: number; n?: number};
  iconos?: {k: string; x: number; y: number; en: number}[];
  llamas?: {x: number; y: number; en?: number; apaga?: number}[];
  acampada?: {en: number};
  personas?: {en: number; dur: number; n?: number};
  resaltaPelai?: boolean; k?: number;
};

/**
 * Mapa plano y simplificado del centro de Barcelona (900x440): plaça de Catalunya en el centro, Passeig de Gràcia, Rambla, Pelai y Portaferrissa.
 * `x`,`y`: esquina superior izquierda en pantalla (por defecto 90, 530). Coordenadas internas 0-900 x 0-440.
 */
export const MapaBcn: React.FC<MapaProps> = ({k = 1.2, x = 90, y = 500, en = 0, hasta, furgones = [], corredores, puntos, iconos = [], llamas = [], acampada, personas, resaltaPelai}) => {
  const t = useT();
  const nP = personas?.n ?? 0;
  const pr = personas ? easeIO(cl((t - personas.en) / personas.dur)) : 0;
  const nPuntos = puntos?.n ?? 10;
  const pp = puntos ? cl((t - puntos.en) / (puntos.dur ?? 1.2)) : 0;
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x} ${y}) scale(${k})`}>
        {/* calles */}
        {calle('M500 150 L580 12')}
        {calle('M450 290 L450 420')}
        {calle('M350 215 L40 180')}
        {calle('M450 360 L120 410')}
        {resaltaPelai ? <path d="M350 215 L40 180" fill="none" stroke={C.mostaza} strokeWidth={16} strokeLinecap="round" opacity={0.9} /> : null}
        {/* plaza */}
        <rect x={350} y={150} width={200} height={140} rx={22} fill={C.piedra} fillOpacity={0.45} {...sw} />
        <text x={450} y={228} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={30} fill={T}>Pl. Catalunya</text>
        {/* nombres de las calles */}
        <text x={560} y={46} textAnchor="end" fontFamily={F.texto} fontWeight={700} fontSize={34} fill={T}>Passeig de Gràcia</text>
        <text x={470} y={420} fontFamily={F.texto} fontWeight={700} fontSize={34} fill={T}>Rambla</text>
        <text x={40} y={150} fontFamily={F.texto} fontWeight={700} fontSize={34} fill={T}>Pelai</text>
        <text x={50} y={396} fontFamily={F.texto} fontWeight={700} fontSize={34} fill={T}>Portaferrissa</text>
        {/* furgones */}
        {furgones.map((f, i) => {
          const u = easeIO(cl((t - f.en) / 1.0));
          if (t < f.en) return null;
          const fx = f.de[0] + (f.a[0] - f.de[0]) * u;
          const fy = f.de[1] + (f.a[1] - f.de[1]) * u;
          return (
            <g key={i} transform={`translate(${fx} ${fy})`}>
              <rect x={-34} y={-18} width={68} height={36} rx={8} fill={T} />
              <rect x={10} y={-12} width={20} height={14} rx={3} fill={C.crema} />
              <circle cx={-16} cy={18} r={7} fill={C.crema} stroke={T} strokeWidth={4} />
              <circle cx={16} cy={18} r={7} fill={C.crema} stroke={T} strokeWidth={4} />
              <rect x={-20} y={-24} width={30} height={7} rx={3} fill={C.teja} />
            </g>
          );
        })}
        {/* gente corriendo por Pelai (figuras planas sin rasgos) */}
        {corredores ? Array.from({length: corredores.n ?? 7}).map((_, i) => {
          const u = cl((t - corredores.en - i * 0.12) / (corredores.dur ?? 1.8));
          if (u <= 0) return null;
          const px = 330 - u * 270 - rnd(i) * 30;
          const py = 212 - (u * 34) + (rnd(i + 9) - 0.5) * 36 + 6 * Math.sin((t + i) * 14);
          return (
            <g key={i} transform={`translate(${px} ${py})`} opacity={cl(u * 5)}>
              <circle cy={-14} r={8} fill={T} />
              <path d="M-9 14 L-3 -4 L9 -4 L12 14 Z" fill={T} />
            </g>
          );
        }) : null}
        {/* puntos mostaza de incidentes */}
        {puntos ? Array.from({length: nPuntos}).map((_, i) => {
          const ang = (i / nPuntos) * Math.PI * 2 + 0.4;
          const r = 0.45 + 0.5 * rnd(i + 3);
          const u = cl(pp * nPuntos - i);
          return u > 0 ? <circle key={i} cx={450 + Math.cos(ang) * 92 * r + 4} cy={220 + Math.sin(ang) * 58 * r} r={12 * (0.6 + 0.4 * u) + 3 * Math.sin(u * Math.PI)} fill={C.mostaza} {...sw} strokeWidth={4} /> : null;
        }) : null}
        {/* personas (≈500) */}
        {personas ? Array.from({length: nP}).map((_, i) => {
          if (i > pr * nP) return null;
          const r1 = rnd(i + 1), r2 = rnd(i + 77);
          const px = 250 + r1 * 400, py = 60 + r2 * 300;
          return <circle key={i} cx={px} cy={py} r={4.5} fill={T} />;
        }) : null}
        {/* iconos de incidentes */}
        {iconos.map((ic, i) => <MiniIcono key={i} k={ic.k} x={ic.x} y={ic.y} en={ic.en} t={t} />)}
        {/* llamas */}
        {llamas.map((l, i) => {
          const e = l.en ?? 0;
          const u = cl((t - e) / 0.3);
          const ap = l.apaga === undefined ? 0 : cl((t - l.apaga) / 0.5);
          if (u <= 0) return null;
          return (
            <g key={i}>
              {ap < 1 ? <Llama x={l.x} y={l.y} s={1.0 * u * (1 - ap) + 0.001 + 0.08 * Math.sin(t * 9 + i)} o={1} /> : null}
              {ap > 0 ? <ellipse cx={l.x + 6 * ap} cy={l.y - 30 * ap} rx={30 * ap + 10} ry={16 * ap + 6} fill={C.piedra} opacity={0.75 * (1 - ap * 0.4)} /> : null}
            </g>
          );
        })}
        {/* acampada separada de las llamas */}
        {acampada ? (
          <g opacity={cl((t - acampada.en) / 0.4)}>
            <g transform="translate(600 330)">
              <path d="M-48 28 L0 -40 L48 28 Z" fill={C.turquesa} {...sw} />
              <path d="M0 -40 L0 28" {...sw} strokeWidth={5} />
              <path d="M-10 28 L0 4 L10 28" fill={C.crema} {...sw} strokeWidth={5} />
              <g transform="translate(70 -2)">
                <path d="M-6 28 V4 L22 -16 L50 4 V28 Z" fill={C.crema} {...sw} strokeWidth={6} />
                <rect x={14} y={8} width={16} height={20} fill={C.turquesa} {...sw} strokeWidth={4} />
              </g>
            </g>
            <path d="M560 130 L640 300" stroke={T} strokeWidth={6} strokeDasharray="14 12" fill="none" />
            <Llama x={560} y={110} s={1.0} o={1} />
            <Llama x={520} y={130} s={0.8} o={1} />
            <g transform={`translate(640 215) scale(${0.6 + 0.4 * easeIO(cl((t - acampada.en - 0.6) / 0.35))})`} opacity={cl((t - acampada.en - 0.6) / 0.2)}>
              <circle r={38} fill={C.crema} {...sw} />
              <path d="M-18 -18 L18 18 M18 -18 L-18 18" stroke={C.teja} strokeWidth={12} strokeLinecap="round" />
            </g>
          </g>
        ) : null}
      </g>
    </Capa>
  );
};

/* ------------------------------------------------------------------ reloj y línea de horas */

/** Reloj plano. `desde`/`a`: [h, m]; gira entre `giraEn` y `giraEn + dur` (segundos de escena). Sin giro si no hay `a`. */
export const RelojBcn: React.FC<{x?: number; y?: number; r?: number; desde: [number, number]; a?: [number, number]; giraEn?: number; dur?: number; en?: number; hasta?: number}> = ({x = 880, y = 590, r = 50, desde, a, giraEn = 0, dur = 1.2, en = 0, hasta}) => {
  const t = useT();
  const m0 = desde[0] * 60 + desde[1];
  const m1 = a ? a[0] * 60 + a[1] : m0;
  const u = easeIO(cl((t - giraEn) / dur));
  const m = m0 + (m1 - m0) * u;
  const ah = ((m / 60) % 12) * 30;
  const am = (m % 60) * 6;
  return (
    <Capa en={en} hasta={hasta} bob={false}>
      <g transform={`translate(${x} ${y})`}>
        <circle r={r} fill={C.crema} {...sw} />
        {Array.from({length: 12}).map((_, i) => <path key={i} d={`M0 ${-r + 8} v7`} stroke={T} strokeWidth={4} transform={`rotate(${i * 30})`} />)}
        <path d={`M0 0 L0 ${-r * 0.5}`} stroke={T} strokeWidth={8} strokeLinecap="round" transform={`rotate(${ah})`} />
        <path d={`M0 0 L0 ${-r * 0.78}`} stroke={C.teja} strokeWidth={5} strokeLinecap="round" transform={`rotate(${am})`} />
        <circle r={5} fill={T} />
      </g>
    </Capa>
  );
};

/** Línea de tiempo horizontal con hitos (se encienden en `ens`, segundos de escena). Etiquetas de 40 px. */
export const LineaHorasBcn: React.FC<{y?: number; hitos: string[]; ens: number[]; en?: number; hasta?: number}> = ({y = 1040, hitos, ens, en = 0, hasta}) => {
  const t = useT();
  const x0 = 130, x1 = 830;
  return (
    <Capa en={en} hasta={hasta} bob={false}>
      <path d={`M${x0 - 50} ${y} L${x1 + 50} ${y}`} stroke={T} strokeWidth={9} strokeLinecap="round" opacity={0.35} />
      {hitos.map((h, i) => {
        const cx = x0 + ((x1 - x0) * i) / (hitos.length - 1);
        const u = cl((t - ens[i]) / 0.3);
        return (
          <g key={i}>
            <circle cx={cx} cy={y} r={20 + 8 * Math.sin(u * Math.PI)} fill={u > 0 ? C.mostaza : C.crema} {...sw} />
            <text x={cx} y={y + 64} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={40} fill={T}>{h}</text>
          </g>
        );
      })}
    </Capa>
  );
};

/* ------------------------------------------------------------------ siluetas */

/**
 * Fila de 128 siluetas planas sin rasgos. `tinte`: {n, en, dur, color}: las n primeras se tiñen de forma progresiva.
 * `destacadas`: {n, en}: las n primeras en turquesa y las demás en gris piedra. `neutro`: todas con contorno sin relleno.
 * `lupa`: {en, dur} pasa por encima de la fila.
 */
export const SiluetasBcn: React.FC<{y?: number; n?: number; cols?: number; celda?: number; alto?: number; tinte?: {n: number; en: number; dur: number; color?: string}; destacadas?: {n: number; en: number}; lupa?: {en: number; dur?: number}; en?: number; hasta?: number}> = ({
  y = 510, n = 128, cols = 16, celda = 55, alto = 48, tinte, destacadas, lupa, en = 0, hasta,
}) => {
  const t = useT();
  const s = useSalida(hasta);
  const rows = Math.ceil(n / cols);
  const nT = tinte ? Math.floor(tinte.n * easeIO(cl((t - tinte.en) / tinte.dur))) : 0;
  const lp = lupa ? cl((t - lupa.en) / (lupa.dur ?? 1.1)) : 0;
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: s, transform: `translateY(${4 * Math.sin((f / 30) * 2.2)}px)`}}>
      {Array.from({length: n}).map((_, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const cx = 60 + celda / 2 + c * celda;
        const cy = y + alto / 2 + r * alto;
        const u = cl((t - en - i * 0.007) / 0.25);
        if (u <= 0) return null;
        let fill: string = C.crema;
        if (tinte && i < nT) fill = tinte.color ?? C.mostaza;
        if (destacadas && t >= destacadas.en) fill = i < destacadas.n ? C.turquesa : C.piedra;
        const gran = destacadas && t >= destacadas.en && i < destacadas.n ? 1.35 : 1;
        return (
          <g key={i} transform={`translate(${cx} ${cy}) scale(${u * gran * 1.2})`}>
            <circle cy={-13} r={9} fill={fill} {...sw} strokeWidth={3.5} />
            <path d="M-13 18 Q-13 0 0 0 Q13 0 13 18 Z" fill={fill} {...sw} strokeWidth={3.5} />
          </g>
        );
      })}
      {lupa ? (
        <g transform={`translate(${60 + lp * 880} ${y + (rows * alto) / 2 + 40 * Math.sin(lp * Math.PI * 2)})`} opacity={lp > 0 && lp < 1 ? 1 : lp >= 1 ? 0.0 : 0}>
          <circle r={70} fill="rgba(244,239,230,0.3)" {...sw} />
          <path d="M50 50 L110 110" {...sw} strokeWidth={16} />
        </g>
      ) : null}
    </svg>
  );
};

/* ------------------------------------------------------------------ tarjetas de persona */

/**
 * Tarjeta de persona: busto plano + nombre (64 px) + cargo (36 px). Mismo formato para todas. `|` parte líneas.
 * `dorso`: boca abajo hasta `girar` (segundos de escena), luego se gira (0,4 s). `alto` por defecto 300 (compacta: 200).
 */
export const TarjetaBcn: React.FC<{x?: number; y?: number; ancho?: number; alto?: number; nombre: string; cargo?: string; en?: number; hasta?: number; dorso?: boolean; girar?: number; mini?: boolean; tamNombre?: number}> = ({
  x = 60, y = 520, ancho = 880, alto = 300, nombre, cargo, en = 0, hasta, dorso, girar = 0, mini, tamNombre = 64,
}) => {
  const t = useT();
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const u = dorso ? cl((t - girar) / 0.45) : 1;
  const sx = dorso ? Math.max(0.02, Math.abs(1 - 2 * u)) : 1;
  const mostrandoDorso = dorso && u < 0.5;
  const ln = nombre.split('|');
  const lc = cargo ? cargo.split('|') : [];
  return (
    <div style={{position: 'absolute', left: x, top: y, width: ancho, height: alto, opacity: Math.min(p, 1) * s, transform: `translateY(${(1 - Math.min(p, 1)) * 40}px) scaleX(${sx})`, transformOrigin: 'center'}}>
      <div style={{position: 'absolute', inset: 0, background: mostrandoDorso ? T : '#FBF8F1', border: `7px solid ${T}`, borderRadius: 26, boxShadow: '0 12px 0 rgba(20,33,61,0.22)'}}>
        {mostrandoDorso ? (
          <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.cifra, fontWeight: 700, fontSize: alto * 0.6, color: C.mostaza}}>?</div>
        ) : (
          <>
            <svg width={mini ? 150 : 200} height={alto - 14} style={{position: 'absolute', left: 14, top: 0}}>
              <Busto x={mini ? 75 : 100} y={(alto - 14) / 2} r={mini ? 62 : 80} />
            </svg>
            <div style={{position: 'absolute', left: (mini ? 150 : 200) + 24, right: 20, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              {ln.map((l, i) => <div key={i} style={{fontFamily: F.texto, fontWeight: 700, fontSize: tamNombre, lineHeight: 1.08, color: T}}>{l}</div>)}
              {lc.map((l, i) => <div key={i} style={{fontFamily: F.texto, fontWeight: 600, fontSize: 36, lineHeight: 1.2, color: T, marginTop: i === 0 ? 8 : 0}}>{l}</div>)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ organigrama vacío, aviso, dibujos */

/** Organigrama vacío (casillas sin nombres) con una interrogación. */
export const OrgBcn: React.FC<{x?: number; y?: number; en?: number; hasta?: number}> = ({x = 540, y = 900, en = 0, hasta}) => {
  const t = useT();
  const box = (cx: number, cy: number, w: number, e: number) => {
    const u = cl((t - e) / 0.3);
    return <rect x={cx - w / 2} y={cy - 28} width={w} height={56} rx={12} fill={C.crema} {...sw} strokeWidth={6} opacity={u} strokeDasharray="12 10" />;
  };
  const q = easeIO(cl((t - 1.4) / 0.4));
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x} ${y})`}>
        <path d="M0 -50 V-20 M-230 10 H230 M-230 10 V32 M0 10 V32 M230 10 V32" stroke={T} strokeWidth={6} fill="none" />
        {box(0, -78, 200, 0.2)}
        {box(-230, 60, 200, 0.5)}
        {box(0, 60, 200, 0.7)}
        {box(230, 60, 200, 0.9)}
        <g transform={`translate(0 -78) scale(${q})`} opacity={q}>
          <text textAnchor="middle" y={26} fontFamily={F.cifra} fontWeight={700} fontSize={80} fill={C.mostaza} stroke={T} strokeWidth={4}>?</text>
        </g>
      </g>
    </Capa>
  );
};

/** Tarjeta plana que imita un aviso de la policía, recreada en la tipografía de la marca (no reproduce el cartel original). */
export const AvisoBcn: React.FC<{x?: number; y?: number; en?: number; hasta?: number}> = ({x = 60, y = 560, en = 0, hasta}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 880, height: 300, opacity: Math.min(p, 1) * s, transform: `translateY(${(1 - Math.min(p, 1)) * 60}px)`}}>
      <div style={{position: 'absolute', inset: 0, background: T, border: `7px solid ${T}`, borderRadius: 26, overflow: 'hidden', boxShadow: '0 12px 0 rgba(20,33,61,0.22)'}}>
        <div style={{height: 70, background: C.teja}} />
        <div style={{position: 'absolute', left: 36, top: 92, fontFamily: F.titular, fontSize: 84, color: C.crema, lineHeight: 1.05}}>Incidents violents</div>
        <div style={{position: 'absolute', left: 36, top: 196, fontFamily: F.texto, fontWeight: 700, fontSize: 64, color: C.mostaza}}>· Mossos</div>
      </div>
    </div>
  );
};

const DIB: Record<string, (p: number) => React.ReactNode> = {
  furgonPuerta: () => (
    <g>
      <rect x={34} y={30} width={132} height={124} rx={14} fill={C.piedra} {...sw} />
      <rect x={52} y={46} width={96} height={46} rx={8} fill={C.crema} {...sw} strokeWidth={5} />
      <path d="M34 30 L8 44 V152 L34 154" fill={C.piedra} {...sw} />
      <rect x={44} y={112} width={22} height={14} rx={3} fill={C.teja} {...sw} strokeWidth={4} />
      <rect x={134} y={112} width={22} height={14} rx={3} fill={C.teja} {...sw} strokeWidth={4} />
      <rect x={28} y={152} width={144} height={14} rx={7} fill={T} />
    </g>
  ),
  sudadera: () => (
    <g>
      <path d="M60 40 L26 70 L18 150 L48 156 L56 110 V176 H144 V110 L152 156 L182 150 L174 70 L140 40 Q100 70 60 40 Z" fill={T} {...sw} />
      <path d="M60 40 Q100 -4 140 40 Q100 76 60 40 Z" fill={T} {...sw} />
      <path d="M72 40 Q100 14 128 40 Q100 62 72 40 Z" fill="#0b1328" />
      <path d="M72 128 H128 L120 162 H80 Z" fill="#0b1328" stroke={C.crema} strokeWidth={3} />
      <path d="M92 66 V90 M108 66 V90" stroke={C.crema} strokeWidth={4} strokeLinecap="round" />
    </g>
  ),
  burbujas: (p) => (
    <g>
      <path d="M12 20 h104 a14 14 0 0 1 14 14 v62 a14 14 0 0 1 -14 14 h-70 l-24 22 v-22 h-10 a14 14 0 0 1 -14 -14 v-62 a14 14 0 0 1 14 -14z" fill={C.turquesa} {...sw} />
      <path d="M92 94 h84 a14 14 0 0 1 14 14 v50 a14 14 0 0 1 -14 14 h-12 v22 l-24 -22 h-48 a14 14 0 0 1 -14 -14 v-50 a14 14 0 0 1 14 -14z" fill={C.piedra} {...sw} />
      <g transform="translate(58 70)">
        <rect x={-16} y={-4} width={32} height={26} rx={5} fill={C.mostaza} {...sw} strokeWidth={5} />
        <path d="M-9 -4 V-14 a9 9 0 0 1 18 0 V-4" fill="none" {...sw} strokeWidth={5} />
      </g>
      <g transform="translate(132 148)">
        <rect x={-16} y={-4} width={32} height={26} rx={5} fill={C.mostaza} {...sw} strokeWidth={5} />
        <path d="M-9 -4 V-14 a9 9 0 0 1 18 0 V-4" fill="none" {...sw} strokeWidth={5} />
      </g>
    </g>
  ),
  balanzaPadres: (p) => (
    <g>
      <path d="M100 30 V176" {...sw} strokeWidth={8} />
      <path d="M62 178 H138" {...sw} strokeWidth={10} />
      <g transform={`rotate(${-8 * p} 100 40)`}>
        <path d="M24 40 H176" {...sw} strokeWidth={8} />
        <g transform="translate(24 40)">
          <path d="M0 0 L-16 50 M0 0 L16 50 M-18 50 H18" fill="none" {...sw} strokeWidth={4} />
          <circle cy={34} r={0} />
        </g>
        <g transform="translate(176 40)">
          <path d="M0 0 L-16 50 M0 0 L16 50 M-18 50 H18" fill="none" {...sw} strokeWidth={4} />
        </g>
      </g>
      {/* adulto (izquierda, más pesado) y niño (derecha) en los platos */}
      <g transform={`translate(24 ${92 + 6 * p})`}>
        <circle cy={-30} r={9} fill={T} />
        <path d="M-9 0 L-6 -20 H6 L9 0 Z" fill={T} />
      </g>
      <g transform={`translate(176 ${82 - 6 * p})`}>
        <circle cy={-14} r={6} fill={T} />
        <path d="M-6 0 L-4 -9 H4 L6 0 Z" fill={T} />
      </g>
    </g>
  ),
  factura: () => (
    <g>
      <path d="M44 14 H156 V176 L140 164 L124 176 L108 164 L92 176 L76 164 L60 176 L44 164 Z" fill={C.crema} {...sw} />
      <path d="M64 44 H136 M64 68 H136" stroke={T} strokeWidth={6} strokeLinecap="round" />
      <text x={100} y={142} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={76} fill={C.mostaza} stroke={T} strokeWidth={3}>€</text>
    </g>
  ),
  carpetaAviso: () => (
    <g>
      <path d="M16 56 V160 a8 8 0 0 0 8 8 H176 a8 8 0 0 0 8 -8 V68 a8 8 0 0 0 -8 -8 H96 L80 40 H24 a8 8 0 0 0 -8 8 Z" fill={C.mostaza} {...sw} />
      <text x={100} y={132} textAnchor="middle" fontFamily={F.titular} fontSize={36} fill={T}>AVISO</text>
    </g>
  ),
  flecha: () => (
    <g>
      <path d="M20 100 H160 M120 60 L168 100 L120 140" fill="none" {...sw} strokeWidth={14} />
    </g>
  ),
  parlament: () => (
    <g>
      <path d="M20 168 H180 V150 H20 Z" fill={C.piedra} {...sw} />
      <path d="M32 150 V84 M70 150 V84 M110 150 V84 M148 150 V84" {...sw} strokeWidth={12} />
      <path d="M22 84 L100 30 L178 84 Z" fill={C.crema} {...sw} />
      <circle cx={100} cy={62} r={9} fill={C.mostaza} {...sw} strokeWidth={4} />
    </g>
  ),
  bocadillos: () => (
    <g>
      <path d="M14 22 h108 a14 14 0 0 1 14 14 v56 a14 14 0 0 1 -14 14 h-76 l-26 22 v-22 h-6 a14 14 0 0 1 -14 -14 v-56 a14 14 0 0 1 14 -14z" fill={C.crema} {...sw} />
      <path d="M86 108 h86 a14 14 0 0 1 14 14 v44 a14 14 0 0 1 -14 14 h-6 v20 l-24 -20 h-56 a14 14 0 0 1 -14 -14 v-44 a14 14 0 0 1 14 -14z" fill={C.turquesa} {...sw} />
      <path d="M36 54 h68 M36 74 h46" stroke={T} strokeWidth={6} strokeLinecap="round" />
      <path d="M106 138 h60 M106 154 h38" stroke={C.crema} strokeWidth={6} strokeLinecap="round" />
    </g>
  ),
  puertaFurgon: () => (
    <g>
      <rect x={30} y={26} width={140} height={140} rx={14} fill={C.piedra} {...sw} />
      <rect x={30} y={26} width={70} height={140} fill={C.crema} fillOpacity={0.5} {...sw} />
      <rect x={104} y={44} width={52} height={50} rx={6} fill={C.crema} {...sw} strokeWidth={5} />
      <circle cx={118} cy={126} r={8} fill={T} />
    </g>
  ),
};

/** Dibujo plano de la pieza 024. `nombre` de DIB. */
export const DibujoBcn: React.FC<{nombre: string; x?: number; y?: number; tam?: number; en?: number; hasta?: number; anim?: number}> = ({nombre, x = 540, y = 800, tam = 260, en = 0, hasta, anim}) => {
  const t = useT();
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const p = easeIO(cl((t - (anim ?? en + 0.3)) / 1.0));
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: x - tam / 2, top: y - tam / 2 + 6 * Math.sin((f / 30) * 2.2), width: tam, height: tam, opacity: Math.min(e, 1) * s, transform: `scale(${0.6 + 0.4 * Math.min(e, 1)})`}}>
      <svg viewBox="0 0 200 200" width={tam} height={tam} style={{overflow: 'visible'}}>{DIB[nombre](p)}</svg>
    </div>
  );
};

/** Clip de vídeo (sin audio) ya recortado y pixelado, en marco con borde. Empieza a reproducirse en `en` (segundos de escena). */
export const ClipBcn: React.FC<{src: string; x?: number; y?: number; ancho?: number; alto?: number; en?: number; hasta?: number}> = ({src, x = 500, y = 800, ancho = 880, alto = 624, en = 0, hasta}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const {fps} = useVideoConfig();
  return (
    <Sequence from={Math.round(en * fps)}>
      <div style={{position: 'absolute', left: x - ancho / 2, top: y - alto / 2, width: ancho, height: alto, overflow: 'hidden', borderRadius: 30, boxSizing: 'border-box', border: `8px solid ${T}`, boxShadow: '0 14px 0 rgba(20,33,61,0.25)', background: C.piedra, opacity: Math.min(p, 1) * s}}>
        <OffthreadVideo src={staticFile(`imagenes/${src}`)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
    </Sequence>
  );
};

export const REGISTRO_024: Record<string, React.FC<any>> = {
  movilBcn: MovilBcn,
  mapaBcn: MapaBcn,
  relojBcn: RelojBcn,
  lineaHorasBcn: LineaHorasBcn,
  siluetasBcn: SiluetasBcn,
  tarjetaBcn: TarjetaBcn,
  orgBcn: OrgBcn,
  avisoBcn: AvisoBcn,
  dibujoBcn: DibujoBcn,
  clipBcn: ClipBcn,
};
