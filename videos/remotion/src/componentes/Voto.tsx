import React from 'react';
import {Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {useEntrada, useSalida} from './util';

/**
 * Componentes propios de la pieza 008 (voto por correo). Nombres nuevos: no tocan los compartidos.
 * Se registran en REGISTRO_008 y se mezclan en `index.tsx`. Tiempos en segundos desde el inicio de la escena.
 * Los dibujos van sobre un lienzo SVG de 1080x1920 (coordenadas absolutas de pantalla).
 */
const T = C.tinta;
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const cl = (x: number) => Math.min(1, Math.max(0, x));
const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

const Lienzo: React.FC<{opacity?: number; children: React.ReactNode}> = ({opacity = 1, children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity}}>{children}</svg>
);

/* ------------------------------------------------------------------ Dibujos de 200x200 */
const DIB: Record<string, (p: number, o: Record<string, any>) => React.ReactNode> = {
  sobre: (p, o) => (
    <g>
      <rect x="18" y="44" width="164" height="116" rx="10" fill={o.color ?? C.crema} {...sw} />
      <path d="M18 54 L100 112 L182 54" fill="none" {...sw} />
      <path d="M18 154 L78 96 M182 154 L122 96" fill="none" {...sw} strokeWidth={5} />
      <circle cx="100" cy="112" r="11" fill={C.mostaza} {...sw} strokeWidth={5} />
    </g>
  ),
  sobreCandado: () => (
    <g>
      <g transform="translate(-6 -14)">{DIB.sobre(0, {})}</g>
      <path d="M118 128 v-16 a22 22 0 0 1 44 0 v16" fill="none" {...sw} strokeWidth={9} />
      <rect x="104" y="126" width="72" height="58" rx="12" fill={C.mostaza} {...sw} />
      <circle cx="140" cy="152" r="8" fill={T} />
    </g>
  ),
  dni: (p, o) => (
    <g>
      <rect x="10" y="40" width="180" height="120" rx="14" fill={C.crema} {...sw} />
      <rect x="24" y="58" width="56" height="70" rx="6" fill={C.piedra} opacity={0.55} />
      <circle cx="52" cy="82" r="14" fill={C.piedra} />
      <path d="M28 126 q24 -32 48 0 z" fill={C.piedra} />
      <rect x="94" y="62" width="78" height="10" rx="5" fill={T} opacity={0.55} />
      <rect x="94" y="84" width="60" height="10" rx="5" fill={T} opacity={0.35} />
      <rect x="94" y="106" width="70" height="10" rx="5" fill={T} opacity={0.35} />
      {o.sinTexto ? null : <text x="26" y="150" fontFamily={F.titular} fontSize="17" fill={T}>DNI</text>}
    </g>
  ),
  portatil: () => (
    <g>
      <rect x="34" y="34" width="132" height="94" rx="10" fill={C.crema} {...sw} />
      <path d="M10 148 h180 l-14 -20 h-152 z" fill={C.piedra} {...sw} />
      <circle cx="100" cy="80" r="26" fill={C.mostaza} {...sw} />
      <path d="M87 80 l10 10 l18 -22" fill="none" stroke={T} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M86 102 l-6 22 l20 -10 l20 10 l-6 -22" fill={C.turquesa} {...sw} strokeWidth={5} />
    </g>
  ),
  oficina: () => (
    <g>
      <path d="M14 70 L100 22 L186 70 Z" fill={C.mostaza} {...sw} />
      <rect x="28" y="70" width="144" height="110" fill={C.crema} {...sw} />
      <rect x="28" y="76" width="144" height="34" fill={T} />
      <text x="100" y="101" textAnchor="middle" fontFamily={F.titular} fontSize="22" fill={C.crema}>CORREOS</text>
      <rect x="46" y="124" width="38" height="56" rx="4" fill={C.piedra} {...sw} strokeWidth={5} />
      <rect x="106" y="124" width="48" height="34" rx="4" fill={C.turquesa} opacity={0.6} {...sw} strokeWidth={5} />
    </g>
  ),
  cartero: () => (
    <g>
      <path d="M44 190 v-52 a56 44 0 0 1 112 0 v52 z" fill={C.mostaza} {...sw} />
      <circle cx="100" cy="64" r="34" fill={C.crema} {...sw} />
      <path d="M64 56 a36 30 0 0 1 72 0 z" fill={T} />
      <rect x="58" y="52" width="84" height="12" rx="6" fill={T} />
      <circle cx="88" cy="74" r="4" fill={T} />
      <circle cx="112" cy="74" r="4" fill={T} />
      <rect x="104" y="124" width="68" height="46" rx="6" fill={C.crema} {...sw} strokeWidth={6} />
      <path d="M104 130 l34 22 l34 -22" fill="none" {...sw} strokeWidth={5} />
    </g>
  ),
  firma: (p) => (
    <g>
      <path d="M44 12 h82 l32 32 v140 a8 8 0 0 1 -8 8 h-98 a8 8 0 0 1 -8 -8 v-164 a8 8 0 0 1 8 -8z" fill={C.crema} {...sw} />
      {[58, 80, 102].map((y, i) => <rect key={y} x="60" y={y} width={i === 2 ? 50 : 80} height="9" rx="4.5" fill={T} opacity={0.5} />)}
      <path d="M60 156 q10 -26 20 -6 t18 -4 q10 -14 16 4 t20 -10" fill="none" stroke={T} strokeWidth={7} strokeLinecap="round" strokeDasharray={170} strokeDashoffset={170 * (1 - p)} />
      <path d="M152 108 l22 -22 l14 14 l-22 22 l-20 6 z" fill={C.mostaza} {...sw} strokeWidth={5} transform={`translate(${(1 - p) * 8} ${(1 - p) * -10})`} />
    </g>
  ),
  cajaFuerte: (p) => (
    <g>
      <rect x="20" y="34" width="160" height="140" rx="16" fill={C.piedra} {...sw} />
      <rect x="40" y="54" width="120" height="100" rx="8" fill={C.crema} {...sw} strokeWidth={5} />
      <circle cx="84" cy="104" r="22" fill={C.piedra} {...sw} strokeWidth={5} />
      <path d="M84 104 l12 -12" {...sw} strokeWidth={5} />
      <rect x="116" y="94" width="30" height="12" rx="6" fill={T} />
      <rect x="62" y={22 + (1 - p) * -22} width="76" height="44" rx="6" fill={C.crema} {...sw} strokeWidth={5} />
      <rect x="56" y="110" width="52" height="42" rx="8" fill={C.mostaza} {...sw} strokeWidth={5} />
      <path d="M66 110 v-12 a16 16 0 0 1 32 0 v12" fill="none" {...sw} strokeWidth={6} />
    </g>
  ),
  lista: (p) => (
    <g>
      <rect x="38" y="14" width="124" height="172" rx="12" fill={C.crema} {...sw} />
      <rect x="72" y="6" width="56" height="24" rx="8" fill={C.piedra} {...sw} strokeWidth={5} />
      {[56, 100, 144].map((y, i) => {
        const q = cl(p * 3 - i);
        return (
          <g key={y}>
            <rect x="54" y={y - 12} width="24" height="24" rx="5" fill="none" {...sw} strokeWidth={5} />
            <path d={`M58 ${y} l8 9 l16 -20`} fill="none" stroke={C.turquesa} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={40} strokeDashoffset={40 * (1 - q)} />
            <rect x="92" y={y - 5} width="52" height="10" rx="5" fill={T} opacity={0.5} />
          </g>
        );
      })}
    </g>
  ),
  persona: (p, o) => {
    const f = o.forma ?? 'circulo';
    const fill = o.color ?? C.piedra;
    return (
      <g>
        <circle cx="100" cy="58" r="34" fill={fill} {...sw} />
        <path d="M30 190 v-34 a70 52 0 0 1 140 0 v34 z" fill={fill} {...sw} />
        {f === 'circulo' ? <circle cx="100" cy="150" r="17" fill={C.crema} {...sw} strokeWidth={5} /> : null}
        {f === 'triangulo' ? <path d="M100 132 l19 32 h-38 z" fill={C.crema} {...sw} strokeWidth={5} /> : null}
        {f === 'cuadrado' ? <rect x="83" y="133" width="34" height="34" fill={C.crema} {...sw} strokeWidth={5} /> : null}
        {f === 'rombo' ? <path d="M100 130 l20 20 l-20 20 l-20 -20 z" fill={C.crema} {...sw} strokeWidth={5} /> : null}
      </g>
    );
  },
  maletin: () => (
    <g>
      <path d="M72 62 v-18 a10 10 0 0 1 10 -10 h36 a10 10 0 0 1 10 10 v18" fill="none" {...sw} />
      <rect x="20" y="60" width="160" height="106" rx="14" fill={C.mostaza} {...sw} />
      <path d="M20 108 h160" {...sw} strokeWidth={5} />
      <rect x="88" y="98" width="24" height="22" rx="5" fill={C.crema} {...sw} strokeWidth={5} />
    </g>
  ),
  mano: (p, o) => (
    <g transform={o.espejo ? 'translate(200 0) scale(-1 1)' : undefined}>
      <rect x="-30" y="92" width="120" height="44" rx="22" fill={C.crema} {...sw} />
      <path d="M80 92 h44 a20 20 0 0 1 20 20 v0 a20 20 0 0 1 -20 20 h-44 z" fill={C.crema} {...sw} />
      <path d="M120 92 v-18 a10 10 0 0 1 20 0 v38" fill={C.crema} {...sw} strokeWidth={6} />
    </g>
  ),
  manoCorta: (p, o) => (
    <g transform={o.espejo ? 'translate(200 0) scale(-1 1)' : undefined}>
      <rect x="8" y="92" width="84" height="44" rx="16" fill={C.crema} {...sw} />
      <rect x="8" y="86" width="26" height="56" rx="8" fill={C.mostaza} {...sw} strokeWidth={6} />
      <path d="M84 92 h40 a20 20 0 0 1 20 20 v0 a20 20 0 0 1 -20 20 h-40 z" fill={C.crema} {...sw} />
      <path d="M116 92 v-18 a10 10 0 0 1 20 0 v38" fill={C.crema} {...sw} strokeWidth={6} />
    </g>
  ),
  lupaSobre: () => (
    <g>
      <rect x="22" y="70" width="120" height="84" rx="8" fill={C.crema} {...sw} />
      <path d="M22 78 L82 120 L142 78" fill="none" {...sw} strokeWidth={5} />
      <circle cx="128" cy="86" r="42" fill="rgba(244,239,230,0.55)" {...sw} strokeWidth={9} />
      <path d="M158 118 l32 36" {...sw} strokeWidth={16} />
    </g>
  ),
  docJEC: (p) => (
    <g>
      <path d="M44 12 h82 l32 32 v140 a8 8 0 0 1 -8 8 h-98 a8 8 0 0 1 -8 -8 v-164 a8 8 0 0 1 8 -8z" fill={C.crema} {...sw} />
      {[40, 60, 80].map((y, i) => <rect key={y} x="60" y={y} width={i === 2 ? 40 : 70} height="8" rx="4" fill={T} opacity={0.5} />)}
      <g transform={`translate(0 ${(1 - p) * -60}) rotate(-8 100 140)`} opacity={cl(p * 4)}>
        <rect x="26" y="112" width="148" height="56" rx="8" fill={C.crema} stroke={C.teja} strokeWidth={5} />
        <text x="100" y="136" textAnchor="middle" fontFamily={F.titular} fontSize="14" fill={C.teja}>JUNTA ELECTORAL</text>
        <text x="100" y="156" textAnchor="middle" fontFamily={F.titular} fontSize="14" fill={C.teja}>CENTRAL</text>
      </g>
    </g>
  ),
  alarma: (p) => (
    <g>
      <rect x="40" y="150" width="120" height="30" rx="8" fill={T} />
      <path d="M58 150 v-34 a42 42 0 0 1 84 0 v34 z" fill={C.teja} {...sw} />
      <rect x="82" y="86" width="14" height="40" rx="7" fill={C.crema} opacity={0.7} />
      {[-1, 0, 1].map((d, i) => {
        const a = 0.5 + 0.5 * Math.sin(p * 40 + i);
        return <path key={i} d={d === 0 ? 'M100 62 v-22' : `M${100 + d * 52} 84 l${d * 22} -12`} stroke={T} strokeWidth={9} strokeLinecap="round" opacity={0.35 + 0.65 * a} />;
      })}
    </g>
  ),
};

