import React from 'react';
import type {PiezaProps} from './tipos';
import {Flash} from './plantillas/Flash';
import {Estandar} from './plantillas/Estandar';

/** Lee el JSON de la pieza (props) y elige plantilla. */
export const Pieza: React.FC<PiezaProps> = (props) =>
  props.plantilla === 'estandar' ? <Estandar {...props} /> : <Flash {...props} />;
