import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';

/** Componentes de la pieza 015 (voto exterior). Lienzo 1080x1920; `en`/`hasta` y tiempos en segundos de la ESCENA. SVG a lienzo completo con balanceo vertical de 10 px. */
const T = C.tinta;
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const cl = (x: number) => Math.min(1, Math.max(0, x));
const easeIO = (u: number) => u * u * (3 - 2 * u);

const Capa: React.FC<{en?: number; hasta?: number; children: React.ReactNode}> = ({en = 0, hasta, children}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const f = useCurrentFrame();
  const bob = 10 * Math.sin((f / 30) * 2.2);
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(p, 1) * s, transform: `translateY(${bob}px)`}}>{children}</svg>;
};

// Continentes muy simplificados (lon, lat) para un mapamundi de puntos. Sin fronteras, sin banderas.
const POLIS: [number, number][][] = [
  // Norteamérica + Centroamérica
  [[-168, 66], [-130, 70], [-95, 72], [-78, 64], [-62, 58], [-56, 48], [-70, 42], [-76, 35], [-80, 26], [-90, 29], [-97, 26], [-97, 17], [-91, 15], [-85, 11], [-80, 8], [-77, 8], [-83, 8], [-88, 13], [-96, 16], [-105, 20], [-112, 30], [-118, 32], [-124, 40], [-125, 49], [-135, 58], [-150, 60], [-165, 60]],
  // Sudamérica
  [[-77, 8], [-70, 12], [-60, 10], [-50, 0], [-35, -5], [-38, -13], [-48, -26], [-58, -38], [-65, -42], [-68, -52], [-72, -52], [-75, -40], [-71, -20], [-81, -5], [-80, 0]],
  // Groenlandia
  [[-55, 60], [-45, 60], [-20, 70], [-20, 82], [-60, 82], [-70, 76]],
  // Eurasia + Arabia
  [[-9, 37], [-9, 43], [-2, 44], [-5, 48], [2, 51], [8, 54], [10, 58], [5, 62], [15, 69], [28, 71], [40, 67], [60, 69], [80, 73], [110, 77], [140, 72], [170, 69], [180, 66], [160, 60], [155, 50], [140, 45], [130, 42], [122, 40], [122, 30], [110, 20], [108, 10], [104, 1], [100, 5], [98, 15], [92, 22], [88, 22], [80, 14], [77, 8], [72, 20], [66, 25], [58, 25], [56, 26], [50, 30], [48, 29], [51, 25], [56, 24], [59, 22], [52, 16], [44, 12], [39, 22], [34, 29], [35, 36], [27, 37], [24, 38], [22, 36], [19, 41], [16, 38], [12, 42], [8, 44], [3, 43], [-1, 38], [-5, 36]],
  // África
  [[-17, 21], [-10, 35], [10, 37], [32, 31], [34, 28], [43, 12], [51, 12], [40, -3], [40, -15], [35, -25], [20, -35], [18, -32], [12, -17], [9, -1], [9, 5], [-8, 4], [-17, 14]],
  // Australia
  [[114, -22], [130, -12], [142, -11], [153, -26], [150, -37], [140, -38], [130, -32], [115, -34]],
  // Reino Unido, Japón
  [[-5, 50], [1, 51], [0, 58], [-6, 58]],
  [[130, 32], [140, 36], [142, 44], [137, 36]],
];
const dentro = (lon: number, lat: number, poli: [number, number][]) => {
  let d = false;
  for (let i = 0, j = poli.length - 1; i < poli.length; j = i++) {
    const [xi, yi] = poli[i], [xj, yj] = poli[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) d = !d;
  }
  return d;
};
const PASO = 3.6;
const PUNTOS_TIERRA: [number, number][] = (() => {
  const r: [number, number][] = [];
  for (let lat = 78; lat >= -52; lat -= PASO) for (let lon = -170; lon <= 180; lon += PASO) if (POLIS.some((p) => dentro(lon, lat, p))) r.push([lon, lat]);
  return r;
})();

type Pt = {lon: number; lat: number; en?: number; hasta?: number; r?: number};

