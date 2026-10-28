import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';
import {MAPA_ES} from './datosMapaSenado';

/** Componentes de la pieza 026 (choque de trenes en Urda). Tono sobrio: sin personas, sin efectos. Tiempos en segundos de la ESCENA. */
const M = MAPA_ES as any;
const T = C.tinta;
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const cl = (x: number) => Math.min(1, Math.max(0, x));

const Capa: React.FC<{en?: number; hasta?: number; children: React.ReactNode}> = ({en = 0, hasta, children}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const f = useCurrentFrame();
  const bob = 8 * Math.sin((f / 30) * 2.0);
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(p, 1) * s, transform: `translateY(${bob}px)`}}>{children}</svg>;
};
const tiempo = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {f, fps, t: f / fps};
};
const ease = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});

// Proyección horneada (px a 200 px/grado, cos 40°), igual que MapaTopeS
const bx = (lon: number) => (lon + 9.5) * 0.766 * 200 - 20;
const by = (lat: number) => (44.0 - lat) * 200 - 130;
const URDA = {lon: -3.72, lat: 39.42};
const MADRID = {lon: -3.70, lat: 40.42};
const SEVILLA = {lon: -5.98, lat: 37.39};

/** Mapa de España peninsular. Toledo se enciende, punto en Urda, línea Madrid-Sevilla (gris y tachada si `linea.gris`). `zoom`: acerca a Urda. */
export const MapaU: React.FC<{x?: number; y?: number; sc?: number; en?: number; hasta?: number; toledoEn?: number; urdaEn?: number; zoom?: {en: number; dur: number; escala: number}; linea?: {en: number; grisEn?: number; tachaEn?: number}; ciudades?: boolean}> = ({
  x = 540, y = 470, sc = 0.44, en = 0, hasta, toledoEn = 0.4, urdaEn = 0.8, zoom, linea, ciudades = false,
}) => {
  const {t} = tiempo();
  const [x0, y0, x1, y1] = M.bb;
  const w = (x1 - x0) * sc, h = (y1 - y0) * sc;
  const ox = x - w / 2, oy = y;
  const P = (p: {lon: number; lat: number}): [number, number] => [ox + (bx(p.lon) - x0) * sc, oy + (by(p.lat) - y0) * sc];
  const [ux, uy] = P(URDA);
  const [mx, my] = P(MADRID);
  const [sx, sy] = P(SEVILLA);
  const z = zoom ? 1 + (zoom.escala - 1) * ease(t, zoom.en, zoom.en + zoom.dur) : 1;
  const tol = t >= toledoEn;
  const pulso = 1 + 0.25 * Math.sin(t * 4);
  const lg = linea ? t >= (linea.grisEn ?? 99) : false;
  const tacha = linea ? ease(t, linea.tachaEn ?? 99, (linea.tachaEn ?? 99) + 0.5) : 0;
  const lp = linea ? ease(t, linea.en, linea.en + 0.8) : 0;
  const cx = (mx + sx) / 2, cy = (my + sy) / 2;
  return (
    <Capa en={en} hasta={hasta}>
      <defs><clipPath id="clipU"><rect x={0} y={500} width={960} height={640} /></clipPath></defs>
      <g clipPath="url(#clipU)">
      <g transform={`translate(${ux} ${uy}) scale(${z}) translate(${-ux} ${-uy})`}>
        <g transform={`translate(${ox} ${oy}) scale(${sc}) translate(${-x0} ${-y0})`}>
          {Object.keys(M.prov).map((n) => (
            <path key={n} d={M.prov[n].d} fill={n === 'Toledo' && tol ? C.mostaza : T} stroke={C.crema} strokeWidth={4 / sc * 0.5} fillRule="evenodd" strokeLinejoin="round" />
          ))}
        </g>
        {linea && (
          <g>
            <line x1={mx} y1={my} x2={mx + (sx - mx) * lp} y2={my + (sy - my) * lp} stroke={lg ? C.piedra : C.mostaza} strokeWidth={12} strokeLinecap="round" strokeDasharray={lg ? '4 20' : undefined} />
            {tacha > 0 && (
              <g>
                <path d={`M${cx - 34 * tacha} ${cy - 34 * tacha}L${cx + 34 * tacha} ${cy + 34 * tacha}M${cx + 34 * tacha} ${cy - 34 * tacha}L${cx - 34 * tacha} ${cy + 34 * tacha}`} stroke={C.crema} strokeWidth={22} strokeLinecap="round" />
                <path d={`M${cx - 34 * tacha} ${cy - 34 * tacha}L${cx + 34 * tacha} ${cy + 34 * tacha}M${cx + 34 * tacha} ${cy - 34 * tacha}L${cx - 34 * tacha} ${cy + 34 * tacha}`} stroke={C.teja} strokeWidth={12} strokeLinecap="round" />
              </g>
            )}
          </g>
        )}
        {(ciudades || linea) && (
          <g>
            <circle cx={mx} cy={my} r={11} fill={C.crema} stroke={T} strokeWidth={5} />
            <circle cx={sx} cy={sy} r={11} fill={C.crema} stroke={T} strokeWidth={5} />
          </g>
        )}
        {t >= urdaEn && (
          <g>
            <circle cx={ux} cy={uy} r={26 * pulso} fill={C.mostaza} opacity={0.35} />
            <circle cx={ux} cy={uy} r={13} fill={C.teja} stroke={C.crema} strokeWidth={4} />
          </g>
        )}
      </g>
      </g>
    </Capa>
  );
};

