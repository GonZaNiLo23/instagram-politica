import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {useEntrada, useSalida} from './util';

/** Componentes de la pieza 022 (leones del Congreso). Lienzo 1080x1920; `en`/`hasta`/tiempos en segundos de la ESCENA. */
const T = C.tinta;
const BRONCE = '#8A5A2B';
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const cl = (x: number) => Math.min(1, Math.max(0, x));
const easeIO = (u: number) => u * u * (3 - 2 * u);
const easeOut = (u: number) => 1 - Math.pow(1 - cl(u), 3);
const useT = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return f / fps; };

const Capa: React.FC<{en?: number; hasta?: number; bob?: number; children: React.ReactNode}> = ({en = 0, hasta, bob = 8, children}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const f = useCurrentFrame();
  const b = bob * Math.sin((f / 30) * 2.2);
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(p, 1) * s, transform: `translateY(${b}px)`}}>{children}</svg>;
};

/** Texto de gancho sobre foto: pastilla tinta con texto mostaza (o crema). */
export const GanchoL: React.FC<{texto: string; y?: number; tamano?: number; color?: string; en?: number; hasta?: number}> = ({texto, y = 335, tamano = 116, color = C.mostaza, en = 0, hasta}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  return (
    <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: y, opacity: Math.min(p, 1) * s, transform: `translateY(${(1 - p) * 60}px) scale(${0.94 + 0.06 * p})`, transformOrigin: 'left top'}}>
      <span style={{fontFamily: F.titular, fontSize: tamano, lineHeight: 1.3, color, background: T, padding: '4px 22px', borderRadius: 14, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone', whiteSpace: 'nowrap'}}>{texto}</span>
    </div>
  );
};

/** Rótulo de varias partes que se van encendiendo en el orden de la voz; `grisEn` lo pasa a gris. */
export const RotuloL: React.FC<{partes: {t: string; en: number}[]; y?: number; tamano?: number; grisEn?: number; gris?: string; en?: number; hasta?: number; pastilla?: boolean; yHasta?: number; yEn?: number}> = ({partes, y = 335, tamano = 64, grisEn, gris = '#6B7489', en = 0, hasta, pastilla = false, yHasta, yEn = 0}) => {
  const t = useT();
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const g = grisEn !== undefined ? easeIO(cl((t - grisEn) / 0.35)) : 0;
  const yy = yHasta !== undefined ? y + (yHasta - y) * easeIO(cl((t - yEn) / 0.5)) : y;
  const mezcla = g > 0.5 ? gris : T;
  return (
    <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: yy, opacity: Math.min(p, 1) * s, transform: `translateX(${(1 - p) * -60}px)`}}>
      <span style={{fontFamily: F.texto, fontWeight: 700, fontSize: tamano, lineHeight: 1.2, color: mezcla, ...(pastilla ? {background: T, color: C.crema, padding: '6px 22px', borderRadius: 14} : {})}}>
        {partes.map((q, i) => <span key={i} style={{opacity: cl((t - q.en) / 0.15)}}>{q.t}</span>)}
      </span>
    </div>
  );
};

/** Degradado oscuro inferior para dar contraste a créditos y subtítulos sobre foto a pantalla completa. */
export const DegradadoL: React.FC<{desde?: number}> = ({desde = 1180}) => (
  <div style={{position: 'absolute', left: 0, top: desde, width: 1080, height: 1920 - desde, background: 'linear-gradient(to bottom, rgba(20,33,61,0) 0%, rgba(20,33,61,0.78) 45%, rgba(20,33,61,0.88) 100%)'}} />
);