/**
 * Mapamundi plano de puntos (tinta), sin fronteras ni banderas. x = centro, y = centro, ancho (px).
 * puntos: puntos iluminados (mostaza con anillo). interrogante: signo "?" grande sobre un punto (sale a `fuera` s).
 * oficina: edificio en España con etiqueta "OFICINA DEL CENSO ELECTORAL" (aparece en oficina.en).
 * vuelo: sobre que vuela en arco de [lon,lat] a [lon,lat] y se queda en el destino.
 */
export const MundoX: React.FC<{
  x?: number; y?: number; ancho?: number; puntos?: Pt[];
  interrogante?: {lon: number; lat: number; tam?: number; en?: number; fuera?: number};
  oficina?: {en: number; etiqueta?: string};
  vuelo?: {de: [number, number]; a: [number, number]; en: number; dur: number; alto?: number};
  en?: number; hasta?: number;
}> = ({x = 500, y = 800, ancho = 860, puntos = [], interrogante, oficina, vuelo, en = 0, hasta}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const k = ancho / 350;
  const left = x - ancho / 2;
  const top = y - (130 * k) / 2;
  const px = (lon: number) => left + (lon + 170) * k;
  const py = (lat: number) => top + (78 - lat) * k;
  const halo = (cx: number, cy: number, r: number, ph: number) => {
    const u = ((t * 0.9 + ph) % 1);
    return <circle cx={cx} cy={cy} r={r + u * 34} fill="none" stroke={C.mostaza} strokeWidth={6} opacity={1 - u} />;
  };
  const pt = (p: Pt, i: number) => {
    if (p.en !== undefined && t < p.en) return null;
    if (p.hasta !== undefined && t > p.hasta) return null;
    const a = cl((t - (p.en ?? 0)) / 0.25);
    return (
      <g key={i}>
        {halo(px(p.lon), py(p.lat), p.r ?? 13, i * 0.3)}
        <circle cx={px(p.lon)} cy={py(p.lat)} r={(p.r ?? 13) * (0.6 + 0.4 * a)} fill={C.mostaza} {...sw} strokeWidth={5} />
      </g>
    );
  };
  let sobre: React.ReactNode = null;
  let destino: React.ReactNode = null;
  if (vuelo && t >= vuelo.en) {
    const u = easeIO(cl((t - vuelo.en) / vuelo.dur));
    const ax = px(vuelo.de[0]), ay = py(vuelo.de[1]) - 40, bx = px(vuelo.a[0]), by = py(vuelo.a[1]);
    const ex = ax + (bx - ax) * u;
    const ey = ay + (by - ay) * u - Math.sin(Math.PI * u) * (vuelo.alto ?? 150);
    const lleg = u >= 1;
    sobre = (
      <g transform={`translate(${ex} ${lleg ? ey - 34 : ey}) scale(${lleg ? 0.8 : 1 - 0.2 * u})`}>
        <rect x={-48} y={-32} width={96} height={64} rx={6} fill={C.crema} {...sw} />
        <path d="M-48 -32 L0 8 L48 -32" fill="none" {...sw} strokeWidth={5} />
      </g>
    );
    destino = lleg ? pt({lon: vuelo.a[0], lat: vuelo.a[1], r: 13}, 99) : null;
  }
  const o = oficina && t >= oficina.en ? easeIO(cl((t - oficina.en) / 0.3)) : 0;
  const sx = px(-3), sy = py(40);
  return (
    <Capa en={en} hasta={hasta}>
      {PUNTOS_TIERRA.map(([lon, lat], i) => <circle key={i} cx={px(lon)} cy={py(lat)} r={3.8} fill={T} opacity={0.88} />)}
      {puntos.map(pt)}
      {destino}
      {oficina ? (
        <g opacity={o}>
          <path d={`M${sx} ${top - 16} V${sy - 44}`} {...sw} strokeWidth={4} />
          <text x={sx} y={top - 26} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={38} fill={T}>{oficina.etiqueta ?? 'OFICINA DEL CENSO ELECTORAL'}</text>
          <g transform={`translate(${sx} ${sy})`}>
            <circle r={12} fill={C.mostaza} {...sw} strokeWidth={4} cy={14} />
            <path d="M-30 -2 L0 -30 L30 -2 Z" fill={C.crema} {...sw} strokeWidth={5} />
            <rect x={-26} y={-2} width={52} height={32} fill={C.crema} {...sw} strokeWidth={5} />
            <path d="M-12 30 V6 M0 30 V6 M12 30 V6" {...sw} strokeWidth={4} />
          </g>
        </g>
      ) : null}
      {sobre}
      {interrogante && t >= (interrogante.en ?? 0) ? (() => {
        const ie = interrogante.en ?? 0;
        const tam = interrogante.tam ?? 260;
        const a = cl((t - ie) / 0.35);
        const sal = interrogante.fuera !== undefined ? 1 - easeIO(cl((t - interrogante.fuera) / 0.3)) : 1;
        const cx = px(interrogante.lon), cy = py(interrogante.lat);
        const sc = (0.5 + 0.5 * easeIO(a) + 0.04 * Math.sin(t * 5)) * sal;
        return (
          <g opacity={Math.min(1, a * 1.5) * sal}>
            {halo(cx, cy, 13, 0)}
            <circle cx={cx} cy={cy} r={13} fill={C.mostaza} {...sw} strokeWidth={5} />
            <g transform={`translate(${cx} ${cy - 20}) scale(${sc})`}>
              <text x={0} y={0} textAnchor="middle" fontFamily={F.titular} fontSize={tam} fill={C.mostaza} stroke={T} strokeWidth={14} paintOrder="stroke" strokeLinejoin="round">?</text>
            </g>
          </g>
        );
      })() : null}
    </Capa>
  );
};

