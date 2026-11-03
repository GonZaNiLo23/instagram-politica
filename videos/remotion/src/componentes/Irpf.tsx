import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {miles, useSalida} from './util';

/**
 * 034 · IRPF sin deflactar. Componentes SVG a lienzo completo. Todos los tiempos (en, luz, sube...) son segundos desde el inicio de la ESCENA.
 * barrasI (tres barras sueldo/precios/IRPF con rótulos), tarjetaAnioI, chipI, escalonI (tramos + barra de renta + copo + desplazamiento),
 * copoI, comparaI (3.405 vs 3.276), edificioI, mitadI, rentasI, caratulaI, informeI, aniosI, escaleraIcoI, nominaI.
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
const CLARO = '#DDE1E8';
const GRIS = '#B4BBC8';
const TXT = {fontFamily: F.texto, fontWeight: 700} as const;

/** Tres barras (sueldo +4,9 %, precios +4,9 %, IRPF +9 %) con sus rótulos. Alturas proporcionales (eje en 0). `preg`: segundo en que aparece el "?" sobre la barra del IRPF. */
export const BarrasI: React.FC<{y?: number; tam?: number; base?: number; hMax?: number; iEn?: number; dur?: number; preg?: number; rot?: boolean; hasta?: number; paso?: number}> = ({
  y = 330, tam = 108, base = 1120, hMax = 340, iEn = 1.2, dur = 1.1, preg, rot = true, hasta, paso}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const w = 240;
  const xs = [70, 360, 650];
  const vs = [4.9, 4.9, 9];
  const cols = [C.tinta, C.piedra, C.mostaza];
  const ks = [ease(t, 0, dur), ease(t, 0, dur), ease(t, iEn, iEn + 0.9)];
  const lin = ['SUELDO +4,9 %', 'PRECIOS +4,9 %', 'IRPF +9 %'];
  const pas = paso ?? tam * 1.2;
  const vaiven = Math.sin(t * 2.6) * 3;
  const kp = preg === undefined ? 0 : ease(t, preg, preg + 0.4);
  return lienzo(
    <g>
      {rot ? lin.map((l, i) => {
        const o = i === 2 ? ease(t, iEn - 0.1, iEn + 0.2) : 1;
        return (
          <g key={i} opacity={o}>
            <text x={60} y={y + tam * 0.86 + i * pas} fontFamily={F.titular} fontSize={tam} fill={C.tinta}>{l}</text>
            <rect x={60} y={y + tam * 0.86 + i * pas + 8} width={Math.min(900, l.length * tam * 0.66)} height={10} rx={5} fill={cols[i]} />
          </g>
        );
      }) : null}
      <g transform={`translate(0 ${vaiven})`}>
        <line x1={40} y1={base} x2={930} y2={base} stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />
        {xs.map((x, i) => {
          const h = (vs[i] / 9) * hMax * ks[i];
          return <rect key={i} x={x} y={base - h} width={w} height={h} fill={cols[i]} stroke={C.tinta} strokeWidth={5} />;
        })}
        {kp > 0 ? (
          <g transform={`translate(${xs[2] + w / 2} ${base - hMax - 70}) scale(${kp})`}>
            <circle r={62} fill={C.tinta} />
            <text y={34} textAnchor="middle" fontFamily={F.titular} fontSize={96} fill={C.mostaza}>?</text>
          </g>
        ) : null}
      </g>
    </g>,
    s,
  );
};

/** Tarjeta de un año: dos líneas de 64 px. `en2`: segundo en que aparece la 2.ª línea. */
export const TarjetaAnioI: React.FC<{y: number; l1: string; l2: string; en?: number; en2?: number; fondo?: string; h?: number; hasta?: number}> = ({y, l1, l2, en = 0, en2, fondo = C.crema, h = 176, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.35);
  const k2 = ease(t, en2 ?? en, (en2 ?? en) + 0.3);
  return lienzo(
    <g opacity={k} transform={`translate(${(1 - k) * -80} 0)`}>
      <rect x={60} y={y} width={880} height={h} rx={24} fill={fondo} stroke={C.tinta} strokeWidth={6} />
      <text x={96} y={y + 70} {...TXT} fontSize={64} fill={C.tinta}>{l1}</text>
      <text x={96} y={y + 148} {...TXT} fontSize={64} fill={C.tinta} opacity={k2}>{l2}</text>
    </g>,
    s,
  );
};

