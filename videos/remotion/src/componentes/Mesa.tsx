import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';

/** Componentes de la pieza 016 (mesa electoral 29-N). Lienzo 1080x1920; `en`/`hasta`/tiempos en segundos de la ESCENA. Todo SVG a lienzo completo con balanceo vertical de 10 px. */
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

/** Persona plana sin rasgos centrada en (cx, cy) con escala s (alto total ~ 1,1 s). */
const Persona: React.FC<{cx: number; cy: number; s: number; fill?: string; trazo?: boolean}> = ({cx, cy, s, fill = T, trazo = false}) => (
  <g>
    <circle cx={cx} cy={cy - 0.26 * s} r={0.21 * s} fill={fill} {...(trazo ? sw : {})} strokeWidth={trazo ? 5 : 0} />
    <path d={`M${cx - 0.4 * s} ${cy + 0.42 * s} Q${cx - 0.4 * s} ${cy + 0.02 * s} ${cx} ${cy + 0.02 * s} Q${cx + 0.4 * s} ${cy + 0.02 * s} ${cx + 0.4 * s} ${cy + 0.42 * s} Z`} fill={fill} {...(trazo ? sw : {})} strokeWidth={trazo ? 5 : 0} />
  </g>
);

const COL_FICHAS = [C.mostaza, C.turquesa, C.piedra];

/** Bombo de sorteo plano (tinta y mostaza) que gira con fichas de electores. x,y = centro del bombo; tam = diámetro. */
export const BomboM: React.FC<{x?: number; y?: number; tam?: number; en?: number; hasta?: number; gira?: number}> = ({x = 300, y = 800, tam = 300, en = 0, hasta, gira = 1}) => {
  const f = useCurrentFrame();
  const ang = f * 3.2 * gira;
  const r = tam / 2;
  const n = 7;
  return (
    <Capa en={en} hasta={hasta}>
      <path d={`M${x - r * 0.95} ${y + r * 1.25} L${x - r * 0.2} ${y + r * 0.3} M${x + r * 0.95} ${y + r * 1.25} L${x + r * 0.2} ${y + r * 0.3} M${x - r * 1.1} ${y + r * 1.25} L${x + r * 1.1} ${y + r * 1.25}`} fill="none" {...sw} />
      <circle cx={x} cy={y} r={r} fill={C.crema} {...sw} strokeWidth={9} />
      <circle cx={x} cy={y} r={r - 14} fill="none" stroke={C.mostaza} strokeWidth={10} />
      <g transform={`rotate(${ang} ${x} ${y})`}>
        {Array.from({length: n}).map((_, k) => {
          const a = (k / n) * Math.PI * 2;
          const cx = x + Math.cos(a) * r * 0.52;
          const cy = y + Math.sin(a) * r * 0.52;
          return (
            <g key={k}>
              <circle cx={cx} cy={cy} r={r * 0.2} fill={COL_FICHAS[k % 3]} {...sw} strokeWidth={5} />
              <Persona cx={cx} cy={cy + r * 0.01} s={r * 0.26} fill={T} />
            </g>
          );
        })}
      </g>
      <g transform={`rotate(${ang * 1.5} ${x + r + 16} ${y})`}>
        <path d={`M${x + r} ${y} L${x + r + 16} ${y} L${x + r + 16 + 40} ${y}`} fill="none" {...sw} />
        <circle cx={x + r + 16 + 44} cy={y} r={12} fill={C.mostaza} {...sw} strokeWidth={5} />
      </g>
    </Capa>
  );
};

type Punto = {t: number; x: number; y: number; e: number; g?: boolean};
/** Ficha de elector que sigue una ruta de puntos [{t,x,y,e (escala),g (caída con gravedad)}]; con `texto` lleva un rótulo dentro, si no, una persona. */
export const FichaM: React.FC<{ruta: Punto[]; texto?: string; r?: number; color?: string; rebote?: boolean; hasta?: number; tamTexto?: number}> = ({ruta, texto, r = 70, color = C.mostaza, rebote = false, hasta, tamTexto}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  if (t < ruta[0].t) return null;
  let x = ruta[0].x, y = ruta[0].y, e = ruta[0].e;
  let dt = -1;
  for (let i = 0; i < ruta.length - 1; i++) {
    const a = ruta[i], b = ruta[i + 1];
    if (t >= a.t && t < b.t) {
      const u = cl((t - a.t) / (b.t - a.t));
      const k = b.g ? u * u : easeIO(u);
      x = a.x + (b.x - a.x) * k; y = a.y + (b.y - a.y) * k; e = a.e + (b.e - a.e) * k;
    }
  }
  const last = ruta[ruta.length - 1];
  if (t >= last.t) { x = last.x; y = last.y; e = last.e; dt = t - last.t; }
  const yOff = rebote && dt >= 0 ? -Math.abs(Math.sin(dt * 9)) * 40 * Math.exp(-dt * 4.5) : 0;
  const rr = r * e;
  return (
    <Capa en={-1} hasta={hasta}>
      <circle cx={x} cy={y + yOff} r={rr} fill={color} {...sw} strokeWidth={7} />
      {texto ? (
        <text x={x} y={y + yOff + rr * 0.3} textAnchor="middle" fontFamily={F.titular} fontSize={(tamTexto ?? r * 0.8) * e} fill={T}>{texto}</text>
      ) : <Persona cx={x} cy={y + yOff} s={rr * 1.05} fill={T} />}
    </Capa>
  );
};