/** Casilla con texto grande (RESIDES / DE PASO). desde: -1 entra por la izquierda, 1 por la derecha, 0 sube. checkEn: tic turquesa a su derecha. */
export const CasillaX: React.FC<{texto: string; x?: number; y?: number; w?: number; h?: number; fs?: number; fill?: string; desde?: number; checkEn?: number; en?: number; hasta?: number}> = ({texto, x = 540, y = 800, w = 400, h = 110, fs = 64, fill = C.crema, desde = 0, checkEn, en = 0, hasta}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const p = Math.min(1.1, useEntrada(en));
  const dx = desde * 160 * (1 - p), dy = desde === 0 ? 80 * (1 - p) : 0;
  const c = checkEn !== undefined && t >= checkEn ? easeIO(cl((t - checkEn) / 0.3)) : 0;
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x + dx} ${y + dy})`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={26} fill={fill} {...sw} strokeWidth={8} />
        <text x={0} y={fs * 0.35} textAnchor="middle" fontFamily={F.titular} fontSize={fs} fill={T}>{texto}</text>
        {c > 0 ? (
          <g transform={`translate(${w / 2 - 20} ${-h / 2 + 10}) scale(${c})`}>
            <circle r={44} fill={C.turquesa} {...sw} strokeWidth={6} />
            <path d="M-20 2 L-6 16 L22 -14" fill="none" stroke={C.crema} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ) : null}
      </g>
    </Capa>
  );
};

/** Maleta plana (mostaza) que rebota al entrar. x,y = centro; tam = ancho. */
export const MaletaX: React.FC<{x?: number; y?: number; tam?: number; en?: number; hasta?: number}> = ({x = 540, y = 800, tam = 160, en = 0, hasta}) => {
  const p = useEntrada(en, 9);
  const s = tam / 160;
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x} ${y - (1 - Math.min(p, 1.2)) * 140}) scale(${s})`}>
        <path d="M-30 -48 V-70 Q-30 -82 -18 -82 H18 Q30 -82 30 -70 V-48" fill="none" {...sw} />
        <rect x={-80} y={-52} width={160} height={108} rx={16} fill={C.mostaza} {...sw} />
        <path d="M-80 -2 H80" {...sw} strokeWidth={5} />
        <rect x={-12} y={-12} width={24} height={20} rx={4} fill={C.crema} {...sw} strokeWidth={4} />
        <circle cx={-52} cy={64} r={8} fill={T} /><circle cx={52} cy={64} r={8} fill={T} />
      </g>
    </Capa>
  );
};

