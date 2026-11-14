import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useSalida} from './util';

/**
 * 049 (serie "8 años en cifras"): pibSerie = línea del PIB por habitante de España (UE = 100), eje 80-100 rotulado.
 * Tiempos `en` en segundos desde el inicio de la ESCENA. Opt-in.
 * i0 / i1: índice (0 = 2014 … 11 = 2025) del primer y último punto visibles, como [desde, hasta] animados entre `en` y `en + dur`.
 * etiquetas: índices con el valor rotulado. flechas: {desde, en, dur} desde el punto `desde` hacia el último punto (2025).
 */
export const DATOS_PIB = [90.2, 91.2, 91.7, 92.3, 90.8, 90.3, 82.2, 84.9, 87.8, 90.3, 90.8, 91.4];
const ANIO0 = 2014;
const ease = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
const coma = (v: number) => v.toFixed(1).replace('.', ',');

type Flecha = {desde: number; en: number; dur?: number; color?: string; sube?: boolean; etiqueta?: string};

export const PibSerie: React.FC<{
  base?: number; hMax?: number; x0?: number; x1?: number; en?: number; dur?: number;
  i0?: [number, number]; i1?: [number, number]; etiquetas?: number[]; flechas?: Flecha[];
  marca2020?: number; ref?: boolean; refDerecha?: boolean; refTam?: number; anios?: boolean; provisional?: boolean; hasta?: number;
}> = ({base = 1040, hMax = 400, x0 = 170, x1 = 800, en = 0, dur = 1, i0 = [0, 0], i1 = [11, 11], etiquetas = [], flechas = [], marca2020, ref = true, refDerecha = false, refTam = 64, anios = true, provisional = true, hasta}) => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = fr / fps;
  const s = useSalida(hasta);
  const paso = (x1 - x0) / 11;
  const X = (f: number) => x0 + paso * f;
  const Y = (v: number) => base - ((v - 80) / 20) * hMax;
  const val = (f: number) => {
    const a = Math.floor(f), b = Math.min(11, a + 1);
    return DATOS_PIB[a] + (DATOS_PIB[b] - DATOS_PIB[a]) * (f - a);
  };
  const k = ease(t, en, en + dur);
  const a = i0[0] + (i0[1] - i0[0]) * k;
  const b = i1[0] + (i1[1] - i1[0]) * k;
  // Trazo visible entre a y b
  const pts: [number, number][] = [[X(a), Y(val(a))]];
  for (let i = Math.ceil(a + 1e-6); i <= Math.floor(b - 1e-6); i++) if (i > a && i < b) pts.push([X(i), Y(DATOS_PIB[i])]);
  pts.push([X(b), Y(val(b))]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const visible = (i: number) => i >= a - 1e-3 && i <= b + 1e-3;
  const yU = Y(100);
  const pulso = 1 + 0.15 * Math.sin(t * 5);
  const xl = X(11), yl = Y(DATOS_PIB[11]);
  const colorF = (f: Flecha) => f.color ?? (DATOS_PIB[f.desde] > DATOS_PIB[11] ? C.mostaza : C.turquesa);
  return (
    <div style={{opacity: s}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <pattern id="trama" width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width={10} height={10} fill={C.crema} />
            <line x1={0} y1={0} x2={0} y2={10} stroke={C.tinta} strokeWidth={5} />
          </pattern>
        </defs>
        <g transform={`translate(0 ${Math.sin(t * 2.2) * 3})`}>
          {/* eje y 80-100 */}
          <line x1={x0 - 30} y1={Y(100) - 20} x2={x0 - 30} y2={base} stroke={C.tinta} strokeWidth={5} strokeLinecap="round" />
          <line x1={x0 - 30} y1={base} x2={x1 + 60} y2={base} stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />
          {[80, 90, 100].map((v) => (
            <g key={v}>
              <line x1={x0 - 30} y1={Y(v)} x2={x1 + 60} y2={Y(v)} stroke={C.piedra} strokeWidth={2} opacity={v === 100 ? 0 : 0.5} />
              <text x={x0 - 44} y={Y(v) + 14} textAnchor="end" fontFamily={F.cifra} fontWeight={700} fontSize={40} fill={C.tinta}>{v}</text>
            </g>
          ))}
          {/* corte de eje (no empieza en 0) */}
          <path d={`M ${x0 - 44} ${base - 40} l 28 -10 l -28 -12 l 28 -10`} fill="none" stroke={C.tinta} strokeWidth={5} strokeLinecap="round" opacity={0} />
          {anios ? [2014, 2017, 2020, 2023, 2025].map((an) => (
            <text key={an} x={X(an - ANIO0)} y={base + 50} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={36} fill={C.tinta}>{an}</text>
          )) : null}
          {/* UE = 100 */}
          {ref ? (
            <g>
              <line x1={x0 - 30} y1={yU} x2={x1 + 60} y2={yU} stroke={C.mostaza} strokeWidth={8} strokeDasharray="22 14" strokeDashoffset={-t * 30} strokeLinecap="round" />
              {refTam ? <text x={refDerecha ? x1 + 60 : x0 - 20} y={yU - 20} textAnchor={refDerecha ? 'end' : 'start'} fontFamily={F.cifra} fontWeight={700} fontSize={refTam} fill={C.tinta} stroke={C.crema} strokeWidth={10} paintOrder="stroke">UE = 100</text> : null}
            </g>
          ) : null}
          {/* línea de España */}
          <path d={d} fill="none" stroke={C.tinta} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
          {provisional && b > 10.99 ? <line x1={X(10)} y1={Y(DATOS_PIB[10])} x2={xl} y2={yl} stroke={C.crema} strokeWidth={6} strokeDasharray="10 10" strokeLinecap="round" /> : null}
          {DATOS_PIB.map((v, i) => {
            if (!visible(i)) return null;
            const clave = etiquetas.includes(i);
            const prov = provisional && i === 11;
            return (
              <circle key={i} cx={X(i)} cy={Y(v)} r={clave ? 17 : 10} fill={prov ? 'url(#trama)' : clave ? C.mostaza : C.tinta} stroke={C.tinta} strokeWidth={5} />
            );
          })}
          {etiquetas.filter(visible).map((i) => {
            const v = DATOS_PIB[i];
            const izq = i === 6;
            const abajo = i === 4;
            return (
              <text key={i} x={izq ? X(i) - 30 : X(i)} y={izq ? Y(v) + 14 : abajo ? Y(v) + 62 : Y(v) - 34} textAnchor={izq ? 'end' : 'middle'} fontFamily={F.cifra} fontWeight={700} fontSize={44} fill={C.tinta} stroke={C.crema} strokeWidth={8} paintOrder="stroke">{coma(v)}</text>
            );
          })}
          {/* marca 2020: rotura de serie */}
          {marca2020 !== undefined && t >= marca2020 && visible(6) ? (
            <g opacity={ease(t, marca2020, marca2020 + 0.3)}>
              <circle cx={X(6)} cy={Y(DATOS_PIB[6])} r={30 * pulso} fill="none" stroke={C.mostaza} strokeWidth={6} />
              {['2020: rotura de serie', '(población UE)'].map((l, j) => (
                <text key={j} x={420} y={yU + 50 + j * 46} fontFamily={F.texto} fontWeight={700} fontSize={40} fill={C.tinta} stroke={C.crema} strokeWidth={7} paintOrder="stroke">{l}</text>
              ))}
            </g>
          ) : null}
          {/* flechas hacia el último punto */}
          {flechas.map((f, j) => {
            const kk = ease(t, f.en, f.en + (f.dur ?? 1.2));
            if (kk <= 0) return null;
            const xs = X(f.desde), ys = Y(DATOS_PIB[f.desde]);
            const dx = xl - xs, dy = yl - ys;
            const L = Math.hypot(dx, dy);
            const ux = dx / L, uy = dy / L;
            const xe = xs + dx * kk, ye = ys + dy * kk;
            const col = colorF(f);
            const baja = DATOS_PIB[f.desde] > DATOS_PIB[11];
            const cx = xl + (baja ? 58 : 112), cy = yl;
            const dir = baja ? 1 : -1;
            return (
              <g key={j}>
                <circle cx={xs} cy={ys} r={26 * (1 + 0.25 * Math.sin(t * 6 + j))} fill="none" stroke={col} strokeWidth={6} opacity={1 - kk * 0.4} />
                <line x1={xs} y1={ys} x2={xe - ux * 6} y2={ye - uy * 6} stroke={col} strokeWidth={14} strokeLinecap="round" strokeDasharray="26 12" strokeDashoffset={-t * 40} />
                {f.etiqueta ? <text x={DATOS_PIB[f.desde] > DATOS_PIB[11] ? xs - 62 : xs} y={DATOS_PIB[f.desde] > DATOS_PIB[11] ? ys - 14 : ys + 112} textAnchor={DATOS_PIB[f.desde] > DATOS_PIB[11] ? "end" : "middle"} fontFamily={F.cifra} fontWeight={700} fontSize={44} fill={col === C.mostaza ? C.tinta : C.tinta} stroke={C.crema} strokeWidth={8} paintOrder="stroke">{f.etiqueta}</text> : null}
                {kk > 0.98 ? <polygon points={`${xl + ux * 6},${yl + uy * 6} ${xl - ux * 30 - uy * 18},${yl - uy * 30 + ux * 18} ${xl - ux * 30 + uy * 18},${yl - uy * 30 - ux * 18}`} fill={col} stroke={C.tinta} strokeWidth={3} strokeLinejoin="round" /> : null}
                <g opacity={ease(kk, 0.5, 1)}>
                  <line x1={cx} y1={cy - dir * 34} x2={cx} y2={cy + dir * 20} stroke={col} strokeWidth={12} strokeLinecap="round" />
                  <polygon points={`${cx},${cy + dir * 46} ${cx - 20},${cy + dir * 18} ${cx + 20},${cy + dir * 18}`} fill={col} stroke={C.tinta} strokeWidth={3} strokeLinejoin="round" />
                </g>
              </g>
            );
          })}
          {b > 10.99 ? <circle cx={xl} cy={yl} r={30 * pulso} fill="none" stroke={C.mostaza} strokeWidth={5} opacity={0.8} /> : null}
        </g>
      </svg>
    </div>
  );
};

export const REGISTRO_049: Record<string, React.FC<any>> = {pibSerie: PibSerie};