/** Mesa plana con una urna transparente con sobres. x = centro, y = borde superior de la mesa, tam = anchura de la mesa. */
export const MesaUrnaM: React.FC<{x?: number; y?: number; tam?: number; en?: number; hasta?: number}> = ({x = 720, y = 1030, tam = 440, en = 0, hasta}) => {
  const ux = x + tam * 0.12;
  return (
    <Capa en={en} hasta={hasta}>
      <path d={`M${x - tam / 2 + 40} ${y + 30} L${x - tam / 2 + 30} ${y + 100} M${x + tam / 2 - 40} ${y + 30} L${x + tam / 2 - 30} ${y + 100}`} fill="none" {...sw} />
      <rect x={x - tam / 2} y={y} width={tam} height={34} rx={8} fill={C.mostaza} {...sw} />
      <rect x={ux - 85} y={y - 150} width={170} height={150} rx={8} fill="rgba(42,157,143,0.14)" {...sw} />
      <path d={`M${ux - 70} ${y - 8} l22 -40 l30 12 l24 -34 l28 30 l20 -14 l8 46 Z`} fill={C.crema} {...sw} strokeWidth={5} />
      <path d={`M${ux - 50} ${y - 150} h100`} {...sw} strokeWidth={14} />
    </Capa>
  );
};

