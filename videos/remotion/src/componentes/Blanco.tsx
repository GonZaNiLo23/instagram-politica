import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';

/**
 * Componentes de la pieza 018 (voto en blanco). Prefijo `b`. Lienzo 1080x1920; `en`/`hasta`/tiempos en segundos de la ESCENA.
 * Partidos del ejemplo inventados y neutros: Círculo (tinta), Triángulo (turquesa), Cuadrado (gris piedra).
 */
const T = C.tinta;
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const GRIS_CLARO = '#C9CFDA';
const cl = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const easeIO = (u: number) => u * u * (3 - 2 * u);
const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};
const ramp = (t: number, a: number, b: number, e: (x: number) => number = easeIO) => e(cl((t - a) / (b - a)));
const pop = (t: number, a: number, d = 0.4) => interpolate(t, [a, a + d], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2.2))});

const Capa: React.FC<{en?: number; hasta?: number; bob?: number; children: React.ReactNode}> = ({en = 0, hasta, bob = 8, children}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const f = useCurrentFrame();
  const dy = bob * Math.sin((f / 30) * 2.2);
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(p, 1) * s, transform: `translateY(${dy}px)`}}>{children}</svg>;
};

/** Sobre plano. `abierto`: solapa arriba y el interior vacío a la vista. */
const Sobre: React.FC<{x: number; y: number; w?: number; abierto?: boolean; rot?: number; op?: number; escala?: number}> = ({x, y, w = 190, abierto = false, rot = 0, op = 1, escala = 1}) => {
  const h = w * 0.68;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${escala})`} opacity={op}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={abierto ? '#E3E7EE' : C.crema} {...sw} />
      {abierto ? (
        <>
          <path d={`M${-w / 2} ${-h / 2} L${-w / 2} ${h / 2} M${w / 2} ${-h / 2} L${w / 2} ${h / 2}`} {...sw} />
          <path d={`M${-w / 2} ${-h / 2} L0 ${-h * 1.0} L${w / 2} ${-h / 2} Z`} fill={C.crema} {...sw} />
        </>
      ) : (
        <path d={`M${-w / 2 + 3} ${-h / 2 + 3} L0 ${h * 0.1} L${w / 2 - 3} ${-h / 2 + 3}`} fill="none" {...sw} />
      )}
    </g>
  );
};

const Check: React.FC<{x: number; y: number; r?: number; k?: number}> = ({x, y, r = 40, k = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <circle r={r} fill={C.turquesa} {...sw} />
    <path d={`M${-r * 0.45} ${r * 0.02} L${-r * 0.1} ${r * 0.38} L${r * 0.5} ${-r * 0.36}`} fill="none" stroke={C.crema} strokeWidth={r * 0.2} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const Aspa: React.FC<{x: number; y: number; r?: number; color?: string; k?: number; grosor?: number}> = ({x, y, r = 60, color = T, k = 1, grosor = 16}) => (
  <g transform={`translate(${x} ${y}) scale(${k})`} stroke={color} strokeWidth={grosor} strokeLinecap="round">
    <path d={`M${-r} ${-r} L${r} ${r} M${r} ${-r} L${-r} ${r}`} fill="none" />
  </g>
);

const Urna: React.FC<{x: number; y: number; w?: number; h?: number; lit?: number; sobres?: number}> = ({x, y, w = 220, h = 190, lit = 0, sobres = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${1 + 0.06 * lit})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={lit > 0.02 ? `rgba(242,177,52,${0.12 + 0.3 * lit})` : 'rgba(42,157,143,0.10)'} {...sw} stroke={lit > 0.02 ? T : T} />
    <rect x={-38} y={-h / 2 - 9} width={76} height={18} rx={9} fill={T} />
    {sobres > 0 ? (
      <g opacity={Math.min(1, sobres)}>
        <rect x={-w * 0.32} y={h * 0.18} width={w * 0.34} height={h * 0.22} rx={5} fill={C.crema} {...sw} strokeWidth={4} transform="rotate(-8)" />
        <rect x={-w * 0.02} y={h * 0.2} width={w * 0.34} height={h * 0.22} rx={5} fill={C.crema} {...sw} strokeWidth={4} transform="rotate(6)" />
      </g>
    ) : null}
  </g>
);

// ---------------------------------------------------------------- Gancho / bucle: sobre, flecha y podio
const Podio: React.FC<{op?: number}> = ({op = 1}) => (
  <g opacity={op}>
    <rect x={470} y={1000} width={180} height={100} fill={C.piedra} {...sw} />
    <rect x={650} y={940} width={180} height={160} fill={C.piedra} {...sw} />
    <rect x={830} y={1040} width={120} height={60} fill={C.piedra} {...sw} />
    <text x={740} y={1038} textAnchor="middle" fontFamily={F.titular} fontSize={64} fill={T}>1.º</text>
  </g>
);

export const BGancho: React.FC<{modo?: 'gancho' | 'bucle'; tInterr?: number; tRompe?: number; tPasa?: number; hasta?: number}> = ({modo = 'gancho', tInterr = 2.2, tRompe = 3.1, tPasa = 0.8, hasta}) => {
  const t = useT();
  const e = Math.min(useEntrada(0.05), 1.05);
  const pulso = 1 + 0.1 * Math.sin(t * 5.5);
  if (modo === 'gancho') {
    const roto = t >= tRompe;
    const avance = 0.55 * ramp(t, 0.5, tInterr);
    const x0 = 470, x1 = 700, yy = 880;
    const xf = x0 + (x1 - x0) * avance;
    const ex = lerp(-150, 230, e) + 120 * ramp(t, 0.6, tInterr);
    const exF = roto ? lerp(350, 540, ramp(t, tRompe, tRompe + 0.35)) : ex;
    const halo = roto ? Math.min(1, ramp(t, tRompe, tRompe + 0.3)) : 0;
    return (
      <Capa hasta={hasta}>
        <Podio op={roto ? 1 - 0.7 * ramp(t, tRompe, tRompe + 0.3) : 1} />
        {!roto ? (
          <>
            <path d={`M${x0} ${yy} L${xf} ${yy}`} stroke={C.mostaza} strokeWidth={26} strokeLinecap="round" />
            <path d={`M${xf + 6} ${yy - 40} L${xf + 54} ${yy} L${xf + 6} ${yy + 40} Z`} fill={C.mostaza} stroke={T} strokeWidth={5} strokeLinejoin="round" />
          </>
        ) : null}
        {t >= tInterr && !roto ? (
          <text x={600} y={790} textAnchor="middle" fontFamily={F.titular} fontSize={150} fill={C.mostaza} stroke={T} strokeWidth={6} paintOrder="stroke" transform={`scale(${pop(t, tInterr)})`} style={{transformOrigin: '600px 740px'}}>?</text>
        ) : null}
        {roto && t < tRompe + 0.9 ? <Aspa x={560} y={yy} r={52} k={Math.min(1, pop(t, tRompe, 0.25)) * (1 - ramp(t, tRompe + 0.55, tRompe + 0.9))} grosor={18} /> : null}
        {halo > 0 ? <circle cx={exF} cy={yy} r={150 * pulso * halo} fill="rgba(42,157,143,0.22)" stroke={C.turquesa} strokeWidth={9} /> : null}
        <Sobre x={exF} y={yy} w={200} />
      </Capa>
    );
  }
  // bucle: el sobre con halo pasa de largo ante el podio y se queda en el contador de votos válidos
  const u = ramp(t, tPasa, tPasa + 1.8);
  const P0 = [270, 790], P1 = [820, 660], P2 = [255, 960];
  const bx = (1 - u) * (1 - u) * P0[0] + 2 * (1 - u) * u * P1[0] + u * u * P2[0];
  const by = (1 - u) * (1 - u) * P0[1] + 2 * (1 - u) * u * P1[1] + u * u * P2[1];
  const w = lerp(200, 150, u);
  const caja = ramp(t, tPasa + 1.6, tPasa + 2.0);
  return (
    <Capa hasta={hasta}>
      <Podio />
      <rect x={70} y={930} width={370} height={180} rx={22} fill="rgba(42,157,143,0.10)" {...sw} strokeWidth={7 + 3 * Math.sin(Math.PI * caja)} />
      <text x={255} y={1008} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={64} fill={T}>VOTOS</text>
      <text x={255} y={1080} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={64} fill={T}>VÁLIDOS</text>
      <circle cx={bx} cy={by} r={w * 0.78 * pulso} fill="rgba(42,157,143,0.22)" stroke={C.turquesa} strokeWidth={8} />
      <Sobre x={bx} y={by} w={w} />
    </Capa>
  );
};

// ---------------------------------------------------------------- Urnas BLANCO / NULO / NO VOTAR (grandes o leyenda superior)
const XS = [190, 490, 790];
const ETQ = [['BLANCO'], ['NULO'], ['NO', 'VOTAR']];
const ETQ_MINI = ['BLANCO', 'NULO', 'NO VOTAR'];
const XM = [60, 330, 560];

export const BUrnas: React.FC<{
  y?: number; mini?: boolean; miniEn?: number; yMini?: number;
  luz?: {i: number; en: number; hasta?: number}[]; check?: {i: number; en: number; hasta?: number}[]; aspa?: {i: number; en: number}[];
  llenan?: {i: number; en: number}[]; en?: number; hasta?: number;
}> = ({y = 640, mini = false, miniEn, yMini = 372, luz = [], check = [], aspa = [], llenan = [], en = 0, hasta}) => {
  const t = useT();
  const k = mini ? 1 : miniEn === undefined ? 0 : ramp(t, miniEn, miniEn + 0.7);
  return (
    <Capa en={en} hasta={hasta} bob={mini || k >= 1 ? 0 : 8}>
      {[0, 1, 2].map((i) => {
        const lit = luz.filter((l) => l.i === i).reduce((a, l) => Math.max(a, ramp(t, l.en, l.en + 0.25) * (1 - (l.hasta !== undefined ? ramp(t, l.hasta, l.hasta + 0.25) : 0))), 0);
        const xc = lerp(XS[i], XM[i] + 28, k);
        const yc = lerp(y, yMini, k);
        const sc = lerp(1, 0.25, k);
        const lleno = llenan.filter((l) => l.i === i).reduce((a, l) => Math.max(a, ramp(t, l.en, l.en + 0.3)), 0);
        const ck = check.filter((c) => c.i === i && t >= c.en && (c.hasta === undefined || t < c.hasta));
        const as = aspa.filter((a) => a.i === i && t >= a.en);
        return (
          <g key={i}>
            <g transform={`translate(${xc} ${yc}) scale(${sc})`}>
              <Urna x={0} y={0} lit={lit} sobres={lleno} />
              {ck.map((c) => <Check key="c" x={118} y={-96} r={44} k={pop(t, c.en)} />)}
              {as.map((a) => <Aspa key="a" x={0} y={0} r={74} color={C.piedra} grosor={22} k={pop(t, a.en, 0.3)} />)}
            </g>
            {k < 1 ? (
              <g opacity={1 - k}>
                {ETQ[i].map((l, j) => <text key={j} x={xc} y={yc + 150 + j * 70} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={64} fill={T}>{l}</text>)}
              </g>
            ) : null}
            {k > 0 ? <text x={XM[i] + 68} y={yMini + 14} fontFamily={F.texto} fontWeight={700} fontSize={40} fill={T} opacity={k}>{ETQ_MINI[i]}</text> : null}
          </g>
        );
      })}
    </Capa>
  );
};

/** Sobre abierto que se enseña vacío y cae en una urna (x = centro de la urna; yUrna = su centro). */
export const BSobreCae: React.FC<{x?: number; yTope?: number; yUrna?: number; abre?: number; cae?: number; en?: number; hasta?: number}> = ({x = 190, yTope = 400, yUrna = 640, abre = 0, cae = 1.0, en = 0, hasta}) => {
  const t = useT();
  const u = ramp(t, cae, cae + 0.45, (q) => q * q);
  const yy = lerp(yTope, yUrna - 95 - 20, u);
  const entra = pop(t, abre, 0.4);
  const op = 1 - ramp(t, cae + 0.4, cae + 0.5, (q) => q);
  return (
    <Capa en={en} hasta={hasta} bob={0}>
      <Sobre x={x} y={yy} w={170} abierto={u < 0.5} rot={-12 * u} escala={Math.min(1, entra) * lerp(1, 0.8, u)} op={op} />
    </Capa>
  );
};

/** Papeleta genérica con un nombre tachado y hoja cuadriculada en un sobre: ejemplos de voto nulo (uno tras otro). */
export const BNulos: React.FC<{en1?: number; en2?: number; y1?: number; y2?: number; hasta?: number}> = ({en1 = 0, en2 = 1.2, y1 = 900, y2 = 1010, hasta}) => {
  const t = useT();
  const a = Math.min(pop(t, en1, 0.4), 1.05), b = Math.min(pop(t, en2, 0.4), 1.05);
  return (
    <Capa hasta={hasta}>
      <g transform={`translate(150 ${y1}) scale(${a})`} opacity={a > 0 ? 1 : 0}>
        <rect x={-62} y={-44} width={124} height={88} rx={8} fill={C.crema} {...sw} strokeWidth={6} />
        {[-26, -4, 18].map((yy, i) => <path key={i} d={`M-40 ${yy} L40 ${yy}`} stroke={C.piedra} strokeWidth={9} strokeLinecap="round" />)}
        <path d="M-46 -4 L46 -4" stroke={T} strokeWidth={9} strokeLinecap="round" />
      </g>
      <g transform={`translate(150 ${y2}) scale(${b})`} opacity={b > 0 ? 1 : 0}>
        <rect x={-62} y={-40} width={124} height={80} rx={9} fill={C.crema} {...sw} strokeWidth={6} />
        <rect x={-34} y={-62} width={68} height={60} fill="#FFFFFF" {...sw} strokeWidth={4} />
        {[-44, -28, -12].map((yy) => <path key={yy} d={`M-34 ${yy} L34 ${yy}`} stroke={C.piedra} strokeWidth={2} />)}
        {[-14, 0, 14].map((xx) => <path key={xx} d={`M${xx} -62 L${xx} -2`} stroke={C.piedra} strokeWidth={2} />)}
        <path d="M-62 -40 L0 8 L62 -40" fill="none" {...sw} strokeWidth={5} />
      </g>
    </Capa>
  );
};

/** Sofá plano con una casa pequeña (abstención). */
export const BSofa: React.FC<{x?: number; y?: number; tam?: number; en?: number; hasta?: number}> = ({x = 540, y = 900, tam = 1, en = 0, hasta}) => {
  const t = useT();
  const p = Math.min(pop(t, en, 0.5), 1.05);
  return (
    <Capa en={en} hasta={hasta} bob={5}>
      <g transform={`translate(${x} ${y}) scale(${p * tam})`}>
        <rect x={-150} y={-70} width={300} height={90} rx={26} fill={C.turquesa} {...sw} />
        <rect x={-190} y={-20} width={80} height={100} rx={22} fill={C.turquesa} {...sw} />
        <rect x={110} y={-20} width={80} height={100} rx={22} fill={C.turquesa} {...sw} />
        <rect x={-150} y={-10} width={300} height={60} rx={14} fill="#3DB5A6" {...sw} />
        <path d="M-150 80 L-150 110 M150 80 L150 110" {...sw} />
        <g transform="translate(260 -10)">
          <path d="M-60 50 L-60 -10 L0 -60 L60 -10 L60 50 Z" fill={C.crema} {...sw} />
          <rect x={-14} y={8} width={28} height={42} fill={C.mostaza} {...sw} strokeWidth={5} />
        </g>
      </g>
    </Capa>
  );
};

/** Papeletas tachadas que caen sobre el contador y rebotan sin sumarse, o sofá que aparece. */
export const BCaen: React.FC<{tipo?: 'nulo' | 'sofa'; en?: number; n?: number; hasta?: number}> = ({tipo = 'nulo', en = 0, n = 5, hasta}) => {
  const t = useT();
  if (tipo === 'sofa') return <BSofa x={760} y={880} tam={0.45} en={en} hasta={hasta} />;
  return (
    <Capa hasta={hasta} bob={0}>
      {Array.from({length: n}).map((_, i) => {
        const e0 = en + i * 0.18;
        const u = ramp(t, e0, e0 + 0.5, (q) => q * q);
        const rb = ramp(t, e0 + 0.5, e0 + 0.9);
        const x = 200 + i * 170 + rb * (i % 2 ? 90 : -90);
        const y = lerp(645, 750, u) - 60 * Math.sin(Math.PI * rb) + rb * 120;
        const op = t < e0 ? 0 : 1 - ramp(t, e0 + 0.7, e0 + 0.95);
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${(i % 2 ? 1 : -1) * 14 * (1 - u) + rb * 30})`} opacity={op}>
            <rect x={-40} y={-28} width={80} height={56} rx={6} fill={C.crema} {...sw} strokeWidth={5} />
            <path d="M-26 -8 L26 -8 M-26 10 L26 10" stroke={C.piedra} strokeWidth={6} strokeLinecap="round" />
            <path d="M-34 0 L34 0" stroke={T} strokeWidth={7} strokeLinecap="round" />
          </g>
        );
      })}
    </Capa>
  );
};

