import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA, colorFondo} from '../tema';
import type {PiezaProps} from '../tipos';
import {REGISTRO, Marca, EtiquetaLectura, Fuente, Subtitulos} from '../componentes';

/** Montaje común: recorre las escenas del JSON y las dibuja. Flash y Estándar lo envuelven con ajustes distintos. */
export const Montaje: React.FC<PiezaProps & {barraProgreso?: boolean}> = ({audio, audioDesde = 0, provisional, avisoProvisional, palabras: palabras0, escenas, marca, duracion, barraProgreso, subSinHuerfanas, subDy}) => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const ocultar = escenas.filter((e) => e.sinSubtitulos).map((e) => [e.inicio, e.fin] as [number, number]);
  // audioDesde (Al minuto): la voz entra más tarde; sus subtítulos se desplazan lo mismo
  const palabras = audioDesde ? palabras0.map((w) => ({...w, inicio: w.inicio + audioDesde, fin: w.fin + audioDesde})) : palabras0;
  return (
    <AbsoluteFill style={{background: C.crema}}>
      {audio ? <Sequence from={Math.round(audioDesde * fps)} layout="none"><Audio src={staticFile(audio)} /></Sequence> : null}
      {escenas.map((e, i) => {
        const fondo = e.fondo ?? 'crema';
        const oscuro = fondo === 'tinta';
        const tieneCierre = e.componentes.some((c) => c.tipo === 'cierre');
        const desde = Math.round(e.inicio * fps);
        const dur = Math.max(1, Math.round(e.fin * fps) - desde);
        return (
          <Sequence key={i} from={desde} durationInFrames={dur} layout="none">
            <AbsoluteFill style={{background: colorFondo(fondo)}}>
              {tieneCierre ? null : <Marca texto={marca} sobre={oscuro ? 'oscuro' : 'claro'} />}
              {e.lectura ? <EtiquetaLectura /> : null}
              {e.componentes.map((c, j) => {
                const Comp = REGISTRO[c.tipo];
                if (!Comp) throw new Error(`Componente desconocido: ${c.tipo}`);
                const {tipo, ...resto} = c;
                const extra = oscuro && (tipo === 'rotulo' || tipo === 'gancho' || tipo === 'contador') && !resto.color ? {color: C.crema} : {};
                return <Comp key={j} {...resto} {...extra} />;
              })}
              {e.fuente ? <Fuente texto={e.fuente} nota={e.fuenteSinPrefijo} sobre={oscuro ? 'oscuro' : 'claro'} /> : null}
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <Subtitulos palabras={palabras} ocultarEn={ocultar} sinHuerfanas={subSinHuerfanas} dy={subDy} />
      {barraProgreso ? (
        <div style={{position: 'absolute', left: 0, top: 236, height: 8, width: (frame / (duracion * fps)) * 1080, background: C.mostaza}} />
      ) : null}
      {provisional && avisoProvisional ? (
        <div style={{position: 'absolute', left: SEGURA.izq, top: 1560, fontFamily: F.texto, fontWeight: 700, fontSize: 40, color: C.teja, background: C.crema, padding: '4px 14px'}}>VOZ PROVISIONAL (solo prueba)</div>
      ) : null}
    </AbsoluteFill>
  );
};
