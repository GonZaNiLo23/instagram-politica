import React from 'react';
import {Gancho} from './Gancho';
import {Rotulo} from './Rotulo';
import {Sello} from './Sello';
import {Contador} from './Contador';
import {Barras} from './Barras';
import {LineaTiempo} from './LineaTiempo';
import {Hemiciclo} from './Hemiciclo';
import {Cierre} from './Cierre';
import {Fuente} from './Fuente';
import {Icono} from './Icono';
import {Linea} from './Linea';
import {Mapa} from './Mapa';
import {Semaforo} from './Semaforo';
import {Cronometro} from './Cronometro';
import {Balanza} from './Balanza';
import {Barrera} from './Barrera';
import {Bloques} from './Bloques';
import {SelloTexto} from './SelloTexto';
import {Casilla} from './Casilla';
import {Foto, Comparador} from './Foto';
import {Recorte} from './Recorte';
import {Notas} from './Notas';
import {BarrasV} from './BarrasV';
import {LineaVertical} from './LineaVertical';
import {Caja} from './Caja';
import {Marca as MarcaC} from './Marca';
import {REGISTRO_003} from './Diputados';
import {REGISTRO_001} from './Mocion';
import {REGISTRO_002} from './Dhondt';
import {REGISTRO_007} from './Cumple';
import {REGISTRO_008} from './Voto';
import {REGISTRO_005} from './Vivienda';
import {REGISTRO_010} from './Brasil';
import {REGISTRO_009} from './Hora';
import {REGISTRO_022} from './Leones';
import {REGISTRO_023} from './Belgica';
import {REGISTRO_021} from './Senado';
import {REGISTRO_024} from './Barcelona';
import {REGISTRO_018} from './Blanco';
import {REGISTRO_016} from './Mesa';
import {REGISTRO_014} from './Ucd';
import {REGISTRO_012} from './Encuestas';
import {REGISTRO_013} from './Articulo155';
import {REGISTRO_025} from './Lula';
import {REGISTRO_020} from './Junta';
import {REGISTRO_019} from './Huelga';
import {REGISTRO_017} from './Midterms';
import {REGISTRO_015} from './Exterior';
import {REGISTRO_027} from './Tren';
import {REGISTRO_028} from './Paro';
import {MapaU, DatoU, AlcanceU, SeguridadU, PlazoU, MarcadorU, PastillasU, ResumenU} from './Urda';
import {REGISTRO_ALMINUTO} from './AlMinuto';
import {REGISTRO_SERIE} from './Serie';

export * from './Gancho';
export * from './Rotulo';
export * from './Sello';
export * from './Contador';
export * from './Barras';
export * from './LineaTiempo';
export * from './Hemiciclo';
export * from './Cierre';
export * from './Fuente';
export * from './Icono';
export * from './Linea';
export * from './Mapa';
export * from './Semaforo';
export * from './Cronometro';
export * from './Balanza';
export * from './Barrera';
export * from './Bloques';
export * from './SelloTexto';
export * from './Casilla';
export * from './Foto';
export * from './Recorte';
export * from './Notas';
export * from './BarrasV';
export * from './LineaVertical';
export * from './Caja';
export * from './Marca';
export * from './EtiquetaLectura';
export * from './Subtitulos';

/** Registro: el campo `tipo` de cada componente en escenas.json apunta aquí. */
export const REGISTRO: Record<string, React.FC<any>> = {
  gancho: Gancho,
  rotulo: Rotulo,
  sello: Sello,
  contador: Contador,
  barras: Barras,
  lineaTiempo: LineaTiempo,
  hemiciclo: Hemiciclo,
  cierre: Cierre,
  fuente: Fuente,
  icono: Icono,
  linea: Linea,
  mapa: Mapa,
  semaforo: Semaforo,
  cronometro: Cronometro,
  balanza: Balanza,
  barrera: Barrera,
  bloques: Bloques,
  selloTexto: SelloTexto,
  casilla: Casilla,
  foto: Foto,
  comparador: Comparador,
  recorte: Recorte,
  notas: Notas,
  barrasV: BarrasV,
  lineaVertical: LineaVertical,
  caja: Caja,
  marca: MarcaC,
  ...REGISTRO_003,
  ...REGISTRO_001,
  ...REGISTRO_002,
  ...REGISTRO_007,
  ...REGISTRO_008,
  ...REGISTRO_005,
  ...REGISTRO_010,
  ...REGISTRO_009,
  ...REGISTRO_022,
  ...REGISTRO_023,
  ...REGISTRO_021,
  ...REGISTRO_024,
  ...REGISTRO_018,
  ...REGISTRO_016,
  ...REGISTRO_014,
  ...REGISTRO_012,
  ...REGISTRO_013,
  ...REGISTRO_025,
  ...REGISTRO_020,
  ...REGISTRO_017,
  ...REGISTRO_015,
  ...REGISTRO_027,
  ...REGISTRO_028,
  mapaU: MapaU,
  datoU: DatoU,
  alcanceU: AlcanceU,
  seguridadU: SeguridadU,
  plazoU: PlazoU,
  marcadorU: MarcadorU,
  pastillasU: PastillasU,
  resumenU: ResumenU,
  ...REGISTRO_019,
  ...REGISTRO_ALMINUTO,
  ...REGISTRO_SERIE,
};
