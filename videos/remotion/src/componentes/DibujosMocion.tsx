import React from 'react';
import {C, F} from '../tema';

const T = C.tinta;
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** Silueta de busto neutra (sin rasgos). `fill` = color; misma silueta para todas las personas. */
export const Busto: React.FC<{fill?: string}> = ({fill = C.piedra}) => (
  <g>
    <path d="M34 190 C 34 140 62 120 100 120 C 138 120 166 140 166 190 Z" fill={fill} {...sw} />
    <circle cx="100" cy="76" r="38" fill={fill} {...sw} />
  </g>
);

export const DIBUJOS_MOCION: Record<string, (p: number, o: Record<string, any>) => React.ReactNode> = {
  // Silla presidencial: tinta con borde de mostaza
  silla: () => (
    <g>
      <rect x="52" y="6" width="96" height="120" rx="22" fill={T} stroke={C.mostaza} strokeWidth={9} />
      <rect x="68" y="22" width="64" height="88" rx="12" fill="none" stroke={C.mostaza} strokeWidth={5} opacity={0.7} />
      <rect x="30" y="112" width="140" height="34" rx="12" fill={T} stroke={C.mostaza} strokeWidth={9} />
      <path d="M40 146 L34 194 M160 146 L166 194" stroke={T} strokeWidth={13} strokeLinecap="round" />
      <path d="M26 98 h22 M152 98 h22" stroke={C.mostaza} strokeWidth={9} strokeLinecap="round" />
    </g>
  ),
  // Busto sentado sobre la silla (se superpone a `silla` con el mismo centro)
  bustoSilla: (p, o) => (
    <g transform="translate(100 118) scale(0.44) translate(-100 -118)">
      <Busto fill={o.color ?? C.piedra} />
    </g>
  ),
  busto: (p, o) => <Busto fill={o.color ?? C.piedra} />,
  // Libro de la Constitución abierto: la página "Art. 113" se resalta en mostaza (p)
  libro: (p) => (
    <g>
      <path d="M8 40 L100 56 L192 40 L192 170 L100 186 L8 170 Z" fill={C.tinta} {...sw} />
      <path d="M16 30 Q 58 22 100 40 L100 172 Q 58 154 16 162 Z" fill={C.crema} {...sw} strokeWidth={6} />
      <path d="M184 30 Q 142 22 100 40 L100 172 Q 142 154 184 162 Z" fill={C.crema} {...sw} strokeWidth={6} />
      {[62, 80, 98, 116].map((y) => <rect key={y} x="30" y={y} width="54" height="7" rx="3.5" fill={T} opacity={0.35} />)}
      <rect x="108" y="58" width="78" height="46" rx="8" fill={C.mostaza} opacity={Math.min(1, p * 1.6)} />
      <text x="147" y="89" textAnchor="middle" fontFamily={F.titular} fontSize="17" fill={T}>Art. 113</text>
      {[116, 134].map((y) => <rect key={y} x="114" y={y} width="62" height="7" rx="3.5" fill={T} opacity={0.35} />)}
    </g>
  ),
  papeleta: (p) => (
    <g>
      <rect x="34" y="14" width="132" height="172" rx="12" fill={C.crema} {...sw} />
      <rect x="54" y="40" width="34" height="34" rx="6" fill="none" {...sw} strokeWidth={6} />
      <path d="M60 58 L70 68 L84 46" fill="none" stroke={C.turquesa} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="102" y="50" width="48" height="9" rx="4.5" fill={T} opacity={0.5} />
      <rect x="54" y="96" width="34" height="34" rx="6" fill="none" {...sw} strokeWidth={6} />
      <rect x="102" y="106" width="48" height="9" rx="4.5" fill={T} opacity={0.5} />
      <rect x="54" y="146" width="96" height="9" rx="4.5" fill={T} opacity={0.5} />
      <path d="M24 176 L176 24" stroke={C.teja} strokeWidth={16} strokeLinecap="round" strokeDasharray={216} strokeDashoffset={216 * (1 - p)} />
    </g>
  ),
  urna: (p) => (
    <g>
      <rect x="40" y="44" width="120" height="136" rx="12" fill={C.turquesa} {...sw} />
      <rect x="64" y="64" width="72" height="10" rx="5" fill={T} />
      <g transform="translate(0 -4) rotate(-6 100 30)">
        <rect x="74" y="8" width="52" height="60" rx="5" fill={C.crema} {...sw} strokeWidth={6} />
        <rect x="84" y="20" width="32" height="7" rx="3.5" fill={T} opacity={0.5} />
      </g>
      <rect x="40" y="44" width="120" height="136" rx="12" fill="none" {...sw} />
      <rect x="64" y="112" width="72" height="42" rx="8" fill={C.crema} opacity={0.9} />
      <path d="M24 176 L176 24" stroke={C.teja} strokeWidth={16} strokeLinecap="round" strokeDasharray={216} strokeDashoffset={216 * (1 - p)} />
    </g>
  ),
  papeletaSin: (p) => (
    <g>
      <rect x="34" y="14" width="132" height="172" rx="12" fill={C.crema} {...sw} />
      <rect x="54" y="40" width="34" height="34" rx="6" fill="none" {...sw} strokeWidth={6} />
      <path d="M60 58 L70 68 L84 46" fill="none" stroke={C.turquesa} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="102" y="50" width="48" height="9" rx="4.5" fill={T} opacity={0.5} />
      <rect x="54" y="96" width="34" height="34" rx="6" fill="none" {...sw} strokeWidth={6} />
      <rect x="102" y="106" width="48" height="9" rx="4.5" fill={T} opacity={0.5} />
      <rect x="54" y="146" width="96" height="9" rx="4.5" fill={T} opacity={0.5} />
    </g>
  ),
  urnaSin: (p) => (
    <g>
      <rect x="40" y="44" width="120" height="136" rx="12" fill={C.turquesa} {...sw} />
      <rect x="64" y="64" width="72" height="10" rx="5" fill={T} />
      <g transform="translate(0 -4) rotate(-6 100 30)">
        <rect x="74" y="8" width="52" height="60" rx="5" fill={C.crema} {...sw} strokeWidth={6} />
        <rect x="84" y="20" width="32" height="7" rx="3.5" fill={T} opacity={0.5} />
      </g>
      <rect x="40" y="44" width="120" height="136" rx="12" fill="none" {...sw} />
      <rect x="64" y="112" width="72" height="42" rx="8" fill={C.crema} opacity={0.9} />
    </g>
  ),
  // Bocadillo "¡FUERA!" que se tacha con una línea gruesa en tinta (p)
  bocadillo: (p) => (
    <g>
      <path d="M16 36 a20 20 0 0 1 20 -20 h128 a20 20 0 0 1 20 20 v76 a20 20 0 0 1 -20 20 h-70 l-34 38 v-38 h-24 a20 20 0 0 1 -20 -20 z" fill={C.crema} {...sw} />
      <text x="100" y="92" textAnchor="middle" fontFamily={F.titular} fontSize="29" fill={T}>¡FUERA!</text>
      <path d="M22 80 L180 62" stroke={T} strokeWidth={14} strokeLinecap="round" strokeDasharray={170} strokeDashoffset={170 * (1 - p)} />
    </g>
  ),
  // Documento de la moción con la tarjeta del candidato que se grapa (p)
  documentoMocion: (p) => (
    <g>
      <rect x="26" y="6" width="148" height="188" rx="10" fill={C.crema} {...sw} />
      <rect x="26" y="6" width="148" height="62" rx="10" fill={C.mostaza} {...sw} />
      <text x="100" y="34" textAnchor="middle" fontFamily={F.titular} fontSize="16" fill={T}>MOCIÓN</text>
      <text x="100" y="58" textAnchor="middle" fontFamily={F.titular} fontSize="16" fill={T}>DE CENSURA</text>
      {[84, 102, 120].map((y) => <rect key={y} x="44" y={y} width="112" height="7" rx="3.5" fill={T} opacity={0.35} />)}
      <g transform={`translate(${(1 - p) * -90} ${(1 - p) * 70}) rotate(${(1 - p) * -14} 100 160)`}>
        <rect x="52" y="134" width="96" height="52" rx="8" fill={C.turquesa} {...sw} strokeWidth={6} />
        <circle cx="80" cy="152" r="9" fill={C.crema} />
        <path d="M64 180 C 64 166 94 166 96 180 Z" fill={C.crema} />
        <rect x="108" y="150" width="30" height="7" rx="3.5" fill={C.crema} />
        <rect x="108" y="164" width="22" height="7" rx="3.5" fill={C.crema} />
      </g>
      <path d="M92 130 h16" stroke={T} strokeWidth={7} strokeLinecap="round" opacity={p > 0.9 ? 1 : 0} />
    </g>
  ),
  // Muro de ladrillos planos (mostaza y turquesa) que se monta pieza a pieza (p)
  muro: (p) => {
    const ladrillos: React.ReactNode[] = [];
    let k = 0;
    for (let f = 0; f < 5; f++) {
      const n = f % 2 ? 3 : 4;
      const w = f % 2 ? 54 : 44;
      const x0 = f % 2 ? 22 : 12;
      for (let i = 0; i < n; i++) {
        const idx = k++;
        const q = Math.min(1, Math.max(0, p * 21 - idx));
        ladrillos.push(
          <rect key={idx} x={x0 + i * (w + 2)} y={150 - f * 34 - (1 - q) * 40} width={w} height={30} rx={5} fill={idx % 2 ? C.turquesa : C.mostaza} {...sw} strokeWidth={5} opacity={q > 0 ? Math.min(1, q * 2) : 0} />,
        );
      }
    }
    return <g>{ladrillos}<path d="M4 184 H196" stroke={T} strokeWidth={9} strokeLinecap="round" /></g>;
  },
  // Tarjeta de nombre en blanco (sin nombre real), resaltada en mostaza
  tarjetaNombre: () => (
    <g>
      <rect x="14" y="40" width="172" height="120" rx="14" fill={C.crema} stroke={C.mostaza} strokeWidth={12} />
      <rect x="14" y="40" width="172" height="120" rx="14" fill="none" {...sw} strokeWidth={5} />
      <circle cx="62" cy="90" r="20" fill={C.piedra} {...sw} strokeWidth={5} />
      <path d="M34 142 C 34 118 90 118 90 142 Z" fill={C.piedra} {...sw} strokeWidth={5} />
      <rect x="108" y="76" width="62" height="10" rx="5" fill={T} opacity={0.45} />
      <rect x="108" y="98" width="46" height="10" rx="5" fill={T} opacity={0.3} />
    </g>
  ),
  flechaAbajo: (p) => (
    <g opacity={Math.min(1, p * 2)} transform={`translate(0 ${(1 - p) * -30})`}>
      <path d="M100 10 V150 M52 108 L100 160 L148 108" fill="none" stroke={T} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M100 10 V150 M52 108 L100 160 L148 108" fill="none" stroke={C.mostaza} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  boligrafo: (p) => (
    <g>
      <path d="M20 168 C 50 150 60 186 90 168 S 130 160 150 172" fill="none" stroke={T} strokeWidth={6} strokeLinecap="round" strokeDasharray={170} strokeDashoffset={170 * (1 - p)} />
      <g transform="rotate(40 100 90)">
        <rect x="88" y="-4" width="24" height="120" rx="8" fill={C.mostaza} {...sw} />
        <path d="M88 116 L112 116 L100 146 Z" fill={C.crema} {...sw} />
        <path d="M96 140 h8 l-4 12 z" fill={T} />
      </g>
    </g>
  ),
};
