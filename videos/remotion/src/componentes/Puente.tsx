import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useSalida} from './util';
import {MAPA_ES} from './datosMapaSenado';
import {CCAA, centro} from './Espera';

/**
 * 082 (puente del 7 de diciembre). Tiempos en segundos desde el inicio de la ESCENA.
 * calPuente: calendario de diciembre 2026 (filas 2 o 5) con 7 LUN latiendo, 6 DOM, flecha, desvío a banderas y mar 8.
 * mapaPuente: mapa por comunidades en tres estados (neutro, festivo turquesa, no figura gris) y todo mostaza (martes 8).
 * barraDias: SÁB 5 · DOM 6 · LUN 7 · MAR 8.
 */
const M = MAPA_ES as any;
const usa = () => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {fr, t: fr / fps};
};
const ease = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
const lienzo = (children: React.ReactNode, s: number) => (
  <div style={{opacity: s}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>{children}</svg>
  </div>
);
const T = C.tinta;
const CLARO = '#D6D2C8';

/* ------------------------------------------------------------------ Calendario */
export const CalPuente: React.FC<{
  y?: number; filas?: number; cw?: number; ch?: number; en?: number; hasta?: number; zoom?: boolean;
  late7?: boolean; marca6?: number; flecha?: number; desvio?: number; mar8?: number; todos7?: boolean;
  reduce?: {en: number; dur: number; esc: number; dy: number};
}> = ({y = 560, filas = 5, cw = 116, ch = 96, en = 0, hasta, zoom = false, late7 = true, marca6 = -1, flecha = -1, desvio = -1, mar8 = -1, reduce}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const cx0 = 540 - (7 * cw) / 2 - 10; // centrado en x≈530
  const top0 = y + 96;
  const col = (d: number) => (d + 0) % 7; // 1 dic = martes -> col 1; d=1 => col (1+0)%7
  const colDe = (d: number) => (d - 1 + 1) % 7;
  const filaDe = (d: number) => Math.floor((d - 1 + 1) / 7);
  const cen = (d: number): [number, number] => [cx0 + colDe(d) * cw + cw / 2, top0 + filaDe(d) * ch + ch / 2];
  const ent = zoom ? interpolate(t, [0, 0.6], [0.55, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.4))}) : ease(t, en, en + 0.4);
  const op = zoom ? 1 : ease(t, en, en + 0.4);
  const rk = reduce ? ease(t, reduce.en, reduce.en + reduce.dur) : 0;
  const esc = ent * (reduce ? 1 + (reduce.esc - 1) * rk : 1);
  const dy = reduce ? reduce.dy * rk : 0;
  const pul = late7 ? 1 + 0.05 * Math.sin(t * 6.5) : 1;
  const cel: React.ReactNode[] = [];
  const maxD = Math.min(31, filas * 7 - 1);
  for (let d = 1; d <= maxD; d++) {
    const [cx, cy] = cen(d);
    const es7 = d === 7, es6 = d === 6 && marca6 >= 0 && t >= marca6, es8 = d === 8 && mar8 >= 0 && t >= mar8;
    const fill = es7 || es8 ? C.mostaza : es6 ? C.piedra : C.crema;
    const k = es7 ? pul : es8 ? 1 + 0.05 * Math.sin((t - mar8) * 6.5) : 1;
    cel.push(
      <g key={d} transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
        <rect x={cx - cw / 2 + 4} y={cy - ch / 2 + 4} width={cw - 8} height={ch - 8} rx={12} fill={fill} stroke={T} strokeWidth={es7 || es8 ? 6 : 3} />
        <text x={cx} y={cy + (es7 || es6 || es8 ? -2 : 16)} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={es7 || es8 ? 52 : 46} fill={T}>{d}</text>
        {es7 ? <text x={cx} y={cy + 32} textAnchor="middle" fontFamily={F.titular} fontSize={28} fill={T}>LUN</text> : null}
        {es6 ? <text x={cx} y={cy + 32} textAnchor="middle" fontFamily={F.titular} fontSize={28} fill={T}>DOM</text> : null}
        {es8 ? <text x={cx} y={cy + 32} textAnchor="middle" fontFamily={F.titular} fontSize={28} fill={T}>MAR</text> : null}
      </g>,
    );
  }
  // flecha 6 -> 7 (curva por debajo de la fila 0)
  let fl: React.ReactNode = null;
  if (flecha >= 0 && t >= flecha) {
    const e = ease(t, flecha, flecha + 0.6);
    const [x6, y6] = cen(6), [x7, y7] = cen(7);
    const p0 = [x6, y6 + ch / 2 - 4], p1 = [x7, y7 - ch / 2 + 4];
    const d = `M ${p0[0]} ${p0[1]} C ${p0[0]} ${p0[1] + 70}, ${p1[0]} ${p1[1] - 70}, ${p1[0]} ${p1[1]}`;
    fl = (
      <g>
        <path d={d} fill="none" stroke={C.teja} strokeWidth={10} strokeLinecap="round" strokeDasharray="1200" strokeDashoffset={1200 * (1 - e)} />
        {e > 0.95 ? <path d={`M ${p1[0] - 18} ${p1[1] - 26} L ${p1[0]} ${p1[1] - 2} L ${p1[0] + 18} ${p1[1] - 26}`} fill="none" stroke={C.teja} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" /> : null}
      </g>
    );
  }
  // desvío a tres banderas genéricas
  let dv: React.ReactNode = null;
  if (desvio >= 0 && t >= desvio) {
    const [x7, y7] = cen(7);
    const yB = top0 + filas * ch + 130;
    const xs = [220, 530, 840];
    dv = (
      <g>
        {xs.map((bx, i) => {
          const e = ease(t, desvio + i * 0.25, desvio + 0.6 + i * 0.25);
          const x1 = x7, y1 = y7 + ch / 2, x2 = bx, y2 = yB - 100;
          return (
            <g key={i} opacity={e}>
              <path d={`M ${x1} ${y1} C ${x1} ${y1 + 120}, ${x2} ${y2 - 120}, ${x2} ${y2}`} fill="none" stroke={T} strokeWidth={8} strokeDasharray="18 14" strokeLinecap="round" />
              <path d={`M ${x2 - 16} ${y2 - 24} L ${x2} ${y2} L ${x2 + 16} ${y2 - 24}`} fill="none" stroke={T} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
              <g transform={`translate(${bx - 60} ${yB - 90 + Math.sin(t * 3 + i) * 5})`}>
                <rect x={0} y={0} width={9} height={170} rx={4} fill={T} />
                <path d={`M 9 6 L 140 6 L 120 52 L 140 98 L 9 98 Z`} fill={[C.turquesa, C.mostaza, C.piedra][i]} stroke={T} strokeWidth={6} strokeLinejoin="round" />
              </g>
            </g>
          );
        })}
      </g>
    );
  }
  return lienzo(
    <g opacity={op} transform={`translate(0 ${dy + Math.sin(t * 2.2) * 5}) translate(540 ${y + 300}) scale(${esc}) translate(-540 ${-(y + 300)})`}>
      <text x={530} y={y + 40} textAnchor="middle" fontFamily={F.titular} fontSize={56} fill={T}>DICIEMBRE 2026</text>
      {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((l, i) => <text key={i} x={cx0 + i * cw + cw / 2} y={y + 88} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={32} fill={C.piedra}>{l}</text>)}
      {cel}
      {fl}
      {dv}
    </g>,
    s,
  );
};

