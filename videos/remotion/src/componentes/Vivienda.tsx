import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';

/**
 * Componentes de la pieza 005 (decretos de vivienda), reutilizables. Se registran en REGISTRO_005.
 * Todos los tiempos, en segundos desde el inicio de la escena. Un `en` negativo = ya presente desde el primer fotograma
 * (sirve para repetir un elemento fijo en varias escenas seguidas sin que "brote" otra vez).
 */
const T = C.tinta;
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const cl = (x: number) => Math.min(1, Math.max(0, x));
const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};
const COL: Record<string, string> = {A: C.mostaza, B: C.piedra};

/** Marco de un dibujo de 200x200 centrado en (x, y), con entrada de muelle. `children` recibe el tiempo local. */
const Dib: React.FC<{x: number; y: number; tamano: number; en?: number; hasta?: number; children: (t: number) => React.ReactNode}> = ({x, y, tamano, en = 0, hasta, children}) => {
  const t = useT();
  const e = useEntrada(en);
  const s = useSalida(hasta);
  return (
    <div style={{position: 'absolute', left: x - tamano / 2, top: y - tamano / 2, width: tamano, height: tamano, opacity: Math.min(e, 1) * s, transform: `scale(${0.6 + 0.4 * Math.min(e, 1)})`}}>
      <svg viewBox="0 0 200 200" width={tamano} height={tamano} style={{overflow: 'visible'}}>{children(t)}</svg>
    </div>
  );
};

type Paso = {x?: number; y?: number; en: number; dur: number};
const sigue = (t: number, ini: number, pasos: Paso[] | undefined, k: 'x' | 'y') => {
  let v = ini;
  (pasos ?? []).forEach((p) => {
    const dest = p[k];
    if (dest === undefined || t < p.en) return;
    const q = Easing.inOut(Easing.cubic)(cl((t - p.en) / p.dur));
    v = v + (dest - v) * q;
  });
  return v;
};
// versión que encadena bien: cada paso parte del valor que tenía al terminar el anterior
const posicion = (t: number, ini: number, pasos: Paso[] | undefined, k: 'x' | 'y') => {
  let desde = ini;
  let v = ini;
  (pasos ?? []).forEach((p) => {
    const dest = p[k];
    if (dest === undefined) return;
    if (t >= p.en) {
      v = desde + (dest - desde) * Easing.inOut(Easing.cubic)(cl((t - p.en) / p.dur));
    }
    desde = dest;
  });
  return v;
};
void sigue;

/**
 * Llave plana. (x, y) = punta de la llave. `pasos` = movimientos de la punta; `gira` = giro sobre la punta;
 * `luz` = segundo en que se ilumina; `disc` = segundo en que pasa a contorno discontinuo; `flota` = oscila desde ese segundo.
 * `rot` = giro fijo en grados (90 = apunta hacia abajo). Letra A mostaza, B gris piedra.
 */
export const LlaveV: React.FC<{letra: 'A' | 'B'; x: number; y: number; escala?: number; en?: number; hasta?: number; rot?: number; luz?: number; luzHasta?: number; pasos?: Paso[]; gira?: {en: number; dur: number; grados: number; vuelta?: number}; disc?: number; flota?: number}> = ({
  letra, x, y, escala = 1.5, en = 0, hasta, rot = 0, luz, luzHasta, pasos, gira, disc, flota,
}) => {
  const t = useT();
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const px = posicion(t, x, pasos, 'x');
  let py = posicion(t, y, pasos, 'y');
  if (flota !== undefined && t > flota) py += 12 * Math.sin((t - flota) * 5);
  let g = rot;
  if (gira) {
    g = rot + gira.grados * Easing.inOut(Easing.cubic)(cl((t - gira.en) / gira.dur));
  }
  const d = disc !== undefined && t >= disc;
  const col = COL[letra];
  const halo = luz !== undefined && t >= luz && (luzHasta === undefined || t < luzHasta);
  const fill = d ? 'none' : col;
  const trazo = {...sw, strokeDasharray: d ? '14 12' : undefined, opacity: d ? 0.85 : 1};
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(e, 1) * s}}>
      <g transform={`translate(${px} ${py}) rotate(${g}) scale(${escala * (0.7 + 0.3 * Math.min(e, 1))})`}>
        {halo ? <circle cx={-150} cy={0} r={62 + 6 * Math.sin(t * 9)} fill={C.mostaza} opacity={0.35} /> : null}
        <rect x={-112} y={-9} width={112} height={18} rx={6} fill={fill} {...trazo} />
        <rect x={-40} y={9} width={14} height={28} rx={3} fill={fill} {...trazo} />
        <rect x={-16} y={9} width={16} height={20} rx={3} fill={fill} {...trazo} />
        <circle cx={-150} cy={0} r={38} fill={fill} {...trazo} />
        <text x={-150} y={15} textAnchor="middle" fontFamily={F.titular} fontSize={44} fill={T} opacity={d ? 0.6 : 1}>{letra}</text>
      </g>
    </svg>
  );
};

