import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';

/** Componentes de la pieza 020 (Junta Electoral Central). Lienzo 1080x1920; `en`/`hasta`/tiempos en segundos de la ESCENA. SVG a lienzo completo con balanceo vertical de 10 px. */
const T = C.tinta;
const sw = {stroke: T, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const cl = (x: number) => Math.min(1, Math.max(0, x));
const easeIO = (u: number) => u * u * (3 - 2 * u);
const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};

const Capa: React.FC<{en?: number; hasta?: number; children: React.ReactNode}> = ({en = 0, hasta, children}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const f = useCurrentFrame();
  const bob = 10 * Math.sin((f / 30) * 2.2);
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(p, 1) * s, transform: `translateY(${bob}px)`}}>{children}</svg>;
};

const Persona: React.FC<{cx: number; cy: number; s: number; fill?: string}> = ({cx, cy, s, fill = T}) => (
  <g>
    <circle cx={cx} cy={cy - 0.26 * s} r={0.21 * s} fill={fill} />
    <path d={`M${cx - 0.4 * s} ${cy + 0.42 * s} Q${cx - 0.4 * s} ${cy + 0.02 * s} ${cx} ${cy + 0.02 * s} Q${cx + 0.4 * s} ${cy + 0.02 * s} ${cx + 0.4 * s} ${cy + 0.42 * s} Z`} fill={fill} />
  </g>
);

/** Mesa de la Junta: 13 sillas (8 magistrados, 5 catedráticos) + silla del secretario. modo 'fila' (una mesa larga) o 'dos' (dos filas + secretario aparte).
 * ocupanEn: tiempos en que se ocupa cada una de las 13 sillas (omitido = ya ocupadas). togaEn/birreteEn: -1 = ya puestos; secEn: aparece el secretario (-1 = ya); secSilla: silla del secretario visible vacía.
 * bandaEn: banda SUPREMO sobre los 8 magistrados. foco: 'mag' | 'cat' | 'sec' atenúa el resto. cifra: número grande sobre la mesa (cifra2 aparece con el secretario). */
