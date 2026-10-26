import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';

/** Componentes de la pieza 009 (cambio de hora). Todo en coordenadas del lienzo 1080x1920; `en`/`hasta`/tiempos en segundos de la ESCENA. */
const T = C.tinta;
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const cl = (x: number) => Math.min(1, Math.max(0, x));
const easeIO = (u: number) => u * u * (3 - 2 * u);
const back = (u: number) => { const c1 = 1.70158; const v = cl(u) - 1; return cl(u) <= 0 ? 0 : 1 + (c1 + 1) * v * v * v + c1 * v * v; };
const useT = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return f / fps; };
const polar = (x: number, y: number, R: number, a: number): [number, number] => [x + R * Math.sin((a * Math.PI) / 180), y - R * Math.cos((a * Math.PI) / 180)];

const Capa: React.FC<{en?: number; hasta?: number; children: React.ReactNode}> = ({en = 0, hasta, children}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const f = useCurrentFrame();
  const bob = 12 * Math.sin((f / 30) * 2.2); // movimiento suave continuo: nunca más de 3 s de quietud
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(p, 1) * s, transform: `translateY(${bob}px)`}}>{children}</svg>;
};

const Texto: React.FC<{x: number; y: number; t: string; size?: number; anchor?: 'start' | 'middle' | 'end'; fill?: string; mono?: boolean; titular?: boolean}> = ({x, y, t, size = 64, anchor = 'middle', fill = T, mono, titular}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={mono ? F.cifra : titular ? F.titular : F.texto} fontWeight={700} fontSize={size} fill={fill}>{t}</text>
);

const Sol: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => (
  <g>
    {Array.from({length: 8}).map((_, i) => { const [a, b] = polar(x, y, r * 1.35, i * 45); const [c, d] = polar(x, y, r * 1.75, i * 45); return <path key={i} d={`M${a} ${b} L${c} ${d}`} {...sw} strokeWidth={Math.max(4, r / 6)} />; })}
    <circle cx={x} cy={y} r={r} fill={C.mostaza} {...sw} strokeWidth={Math.max(4, r / 6)} />
  </g>
);
const Luna: React.FC<{x: number; y: number; r: number; fill?: string}> = ({x, y, r, fill = C.crema}) => (
  <path d={`M${x + r * 0.2} ${y - r} A${r} ${r} 0 1 0 ${x + r * 0.2} ${y + r} A${r * 0.72} ${r * 0.72} 0 1 1 ${x + r * 0.2} ${y - r} Z`} fill={fill} stroke={T} strokeWidth={Math.max(4, r / 7)} strokeLinejoin="round" />
);

const Cara: React.FC<{x: number; y: number; r: number; hora: number; sw2?: number}> = ({x, y, r, hora, sw2}) => {
  const s = sw2 ?? Math.max(4, r / 22);
  const [hx, hy] = polar(x, y, r * 0.5, (hora % 12) * 30);
  const [mx, my] = polar(x, y, r * 0.76, 0);
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={C.crema} stroke={T} strokeWidth={s * 1.5} />
      {Array.from({length: 12}).map((_, i) => { const [a, b] = polar(x, y, r * 0.86, i * 30); const [c, d] = polar(x, y, r * (i % 3 === 0 ? 0.7 : 0.78), i * 30); return <path key={i} d={`M${a} ${b} L${c} ${d}`} stroke={T} strokeWidth={s} strokeLinecap="round" />; })}
      <path d={`M${x} ${y} L${mx} ${my}`} stroke={T} strokeWidth={s * 1.3} strokeLinecap="round" />
      <path d={`M${x} ${y} L${hx} ${hy}`} stroke={T} strokeWidth={s * 1.7} strokeLinecap="round" />
      <circle cx={x} cy={y} r={r * 0.07} fill={C.mostaza} stroke={T} strokeWidth={s * 0.7} />
    </g>
  );
};

/** Reloj de pared. `hora` inicial; si `salto` (s), la aguja retrocede `delta` horas en 0,3 s con "tic" y flecha curva turquesa. */
export const RelojH: React.FC<{x?: number; y?: number; r?: number; hora?: number; salto?: number; delta?: number; flecha?: boolean; en?: number; hasta?: number; pulso?: boolean}> = ({x = 540, y = 760, r = 200, hora = 3, salto, delta = 1, flecha = true, en = 0, hasta, pulso}) => {
  const t = useT();
  const u = salto === undefined ? 0 : easeIO(cl((t - salto) / 0.3));
  const h = hora - delta * u;
  const R = r + 34;
  const [x1, y1] = polar(x, y, R, 62);
  const [x2, y2] = polar(x, y, R, -62);
  const prog = salto === undefined ? 0 : cl((t - salto) / 0.5);
  const tic = salto !== undefined && t >= salto && t < salto + 0.5 ? 1 + 0.05 * Math.sin(((t - salto) / 0.5) * Math.PI) : 1;
  const bal = pulso ? 1 + 0.025 * Math.sin(t * 5) : 1;
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x} ${y}) scale(${tic * bal}) translate(${-x} ${-y})`}>
        <Cara x={x} y={y} r={r} hora={h} />
      </g>
      {flecha && salto !== undefined ? (
        <g>
          <path d={`M${x1} ${y1} A${R} ${R} 0 0 0 ${x2} ${y2}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog} fill="none" stroke={C.turquesa} strokeWidth={Math.max(12, r / 14)} strokeLinecap="round" />
          {prog > 0.9 ? <path d="M-22 -26 L26 0 L-22 26 Z" fill={C.turquesa} transform={`translate(${x2} ${y2}) rotate(${-62 - 90 + 180 - 0})`} /> : null}
        </g>
      ) : null}
    </Capa>
  );
};