// ---------------------------------------------------------------- Mini-hemiciclo: el sobre en blanco intenta entrar y rebota
export const BHemi: React.FC<{cy?: number; intentos?: number[]; en?: number; hasta?: number}> = ({cy = 1030, intentos = [1.0, 2.2], en = 0, hasta}) => {
  const t = useT();
  const filas = [{r: 330, n: 34}, {r: 270, n: 28}, {r: 210, n: 22}, {r: 150, n: 15}];
  const asientos: {x: number; y: number}[] = [];
  filas.forEach(({r, n}) => {
    for (let i = 0; i < n; i++) {
      const a = Math.PI * (1 - i / (n - 1));
      asientos.push({x: 540 + r * Math.cos(a), y: cy - r * Math.sin(a)});
    }
  });
  // trayectoria del sobre: desde la izquierda hacia el asiento (240, ~ cy-250) y rebote
  const S0 = [110, cy - 40], S1 = [262, cy - 150];
  let ex = S0[0], ey = S0[1], rot = 0, flash = 0;
  intentos.forEach((a) => {
    const ida = ramp(t, a, a + 0.5, (q) => q * q);
    const vuelta = ramp(t, a + 0.5, a + 0.95, Easing.out(Easing.back(2)));
    if (t >= a) {
      ex = lerp(S0[0], S1[0], ida * (1 - vuelta));
      ey = lerp(S0[1], S1[1], ida * (1 - vuelta));
      rot = -22 * Math.sin(Math.PI * vuelta);
      flash = Math.max(flash, Math.sin(Math.PI * cl((t - a - 0.45) / 0.35)));
    }
  });
  return (
    <Capa en={en} hasta={hasta} bob={5}>
      {asientos.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={13} fill={T} opacity={0.85} />)}
      <Sobre x={ex} y={ey} w={120} rot={rot} />
      {flash > 0.02 ? <circle cx={S1[0] + 30} cy={S1[1] - 10} r={26 + 20 * flash} fill="none" stroke={C.teja} strokeWidth={8} opacity={flash} /> : null}
    </Capa>
  );
};