export const MesaJ: React.FC<{yMesa?: number; yA?: number; yB?: number; modo?: 'fila' | 'dos'; dosEn?: number; ocupanEn?: number[]; togaEn?: number; birreteEn?: number; secEn?: number; secSilla?: boolean; bandaEn?: number; foco?: 'mag' | 'cat' | 'sec'; cifra?: string; yCifra?: number; cifra2?: string; luzSec?: boolean; en?: number; hasta?: number}> = ({
  yMesa = 1040, yA = 920, yB = 1070, modo = 'fila', dosEn, ocupanEn, togaEn, birreteEn, secEn, secSilla = false, bandaEn, foco, cifra, yCifra = 880, cifra2, luzSec = false, en = 0, hasta,
}) => {
  const t = useT();
  const u = modo === 'dos' ? (dosEn === undefined || dosEn < 0 ? 1 : easeIO(cl((t - dosEn) / 0.9))) : 0;
  const lerp = (a: number, b: number) => a + (b - a) * u;
  const s = lerp(64, 80);
  const seat = (i: number) => {
    if (i < 8) return {x: lerp(100 + i * 60, 130 + i * 100), ty: lerp(yMesa, yA)};
    if (i < 13) return {x: lerp(100 + i * 60, 170 + (i - 8) * 110), ty: lerp(yMesa, yB)};
    return {x: lerp(900, 830), ty: lerp(yMesa, yB)};
  };
  const grupo = (i: number) => (i < 8 ? 'mag' : i < 13 ? 'cat' : 'sec');
  const fo = foco ? 0.3 + 0.7 * (1 - cl(t / 0.3)) : 1; // al empezar atenúa suavemente
  const opG = (i: number) => (!foco || grupo(i) === foco ? 1 : fo);
  const secVisible = secSilla || secEn !== undefined;
  const mostrarSec = secEn !== undefined && (secEn < 0 || t >= secEn);
  const tapa = (x: number, w: number, ty: number, fill: string, op = 1) => <rect x={x} y={ty} width={w} height={34} rx={8} fill={fill} {...sw} opacity={op} />;
  const t1 = {x: lerp(60, 70), w: lerp(800, 820), y: lerp(yMesa, yA)};
  const t2 = {x: lerp(60, 100), w: lerp(800, 560), y: lerp(yMesa, yB)};
  const t3 = {x: lerp(862, 770), w: lerp(80, 120), y: lerp(yMesa, yB)};
  const s0 = seat(0), s7 = seat(7);
  const bandaP = bandaEn === undefined ? 0 : bandaEn < 0 ? 1 : easeIO(cl((t - bandaEn) / 0.4));
  const cy0 = s0.ty - 0.42 * s + 12;
  const pop = (k: number) => 0.55 + 0.45 * Math.min(1, 1 - (1 - k) * (1 - k));
  return (
    <Capa en={en} hasta={hasta}>
      {cifra ? (
        <g>
          <text x={cifra2 ? 380 : 540} y={yCifra} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={250} fill={T}>{cifra}</text>
          {cifra2 && secEn !== undefined && (secEn < 0 || t >= secEn) ? (
            <text x={760} y={yCifra} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={250} fill={C.mostaza} stroke={T} strokeWidth={8} paintOrder="stroke">{cifra2}</text>
          ) : null}
        </g>
      ) : null}
      {Array.from({length: 13}).map((_, i) => {
        const p = seat(i);
        const cy = p.ty - 0.42 * s + 12;
        return <rect key={'c' + i} x={p.x - 0.45 * s} y={cy - 0.6 * s} width={0.9 * s} height={1.1 * s} rx={8} fill={C.crema} {...sw} strokeWidth={6} opacity={opG(i)} />;
      })}
      {secVisible ? (() => {
        const p = seat(13);
        const cy = p.ty - 0.42 * s + 12;
        return <rect x={p.x - 0.45 * s} y={cy - 0.6 * s} width={0.9 * s} height={1.1 * s} rx={8} fill={C.crema} {...sw} strokeWidth={6} opacity={opG(13)} />;
      })() : null}
      {Array.from({length: 13}).map((_, i) => {
        const p = seat(i);
        const cy = p.ty - 0.42 * s + 12;
        const oT = ocupanEn ? ocupanEn[i] : -1;
        const k = oT < 0 ? 1 : cl((t - oT) / 0.3);
        if (k <= 0) return null;
        const toga = i < 8 && togaEn !== undefined && (togaEn < 0 || t >= togaEn + i * 0.14);
        const bir = i >= 8 && birreteEn !== undefined && (birreteEn < 0 || t >= birreteEn + (i - 8) * 0.14);
        const fill = toga ? T : bir ? C.turquesa : C.piedra;
        const hy = cy - 0.47 * s;
        return (
          <g key={'p' + i} opacity={k * opG(i)} transform={`translate(${p.x} ${cy + 0.42 * s}) scale(${pop(k)}) translate(${-p.x} ${-(cy + 0.42 * s)})`}>
            <Persona cx={p.x} cy={cy} s={s} fill={fill} />
            {toga ? <path d={`M${p.x - 0.12 * s} ${cy + 0.02 * s} L${p.x} ${cy + 0.24 * s} L${p.x + 0.12 * s} ${cy + 0.02 * s} Z`} fill={C.crema} /> : null}
            {bir ? (
              <g>
                <path d={`M${p.x - 0.34 * s} ${hy + 0.06 * s} L${p.x} ${hy - 0.1 * s} L${p.x + 0.34 * s} ${hy + 0.06 * s} L${p.x} ${hy + 0.22 * s} Z`} fill={T} />
                <path d={`M${p.x + 0.3 * s} ${hy + 0.07 * s} L${p.x + 0.3 * s} ${hy + 0.3 * s}`} stroke={C.mostaza} strokeWidth={5} strokeLinecap="round" />
              </g>
            ) : null}
          </g>
        );
      })}
      {mostrarSec ? (() => {
        const p = seat(13);
        const cy = p.ty - 0.42 * s + 12;
        const k = secEn !== undefined && secEn >= 0 ? cl((t - secEn) / 0.3) : 1;
        const lat = luzSec || secEn !== undefined ? 1 + 0.06 * Math.sin(t * 5) : 1;
        return (
          <g opacity={k * opG(13)}>
            <circle cx={p.x} cy={cy - 0.1 * s} r={0.78 * s * lat} fill="none" stroke={C.mostaza} strokeWidth={8} opacity={0.9} />
            <g transform={`translate(${p.x} ${cy + 0.42 * s}) scale(${pop(k)}) translate(${-p.x} ${-(cy + 0.42 * s)})`}>
              <Persona cx={p.x} cy={cy} s={s} fill={C.mostaza} />
              <path d={`M${p.x - 0.4 * s} ${cy + 0.42 * s} Q${p.x - 0.4 * s} ${cy + 0.02 * s} ${p.x} ${cy + 0.02 * s} Q${p.x + 0.4 * s} ${cy + 0.02 * s} ${p.x + 0.4 * s} ${cy + 0.42 * s}`} fill="none" {...sw} strokeWidth={5} />
            </g>
          </g>
        );
      })() : null}
      {tapa(t1.x, t1.w, t1.y, C.mostaza, 1)}
      {u > 0.02 ? tapa(t2.x, t2.w, t2.y, C.mostaza, 1) : null}
      {secVisible ? tapa(t3.x, t3.w, t3.y, C.piedra, opG(13)) : null}
      {bandaP > 0 ? (
        <g opacity={bandaP * opG(0)} transform={`translate(0 ${(1 - bandaP) * -20})`}>
          <rect x={s0.x - 40} y={cy0 - 0.47 * s - 74} width={s7.x - s0.x + 80} height={56} rx={10} fill={C.mostaza} {...sw} strokeWidth={6} />
          <text x={(s0.x + s7.x) / 2} y={cy0 - 0.47 * s - 31} textAnchor="middle" fontFamily={F.titular} fontSize={40} fill={T}>SUPREMO</text>
        </g>
      ) : null}
    </Capa>
  );
};

