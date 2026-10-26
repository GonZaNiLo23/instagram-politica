import React from 'react';
import {C, F, SEGURA} from '../tema';
import {simboloInterior} from '../marca/simbolos.mjs';

export const CUENTA = '@loquepasaenunminuto';
export const VARIANTE_LOGO = 'A';

/** Simbolo del logo (variante aplicada por defecto: A). */
export const Simbolo: React.FC<{tam: number; sobre?: 'claro' | 'oscuro'; variante?: string}> = ({tam, sobre = 'claro', variante = VARIANTE_LOGO}) => (
  <svg width={tam} height={tam} viewBox="0 0 200 200" dangerouslySetInnerHTML={{__html: simboloInterior(variante, sobre)}} />
);

/** Logo de esquina (simbolo + @cuenta), dentro de la zona segura. `grande` para el cierre. */
export const Marca: React.FC<{texto?: string; sobre?: 'claro' | 'oscuro'; grande?: boolean}> = ({texto, sobre = 'claro', grande = false}) => {
  // "LOGO" y "@cuenta" eran textos provisionales de piezas antiguas: se ignoran
  const nombre = !texto || texto === 'LOGO' || texto === '@cuenta' ? CUENTA : texto;
  const color = sobre === 'claro' ? C.tinta : C.crema;
  return (
    <div style={{position: 'absolute', left: SEGURA.izq, top: SEGURA.arriba + 12, display: 'flex', alignItems: 'center', gap: grande ? 22 : 14}}>
      <Simbolo tam={grande ? 130 : 64} sobre={sobre} />
      <span style={{fontFamily: F.texto, fontWeight: 700, fontSize: grande ? 48 : 36, color, letterSpacing: 0.5}}>{nombre}</span>
    </div>
  );
};
