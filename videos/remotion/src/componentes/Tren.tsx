import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useSalida} from './util';

// Pieza 027 (trenes y Óscar Puente). Todo SVG plano, sin logos ni personas. Tiempos `en`/`hasta` en segundos desde el inicio de la ESCENA.
const GRIS = '#B4BBC8';
const TEJA = C.teja;
const usa = () => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {fr, fps, t: fr / fps};
};
const cl = (x: number) => Math.min(1, Math.max(0, x));
const ease = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
const lienzo = (children: React.ReactNode, s: number) => (
  <div style={{opacity: s}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>{children}</svg>
  </div>
);

/** Cifra enorme con etiqueta opcional (cifras de Adamuz/Urda: se cambian desde el generador, no aquí). */
export const NumTr: React.FC<{x?: number; y?: number; valor: string; tam?: number; color?: string; etiqueta?: string; tamEtiqueta?: number; yEtiqueta?: number; en?: number; hasta?: number}> = ({x = 500, y = 760, valor, tam = 400, color = C.mostaza, etiqueta, tamEtiqueta = 64, yEtiqueta, en = 0, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.5);
  const pulso = 1 + 0.025 * Math.sin(t * 3);
  return lienzo(
    <g opacity={k}>
      <text x={x} y={y} textAnchor="middle" fontFamily={F.titular} fontSize={tam} fill={color} transform={`translate(0 ${(1 - k) * 60 + Math.sin(t * 3) * 9})`}>
        <tspan>{valor}</tspan>
      </text>
      {etiqueta ? <text x={x} y={yEtiqueta ?? y + 90} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={tamEtiqueta} fill={color}>{etiqueta}</text> : null}
    </g>,
    s,
  );
};

/** Dibujo de un tren de alta velocidad mirando a la derecha (400 x 96). */
const TrenDib: React.FC<{color: string; raya?: string; ventanas?: string}> = ({color, raya = C.mostaza, ventanas = C.crema}) => (
  <g>
    <path d="M0 64 L0 24 Q0 0 24 0 L290 0 Q372 0 400 56 L400 76 Q400 88 388 88 L12 88 Q0 88 0 76 Z" fill={color} stroke={C.tinta} strokeWidth={5} strokeLinejoin="round" />
    {[26, 88, 150, 212].map((vx) => <rect key={vx} x={vx} y={18} width={46} height={26} rx={7} fill={ventanas} />)}
    <path d="M280 16 Q330 14 360 44 L280 44 Z" fill={ventanas} />
    <rect x={8} y={56} width={380} height={9} fill={raya} />
    {[60, 150, 250, 340].map((wx) => <circle key={wx} cx={wx} cy={92} r={11} fill={C.tinta} />)}
  </g>
);

const Via: React.FC<{y: number; x0?: number; x1?: number; t: number; anda?: boolean}> = ({y, x0 = 40, x1 = 940, t, anda = true}) => {
  const off = anda ? (t * 120) % 60 : 0;
  const trav: number[] = [];
  for (let x = x0 - 60; x < x1 + 60; x += 60) trav.push(x - off);
  return (
    <g>
      {trav.filter((x) => x >= x0 && x <= x1 - 20).map((x) => <rect key={x} x={x} y={y + 6} width={22} height={14} fill={GRIS} />)}
      <rect x={x0} y={y} width={x1 - x0} height={8} rx={4} fill={C.tinta} />
    </g>
  );
};

/** Tren sobre vía que avanza (gancho). `x` = hueco izquierdo final; `color` del tren. */
export const TrenTr: React.FC<{x?: number; y?: number; esc?: number; color?: string; en?: number; hasta?: number; llega?: number; sobreOscuro?: boolean}> = ({x = 300, y = 980, esc = 1, color = C.turquesa, en = 0, hasta, llega = 1, sobreOscuro = false}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + llega);
  const xx = interpolate(k, [0, 1], [-420, x]);
  const bob = Math.sin(t * 9) * 1.6 + Math.sin(t * 2.5) * 6;
  const pista = sobreOscuro ? C.crema : C.tinta;
  return lienzo(
    <g>
      <g opacity={sobreOscuro ? 1 : 1}>
        <g style={{filter: sobreOscuro ? 'invert(0)' : undefined}}>
          <Via y={y + 104 * esc} x0={40} x1={940} t={t} />
        </g>
      </g>
      <g transform={`translate(${xx} ${y + bob}) scale(${esc})`}><TrenDib color={color} /></g>
      <rect x={0} y={0} width={0} height={0} fill={pista} />
    </g>,
    s,
  );
};