/** Hemiciclo de puntos gris piedra con un check grande (turquesa; pasa a gris en `grisEn`). */
export const HemiH: React.FC<{x?: number; y?: number; w?: number; checkEn?: number; grisEn?: number; en?: number; hasta?: number}> = ({x = 740, y = 900, w = 400, checkEn = 0.5, grisEn, en = 0, hasta}) => {
  const t = useT();
  const R = w / 2;
  const filas = [1, 0.8, 0.6];
  const dr = w * 0.035;
  const gris = grisEn !== undefined && t >= grisEn;
  const s = back((t - checkEn) / 0.4);
  const col = gris ? C.piedra : C.turquesa;
  return (
    <Capa en={en} hasta={hasta}>
      {filas.map((f, i) => {
        const n = Math.round((Math.PI * R * f) / (dr * 2.7));
        return Array.from({length: n}).map((_, k) => { const a = -90 + (180 * k) / (n - 1); const [px, py] = polar(x, y, R * f, a); return <circle key={`${i}-${k}`} cx={px} cy={py} r={dr} fill={C.piedra} />; });
      })}
      <g transform={`translate(${x} ${y - w * 0.18}) scale(${s})`}>
        <circle r={w * 0.24} fill={col} {...sw} />
        <path d={`M${-w * 0.12} ${w * 0.0} L${-w * 0.03} ${w * 0.09} L${w * 0.13} ${-w * 0.09}`} fill="none" stroke={C.crema} strokeWidth={w * 0.07} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Capa>
  );
};

/** Buzón con sobres que caen y cifra grande "4,6 M" (sin cuenta: se da el dato de golpe). */
export const SobresH: React.FC<{x?: number; y?: number; cifra?: string; xCifra?: number; yCifra?: number; en?: number; cifraEn?: number; hasta?: number}> = ({x = 280, y = 900, cifra = '4,6 M', xCifra = 740, yCifra = 760, en = 0, cifraEn = 0.1, hasta}) => {
  const t = useT();
  const n = 10;
  return (
    <Capa en={en} hasta={hasta}>
      {/* buzón */}
      <rect x={x - 110} y={y - 70} width={220} height={150} rx={30} fill={C.mostaza} {...sw} />
      <rect x={x - 70} y={y - 36} width={140} height={16} rx={8} fill={T} />
      <rect x={x - 20} y={y + 80} width={40} height={90} fill={T} />
      {Array.from({length: n}).map((_, i) => {
        const t0 = 0.1 + i * 0.22;
        const u = cl((t - t0) / 0.55);
        if (u <= 0 || u >= 1) return null;
        const cx = x + ((i % 3) - 1) * 28;
        const cy = y - 330 + (y - 52 - (y - 330)) * u * u;
        return (
          <g key={i} transform={`translate(${cx} ${cy}) rotate(${(i % 2 ? 1 : -1) * 14 * (1 - u)})`} opacity={u > 0.85 ? (1 - u) / 0.15 : 1}>
            <rect x={-42} y={-28} width={84} height={56} rx={8} fill={C.crema} {...sw} strokeWidth={5} />
            <path d="M-42 -24 L0 6 L42 -24" fill="none" stroke={T} strokeWidth={5} strokeLinejoin="round" />
          </g>
        );
      })}
      <g transform={`translate(${xCifra} ${yCifra}) scale(${back((t - cifraEn) / 0.4)})`}>
        <Texto x={0} y={0} t={cifra} size={130} mono />
      </g>
    </Capa>
  );
};

/** Barra horizontal 0-100 %: 84 % turquesa y 16 % gris piedra. */
export const Barra84H: React.FC<{y?: number; en?: number; crece?: number; hasta?: number}> = ({y = 640, en = 0, crece = 0.5, hasta}) => {
  const t = useT();
  const x0 = 110, W = 760, H = 110;
  const k = easeIO(cl((t - crece) / 1.1));
  const a = 0.84 * W * k;
  const b = 0.16 * W * k;
  return (
    <Capa en={en} hasta={hasta}>
      <rect x={x0} y={y} width={a} height={H} fill={C.turquesa} />
      <rect x={x0 + a} y={y} width={b} height={H} fill={C.piedra} />
      <rect x={x0} y={y} width={W} height={H} fill="none" {...sw} strokeWidth={5} />
      {[0, 50, 100].map((v) => <g key={v}><path d={`M${x0 + (v / 100) * W} ${y + H} v16`} {...sw} strokeWidth={5} /><Texto x={x0 + (v / 100) * W} y={y + H + 58} t={`${v} %`} size={40} /></g>)}
      <g opacity={cl((t - crece - 0.8) / 0.3)}>
        <Texto x={x0} y={y + H + 150} t="84 % quitarlo" anchor="start" />
        <Texto x={x0 + W} y={y + H + 235} t="16 % resto" anchor="end" fill={C.tinta} />
        <rect x={x0 + W - 360} y={y + H + 190} width={0} height={0} />
      </g>
    </Capa>
  );
};

