import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {miles, useSalida} from './util';

/**
 * 065 · EPA, dos titulares. Todos los tiempos (en, tasaEn...) son segundos desde el inicio de la ESCENA.
 * flechasEpa (gancho), mitadesEpa (dos calendarios con cifras), barrasTrimEpa (3T 2022-2026 con eje en cero),
 * ondaEpa (estacionalidad), tarjetaEpa (+0,14 %), maletinEpa (ocupados).
 */
const ease = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
const pop = (t: number, a: number) => interpolate(t, [a, a + 0.18, a + 0.34], [0, 1.06, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const usa = () => { const fr = useCurrentFrame(); const {fps} = useVideoConfig(); return fr / fps; };
const lienzo = (children: React.ReactNode, s = 1) => (
  <div style={{opacity: s}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>{children}</svg>
  </div>
);
const TXT = {fontFamily: F.texto, fontWeight: 700} as const;
const CIF = {fontFamily: F.cifra, fontWeight: 700} as const;

/** Gancho: dos flechas salen del mismo punto; cifras con golpe desde el fotograma 0. */
export const FlechasEpa: React.FC<{dividir?: number; hasta?: number}> = ({dividir = 1.2, hasta}) => {
  const t = usa();
  const s = useSalida(hasta);
  const k = ease(t, 0, 0.8);
  const kd = ease(t, dividir, dividir + 0.5);
  const pa = 0.55 + 0.45 * pop(t, 0.0) + (pop(t, 0) > 1 ? 0 : 0);
  const pb = 0.55 + 0.45 * pop(t, 0.35);
  const vaiven = Math.sin(t * 2.6) * 5;
  const pathA = 'M540 960 C 400 960, 300 930, 300 830';
  const pathB = 'M540 960 C 680 960, 740 990, 740 1070';
  return lienzo(
    <g>
      <line x1={540} y1={480} x2={540} y2={480 + 420 * kd} stroke={C.piedra} strokeWidth={6} strokeDasharray="14 12" />
      <g transform={`translate(0 ${vaiven * 0.5})`}>
        <path d={pathA} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} fill="none" stroke={C.tinta} strokeWidth={30} strokeLinecap="round" />
        <path d={pathB} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} fill="none" stroke={C.tinta} strokeWidth={34} strokeLinecap="round" />
        <path d={pathB} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} fill="none" stroke={C.mostaza} strokeWidth={20} strokeLinecap="round" />
        {k > 0.9 ? <polygon points="300,770 252,840 348,840" fill={C.tinta} /> : null}
        {k > 0.9 ? <polygon points="740,1120 692,1050 788,1050" fill={C.mostaza} stroke={C.tinta} strokeWidth={8} strokeLinejoin="round" /> : null}
        <circle cx={540} cy={960} r={24} fill={C.tinta} />
      </g>
      <g transform={`translate(300 0) scale(${pa}) translate(-300 0)`}>
        <text x={300} y={610} textAnchor="middle" {...CIF} fontSize={84} fill={C.tinta}>+95.900</text>
        <text x={300} y={676} textAnchor="middle" {...TXT} fontSize={64} fill={C.tinta}>EN EL</text>
        <text x={300} y={742} textAnchor="middle" {...TXT} fontSize={64} fill={C.tinta}>TRIMESTRE</text>
      </g>
      <g transform={`translate(740 0) scale(${pb}) translate(-740 0)`} opacity={Math.min(1, pb * 1.2)}>
        <text x={740} y={610} textAnchor="middle" {...CIF} fontSize={84} fill={C.tinta}>−21.900</text>
        <rect x={560} y={626} width={360} height={14} fill={C.mostaza} />
        <text x={740} y={710} textAnchor="middle" {...TXT} fontSize={64} fill={C.tinta}>EN UN AÑO</text>
      </g>
    </g>,
    s,
  );
};

const Calendario: React.FC<{cx: number; y: number; cols: number; filas: number; k: number}> = ({cx, y, cols, filas, k}) => {
  const w = 200, h = 170;
  const cw = (w - 30) / cols, ch = (h - 36 - 24) / filas;
  return (
    <g transform={`translate(${cx - w / 2} ${y}) scale(${k || 0.001})`}>
      <rect x={0} y={0} width={w} height={h} rx={18} fill={C.crema} stroke={C.tinta} strokeWidth={7} />
      <path d={`M0 18 Q0 0 18 0 H${w - 18} Q${w} 0 ${w} 18 V36 H0 Z`} fill={C.tinta} />
      {Array.from({length: cols * filas}).map((_, i) => (
        <rect key={i} x={15 + (i % cols) * cw + 3} y={46 + Math.floor(i / cols) * ch + 3} width={cw - 6} height={ch - 6} rx={4} fill={C.mostaza} stroke={C.tinta} strokeWidth={2} />
      ))}
    </g>
  );
};