/** Mapa esquemático: línea de alta velocidad cortada (robo de cable), después esposas (presuntos). */
export const ToledoTr: React.FC<{x?: number; y?: number; en?: number; corteEn?: number; esposasEn?: number; hasta?: number}> = ({x = 0, y = 0, en = 0, corteEn = 1, esposasEn = 4, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.6);
  const corte = ease(t, corteEn, corteEn + 0.5);
  const esp = ease(t, esposasEn, esposasEn + 0.5);
  const pulso = 1 + 0.12 * Math.sin(t * 7);
  const bob = Math.sin(t * 2.2) * 4;
  const gap = 46 * corte;
  const cx = 480;
  const cy = 700;
  return lienzo(
    <g transform={`translate(${x} ${y + bob})`} opacity={k}>
      <path d="M90 480 Q300 400 520 440 Q780 470 880 560 Q930 700 860 850 Q640 930 420 880 Q150 870 100 720 Q60 590 90 480 Z" fill="#E4DCCB" stroke={C.piedra} strokeWidth={5} />
      {/* línea de alta velocidad: dos mitades con hueco en el corte */}
      <path d={`M110 760 Q260 ${720 - 0} ${cx - gap} ${cy}`} stroke={C.tinta} strokeWidth={12} fill="none" strokeLinecap="round" />
      <path d={`M${cx + gap} ${cy} Q700 ${660} 870 580`} stroke={C.tinta} strokeWidth={12} fill="none" strokeLinecap="round" />
      <path d={`M110 760 Q260 720 ${cx - gap} ${cy}`} stroke={C.mostaza} strokeWidth={4} fill="none" strokeDasharray="14 14" />
      <path d={`M${cx + gap} ${cy} Q700 660 870 580`} stroke={C.mostaza} strokeWidth={4} fill="none" strokeDasharray="14 14" />
      {/* ciudad */}
      <circle cx={cx} cy={cy + 110} r={16} fill={C.tinta} />
      <circle cx={cx} cy={cy + 110} r={30} fill="none" stroke={C.tinta} strokeWidth={4} />
      {/* chispa del corte */}
      {corte > 0 ? (
        <g transform={`translate(${cx} ${cy}) scale(${(0.6 + 0.8 * Math.abs(Math.sin(t * 6))) * corte * pulso})`}>
          <path d="M0 -50 L12 -14 L48 -12 L18 8 L28 46 L0 24 L-28 46 L-18 8 L-48 -12 L-12 -14 Z" fill={TEJA} stroke={C.tinta} strokeWidth={5} strokeLinejoin="round" />
        </g>
      ) : null}
      {/* carrete de cable */}
      <g transform={`translate(230 ${950 + 0}) scale(${ease(t, en + 0.2, en + 0.8)})`} opacity={1 - esp}>
        <circle r={62} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
        <circle r={22} fill={C.crema} stroke={C.tinta} strokeWidth={5} />
        <path d="M62 10 Q130 20 150 -10 Q170 -40 200 -20" stroke={C.tinta} strokeWidth={8} fill="none" strokeLinecap="round" />
      </g>
      {/* esposas */}
      <g transform={`translate(${cx} 980) scale(${esp * 1.5})`} opacity={esp}>
        <circle cx={-52} cy={0} r={34} fill="none" stroke={C.tinta} strokeWidth={13} />
        <circle cx={52} cy={0} r={34} fill="none" stroke={C.tinta} strokeWidth={13} />
        <path d="M-20 0 L20 0" stroke={C.tinta} strokeWidth={9} strokeDasharray="10 5" />
        <rect x={-62} y={-52} width={20} height={20} fill={C.tinta} />
        <rect x={42} y={-52} width={20} height={20} fill={C.tinta} />
      </g>
    </g>,
    s,
  );
};