/** Barras de participación por país, eje 0-4 % de los habitantes. */
export const PaisesH: React.FC<{y?: number; alemaniaEn?: number; espanaEn?: number; en?: number; hasta?: number}> = ({y = 600, alemaniaEn = 0.5, espanaEn, en = 0, hasta}) => {
  const t = useT();
  const x0 = 110, W = 800, H = 96;
  const bar = (v: number, t0: number) => (W * v / 4) * easeIO(cl((t - t0) / 0.9));
  const aw = bar(3.79, alemaniaEn);
  const ew = espanaEn === undefined ? 0 : bar(0.19, espanaEn);
  return (
    <Capa en={en} hasta={hasta}>
      <Texto x={x0} y={y} t="Alemania" anchor="start" />
      <rect x={x0} y={y + 20} width={aw} height={H} fill={T} />
      {aw > 500 ? <Texto x={x0 + 24} y={y + 20 + 70} t="3,79 %" anchor="start" fill={C.crema} mono /> : null}
      {espanaEn !== undefined ? (
        <g opacity={t >= espanaEn ? 1 : 0}>
          <Texto x={x0} y={y + 190} t="España" anchor="start" />
          <rect x={x0} y={y + 210} width={ew} height={H} fill={C.piedra} />
          {ew > 20 ? <Texto x={x0 + ew + 24} y={y + 210 + 70} t="0,19 %" anchor="start" mono /> : null}
        </g>
      ) : null}
      <path d={`M${x0} ${y + 20} V${y + 330} H${x0 + W}`} fill="none" {...sw} strokeWidth={5} />
      {[0, 1, 2, 3, 4].map((v) => <g key={v}><path d={`M${x0 + (v / 4) * W} ${y + 330} v14`} {...sw} strokeWidth={5} /><Texto x={x0 + (v / 4) * W} y={y + 392} t={`${v} %`} size={40} /></g>)}
    </Capa>
  );
};

