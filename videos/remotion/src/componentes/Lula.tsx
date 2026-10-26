import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';
import {RUTA} from './Brasil';

/** Componentes de la pieza 025 (Brasil: Lula reelegido). Lienzo 1080x1920; tiempos en segundos de la ESCENA. Todo con x <= 955. */
const T = C.tinta;
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const cl = (x: number) => Math.min(1, Math.max(0, x));
const easeIO = (u: number) => u * u * (3 - 2 * u);
const easeO = (u: number) => 1 - Math.pow(1 - u, 3);
const coma = (v: number, dec: number) => v.toFixed(dec).replace('.', ',');
const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};

const Capa: React.FC<{en?: number; hasta?: number; bob?: number; children: React.ReactNode}> = ({en = 0, hasta, bob = 8, children}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const f = useCurrentFrame();
  const b = bob * Math.sin((f / 30) * 2.2);
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(p, 1) * s, transform: `translateY(${b}px)`}}>{children}</svg>;
};

type Item = {nombre: string; valor: number; color: string; en?: number; dur?: number; dec?: number; gano?: number};

/**
 * Barras horizontales de resultados (eje desde 0, misma escala: `max` = 100 % del ancho útil).
 * `fila`: nombre a la izquierda en la misma fila (para dejar sitio arriba). `corchete`: {en, texto} dos líneas guía entre los extremos y pastilla debajo.
 * `gano` en un item: desde ese segundo la cifra se sustituye por la pastilla "GANÓ".
 */
export const BarrasL: React.FC<{items: Item[]; y0?: number; fila?: boolean; max?: number; barAlto?: number; paso?: number; corchete?: {en: number; texto: string}; en?: number; hasta?: number; mapa?: boolean}> = ({
  items, y0 = 520, fila = false, max = 60, barAlto = 110, paso = 250, corchete, en = 0, hasta, mapa = false,
}) => {
  const t = useT();
  const x0 = fila ? 330 : 60;
  const W = fila ? 380 : 640;
  const ends = items.map((it) => {
    const e0 = it.en ?? 0;
    const k = it.dur === 0 || e0 < 0 ? 1 : easeO(cl((t - e0) / (it.dur ?? 1.1)));
    return {k, x: x0 + (W * it.valor / max) * k};
  });
  return (
    <>
      {mapa ? <MapaL gris x={540} y={820} tamano={620} opacidad={0.16} en={en} hasta={hasta} /> : null}
      <Capa en={en} hasta={hasta}>
        <line x1={x0} y1={y0 - 10} x2={x0} y2={y0 + paso * (items.length - 1) + barAlto + (fila ? 10 : 90)} stroke={T} strokeWidth={5} />
        {items.map((it, i) => {
          const y = y0 + i * paso + (fila ? 0 : 80);
          const g = it.gano !== undefined && t >= it.gano;
          const gk = g ? easeO(cl((t - (it.gano as number)) / 0.35)) : 0;
          const vis = it.en !== undefined && it.en >= 0 && t < it.en ? 0 : 1;
          return (
            <g key={i} opacity={vis}>
              {fila ? (
                <text x={60} y={y + barAlto / 2 + 22} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={T}>{it.nombre}</text>
              ) : (
                <text x={60} y={y - 18} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={T}>{it.nombre}</text>
              )}
              <rect x={x0} y={y} width={Math.max(2, ends[i].x - x0)} height={barAlto} rx={14} fill={it.color} stroke={T} strokeWidth={g ? 9 : 6} />
              {g ? (
                <g transform={`translate(${ends[i].x + 16} ${y + barAlto / 2}) scale(${0.6 + 0.4 * gk})`} opacity={gk}>
                  <rect x={0} y={-48} width={250} height={96} rx={20} fill={C.mostaza} stroke={T} strokeWidth={7} />
                  <text x={125} y={26} textAnchor="middle" fontFamily={F.titular} fontSize={72} fill={T}>GANÓ</text>
                </g>
              ) : (
                <text x={ends[i].x + 16} y={y + barAlto / 2 + 24} fontFamily={F.cifra} fontWeight={700} fontSize={72} fill={T}>
                  {coma(it.valor, it.dec ?? 1)} %
                </text>
              )}
            </g>
          );
        })}
        {corchete && items.length >= 2 ? (() => {
          const k = easeO(cl((t - corchete.en) / 0.5));
          const xs = [ends[0].x, ends[1].x];
          const a = Math.min(...xs), b = Math.max(...xs);
          const yTop = y0 + 80 + barAlto, yBot = y0 + paso + 80 + barAlto + 36;
          return (
            <g opacity={k}>
              <line x1={a} y1={yTop} x2={a} y2={yBot} stroke={T} strokeWidth={5} strokeDasharray="12 10" />
              <line x1={b} y1={y0 + 80} x2={b} y2={yBot} stroke={T} strokeWidth={5} strokeDasharray="12 10" />
              <path d={`M${a} ${yBot} L${b} ${yBot}`} {...sw} />
              <g transform={`translate(${(a + b) / 2} ${yBot + 70}) scale(${0.7 + 0.3 * k})`}>
                <rect x={-160} y={-48} width={320} height={96} rx={20} fill={C.mostaza} stroke={T} strokeWidth={7} />
                <text x={0} y={24} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>{corchete.texto}</text>
              </g>
            </g>
          );
        })() : null}
      </Capa>
    </>
  );
};