const Canon: React.FC<{x: number; y: number; s?: number; ang?: number; rueda?: number; color?: string}> = ({x, y, s = 1, ang = 0, rueda = 0, color = T}) => (
  <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${s})`}>
    {/* afuste */}
    <path d="M-95 -12 L95 -12 L80 14 L-80 14 Z" fill={C.piedra} {...sw} />
    {/* tubo */}
    <path d="M-120 -52 L100 -40 L100 6 L-120 -6 Z" fill={color} stroke={T} strokeWidth={7} strokeLinejoin="round" />
    <rect x={92} y={-46} width={26} height={58} rx={8} fill={color} stroke={T} strokeWidth={7} />
    <circle cx={-118} cy={-30} r={16} fill={color} stroke={T} strokeWidth={5} />
    <path d="M-60 -44 L-60 0 M-10 -42 L-10 2" stroke={C.mostaza} strokeWidth={6} strokeLinecap="round" />
    {/* rueda */}
    <g transform={`translate(-10 38) rotate(${rueda})`}>
      <circle r={46} fill={C.crema} {...sw} />
      {[0, 45, 90, 135].map((a) => <path key={a} d={`M0 -46 L0 46`} transform={`rotate(${a})`} stroke={T} strokeWidth={6} strokeLinecap="round" />)}
      <circle r={9} fill={C.mostaza} stroke={T} strokeWidth={5} />
    </g>
  </g>
);

/** Cañón plano que entra rodando desde la izquierda y se coloca en (x, y). */
export const CanonL: React.FC<{color?: string; x?: number; y?: number; s?: number; llegaEn?: number; dur?: number; en?: number; hasta?: number}> = ({color, x = 540, y = 560, s = 1, llegaEn = 0, dur = 0.6, en = 0, hasta}) => {
  const t = useT();
  const u = cl((t - llegaEn) / dur);
  const e = easeOut(u);
  const xx = -260 + (x + 260) * e;
  const rebote = u >= 1 ? 6 * Math.exp(-(t - llegaEn - dur) * 7) * Math.sin((t - llegaEn - dur) * 30) : 0;
  const rueda = ((xx + 260) / (2 * Math.PI * 46 * s)) * 360;
  return (
    <Capa en={en} hasta={hasta} bob={0}>
      <g transform={`translate(0 ${rebote})`}><Canon x={xx} y={y} s={s} rueda={rueda} color={color} /></g>
    </Capa>
  );
};

/** Escultor plano (sin rostro) con martillo y cincel, junto a un boceto de león que se dibuja. */
export const EscultorL: React.FC<{x?: number; y?: number; en?: number; hasta?: number}> = ({x = 540, y = 900, en = 0, hasta}) => {
  const t = useT();
  const golpe = Math.sin(t * 9) * 14;
  const dib = easeIO(cl((t - 0.5) / 1.6));
  // boceto: contorno de león sentado de perfil, dibujado con trazo progresivo
  return (
    <Capa en={en} hasta={hasta}>
      {/* peana del boceto */}
      <rect x={x + 60} y={y - 40} width={380} height={40} rx={10} fill={C.piedra} {...sw} />
      <g opacity={dib}><LeonSentado x={x + 250} y={y - 40} s={2.3} fill={C.crema} trazo={T} ojos={false} grosor={3.5} /></g>
      {/* escultor sin rostro */}
      <g transform={`translate(${x - 190} ${y})`}>
        <path d="M-50 0 L-34 -190 L34 -190 L50 0 Z" fill={C.turquesa} {...sw} />
        <circle cx={0} cy={-246} r={46} fill={C.crema} {...sw} />
        <path d="M-46 -258 Q0 -318 46 -258 Z" fill={T} {...sw} />
        <path d="M-34 -170 L-90 -110" {...sw} strokeWidth={14} />
        <g transform={`translate(32 -170) rotate(${-35 + golpe * 0.6}) `}>
          <path d="M0 0 L120 0" {...sw} strokeWidth={14} />
          <rect x={96} y={-26} width={58} height={44} rx={8} fill={C.mostaza} {...sw} />
        </g>
        <path d="M-10 0 L-16 60 M10 0 L16 60" {...sw} strokeWidth={12} />
      </g>
    </Capa>
  );
};

/** Colada: dos cañones caen en un crisol, se funden y el bronce llena un molde con forma de león. */
export const ColadaL: React.FC<{x?: number; y?: number; cae1?: number; cae2?: number; vierteEn?: number; llenaDur?: number; en?: number; hasta?: number}> = ({x = 540, y = 540, cae1 = 0.6, cae2 = 1.2, vierteEn = 1.8, llenaDur = 1.6, en = 0, hasta}) => {
  const t = useT();
  const caida = (a: number) => { const u = cl((t - a) / 0.35); return u * u; };
  const c1 = caida(cae1);
  const c2 = caida(cae2);
  const fund = cl((t - cae2 - 0.3) / 0.6); // bronce fundido en el crisol
  const verter = cl((t - vierteEn) / 0.3);
  const llena = easeIO(cl((t - vierteEn - 0.2) / llenaDur));
  const my = y + 380; // base del molde
  const inclina = verter * 28;
  const cx = x - 200;
  return (
    <Capa en={en} hasta={hasta}>
      <defs>
        <clipPath id="clipMolde"><rect x={x} y={my - 390 * llena} width={320} height={390 * llena + 10} /></clipPath>
        <linearGradient id="gBronce" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor={BRONCE} /><stop offset="1" stopColor={C.mostaza} /></linearGradient>
      </defs>
      {/* molde */}
      <LeonSentado x={x + 140} y={my} s={2.6} fill={C.crema} trazo={T} ojos={false} grosor={4} />
      <g clipPath="url(#clipMolde)">
        <LeonSentado x={x + 140} y={my} s={2.6} fill="url(#gBronce)" trazo={T} ojos={false} grosor={4} />
      </g>
      {/* cañones que caen */}
      {c1 < 1 || t < cae1 + 0.4 ? <Canon x={cx - 40} y={y - 130 + c1 * 95} s={0.5} ang={-12} /> : null}
      {t >= cae2 - 0.05 && c2 < 1 ? <Canon x={cx + 40} y={y - 130 + c2 * 95} s={0.5} ang={12} /> : null}
      {/* crisol (inclinado al verter) */}
      <g transform={`translate(${cx} ${y}) rotate(${-inclina})`}>
        <path d="M-120 -40 L120 -40 L90 110 Q0 140 -90 110 Z" fill={C.piedra} {...sw} />
        <ellipse cx={0} cy={-40} rx={120} ry={20} fill={fund > 0 ? C.mostaza : T} {...sw} />
        {fund > 0 ? <ellipse cx={0} cy={-42} rx={100 * fund} ry={12 * fund} fill={BRONCE} /> : null}
        <path d="M120 -40 L160 -50 L130 -20" fill={C.piedra} {...sw} />
      </g>
      {/* chorro */}
      {verter > 0 ? <path d={`M${cx + 150} ${y - 20} Q${cx + 220} ${y + 60} ${x + 110} ${my - 390 * llena - 40}`} stroke={C.mostaza} strokeWidth={16} fill="none" strokeLinecap="round" strokeDasharray={1} pathLength={1} strokeDashoffset={0} opacity={verter * (llena < 0.98 ? 1 : 0)} /> : null}
    </Capa>
  );
};

/** Subrayado mostaza que se dibuja de (x1,y1) a (x2,y2). */
export const SubrayadoL: React.FC<{x1: number; y1: number; x2: number; y2: number; grosor?: number; dur?: number; en?: number; hasta?: number}> = ({x1, y1, x2, y2, grosor = 12, dur = 0.7, en = 0, hasta}) => {
  const t = useT();
  const u = easeIO(cl((t - en) / dur));
  const s = useSalida(hasta);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: s}}>
      <path d={`M${x1} ${y1} L${x1 + (x2 - x1) * u} ${y1 + (y2 - y1) * u}`} stroke={C.mostaza} strokeWidth={grosor} strokeLinecap="round" />
    </svg>
  );
};

/** Busto plano con bicornio (sin rostro). */
export const BustoL: React.FC<{x: number; y: number; tam?: number; color?: string; en?: number; hasta?: number}> = ({x, y, tam = 200, color = C.turquesa, en = 0, hasta}) => {
  const k = tam / 200;
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x} ${y}) scale(${k})`}>
        <path d="M-90 100 Q-80 30 -30 20 L30 20 Q80 30 90 100 Z" fill={color} {...sw} />
        <path d="M-12 20 L0 60 L12 20" fill={C.crema} {...sw} strokeWidth={5} />
        <rect x={-18} y={-10} width={36} height={32} fill={C.crema} {...sw} />
        <ellipse cx={0} cy={-40} rx={38} ry={44} fill={C.crema} {...sw} />
        {/* bicornio */}
        <path d="M-100 -62 Q-40 -120 0 -92 Q40 -120 100 -62 Q40 -84 0 -64 Q-40 -84 -100 -62 Z" fill={T} {...sw} />
        <circle cx={0} cy={-84} r={8} fill={C.mostaza} stroke={T} strokeWidth={4} />
      </g>
    </Capa>
  );
};

