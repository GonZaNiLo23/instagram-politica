import React from 'react';
import {interpolate, Easing, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {useEntrada, useSalida, miles} from './util';
import {Notas} from './Notas';

/**
 * Componentes propios de la pieza 002 (ley D'Hondt). Nombres con prefijo Dh para no tocar los compartidos.
 * Partidos ficticios identificados por la FORMA: circulo = tinta, triangulo = turquesa, cuadrado = gris piedra.
 * Todos los tiempos (en, hasta...) son segundos desde el inicio de la escena.
 */
export type TipoForma = 'circulo' | 'triangulo' | 'cuadrado';
const T = C.tinta;
const FORMAS: TipoForma[] = ['circulo', 'triangulo', 'cuadrado'];
const NOMBRES: Record<TipoForma, string> = {circulo: 'Círculo', triangulo: 'Triángulo', cuadrado: 'Cuadrado'};

const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};
const rampa = (t: number, a: number, b: number, easing: (x: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

export const Forma: React.FC<{tipo: TipoForma; tam: number}> = ({tipo, tam}) => (
  <svg width={tam} height={tam} viewBox="0 0 100 100" style={{overflow: 'visible', display: 'block'}}>
    {tipo === 'circulo' ? <circle cx="50" cy="50" r="42" fill={T} stroke={T} strokeWidth={6} /> : null}
    {tipo === 'triangulo' ? <path d="M50 10 L92 86 L8 86 Z" fill={C.turquesa} stroke={T} strokeWidth={6} strokeLinejoin="round" /> : null}
    {tipo === 'cuadrado' ? <rect x="12" y="12" width="76" height="76" rx="4" fill={C.piedra} stroke={T} strokeWidth={6} /> : null}
  </svg>
);

/** Etiqueta "EJEMPLO" (gris piedra, 40 px). Con `en` negativo está ya presente en el fotograma 0. */
export const DhEtiqueta: React.FC<{texto?: string; x?: number; y?: number; en?: number; hasta?: number; tinta?: boolean}> = ({texto = 'EJEMPLO', x = 690, y = 270, en = -0.4, hasta, tinta = false}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: F.texto, fontWeight: 700, fontSize: 40, letterSpacing: 2, color: tinta ? C.crema : T, background: tinta ? T : C.piedra, padding: '6px 22px', borderRadius: 12, opacity: Math.min(p, 1) * s, transform: `scale(${0.9 + 0.1 * Math.min(p, 1)})`}}>{texto}</div>
  );
};