/** Dos vías: el tren A (turquesa) descarrila e invade la otra vía y el B (gris) choca con él. Posiciones x ≤ 960. */
export const ViasTr: React.FC<{y?: number; en?: number; descarrilaEn?: number; chocaEn?: number; etiquetaA?: string; etiquetaB?: string; bEn?: number; hasta?: number}> = ({y = 640, en = 0, descarrilaEn = 2, chocaEn = 4, etiquetaA = 'Iryo', etiquetaB = 'Alvia', bEn, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.5);
  const sep = 190;
  // Tren A (de izquierda a derecha, vía de arriba)
  const avance = ease(t, en, descarrilaEn) * 80 + ease(t, descarrilaEn, chocaEn) * 80;
  const xA = 40 + avance;
  const salto = ease(t, descarrilaEn, descarrilaEn + 0.9);
  const yA = y + salto * (sep - 8);
  const giroA = -16 * Math.sin(salto * Math.PI * 0.9) - 3 * ease(t, chocaEn, chocaEn + 0.4);
  // Tren B (vía de abajo, mira a la izquierda), ya en su sitio, avanza hacia el choque
  const entraB = ease(t, bEn ?? en + 0.2, (bEn ?? en + 0.2) + 0.6);
  const xB = 575 - ease(t, chocaEn - 0.6, chocaEn) * 15;
  const yB = y + sep;
  const choque = ease(t, chocaEn, chocaEn + 0.3);
  const destello = choque > 0 && t < chocaEn + 1.4 ? 1 : 0;
  return lienzo(
    <g opacity={k}>
      <Via y={y + 96} x0={40} x1={940} t={t} anda={t < chocaEn} />
      <Via y={y + sep + 96} x0={40} x1={940} t={t} anda={t < chocaEn} />
      <g transform={`translate(${xB + 360} ${yB}) scale(-0.9 0.9)`} opacity={entraB}><TrenDib color={GRIS} raya={C.tinta} /></g>
      <g transform={`translate(${xA} ${yA}) rotate(${giroA} 200 90) scale(0.9)`}><TrenDib color={C.turquesa} /></g>
      {destello ? (
        <g transform={`translate(565 ${y + sep + 40}) scale(${(0.7 + 0.5 * Math.abs(Math.sin(t * 9))) * 1.2})`}>
          <path d="M0 -50 L12 -14 L48 -12 L18 8 L28 46 L0 24 L-28 46 L-18 8 L-48 -12 L-12 -14 Z" fill={TEJA} stroke={C.tinta} strokeWidth={5} strokeLinejoin="round" />
        </g>
      ) : null}
      <text x={60} y={y - 24} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={C.turquesa}>{etiquetaA}</text>
      <text x={900} y={y + sep + 220} opacity={entraB} textAnchor="end" fontFamily={F.texto} fontWeight={700} fontSize={64} fill={C.piedra}>{etiquetaB}</text>
    </g>,
    s,
  );
};