/** Línea de tiempo horizontal con hitos que se encienden. hitos [{x, etiqueta, en (-1 = ya), gris}], barra: {de, a (x), en, dur}, ruptura: x donde la escala se corta (no proporcional). */
export const LineaM: React.FC<{y?: number; hitos: {x: number; etiqueta: string; en: number; gris?: boolean}[]; barra?: {de: number; a: number; en: number; dur: number}; ruptura?: number; en?: number; hasta?: number; tamEt?: number}> = ({y = 860, hitos, barra, ruptura, en = 0, hasta, tamEt = 64}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const xs = hitos.map((h) => h.x);
  const x0 = Math.min(...xs) - 70, x1 = Math.max(...xs) + 70;
  const prog = barra ? easeIO(cl((t - barra.en) / barra.dur)) : 0;
  return (
    <Capa en={en} hasta={hasta}>
      <path d={`M${x0} ${y} L${x1} ${y}`} stroke={T} strokeWidth={10} strokeLinecap="round" opacity={0.35} />
      {ruptura !== undefined ? <path d={`M${ruptura - 18} ${y - 34} l14 30 l-28 8 l14 30`} fill="none" stroke={T} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" /> : null}
      {barra ? <path d={`M${barra.de} ${y} L${barra.de + (barra.a - barra.de) * prog} ${y}`} stroke={C.mostaza} strokeWidth={20} strokeLinecap="round" /> : null}
      {hitos.map((h, i) => {
        const u = h.gris ? 0 : cl((t - h.en) / 0.35);
        const k = u === 0 ? 1 : 1 + 0.35 * Math.sin(Math.PI * Math.min(1, u)) * (h.en >= 0 ? 1 : 0);
        const vis = h.gris ? 1 : (t >= h.en ? 1 : 0.45);
        return (
          <g key={i} opacity={vis}>
            <circle cx={h.x} cy={y} r={28 * k} fill={h.gris ? C.piedra : (u > 0 ? C.mostaza : C.crema)} {...sw} />
            <text x={h.x} y={y + 100} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={tamEt} fill={h.gris ? '#5C6780' : T}>{h.etiqueta}</text>
          </g>
        );
      })}
    </Capa>
  );
};

/** Fachada plana de ayuntamiento (frontón con reloj, columnas y puerta; sin escudo). x,y = centro. */
export const AyuntM: React.FC<{x?: number; y?: number; tam?: number; en?: number; hasta?: number}> = ({x = 400, y = 800, tam = 420, en = 0, hasta}) => {
  const f = useCurrentFrame();
  const w = tam, h = tam * 0.8;
  const l = x - w / 2, t0 = y - h / 2;
  const giro = f * 2;
  return (
    <Capa en={en} hasta={hasta}>
      <path d={`M${l - 10} ${t0 + h * 0.34} L${x} ${t0} L${l + w + 10} ${t0 + h * 0.34} Z`} fill={C.mostaza} {...sw} />
      <circle cx={x} cy={t0 + h * 0.23} r={w * 0.075} fill={C.crema} {...sw} strokeWidth={5} />
      <path d={`M${x} ${t0 + h * 0.23} l0 ${-w * 0.05} M${x} ${t0 + h * 0.23} l${w * 0.04} 0`} fill="none" stroke={T} strokeWidth={5} strokeLinecap="round" transform={`rotate(${giro} ${x} ${t0 + h * 0.23})`} />
      <rect x={l} y={t0 + h * 0.34} width={w} height={h * 0.5} fill={C.crema} {...sw} />
      {[0.14, 0.38, 0.62, 0.86].map((q, i) => <rect key={i} x={l + w * q - w * 0.04} y={t0 + h * 0.38} width={w * 0.08} height={h * 0.42} fill={C.piedra} {...sw} strokeWidth={5} />)}
      <rect x={x - w * 0.07} y={t0 + h * 0.54} width={w * 0.14} height={h * 0.3} fill={T} />
      <rect x={l - 16} y={t0 + h * 0.84} width={w + 32} height={h * 0.16} fill={C.piedra} {...sw} />
    </Capa>
  );
};

/** Megáfono plano con ondas ("público"). x,y = centro. */
export const AltavozM: React.FC<{x?: number; y?: number; tam?: number; en?: number; hasta?: number}> = ({x = 780, y = 780, tam = 260, en = 0, hasta}) => {
  const f = useCurrentFrame();
  const s = tam / 200;
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x - 100 * s} ${y - 100 * s}) scale(${s})`}>
        <path d="M30 80 L96 60 L96 140 L30 120 Z" fill={C.mostaza} {...sw} />
        <path d="M96 56 L150 28 L150 172 L96 144 Z" fill={C.crema} {...sw} />
        <path d="M44 124 L56 168 L82 168 L76 136" fill="none" {...sw} />
        {[0, 1, 2].map((i) => {
          const o = 0.35 + 0.65 * Math.abs(Math.sin(f / 9 - i * 0.9));
          return <path key={i} d={`M${166 + i * 16} ${74 - i * 8} Q${190 + i * 16} 100 ${166 + i * 16} ${126 + i * 8}`} fill="none" {...sw} opacity={o} />;
        })}
      </g>
    </Capa>
  );
};

/** Buzón plano y sobre que vuela hasta él (arco). sobre: {de:[x,y], en, dur}. El sobre se mete en la ranura al llegar. */
export const CorreoM: React.FC<{x?: number; y?: number; tam?: number; sobre?: {de: [number, number]; en: number; dur: number; alto?: number}; en?: number; hasta?: number}> = ({x = 820, y = 780, tam = 260, sobre, en = 0, hasta}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const s = tam / 200;
  let ex = 0, ey = 0, eo = 0, es = 1;
  if (sobre) {
    const u = easeIO(cl((t - sobre.en) / sobre.dur));
    const tx = x, ty = y - 40 * s;
    ex = sobre.de[0] + (tx - sobre.de[0]) * u;
    ey = sobre.de[1] + (ty - sobre.de[1]) * u - Math.sin(Math.PI * u) * (sobre.alto ?? 140);
    eo = t >= sobre.en ? 1 : 0;
    es = 1 - 0.4 * u;
    if (u > 0.96) eo = 0;
  }
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x - 100 * s} ${y - 100 * s}) scale(${s})`}>
        <path d="M50 190 L150 190 L150 70 Q150 20 100 20 Q50 20 50 70 Z" fill={C.mostaza} {...sw} />
        <path d="M70 74 H130" {...sw} strokeWidth={12} />
        <rect x="76" y="116" width="48" height="36" rx="6" fill={C.crema} {...sw} strokeWidth={5} />
        <path d="M150 90 H178 V60 H150" fill="none" {...sw} />
      </g>
      {sobre ? (
        <g opacity={eo} transform={`translate(${ex} ${ey}) scale(${es})`}>
          <rect x={-48} y={-32} width={96} height={64} rx={6} fill={C.crema} {...sw} />
          <path d="M-48 -32 L0 8 L48 -32" fill="none" {...sw} strokeWidth={5} />
        </g>
      ) : null}
    </Capa>
  );
};

/**
 * Mesa con siluetas planas sin rasgos: presidente (centro) y dos vocales, con dos suplentes grises por cada uno.
 * yMesa = borde superior de la mesa. Tiempos en segundos: presEn, vocEn, suplEn (omitido = no salen), birreteEn, ausenteEn (el vocal de la derecha deja la silla vacía).
 * Las etiquetas (mono 64) van en el frontal de la mesa; "SUPLENTE" encima de los suplentes centrales.
 */
