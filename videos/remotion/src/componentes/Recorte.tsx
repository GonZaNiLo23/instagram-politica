import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useSalida} from './util';
import {Notas} from './Notas';

/**
 * Objeto real recortado (PNG transparente de `videos/recorte/recortar.mjs`) con estilo "pegatina de collage":
 * contorno blanco, sombra plana y entrada con rebote. Para objetos reales (coche de policía, urna, edificio…)
 * en lugar de dibujarlos; los gráficos siguen siendo vectoriales.
 * x,y = centro; `ancho` en px (el alto sale de la proporción). `giro` en grados (±4 queda natural).
 * `desde`: por dónde entra ('abajo', 'izquierda', 'derecha' o 'escala'). `flota` = vaivén suave mientras está en pantalla.
 * `credito` (texto exacto de la tabla del guion) va abajo con Notas, como en Foto.
 */
export const Recorte: React.FC<{
  src: string; x?: number; y?: number; ancho?: number; giro?: number; desde?: 'abajo' | 'izquierda' | 'derecha' | 'escala';
  flota?: boolean; contorno?: number; en?: number; hasta?: number; credito?: string; notas?: string[]; sobre?: 'claro' | 'oscuro';
}> = ({src, x = 540, y = 820, ancho = 820, giro = -3, desde = 'abajo', flota = true, contorno = 10, en = 0, hasta, credito, notas = [], sobre = 'claro'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useSalida(hasta);
  const p = spring({frame: frame - en * fps, fps, config: {damping: 12, stiffness: 140, mass: 0.8}});
  if (frame < en * fps) return null;
  const dx = desde === 'izquierda' ? -700 * (1 - p) : desde === 'derecha' ? 700 * (1 - p) : 0;
  const dy = desde === 'abajo' ? 500 * (1 - p) : 0;
  const esc = desde === 'escala' ? 0.6 + 0.4 * p : 1;
  const vaiven = flota ? Math.sin((frame - en * fps) / (fps * 0.9)) * 6 : 0;
  const rot = giro * p + (flota ? Math.sin((frame - en * fps) / (fps * 1.4)) * 0.6 : 0);
  // Contorno blanco con 8 sombras sin desenfoque alrededor del canal alfa + sombra plana de marca
  const c = contorno;
  const sombras = [[c, 0], [-c, 0], [0, c], [0, -c], [c * 0.7, c * 0.7], [-c * 0.7, c * 0.7], [c * 0.7, -c * 0.7], [-c * 0.7, -c * 0.7]]
    .map(([a, b]) => `drop-shadow(${a}px ${b}px 0 #FFFFFF)`).join(' ');
  const lineas = [...notas, ...(credito ? [credito] : [])];
  return (
    <>
      <Img
        src={staticFile(`imagenes/${src}`)}
        style={{
          position: 'absolute', left: x - ancho / 2, top: 0, width: ancho, height: 'auto',
          transform: `translate(${dx}px, ${y + dy + vaiven}px) translateY(-50%) rotate(${rot}deg) scale(${esc})`,
          filter: `${sombras} drop-shadow(0 16px 0 rgba(20,33,61,0.28))`,
          opacity: Math.min(1, p * 1.5) * s,
        }}
      />
      {lineas.length ? <Notas lineas={lineas} sobre={sobre} en={en} hasta={hasta} /> : null}
    </>
  );
};
