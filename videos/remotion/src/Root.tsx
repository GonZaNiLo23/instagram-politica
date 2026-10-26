import React from 'react';
import {Composition, Still} from 'remotion';
import {Pieza} from './Pieza';
import {porDefecto, PiezaProps} from './tipos';
import {MarcaCuadrado, MarcaHorizontal} from './marca/MarcaStills';
import {Cierre} from './componentes/Cierre';
import {Marca} from './componentes/Marca';
import {C} from './tema';
import {HistoriaMercados} from './componentes/HistoriaMercados';

export const FPS = 30;

const PruebaCierre: React.FC = () => (
  <div style={{width: 1080, height: 1920, background: C.mostaza, position: 'relative'}}>
    <Cierre frase="Un minuto basta para entenderlo" pregunta="¿Qué quieres que expliquemos?" />
  </div>
);
const PruebaEsquina: React.FC<{oscuro?: boolean}> = ({oscuro}) => (
  <div style={{width: 1080, height: 1920, background: oscuro ? C.tinta : C.crema, position: 'relative'}}>
    <Marca sobre={oscuro ? 'oscuro' : 'claro'} />
  </div>
);

export const Root: React.FC = () => (
  <>
    <Composition
      id="Pieza"
      component={Pieza as React.FC<any>}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={Math.round(5 * FPS)}
      defaultProps={porDefecto as PiezaProps}
      calculateMetadata={({props}) => ({
        durationInFrames: Math.max(1, Math.round((props as PiezaProps).duracion * FPS)),
      })}
    />
    <Still id="MarcaCuadrado" component={MarcaCuadrado as React.FC<any>} width={1080} height={1080} defaultProps={{variante: 'A', tono: 'oscuro', fondo: C.tinta}} />
    <Still id="MarcaHorizontal" component={MarcaHorizontal as React.FC<any>} width={1440} height={480} defaultProps={{variante: 'A', tono: 'claro', fondo: 'transparente'}} />
    <Composition id="PruebaCierre" component={PruebaCierre} width={1080} height={1920} fps={FPS} durationInFrames={120} />
    <Still id="HistoriaMercados" component={HistoriaMercados as React.FC<any>} width={1080} height={1920} defaultProps={{pantalla: 'portada', fecha: '', titular: '', fuentes: ''}} />
    <Still id="PruebaEsquina" component={PruebaEsquina as React.FC<any>} width={1080} height={1920} defaultProps={{oscuro: false}} />
  </>
);