export const SiluetasM: React.FC<{yMesa?: number; presEn?: number; vocEn?: number; suplEn?: number; birreteEn?: number; ausenteEn?: number; etiquetas?: boolean; en?: number; hasta?: number}> = ({yMesa = 960, presEn = 0.2, vocEn = 0.9, suplEn, birreteEn, ausenteEn, etiquetas = true, en = 0, hasta}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const pop = (e: number | undefined) => (e === undefined ? 0 : e < 0 ? 1 : easeIO(cl((t - e) / 0.4)));
  const cxs = [160, 520, 840];
  const hy = yMesa - 170;
  const aus = ausenteEn === undefined ? 0 : easeIO(cl((t - ausenteEn) / 0.5));
  const titular = (cx: number, p: number, k: number, fill: string) => {
    const dy = (1 - p) * 70 + (k === 2 ? aus * 80 : 0);
    const op = p * (k === 2 ? 1 - aus : 1);
    return (
      <g key={'t' + k} opacity={op} transform={`translate(0 ${dy})`}>
        <circle cx={cx} cy={hy} r={46} fill={fill} />
        <path d={`M${cx - 88} ${yMesa + 2} Q${cx - 88} ${hy + 62} ${cx} ${hy + 62} Q${cx + 88} ${hy + 62} ${cx + 88} ${yMesa + 2} Z`} fill={fill} />
        {k === 1 ? <path d={`M${cx - 80} ${hy + 92} H${cx + 80} V${hy + 126} H${cx - 80} Z`} fill={C.mostaza} stroke={T} strokeWidth={5} /> : null}
      </g>
    );
  };
  const supl = (cx: number, p: number, k: number) => (
    <g key={'s' + k} opacity={p} transform={`translate(0 ${(1 - p) * 40})`}>
      <Persona cx={cx} cy={hy - 118} s={104} fill={C.piedra} trazo />
    </g>
  );
  const pPres = pop(presEn), pVoc = pop(vocEn), pSup = pop(suplEn);
  const bt = birreteEn === undefined ? 0 : easeIO(cl((t - birreteEn) / 0.45));
  const rebote = birreteEn !== undefined && t > birreteEn + 0.45 ? Math.exp(-(t - birreteEn - 0.45) * 5) * Math.abs(Math.sin((t - birreteEn - 0.45) * 12)) * 12 : 0;
  const by = hy - 62 - (1 - bt) * 130 - rebote;
  return (
    <Capa en={en} hasta={hasta}>
      {/* sillas (quedan al irse el vocal) */}
      {cxs.map((cx, k) => <rect key={'c' + k} x={cx - 62} y={hy - 30} width={124} height={yMesa - hy + 30} rx={14} fill={C.piedra} opacity={0.35} stroke={T} strokeWidth={4} strokeDasharray={k === 2 && aus > 0.5 ? '14 10' : undefined} />)}
      {suplEn !== undefined ? cxs.map((cx, k) => [supl(cx - 52, pSup, k * 2), supl(cx + 52, pSup, k * 2 + 1)]) : null}
      {titular(cxs[0], pVoc, 0, T)}
      {titular(cxs[1], pPres, 1, T)}
      {titular(cxs[2], pVoc, 2, T)}
      <rect x={100} y={yMesa} width={840} height={130} rx={12} fill={C.crema} {...sw} />
      <path d={`M130 ${yMesa + 130} V${yMesa + 190} M910 ${yMesa + 130} V${yMesa + 190}`} fill="none" {...sw} />
      {etiquetas ? (
        <g fontFamily={F.cifra} fontWeight={700} fontSize={64} textAnchor="middle" fill={T}>
          <g opacity={pVoc}><rect x={cxs[0] - 102} y={yMesa + 24} width={204} height={82} rx={14} fill={C.piedra} /><text x={cxs[0]} y={yMesa + 84}>VOCAL</text></g>
          <g opacity={pPres}><rect x={cxs[1] - 224} y={yMesa + 24} width={448} height={82} rx={14} fill={C.mostaza} /><text x={cxs[1]} y={yMesa + 84}>PRESIDENCIA</text></g>
          <g opacity={pVoc * (1 - aus)}><rect x={cxs[2] - 102} y={yMesa + 24} width={204} height={82} rx={14} fill={C.piedra} /><text x={cxs[2]} y={yMesa + 84}>VOCAL</text></g>
          {suplEn !== undefined ? <g opacity={pSup}><rect x={cxs[1] - 170} y={hy - 262} width={340} height={80} rx={14} fill={C.piedra} /><text x={cxs[1]} y={hy - 203}>SUPLENTE</text></g> : null}
        </g>
      ) : null}
      {birreteEn !== undefined ? (
        <g opacity={bt > 0 ? 1 : 0}>
          <path d={`M${cxs[1] - 82} ${by} L${cxs[1]} ${by - 34} L${cxs[1] + 82} ${by} L${cxs[1]} ${by + 34} Z`} fill={T} stroke={T} strokeWidth={5} strokeLinejoin="round" />
          <path d={`M${cxs[1] - 46} ${by + 16} V${by + 46} Q${cxs[1]} ${by + 70} ${cxs[1] + 46} ${by + 46} V${by + 16}`} fill={T} />
          <path d={`M${cxs[1] + 82} ${by} V${by + 50}`} stroke={C.mostaza} strokeWidth={8} strokeLinecap="round" />
          <circle cx={cxs[1] + 82} cy={by + 56} r={9} fill={C.mostaza} />
        </g>
      ) : null}
    </Capa>
  );
};