const ComisionIcono: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s / 200}) translate(-100 -100)`}>
    <path d="M14 78 L100 18 L186 78 Z" fill={C.mostaza} {...sw} />
    {[40, 74, 108, 142].map((cx) => <rect key={cx} x={cx} y={88} width={20} height={70} fill={C.crema} {...sw} strokeWidth={5} />)}
    <rect x={20} y={160} width={160} height={22} rx={4} fill={C.crema} {...sw} />
    <circle cx={100} cy={58} r={10} fill={T} />
  </g>
);

/** Edificio de la Comisión y documento (estrella gris piedra) que avanza hacia la derecha. */
export const ProponeH: React.FC<{x?: number; y?: number; sale?: number; haciaX?: number; en?: number; hasta?: number}> = ({x = 230, y = 660, sale = 0.8, haciaX = 760, en = 0, hasta}) => {
  const t = useT();
  const u = easeIO(cl((t - sale) / 1.6));
  const dx = x + 150 + (haciaX - x - 150) * u;
  return (
    <Capa en={en} hasta={hasta}>
      <ComisionIcono x={x} y={y} s={300} />
      <g transform={`translate(${dx} ${y}) rotate(${(1 - u) * -8})`} opacity={cl((t - sale + 0.2) / 0.3)}>
        <rect x={-85} y={-115} width={170} height={230} rx={14} fill={C.crema} {...sw} />
        <path d="M0 -84 L12 -56 L42 -54 L18 -36 L26 -6 L0 -22 L-26 -6 L-18 -36 L-42 -54 L-12 -56 Z" fill={C.piedra} {...sw} strokeWidth={5} />
        {[28, 54, 80].map((yy) => <path key={yy} d={`M-50 ${yy} H50`} stroke={T} strokeWidth={7} strokeLinecap="round" opacity={0.6} />)}
      </g>
    </Capa>
  );
};

/** Hemiciclo de 653 puntos que se rellena en tres tramos proporcionales: 410, 192, 51. */
export const VotosH: React.FC<{x?: number; y?: number; R?: number; llenaEn?: number; dur?: number; en?: number; hasta?: number}> = ({x = 540, y = 1100, R = 330, llenaEn = 0.3, dur = 2.4, en = 0, hasta}) => {
  const t = useT();
  const filas = 9;
  const rin = 0.42;
  const rad = Array.from({length: filas}).map((_, i) => R * (1 - ((1 - rin) * i) / (filas - 1)));
  const suma = rad.reduce((a, b) => a + b, 0);
  const cuentas = rad.map((r) => Math.round((653 * r) / suma));
  cuentas[0] += 653 - cuentas.reduce((a, b) => a + b, 0);
  const pts: {px: number; py: number; ang: number}[] = [];
  rad.forEach((r, i) => { const n = cuentas[i]; for (let k = 0; k < n; k++) { const a = -90 + (180 * k) / (n - 1); const [px, py] = polar(x, y, r, a); pts.push({px, py, ang: a + i * 0.0001}); } });
  pts.sort((a, b) => a.ang - b.ang);
  const lleno = Math.floor(653 * easeIO(cl((t - llenaEn) / dur)));
  const dr = R * 0.0225;
  return (
    <Capa en={en} hasta={hasta}>
      {pts.map((p, i) => {
        const on = i < lleno;
        const fill = !on ? C.piedra : i < 410 ? C.turquesa : i < 602 ? '#5A6478' : C.crema;
        return <circle key={i} cx={p.px} cy={p.py} r={dr} fill={fill} stroke={on && i >= 602 ? T : 'none'} strokeWidth={2.5} opacity={on ? 1 : 0.35} />;
      })}
    </Capa>
  );
};

/** Reloj que se parte en dos mitades iguales: sol (VERANO) y luna (INVIERNO). */
export const PartidoH: React.FC<{x?: number; y?: number; r?: number; partidoEn?: number; etiquetas?: boolean; yEt?: number; en?: number; hasta?: number}> = ({x = 540, y = 650, r = 200, partidoEn = 0.5, etiquetas = true, yEt, en = 0, hasta}) => {
  const t = useT();
  const g = 16 * easeIO(cl((t - partidoEn) / 0.35));
  const partido = t >= partidoEn;
  const yE = yEt ?? y + r + 90;
  return (
    <Capa en={en} hasta={hasta}>
      {!partido ? <Cara x={x} y={y} r={r} hora={3} /> : (
        <g>
          <g transform={`translate(${-g} 0)`}>
            <path d={`M${x} ${y - r} A${r} ${r} 0 0 0 ${x} ${y + r} Z`} fill={C.crema} {...sw} />
            <Sol x={x - r * 0.5} y={y} r={r * 0.2} />
          </g>
          <g transform={`translate(${g} 0)`}>
            <path d={`M${x} ${y - r} A${r} ${r} 0 0 1 ${x} ${y + r} Z`} fill={T} {...sw} />
            <Luna x={x + r * 0.5} y={y} r={r * 0.24} />
          </g>
        </g>
      )}
      {etiquetas && partido ? (
        <g opacity={cl((t - partidoEn - 0.2) / 0.3)}>
          <Texto x={x - 190} y={yE} t="VERANO" />
          <Texto x={x + 200} y={yE} t="INVIERNO" />
        </g>
      ) : null}
    </Capa>
  );
};

/** Dos casillas: PARLAMENTO (check) y CONSEJO (vacía), con flecha LEY discontinua a medias o detenida. */
export const CasillasH: React.FC<{y?: number; parada?: boolean; arena?: boolean; checkEn?: number; en?: number; hasta?: number}> = ({y = 560, parada, checkEn = 0.4, en = 0, hasta}) => {
  const t = useT();
  const bh = 280, bwL = 480, bwR = 400;
  const cx1 = 60 + bwL / 2, cx2 = 960 - bwR / 2;
  const s = back((t - checkEn) / 0.4);
  const ay = y + bh + 110;
  const fin = cx1 + (cx2 - cx1) * 0.55;
  const dibuja = easeIO(cl((t - 0.5) / 0.9));
  const xe = cx1 + (fin - cx1) * dibuja;
  return (
    <Capa en={en} hasta={hasta}>
      <rect x={60} y={y} width={bwL} height={bh} rx={26} fill={C.crema} {...sw} />
      <rect x={956 - bwR} y={y} width={bwR - 4} height={bh} rx={26} fill={C.crema} {...sw} strokeDasharray="14 12" />
      <Texto x={cx1} y={y + 82} t="PARLAMENTO" size={64} />
      <Texto x={cx2} y={y + 82} t="CONSEJO" size={64} />
      <g transform={`translate(${cx1} ${y + 192}) scale(${s})`}>
        <circle r={60} fill={C.turquesa} {...sw} />
        <path d="M-28 2 L-8 24 L30 -22" fill="none" stroke={C.crema} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <rect x={cx2 - 60} y={y + 132} width={120} height={120} rx={14} fill="none" stroke={C.piedra} strokeWidth={8} strokeDasharray="12 12" />
      <Texto x={540} y={ay - 36} t="LEY" />
      <path d={`M${cx1} ${ay} H${xe}`} stroke={T} strokeWidth={12} strokeDasharray="26 20" strokeLinecap="round" fill="none" />
      {parada ? <path d={`M${fin + 14} ${ay - 36} V${ay + 36}`} stroke={C.teja} strokeWidth={14} strokeLinecap="round" /> : null}
    </Capa>
  );
};

/** Mesa redonda con 27 sillas iguales. `ilumina` (s): las sillas se encienden de forma alterna. */
export const MesaH: React.FC<{x?: number; y?: number; r?: number; ilumina?: number; en?: number; hasta?: number}> = ({x = 540, y = 960, r = 80, ilumina, en = 0, hasta}) => {
  const t = useT();
  const ciclo = ilumina !== undefined && t >= ilumina ? Math.floor((t - ilumina) / 0.45) : -1;
  return (
    <Capa en={en} hasta={hasta}>
      {Array.from({length: 27}).map((_, i) => {
        const [px, py] = polar(x, y, r * 1.55, (360 * i) / 27);
        const on = ciclo >= 0 && (i + ciclo) % 2 === 0;
        return <circle key={i} cx={px} cy={py} r={r * 0.2} fill={on ? C.mostaza : C.piedra} {...sw} strokeWidth={4} />;
      })}
      <circle cx={x} cy={y} r={r} fill={C.tinta} />
      <circle cx={x} cy={y} r={r * 0.82} fill="none" stroke={C.crema} strokeWidth={3} opacity={0.5} />
    </Capa>
  );
};

const Carpeta: React.FC<{x: number; y: number; s: number; lupa?: boolean}> = ({x, y, s, lupa = true}) => (
  <g transform={`translate(${x} ${y}) scale(${s / 200}) translate(-100 -100)`}>
    <path d="M20 50 h54 l16 18 h90 a8 8 0 0 1 8 8 v92 a8 8 0 0 1 -8 8 h-160 a8 8 0 0 1 -8 -8 v-110 a8 8 0 0 1 8 -8z" fill={C.mostaza} {...sw} />
    <text x="96" y="148" textAnchor="middle" fontFamily={F.titular} fontSize="70" fill={T}>?</text>
    {lupa ? <g><circle cx="140" cy="130" r="32" fill={C.crema} fillOpacity={0.6} {...sw} /><path d="M163 154 L192 186" {...sw} strokeWidth={12} /></g> : null}
  </g>
);

/** Carpeta con lupa; opcionalmente se desliza hacia (aX, aY). */
export const CarpetaH: React.FC<{x?: number; y?: number; tam?: number; a?: {x: number; y: number; en: number; dur: number}; en?: number; hasta?: number}> = ({x = 540, y = 700, tam = 260, a, en = 0, hasta}) => {
  const t = useT();
  const u = a ? easeIO(cl((t - a.en) / a.dur)) : 0;
  return (
    <Capa en={en} hasta={hasta}>
      <Carpeta x={x + (a ? (a.x - x) * u : 0)} y={y + (a ? (a.y - y) * u : 0)} s={tam} />
    </Capa>
  );
};

// Contorno muy simplificado de Europa (800x520) para el mosaico
const EUROPA: [number, number][] = [[120, 60], [250, 30], [340, 70], [430, 20], [540, 70], [610, 20], [720, 50], [790, 140], [740, 220], [785, 310], [700, 390], [620, 360], [600, 450], [520, 390], [470, 450], [420, 370], [340, 390], [300, 480], [190, 505], [120, 440], [110, 360], [170, 300], [80, 250], [100, 150]];

/** Mapa plano de Europa en gris piedra que se rellena de golpe de manchas (mosaico) y se cubre con un aspa. */
export const MosaicoH: React.FC<{x?: number; y?: number; w?: number; mosaicoEn?: number; aspaEn?: number; en?: number; hasta?: number}> = ({x = 540, y = 780, w = 800, mosaicoEn = 0.8, aspaEn = 2.6, en = 0, hasta}) => {
  const t = useT();
  const k = w / 800;
  const pts = EUROPA.map(([a, b]) => `${a},${b}`).join(' ');
  const tile = 44;
  const cols = [C.crema, C.mostaza, C.turquesa];
  const tiles: React.ReactNode[] = [];
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let i = 0; i < 800 / tile; i++) for (let j = 0; j < 520 / tile; j++) {
    const c = cols[Math.floor(rnd() * 3)];
    const d = mosaicoEn + rnd() * 0.15;
    tiles.push(<rect key={`${i}-${j}`} x={i * tile} y={j * tile} width={tile} height={tile} fill={c} stroke={T} strokeWidth={2} opacity={t >= d ? 1 : 0} />);
  }
  const ua = easeIO(cl((t - aspaEn) / 0.35));
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x - w / 2} ${y - 260 * k}) scale(${k})`}>
        <clipPath id="clipEuropa"><polygon points={pts} /></clipPath>
        <polygon points={pts} fill={C.piedra} />
        <g clipPath="url(#clipEuropa)">{tiles}</g>
        <polygon points={pts} fill="none" stroke={T} strokeWidth={8} strokeLinejoin="round" />
        <path d={`M150 70 L${150 + 500 * ua} ${70 + 380 * ua}`} stroke={T} strokeWidth={26} strokeLinecap="round" />
        <path d={`M650 70 L${650 - 500 * ua} ${70 + 380 * ua}`} stroke={T} strokeWidth={26} strokeLinecap="round" />
      </g>
    </Capa>
  );
};