/** Formulario "SOLICITUD" que entra desde la derecha (como volviendo atrás) y se tacha con una raya mostaza en tachaEn. */
export const FormularioX: React.FC<{x?: number; y?: number; tam?: number; tachaEn?: number; en?: number; hasta?: number}> = ({x = 540, y = 800, tam = 380, tachaEn = 1.5, en = 0, hasta}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const p = easeIO(cl((t - en) / 0.7));
  const s = tam / 380;
  const u = easeIO(cl((t - tachaEn) / 0.35));
  const w = 300, h = 380;
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x + (1 - p) * 120} ${y}) rotate(${(1 - p) * 10 - 2}) scale(${s})`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={C.crema} {...sw} />
        <rect x={-w / 2 + 14} y={-h / 2 + 16} width={w - 28} height={62} rx={8} fill={T} />
        <text x={0} y={-h / 2 + 60} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={36} fill={C.crema}>SOLICITUD</text>
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${-w / 2 + 30} ${-h / 2 + 124 + i * 52} H${w / 2 - 30 - (i % 2) * 50}`} stroke={C.piedra} strokeWidth={8} strokeLinecap="round" />)}
        <rect x={-w / 2 + 30} y={h / 2 - 66} width={64} height={34} rx={6} fill="none" {...sw} strokeWidth={5} />
        {u > 0 ? (
          <>
            <path d={`M${-w / 2 - 20} ${-h / 2 + 40} L${-w / 2 - 20 + (w + 40) * u} ${-h / 2 + 40 + (h - 80) * u}`} stroke={T} strokeWidth={36} strokeLinecap="round" />
            <path d={`M${-w / 2 - 20} ${-h / 2 + 40} L${-w / 2 - 20 + (w + 40) * u} ${-h / 2 + 40 + (h - 80) * u}`} stroke={C.mostaza} strokeWidth={22} strokeLinecap="round" />
          </>
        ) : null}
      </g>
    </Capa>
  );
};