/** Barrera de edad con tope en "70": las fichas de la izquierda (turquesa) pasan; las grises (de más edad) se quedan bloqueadas con aspa debajo. */
export const ReglaEdadM: React.FC<{y?: number; xTope?: number; en?: number; hasta?: number; t0?: number}> = ({y = 900, xTope = 600, en = 0, hasta, t0 = 0.3}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const run = (ini: number, fin: number, delay: number, dur: number) => {
    const u = easeIO(cl((t - t0 - delay) / dur));
    return ini + (fin - ini) * u;
  };
  const fy = y - 52;
  const pasan = [0, 1, 2].map((k) => ({x: run(350, 700 + k * 80, k * 0.15, 0.7)}));
  const bloq = [0, 1].map((k) => {
    const u = easeIO(cl((t - t0 - 0.55 - k * 0.15) / 0.5));
    const x = 350 + (xTope - 62 - k * 96 - 350) * u;
    return {x, rebota: u >= 1};
  });
  const ua = easeIO(cl((t - t0 - 1.15) / 0.3));
  return (
    <Capa en={en} hasta={hasta}>
      <path d={`M60 ${y} H940`} fill="none" {...sw} opacity={0.4} />
      <path d={`M${xTope} ${y} V${y - 260}`} fill="none" {...sw} strokeWidth={14} />
      <rect x={xTope - 12} y={y - 300} width={24} height={44} fill={C.mostaza} {...sw} strokeWidth={5} />
      <text x={xTope} y={y - 330} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={150} fill={T}>70</text>
      {pasan.map((p, k) => (
        <g key={'p' + k}>
          <circle cx={p.x} cy={fy} r={46} fill={C.turquesa} {...sw} strokeWidth={6} />
          <Persona cx={p.x} cy={fy + 2} s={56} fill={C.crema} />
        </g>
      ))}
      {bloq.map((p, k) => (
        <g key={'b' + k}>
          <circle cx={p.x} cy={fy} r={46} fill={C.piedra} {...sw} strokeWidth={6} />
          <Persona cx={p.x} cy={fy + 2} s={56} fill={T} />
          <g opacity={ua} transform={`translate(${p.x} ${y + 62})`}>
            <path d="M-26 -26 L26 26 M26 -26 L-26 26" stroke={C.teja} strokeWidth={14} strokeLinecap="round" />
          </g>
        </g>
      ))}
    </Capa>
  );
};