/** Dibujo plano centrado en (x, y), de `tamano` px. Admite entrada con muelle, `mover` y `latido` (pulso entre dos segundos). */
export const Dib: React.FC<{nombre: string; x?: number; y?: number; tamano?: number; en?: number; hasta?: number; dur?: number; animEn?: number; forma?: string; color?: string; espejo?: boolean; mover?: {x: number; y: number; en: number; dur: number; arco?: number}; latido?: [number, number]; rot?: number; sinTexto?: boolean}> = ({
  nombre, x = 540, y = 700, tamano = 240, en = 0, hasta, dur = 1.0, animEn, forma, color, espejo, mover, latido, rot = 0, sinTexto,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const a0 = animEn ?? en + 0.2;
  const p = interpolate(frame, [a0 * fps, (a0 + dur) * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  let dx = 0;
  let dy = 0;
  if (mover) {
    const m = interpolate(frame, [mover.en * fps, (mover.en + mover.dur) * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
    dx = m * (mover.x - x);
    dy = m * (mover.y - y) - (mover.arco ?? 0) * Math.sin(Math.PI * m);
  }
  const lat = latido && frame >= latido[0] * fps && frame < latido[1] * fps ? 1 + 0.1 * Math.sin(((frame - latido[0] * fps) / fps) * 11) : 1;
  const d = DIB[nombre];
  if (!d) throw new Error(`Dibujo desconocido: ${nombre}`);
  return (
    <div style={{position: 'absolute', left: x - tamano / 2 + dx, top: y - tamano / 2 + dy, width: tamano, height: tamano, opacity: Math.min(e, 1) * s, transform: `scale(${(0.6 + 0.4 * e) * lat}) rotate(${rot}deg)`}}>
      <svg viewBox="0 0 200 200" width={tamano} height={tamano} style={{overflow: 'visible'}}>{d(p, {forma, color, espejo, sinTexto})}</svg>
    </div>
  );
};

/* ------------------------------------------------------------------ Puerta (gancho y cierre) */
/** Puerta de entrada vista de frente. `ang`: [apertura inicial, final] (0 cerrada, 1 abierta del todo) con cambio en `angEn` durante `angDur`.
 *  `sobreEn`: entra el sobre sobre la puerta. `interroga`: segundo en que aparece el interrogante. `cerrojos`: segundos de cada cerrojo. `alarma`: segundo de la alarma. */
export const Puerta: React.FC<{x?: number; y?: number; alto?: number; ang?: [number, number]; angEn?: number; angDur?: number; sobreEn?: number | null; interroga?: number | null; cerrojos?: number[]; alarma?: number | null; en?: number; hasta?: number}> = ({
  x = 540, y = 960, alto = 340, ang = [0.25, 0.25], angEn = 0, angDur = 0.6, sobreEn = 0.2, interroga = null, cerrojos = [], alarma = null, en = 0, hasta,
}) => {
  const t = useT();
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const k = alto / 340;
  const w = 220 * k;
  const top = y - alto / 2;
  const bot = y + alto / 2;
  const left = x - w / 2;
  const a = ang[0] + (ang[1] - ang[0]) * Easing.inOut(Easing.cubic)(cl((t - angEn) / angDur));
  const wd = w * Math.cos(a * 1.0) ; // anchura aparente de la hoja
  const per = 0.16 * Math.sin(a * 1.0) * alto * 0.5; // perspectiva (borde libre más corto)
  const sp = sobreEn === null ? 1 : spring({frame: Math.round((t - sobreEn) * 30), fps: 30, config: {damping: 11, stiffness: 120, mass: 0.8}});
  const sobreOn = sobreEn !== null && t >= sobreEn;
  const qi = interroga === null ? 0 : spring({frame: Math.round((t - interroga) * 30), fps: 30, config: {damping: 8, stiffness: 150, mass: 0.7}});
  const al = alarma !== null ? cl((t - alarma) / 0.3) : 0;
  return (
    <Lienzo opacity={Math.min(e, 1) * s}>
      <rect x={left - 22} y={top - 22} width={w + 44} height={alto + 22} rx={14} fill={T} />
      <rect x={left} y={top} width={w} height={alto} fill={C.mostaza} opacity={0.35 + 0.65 * a} />
      <path d={`M${left} ${top} L${left + wd} ${top + per} L${left + wd} ${bot - per} L${left} ${bot} Z`} fill={C.piedra} {...sw} />
      <rect x={left + wd * 0.18} y={top + per + alto * 0.12} width={wd * 0.64} height={alto * 0.3} fill="none" stroke={T} strokeWidth={5} opacity={0.5} />
      <circle cx={left + wd * 0.86} cy={y + alto * 0.04} r={11 * k} fill={C.mostaza} stroke={T} strokeWidth={5} />
      {cerrojos.map((c, i) => {
        const q = cl((t - c) / 0.25);
        const yy = top + alto * (0.22 + 0.19 * i);
        return q > 0 ? <rect key={i} x={left - 8} y={yy} width={(w + 16) * q} height={22 * k} rx={8} fill={C.mostaza} {...sw} strokeWidth={6} /> : null;
      })}
      {sobreOn ? (
        <g transform={`translate(${x} ${y + alto * 0.02 - (1 - Math.min(sp, 1.15)) * 300}) scale(${k * 0.9})`}>
          <g transform="translate(-100 -100)">{DIB.sobre(0, {})}</g>
        </g>
      ) : null}
      {qi > 0.02 ? (
        <text x={x + w / 2 + 70} y={y - alto * 0.2} textAnchor="middle" fontFamily={F.titular} fontSize={190 * Math.min(qi, 1.1)} fill={C.mostaza} stroke={T} strokeWidth={7} paintOrder="stroke">?</text>
      ) : null}
      {al > 0 ? (
        <g transform={`translate(${x + w / 2 + 70} ${top + 10}) scale(${0.5 * al})`} opacity={al}>
          <g transform="translate(-100 -140)">{DIB.alarma(t * 0.2, {})}</g>
        </g>
      ) : null}
    </Lienzo>
  );
};

/* ------------------------------------------------------------------ Tarjeta de postura (misma plantilla para las tres) */
/** Retrato circular (marco mostaza) + titular 64 px + cargo y nota de 36 px. Sin comillas ni icono de cita. Los créditos van aparte (Notas). */
export const TarjetaPostura: React.FC<{src: string; titular: string; cargo: string; nota: string; y?: number; en?: number; hasta?: number; foco?: string; zoom?: [number, number]; retrato?: number; tit?: number}> = ({
  src, titular, cargo, nota, y = 345, en = 0, hasta, foco = '50% 50%', zoom = [1.02, 1.12], retrato = 170, tit = 64,
}) => {
  const t = useT();
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const k = cl((t - en) / 4);
  return (
    <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: y, boxSizing: 'border-box', padding: '20px 24px 18px', borderRadius: 28, border: `6px solid ${T}`, background: '#FBF8F1', boxShadow: '0 12px 0 rgba(20,33,61,0.2)', opacity: Math.min(e, 1) * s, transform: `translateY(${(1 - Math.min(e, 1)) * 40}px)`}}>
      <div style={{display: 'flex', alignItems: 'flex-start', gap: 24}}>
        <div style={{flex: '0 0 auto', width: retrato, height: retrato, borderRadius: '50%', overflow: 'hidden', border: `10px solid ${C.mostaza}`, boxSizing: 'border-box', background: C.piedra}}>
          <Img src={staticFile(`imagenes/${src}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: foco, transform: `scale(${zoom[0] + (zoom[1] - zoom[0]) * k})`}} />
        </div>
        <div style={{flex: 1, fontFamily: F.texto, fontWeight: 700, fontSize: tit, lineHeight: `${Math.round(tit * 1.16)}px`, color: T}}>{titular}</div>
      </div>
      <div style={{marginTop: 12, fontFamily: F.texto, fontWeight: 600, fontSize: 36, lineHeight: '44px', color: T}}>
        <div>{cargo}</div>
        <div>{nota}</div>
      </div>
    </div>
  );
};

/** Tarjeta de texto (sin logos ni colores de partido). Mismo tamaño siempre; `atenua` baja su opacidad desde ese segundo. */
export const TarjetaTexto: React.FC<{texto: string; y: number; en?: number; hasta?: number; atenua?: number; alto?: number}> = ({texto, y, en = 0, hasta, atenua, alto = 250}) => {
  const t = useT();
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const at = atenua === undefined ? 1 : 1 - 0.72 * cl((t - atenua) / 0.3);
  return (
    <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: y, height: alto, boxSizing: 'border-box', padding: '14px 26px', display: 'flex', alignItems: 'center', borderRadius: 26, border: `6px solid ${T}`, background: '#FBF8F1', boxShadow: '0 12px 0 rgba(20,33,61,0.2)', opacity: Math.min(e, 1) * s * at, transform: `translateY(${(1 - Math.min(e, 1)) * 40}px)`}}>
      <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: '74px', color: T}}>{texto}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ Recorrido de 4 paradas + contador de controles */
/** Línea de puntos mostaza con 4 paradas numeradas. `enc`: segundo en que se enciende cada parada (negativo = ya encendida; null = apagada).
 *  La cuenta "Controles: n" cambia en el mismo fotograma en que se enciende una parada. `dibuja`: segundo en que empieza a trazarse. */
export const Recorrido: React.FC<{y?: number; enc: (number | null)[]; dibuja?: number; contador?: boolean; yContador?: number; alin?: 'izq' | 'der'; en?: number; hasta?: number; halo?: number | null}> = ({
  y = 1040, enc, dibuja = 0, contador = true, yContador = 262, alin = 'der', en = 0, hasta, halo = null,
}) => {
  const t = useT();
  const s = useSalida(hasta);
  const ec = useEntrada(en);
  const xs = [150, 400, 650, 900 - 40];
  const x0 = xs[0];
  const x1 = xs[3];
  const tr = cl((t - dibuja) / 1.2);
  const n = enc.filter((v) => v !== null && t >= (v as number)).length;
  return (
    <>
      <Lienzo opacity={s}>
        <path d={`M${x0} ${y} H${x1}`} stroke={C.mostaza} strokeWidth={10} strokeLinecap="round" strokeDasharray="2 22" opacity={t >= dibuja ? 1 : 0} pathLength={1} />
        <path d={`M${x0} ${y} H${x0 + (x1 - x0) * tr}`} stroke={C.mostaza} strokeWidth={10} strokeLinecap="round" strokeDasharray="2 22" />
        {xs.map((x, i) => {
          const v = enc[i];
          const lit = v !== null && t >= (v as number);
          const pop = lit && v !== null && v >= 0 ? 1 + 0.25 * Math.exp(-((t - v) * 9)) : 1;
          const vis = cl((t - dibuja - (i / 3) * 1.1) / 0.2);
          const hl = halo !== null && i === 2 && t >= halo ? 1 : 0;
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${pop * (0.4 + 0.6 * vis)})`} opacity={vis}>
              {hl ? <circle r={58} fill="none" stroke={C.mostaza} strokeWidth={10} opacity={0.55 + 0.45 * Math.sin((t - (halo as number)) * 8)} /> : null}
              <circle r={40} fill={lit ? C.mostaza : C.crema} stroke={T} strokeWidth={7} />
              <text y={19} textAnchor="middle" fontFamily={F.titular} fontSize={52} fill={T}>{i + 1}</text>
            </g>
          );
        })}
      </Lienzo>
      {contador && n > 0 ? (
        <div style={{position: 'absolute', ...(alin === 'izq' ? {left: SEGURA.izq} : {right: 1080 - SEGURA.der}), top: yContador, fontFamily: F.texto, fontWeight: 700, fontSize: 64, letterSpacing: -2, lineHeight: '77px', color: T, opacity: s * Math.min(1, ec)}}>Controles: {n}</div>
      ) : null}
    </>
  );
};