/** Línea de tiempo corta con un hito que se enciende en `hitoEn` y su etiqueta (64 px). */
export const HitoL: React.FC<{x1: number; x2: number; y: number; etiqueta: string; hitoEn?: number; en?: number; hasta?: number}> = ({x1, x2, y, etiqueta, hitoEn = 0.5, en = 0, hasta}) => {
  const t = useT();
  const u = easeOut(cl((t - hitoEn) / 0.4));
  const xm = (x1 + x2) / 2;
  const pulso = u >= 1 ? 1 + 0.12 * Math.sin((t - hitoEn) * 6) : 1;
  return (
    <>
      <Capa en={en} hasta={hasta}>
        <path d={`M${x1} ${y} L${x2} ${y}`} stroke={T} strokeWidth={8} strokeLinecap="round" />
        <circle cx={xm} cy={y} r={30 * u * pulso} fill={C.mostaza} {...sw} />
      </Capa>
      <div style={{position: 'absolute', left: x1 - 20, width: x2 - x1 + 40, top: y + 40, textAlign: 'center', fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: 1.2, color: T, opacity: u * useSalida(hasta), whiteSpace: 'nowrap'}}>{etiqueta}</div>
    </>
  );
};

/** Greca griega que se dibuja de izquierda a derecha. */
export const GrecaL: React.FC<{y: number; x1?: number; x2?: number; en?: number; dur?: number; hasta?: number}> = ({y, x1 = 70, x2 = 930, en = 0, dur = 1.2, hasta}) => {
  const t = useT();
  const u = easeIO(cl((t - en) / dur));
  const n = Math.floor((x2 - x1) / 60);
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = x1 + i * 60;
    d += `M${a} ${y + 40} L${a} ${y} L${a + 40} ${y} L${a + 40} ${y + 30} L${a + 14} ${y + 30} L${a + 14} ${y + 14} `;
  }
  return (
    <Capa en={0} hasta={hasta} bob={0}>
      <defs><clipPath id={`gr${y}`}><rect x={x1 - 10} y={y - 10} width={(x2 - x1 + 20) * u} height={70} /></clipPath></defs>
      <g clipPath={`url(#gr${y})`}>
        <path d={d} fill="none" stroke={T} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
      </g>
    </Capa>
  );
};