/** Lápiz y libro abierto con check turquesa al lado. x,y = centro del libro. */
export const LapizLibroM: React.FC<{x?: number; y?: number; tam?: number; checkEn?: number; en?: number; hasta?: number}> = ({x = 400, y = 800, tam = 320, checkEn = 0.9, en = 0, hasta}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const s = tam / 300;
  const ck = easeIO(cl((t - checkEn) / 0.35));
  const esc = ck === 0 ? 0 : 1 + 0.2 * Math.sin(Math.PI * ck);
  const esc1 = Math.max(0.01, esc);
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x - 150 * s} ${y - 100 * s}) scale(${s})`}>
        <path d="M20 40 Q90 20 150 60 Q210 20 280 40 V170 Q210 150 150 190 Q90 150 20 170 Z" fill={C.crema} {...sw} />
        <path d="M150 60 V190" fill="none" {...sw} />
        <path d="M44 84 Q86 74 126 96 M44 114 Q86 104 126 126 M174 96 Q214 74 256 84 M174 126 Q214 104 256 114" fill="none" stroke={T} strokeWidth={5} strokeLinecap="round" opacity={0.6} />
        <g transform="rotate(-38 220 120)">
          <rect x="196" y="-30" width="34" height="190" rx="6" fill={C.mostaza} {...sw} />
          <path d="M196 160 L213 196 L230 160 Z" fill={C.crema} {...sw} />
          <rect x="196" y="-30" width="34" height="30" rx="6" fill={C.piedra} {...sw} />
        </g>
      </g>
      <g transform={`translate(${x + 230 * s} ${y}) scale(${esc1})`} opacity={ck}>
        <circle r={62} fill={C.turquesa} {...sw} />
        <path d="M-28 4 L-8 26 L30 -22" fill="none" stroke={C.crema} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Capa>
  );
};

/** Cuenta atrás de casillas de calendario numeradas (7..1) que se tachan una a una: `tachan` = segundos de cada tachado. */
export const CasillasM: React.FC<{y?: number; n?: number; tachan: number[]; en?: number; hasta?: number}> = ({y = 820, n = 7, tachan, en = 0, hasta}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const w = 100, g = 10;
  const x0 = 60 + (880 - (n * w + (n - 1) * g)) / 2 + 10;
  return (
    <Capa en={en} hasta={hasta}>
      {Array.from({length: n}).map((_, i) => {
        const u = easeIO(cl((t - (tachan[i] ?? 99)) / 0.18));
        const x = x0 + i * (w + g);
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={130} rx={14} fill={u > 0.5 ? C.piedra : C.crema} {...sw} fillOpacity={u > 0.5 ? 0.5 : 1} />
            <rect x={x} y={y} width={w} height={34} rx={14} fill={C.mostaza} {...sw} />
            <text x={x + w / 2} y={y + 106} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>{n - i}</text>
            {u > 0 ? <path d={`M${x + 8} ${y + 40} L${x + 8 + (w - 16) * u} ${y + 40 + 84 * u}`} stroke={T} strokeWidth={9} strokeLinecap="round" /> : null}
          </g>
        );
      })}
    </Capa>
  );
};

/** Documento plano con clip. x,y = centro. */
export const DocumentoM: React.FC<{x?: number; y?: number; tam?: number; en?: number; hasta?: number}> = ({x = 300, y = 800, tam = 380, en = 0, hasta}) => {
  const w = tam * 0.78, h = tam;
  return (
    <Capa en={en} hasta={hasta}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={14} fill={C.crema} {...sw} />
      {[0.22, 0.36, 0.5, 0.64, 0.78].map((q, i) => <path key={i} d={`M${x - w * 0.34} ${y - h / 2 + h * q} H${x + w * (i === 4 ? 0.1 : 0.34)}`} stroke={T} strokeWidth={7} strokeLinecap="round" opacity={0.5} />)}
      <path d={`M${x + w * 0.1} ${y - h / 2 - 20} v70 q0 18 -18 18 q-18 0 -18 -18 v-60`} fill="none" stroke={T} strokeWidth={9} strokeLinecap="round" transform={`translate(${w * 0.05} 0)`} />
    </Capa>
  );
};

/** Botón "RENUNCIAR" (64 px) con check turquesa a su derecha. x,y = centro del botón. */
export const BotonM: React.FC<{texto?: string; x?: number; y?: number; checkEn?: number; en?: number; hasta?: number}> = ({texto = 'RENUNCIAR', x = 480, y = 1000, checkEn = 0.7, en = 0, hasta}) => {
  const p = useEntrada(en);
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const s = useSalida(hasta);
  const ck = easeIO(cl((t - checkEn) / 0.35));
  const w = texto.length * 46 + 60;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(p, 1) * s}}>
      <g transform={`translate(${x} ${y + (1 - Math.min(p, 1.1)) * 60})`}>
        <rect x={-w / 2} y={-52} width={w} height={104} rx={26} fill={C.mostaza} {...sw} strokeWidth={9} />
        <text x={0} y={22} textAnchor="middle" fontFamily={F.titular} fontSize={64} fill={T}>{texto}</text>
        <g transform={`translate(${w / 2 + 86} 0) scale(${Math.max(0.01, ck * (1 + 0.2 * Math.sin(Math.PI * ck)))})`} opacity={ck}>
          <circle r={56} fill={C.turquesa} {...sw} />
          <path d="M-26 4 L-8 24 L28 -20" fill="none" stroke={C.crema} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
};

/** Reloj de pared plano con manecillas que siguen puntos [{t, h (hora decimal)}], lectura digital y franja horaria 0-24 h (votación 9:00-20:00 en mostaza). */
export const RelojM: React.FC<{x?: number; y?: number; tam?: number; puntos: {t: number; h: number}[]; franja?: boolean; yFranja?: number; en?: number; hasta?: number; tamDigital?: number; xDigital?: number}> = ({x = 300, y = 800, tam = 340, puntos, franja = true, yFranja = 1040, en = 0, hasta, tamDigital = 120, xDigital = 750}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  let h = puntos[0].h;
  let txt = puntos[0].h;
  for (let i = 0; i < puntos.length; i++) {
    const a = puntos[i];
    if (t >= a.t) { txt = a.h; h = a.h; }
    if (i < puntos.length - 1 && t >= a.t && t < puntos[i + 1].t) {
      const b = puntos[i + 1];
      const u = cl((t - a.t - 0.0) / 0.0001);
      void u;
    }
  }
  // transición: cada punto se alcanza en 0,35 s desde su `t` (con muelle de ida)
  for (let i = 1; i < puntos.length; i++) {
    const a = puntos[i - 1], b = puntos[i];
    if (t >= b.t - 0.35 && t < b.t) h = a.h + (b.h - a.h) * easeIO(cl((t - (b.t - 0.35)) / 0.35));
  }
  const r = tam / 2;
  const ha = ((h % 12) / 12) * 360;
  const ma = (h % 1) * 360;
  const hh = Math.floor(txt);
  const mm = Math.round((txt % 1) * 60);
  const fx0 = 100, fw = 800;
  const px = (hh2: number) => fx0 + (fw * hh2) / 24;
  return (
    <Capa en={en} hasta={hasta}>
      <circle cx={x} cy={y} r={r} fill={C.crema} {...sw} strokeWidth={10} />
      {Array.from({length: 12}).map((_, k) => <path key={k} d={`M${x + Math.sin((k * Math.PI) / 6) * r * 0.82} ${y - Math.cos((k * Math.PI) / 6) * r * 0.82} L${x + Math.sin((k * Math.PI) / 6) * r * 0.92} ${y - Math.cos((k * Math.PI) / 6) * r * 0.92}`} stroke={T} strokeWidth={6} strokeLinecap="round" />)}
      <path d={`M${x} ${y} L${x} ${y - r * 0.5}`} stroke={T} strokeWidth={14} strokeLinecap="round" transform={`rotate(${ha} ${x} ${y})`} />
      <path d={`M${x} ${y} L${x} ${y - r * 0.78}`} stroke={C.mostaza} strokeWidth={10} strokeLinecap="round" transform={`rotate(${ma} ${x} ${y})`} />
      <circle cx={x} cy={y} r={12} fill={T} />
      <text x={xDigital} y={y + tamDigital * 0.35} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={tamDigital} fill={T}>{`${hh}:${mm.toString().padStart(2, '0')}`}</text>
      {franja ? (
        <g>
          <rect x={fx0} y={yFranja} width={fw} height={40} rx={20} fill={C.piedra} fillOpacity={0.35} {...sw} strokeWidth={5} />
          <rect x={px(9)} y={yFranja} width={px(20) - px(9)} height={40} fill={C.mostaza} {...sw} strokeWidth={5} />
          <path d={`M${px(h)} ${yFranja - 12} l-18 -34 h36 Z`} fill={T} />
        </g>
      ) : null}
    </Capa>
  );
};

/** Billete plano mostaza con la cifra (cifra fija, JetBrains Mono). `sube`: px desde los que sube con muelle. `orbita`: un reloj gira rápido alrededor. x,y = centro. */
export const BilleteM: React.FC<{texto?: string; x?: number; y?: number; tam?: number; sube?: number; orbita?: boolean; en?: number; hasta?: number}> = ({texto = '75 €', x = 540, y = 800, tam = 480, sube = 0, orbita = false, en = 0, hasta}) => {
  const f = useCurrentFrame();
  const p = useEntrada(en, 9);
  const w = tam, h = tam * 0.5;
  const oy = (1 - Math.min(p, 1.15)) * sube;
  const a = (f / 30) * 5.2;
  const ox = x + Math.cos(a) * Math.min(300, 960 - 90 - x), oyy = y + Math.sin(a) * 215;
  const gh = f * 24;
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(0 ${oy})`}>
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={22} fill={C.mostaza} {...sw} strokeWidth={9} />
        <rect x={x - w / 2 + 20} y={y - h / 2 + 20} width={w - 40} height={h - 40} rx={14} fill="none" stroke={T} strokeWidth={4} strokeDasharray="4 10" />
        <text x={x} y={y + tam * 0.095} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={tam * 0.27} fill={T}>{texto}</text>
      </g>
      {orbita ? (
        <g>
          <circle cx={ox} cy={oyy} r={74} fill={C.crema} {...sw} strokeWidth={8} />
          <path d={`M${ox} ${oyy} V${oyy - 52}`} stroke={C.mostaza} strokeWidth={10} strokeLinecap="round" transform={`rotate(${gh} ${ox} ${oyy})`} />
          <path d={`M${ox} ${oyy} V${oyy - 34}`} stroke={T} strokeWidth={10} strokeLinecap="round" transform={`rotate(${gh / 12} ${ox} ${oyy})`} />
          <circle cx={ox} cy={oyy} r={8} fill={T} />
        </g>
      ) : null}
    </Capa>
  );
};