/** Solo el contador "Controles: n" (para escenas con foto grande donde no cabe el recorrido). */
export const Controles: React.FC<{n: number; y?: number; alin?: 'izq' | 'der'; en?: number; hasta?: number}> = ({n, y = 262, alin = 'der', en = 0, hasta}) => {
  const e = useEntrada(en);
  const s = useSalida(hasta);
  return <div style={{position: 'absolute', ...(alin === 'izq' ? {left: SEGURA.izq} : {right: 1080 - SEGURA.der}), top: y, fontFamily: F.texto, fontWeight: 700, fontSize: 64, letterSpacing: -2, lineHeight: '77px', color: T, opacity: Math.min(e, 1) * s}}>Controles: {n}</div>;
};

/* ------------------------------------------------------------------ Mapa con zoom a Melilla */
const IBERIA: [number, number][] = [[-9.3, 43.0], [-8.2, 43.7], [-5.8, 43.6], [-3.8, 43.45], [-1.8, 43.4], [-1.3, 43.1], [0, 42.8], [1.5, 42.5], [3.2, 42.4], [3.1, 41.8], [2.2, 41.3], [0.9, 41.0], [0.3, 40.5], [-0.3, 39.5], [0.2, 38.8], [-0.7, 38.2], [-0.7, 37.6], [-2.0, 36.8], [-3.5, 36.7], [-4.4, 36.7], [-5.4, 36.0], [-6.3, 36.5], [-6.9, 37.2], [-7.4, 37.2], [-8.9, 37.0], [-8.9, 38.0], [-9.5, 38.7], [-9.0, 39.5], [-8.8, 41.0], [-8.8, 42.0]];
const AFRICA: [number, number][] = [[-8, 33], [-6.0, 35.75], [-5.3, 35.9], [-4.4, 35.2], [-3.4, 35.15], [-2.95, 35.33], [-2.2, 35.1], [-1.2, 35.1], [0, 35.6], [0.6, 35.8], [0.6, 33]];
/** Mapa plano de la península y el norte de África; zoom a Melilla (pin mostaza) desde `zoomEn`. */
export const MapaMelilla: React.FC<{x?: number; y?: number; ancho?: number; zoomEn?: number; zoomDur?: number; pinEn?: number; en?: number; hasta?: number}> = ({x = 540, y = 900, ancho = 700, zoomEn = 0.5, zoomDur = 1.2, pinEn = 1.2, en = 0, hasta}) => {
  const t = useT();
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const lonA = -10;
  const latA = 44;
  const kx = ancho / 11.5;
  const ky = kx * 1.3;
  const px = (lon: number, lat: number): [number, number] => [(lon - lonA) * kx * Math.cos((39 * Math.PI) / 180) * 1.3, (latA - lat) * ky * 0.85];
  const pts = (arr: [number, number][]) => arr.map(([a, b]) => px(a, b).join(',')).join(' ');
  const [mx, my] = px(-2.94, 35.29);
  const z = Easing.inOut(Easing.cubic)(cl((t - zoomEn) / zoomDur));
  const esc = 1 + 2.1 * z;
  const [cx, cy] = [ancho * 0.5, 0.5 * (px(0, 44)[1] + px(0, 33)[1])];
  const pin = spring({frame: Math.round((t - pinEn) * 30), fps: 30, config: {damping: 9, stiffness: 150, mass: 0.7}});
  const alto = px(0, 33)[1];
  return (
    <div style={{position: 'absolute', left: x - ancho / 2, top: y - 220, width: ancho, height: 440, overflow: 'hidden', borderRadius: 30, border: `8px solid ${T}`, boxSizing: 'border-box', background: '#E6EEF3', boxShadow: '0 14px 0 rgba(20,33,61,0.25)', opacity: Math.min(e, 1) * s, transform: `scale(${0.92 + 0.08 * Math.min(e, 1)})`}}>
      <svg width={ancho} height={440} viewBox={`0 0 ${ancho} 440`} style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={`translate(${ancho / 2} 220) scale(${esc}) translate(${-(cx + (mx - cx) * z)} ${-(260 + (my - 260) * z)})`}>
          <polygon points={pts(AFRICA)} fill="#D9D2C2" stroke={T} strokeWidth={3 / esc} />
          <polygon points={pts(IBERIA)} fill={C.piedra} stroke={T} strokeWidth={4 / esc} strokeLinejoin="round" />
          <g transform={`translate(${mx} ${my - 8 / esc}) scale(${Math.min(pin, 1.15) / esc})`} opacity={t >= pinEn ? 1 : 0}>
            <path d="M0 0 C -26 -34 -30 -48 -30 -58 a30 30 0 0 1 60 0 C 30 -48 26 -34 0 0 Z" fill={C.mostaza} stroke={T} strokeWidth={6} />
            <circle cx="0" cy="-58" r="11" fill={T} />
          </g>
        </g>
      </svg>
      <div style={{position: 'absolute', left: 18, bottom: 12, fontFamily: F.texto, fontWeight: 700, fontSize: 36, color: T, opacity: z > 0.9 ? 1 : 0}}>Melilla</div>
    </div>
  );
};

