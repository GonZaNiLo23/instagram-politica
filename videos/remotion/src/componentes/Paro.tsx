import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, W} from '../tema';
import {useEntrada, useSalida} from './util';

// 028 · Dos cifras de paro. Todos los tiempos (en, luz, pulsos...) son segundos desde el inicio de la ESCENA.

const Persona: React.FC<{h: number; color: string}> = ({h, color}) => (
  <svg width={h * 0.55} height={h} viewBox="0 0 50 90"><circle cx="25" cy="16" r="14" fill={color} /><path d="M5 90 V52 Q5 34 25 34 Q45 34 45 52 V90 Z" fill={color} /></svg>
);

/** Cola de personas (fila). `luz`: cambios de color [{t,color}]. `nuevo`: una persona que se incorpora al final desde la izquierda. */
export const ColaP: React.FC<{x?: number; y: number; n: number; base?: string; luz?: {t: number; color: string}[]; en?: number; pitch?: number; h?: number; nuevo?: {en: number; color: string}; hasta?: number}> = ({x = 60, y, n, base = C.tinta, luz = [], en = 0, pitch = 64, h = 84, nuevo, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useSalida(hasta);
  const t = frame / fps;
  let col = base;
  for (const l of luz) if (t >= l.t) col = l.color;
  const items = [];
  for (let i = 0; i < n; i++) {
    const p = en < 0 ? 1 : spring({frame: frame - Math.round((en + i * 0.04) * fps), fps, config: {damping: 11, stiffness: 140, mass: 0.7}});
    items.push(<div key={i} style={{position: 'absolute', left: x + i * pitch, top: y, opacity: Math.min(p, 1) * s, transform: `translateY(${(1 - p) * 50}px)`}}><Persona h={h} color={col} /></div>);
  }
  if (nuevo) {
    const q = interpolate(t, [nuevo.en, nuevo.en + 0.9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const xf = x + n * pitch;
    items.push(<div key="nuevo" style={{position: 'absolute', left: -80 + (xf + 80) * (1 - Math.pow(1 - q, 3)), top: y, opacity: t >= nuevo.en ? s : 0}}><Persona h={h} color={nuevo.color} /></div>);
  }
  return <>{items}</>;
};

/** Cifra en pastilla de color (cae desde arriba) con subtítulo de 36 px debajo. `pulsos`: segundos en que late. */
export const CifraP: React.FC<{texto: string; sub?: string; x?: number; y: number; fondo: string; color?: string; en?: number; pulsos?: number[]; tam?: number; hasta?: number}> = ({texto, sub, x = 60, y, fondo, color = C.tinta, en = 0, pulsos = [], tam = 80, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useSalida(hasta);
  const p = spring({frame: frame - Math.round(en * fps), fps, config: {damping: 10, stiffness: 150, mass: 0.7}});
  let pul = 1;
  for (const t of pulsos) if (frame >= t * fps) pul = Math.max(pul, 1 + 0.12 * Math.exp(-(frame - t * fps) / 6));
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: frame >= Math.round(en * fps) ? s : 0}}>
      <div style={{display: 'inline-block', fontFamily: F.cifra, fontWeight: 700, fontSize: tam, lineHeight: 1.1, background: fondo, color, padding: '4px 26px', borderRadius: 16, transform: `translateY(${-(1 - Math.min(p, 1.2)) * 380}px) scale(${pul})`, transformOrigin: 'left center'}}>{texto}</div>
      {sub ? <div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 36, lineHeight: '44px', color: C.tinta, marginTop: 8, opacity: Math.min(p, 1)}}>{sub}</div> : null}
    </div>
  );
};

