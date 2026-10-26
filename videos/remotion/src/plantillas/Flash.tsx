import React from 'react';
import type {PiezaProps} from '../tipos';
import {Montaje} from './Montaje';

/**
 * Plantilla FLASH (20-35 s): gancho 0-4 s, contexto, explicación, giro, (Nuestra lectura), cierre de 2,5 s.
 * Sin barra de progreso. El esqueleto de tiempos está en videos/plantillas/flash.escenas.json.
 */
export const Flash: React.FC<PiezaProps> = (p) => <Montaje {...p} barraProgreso={false} />;