// ---------------------------------------------------------------- D'Hondt: columnas de votos, montón de sobres en blanco y listón del 3 %
const COLS = [
  {x: 380, h: 300, fill: T, forma: 'circulo', nombre: 'Círculo'},
  {x: 560, h: 200, fill: C.turquesa, forma: 'triangulo', nombre: 'Triángulo'},
  {x: 740, h: 80, fill: C.piedra, forma: 'cuadrado', nombre: 'Cuadrado'},
];
const BASE = 990;

const FormaMini: React.FC<{tipo: string; x: number; y: number; s?: number}> = ({tipo, x, y, s = 56}) => (
  <g transform={`translate(${x - s / 2} ${y}) scale(${s / 100})`}>
    {tipo === 'circulo' ? <circle cx="50" cy="50" r="42" fill={T} stroke={T} strokeWidth={6} /> : null}
    {tipo === 'triangulo' ? <path d="M50 10 L92 86 L8 86 Z" fill={C.turquesa} stroke={T} strokeWidth={6} strokeLinejoin="round" /> : null}
    {tipo === 'cuadrado' ? <rect x="12" y="12" width="76" height="76" rx="4" fill={C.piedra} stroke={T} strokeWidth={6} /> : null}
  </g>
);

const Monton: React.FC<{x: number; y: number; k?: number}> = ({x, y, k = 1}) => (
  <g opacity={cl(k)}>
    {[[0, 0, -6], [34, -4, 8], [-12, -34, 12], [26, -40, -10], [6, -72, 4]].map(([dx, dy, r], i) => <Sobre key={i} x={x + dx} y={y + dy} w={96} rot={r} />)}
  </g>
);