export type Marca = {tipo: 'check' | 'interroga' | 'disc'; en: number; hasta?: number};

/** Cerradura plana en (x, y) (placa de 120x160 px a escala 1) con marca a su derecha: check turquesa, "?" parpadeante o check discontinuo. */
export const CerraduraV: React.FC<{x: number; y: number; escala?: number; en?: number; hasta?: number; marcas?: Marca[]; dx?: number}> = ({x, y, escala = 1, en = 0, hasta, marcas = [], dx}) => {
  const t = useT();
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const m = [...marcas].filter((q) => t >= q.en && (q.hasta === undefined || t < q.hasta)).pop();
  const mx = dx ?? 128 * escala;
  const r = 52 * escala;
  const q = m ? cl((t - m.en) / 0.5) : 0;
  const pop = m ? useEntradaFija(t, m.en) : 0;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(e, 1) * s}}>
      <g transform={`translate(${x} ${y}) scale(${escala})`}>
        <rect x={-60} y={-80} width={120} height={160} rx={24} fill={T} stroke={T} strokeWidth={7} strokeLinejoin="round" />
        <circle cx={0} cy={-18} r={17} fill={C.crema} />
        <path d="M-9 -8 L9 -8 L14 40 L-14 40 Z" fill={C.crema} />
      </g>
      {m ? (
        <g transform={`translate(${x + mx} ${y}) scale(${0.5 + 0.5 * pop})`} opacity={Math.min(1, pop)}>
          {m.tipo === 'check' ? (
            <>
              <circle r={r} fill={C.turquesa} stroke={T} strokeWidth={7} />
              <path d={`M${-0.5 * r} ${0.04 * r} L${-0.14 * r} ${0.4 * r} L${0.52 * r} ${-0.38 * r}`} fill="none" stroke={C.crema} strokeWidth={13 * escala} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={120 * escala} strokeDashoffset={120 * escala * (1 - q)} />
            </>
          ) : null}
          {m.tipo === 'disc' ? (
            <>
              <circle r={r} fill="none" stroke={C.turquesa} strokeWidth={7} strokeDasharray="14 12" />
              <path d={`M${-0.5 * r} ${0.04 * r} L${-0.14 * r} ${0.4 * r} L${0.52 * r} ${-0.38 * r}`} fill="none" stroke={C.turquesa} strokeWidth={11 * escala} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="14 14" />
            </>
          ) : null}
          {m.tipo === 'interroga' ? (
            <g opacity={0.45 + 0.55 * (0.5 + 0.5 * Math.sin((t - m.en) * 9))}>
              <circle r={r} fill={C.piedra} stroke={T} strokeWidth={7} />
              <text y={0.34 * r} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={1.1 * r} fill={T}>?</text>
            </g>
          ) : null}
        </g>
      ) : null}
    </svg>
  );
};
const useEntradaFija = (t: number, en: number) => Easing.out(Easing.back(2))(cl((t - en) / 0.35));

export type HitoV = {dia: string; mes: string; en?: number; ya?: boolean; gris?: boolean; nota?: string[]; /** no existe hasta este segundo (la línea se alarga hasta él) */ aparece?: number};

/**
 * Línea de fechas con `ranuras` posiciones iguales entre x0 y x1 (no es una escala proporcional: solo orden).
 * Cada hito: día y mes en 64 px. `gris` = no confirmada (nunca se enciende). `cursor` = [[segundo, posición (índice)]].
 * `tramo` = [[segundo, fracción 0..1 del recorrido hasta el último hito presente]] para la barra tinta.
 */