/** Muro caído por la lluvia sobre la vía de un tren de cercanías; lazo negro (duelo) y señal de parada. */
export const MuroTr: React.FC<{y?: number; en?: number; luto?: number; paradaEn?: number; hasta?: number}> = ({y = 700, en = 0, luto = 6, paradaEn = 9, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.5);
  const cae = ease(t, en + 0.6, en + 1.4);
  const lz = ease(t, luto, luto + 0.5);
  const pa = ease(t, paradaEn, paradaEn + 0.5);
  const gotas = Array.from({length: 22}, (_, i) => {
    const gx = 90 + ((i * 41) % 840);
    const fase = ((t * 1.6 + i * 0.37) % 1);
    return <line key={i} x1={gx} y1={y - 190 + fase * 250} x2={gx - 8} y2={y - 160 + fase * 250} stroke={C.turquesa} strokeWidth={5} strokeLinecap="round" opacity={0.85} />;
  });
  const bloques = [[480, 0, 90, 56], [570, 6, 90, 56], [525, -58, 90, 56], [650, 40, 80, 50], [420, 44, 80, 50]];
  return lienzo(
    <g opacity={k}>
      {gotas}
      <Via y={y + 200} x0={40} x1={940} t={t} anda={false} />
      <g transform={`translate(70 ${y + 100})`}><TrenDib color={C.crema} raya={C.turquesa} /></g>
      {/* muro: bloques que caen sobre la vía */}
      {bloques.map(([bx, dy, bw, bh], i) => (
        <rect key={i} x={bx} y={y + 144 + dy - (1 - cae) * 260} width={bw} height={bh} rx={4} fill="#C98B6B" stroke={C.tinta} strokeWidth={5} transform={`rotate(${(i % 2 ? 7 : -6) * cae} ${bx + bw / 2} ${y + 170})`} />
      ))}
      <g transform={`translate(190 ${y + 330}) scale(${lz})`} opacity={lz}>
        <path d="M0 -40 Q-40 -40 -40 -10 Q-40 20 0 10 Q40 20 40 -10 Q40 -40 0 -40 Z" fill="none" stroke={C.tinta} strokeWidth={14} />
        <path d="M-10 6 L-48 70 L-20 66 L-6 40 Z M10 6 L48 70 L20 66 L6 40 Z" fill={C.tinta} />
      </g>
      <g transform={`translate(700 ${y + 330}) scale(${pa})`} opacity={pa}>
        <path d="M-30 -80 L30 -80 L74 -36 L74 30 L30 74 L-30 74 L-74 30 L-74 -36 Z" fill={TEJA} stroke={C.tinta} strokeWidth={6} strokeLinejoin="round" />
        <rect x={-50} y={-12} width={100} height={24} rx={6} fill={C.crema} />
      </g>
    </g>,
    s,
  );
};

/** Calendario de huelga: los días 9, 10 y 11 (FEB); el 9 se desconvoca (sello) y los otros dos se apagan. */
export const CalTr: React.FC<{x?: number; y?: number; en?: number; diasEn?: number[]; desconvocaEn?: number; hasta?: number}> = ({x = 90, y = 520, en = 0, diasEn = [0.5, 0.8, 1.1], desconvocaEn = 3, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.5);
  const dias = ['9', '10', '11'];
  const apaga = ease(t, desconvocaEn, desconvocaEn + 0.5);
  const sello = ease(t, desconvocaEn, desconvocaEn + 0.35);
  return lienzo(
    <g transform={`translate(${x} ${y + Math.sin(t * 2.2) * 6})`} opacity={k}>
      <rect x={0} y={0} width={780} height={110} rx={22} fill={TEJA} stroke={C.tinta} strokeWidth={6} />
      <text x={390} y={80} textAnchor="middle" fontFamily={F.titular} fontSize={72} fill={C.crema}>FEB</text>
      {dias.map((d, i) => {
        const a = ease(t, diasEn[i], diasEn[i] + 0.35);
        const apagado = i > 0 ? apaga : 0;
        return (
          <g key={d} transform={`translate(${i * 270} ${150 + (1 - a) * 40}) scale(${a || 0.001})`} opacity={a * (1 - 0.65 * apagado)}>
            <rect width={240} height={240} rx={26} fill={C.crema} stroke={C.tinta} strokeWidth={6} />
            <text x={120} y={168} textAnchor="middle" fontFamily={F.titular} fontSize={d.length > 1 ? 120 : 140} fill={C.tinta}>{d}</text>
            {i > 0 && apagado > 0 ? <path d={`M20 20 L${20 + 200 * apagado} ${20 + 200 * apagado}`} stroke={TEJA} strokeWidth={12} strokeLinecap="round" /> : null}
          </g>
        );
      })}
      <g transform={`translate(120 270) rotate(-12) scale(${sello * 1.15})`} opacity={sello}>
        <circle r={96} fill="none" stroke={TEJA} strokeWidth={16} />
        <path d="M-68 -68 L68 68" stroke={TEJA} strokeWidth={16} strokeLinecap="round" />
      </g>
    </g>,
    s,
  );
};

