import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';

/** Componentes de la pieza 013 (artículo 155). Tiempos (en, hasta, dur...) en segundos de la ESCENA. Lienzo 1080x1920; nada pasa de x 960. */
const T = C.tinta;
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const cl = (x: number) => Math.min(1, Math.max(0, x));
const easeIO = (u: number) => u * u * (3 - 2 * u);

const useBob = (amp = 7) => {
  const f = useCurrentFrame();
  return amp * Math.sin((f / 30) * 2.2);
};

/** Contenedor absoluto con entrada/salida y balanceo suave. */
const Caja: React.FC<{en?: number; hasta?: number; bob?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({en = 0, hasta, bob = 7, children, style}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const b = useBob(bob);
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < Math.round(en * fps) - 1) return null;
  return <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(p, 1) * s, transform: `translateY(${b}px)`, ...style}}>{children}</div>;
};

/** Contador de años sin separador de miles (1978 -> 2017). */
export const AnioS: React.FC<{desde: number; hasta: number; x?: number; y?: number; tamano?: number; en?: number; dur?: number; salida?: number}> = ({desde, hasta, x = 60, y = 900, tamano = 170, en = 0.3, dur = 1.9, salida}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = useEntrada(en);
  const s = useSalida(salida);
  const v = interpolate(f, [en * fps, (en + dur) * fps], [desde, hasta], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return <div style={{position: 'absolute', left: x, top: y, opacity: Math.min(p, 1) * s, fontFamily: F.cifra, fontWeight: 700, fontSize: tamano, color: T, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{Math.round(v)}</div>;
};

/** Tres barras de votos (eje desde 0, proporcionales): 214 SÍ, 47 NO, 1 ABSTENCIÓN. */
export const VotosS: React.FC<{y?: number; en?: number; hasta?: number; pitch?: number; sello?: boolean}> = ({y = 870, en = 0, hasta, pitch = 85}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useSalida(hasta);
  const datos = [{v: 214, t: 'SÍ', c: C.turquesa}, {v: 47, t: 'NO', c: C.piedra}, {v: 1, t: 'ABSTENCIÓN', c: C.piedra}];
  const MAX = 560;
  return (
    <Caja bob={0} style={{opacity: s}}>
      {datos.map((d, i) => {
        const ini = (en + i * 0.3) * fps;
        const p = interpolate(f, [ini, ini + 0.9 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
        const w = Math.max(d.v === 1 ? 6 : 0, (d.v / 214) * MAX * p);
        const n = Math.round(d.v * p);
        return (
          <div key={i} style={{position: 'absolute', left: 60, top: y + i * pitch, height: 68, display: 'flex', alignItems: 'center', opacity: p > 0 ? 1 : 0}}>
            <div style={{width: w, height: 68, background: d.c, borderRadius: 8}} />
            <div style={{marginLeft: 18, fontFamily: F.cifra, fontWeight: 700, fontSize: 64, color: T, whiteSpace: 'nowrap', lineHeight: '68px'}}>{n} {d.t}</div>
          </div>
        );
      })}
    </Caja>
  );
};

/** Tarjeta solo tipográfica (institución). `luz`: segundo en el que se ilumina (mostaza). Todas las tarjetas comparten estilo. */
export const TarjetaS: React.FC<{lineas: string[]; x?: number; y?: number; ancho?: number; alto?: number; en?: number; hasta?: number; luz?: number; tamano?: number; titular?: boolean; bob?: number}> = ({lineas, x = 540, y = 520, ancho = 880, alto = 140, en = 0, hasta, luz, tamano = 64, titular = false, bob = 5}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const on = luz !== undefined && f >= Math.round(luz * fps);
  return (
    <Caja en={en} hasta={hasta} bob={bob}>
      <div style={{
        position: 'absolute', left: x - ancho / 2, top: y, width: ancho, height: alto, boxSizing: 'border-box', borderRadius: 22, border: `8px solid ${T}`,
        background: on ? C.mostaza : T, color: on ? T : C.crema, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        fontFamily: titular ? F.titular : F.texto, fontWeight: 700, fontSize: tamano, lineHeight: 1.12, boxShadow: '0 12px 0 rgba(20,33,61,0.25)',
      }}>
        {lineas.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </Caja>
  );
};

/** Flecha que se dibuja de (x1,y1) a (x2,y2); candado opcional que se cierra en `candado.en`. */
export const FlechaS: React.FC<{x1: number; y1: number; x2: number; y2: number; en?: number; dur?: number; hasta?: number; candado?: {x: number; y: number; en: number}}> = ({x1, y1, x2, y2, en = 0, dur = 0.8, hasta, candado}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = easeIO(cl((f / fps - en) / dur));
  const ex = x1 + (x2 - x1) * u;
  const ey = y1 + (y2 - y1) * u;
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const a1 = ang + Math.PI * 0.82;
  const a2 = ang - Math.PI * 0.82;
  const cierre = candado ? easeIO(cl((f / fps - candado.en) / 0.4)) : 0;
  return (
    <Caja en={en} hasta={hasta} bob={0}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d={`M${x1} ${y1} L${ex} ${ey}`} fill="none" {...sw} strokeWidth={10} />
        {u > 0.05 ? <path d={`M${ex + Math.cos(a1) * 38} ${ey + Math.sin(a1) * 38} L${ex} ${ey} L${ex + Math.cos(a2) * 38} ${ey + Math.sin(a2) * 38}`} fill="none" {...sw} strokeWidth={10} /> : null}
        {candado ? (
          <g transform={`translate(${candado.x} ${candado.y})`} opacity={f / fps >= candado.en - 0.3 ? 1 : 0}>
            <path d={`M-26 ${-34 - 26 * (1 - cierre)} L-26 -50 Q-26 -84 0 -84 Q26 -84 26 -50 L26 ${-34 - 26 * (1 - cierre) + (cierre < 1 ? 0 : 0)}`} fill="none" {...sw} strokeWidth={9} />
            <rect x={-44} y={-34} width={88} height={70} rx={12} fill={C.mostaza} {...sw} strokeWidth={8} />
            <circle cx={0} cy={0} r={8} fill={T} />
          </g>
        ) : null}
      </svg>
    </Caja>
  );
};

/** Sobre que viaja de `de` a `a` (centro). `entra`: encoge y desaparece al llegar. */
export const SobreS: React.FC<{de: [number, number]; a: [number, number]; en?: number; dur?: number; ancho?: number; hasta?: number; escalaFin?: number; giroFin?: number}> = ({de, a, en = 0, dur = 1, ancho = 190, hasta, escalaFin = 1, giroFin = 0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = easeIO(cl((f / fps - en) / dur));
  const x = de[0] + (a[0] - de[0]) * u;
  const y = de[1] + (a[1] - de[1]) * u - Math.sin(u * Math.PI) * 30;
  const esc = 1 + (escalaFin - 1) * u;
  const h = ancho * 0.66;
  return (
    <Caja en={en} hasta={hasta} bob={0}>
      <svg width={ancho + 20} height={h + 20} style={{position: 'absolute', left: x - ancho / 2 - 10, top: y - h / 2 - 10, overflow: 'visible', transform: `scale(${esc}) rotate(${giroFin * u}deg)`}}>
        <rect x={10} y={10} width={ancho} height={h} rx={10} fill={C.crema} {...sw} />
        <path d={`M10 14 L${10 + ancho / 2} ${10 + h * 0.58} L${10 + ancho} 14`} fill="none" {...sw} />
        <circle cx={10 + ancho / 2} cy={10 + h * 0.58} r={13} fill={C.mostaza} {...sw} strokeWidth={5} />
      </svg>
    </Caja>
  );
};

/** Carpeta con rótulo (64 px) que viaja de `de` a `a`; con `entra` se encoge al llegar (entra en el edificio); con `abreEn`, se abre. */
export const CarpetaS: React.FC<{lineas: string[]; de: [number, number]; a?: [number, number]; en?: number; dur?: number; ancho?: number; alto?: number; hasta?: number; entra?: boolean; abreEn?: number}> = ({lineas, de, a, en = 0, dur = 1, ancho = 470, alto = 280, hasta, entra = false, abreEn}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const u = a ? easeIO(cl((t - en - 0.2) / dur)) : 0;
  const x = a ? de[0] + (a[0] - de[0]) * u : de[0];
  const y = a ? de[1] + (a[1] - de[1]) * u - Math.sin(u * Math.PI) * 40 : de[1];
  const esc = entra ? 1 - 0.62 * easeIO(cl((u - 0.7) / 0.3)) : 1;
  const fade = entra ? 1 - cl((u - 0.92) / 0.08) : 1;
  const abre = abreEn !== undefined ? easeIO(cl((t - abreEn) / 0.5)) : 0;
  return (
    <Caja en={en} hasta={hasta} bob={0}>
      <div style={{position: 'absolute', left: x - ancho / 2, top: y - alto / 2, width: ancho, height: alto, opacity: fade, transform: `scale(${esc})`}}>
        <svg width={ancho} height={alto + 40} style={{position: 'absolute', left: 0, top: -30, overflow: 'visible'}}>
          <path d={`M10 40 L10 ${alto + 20} Q10 ${alto + 30} 20 ${alto + 30} L${ancho - 20} ${alto + 30} Q${ancho - 10} ${alto + 30} ${ancho - 10} ${alto + 20} L${ancho - 10} 34 L${ancho * 0.44} 34 L${ancho * 0.38} 8 L22 8 Q10 8 10 22 Z`} fill={C.mostaza} {...sw} />
          <g style={{transformOrigin: `10px ${alto + 30}px`, transform: `perspective(600px) rotateX(${-abre * 38}deg)`}}>
            <path d={`M10 70 L${ancho - 10} 70 L${ancho - 10} ${alto + 20} Q${ancho - 10} ${alto + 30} ${ancho - 20} ${alto + 30} L20 ${alto + 30} Q10 ${alto + 30} 10 ${alto + 20} Z`} fill="#F7C85F" {...sw} opacity={abre > 0 ? 0.0 : 1} />
          </g>
        </svg>
        <div style={{position: 'absolute', left: 0, top: 52, width: ancho, height: alto - 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: T}}>
          {lineas.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    </Caja>
  );
};

/** Casillas apiladas (pastillas de 64 px). Cada ítem: texto, n (nº de líneas), en (segundo), tipo 'luz' | 'ok' | 'no'. `sep`: texto entre ítems (p. ej. "O"). */
export type ItemCas = {texto: string; n?: number; en: number; tipo?: 'luz' | 'ok' | 'no'; hasta?: number};
export const CasillasS: React.FC<{items: ItemCas[]; y?: number; x?: number; ancho?: number; sep?: string; hasta?: number; hueco?: number}> = ({items, y = 520, x = 60, ancho = 880, sep, hasta, hueco = 22}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useSalida(hasta);
  const b = useBob(4);
  let yy = y;
  const els: React.ReactNode[] = [];
  items.forEach((it, i) => {
    const n = it.n ?? 1;
    const h = n * 72 + 34;
    const t = f / fps;
    const apar = cl((t - (it.en - 0.35)) / 0.35);
    const lit = t >= it.en;
    const tipo = it.tipo ?? 'luz';
    const salida = it.hasta !== undefined ? interpolate(f, [it.hasta * fps - 7, it.hasta * fps], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
    const tachaU = tipo === 'no' && lit ? easeIO(cl((t - it.en) / 0.5)) : 0;
    const yi = yy;
    els.push(
      <div key={i} style={{
        position: 'absolute', left: x, top: yi + (1 - apar) * 24, width: ancho, height: h, boxSizing: 'border-box', borderRadius: 20, border: `7px solid ${T}`, opacity: apar * salida,
        background: tipo === 'no' ? (lit ? C.piedra : C.crema) : lit ? C.mostaza : C.crema, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px',
        fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: '72px', color: T,
      }}>
        <div style={{width: 58, height: 58, flex: 'none', borderRadius: 12, border: `6px solid ${T}`, background: C.crema, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, lineHeight: 1}}>
          {lit ? (tipo === 'no' ? '✕' : '✓') : ''}
        </div>
        <div style={{position: 'relative', flex: 1}}>
          {it.texto}
          {tachaU > 0 ? <div style={{position: 'absolute', left: 0, top: '50%', height: 8, width: `${tachaU * 100}%`, background: T}} /> : null}
        </div>
      </div>,
    );
    yy += h + hueco;
    if (sep && i < items.length - 1) {
      els.push(<div key={'s' + i} style={{position: 'absolute', left: x, top: yy - 6, width: ancho, textAlign: 'center', fontFamily: F.titular, fontSize: 64, lineHeight: '64px', color: T, opacity: apar}}>{sep}</div>);
      yy += 64 + hueco - 10;
    }
  });
  return <Caja bob={0} style={{opacity: s, transform: `translateY(${b}px)`}}>{els}</Caja>;
};

/** Escalera de 3 peldaños: se encienden en los segundos de `paso`. */
export const EscaleraS: React.FC<{x?: number; y?: number; paso: number[]; en?: number; hasta?: number; flecha?: number}> = ({x = 640, y = 1120, paso, en = 0, hasta, flecha}) => {
  const f = useCurrentFrame();
  const t = f / useVideoConfig().fps;
  return (
    <Caja en={en} hasta={hasta} bob={3}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {[0, 1, 2].map((i) => {
          const h = 36 + i * 38;
          const on = t >= paso[i];
          return <rect key={i} x={x + i * 100} y={y - h} width={96} height={h} rx={6} fill={on ? C.mostaza : C.crema} {...sw} strokeWidth={6} />;
        })}
        {flecha !== undefined && t >= flecha ? <path d={`M${x + 248} ${y - 215} L${x + 248} ${y - 140} M${x + 226} ${y - 164} L${x + 248} ${y - 138} L${x + 270} ${y - 164}`} fill="none" {...sw} strokeWidth={8} /> : null}
      </svg>
    </Caja>
  );
};

/** Barra al 100 % con marca en la mitad; en `partEn` se parte en dos mitades y la marca se queda en la primera. */
export const BarraMitadS: React.FC<{y?: number; en?: number; partEn: number; hasta?: number}> = ({y = 700, en = 0, partEn, hasta}) => {
  const f = useCurrentFrame();
  const t = f / useVideoConfig().fps;
  const u = easeIO(cl((t - partEn) / 0.5));
  const W = 840;
  const x0 = 60;
  const gap = 56 * u;
  const lw = W / 2 - gap / 2;
  return (
    <Caja en={en} hasta={hasta} bob={4}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <rect x={x0} y={y} width={lw} height={120} rx={10} fill={C.turquesa} {...sw} />
        <rect x={x0 + lw + gap} y={y} width={lw} height={120} rx={10} fill={u > 0.5 ? C.crema : C.turquesa} {...sw} />
        {u < 0.01 ? <path d={`M${x0 + W / 2} ${y - 40} L${x0 + W / 2} ${y + 160}`} stroke={T} strokeWidth={8} strokeDasharray="14 12" /> : null}
        <text x={x0 + lw / 2} y={y + 82} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={C.crema}>{u < 0.5 ? '100 %' : '> ½'}</text>
        {u >= 0.5 ? <text x={x0 + lw + gap + lw / 2} y={y + 82} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T}>{'≤ ½'}</text> : null}
        <g transform={`translate(${x0 + lw / 2} ${y - 20})`} opacity={t >= partEn - 1.2 ? 1 : 0}>
          <path d="M0 0 L0 -60" stroke={T} strokeWidth={8} strokeLinecap="round" />
          <path d="M0 -60 L56 -42 L0 -24 Z" fill={C.mostaza} {...sw} strokeWidth={6} />
        </g>
      </svg>
    </Caja>
  );
};

/** Línea de tiempo corta con hitos [{x, etiqueta, en}] (etiquetas de 64 px mono). */
export const LineaS: React.FC<{y?: number; hitos: {x: number; etiqueta: string; en: number}[]; en?: number; hasta?: number}> = ({y = 1060, hitos, en = 0, hasta}) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <Caja en={en} hasta={hasta} bob={3}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d={`M${hitos[0].x - 90} ${y} L${hitos[hitos.length - 1].x + 80} ${y}`} stroke={T} strokeWidth={8} strokeLinecap="round" />
        {hitos.map((h, i) => (
          <circle key={i} cx={h.x} cy={y} r={t >= h.en ? 22 : 15} fill={t >= h.en ? C.mostaza : C.crema} {...sw} strokeWidth={6} />
        ))}
      </svg>
      {hitos.map((h, i) => (
        <div key={i} style={{position: 'absolute', left: h.x - 150, top: y - 88, width: 300, textAlign: 'center', fontFamily: F.cifra, fontWeight: 700, fontSize: 64, lineHeight: '64px', color: T, opacity: t >= h.en ? 1 : 0.35}}>{h.etiqueta}</div>
      ))}
    </Caja>
  );
};

/** Documento de sentencia: líneas de texto, una se tacha en `tachaEn` y aparece su etiqueta. Sobre fondo mostaza. */
export const DocS: React.FC<{x?: number; y?: number; ancho?: number; en?: number; tachaEn: number; hasta?: number}> = ({x = 60, y = 700, ancho = 400, en = 0, tachaEn, hasta}) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const u = easeIO(cl((t - tachaEn) / 0.5));
  const alto = 400;
  return (
    <Caja en={en} hasta={hasta} bob={5}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <rect x={x} y={y} width={ancho} height={alto} rx={14} fill={C.crema} {...sw} />
        <rect x={x + 30} y={y + 34} width={ancho * 0.5} height={20} rx={5} fill={T} />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={x + 30} y={y + 90 + i * 52} width={ancho - 60 - (i === 4 ? 120 : 0)} height={14} rx={5} fill={C.piedra} />)}
        <path d={`M${x + 24} ${y + 90 + 2 * 52 + 7} L${x + 24 + (ancho - 48) * u} ${y + 90 + 2 * 52 + 7}`} stroke={C.tinta} strokeWidth={10} strokeLinecap="round" />
        {u > 0 ? <rect x={x + 30} y={y + 90 + 2 * 52 - 4} width={ancho - 60} height={26} rx={5} fill="none" stroke={T} strokeWidth={5} /> : null}
      </svg>
      {t >= tachaEn ? (
        <div style={{position: 'absolute', left: x + ancho + 30, top: y + 150, width: 960 - (x + ancho + 30), fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: 1.12, color: T, opacity: u}}>
          <div>1 REGLA</div><div>ANULADA</div>
        </div>
      ) : null}
    </Caja>
  );
};

/** Territorio genérico (forma abstracta, no un mapa real) que no se apaga + dos iconos tachados (borrador, candado con reloj). */
export const AutonomiaS: React.FC<{y?: number; en?: number; hasta?: number; mantieneEn?: number; tachaA?: number; tachaB?: number}> = ({y = 720, en = 0, hasta, mantieneEn = 3.4, tachaA = 1.2, tachaB = 1.8}) => {
  const f = useCurrentFrame();
  const t = f / useVideoConfig().fps;
  const pulso = 1 + 0.03 * Math.sin(f / 7);
  const xx = (u: number) => easeIO(cl((t - u) / 0.4));
  const mant = t >= mantieneEn;
  return (
    <Caja en={en} hasta={hasta} bob={5}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <g transform={`translate(300 ${y + 170}) scale(${pulso}) translate(-300 -${y + 170})`}>
          <path d={`M170 ${y + 60} L330 ${y + 20} L470 ${y + 80} L520 ${y + 190} L430 ${y + 300} L290 ${y + 330} L170 ${y + 270} L120 ${y + 160} Z`} fill={C.crema} {...sw} strokeWidth={9} />
          <circle cx={310} cy={y + 175} r={mant ? 54 : 34} fill={C.mostaza} {...sw} strokeWidth={6} />
        </g>
        {mant ? [0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2 + f / 30;
          return <path key={i} d={`M${310 + Math.cos(a) * 74} ${y + 175 + Math.sin(a) * 74} L${310 + Math.cos(a) * 100} ${y + 175 + Math.sin(a) * 100}`} stroke={T} strokeWidth={7} strokeLinecap="round" />;
        }) : null}
        {/* borrador */}
        <g transform={`translate(740 ${y + 90})`}>
          <rect x={-70} y={-30} width={140} height={70} rx={10} fill={C.crema} {...sw} />
          <rect x={-70} y={-30} width={60} height={70} rx={10} fill={C.piedra} {...sw} />
          <path d={`M-90 -70 L90 80`} stroke={T} strokeWidth={14} strokeLinecap="round" strokeDasharray="190" strokeDashoffset={190 * (1 - xx(tachaA))} opacity={t >= tachaA ? 1 : 0} />
        </g>
        {/* candado con reloj */}
        <g transform={`translate(740 ${y + 280})`}>
          <path d="M-34 -30 L-34 -62 Q-34 -100 0 -100 Q34 -100 34 -62 L34 -30" fill="none" {...sw} strokeWidth={9} />
          <rect x={-52} y={-30} width={104} height={86} rx={12} fill={C.mostaza} {...sw} strokeWidth={8} />
          <circle cx={150} cy={10} r={42} fill={C.crema} {...sw} strokeWidth={7} />
          <path d="M150 -14 L150 10 L168 22" fill="none" {...sw} strokeWidth={7} />
          <path d={`M-90 -110 L200 80`} stroke={T} strokeWidth={14} strokeLinecap="round" strokeDasharray="350" strokeDashoffset={350 * (1 - xx(tachaB))} opacity={t >= tachaB ? 1 : 0} />
        </g>
      </svg>
    </Caja>
  );
};

export const REGISTRO_013: Record<string, React.FC<any>> = {
  anioS: AnioS, votosS: VotosS, tarjetaS: TarjetaS, flechaS: FlechaS, sobreS: SobreS, carpetaS: CarpetaS, casillasS: CasillasS,
  escaleraS: EscaleraS, barraMitadS: BarraMitadS, lineaS: LineaS, docS: DocS, autonomiaS: AutonomiaS,
};