/* ------------------------------------------------------------------ Mapa */
const FEST = ['Andalucía', 'Aragón', 'Asturias', 'Cantabria', 'Castilla y León', 'Extremadura', 'Madrid', 'Murcia', 'La Rioja'];
const RESTO = ['Baleares', 'Canarias', 'Castilla-La Mancha', 'Cataluña', 'Galicia', 'Navarra', 'País Vasco', 'C. Valenciana'];
// Etiquetas del bloque 3: [nombre, comunidad que ancla, dx, dy, líneas]
const ETIQ: [string, string, number, number, number?, number?][] = [
  ['Baleares', '', 80, 55, 1900, 900],
  ['Canarias', '', 0, 62, 233, 1388],
  ['Galicia', 'Galicia', -10, -40],
  ['País Vasco', 'País Vasco', -40, -88],
  ['Navarra', 'Navarra', 70, -88],
  ['Cataluña', 'Cataluña', -30, -80],
  ['Castilla-La Mancha', 'Castilla-La Mancha', 0, 0],
  ['C. Valenciana', 'C. Valenciana', 40, 70],
];

export const MapaPuente: React.FC<{
  x?: number; y?: number; esc?: number; en?: number; hasta?: number; festEn?: number; restoEn?: number; todasEn?: number; vuelveEn?: number;
  etiquetas?: number; cajaEn?: number; leyenda?: number; paso?: number; canarias?: boolean; pastilla?: boolean; contador?: {valor: string; etiqueta: string; color: string; en: number};
}> = ({x = 150, y = 560, esc = 0.34, en = 0, hasta, festEn = 99, restoEn = 99, todasEn = 99, vuelveEn = 99, etiquetas = -1, cajaEn = 0, leyenda = -1, paso = 0.12, canarias = true, contador}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.5);
  const ccDe: Record<string, string> = {};
  Object.keys(CCAA).forEach((cc) => CCAA[cc].forEach((p) => { ccDe[p] = cc; }));
  const todas = t >= todasEn && t < vuelveEn;
  const estado = (cc: string | undefined): string => {
    if (todas) return C.mostaza;
    const i = cc ? FEST.indexOf(cc) : -1;
    if (i >= 0 && t >= festEn + i * paso) return C.turquesa;
    if (i < 0 && t >= restoEn) return C.piedra;
    return CLARO;
  };
  const island = (cc: string) => estado(cc);
  const sx = (bx: number) => x + bx * esc;
  const sy = (by: number) => y + by * esc;
  const csc = 0.55, cx0 = 30, cy0 = 1290;
  const melColor = todas ? C.mostaza : t >= festEn + 9 * paso ? C.turquesa : CLARO;
  const ceutaColor = todas ? C.mostaza : t >= restoEn ? C.piedra : CLARO;
  const can = M.canarias;
  // caja Ceuta / Melilla (pantalla)
  const bx = x + 20, by = y + 1500 * esc;
  return lienzo(
    <g opacity={k} transform={`translate(0 ${(1 - k) * 30 + Math.sin(t * 2.4) * 3})`}>
      <g transform={`translate(${x} ${y}) scale(${esc})`}>
        {Object.keys(M.prov).map((p) => (
          <path key={p} d={M.prov[p].d} fill={estado(ccDe[p])} stroke={C.crema} strokeWidth={3 / esc * 0.5} fillRule="evenodd" strokeLinejoin="round" />
        ))}
        {['mallorca', 'menorca', 'ibiza', 'formentera'].map((n) => <path key={n} d={M.islas[n].d} fill={island('Baleares')} stroke={C.crema} strokeWidth={3} />)}
        {canarias ? (
          <g>
            <rect x={cx0 - 16} y={cy0 - 20} width={M.canBB[2] * csc + 32} height={M.canBB[3] * csc + 40} rx={14} fill="none" stroke={C.tinta} strokeWidth={5} strokeDasharray="14 14" opacity={0.45} />
            <g transform={`translate(${cx0} ${cy0}) scale(${csc})`}>
              {Object.keys(can).map((n) => <path key={n} d={can[n].d} fill={island('Canarias')} stroke={C.crema} strokeWidth={3} />)}
            </g>
          </g>
        ) : null}
      </g>
      {cajaEn >= 0 ? (() => {
        const cxb = x + 1440 * esc, cyb = y + 1400 * esc;
        return (
          <g opacity={ease(t, cajaEn, cajaEn + 0.4)}>
            <rect x={cxb} y={cyb} width={300} height={74} rx={14} fill="none" stroke={T} strokeWidth={4} strokeDasharray="12 12" opacity={0.5} />
            <rect x={cxb + 10} y={cyb + 10} width={132} height={54} rx={10} fill={ceutaColor} stroke={T} strokeWidth={4} />
            <text x={cxb + 76} y={cyb + 46} textAnchor="middle" fontFamily={F.titular} fontSize={28} fill={T}>CEUTA</text>
            <rect x={cxb + 152} y={cyb + 10} width={138} height={54} rx={10} fill={melColor} stroke={T} strokeWidth={4} />
            <text x={cxb + 221} y={cyb + 46} textAnchor="middle" fontFamily={F.titular} fontSize={28} fill={T}>MELILLA</text>
          </g>
        );
      })() : null}
      {etiquetas >= 0 ? ETIQ.map(([n, cc, dx, dy, bx0, by0], i) => {
        const e = ease(t, etiquetas + i * 0.06, etiquetas + 0.25 + i * 0.06);
        if (e <= 0) return null;
        const [bxx, byy] = bx0 !== undefined ? [bx0, by0 as number] : centro(cc);
        const cxp = sx(bxx), cyp = sy(byy);
        const gx = cxp + dx, gy = cyp + dy;
        const w = n.length * 17 + 28;
        return (
          <g key={n} opacity={e}>
            {dx !== 0 || dy !== 0 ? <line x1={cxp} y1={cyp} x2={gx} y2={gy} stroke={T} strokeWidth={4} /> : null}
            <rect x={gx - w / 2} y={gy - 22} width={w} height={44} rx={10} fill={T} />
            <text x={gx} y={gy + 11} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={30} fill={C.crema}>{n}</text>
          </g>
        );
      }) : null}
      {contador ? (() => {
        const e = Math.min(1, Math.max(0, (t - contador.en) / 0.35));
        const pop = e < 1 ? 1 + 0.25 * Math.sin(e * Math.PI) : 1;
        return (
          <g opacity={e > 0 ? 1 : 0} transform={`translate(850 700) scale(${pop * (e > 0 ? 1 : 0)}) translate(-850 -700)`}>
            <circle cx={850} cy={700} r={80} fill={contador.color} stroke={T} strokeWidth={6} />
            <text x={850} y={732} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={96} fill={T}>{contador.valor}</text>
            <text x={850} y={822} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={36} fill={T}>{contador.etiqueta}</text>
          </g>
        );
      })() : null}
      {leyenda >= 0 ? (
        <g opacity={ease(t, leyenda, leyenda + 0.4)}>
          <rect x={70} y={522} width={36} height={36} rx={8} fill={C.turquesa} stroke={T} strokeWidth={4} />
          <text x={118} y={551} fontFamily={F.texto} fontWeight={700} fontSize={32} fill={T}>festivo</text>
          <rect x={290} y={522} width={36} height={36} rx={8} fill={C.piedra} stroke={T} strokeWidth={4} />
          <text x={338} y={551} fontFamily={F.texto} fontWeight={700} fontSize={32} fill={T}>no figura como festivo</text>
        </g>
      ) : null}
    </g>,
    s,
  );
};