/** Asiento de un mini-hemiciclo: aro vacío y, cuando se gana, disco mostaza con el icono del partido. */
const Asiento: React.FC<{x: number; y: number; d: number; forma?: TipoForma; enAro?: number; enLleno?: number}> = ({x, y, d, forma, enAro = 0, enLleno}) => {
  const a = useEntrada(enAro);
  const l = useEntrada(enLleno ?? 9999);
  const lleno = enLleno !== undefined;
  return (
    <div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, opacity: Math.min(a, 1), transform: `scale(${0.6 + 0.4 * Math.min(a, 1)})`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', boxSizing: 'border-box', border: `5px dashed ${T}`, background: C.crema}} />
      {lleno ? (
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: C.mostaza, border: `5px solid ${T}`, boxSizing: 'border-box', opacity: Math.min(l, 1), transform: `scale(${Math.min(l, 1.15)})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {forma ? <Forma tipo={forma} tam={d * 0.56} /> : null}
        </div>
      ) : null}
    </div>
  );
};

const arco = (i: number, n: number, cx: number, cy: number, rx: number, ry: number) => {
  const th = Math.PI * (1 - i / (n - 1));
  return {x: cx + rx * Math.cos(th), y: cy - ry * Math.sin(th)};
};

const Urna: React.FC<{t: number; tam: number}> = ({t, tam}) => {
  const ciclo = (t * 0.6) % 1;
  const papel = -46 + 62 * Easing.inOut(Easing.cubic)(Math.min(1, ciclo * 1.6));
  const alpha = ciclo > 0.7 ? 0 : 1;
  return (
    <svg viewBox="0 0 200 200" width={tam} height={tam} style={{overflow: 'visible', display: 'block'}}>
      <g opacity={alpha}>
        <rect x="74" y={14 + papel} width="52" height="58" rx="4" fill={C.crema} stroke={T} strokeWidth={6} />
        <rect x="84" y={26 + papel} width="32" height="6" rx="3" fill={T} />
        <rect x="84" y={40 + papel} width="22" height="6" rx="3" fill={T} />
      </g>
      <path d="M30 76 H170 V168 a10 10 0 0 1 -10 10 H40 a10 10 0 0 1 -10 -10 Z" fill={C.crema} stroke={T} strokeWidth={7} strokeLinejoin="round" />
      <rect x="18" y="56" width="164" height="26" rx="8" fill={T} />
      <rect x="68" y="64" width="64" height="10" rx="5" fill={C.crema} />
      <path d="M62 112 l14 16 l30 -34" fill="none" stroke={T} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={0.0} />
    </svg>
  );
};

/** Gancho animado: urna + cuadrado gris piedra, "14 %" que sube, mini-hemiciclo de 5 asientos sin cuadrado, "0" que se vuelve "÷".
 *  modo 'bucle' (cierre) y 'portada' (estado final, sin números). */
export const DhGancho: React.FC<{modo?: 'gancho' | 'bucle' | 'portada'; tAsientos?: number; tCero?: number; tDiv?: number; tSube?: number; tSubeFin?: number; hasta?: number}> = ({
  modo = 'gancho', tAsientos = 3.55, tCero = 4.0, tDiv = 6.2, tSube = 0.25, tSubeFin = 2.5, hasta,
}) => {
  const t = useT();
  const s = useSalida(hasta);
  const pU = useEntrada(modo === 'gancho' ? -0.4 : 0.1);
  const pS = useEntrada(modo === 'gancho' ? -0.2 : 0.35);
  const orden: TipoForma[] = ['circulo', 'triangulo', 'circulo', 'triangulo', 'circulo'];
  const mono = {fontFamily: F.cifra, fontWeight: 700, color: T, textAlign: 'center' as const, position: 'absolute' as const};
  // vibración del cuadrado en "no es un error"
  const vib = modo === 'gancho' && t > tCero + 1.1 && t < tDiv - 0.2 ? 5 * Math.sin(t * 22) : 0;
  if (modo === 'bucle') {
    const pulso = 1 + 0.06 * Math.sin(t * 5);
    return (
      <div style={{opacity: s}}>
        <div style={{...mono, left: 60, width: 900, top: 700, fontSize: 150, transform: `scale(${(0.8 + 0.2 * Math.min(pU, 1)) * pulso})`, opacity: Math.min(pU, 1)}}>14 % = 0</div>
        <div style={{position: 'absolute', left: 150, top: 930, width: 170, opacity: Math.min(pS, 1), transform: `scale(${0.6 + 0.4 * Math.min(pS, 1)}) rotate(${vib || 4 * Math.sin(t * 6)}deg)`}}><Forma tipo="cuadrado" tam={170} /></div>
        <div style={{position: 'absolute', left: 410, top: 900, opacity: Math.min(pU, 1), transform: `scale(${0.6 + 0.4 * Math.min(pU, 1)})`}}><Urna t={t} tam={260} /></div>
      </div>
    );
  }
  const portada = modo === 'portada';
  const cx = 720, cy = 1065;
  const dig = (n: number) => String(Math.round(n));
  const cuenta = interpolate(t, [tSube, tSubeFin], [0, 14], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const verCont = !portada && t < tCero - 0.1;
  const salCont = interpolate(t, [tCero - 0.3, tCero - 0.08], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pCero = useEntrada(tCero);
  const pDiv = useEntrada(tDiv);
  const ceroSale = interpolate(t, [tDiv - 0.05, tDiv + 0.2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{opacity: s}}>
      <div style={{position: 'absolute', left: 110, top: 800, width: 300, opacity: Math.min(pU, 1), transform: `scale(${0.7 + 0.3 * Math.min(pU, 1)})`}}><Urna t={t} tam={300} /></div>
      <div style={{position: 'absolute', left: 80, top: 750, width: 130, opacity: Math.min(pS, 1), transform: `translateX(${vib}px) scale(${0.6 + 0.4 * Math.min(pS, 1)})`}}><Forma tipo="cuadrado" tam={130} /></div>
      {verCont ? <div style={{...mono, left: 480, width: 480, top: 760, fontSize: 170, opacity: salCont}}>{dig(cuenta)} %</div> : null}
      {!portada ? <div style={{...mono, left: 480, width: 480, top: 745, fontSize: 200, opacity: Math.min(pCero, 1) * ceroSale, transform: `scale(${0.5 + 0.5 * Math.min(pCero, 1)})`}}>0</div> : null}
      {!portada ? <div style={{...mono, left: 480, width: 480, top: 760, fontSize: 200, opacity: Math.min(pDiv, 1), transform: `scale(${0.4 + 0.6 * Math.min(pDiv, 1)}) rotate(${(1 - Math.min(pDiv, 1)) * -90}deg)`}}>÷</div> : null}
      {orden.map((f, i) => {
        const p = arco(i, 5, cx, cy, 215, 95);
        return <Asiento key={i} x={p.x} y={p.y} d={72} forma={f} enAro={portada ? 0.1 : Math.max(0.05, tAsientos - 0.3)} enLleno={portada ? 0.2 + i * 0.1 : tAsientos + i * 0.18} />;
      })}
    </div>
  );
};

/** Pizarra con los tres partidos inventados (círculo, triángulo, cuadrado), con su nombre. */
export const DhPizarra: React.FC<{en?: number; hasta?: number}> = ({en = 0, hasta}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  return (
    <div style={{opacity: s}}>
      <div style={{position: 'absolute', left: 90, top: 520, width: 880, height: 520, boxSizing: 'border-box', borderRadius: 30, border: `10px solid ${T}`, background: '#FBF8F2', boxShadow: '0 14px 0 rgba(20,33,61,0.25)', opacity: Math.min(p, 1), transform: `scale(${0.92 + 0.08 * Math.min(p, 1)})`}} />
      {FORMAS.map((f, i) => <PizarraItem key={f} forma={f} x={270 + i * 270} en={en + 0.25 + i * 0.4} />)}
    </div>
  );
};
const PizarraItem: React.FC<{forma: TipoForma; x: number; en: number}> = ({forma, x, en}) => {
  const p = useEntrada(en);
  const t = useT();
  return (
    <div style={{position: 'absolute', left: x - 90, top: 590, width: 180, textAlign: 'center', opacity: Math.min(p, 1), transform: `translateY(${(1 - Math.min(p, 1)) * 40 + 4 * Math.sin(t * 3 + x)}px) scale(${0.6 + 0.4 * Math.min(p, 1)})`}}>
      <div style={{width: 160, margin: '0 auto'}}><Forma tipo={forma} tam={160} /></div>
      <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 52, color: T, marginTop: 36, whiteSpace: 'nowrap', marginLeft: -20, marginRight: -20}}>{NOMBRES[forma]}</div>
    </div>
  );
};

/** Silueta de provincia genérica (inventada, sin nombre). */
const PROV = 'M40 130 L100 50 L210 70 L290 22 L372 108 L345 214 L262 296 L140 318 L58 250 Z';
export const DhProvincia: React.FC<{x?: number; y?: number; tam?: number; numero: string; en?: number; hasta?: number; sub?: string}> = ({x = 540, y = 760, tam = 520, numero, en = 0, hasta, sub}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const t = useT();
  const k = Math.min(p, 1);
  return (
    <div style={{position: 'absolute', left: x - tam / 2, top: y - tam * 0.45, width: tam, opacity: k * s, transform: `scale(${0.7 + 0.3 * k}) rotate(${(1 - k) * -6}deg)`}}>
      <svg viewBox="0 0 400 340" width={tam} height={tam * 0.85} style={{overflow: 'visible', display: 'block'}}>
        <path d={PROV} fill="rgba(20,33,61,0.12)" stroke={T} strokeWidth={8} strokeLinejoin="round" />
        <text x="205" y="225" textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={tam * 0.42} fill={T} transform={`translate(0 ${Math.sin(t * 3) * 3})`}>{numero}</text>
      </svg>
      {sub ? <div style={{textAlign: 'center', fontFamily: F.texto, fontWeight: 700, fontSize: 64, color: T, marginTop: 6}}>{sub}</div> : null}
    </div>
  );
};

/** Fichas con icono y votos (no una frase). */
export const DhFichas: React.FC<{fichas: {forma: TipoForma; valor: number; enFicha: number; enValor: number}[]; y?: number; paso?: number; hasta?: number}> = ({fichas, y = 450, paso = 150, hasta}) => {
  const s = useSalida(hasta);
  return (
    <div style={{opacity: s}}>
      {fichas.map((f, i) => <Ficha key={i} {...f} y={y + i * paso} />)}
    </div>
  );
};
const Ficha: React.FC<{forma: TipoForma; valor: number; enFicha: number; enValor: number; y: number}> = ({forma, valor, enFicha, enValor, y}) => {
  const p = useEntrada(enFicha);
  const v = useEntrada(enValor);
  const k = Math.min(p, 1);
  return (
    <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: y - 60, height: 120, boxSizing: 'border-box', borderRadius: 24, border: `6px solid ${T}`, background: '#FBF8F2', display: 'flex', alignItems: 'center', padding: '0 28px', opacity: k, transform: `translateX(${(1 - k) * -120}px)`}}>
      <div style={{width: 80}}><Forma tipo={forma} tam={80} /></div>
      <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 56, color: T, marginLeft: 28, flex: 1}}>{NOMBRES[forma]}</div>
      <div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 72, color: T, fontVariantNumeric: 'tabular-nums', opacity: Math.min(v, 1), transform: `scale(${0.8 + 0.2 * Math.min(v, 1)})`, transformOrigin: 'right center'}}>{miles(valor)}</div>
    </div>
  );
};

// ---------------------------------------------------------------- Tabla de cocientes
const VOTOS = [100000, 80000, 30000];
const COL_X = [301, 564, 827];
const FILA_Y = [560, 650, 740, 830];
const CW = 256;
const CH = 80;
export type Luz = {col: number; row: number; en: number; orden: number};

/**
 * Tabla de cocientes: columnas = partidos (icono), filas = ÷1..÷4. Las 5 celdas mayores se iluminan en mostaza en el orden de la voz
 * y su icono "salta" a un mini-hemiciclo de 5 asientos. `sexta` marca la 6.ª (Cuadrado, 30.000) en gris piedra.
 * `estatico`: todo en su estado final desde el primer fotograma. `duelo`: solo quedan las celdas 30.000 y 33.333, que se agrandan.
 */
export const DhTabla: React.FC<{
  enCab?: number; enFilas?: number[]; luces: Luz[]; estatico?: boolean; hasta?: number;
  duelo?: {en: number; dur: number; flechaEn: number; resultadoEn: number}; sextaEn?: number;
}> = ({enCab = 0, enFilas = [0.5, 1, 1.5, 2], luces, estatico = false, hasta, duelo, sextaEn}) => {
  const t = useT();
  const s = useSalida(hasta);
  const dEn = duelo ? rampa(t, duelo.en, duelo.en + duelo.dur, Easing.inOut(Easing.cubic)) : 0;
  const resto = 1 - rampa(t, duelo?.en ?? 9999, (duelo?.en ?? 9999) + 0.4);
  const lucesF = estatico ? luces.map((l) => ({...l, en: -5})) : luces;
  const luzDe = (c: number, r: number) => lucesF.find((l) => l.col === c && l.row === r);
  const pCab = useEntrada(estatico ? -5 : enCab);
  const pFilas = [useEntrada(estatico ? -5 : enFilas[0]), useEntrada(estatico ? -5 : enFilas[1]), useEntrada(estatico ? -5 : enFilas[2]), useEntrada(estatico ? -5 : enFilas[3])];
  const asientos = [...lucesF].sort((a, b) => a.orden - b.orden);
  const orden: TipoForma[] = asientos.map((l) => FORMAS[l.col]);
  const celda = (c: number, r: number) => {
    const v = VOTOS[c] / (r + 1);
    const luz = luzDe(c, r);
    const esSexta = c === 2 && r === 0;
    const enLuz = luz ? rampa(t, luz.en, luz.en + 0.25) : 0;
    const enSexta = esSexta ? rampa(t, estatico ? -5 : sextaEn ?? 9999, (estatico ? -5 : sextaEn ?? 9999) + 0.3) : 0;
    const foco = duelo && ((c === 2 && r === 0) || (c === 0 && r === 2));
    const k = Math.min(pFilas[r], 1);
    // posición/escala en el duelo
    const tx = foco ? (c === 2 ? 300 : 760) : 0;
    const ty = 640;
    const x = foco ? COL_X[c] + (tx - COL_X[c]) * dEn : COL_X[c];
    const y = foco ? FILA_Y[r] + (ty - FILA_Y[r]) * dEn : FILA_Y[r];
    const esc = foco ? 1 + 0.3 * dEn : 1;
    const op = (foco ? 1 : resto) * k;
    const fondoFinal = luz ? `rgba(242,177,52,${enLuz})` : null;
    const parpadeo = foco && c === 2 && dEn > 0.9 ? (Math.floor(t / 0.35) % 2 === 0 ? 1 : 0.15) : 0;
    return (
      <div key={`${c}-${r}`} style={{position: 'absolute', left: x - CW / 2, top: y - CH / 2, width: CW, height: CH, opacity: op, transform: `scale(${esc})`, transformOrigin: 'center center'}}>
        <div style={{position: 'absolute', inset: 0, boxSizing: 'border-box', borderRadius: 18, border: `5px solid ${T}`, background: '#FBF8F2'}} />
        {esSexta ? <div style={{position: 'absolute', inset: 0, boxSizing: 'border-box', borderRadius: 18, border: `5px solid ${T}`, background: C.piedra, opacity: enSexta}} /> : null}
        {fondoFinal ? <div style={{position: 'absolute', inset: 0, borderRadius: 18, background: fondoFinal, border: `5px solid ${T}`, boxSizing: 'border-box'}} /> : null}
        {parpadeo > 0 ? <div style={{position: 'absolute', inset: -12, borderRadius: 26, border: `6px dashed ${T}`, opacity: parpadeo, boxSizing: 'border-box'}} /> : null}
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.texto, fontWeight: 800, fontSize: 60, color: T, fontVariantNumeric: 'tabular-nums', letterSpacing: -2}}>{miles(Math.round(v))}</div>
        {luz && !duelo ? (
          <div style={{position: 'absolute', left: -14, top: -22, width: 40, height: 40, borderRadius: 20, background: T, color: C.crema, fontFamily: F.texto, fontWeight: 800, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: enLuz}}>{luz.orden + 1}</div>
        ) : null}
        {foco && dEn > 0.6 ? (
          <div style={{position: 'absolute', left: CW / 2 - 36, top: -62, width: 72, height: 72, borderRadius: 36, background: C.crema, border: `5px solid ${T}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Forma tipo={FORMAS[c]} tam={44} /></div>
        ) : null}
      </div>
    );
  };
  const celdas: React.ReactNode[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) celdas.push(celda(c, r));
  const semanaVuelo = (l: Luz, i: number) => {
    const dur = 0.55;
    const a = l.en + 0.15;
    const q = rampa(t, a, a + dur, Easing.inOut(Easing.cubic));
    const sx = COL_X[l.col], sy = FILA_Y[l.row];
    const dest = arco(i, 5, 540, 1050, 300, 100);
    const x = sx + (dest.x - sx) * q;
    const y = sy + (dest.y - sy) * q - 90 * Math.sin(Math.PI * q);
    if (q <= 0 || q >= 1) return null;
    return <div key={`v${i}`} style={{position: 'absolute', left: x - 30, top: y - 30, width: 60, height: 60}}><Forma tipo={FORMAS[l.col]} tam={60} /></div>;
  };
  const resta = duelo ? 1 - rampa(t, duelo.en, duelo.en + 0.4) : 1;
  return (
    <div style={{opacity: s}}>
      {/* cabecera con iconos */}
      {COL_X.map((x, c) => (
        <div key={c} style={{position: 'absolute', left: x - 40, top: 425, width: 80, opacity: Math.min(pCab, 1) * (duelo ? resto : 1), transform: `scale(${0.6 + 0.4 * Math.min(pCab, 1)})`}}><Forma tipo={FORMAS[c]} tam={80} /></div>
      ))}
      {/* etiquetas de fila ÷1..÷4 */}
      {FILA_Y.map((y, r) => (
        <div key={r} style={{position: 'absolute', left: 52, top: y - 40, width: 110, textAlign: 'center', lineHeight: '80px', fontFamily: F.texto, fontWeight: 800, fontSize: 64, color: T, opacity: Math.min(pFilas[r], 1) * (duelo ? resto : 1)}}>÷{r + 1}</div>
      ))}
      {celdas}
      {/* mini-hemiciclo de 5 asientos */}
      <div style={{opacity: estatico ? resta : 1}}>
        {Array.from({length: 5}, (_, i) => {
          const p = arco(i, 5, 540, 1050, 300, 100);
          const l = asientos[i];
          return <Asiento key={i} x={p.x} y={p.y} d={84} forma={orden[i]} enAro={estatico ? -5 : enFilas[3]} enLleno={l ? l.en + 0.15 + 0.55 : undefined} />;
        })}
        {asientos.map((l, i) => semanaVuelo(l, i))}
      </div>
      {duelo ? <Duelo duelo={duelo} /> : null}
    </div>
  );
};

