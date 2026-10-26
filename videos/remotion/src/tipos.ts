import type {Fondo} from './tema';

export type Palabra = {t: string; inicio: number; fin: number}; // segundos

export type Componente = {tipo: string; [clave: string]: any};

export type Escena = {
  inicio: number; // segundos
  fin: number;
  fondo?: Fondo;
  /** etiqueta fija "NUESTRA LECTURA" durante toda la escena (opinion) */
  lectura?: boolean;
  /** oculta los subtitulos (p. ej. en el cierre) */
  sinSubtitulos?: boolean;
  /** rotulo de fuente en 36 px abajo (dentro de zona segura) */
  fuente?: string;
  fuenteSinPrefijo?: boolean;
  componentes: Componente[];
};

export type PiezaProps = {
  id: string;
  plantilla: 'flash' | 'estandar';
  duracion: number; // segundos
  /** nombre del audio en la carpeta publica de la pieza (null = sin audio) */
  audio: string | null;
  /** true si la voz es provisional (silencio/voz del sistema): se muestra aviso solo en modo prueba */
  provisional: boolean;
  /** muestra el aviso PROVISIONAL en pantalla (solo para pruebas internas) */
  avisoProvisional?: boolean;
  palabras: Palabra[];
  escenas: Escena[];
  marca?: string;
  /** opcional: evita subtítulos con una sola palabra suelta al final de la frase */
  subSinHuerfanas?: boolean;
  /** opcional: desplaza los subtítulos (px hacia abajo) */
  subDy?: number;
};

export const porDefecto: PiezaProps = {
  id: 'vacio',
  plantilla: 'flash',
  duracion: 5,
  audio: null,
  provisional: true,
  palabras: [],
  escenas: [],
};
