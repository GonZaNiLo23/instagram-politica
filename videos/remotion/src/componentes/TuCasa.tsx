import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useSalida} from './util';

/**
 * Pieza 040 (Tu Casa). SVG a lienzo completo; tiempos en segundos desde el inicio de la ESCENA.
 * REGISTRO_040: chequeT (cheque de 50.000 € con zoom desde el fotograma 0), menorT (dos tarjetas "20 %" y "50.000 €"),
 * interesT (0 % y devolución al ICO), listaT (lista de comprobación con casillas), diputT (hemiciclo que se reduce + flechas),
 * tarjetasT (dinero no solicitable / aval vigente), topeT (casa con candado y tope que sube), botonesT (A/B del cierre).
 */
const usa = () => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {t: fr / fps, fr};
};
const ease = (t: number, a: number, b: number, out = false) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: out ? Easing.out(Easing.cubic) : Easing.inOut(Easing.cubic)});
const pop = (t: number, a: number, d = 0.5) => {
  const k = ease(t, a, a + d, true);
  return t < a ? 0 : k * (1 + 0.05 * Math.sin(Math.min(1, (t - a) / d) * Math.PI));
};
const lienzo = (children: React.ReactNode, s: number) => (
  <div style={{opacity: s}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>{children}</svg>
  </div>
);
const vaiven = (t: number, a = 6, p = 1.6) => Math.sin(t / p * Math.PI * 2) * a;

const Casa: React.FC<{c?: string}> = ({c = C.tinta}) => (
  <g>
    <polygon points="-110,-10 0,-110 110,-10" fill={c} />
    <rect x={-84} y={-10} width={168} height={120} fill={C.crema} stroke={c} strokeWidth={9} />
    <rect x={-22} y={34} width={44} height={76} fill={c} />
    <rect x={-72} y={14} width={34} height={34} fill={c} opacity={0.5} />
    <rect x={38} y={14} width={34} height={34} fill={c} opacity={0.5} />
  </g>
);
const Candado: React.FC<{c?: string}> = ({c = C.tinta}) => (
  <g>
    <path d="M-34,-10 V-38 a34,34 0 0 1 68,0 V-10" fill="none" stroke={c} strokeWidth={14} />
    <rect x={-52} y={-12} width={104} height={86} rx={14} fill={C.mostaza} stroke={c} strokeWidth={9} />
    <circle cx={0} cy={26} r={11} fill={c} />
    <rect x={-4} y={30} width={8} height={26} fill={c} />
  </g>
);
const Cheque: React.FC<{ancho?: number}> = ({ancho = 700}) => (
  <g>
    <rect x={0} y={0} width={ancho} height={330} rx={28} fill={C.crema} stroke={C.tinta} strokeWidth={10} />
    <rect x={0} y={0} width={ancho} height={64} rx={28} fill={C.tinta} />
    <rect x={0} y={40} width={ancho} height={24} fill={C.tinta} />
    <text x={ancho / 2} y={236} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={136} fill={C.tinta}>50.000 €</text>
    <line x1={60} y1={290} x2={ancho - 220} y2={290} stroke={C.piedra} strokeWidth={6} />
    <circle cx={ancho - 110} cy={284} r={22} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
  </g>
);

/** Cheque de 50.000 € desde el fotograma 0: zoom + golpe. `sello` lo pone la escena con selloTexto. */
export const ChequeT: React.FC<{y?: number; en?: number; zoom?: boolean; hasta?: number; esc?: number}> = ({y = 900, en = 0, zoom = true, hasta, esc = 1}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const z = zoom ? 0.55 + 0.45 * ease(t, en, en + 0.5, true) : 1;
  const g = zoom ? 1 + 0.07 * Math.sin(ease(t, en + 0.45, en + 0.9) * Math.PI) : 1;
  return lienzo(
    <g transform={`translate(0 ${y + vaiven(t, 8)}) translate(540 165) scale(${z * g * esc}) rotate(-2) translate(-350 -165)`}>
      <g transform="translate(0 0)"><Cheque /></g>
    </g>,
    s,
  );
};

/** Dos tarjetas: casa con "20 %" y cheque con "50.000 €"; se iluminan con la voz y la última queda como "el menor". */
export const MenorT: React.FC<{y?: number; enA?: number; enB?: number; enMenor?: number; hasta?: number}> = ({y = 640, enA = 0.2, enB = 2.2, enMenor = 4.2, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const kA = pop(t, enA, 0.5), kB = pop(t, enB, 0.5);
  const km = ease(t, enMenor, enMenor + 0.5, true);
  const tarjeta = (cy: number, k: number, texto: string, icono: React.ReactNode, lit: number) => (
    <g transform={`translate(0 ${cy}) translate(540 100) scale(${k || 0.001}) translate(-540 -100)`} opacity={Math.min(1, k * 2)}>
      <rect x={140} y={0} width={730} height={200} rx={30} fill={lit > 0 ? C.mostaza : C.crema} stroke={C.tinta} strokeWidth={8} />
      <g transform="translate(270 112) scale(0.85)">{icono}</g>
      <text x={420} y={136} fontFamily={F.cifra} fontWeight={700} fontSize={texto.length > 6 ? 84 : 100} fill={C.tinta}>{texto}</text>
    </g>
  );
  const cheq = (
    <g transform="translate(-60 -50) scale(0.17)"><Cheque /></g>
  );
  return lienzo(
    <g transform={`translate(0 ${y + vaiven(t, 5)})`}>
      {tarjeta(0, kA, '20 %', <Casa />, km && 0)}
      {tarjeta(250, kB, '50.000 €', <g transform="translate(60 40)">{cheq}</g>, km)}
      <g opacity={km} transform={`translate(0 ${-12 * (1 - km)})`}>
        <path d="M880,100 q40,0 40,60 v90" fill="none" stroke={C.turquesa} strokeWidth={12} strokeLinecap="round" />
        <polygon points="900,250 940,250 920,290" fill={C.turquesa} />
      </g>
    </g>,
    s,
  );
};

/** Contador "0 %" + flecha circular de devolución con el sobre que vuelve al ICO. */
export const InteresT: React.FC<{y?: number; enCero?: number; enSin?: number; enDevuelve?: number; hasta?: number}> = ({y = 620, enCero = 0.1, enSin = 2.2, enDevuelve = 5.4, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k0 = pop(t, enCero, 0.5);
  const kd = ease(t, enDevuelve, enDevuelve + 1.6);
  const kc = pop(t, enSin, 0.5);
  const ang = kd * 300;
  const R = 150;
  const px = 540 + R * Math.cos(((ang - 90) * Math.PI) / 180), py = 560 + R * Math.sin(((ang - 90) * Math.PI) / 180);
  return lienzo(
    <g transform={`translate(0 ${y})`}>
      <g transform={`translate(540 100) scale(${(k0 || 0.001) * (1 + 0.05 * kc)}) translate(-540 -100)`}>
        <rect x={240} y={0} width={600} height={200} rx={30} fill={C.tinta} />
        <text x={540} y={146} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={130} fill={C.mostaza}>0 %</text>
      </g>
      <g opacity={ease(t, enDevuelve - 0.2, enDevuelve + 0.3)}>
        <circle cx={540} cy={560} r={R} fill="none" stroke={C.piedra} strokeWidth={10} strokeDasharray="4 22" />
        <path d={`M540,${560 - R} A${R},${R} 0 1 1 ${540 + R * Math.cos(((ang - 90) * Math.PI) / 180)},${560 + R * Math.sin(((ang - 90) * Math.PI) / 180)}`} fill="none" stroke={C.turquesa} strokeWidth={16} strokeLinecap="round" opacity={kd > 0 ? 1 : 0} />
        <g transform={`translate(${px} ${py})`}>
          <rect x={-44} y={-30} width={88} height={60} rx={10} fill={C.mostaza} stroke={C.tinta} strokeWidth={7} />
          <text x={0} y={14} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={44} fill={C.tinta}>€</text>
        </g>
        <circle cx={540} cy={560} r={74} fill={C.tinta} />
        <text x={540} y={586} textAnchor="middle" fontFamily={F.titular} fontSize={72} fill={C.crema}>ICO</text>
      </g>
    </g>,
    s,
  );
};

/** Lista de comprobación: items [{texto: string[], estado: 'ok'|'no', en, parpadea}] */
export const ListaT: React.FC<{y?: number; items: {texto: string[]; estado: 'ok' | 'no'; en: number; parpadea?: boolean}[]; paso?: number; hasta?: number}> = ({y = 640, items, paso = 190, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  return lienzo(
    <g transform={`translate(0 ${y})`}>
      {items.map((it, i) => {
        const k = pop(t, it.en, 0.45);
        const par = it.parpadea ? (Math.floor((t - it.en) * 3) % 2 === 0 ? 1 : 0.35) : 1;
        const h = 60 + it.texto.length * 70;
        let acc = 0;
        for (let j = 0; j < i; j++) acc += 60 + items[j].texto.length * 70 + 30;
        return (
          <g key={i} transform={`translate(0 ${acc}) translate(540 ${h / 2}) scale(${k || 0.001}) translate(-540 ${-h / 2})`} opacity={Math.min(1, k * 2)}>
            <rect x={60} y={0} width={840} height={h} rx={26} fill={it.estado === 'ok' ? C.crema : '#FBE9E3'} stroke={C.tinta} strokeWidth={7} />
            <circle cx={135} cy={h / 2} r={44} fill={it.estado === 'ok' ? C.turquesa : C.teja} opacity={par} />
            {it.estado === 'ok'
              ? <path d={`M111,${h / 2} l18,20 l34,-40`} fill="none" stroke={C.crema} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
              : <g opacity={par} stroke={C.crema} strokeWidth={13} strokeLinecap="round"><line x1={117} y1={h / 2 - 18} x2={153} y2={h / 2 + 18} /><line x1={153} y1={h / 2 - 18} x2={117} y2={h / 2 + 18} /></g>}
            {it.texto.map((l, j) => <text key={j} x={200} y={j * 70 + 70 + (it.texto.length === 1 ? 0 : 0)} fontFamily={F.titular} fontSize={64} fill={C.tinta}>{l}</text>)}
          </g>
        );
      })}
    </g>,
    s,
  );
};

/** Hemiciclo de 350 puntos que se apaga hasta dejar un semicírculo pequeño (Diputación Permanente) + dos flechas. */
export const DiputT: React.FC<{y?: number; enApaga?: number; enFlechas?: number; enSi?: number; hasta?: number}> = ({y = 600, enApaga = 1.2, enFlechas = 7.5, enSi = 10.2, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const pts = React.useMemo(() => {
    const out: {x: number; y: number; a: number}[] = [];
    const filas = 10, R = 360;
    const radios = Array.from({length: filas}, (_, i) => R * (0.45 + (0.55 * i) / (filas - 1)));
    const tot = radios.reduce((a, b) => a + b, 0);
    radios.forEach((r) => {
      const n = Math.round((350 * r) / tot);
      for (let k = 0; k < n; k++) {
        const a = Math.PI * (1 - k / (n - 1));
        out.push({x: 540 + r * Math.cos(a), y: 330 - r * Math.sin(a), a: Math.abs(Math.cos(a))});
      }
    });
    return out;
  }, []);
  const ap = ease(t, enApaga, enApaga + 1.6);
  const kf = ease(t, enFlechas, enFlechas + 0.5, true);
  const kr = ease(t, enSi, enSi + 0.5, true);
  const ks = pop(t, enSi + 0.9, 0.5);
  return lienzo(
    <g transform={`translate(0 ${y})`}>
      <g transform={`translate(540 330) scale(${1 - 0.05 * ap}) translate(-540 -330)`}>
        {pts.map((p, i) => {
          const centro = p.a < 0.16; // el tramo central se queda
          const op = centro ? 1 : 1 - ap * 0.85;
          return <circle key={i} cx={p.x} cy={p.y} r={centro ? 10 + ap * 2 : 10 - ap * 4} fill={centro ? (ap > 0.5 ? C.mostaza : C.tinta) : C.tinta} opacity={op} stroke={centro && ap > 0.5 ? C.tinta : 'none'} strokeWidth={2} />;
        })}
      </g>
      <g opacity={kf} transform={`translate(0 ${20 * (1 - kf)})`}>
        <path d="M470,350 q-140,10 -250,80" fill="none" stroke={C.tinta} strokeWidth={12} strokeLinecap="round" />
        <polygon points="196,404 252,402 226,452" fill={C.tinta} />
        <g transform="translate(210 520) scale(0.85)">
          <rect x={-70} y={-50} width={140} height={150} rx={14} fill={C.teja} stroke={C.tinta} strokeWidth={8} />
          <rect x={-90} y={-76} width={180} height={28} rx={8} fill={C.tinta} />
          <line x1={-28} y1={-20} x2={-28} y2={72} stroke={C.crema} strokeWidth={9} />
          <line x1={0} y1={-20} x2={0} y2={72} stroke={C.crema} strokeWidth={9} />
          <line x1={28} y1={-20} x2={28} y2={72} stroke={C.crema} strokeWidth={9} />
        </g>
      </g>
      <g opacity={kr} transform={`translate(0 ${20 * (1 - kr)})`}>
        <path d="M610,350 q130,10 220,80" fill="none" stroke={C.tinta} strokeWidth={12} strokeLinecap="round" />
        <polygon points="800,404 856,402 830,452" fill={C.tinta} />
        <g transform="translate(720 520)">
          <rect x={-215} y={-60} width={430} height={120} rx={26} fill={C.crema} stroke={C.tinta} strokeWidth={8} />
          <text x={-12} y={14} textAnchor="middle" fontFamily={F.titular} fontSize={58} fill={C.tinta}>ACUERDO</text>
          <g opacity={ks} transform={`translate(0 ${ (1 - ks) * -20})`}><circle cx={190} cy={-78} r={36} fill={C.teja} stroke={C.tinta} strokeWidth={6} /><g stroke={C.crema} strokeWidth={10} strokeLinecap="round"><line x1={177} y1={-91} x2={203} y2={-65} /><line x1={203} y1={-91} x2={177} y2={-65} /></g></g>
        </g>
      </g>
    </g>,
    s,
  );
};

/** Dos tarjetas: TU CASA (dinero, no solicitable) y AVAL ICO (garantía, vigente), la segunda se ilumina con un escudo. */
export const TarjetasT: React.FC<{y?: number; enA?: number; enB?: number; enLuz?: number; hasta?: number}> = ({y = 660, enA = 0.2, enB = 1.0, enLuz = 1.6, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const kA = pop(t, enA, 0.5), kB = pop(t, enB, 0.5), luz = ease(t, enLuz, enLuz + 0.5);
  const tarjeta = (cy: number, k: number, l1: string, l2: string, fondo: string, apagada: boolean) => (
    <g transform={`translate(0 ${cy}) translate(500 110) scale(${k || 0.001}) translate(-500 -110)`} opacity={Math.min(1, k * 2) * (apagada ? 1 - 0.35 * luz : 1)}>
      <rect x={110} y={0} width={760} height={220} rx={30} fill={fondo} stroke={C.tinta} strokeWidth={8} />
      <text x={150} y={96} fontFamily={F.titular} fontSize={64} fill={C.tinta}>{l1}</text>
      <text x={150} y={178} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={C.tinta}>{l2}</text>
    </g>
  );
  return lienzo(
    <g transform={`translate(0 ${y + vaiven(t, 4)})`}>
      {tarjeta(0, kA, 'TU CASA', 'dinero: no solicitable', C.crema, true)}
      {tarjeta(260, kB, 'AVAL ICO', 'garantía · vigente', luz > 0.5 ? C.mostaza : C.crema, false)}
      <g transform={`translate(740 ${260 + 86}) scale(${0.6 * (pop(t, enLuz + 0.3, 0.5) || 0.001)})`}>
        <path d="M0,-90 L74,-60 V10 q0,64 -74,100 q-74,-36 -74,-100 V-60 Z" fill={C.turquesa} stroke={C.tinta} strokeWidth={8} />
        <path d="M-30,6 l22,24 l42,-50" fill="none" stroke={C.crema} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>,
    s,
  );
};

/** Casa con candado a un lado y una línea de precio cuyo tope sube despacio (inflación). */
export const TopeT: React.FC<{y?: number; enCandado?: number; enTope?: number; hasta?: number}> = ({y = 560, enCandado = 0.4, enTope = 4.0, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const kc = pop(t, enCandado, 0.5);
  const kt = ease(t, enTope, enTope + 5.5);
  const yTope = 420 - 70 * kt;
  return lienzo(
    <g transform={`translate(0 ${y})`}>
      <g transform={`translate(260 140) scale(1.5)`}><Casa /></g>
      <g transform={`translate(560 190) scale(${1.4 * (kc || 0.001)})`}><Candado /></g>
      <line x1={110} y1={440} x2={900} y2={440} stroke={C.piedra} strokeWidth={8} strokeDasharray="14 14" />
      <g opacity={ease(t, enTope - 0.3, enTope + 0.3)}>
        <rect x={110} y={yTope - 8} width={790} height={16} rx={8} fill={C.teja} />
        <line x1={900} y1={yTope} x2={900} y2={440} stroke={C.tinta} strokeWidth={8} />
        <polygon points="900,440 884,410 916,410" fill={C.tinta} />
        <text x={680} y={yTope - 28} fontFamily={F.titular} fontSize={64} fill={C.tinta}>TOPE</text>
        <text x={110} y={440 + 76} fontFamily={F.titular} fontSize={64} fill={C.tinta}>COMPRA</text>
      </g>
    </g>,
    s,
  );
};

/** Botones A/B del cierre (2 líneas en B para no pasar de x 960). */
export const BotonesT: React.FC<{y?: number; en?: number; hasta?: number}> = ({y = 600, en = 0.3, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const ka = pop(t, en, 0.5), kb = pop(t, en + 0.3, 0.5);
  const fila = (cy: number, k: number, letra: string, lineas: string[], col: string) => (
    <g transform={`translate(0 ${cy}) translate(500 90) scale(${k || 0.001}) translate(-500 -90)`} opacity={Math.min(1, k * 2)}>
      <rect x={110} y={0} width={760} height={lineas.length > 1 ? 230 : 160} rx={30} fill={col} stroke={C.tinta} strokeWidth={8} />
      <circle cx={186} cy={(lineas.length > 1 ? 230 : 160) / 2} r={42} fill={C.tinta} />
      <text x={186} y={(lineas.length > 1 ? 230 : 160) / 2 + 22} textAnchor="middle" fontFamily={F.titular} fontSize={62} fill={C.crema}>{letra}</text>
      {lineas.map((l, i) => <text key={i} x={250} y={(lineas.length > 1 ? 98 : 100) + i * 72} fontFamily={F.titular} fontSize={64} fill={C.crema}>{l}</text>)}
    </g>
  );
  return lienzo(
    <g transform={`translate(0 ${y + vaiven(t, 10, 1.4)})`}>
      {fila(0, ka, 'A', ['SÍ, ACEPTO'], C.turquesa)}
      {fila(210, kb, 'B', ['NO, PREFIERO', 'PRECIO LIBRE'], C.teja)}
    </g>,
    s,
  );
};

export const REGISTRO_040: Record<string, React.FC<any>> = {
  chequeT: ChequeT, menorT: MenorT, interesT: InteresT, listaT: ListaT, diputT: DiputT, tarjetasT: TarjetasT, topeT: TopeT, botonesT: BotonesT,
};