/** Dos mitades: trimestre (izquierda) y año (derecha) con su cifra; tasa de paro abajo. */
export const MitadesEpa: React.FC<{izq?: number; izqFig?: number; der?: number; derFig?: number; tasaEn?: number; hasta?: number}> = ({izq = 0.1, izqFig = 1.5, der = 4.3, derFig = 5.4, tasaEn = 6.2, hasta}) => {
  const t = usa();
  const s = useSalida(hasta);
  const vaiven = Math.sin(t * 2.6) * 6;
  const kd = ease(t, 0, 0.4);
  const ke = (a: number) => ease(t, a, a + 0.35);
  const fig = (a: number) => pop(t, a);
  const kt = ease(t, tasaEn, tasaEn + 0.4);
  return lienzo(
    <g>
      <line x1={540} y1={340} x2={540} y2={340 + 640 * kd} stroke={C.piedra} strokeWidth={6} strokeDasharray="14 12" />
      <g transform={`translate(0 ${vaiven})`}>
        <Calendario cx={300} y={340} cols={3} filas={1} k={ke(izq)} />
        <Calendario cx={750} y={340} cols={4} filas={3} k={ke(der)} />
      </g>
      <g opacity={ke(izq)}>
        <text x={300} y={600} textAnchor="middle" {...TXT} fontSize={64} fill={C.tinta}>VS.</text>
        <text x={300} y={664} textAnchor="middle" {...TXT} fontSize={64} fill={C.tinta}>TRIMESTRE</text>
        <text x={300} y={728} textAnchor="middle" {...TXT} fontSize={64} fill={C.tinta}>ANTERIOR</text>
      </g>
      <g opacity={ke(der)}>
        <text x={750} y={600} textAnchor="middle" {...TXT} fontSize={64} fill={C.tinta}>VS.</text>
        <text x={750} y={664} textAnchor="middle" {...TXT} fontSize={64} fill={C.tinta}>3T‑2025</text>
      </g>
      {t >= izqFig ? (
        <g transform={`translate(300 0) scale(${fig(izqFig)}) translate(-300 0)`}>
          <text x={300} y={850} textAnchor="middle" {...CIF} fontSize={84} fill={C.tinta}>+95.900</text>
          <text x={300} y={920} textAnchor="middle" {...TXT} fontSize={64} fill={C.tinta}>parados</text>
        </g>
      ) : null}
      {t >= derFig ? (
        <g transform={`translate(750 0) scale(${fig(derFig)}) translate(-750 0)`}>
          <text x={750} y={850} textAnchor="middle" {...CIF} fontSize={84} fill={C.tinta}>−21.900</text>
          <rect x={570} y={866} width={360} height={12} fill={C.mostaza} />
          <text x={750} y={940} textAnchor="middle" {...TXT} fontSize={64} fill={C.tinta}>parados</text>
        </g>
      ) : null}
      {kt > 0 ? (
        <g opacity={kt} transform={`translate(0 ${(1 - kt) * 30})`}>
          <rect x={150} y={1000} width={780} height={92} rx={24} fill={C.tinta} />
          <text x={540} y={1066} textAnchor="middle" {...TXT} fontSize={64} fill={C.crema}>Tasa de paro: 10,18 %</text>
        </g>
      ) : null}
    </g>,
    s,
  );
};

const DATOS = [
  {a: '2022', v: 31.1}, {a: '2023', v: 86.3}, {a: '2024', v: -1.2}, {a: '2025', v: 60.1}, {a: '2026', v: 95.9},
];
const coma1 = (v: number) => Math.abs(v).toFixed(1).replace('.', ',');

/** Barras del paro en cada tercer trimestre (miles) con eje en cero. `en`<0: todo visible desde el principio. */
export const BarrasTrimEpa: React.FC<{en?: number; paso?: number; base?: number; hMax?: number; hasta?: number}> = ({en = 0.1, paso = 0.55, base = 1000, hMax = 330, hasta}) => {
  const t = usa();
  const s = useSalida(hasta);
  const vaiven = Math.sin(t * 2.6) * 5;
  const sc = hMax / 95.9;
  const cs = [170, 340, 510, 680, 850];
  return lienzo(
    <g transform={`translate(0 ${vaiven})`}>
      <line x1={60} y1={base} x2={950} y2={base} stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />
      {DATOS.map((d, i) => {
        const e0 = en < 0 ? -1 : en + i * paso;
        const k = en < 0 ? 1 : ease(t, e0, e0 + 0.6);
        const h = Math.abs(d.v) * sc * k;
        const col = i === 4 ? C.mostaza : C.tinta;
        const y = d.v >= 0 ? base - h : base;
        return (
          <g key={d.a} opacity={en < 0 ? 1 : Math.min(1, k * 4)}>
            <rect x={cs[i] - 65} y={y} width={130} height={Math.max(h, 0.001)} fill={col} stroke={C.tinta} strokeWidth={5} />
            {k > 0.5 ? <text x={cs[i]} y={base - (d.v >= 0 ? h : 0) - 22} textAnchor="middle" {...CIF} fontSize={64} fill={C.tinta}>{`${d.v < 0 ? '−' : '+'}${coma1(d.v)}`}</text> : null}
            <text x={cs[i]} y={base + 76} textAnchor="middle" {...TXT} fontSize={64} fill={C.tinta}>{d.a}</text>
          </g>
        );
      })}
    </g>,
    s,
  );
};