/** Marcador fijo arriba a la derecha (dentro de la zona segura). estado: 'ninguna' | 1 | 2 | 'ambas'. */
export const MarcadorP: React.FC<{estado?: 'ninguna' | 1 | 2 | 'ambas'; en?: number}> = ({estado = 'ninguna', en = 0}) => {
  const p = useEntrada(en);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pill = (txt: string, on: boolean) => (
    <span style={{fontFamily: F.texto, fontWeight: 700, fontSize: 40, padding: '2px 14px', borderRadius: 12, background: on ? C.mostaza : 'transparent', color: C.tinta, border: `4px solid ${on ? C.mostaza : C.tinta}`}}>{txt}</span>
  );
  const on1 = estado === 1 || estado === 'ambas';
  const on2 = estado === 2 || estado === 'ambas';
  return (
    <div style={{position: 'absolute', right: W - 940, top: 262, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', opacity: frame >= Math.round(en * fps) ? Math.min(p, 1) : 0}}>
      {pill('CIFRA 1', on1)}{pill('CIFRA 2', on2)}
    </div>
  );
};

/** Etiqueta EJEMPLO fija arriba a la izquierda (desde el primer fotograma de la escena). */
export const EjemploP: React.FC = () => (
  <div style={{position: 'absolute', right: W - 940, top: 262, fontFamily: F.texto, fontWeight: 700, fontSize: 40, padding: '2px 18px', borderRadius: 12, background: C.tinta, color: C.crema}}>EJEMPLO</div>
);

/** "=" tachado con lupa: no es un error, es otra forma de medir. x = centro. */
export const IgualP: React.FC<{x?: number; y: number; en?: number}> = ({x = 540, y, en = 0}) => {
  const p = useEntrada(en);
  return (
    <svg style={{position: 'absolute', left: x - 220, top: y, opacity: Math.min(p, 1), transform: `scale(${0.8 + 0.2 * Math.min(p, 1)})`, transformOrigin: 'center'}} width="440" height="200" viewBox="0 0 440 200">
      <rect x="40" y="50" width="200" height="22" rx="11" fill={C.tinta} /><rect x="40" y="110" width="200" height="22" rx="11" fill={C.tinta} />
      <line x1="60" y1="170" x2="220" y2="10" stroke={C.teja} strokeWidth="18" strokeLinecap="round" />
      <circle cx="340" cy="80" r="58" fill="none" stroke={C.tinta} strokeWidth="16" /><line x1="382" y1="122" x2="425" y2="175" stroke={C.tinta} strokeWidth="20" strokeLinecap="round" />
    </svg>
  );
};

/** Fila de casas que se iluminan una a una (encuesta a hogares) con portapapeles. */
export const CasasP: React.FC<{y: number; en?: number; n?: number; paso?: number}> = ({y, en = 0, n = 4, paso = 0.4}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const p = useEntrada(en);
  return (
    <div style={{position: 'absolute', left: 60, top: y, width: 860, opacity: Math.min(p, 1)}}>
      <div style={{display: 'flex', gap: 28}}>
        {Array.from({length: n}).map((_, i) => {
          const on = t >= en + 0.3 + i * paso;
          return (
            <svg key={i} width="190" height="170" viewBox="0 0 190 170" style={{transform: `scale(${on ? 1 : 0.92})`}}>
              <path d="M12 82 L95 12 L178 82 V160 H12 Z" fill={on ? C.mostaza : 'none'} stroke={C.tinta} strokeWidth="9" strokeLinejoin="round" />
              <rect x="76" y="104" width="38" height="56" fill={C.tinta} />
              {on ? <path d="M62 66 L88 90 L128 48" fill="none" stroke={C.tinta} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" /> : null}
            </svg>
          );
        })}
      </div>
      <svg width="130" height="160" viewBox="0 0 130 160" style={{marginTop: 24, marginLeft: 365}}>
        <rect x="10" y="18" width="110" height="136" rx="12" fill={C.crema} stroke={C.tinta} strokeWidth="9" /><rect x="40" y="4" width="50" height="26" rx="8" fill={C.tinta} />
        {[62, 92, 122].map((yy) => <line key={yy} x1="32" y1={yy} x2="98" y2={yy} stroke={C.tinta} strokeWidth="8" strokeLinecap="round" />)}
      </svg>
    </div>
  );
};

/** Ventanilla de oficina de empleo con carné de demandante. x = centro. */
export const VentanillaP: React.FC<{x?: number; y: number; tam?: number; en?: number}> = ({x = 540, y, tam = 300, en = 0}) => {
  const p = useEntrada(en);
  const q = useEntrada(en + 0.5);
  return (
    <svg style={{position: 'absolute', left: x - tam / 2, top: y, opacity: Math.min(p, 1)}} width={tam} height={tam * 0.8} viewBox="0 0 300 240">
      <rect x="10" y="10" width="280" height="150" rx="14" fill={C.crema} stroke={C.tinta} strokeWidth="9" />
      <rect x="40" y="40" width="220" height="90" fill={C.turquesa} opacity="0.35" /><circle cx="150" cy="70" r="16" fill={C.tinta} /><path d="M118 130 V100 Q118 86 150 86 Q182 86 182 100 V130 Z" fill={C.tinta} />
      <rect x="0" y="150" width="300" height="26" rx="8" fill={C.tinta} />
      <g transform={`translate(${(1 - Math.min(q, 1)) * -160} 0)`}><rect x="85" y="170" width="130" height="64" rx="8" fill={C.mostaza} stroke={C.tinta} strokeWidth="6" /><circle cx="118" cy="194" r="11" fill={C.tinta} /><line x1="140" y1="188" x2="198" y2="188" stroke={C.tinta} strokeWidth="6" strokeLinecap="round" /><line x1="104" y1="216" x2="198" y2="216" stroke={C.tinta} strokeWidth="6" strokeLinecap="round" /></g>
    </svg>
  );
};

/** Persona sin maletín + lupa sobre un anuncio (parado EPA: sin empleo y buscándolo). */
export const LupaAnuncioP: React.FC<{x?: number; y: number; en?: number}> = ({x = 60, y, en = 0}) => {
  const p = useEntrada(en);
  return (
    <svg style={{position: 'absolute', left: x, top: y, opacity: Math.min(p, 1)}} width="190" height="150" viewBox="0 0 190 150">
      <circle cx="30" cy="30" r="20" fill={C.tinta} /><path d="M2 150 V84 Q2 56 30 56 Q58 56 58 84 V150 Z" fill={C.tinta} />
      <rect x="92" y="14" width="88" height="110" rx="8" fill={C.crema} stroke={C.tinta} strokeWidth="7" />
      {[44, 66, 88].map((yy) => <line key={yy} x1="106" y1={yy} x2="166" y2={yy} stroke={C.tinta} strokeWidth="6" strokeLinecap="round" />)}
      <circle cx="120" cy="82" r="30" fill="rgba(242,177,52,0.35)" stroke={C.tinta} strokeWidth="8" /><line x1="142" y1="104" x2="172" y2="140" stroke={C.tinta} strokeWidth="11" strokeLinecap="round" />
    </svg>
  );
};

/** Persona de silueta que mira un anuncio y pasa de largo ante la puerta de la oficina de empleo. */
export const PasaDeLargoP: React.FC<{y: number; en?: number}> = ({y, en = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const p = useEntrada(en);
  const px = interpolate(t, [0.3, 0.9, 1.4, 2.5], [20, 150, 150, 700], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bob = t > 1.4 ? Math.sin(t * 14) * 5 : 0;
  return (
    <div style={{position: 'absolute', left: 60, top: y, width: 860, height: 330, opacity: Math.min(p, 1)}}>
      <svg width="860" height="330" viewBox="0 0 860 330" style={{position: 'absolute', left: 0, top: 0}}>
        <rect x="300" y="20" width="150" height="190" rx="10" fill={C.crema} stroke={C.tinta} strokeWidth="9" />
        {[70, 105, 140, 175].map((yy) => <line key={yy} x1="326" y1={yy} x2="424" y2={yy} stroke={C.tinta} strokeWidth="8" strokeLinecap="round" />)}
        <rect x="540" y="10" width="240" height="40" rx="8" fill={C.tinta} /><rect x="560" y="50" width="200" height="270" fill={C.turquesa} opacity="0.3" stroke={C.tinta} strokeWidth="9" /><rect x="610" y="120" width="100" height="200" fill={C.tinta} />
        <line x1="0" y1="322" x2="860" y2="322" stroke={C.tinta} strokeWidth="8" />
      </svg>
      <div style={{position: 'absolute', left: px, top: 100 + bob}}><Persona h={220} color={C.tinta} /></div>
    </div>
  );
};

/** Flecha grande (sube/baja) con cifra y subtítulo. Mismo tamaño para las dos direcciones. */
export const FlechaP: React.FC<{dir: 'sube' | 'baja'; texto: string; sub?: string; color: string; x?: number; y: number; en?: number}> = ({dir, texto, sub, color, x = 60, y, en = 0}) => {
  const p = useEntrada(en);
  const rot = dir === 'sube' ? 0 : 180;
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: Math.min(p, 1)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
        <svg width="170" height="190" viewBox="0 0 170 190" style={{transform: `rotate(${rot}deg) scale(${0.7 + 0.3 * Math.min(p, 1)})`}}><path d="M85 10 L160 100 H112 V180 H58 V100 H10 Z" fill={color} stroke={C.tinta} strokeWidth="7" strokeLinejoin="round" /></svg>
        <div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 124, color: C.tinta, lineHeight: 1}}>{texto}</div>
      </div>
      {sub ? <div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 52, color: C.tinta, marginTop: 18}}>{sub}</div> : null}
    </div>
  );
};

