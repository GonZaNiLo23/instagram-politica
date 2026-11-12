import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useSalida} from './util';

/**
 * Pieza 044 (deuda bajo el 100 % del PIB). SVG a lienzo completo; tiempos en segundos desde el inicio de la ESCENA.
 * REGISTRO_044: flechasD (dos flechas opuestas, golpe desde el fotograma 0), duoD (dos cifras con flecha),
 * sueldoCasaD (nómina que crece frente a casa con hipoteca), separanD (dos líneas que se separan), bandaD (bloques desde feb-2020).
 */
const usa = () => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {t: fr / fps};
};
const ease = (t: number, a: number, b: number, out = false) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: out ? Easing.out(Easing.cubic) : Easing.inOut(Easing.cubic)});
const lienzo = (children: React.ReactNode, s: number) => (
  <div style={{opacity: s}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>{children}</svg>
  </div>
);

/** Flecha de bloque centrada en (0,0), apuntando abajo (dir=1) o arriba (dir=-1). */
const Flecha: React.FC<{dir: 1 | -1; color: string; alto?: number}> = ({dir, color, alto = 300}) => {
  const h = alto / 2;
  const pts = [[-40, -h], [40, -h], [40, 0], [110, 0], [0, h], [-110, 0], [-40, 0]].map(([x, y]) => `${x},${y * dir}`).join(' ');
  return <polygon points={pts} fill={color} stroke={C.tinta} strokeWidth={8} strokeLinejoin="round" />;
};

/** Dos flechas opuestas (verde baja, mostaza sube). `choque`: parten más lejos y se cruzan (cierre). Con balanceo contrario para no quedarse quietas. */
export const FlechasD: React.FC<{y?: number; en?: number; esc?: number; choque?: boolean; hasta?: number}> = ({y = 1020, en = 0, esc = 1, choque = false, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + (choque ? 0.7 : 0.45), true);
  const rest = 1 - k;
  const bal = Math.sin((t - en) * 3.2) * 14;
  const dy = choque ? 340 : 170;
  const aEsc = 0.7 + 0.3 * k;
  return lienzo(
    <g transform={`translate(0 ${y}) translate(480 0) scale(${esc}) translate(-480 0)`} opacity={t >= en ? 1 : 0}>
      <g transform={`translate(270 ${-dy * rest + bal}) scale(${aEsc})`}><Flecha dir={1} color={C.turquesa} /></g>
      <g transform={`translate(690 ${dy * rest - bal}) scale(${aEsc})`}><Flecha dir={-1} color={C.mostaza} /></g>
    </g>,
    s,
  );
};

/** Dos tarjetas de cifra (golpe, sin cuenta): cifra grande + etiqueta + flecha. Cada tarjeta tiene su `en`. */
export const DuoD: React.FC<{y?: number; paso?: number; enA?: number; enB?: number; hasta?: number}> = ({y = 340, paso = 270, enA = 0.1, enB = 1.2, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const tarjeta = (i: number, en: number, cifra: string, etq: string, dir: 1 | -1, color: string) => {
    const k = ease(t, en, en + 0.35, true);
    const bal = Math.sin((t - en) * 3.4) * 5 * (dir === 1 ? 1 : -1);
    const g = 1 + 0.05 * Math.sin(Math.min(1, (t - en) / 0.35) * Math.PI);
    return (
      <g key={i} transform={`translate(0 ${i * paso}) translate(480 100) scale(${(0.6 + 0.4 * k) * g}) translate(-480 -100)`} opacity={t >= en ? Math.min(1, k * 2) : 0}>
        <rect x={90} y={0} width={780} height={230} rx={28} fill={C.tinta} />
        <text x={130} y={125} fontFamily={F.cifra} fontWeight={700} fontSize={112} fill={C.crema}>{cifra}</text>
        <text x={130} y={200} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={C.crema}>{etq}</text>
        <g transform={`translate(790 ${115 + bal}) scale(0.5)`}><Flecha dir={dir} color={color} /></g>
      </g>
    );
  };
  return lienzo(
    <g transform={`translate(0 ${y})`}>
      {tarjeta(0, enA, '99,7 %', 'DEL PIB', 1, C.turquesa)}
      {tarjeta(1, enB, '1,75', 'BILLONES DE EUROS', -1, C.mostaza)}
    </g>,
    s,
  );
};

/** Ejemplo sin cifras: nómina que crece más rápido que la casa con hipoteca. Etiquetas de 64 px. */
export const SueldoCasaD: React.FC<{y?: number; en?: number; hasta?: number}> = ({y = 700, en = 0.2, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.4, true);
  const crece = ease(t, en + 1.3, en + 3.6);
  const sueldo = 1 + 0.55 * crece;
  const casa = 1 + 0.12 * crece;
  const bal = Math.sin(t * 3) * 6;
  return lienzo(
    <g transform={`translate(0 ${y})`} opacity={k}>
      {/* nómina */}
      <g transform={`translate(270 ${300 + bal}) scale(${sueldo})`}>
        <rect x={-110} y={-260} width={220} height={260} rx={14} fill={C.crema} stroke={C.tinta} strokeWidth={8} />
        {[-210, -170, -130].map((yy) => <rect key={yy} x={-76} y={yy} width={152} height={16} rx={8} fill={C.tinta} />)}
        <rect x={-76} y={-80} width={90} height={28} rx={8} fill={C.turquesa} />
      </g>
      {/* casa con hipoteca */}
      <g transform={`translate(710 ${300 - bal}) scale(${casa})`}>
        <polygon points="-130,-130 0,-250 130,-130" fill={C.tinta} />
        <rect x={-100} y={-130} width={200} height={130} fill={C.crema} stroke={C.tinta} strokeWidth={8} />
        <rect x={-26} y={-76} width={52} height={76} fill={C.tinta} />
        <circle cx={96} cy={-250} r={34} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
        <text x={96} y={-237} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={40} fill={C.tinta}>€</text>
      </g>
      <g transform={`translate(270 ${300 - 270 * sueldo - 24}) `}>
        <polygon points="0,-34 34,10 -34,10" fill={C.turquesa} stroke={C.tinta} strokeWidth={6} strokeLinejoin="round" />
      </g>
      <text x={270} y={396} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={64} fill={C.tinta}>SUELDO</text>
      <text x={710} y={396} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={64} fill={C.tinta}>HIPOTECA</text>
    </g>,
    s,
  );
};

/** Dos líneas que parten de un mismo punto: euros suben, % del PIB baja. Sin eje de valores (esquema). */
export const SeparanD: React.FC<{y?: number; en?: number; enB?: number; hasta?: number}> = ({y = 800, en = 0.2, enB = 3.3, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const a = ease(t, en, en + 1.8);
  const b = ease(t, enB, enB + 1.6);
  const x0 = 110, x1 = 780, y0 = 190;
  const lx = (k: number) => x0 + (x1 - x0) * k;
  const ya = y0 - 140 * a;
  const yb = y0 + 140 * b;
  return lienzo(
    <g transform={`translate(0 ${y})`}>
      <line x1={x0} y1={y0} x2={x1 + 60} y2={y0} stroke={C.piedra} strokeWidth={5} strokeDasharray="14 12" />
      <circle cx={x0} cy={y0} r={16} fill={C.tinta} />
      <line x1={x0} y1={y0} x2={lx(a)} y2={ya} stroke={C.mostaza} strokeWidth={16} strokeLinecap="round" />
      {a > 0.98 ? <text x={x1 + 30} y={ya + 22} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={C.tinta}>€</text> : null}
      <line x1={x0} y1={y0} x2={lx(b)} y2={yb} stroke={C.turquesa} strokeWidth={16} strokeLinecap="round" />
      {b > 0.98 ? <text x={x1 + 30} y={yb + 22} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={C.tinta}>% PIB</text> : null}
      <circle cx={lx(a)} cy={ya} r={20} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
      {b > 0 ? <circle cx={lx(b)} cy={yb} r={20} fill={C.turquesa} stroke={C.tinta} strokeWidth={6} /> : null}
    </g>,
    s,
  );
};

/** Banda de 13 bloques (feb-2020 → ago-2026): todos ≥ 100 % (mostaza) menos el último (turquesa, bajo el 100 %). Esquema sin valores. */
export const BandaD: React.FC<{y?: number; en?: number; paso?: number; ultimoEn?: number; hasta?: number}> = ({y = 960, en = 0.3, paso = 0.12, ultimoEn = 2.2, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const n = 13, w = 56, gap = 8, x0 = 90;
  const bal = Math.sin(t * 3.4) * 4;
  return lienzo(
    <g transform={`translate(0 ${y})`}>
      <text x={x0} y={0} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={C.tinta}>≥ 100 %</text>
      {Array.from({length: n}).map((_, i) => {
        const ult = i === n - 1;
        const ti = ult ? ultimoEn : en + i * paso;
        const k = ease(t, ti, ti + 0.25, true);
        const h = 90 * k;
        const dy = ult ? 70 * ease(t, ultimoEn + 0.1, ultimoEn + 0.6, true) + bal : 0;
        return <rect key={i} x={x0 + i * (w + gap)} y={30 + dy + (90 - h)} width={w} height={h} rx={8} fill={ult ? C.turquesa : C.mostaza} stroke={C.tinta} strokeWidth={5} />;
      })}
      <line x1={x0 - 10} y1={30 + 90} x2={x0 + n * (w + gap)} y2={30 + 90} stroke={C.tinta} strokeWidth={5} strokeDasharray="12 10" />
      <text x={x0} y={250} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={C.tinta}>FEB-2020</text>
      <text x={x0 + n * (w + gap) - 8} y={250} textAnchor="end" fontFamily={F.texto} fontWeight={700} fontSize={64} fill={C.tinta}>AGO-2026</text>
    </g>,
    s,
  );
};

export const REGISTRO_044: Record<string, React.FC<any>> = {
  flechasD: FlechasD, duoD: DuoD, sueldoCasaD: SueldoCasaD, separanD: SeparanD, bandaD: BandaD,
};