/** Carta de Semaf a Adif (izquierda) y atril del Congreso (derecha): dos tarjetas con el mismo peso. */
export const GiroTr: React.FC<{y?: number; en?: number; atrilEn?: number; hasta?: number}> = ({y = 600, en = 0, atrilEn = 5, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.5);
  const mueve = ease(t, atrilEn - 0.3, atrilEn + 0.5);
  const cx = 480 + (270 - 480) * mueve; // la carta pasa del centro a la izquierda
  const esc = 1 - 0.18 * mueve;
  const a = ease(t, atrilEn, atrilEn + 0.5);
  const bob = Math.sin(t * 2.4) * 5;
  const sello = ease(t, en + 0.7, en + 1.1);
  return lienzo(
    <g opacity={k}>
      {/* carta */}
      <g transform={`translate(${cx} ${y + 210 + bob}) scale(${esc})`}>
        <rect x={-190} y={-210} width={380} height={460} rx={14} fill={C.crema} stroke={C.tinta} strokeWidth={7} />
        {[-150, -112, -74].map((ly) => <rect key={ly} x={-140} y={ly} width={280} height={12} rx={6} fill={GRIS} />)}
        <path d="M-120 100 L-60 140 L0 100 L60 140 L120 100" stroke={C.piedra} strokeWidth={6} fill="none" strokeLinecap="round" />
        <g transform={`translate(70 150) rotate(-10) scale(${sello})`} opacity={sello}>
          <rect x={-170} y={-72} width={340} height={144} rx={16} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
          <text x={0} y={-8} textAnchor="middle" fontFamily={F.titular} fontSize={64} fill={C.tinta}>Semaf</text>
          <text x={0} y={52} textAnchor="middle" fontFamily={F.titular} fontSize={64} fill={C.tinta}>→ Adif</text>
        </g>
      </g>
      {/* atril del Congreso */}
      <g transform={`translate(${750} ${y + 210 - (1 - a) * 40 + bob}) scale(${0.82 * (a || 0.001)})`} opacity={a}>
        <rect x={-190} y={-210} width={380} height={460} rx={14} fill={C.crema} stroke={C.tinta} strokeWidth={7} />
        <path d="M-150 -150 L0 -200 L150 -150 Z" fill={C.piedra} stroke={C.tinta} strokeWidth={5} />
        {[-110, -50, 10, 70].map((px) => <rect key={px} x={px} y={-140} width={34} height={150} fill={GRIS} stroke={C.tinta} strokeWidth={4} />)}
        <path d="M-110 250 L-80 20 L80 20 L110 250 Z" fill={C.tinta} />
        <rect x={-100} y={5} width={200} height={30} rx={8} fill={C.mostaza} stroke={C.tinta} strokeWidth={4} />
        <path d="M0 5 L0 -60" stroke={C.tinta} strokeWidth={7} />
        <circle cx={0} cy={-72} r={14} fill={C.tinta} />
      </g>
    </g>,
    s,
  );
};