/** Pastilla con flecha hacia arriba y texto de 64 px. */
export const ChipI: React.FC<{x?: number; y: number; texto: string; fondo?: string; color?: string; en?: number; ancho: number; hasta?: number; sube?: boolean}> = ({x = 60, y, texto, fondo = C.tinta, color = C.crema, en = 0, ancho, hasta, sube = true}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.3);
  return lienzo(
    <g opacity={k} transform={`translate(0 ${(1 - k) * 30})`}>
      <rect x={x} y={y} width={ancho} height={92} rx={22} fill={fondo} />
      {sube ? <path d={`M${x + 24} ${y + 64} L${x + 52} ${y + 26} L${x + 80} ${y + 64} Z`} fill={color} /> : null}
      <text x={x + (sube ? 100 : 28)} y={y + 66} {...TXT} fontSize={64} fill={color}>{texto}</text>
    </g>,
    s,
  );
};

/** Copo de nieve (6 brazos). */
export const CopoI: React.FC<{x?: number; y?: number; r?: number; en?: number; hasta?: number}> = ({x = 540, y = 900, r = 150, en = 0, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.5);
  const giro = t * 18;
  const brazo = (a: number) => (
    <g key={a} transform={`rotate(${a})`}>
      <line x1={0} y1={0} x2={0} y2={-r} stroke={C.turquesa} strokeWidth={14} strokeLinecap="round" />
      <line x1={0} y1={-r * 0.55} x2={-r * 0.28} y2={-r * 0.8} stroke={C.turquesa} strokeWidth={12} strokeLinecap="round" />
      <line x1={0} y1={-r * 0.55} x2={r * 0.28} y2={-r * 0.8} stroke={C.turquesa} strokeWidth={12} strokeLinecap="round" />
    </g>
  );
  return lienzo(<g transform={`translate(${x} ${y}) rotate(${giro}) scale(${k})`}>{[0, 60, 120, 180, 240, 300].map(brazo)}</g>, s);
};

/**
 * Escalones del IRPF (19 % hasta 12.450 €, 24 % hasta 20.200 €, 30 % hasta 35.200 €) en eje de renta 0–36.000 € (proporcional),
 * barra de renta de 20.000 € que sube a 20.980 €. Tiempos de la escena: `en` (primer escalón), `paso` (segundos entre escalones),
 * `barraEn`, `sube`, `luz` (el escalón del 30 % se enciende), `atenua`/`vuelve` (se apaga mientras sale el copo), `desplaza` (los escalones se mueven +4,9 %).
 */