const Duelo: React.FC<{duelo: {en: number; dur: number; flechaEn: number; resultadoEn: number}}> = ({duelo}) => {
  const t = useT();
  const pEt = useEntrada(duelo.en + duelo.dur);
  const pRes = useEntrada(duelo.resultadoEn);
  const fl = rampa(t, duelo.flechaEn, duelo.flechaEn + 0.6, Easing.inOut(Easing.cubic));
  return (
    <>
      <div style={{position: 'absolute', left: 140, width: 320, top: 718, textAlign: 'center', fontFamily: F.texto, fontWeight: 700, fontSize: 52, color: T, opacity: Math.min(pEt, 1)}}>6.º · fuera</div>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
        <path d="M300 790 L300 888" stroke={T} strokeWidth={9} strokeLinecap="round" strokeDasharray={98} strokeDashoffset={98 * (1 - fl)} fill="none" />
        <path d="M278 866 L300 892 L322 866" stroke={T} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={fl > 0.8 ? 1 : 0} />
      </svg>
      <div style={{position: 'absolute', left: 340, top: 800, fontFamily: F.texto, fontWeight: 800, fontSize: 64, color: T, opacity: Math.min(fl * 2, 1)}}>+3.334 votos</div>
      <div style={{position: 'absolute', left: 90, width: 810, top: 925, height: 120, boxSizing: 'border-box', borderRadius: 24, border: `6px solid ${T}`, background: C.mostaza, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.texto, fontWeight: 800, fontSize: 80, color: T, fontVariantNumeric: 'tabular-nums', opacity: Math.min(pRes, 1), transform: `scale(${0.85 + 0.15 * Math.min(pRes, 1)})`}}>33.334 &gt; 33.333</div>
    </>
  );
};