/* ------------------------------------------------------------------ Fila de 5 personas (una se enciende) */
export const Personas5: React.FC<{y?: number; tamano?: number; enciendeEn?: number; en?: number; hasta?: number}> = ({y = 660, tamano = 130, enciendeEn = 1, en = 0, hasta}) => {
  const t = useT();
  const xs = [150, 330, 510, 690, 870 - 30];
  const lit = t >= enciendeEn;
  return (
    <>
      {xs.map((x, i) => (
        <Dib key={i} nombre="persona" x={x} y={y} tamano={tamano} en={en + i * 0.08} hasta={hasta} animEn={0} forma="circulo" color={i === 2 && lit ? C.mostaza : C.piedra} />
      ))}
      <Dib nombre="sobre" x={xs[2] + 60} y={y + 55} tamano={80} en={enciendeEn} hasta={hasta} />
    </>
  );
};

/* ------------------------------------------------------------------ Barras horizontales con eje desde 0 */
/** Filas con etiqueta (64 px) a la izquierda y barra a la derecha; eje común 0..`max` con marcas cada `paso` (36 px). `parpadeo`: [desde, hasta] en la fila indicada. */
export const BarrasEje: React.FC<{filas: {etiqueta: string; valor: number; texto: string; color: string; y: number; en: number; dur?: number; parpadeo?: [number, number]}[]; max?: number; paso?: number; yEje?: number; x0?: number; anchoMax?: number; en?: number; hasta?: number}> = ({
  filas, max = 25, paso = 5, yEje = 1040, x0 = 330, anchoMax = 440, en = 0, hasta,
}) => {
  const t = useT();
  const s = useSalida(hasta);
  const ea = useEntrada(en);
  const marcas: number[] = [];
  for (let v = 0; v <= max; v += paso) marcas.push(v);
  return (
    <Lienzo opacity={s * Math.min(ea, 1)}>
      <path d={`M${x0} ${yEje} H${x0 + anchoMax}`} stroke={T} strokeWidth={5} strokeLinecap="round" />
      {marcas.map((v) => (
        <g key={v}>
          <path d={`M${x0 + (v / max) * anchoMax} ${yEje - 8} v16`} stroke={T} strokeWidth={5} />
          <text x={x0 + (v / max) * anchoMax} y={yEje + 50} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={36} fill={T}>{v}{v + paso > max ? " %" : ""}</text>
        </g>
      ))}
      {filas.map((f, i) => {
        const p = Easing.out(Easing.cubic)(cl((t - f.en) / (f.dur ?? 0.9)));
        const w = (f.valor / max) * anchoMax * p;
        const par = f.parpadeo && t >= f.parpadeo[0] && t < f.parpadeo[1] ? (Math.sin((t - f.parpadeo[0]) * 14) > 0 ? 1 : 0.35) : 1;
        return t >= f.en ? (
          <g key={i} opacity={par}>
            <text x={x0 - 24} y={f.y + 50} textAnchor="end" fontFamily={F.texto} fontWeight={700} fontSize={64} fill={T}>{f.etiqueta}</text>
            <rect x={x0} y={f.y} width={Math.max(0.1, w)} height={66} rx={8} fill={f.color} stroke={T} strokeWidth={5} />
            <text x={x0 + w + 20} y={f.y + 52} fontFamily={F.cifra} fontWeight={700} fontSize={56} fill={T} opacity={p > 0.6 ? 1 : 0}>{f.texto}</text>
          </g>
        ) : null;
      })}
    </Lienzo>
  );
};

