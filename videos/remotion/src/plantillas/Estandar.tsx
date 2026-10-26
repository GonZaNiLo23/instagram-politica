import React from 'react';
import type {PiezaProps} from '../tipos';
import {Montaje} from './Montaje';

/**
 * Plantilla ESTÁNDAR (60-90 s): gancho 0-3, contexto 3-20, explicación 20-65, giro/lectura 65-80, cierre 4-5 s.
 * Con fina barra de progreso (retención en vídeos largos). Esqueleto en videos/plantillas/estandar.escenas.json.
 */
export const Estandar: React.FC<PiezaProps> = (p) => <Montaje {...p} barraProgreso />;