/** Cifra oficial con atribución. TODO cambia aquí: `cifra`, `fuente` y `hora` (se recomprueba antes de publicar). */
export const DatoU: React.FC<{cifra?: string; fuente?: string; hora?: string; sinConfirmar?: string; y?: number; en?: number; hasta?: number; fuenteEn?: number; sinEn?: number}> = ({
  cifra = '30', fuente = 'Junta de Castilla-La Mancha', hora = '10:30', sinConfirmar = 'Cifras más altas: sin confirmar', y = 380, en = 0, hasta, fuenteEn = 1.2, sinEn = 3.4,
}) => {
  const p = useEntrada(en);
  const p2 = useEntrada(fuenteEn);
  const p3 = useEntrada(sinEn);
  const s = useSalida(hasta);
  const bob = 8 * Math.sin((useCurrentFrame() / 30) * 2.0);
  const box = (txt: string, fs: number, bg: string, fg: string, pp: number, top: number) => (
    <div style={{position: 'absolute', left: 60, width: 860, top, opacity: Math.min(pp, 1) * s, transform: `translateY(${(1 - Math.min(pp, 1)) * 30 + bob}px)`}}>
      <span style={{fontFamily: F.texto, fontWeight: 700, fontSize: fs, lineHeight: 1.25, color: fg, background: bg, padding: '8px 24px', borderRadius: 14, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>{txt}</span>
    </div>
  );
  return (
    <>
      <div style={{position: 'absolute', left: 60, width: 900, top: y, opacity: Math.min(p, 1) * s, transform: `translateY(${(1 - Math.min(p, 1)) * 30 + bob}px)`}}>
        <div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 200, lineHeight: 1, color: T}}>{cifra}</div>
        <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 80, lineHeight: 1.15, color: T}}>{`Al menos ${cifra} fallecidos`}</div>
      </div>
      {box(`${fuente} · ${hora}`, 64, T, C.crema, p2, y + 310)}
      {box(sinConfirmar, 64, C.mostaza, T, p3, y + 490)}
    </>
  );
};

const Tren: React.FC<{x: number; y: number; w: number; color: string; flip?: boolean}> = ({x, y, w, color}) => {
  const h = 120;
  const vent = Math.floor((w - 150) / 70);
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M0 ${h} L0 20 Q0 0 20 0 L${w - 120} 0 Q${w - 30} 0 ${w} ${h - 30} L${w} ${h} Z`} fill={color} {...sw} />
      {Array.from({length: vent}).map((_, i) => <rect key={i} x={30 + i * 70} y={24} width={44} height={36} rx={6} fill={C.crema} stroke={T} strokeWidth={5} />)}
      <path d={`M${w - 100} 24 L${w - 50} 24 L${w - 22} 70 L${w - 100} 70 Z`} fill={C.crema} stroke={T} strokeWidth={5} strokeLinejoin="round" />
      <circle cx={w * 0.2} cy={h + 12} r={14} fill={T} />
      <circle cx={w * 0.7} cy={h + 12} r={14} fill={T} />
    </g>
  );
};

/** Alcance: el tren de atrás (mostaza) se acerca al de delante (tinta, más lento) por la misma vía. Esquema plano, sin choque dibujado. */
export const AlcanceU: React.FC<{y?: number; en?: number; hasta?: number; llegaEn?: number; dur?: number}> = ({y = 640, en = 0, hasta, llegaEn = 0.6, dur = 4}) => {
  const {t} = tiempo();
  const k = ease(t, llegaEn, llegaEn + dur);
  const w = 300;
  const frente = 600 + 25 * k; // el de delante avanza poco
  const atras = 40 + (frente - w - 20 - 40) * k;
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(0 ${y})`}>
        <Tren x={frente} y={0} w={w} color={T} />
        <Tren x={atras} y={0} w={w} color={C.mostaza} />
        <line x1={30} y1={150} x2={930} y2={150} stroke={T} strokeWidth={8} strokeLinecap="round" />
        {Array.from({length: 15}).map((_, i) => <line key={i} x1={50 + i * 62} y1={150} x2={50 + i * 62} y2={168} stroke={T} strokeWidth={6} strokeLinecap="round" />)}
        <path d={`M${atras + w / 2} -26 L${atras + w / 2 + 120} -26`} stroke={T} strokeWidth={7} strokeLinecap="round" />
        <path d={`M${atras + w / 2 + 120} -26 l-22 -16 M${atras + w / 2 + 120} -26 l-22 16`} stroke={T} strokeWidth={7} strokeLinecap="round" fill="none" />
      </g>
    </Capa>
  );
};

