import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, interpolateColors, Easing} from 'remotion';
import {useSalida} from './util';
import {C, F, SEGURA, PARTIDOS} from '../tema';

export type Grupo = {nombre: string; escanos: number; color?: string; partido?: string; en?: number};

/** Posiciones de `total` puntos en un hemiciclo, ordenadas de izquierda a derecha por ángulo. */
export const puntosHemiciclo = (total: number, filas: number, radio: number) => {
  const r0 = radio * 0.42;
  const radios = Array.from({length: filas}, (_, i) => r0 + ((radio - r0) * i) / (filas - 1));
  const suma = radios.reduce((a, b) => a + b, 0);
  const cuentas = radios.map((r) => Math.round((total * r) / suma));
  cuentas[filas - 1] += total - cuentas.reduce((a, b) => a + b, 0);
  const pts: {x: number; y: number; ang: number}[] = [];
  radios.forEach((r, i) => {
    const n = cuentas[i];
    for (let j = 0; j < n; j++) {
      const ang = Math.PI * (1 - (n === 1 ? 0.5 : j / (n - 1)));
      pts.push({x: r * Math.cos(ang), y: -r * Math.sin(ang), ang});
    }
  });
  pts.sort((a, b) => b.ang - a.ang);
  return pts;
};

const colorGrupo = (g: Grupo) => g.color ?? (g.partido ? PARTIDOS[g.partido] : undefined) ?? C.tinta;

const cl = (x: number) => Math.min(1, Math.max(0, x));

export type OpcionesHemiciclo = {
  /** Los puntos ya están en pantalla desde el primer fotograma (sin brotar). */
  estatico?: boolean;
  /** Cascada de color desde los extremos hacia el centro (p. ej. de tinta a gris piedra). */
  apagar?: {en: number; dur: number; de: string; a: string};
  /** Enciende un tramo central de `cuenta` puntos (desde el índice `desde`) en `color`, del centro hacia fuera. `pulso` = segundo en que parpadean. */
  resalta?: {desde: number; cuenta: number; color: string; en: number; dur: number; pulso?: number};
  /** Todos los puntos pasan a `color` (cascada desde los extremos). */
  final?: {en: number; dur: number; color: string};
  /** Zoom hacia (centro, oy px desde el borde superior del hemiciclo). */
  zoom?: {a: number; en: number; dur: number; oy?: number};
  /** Recorte vertical [arriba, abajo] en px absolutos (para el zoom). */
  clip?: [number, number];
  hasta?: number;
};

/**
 * Hemiciclo de puntos (350 por defecto). Los grupos se reparten en orden izquierda->derecha.
 * Si la suma de escaños < total, el resto queda en gris piedra. Leyenda con nombre (no depender solo del color).
 * `en` por grupo = retraso extra (s) para que "broten" más tarde (p. ej. 50 puntos mostaza extra).
 * Opciones de estado (006): estatico, apagar, resalta, final, zoom, clip, hasta.
 */
export const Hemiciclo: React.FC<{grupos?: Grupo[]; total?: number; en?: number; dur?: number; y?: number; ancho?: number; filas?: number; leyenda?: boolean; centro?: string} & OpcionesHemiciclo> = ({
  grupos = [{nombre: 'Escaños', escanos: 350, color: C.tinta}], total = 350, en = 0, dur = 1.6, y = 560, ancho = 880, filas = 10, leyenda = true, centro,
  estatico = false, apagar, resalta, final, zoom, clip, hasta,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const sal = useSalida(hasta);
  const radio = ancho / 2;
  const pts = useMemo(() => puntosHemiciclo(total, filas, radio), [total, filas, radio]);
  const color = useMemo(() => {
    const arr: {c: string; en: number}[] = [];
    grupos.forEach((g) => {
      for (let i = 0; i < g.escanos; i++) arr.push({c: colorGrupo(g), en: g.en ?? 0});
    });
    while (arr.length < total) arr.push({c: C.piedra, en: 0});
    return arr;
  }, [grupos, total]);
  const dot = ((radio * 0.58) / (filas - 1)) * 0.42;
  const cx = SEGURA.izq + SEGURA.ancho / 2;
  const z = zoom ? interpolate(frame, [zoom.en * fps, (zoom.en + zoom.dur) * fps], [1, zoom.a], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)}) : 1;
  const colorDe = (i: number) => {
    let c = color[i].c;
    const ext = Math.min(i, total - 1 - i) / (total / 2); // 0 en los extremos, 1 en el centro
    if (apagar) c = interpolateColors(cl((t - apagar.en - ext * apagar.dur * 0.5) / (apagar.dur * 0.5)), [0, 1], [apagar.de, apagar.a]);
    let esc = 1;
    if (resalta && i >= resalta.desde && i < resalta.desde + resalta.cuenta) {
      const k = (i - resalta.desde) / resalta.cuenta;
      const d = Math.abs(k - 0.5) * 2; // 0 en el centro del grupo
      c = interpolateColors(cl((t - resalta.en - d * resalta.dur * 0.5) / (resalta.dur * 0.5)), [0, 1], [c, resalta.color]);
      if (resalta.pulso !== undefined) {
        const q = (t - resalta.pulso) / 0.5;
        if (q > 0 && q < 1) {
          esc = 1 + 0.7 * Math.sin(Math.PI * q);
          c = interpolateColors(Math.sin(Math.PI * q), [0, 1], [c, C.tinta]);
        }
      }
    }
    if (final) c = interpolateColors(cl((t - final.en - ext * final.dur * 0.5) / (final.dur * 0.5)), [0, 1], [c, final.color]);
    return {c, esc};
  };
  const cuerpo = (
    <div style={{position: 'absolute', left: 0, top: clip ? y - clip[0] : y, width: 1080, height: radio + 40, opacity: sal, transformOrigin: `${cx}px ${zoom?.oy ?? 0}px`, transform: `scale(${z})`}}>
      {pts.map((p, i) => {
        const ini = (en + (i / total) * dur + color[i].en) * fps;
        const s = estatico ? 1 : interpolate(frame, [ini, ini + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
        const {c, esc} = colorDe(i);
        return <div key={i} style={{position: 'absolute', left: cx + p.x - dot, top: radio + p.y - dot, width: dot * 2, height: dot * 2, borderRadius: dot, background: c, transform: `scale(${s * esc})`}} />;
      })}
      {centro ? <div style={{position: 'absolute', left: cx - 200, width: 400, top: radio - 130, textAlign: 'center', fontFamily: F.cifra, fontWeight: 700, fontSize: 110, color: C.tinta}}>{centro}</div> : null}
      {leyenda ? (
        <div style={{position: 'absolute', left: SEGURA.izq, width: SEGURA.ancho, top: radio + 60, display: 'flex', flexWrap: 'wrap', gap: '14px 34px'}}>
          {grupos.map((g, i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: F.texto, fontWeight: 700, fontSize: 40, color: C.tinta}}>
              <div style={{width: 30, height: 30, borderRadius: 15, background: colorGrupo(g)}} />{g.nombre} {g.escanos}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
  return clip ? <div style={{position: 'absolute', left: 0, top: clip[0], width: 1080, height: clip[1] - clip[0], overflow: 'hidden'}}>{cuerpo}</div> : cuerpo;
};