export const BReparto: React.FC<{divide?: [number, number, number]; montonEn?: number; listonEn?: number; en?: number; hasta?: number}> = ({divide = [0.8, 1.6, 2.4], montonEn = 0.6, listonEn, en = 0, hasta}) => {
  const t = useT();
  const yL = 840;
  const dL = listonEn === undefined ? -1 : ramp(t, listonEn, listonEn + 0.45, Easing.out(Easing.bounce));
  return (
    <Capa en={en} hasta={hasta} bob={5}>
      <path d={`M300 ${BASE} L820 ${BASE}`} {...sw} strokeWidth={6} />
      {COLS.map((c, i) => {
        const g = ramp(t, 0.1 + i * 0.15, 0.7 + i * 0.15);
        const h = c.h * g;
        return (
          <g key={i}>
            <rect x={c.x - 70} y={BASE - h} width={140} height={h} fill={c.fill} {...sw} strokeWidth={6} />
            {g > 0.95 ? [2, 3].map((n) => {
              const aparece = ramp(t, divide[n - 1], divide[n - 1] + 0.3);
              return aparece > 0 ? <path key={n} d={`M${c.x - 70} ${BASE - c.h / n} L${c.x + 70} ${BASE - c.h / n}`} stroke={C.crema} strokeWidth={4} strokeDasharray="10 8" opacity={aparece} /> : null;
            }) : null}
            {g > 0.95 ? [1, 2, 3].map((n) => {
              if (n > 3 - i) return null;
              const aparece = ramp(t, divide[n - 1], divide[n - 1] + 0.3);
              const yy = n === 1 ? BASE - c.h + 44 : BASE - c.h / n + 44;
              return aparece > 0 ? <text key={n} x={c.x} y={yy} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={36} fill={i === 2 ? T : C.crema} opacity={aparece}>{`÷${n}`}</text> : null;
            }) : null}
            <FormaMini tipo={c.forma} x={c.x} y={BASE + 14} s={52} />
            <text x={c.x} y={BASE + 100} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={40} fill={T}>{c.nombre}</text>
          </g>
        );
      })}
      <Monton x={150} y={BASE - 20} k={ramp(t, montonEn, montonEn + 0.4)} />
      {dL >= 0 ? (
        <g transform={`translate(0 ${lerp(-420, 0, Math.min(1, dL))})`} opacity={cl(dL * 3)}>
          <rect x={90} y={yL - 14} width={800} height={28} rx={12} fill={C.mostaza} {...sw} />
          <rect x={700} y={yL - 108} width={190} height={78} rx={16} fill={C.mostaza} {...sw} />
          <text x={795} y={yL - 50} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={56} fill={T}>3 %</text>
        </g>
      ) : null}
    </Capa>
  );
};