/** Mapa de Brasil. `gris`: silueta gris piedra de fondo. `urnas`: puntos turquesa (abiertas) y grises (cerradas) repartidos sin criterio geográfico. */
export const MapaL: React.FC<{x?: number; y?: number; tamano?: number; gris?: boolean; urnas?: boolean; opacidad?: number; abiertasEn?: number; leyenda?: [number, number]; en?: number; hasta?: number}> = ({x = 540, y = 820, tamano = 560, gris = false, urnas = false, opacidad = 1, abiertasEn = 0.6, leyenda, en = 0, hasta}) => {
  const t = useT();
  const k = tamano / 200;
  const pts: {cx: number; cy: number; ab: boolean}[] = [];
  let n = 0;
  for (let gy = 8; gy < 200; gy += 14) for (let gx = 8; gx < 205; gx += 14) {
    n++;
    pts.push({cx: gx, cy: gy, ab: ((n * 7 + Math.floor(gy / 14) * 3) % 5) < 3});
  }
  return (
    <Capa en={en} hasta={hasta} bob={5}>
      <g transform={`translate(${x} ${y}) scale(${k}) translate(-100 -97)`} opacity={opacidad}>
        <defs><clipPath id="clipBr"><path d={RUTA} /></clipPath></defs>
        <path d={RUTA} fill={gris ? C.piedra : C.crema} stroke={gris ? C.piedra : T} strokeWidth={5 / k} strokeLinejoin="round" />
        {urnas ? (
          <g clipPath="url(#clipBr)">
            {pts.map((p, i) => {
              const ab = p.ab && t >= abiertasEn;
              return <circle key={i} cx={p.cx} cy={p.cy} r={4.6} fill={ab ? C.turquesa : C.piedra} />;
            })}
          </g>
        ) : null}
      </g>
      {leyenda ? (
        <g>
          <circle cx={leyenda[0]} cy={leyenda[1]} r={22} fill={C.turquesa} {...sw} strokeWidth={5} />
          <text x={leyenda[0] + 40} y={leyenda[1] + 22} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={T}>ABIERTAS</text>
          <circle cx={leyenda[0]} cy={leyenda[1] + 120} r={22} fill={C.piedra} {...sw} strokeWidth={5} />
          <text x={leyenda[0] + 40} y={leyenda[1] + 142} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={T}>CERRADAS</text>
        </g>
      ) : null}
    </Capa>
  );
};