/** Placa plana con las siglas (JEC) sobre un soporte. x,y = centro. */
export const PlacaJ: React.FC<{texto?: string; x?: number; y?: number; ancho?: number; en?: number; hasta?: number}> = ({texto = 'JEC', x = 540, y = 700, ancho = 420, en = 0, hasta}) => (
  <Capa en={en} hasta={hasta}>
    <path d={`M${x - ancho * 0.3} ${y + 110} L${x - ancho * 0.36} ${y + 140} M${x + ancho * 0.3} ${y + 110} L${x + ancho * 0.36} ${y + 140}`} fill="none" {...sw} />
    <rect x={x - ancho / 2} y={y - 100} width={ancho} height={210} rx={22} fill={C.mostaza} {...sw} strokeWidth={9} />
    <text x={x} y={y + 40} textAnchor="middle" fontFamily={F.titular} fontSize={130} fill={T}>{texto}</text>
  </Capa>
);

/** Chips de años que cruzan sin tocar la mesa (aparecen a la izquierda, avanzan y se desvanecen). pasan: tiempos de salida. */
export const AniosJ: React.FC<{y?: number; anios: string[]; pasan: number[]; dur?: number; en?: number; hasta?: number}> = ({y = 860, anios, pasan, dur = 1.9, en = 0, hasta}) => {
  const t = useT();
  return (
    <Capa en={en} hasta={hasta}>
      {anios.map((a, i) => {
        const u = cl((t - pasan[i]) / dur);
        if (u <= 0 || u >= 1) return null;
        const x = 150 + 600 * easeIO(u);
        const op = Math.min(1, u / 0.15, (1 - u) / 0.2);
        return (
          <g key={i} opacity={op}>
            <rect x={x - 115} y={y - 52} width={230} height={104} rx={20} fill={C.crema} {...sw} />
            <text x={x} y={y + 28} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={72} fill={T}>{a}</text>
          </g>
        );
      })}
    </Capa>
  );
};

