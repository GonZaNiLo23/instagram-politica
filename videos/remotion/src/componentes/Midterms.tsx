import React, {useMemo} from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useSalida} from './util';
import {puntosHemiciclo} from './Hemiciclo';

// Pieza 017 (midterms EE. UU.). Todo SVG plano. Tiempos `en`/`hasta` en segundos desde el inicio de la ESCENA.
export const AZUL = '#2F6FB5';
export const ROJO = '#D6322E';
const GRIS = '#B4BBC8';

const usa = () => {
  const fr = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {fr, fps, t: fr / fps};
};
const cl = (x: number) => Math.min(1, Math.max(0, x));
const muelle = (fr: number, fps: number, en: number, damping = 10) => spring({frame: fr - Math.round(en * fps), fps, config: {damping, stiffness: 200, mass: 0.6}});
const ease = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});

type Tramo = {hasta: number; color: string; en: number; anillo?: boolean; hueco?: boolean; pop?: boolean};

/**
 * Hemiciclo de puntos (izquierda → derecha). `tramos`: cada uno cubre los puntos hasta el índice `hasta` (excl.) y se
 * colorea en `en` (antes, gris). `parpadeo`: n puntos repartidos con halo que late entre `desde` y `hasta`.
 * `linea`: raya radial entre el punto idx-1 y idx con etiqueta (mayoría). x = centro, y = base.
 */
