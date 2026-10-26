import {spring, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';

/** Entrada con muelle suave (damping 13). Devuelve 0..1. `en` en segundos desde el inicio de la escena. */
export const useEntrada = (en = 0, damping = 13) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - Math.round(en * fps), fps, config: {damping, stiffness: 120, mass: 0.8}});
};

/** Salida rápida (7 fotogramas) justo antes de `hasta` segundos de la escena. */
export const useSalida = (hasta?: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (hasta === undefined) return 1;
  const f = hasta * fps;
  return interpolate(frame, [f - 7, f], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};

/** Número con separador de miles español (1.234). */
export const miles = (n: number) => {
  const s = Math.round(n).toString();
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