/** Libro abierto plano. x,y = centro. */
export const LibroJ: React.FC<{x?: number; y?: number; tam?: number; en?: number; hasta?: number}> = ({x = 540, y = 700, tam = 240, en = 0, hasta}) => {
  const w = tam / 2;
  const h = tam * 0.7;
  return (
    <Capa en={en} hasta={hasta}>
      <path d={`M${x} ${y - h / 2} Q${x - w * 0.5} ${y - h / 2 - 30} ${x - w} ${y - h / 2} L${x - w} ${y + h / 2} Q${x - w * 0.5} ${y + h / 2 - 30} ${x} ${y + h / 2} Z`} fill={C.crema} {...sw} />
      <path d={`M${x} ${y - h / 2} Q${x + w * 0.5} ${y - h / 2 - 30} ${x + w} ${y - h / 2} L${x + w} ${y + h / 2} Q${x + w * 0.5} ${y + h / 2 - 30} ${x} ${y + h / 2} Z`} fill={C.crema} {...sw} />
      {[0.25, 0.45, 0.65].map((k, i) => <path key={i} d={`M${x - w * 0.8} ${y - h / 2 + h * k} L${x - w * 0.15} ${y - h / 2 + h * k - 8}`} stroke={C.turquesa} strokeWidth={7} strokeLinecap="round" />)}
      {[0.25, 0.45, 0.65].map((k, i) => <path key={'b' + i} d={`M${x + w * 0.15} ${y - h / 2 + h * k - 8} L${x + w * 0.8} ${y - h / 2 + h * k}`} stroke={C.turquesa} strokeWidth={7} strokeLinecap="round" />)}
    </Capa>
  );
};

/** Etiqueta pastilla tinta con texto crema (sobre dibujos). */
export const EtiquetaJ: React.FC<{texto: string; x?: number; y?: number; tam?: number; en?: number; hasta?: number; claro?: boolean}> = ({texto, x = 540, y = 700, tam = 48, en = 0, hasta, claro = false}) => {
  const w = texto.length * tam * 0.72 + 60;
  return (
    <Capa en={en} hasta={hasta}>
      <rect x={x - w / 2} y={y - tam * 0.85} width={w} height={tam * 1.5} rx={tam * 0.4} fill={claro ? C.mostaza : T} {...sw} strokeWidth={5} />
      <text x={x} y={y + tam * 0.3} textAnchor="middle" fontFamily={F.titular} fontSize={tam} fill={claro ? T : C.crema}>{texto}</text>
    </Capa>
  );
};

const Forma: React.FC<{k: number; x: number; y: number; r: number; fill: string}> = ({k, x, y, r, fill}) => {
  if (k === 0) return <circle cx={x} cy={y} r={r} fill={fill} {...sw} />;
  if (k === 1) return <rect x={x - r} y={y - r} width={2 * r} height={2 * r} rx={6} fill={fill} {...sw} />;
  if (k === 2) return <path d={`M${x} ${y - r * 1.15} L${x + r * 1.15} ${y + r * 0.9} L${x - r * 1.15} ${y + r * 0.9} Z`} fill={fill} {...sw} />;
  if (k === 3) return <path d={`M${x} ${y - r * 1.25} L${x + r * 1.25} ${y} L${x} ${y + r * 1.25} L${x - r * 1.25} ${y} Z`} fill={fill} {...sw} />;
  const pts = Array.from({length: 6}).map((_, j) => `${x + r * 1.15 * Math.cos((j / 6) * Math.PI * 2)} ${y + r * 1.15 * Math.sin((j / 6) * Math.PI * 2)}`);
  return <path d={`M${pts.join(' L')} Z`} fill={fill} {...sw} />;
};

/** Cinco partidos genéricos (formas sin color de partido) cuyas flechas convergen en un único papel. aparecen: tiempos de cada forma; papelEn. */
export const PropuestaJ: React.FC<{aparecen: number[]; papelEn?: number; yFormas?: number; yPapel?: number; en?: number; hasta?: number}> = ({aparecen, papelEn = 0.2, yFormas = 690, yPapel = 930, en = 0, hasta}) => {
  const t = useT();
  const xs = [160, 335, 510, 685, 860];
  const px = 520;
  const pp = easeIO(cl((t - papelEn) / 0.5));
  return (
    <Capa en={en} hasta={hasta}>
      {xs.map((x, i) => {
        const u = cl((t - aparecen[i]) / 0.35);
        const v = easeIO(cl((t - aparecen[i] - 0.3) / 0.6));
        const x1 = x + (px - x) * 0.55;
        const y1 = yPapel - 135;
        const y0 = yFormas + 75;
        return (
          <g key={i}>
            <g opacity={u} transform={`translate(${x} ${yFormas}) scale(${0.6 + 0.4 * u}) translate(${-x} ${-yFormas})`}>
              <Forma k={i} x={x} y={yFormas} r={50} fill={i % 2 ? C.piedra : C.crema} />
            </g>
            {v > 0 ? <path d={`M${x} ${y0} L${x + (x1 - x) * v} ${y0 + (y1 - y0) * v}`} stroke={T} strokeWidth={7} strokeLinecap="round" /> : null}
            {v > 0.95 ? <path d={`M${x1 - 14} ${y1 - 24} L${x1} ${y1} L${x1 + 22} ${y1 - 14}`} fill="none" {...sw} strokeWidth={7} /> : null}
          </g>
        );
      })}
      <g opacity={pp} transform={`translate(0 ${(1 - pp) * 40})`}>
        <rect x={px - 230} y={yPapel - 110} width={460} height={230} rx={14} fill={C.crema} {...sw} strokeWidth={8} />
        <rect x={px - 230} y={yPapel - 110} width={460} height={52} rx={14} fill={C.mostaza} {...sw} strokeWidth={8} />
        <text x={px} y={yPapel - 2} textAnchor="middle" fontFamily={F.titular} fontSize={54} fill={T}>PROPUESTA</text>
        <text x={px} y={yPapel + 70} textAnchor="middle" fontFamily={F.titular} fontSize={54} fill={T}>CONJUNTA</text>
      </g>
    </Capa>
  );
};