const Corredor: React.FC<{x: number; y: number; s: number; fase: number; fill?: string}> = ({x, y, s, fase, fill = T}) => {
  const a = Math.sin(fase) * 28;
  const b = -a;
  const pol = (ang: number, l: number) => [Math.sin((ang * Math.PI) / 180) * l, Math.cos((ang * Math.PI) / 180) * l];
  const [h1x, h1y] = pol(a + 20, 46);
  const [h2x, h2y] = pol(b + 20, 46);
  const [k1x, k1y] = pol(a * 1.3 + 30, 50);
  const [k2x, k2y] = pol(b * 1.3 + 30, 50);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={fill} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx={8} cy={-98} r={15} fill={fill} />
      <path d="M0 -78 L-8 -40" />
      <path d={`M-4 -40 L${h1x - 4} ${-40 + h1y} L${h1x + k1x - 4} ${-40 + h1y + k1y * 0.8}`} />
      <path d={`M-4 -40 L${h2x - 4} ${-40 + h2y} L${h2x + k2x - 4} ${-40 + h2y + k2y * 0.8}`} />
      <path d={`M0 -70 L${20 + b * 0.6} ${-52 + 10}`} />
      <path d={`M0 -70 L${-20 + a * 0.6} ${-52 + 10}`} />
    </g>
  );
};

export const LeonSentado: React.FC<{x: number; y: number; s: number; fill?: string; trazo?: string; ojos?: boolean; grosor?: number}> = ({x, y, s, fill = T, trazo = T, ojos = true, grosor = 5}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill} stroke={trazo} strokeWidth={grosor} strokeLinejoin="round" strokeLinecap="round">
    {Array.from({length: 12}).map((_, i) => { const a = (i / 12) * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * 40} cy={-96 + Math.sin(a) * 40} r={14} />; })}
    <circle cx={0} cy={-96} r={36} />
    <path d="M-40 -60 C-70 -20 -60 0 -50 0 L30 0 C60 0 70 -30 50 -62 Z" />
    <path d="M50 -10 C90 -10 100 -50 80 -70" fill="none" strokeWidth={9} />
    {ojos ? <><circle cx={80} cy={-74} r={9} fill={C.mostaza} />
    <circle cx={-12} cy={-102} r={5} fill={C.crema} stroke="none" /><circle cx={12} cy={-102} r={5} fill={C.crema} stroke="none" />
    <path d="M-10 -84 L10 -84" stroke={C.crema} strokeWidth={4} fill="none" /></> : null}
  </g>
);