const FRANCIA: [number, number][] = [[2.5, 51.05], [1.6, 50.9], [1.6, 50.2], [0.1, 49.5], [-1.2, 49.7], [-1.6, 49.65], [-1.4, 48.6], [-2.4, 48.6], [-3.5, 48.8], [-4.6, 48.7], [-4.7, 48.0], [-3.4, 47.7], [-2.2, 47.2], [-1.2, 46.2], [-1.1, 45.5], [-1.3, 44.6], [-1.5, 43.4], [-0.7, 43.1], [0.7, 42.8], [1.7, 42.5], [3.1, 42.45], [3.0, 43.1], [4.2, 43.5], [5.0, 43.4], [5.4, 43.2], [6.4, 43.1], [7.5, 43.75], [6.9, 44.4], [7.1, 45.0], [6.8, 45.8], [6.1, 46.3], [7.0, 47.4], [7.6, 47.6], [8.2, 48.9], [6.4, 49.45], [5.9, 49.5], [4.8, 50.1], [4.2, 50.3], [3.2, 50.8]];
const ESPANA: [number, number][] = [[-9.3, 43.0], [-8.0, 43.75], [-5.5, 43.55], [-1.8, 43.4], [-1.5, 43.0], [0.7, 42.8], [1.7, 42.5], [3.1, 42.45], [3.2, 41.8], [0.8, 40.7], [-0.3, 39.5], [-0.2, 38.7], [-0.8, 37.6], [-2.0, 36.8], [-4.5, 36.7], [-5.6, 36.0], [-6.3, 36.5], [-7.4, 37.2], [-7.4, 38.2], [-7.0, 39.5], [-7.2, 40.8], [-6.8, 41.9], [-8.8, 41.9], [-8.9, 42.6]];