/** Icono plano de hemiciclo (puntos en semicírculos, sin escudo ni colores de partido). x,y = centro de la base. */
export const HemiJ: React.FC<{x?: number; y?: number; tam?: number; en?: number; hasta?: number}> = ({x = 680, y = 760, tam = 280, en = 0, hasta}) => {
  const filas = [{r: 0.5, n: 7}, {r: 0.75, n: 11}, {r: 1, n: 15}];
  return (
    <Capa en={en} hasta={hasta}>
      {filas.map((f, k) => Array.from({length: f.n}).map((_, j) => {
        const a = Math.PI * (1 - j / (f.n - 1));
        return <circle key={k + '-' + j} cx={x + Math.cos(a) * f.r * tam / 2} cy={y - Math.sin(a) * f.r * tam / 2} r={tam * 0.035} fill={(j + k) % 3 === 0 ? C.piedra : T} />;
      }))}
      <path d={`M${x - tam / 2 - 20} ${y + 24} L${x + tam / 2 + 20} ${y + 24}`} {...sw} />
    </Capa>
  );
};

/** Carpetas "QUEJAS" y "RECURSOS" que caen sobre una mesa; cada una recibe un check turquesa. */
export const CarpetasJ: React.FC<{y?: number; en?: number; checkEn?: number; hasta?: number}> = ({y = 900, en = 0, checkEn = 1.4, hasta}) => {
  const t = useT();
  const carp = (x: number, texto: string, d: number, ck: number) => {
    const u = easeIO(cl((t - en - d) / 0.5));
    const dy = (1 - u) * -240;
    const kc = cl((t - ck) / 0.3);
    return (
      <g key={texto} opacity={u} transform={`translate(0 ${dy})`}>
        <path d={`M${x - 160} ${y - 110} L${x - 160} ${y + 90} L${x + 160} ${y + 90} L${x + 160} ${y - 110} L${x - 10} ${y - 110} L${x - 40} ${y - 150} L${x - 160} ${y - 150} Z`} fill={C.mostaza} {...sw} strokeWidth={8} />
        <text x={x} y={y + 22} textAnchor="middle" fontFamily={F.titular} fontSize={44} fill={T}>{texto}</text>
        {kc > 0 ? (
          <g transform={`translate(${x + 140} ${y - 100}) scale(${0.4 + 0.6 * kc})`} opacity={kc}>
            <circle r={44} fill={C.turquesa} {...sw} strokeWidth={6} />
            <path d="M-20 2 L-6 18 L22 -14" fill="none" stroke={C.crema} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ) : null}
      </g>
    );
  };
  return (
    <Capa en={0} hasta={hasta}>
      <rect x={110} y={y + 90} width={760} height={34} rx={8} fill={C.piedra} {...sw} />
      {carp(300, 'QUEJAS', 0.1, checkEn)}
      {carp(640, 'RECURSOS', 0.6, checkEn + 0.5)}
    </Capa>
  );
};