/** Provincia genérica (inventada, sin nombre): un partido choca con el listón y queda a un lado, en gris. */
const PROV = 'M40 130 L100 50 L210 70 L290 22 L372 108 L345 214 L262 296 L140 318 L58 250 Z';
export const BProv: React.FC<{choque?: number; en?: number; hasta?: number}> = ({choque = 1.0, en = 0, hasta}) => {
  const t = useT();
  const ida = ramp(t, choque - 0.7, choque, (q) => q * q);
  const rb = ramp(t, choque, choque + 0.8);
  const x = lerp(200, 636, ida) - 80 * rb;
  const y = 905 + 160 * ramp(t, choque + 0.2, choque + 0.9, (q) => q * q);
  const gris = ramp(t, choque, choque + 0.4);
  return (
    <Capa en={en} hasta={hasta} bob={4}>
      <g transform="translate(100 650) scale(1.3)"><path d={PROV} fill="rgba(20,33,61,0.10)" stroke="rgba(20,33,61,0.5)" strokeWidth={5} strokeLinejoin="round" /></g>
      <rect x={690} y={790} width={30} height={290} rx={12} fill={C.mostaza} {...sw} />
      <rect x={610} y={700} width={190} height={78} rx={16} fill={C.mostaza} {...sw} />
      <text x={705} y={758} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={56} fill={T}>3 %</text>
      <circle cx={x} cy={y} r={46} fill={gris > 0.5 ? C.piedra : T} {...sw} />
      {t > choque && t < choque + 0.35 ? <path d={`M${676} ${y - 50} L${650} ${y - 84} M${682} ${y} L${644} ${y} M${676} ${y + 50} L${650} ${y + 84}`} stroke={C.mostaza} strokeWidth={8} strokeLinecap="round" /> : null}
    </Capa>
  );
};

