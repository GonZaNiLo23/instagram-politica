import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, F} from '../tema';
import {useSalida} from './util';

// 032 · Gasolina -20 cts. Todos los tiempos son segundos desde el inicio de la ESCENA. Surtidor vectorial genérico, sin marca.

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Surtidor genérico 360x520 (esc = escala). Pantalla: `texto` (con `tacha` = segundo en que se tacha) o `litros`. `zoom`: entra con zoom desde el fotograma 0. */
export const SurtidorG: React.FC<{x?: number; y?: number; esc?: number; en?: number; texto?: string; tacha?: number; litros?: {en: number; dur: number; hasta: number}; hasta?: number; zoom?: boolean}> = ({x = 60, y = 600, esc = 1, en = 0, texto, tacha, litros, hasta, zoom = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useSalida(hasta);
  const t = frame / fps;
  const p = zoom ? spring({frame, fps, config: {damping: 14, stiffness: 110, mass: 0.8}}) : spring({frame: frame - Math.round(en * fps), fps, config: {damping: 13, stiffness: 120, mass: 0.8}});
  const sc = zoom ? 0.55 + 0.45 * Math.min(p, 1.08) : Math.min(p, 1);
  const vis = zoom || frame >= Math.round(en * fps);
  let pant = texto ?? '';
  if (litros) pant = `${Math.round(interpolate(t, [litros.en, litros.en + litros.dur], [0, litros.hasta], {...clamp, easing: Easing.inOut(Easing.quad)}))} l`;
  const tr = tacha === undefined ? 0 : interpolate(t, [tacha, tacha + 0.35], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 360 * esc, height: 520 * esc, opacity: vis ? s : 0, transform: `scale(${sc})`, transformOrigin: '50% 100%'}}>
      <svg width={360 * esc} height={520 * esc} viewBox="0 0 360 520">
        <rect x="20" y="490" width="250" height="26" rx="8" fill={C.tinta} />
        <rect x="40" y="10" width="210" height="480" rx="22" fill={C.tinta} />
        <rect x="62" y="34" width="166" height="96" rx="12" fill={C.crema} />
        <rect x="62" y="150" width="166" height="26" rx="8" fill={C.mostaza} />
        <rect x="62" y="190" width="166" height="26" rx="8" fill={C.piedra} />
        <rect x="62" y="230" width="166" height="190" rx="14" fill="#2A3A5E" />
        <path d="M250 190 H300 Q330 190 330 220 V400 Q330 430 304 430" fill="none" stroke={C.tinta} strokeWidth="18" strokeLinecap="round" />
        <rect x="292" y="396" width="26" height="60" rx="8" fill={C.mostaza} stroke={C.tinta} strokeWidth="8" />
        <text x="145" y="98" textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={pant.length > 5 ? 44 : 56} fill={C.tinta}>{pant}</text>
        {tacha !== undefined ? <line x1="62" y1="124" x2={62 + 166 * tr} y2={124 - 84 * tr} stroke={C.mostaza} strokeWidth="14" strokeLinecap="round" /> : null}
      </svg>
    </div>
  );
};

/** Cifra de IPC con golpe: entra y se clava en el valor (etiqueta fija desde el primer fotograma). */
export const IpcG: React.FC<{x?: number; y?: number; texto?: string; etiqueta?: string; en?: number; hasta?: number; tam?: number; pulsos?: number[]}> = ({x = 560, y = 800, texto = '4,9 %', etiqueta = 'IPC', en = 0, hasta, tam = 110, pulsos = []}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useSalida(hasta);
  const p = spring({frame: frame - Math.round(en * fps), fps, config: {damping: 8, stiffness: 170, mass: 0.7}});
  const vis = frame >= Math.round(en * fps);
  let pul = 1;
  for (const tp of pulsos) if (frame >= tp * fps) pul = Math.max(pul, 1 + 0.12 * Math.exp(-(frame - tp * fps) / 6));
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: vis ? s : 0, transform: `translateX(${(1 - Math.min(p, 1)) * 140}px) scale(${(0.7 + 0.3 * Math.min(p, 1.15)) * pul})`, transformOrigin: 'left center'}}>
      <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 64, color: C.tinta, lineHeight: 1.1}}>{etiqueta}</div>
      <div style={{display: 'inline-block', fontFamily: F.cifra, fontWeight: 700, fontSize: tam, lineHeight: 1.1, background: C.tinta, color: C.mostaza, padding: '4px 24px', borderRadius: 18, whiteSpace: 'nowrap'}}>{texto}</div>
    </div>
  );
};