export const EscalonI: React.FC<{y0?: number; en?: number; paso?: number; barraEn?: number; sube?: number; luz?: number; atenua?: number; vuelve?: number; desplaza?: number; hasta?: number; titulo?: boolean; yTit?: number; vivo?: boolean}> = ({
  y0 = 1090, en = 0.2, paso = 0.5, barraEn = 1.8, sube = 6, luz = 8, atenua, vuelve, desplaza, hasta, titulo = true, yTit = 385, vivo = false}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const x0 = 100, k = 800 / 36000, hm = 300;
  const X = (e: number) => x0 + e * k;
  const lim = [0, 12450, 20200, 35200];
  const tipos = [19, 24, 30];
  const cols = [CLARO, GRIS, C.piedra];
  const kd = desplaza === undefined ? 0 : ease(t, desplaza, desplaza + 1.2);
  const f = 1 + 0.049 * kd;
  const op = atenua === undefined ? 1 : 1 - 0.8 * ease(t, atenua, atenua + 0.4) + 0.8 * (vuelve === undefined ? 0 : ease(t, vuelve, vuelve + 0.4));
  const kb = ease(t, barraEn, barraEn + 0.7);
  const ks = ease(t, sube, sube + 1.0);
  const finBarra = X(20000 + 980 * ks) - x0;
  const lz = luz === undefined ? 0 : ease(t, luz, luz + 0.4);
  const pul = lz * (0.5 + 0.5 * Math.sin(t * 7));
  const sway = vivo ? 10 * Math.sin(t * 2.4) : 0;
  const ciclo = vivo ? Math.floor(Math.max(0, t - barraEn) / 0.9) % 3 : -1;
  return lienzo(
    <g transform={`translate(0 ${sway})`}>
      {titulo ? (
        <g opacity={ease(t, 0, 0.3)}>
          <text x={60} y={yTit + 56} {...TXT} fontSize={64} fill={C.tinta}>TIPO ESTATAL +</text>
          <text x={60} y={yTit + 133} {...TXT} fontSize={64} fill={C.tinta}>AUTONÓMICO (EJEMPLO)</text>
        </g>
      ) : null}
      <g opacity={op}>
        <line x1={x0 - 20} y1={y0} x2={x0 + 830} y2={y0} stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />
        {tipos.map((tp, i) => {
          const ki = ease(t, en + i * paso, en + i * paso + 0.5);
          const a = X(lim[i] * f), b = X(lim[i + 1] * f);
          const h = (tp / 30) * hm * ki;
          const caliente = i === 2 ? lz : 0;
          const brillo = vivo && ciclo === i && lz === 0 && t > barraEn ? 0.5 + 0.5 * Math.sin(t * 7) : 0;
          return (
            <g key={i}>
              {kd > 0 ? <rect x={X(lim[i])} y={y0 - (tp / 30) * hm} width={X(lim[i + 1]) - X(lim[i])} height={(tp / 30) * hm} fill="none" stroke={C.tinta} strokeWidth={3} strokeDasharray="10 8" opacity={0.5} /> : null}
              <rect x={a} y={y0 - h} width={b - a} height={h} fill={caliente > 0 || brillo > 0.55 ? C.mostaza : cols[i]} opacity={caliente > 0 ? 0.55 + 0.45 * (0.5 + pul / 2) : 1} stroke={C.tinta} strokeWidth={4} />
              {ki > 0.95 ? <text x={(a + b) / 2} y={y0 - h + 70} textAnchor="middle" {...TXT} fontSize={64} fill={C.tinta}>{tp} %</text> : null}
            </g>
          );
        })}
        {kb > 0 ? (
          <g>
            <rect x={x0} y={y0 - 50} width={(X(20000) - x0) * kb} height={50} fill={C.tinta} />
            {ks > 0 ? <rect x={X(20000)} y={y0 - 50} width={finBarra - (X(20000) - x0)} height={50} fill={C.mostaza} stroke={C.tinta} strokeWidth={4} /> : null}
          </g>
        ) : null}
      </g>
      {kd > 0 ? (
        <g opacity={ease(t, desplaza ?? 0, (desplaza ?? 0) + 0.3)} transform="translate(0 0)">
          <path d={`M${x0 + 300} ${y0 + 56} H${x0 + 520} M${x0 + 490} ${y0 + 36} L${x0 + 524} ${y0 + 56} L${x0 + 490} ${y0 + 76}`} stroke={C.tinta} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}
    </g>,
    s,
  );
};

/** Compara dos cuotas con barras horizontales desde 0: "Sin ajustar" (3.405) y "Tramos y mínimo ajustados" (3.276). La diferencia (129) en mostaza. */
export const ComparaI: React.FC<{enB?: number; enA?: number; enDif?: number; hasta?: number}> = ({enB = 0.1, enA = 1.5, enDif = 2, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const ancho = 880, vB = 3405, vA = 3276;
  const kB = ease(t, enB, enB + 0.7), kA = ease(t, enA, enA + 0.7), kD = ease(t, enDif, enDif + 0.4);
  const wA = (vA / vB) * ancho, wB = ancho;
  return lienzo(
    <g>
      <g opacity={ease(t, enA, enA + 0.25)}>
        <text x={60} y={620} {...TXT} fontSize={64} fill={C.tinta}>Tramos y mínimo</text>
        <text x={60} y={697} {...TXT} fontSize={64} fill={C.tinta}>ajustados: 3.276 €</text>
        <rect x={60} y={730} width={wA * kA} height={70} fill={C.turquesa} stroke={C.tinta} strokeWidth={5} />
      </g>
      <g opacity={ease(t, enB, enB + 0.25)}>
        <text x={60} y={880} {...TXT} fontSize={64} fill={C.tinta}>Sin ajustar: 3.405 €</text>
        <rect x={60} y={910} width={wB * kB} height={70} fill={C.tinta} />
        {kD > 0 ? <rect x={60 + wA} y={910} width={(wB - wA) * kD} height={70} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} /> : null}
      </g>
    </g>,
    s,
  );
};

/** Edificio institucional genérico (sin logotipo): frontón, columnas y escalones. */
export const EdificioI: React.FC<{x?: number; y?: number; ancho?: number; en?: number; hasta?: number}> = ({x = 540, y = 640, ancho = 440, en = 0, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.5);
  const w = ancho, h = w * 0.78;
  const cols = [0.12, 0.3, 0.5, 0.7, 0.88];
  return lienzo(
    <g transform={`translate(${x - w / 2} ${y + (1 - k) * 60 + Math.sin(t * 2.2) * 4})`} opacity={k}>
      <path d={`M0 ${h * 0.28} L${w / 2} 0 L${w} ${h * 0.28} Z`} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} strokeLinejoin="round" />
      <rect x={0} y={h * 0.3} width={w} height={h * 0.07} fill={C.tinta} />
      {cols.map((c, i) => <rect key={i} x={w * c - w * 0.04} y={h * 0.4} width={w * 0.08} height={h * 0.4} fill={C.crema} stroke={C.tinta} strokeWidth={5} />)}
      <rect x={-w * 0.04} y={h * 0.82} width={w * 1.08} height={h * 0.07} fill={C.tinta} />
      <rect x={-w * 0.08} y={h * 0.9} width={w * 1.16} height={h * 0.08} fill={C.tinta} />
    </g>,
    s,
  );
};