/** Escena de cerámica griega: dos corredores y tres manzanas doradas; en `transEn` se convierten en dos leones sentados. */
export const CeramicaL: React.FC<{y?: number; transEn?: number; en?: number; hasta?: number}> = ({y = 960, transEn = 1.7, en = 0, hasta}) => {
  const t = useT();
  const corre = t < transEn;
  const u = cl(t / transEn);
  const xA = 300 + 400 * easeIO(u) * 0.85;
  const xH = 150 + 210 * easeIO(u) * 0.85;
  const fase = t * 14;
  const tr = easeOut(cl((t - transEn) / 0.5));
  const manz = (i: number) => {
    const a = 0.15 + i * 0.35;
    const xx = 120 + cl((t - a) / 1.4) * 800;
    return {x: xx, rot: xx * 2.2, vis: t >= a && xx < 930 && t < transEn + 0.1};
  };
  const pu = t >= transEn && t < transEn + 0.5 ? easeOut((t - transEn) / 0.5) : 0;
  return (
    <>
      <Capa en={en} hasta={hasta}>
        <rect x={70} y={y - 460} width={860} height={540} rx={26} fill="#EADFCB" {...sw} />
        <path d={`M70 ${y} L930 ${y}`} {...sw} strokeWidth={9} />
        {corre ? (
          <>
            <Corredor x={xH} y={y - 66} s={2.6} fase={fase} />
            <Corredor x={xA} y={y - 66} s={2.6} fase={fase + 1.6} />
          </>
        ) : null}
        {[0, 1, 2].map((i) => { const m = manz(i); return m.vis ? (
          <g key={i} transform={`translate(${m.x} ${y - 24}) rotate(${m.rot})`}>
            <circle r={22} fill={C.mostaza} {...sw} strokeWidth={6} />
            <path d="M0 -22 L0 -6" {...sw} strokeWidth={5} />
          </g>
        ) : null; })}
        {!corre ? (
          <>
            <g transform={`translate(${xH} ${y - 14 - (1 - tr) * 0}) scale(${tr})`}>
              <LeonSentado x={0} y={0} s={2.1} />
            </g>
            <g transform={`translate(${xA} ${y - 14}) scale(${tr})`}>
              <LeonSentado x={0} y={0} s={2.1} />
            </g>
            {pu > 0 ? [xH, xA].map((px, k) => <circle key={k} cx={px} cy={y - 150} r={40 + 200 * pu} fill="none" stroke={C.mostaza} strokeWidth={14 * (1 - pu)} />) : null}
          </>
        ) : null}
      </Capa>
    </>
  );
};

/** Vasija griega que se dibuja y se rellena de mostaza. */
export const VasijaL: React.FC<{x?: number; y?: number; alto?: number; en?: number; hasta?: number}> = ({x = 540, y = 800, alto = 300, en = 0, hasta}) => {
  const t = useT();
  const u = easeIO(cl((t - en) / 1.4));
  const k = alto / 300;
  const d = 'M-45 -150 L-45 -120 Q-100 -90 -100 -30 Q-100 60 -55 130 L55 130 Q100 60 100 -30 Q100 -90 45 -120 L45 -150 Q90 -158 90 -172 L-90 -172 Q-90 -158 -45 -150 Z';
  return (
    <Capa en={0} hasta={hasta}>
      <g transform={`translate(${x} ${y}) scale(${k})`}>
        <path d={d} fill={C.mostaza} fillOpacity={u} stroke={T} strokeWidth={8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} strokeLinejoin="round" />
        <path d="M-92 -40 L92 -40 M-90 10 L90 10" stroke={T} strokeWidth={8} strokeLinecap="round" opacity={u} />
      </g>
    </Capa>
  );
};

export const REGISTRO_022: Record<string, React.FC<any>> = {
  ganchoL: GanchoL, rotuloL: RotuloL, degradadoL: DegradadoL, canonL: CanonL, escultorL: EscultorL, coladaL: ColadaL,
  subrayadoL: SubrayadoL, bustoL: BustoL, hitoL: HitoL, grecaL: GrecaL, vasijaL: VasijaL, ceramicaL: CeramicaL,
};