/** Señal -> aviso en cabina -> freno. Esquema genérico, sin siglas. Los pasos se encienden en `pasos` (segundos de escena). */
export const SeguridadU: React.FC<{y?: number; en?: number; hasta?: number; pasos?: [number, number, number]}> = ({y = 620, en = 0, hasta, pasos = [0.4, 1.8, 3.2]}) => {
  const {t} = tiempo();
  const on = (i: number) => (t >= pasos[i] ? 1 : 0.25);
  const col = (i: number) => (t >= pasos[i] ? C.mostaza : C.crema);
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(0 ${y})`}>
        {/* señal */}
        <g opacity={on(0)}>
          <rect x={113} y={0} width={14} height={300} fill={T} />
          <rect x={80} y={0} width={80} height={170} rx={14} fill={T} />
          <circle cx={120} cy={40} r={22} fill={t >= pasos[0] ? C.teja : C.piedra} />
          <circle cx={120} cy={110} r={22} fill={C.piedra} />
        </g>
        <path d="M200 120 L300 120 l-20 -16 m20 16 l-20 16" stroke={T} strokeWidth={7} strokeLinecap="round" fill="none" opacity={on(1)} />
        {/* aviso en cabina */}
        <g opacity={on(1)}>
          <rect x={320} y={30} width={280} height={170} rx={20} fill={col(1)} {...sw} />
          <path d="M460 70 a34 34 0 0 1 34 34 v26 l16 22 h-100 l16 -22 v-26 a34 34 0 0 1 34 -34 Z" fill={T} />
          <circle cx={460} cy={170} r={11} fill={T} />
        </g>
        <path d="M640 120 L740 120 l-20 -16 m20 16 l-20 16" stroke={T} strokeWidth={7} strokeLinecap="round" fill="none" opacity={on(2)} />
        {/* freno */}
        <g opacity={on(2)}>
          <circle cx={850} cy={115} r={90} fill={col(2)} {...sw} />
          <circle cx={850} cy={115} r={34} fill={T} />
          {[0, 90, 180, 270].map((a) => <circle key={a} cx={850 + 60 * Math.cos((a * Math.PI) / 180)} cy={115 + 60 * Math.sin((a * Math.PI) / 180)} r={9} fill={T} />)}
        </g>
      </g>
    </Capa>
  );
};

/** Línea de tiempo de 0 a 12 meses con el hito del informe final. */
export const PlazoU: React.FC<{y?: number; en?: number; hasta?: number; hitoEn?: number}> = ({y = 700, en = 0, hasta, hitoEn = 2.2}) => {
  const {t} = tiempo();
  const x0 = 90, x1 = 860;
  const k = ease(t, 0.3, hitoEn);
  const xh = x0 + (x1 - x0) * k;
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(0 ${y})`}>
        <line x1={x0} y1={100} x2={x1} y2={100} stroke={C.piedra} strokeWidth={12} strokeLinecap="round" />
        <line x1={x0} y1={100} x2={xh} y2={100} stroke={T} strokeWidth={12} strokeLinecap="round" />
        {Array.from({length: 13}).map((_, i) => <line key={i} x1={x0 + ((x1 - x0) * i) / 12} y1={80} x2={x0 + ((x1 - x0) * i) / 12} y2={120} stroke={T} strokeWidth={i === 0 || i === 12 ? 8 : 4} strokeLinecap="round" />)}
        <text x={x0} y={200} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={T} textAnchor="start">0</text>
        <text x={x1} y={200} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={T} textAnchor="end">12 meses</text>
        {t >= hitoEn && (
          <g>
            <circle cx={x1} cy={100} r={30} fill={C.mostaza} {...sw} />
            <path d={`M${x1 - 14} 100 l10 10 l20 -22`} stroke={T} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
        <circle cx={xh} cy={100} r={t >= hitoEn ? 0 : 16} fill={C.mostaza} {...sw} />
      </g>
    </Capa>
  );
};