/** Barra 50/50: mitad mostaza (progresividad en frío) y mitad tinta (otros factores). Etiquetas debajo. */
export const MitadI: React.FC<{y?: number; en?: number; hasta?: number; vivo?: boolean}> = ({y = 760, en = 0.2, hasta, vivo = false}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.9);
  const lab = ease(t, en + 0.9, en + 1.2);
  const W = 880;
  const sway = vivo ? 10 * Math.sin(t * 2.4) : 0;
  const lat = vivo && k >= 1 ? 0.8 + 0.2 * Math.sin(t * 5) : 1;
  return lienzo(
    <g transform={`translate(0 ${sway})`}>
      <rect x={60} y={y} width={(W / 2) * k} height={150} opacity={lat} fill={C.mostaza} stroke={C.tinta} strokeWidth={6} />
      <rect x={60 + W / 2} y={y} width={(W / 2) * k} height={150} fill={C.tinta} />
      <g opacity={lab}>
        <text x={60} y={y + 230} {...TXT} fontSize={64} fill={C.tinta}>progresividad</text>
        <text x={60} y={y + 307} {...TXT} fontSize={64} fill={C.tinta}>en frío</text>
        <text x={60 + W / 2 + 10} y={y + 230} {...TXT} fontSize={64} fill={C.tinta}>otros</text>
        <text x={60 + W / 2 + 10} y={y + 307} {...TXT} fontSize={64} fill={C.tinta}>factores</text>
      </g>
    </g>,
    s,
  );
};

