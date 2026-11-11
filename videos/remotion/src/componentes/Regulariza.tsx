import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../tema';
import {useEntrada, useSalida} from './util';

// 043 · Regularizados y afiliados. Tiempos en segundos desde el inicio de la ESCENA.

/** Tarjeta de la Seguridad Social (escudo, líneas y marca de alta). x = centro. */
export const TarjetaSS: React.FC<{x?: number; y: number; tam?: number; en?: number}> = ({x = 510, y, tam = 520, en = 0}) => {
  const p = useEntrada(en);
  const q = useEntrada(en + 0.5);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bal = Math.sin((frame / fps) * 2.5) * 4;
  return (
    <svg style={{position: 'absolute', left: x - tam / 2, top: y + bal, opacity: Math.min(p, 1)}} width={tam} height={tam * 0.64} viewBox="0 0 300 192">
      <rect x="8" y="8" width="284" height="176" rx="18" fill={C.crema} stroke={C.tinta} strokeWidth="9" />
      <rect x="8" y="8" width="284" height="44" rx="18" fill={C.turquesa} stroke={C.tinta} strokeWidth="9" />
      <path d="M52 76 H112 V112 Q112 142 82 156 Q52 142 52 112 Z" fill={C.mostaza} stroke={C.tinta} strokeWidth="7" strokeLinejoin="round" />
      {[82, 112, 142].map((yy) => <line key={yy} x1="136" y1={yy} x2="256" y2={yy} stroke={C.tinta} strokeWidth="8" strokeLinecap="round" />)}
      <path d="M66 112 L78 124 L98 98" fill="none" stroke={C.tinta} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset={60 * (1 - Math.min(q, 1))} />
    </svg>
  );
};

/** Embudo de peldaños proporcionales. tiers: {valor, en (se enciende), color}. Los no encendidos van en trazo discontinuo. */
export const EmbudoR: React.FC<{tiers: {valor: number; en: number; color: string}[]; max?: number; y?: number; alto?: number; hueco?: number; hasta?: number}> = ({tiers, max, y = 690, alto = 130, hueco = 20, hasta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const s = useSalida(hasta);
  const m = max ?? tiers[0].valor;
  const W = 860, cx = 510;
  const ws = tiers.map((r) => (r.valor / m) * W);
  const bal = Math.sin(t * 2.5) * 4;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, opacity: s}} width={1080} height={1920} viewBox="0 0 1080 1920">
      <g transform={`translate(0 ${bal})`}>
        {tiers.map((r, i) => {
          const top = y + i * (alto + hueco);
          const w0 = ws[i], w1 = i < tiers.length - 1 ? ws[i + 1] : w0 * 0.9;
          const d = `M ${cx - w0 / 2} ${top} H ${cx + w0 / 2} L ${cx + w1 / 2} ${top + alto} H ${cx - w1 / 2} Z`;
          const k = Math.min(1, Math.max(0, (t - r.en) / 0.45));
          const lit = t >= r.en;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={C.tinta} strokeWidth={5} strokeDasharray="16 12" opacity={lit ? 0 : 0.7} />
              {lit ? <g opacity={k} transform={`translate(0 ${(1 - k) * 24})`}><path d={d} fill={r.color} stroke={C.tinta} strokeWidth={6} strokeLinejoin="round" /></g> : null}
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export const REGISTRO_043: Record<string, React.FC<any>> = {tarjetaSS: TarjetaSS, embudoR: EmbudoR};