/** Siluetas planas de Francia y España (mismo tratamiento). `paises` elige cuáles; relojes con sol (FR) y luna (ES) opcionales. */
export const MapaH: React.FC<{paises?: ('fr' | 'es')[]; x?: number; y?: number; k?: number; relojes?: boolean; etiquetaEs?: string; en?: number; hasta?: number}> = ({paises = ['fr', 'es'], x = 540, y = 840, k = 30, relojes, etiquetaEs, en = 0, hasta}) => {
  const t = useT();
  const cos = Math.cos((44 * Math.PI) / 180);
  const lon0 = paises.length === 1 ? -9.5 : -9.5, lat1 = paises.includes('fr') ? 51.2 : 43.9;
  const lonM = paises.length === 1 ? -3.4 : -0.5, latM = paises.length === 1 ? 40.0 : 44.2;
  const px = (lo: number, la: number): [number, number] => [x + (lo - lonM) * cos * k, y + (latM - la) * k];
  const poly = (a: [number, number][]) => a.map(([lo, la]) => px(lo, la).join(',')).join(' ');
  const s = back((t - 0.2) / 0.4);
  const [fx, fy] = px(2.3, 47.0);
  const [ex, ey] = px(-3.6, 40.2);
  void lon0; void lat1;
  return (
    <Capa en={en} hasta={hasta}>
      {paises.includes('es') ? <polygon points={poly(ESPANA)} fill={T} stroke={C.crema} strokeWidth={4} strokeLinejoin="round" /> : null}
      {paises.includes('fr') ? <polygon points={poly(FRANCIA)} fill={T} stroke={C.crema} strokeWidth={4} strokeLinejoin="round" /> : null}
      {relojes ? (
        <g>
          <g transform={`translate(${fx} ${fy}) scale(${s}) translate(${-fx} ${-fy})`}><Cara x={fx} y={fy} r={62} hora={3} /><Sol x={fx + 72} y={fy - 66} r={20} /></g>
          <g transform={`translate(${ex} ${ey}) scale(${s}) translate(${-ex} ${-ey})`}><Cara x={ex} y={ey} r={62} hora={2} /><Luna x={ex - 72} y={ey - 66} r={24} /></g>
        </g>
      ) : null}
      {etiquetaEs ? <Texto x={60} y={ey + 190} t={etiquetaEs} anchor="start" /> : null}
    </Capa>
  );
};

const Vehiculo: React.FC<{tipo: 'tren' | 'camion'; fx: number; y: number}> = ({tipo, fx, y}) => (
  tipo === 'tren' ? (
    <g>
      {[0, 1, 2].map((i) => <rect key={i} x={fx - 130 - i * 130 + 8} y={y - 60} width={118} height={80} rx={14} fill={i === 0 ? C.mostaza : C.crema} {...sw} strokeWidth={6} />)}
      {[0, 1, 2].map((i) => <rect key={`w${i}`} x={fx - 130 - i * 130 + 30} y={y - 44} width={74} height={30} rx={6} fill={C.piedra} />)}
      <circle cx={fx - 50} cy={y + 28} r={14} fill={T} /><circle cx={fx - 250} cy={y + 28} r={14} fill={T} />
    </g>
  ) : (
    <g>
      <rect x={fx - 330} y={y - 80} width={230} height={110} rx={12} fill={C.crema} {...sw} strokeWidth={6} />
      <path d={`M${fx - 90} ${y - 50} h50 l36 36 v44 h-86 z`} fill={C.turquesa} {...sw} strokeWidth={6} />
      <circle cx={fx - 250} cy={y + 34} r={20} fill={T} /><circle cx={fx - 130} cy={y + 34} r={20} fill={T} /><circle cx={fx - 30} cy={y + 34} r={20} fill={T} />
    </g>
  )
);