/** Cinco columnas de renta (de menos a más). Resalta las medias y medias-altas; `comprime` las acerca (reduce la desigualdad). Alturas ilustrativas, no son datos. */
export const RentasI: React.FC<{base?: number; hMax?: number; luz?: number; comprime?: number; hasta?: number}> = ({base = 1100, hMax = 330, luz = 0.8, comprime, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const kc = comprime === undefined ? 0 : ease(t, comprime, comprime + 1.2);
  const hs = [0.2, 0.4, 0.6, 0.8, 1.0];
  const lz = ease(t, luz, luz + 0.4);
  const w = 150, gap = 30;
  return lienzo(
    <g>
      <line x1={40} y1={base} x2={930} y2={base} stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />
      {hs.map((v, i) => {
        const kk = ease(t, 0.1 + i * 0.12, 0.6 + i * 0.12);
        const h = hMax * (v + (0.6 - v) * 0.7 * kc) * kk;
        const medio = i === 2 || i === 3;
        return <rect key={i} x={70 + i * (w + gap)} y={base - h} width={w} height={h} fill={medio && lz > 0.5 ? C.mostaza : GRIS} stroke={C.tinta} strokeWidth={5} />;
      })}
      <path d={`M${70 + 2 * (w + gap)} ${base + 40} H${70 + 4 * (w + gap) - gap}`} stroke={C.tinta} strokeWidth={8} opacity={lz} />
    </g>,
    s,
  );
};

/** Carátula del informe: hoja con franja de título y líneas de texto que se escriben. */
export const CaratulaI: React.FC<{y?: number; en?: number; hasta?: number}> = ({y = 700, en = 0.2, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.5);
  return lienzo(
    <g transform={`translate(${390} ${y + (1 - k) * 70 + Math.sin(t * 2.4) * 4}) rotate(${-3 * (1 - k)})`} opacity={k}>
      <rect x={0} y={0} width={320} height={420} rx={14} fill={C.crema} stroke={C.tinta} strokeWidth={7} />
      <rect x={0} y={0} width={320} height={110} rx={14} fill={C.tinta} />
      <rect x={30} y={36} width={170} height={14} rx={7} fill={C.mostaza} />
      <rect x={30} y={64} width={240} height={14} rx={7} fill={C.crema} />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={30} y={150 + i * 46} width={i === 4 ? 150 : 260} height={14} rx={7} fill={GRIS} opacity={ease(t, en + 0.6 + i * 0.25, en + 0.9 + i * 0.25)} />)}
      <circle cx={250} cy={360} r={34} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
    </g>,
    s,
  );
};

/** Cifra del informe: contador 0 → valor con etiqueta propia desde el primer fotograma, y desglose Estado/CCAA. */
export const InformeI: React.FC<{valor: number; etiqueta: string; cuentaEn?: number; cuentaDur?: number; yCifra?: number; partes?: {texto: string; en: number}[]; yPartes?: number; hasta?: number; directo?: boolean}> = ({
  valor, etiqueta, cuentaEn = 0.1, cuentaDur = 3.5, yCifra = 640, partes = [], yPartes = 840, hasta, directo = false}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, cuentaEn, cuentaEn + cuentaDur);
  const v = directo ? valor : valor * k;
  const kd = directo ? ease(t, cuentaEn, cuentaEn + 0.35) : 1;
  return lienzo(
    <g opacity={kd} transform={directo ? `translate(0 ${(1 - kd) * 40 + 6 * Math.sin(t * 2.6)})` : undefined}>
      <text x={60} y={yCifra - 120} {...TXT} fontSize={64} fill={C.tinta}>{etiqueta}</text>
      <text x={60} y={yCifra + 40} fontFamily={F.cifra} fontWeight={700} fontSize={150} fill={C.tinta}>{miles(v)}</text>
      <text x={60} y={yCifra + 130} fontFamily={F.cifra} fontWeight={700} fontSize={80} fill={C.tinta}>M€</text>
      {partes.map((p, i) => {
        const kp = ease(t, p.en, p.en + 0.4);
        return (
          <g key={i} opacity={kp} transform={`translate(0 ${(1 - kp) * 30})`}>
            <rect x={60} y={yPartes + i * 120} width={640} height={96} rx={22} fill={i === 0 ? C.tinta : C.mostaza} />
            <text x={90} y={yPartes + i * 120 + 68} {...TXT} fontSize={64} fill={i === 0 ? C.crema : C.tinta}>{p.texto}</text>
          </g>
        );
      })}
    </g>,
    s,
  );
};