/** Monedas de 1 € que caen una a una en rejilla. */
export const MonedasG: React.FC<{x?: number; y?: number; n?: number; en?: number; paso?: number; cols?: number; pitch?: number; d?: number}> = ({x = 440, y = 760, n = 10, en = 0, paso = 0.16, cols = 5, pitch = 96, d = 84}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const out = [];
  for (let i = 0; i < n; i++) {
    const f0 = Math.round((en + i * paso) * fps);
    const p = spring({frame: frame - f0, fps, config: {damping: 10, stiffness: 150, mass: 0.7}});
    const c = i % cols, r = Math.floor(i / cols);
    out.push(
      <div key={i} style={{position: 'absolute', left: x + c * pitch, top: y + r * (d + 20), width: d, height: d, borderRadius: d, background: C.mostaza, border: `6px solid ${C.tinta}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.cifra, fontWeight: 700, fontSize: 30, color: C.tinta, opacity: frame >= f0 ? 1 : 0, transform: `translateY(${-(1 - Math.min(p, 1.2)) * 300}px)`}}>1 €</div>,
    );
  }
  return <>{out}</>;
};

/** Etiqueta de precio en capas: resto (gris) e impuesto (mostaza, resaltado). */
export const PrecioG: React.FC<{x?: number; y?: number; en?: number; resalta?: number; hasta?: number}> = ({x = 60, y = 900, en = 0, resalta = 1, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useSalida(hasta);
  const t = frame / fps;
  const p1 = spring({frame: frame - Math.round(en * fps), fps, config: {damping: 13, stiffness: 120, mass: 0.8}});
  const p2 = spring({frame: frame - Math.round((en + 0.35) * fps), fps, config: {damping: 9, stiffness: 150, mass: 0.7}});
  const pul = t >= resalta ? 1 + 0.07 * Math.exp(-(t - resalta) * 5) * Math.cos((t - resalta) * 18) : 1;
  const vis = frame >= Math.round(en * fps);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 600, opacity: vis ? s : 0}}>
      <div style={{background: C.mostaza, border: `6px solid ${C.tinta}`, borderRadius: 18, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.titular, fontSize: 64, color: C.tinta, transform: `translateY(${-(1 - Math.min(p2, 1.2)) * 220}px) scale(${pul})`, opacity: frame >= Math.round((en + 0.35) * fps) ? 1 : 0, marginBottom: 12}}>IMPUESTO</div>
      <div style={{background: C.piedra, border: `6px solid ${C.tinta}`, borderRadius: 18, height: 190, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.titular, fontSize: 64, color: C.tinta, transform: `scaleY(${Math.min(p1, 1)})`, transformOrigin: 'bottom'}}>RESTO</div>
    </div>
  );
};

const Llama: React.FC = () => (
  <svg width="240" height="240" viewBox="0 0 120 120"><path d="M60 8 C70 34 98 48 98 78 C98 100 80 114 60 114 C40 114 22 100 22 78 C22 58 36 50 42 34 C48 44 52 46 56 44 C58 32 56 20 60 8 Z" fill={C.teja} stroke={C.tinta} strokeWidth="6" strokeLinejoin="round" /><path d="M60 62 C68 76 82 80 82 92 C82 102 72 108 60 108 C48 108 38 102 38 92 C38 82 54 76 60 62 Z" fill={C.mostaza} /></svg>
);
const Bidon: React.FC = () => (
  <svg width="240" height="240" viewBox="0 0 120 120"><rect x="22" y="26" width="76" height="86" rx="10" fill={C.mostaza} stroke={C.tinta} strokeWidth="6" /><path d="M32 26 V14 H62 L72 26" fill="none" stroke={C.tinta} strokeWidth="6" strokeLinejoin="round" /><circle cx="60" cy="72" r="20" fill="none" stroke={C.tinta} strokeWidth="6" /><path d="M60 58 C66 66 70 70 70 76 C70 82 66 86 60 86 C54 86 50 82 50 76 C50 70 54 66 60 58 Z" fill={C.tinta} /></svg>
);
const Flecha: React.FC<{abajo: boolean; color: string}> = ({abajo, color}) => (
  <svg width="120" height="240" viewBox="0 0 100 160" style={{transform: abajo ? 'none' : 'rotate(180deg)'}}><path d="M50 8 V110 M16 78 L50 124 L84 78" fill="none" stroke={color} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/** Fila INE: flecha (abajo verde / arriba roja) + iconos. `iconos`: 'surtidor' | 'gas'. */
export const FilaIneG: React.FC<{y?: number; x?: number; sube?: boolean; iconos: ('surtidor' | 'gas')[]; en?: number; hasta?: number}> = ({y = 400, x = 60, sube = false, iconos, en = 0, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useSalida(hasta);
  const p = spring({frame: frame - Math.round(en * fps), fps, config: {damping: 11, stiffness: 130, mass: 0.8}});
  const vis = frame >= Math.round(en * fps);
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 0, opacity: vis ? s : 0}}>
      <div style={{transform: `translateY(${(sube ? 1 : -1) * (1 - Math.min(p, 1)) * 120}px)`}}><Flecha abajo={!sube} color={sube ? C.teja : C.turquesa} /></div>
      <div style={{display: 'flex', transform: `scale(${Math.min(p, 1)})`}}>
        {iconos.map((ic, i) => (ic === 'surtidor'
          ? <svg key={i} width="240" height="240" viewBox="0 0 120 120"><rect x="24" y="12" width="52" height="96" rx="8" fill={C.tinta} /><rect x="32" y="22" width="36" height="24" rx="4" fill={C.crema} /><rect x="14" y="104" width="72" height="8" rx="3" fill={C.tinta} /><path d="M76 44 H92 Q102 44 102 54 V84 Q102 94 94 94" fill="none" stroke={C.tinta} strokeWidth="6" strokeLinecap="round" /></svg>
          : <div key={i} style={{display: 'flex'}}><Llama /></div>))}
      </div>
    </div>
  );
};

/** Bidón suelto (combustible líquido). */
export const BidonG: React.FC<{x?: number; y?: number; en?: number}> = ({x = 0, y = 0, en = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - Math.round(en * fps), fps, config: {damping: 11, stiffness: 130, mass: 0.8}});
  return <div style={{position: 'absolute', left: x, top: y, opacity: frame >= Math.round(en * fps) ? 1 : 0, transform: `scale(${Math.min(p, 1)})`}}><Bidon /></div>;
};

/** Dos barras verticales iguales (eje en 0). */
export const BarrasIgualG: React.FC<{x?: number; base?: number; en?: number; valor?: number; etiquetas: string[]; hasta?: number}> = ({x = 60, base = 1180, en = 0, valor = 4.9, etiquetas, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useSalida(hasta);
  const hMax = 320, h = (valor / 5) * hMax;
  return (
    <div style={{position: 'absolute', left: x, top: 0, opacity: s}}>
      {etiquetas.map((e, i) => {
        const f0 = Math.round((en + i * 0.9) * fps);
        const q = interpolate(frame, [f0, f0 + 0.7 * fps], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        return (
          <div key={i} style={{position: 'absolute', left: i * 250, top: base - h * q - 80}}>
            <div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 64, color: C.tinta, whiteSpace: 'nowrap', opacity: q > 0 ? 1 : 0}}>{valor.toString().replace('.', ',')} %</div>
            <div style={{width: 200, height: h * q, background: i ? C.mostaza : C.piedra, border: `6px solid ${C.tinta}`, boxSizing: 'border-box', borderRadius: '12px 12px 0 0', marginTop: 4}} />
          </div>
        );
      })}
      <div style={{position: 'absolute', left: -10, top: base, width: 470, height: 6, background: C.tinta}} />
      {etiquetas.map((e, i) => <div key={'e' + i} style={{position: 'absolute', left: i * 250, top: base + 10, width: 200, textAlign: 'center', fontFamily: F.texto, fontWeight: 700, fontSize: 40, color: C.tinta}}>{e}</div>)}
    </div>
  );
};

/** Signo de interrogación mostaza que late. */
export const InterrogaG: React.FC<{x?: number; y?: number; en?: number}> = ({x = 560, y = 700, en = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - Math.round(en * fps), fps, config: {damping: 8, stiffness: 150, mass: 0.7}});
  const b = 1 + 0.05 * Math.sin(frame / 5);
  return <div style={{position: 'absolute', left: x, top: y, fontFamily: F.titular, fontSize: 420, lineHeight: 1, color: C.mostaza, WebkitTextStroke: `10px ${C.tinta}`, opacity: frame >= Math.round(en * fps) ? 1 : 0, transform: `scale(${Math.min(p, 1.1) * b})`}}>?</div>;
};

export const REGISTRO_032: Record<string, React.FC<any>> = {
  surtidorG: SurtidorG, ipcG: IpcG, monedasG: MonedasG, precioG: PrecioG, filaIneG: FilaIneG, bidonG: BidonG, barrasIgualG: BarrasIgualG, interrogaG: InterrogaG,
};