// ---------------------------------------------------------------- Barras votos vs escaños
export type FilaBarras = {forma: TipoForma; votos: number; escanos: number; enV: number; enE: number};
/** Barras horizontales (eje desde 0, escala 0-100 %): por partido, % de votos (piedra) y % de escaños (mostaza = escaños ganados). */
export const DhBarras: React.FC<{filas: FilaBarras[]; y?: number; enIconos?: number; hasta?: number}> = ({filas, y = 620, enIconos = 0.2, hasta}) => {
  const s = useSalida(hasta);
  const X0 = 200;
  const ESC = 5.4; // px por 1 %
  return (
    <div style={{opacity: s}}>
      <div style={{position: 'absolute', left: X0 - 3, top: y - 10, width: 6, height: filas.length * 170 - 36, background: T, borderRadius: 3}} />
      {filas.map((f, i) => <FilaB key={i} f={f} y={y + i * 170} X0={X0} ESC={ESC} enIcono={enIconos + i * 0.2} />)}
    </div>
  );
};
const FilaB: React.FC<{f: FilaBarras; y: number; X0: number; ESC: number; enIcono: number}> = ({f, y, X0, ESC, enIcono}) => {
  const t = useT();
  const pI = useEntrada(enIcono);
  const kV = rampa(t, f.enV, f.enV + 0.8);
  const kE = rampa(t, f.enE, f.enE + 0.8);
  const pEt = useEntrada(f.enE + 0.8);
  const pEv = useEntrada(f.enV + 0.8);
  const alto = 58;
  const lab = (n: string, palabra: string) => (
    <span><span style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 64, color: T}}>{n}</span><span style={{fontFamily: F.texto, fontWeight: 700, fontSize: 44, color: T, marginLeft: 10}}>{palabra}</span></span>
  );
  return (
    <>
      <div style={{position: 'absolute', left: 60, top: y + 14, width: 100, opacity: Math.min(pI, 1), transform: `scale(${0.6 + 0.4 * Math.min(pI, 1)})`}}><Forma tipo={f.forma} tam={100} /></div>
      <div style={{position: 'absolute', left: X0, top: y, height: alto, width: f.votos * ESC * kV, background: C.piedra, border: `5px solid ${T}`, borderLeft: 'none', boxSizing: 'border-box', borderRadius: '0 12px 12px 0', display: kV > 0.02 ? 'block' : 'none'}} />
      <div style={{position: 'absolute', left: X0 + f.votos * ESC * kV + 18, top: y - 8, whiteSpace: 'nowrap', opacity: Math.min(pEv, 1)}}>{lab(`${f.votos} %`, 'votos')}</div>
      <div style={{position: 'absolute', left: X0, top: y + alto + 10, height: alto, width: f.escanos * ESC * kE, background: C.mostaza, border: `5px solid ${T}`, borderLeft: 'none', boxSizing: 'border-box', borderRadius: '0 12px 12px 0', display: f.escanos * kE > 0.5 ? 'block' : 'none'}} />
      <div style={{position: 'absolute', left: X0 + f.escanos * ESC * kE + 18, top: y + alto + 2, whiteSpace: 'nowrap', opacity: Math.min(pEt, 1)}}>{lab(`${f.escanos} %`, 'escaños')}</div>
    </>
  );
};