/** El montón de sobres en blanco se coloca debajo del listón como un taco que lo sostiene. */
export const BTaco: React.FC<{en?: number; hasta?: number}> = ({en = 0, hasta}) => {
  const t = useT();
  const k = ramp(t, 0.1, 0.9, Easing.out(Easing.back(1.5)));
  const yL = lerp(900, 760, k);
  return (
    <Capa en={en} hasta={hasta} bob={4}>
      <Monton x={300} y={lerp(1180, 960, k)} k={1} />
      <Monton x={780} y={lerp(1180, 960, k)} k={1} />
      <rect x={110} y={yL - 14} width={820} height={28} rx={12} fill={C.mostaza} {...sw} />
      <rect x={380} y={yL - 108} width={190} height={78} rx={16} fill={C.mostaza} {...sw} />
      <text x={475} y={yL - 50} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={56} fill={T}>3 %</text>
    </Capa>
  );
};

// ---------------------------------------------------------------- Ejemplo: regla ampliada 2.900-3.100, barra de Cuadrado y listón
const xv = (v: number) => 110 + (v - 2900) * 3.7;
const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const BEjemplo: React.FC<{
  enBarra?: number; durBarra?: number; barraFija?: boolean; enEntra?: number;
  sobres?: {en: number; dur: number}; enSube?: number; durSube?: number; enFuera?: number; fijo?: boolean; dy?: number; sinTitulo?: boolean;
  en?: number; hasta?: number;
}> = ({enBarra, durBarra = 1.2, barraFija = false, enEntra, sobres, enSube, durSube = 1.6, enFuera, fijo = false, dy = 0, sinTitulo = false, en = 0, hasta}) => {
  const t = useT();
  const barra = barraFija ? 1 : enBarra === undefined ? 0 : ramp(t, enBarra, enBarra + durBarra);
  const vBarra = lerp(2900, 3020, barra);
  const sube = enSube === undefined ? 0 : ramp(t, enSube, enSube + durSube);
  const vL = lerp(3000, 3030, sube);
  const etL = sube >= 1 ? '3.030' : '3.000';
  const flip = sobres ? t >= sobres.en + sobres.dur : false;
  const cont = flip ? 101000 : 100000;
  const fuera = enFuera === undefined ? 0 : ramp(t, enFuera, enFuera + 0.4);
  const entra = fijo ? 1 : enEntra === undefined ? 0 : pop(t, enEntra);
  const barraColor = fuera > 0.5 ? GRIS_CLARO : C.piedra;
  const xb = xv(vBarra), xl = xv(vL);
  const rebote = flip ? 1 + 0.08 * Math.sin(cl((t - (sobres!.en + sobres!.dur)) / 0.35) * Math.PI) : 1;
  return (
    <Capa en={en} hasta={hasta} bob={0}>
      <g transform={`translate(0 ${dy})`}>
      {/* contador de válidos */}
      <text x={540} y={530} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={48} fill={sinTitulo ? 'none' : T}>VOTOS VÁLIDOS</text>
      <text x={540} y={640} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={104} fill={T} transform={`translate(0 ${640 * (1 - rebote)}) scale(1 ${rebote})`} style={{transformOrigin: '540px 640px'}}>{fmt(cont)}</text>
      {/* sobres que caen: cada uno = 100 */}
      {sobres ? Array.from({length: 10}).map((_, i) => {
        const e0 = sobres.en + (i * sobres.dur) / 10;
        const u = ramp(t, e0, e0 + 0.3, (q) => q * q);
        const op = t < e0 ? 0 : 1 - ramp(t, e0 + 0.28, e0 + 0.4);
        return <Sobre key={i} x={200 + i * 75} y={lerp(430, 530, u)} w={64} op={op} rot={(i % 2 ? 1 : -1) * 8} />;
      }) : null}
      {sobres ? <><text x={850} y={600} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={36} fill={T} opacity={ramp(t, sobres.en, sobres.en + 0.3)}>cada sobre</text><text x={850} y={642} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={36} fill={T} opacity={ramp(t, sobres.en, sobres.en + 0.3)}>= 100</text></> : null}
      {/* regla */}
      <path d={`M${xv(2900)} 1050 L${xv(3100)} 1050`} stroke={T} strokeWidth={6} strokeLinecap="round" />
      {[2900, 3000, 3100].map((v) => (
        <g key={v}>
          <path d={`M${xv(v)} 1038 L${xv(v)} 1062`} stroke={T} strokeWidth={6} />
          <text x={xv(v)} y={1104} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={36} fill={T}>{fmt(v)}</text>
        </g>
      ))}
      {/* Cuadrado */}
      <FormaMini tipo="cuadrado" x={140} y={858} s={52} />
      <text x={180} y={900} fontFamily={F.texto} fontWeight={700} fontSize={44} fill={T}>Cuadrado</text>
      {barra > 0 ? (
        <>
          <rect x={xv(2900)} y={940} width={Math.max(0, xb - xv(2900))} height={72} fill={barraColor} {...sw} strokeWidth={6} />
          {barra > 0.55 ? <text x={xv(2900) + 20} y={992} fontFamily={F.cifra} fontWeight={700} fontSize={52} fill={T}>3.020</text> : null}
        </>
      ) : null}
      {entra > 0 && fuera < 0.5 && sube < 0.02 ? <Check x={xb + 64} y={976} r={34} k={Math.min(entra, 1)} /> : null}
      {/* listón */}
      <rect x={xl - 14} y={800} width={28} height={262} rx={10} fill={C.mostaza} {...sw} />
      <text x={xl} y={776} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>{etL}</text>
      </g>
    </Capa>
  );
};

