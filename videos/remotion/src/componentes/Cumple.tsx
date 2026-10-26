import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {useEntrada, useSalida} from './util';

/**
 * Componentes propios de la pieza 007 (cuatro cumpleaños de la Constitución). Nombres nuevos: no tocan los compartidos.
 * Se registran en REGISTRO_007 y se mezclan en `index.tsx`. Todos los tiempos, en segundos desde el inicio de la escena.
 */
const T = C.tinta;
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const cl = (x: number) => Math.min(1, Math.max(0, x));

const Llama: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -46 C 14 -24 30 -14 24 10 C 20 26 -20 26 -24 10 C -28 -4 -12 -10 -6 -26 C -4 -34 -2 -40 0 -46 Z" fill={C.teja} {...sw} />
    <path d="M2 -14 C 10 -4 16 2 10 14 C 6 20 -8 20 -10 12 C -12 4 0 0 2 -14 Z" fill={C.mostaza} {...sw} strokeWidth={4} />
  </g>
);

/** Vela mostaza con llama opcional (s = escala de la llama, 0 = apagada). Coordenadas locales: base de la vela en (0,0). */
const Vela: React.FC<{x: number; yBase: number; alto: number; llama: number}> = ({x, yBase, alto, llama}) => (
  <g>
    <rect x={x - 14} y={yBase - alto} width={28} height={alto} rx={6} fill={C.mostaza} {...sw} strokeWidth={6} />
    <path d={`M${x} ${yBase - alto} v-12`} stroke={T} strokeWidth={6} strokeLinecap="round" />
    {llama > 0.02 ? <Llama x={x} y={yBase - alto - 40 * llama} s={0.9 * llama} /> : null}
  </g>
);

const tEnc = (t: number, en: number | null | undefined) => (en === null || en === undefined ? 0 : Math.min(1, cl((t - en) / 0.35) * 1.15));

/** Tarta plana sobre libro "CONSTITUCIÓN 1978". `x` centro, `y` = parte superior de la tarta (sin velas).
 *  `velas`: segundos en que se enciende cada una (null = apagada). `fechas`: etiquetas bajo la tarta, una por vela. */
export const Tarta: React.FC<{x?: number; y?: number; ancho?: number; velas?: (number | null)[]; fechas?: string[]; libro?: boolean; en?: number; hasta?: number; pulso?: boolean}> = ({
  x = 540, y = 650, ancho = 560, velas = [null, null, null, null], fechas, libro = true, en = 0, hasta, pulso = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const L = x - ancho / 2;
  const alto = 150;
  const pul = pulso ? 1 + 0.03 * Math.sin(t * 5) : 1;
  const n = velas.length;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(e, 1) * s, transform: `scale(${pul})`, transformOrigin: `${x}px ${y + 100}px`}}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {/* velas */}
        {velas.map((v, i) => <Vela key={i} x={L + (ancho * (i + 0.5)) / n} yBase={y + 6} alto={86} llama={tEnc(t, v)} />)}
        {/* tarta */}
        <rect x={L} y={y} width={ancho} height={alto} rx={26} fill={C.crema} {...sw} />
        <path d={`M${L} ${y + 34} q ${ancho / 16} 34 ${ancho / 8} 0 t ${ancho / 8} 0 t ${ancho / 8} 0 t ${ancho / 8} 0 t ${ancho / 8} 0 t ${ancho / 8} 0 t ${ancho / 8} 0 t ${ancho / 8} 0`} fill="none" stroke={C.turquesa} strokeWidth={14} strokeLinecap="round" />
        <rect x={L} y={y} width={ancho} height={alto} rx={26} fill="none" {...sw} />
        {libro ? (
          <g>
            <rect x={L - 30} y={y + alto + 4} width={ancho + 60} height={190} rx={14} fill={C.tinta} />
            <rect x={L - 18} y={y + alto + 16} width={ancho + 36} height={166} rx={8} fill="none" stroke={C.mostaza} strokeWidth={4} />
            <text x={x} y={y + alto + 86} textAnchor="middle" fontFamily={F.titular} fontSize={ancho > 500 ? 54 : 44} fill={C.crema}>CONSTITUCIÓN</text>
            <text x={x} y={y + alto + 150} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={50} fill={C.mostaza}>1978</text>
          </g>
        ) : null}
        {fechas
          ? fechas.map((f, i) => {
              const p = cl((t - (velas[i] ?? 0)) / 0.4);
              return <text key={i} x={L + (ancho * (i + 0.5)) / n} y={y + alto + 80} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={C.tinta} opacity={velas[i] === null ? 0 : p}>{f}</text>;
            })
          : null}
      </svg>
    </div>
  );
};

