import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, SEGURA} from '../tema';
import {useEntrada} from './util';
import {Marca} from './Marca';

const Mas: React.FC = () => <span style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 76, height: 76, marginRight: 18, borderRadius: 18, background: C.tinta, color: C.crema, fontFamily: F.titular, fontSize: 64, lineHeight: 1}}>+</span>;
const Pin: React.FC = () => <span style={{fontSize: 64, marginRight: 16, fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif', lineHeight: 1}}>📌</span>;

/** Plantilla de cierre (últimos 2,5-5 s): fondo mostaza (lo pone la escena), frase resumen, llamada a seguir (por defecto) o Guárdalo, Fuentes en la descripción, logo.
 * `cta`: 'siguenos' (por defecto desde el 2026-10-26: "Síguenos / para estar informado") o 'guardalo' (piezas explicativas). */
export const Cierre: React.FC<{frase: string; pregunta?: string; marca?: string; tamano?: number; yGuardalo?: number; yFuentes?: number; pulso?: boolean; /** segunda línea bajo "Guárdalo" (p. ej. "PARA EL 29‑N") */ guardaloLinea2?: string; yLinea2?: number; yFrase?: number; guardaEn?: number; cta?: 'siguenos' | 'guardalo'}> = ({cta = 'siguenos', frase, pregunta, marca, tamano = 104, yGuardalo = 1180, yFuentes: yFuentesP, pulso = false, guardaloLinea2, yLinea2: yLinea2P, yFrase = 520, guardaEn = 0.9}) => {
  // Con "Síguenos" hay dos líneas: la segunda va 90 px bajo la primera y "Fuentes en la descripción" baja para no pisarlas
  const dosLineas = cta === 'siguenos' || !!guardaloLinea2;
  const yLinea2 = yLinea2P ?? yGuardalo + 90;
  const yFuentes = Math.max(yFuentesP ?? yGuardalo + 110, dosLineas ? yLinea2 + 100 : 0);
  const fr = useCurrentFrame();
  const pul = pulso && fr > 45 ? 1 + 0.05 * Math.max(0, Math.sin(((fr - 45) / 30) * Math.PI * 1.2)) : 1;
  const a = useEntrada(0.05);
  const b = useEntrada(0.5);
  const c = useEntrada(guardaEn);
  return (
    <>
      <Marca texto={marca} grande />
      <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: yFrase, fontFamily: F.titular, fontSize: tamano, lineHeight: 1.06, color: C.tinta, textTransform: 'uppercase', opacity: Math.min(a, 1), transform: `translateY(${(1 - a) * 70}px)`}}>{frase}</div>
      {pregunta ? <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: 960, fontFamily: F.texto, fontWeight: 700, fontSize: 64, color: C.tinta, opacity: Math.min(b, 1)}}>{pregunta}</div> : null}
      <div style={{position: 'absolute', left: SEGURA.izq, top: yGuardalo, display: 'flex', alignItems: 'center', opacity: Math.min(c, 1), transform: `scale(${(0.9 + 0.1 * Math.min(c, 1)) * pul})`, transformOrigin: 'left center'}}>
        {cta === 'siguenos' ? <><Mas /><span style={{fontFamily: F.titular, fontSize: 72, color: C.tinta}}>Síguenos</span></> : <><Pin /><span style={{fontFamily: F.titular, fontSize: 72, color: C.tinta}}>Guárdalo</span></>}
      </div>
      {cta === 'siguenos' || guardaloLinea2 ? <div style={{position: 'absolute', left: SEGURA.izq, top: yLinea2, fontFamily: F.titular, fontSize: 72, color: C.tinta, opacity: Math.min(c, 1)}}>{cta === 'siguenos' ? (guardaloLinea2 ?? 'para estar informado') : guardaloLinea2}</div> : null}
      <div style={{position: 'absolute', left: SEGURA.izq, top: yFuentes, fontFamily: F.texto, fontWeight: 600, fontSize: 48, color: C.tinta, opacity: Math.min(c, 1)}}>Fuentes en la descripción</div>
    </>
  );
};