/** Un tren y un camión cruzan la frontera (línea discontinua); el reloj de su cabina salta una hora. */
export const FronteraH: React.FC<{y?: number; dy?: number; dur?: number; en?: number; hasta?: number}> = ({y = 700, dy = 0, dur = 5.5, en = 0, hasta}) => {
  void y;
  const t = useT();
  const u = cl((t - 0.2) / dur);
  const f0 = 340, f1 = 945;
  const fT = f0 + (f1 - f0) * u;
  const fC = f0 + 20 + (f1 - f0 - 20) * cl((t - 0.9) / dur);
  const cruza = (f: number) => (f >= 540 ? 3 : 2);
  const fila = (tipo: 'tren' | 'camion', f: number, yy: number) => (
    <g>
      <path d={`M60 ${yy + 50} H950`} stroke={T} strokeWidth={8} strokeLinecap="round" />
      <Vehiculo tipo={tipo} fx={f} y={yy} />
      <Cara x={f - (tipo === 'tren' ? 190 : 205)} y={yy - (tipo === 'tren' ? 140 : 115)} r={40} hora={cruza(f)} />
    </g>
  );
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(0 ${dy})`}>
      <path d="M540 520 V1090" stroke={T} strokeWidth={10} strokeDasharray="22 16" />
      <Luna x={400} y={535} r={36} fill={T} />
      <Sol x={690} y={535} r={28} />
      {fila('tren', fT, 760)}
      {fila('camion', fC, 990)}
      </g>
    </Capa>
  );
};

/** Calendario plano con hojas ("AÑO 1" / "AÑO 2"), año que pasa hoja (2027..2031), chips MAR/OCT y cierre. */
export const CalendarioH: React.FC<{x?: number; y?: number; w?: number; hojas?: string[]; sol?: boolean; anios?: {t: number; txt: string}[]; chips?: boolean; cierraEn?: number; en?: number; hasta?: number}> = ({x = 540, y = 720, w = 300, hojas = ['2025'], sol, anios, chips, cierraEn, en = 0, hasta}) => {
  const t = useT();
  const h = w * 0.85;
  const n = hojas.length;
  let txt0 = hojas[0];
  let sy = 1;
  let ultimo = -1;
  if (anios) {
    let idx = -1;
    anios.forEach((a, i) => { if (t >= a.t) idx = i; });
    if (idx >= 0) { txt0 = anios[idx].txt; ultimo = idx; const u = cl((t - anios[idx].t) / 0.3); sy = Math.abs(Math.cos(Math.PI * u * 0.5 * 2)) < 0.001 ? 0.001 : 1; sy = idx === 0 ? easeIO(u) : Math.max(0.05, Math.abs(Math.cos(Math.PI * u))); if (u > 0.5) sy = easeIO((u - 0.5) * 2); else sy = 1 - easeIO(u * 2); sy = Math.max(sy, 0.06); }
    else txt0 = anios[0].txt, sy = 0.001;
  }
  const cierre = cierraEn === undefined ? 0 : easeIO(cl((t - cierraEn) / 0.45));
  const syT = sy * (1 - 0.8 * cierre);
  const hoja = (cx: number, label: string, i: number) => {
    const sc = (anios ? syT : 1) * (cierraEn !== undefined ? 1 : 1);
    return (
      <g key={i} transform={`translate(${cx} ${y}) scale(1 ${sc}) translate(${-cx} ${-y})`}>
        <rect x={cx - w / 2} y={y - h / 2} width={w} height={h} rx={20} fill={C.crema} {...sw} />
        <path d={`M${cx - w / 2} ${y - h / 2 + 20} a20 20 0 0 1 20 -20 h${w - 40} a20 20 0 0 1 20 20 v${h * 0.26} h${-w} z`} fill={C.turquesa} {...sw} />
        <rect x={cx - w * 0.28} y={y - h / 2 - 22} width={16} height={44} rx={8} fill={T} /><rect x={cx + w * 0.28 - 16} y={y - h / 2 - 22} width={16} height={44} rx={8} fill={T} />
        <text x={cx} y={y + h * 0.2} textAnchor="middle" fontFamily={F.titular} fontSize={w * (label.length > 4 ? 0.2 : 0.27)} fill={T}>{label}</text>
      </g>
    );
  };
  const xs = n === 1 ? [x] : [x - w * 0.55, x + w * 0.55];
  const e2 = useEntrada(0.5);
  return (
    <Capa en={en} hasta={hasta}>
      {xs.map((cx, i) => hoja(cx, anios ? txt0 : hojas[i], i))}
      {sol ? <Sol x={x} y={y - h / 2 - 90} r={40} /> : null}
      {chips && ultimo >= 0 && cierre < 0.5 ? ['MAR', 'OCT'].map((m, i) => {
        const cx = x + (i ? 1 : -1) * w * 0.55;
        const s = back((t - anios![ultimo].t - 0.2 - i * 0.12) / 0.3);
        return (
          <g key={m} transform={`translate(${cx} ${y + h / 2 + 90}) scale(${s})`}>
            <Cara x={-w * 0.28} y={0} r={34} hora={i ? 2 : 3} />
            <Texto x={w * 0.08} y={18} t={m} size={52} />
          </g>
        );
      }) : null}
      {void e2}
    </Capa>
  );
};

/** Recuadro con las islas Canarias (siluetas planas). */
export const CanariasH: React.FC<{x?: number; y?: number; en?: number; hasta?: number}> = ({x = 300, y = 720, en = 0, hasta}) => {
  const isl: [number, number, number, number][] = [[-120, 30, 28, 20], [-70, 20, 34, 24], [-20, 48, 40, 32], [-70, -40, 20, 20], [40, -30, 56, 20], [110, -40, 32, 40], [80, 40, 74, 26]];
  return (
    <Capa en={en} hasta={hasta}>
      <rect x={x - 220} y={y - 150} width={440} height={300} rx={26} fill={C.crema} {...sw} />
      {isl.map(([dx, dy, rx, ry], i) => <ellipse key={i} cx={x + dx * 1.1} cy={y + dy} rx={rx * 0.9} ry={ry * 0.9} fill={T} />)}
    </Capa>
  );
};

/** Tarjeta con silueta de busto (sin rasgos) y rótulo con nombre y cargo. */
export const TarjetaBustoH: React.FC<{y?: number; l1: string; l2: string; l3?: string; en?: number; hasta?: number}> = ({y = 520, l1, l2, l3, en = 0, hasta}) => {
  const e = useEntrada(en);
  const s = useSalida(hasta);
  return (
    <div style={{position: 'absolute', left: 60, top: y, width: 880, height: 300, borderRadius: 28, background: C.crema, border: `8px solid ${T}`, boxShadow: '0 14px 0 rgba(20,33,61,0.25)', opacity: Math.min(e, 1) * s, transform: `scale(${0.94 + 0.06 * Math.min(e, 1)})`}}>
      <svg width={220} height={284} viewBox="0 0 200 260" style={{position: 'absolute', left: 14, top: 4}}>
        <circle cx={100} cy={96} r={52} fill={T} />
        <path d="M14 256 C14 178 54 156 100 156 C146 156 186 178 186 256 Z" fill={T} />
      </svg>
      <div style={{position: 'absolute', left: 250, top: 40, width: 620, fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: '76px', color: T}}>
        <div>{l1}</div><div>{l2}</div>{l3 ? <div>{l3}</div> : null}
      </div>
    </div>
  );
};

/** Bombilla y enchufe unidos por una flecha plana (horizontal, sin subir ni bajar). */
export const EnergiaH: React.FC<{x?: number; y?: number; en?: number; hasta?: number}> = ({x = 540, y = 960, en = 0, hasta}) => {
  const t = useT();
  const u = easeIO(cl((t - 0.2) / 0.6));
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x - 270} ${y}) scale(1.05) translate(-100 -100)`}>
        <path d="M100 18 a52 52 0 0 1 28 96 v22 h-56 v-22 a52 52 0 0 1 28 -96z" fill={C.mostaza} {...sw} />
        <path d="M76 148 h48 M80 164 h40 M88 180 h24" fill="none" {...sw} />
      </g>
      <path d={`M${x - 100} ${y} H${x - 100 + 200 * u}`} {...sw} strokeWidth={14} fill="none" />
      {u > 0.9 ? <path d={`M${x + 70} ${y - 34} L${x + 110} ${y} L${x + 70} ${y + 34}`} fill="none" {...sw} strokeWidth={14} /> : null}
      <g transform={`translate(${x + 270} ${y})`}>
        <rect x={-60} y={-50} width={120} height={100} rx={20} fill={C.crema} {...sw} />
        <rect x={-34} y={-90} width={14} height={44} rx={5} fill={T} /><rect x={20} y={-90} width={14} height={44} rx={5} fill={T} />
        <path d="M0 50 v50 q0 30 40 30" fill="none" {...sw} strokeWidth={9} />
      </g>
    </Capa>
  );
};