/** Línea de tiempo horizontal con tramos de años. */
export const TlTr: React.FC<{y?: number; en?: number; dur?: number; hitos?: {x: number; etiqueta: string; en: number}[]; hasta?: number}> = ({y = 800, en = 0, dur = 1.2, hitos = [], hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const g = ease(t, en, en + dur);
  const x0 = 90;
  const x1 = 900;
  return lienzo(
    <g>
      <line x1={x0} y1={y} x2={x0 + (x1 - x0) * g} y2={y} stroke={C.tinta} strokeWidth={10} strokeLinecap="round" />
      <circle cx={x0} cy={y} r={20} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
      {hitos.map((h) => {
        const a = ease(t, h.en, h.en + 0.4);
        return (
          <g key={h.etiqueta} opacity={a} transform={`translate(${h.x} ${y})`}>
            <circle r={16 * (a || 0.01)} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
            <text x={h.x < 300 ? -16 : 0} y={-48} textAnchor={h.x < 300 ? 'start' : 'middle'} fontFamily={F.texto} fontWeight={700} fontSize={48} fill={C.tinta}>{h.etiqueta}</text>
          </g>
        );
      })}
    </g>,
    s,
  );
};

/** Silueta de ministro (busto sin rostro) con escudo de transporte. */
export const SiluetaTr: React.FC<{x?: number; y?: number; en?: number; esc?: number; hasta?: number}> = ({x = 300, y = 1000, en = 0, esc = 1, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.5);
  const bob = Math.sin(t * 2.2) * 5;
  return lienzo(
    <g transform={`translate(${x} ${y + bob}) scale(${esc * (0.85 + 0.15 * k)})`} opacity={k}>
      <circle cx={0} cy={-190} r={72} fill={C.tinta} />
      <path d="M-170 0 Q-170 -110 -60 -118 L60 -118 Q170 -110 170 0 Z" fill={C.tinta} />
      <path d="M-26 -118 L0 -60 L26 -118 Z" fill={C.crema} />
      <path d="M0 -112 L16 -70 L0 -34 L-16 -70 Z" fill={TEJA} />
      <g transform="translate(270 -60)">
        <path d="M-70 -90 L70 -90 L70 20 Q70 80 0 110 Q-70 80 -70 20 Z" fill={C.mostaza} stroke={C.tinta} strokeWidth={7} />
        <g transform="translate(-44 -42) scale(0.22)"><TrenDib color={C.tinta} raya={C.mostaza} ventanas={C.mostaza} /></g>
      </g>
    </g>,
    s,
  );
};

/** Lupa (investigan) y mazo de juez (juzgado): CIAF y juzgado. */
export const LupaMazoTr: React.FC<{x?: number; y?: number; en?: number; mazoEn?: number; hasta?: number}> = ({x = 500, y = 960, en = 0, mazoEn = 3, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const a = ease(t, en, en + 0.5);
  const b = ease(t, mazoEn, mazoEn + 0.5);
  const golpe = b > 0 ? Math.sin(Math.max(0, t - mazoEn - 0.4) * 9) * 8 * Math.exp(-Math.max(0, t - mazoEn - 0.4) * 1.6) : 0;
  return lienzo(
    <g>
      <g transform={`translate(${x - 200} ${y + Math.sin(t * 2.4) * 6}) scale(${a || 0.001})`} opacity={a}>
        <circle cx={0} cy={0} r={100} fill="#FFFFFF55" stroke={C.tinta} strokeWidth={16} />
        <path d="M72 72 L160 160" stroke={C.tinta} strokeWidth={26} strokeLinecap="round" />
        <path d="M-50 -30 Q-30 -62 8 -64" stroke={C.mostaza} strokeWidth={10} fill="none" strokeLinecap="round" />
      </g>
      <g transform={`translate(${x + 200} ${y + 10 + Math.sin(t * 2.4 + 1) * 6}) scale(${b || 0.001})`} opacity={b}>
        <g transform={`rotate(${-35 + golpe} 0 60)`}>
          <rect x={-80} y={-100} width={160} height={80} rx={14} fill={C.mostaza} stroke={C.tinta} strokeWidth={7} />
          <rect x={-12} y={-20} width={24} height={150} rx={8} fill={C.tinta} />
        </g>
        <rect x={-120} y={130} width={240} height={26} rx={10} fill={C.tinta} />
      </g>
    </g>,
    s,
  );
};

/** Punto de choque en el mapa (Urda, Toledo): zona, línea y punto que late. */
export const PuntoTr: React.FC<{y?: number; en?: number; hasta?: number}> = ({y = 0, en = 0, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.5);
  const bob = Math.sin(t * 2.2) * 4;
  const r1 = ((t * 0.9) % 1) * 150;
  return lienzo(
    <g transform={`translate(0 ${y + bob})`} opacity={k}>
      <path d="M90 480 Q300 400 520 440 Q780 470 880 560 Q930 700 860 850 Q640 930 420 880 Q150 870 100 720 Q60 590 90 480 Z" fill="#E4DCCB" stroke={C.piedra} strokeWidth={5} />
      <path d="M110 790 Q300 740 480 700 Q700 660 870 580" stroke={C.tinta} strokeWidth={12} fill="none" strokeLinecap="round" />
      <path d="M110 790 Q300 740 480 700 Q700 660 870 580" stroke={C.mostaza} strokeWidth={4} fill="none" strokeDasharray="14 14" />
      <circle cx={560} cy={680} r={r1} fill="none" stroke={TEJA} strokeWidth={8} opacity={1 - r1 / 150} />
      <circle cx={560} cy={680} r={34} fill={TEJA} stroke={C.tinta} strokeWidth={7} />
    </g>,
    s,
  );
};

/** Dos cifras enfrentadas (Adamuz / Urda). Cambia `valorA`/`valorB` desde el generador. */
export const DuoTr: React.FC<{y?: number; valorA: string; etiquetaA: string; valorB: string; etiquetaB: string; colorB?: string; tamB?: number; cxB?: number; en?: number; enB?: number; hasta?: number}> = ({y = 760, valorA, etiquetaA, valorB, etiquetaB, colorB = TEJA, tamB = 260, cxB = 790, en = 0, enB = 0.8, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const a = ease(t, en, en + 0.5);
  const b = ease(t, enB, enB + 0.5);
  const pulsoB = 1 + 0.04 * Math.sin(t * 4);
  return lienzo(
    <g>
      <g opacity={a} transform={`translate(0 ${(1 - a) * 40})`}>
        <text x={230} y={y} textAnchor="middle" fontFamily={F.titular} fontSize={260} fill={C.tinta}>{valorA}</text>
        <text x={230} y={y + 90} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={64} fill={C.tinta}>{etiquetaA}</text>
      </g>
      <line x1={470} y1={y - 190} x2={470} y2={y + 90} stroke={C.piedra} strokeWidth={6} opacity={b} />
      <g opacity={b} transform={`translate(0 ${(1 - b) * 40})`}>
        <text x={cxB} y={y} textAnchor="middle" fontFamily={F.titular} fontSize={tamB} fill={colorB} transform={`translate(${cxB} ${y}) scale(${pulsoB}) translate(${-cxB} ${-y})`}>{valorB}</text>
        <text x={cxB} y={y + 90} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={64} fill={colorB}>{etiquetaB}</text>
      </g>
    </g>,
    s,
  );
};

/** Botones Sí / No para la pregunta final. */
export const BotonesTr: React.FC<{y?: number; en?: number; hasta?: number}> = ({y = 760, en = 0, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const a = ease(t, en, en + 0.4);
  const b = ease(t, en + 0.25, en + 0.65);
  const pulso = (i: number) => 1 + 0.03 * Math.sin(t * 3 + i * 2);
  return lienzo(
    <g>
      <g transform={`translate(300 ${y}) scale(${(a || 0.001) * pulso(0)})`} opacity={a}>
        <rect x={-190} y={-110} width={380} height={220} rx={40} fill={C.turquesa} stroke={C.tinta} strokeWidth={7} />
        <text y={44} textAnchor="middle" fontFamily={F.titular} fontSize={130} fill={C.crema}>SÍ</text>
      </g>
      <g transform={`translate(740 ${y}) scale(${(b || 0.001) * pulso(1)})`} opacity={b}>
        <rect x={-190} y={-110} width={380} height={220} rx={40} fill={TEJA} stroke={C.tinta} strokeWidth={7} />
        <text y={44} textAnchor="middle" fontFamily={F.titular} fontSize={130} fill={C.crema}>NO</text>
      </g>
    </g>,
    s,
  );
};

export const REGISTRO_027: Record<string, React.FC<any>> = {
  numTr: NumTr, trenTr: TrenTr, toledoTr: ToledoTr, viasTr: ViasTr, muroTr: MuroTr, calTr: CalTr, giroTr: GiroTr, tlTr: TlTr,
  siluetaTr: SiluetaTr, lupaMazoTr: LupaMazoTr, puntoTr: PuntoTr, duoTr: DuoTr, botonesTr: BotonesTr,
};