/** Calendario "LUNES / 30 NOV" y barra de jornada con `n` bloques de una hora que se apagan uno a uno (`apagan`: segundos). */
export const JornadaM: React.FC<{x?: number; y?: number; yBarra?: number; n?: number; apagan: number[]; en?: number; hasta?: number}> = ({x = 540, y = 760, yBarra = 990, n = 5, apagan, en = 0, hasta}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const bw = 140, g = 10;
  const x0 = x - (n * bw + (n - 1) * g) / 2 - 10;
  return (
    <Capa en={en} hasta={hasta}>
      <rect x={x - 230} y={y - 180} width={460} height={360} rx={26} fill={C.crema} {...sw} strokeWidth={9} />
      <path d={`M${x - 230} ${y - 80} H${x + 230}`} {...sw} strokeWidth={7} />
      <path d={`M${x - 230 + 26} ${y - 180} H${x + 230 - 26} Q${x + 230} ${y - 180} ${x + 230} ${y - 154} V${y - 80} H${x - 230} V${y - 154} Q${x - 230} ${y - 180} ${x - 204} ${y - 180} Z`} fill={C.mostaza} stroke={T} strokeWidth={7} />
      <text x={x} y={y - 100} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>LUNES</text>
      <text x={x} y={y + 110} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={130} fill={T}>30 NOV</text>
      {Array.from({length: n}).map((_, i) => {
        const u = easeIO(cl((t - (apagan[i] ?? 99)) / 0.2));
        return <rect key={i} x={x0 + i * (bw + g) + 10} y={yBarra} width={bw} height={84} rx={14} fill={u > 0.5 ? C.piedra : C.mostaza} fillOpacity={u > 0.5 ? 0.3 : 1} {...sw} strokeDasharray={u > 0.5 ? '10 10' : undefined} />;
      })}
    </Capa>
  );
};