/** Calendario plano: mes y día; `pasa` pasa hojas (el número sube cada 0,14 s desde `dia`). `marca` = aro mostaza que se dibuja al segundo indicado. */
export const CalendarioL: React.FC<{mes?: string; dia: number; x?: number; y?: number; lado?: number; marca?: number; pasa?: boolean; en?: number; hasta?: number}> = ({mes = 'OCTUBRE', dia, x = 540, y = 700, lado = 380, marca, pasa = false, en = 0, hasta}) => {
  const t = useT();
  const d = pasa ? dia + Math.floor(Math.max(0, t - en) / 0.14) : dia;
  const a = marca === undefined ? 0 : easeO(cl((t - marca) / 0.5));
  const h = lado * 0.3;
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x - lado / 2} ${y - lado / 2})`}>
        <rect x={0} y={14} width={lado} height={lado} rx={26} fill="rgba(20,33,61,0.25)" />
        <rect x={0} y={0} width={lado} height={lado} rx={26} fill={C.crema} {...sw} />
        <path d={`M0 ${h} V26 Q0 0 26 0 H${lado - 26} Q${lado} 0 ${lado} 26 V${h} Z`} fill={C.mostaza} {...sw} />
        <circle cx={lado * 0.25} cy={0} r={11} fill={T} />
        <circle cx={lado * 0.75} cy={0} r={11} fill={T} />
        <text x={lado / 2} y={h - 18} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={64} fill={T}>{mes}</text>
        <text x={lado / 2} y={h + (lado - h) * 0.72} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={lado * 0.42} fill={T}>{d}</text>
        <ellipse cx={lado / 2} cy={h + (lado - h) * 0.5} rx={(lado * 0.4) * a} ry={(lado - h) * 0.46 * a} fill="none" stroke={C.teja} strokeWidth={9} opacity={a} />
      </g>
    </Capa>
  );
};

/** Dos barras de diferencia desde un eje común: izquierda (negativa, mostaza) y derecha (positiva, turquesa), unidas por una flecha. Escala 120 px por millón. */
export const DiferenciaL: React.FC<{y0?: number; eje?: number; en?: number; hasta?: number; b?: number; flecha?: number}> = ({y0 = 520, eje = 330, en = 0, hasta, b = 1.6, flecha = 1.3}) => {
  const t = useT();
  const esc = 120;
  const k1 = easeO(cl((t - 0.1) / 0.9));
  const k2 = easeO(cl((t - b) / 1.0));
  const fl = easeIO(cl((t - flecha) / 0.6));
  const alto = 120;
  const y1 = y0, y2 = y0 + 270;
  return (
    <Capa en={en} hasta={hasta}>
      <line x1={eje} y1={y1 - 20} x2={eje} y2={y2 + alto + 20} stroke={T} strokeWidth={5} strokeDasharray="12 10" />
      <rect x={eje - 2.2 * esc * k1} y={y1} width={Math.max(2, 2.2 * esc * k1)} height={alto} rx={14} fill={C.mostaza} {...sw} />
      {k1 > 0.55 ? <text x={eje - 2.2 * esc / 2} y={y1 + alto / 2 + 22} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>−2,2 M</text> : null}
      <text x={60} y={y1 + alto + 70} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={T}>1.ª VUELTA</text>
      <path d={`M${eje - 90} ${y1 + alto + 90} C${eje - 20} ${y1 + alto + 190} ${eje + 20} ${y2 - 30} ${eje + 70} ${y2 - 20}`} fill="none" stroke={C.teja} strokeWidth={9} strokeLinecap="round" strokeDasharray="520" strokeDashoffset={520 * (1 - fl)} opacity={fl > 0 ? 1 : 0} />
      <g opacity={k2 > 0 ? 1 : 0}>
        <rect x={eje} y={y2} width={Math.max(2, 4.4 * esc * k2)} height={alto} rx={14} fill={C.turquesa} {...sw} />
        {k2 > 0.55 ? <text x={eje + 4.4 * esc / 2} y={y2 + alto / 2 + 22} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>+4,4 M</text> : null}
        <text x={eje} y={y2 + alto + 70} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={T}>2.ª VUELTA</text>
      </g>
    </Capa>
  );
};

/** Línea de elecciones presidenciales (9 puntos, 1989…2022) con hueco para 2026 y sello "NUNCA ANTES". */
export const LineaEleccionesL: React.FC<{y?: number; selloEn?: number; en?: number; hasta?: number}> = ({y = 720, selloEn = 1.4, en = 0, hasta}) => {
  const t = useT();
  const xs = Array.from({length: 9}, (_, i) => 80 + i * 78);
  const xh = 880;
  const k = easeO(cl((t - selloEn) / 0.35));
  return (
    <Capa en={en} hasta={hasta}>
      <line x1={60} y1={y} x2={940} y2={y} {...sw} />
      {xs.map((x, i) => {
        const on = t > 0.15 + i * 0.12;
        return <circle key={i} cx={x} cy={y} r={on ? 20 : 4} fill={C.piedra} stroke={T} strokeWidth={6} />;
      })}
      <circle cx={xh} cy={y} r={30} fill="none" stroke={T} strokeWidth={7} strokeDasharray="10 9" />
      <text x={80} y={y + 100} fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>1989</text>
      <text x={xs[8] - 20} y={y + 100} textAnchor="end" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>2022</text>
      <text x={xh} y={y + 190} textAnchor="end" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>2026</text>
      <g transform={`translate(560 ${y - 190}) rotate(-6) scale(${0.5 + 0.5 * k})`} opacity={k}>
        <rect x={-300} y={-60} width={600} height={120} rx={18} fill="rgba(141,153,174,0.45)" stroke={T} strokeWidth={9} />
        <text x={0} y={24} textAnchor="middle" fontFamily={F.titular} fontSize={72} fill={T}>NUNCA ANTES</text>
      </g>
    </Capa>
  );
};

/** Bocadillo con texto (64 px, ≤ 7 palabras) y cola hacia (colaX, colaY). */
export const BocadilloL: React.FC<{lineas: string[]; x?: number; y?: number; ancho?: number; colaX?: number; colaY?: number; en?: number; hasta?: number}> = ({lineas, x = 505, y = 600, ancho = 880, colaX = 230, colaY = 900, en = 0, hasta}) => {
  const alto = lineas.length * 78 + 56;
  const x0 = x - ancho / 2, y0 = y - alto / 2;
  const cx = Math.min(Math.max(colaX, x0 + 80), x0 + ancho - 160);
  return (
    <Capa en={en} hasta={hasta} bob={5}>
      <path d={`M${cx} ${y0 + alto - 4} L${colaX} ${colaY} L${cx + 80} ${y0 + alto - 4} Z`} fill={C.crema} {...sw} />
      <rect x={x0} y={y0} width={ancho} height={alto} rx={36} fill={C.crema} {...sw} />
      <rect x={cx + 6} y={y0 + alto - 12} width={68} height={16} fill={C.crema} />
      {lineas.map((l, i) => (
        <text key={i} x={x0 + 36} y={y0 + 28 + 60 + i * 78} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={T}>{l}</text>
      ))}
    </Capa>
  );
};

/** Reloj analógico. Marca `h0` y salta a `h1` en el segundo `salta`. `marca` = segundo en que aparece un marcador mostaza en h1. `gira` = las agujas giran sin parar (espera). */
export const RelojL: React.FC<{x?: number; y?: number; r?: number; h0?: number; h1?: number; salta?: number; marca?: number; digital?: boolean; texto?: string; digitalDx?: number; digitalDy?: number; gira?: boolean; en?: number; hasta?: number}> = ({
  x = 300, y = 760, r = 170, h0 = 17, h1, salta, marca, digital = true, texto, digitalDx = 0, digitalDy, gira = false, en = 0, hasta,
}) => {
  const t = useT();
  const k = h1 !== undefined && salta !== undefined ? easeIO(cl((t - salta) / 0.7)) : 0;
  const h = h0 + ((h1 ?? h0) - h0) * k;
  const ang = (a: number) => ({x: Math.sin((a * Math.PI) / 180), y: -Math.cos((a * Math.PI) / 180)});
  const ha = gira ? t * 50 : (h % 12) * 30;
  const ma = gira ? t * 600 : 0;
  const hv = ang(ha), mv = ang(ma);
  const mk = h1 === undefined ? null : ang((h1 % 12) * 30);
  const mkOn = marca !== undefined && t >= marca;
  const hh = Math.round(h);
  const ticks = Array.from({length: 12}, (_, i) => ang(i * 30));
  const txtY = digitalDy ?? r + 100;
  return (
    <Capa en={en} hasta={hasta}>
      <circle cx={x} cy={y} r={r} fill={C.crema} {...sw} />
      {ticks.map((v, i) => <line key={i} x1={x + v.x * (r - 22)} y1={y + v.y * (r - 22)} x2={x + v.x * (r - 8)} y2={y + v.y * (r - 8)} {...sw} strokeWidth={6} />)}
      {mk && mkOn ? <circle cx={x + mk.x * (r - 34)} cy={y + mk.y * (r - 34)} r={r * 0.17} fill={C.mostaza} stroke={T} strokeWidth={6} /> : null}
      <line x1={x} y1={y} x2={x + hv.x * r * 0.5} y2={y + hv.y * r * 0.5} {...sw} strokeWidth={12} />
      <line x1={x} y1={y} x2={x + mv.x * r * 0.78} y2={y + mv.y * r * 0.78} {...sw} strokeWidth={8} />
      <circle cx={x} cy={y} r={11} fill={T} />
      {digital ? <text x={x + digitalDx} y={y + txtY} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={72} fill={T}>{texto ?? (h1 !== undefined && salta === undefined && mkOn ? `${h0}:00 · ${h1}:00` : `${hh}:00`)}</text> : null}
    </Capa>
  );
};

/** Tarjeta plana con silueta sin rasgos y 1-2 líneas de texto (64 px). Mismo formato para todas las personas/campañas. */
export const TarjetaL: React.FC<{lineas: string[]; x?: number; y?: number; ancho?: number; en?: number; hasta?: number; luz?: number}> = ({lineas, x = 505, y = 640, ancho = 880, en = 0, hasta, luz}) => {
  const t = useT();
  const alto = 150 + lineas.length * 78 + 30;
  const x0 = x - ancho / 2, y0 = y - alto / 2;
  const l = luz !== undefined && t >= luz;
  return (
    <Capa en={en} hasta={hasta} bob={5}>
      <rect x={x0} y={y0 + 12} width={ancho} height={alto} rx={28} fill="rgba(20,33,61,0.25)" />
      <rect x={x0} y={y0} width={ancho} height={alto} rx={28} fill={C.crema} stroke={T} strokeWidth={l ? 11 : 7} />
      <circle cx={x} cy={y0 + 62} r={34} fill={C.piedra} stroke={T} strokeWidth={6} />
      <path d={`M${x - 70} ${y0 + 140} Q${x - 70} ${y0 + 104} ${x} ${y0 + 104} Q${x + 70} ${y0 + 104} ${x + 70} ${y0 + 140} Z`} fill={C.piedra} stroke={T} strokeWidth={6} strokeLinejoin="round" />
      {lineas.map((s, i) => (
        <text key={i} x={x} y={y0 + 150 + 56 + i * 78} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={64} fill={T}>{s}</text>
      ))}
    </Capa>
  );
};

/** Autobús plano con aspa teja al lado. */
export const AutobusL: React.FC<{x?: number; y?: number; ancho?: number; aspaEn?: number; en?: number; hasta?: number}> = ({x = 330, y = 640, ancho = 400, aspaEn = 0.8, en = 0, hasta}) => {
  const t = useT();
  const k = ancho / 400;
  const a = easeO(cl((t - aspaEn) / 0.35));
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x - ancho / 2} ${y - 110 * k}) scale(${k})`}>
        <rect x={0} y={0} width={400} height={190} rx={32} fill={C.mostaza} {...sw} />
        {[28, 120, 212].map((vx) => <rect key={vx} x={vx} y={28} width={76} height={70} rx={10} fill={C.crema} {...sw} strokeWidth={5} />)}
        <rect x={304} y={28} width={68} height={130} rx={10} fill={C.crema} {...sw} strokeWidth={5} />
        <line x1={0} y1={122} x2={290} y2={122} {...sw} strokeWidth={5} />
        <circle cx={92} cy={198} r={34} fill={T} />
        <circle cx={92} cy={198} r={12} fill={C.crema} />
        <circle cx={310} cy={198} r={34} fill={T} />
        <circle cx={310} cy={198} r={12} fill={C.crema} />
      </g>
      <g transform={`translate(${x + ancho / 2 + 120} ${y}) scale(${a})`} opacity={a}>
        <line x1={-60} y1={-60} x2={60} y2={60} stroke={C.teja} strokeWidth={22} strokeLinecap="round" />
        <line x1={60} y1={-60} x2={-60} y2={60} stroke={C.teja} strokeWidth={22} strokeLinecap="round" />
      </g>
    </Capa>
  );
};

