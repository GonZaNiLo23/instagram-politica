import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {miles, useSalida} from './util';
import {Cierre} from './Cierre';

/**
 * Serie "8 años en cifras" (pieza 030 en adelante). Componentes reutilizables para los siguientes episodios:
 * cifraSerie (cabecera "CIFRA n"), contadorSerie (dos barras verticales con contador), barrasHSerie (barras horizontales con eje en cero),
 * tartaSerie, fichaSerie, cifraGrandeSerie, empleoSerie, barraFigurasSerie, abSerie, cierreSerie (tarjeta de cierre de serie).
 * Tiempos `en`/`hasta` en segundos desde el inicio de la ESCENA. Todo opt-in: ninguno afecta a otras piezas.
 */
const usa = () => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {fr, fps, t: fr / fps};
};
const ease = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
const lienzo = (children: React.ReactNode, s: number) => (
  <div style={{opacity: s}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>{children}</svg>
  </div>
);
const GRIS = '#B4BBC8';

/** Cabecera de serie: pastilla "CIFRA n" y, debajo, el nombre de la serie (ambos 64 px). */
export const CifraSerie: React.FC<{n: number | string; serie?: string; y?: number; en?: number; hasta?: number}> = ({n, serie = '8 años en cifras', y = 330, en = 0, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.35);
  return (
    <div style={{position: 'absolute', left: SEGURA.izq, top: y, opacity: k * s, transform: `translateX(${(1 - k) * -60}px)`}}>
      <span style={{fontFamily: F.titular, fontSize: 64, lineHeight: 1.2, color: C.tinta, background: C.mostaza, padding: '4px 22px', borderRadius: 14}}>CIFRA {n}</span>
      <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: 1.2, color: C.tinta, marginTop: 10}}>{serie}</div>
    </div>
  );
};

/**
 * Dos barras verticales con eje en cero (misma escala) y contador sobre la segunda.
 * La barra A (tinta) está llena desde el fotograma 1; la B nace en contorno y se rellena de mostaza al contar de `valA` a `valB`
 * entre `cuentaEn` y `cuentaEn + cuentaDur`. `signo`: segundos a los que aparece el "?" sobre la diferencia.
 */
export const ContadorSerie: React.FC<{
  valA: number; valB: number; etiqA?: string; etiqB?: string; base?: number; hMax?: number; w?: number; xA?: number; xB?: number;
  cuentaEn?: number; cuentaDur?: number; signo?: number; valores?: boolean; etiquetas?: boolean; hasta?: number; etiqBYa?: boolean;
}> = ({etiqBYa = false, valA, valB, etiqA = '2018', etiqB = '2025', base = 1040, hMax = 270, w = 280, xA = 120, xB = 600, cuentaEn = 0, cuentaDur = 3, signo, valores = true, etiquetas = true, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, cuentaEn, cuentaEn + cuentaDur);
  const v = valA + (valB - valA) * k;
  const hA = (valA / valB) * hMax;
  const hB = (v / valB) * hMax;
  const fin = t >= cuentaEn + cuentaDur;
  const vaiven = Math.sin(t * 2.4) * 4;
  const sg = signo === undefined ? 0 : ease(t, signo, signo + 0.4);
  const hLlena = (valB / valB) * hMax;
  return lienzo(
    <g transform={`translate(0 ${vaiven})`}>
      <line x1={xA - 40} y1={base} x2={xB + w + 40} y2={base} stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />
      <rect x={xA} y={base - hA} width={w} height={hA} fill={C.tinta} />
      {valores ? <text x={xA + w / 2} y={base - hA - 20} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={C.tinta}>{miles(valA)}</text> : null}
      <rect x={xB} y={base - hLlena} width={w} height={hLlena} fill="none" stroke={C.tinta} strokeWidth={5} strokeDasharray="16 12" />
      <rect x={xB} y={base - hB} width={w} height={hB} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
      {valores && t >= cuentaEn ? <text x={xB + w / 2} y={base - Math.max(hB, hA) - 20} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={C.tinta}>{miles(v)}</text> : null}
      {etiquetas ? <text x={xA + w / 2} y={base + 76} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={64} fill={C.tinta}>{etiqA}</text> : null}
      {etiquetas && (fin || etiqBYa) ? <text x={xB + w / 2} y={base + 76} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={64} fill={C.tinta}>{etiqB}</text> : null}
      {sg > 0 ? (
        <g transform={`translate(${(xA + w + xB) / 2} ${base - hLlena * 0.55}) scale(${sg})`}>
          <circle r={56} fill={C.tinta} />
          <text y={32} textAnchor="middle" fontFamily={F.titular} fontSize={88} fill={C.mostaza}>?</text>
        </g>
      ) : null}
    </g>,
    s,
  );
};