/* ------------------------------------------------------------------ Barra de días */
export const BarraDias: React.FC<{y?: number; en?: number; hasta?: number; mar8?: number; cuatro?: number}> = ({y = 560, en = 0, hasta, mar8 = -1, cuatro = -1}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.4);
  const dias = [['SÁB', 5], ['DOM', 6], ['LUN', 7], ['MAR', 8]] as const;
  const w = 205, g = 14, x0 = 60;
  return lienzo(
    <g opacity={k} transform={`translate(0 ${(1 - k) * 24 + Math.sin(t * 2.4) * 4})`}>
      {dias.map(([n, d], i) => {
        const iluminado = (i === 3 && mar8 >= 0 && t >= mar8);
        const cuat = cuatro >= 0 && t >= cuatro + i * 0.15;
        const fill = cuat ? C.turquesa : iluminado ? C.mostaza : C.crema;
        const pul = iluminado && !cuat ? 1 + 0.04 * Math.sin((t - mar8) * 7) : 1;
        const cx = x0 + i * (w + g) + w / 2, cy = y + 90;
        return (
          <g key={n} transform={`translate(${cx} ${cy}) scale(${pul}) translate(${-cx} ${-cy})`}>
            <rect x={x0 + i * (w + g)} y={y} width={w} height={180} rx={18} fill={fill} stroke={T} strokeWidth={6} />
            <text x={cx} y={y + 66} textAnchor="middle" fontFamily={F.titular} fontSize={44} fill={T}>{n}</text>
            <text x={cx} y={y + 146} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={76} fill={T}>{d}</text>
          </g>
        );
      })}
    </g>,
    s,
  );
};

export const REGISTRO_PUENTE: Record<string, React.FC<any>> = {
  calPuente: CalPuente, mapaPuente: MapaPuente, barraDias: BarraDias,
};
