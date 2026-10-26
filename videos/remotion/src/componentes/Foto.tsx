import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../tema';
import {useEntrada, useSalida} from './util';
import {Notas} from './Notas';

/**
 * Foto real con marco de marca (borde tinta + sombra plana) y Ken Burns suave.
 * forma: 'rect' (pastilla redondeada), 'circulo' (retrato: marco mostaza) o 'completa' (a pantalla completa, con velo opcional).
 * x,y = centro. `zoom` [de, a] a lo largo de `dur` segundos desde `en`; `pan` [dx, dy] en px. `foco` = object-position.
 * `credito` (36 px, texto exacto de la tabla del guion) y `notas` se pintan abajo, en la zona segura, con el componente Notas.
 */
export const Foto: React.FC<{
  src: string; forma?: 'rect' | 'circulo' | 'completa'; x?: number; y?: number; ancho?: number; alto?: number; foco?: string;
  zoom?: [number, number]; pan?: [number, number]; dur?: number; en?: number; hasta?: number; velo?: number;
  credito?: string; notas?: string[]; sobre?: 'claro' | 'oscuro'; mostrarCredito?: boolean; revela?: number;
}> = ({src, forma = 'rect', x = 540, y = 760, ancho = 900, alto = 600, foco = '50% 50%', zoom = [1.02, 1.14], pan = [0, 0], dur = 4, en = 0, hasta, velo = 0, credito, notas = [], sobre = 'claro', revela}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const k = interpolate(frame, [en * fps, (en + dur) * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const esc = zoom[0] + (zoom[1] - zoom[0]) * k;
  const circ = forma === 'circulo';
  const comp = forma === 'completa';
  const w = comp ? 1080 : circ ? alto : ancho;
  const h = comp ? 1920 : alto;
  const marco = {
    position: 'absolute' as const, left: comp ? 0 : x - w / 2, top: comp ? 0 : y - h / 2, width: w, height: h, overflow: 'hidden' as const,
    borderRadius: comp ? 0 : circ ? '50%' : 30, boxSizing: 'border-box' as const,
    border: comp ? 'none' : circ ? `14px solid ${C.mostaza}` : `8px solid ${C.tinta}`,
    boxShadow: comp ? 'none' : circ ? '0 14px 0 rgba(20,33,61,0.25)' : '0 14px 0 rgba(20,33,61,0.25)',
    background: C.piedra, opacity: (revela ? 1 : Math.min(p, 1)) * s,
    clipPath: revela ? `inset(0 ${(1 - interpolate(frame, [en * fps, (en + revela) * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (q) => q * q * (3 - 2 * q)})) * 100}% 0 0)` : undefined,
    transform: comp ? undefined : `scale(${0.92 + 0.08 * p})`,
  };
  const lineas = [...notas, ...(credito ? [credito] : [])];
  return (
    <>
      <div style={marco}>
        <Img src={staticFile(`imagenes/${src}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: foco, transform: `translate(${pan[0] * k}px, ${pan[1] * k}px) scale(${esc})`, transformOrigin: foco}} />
        {velo > 0 ? <div style={{position: 'absolute', inset: 0, background: `rgba(20,33,61,${velo})`}} /> : null}
      </div>
      {lineas.length ? <Notas lineas={lineas} sobre={sobre} en={en} hasta={hasta} /> : null}
    </>
  );
};

/** Barrido antes/después: la foto B se desliza sobre la A (de derecha a izquierda). Etiquetas en pastilla tinta (64 px). */
export const Comparador: React.FC<{
  srcA: string; srcB: string; x?: number; y?: number; ancho?: number; alto?: number; focoA?: string; focoB?: string;
  etiquetaA?: string; etiquetaB?: string; barridoEn?: number; barridoDur?: number; en?: number; hasta?: number; dur?: number;
  creditoA?: string; creditoB?: string;
}> = ({srcA, srcB, x = 540, y = 800, ancho = 900, alto = 620, focoA = '50% 40%', focoB = '50% 40%', etiquetaA = 'ANTES', etiquetaB = 'DESPUÉS', barridoEn = 1, barridoDur = 0.6, en = 0, hasta, dur = 4, creditoA, creditoB}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = useEntrada(en);
  const s = useSalida(hasta);
  const w = interpolate(frame, [barridoEn * fps, (barridoEn + barridoDur) * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => t * t * (3 - 2 * t)});
  const k = interpolate(frame, [en * fps, (en + dur) * fps], [1.02, 1.12], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tx = ancho * (1 - w);
  const pastilla = (txt: string, lado: 'izq' | 'der') => (
    <div style={{position: 'absolute', top: 18, [lado === 'izq' ? 'left' : 'right']: 18, fontFamily: F.texto, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: C.crema, background: C.tinta, padding: '6px 22px', borderRadius: 14}}>{txt}</div>
  );
  return (
    <>
      <div style={{position: 'absolute', left: x - ancho / 2, top: y - alto / 2, width: ancho, height: alto, borderRadius: 30, overflow: 'hidden', boxSizing: 'border-box', border: `8px solid ${C.tinta}`, boxShadow: '0 14px 0 rgba(20,33,61,0.25)', opacity: Math.min(p, 1) * s, transform: `scale(${0.92 + 0.08 * p})`, background: C.piedra}}>
        <Img src={staticFile(`imagenes/${srcA}`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: focoA, transform: `scale(${k})`}} />
        <div style={{position: 'absolute', inset: 0, overflow: 'hidden', transform: `translateX(${tx}px)`}}>
          <div style={{position: 'absolute', inset: 0, transform: `translateX(${-tx}px)`}}>
            <Img src={staticFile(`imagenes/${srcB}`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: focoB, transform: `scale(${k})`}} />
          </div>
        </div>
        {w > 0.02 && w < 0.98 ? <div style={{position: 'absolute', top: 0, bottom: 0, left: tx - 5, width: 10, background: C.mostaza}} /> : null}
        {w < 0.5 ? pastilla(etiquetaA, 'izq') : pastilla(etiquetaB, 'izq')}
      </div>
      {creditoA ? <Notas lineas={[creditoA]} en={en} hasta={barridoEn + barridoDur / 2} /> : null}
      {creditoB ? <Notas lineas={[creditoB]} en={barridoEn + barridoDur / 2} hasta={hasta} /> : null}
    </>
  );
};