/**
 * Barras horizontales con eje en cero. `filas`: [{etiqueta, valor, color, en}] (etiqueta literal del guion; `en` = segundos de la escena en que
 * aparece la fila y empieza a crecer). El eje parte de 0 y llega a `max` (marcas cada `paso`). Cada barra crece en `dur` s.
 */
export const BarrasHSerie: React.FC<{
  titulo?: string; filas: {etiqueta: string; valor: number; color?: string; en: number; resalta?: boolean}[]; max?: number; paso?: number; sufijoEje?: string;
  y0?: number; alto?: number; x0?: number; largo?: number; dur?: number; tamano?: number; hasta?: number;
}> = ({titulo, filas, max = 60, paso = 20, sufijoEje = ' %', y0 = 330, alto = 190, x0 = 110, largo = 760, dur = 0.9, tamano = 64, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const yFilas = y0 + (titulo ? 110 : 0);
  const marcas = [];
  for (let m = 0; m <= max; m += paso) marcas.push(m);
  const yEje = yFilas + filas.length * alto + 6;
  return lienzo(
    <g>
      {titulo ? <text x={SEGURA.izq} y={y0 + 64} fontFamily={F.texto} fontWeight={700} fontSize={64} fill={C.tinta}>{titulo}</text> : null}
      <line x1={x0} y1={yEje} x2={x0 + largo + 20} y2={yEje} stroke={C.tinta} strokeWidth={4} strokeLinecap="round" />
      {marcas.map((m) => (
        <g key={m}>
          <line x1={x0 + (m / max) * largo} y1={yEje} x2={x0 + (m / max) * largo} y2={yEje + 14} stroke={C.tinta} strokeWidth={4} />
          <text x={x0 + (m / max) * largo} y={yEje + 52} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={40} fill={C.tinta}>{m === 0 ? '0' : `${m}${m === marcas[marcas.length - 1] ? sufijoEje : ''}`}</text>
        </g>
      ))}
      {filas.map((f, i) => {
        const e = ease(t, f.en, f.en + 0.3);
        const k = ease(t, f.en, f.en + dur);
        const yb = yFilas + i * alto;
        return (
          <g key={i} opacity={e} transform={`translate(${(1 - e) * -50} 0)`}>
            <text x={SEGURA.izq} y={yb + 62} fontFamily={F.texto} fontWeight={700} fontSize={tamano} fill={C.tinta}>{f.etiqueta}</text>
            <line x1={x0} y1={yb + 70} x2={x0} y2={yb + alto} stroke={C.tinta} strokeWidth={6} />
            <rect x={x0} y={yb + 82} width={Math.max(0.001, (f.valor / max) * largo * k)} height={56} fill={f.color ?? (f.resalta ? C.mostaza : C.piedra)} stroke={C.tinta} strokeWidth={4} />
          </g>
        );
      })}
    </g>,
    s,
  );
};

/** Tarta de la economía: círculo completo con una porción mostaza que pasa de `de` % a `a` % entre `en` y `en + dur`. */
export const TartaSerie: React.FC<{de: number; a: number; cx?: number; cy?: number; r?: number; en?: number; dur?: number; hasta?: number}> = ({de, a, cx = 540, cy = 800, r = 240, en = 0, dur = 1.6, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const e = ease(t, en, en + 0.4);
  const k = ease(t, en + 0.5, en + 0.5 + dur);
  const pct = de + (a - de) * k;
  const ang = (pct / 100) * Math.PI * 2;
  const x1 = cx + r * Math.sin(ang), y1 = cy - r * Math.cos(ang);
  return lienzo(
    <g opacity={e} transform={`translate(0 ${Math.sin(t * 2.2) * 5})`}>
      <circle cx={cx} cy={cy} r={r} fill={C.crema} stroke={C.tinta} strokeWidth={8} />
      <path d={`M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${pct > 50 ? 1 : 0} 1 ${x1} ${y1} Z`} fill={C.mostaza} stroke={C.tinta} strokeWidth={8} strokeLinejoin="round" />
    </g>,
    s,
  );
};

/** Cifra enorme (valor) con subtexto (64 px) debajo. */
export const CifraGrandeSerie: React.FC<{valor: string; sub?: string; y?: number; tam?: number; en?: number; hasta?: number}> = ({valor, sub, y = 330, tam = 210, en = 0, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.4);
  return (
    <div style={{position: 'absolute', left: SEGURA.izq, top: y, opacity: k * s, transform: `scale(${0.85 + 0.15 * k})`, transformOrigin: 'left top'}}>
      <div style={{fontFamily: F.titular, fontSize: tam, lineHeight: 1.05, color: C.tinta}}>{valor}</div>
      {sub ? <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: 1.2, color: C.tinta}}>{sub}</div> : null}
    </div>
  );
};

