import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SEGURA, SUBS} from '../tema';
import type {Palabra} from '../tipos';

type Trozo = {palabras: Palabra[]; inicio: number; fin: number};

export const trocear = (palabras: Palabra[], maxPal = 5, maxCar = 32, sinHuerfanas = false): Trozo[] => {
  const out: Trozo[] = [];
  let cur: Palabra[] = [];
  const cierra = () => {
    if (cur.length) out.push({palabras: cur, inicio: cur[0].inicio, fin: cur[cur.length - 1].fin});
    cur = [];
  };
  for (let k = 0; k < palabras.length; k++) {
    const w = palabras[k];
    const car = [...cur, w].map((x) => x.t).join(' ').length;
    if (cur.length && (cur.length >= maxPal || car > maxCar)) {
      // opt-in: si tras el corte queda una sola palabra hasta el signo de puntuación, la palabra anterior pasa al trozo siguiente
      if (sinHuerfanas && cur.length > 2 && /[.?!…:;]$/.test(w.t)) {
        const ult = cur.pop() as Palabra;
        cierra();
        cur.push(ult);
      } else cierra();
    }
    cur.push(w);
    if (/[.?!…:;]$/.test(w.t)) cierra();
  }
  cierra();
  return out;
};

/** Subtítulos quemados: banda y=1150-1400, máx. 2 líneas, palabra activa en mostaza, dentro de zonas seguras. */
export const Subtitulos: React.FC<{palabras: Palabra[]; ocultarEn?: [number, number][]; sinHuerfanas?: boolean; dy?: number}> = ({palabras, ocultarEn = [], sinHuerfanas = false, dy = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const trozos = useMemo(() => trocear(palabras, 5, 32, sinHuerfanas), [palabras, sinHuerfanas]);
  const idx = trozos.findIndex((tr, i) => t >= tr.inicio && t < Math.min(trozos[i + 1]?.inicio ?? Infinity, tr.fin + 0.4));
  if (idx < 0 || ocultarEn.some(([a, b]) => t >= a && t < b)) return null;
  const tr = trozos[idx];
  let activa = 0;
  tr.palabras.forEach((w, i) => { if (t >= w.inicio) activa = i; });
  return (
    <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: SUBS.y + dy, display: 'flex', justifyContent: 'center'}}>
      <div style={{background: 'rgba(20,33,61,0.93)', borderRadius: 18, padding: '16px 30px', textAlign: 'center', maxWidth: SEGURA.ancho, fontFamily: F.texto, fontWeight: 700, fontSize: 56, lineHeight: 1.2}}>
        {tr.palabras.map((w, i) => (
          <span key={i} style={{color: i === activa ? C.mostaza : C.crema}}>{w.t}{i < tr.palabras.length - 1 ? ' ' : ''}</span>
        ))}
      </div>
    </div>
  );
};
