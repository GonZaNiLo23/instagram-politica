import React from 'react';
import {OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA, SUBS} from '../tema';
import {useEntrada, useSalida} from './util';
import {Notas} from './Notas';

/**
 * Formato AL MINUTO (2026-10-28; reglas en estilo/guia-estilo.md → "Formato Al minuto").
 * El clip real a pantalla completa manda; encima, la caja de titular fija, los subtítulos literales del clip y "El dato que falta".
 * Todos los tiempos (`en`, `hasta`, `bajarEn`, `lineas[].inicio/fin`) en segundos de la escena.
 */

/** Clip real a pantalla completa (videos/piezas/NNN/clips/<src>, ya recortado y pixelado con videos/scripts/clip.mjs).
 * `desde`: segundo del archivo en el que empieza. `volumen` del sonido original; en los tramos `bajarEn` baja a `volumenBajo` (para la voz).
 * Velo tinta degradado arriba y abajo para leer la caja y los subtítulos. `credito` ("Vídeo: La Moncloa") siempre visible abajo. */
export const Clip: React.FC<{
  src: string; desde?: number; volumen?: number; bajarEn?: [number, number][]; volumenBajo?: number; foco?: string;
  zoom?: [number, number]; dur?: number; en?: number; credito?: string; velo?: number; fundidoFin?: number;
}> = ({src, desde = 0, volumen = 1, bajarEn = [], volumenBajo = 0.15, foco = '50% 50%', zoom = [1, 1], dur = 10, en = 0, credito, velo = 0.55, fundidoFin}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = interpolate(frame, [en * fps, (en + dur) * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const esc = zoom[0] + (zoom[1] - zoom[0]) * k;
  // Volumen por fotograma: baja (con rampa de 0,3 s) en los tramos de voz
  const vol = (f: number) => {
    const t = f / fps + en;
    let v = volumen;
    for (const [a, b] of bajarEn) {
      const dentro = interpolate(t, [a - 0.3, a, b, b + 0.3], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      v = Math.min(v, volumen - (volumen - volumenBajo) * dentro);
    }
    if (fundidoFin !== undefined) v *= interpolate(t, [fundidoFin - 0.1, fundidoFin], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
    return v;
  };
  return (
    <>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: C.tinta}}>
        <OffthreadVideo src={staticFile(`clips/${src}`)} startFrom={Math.round(desde * fps)} volume={vol}
          style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: foco, transform: `scale(${esc})`, transformOrigin: foco}} />
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(20,33,61,${velo}) 0%, rgba(20,33,61,0) 34%, rgba(20,33,61,0) 52%, rgba(20,33,61,${velo + 0.15}) 100%)`}} />
      </div>
      {credito ? <Notas lineas={[credito]} sobre="oscuro" tamano={34} /> : null}
    </>
  );
};

/** Caja de titular fija (todo el vídeo): etiqueta mostaza "AL MINUTO · fecha" y titular (máx. 8 palabras) en crema sobre tinta. */
export const TitularAM: React.FC<{texto: string; fecha?: string; etiqueta?: string; y?: number; tamano?: number; en?: number}> = ({texto, fecha, etiqueta = 'AL MINUTO', y = 345, tamano = 70, en = 0}) => {
  // Regla de la plantilla: caja 100 % opaca desde el fotograma 1, sin fundido ni movimiento de entrada
  return (
    <div style={{position: 'absolute', left: SEGURA.izq, top: y, width: SEGURA.ancho}}>
      <div style={{display: 'inline-block', fontFamily: F.texto, fontWeight: 700, fontSize: 36, letterSpacing: 2, color: C.tinta, background: C.mostaza, padding: '6px 18px', borderRadius: '14px 14px 0 0'}}>
        {etiqueta}{fecha ? <span style={{fontWeight: 600, letterSpacing: 0.5}}> · {fecha}</span> : null}
      </div>
      <div style={{fontFamily: F.titular, fontSize: tamano, lineHeight: 1.08, color: C.crema, background: C.tinta, padding: '18px 26px 22px', borderRadius: '0 22px 22px 22px', borderLeft: `10px solid ${C.mostaza}`, boxShadow: '0 12px 0 rgba(20,33,61,0.35)', textTransform: 'uppercase'}}>{texto}</div>
    </div>
  );
};

/** Subtítulos literales del clip (lo que se oye), con quién habla en mostaza. Pastilla tinta en la banda de subtítulos. */
export const Citas: React.FC<{lineas: {inicio: number; fin: number; texto: string; quien?: string}[]; y?: number; tamano?: number}> = ({lineas, y = SUBS.y, tamano = 64}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const l = lineas.find((x) => t >= x.inicio && t < x.fin);
  if (!l) return null;
  return (
    <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: y, display: 'flex', justifyContent: 'center'}}>
      <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: tamano, lineHeight: 1.22, color: C.crema, background: 'rgba(20,33,61,0.88)', padding: '12px 26px', borderRadius: 18, textAlign: 'center', maxWidth: SEGURA.ancho}}>
        {l.quien ? <span style={{color: C.mostaza}}>{l.quien}: </span> : null}{l.texto}
      </div>
    </div>
  );
};

/** "EL DATO QUE FALTA": tarjeta crema con etiqueta, cifra o hecho grande (máx. 7 palabras), una línea de detalle y la fuente (36 px). */
export const DatoFalta: React.FC<{cifra: string; texto?: string; fuente: string; etiqueta?: string; y?: number; en?: number; hasta?: number; tamano?: number}> = ({cifra, texto, fuente, etiqueta = 'EL DATO QUE FALTA', y = 760, en = 0, hasta, tamano = 104}) => {
  const p = useEntrada(en);
  const s = useSalida(hasta);
  return (
    <div style={{position: 'absolute', left: SEGURA.izq, top: y, width: SEGURA.ancho, opacity: Math.min(p, 1) * s, transform: `scale(${0.9 + 0.1 * Math.min(p, 1)})`, transformOrigin: '50% 0'}}>
      <div style={{display: 'inline-block', fontFamily: F.texto, fontWeight: 700, fontSize: 38, letterSpacing: 2, color: C.crema, background: C.turquesa, padding: '6px 18px', borderRadius: '14px 14px 0 0'}}>{etiqueta}</div>
      <div style={{background: C.crema, borderRadius: '0 26px 26px 26px', padding: '22px 28px 20px', boxShadow: '0 14px 0 rgba(20,33,61,0.35)', borderLeft: `10px solid ${C.turquesa}`}}>
        <div style={{fontFamily: F.titular, fontSize: tamano, lineHeight: 1.02, color: C.tinta, textTransform: 'uppercase'}}>{cifra}</div>
        {texto ? <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 46, lineHeight: 1.2, color: C.tinta, marginTop: 12}}>{texto}</div> : null}
        <div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 36, lineHeight: 1.2, color: C.piedra, marginTop: 14}}>{fuente}</div>
      </div>
    </div>
  );
};

export const REGISTRO_ALMINUTO = {clip: Clip, titularAM: TitularAM, citas: Citas, datoFalta: DatoFalta};
