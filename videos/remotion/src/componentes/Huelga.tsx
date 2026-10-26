import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';

/** Componentes de la pieza 019 (huelga general del 11-N). Lienzo 1080x1920; tiempos en segundos de la ESCENA. Todo con x <= 955. */
const T = C.tinta;
const PAPEL = '#FFFBF2';
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const cl = (x: number) => Math.min(1, Math.max(0, x));
const easeIO = (u: number) => u * u * (3 - 2 * u);
const easeO = (u: number) => 1 - Math.pow(1 - u, 3);
const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};
/** Progreso 0..1 de una animación que empieza en `a` (s) y dura `d`. a < 0: ya hecha. */
const prog = (t: number, a: number | undefined, d = 0.5) => (a === undefined ? 0 : a < 0 ? 1 : easeO(cl((t - a) / d)));

const Capa: React.FC<{en?: number; hasta?: number; bob?: number; children: React.ReactNode}> = ({en = 0, hasta, bob = 8, children}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const f = useCurrentFrame();
  const b = bob * Math.sin((f / 30) * 2.2);
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: (en < 0 ? 1 : Math.min(p, 1)) * s, transform: `translateY(${b}px)`}}>{children}</svg>;
};

const Check: React.FC<{k: number; r?: number; x?: number; y?: number}> = ({k, r = 52, x = 0, y = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${0.4 + 0.6 * k})`} opacity={Math.min(1, k * 2)}>
    <circle r={r} fill={C.turquesa} {...sw} />
    <path d={`M${-r * 0.45} ${r * 0.02} L${-r * 0.1} ${r * 0.36} L${r * 0.5} ${-r * 0.34}`} fill="none" stroke={C.crema} strokeWidth={r * 0.2} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const Txt: React.FC<{x: number; y: number; t: string; s?: number; anchor?: 'start' | 'middle' | 'end'; font?: string; fill?: string; w?: number; op?: number}> = ({x, y, t, s = 64, anchor = 'middle', font, fill = T, w = 700, op = 1}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={font ?? F.texto} fontWeight={w} fontSize={s} fill={fill} opacity={op}>{t}</text>
);

/** Calendario con hoja mostaza. `cae`: segundo en que la hoja cae (-1: ya puesta). `marca`: segundo en que se rodea el día. `x2/y2/mueve`: desliza el calendario. */
export const CalendarioH: React.FC<{x?: number; y?: number; lado?: number; mes?: string; dia?: string; cae?: number; marca?: number; x2?: number; y2?: number; mueve?: number; dur?: number; en?: number; hasta?: number}> = ({
  x = 540, y = 900, lado = 360, mes = 'NOV', dia = '11', cae = -1, marca, x2, y2, mueve, dur = 0.7, en = 0, hasta,
}) => {
  const t = useT();
  const m = mueve !== undefined ? easeIO(cl((t - mueve) / dur)) : 0;
  const cx = x + ((x2 ?? x) - x) * m;
  const cy = y + ((y2 ?? y) - y) * m;
  const k = cae < 0 ? 1 : easeO(cl((t - cae) / 0.55));
  const h = lado / 2;
  const mk = marca === undefined ? 0 : easeO(cl((t - marca) / 0.5));
  return (
    <Capa en={en} hasta={hasta} bob={6}>
      <g transform={`translate(${cx} ${cy})`}>
        <rect x={-h} y={-h} width={lado} height={lado} rx={24} fill={PAPEL} {...sw} />
        <path d={`M${-h} ${-h + lado * 0.2} V${-h + 24} a24 24 0 0 1 24 -24 H${h - 24} a24 24 0 0 1 24 24 V${-h + lado * 0.2} Z`} fill={T} stroke={T} strokeWidth={7} />
        <rect x={-lado * 0.27} y={-h - 26} width={22} height={54} rx={11} fill={C.crema} {...sw} />
        <rect x={lado * 0.27 - 22} y={-h - 26} width={22} height={54} rx={11} fill={C.crema} {...sw} />
        <g transform={`translate(0 ${-(1 - k) * 1000}) rotate(${(1 - k) * -14})`}>
          <rect x={-h + 18} y={-h + lado * 0.24} width={lado - 36} height={lado * 0.72} rx={14} fill={C.mostaza} {...sw} />
          <Txt x={0} y={-h + lado * 0.24 + lado * 0.17} t={mes} s={Math.max(56, lado * 0.17)} w={700} />
          <Txt x={0} y={h - lado * 0.14} t={dia} s={lado * 0.4} font={F.titular} w={400} />
        </g>
        {mk > 0 ? (
          <ellipse cx={0} cy={h - lado * 0.14 - lado * 0.14} rx={lado * 0.3} ry={lado * 0.22} fill="none" stroke={T} strokeWidth={9} strokeLinecap="round" strokeDasharray={1400} strokeDashoffset={1400 * (1 - mk)} />
        ) : null}
      </g>
    </Capa>
  );
};

/** Nómina (hoja con líneas). `cifra`: texto grande que cae en `cifraEn`; `interroga`: signo de interrogación que parpadea. */
export const NominaH: React.FC<{x?: number; y?: number; esc?: number; cifra?: string; cifraEn?: number; dia?: string; interroga?: boolean; interEn?: number; en?: number; hasta?: number}> = ({
  x = 540, y = 850, esc = 1, cifra, cifraEn = -1, dia, interroga = false, interEn = 0, en = 0, hasta,
}) => {
  const t = useT();
  const k = cifra ? (cifraEn < 0 ? 1 : easeO(cl((t - cifraEn) / 0.5))) : 0;
  const parp = interroga && t >= interEn ? (Math.floor((t - interEn) / 0.45) % 2 === 0 ? 1 : 0.2) : 0;
  return (
    <Capa en={en} hasta={hasta} bob={6}>
      <g transform={`translate(${x} ${y}) scale(${esc})`}>
        <rect x={-150} y={-195} width={300} height={dia ? 450 : 390} rx={18} fill={PAPEL} {...sw} />
        <rect x={-150} y={-195} width={300} height={70} rx={18} fill={T} />
        <rect x={-110} y={-170} width={120} height={20} rx={10} fill={C.crema} />
        {[0, 1, 2].map((i) => <rect key={i} x={-110} y={-100 + i * 36} width={i === 2 ? 130 : 220} height={14} rx={7} fill={C.piedra} />)}
        {cifra ? (
          <g transform={`translate(0 ${-(1 - k) * 320})`} opacity={Math.min(1, k * 2)}>
            <rect x={-130} y={20} width={260} height={110} rx={14} fill={C.mostaza} {...sw} />
            <Txt x={0} y={100} t={cifra} s={84} font={F.cifra} w={700} />
          </g>
        ) : null}
        {dia ? <Txt x={0} y={198} t={dia} s={64} w={700} op={Math.min(1, k * 2)} /> : null}
        {interroga ? (
          <g opacity={parp}>
            <circle cx={0} cy={75} r={62} fill={C.mostaza} {...sw} />
            <Txt x={0} y={112} t="?" s={96} font={F.titular} w={400} />
          </g>
        ) : null}
      </g>
    </Capa>
  );
};

/** Carpeta mostaza; un sobre cae dentro y un sello REGISTRO lo marca. */
export const SobreCarpetaH: React.FC<{x?: number; y?: number; sobreEn?: number; selloEn?: number; en?: number; hasta?: number}> = ({x = 700, y = 700, sobreEn = 0.4, selloEn = 1.4, en = 0, hasta}) => {
  const t = useT();
  const ks = easeO(cl((t - sobreEn) / 0.6));
  const kl = easeO(cl((t - selloEn) / 0.25));
  return (
    <Capa en={en} hasta={hasta} bob={5}>
      <g transform={`translate(${x} ${y})`}>
        <path d="M-190 -110 H-70 L-40 -150 H-10 V-110" fill="none" />
        <path d="M-190 -105 V120 a20 20 0 0 0 20 20 H170 a20 20 0 0 0 20 -20 V-85 a20 20 0 0 0 -20 -20 H-60 L-90 -140 H-170 a20 20 0 0 0 -20 20 Z" fill={C.mostaza} {...sw} />
        <g transform={`translate(0 ${-(1 - ks) * 420 - 10})`} opacity={Math.min(1, ks * 3)}>
          <rect x={-130} y={-80} width={260} height={170} rx={10} fill={PAPEL} {...sw} />
          <path d="M-130 -80 L0 20 L130 -80" fill="none" {...sw} />
        </g>
        <path d="M-190 -20 H170 a20 20 0 0 1 20 20 V120 a20 20 0 0 1 -20 20 H-170 a20 20 0 0 1 -20 -20 Z" fill={C.mostaza} {...sw} />
        {kl > 0 ? (
          <g transform={`translate(0 70) rotate(-9) scale(${1 + (1 - kl) * 0.9})`} opacity={Math.min(1, kl * 2)}>
            <rect x={-210} y={-52} width={420} height={104} rx={16} fill={PAPEL} stroke={T} strokeWidth={9} />
            <Txt x={0} y={26} t="REGISTRO" s={64} font={F.titular} w={400} />
          </g>
        ) : null}
      </g>
    </Capa>
  );
};

/** Pastilla de texto (tinta con texto crema), todas iguales. `ancho` opcional (si no, se estima). */
export const PastillaH: React.FC<{texto: string; x?: number; y?: number; ancho?: number; caps?: boolean; en?: number; hasta?: number}> = ({texto, x = 60, y = 700, ancho, caps = false, en = 0, hasta}) => {
  const w = ancho ?? Math.round(texto.length * (caps ? 46 : 36) + 60);
  return (
    <Capa en={en} hasta={hasta} bob={4}>
      <rect x={x} y={y} width={w} height={86} rx={24} fill={T} />
      <Txt x={x + w / 2} y={y + 62} t={texto} s={64} w={700} fill={C.crema} />
    </Capa>
  );
};

/** Llave y billete con etiquetas. */
export const LlaveBilleteH: React.FC<{y?: number; llaveEn?: number; billeteEn?: number; en?: number; hasta?: number}> = ({y = 760, llaveEn = 0.2, billeteEn = 1.4, en = 0, hasta}) => {
  const t = useT();
  const a = easeO(cl((t - llaveEn) / 0.5));
  const b = easeO(cl((t - billeteEn) / 0.5));
  return (
    <Capa en={en} hasta={hasta} bob={6}>
      <g transform={`translate(270 ${y}) scale(${0.6 + 0.4 * a})`} opacity={Math.min(1, a * 2)}>
        <g transform="rotate(-30)">
          <circle cx={-80} cy={0} r={85} fill={C.mostaza} {...sw} />
          <circle cx={-80} cy={0} r={30} fill={C.crema} {...sw} />
          <rect x={-5} y={-22} width={250} height={44} rx={12} fill={C.mostaza} {...sw} />
          <rect x={170} y={20} width={34} height={64} rx={8} fill={C.mostaza} {...sw} />
          <rect x={215} y={20} width={30} height={46} rx={8} fill={C.mostaza} {...sw} />
        </g>
        <Txt x={0} y={225} t="vivienda" />
      </g>
      <g transform={`translate(690 ${y}) scale(${0.6 + 0.4 * b})`} opacity={Math.min(1, b * 2)}>
        <rect x={-165} y={-95} width={330} height={190} rx={16} fill={C.turquesa} {...sw} />
        <rect x={-143} y={-73} width={286} height={146} rx={10} fill="none" stroke={C.crema} strokeWidth={5} />
        <circle r={55} fill={C.crema} {...sw} />
        <Txt x={0} y={26} t="€" s={74} font={F.cifra} w={700} />
        <Txt x={0} y={225} t="sueldos" />
      </g>
    </Capa>
  );
};

/** Línea de fechas con hitos grandes que se encienden en orden. hitos: {x, etiq, en}. `arco`: segundo en que se une el primero con el último. */
export const FechasH: React.FC<{y?: number; hitos: {x: number; etiq: string; en: number}[]; unir?: number; en?: number; hasta?: number}> = ({y = 820, hitos, unir, en = 0, hasta}) => {
  const t = useT();
  const u = unir === undefined ? 0 : easeO(cl((t - unir) / 0.8));
  const xs = hitos.map((h) => h.x);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  return (
    <Capa en={en} hasta={hasta} bob={6}>
      <line x1={110} y1={y} x2={930} y2={y} stroke={T} strokeWidth={9} strokeLinecap="round" />
      {u > 0 ? <line x1={x0} y1={y} x2={x0 + (x1 - x0) * u} y2={y} stroke={C.mostaza} strokeWidth={22} strokeLinecap="round" /> : null}
      {hitos.map((h, i) => {
        const k = easeO(cl((t - h.en) / 0.4));
        return (
          <g key={i}>
            <circle cx={h.x} cy={y} r={30 + 22 * k} fill={k > 0.05 ? C.mostaza : C.crema} {...sw} />
            <Txt x={h.x} y={y + 150} t={h.etiq} s={96} font={F.cifra} w={700} op={0.35 + 0.65 * k} />
          </g>
        );
      })}
    </Capa>
  );
};

/** Martillo de juez con bloque. `golpes`: segundos en que golpea. `interroga`: disco con "?" que parpadea. */
export const MazoH: React.FC<{x?: number; y?: number; golpes?: number[]; interroga?: number; esc?: number; en?: number; hasta?: number}> = ({x = 300, y = 780, golpes = [], interroga, esc = 1, en = 0, hasta}) => {
  const t = useT();
  let ang = -38 + 4 * Math.sin(t * 3);
  let rebote = 0;
  golpes.forEach((g) => {
    if (t >= g - 0.3 && t < g) ang = -38 * (1 - easeIO((t - (g - 0.3)) / 0.3));
    else if (t >= g && t < g + 0.45) {
      ang = -38 * easeO((t - g) / 0.45);
      rebote = Math.max(0, 1 - (t - g) / 0.25) * 8;
    }
  });
  const parp = interroga !== undefined && t >= interroga ? (Math.floor((t - interroga) / 0.45) % 2 === 0 ? 1 : 0.25) : 0;
  return (
    <Capa en={en} hasta={hasta} bob={4}>
      <g transform={`translate(${x} ${y}) scale(${esc})`}>
        <rect x={115} y={75 + rebote} width={260} height={52} rx={12} fill={C.mostaza} {...sw} />
        <g transform={`rotate(${ang})`}>
          <rect x={0} y={-17} width={265} height={34} rx={14} fill={C.mostaza} {...sw} />
          <rect x={205} y={-78} width={80} height={156} rx={16} fill={C.mostaza} {...sw} />
          <rect x={205} y={-48} width={80} height={14} fill={T} />
          <rect x={205} y={34} width={80} height={14} fill={T} />
        </g>
      </g>
      {interroga !== undefined ? (
        <g opacity={parp}>
          <circle cx={x + 470} cy={y - 40} r={95} fill={C.mostaza} {...sw} />
          <Txt x={x + 470} y={y + 12} t="?" s={150} font={F.titular} w={400} />
        </g>
      ) : null}
    </Capa>
  );
};

/** Contrato (hoja con firma). `check`: segundo del check turquesa; `escudo`: segundo en que un escudo turquesa lo cubre. Puede deslizarse a x2. */
export const ContratoH: React.FC<{x?: number; y?: number; esc?: number; check?: number; escudo?: number; x2?: number; mueve?: number; en?: number; hasta?: number}> = ({x = 540, y = 860, esc = 1, check, escudo, x2, mueve, en = 0, hasta}) => {
  const t = useT();
  const m = mueve !== undefined ? easeIO(cl((t - mueve) / 0.7)) : 0;
  const cx = x + ((x2 ?? x) - x) * m;
  const kc = prog(t, check, 0.45);
  const ke = prog(t, escudo, 0.5);
  return (
    <Capa en={en} hasta={hasta} bob={6}>
      <g transform={`translate(${cx} ${y}) scale(${esc})`}>
        <rect x={-130} y={-170} width={260} height={340} rx={16} fill={PAPEL} {...sw} />
        <rect x={-95} y={-135} width={140} height={20} rx={10} fill={T} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={-95} y={-92 + i * 34} width={i === 3 ? 100 : 190} height={13} rx={6} fill={C.piedra} />)}
        <path d="M-95 100 q20 -50 40 -10 t40 -5 t40 0" fill="none" stroke={T} strokeWidth={6} strokeLinecap="round" />
        {kc > 0 ? <Check k={kc} r={58} x={105} y={140} /> : null}
        {ke > 0 ? (
          <g transform={`translate(0 ${-(1 - ke) * 260 + 10})`} opacity={Math.min(1, ke * 2)}>
            <path d="M0 -150 C50 -130 100 -125 120 -125 C120 -20 100 90 0 150 C-100 90 -120 -20 -120 -125 C-100 -125 -50 -130 0 -150 Z" fill={C.turquesa} fillOpacity={0.93} {...sw} />
            <path d="M-45 -5 L-10 35 L55 -45" fill="none" stroke={C.crema} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ) : null}
      </g>
    </Capa>
  );
};

/** Etiqueta SANCIÓN tachada con línea discontinua y chispa "falta" en gris piedra. */
export const SancionH: React.FC<{x?: number; y?: number; tacha?: number; chispa?: number; en?: number; hasta?: number}> = ({x = 690, y = 760, tacha, chispa, en = 0, hasta}) => {
  const t = useT();
  const kt = prog(t, tacha, 0.5);
  const kf = prog(t, chispa, 0.4);
  return (
    <Capa en={en} hasta={hasta} bob={5}>
      <g transform={`translate(${x} ${y})`}>
        <g opacity={1 - 0.45 * kt}>
          <path d="M-210 -50 H150 L215 0 L150 50 H-210 a16 16 0 0 1 -16 -16 V-34 a16 16 0 0 1 16 -16 Z" fill={PAPEL} {...sw} />
          <circle cx={165} cy={0} r={11} fill={T} />
          <Txt x={-10} y={22} t="SANCIÓN" s={64} />
        </g>
        {kt > 0 ? <line x1={-232} y1={0} x2={-232 + 450 * kt} y2={0} stroke={T} strokeWidth={10} strokeDasharray="26 16" strokeLinecap="round" /> : null}
        {kf > 0 ? (
          <g transform={`translate(-150 170) scale(${0.5 + 0.5 * kf})`} opacity={kf}>
            <path d="M0 -62 L16 -18 L62 -22 L26 6 L44 52 L0 24 L-44 52 L-26 6 L-62 -22 L-16 -18 Z" fill={C.piedra} {...sw} />
            <Txt x={100} y={22} t="falta" anchor="start" />
          </g>
        ) : null}
      </g>
    </Capa>
  );
};

/** Casilla "Seguridad Social: de alta" con check. */
export const CasillaSSH: React.FC<{y?: number; check?: number; en?: number; hasta?: number}> = ({y = 860, check = 0.6, en = 0, hasta}) => {
  const t = useT();
  const k = prog(t, check, 0.45);
  return (
    <Capa en={en} hasta={hasta} bob={6}>
      <rect x={70} y={y - 150} width={880} height={300} rx={24} fill={PAPEL} {...sw} />
      <Txt x={110} y={y - 30} t="Seguridad Social:" anchor="start" />
      <Txt x={110} y={y + 90} t="de alta" anchor="start" font={F.titular} w={400} s={72} />
      <rect x={730} y={y + 10} width={150} height={120} rx={22} fill={C.crema} {...sw} />
      {k > 0 ? <path d={`M755 ${y + 70} L795 ${y + 112} L860 ${y + 30}`} fill="none" stroke={C.turquesa} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={200} strokeDashoffset={200 * (1 - k)} /> : null}
    </Capa>
  );
};

/** Puerta de oficina abierta con check turquesa. */
export const PuertaH: React.FC<{x?: number; y?: number; esc?: number; check?: number; en?: number; hasta?: number}> = ({x = 540, y = 860, esc = 1, check = 0.7, en = 0, hasta}) => {
  const t = useT();
  const kc = prog(t, check, 0.45);
  const ab = easeO(cl((t - 0.2) / 0.6));
  return (
    <Capa en={en} hasta={hasta} bob={6}>
      <g transform={`translate(${x} ${y}) scale(${esc})`}>
        <rect x={-150} y={-225} width={300} height={450} rx={8} fill="#E8DFCB" {...sw} />
        <path d={`M-150 -225 L${-150 + 130 * ab + 20} ${-205 + 10 * ab} V${205 - 10 * ab} L-150 225 Z`} fill={C.mostaza} {...sw} />
        <circle cx={-150 + 100 * ab + 10} cy={10} r={11} fill={T} />
        <line x1={-190} y1={225} x2={190} y2={225} stroke={T} strokeWidth={9} strokeLinecap="round" />
        {kc > 0 ? <Check k={kc} r={64} x={140} y={165} /> : null}
      </g>
    </Capa>
  );
};

const Silla: React.FC<{x: number; y: number; fill: string; esc?: number; dash?: boolean}> = ({x, y, fill, esc = 1.8, dash}) => (
  <g transform={`translate(${x} ${y}) scale(${esc})`}>
    <path d="M-48 -125 V35" fill="none" stroke={T} strokeWidth={9} strokeLinecap="round" />
    <rect x={-58} y={-130} width={14} height={90} rx={5} fill={fill} stroke={T} strokeWidth={5} />
    <rect x={-48} y={0} width={120} height={28} rx={8} fill={fill} stroke={T} strokeWidth={5} strokeDasharray={dash ? '10 8' : undefined} />
    <path d="M-34 28 L-40 105 M58 28 L64 105" fill="none" stroke={T} strokeWidth={9} strokeLinecap="round" />
  </g>
);

/** Silla vacía; otra silla llega desde fuera con una flecha y un icono de prohibido la bloquea. */
export const SillasH: React.FC<{y?: number; flecha?: number; bloqueo?: number; en?: number; hasta?: number}> = ({y = 840, flecha = 0.8, bloqueo = 1.9, en = 0, hasta}) => {
  const t = useT();
  const a = easeIO(cl((t - flecha) / 1.0));
  const b = prog(t, bloqueo, 0.35);
  const x2 = 820 - 190 * a + (b > 0 ? 25 * Math.sin(Math.min(1, (t - bloqueo) / 0.5) * Math.PI) : 0);
  return (
    <Capa en={en} hasta={hasta} bob={6}>
      <Silla x={200} y={y} fill={C.mostaza} />
      <Silla x={x2 - 40} y={y} fill={C.piedra} />
      <g opacity={Math.min(1, a * 3)}>
        <line x1={900} y1={y - 255} x2={560} y2={y - 255} stroke={T} strokeWidth={12} strokeLinecap="round" />
        <path d="M600 -0 L560 0 M0 0" fill="none" />
        <path d={`M590 ${y - 300} L540 ${y - 255} L590 ${y - 210}`} fill="none" stroke={T} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {b > 0 ? (
        <g transform={`translate(470 ${y - 30}) scale(${0.5 + 0.5 * b})`} opacity={b}>
          <circle r={105} fill="none" stroke={C.piedra} strokeWidth={22} />
          <line x1={-74} y1={-74} x2={74} y2={74} stroke={C.piedra} strokeWidth={22} strokeLinecap="round" />
        </g>
      ) : null}
    </Capa>
  );
};

/** Balanza en equilibrio: huelga frente a servicios esenciales (sin inclinarla hacia ningún lado). */
export const BalanzaH: React.FC<{y?: number; izqEn?: number; derEn?: number; en?: number; hasta?: number}> = ({y = 700, izqEn = 0.2, derEn = 0.9, en = 0, hasta}) => {
  const t = useT();
  const a = 2.5 * Math.sin(t * 1.6);
  const ki = easeO(cl((t - izqEn) / 0.5));
  const kd = easeO(cl((t - derEn) / 0.5));
  const Plato: React.FC<{cx: number; k: number}> = ({cx, k}) => (
    <g opacity={Math.min(1, k * 2)} transform={`translate(0 ${-(1 - k) * 80})`}>
      <path d={`M${cx - 150} 180 Q${cx} 270 ${cx + 150} 180 Z`} fill={C.mostaza} {...sw} />
      <path d={`M${cx - 250 + 0} 0 L${cx - 130} 180 M${cx + 0} 0`} fill="none" />
    </g>
  );
  return (
    <Capa en={en} hasta={hasta} bob={5}>
      <g transform={`translate(480 ${y})`}>
        <path d="M-80 330 H80 L40 300 H-40 Z" fill={T} />
        <line x1={0} y1={0} x2={0} y2={310} stroke={T} strokeWidth={14} strokeLinecap="round" />
        <g transform={`rotate(${a})`}>
          <line x1={-250} y1={0} x2={250} y2={0} stroke={T} strokeWidth={14} strokeLinecap="round" />
          <circle r={22} fill={C.mostaza} {...sw} />
          {[[-250, ki], [250, kd]].map(([cx, k], i) => (
            <g key={i} opacity={Math.min(1, (k as number) * 2)}>
              <line x1={cx} y1={0} x2={cx - 130} y2={170} stroke={T} strokeWidth={6} />
              <line x1={cx} y1={0} x2={cx + 130} y2={170} stroke={T} strokeWidth={6} />
              <path d={`M${(cx as number) - 150} 170 H${(cx as number) + 150} Q${cx} 260 ${(cx as number) - 150} 170 Z`} fill={i === 0 ? C.mostaza : C.turquesa} {...sw} />
            </g>
          ))}
        </g>
      </g>
      <Txt x={230} y={y + 340} t="huelga" op={ki} />
      <Txt x={730} y={y + 340} t="servicios" op={kd} />
      <Txt x={730} y={y + 414} t="esenciales" op={kd} />
    </Capa>
  );
};

/** Documento con sello RESOLUCIÓN y martillo de juez que lo revisa. */
export const ResolucionH: React.FC<{y?: number; selloEn?: number; golpes?: number[]; en?: number; hasta?: number}> = ({y = 820, selloEn = 0.3, golpes = [1.6, 2.1], en = 0, hasta}) => {
  const t = useT();
  const k = easeO(cl((t - selloEn) / 0.25));
  return (
    <>
      <Capa en={en} hasta={hasta} bob={5}>
        <g transform={`translate(290 ${y})`}>
          <rect x={-230} y={-240} width={460} height={500} rx={16} fill={PAPEL} {...sw} />
          <rect x={-185} y={-200} width={200} height={22} rx={11} fill={T} />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={-185} y={-150 + i * 38} width={i === 3 ? 170 : 370} height={14} rx={7} fill={C.piedra} />)}
          {k > 0 ? (
            <g transform={`translate(0 120) rotate(-9) scale(${1 + (1 - k) * 0.9})`} opacity={Math.min(1, k * 2)}>
              <rect x={-215} y={-56} width={430} height={112} rx={16} fill={PAPEL} stroke={T} strokeWidth={9} />
              <Txt x={0} y={26} t="RESOLUCIÓN" s={64} font={F.titular} w={400} />
            </g>
          ) : null}
        </g>
      </Capa>
      <MazoH x={560} y={y - 20} golpes={golpes} esc={0.95} en={en} hasta={hasta} />
    </>
  );
};

/** Documento "acuerdo salarial" con un hueco (acuerdo que falta). */
export const AcuerdoH: React.FC<{x?: number; y?: number; en?: number; hasta?: number}> = ({x = 540, y = 880, en = 0, hasta}) => {
  const t = useT();
  const f = Math.floor(t / 0.5) % 2 === 0 ? 1 : 0.5;
  return (
    <Capa en={en} hasta={hasta} bob={6}>
      <g transform={`translate(${x} ${y})`}>
        <rect x={-110} y={-125} width={220} height={250} rx={14} fill={PAPEL} {...sw} />
        <rect x={-80} y={-95} width={110} height={16} rx={8} fill={T} />
        {[0, 1].map((i) => <rect key={i} x={-80} y={-60 + i * 34} width={160} height={12} rx={6} fill={C.piedra} />)}
        <rect x={-80} y={20} width={160} height={80} rx={10} fill="none" stroke={T} strokeWidth={6} strokeDasharray="14 10" opacity={f} />
        <Txt x={0} y={82} t="?" s={64} font={F.titular} w={400} op={f} />
        <Txt x={0} y={215} t="acuerdo salarial" />
      </g>
    </Capa>
  );
};

/** Página con dos fragmentos clave subrayados en gris piedra. lineas: {t, en, sub}. */
export const ClaveH: React.FC<{lineas: {t: string; y: number; en: number; w: number}[]; en?: number; hasta?: number}> = ({lineas, en = 0, hasta}) => {
  const t = useT();
  return (
    <Capa en={en} hasta={hasta} bob={5}>
      <rect x={60} y={600} width={880} height={510} rx={22} fill={PAPEL} {...sw} />
      {[0, 1].map((i) => <rect key={'a' + i} x={100} y={640 + i * 30} width={i === 1 ? 420 : 760} height={12} rx={6} fill={C.piedra} opacity={0.6} />)}
      {[0, 1].map((i) => <rect key={'b' + i} x={100} y={1030 + i * 30} width={i === 1 ? 300 : 700} height={12} rx={6} fill={C.piedra} opacity={0.6} />)}
      {lineas.map((l, i) => {
        const k = easeO(cl((t - l.en) / 0.6));
        return (
          <g key={i}>
            <Txt x={100} y={l.y} t={l.t} anchor="start" />
            <line x1={100} y1={l.y + 16} x2={100 + l.w * k} y2={l.y + 16} stroke={C.piedra} strokeWidth={7} strokeLinecap="round" />
          </g>
        );
      })}
    </Capa>
  );
};

/** Línea de tiempo 19 OCT → 22 OCT con tarjeta de la CEOE y flecha de impugnar que se desvanece. */
export const LineaCeoeH: React.FC<{y?: number; tarjeta?: number; hito2?: number; renuncia?: number; en?: number; hasta?: number}> = ({y = 860, tarjeta = 0.3, hito2 = 5, renuncia = 5.2, en = 0, hasta}) => {
  const t = useT();
  const kt = prog(t, tarjeta, 0.5);
  const k2 = prog(t, hito2, 0.4);
  const kr = prog(t, renuncia, 0.5);
  const fl = 1 - 0.85 * kr;
  return (
    <Capa en={en} hasta={hasta} bob={5}>
      <line x1={110} y1={y} x2={930} y2={y} stroke={T} strokeWidth={9} strokeLinecap="round" />
      <circle cx={230} cy={y} r={52} fill={C.mostaza} {...sw} />
      <circle cx={730} cy={y} r={30 + 22 * k2} fill={k2 > 0.05 ? C.mostaza : C.crema} {...sw} />
      <Txt x={230} y={y + 130} t="19 OCT" s={72} font={F.cifra} />
      <Txt x={730} y={y + 130} t="22 OCT" s={72} font={F.cifra} op={0.35 + 0.65 * k2} />
      <g opacity={kt} transform={`translate(0 ${(1 - kt) * 40})`}>
        <rect x={60} y={y - 330} width={620} height={200} rx={20} fill={T} />
        <Txt x={100} y={y - 235} t="CEOE dijo que" anchor="start" fill={C.crema} />
        <Txt x={100} y={y - 160} t="la impugnaría" anchor="start" fill={C.crema} />
        <line x1={230} y1={y - 130} x2={230} y2={y - 60} stroke={T} strokeWidth={7} strokeDasharray="10 8" />
      </g>
      <g opacity={kt * fl}>
        <line x1={720} y1={y - 230} x2={900} y2={y - 230} stroke={T} strokeWidth={22} strokeLinecap="round" />
        <path d={`M860 ${y - 275} L910 ${y - 230} L860 ${y - 185}`} fill="none" stroke={T} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {kr > 0 ? (
        <g transform={`translate(0 ${(1 - kr) * 30})`} opacity={kr}>
          <rect x={90} y={y + 175} width={780} height={90} rx={24} fill={C.mostaza} {...sw} />
          <Txt x={480} y={y + 242} t="renuncia a recurrir" />
        </g>
      ) : null}
    </Capa>
  );
};

/** Lupa que rodea un calendario (seguimiento). */
export const LupaH: React.FC<{x?: number; y?: number; etiqueta?: string; etiquetaY?: number; en?: number; hasta?: number}> = ({x = 540, y = 840, etiqueta, etiquetaY = 1085, en = 0, hasta}) => {
  const t = useT();
  const cx = x + 40 + 30 * Math.cos(t * 1.6);
  const cy = y + 20 + 20 * Math.sin(t * 1.6);
  return (
    <Capa en={en} hasta={hasta} bob={2}>
      <line x1={cx + 70} y1={cy + 70} x2={cx + 170} y2={cy + 170} stroke={T} strokeWidth={30} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={105} fill={C.mostaza} fillOpacity={0.22} {...sw} strokeWidth={16} />
      {etiqueta ? <Txt x={540} y={etiquetaY} t={etiqueta} /> : null}
    </Capa>
  );
};

/** Urna neutra (caja con ranura y papeleta), sin siglas ni colores de partido. */
const Urna: React.FC<{x: number; y: number; esc?: number; k: number}> = ({x, y, esc = 1, k}) => (
  <g transform={`translate(${x} ${y}) scale(${esc * (0.6 + 0.4 * k)})`} opacity={Math.min(1, k * 2)}>
    <rect x={-70} y={-55} width={140} height={110} rx={12} fill={C.piedra} {...sw} />
    <rect x={-40} y={-45} width={80} height={14} rx={7} fill={T} />
    <rect x={-28} y={-100 + 40 * Math.min(1, k)} width={56} height={70} rx={4} fill={PAPEL} {...sw} strokeWidth={5} />
  </g>
);

/** Línea de tiempo del 11 al 29 de noviembre (escala proporcional) con cursor que salta de hito en hito. */
export const NovH: React.FC<{y?: number; hito11?: number; campana?: number; urna?: number; en?: number; hasta?: number}> = ({y = 860, hito11 = 1.3, campana = 5.2, urna = 7.3, en = 0, hasta}) => {
  const t = useT();
  const px = 36.7;
  const X = (d: number) => 200 + (d - 11) * px;
  const k11 = prog(t, hito11, 0.4);
  const kc = prog(t, campana, 0.8);
  const ku = prog(t, urna, 0.5);
  const marks = [{a: hito11, x: X(11)}, {a: campana, x: X(13)}, {a: urna, x: X(29)}];
  let cur = marks[0].x;
  let tPrev = marks[0].a;
  marks.forEach((m, i) => {
    if (i > 0 && t >= m.a - 0.5) { cur = cur + (m.x - cur) * easeIO(cl((t - (m.a - 0.5)) / 0.5)); }
    tPrev = m.a;
  });
  const curX = t < hito11 - 0.3 ? marks[0].x : (() => {
    let px0 = marks[0].x;
    for (let i = 1; i < marks.length; i++) {
      if (t >= marks[i].a - 0.45) px0 = marks[i].x; else break;
    }
    return px0;
  })();
  void cur; void tPrev;
  return (
    <Capa en={en} hasta={hasta} bob={5}>
      <line x1={120} y1={y} x2={940} y2={y} stroke={T} strokeWidth={9} strokeLinecap="round" />
      {kc > 0 ? <line x1={X(13)} y1={y} x2={X(13) + (X(27) - X(13)) * kc} y2={y} stroke={C.turquesa} strokeWidth={30} strokeLinecap="round" /> : null}
      <circle cx={X(11)} cy={y} r={28 + 20 * k11} fill={k11 > 0.05 ? C.mostaza : C.crema} {...sw} />
      <Txt x={X(11)} y={y - 100} t="11 NOV" s={72} font={F.cifra} op={0.4 + 0.6 * k11} />
      {kc > 0 ? <circle cx={X(13)} cy={y} r={24} fill={C.turquesa} {...sw} /> : null}
      {kc > 0 ? <Txt x={X(13)} y={y + 100} t="13 NOV" s={72} font={F.cifra} op={kc} /> : null}
      {kc > 0 ? <Txt x={X(20) + 40} y={y + 190} t="campaña" op={kc} /> : null}
      {ku > 0 ? <Urna x={X(29)} y={y - 5} k={ku} esc={1.15} /> : <circle cx={X(29)} cy={y} r={24} fill={C.crema} {...sw} />}
      {ku > 0 ? <Txt x={950} y={y - 120} t="29 NOV" s={72} font={F.cifra} anchor="end" op={ku} /> : null}
      <g transform={`translate(${curX} ${y - 255 + 10 * Math.sin(t * 4)})`} opacity={t >= hito11 - 0.3 ? 1 : 0}>
        <path d="M0 55 L-26 12 H26 Z" fill={T} stroke={T} strokeWidth={6} strokeLinejoin="round" />
      </g>
    </Capa>
  );
};

export const REGISTRO_019: Record<string, React.FC<any>> = {
  calendarioH: CalendarioH, nominaH: NominaH, sobreCarpetaH: SobreCarpetaH, pastillaH: PastillaH, llaveBilleteH: LlaveBilleteH, fechasH: FechasH,
  mazoH: MazoH, contratoH: ContratoH, sancionH: SancionH, casillaSSH: CasillaSSH, puertaH: PuertaH, sillasH: SillasH, balanzaH: BalanzaH,
  resolucionH: ResolucionH, acuerdoH: AcuerdoH, claveH: ClaveH, lineaCeoeH: LineaCeoeH, lupaH: LupaH, novH: NovH,
};