/** Línea de tiempo corta 2007 … 2026 con el punto final encendido. */
export const TiempoP: React.FC<{y: number; en?: number; enciende?: number}> = ({y, en = 0, enciende = 0.8}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const p = useEntrada(en);
  const on = t >= enciende;
  const pul = on ? 1 + 0.25 * Math.exp(-(t - enciende) * 6) : 1;
  return (
    <svg style={{position: 'absolute', left: 60, top: y, opacity: Math.min(p, 1)}} width="860" height="150" viewBox="0 0 860 150">
      <line x1="80" y1="80" x2="820" y2="80" stroke={C.tinta} strokeWidth="8" strokeLinecap="round" strokeDasharray="2 22" />
      <circle cx="80" cy="80" r="20" fill={C.tinta} />
      <circle cx="810" cy="80" r="22" fill={on ? C.mostaza : C.crema} stroke={C.tinta} strokeWidth="8" transform={`translate(${810 * (1 - pul)} ${80 * (1 - pul)}) scale(${pul})`} />
      <text x="80" y="30" textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize="52" fill={C.tinta}>2007</text>
      <text x="780" y="30" textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize="52" fill={C.tinta}>2026</text>
    </svg>
  );
};

/** Cintillo (banda tinta con texto crema). */
export const CintilloP: React.FC<{texto: string; y: number; en?: number; tam?: number}> = ({texto, y, en = 0, tam = 52}) => {
  const p = useEntrada(en);
  return <div style={{position: 'absolute', left: 60, top: y, opacity: Math.min(p, 1), fontFamily: F.texto, fontWeight: 700, fontSize: tam, background: C.tinta, color: C.crema, padding: '4px 22px', borderRadius: 12}}>{texto}</div>;
};

export const REGISTRO_028: Record<string, React.FC<any>> = {
  colaP: ColaP, cifraP: CifraP, marcadorP: MarcadorP, ejemploP: EjemploP, igualP: IgualP, casasP: CasasP,
  ventanillaP: VentanillaP, lupaAnuncioP: LupaAnuncioP, pasaP: PasaDeLargoP, flechaP: FlechaP, tiempoP: TiempoP, cintilloP: CintilloP,
};
