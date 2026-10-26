import React from 'react';
import {C, F, SEGURA} from '../tema';
import {Marca} from './Marca';

/**
 * Historia diaria de mercados (still 1080×1920, una pantalla por render).
 * pantalla 'portada': fecha + titular · 'cifras': tabla de cierres con variación · 'porque': causas atribuidas.
 * Datos de estado/mercados/AAAA-MM-DD.json; textos del encargo diario. Siempre informativo: lleva el aviso
 * "No es una recomendación de inversión" y las fuentes en el pie.
 */
type Activo = {nombre: string; cierre: number; variacion: number; unidad?: string; decimales?: number};
export type HistoriaMercadosProps = {
  pantalla: 'portada' | 'cifras' | 'porque'; fecha: string; titular?: string; subtitulo?: string;
  activos?: Activo[]; causas?: {texto: string; fuente: string}[]; fuentes: string; numero?: string;
};

// Formato español con punto de miles siempre (es-ES no agrupa los números de 4 cifras: 6068,22 → 6.068,22)
const fmt = (n: number, d = 2) => {
  const [ent, dec] = Math.abs(n).toFixed(d).split('.');
  return `${n < 0 ? '-' : ''}${ent.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}${dec ? ',' + dec : ''}`;
};
const Pie: React.FC<{fuentes: string; numero?: string; claro?: boolean}> = ({fuentes, numero, claro}) => (
  <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: 1390, fontFamily: F.texto, fontWeight: 600, fontSize: 30, lineHeight: 1.3, color: claro ? C.crema : C.tinta, opacity: 0.85}}>
    {fuentes}<br />No es una recomendación de inversión.{numero ? `  ·  ${numero}` : ''}
  </div>
);
const Etiqueta: React.FC<{texto: string; claro?: boolean}> = ({texto, claro}) => (
  <div style={{position: 'absolute', left: SEGURA.izq, top: 330, display: 'inline-block', fontFamily: F.texto, fontWeight: 700, fontSize: 40, letterSpacing: 2, color: claro ? C.tinta : C.crema, background: claro ? C.mostaza : C.tinta, padding: '8px 22px', borderRadius: 12}}>{texto}</div>
);

export const HistoriaMercados: React.FC<HistoriaMercadosProps> = ({pantalla, fecha, titular, subtitulo, activos = [], causas = [], fuentes, numero}) => {
  if (pantalla === 'portada') {
    return (
      <div style={{width: 1080, height: 1920, background: C.tinta, position: 'relative'}}>
        <Marca sobre="oscuro" />
        <Etiqueta texto={`CIERRE DE MERCADOS · ${fecha}`} claro />
        <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: 470, fontFamily: F.titular, fontSize: 112, lineHeight: 1.04, color: C.crema, textTransform: 'uppercase'}}>{titular}</div>
        {subtitulo ? <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: 1060, fontFamily: F.texto, fontWeight: 700, fontSize: 52, lineHeight: 1.2, color: C.mostaza}}>{subtitulo}</div> : null}
        <Pie fuentes={fuentes} numero={numero} claro />
      </div>
    );
  }
  if (pantalla === 'cifras') {
    return (
      <div style={{width: 1080, height: 1920, background: C.crema, position: 'relative'}}>
        <Marca sobre="claro" />
        <Etiqueta texto={`CIERRES · ${fecha}`} />
        <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: 440}}>
          {activos.map((a) => {
            const sube = a.variacion >= 0;
            return (
              <div key={a.nombre} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 112, borderBottom: `3px solid rgba(20,33,61,0.12)`}}>
                <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 46, color: C.tinta, width: 340}}>{a.nombre}</div>
                <div style={{fontFamily: F.cifra, fontSize: 42, color: C.tinta, width: 300, textAlign: 'right', whiteSpace: 'nowrap'}}>{a.unidad ?? ''}{fmt(a.cierre, a.decimales ?? 2)}</div>
                <div style={{fontFamily: F.cifra, fontSize: 40, color: C.crema, background: sube ? C.turquesa : C.teja, borderRadius: 12, padding: '4px 10px', width: 236, textAlign: 'center', whiteSpace: 'nowrap'}}>{sube ? '▲' : '▼'} {fmt(Math.abs(a.variacion))} %</div>
              </div>
            );
          })}
        </div>
        <Pie fuentes={fuentes} numero={numero} />
      </div>
    );
  }
  return (
    <div style={{width: 1080, height: 1920, background: C.mostaza, position: 'relative'}}>
      <Marca sobre="claro" />
      <Etiqueta texto="¿POR QUÉ?" />
      <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: 460}}>
        {causas.map((c, i) => (
          <div key={i} style={{marginBottom: 56}}>
            <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 54, lineHeight: 1.22, color: C.tinta}}>{c.texto}</div>
            <div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 34, color: C.tinta, opacity: 0.8, marginTop: 10}}>{c.fuente}</div>
          </div>
        ))}
      </div>
      <Pie fuentes={fuentes} numero={numero} />
    </div>
  );
};