/** Nube de lluvia plana con gotas que caen. */
export const NubeL: React.FC<{x?: number; y?: number; ancho?: number; en?: number; hasta?: number}> = ({x = 700, y = 960, ancho = 340, en = 0, hasta}) => {
  const t = useT();
  const k = ancho / 340;
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x - ancho / 2} ${y - 90 * k}) scale(${k})`}>
        <path d="M70 120 Q10 120 10 80 Q10 40 60 40 Q80 -10 140 0 Q190 -20 220 30 Q330 20 330 80 Q330 120 270 120 Z" fill={C.piedra} {...sw} />
        {[60, 130, 200, 270].map((gx, i) => {
          const f = ((t * 1.3 + i * 0.27) % 1);
          return <line key={gx} x1={gx} y1={140 + f * 60} x2={gx - 12} y2={170 + f * 60} stroke={C.turquesa} strokeWidth={10} strokeLinecap="round" opacity={1 - f * 0.6} />;
        })}
      </g>
    </Capa>
  );
};

/** Fachada plana del TSE (frontón, columnas, escalinata) con las siglas en el frontón. */
export const FachadaL: React.FC<{x?: number; y?: number; ancho?: number; texto?: string; en?: number; hasta?: number}> = ({x = 540, y = 700, ancho = 640, texto = 'TSE', en = 0, hasta}) => {
  const k = ancho / 640;
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x - ancho / 2} ${y - 170 * k}) scale(${k})`}>
        <path d="M0 110 L320 0 L640 110 Z" fill={C.mostaza} {...sw} />
        <text x={320} y={98} textAnchor="middle" fontFamily={F.titular} fontSize={54} fill={T}>{texto}</text>
        <rect x={20} y={118} width={600} height={22} fill={C.crema} {...sw} />
        {[50, 150, 250, 350, 450, 550].map((cx) => <rect key={cx} x={cx} y={148} width={40} height={140} fill={C.crema} {...sw} strokeWidth={6} />)}
        <rect x={10} y={290} width={620} height={24} fill={C.crema} {...sw} />
        <rect x={-14} y={316} width={668} height={24} fill={C.crema} {...sw} />
      </g>
    </Capa>
  );
};