/** Escalera con tres edificios de "junta provincial" por la que baja un documento INSTRUCCIÓN (se iluminan al pasar). */
export const InstruccionJ: React.FC<{en?: number; baja?: number; dur?: number; hasta?: number}> = ({en = 0, baja = 0.6, dur = 2.4, hasta}) => {
  const t = useT();
  const tops = [800, 890, 980];
  const xs = [100, 370, 640];
  const u = cl((t - baja) / dur);
  // posición del documento: tres tramos
  const seg = Math.min(2, Math.floor(u * 3));
  const loc = easeIO(cl(u * 3 - seg));
  const pos = (k: number) => ({x: xs[k] + 135, y: tops[k] - 215});
  const a = seg === 0 ? {x: 235, y: 560} : pos(seg - 1);
  const b = pos(seg);
  const dx = a.x + (b.x - a.x) * loc;
  const dy = a.y + (b.y - a.y) * loc + (u >= 1 ? 0 : -24 * Math.sin(Math.PI * loc));
  const llega = (k: number) => u >= (k + 1) / 3 - 0.04;
  return (
    <Capa en={en} hasta={hasta}>
      {xs.map((x, k) => (
        <g key={k}>
          <rect x={x} y={tops[k]} width={270} height={1090 - tops[k]} fill={C.piedra} {...sw} strokeWidth={6} />
          <g transform={`translate(${x + 135} ${tops[k]})`}>
            <path d="M-70 0 L-70 -80 L0 -125 L70 -80 L70 0 Z" fill={llega(k) ? C.mostaza : C.crema} {...sw} strokeWidth={6} />
            <path d="M-38 0 L-38 -70 M0 0 L0 -70 M38 0 L38 -70" stroke={T} strokeWidth={7} strokeLinecap="round" />
          </g>
        </g>
      ))}
      <g transform={`translate(${dx} ${dy})`}>
        <rect x={-165} y={-55} width={330} height={110} rx={12} fill={C.crema} {...sw} strokeWidth={7} />
        <rect x={-165} y={-55} width={330} height={26} rx={12} fill={C.mostaza} {...sw} strokeWidth={7} />
        <text x={0} y={30} textAnchor="middle" fontFamily={F.titular} fontSize={36} fill={T}>INSTRUCCIÓN</text>
      </g>
    </Capa>
  );
};

