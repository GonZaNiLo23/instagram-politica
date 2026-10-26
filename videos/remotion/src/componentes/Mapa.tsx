import React from 'react';
import {interpolate, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, W} from '../tema';
import {useEntrada, useSalida} from './util';

// Silueta simplificada de Francia metropolitana [lon, lat]
const FRANCIA: [number, number][] = [
  [2.5, 51.05], [1.6, 50.9], [1.6, 50.2], [0.1, 49.5], [-1.2, 49.7], [-1.6, 49.65], [-1.4, 48.6], [-2.4, 48.6], [-3.5, 48.8], [-4.6, 48.7],
  [-4.7, 48.0], [-3.4, 47.7], [-2.2, 47.2], [-1.2, 46.2], [-1.1, 45.5], [-1.3, 44.6], [-1.5, 43.4], [-0.7, 43.1], [0.7, 42.8], [1.7, 42.5],
  [3.1, 42.45], [3.0, 43.1], [4.2, 43.5], [5.0, 43.4], [5.4, 43.2], [6.4, 43.1], [7.5, 43.75], [6.9, 44.4], [7.1, 45.0], [6.8, 45.8],
  [6.1, 46.3], [7.0, 47.4], [7.6, 47.6], [8.2, 48.9], [6.4, 49.45], [5.9, 49.5], [4.8, 50.1], [4.2, 50.3], [3.2, 50.8],
];
const LON0 = -5, LAT1 = 51.2, COS = Math.cos((46 * Math.PI) / 180);
export const CIUDADES_FR: Record<string, [number, number]> = {
  París: [2.35, 48.86], Lyon: [4.83, 45.76], Marsella: [5.37, 43.3], Burdeos: [-0.58, 44.84], Lille: [3.06, 50.63], Limoges: [1.26, 45.83], 'Saint-Étienne': [4.39, 45.44],
};

/** Mapa plano de Francia (silueta tinta) con puntos mostaza que se encienden uno a uno.
 *  `puntos`: [{nombre (de CIUDADES_FR), en}]. `zoom`: acerca el mapa a un punto en `zoom.en` (el mapa se atenúa). */
export const Mapa: React.FC<{puntos: {nombre: string; en: number}[]; x?: number; y?: number; ancho?: number; zoom?: {punto: string; en: number; escala?: number; aY?: number}; recorte?: {x: number; y: number; ancho: number; alto: number}; hasta?: number}> = ({
  puntos, x = W / 2, y = 790, ancho = 640, zoom, recorte, hasta,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = ancho / (13.3 * COS); // px por grado de latitud
  const alto = (LAT1 - 41.3) * k;
  const px = (lon: number, lat: number): [number, number] => [(lon - LON0) * COS * k, (LAT1 - lat) * k];
  const poly = FRANCIA.map(([lo, la]) => px(lo, la).join(',')).join(' ');
  const e = useEntrada(0) * useSalida(hasta);
  const z = zoom ? interpolate(frame, [zoom.en * fps, (zoom.en + 0.6) * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)}) : 0;
  const esc = 1 + z * ((zoom?.escala ?? 2.4) - 1);
  const [zx, zy] = zoom ? px(...CIUDADES_FR[zoom.punto]) : [0, 0];
  const cx = x - ancho / 2, cy = y - alto / 2;
  const tx = (W / 2 - (cx + zx)) * z, ty = ((zoom?.aY ?? y) - (cy + zy)) * z;
  const ox = recorte ? recorte.x : 0, oy = recorte ? recorte.y : 0;
  const mapa = (
    <div style={{position: 'absolute', left: cx - ox, top: cy - oy, width: ancho, height: alto, opacity: Math.min(e, 1) * (1 - 0.6 * z), transform: `translate(${tx}px, ${ty}px) scale(${esc})`, transformOrigin: `${zx}px ${zy}px`}}>
      <svg width={ancho} height={alto} style={{overflow: 'visible'}}>
        <polygon points={poly} fill={C.tinta} stroke={C.tinta} strokeWidth={6} strokeLinejoin="round" />
        {puntos.map((pt, i) => {
          const [cxp, cyp] = px(...CIUDADES_FR[pt.nombre]);
          const t = (frame - pt.en * fps) / fps;
          if (t < 0) return null;
          const pulso = interpolate(t, [0, 0.7], [0, 1], {extrapolateRight: 'clamp'});
          return (
            <g key={i} transform={`translate(${cxp} ${cyp}) scale(${1 / esc})`}>
              <circle r={14 + 46 * pulso} fill="none" stroke={C.mostaza} strokeWidth={5} opacity={1 - pulso} />
              <circle r={interpolate(t, [0, 0.25], [0, 17], {extrapolateRight: 'clamp'})} fill={C.mostaza} stroke={C.crema} strokeWidth={4} />
            </g>
          );
        })}
      </svg>
    </div>
  );
  return recorte ? <div style={{position: 'absolute', left: recorte.x, top: recorte.y, width: recorte.ancho, height: recorte.alto, overflow: 'hidden', borderRadius: 32}}>{mapa}<div style={{position: 'absolute', inset: 0, borderRadius: 32, boxShadow: `inset 0 0 0 6px ${C.tinta}`}} /></div> : mapa;
};