/** Sobre plano; con `clip` lleva un clip y un papel asomando. x,y = centro; tam = ancho. */
export const SobreX: React.FC<{x?: number; y?: number; tam?: number; clip?: boolean; en?: number; hasta?: number}> = ({x = 540, y = 800, tam = 320, clip = false, en = 0, hasta}) => {
  const p = Math.min(1.1, useEntrada(en));
  const s = tam / 320;
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x} ${y + (1 - p) * 120}) scale(${s})`}>
        {clip ? <rect x={-110} y={-130} width={200} height={170} rx={8} fill={C.crema} {...sw} strokeWidth={6} transform="rotate(-6)" /> : null}
        <rect x={-160} y={-100} width={320} height={210} rx={12} fill={C.mostaza} {...sw} />
        <path d="M-160 -100 L0 20 L160 -100" fill="none" {...sw} />
        <path d="M-160 110 L-30 -2 M160 110 L30 -2" fill="none" {...sw} strokeWidth={5} />
        {clip ? (
          <path d="M96 -150 V-60 Q96 -34 120 -34 Q144 -34 144 -60 V-140 Q144 -166 118 -166 Q92 -166 92 -140 V-70" fill="none" stroke={T} strokeWidth={9} strokeLinecap="round" />
        ) : null}
      </g>
    </Capa>
  );
};

type Relleno = {d0: number; d1: number; en: number; paso?: number};
/**
 * Calendario de un mes (semana de lunes a domingo). primer = columna del día 1 (0 = lunes). rellenos: barra mostaza que rellena casillas de d0 a d1 una a una.
 * grises: días en gris piedra. aro: aro mostaza con pulso sobre un día. x = centro, y = borde superior del título.
 */
export const CalendarioX: React.FC<{
  mes: string; primer: number; dias: number; x?: number; y?: number; cw?: number; ch?: number;
  rellenos?: Relleno[]; grises?: number[]; aro?: {d: number; en: number}; en?: number; hasta?: number;
}> = ({mes, primer, dias, x = 540, y = 520, cw = 98, ch = 62, rellenos = [], grises = [], aro, en = 0, hasta}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const left = x - (7 * cw) / 2;
  const cel: React.ReactNode[] = [];
  const colDe = (d: number) => (primer + d - 1) % 7;
  const filaDe = (d: number) => Math.floor((primer + d - 1) / 7);
  const top0 = y + 130;
  for (let d = 1; d <= dias; d++) {
    const cx = left + colDe(d) * cw + cw / 2, cy = top0 + filaDe(d) * ch + ch / 2;
    let fill: string = C.crema;
    let txt: string = T;
    const rel = rellenos.find((r) => d >= r.d0 && d <= r.d1);
    if (rel && t >= rel.en + (d - rel.d0) * (rel.paso ?? 0.2)) fill = C.mostaza;
    if (grises.includes(d)) { fill = C.piedra; txt = T; }
    cel.push(
      <g key={d}>
        <rect x={cx - cw / 2 + 3} y={cy - ch / 2 + 3} width={cw - 6} height={ch - 6} rx={10} fill={fill} stroke={T} strokeWidth={3} />
        <text x={cx} y={cy + 13} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={36} fill={txt}>{d}</text>
      </g>,
    );
  }
  let aroEl: React.ReactNode = null;
  if (aro && t >= aro.en) {
    const cx = left + colDe(aro.d) * cw + cw / 2, cy = top0 + filaDe(aro.d) * ch + ch / 2;
    const a = easeIO(cl((t - aro.en) / 0.3));
    const pul = 1 + 0.08 * Math.sin((t - aro.en) * 7);
    aroEl = <ellipse cx={cx} cy={cy} rx={(cw / 2 + 14) * (2 - a) * pul} ry={(ch / 2 + 14) * (2 - a) * pul} fill="none" stroke={C.mostaza} strokeWidth={10} opacity={a} />;
  }
  return (
    <Capa en={en} hasta={hasta}>
      <text x={x} y={y + 52} textAnchor="middle" fontFamily={F.titular} fontSize={64} fill={T}>{mes}</text>
      {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((l, i) => <text key={i} x={left + i * cw + cw / 2} y={y + 112} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={32} fill={C.piedra}>{l}</text>)}
      {cel}
      {aroEl}
    </Capa>
  );
};

/** Rótulo secundario grande con un sobre pequeño al lado (p. ej. "O POR CORREO"). */
export const EtiquetaSobreX: React.FC<{texto: string; x?: number; y?: number; en?: number; hasta?: number}> = ({texto, x = 150, y = 1060, en = 0, hasta}) => {
  const p = Math.min(1.1, useEntrada(en));
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x + (1 - p) * -80} ${y})`}>
        <rect x={0} y={-34} width={96} height={64} rx={8} fill={C.mostaza} {...sw} strokeWidth={6} />
        <path d="M0 -34 L48 -2 L96 -34" fill="none" {...sw} strokeWidth={5} />
        <text x={124} y={16} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={T}>{texto}</text>
      </g>
    </Capa>
  );
};

/** Texto grande de etiqueta (mono) centrado, p. ej. "24–30 OCT". */
export const FechaX: React.FC<{texto: string; x?: number; y?: number; tam?: number; en?: number; hasta?: number}> = ({texto, x = 540, y = 1060, tam = 64, en = 0, hasta}) => {
  const p = Math.min(1.1, useEntrada(en));
  const w = texto.length * tam * 0.62 + 56;
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x} ${y + (1 - p) * 40}) scale(${0.9 + 0.1 * p})`}>
        <rect x={-w / 2} y={-tam * 0.8} width={w} height={tam * 1.35} rx={16} fill={C.mostaza} {...sw} strokeWidth={6} />
        <text x={0} y={tam * 0.3} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={tam} fill={T}>{texto}</text>
      </g>
    </Capa>
  );
};

export const REGISTRO_015: Record<string, React.FC<any>> = {
  mundoX: MundoX, casillaX: CasillaX, maletaX: MaletaX, formularioX: FormularioX, sobreX: SobreX, calendarioX: CalendarioX, etiquetaSobreX: EtiquetaSobreX, fechaX: FechaX,
};