export const FechasV: React.FC<{hitos: HitoV[]; y?: number; ranuras?: number; x0?: number; x1?: number; en?: number; hasta?: number; cursor?: [number, number][]; cursorHasta?: number; tramo?: [number, number][]}> = ({hitos, y = 600, ranuras, x0 = 150, x1 = 810, en = 0, hasta, cursor, cursorHasta, tramo}) => {
  const t = useT();
  const e = useEntrada(en);
  const s = useSalida(hasta);
  const n = ranuras ?? hitos.length;
  const xi = (i: number) => x0 + ((x1 - x0) * i) / (n - 1);
  const presente = (h: HitoV) => h.aparece === undefined || t >= h.aparece;
  // la línea de fondo llega hasta el último hito presente (y se alarga hacia el siguiente cuando aparece)
  let finX = xi(0);
  hitos.forEach((h, i) => {
    if (h.aparece === undefined) finX = Math.max(finX, xi(i));
    else if (t >= h.aparece) finX = Math.max(finX, xi(i - 1) + (xi(i) - xi(i - 1)) * Easing.out(Easing.cubic)(cl((t - h.aparece) / 0.6)));
  });
  const ultimoFijo = hitos.reduce((m, h, i) => (h.aparece === undefined ? i : m), 0);
  const tx = tramo ? interpolate(t, tramo.map((p) => p[0]), tramo.map((p) => p[1]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  const yaTinta = Math.min(finX, xi(0) + (xi(ultimoFijo) - xi(0)) * tx);
  const cur = cursor ? interpolate(t, cursor.map((p) => p[0]), cursor.map((p) => p[1]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)}) : null;
  return (
    <div style={{position: 'absolute', left: 0, top: y, width: 1080, opacity: Math.min(e, 1) * s}}>
      <div style={{position: 'absolute', left: x0, top: 36, width: finX - x0, height: 10, background: C.piedra, borderRadius: 5}} />
      <div style={{position: 'absolute', left: x0, top: 36, width: Math.max(0, yaTinta - x0), height: 10, background: T, borderRadius: 5}} />
      {hitos.map((h, i) => {
        if (!presente(h)) return null;
        const on = !h.gris && (h.ya || (h.en !== undefined && t >= h.en));
        const sc = h.ya || h.en === undefined ? 1 : interpolate(t, [h.en, h.en + 0.27], [0.6, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const ap = h.aparece !== undefined ? cl((t - h.aparece) / 0.4) : 1;
        const x = xi(i);
        return (
          <div key={i} style={{position: 'absolute', left: x - 100, width: 200, textAlign: 'center', top: 0, opacity: ap}}>
            <div style={{margin: '0 auto', width: 80, height: 80, borderRadius: 40, background: on ? C.mostaza : C.crema, border: `8px solid ${on ? T : C.piedra}`, transform: `scale(${on ? sc : 0.8})`, boxSizing: 'border-box'}} />
            <div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 64, color: T, opacity: on ? 1 : 0.65, marginTop: 12, lineHeight: '70px'}}>{h.dia}</div>
            <div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 64, color: T, opacity: on ? 1 : 0.65, lineHeight: '70px'}}>{h.mes}</div>
            {h.nota ? h.nota.map((l, j) => <div key={j} style={{fontFamily: F.texto, fontWeight: 600, fontSize: 36, color: T, lineHeight: '42px'}}>{l}</div>) : null}
          </div>
        );
      })}
      {cur !== null && (cursorHasta === undefined || t < cursorHasta) ? (
        <svg width="80" height="64" viewBox="0 0 80 64" style={{position: 'absolute', left: xi(0) + (xi(1) - xi(0)) * cur - 40, top: -52, overflow: 'visible'}}>
          <path d="M6 4 H74 L40 60 Z" fill={T} stroke={T} strokeWidth={6} strokeLinejoin="round" />
          <path d="M20 12 H60 L40 44 Z" fill={C.mostaza} />
        </svg>
      ) : null}
    </div>
  );
};

/** Llave de corchete horizontal (abierta hacia arriba) que se dibuja de x0 a x1, con etiqueta de 64 px debajo. Sin fecha en el extremo. */
export const Corchete: React.FC<{x0: number; x1: number; y: number; en?: number; dur?: number; etiqueta?: string; hasta?: number}> = ({x0, x1, y, en = 0, dur = 1, etiqueta, hasta}) => {
  const t = useT();
  const s = useSalida(hasta);
  const q = cl((t - en) / dur);
  const w = (x1 - x0) * Easing.out(Easing.cubic)(q);
  const xm = (x0 + x1) / 2;
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: s}}>
        <clipPath id="clipCorchete"><rect x={x0 - 10} y={y - 60} width={w + 20} height={140} /></clipPath>
        <g clipPath="url(#clipCorchete)">
          <path d={`M${x0} ${y} q0 28 28 28 h${(x1 - x0) / 2 - 56} q28 0 28 28 q0 -28 28 -28 h${(x1 - x0) / 2 - 56} q28 0 28 -28`} fill="none" stroke={T} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
      {etiqueta ? <div style={{position: 'absolute', left: xm - 300, width: 600, top: y + 66, textAlign: 'center', fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: T, opacity: Math.min(1, q * 2) * s}}>{etiqueta}</div> : null}
    </>
  );
};