/** Ficha de datos (tarjeta tinta con filas en crema). Las filas entran una a una cada `paso` s. `ancho` hasta x ≤ 960. */
export const FichaSerie: React.FC<{filas: string[]; y?: number; x?: number; ancho?: number; en?: number; paso?: number; tam?: number; hasta?: number}> = ({filas, y = 830, x = SEGURA.izq, ancho = 900, en = 0, paso = 0.5, tam = 64, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.35);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: ancho, background: C.tinta, borderRadius: 24, padding: '22px 36px', opacity: k * s, transform: `translateY(${(1 - k) * 50}px)`, boxShadow: '0 12px 0 rgba(20,33,61,0.25)'}}>
      {filas.map((f, i) => {
        const e = ease(t, en + 0.2 + i * paso, en + 0.2 + i * paso + 0.3);
        return <div key={i} style={{fontFamily: F.cifra, fontWeight: 700, fontSize: tam, lineHeight: 1.3, color: C.crema, opacity: e, transform: `translateX(${(1 - e) * 40}px)`}}>{f}</div>;
      })}
    </div>
  );
};

/** Persona plana (cabeza + torso). */
const Persona: React.FC<{x: number; y: number; esc?: number; color?: string}> = ({x, y, esc = 1, color = C.tinta}) => (
  <g transform={`translate(${x} ${y}) scale(${esc})`}>
    <circle cx={0} cy={-52} r={20} fill={color} />
    <path d="M -28 0 Q -28 -30 0 -30 Q 28 -30 28 0 Z" fill={color} />
  </g>
);

/** Personas trabajando + flecha ascendente (empleo). Ocupa x 60..420, y a y+400. */
export const EmpleoSerie: React.FC<{x?: number; y?: number; en?: number; hasta?: number; escala?: number}> = ({x = 60, y = 700, en = 0, hasta, escala = 1}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.4);
  const f = ease(t, en + 0.4, en + 1.2);
  const pos = [[70, 380], [180, 380], [290, 380], [125, 280], [235, 280]];
  return lienzo(
    <g transform={`translate(${x} ${y}) scale(${escala})`} opacity={k}>
      {pos.map(([px, py], i) => <Persona key={i} x={px} y={py} esc={1.7} color={i % 2 ? C.turquesa : C.tinta} />)}
      <g transform={`translate(0 ${(1 - f) * 40 + Math.sin(t * 3) * 6})`} opacity={f}>
        <path d="M 150 190 L 150 20 M 80 90 L 150 20 L 220 90" fill="none" stroke={C.mostaza} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>,
    s,
  );
};