/** Línea de tiempo 2025 → 2028 con la flecha que se va llenando. */
export const AniosI: React.FC<{y?: number; en?: number; dur?: number; hasta?: number}> = ({y = 760, en = 0.2, dur = 2.2, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + dur);
  const xs = [150, 380, 610, 840];
  const ys = ['2025', '2026', '2027', '2028'];
  return lienzo(
    <g>
      <line x1={90} y1={y} x2={930} y2={y} stroke={GRIS} strokeWidth={22} strokeLinecap="round" />
      <line x1={90} y1={y} x2={90 + 840 * k} y2={y} stroke={C.mostaza} strokeWidth={22} strokeLinecap="round" />
      {xs.map((x, i) => {
        const on = k * 840 + 90 >= x - 10;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={on ? 30 : 20} fill={on ? C.mostaza : GRIS} stroke={C.tinta} strokeWidth={6} />
            <text x={x} y={y + 110} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={64} fill={C.tinta}>{ys[i]}</text>
          </g>
        );
      })}
    </g>,
    s,
  );
};

/** Icono grande de escalones que se desplazan a la derecha (deflactar). */
export const EscaleraIcoI: React.FC<{x?: number; y?: number; esc?: number; en?: number; hasta?: number}> = ({x = 540, y = 900, esc = 1, en = 0.1, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.5);
  const d = ease(t, en + 0.8, en + 1.8);
  const paso = (dx: number, fill: string, dash?: boolean) => (
    <g transform={`translate(${dx} 0)`}>
      <path d="M0 0 H110 V-60 H230 V-130 H350 V-200 H460 V0 Z" fill={dash ? 'none' : fill} stroke={C.tinta} strokeWidth={dash ? 5 : 7} strokeDasharray={dash ? '12 10' : undefined} strokeLinejoin="round" />
    </g>
  );
  return lienzo(
    <g transform={`translate(${x - 230 * esc} ${y + Math.sin(t * 2.4) * 4}) scale(${esc * k})`}>
      {paso(0, 'none', true)}
      {paso(70 * d, C.mostaza)}
      <path d="M40 60 H300 M265 38 L305 60 L265 82" stroke={C.tinta} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>,
    s,
  );
};

/** Nómina con "SMI" (icono, 300 px). */
export const NominaI: React.FC<{x?: number; y?: number; en?: number; hasta?: number}> = ({x = 540, y = 640, en = 0.1, hasta}) => {
  const {t} = usa();
  const s = useSalida(hasta);
  const k = ease(t, en, en + 0.5);
  return lienzo(
    <g transform={`translate(${x - 130} ${y + (1 - k) * 60 + Math.sin(t * 2.4) * 4})`} opacity={k}>
      <rect x={0} y={0} width={260} height={340} rx={16} fill={C.crema} stroke={C.tinta} strokeWidth={7} />
      <rect x={24} y={30} width={130} height={16} rx={8} fill={C.tinta} />
      {[0, 1, 2].map((i) => <rect key={i} x={24} y={80 + i * 36} width={i === 2 ? 120 : 210} height={12} rx={6} fill={GRIS} />)}
      <rect x={24} y={210} width={212} height={96} rx={16} fill={C.mostaza} stroke={C.tinta} strokeWidth={5} />
      <text x={130} y={282} textAnchor="middle" fontFamily={F.titular} fontSize={72} fill={C.tinta}>SMI</text>
    </g>,
    s,
  );
};

export const REGISTRO_034: Record<string, React.FC<any>> = {
  barrasI: BarrasI, tarjetaAnioI: TarjetaAnioI, chipI: ChipI, copoI: CopoI, escalonI: EscalonI, comparaI: ComparaI, edificioI: EdificioI,
  mitadI: MitadI, rentasI: RentasI, caratulaI: CaratulaI, informeI: InformeI, aniosI: AniosI, escaleraIcoI: EscaleraIcoI, nominaI: NominaI,
};