/** Balanza plana en equilibrio con dos platillos (etiquetas de 64 px en una o dos líneas) unidos por una "O" grande en mostaza. Cae desde poco arriba con rebote. */
export const BalanzaM: React.FC<{y?: number; izq: string[]; der: string[]; en?: number; hasta?: number; oEn?: number}> = ({y = 640, izq, der, en = 0, hasta, oEn = 0.9}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const p = useEntrada(en, 8);
  const sway = Math.sin(t * 2.4) * 1.6;
  const o = easeIO(cl((t - oEn) / 0.35));
  const cx = 520;
  const yy = y + (1 - Math.min(p, 1.2)) * -70;
  const pan = (px: number, lineas: string[]) => (
    <g>
      <path d={`M${px - 150} ${yy + 10} L${px} ${yy + 250} L${px + 150} ${yy + 10}`} fill="none" {...sw} strokeWidth={6} />
      <rect x={px - 175} y={yy + 250} width={350} height={lineas.length * 70 + 40} rx={20} fill={C.crema} {...sw} strokeWidth={8} />
      {lineas.map((l, i) => <text key={i} x={px} y={yy + 250 + 76 + i * 70} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>{l}</text>)}
    </g>
  );
  return (
    <Capa en={en} hasta={hasta}>
      <path d={`M${cx} ${yy} V${yy + 480}`} {...sw} strokeWidth={14} />
      <path d={`M${cx - 130} ${yy + 480} H${cx + 130}`} {...sw} strokeWidth={14} />
      <g transform={`rotate(${sway} ${cx} ${yy})`}>
        <path d={`M${cx - 330} ${yy} H${cx + 330}`} {...sw} strokeWidth={14} />
        {pan(cx - 330 + 0, izq)}
        {pan(cx + 330 - 0, der)}
      </g>
      <g opacity={o} transform={`translate(${cx} ${yy}) scale(${Math.max(0.01, o)})`}>
        <circle r={62} fill={C.mostaza} {...sw} strokeWidth={9} />
        <text y={32} textAnchor="middle" fontFamily={F.titular} fontSize={88} fill={T}>O</text>
      </g>
    </Capa>
  );
};

export const REGISTRO_016: Record<string, React.FC<any>> = {
  bomboM: BomboM, fichaM: FichaM, mesaUrnaM: MesaUrnaM, lineaM: LineaM, ayuntM: AyuntM, altavozM: AltavozM, correoM: CorreoM, siluetasM: SiluetasM,
  reglaEdadM: ReglaEdadM, lapizLibroM: LapizLibroM, casillasM: CasillasM, documentoM: DocumentoM, botonM: BotonM, relojM: RelojM, billeteM: BilleteM,
  jornadaM: JornadaM, balanzaM: BalanzaM,
};