/** Línea del tiempo con "5 ENE 2027" que se enciende y barra de 4 años que crece. */
export const PosesionL: React.FC<{y?: number; enciende?: number; barra?: number; en?: number; hasta?: number}> = ({y = 760, enciende = 0.4, barra = 1.4, en = 0, hasta}) => {
  const t = useT();
  const a = easeO(cl((t - enciende) / 0.4));
  const b = easeIO(cl((t - barra) / 1.8));
  const x1 = 110, x2 = 900;
  return (
    <Capa en={en} hasta={hasta}>
      <line x1={60} y1={y} x2={950} y2={y} {...sw} />
      <rect x={x1} y={y - 30} width={Math.max(0, (x2 - x1) * b)} height={60} rx={14} fill={C.turquesa} {...sw} opacity={b > 0 ? 1 : 0} />
      <circle cx={x1} cy={y} r={30 + 8 * a} fill={a > 0.5 ? C.mostaza : C.crema} {...sw} />
      <text x={x1 - 30} y={y - 70} fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T} opacity={a}>5 ENE 2027</text>
      <text x={(x1 + x2) / 2} y={y + 120} textAnchor="middle" fontFamily={F.titular} fontSize={72} fill={T} opacity={b > 0.6 ? 1 : 0}>4 AÑOS</text>
    </Capa>
  );
};

