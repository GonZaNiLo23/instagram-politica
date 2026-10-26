import React from 'react';
import {Still} from 'remotion';
import {Carrusel} from './Carrusel';

export const RootCarrusel: React.FC = () => (
  <Still id="Carrusel" component={Carrusel as React.FC<any>} width={1080} height={1350} defaultProps={{slides: [], indice: 0}} />
);