/** Barra de recaudación que, en `divide`, se parte en `n` figuras (personas) que se reparten el total. Eje horizontal x 100..900. */
export const BarraFigurasSerie: React.FC<{n?: number; y?: number; en?: number; divide?: number; hasta?: number}> = ({n = 10, y = 880, en = 0, divide = 1.2, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const e = ease(t, en, en + 0.4);
  const d = ease(t, divide, divide + 0.9);
  const ancho = 800, x0 = 100, paso = ancho / n;
  return lienzo(
    <g opacity={e} transform={`translate(0 ${Math.sin(t * 2.5) * 4})`}>
      {Array.from({length: n}).map((_, i) => {
        const cxi = x0 + paso * (i + 0.5);
        const wBar = paso * (1 - 0.18 * d);
        return (
          <g key={i}>
            <rect x={cxi - wBar / 2} y={y - 60 - d * 60} width={wBar} height={120 - d * 40} rx={d * 10} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
            <g opacity={d}><Persona x={cxi} y={y + 120 * d - 20} esc={1.1} /></g>
          </g>
        );
      })}
    </g>,
    s,
  );
};

/** Dos botones apilados A / B (pregunta final). */
export const AbSerie: React.FC<{a: string; b: string; y?: number; en?: number; hasta?: number}> = ({a, b, y = 880, en = 0, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const ka = ease(t, en, en + 0.4);
  const kb = ease(t, en + 0.25, en + 0.65);
  const fila = (letra: string, texto: string, yy: number, k: number, col: string, fg: string) => (
    <g transform={`translate(0 ${yy}) scale(${k || 0.001})`} style={{transformOrigin: '510px 50px'}} opacity={k}>
      <rect x={SEGURA.izq} y={0} width={820} height={104} rx={26} fill={col} stroke={C.tinta} strokeWidth={6} />
      <circle cx={SEGURA.izq + 62} cy={52} r={38} fill={C.tinta} />
      <text x={SEGURA.izq + 62} y={74} textAnchor="middle" fontFamily={F.titular} fontSize={60} fill={C.crema}>{letra}</text>
      <text x={SEGURA.izq + 130} y={76} fontFamily={F.titular} fontSize={64} fill={fg}>{texto}</text>
    </g>
  );
  return lienzo(<g>{fila('A', a, y, ka, C.teja, C.crema)}{fila('B', b, y + 124, kb, C.turquesa, C.crema)}</g>, s);
};

/** Subrayado que barre de lado a lado (evita huecos de quietud en el cierre). */
const BarridoSerie: React.FC = () => {
  const {t} = usa();
  const k = ease(t, 0.3, 0.9);
  const w = 260 + 560 * (0.5 + 0.5 * Math.sin(t * 2.4));
  return lienzo(<rect x={SEGURA.izq} y={880} width={w * k} height={44} rx={22} fill={C.tinta} />, 1);
};

/** Tarjeta de cierre de serie: "Cifra N la próxima semana" + Síguenos / para estar informado + Fuentes en la descripción + logo. */
export const CierreSerie: React.FC<{siguiente: number | string; tamano?: number; marca?: string}> = ({siguiente, tamano = 96, marca}) => (
  <>
    <Cierre frase={`Cifra ${siguiente} la próxima semana`} tamano={tamano} marca={marca} pulso />
    <BarridoSerie />
  </>
);

export const REGISTRO_SERIE: Record<string, React.FC<any>> = {
  cifraSerie: CifraSerie, contadorSerie: ContadorSerie, barrasHSerie: BarrasHSerie, tartaSerie: TartaSerie, cifraGrandeSerie: CifraGrandeSerie,
  fichaSerie: FichaSerie, empleoSerie: EmpleoSerie, barraFigurasSerie: BarraFigurasSerie, abSerie: AbSerie, cierreSerie: CierreSerie,
};
