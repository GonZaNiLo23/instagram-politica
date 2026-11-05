import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useSalida} from './util';

/**
 * Pieza 037 (hipoteca variable). SVG a lienzo completo; tiempos en segundos desde el inicio de la ESCENA.
 * REGISTRO_037: cuotaH (contador de cuota con golpe), fichasH (3 fichas del ejemplo), termoH (termómetro del euríbor),
 * barrasCuotaH (dos barras de cuota con diferencia), huchaH (doce monedas), calendarioH (fecha de revisión).
 */
const usa = () => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {t: fr / fps};
};
const ease = (t: number, a: number, b: number, out = false) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: out ? Easing.out(Easing.cubic) : Easing.inOut(Easing.cubic)});
const pop = (t: number, a: number, d = 0.5) => {
  const k = ease(t, a, a + d, true);
  return t < a ? 0 : k * (1 + 0.22 * Math.sin(Math.min(1, (t - a) / d) * Math.PI));
};
const lienzo = (children: React.ReactNode, s: number) => (
  <div style={{opacity: s}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>{children}</svg>
  </div>
);
const eur = (v: number, d = 2) => v.toLocaleString('es-ES', {minimumFractionDigits: d, maximumFractionDigits: d});

/** Contador de cuota (zoom desde el fotograma 0). Etiqueta EJEMPLO fija en la propia tarjeta. */
export const CuotaH: React.FC<{y?: number; de?: number; a?: number; sube?: number; dur?: number; golpe?: number}> = ({y = 900, de = 706.41, a = 790.84, sube = 0.3, dur = 1.6, golpe = 2.1}) => {
  const {t} = usa();
  const z = 0.6 + 0.4 * ease(t, 0, 0.5, true);
  const v = de + (a - de) * ease(t, sube, sube + dur);
  const g = pop(t, golpe, 0.6);
  return lienzo(
    <g transform={`translate(0 ${y}) translate(540 100) scale(${z}) translate(-540 -100)`}>
      <rect x={90} y={0} width={780} height={190} rx={28} fill={C.tinta} />
      <text x={480} y={135} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={118} fill={C.crema}>{eur(v)} €</text>
      <g transform={`translate(730 -20) scale(${g || 0.001})`} opacity={Math.min(1, g * 2)}>
        <rect x={-150} y={-52} width={300} height={90} rx={45} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
        <text x={0} y={14} textAnchor="middle" fontFamily={F.titular} fontSize={52} fill={C.tinta}>+84,43 €</text>
      </g>
    </g>,
    1,
  );
};

const Icono: React.FC<{tipo: string}> = ({tipo}) => {
  if (tipo === 'plazo') return (
    <g>
      <rect x={-48} y={-44} width={96} height={92} rx={12} fill={C.crema} stroke={C.tinta} strokeWidth={7} />
      <rect x={-48} y={-44} width={96} height={30} rx={12} fill={C.tinta} />
      {[-24, 0, 24].map((xx) => [4, 28].map((yy) => <rect key={`${xx}${yy}`} x={xx - 8} y={yy - 8} width={16} height={16} rx={3} fill={C.tinta} />))}
    </g>
  );
  if (tipo === 'dif') return (
    <g>
      <circle cx={-24} cy={-22} r={14} fill="none" stroke={C.crema} strokeWidth={8} />
      <circle cx={24} cy={22} r={14} fill="none" stroke={C.crema} strokeWidth={8} />
      <line x1={30} y1={-34} x2={-30} y2={34} stroke={C.crema} strokeWidth={8} strokeLinecap="round" />
    </g>
  );
  return <text x={0} y={22} textAnchor="middle" fontFamily={F.titular} fontSize={68} fill={C.tinta}>€</text>;
};

/** Tres fichas que caen una a una: items [{icono: 'importe'|'plazo'|'dif', lineas: string[], en}]. */
export const FichasH: React.FC<{items: {icono: string; lineas: string[]; en: number}[]; y?: number; paso?: number; alto?: number}> = ({items, y = 380, paso = 230, alto = 200}) => {
  const {t} = usa();
  return lienzo(
    <g>
      {items.map((it, i) => {
        const k = ease(t, it.en, it.en + 0.45, true);
        const yy = y + i * paso;
        const fondo = it.icono === 'dif' ? C.tinta : C.mostaza;
        return (
          <g key={i} opacity={Math.min(1, k * 2)} transform={`translate(0 ${(1 - k) * -90})`}>
            <rect x={80} y={yy} width={800} height={alto} rx={26} fill={C.crema} stroke={C.tinta} strokeWidth={7} />
            <circle cx={200} cy={yy + alto / 2} r={72} fill={fondo} stroke={C.tinta} strokeWidth={6} />
            <g transform={`translate(200 ${yy + alto / 2})`}><Icono tipo={it.icono} /></g>
            {it.lineas.map((l, j) => (
              <text key={j} x={300} y={yy + alto / 2 + (it.lineas.length === 1 ? 22 : j === 0 ? -8 : 62)} fontFamily={F.titular} fontSize={64} fill={C.tinta}>{l}</text>
            ))}
          </g>
        );
      })}
    </g>,
    1,
  );
};

/**
 * Termómetro horizontal del euríbor (eje desde 0 hasta 4 %). Sube de `de` a `a` entre `sube` y `sube+dur`;
 * la cifra solo aparece al terminar (sin cifras intermedias). `marca`: valor anterior como muesca.
 */
export const TermoH: React.FC<{y?: number; de?: number; a: number; sube?: number; dur?: number; cifraEn?: number; marca?: number; etiquetaMarca?: boolean}> = ({y = 800, de = 0, a, sube = 0.2, dur = 1.4, cifraEn, marca}) => {
  const {t} = usa();
  const x0 = 200, x1 = 880, tope = 4;
  const px = (v: number) => x0 + (x1 - x0) * (v / tope);
  const v = de + (a - de) * ease(t, sube, sube + dur);
  const ce = cifraEn ?? sube + dur;
  const g = pop(t, ce, 0.5);
  return lienzo(
    <g>
      <text x={540} y={y - 70} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={140} fill={C.tinta} opacity={Math.min(1, g * 1.5)} transform={`translate(540 ${y - 70}) scale(${g || 0.001}) translate(-540 ${-(y - 70)})`}>{eur(a, 3)} %</text>
      <rect x={x0 - 40} y={y} width={x1 - x0 + 80} height={80} rx={40} fill={C.crema} stroke={C.tinta} strokeWidth={8} />
      <rect x={x0} y={y + 14} width={Math.max(0, px(v) - x0)} height={52} rx={26} fill={C.teja} />
      <circle cx={x0 - 64} cy={y + 40} r={62} fill={C.teja} stroke={C.tinta} strokeWidth={8} />
      <rect x={x0 - 40} y={y + 10} width={60} height={60} fill={C.teja} />
      {[0, 1, 2, 3, 4].map((n) => (
        <g key={n}>
          <line x1={px(n)} y1={y + 96} x2={px(n)} y2={y + 126} stroke={C.tinta} strokeWidth={6} />
          <text x={px(n)} y={y + 176} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={48} fill={C.tinta}>{n} %</text>
        </g>
      ))}
      {marca !== undefined ? <line x1={px(marca)} y1={y - 8} x2={px(marca)} y2={y + 88} stroke={C.tinta} strokeWidth={8} strokeDasharray="10 8" /> : null}
    </g>,
    1,
  );
};

/** Dos barras de cuota con eje en cero (misma escala k px por euro). Diferencia resaltada en mostaza. */
export const BarrasCuotaH: React.FC<{base?: number; k?: number; a?: number; b?: number; difEn?: number}> = ({base = 1120, k = 0.62, a = 706.41, b = 790.84, difEn = 2.2}) => {
  const {t} = usa();
  const ha = a * k * ease(t, 0, 0.7, true);
  const hb = b * k * ease(t, 0.9, 1.7, true);
  const dh = (b - a) * k * ease(t, difEn, difEn + 0.4, true);
  const g = pop(t, difEn + 0.1, 0.5);
  const xa = 130, xb = 560, w = 330;
  return lienzo(
    <g>
      <line x1={90} y1={base} x2={930} y2={base} stroke={C.tinta} strokeWidth={8} />
      <rect x={xa} y={base - ha} width={w} height={ha} fill={C.piedra} stroke={C.tinta} strokeWidth={6} />
      <rect x={xb} y={base - hb} width={w} height={hb} fill={C.tinta} />
      <rect x={xb} y={base - hb - dh} width={w} height={dh} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
      {ha > 120 ? <text x={xa + w / 2} y={base - 40} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={C.tinta}>706,41 €</text> : null}
      {hb > 120 ? <text x={xb + w / 2} y={base - 40} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={C.crema}>790,84 €</text> : null}
      <g transform={`translate(${xb + w / 2} ${base - hb - dh - 70}) scale(${g || 0.001})`} opacity={Math.min(1, g * 2)}>
        <rect x={-165} y={-48} width={330} height={92} rx={46} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
        <text x={0} y={18} textAnchor="middle" fontFamily={F.titular} fontSize={64} fill={C.tinta}>+84,43 €</text>
      </g>
    </g>,
    1,
  );
};

/** Hucha (tarro) con doce monedas de 84,43 € que caen una a una. */
export const HuchaH: React.FC<{y?: number; en?: number; paso?: number; cifraEn?: number}> = ({y = 580, en = 0.3, paso = 0.13, cifraEn = 2.0}) => {
  const {t} = usa();
  const cx = 540, jarW = 520, top = y + 140, hJar = 380;
  const monedas = Array.from({length: 12}, (_, i) => {
    const t0 = en + i * paso;
    const k = ease(t, t0, t0 + 0.35, true);
    const col = i % 4, fila = Math.floor(i / 4);
    const xf = cx - 165 + col * 110;
    const yf = top + hJar - 56 - fila * 80;
    return {i, k, xf, yf, vis: t >= t0};
  });
  const g = pop(t, cifraEn, 0.5);
  return lienzo(
    <g>
      <g transform={`translate(0 ${Math.sin(t * 3) * 4})`}>
        {monedas.map((m) => m.vis ? (
          <g key={m.i} transform={`translate(${m.xf} ${m.yf + (1 - m.k) * -(m.yf - (y - 60))})`}>
            <circle r={44} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
            <text y={14} textAnchor="middle" fontFamily={F.titular} fontSize={40} fill={C.tinta}>€</text>
          </g>
        ) : null)}
        <path d={`M${cx - jarW / 2} ${top} h${jarW} v${hJar - 40} q0 40 -40 40 h${-jarW + 80} q-40 0 -40 -40 z`} fill="rgba(255,255,255,0.35)" stroke={C.tinta} strokeWidth={10} />
        <rect x={cx - jarW / 2 - 14} y={top - 34} width={jarW + 28} height={34} rx={12} fill={C.tinta} />
      </g>
      <g transform={`translate(${cx} ${top + hJar / 2 + 20}) scale(${g || 0.001})`} opacity={Math.min(1, g * 2)}>
        <rect x={-230} y={-72} width={460} height={120} rx={60} fill={C.mostaza} stroke={C.tinta} strokeWidth={7} />
        <text x={0} y={14} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={78} fill={C.tinta}>1.013 €</text>
      </g>
    </g>,
    1,
  );
};

/** Calendario de 12 casillas grises con una marcada "REVISIÓN" en mostaza (una pastilla recorre los meses). */
export const CalendarioH: React.FC<{y?: number; marca?: number; marcaEn?: number}> = ({y = 640, marca = 6, marcaEn = 1.0}) => {
  const {t} = usa();
  const cw = 190, ch = 130, gx = 20, gy = 20, x0 = 110;
  const barrido = Math.min(marca, Math.floor(Math.max(0, t - 0.2) / 0.12));
  const m = pop(t, marcaEn, 0.5);
  return lienzo(
    <g>
      {Array.from({length: 12}, (_, i) => {
        const c = i % 4, f = Math.floor(i / 4);
        const x = x0 + c * (cw + gx), yy = y + f * (ch + gy);
        const es = i === marca;
        const lit = !es && i <= barrido && t < marcaEn;
        return (
          <g key={i} transform={es ? `translate(${x + cw / 2} ${yy + ch / 2}) scale(${1 + 0.12 * m}) translate(${-cw / 2} ${-ch / 2})` : `translate(${x} ${yy})`}>
            <rect width={cw} height={ch} rx={18} fill={es && t >= marcaEn ? C.mostaza : lit ? C.crema : C.piedra} stroke={C.tinta} strokeWidth={es ? 8 : 5} opacity={es || lit ? 1 : 0.55} />
            <rect x={0} y={0} width={cw} height={32} rx={14} fill={C.tinta} opacity={es && t >= marcaEn ? 1 : 0.35} />
            {es && t >= marcaEn ? <circle cx={cw / 2} cy={78} r={22} fill={C.tinta} /> : null}
          </g>
        );
      })}
      {(() => {
        const g = pop(t, marcaEn + 0.2, 0.5);
        const c = marca % 4, f = Math.floor(marca / 4);
        const cxm = x0 + c * (cw + gx) + cw / 2;
        const cym = y + f * (ch + gy) + ch;
        const yp = y + 3 * (ch + gy) + 30;
        return (
          <g opacity={Math.min(1, g * 2)}>
            <line x1={cxm} y1={cym + 10} x2={cxm} y2={yp} stroke={C.tinta} strokeWidth={8} strokeLinecap="round" />
            <g transform={`translate(${cxm} ${yp + 40}) scale(${g || 0.001})`}>
              <rect x={-190} y={-44} width={380} height={90} rx={45} fill={C.tinta} />
              <text x={0} y={20} textAnchor="middle" fontFamily={F.titular} fontSize={64} fill={C.crema}>REVISIÓN</text>
            </g>
          </g>
        );
      })()}
    </g>,
    1,
  );
};

export const REGISTRO_037: Record<string, React.FC<any>> = {
  cuotaH: CuotaH, fichasH: FichasH, termoH: TermoH, barrasCuotaH: BarrasCuotaH, huchaH: HuchaH, calendarioH: CalendarioH,
};
