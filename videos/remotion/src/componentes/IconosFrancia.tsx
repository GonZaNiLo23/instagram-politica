import React from 'react';
import {C, F} from '../tema';

const T = C.tinta;
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const cl = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

/** Iconos planos de la pieza 004 (viewBox 200x200). `p` = progreso 0..1 de la animación interna. */
export const DIBUJOS_FRANCIA: Record<string, (p: number, o: Record<string, any>) => React.ReactNode> = {
  // Instituto: edificio con campana y chispa mostaza
  instituto: (p) => (
    <g>
      <rect x="24" y="84" width="152" height="94" fill={C.piedra} {...sw} />
      <path d="M70 84 v-36 h60 v36" fill={C.crema} {...sw} />
      <path d="M62 48 L100 22 L138 48 Z" fill={T} {...sw} />
      <path d="M90 66 a10 10 0 0 1 20 0 v8 h-20z" fill={C.mostaza} {...sw} strokeWidth={4} />
      {[40, 66, 118, 144].map((x) => <rect key={x} x={x} y="104" width="18" height="26" fill={C.crema} {...sw} strokeWidth={5} />)}
      <rect x="86" y="132" width="28" height="46" fill={T} />
      <g transform={`translate(${158 + 4 * Math.sin(p * 18)} ${28 - 6 * Math.sin(p * 14)}) rotate(${p * 90})`} opacity={cl(p * 4)}>
        <path d="M0 -22 L6 -6 L22 0 L6 6 L0 22 L-6 6 L-22 0 L-6 -6 Z" fill={C.mostaza} {...sw} strokeWidth={5} />
      </g>
    </g>
  ),
  // Aula: pupitres que se multiplican hasta 35 (7x5) + silla de profesor vacía con interrogación
  aula: (p) => {
    const n = Math.round(cl(p * 1.1) * 35);
    return (
      <g>
        {Array.from({length: 35}).map((_, i) => {
          const c = i % 7, r = Math.floor(i / 7);
          return i < n ? <rect key={i} x={8 + c * 17} y={44 + r * 24} width="13" height="16" rx="3" fill={C.mostaza} stroke={T} strokeWidth={3} /> : null;
        })}
        <g transform="translate(160 118)">
          <path d="M-22 -46 v52 h44 M-22 -46 h8 v38" fill="none" {...sw} strokeWidth={8} />
          <path d="M-22 6 h44 v10 h-44z M-14 16 v28 M14 16 v28" fill={C.crema} {...sw} strokeWidth={6} />
          <text x="4" y="-60" textAnchor="middle" fontFamily={F.titular} fontSize="40" fill={C.teja}>?</text>
        </g>
      </g>
    );
  },
  pupitre: () => (
    <g>
      <path d="M26 70 h148 l-12 40 h-124 z" fill={C.mostaza} {...sw} />
      <path d="M46 110 v62 M154 110 v62" fill="none" {...sw} />
      <path d="M60 170 h-26 M166 170 h-26" fill="none" {...sw} />
      <rect x="64" y="40" width="46" height="22" rx="4" fill={C.crema} {...sw} strokeWidth={5} />
    </g>
  ),
  chaleco: () => (
    <g>
      <path d="M62 20 L100 56 L138 20 L176 44 L158 84 V182 H42 V84 L24 44 Z" fill={C.mostaza} {...sw} />
      <path d="M100 56 V182" fill="none" {...sw} />
      <path d="M44 124 H98 M102 124 H156 M44 146 H98 M102 146 H156" fill="none" stroke={C.crema} strokeWidth={10} strokeLinecap="round" />
    </g>
  ),
  megafono: (p) => (
    <g>
      <path d="M30 78 h34 l76 -42 v128 l-76 -42 h-34 z" fill={C.turquesa} {...sw} />
      <path d="M52 120 l10 44 h26 l-12 -44" fill={C.crema} {...sw} />
      {[0, 1].map((i) => <path key={i} d={`M${158 + i * 16} ${74 + i * -8} q ${14 + i * 8} ${26 + i * 16} 0 ${52 + i * 16}`} fill="none" stroke={T} strokeWidth={7} strokeLinecap="round" opacity={cl(p * 3 - i * 0.6)} />)}
    </g>
  ),
  bombilla: (p) => (
    <g>
      <path d="M100 18 a52 52 0 0 1 28 96 v22 h-56 v-22 a52 52 0 0 1 28 -96z" fill={C.mostaza} {...sw} />
      <path d="M76 148 h48 M80 164 h40 M88 180 h24" fill="none" {...sw} />
      <path d="M86 112 l14 -26 l14 26" fill="none" stroke={T} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      {[[-62, -2], [0, -52], [62, -2]].map(([dx, dy], i) => <path key={i} d={`M${100 + dx * 1.15} ${60 + dy * 1.15} l${dx * 0.18} ${dy * 0.18}`} stroke={T} strokeWidth={7} strokeLinecap="round" opacity={cl(p * 3)} />)}
    </g>
  ),
  relojArena: (p) => (
    <g>
      <rect x="40" y="14" width="120" height="14" rx="6" fill={T} />
      <rect x="40" y="172" width="120" height="14" rx="6" fill={T} />
      <path d="M52 28 h96 c0 40 -30 52 -48 72 c-18 -20 -48 -32 -48 -72z" fill={C.crema} {...sw} />
      <path d="M100 100 c18 20 48 32 48 72 h-96 c0 -40 30 -52 48 -72z" fill={C.crema} {...sw} />
      <path d={`M${100 - 40 * (1 - p)} ${28 + 44 * p} h${80 * (1 - p)} c0 ${20 * (1 - p)} -${14 * (1 - p)} ${30 * (1 - p)} -${40 * (1 - p)} ${46 * (1 - p)} c-${26 * (1 - p)} -${16 * (1 - p)} -${40 * (1 - p)} -${26 * (1 - p)} -${40 * (1 - p)} -${46 * (1 - p)}z`} fill={C.mostaza} />
      <path d={`M${100 - 38 * p} 172 h${76 * p} c0 -${36 * p} -${28 * p} -${46 * p} -${38 * p} -${62 * p} c-${10 * p} ${16 * p} -${38 * p} ${26 * p} -${38 * p} ${62 * p}z`} fill={C.mostaza} />
    </g>
  ),
  hucha: (p) => (
    <g>
      <ellipse cx="96" cy="118" rx="70" ry="50" fill={C.turquesa} {...sw} />
      <path d="M62 80 l-6 -26 l28 14" fill={C.turquesa} {...sw} />
      <circle cx="146" cy="108" r="14" fill={C.crema} {...sw} strokeWidth={5} />
      <circle cx="118" cy="98" r="5" fill={T} />
      <path d="M70 160 v22 M122 160 v22" {...sw} fill="none" strokeWidth={14} />
      <path d="M82 76 h30" stroke={T} strokeWidth={9} strokeLinecap="round" />
      {[0, 1, 2].map((i) => {
        const f = (p * 1.6 + i / 3) % 1;
        return <g key={i} transform={`translate(${88 + i * 14} ${-8 + f * 74})`} opacity={f < 0.95 ? 1 : 0}><circle r="15" fill={C.mostaza} {...sw} strokeWidth={5} /><text y="7" textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize="18" fill={T}>€</text></g>;
      })}
    </g>
  ),
  // Nómina con un cubito de hielo encima (congelar sueldos)
  nomina: (p) => (
    <g>
      <rect x="30" y="50" width="110" height="136" rx="10" fill={C.crema} {...sw} />
      {[78, 98, 118].map((y, i) => <rect key={y} x="46" y={y} width={i === 2 ? 40 : 78} height="9" rx="4.5" fill={T} opacity={0.6} />)}
      <text x="110" y="168" textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize="34" fill={T}>€</text>
      <g transform={`translate(${130 + 2 * Math.sin(p * 10)} ${52 - (1 - p) * 40}) rotate(-8)`}>
        <rect x="-36" y="-36" width="72" height="72" rx="12" fill="rgba(42,157,143,0.35)" {...sw} />
        <path d="M-22 -18 l16 -2 M-22 -6 l8 -1" stroke={C.crema} strokeWidth={6} strokeLinecap="round" />
      </g>
    </g>
  ),
  // Pensiones: flecha que sube poco
  pensiones: (p) => (
    <g>
      <path d="M18 168 H182" {...sw} fill="none" />
      <path d={`M24 140 L${24 + 140 * p} ${140 - 36 * p}`} stroke={T} strokeWidth={14} strokeLinecap="round" fill="none" />
      <path d={`M${24 + 140 * p - 28} ${140 - 36 * p - 6} L${24 + 140 * p + 6} ${140 - 36 * p - 2} L${24 + 140 * p - 12} ${140 - 36 * p + 26} Z`} fill={T} opacity={cl(p * 4)} />
      <circle cx="46" cy="68" r="26" fill={C.mostaza} {...sw} />
      <text x="46" y="78" textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize="28" fill={T}>€</text>
    </g>
  ),
  // Balanza de monedas que se inclina hacia un saco con €
  balanzaSaco: (p) => {
    const ang = 12 * Math.sin((cl(p) * Math.PI) / 2);
    const r = (ang * Math.PI) / 180;
    const R = 66;
    const Lx = 100 - R * Math.cos(r), Ly = 54 - R * Math.sin(r);
    const Rx = 100 + R * Math.cos(r), Ry = 54 + R * Math.sin(r);
    return (
      <g>
        <path d="M86 188 h28 L106 56 h-12z" fill={C.piedra} {...sw} strokeWidth={6} />
        <path d={`M${Lx} ${Ly} L${Rx} ${Ry}`} stroke={T} strokeWidth={10} strokeLinecap="round" />
        <circle cx="100" cy="54" r="9" fill={C.mostaza} {...sw} strokeWidth={5} />
        <path d={`M${Lx} ${Ly} v40 M${Rx} ${Ry} v46`} stroke={T} strokeWidth={4} fill="none" />
        <path d={`M${Lx - 26} ${Ly + 40} h52 a26 12 0 0 1 -52 0z`} fill={C.crema} {...sw} strokeWidth={5} />
        <circle cx={Lx} cy={Ly + 34} r="7" fill={C.mostaza} stroke={T} strokeWidth={3} />
        <g transform={`translate(${Rx} ${Ry + 46})`}>
          <path d="M-8 -34 q-26 10 -30 34 q-2 18 38 18 q40 0 38 -18 q-4 -24 -30 -34z" fill={C.mostaza} {...sw} strokeWidth={5} transform="scale(0.85)" />
          <text y="2" textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize="26" fill={T}>€</text>
        </g>
      </g>
    );
  },
  // Fachada de Matignon (plana): tejado mansarda, ventanas, puerta
  matignon: () => (
    <g>
      <path d="M22 84 L52 40 H148 L178 84 Z" fill={T} {...sw} />
      <rect x="28" y="84" width="144" height="92" fill={C.piedra} {...sw} />
      {[44, 80, 116].map((x) => <rect key={x} x={x} y="98" width="22" height="30" fill={C.crema} {...sw} strokeWidth={5} />)}
      {[44, 80, 116].map((x) => <rect key={x} x={x} y="140" width="22" height="30" fill={C.crema} {...sw} strokeWidth={5} />)}
      <rect x="146" y="98" width="20" height="72" fill={T} />
      <rect x="14" y="176" width="172" height="12" rx="5" fill={T} />
      <rect x="86" y="52" width="28" height="22" fill={C.crema} {...sw} strokeWidth={5} />
    </g>
  ),
  asamblea: () => (
    <g>
      <path d="M14 84 L100 32 L186 84 Z" fill={C.piedra} {...sw} />
      <rect x="26" y="84" width="148" height="12" fill={C.crema} {...sw} />
      {[40, 70, 100, 130, 160].map((x) => <rect key={x} x={x - 7} y="98" width="14" height="60" fill={C.crema} {...sw} strokeWidth={5} />)}
      <rect x="18" y="158" width="164" height="20" fill={C.piedra} {...sw} />
      <rect x="10" y="178" width="180" height="12" rx="4" fill={T} />
      <circle cx="100" cy="64" r="13" fill={C.crema} {...sw} strokeWidth={5} />
      <path d="M100 64 v-8 M100 64 l7 4" stroke={T} strokeWidth={4} strokeLinecap="round" />
    </g>
  ),
  // Escaparate roto
  escaparate: (p) => (
    <g>
      <path d="M14 56 h172 l-8 -32 h-156z" fill={C.mostaza} {...sw} />
      <rect x="22" y="56" width="156" height="124" fill={C.crema} {...sw} />
      <path d="M100 56 l-14 34 l24 12 l-20 30 l18 16 l-10 32" fill="none" stroke={T} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M100 56 l30 40 M110 102 l36 -6 M90 132 l-34 10" fill="none" stroke={T} strokeWidth={5} strokeLinecap="round" opacity={cl(p * 2)} />
    </g>
  ),
  manos: (p) => (
    <g>
      <rect x="62" y="20" width="76" height="62" rx="6" fill={C.crema} {...sw} strokeWidth={6} />
      <rect x="74" y="34" width="52" height="7" rx="3.5" fill={T} opacity={0.55} />
      <rect x="74" y="50" width="34" height="7" rx="3.5" fill={T} opacity={0.55} />
      <g transform={`translate(${(1 - p) * -16} 0)`}><path d="M10 112 h38 l38 -10 l30 14 l-14 34 l-52 8 h-40z" fill={T} {...sw} /></g>
      <g transform={`translate(${(1 - p) * 16} 0)`}><path d="M190 112 h-38 l-34 -8 l-18 14 l14 32 l48 10 h28z" fill={C.turquesa} {...sw} /></g>
      <ellipse cx="100" cy="132" rx="30" ry="22" fill={C.mostaza} {...sw} />
      <path d="M86 126 q14 10 28 0 M88 138 q12 8 24 0" fill="none" stroke={T} strokeWidth={5} strokeLinecap="round" />
    </g>
  ),
  // Pin de mapa
  pin: () => (
    <g>
      <path d="M100 190 C 60 130 38 106 38 74 a62 62 0 0 1 124 0 c0 32 -22 56 -62 116z" fill={C.mostaza} {...sw} />
      <circle cx="100" cy="74" r="24" fill={T} />
    </g>
  ),
  // Silueta simplificada de EE. UU. continental con el punto de Los Ángeles
  eeuu: (p) => {
    const PTS: [number, number][] = [[-124.7,48.4],[-123,48.3],[-122.8,49],[-95.2,49],[-94.6,48.7],[-89.6,48],[-88,48.3],[-84.8,46.9],[-82.5,45.3],[-82.4,43],[-83.1,42],[-79,42.8],[-79,43.3],[-76.5,43.6],[-75,45],[-71.5,45],[-70.2,46.7],[-69.2,47.4],[-67.8,47.1],[-67,44.8],[-70.2,43.6],[-70.9,42.5],[-70,41.7],[-73.7,40.9],[-74,40.4],[-75.5,39.5],[-75.9,37.2],[-76,36.9],[-75.5,35.3],[-76.5,34.6],[-78,33.9],[-79.2,33.1],[-81,31.9],[-81.4,30.2],[-80.2,27],[-80.1,25.7],[-81.2,25.2],[-82.7,27.5],[-82.8,29.2],[-84,30],[-85.3,29.7],[-86.5,30.4],[-88.5,30.3],[-89.5,30.2],[-89.2,29],[-90.5,29.1],[-92,29.6],[-94,29.6],[-95.5,28.8],[-97.2,27.6],[-97.2,26],[-99.1,26.4],[-99.5,27.5],[-101.3,29.7],[-102.7,29.7],[-104.5,29.6],[-105.5,30.8],[-106.5,31.8],[-108.2,31.8],[-108.2,31.3],[-111,31.3],[-114.8,32.5],[-117.1,32.5],[-118.5,34],[-120.6,34.5],[-121.9,36.6],[-122.5,37.8],[-123.8,39.5],[-124.3,40.3],[-124.1,43],[-124.5,46]];
    const K = 3.9, CS = Math.cos((38 * Math.PI) / 180);
    const pr = (lo: number, la: number): [number, number] => [10 + (lo + 125) * CS * K, 45 + (49.4 - la) * K];
    const poly = PTS.map(([lo, la]) => pr(lo, la).join(',')).join(' ');
    const [lx, ly] = pr(-118.2, 34.05);
    return (
      <g>
        <polygon points={poly} fill={T} stroke={T} strokeWidth={5} strokeLinejoin="round" />
        <circle cx={lx} cy={ly} r={9 * cl(p * 3)} fill={C.mostaza} stroke={C.crema} strokeWidth={3} />
      </g>
    );
  },
  cartel: (p) => (
    <g>
      <rect x="94" y="70" width="12" height="124" rx="6" fill={T} />
      <g transform={`rotate(${-6 + 6 * cl(p * 2)} 100 70)`}>
        <rect x="20" y="10" width="160" height="92" rx="8" fill={C.mostaza} {...sw} />
        <rect x="42" y="34" width="116" height="10" rx="5" fill={T} />
        <rect x="42" y="58" width="80" height="10" rx="5" fill={T} />
      </g>
    </g>
  ),
  reloj: (p) => (
    <g>
      <circle cx="100" cy="100" r="80" fill={C.crema} {...sw} />
      {Array.from({length: 12}).map((_, i) => <path key={i} d={`M100 28 v${i % 3 === 0 ? 14 : 8}`} transform={`rotate(${i * 30} 100 100)`} stroke={T} strokeWidth={5} strokeLinecap="round" />)}
      <path d="M100 100 L100 46" transform={`rotate(${-p * 300} 100 100)`} stroke={T} strokeWidth={9} strokeLinecap="round" />
      <path d="M100 100 L128 112" stroke={T} strokeWidth={9} strokeLinecap="round" />
      <circle cx="100" cy="100" r="10" fill={C.mostaza} {...sw} strokeWidth={4} />
    </g>
  ),
  // Dos tarjetas que se giran (corte a "¿Y quién manda?")
  tarjetas: (p, o) => {
    const N = o.simbolo === '3' ? 3 : 2;
    const pos = N === 3 ? [-20, 60, 140] : [10, 112];
    return (
    <g>
      {Array.from({length: N}).map((_, i) => {
        const g = cl(p * (N === 3 ? 2 : 1.6) - i * 0.35);
        const sx = Math.abs(Math.cos(g * Math.PI));
        return (
          <g key={i} transform={`translate(${pos[i]} 30) translate(40 0) scale(${Math.max(sx, 0.02)} 1) translate(-40 0)`}>
            <rect width="80" height="140" rx="12" fill={g > 0.5 ? C.mostaza : C.crema} {...sw} strokeDasharray={g > 0.5 ? undefined : '12 10'} />
            {g > 0.5 ? <><circle cx="40" cy="52" r="16" fill={T} /><path d="M12 112 q28 -34 56 0 v8 h-56z" fill={T} /></> : <text x="40" y="86" textAnchor="middle" fontFamily={F.titular} fontSize="46" fill={C.piedra}>?</text>}
          </g>
        );
      })}
    </g>
  );},
  // Pancarta con check turquesa (protestar: legítimo)
  pancartaCheck: (p) => (
    <g>
      <rect x="20" y="22" width="10" height="168" rx="5" fill={T} />
      <rect x="20" y="34" width="150" height="84" rx="8" fill={C.mostaza} {...sw} />
      <rect x="42" y="58" width="106" height="10" rx="5" fill={T} />
      <rect x="42" y="82" width="74" height="10" rx="5" fill={T} />
      <g transform={`translate(142 142) scale(${cl(p * 2)})`}>
        <circle r="44" fill={C.turquesa} {...sw} />
        <path d="M-20 2 L-6 16 L22 -14" fill="none" stroke={C.crema} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  ),
  // Edificio con llama (quemar ayuntamientos: no)
  edificioAspa: (p) => (
    <g>
      <path d="M20 96 L100 46 L180 96 Z" fill={C.piedra} {...sw} />
      <rect x="32" y="96" width="136" height="12" fill={C.crema} {...sw} />
      {[44, 78, 112, 146].map((x) => <rect key={x} x={x} y="112" width="14" height="52" fill={C.crema} {...sw} strokeWidth={5} />)}
      <rect x="22" y="166" width="156" height="16" fill={C.piedra} {...sw} />
      <g transform={`translate(100 ${64 - 4 * Math.sin(p * 20)})`}>
        <path d="M0 -46 C 14 -24 30 -14 24 10 C 20 26 -20 26 -24 10 C -28 -4 -12 -10 -6 -26 C -4 -34 -2 -40 0 -46 Z" fill={C.teja} {...sw} />
        <path d="M2 -14 C 10 -4 16 2 10 14 C 6 20 -8 20 -10 12 C -12 4 0 0 2 -14 Z" fill={C.mostaza} {...sw} strokeWidth={4} />
      </g>
    </g>
  ),
};