export const HemiM: React.FC<{
  total?: number; filas?: number; x?: number; y?: number; radio?: number; punto?: number; en?: number; hasta?: number; ent?: number;
  tramos?: Tramo[]; parpadeo?: {n: number; desde: number; hasta?: number; fijo?: boolean}; linea?: {idx: number; en: number; etiqueta?: string; dy?: number};
  titulo?: string; yTitulo?: number; leyenda?: {en: number; items: {color: string; texto: string}[]; y: number};
}> = ({total = 100, filas = 5, x = 500, y = 1070, radio = 350, punto = 14, en = 0, hasta, ent = 1, tramos = [], parpadeo, linea, titulo, yTitulo = 650, leyenda}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const pts = useMemo(() => puntosHemiciclo(total, filas, radio), [total, filas, radio]);
  const bob = Math.sin(t * 2.2) * 4;
  const marcados = useMemo(() => {
    const set = new Set<number>();
    if (parpadeo) for (let k = 0; k < parpadeo.n; k++) set.add(Math.min(total - 1, Math.floor(((k + 0.5) * total) / parpadeo.n)));
    return set;
  }, [parpadeo?.n, total]);
  let lx = 0;
  let ly = 0;
  let ang = Math.PI / 2;
  if (linea) {
    const a = pts[Math.max(0, linea.idx - 1)].ang;
    const b = pts[Math.min(total - 1, linea.idx)].ang;
    ang = (a + b) / 2;
  }
  const pr = linea ? ease(t, linea.en, linea.en + 0.5) : 0;
  return (
    <div style={{opacity: s}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={`translate(${x} ${y + bob})`}>
          {pts.map((p, i) => {
            const e = en + (i / total) * ent;
            const k = cl((t - e) / 0.25);
            const tr = tramos.find((q, j) => i < q.hasta && (j === 0 || i >= tramos[j - 1].hasta));
            const coloreado = tr && t >= tr.en;
            const col = coloreado ? tr!.color : GRIS;
            const pop = coloreado && tr!.pop ? 1 + 0.5 * Math.exp(-(t - tr!.en) * 5) * Math.abs(Math.cos((t - tr!.en) * 9)) : 1;
            const par = parpadeo && marcados.has(i) && t >= parpadeo.desde && (parpadeo.hasta === undefined || t <= parpadeo.hasta);
            const lat = par ? (parpadeo!.fijo ? 1 : 0.5 + 0.5 * Math.sin((t - parpadeo!.desde) * 7 + i)) : 0;
            const hueco = coloreado && tr!.hueco;
            return (
              <g key={i} transform={`translate(${p.x} ${p.y}) scale(${k * pop})`}>
                {par ? <circle r={punto * (parpadeo!.fijo ? 0.95 : 0.95 + 0.5 * lat)} fill="none" stroke={parpadeo!.fijo ? C.tinta : C.mostaza} strokeWidth={parpadeo!.fijo ? 5 : 4} opacity={parpadeo!.fijo ? cl((t - parpadeo!.desde) / 0.3) : 0.4 + 0.6 * lat} /> : null}
                <circle r={punto * 0.5} fill={hueco ? C.crema : col} stroke={hueco ? C.tinta : coloreado && tr!.anillo ? C.tinta : 'none'} strokeWidth={hueco ? 2.5 : 3} strokeDasharray={hueco ? '3 3' : undefined} />
              </g>
            );
          })}
          {linea ? (() => {
            lx = Math.cos(ang);
            ly = -Math.sin(ang);
            const r1 = radio * 0.3;
            const r2 = (radio + 40) * pr + r1 * (1 - pr);
            return (
              <g>
                <line x1={r1 * lx} y1={r1 * ly} x2={r2 * lx} y2={r2 * ly} stroke={C.tinta} strokeWidth={5} strokeDasharray="12 9" strokeLinecap="round" />
                {linea.etiqueta ? (
                  <text x={0} y={-radio * 0.12 + (linea.dy ?? 0)} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={90} fill={C.tinta} opacity={pr}>{linea.etiqueta}</text>
                ) : null}
              </g>
            );
          })() : null}
        </g>
        {titulo ? <text x={x} y={yTitulo} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={44} fill={C.tinta}>{titulo}</text> : null}
        {leyenda ? (
          <g opacity={cl((t - leyenda.en) / 0.3)}>
            {leyenda.items.map((it, i) => {
              const n = leyenda.items.length;
              const cx = x - 400 + (800 / n) * i + 20;
              return (
                <g key={i}>
                  <circle cx={cx + 20} cy={leyenda.y} r={16} fill={it.color} stroke={C.tinta} strokeWidth={3} />
                  <text x={cx + 48} y={leyenda.y + 14} fontFamily={F.texto} fontWeight={700} fontSize={40} fill={C.tinta}>{it.texto}</text>
                </g>
              );
            })}
          </g>
        ) : null}
      </svg>
    </div>
  );
};

/** Suma "47 + 4 = 51" a lo ancho (monoespaciada). */
export const SumaM: React.FC<{x?: number; y?: number; en?: number; sumaEn?: number; totalEn?: number; tam?: number; hasta?: number}> = ({x = 500, y = 640, en = 0, sumaEn = 0.6, totalEn = 1.4, tam = 130, hasta}) => {
  const {fr, fps, t} = usa();
  const s = useSalida(hasta);
  const p1 = muelle(fr, fps, en, 12);
  const p2 = muelle(fr, fps, sumaEn, 8);
  const p3 = muelle(fr, fps, totalEn, 8);
  const gap = tam * 0.62;
  return (
    <div style={{opacity: s, position: 'absolute', left: x - 430, width: 860, top: y, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, fontFamily: F.cifra, fontWeight: 700, fontSize: tam, lineHeight: 1, transform: `translateY(${Math.sin(t * 2.2) * 4}px)`}}>
      <span style={{color: AZUL, opacity: cl(p1), transform: `scale(${0.7 + 0.3 * cl(p1)})`}}>47</span>
      <span style={{color: C.tinta, opacity: cl(p2), width: gap}}>+</span>
      <span style={{color: C.tinta, background: C.mostaza, padding: '0 16px', borderRadius: 14, opacity: cl(p2), transform: `scale(${0.6 + 0.4 * p2})`}}>4</span>
      <span style={{color: C.tinta, opacity: cl(p3)}}>=</span>
      <span style={{color: C.tinta, opacity: cl(p3), transform: `scale(${0.6 + 0.4 * p3})`}}>51</span>
    </div>
  );
};

/** Papelera gráfica: silueta sin cara (Trump) fuera de la papeleta con aspa debajo; el Congreso dentro con visto. */
const Cupula: React.FC<{c?: string}> = ({c = C.tinta}) => (
  <g fill={c}>
    <path d="M-60 0 A60 60 0 0 1 60 0 Z" />
    <rect x={-4} y={-82} width={8} height={24} />
    <rect x={-80} y={0} width={160} height={14} />
    {[-60, -36, -12, 12, 36, 60].map((cx) => <rect key={cx} x={cx - 5} y={16} width={10} height={46} />)}
    <rect x={-90} y={64} width={180} height={14} />
  </g>
);

export const PapeletaM: React.FC<{x?: number; y?: number; en?: number; siluetaEn?: number; aspaEn?: number; congresoEn?: number; hasta?: number}> = ({x = 500, y = 820, en = 0, siluetaEn = 0.3, aspaEn = 1.9, congresoEn = 3.1, hasta}) => {
  const {fr, fps, t} = usa();
  const s = useSalida(hasta);
  const pe = muelle(fr, fps, en, 12);
  const ps = muelle(fr, fps, siluetaEn, 12);
  const pa = muelle(fr, fps, aspaEn, 7);
  const pc = muelle(fr, fps, congresoEn, 8);
  const choque = t > aspaEn - 0.35 && t < aspaEn ? ease(t, aspaEn - 0.35, aspaEn) : t >= aspaEn ? Math.max(0, 1 - (t - aspaEn) * 3) : 0;
  return (
    <div style={{opacity: s}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={`translate(${x} ${y + Math.sin(t * 2.2) * 4})`}>
          {/* papeleta */}
          <g transform={`translate(215 0) scale(${0.85 + 0.15 * cl(pe)})`} opacity={cl(pe)}>
            <rect x={-170} y={-230} width={340} height={440} rx={22} fill={C.crema} stroke={C.tinta} strokeWidth={8} />
            <rect x={-120} y={-190} width={240} height={18} rx={8} fill={C.tinta} opacity={0.5} />
            <rect x={-90} y={-160} width={180} height={12} rx={6} fill={C.tinta} opacity={0.3} />
            <rect x={-120} y={-100} width={240} height={250} rx={16} fill="none" stroke={C.tinta} strokeWidth={6} strokeDasharray="14 10" />
            <g transform={`translate(0 50) scale(${0.9 * cl(pc)})`} opacity={cl(pc)}>
              <Cupula />
            </g>
            <g transform={`translate(0 168) scale(${cl(pc)})`} opacity={cl(pc)}>
              <circle r={26} fill={C.turquesa} stroke={C.tinta} strokeWidth={5} />
              <path d="M-12 0 L-3 10 L14 -10" stroke={C.crema} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          </g>
          {/* silueta sin cara */}
          <g transform={`translate(${-250 + choque * 70 - (1 - cl(ps)) * 200} 0)`} opacity={cl(ps)}>
            <circle cx={0} cy={-90} r={70} fill={C.piedra} stroke={C.tinta} strokeWidth={7} />
            <path d="M-130 130 C-130 20 -70 -10 0 -10 C70 -10 130 20 130 130 Z" fill={C.piedra} stroke={C.tinta} strokeWidth={7} />
            <g transform={`translate(0 215) scale(${cl(pa)})`} opacity={cl(pa)}>
              <circle r={42} fill={C.teja} stroke={C.tinta} strokeWidth={6} />
              <path d="M-18 -18 L18 18 M18 -18 L-18 18" stroke={C.crema} strokeWidth={11} strokeLinecap="round" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

/** Dos cámaras (medios hemiciclos) que se unen en un documento "LEY". */
export const LeyM: React.FC<{x?: number; y?: number; en?: number; unenEn?: number; hasta?: number}> = ({x = 500, y = 800, en = 0, unenEn = 1.6, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, unenEn, unenEn + 0.7);
  const ent = ease(t, en, en + 0.5);
  const semi = (cx: number, col: string, n: number) => {
    const pts = puntosHemiciclo(n, 3, 170);
    return (
      <g transform={`translate(${cx} 0)`}>
        {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={11} fill={col} />)}
        <rect x={-185} y={16} width={370} height={16} rx={8} fill={C.tinta} />
      </g>
    );
  };
  const dx = 210 * (1 - k);
  return (
    <div style={{opacity: s}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={`translate(${x} ${y + Math.sin(t * 2.2) * 4})`}>
          <g opacity={ent * (1 - 0.0 * k)} transform={`translate(0 ${(1 - ent) * 60})`}>
            <g transform={`translate(${-dx} ${-60 * k - 0}) scale(${1 - 0.4 * k})`}>{semi(-20 - 150 * (1 - k) * 0, AZUL, 60)}</g>
            <g transform={`translate(${dx} ${-60 * k - 0}) scale(${1 - 0.4 * k})`}>{semi(20, ROJO, 60)}</g>
          </g>
          <g transform={`translate(0 ${150 - 20 * k}) scale(${0.3 + 0.7 * k})`} opacity={k}>
            <rect x={-130} y={-10} width={260} height={330} rx={18} fill={C.crema} stroke={C.tinta} strokeWidth={8} />
            <rect x={-90} y={30} width={180} height={12} rx={6} fill={C.tinta} opacity={0.4} />
            <rect x={-90} y={60} width={140} height={12} rx={6} fill={C.tinta} opacity={0.3} />
            <text x={0} y={190} textAnchor="middle" fontFamily={F.titular} fontSize={92} fill={C.tinta}>LEY</text>
            <rect x={-90} y={235} width={180} height={12} rx={6} fill={C.tinta} opacity={0.3} />
          </g>
        </g>
      </svg>
    </div>
  );
};

/** Figura con toga (sin cara) + sello "CONFIRMA". */
export const JuezM: React.FC<{x?: number; y?: number; en?: number; selloEn?: number; hasta?: number}> = ({x = 500, y = 820, en = 0, selloEn = 1.0, hasta}) => {
  const {fr, fps, t} = usa();
  const s = useSalida(hasta);
  const p = muelle(fr, fps, en, 12);
  const q = muelle(fr, fps, selloEn, 7);
  return (
    <div style={{opacity: s}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={`translate(${x - 130} ${y + Math.sin(t * 2.2) * 4}) scale(${0.85 + 0.15 * cl(p)})`} opacity={cl(p)}>
          <circle cx={0} cy={-120} r={74} fill={C.piedra} stroke={C.tinta} strokeWidth={7} />
          <path d="M-170 190 C-170 40 -100 -30 0 -30 C100 -30 170 40 170 190 Z" fill={C.tinta} />
          <path d="M-46 -26 L0 80 L46 -26 Z" fill={C.crema} />
          <path d="M-30 -22 L0 50 L30 -22" stroke={C.tinta} strokeWidth={5} fill="none" />
        </g>
        <g transform={`translate(${x + 235} ${y + 20}) rotate(-10) scale(${cl(q) * (1 + 0.2 * Math.exp(-(t - selloEn) * 6))})`} opacity={cl(q)}>
          <rect x={-170} y={-52} width={340} height={104} rx={16} fill={C.mostaza} stroke={C.tinta} strokeWidth={9} />
          <text x={0} y={22} textAnchor="middle" fontFamily={F.titular} fontSize={62} fill={C.tinta}>CONFIRMA</text>
        </g>
      </svg>
    </div>
  );
};

/** Una marca por elecciones de mitad de mandato 1934–2018 (22). Cayeron (▼) salvo `exc` (▲, se iluminan en `excEn`). */
const ANIOS = Array.from({length: 22}, (_, i) => 1934 + 4 * i);
export const TlM: React.FC<{x?: number; y?: number; en?: number; dur?: number; excEn?: number; marcaEn?: number; hasta?: number}> = ({x = 70, y = 780, en = 0, dur = 3.6, excEn = 5, marcaEn = 4.2, hasta}) => {
  const {fr, fps, t} = usa();
  const s = useSalida(hasta);
  const exc = [0, 16, 17]; // 1934, 1998, 2002
  const paso = 40;
  return (
    <div style={{opacity: s}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={`translate(${x} ${y})`}>
          <line x1={0} y1={0} x2={22 * paso} y2={0} stroke={C.tinta} strokeWidth={4} opacity={0.35} />
          {ANIOS.map((a, i) => {
            const e = en + (i / 22) * dur;
            const k = cl(muelle(fr, fps, e, 9));
            const es = exc.includes(i);
            const lit = es && t >= excEn + exc.indexOf(i) * 0.25;
            const col = lit ? C.turquesa : es && t < excEn ? C.teja : C.teja;
            const flip = lit ? ease(t, excEn + exc.indexOf(i) * 0.25, excEn + exc.indexOf(i) * 0.25 + 0.35) : 0;
            const cx = i * paso + paso / 2;
            const h = es ? 100 : 64;
            const hw = es ? 19 : 14;
            return (
              <g key={a} transform={`translate(${cx} ${-10 - 55 * (1 - k)}) scale(${k})`} opacity={k}>
                <g transform={`translate(0 ${h / 2}) scale(1 ${1 - 2 * flip}) translate(0 ${-h / 2})`}>
                  <path d={`M${-hw} 0 L${hw} 0 L0 ${h} Z`} fill={col} stroke={C.tinta} strokeWidth={es ? 5 : 3} strokeLinejoin="round" />
                </g>
              </g>
            );
          })}
          <g opacity={cl((t - marcaEn) / 0.3)} fontFamily={F.cifra} fontWeight={700} fill={C.tinta}>
            <line x1={paso / 2} y1={112} x2={paso / 2} y2={128} stroke={C.tinta} strokeWidth={5} />
            <line x1={16 * paso + 20} y1={112} x2={16 * paso + 20} y2={128} stroke={C.tinta} strokeWidth={5} />
            <line x1={17 * paso + 20} y1={112} x2={17 * paso + 20} y2={128} stroke={C.tinta} strokeWidth={5} />
            <text x={0} y={188} fontSize={64}>1934</text>
            <text x={16 * paso + 24} y={188} fontSize={64} textAnchor="end">1998</text>
            <text x={17 * paso + 16} y={188} fontSize={64}>2002</text>
          </g>
        </g>
      </svg>
    </div>
  );
};

// Casillas por estado (cuadrícula 12 × 8). Gobernadores 2026: 36.
const CUAD: Record<string, [number, number]> = {
  AK: [0, 0], ME: [10, 0], VT: [9, 1], NH: [10, 1],
  WA: [1, 2], ID: [2, 2], MT: [3, 2], ND: [4, 2], MN: [5, 2], IL: [6, 2], WI: [7, 2], MI: [8, 2], NY: [9, 2], MA: [10, 2],
  OR: [1, 3], NV: [2, 3], WY: [3, 3], SD: [4, 3], IA: [5, 3], IN: [6, 3], OH: [7, 3], PA: [8, 3], NJ: [9, 3], CT: [10, 3], RI: [11, 3],
  CA: [1, 4], UT: [2, 4], CO: [3, 4], NE: [4, 4], MO: [5, 4], KY: [6, 4], WV: [7, 4], VA: [8, 4], MD: [9, 4], DE: [10, 4],
  AZ: [2, 5], NM: [3, 5], KS: [4, 5], AR: [5, 5], TN: [6, 5], NC: [7, 5], SC: [8, 5],
  OK: [4, 6], LA: [5, 6], MS: [6, 6], AL: [7, 6], GA: [8, 6],
  HI: [0, 7], TX: [4, 7], FL: [9, 7],
};
const GOB = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'FL', 'GA', 'HI', 'ID', 'IL', 'IA', 'KS', 'ME', 'MD', 'MA', 'MI', 'MN', 'NE', 'NV', 'NH', 'NM', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'VT', 'WI', 'WY'];

/** Mapa de casillas (un estado = una casilla). Los 36 que eligen gobernador se encienden en mostaza desde `luzEn`. */
export const MapaGobM: React.FC<{x?: number; y?: number; paso?: number; en?: number; luzEn?: number; dur?: number; titulo?: string; yTitulo?: number; hasta?: number}> = ({x = 40, y = 570, paso = 70, en = 0, luzEn = 1.2, dur = 1.5, titulo, yTitulo = 530, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const claves = Object.keys(CUAD);
  return (
    <div style={{opacity: s}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        {titulo ? <text x={x} y={yTitulo} fontFamily={F.texto} fontWeight={700} fontSize={44} fill={C.tinta}>{titulo}</text> : null}
        <g transform={`translate(${x} ${y + Math.sin(t * 2.2) * 3})`}>
          {claves.map((k, i) => {
            const [c, f] = CUAD[k];
            const g = GOB.indexOf(k);
            const lit = g >= 0 ? cl((t - (luzEn + (g / 36) * dur)) / 0.25) : 0;
            const ap = cl((t - en - (i / claves.length) * 0.6) / 0.25);
            const w = paso - 6;
            return (
              <g key={k} transform={`translate(${c * paso} ${f * paso}) scale(${ap})`} opacity={ap}>
                <rect width={w} height={w} rx={9} fill={lit > 0 ? C.mostaza : GRIS} stroke={C.tinta} strokeWidth={lit > 0 ? 4 : 2} transform={`translate(${w / 2 * (1 - (1 + 0.12 * Math.sin(lit * Math.PI)))} ${w / 2 * (1 - (1 + 0.12 * Math.sin(lit * Math.PI)))}) scale(${1 + 0.12 * Math.sin(lit * Math.PI)})`} />
                <text x={w / 2} y={w / 2 + 11} textAnchor="middle" fontFamily={F.texto} fontWeight={700} fontSize={40} fill={C.tinta} opacity={lit > 0 ? 1 : 0}>{g >= 0 ? k : ''}</text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export const REGISTRO_017: Record<string, React.FC<any>> = {
  hemiM: HemiM, sumaM: SumaM, papeletaM: PapeletaM, leyM: LeyM, juezM: JuezM, tlM: TlM, mapaGobM: MapaGobM,
};