/** Dos botones planos para la pregunta de cierre. */
export const BotonesL: React.FC<{a: string; b: string; y?: number; en?: number; hasta?: number}> = ({a, b, y = 880, en = 0, hasta}) => (
  <Capa en={en} hasta={hasta} bob={6}>
    <rect x={60} y={y + 10} width={410} height={130} rx={30} fill="rgba(20,33,61,0.3)" />
    <rect x={60} y={y} width={410} height={130} rx={30} fill={T} />
    <text x={265} y={y + 88} textAnchor="middle" fontFamily={F.titular} fontSize={60} fill={C.crema}>{a}</text>
    <rect x={500} y={y + 10} width={410} height={130} rx={30} fill="rgba(20,33,61,0.3)" />
    <rect x={500} y={y} width={410} height={130} rx={30} fill={C.turquesa} stroke={T} strokeWidth={7} />
    <text x={705} y={y + 88} textAnchor="middle" fontFamily={F.titular} fontSize={60} fill={T}>{b}</text>
  </Capa>
);

/** Bloque de texto sencillo (varias líneas, tamaño en px) con entrada suave. Para nombres y créditos junto a los retratos. */
export const TextoL: React.FC<{lineas: {t: string; tam?: number; peso?: number; color?: string}[]; x?: number; y?: number; en?: number; hasta?: number}> = ({lineas, x = 350, y = 500, en = 0, hasta}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 960 - x, opacity: Math.min(p, 1) * s, transform: `translateX(${(1 - Math.min(p, 1)) * 40}px)`}}>
      {lineas.map((l, i) => (
        <div key={i} style={{fontFamily: F.texto, fontWeight: (l.peso ?? 700) as any, fontSize: l.tam ?? 64, lineHeight: 1.18, color: l.color ?? T}}>{l.t}</div>
      ))}
    </div>
  );
};

/** Interrogación plana (disco mostaza con "?") para el retrato de Flávio. */
export const InterrogaL: React.FC<{x?: number; y?: number; r?: number; en?: number; hasta?: number}> = ({x = 320, y = 830, r = 52, en = 0, hasta}) => (
  <Capa en={en} hasta={hasta} bob={5}>
    <circle cx={x} cy={y} r={r} fill={C.mostaza} {...sw} />
    <text x={x} y={y + r * 0.42} textAnchor="middle" fontFamily={F.titular} fontSize={r * 1.3} fill={T}>?</text>
  </Capa>
);

export const REGISTRO_025: Record<string, React.FC<any>> = {
  barrasL: BarrasL, mapaL: MapaL, calendarioL: CalendarioL, diferenciaL: DiferenciaL, lineaEleccionesL: LineaEleccionesL, bocadilloL: BocadilloL,
  relojL: RelojL, tarjetaL: TarjetaL, autobusL: AutobusL, nubeL: NubeL, fachadaL: FachadaL, posesionL: PosesionL, botonesL: BotonesL, textoL: TextoL, interrogaL: InterrogaL,
};