/** Onda estacional de 12 meses repetida dos veces. */
export const OndaEpa: React.FC<{en?: number; dur?: number; y?: number; hasta?: number}> = ({en = 0.2, dur = 2.4, y = 545, hasta}) => {
  const t = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + dur);
  const x0 = 100, x1 = 880, amp = 38;
  const N = 120;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const x = x0 + ((x1 - x0) * i) / N;
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${(y - Math.sin((i / N) * Math.PI * 4 - Math.PI / 2) * amp).toFixed(1)}`);
  }
  const xh = x0 + (x1 - x0) * k;
  const yh = y - Math.sin(k * Math.PI * 4 - Math.PI / 2) * amp;
  return lienzo(
    <g>
      <path d={pts.join(' ')} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} fill="none" stroke={C.mostaza} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      {k > 0 && k < 1 ? <circle cx={xh} cy={yh} r={16} fill={C.tinta} /> : null}
      {k >= 1 ? <circle cx={x1} cy={y - Math.sin(Math.PI * 4 - Math.PI / 2) * amp} r={16} fill={C.tinta} /> : null}
    </g>,
    s,
  );
};

/** Tarjeta aparte "+0,14 %": la onda se aplana hasta una línea recta. */
export const TarjetaEpa: React.FC<{y?: number; en?: number; hasta?: number}> = ({y = 560, en = 0.1, hasta}) => {
  const t = usa();
  const s = useSalida(hasta);
  const p = pop(t, en);
  const plano = ease(t, en + 0.6, en + 2.2);
  const flota = Math.sin(t * 2.6) * 6;
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) pts.push(`${i === 0 ? 'M' : 'L'}${(200 + (i * 600) / 60).toFixed(1)} ${(y + 300 - Math.sin((i / 60) * Math.PI * 4) * 34 * (1 - plano)).toFixed(1)}`);
  return lienzo(
    <g transform={`translate(0 ${flota}) translate(510 ${y + 170}) scale(${p || 0.001}) translate(-510 ${-(y + 170)})`}>
      <rect x={120} y={y} width={780} height={340} rx={36} fill={C.mostaza} stroke={C.tinta} strokeWidth={8} />
      <text x={510} y={y + 190} textAnchor="middle" fontFamily={F.titular} fontSize={140} fill={C.tinta}>+0,14 %</text>
      <path d={pts.join(' ')} fill="none" stroke={C.tinta} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
    </g>,
    s,
  );
};

/** Maletín con contador de ocupados (etiqueta desde el primer fotograma, fuera del componente) y total debajo. */
export const MaletinEpa: React.FC<{cuentaEn?: number; cuentaDur?: number; totalEn?: number; hasta?: number}> = ({cuentaEn = 0.9, cuentaDur = 1.8, totalEn = 3.0, hasta}) => {
  const t = usa();
  const s = useSalida(hasta);
  const p = pop(t, 0.1);
  const vaiven = Math.sin(t * 2.8) * 7;
  const v = Math.round(465500 * ease(t, cuentaEn, cuentaEn + cuentaDur));
  const kt = ease(t, totalEn, totalEn + 0.4);
  return lienzo(
    <g>
      <g transform={`translate(0 ${vaiven}) translate(510 680) scale(${1.35 * (p || 0.001)}) translate(-510 -590)`}>
        <path d="M430 500 V450 Q430 420 460 420 H560 Q590 420 590 450 V500" fill="none" stroke={C.tinta} strokeWidth={18} strokeLinecap="round" />
        <rect x={340} y={480} width={340} height={220} rx={28} fill={C.mostaza} stroke={C.tinta} strokeWidth={8} />
        <line x1={340} y1={580} x2={680} y2={580} stroke={C.tinta} strokeWidth={8} />
        <rect x={485} y={560} width={50} height={40} rx={8} fill={C.crema} stroke={C.tinta} strokeWidth={6} />
      </g>
      {t >= cuentaEn ? <text x={510} y={960} textAnchor="middle" {...CIF} fontSize={110} fill={C.tinta}>{`+${miles(v)}`}</text> : null}
      {kt > 0 ? (
        <g opacity={kt} transform={`translate(0 ${(1 - kt) * 24})`}>
          <text x={510} y={1070} textAnchor="middle" {...TXT} fontSize={64} fill={C.tinta}>22.852.600 ocupados</text>
        </g>
      ) : null}
    </g>,
    s,
  );
};

export const REGISTRO_065: Record<string, React.FC<any>> = {
  flechasEpa: FlechasEpa, mitadesEpa: MitadesEpa, barrasTrimEpa: BarrasTrimEpa, ondaEpa: OndaEpa, tarjetaEpa: TarjetaEpa, maletinEpa: MaletinEpa,
};