/** Dos decretos con barras de votos (sí/no), eje desde 0 y escala común `max`. */
export const VotosDecretos: React.FC<{y: number; en?: number; hasta?: number; max?: number; compacto?: boolean; filas: {etiqueta: string; si: number; no: number; en: number}[]}> = ({y, en = 0, hasta, max = 200, compacto = false, filas}) => {
  const t = useT();
  const s = useSalida(hasta);
  const anchoMax = 470;
  return (
    <div style={{position: 'absolute', left: 62, width: 900, top: y, opacity: s}}>
      {filas.map((f, i) => {
        const q = Easing.out(Easing.cubic)(cl((t - en - f.en) / 0.8));
        return (
          <div key={i} style={{marginBottom: compacto ? 6 : 14, opacity: t >= en + f.en ? 1 : 0}}>
            <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 64, color: T, lineHeight: compacto ? '66px' : '70px'}}>{f.etiqueta}</div>
            {[['si', f.si, T, 'sí'], ['no', f.no, C.piedra, 'no']].map(([k, v, col, txt]) => (
              <div key={k as string} style={{display: 'flex', alignItems: 'center', gap: 18, height: compacto ? 56 : 66}}>
                <div style={{width: ((v as number) / max) * anchoMax * q, height: compacto ? 40 : 44, background: col as string, borderRadius: 8, border: `4px solid ${T}`, boxSizing: 'border-box'}} />
                <div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 64, color: T, opacity: q > 0.6 ? 1 : 0}}>{`${v} ${txt}`}</div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

/** Tarjeta de texto con cita y atribución (mismo formato para todas las citas). */
export const TarjetaCita: React.FC<{cita: string; autor: string; x?: number; y?: number; ancho?: number; en?: number; hasta?: number; deIzq?: boolean}> = ({cita, autor, x = 540, y = 760, ancho = 880, en = 0, hasta, deIzq = false}) => {
  const e = useEntrada(en);
  const s = useSalida(hasta);
  return (
    <div style={{position: 'absolute', left: x - ancho / 2, width: ancho, top: y, boxSizing: 'border-box', padding: '20px 26px', background: C.crema, border: `7px solid ${T}`, borderRadius: 26, boxShadow: '0 12px 0 rgba(20,33,61,0.25)', opacity: Math.min(e, 1) * s, transform: `translateX(${(1 - Math.min(e, 1)) * (deIzq ? -120 : 120)}px)`}}>
      <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: 1.15, color: T}}>{cita}</div>
      <div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 36, lineHeight: '44px', color: T, marginTop: 8}}>{autor}</div>
    </div>
  );
};

/** Pastillas de texto del mismo tamaño (sin logotipos ni colores de partido), que entran una a una. */
export const Pildoras: React.FC<{items: {texto: string; en: number}[]; y: number; ancho?: number; hueco?: number; en?: number; hasta?: number; x0?: number}> = ({items, y, ancho = 200, hueco = 20, en = 0, hasta, x0}) => {
  const t = useT();
  const s = useSalida(hasta);
  const total = items.length * ancho + (items.length - 1) * hueco;
  const ini = x0 ?? (540 - total / 2 - 10);
  return (
    <>
      {items.map((it, i) => {
        const q = useEntradaFija(t, en + it.en);
        return (
          <div key={i} style={{position: 'absolute', left: ini + i * (ancho + hueco), top: y, width: ancho, height: 84, borderRadius: 42, background: T, color: C.crema, fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: '84px', textAlign: 'center', opacity: Math.min(1, q) * s, transform: `scale(${0.6 + 0.4 * q})`}}>{it.texto}</div>
        );
      })}
    </>
  );
};

/** Bocadillo de texto plano (mismo tamaño siempre), con cola hacia abajo-izquierda. */
export const Bocadillo: React.FC<{lineas: string[]; x?: number; y: number; ancho?: number; alto?: number; en?: number; hasta?: number}> = ({lineas, x = 540, y, ancho = 600, alto = 220, en = 0, hasta}) => {
  const t = useT();
  const s = useSalida(hasta);
  const q = useEntradaFija(t, en);
  const flota = 6 * Math.sin((t - en) * 3);
  return (
    <div style={{position: 'absolute', left: x - ancho / 2, top: y + flota, width: ancho, height: alto + 40, opacity: Math.min(1, q) * s, transform: `scale(${0.7 + 0.3 * q})`}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: ancho, height: alto, boxSizing: 'border-box', background: C.crema, border: `7px solid ${T}`, borderRadius: 40, boxShadow: '0 12px 0 rgba(20,33,61,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        {lineas.map((l, i) => <div key={i} style={{fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: '74px', color: T}}>{l}</div>)}
      </div>
      <svg width={80} height={50} viewBox="0 0 80 50" style={{position: 'absolute', left: 70, top: alto - 8}}>
        <path d="M6 2 L74 2 L10 44 Z" fill={C.crema} stroke="none" />
        <path d="M6 0 L10 44 L74 0" fill="none" stroke={T} strokeWidth={7} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Píldora con color de fondo (p. ej. gris piedra con texto tinta): para marcar algo como condicional. */
export const Pildora: React.FC<{texto: string; x?: number; y: number; fondo?: string; en?: number; hasta?: number}> = ({texto, x = 540, y, fondo = C.piedra, en = 0, hasta}) => {
  const e = useEntrada(en);
  const s = useSalida(hasta);
  return (
    <div style={{position: 'absolute', left: x - 450, width: 900, top: y, display: 'flex', justifyContent: 'center', opacity: Math.min(e, 1) * s, transform: `scale(${0.8 + 0.2 * Math.min(e, 1)})`}}>
      <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: '78px', color: T, background: fondo, border: `6px solid ${T}`, borderRadius: 44, padding: '4px 36px'}}>{texto}</div>
    </div>
  );
};

/** Recibo con flecha que sube; cae el sello "2 %" sobre un techo y la flecha choca. */
export const ReciboTecho: React.FC<{x: number; y: number; tamano?: number; en?: number; hasta?: number; subeEn?: number; techoEn?: number; selloEn?: number}> = ({x, y, tamano = 400, en = 0, hasta, subeEn = 0.3, techoEn = 2, selloEn = 2.4}) => (
  <Dib x={x} y={y} tamano={tamano} en={en} hasta={hasta}>
    {(t) => {
      const cyc = t < subeEn ? 0 : ((t - subeEn) % 1.5) / 1.5;
      const libre = 150 - 110 * Easing.inOut(Easing.quad)(cyc);
      const choca = t >= techoEn ? 84 + 4 * Math.sin((t - techoEn) * 18) * Math.exp(-(t - techoEn) * 2.5) : libre;
      const cae = Easing.bounce(cl((t - selloEn) / 0.5));
      return (
        <g>
          <path d="M18 20 h92 v138 l-11.5 -9 l-11.5 9 l-11.5 -9 l-11.5 9 l-11.5 -9 l-11.5 9 l-11.5 -9 z" fill={C.crema} {...sw} />
          <rect x={34} y={64} width={50} height={8} rx={4} fill={T} />
          <rect x={34} y={84} width={60} height={8} rx={4} fill={T} />
          <text x={64} y={50} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={32} fill={T}>€</text>
          <path d={`M158 160 V${choca} M138 ${choca + 24} L158 ${choca} L178 ${choca + 24}`} fill="none" stroke={T} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
          <g opacity={cl((t - techoEn) / 0.2)}>
            <path d="M120 62 H200" stroke={T} strokeWidth={9} strokeLinecap="round" />
            <path d="M126 62 l-8 8 M146 62 l-8 8 M166 62 l-8 8 M186 62 l-8 8" stroke={T} strokeWidth={5} strokeLinecap="round" />
          </g>
          <g transform={`translate(0 ${-70 * (1 - cae)})`} opacity={t >= selloEn ? 1 : 0}>
            <rect x={122} y={8} width={72} height={46} rx={10} fill={C.mostaza} stroke={T} strokeWidth={6} />
            <text x={158} y={43} textAnchor="middle" fontFamily={F.titular} fontSize={32} fill={T}>2 %</text>
          </g>
        </g>
      );
    }}
  </Dib>
);

/** Calendario al que se le añaden dos hojas "+1 +1", con un check de "al día". */
export const CalendarioMas: React.FC<{x: number; y: number; tamano?: number; en?: number; hasta?: number; masEn?: number}> = ({x, y, tamano = 330, en = 0, hasta, masEn = 0.5}) => (
  <Dib x={x} y={y} tamano={tamano} en={en} hasta={hasta}>
    {(t) => {
      const a = useEntradaFija(t, masEn);
      const b = useEntradaFija(t, masEn + 0.7);
      return (
        <g>
          <rect x={14} y={46} width={172} height={140} rx={16} fill={C.crema} {...sw} />
          <path d="M14 62 a16 16 0 0 1 16 -16 h140 a16 16 0 0 1 16 16 v28 h-172 z" fill={C.teja} {...sw} />
          <rect x={52} y={28} width={14} height={34} rx={7} fill={T} />
          <rect x={134} y={28} width={14} height={34} rx={7} fill={T} />
          <circle cx={100} cy={138} r={30} fill={C.turquesa} {...sw} strokeWidth={6} />
          <path d="M86 138 l10 10 l20 -22" fill="none" stroke={C.crema} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
          <g transform={`translate(${-6 + (1 - a) * -30} ${-14 + (1 - a) * -30})`} opacity={Math.min(1, a)}>
            <rect x={110} y={-10} width={64} height={46} rx={8} fill={C.mostaza} stroke={T} strokeWidth={6} />
            <text x={142} y={26} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={32} fill={T}>+1</text>
          </g>
          <g transform={`translate(${-6 + (1 - b) * 30} ${-14 + (1 - b) * -30})`} opacity={Math.min(1, b)}>
            <rect x={30} y={-10} width={64} height={46} rx={8} fill={C.mostaza} stroke={T} strokeWidth={6} />
            <text x={62} y={26} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={32} fill={T}>+1</text>
          </g>
        </g>
      );
    }}
  </Dib>
);

const Casa: React.FC<{x: number; y: number; s?: number; fill: string; puertaAbre?: number}> = ({x, y, s = 1, fill, puertaAbre = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-50 0 L0 -44 L50 0 V56 H-50 Z" fill={fill} {...sw} />
    <path d={`M-12 56 V16 H${12 - 24 * puertaAbre * 0.0} V56`} fill={C.crema} {...sw} strokeWidth={6} />
    <path d={`M-12 56 V16 L${-12 + 22 * puertaAbre} ${22} V${50}`} fill={T} stroke="none" opacity={puertaAbre > 0.05 ? 0.9 : 0} />
    <rect x={20} y={6} width={18} height={18} rx={3} fill={C.crema} {...sw} strokeWidth={5} />
  </g>
);

/** Casa a la que se le cierra un escudo turquesa (dos mitades que se juntan). */
export const CasaEscudo: React.FC<{x: number; y: number; tamano?: number; en?: number; hasta?: number; casaEn?: number; escudoEn?: number}> = ({x, y, tamano = 400, en = 0, hasta, casaEn = 0.1, escudoEn = 1.2}) => (
  <Dib x={x} y={y} tamano={tamano} en={en} hasta={hasta}>
    {(t) => {
      const c = useEntradaFija(t, casaEn);
      const q = Easing.out(Easing.cubic)(cl((t - escudoEn) / 0.7));
      const sh = 'M100 46 L160 64 V110 C160 144 128 168 100 182 C72 168 40 144 40 110 V64 Z';
      return (
        <g>
          <g opacity={Math.min(1, c)}><Casa x={100} y={74 + (1 - c) * 30} s={1.55} fill={C.mostaza} /></g>
          <clipPath id="escL"><rect x={0} y={0} width={100} height={200} /></clipPath>
          <clipPath id="escR"><rect x={100} y={0} width={100} height={200} /></clipPath>
          <g opacity={t >= escudoEn ? 1 : 0}>
            <g clipPath="url(#escL)" transform={`translate(${-70 * (1 - q)} 0)`}><path d={sh} fill={C.turquesa} {...sw} /></g>
            <g clipPath="url(#escR)" transform={`translate(${70 * (1 - q)} 0)`}><path d={sh} fill={C.turquesa} {...sw} /></g>
            <path d="M76 112 l18 18 l32 -38" fill="none" stroke={C.crema} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" opacity={cl((q - 0.7) / 0.3)} />
          </g>
        </g>
      );
    }}
  </Dib>
);

/** Contrato plano que se dobla y se vuelve a abrir en bucle, con flecha circular. */
export const ContratoBucle: React.FC<{x: number; y: number; tamano?: number; en?: number; hasta?: number}> = ({x, y, tamano = 360, en = 0, hasta}) => (
  <Dib x={x} y={y} tamano={tamano} en={en} hasta={hasta}>
    {(t) => {
      const f = 0.5 + 0.5 * Math.cos(t * 5.2);
      const sy = 0.3 + 0.7 * f;
      return (
        <g>
          <g transform={`rotate(${(t * 140) % 360} 100 100)`}>
            <path d="M100 8 A92 92 0 1 1 20 54" fill="none" stroke={C.piedra} strokeWidth={9} strokeLinecap="round" />
            <path d="M8 44 L22 58 L38 40" fill="none" stroke={C.piedra} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g transform={`translate(0 100) scale(1 ${sy}) translate(0 -100)`}>
            <rect x={56} y={42} width={88} height={116} rx={8} fill={C.crema} {...sw} />
            <rect x={70} y={62} width={60} height={7} rx={3.5} fill={T} />
            <rect x={70} y={80} width={60} height={7} rx={3.5} fill={T} />
            <rect x={70} y={98} width={40} height={7} rx={3.5} fill={T} />
            <path d="M104 130 q10 -16 22 0" fill="none" stroke={C.turquesa} strokeWidth={6} strokeLinecap="round" />
          </g>
        </g>
      );
    }}
  </Dib>
);

/** Cadena "5 → 10 → 15 años" (mono 64 px), cada tramo entra en su segundo. */
export const CadenaAnios: React.FC<{y: number; pasos: [number, number, number]; hasta?: number; x?: number}> = ({y, pasos, hasta, x = 540}) => {
  const t = useT();
  const s = useSalida(hasta);
  const tr = (txt: string, i: number) => {
    const q = useEntradaFija(t, pasos[i]);
    return <span style={{display: 'inline-block', opacity: Math.min(1, q), transform: `translateY(${(1 - Math.min(1, q)) * 30}px)`, whiteSpace: 'pre'}}>{txt}</span>;
  };
  return (
    <div style={{position: 'absolute', left: x - 450, width: 900, top: y, textAlign: 'center', fontFamily: F.cifra, fontWeight: 700, fontSize: 80, color: T, opacity: s, lineHeight: 1.2}}>
      {tr('5', 0)}{tr(' → 10', 1)}{tr(' → 15 años', 2)}
    </div>
  );
};

/** Sobre con billetes planos y la cifra "12" (mono). */
export const SobreBilletes: React.FC<{x: number; y: number; tamano?: number; en?: number; hasta?: number; cifra?: string}> = ({x, y, tamano = 420, en = 0, hasta, cifra = '12'}) => (
  <Dib x={x} y={y} tamano={tamano} en={en} hasta={hasta}>
    {(t) => {
      const sale = Easing.out(Easing.cubic)(cl((t - en - 0.3) / 0.7));
      return (
        <g>
          {[0, 1].map((i) => (
            <g key={i} transform={`translate(${i * 14} ${-sale * (28 + i * 12)}) rotate(${-6 + i * 10} 70 90)`}>
              <rect x={30} y={60} width={84} height={50} rx={6} fill={C.turquesa} {...sw} strokeWidth={5} />
              <circle cx={72} cy={85} r={12} fill={C.crema} stroke={T} strokeWidth={4} />
            </g>
          ))}
          <rect x={10} y={84} width={124} height={80} rx={8} fill={C.crema} {...sw} />
          <path d="M10 88 L72 132 L134 88" fill="none" {...sw} strokeWidth={6} />
          <text x={166} y={134} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={58} fill={T} opacity={cl((t - 0.5) / 0.3)}>{cifra}</text>
        </g>
      );
    }}
  </Dib>
);

/** Contrato que llega a su fecha de fin (barra que se llena) y una etiqueta de precio salta. */
export const ContratoFin: React.FC<{x: number; y: number; tamano?: number; en?: number; hasta?: number; finEn?: number; saltaEn?: number}> = ({x, y, tamano = 400, en = 0, hasta, finEn = 1.2, saltaEn = 1.4}) => (
  <Dib x={x} y={y} tamano={tamano} en={en} hasta={hasta}>
    {(t) => {
      const b = cl((t - en - 0.2) / (finEn - en - 0.2));
      const j = Easing.out(Easing.back(2.5))(cl((t - saltaEn) / 0.45));
      return (
        <g>
          <rect x={20} y={30} width={96} height={124} rx={8} fill={C.crema} {...sw} />
          <rect x={34} y={50} width={68} height={7} rx={3.5} fill={T} />
          <rect x={34} y={68} width={68} height={7} rx={3.5} fill={T} />
          <rect x={34} y={86} width={44} height={7} rx={3.5} fill={T} />
          <rect x={30} y={168} width={160} height={14} rx={7} fill={C.crema} {...sw} strokeWidth={5} />
          <rect x={30} y={168} width={160 * b} height={14} rx={7} fill={C.mostaza} {...sw} strokeWidth={5} />
          <path d="M190 166 v-18 l14 6 l-14 6" fill={T} stroke={T} strokeWidth={4} strokeLinejoin="round" />
          <g transform={`translate(${t >= saltaEn ? 150 : 150} ${130 - j * 80}) rotate(${-8 + 12 * Math.sin(t * 6)})`} opacity={t >= saltaEn ? 1 : 0}>
            <path d="M-26 -20 h38 l20 20 l-20 20 h-38 z" fill={C.mostaza} {...sw} strokeWidth={5} />
            <circle cx={-14} cy={0} r={4} fill={T} />
            <text x={2} y={9} fontFamily={F.cifra} fontWeight={700} fontSize={24} fill={T}>€</text>
          </g>
          <path d="M150 38 v-26 m-11 11 l11 -12 l11 12" fill="none" stroke={T} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={cl((t - saltaEn - 0.3) / 0.3)} />
        </g>
      );
    }}
  </Dib>
);

/** Casa con puerta y flecha hacia otra casa (alternativa). */
export const CasasAlternativa: React.FC<{x: number; y: number; tamano?: number; en?: number; hasta?: number; puertaEn?: number; flechaEn?: number}> = ({x, y, tamano = 460, en = 0, hasta, puertaEn = 0.4, flechaEn = 0.9}) => (
  <Dib x={x} y={y} tamano={tamano} en={en} hasta={hasta}>
    {(t) => {
      const p = Easing.out(Easing.cubic)(cl((t - puertaEn) / 0.4));
      const f = Easing.out(Easing.cubic)(cl((t - flechaEn) / 0.7));
      const h2 = useEntradaFija(t, flechaEn + 0.5);
      return (
        <g>
          <Casa x={42} y={96} s={0.8} fill={C.piedra} puertaAbre={p} />
          <path d="M84 110 H150" fill="none" stroke={T} strokeWidth={9} strokeLinecap="round" strokeDasharray={66} strokeDashoffset={66 * (1 - f)} />
          <path d="M138 96 L152 110 L138 124" fill="none" stroke={T} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={f > 0.9 ? 1 : 0} />
          <g opacity={Math.min(1, h2)}><Casa x={172} y={96} s={0.55 * (0.7 + 0.3 * Math.min(1, h2))} fill={C.mostaza} /></g>
        </g>
      );
    }}
  </Dib>
);

/** Urna plana con una o dos ranuras (neutra, sin colores de partido). */
export const Urna2: React.FC<{x: number; y: number; tamano?: number; en?: number; hasta?: number; ranuras?: 1 | 2}> = ({x, y, tamano = 220, en = 0, hasta, ranuras = 2}) => (
  <Dib x={x} y={y} tamano={tamano} en={en} hasta={hasta}>
    {() => (
      <g>
        <rect x={24} y={70} width={152} height={112} rx={14} fill={C.piedra} {...sw} />
        <rect x={44} y={112} width={112} height={50} rx={8} fill={C.crema} opacity={0.9} />
        {ranuras === 2 ? (
          <>
            <rect x={38} y={56} width={50} height={16} rx={8} fill={T} />
            <rect x={112} y={56} width={50} height={16} rx={8} fill={T} />
          </>
        ) : <rect x={64} y={56} width={72} height={16} rx={8} fill={T} />}
      </g>
    )}
  </Dib>
);

/** Contador "0 días" en mono grande. */
export const CuentaCero: React.FC<{y: number; en?: number; hasta?: number; texto?: string; tamano?: number}> = ({y, en = 0, hasta, texto = '0 días', tamano = 190}) => {
  const t = useT();
  const s = useSalida(hasta);
  const q = useEntradaFija(t, en);
  return (
    <div style={{position: 'absolute', left: 60, width: 900, top: y, textAlign: 'center', fontFamily: F.cifra, fontWeight: 700, fontSize: tamano, lineHeight: 1.1, color: T, opacity: Math.min(1, q) * s, transform: `scale(${0.6 + 0.4 * q})`}}>{texto}</div>
  );
};

export const REGISTRO_005: Record<string, React.FC<any>> = {
  llaveV: LlaveV,
  cerraduraV: CerraduraV,
  fechasV: FechasV,
  corchete: Corchete,
  votosDecretos: VotosDecretos,
  tarjetaCita: TarjetaCita,
  pildoras: Pildoras,
  bocadillo: Bocadillo,
  pildora: Pildora,
  reciboTecho: ReciboTecho,
  calendarioMas: CalendarioMas,
  casaEscudo: CasaEscudo,
  contratoBucle: ContratoBucle,
  cadenaAnios: CadenaAnios,
  sobreBilletes: SobreBilletes,
  contratoFin: ContratoFin,
  casasAlternativa: CasasAlternativa,
  urna2: Urna2,
  cuentaCero: CuentaCero,
};