// ---------------------------------------------------------------- Dos provincias (5 vs 30 escaños)
export const DhDosProvincias: React.FC<{enPeq?: number; enPeqEt?: number; enGra?: number; enGraEt?: number; hasta?: number}> = ({enPeq = 0.1, enPeqEt = 1.5, enGra = 2.4, enGraEt = 3.2, hasta}) => {
  const s = useSalida(hasta);
  return (
    <div style={{opacity: s}}>
      <Bloque x={270} tam={380} n={5} numero="5" en={enPeq} enEt={99} etiqueta={[]} />
      <Bloque x={720} tam={380} n={30} numero="30" en={enGra} enEt={99} etiqueta={[]} />
      <FlechaSalto en={enGraEt} />
      <div style={{position: 'absolute', left: 539, top: 500, width: 4, height: 540, background: T, opacity: 0.25, borderRadius: 2}} />
    </div>
  );
};
const FlechaSalto: React.FC<{en: number}> = ({en}) => {
  const f = Math.min(useEntrada(en), 1);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920} viewBox="0 0 1080 1920" fill="none">
      <path d="M700 1010 L330 1010" stroke={T} strokeWidth={16} strokeLinecap="round" strokeDasharray={370} strokeDashoffset={370 * (1 - f)} />
      <path d="M375 965 L322 1010 L375 1055" stroke={T} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" opacity={f > 0.85 ? 1 : 0} />
    </svg>
  );
};
const Bloque: React.FC<{x: number; tam: number; n: number; numero: string; en: number; enEt: number; etiqueta: string[]}> = ({x, tam, n, numero, en, enEt, etiqueta}) => {
  const p = useEntrada(en + 0.35);
  const e = useEntrada(enEt);
  const t = useT();
  const ancho = 390;
  const w = ancho / n;
  const pe = Math.min(e, 1);
  return (
    <>
      <DhProvincia x={x} y={670} tam={tam} numero={numero} en={en} />
      <div style={{position: 'absolute', left: x - ancho / 2, top: 860, width: ancho, height: 70, display: 'flex', opacity: Math.min(p, 1), gap: n > 10 ? 2 : 6}}>
        {Array.from({length: n}, (_, i) => {
          const marcado = i === 0 && enEt < 99;
          return <div key={i} style={{flex: 1, boxSizing: 'border-box', border: `${n > 10 ? 3 : 5}px solid ${T}`, borderRadius: n > 10 ? 4 : 8, background: marcado && t > enEt ? C.mostaza : '#FBF8F2', transform: marcado && t > enEt ? `scaleY(${1 + 0.25 * Math.sin(Math.min(1, (t - enEt) * 3) * Math.PI)})` : undefined}} />;
        })}
      </div>
      <div style={{position: 'absolute', left: x - 200, width: 400, top: 950, textAlign: 'center', fontFamily: F.texto, fontWeight: 800, fontSize: 64, lineHeight: 1.1, color: T, opacity: pe, transform: `translateY(${(1 - pe) * 24}px)`}}>
        {etiqueta.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </>
  );
};

// ---------------------------------------------------------------- Mapa de España con 2 puntos por provincia
const LON0 = -9.7, LAT1 = 44.0, COSL = Math.cos((40 * Math.PI) / 180);
const ESPANA: [number, number][] = [
  [-7.7, 43.75], [-5.8, 43.65], [-3.8, 43.45], [-1.8, 43.4], [-1.5, 43.0], [0.0, 42.7], [1.4, 42.7], [3.2, 42.4], [3.1, 41.85], [2.2, 41.3], [0.9, 41.0],
  [0.7, 40.7], [0.0, 39.8], [-0.3, 39.3], [0.2, 38.8], [-0.4, 38.3], [-0.7, 37.6], [-1.6, 37.0], [-2.2, 36.7], [-3.5, 36.7], [-4.4, 36.7], [-5.35, 36.1],
  [-6.3, 36.5], [-6.9, 37.2], [-7.4, 37.2], [-7.5, 38.2], [-7.0, 39.0], [-7.3, 39.7], [-6.9, 40.3], [-6.9, 41.0], [-6.2, 41.6], [-6.9, 41.95], [-8.2, 42.0],
  [-8.85, 41.9], [-8.9, 42.6], [-9.3, 43.05], [-8.7, 43.4], [-8.0, 43.7],
];
// 50 provincias (centro aproximado). Ceuta y Melilla (1 punto cada una) aparte. Canarias: recuadro propio.
const PROVINCIAS: [string, number, number][] = [
  ['A Coruña', -8.4, 43.1], ['Lugo', -7.5, 43.0], ['Ourense', -7.6, 42.3], ['Pontevedra', -8.5, 42.4], ['Asturias', -5.9, 43.3], ['Cantabria', -4.0, 43.2],
  ['Bizkaia', -2.9, 43.25], ['Gipuzkoa', -2.1, 43.15], ['Araba', -2.7, 42.8], ['Navarra', -1.6, 42.7], ['La Rioja', -2.45, 42.3], ['Huesca', -0.3, 42.1],
  ['Zaragoza', -0.9, 41.5], ['Teruel', -1.1, 40.4], ['Lleida', 0.9, 41.8], ['Girona', 2.7, 42.1], ['Barcelona', 1.9, 41.6], ['Tarragona', 0.9, 41.1],
  ['Castellón', -0.1, 40.2], ['Valencia', -0.9, 39.4], ['Alicante', -0.6, 38.5], ['Murcia', -1.5, 38.0], ['Albacete', -1.9, 39.0], ['Cuenca', -2.2, 40.1],
  ['Guadalajara', -2.9, 40.7], ['Madrid', -3.7, 40.4], ['Toledo', -4.2, 39.8], ['Ciudad Real', -3.9, 38.9], ['Badajoz', -6.3, 38.8], ['Cáceres', -6.2, 39.6],
  ['Huelva', -6.8, 37.6], ['Sevilla', -5.8, 37.4], ['Cádiz', -5.9, 36.6], ['Málaga', -4.5, 36.9], ['Córdoba', -4.8, 37.9], ['Jaén', -3.8, 37.8],
  ['Granada', -3.4, 37.2], ['Almería', -2.4, 37.1], ['Salamanca', -5.8, 40.9], ['Zamora', -5.8, 41.6], ['Valladolid', -4.7, 41.6], ['León', -5.7, 42.6],
  ['Palencia', -4.5, 42.2], ['Burgos', -3.7, 42.3], ['Soria', -2.5, 41.7], ['Segovia', -4.1, 41.0], ['Ávila', -4.8, 40.6],
  ['Illes Balears', 2.9, 39.6], ['Las Palmas', -8.8, 35.7], ['Santa Cruz de Tenerife', -7.4, 35.55],
];
const CEUTA_MELILLA: [string, number, number][] = [['Ceuta', -5.3, 35.9], ['Melilla', -2.95, 35.3]];

/**
 * Mapa de España (silueta suave) con 50 provincias: aros vacíos que aparecen en cascada y, en `enPuntos`, 2 puntos por provincia a la vez.
 * Ceuta y Melilla reciben 1 punto cada una (LOREG art. 162.2). Canarias y Baleares, en recuadro/isla simplificados.
 */
export const DhMapaMinimo: React.FC<{x?: number; y?: number; ancho?: number; enMapa?: number; enAros?: number; enPuntos?: number; hasta?: number}> = ({x = 500, y = 440, ancho = 780, enMapa = 0.1, enAros = 0.6, enPuntos = 4.8, hasta}) => {
  const t = useT();
  const s = useSalida(hasta);
  const k = ancho / ((3.6 + 9.7) * COSL);
  const alto = (LAT1 - 35.0) * k;
  const px = (lon: number, lat: number): [number, number] => [(lon - LON0) * COSL * k, (LAT1 - lat) * k];
  const poly = ESPANA.map(([lo, la]) => px(lo, la).join(',')).join(' ');
  const pM = useEntrada(enMapa);
  const flash = rampa(t, enPuntos, enPuntos + 0.15) * (1 - rampa(t, enPuntos + 0.15, enPuntos + 0.75));
  const pop = rampa(t, enPuntos, enPuntos + 0.35, Easing.out(Easing.back(2.4)));
  const [bx, by] = px(-9.5, 36.45), [bx2, by2] = px(-6.0, 35.1);
  const orden = [...PROVINCIAS].map((p, i) => ({p, i})).sort((a, b) => a.p[1] - b.p[1]);
  const r = 9;
  return (
    <div style={{position: 'absolute', left: x - ancho / 2, top: y, width: ancho, height: alto, opacity: s, transform: `scale(${0.94 + 0.06 * Math.min(pM, 1)})`}}>
      <svg width={ancho} height={alto} style={{overflow: 'visible'}}>
        <polygon points={poly} fill="rgba(20,33,61,0.10)" stroke="rgba(20,33,61,0.35)" strokeWidth={5} strokeLinejoin="round" opacity={Math.min(pM, 1)} />
        <rect x={bx} y={by} width={bx2 - bx} height={by2 - by} rx={10} fill="none" stroke="rgba(20,33,61,0.35)" strokeWidth={4} strokeDasharray="10 8" opacity={Math.min(pM, 1)} />
        {orden.map(({p, i}, j) => {
          const [cx, cy] = px(p[1], p[2]);
          const aro = rampa(t, enAros + (j / orden.length) * 3.2, enAros + (j / orden.length) * 3.2 + 0.3);
          return (
            <g key={p[0]}>
              <circle cx={cx} cy={cy} r={r + 5} fill="none" stroke={T} strokeWidth={3} opacity={0.55 * aro * (1 - pop)} />
              {pop > 0 ? (
                <>
                  <circle cx={cx - r - 1} cy={cy} r={r * pop} fill={flash > 0.05 ? C.mostaza : T} stroke={T} strokeWidth={3} />
                  <circle cx={cx + r + 1} cy={cy} r={r * pop} fill={flash > 0.05 ? C.mostaza : T} stroke={T} strokeWidth={3} />
                </>
              ) : null}
            </g>
          );
        })}
        {CEUTA_MELILLA.map(([n, lo, la], j) => {
          const [cx, cy] = px(lo, la);
          const aro = rampa(t, enAros + 3.0 + j * 0.2, enAros + 3.3 + j * 0.2);
          return (
            <g key={n}>
              <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={T} strokeWidth={3} opacity={0.55 * aro * (1 - pop)} />
              {pop > 0 ? <circle cx={cx} cy={cy} r={r * pop} fill={flash > 0.05 ? C.mostaza : T} stroke={T} strokeWidth={3} /> : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------- Retrato ovalado con bandera belga
export const DhOvalo: React.FC<{src: string; x?: number; y?: number; ancho?: number; alto?: number; en?: number; hasta?: number; dur?: number; bandera?: boolean}> = ({src, x = 460, y = 830, ancho = 340, alto = 450, en = 0, hasta, dur = 3, bandera = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = useEntrada(en);
  const sal = useSalida(hasta);
  const pB = useEntrada(en + 0.5);
  const k = interpolate(frame, [en * fps, (en + dur) * fps], [1.0, 1.1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <div style={{position: 'absolute', left: x - ancho / 2, top: y - alto / 2, width: ancho, height: alto, borderRadius: '50%', overflow: 'hidden', boxSizing: 'border-box', border: `12px solid ${C.mostaza}`, boxShadow: '0 14px 0 rgba(20,33,61,0.25)', background: C.piedra, opacity: Math.min(p, 1) * sal, transform: `scale(${0.92 + 0.08 * Math.min(p, 1)})`}}>
        <Img src={staticFile(`imagenes/${src}`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${k})`}} />
      </div>
      {bandera ? (
        <div style={{position: 'absolute', left: x + ancho / 2 + 40, top: y - 55, width: 180, height: 120, opacity: Math.min(pB, 1) * sal, transform: `translateY(${(1 - Math.min(pB, 1)) * 30}px)`}}>
          <svg viewBox="0 0 30 20" width={180} height={120} style={{display: 'block', borderRadius: 8, boxShadow: '0 8px 0 rgba(20,33,61,0.25)'}}>
            <rect width="10" height="20" fill="#000000" /><rect x="10" width="10" height="20" fill="#FAE042" /><rect x="20" width="10" height="20" fill="#ED2939" />
            <rect width="30" height="20" fill="none" stroke={T} strokeWidth="0.5" />
          </svg>
        </div>
      ) : null}
    </>
  );
};

export const DhNota: React.FC<{lineas: string[]; en?: number; hasta?: number}> = (p) => <Notas {...p} />;

export const REGISTRO_002: Record<string, React.FC<any>> = {
  dhEtiqueta: DhEtiqueta,
  dhGancho: DhGancho,
  dhPizarra: DhPizarra,
  dhProvincia: DhProvincia,
  dhFichas: DhFichas,
  dhTabla: DhTabla,
  dhBarras: DhBarras,
  dhDosProvincias: DhDosProvincias,
  dhMapaMinimo: DhMapaMinimo,
  dhOvalo: DhOvalo,
  dhNota: DhNota,
};