/** Gráfico de barras de encuesta de EJEMPLO (sin cifras) con lupa y check turquesa. La etiqueta EJEMPLO está desde el primer fotograma. */
export const EncuestaJ: React.FC<{y?: number; lupaEn?: number; checkEn?: number; en?: number; hasta?: number}> = ({y = 1020, lupaEn = 0.5, checkEn = 2.3, en = 0, hasta}) => {
  const t = useT();
  const hs = [170, 280, 215, 120];
  const xs = [190, 360, 530, 700];
  const lp = easeIO(cl((t - lupaEn) / 1.8));
  const lx = 190 + 510 * lp;
  const ly = y - 330 - 40 * Math.sin(lp * Math.PI);
  const kc = cl((t - checkEn) / 0.3);
  return (
    <Capa en={-1} hasta={hasta}>
      <path d={`M120 ${y} L830 ${y}`} {...sw} />
      <path d={`M120 ${y} L120 ${y - 400}`} {...sw} />
      {hs.map((h, i) => <rect key={i} x={xs[i] - 55} y={y - h} width={110} height={h} rx={6} fill={i === 1 ? C.mostaza : i % 2 ? C.piedra : C.turquesa} {...sw} strokeWidth={6} />)}
      <g transform={`translate(${lx} ${ly})`}>
        <circle r={70} fill="rgba(244,239,230,0.55)" {...sw} strokeWidth={9} />
        <path d="M50 50 L112 112" {...sw} strokeWidth={16} />
      </g>
      {kc > 0 ? (
        <g transform={`translate(790 ${y - 330}) scale(${0.4 + 0.6 * kc})`} opacity={kc}>
          <circle r={62} fill={C.turquesa} {...sw} strokeWidth={7} />
          <path d="M-28 4 L-8 26 L30 -20" fill="none" stroke={C.crema} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}
      <rect x={120} y={y - 470} width={290} height={76} rx={20} fill={T} />
      <text x={265} y={y - 417} textAnchor="middle" fontFamily={F.titular} fontSize={48} fill={C.crema}>EJEMPLO</text>
    </Capa>
  );
};

/** Hoja de calendario con el día marcado en mostaza. */
export const CalendarioJ: React.FC<{x?: number; y?: number; mes?: string; dia?: string; marcaEn?: number; en?: number; hasta?: number}> = ({x = 540, y = 840, mes = 'OCT', dia = '26', marcaEn = 0.8, en = 0, hasta}) => {
  const t = useT();
  const m = easeIO(cl((t - marcaEn) / 0.5));
  return (
    <Capa en={en} hasta={hasta}>
      <rect x={x - 270} y={y - 230} width={540} height={460} rx={26} fill={C.crema} {...sw} strokeWidth={9} />
      <rect x={x - 270} y={y - 230} width={540} height={120} rx={26} fill={T} />
      <rect x={x - 270} y={y - 170} width={540} height={60} fill={T} />
      <text x={x} y={y - 140} textAnchor="middle" fontFamily={F.titular} fontSize={70} fill={C.crema}>{mes}</text>
      <path d={`M${x - 150} ${y - 250} L${x - 150} ${y - 200} M${x + 150} ${y - 250} L${x + 150} ${y - 200}`} stroke={T} strokeWidth={14} strokeLinecap="round" />
      <circle cx={x} cy={y + 50} r={140 * m} fill={C.mostaza} opacity={m} />
      <text x={x} y={y + 125} textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize={240} fill={T}>{dia}</text>
    </Capa>
  );
};

/** Franja de tiempo de pantalla repartida en tramos de distinto ancho (A, B, C con formas; sin partidos ni colores reales). Etiqueta EJEMPLO desde el primer fotograma. */
export const FranjaJ: React.FC<{y?: number; en?: number; tramosEn?: number; hasta?: number}> = ({y = 900, en = 0, tramosEn = 0.5, hasta}) => {
  const t = useT();
  const k = easeIO(cl((t - tramosEn) / 1.2));
  const x0 = 130, W = 800;
  const ws = [400, 260, 140];
  const fills = [T, C.piedra, C.mostaza];
  let acc = 0;
  return (
    <Capa en={-1} hasta={hasta}>
      <rect x={x0 - 10} y={y - 70} width={W + 20} height={140} rx={16} fill={C.crema} {...sw} />
      {ws.map((w, i) => {
        const ini = acc;
        acc += w;
        const x = x0 + ini * k, ww = w * k;
        return <rect key={i} x={x} y={y - 60} width={Math.max(0, ww)} height={120} fill={fills[i]} stroke={C.crema} strokeWidth={4} />;
      })}
      {(() => {
        let a2 = 0;
        return ws.map((w, i) => {
          const cx = x0 + (a2 + w / 2) * k;
          a2 += w;
          return (
            <g key={'f' + i} opacity={k}>
              <Forma k={i} x={cx} y={y - 150} r={44} fill={fills[i] === T ? C.crema : C.crema} />
              <text x={cx} y={y - 150 + 20} textAnchor="middle" fontFamily={F.titular} fontSize={56} fill={T}>{['A', 'B', 'C'][i]}</text>
            </g>
          );
        });
      })()}
      <rect x={x0} y={y + 120} width={290} height={76} rx={20} fill={T} />
      <text x={x0 + 145} y={y + 173} textAnchor="middle" fontFamily={F.titular} fontSize={48} fill={C.crema}>EJEMPLO</text>
    </Capa>
  );
};

/** Plató plano: cámara, focos y dos atriles (sin rostros ni logos). x,y = centro; esc = escala. */
export const PlatoJ: React.FC<{x?: number; y?: number; esc?: number; en?: number; hasta?: number}> = ({x = 540, y = 800, esc = 1, en = 0, hasta}) => {
  const t = useT();
  const pulso = 0.75 + 0.25 * Math.sin(t * 4);
  return (
    <Capa en={en} hasta={hasta}>
      <g transform={`translate(${x} ${y}) scale(${esc})`}>
        <rect x={-390} y={-190} width={780} height={380} rx={22} fill="rgba(141,153,174,0.28)" {...sw} strokeWidth={7} />
        {[-130, 130].map((fx, i) => (
          <g key={i}>
            <path d={`M${fx - 30} -190 L${fx - 120} -60 L${fx + 120} -60 L${fx + 30} -190 Z`} fill={C.mostaza} opacity={0.35 * pulso + 0.15} />
            <rect x={fx - 46} y={-216} width={92} height={46} rx={10} fill={T} />
          </g>
        ))}
        <g transform="translate(-260 40)">
          <rect x={-70} y={-52} width={120} height={84} rx={12} fill={T} />
          <path d="M50 -30 L96 -48 L96 28 L50 10 Z" fill={C.mostaza} {...sw} strokeWidth={6} />
          <circle cx={-18} cy={-10} r={26} fill={C.crema} {...sw} strokeWidth={6} />
          <path d="M-10 32 L-40 120 M-10 32 L20 120 M-10 32 L-10 122" stroke={T} strokeWidth={9} strokeLinecap="round" />
        </g>
        {[60, 230].map((ax, i) => (
          <g key={i}>
            <path d={`M${ax - 70} 150 L${ax - 52} -20 L${ax + 52} -20 L${ax + 70} 150 Z`} fill={C.mostaza} {...sw} strokeWidth={7} />
            <path d={`M${ax - 30} -20 L${ax} -50 L${ax + 30} -20`} fill="none" {...sw} strokeWidth={6} />
          </g>
        ))}
      </g>
    </Capa>
  );
};

/** Lista de las 4 reglas: cada una se enciende (icono mostaza, texto pleno) en su tiempo. */
export const ReglasJ: React.FC<{y0?: number; paso?: number; tiempos: number[]; en?: number; hasta?: number}> = ({y0 = 790, paso = 100, tiempos, en = 0, hasta}) => {
  const t = useT();
  const textos = ['PLURALISMO', 'IGUALDAD', 'PROPORCIONALIDAD', 'NEUTRALIDAD'];
  const icono = (k: number, x: number, y: number, col: string) => {
    if (k === 0) return (
      <g>
        <path d={`M${x} ${y - 30} L${x} ${y + 30} M${x - 28} ${y + 30} L${x + 28} ${y + 30} M${x - 32} ${y - 22} L${x + 32} ${y - 22}`} fill="none" {...sw} strokeWidth={6} />
        <path d={`M${x - 32} ${y - 22} L${x - 44} ${y + 6} L${x - 20} ${y + 6} Z M${x + 32} ${y - 22} L${x + 20} ${y + 6} L${x + 44} ${y + 6} Z`} fill={col} {...sw} strokeWidth={5} />
      </g>
    );
    if (k === 1) return <path d={`M${x - 30} ${y - 12} L${x + 30} ${y - 12} M${x - 30} ${y + 14} L${x + 30} ${y + 14}`} {...sw} strokeWidth={12} />;
    if (k === 2) return (
      <g>
        <circle cx={x - 18} cy={y - 18} r={9} fill="none" {...sw} strokeWidth={6} />
        <circle cx={x + 18} cy={y + 18} r={9} fill="none" {...sw} strokeWidth={6} />
        <path d={`M${x + 24} ${y - 28} L${x - 24} ${y + 28}`} {...sw} strokeWidth={7} />
      </g>
    );
    return (
      <g>
        <circle cx={x} cy={y} r={28} fill={col} {...sw} strokeWidth={6} />
        <path d={`M${x - 20} ${y} L${x + 20} ${y}`} {...sw} strokeWidth={6} />
      </g>
    );
  };
  return (
    <Capa en={en} hasta={hasta}>
      {textos.map((tx, i) => {
        const y = y0 + i * paso;
        const u = cl((t - tiempos[i]) / 0.3);
        const col = u > 0 ? C.crema : C.crema;
        return (
          <g key={i} opacity={0.35 + 0.65 * u}>
            <rect x={90} y={y - 44} width={88} height={88} rx={18} fill={u > 0.5 ? C.mostaza : C.crema} {...sw} strokeWidth={6} />
            {icono(i, 134, y, col)}
            <text x={205} y={y + 22} fontFamily={F.titular} fontSize={64} fill={T}>{tx}</text>
          </g>
        );
      })}
    </Capa>
  );
};

export const REGISTRO_020: Record<string, React.FC<any>> = {
  mesaJ: MesaJ,
  placaJ: PlacaJ,
  aniosJ: AniosJ,
  libroJ: LibroJ,
  etiquetaJ: EtiquetaJ,
  propuestaJ: PropuestaJ,
  hemiJ: HemiJ,
  carpetasJ: CarpetasJ,
  instruccionJ: InstruccionJ,
  encuestaJ: EncuestaJ,
  calendarioJ: CalendarioJ,
  franjaJ: FranjaJ,
  platoJ: PlatoJ,
  reglasJ: ReglasJ,
};