/** Hoja de calendario que pasa hojas: `fechas` = [{texto, en}] (la última se queda). Cada cambio voltea la hoja. */
export const CalendarioHojas: React.FC<{x?: number; y?: number; tamano?: number; hojas: {mes: string; dia: string; en: number}[]; en?: number; hasta?: number}> = ({x = 800, y = 700, tamano = 300, hojas, en = 0, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const e = useEntrada(en);
  const s = useSalida(hasta);
  let idx = 0;
  hojas.forEach((h, i) => { if (t >= h.en) idx = i; });
  const h = hojas[idx];
  const q = cl((t - h.en) / 0.28); // volteo de la hoja actual
  const fl = idx === 0 ? 1 : q;
  const sy = idx === 0 ? 1 : 0.15 + 0.85 * Easing.out(Easing.cubic)(fl);
  return (
    <div style={{position: 'absolute', left: x - tamano / 2, top: y - tamano / 2, width: tamano, height: tamano, opacity: Math.min(e, 1) * s, transform: `scale(${0.6 + 0.4 * Math.min(e, 1)})`}}>
      <svg viewBox="0 0 200 200" width={tamano} height={tamano} style={{overflow: 'visible'}}>
        <rect x="14" y="30" width="172" height="152" rx="16" fill={C.crema} {...sw} />
        <path d="M14 46 a16 16 0 0 1 16 -16 h140 a16 16 0 0 1 16 16 v34 h-172 z" fill={C.teja} {...sw} />
        <rect x="52" y="12" width="14" height="36" rx="7" fill={T} />
        <rect x="134" y="12" width="14" height="36" rx="7" fill={T} />
        <g transform={`translate(0 80) scale(1 ${sy}) translate(0 -80)`} style={{transformOrigin: '100px 80px'}}>
          <text x="100" y="70" textAnchor="middle" fontFamily={F.titular} fontSize="30" fill={C.crema}>{h.mes}</text>
        </g>
        <g transform={`translate(0 120) scale(1 ${sy}) translate(0 -120)`}>
          <text x="100" y="152" textAnchor="middle" fontFamily={F.titular} fontSize={h.dia.length > 2 ? 52 : 80} fill={T}>{h.dia}</text>
        </g>
      </svg>
    </div>
  );
};

/** Flecha curva hacia atrás (rebobinar) que gira mientras `hasta`. */
export const FlechaAtras: React.FC<{x?: number; y?: number; tamano?: number; en?: number; hasta?: number}> = ({x = 800, y = 900, tamano = 130, en = 0, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const rot = -((frame / fps - en) * 220);
  return (
    <div style={{position: 'absolute', left: x - tamano / 2, top: y - tamano / 2, width: tamano, height: tamano, opacity: Math.min(e, 1) * s}}>
      <svg viewBox="0 0 120 120" width={tamano} height={tamano} style={{overflow: 'visible'}}>
        <g transform={`rotate(${rot} 60 60)`}>
          <path d="M60 18 A42 42 0 1 0 102 60" fill="none" stroke={T} strokeWidth={14} strokeLinecap="round" />
        </g>
        <path d="M30 6 L60 18 L34 40 Z" fill={T} stroke={T} strokeWidth={4} strokeLinejoin="round" transform="translate(-4 -2)" />
      </svg>
    </div>
  );
};

/** Línea de 4 velas con fechas debajo (sustituye a una línea de tiempo). `velas`: segundo en que se enciende cada una (null = apagada, vela gris). */
export const VelasLinea: React.FC<{y?: number; fechas: string[]; velas: (number | null)[]; en?: number; hasta?: number}> = ({y = 880, fechas, velas, en = 0, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const n = fechas.length;
  const x0 = 170;
  const x1 = 810;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(e, 1) * s}}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <rect x={x0 - 80} y={y + 100} width={x1 - x0 + 160} height={10} rx={5} fill={C.piedra} />
        {fechas.map((f, i) => {
          const x = x0 + ((x1 - x0) * i) / (n - 1);
          const on = velas[i] !== null && t >= (velas[i] as number);
          const ll = tEnc(t, velas[i]);
          return (
            <g key={i}>
              <g opacity={on ? 1 : 0.45}><Vela x={x} yBase={y + 104} alto={80} llama={ll} /></g>
              <text x={x} y={y + 190} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={T} opacity={on ? 1 : 0.55}>{f}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/** Barras del Senado (eje desde 0, escala proporcional a `max`) con contador que sube junto a la barra. */
export const BarrasContadas: React.FC<{filas: {etiqueta: string; valor: number; y: number; color: string; en: number; dur: number; contar?: boolean}[]; max: number; x0?: number; ancho?: number; hasta?: number}> = ({filas, max, x0 = 60, ancho = 560, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const s = useSalida(hasta);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: s}}>
      {filas.map((f, i) => {
        const p = Easing.out(Easing.cubic)(cl((t - f.en) / f.dur));
        const v = Math.round(f.valor * p);
        return (
          <div key={i} style={{opacity: t >= f.en ? 1 : 0}}>
            <div style={{position: 'absolute', left: x0, top: f.y - 82, fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: T}}>{f.etiqueta}</div>
            <div style={{position: 'absolute', left: x0, top: f.y, width: Math.max(0.0001, (f.valor / max) * ancho * p), height: 70, background: f.color, borderRadius: 8}} />
            <div style={{position: 'absolute', left: x0 + (f.valor / max) * ancho * p + 20, top: f.y - 1, fontFamily: F.cifra, fontWeight: 700, fontSize: 64, lineHeight: '72px', color: T}}>{v}</div>
          </div>
        );
      })}
    </div>
  );
};

/** Urna plana con papeleta "SÍ" que cae dentro. */
export const UrnaPapeleta: React.FC<{x?: number; y?: number; tamano?: number; en?: number; cae?: number; hasta?: number; desde?: number}> = ({x = 540, y = 650, tamano = 360, en = 0, cae = 0.5, hasta, desde = -70}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const p = Easing.in(Easing.quad)(cl((t - cae) / 0.55));
  const glow = cl((t - cae - 0.5) / 0.3);
  return (
    <div style={{position: 'absolute', left: x - tamano / 2, top: y - tamano / 2, width: tamano, height: tamano, opacity: Math.min(e, 1) * s}}>
      <svg viewBox="0 0 200 200" width={tamano} height={tamano} style={{overflow: 'visible'}}>
        <g transform={`translate(0 ${desde + (20 - desde) * p})`} opacity={t >= cae - 0.2 ? 1 : 0} style={{clipPath: undefined}}>
          <rect x="68" y="-10" width="64" height="76" rx="6" fill={C.crema} {...sw} strokeWidth={6} />
          <text x="100" y="40" textAnchor="middle" fontFamily={F.titular} fontSize="34" fill={T}>SÍ</text>
        </g>
        <rect x="30" y="64" width="140" height="124" rx="14" fill={glow > 0 ? C.mostaza : C.turquesa} {...sw} />
        <rect x="62" y="58" width="76" height="14" rx="7" fill={T} />
        <rect x="46" y="108" width="108" height="52" rx="8" fill={C.crema} opacity={0.9} />
      </svg>
    </div>
  );
};

/** Pluma estilográfica y corona sobre un documento (sin rostro). */
export const PlumaCorona: React.FC<{x?: number; y?: number; tamano?: number; en?: number; hasta?: number}> = ({x = 540, y = 650, tamano = 420, en = 0, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const f = cl((t - en - 0.3) / 0.9); // firma que se dibuja
  return (
    <div style={{position: 'absolute', left: x - tamano / 2, top: y - tamano / 2, width: tamano, height: tamano, opacity: Math.min(e, 1) * s}}>
      <svg viewBox="0 0 200 200" width={tamano} height={tamano} style={{overflow: 'visible'}}>
        <rect x="34" y="52" width="132" height="140" rx="10" fill={C.crema} {...sw} />
        <rect x="52" y="76" width="96" height="8" rx="4" fill={T} opacity={0.4} />
        <rect x="52" y="96" width="70" height="8" rx="4" fill={T} opacity={0.4} />
        <path d="M54 160 q 12 -26 24 -4 t 22 -2 t 22 -6 t 20 4" fill="none" stroke={C.turquesa} strokeWidth={7} strokeLinecap="round" strokeDasharray={170} strokeDashoffset={170 * (1 - f)} />
        <g transform={`translate(${60 + 56 * f} ${150 - 8 * f}) rotate(-38)`}>
          <path d="M0 0 L-8 -22 L8 -22 Z" fill={T} />
          <rect x="-9" y="-80" width="18" height="60" rx="6" fill={C.mostaza} {...sw} strokeWidth={5} />
          <rect x="-10" y="-100" width="20" height="22" rx="5" fill={T} />
        </g>
        <g transform="translate(100 6)">
          <path d="M-34 36 L-40 4 L-20 20 L0 -6 L20 20 L40 4 L34 36 Z" fill={C.mostaza} {...sw} strokeWidth={6} />
          <rect x="-36" y="36" width="72" height="12" rx="4" fill={C.mostaza} {...sw} strokeWidth={6} />
        </g>
      </svg>
    </div>
  );
};

/** Portada plana del BOE que se despliega: "BOE n.º 311 · 29-12-1978". */
export const BoePortada: React.FC<{x?: number; y?: number; ancho?: number; en?: number; hasta?: number}> = ({x = 540, y = 640, ancho = 560, en = 0, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const s = useSalida(hasta);
  const p = Easing.out(Easing.cubic)(cl((t - en) / 0.7));
  const alto = ancho * 0.74;
  return (
    <div style={{position: 'absolute', left: x - ancho / 2, top: y - alto / 2, width: ancho, height: alto, opacity: (t >= en ? 1 : 0) * s, transform: `scaleY(${0.1 + 0.9 * p}) rotate(${(1 - p) * -6}deg)`, background: C.crema, border: `7px solid ${T}`, borderRadius: 10, boxSizing: 'border-box', padding: '16px 24px'}}>
      <div style={{fontFamily: F.titular, fontSize: 58, lineHeight: 1, color: T, textAlign: 'center'}}>BOE</div>
      <div style={{height: 7, background: T, margin: '8px 0 10px'}} />
      <div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 36, color: T, textAlign: 'center'}}>n.º 311 · 29-12-1978</div>
      <div style={{display: 'flex', gap: 14, marginTop: 14}}>
        {[0, 1].map((c) => (
          <div key={c} style={{flex: 1}}>
            {[100, 88, 100, 76, 100, 92].map((w, i) => <div key={i} style={{height: 8, width: `${w}%`, background: T, opacity: 0.4, borderRadius: 4, marginBottom: 12}} />)}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Libro con candado: `cierra` = segundo en que se cierra (o null: ya cerrado), `abre` = segundo en que se abre. */
export const LibroCandado: React.FC<{x?: number; y?: number; tamano?: number; en?: number; cierra?: number; abre?: number; hasta?: number}> = ({x = 300, y = 650, tamano = 320, en = 0, cierra, abre, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const e = useEntrada(en);
  const s = useSalida(hasta);
  let alza = 0; // 0 = cerrado, 1 = abierto
  if (cierra !== undefined && t < cierra) alza = 1 - cl((t - en) / Math.max(0.1, cierra - en));
  if (cierra !== undefined && t >= cierra) alza = 0;
  if (abre !== undefined) alza = Math.max(alza, Easing.out(Easing.back(2))(cl((t - abre) / 0.5)));
  const sacude = cierra !== undefined && t >= cierra && t < cierra + 0.35 ? 4 * Math.sin((t - cierra) * 60) : 0;
  return (
    <div style={{position: 'absolute', left: x - tamano / 2, top: y - tamano / 2, width: tamano, height: tamano, opacity: Math.min(e, 1) * s}}>
      <svg viewBox="0 0 200 200" width={tamano} height={tamano} style={{overflow: 'visible'}}>
        <rect x="26" y="20" width="148" height="164" rx="12" fill={C.tinta} />
        <rect x="36" y="30" width="128" height="144" rx="6" fill="none" stroke={C.mostaza} strokeWidth={4} />
        <text x="100" y="52" textAnchor="middle" fontFamily={F.titular} fontSize="14" fill={C.crema}>CONSTITUCIÓN</text>
        <text x="100" y="74" textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize="20" fill={C.mostaza}>1978</text>
        <g transform={`translate(${sacude} 0)`}>
          <path d={`M72 ${124 - alza * 22} v-22 a28 28 0 0 1 56 0 v${22 - (alza > 0.5 ? 14 : 0)}`} fill="none" stroke={T} strokeWidth={13} strokeLinecap="round" />
          <path d={`M72 ${124 - alza * 22} v-22 a28 28 0 0 1 56 0 v${22 - (alza > 0.5 ? 14 : 0)}`} fill="none" stroke={C.piedra} strokeWidth={6} strokeLinecap="round" />
          <rect x="52" y="122" width="96" height="62" rx="12" fill={alza > 0.5 ? C.turquesa : C.mostaza} {...sw} />
          <circle cx="100" cy="148" r="8" fill={T} />
          <rect x="97" y="150" width="6" height="18" rx="3" fill={T} />
        </g>
      </svg>
    </div>
  );
};

/** Línea divisoria fina con entrada. */
export const Divisoria: React.FC<{y: number; en?: number; hasta?: number}> = ({y, en = 0, hasta}) => {
  const e = useEntrada(en);
  const s = useSalida(hasta);
  return <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho * Math.min(e, 1), top: y, height: 8, borderRadius: 4, background: C.piedra, opacity: s}} />;
};

export const REGISTRO_007: Record<string, React.FC<any>> = {
  tarta: Tarta,
  calendarioHojas: CalendarioHojas,
  flechaAtras: FlechaAtras,
  velasLinea: VelasLinea,
  barrasContadas: BarrasContadas,
  urnaPapeleta: UrnaPapeleta,
  plumaCorona: PlumaCorona,
  boePortada: BoePortada,
  libroCandado: LibroCandado,
  divisoria: Divisoria,
};