/* ------------------------------------------------------------------ Contador de escaños 176 / 350 */
export const Escanos: React.FC<{y?: number; en?: number; hasta?: number; llena?: number}> = ({y = 1000, en = 0, hasta, llena = 0.4}) => {
  const t = useT();
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const p = Easing.out(Easing.cubic)(cl((t - llena) / 1.0));
  const ancho = 900;
  return (
    <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: y, opacity: Math.min(e, 1) * s}}>
      <div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 88, lineHeight: '96px', color: T}}>176 / 350</div>
      <div style={{marginTop: 6, width: ancho, height: 28, borderRadius: 14, background: C.crema, border: `5px solid ${T}`, boxSizing: 'border-box', overflow: 'hidden'}}>
        <div style={{width: `${(176 / 350) * 100 * p}%`, height: '100%', background: C.mostaza}} />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ Mesa de comedor con dos bocadillos */
export const MesaComedor: React.FC<{y?: number; en?: number; hasta?: number}> = ({y = 960, en = 0, hasta}) => {
  const t = useT();
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const b1 = spring({frame: Math.round((t - en - 0.3) * 30), fps: 30, config: {damping: 10, stiffness: 140, mass: 0.7}});
  const b2 = spring({frame: Math.round((t - en - 0.9) * 30), fps: 30, config: {damping: 10, stiffness: 140, mass: 0.7}});
  const burbuja = (cx: number, cy: number, q: number, dir: number, children: React.ReactNode) => (
    <g transform={`translate(${cx} ${cy}) scale(${Math.min(q, 1.1)})`} opacity={Math.min(q, 1)}>
      <path d={`M-110 -70 h220 a24 24 0 0 1 24 24 v80 a24 24 0 0 1 -24 24 h-120 l${dir * 30} 40 l${dir * -10} -40 h-90 a24 24 0 0 1 -24 -24 v-80 a24 24 0 0 1 24 -24 z`} fill={C.crema} {...sw} />
      {children}
    </g>
  );
  return (
    <Lienzo opacity={Math.min(e, 1) * s}>
      <rect x={180} y={y + 70} width={720} height={26} rx={10} fill={T} />
      <rect x={250} y={y + 96} width={22} height={110} fill={T} />
      <rect x={808} y={y + 96} width={22} height={110} fill={T} />
      <ellipse cx={380} cy={y + 60} rx={70} ry={12} fill={C.crema} {...sw} strokeWidth={5} />
      <ellipse cx={700} cy={y + 60} rx={70} ry={12} fill={C.crema} {...sw} strokeWidth={5} />
      <circle cx={380} cy={y - 40} r={34} fill={C.piedra} {...sw} />
      <path d={`M330 ${y + 62} v-36 a50 40 0 0 1 100 0 v36 z`} fill={C.piedra} {...sw} />
      <circle cx={700} cy={y - 40} r={34} fill={C.piedra} {...sw} />
      <path d={`M650 ${y + 62} v-36 a50 40 0 0 1 100 0 v36 z`} fill={C.piedra} {...sw} />
      {burbuja(330, y - 140, b1, 1, <g transform="translate(-50 -56) scale(0.5)">{DIB.sobre(0, {})}</g>)}
      {burbuja(750, y - 140, b2, -1, <g transform="translate(-50 -56) scale(0.5)"><g transform="translate(20 10) scale(0.8)"><rect x="40" y="44" width="120" height="136" rx="12" fill={C.turquesa} {...sw} /><rect x="64" y="64" width="72" height="10" rx="5" fill={T} /></g></g>)}
    </Lienzo>
  );
};