// ---------------------------------------------------------------- Plano general: barras 0-12 % y una que roza el listón del 3 %
const DATOS_PLANO = [8.5, 1.2, 11, 3.05, 0.5, 6];
const xp = (p: number) => 110 + p * 64;
export const BPlano: React.FC<{enListon?: number; parpadeo?: number; enEt?: number; en?: number; hasta?: number}> = ({enListon = 1.2, parpadeo = 1.8, enEt = 2.2, en = 0, hasta}) => {
  const t = useT();
  const y0 = 640;
  return (
    <Capa en={en} hasta={hasta} bob={0}>
      <path d={`M110 ${y0 - 24} L110 ${y0 + 6 * 82 - 20}`} stroke={T} strokeWidth={6} strokeLinecap="round" />
      {DATOS_PLANO.map((v, i) => {
        const g = ramp(t, 0.1 + i * 0.18, 0.6 + i * 0.18);
        const borde = i === 3;
        const blink = borde && t > parpadeo ? 0.5 + 0.5 * Math.sin((t - parpadeo) * 9) : 0;
        return <rect key={i} x={110} y={y0 + i * 82} width={xp(v * g) - 110} height={58} fill={borde && blink > 0.5 ? C.mostaza : C.piedra} {...sw} strokeWidth={6} />;
      })}
      <g opacity={ramp(t, enListon, enListon + 0.3)}>
        <rect x={xp(3) - 11} y={y0 - 40} width={22} height={6 * 82 + 14} rx={9} fill={C.mostaza} {...sw} />
        <text x={xp(3) + 4} y={y0 - 56} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={56} fill={T}>3 %</text>
      </g>
    </Capa>
  );
};

export const REGISTRO_018: Record<string, React.FC<any>> = {
  bGancho: BGancho,
  bUrnas: BUrnas,
  bSobreCae: BSobreCae,
  bNulos: BNulos,
  bSofa: BSofa,
  bCaen: BCaen,
  bHemi: BHemi,
  bReparto: BReparto,
  bProv: BProv,
  bTaco: BTaco,
  bEjemplo: BEjemplo,
  bPlano: BPlano,
};