/** Línea de tiempo 2018 · 2019 · 2025 · HOY (· 2026 previsto, discontinuo). `en`: segundo en que se enciende; `ya`: encendido desde el principio. */
export const TlH: React.FC<{y?: number; hitos: {e: string; en?: number; ya?: boolean}[]; previsto?: number; en?: number; hasta?: number}> = ({y = 860, hitos, previsto, en = 0, hasta}) => {
  const t = useT();
  const xs = [140, 320, 500, 680, 860];
  const n = hitos.length + (previsto !== undefined ? 1 : 0);
  const fin = xs[n - 1];
  return (
    <Capa en={en} hasta={hasta}>
      <path d={`M${xs[0]} ${y + 40} H${fin}`} stroke={C.piedra} strokeWidth={10} strokeLinecap="round" />
      {hitos.map((h, i) => {
        const on = h.ya || (h.en !== undefined && t >= h.en);
        const s = h.ya ? 1 : back((t - (h.en ?? 0)) / 0.3);
        return (
          <g key={i}>
            <g transform={`translate(${xs[i]} ${y + 40}) scale(${on ? s : 0.8})`}><circle r={36} fill={on ? C.mostaza : C.crema} stroke={on ? T : C.piedra} strokeWidth={8} /></g>
            <Texto x={xs[i]} y={y + 150} t={h.e} mono fill={on ? T : C.piedra} />
          </g>
        );
      })}
      {previsto !== undefined ? (
        <g opacity={t >= previsto ? 1 : 0}>
          <circle cx={xs[4]} cy={y + 40} r={36} fill={C.crema} stroke={T} strokeWidth={8} strokeDasharray="10 8" />
          <Texto x={xs[4]} y={y + 150} t="2026" mono />
          <Texto x={960} y={y + 230} t="previsto" anchor="end" />
        </g>
      ) : null}
    </Capa>
  );
};

/** Etiqueta EJEMPLO fija (tinta) arriba a la izquierda, bajo el logo. */
export const EjemploH: React.FC<{y?: number; en?: number; hasta?: number}> = ({y = 345, en = 0, hasta}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  return <div style={{position: 'absolute', left: 60, top: y, fontFamily: F.titular, fontSize: 64, color: C.crema, background: T, padding: '6px 28px', borderRadius: 14, opacity: Math.min(p, 1) * s}}>EJEMPLO</div>;
};

/** Flecha curva mostaza que gira hacia atrás (para la portada). */
export const FlechaAtrasH: React.FC<{x?: number; y?: number; r?: number; en?: number}> = ({x = 540, y = 1380, r = 110, en = 0}) => {
  const R = r + 30;
  const [x1, y1] = polar(x, y, R, 70);
  const [x2, y2] = polar(x, y, R, -70);
  return (
    <Capa en={en}>
      <Cara x={x} y={y} r={r} hora={2} />
      <path d={`M${x1} ${y1} A${R} ${R} 0 0 0 ${x2} ${y2}`} fill="none" stroke={C.mostaza} strokeWidth={22} strokeLinecap="round" />
      <path d="M-30 -34 L34 0 L-30 34 Z" fill={C.mostaza} transform={`translate(${x2} ${y2}) rotate(${-70 - 90 + 180})`} />
    </Capa>
  );
};

/** Flecha recta plana de (x1,y1) a (x2,y2) que se dibuja. */
export const FlechaH: React.FC<{x1: number; y1: number; x2: number; y2: number; dur?: number; en?: number; hasta?: number}> = ({x1, y1, x2, y2, dur = 0.7, en = 0, hasta}) => {
  const t = useT();
  const u = easeIO(cl((t - en) / dur));
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const ex = x1 + (x2 - x1) * u, ey = y1 + (y2 - y1) * u;
  return (
    <Capa en={en} hasta={hasta}>
      <path d={`M${x1} ${y1} L${ex} ${ey}`} {...sw} strokeWidth={14} fill="none" />
      {u > 0.95 ? <path d="M-26 -30 L22 0 L-26 30" fill="none" {...sw} strokeWidth={14} transform={`translate(${x2} ${y2}) rotate(${ang})`} /> : null}
    </Capa>
  );
};

export const REGISTRO_009: Record<string, React.FC<any>> = {
  relojH: RelojH, hemiH: HemiH, sobresH: SobresH, barra84H: Barra84H, paisesH: PaisesH, proponeH: ProponeH, votosH: VotosH, partidoH: PartidoH,
  casillasH: CasillasH, mesaH: MesaH, carpetaH: CarpetaH, mosaicoH: MosaicoH, mapaH: MapaH, fronteraH: FronteraH, calendarioH: CalendarioH,
  canariasH: CanariasH, tarjetaBustoH: TarjetaBustoH, energiaH: EnergiaH, tlH: TlH, ejemploH: EjemploH, flechaAtrasH: FlechaAtrasH, flechaH: FlechaH,
};