/** Marcador fijo de las tres preguntas (026 v2). Tres círculos de 84 px junto al logo (x 598-902, y 254-338).
 * estados: 'pend' | 'act' | 'ok'; `pop` = [1-3, segundos] anima el círculo que cambia. Con en:-1 está ya visible en el fotograma 1. */
export const MarcadorU: React.FC<{estados: ('pend' | 'act' | 'ok')[]; pops?: (number | null)[]; aparece?: number[]; y?: number}> = ({estados, pops = [null, null, null], aparece, y = 296}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {[0, 1, 2].map((i) => {
        const cx = 640 + i * 110;
        const ap = aparece ? aparece[i] : -1;
        const vis = cl((t - ap) / 0.25);
        const pp = pops[i];
        const k = pp === null || pp === undefined ? 1 : 1 + 0.3 * Math.max(0, Math.sin(cl((t - pp) / 0.5) * Math.PI)) * (t >= pp ? 1 : 0);
        const e = estados[i];
        const fill = e === 'ok' ? C.turquesa : e === 'act' ? C.mostaza : C.crema;
        const stroke = e === 'pend' ? C.piedra : T;
        const col = e === 'ok' ? C.crema : e === 'act' ? T : C.piedra;
        return (
          <g key={i} opacity={vis} transform={`translate(${cx} ${y}) scale(${k * (0.7 + 0.3 * vis)})`}>
            <circle r={42} fill={fill} stroke={stroke} strokeWidth={6} />
            <text textAnchor="middle" y={22} fontFamily={F.titular} fontSize={64} fill={col}>{e === 'ok' ? '✓' : String(i + 1)}</text>
          </g>
        );
      })}
    </svg>
  );
};

/** Pastillas de texto (sin logos ni colores de partido), una por entrada en su palabra. items: {texto, en, y}. */
export const PastillasU: React.FC<{items: {texto: string; en: number; y: number; x?: number}[]; hasta?: number}> = ({items, hasta}) => {
  const s = useSalida(hasta);
  const bob = 8 * Math.sin((useCurrentFrame() / 30) * 2.0);
  return (
    <>
      {items.map((it, i) => <Pastilla key={i} {...it} s={s} bob={bob} />)}
    </>
  );
};
const Pastilla: React.FC<{texto: string; en: number; y: number; x?: number; s: number; bob: number}> = ({texto, en, y, x = 60, s, bob}) => {
  const p = useEntrada(en);
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: Math.min(p, 1) * s, transform: `translate(${(1 - Math.min(p, 1)) * -80}px, ${bob}px)`}}>
      <span style={{display: 'inline-block', fontFamily: F.texto, fontWeight: 700, fontSize: 80, lineHeight: 1.15, color: C.crema, background: T, padding: '6px 28px', borderRadius: 16}}>{texto}</span>
    </div>
  );
};

/** Resumen de cierre: tres filas numeradas que aparecen una a una (026 v2). */
export const ResumenU: React.FC<{filas: {texto: string; en: number}[]; y?: number}> = ({filas, y = 520}) => {
  const bob = 8 * Math.sin((useCurrentFrame() / 30) * 2.0);
  return (
    <>
      {filas.map((fl, i) => <Fila key={i} n={i + 1} texto={fl.texto} en={fl.en} y={y + i * 190} bob={bob} />)}
    </>
  );
};
const Fila: React.FC<{n: number; texto: string; en: number; y: number; bob: number}> = ({n, texto, en, y, bob}) => {
  const p = useEntrada(en);
  return (
    <div style={{position: 'absolute', left: 60, top: y, display: 'flex', alignItems: 'center', opacity: Math.min(p, 1), transform: `translate(${(1 - Math.min(p, 1)) * -80}px, ${bob}px)`}}>
      <div style={{width: 96, height: 96, borderRadius: 48, background: C.turquesa, border: `6px solid ${T}`, boxSizing: 'border-box', color: C.crema, fontFamily: F.titular, fontSize: 64, lineHeight: '84px', textAlign: 'center', marginRight: 24, flex: 'none'}}>✓</div>
      <span style={{fontFamily: F.texto, fontWeight: 700, fontSize: 72, lineHeight: 1.1, color: T, maxWidth: 800}}>{texto}</span>
    </div>
  );
};