/** Anillo mostaza que se dibuja alrededor de un punto (plazo en el calendario). */
export const Anillo: React.FC<{x: number; y: number; r?: number; en?: number; hasta?: number}> = ({x, y, r = 140, en = 0, hasta}) => {
  const t = useT();
  const s = useSalida(hasta);
  const p = cl((t - en) / 0.6);
  const L = 2 * Math.PI * r;
  return (
    <Lienzo opacity={s}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={C.mostaza} strokeWidth={16} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} transform={`rotate(-90 ${x} ${y})`} />
    </Lienzo>
  );
};

/** Nota de 36 px que se escribe palabra a palabra (cita literal), desde `en` durante `dur` s. Alineada abajo como Notas. */
export const NotaEscribe: React.FC<{lineas: string[]; en?: number; dur?: number; hasta?: number}> = ({lineas, en = 0, dur = 2.4, hasta}) => {
  const t = useT();
  const s = useSalida(hasta);
  const [cita, ...resto] = lineas;
  const pal = cita.split(' ');
  const n = Math.round(pal.length * cl((t - en) / dur));
  return (
    <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, bottom: 1920 - 1494, opacity: t >= en ? s : 0, fontFamily: F.texto, fontWeight: 600, fontSize: 36, lineHeight: '44px', color: T}}>
      <div>{pal.slice(0, n).join(' ')}</div>
      {resto.map((l, i) => <div key={i}>{l}</div>)}
    </div>
  );
};

export const REGISTRO_008: Record<string, React.FC<any>> = {
  dib: Dib,
  puerta: Puerta,
  tarjetaPostura: TarjetaPostura,
  tarjetaTexto: TarjetaTexto,
  recorrido: Recorrido,
  controles: Controles,
  mapaMelilla: MapaMelilla,
  personas5: Personas5,
  barrasEje: BarrasEje,
  escanos: Escanos,
  mesaComedor: MesaComedor,
  anillo: Anillo,
  notaEscribe: NotaEscribe,
};
