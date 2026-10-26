// Genera escenas.json desde tiempos.json (voz con pausas: ver _pausas.mjs). Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const DUR = r(T.duracion + 2.2);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 72, ...o});
const nota = (lineas, en = 0.05, o = {}) => ({tipo: 'notas', lineas, en, ...o});
const NB = ' ';
const MINI = {tipo: 'bUrnas', mini: true, en: -1};
const ETIQ = (o = {}) => ({tipo: 'dhEtiqueta', en: -1, ...o});

// 1 · Gancho (0 -> "Votar")
{
  const a = 0, b = S(16);
  esc(a, b, {}, [
    {tipo: 'gancho', texto: '¿TU VOTO EN BLANCO VA AL GANADOR?', y: 335, tamano: 92, en: -1, hasta: r(t(11) - 0.2)},
    {tipo: 'gancho', texto: 'NO. PERO TAMPOCO ES INVISIBLE', y: 335, tamano: 92, en: r(t(11) - 0.1)},
    {tipo: 'bGancho', modo: 'gancho', tInterr: r(t(9) + 0.2), tRompe: r(t(11) - 0.02)},
  ]);
}

// 2 · Contexto: blanco, nulo, abstención
{
  const a = S(16), b = S(55);
  const R = (x) => r(x - a);
  const fotoFin = t(22) - 0.05;       // "sobre"
  const urnY = 700;
  esc(a, b, {}, [
    rot('BLANCO = sobre sin papeleta', 335, 0.05, {hasta: R(t(25) - 0.12)}),
    {tipo: 'recorte', src: 'urna-cyl.png', x: 540, y: 850, ancho: 430, giro: -2, desde: 'abajo', en: 0.05, hasta: R(fotoFin),
      notas: ['LOREG art. 96.5', 'Urna, autonómicas de Castilla y León 2022'], credito: 'Foto: MiguelAlanCS · CC BY-SA 4.0 (recorte)'},
    nota(['LOREG art. 96.5'], R(fotoFin), {hasta: R(t(25) - 0.12)}),
    // urnas
    {tipo: 'bUrnas', y: urnY, en: R(fotoFin), miniEn: R(t(54) + 0.05),
      luz: [{i: 0, en: R(fotoFin), hasta: R(t(32))}, {i: 1, en: R(t(32)), hasta: R(t(48))}, {i: 2, en: R(t(48))}],
      llenan: [{i: 0, en: R(fotoFin) + 1.2}],
      check: [{i: 0, en: R(t(28))}], aspa: [{i: 1, en: R(t(44) + 0.1)}]},
    {tipo: 'bSobreCae', x: 190, yTope: 640, yUrna: 780, abre: R(fotoFin) + 0.1, cae: R(fotoFin) + 0.9, en: R(fotoFin), hasta: R(t(25) - 0.1)},
    // válido
    rot('Es un VOTO VÁLIDO', 335, R(t(25) - 0.02), {hasta: R(S(32))}),
    {tipo: 'sello', valor: 'DATO', x: 780, y: 440, tamano: 120, en: R(t(30)), hasta: R(S(32))},
    {tipo: 'notaEscribe', lineas: ['«en blanco, pero válido»', 'LOREG art. 96.5'], en: R(t(25)), dur: 1.5, hasta: R(S(32))},
    // nulo
    rot('NULO, por ejemplo:', 335, R(t(32) - 0.02), {hasta: R(S(44))}),
    {tipo: 'bNulos', en1: R(t(34) - 0.1), en2: R(t(38) - 0.1), y1: 1000, y2: 1110, hasta: R(S(44))},
    rot('nombres tachados', 962, R(t(34) - 0.05), {izq: 250, ancho: 680, tamano: 64, hasta: R(S(44))}),
    rot('papel no oficial', 1072, R(t(38) - 0.05), {izq: 250, ancho: 680, tamano: 64, hasta: R(S(44))}),
    nota(['LOREG art. 96.1 y 96.2'], R(t(32) - 0.02), {hasta: R(S(44))}),
    rot('NO es válido', 335, R(t(44) - 0.02), {hasta: R(S(48))}),
    // abstención
    rot('ABSTENCIÓN = no ir a votar', 335, R(t(48) - 0.02), {hasta: R(t(54) + 0.02)}),
    {tipo: 'bSofa', x: 520, y: 1060, tam: 0.95, en: R(t(50) - 0.3)},
    nota(['Votar no es obligatorio en España'], R(t(48) - 0.02)),
  ]);
}

// 3 · Explicación
{
  // 3a · hemiciclo
  const a = S(55), b = S(65);
  const R = (x) => r(x - a);
  esc(a, b, {}, [
    MINI,
    rot('El blanco va al ganador', 430, 0.05),
    {tipo: 'sello', valor: 'MITO', x: 790, y: 505, tamano: 120, en: R(t(58) + 0.1)},
    {tipo: 'bHemi', cy: 1030, intentos: [R(t(58)), R(t(61))], en: 0.1},
    rot('No suma escaños a nadie', 1062, R(t(60) - 0.05), {tamano: 64}),
    nota(['LOREG art. 163.1'], 0.05),
  ]);
}
{
  // 3b · D'Hondt + barrera del 3 %
  const a = S(65), b = S(88);
  const R = (x) => r(x - a);
  esc(a, b, {}, [
    MINI,
    rot("D'HONDT: solo votos a candidaturas", 430, 0.05, {hasta: R(S(75))}),
    rot(`BARRERA: 3${NB}% de los votos válidos`, 430, R(S(75)) + 0.05),
    {tipo: 'bReparto', divide: [R(t(66)), R(t(69)), R(t(72))], montonEn: R(t(70)), listonEn: R(t(80) - 0.05), en: 0.05},
    nota(['LOREG art. 163.1.b y c', '¿Cómo funciona? Vídeo 002'], 0.05, {hasta: R(S(75))}),
    nota(['LOREG art. 163.1.a'], R(S(75)) + 0.05),
  ]);
}
{
  // 3c · fuera del reparto en su provincia
  const a = S(88), b = S(99);
  const R = (x) => r(x - a);
  esc(a, b, {}, [
    MINI,
    rot(`No llegas al 3${NB}%${NB}→ fuera del reparto`, 430, 0.05),
    {tipo: 'dhMapaMinimo', x: 500, y: 650, ancho: 540, enMapa: 0.1, enAros: 0.4, enPuntos: 999, hasta: R(t(94) - 0.3)},
    {tipo: 'bProv', choque: R(t(96)), en: R(t(94) - 0.3)},
    nota(['Circunscripción = provincia', 'Constitución, art. 68.2'], 0.05),
  ]);
}
{
  // 3d · el blanco sí cuenta
  const a = S(99), b = S(105);
  esc(a, b, {}, [
    MINI,
    rot('Y AHÍ EL BLANCO SÍ CUENTA', 430, 0.05),
    {tipo: 'bTaco', en: 0.05},
  ]);
}

// 4 · Ejemplo
{
  const a = S(105), b = S(149);
  const R = (x) => r(x - a);
  esc(a, b, {}, [
    ETIQ(),
    rot(`100.000 válidos${NB}→ barrera: 3.000`, 335, 0.05, {hasta: R(S(116))}),
    rot(`Cuadrado: 3.020${NB}→ ENTRA`, 335, R(S(116)) + 0.05, {hasta: R(S(124))}),
    rot('+1.000 votos en blanco', 335, R(S(124)) + 0.05, {hasta: R(S(130))}),
    rot(`101.000 válidos${NB}→ barrera: 3.030`, 335, R(S(130)) + 0.05, {hasta: R(S(142))}),
    rot('CUADRADO, FUERA POR 10 VOTOS', 335, R(S(142)) + 0.05),
    {tipo: 'bEjemplo', en: 0.05, dy: 50, enBarra: R(t(118)), durBarra: r(t(122) + 0.4 - t(118)), enEntra: R(t(123)),
      sobres: {en: R(t(125)), dur: r(t(129) + 0.2 - t(125))}, enSube: R(t(136)), durSube: r(t(141) - t(136)), enFuera: R(t(145))},
    nota(['3 % de 100.000 = 3.000', 'Escala ampliada: desde 2.900'], 0.05, {hasta: R(S(130))}),
    nota(['3 % de 101.000 = 3.030', 'Escala ampliada: desde 2.900'], R(S(130)) + 0.05, {hasta: R(S(142))}),
    nota(['3.020 < 3.030', 'Escala ampliada: desde 2.900'], R(S(142)) + 0.05),
  ]);
}
{
  // giro: nulos y abstenciones no mueven la barrera
  const a = S(149), b = S(159);
  const R = (x) => r(x - a);
  esc(a, b, {}, [
    MINI,
    ETIQ(),
    rot(`+1.000 nulos o abstenciones${NB}→ sigue en 3.000`, 420, 0.05, {tamano: 64}),
    {tipo: 'bEjemplo', en: -1, barraFija: true, fijo: true, dy: 177, esc: 0.8, sinTitulo: true},
    {tipo: 'bCaen', tipo2: 'nulo', yIni: 662, yFin: 705, baja: 20, en: R(t(151) - 0.1)},
    nota(['Escala ampliada: desde 2.900'], 0.05),
  ]);
  // el generador usa `tipo` para el componente: el subtipo de bCaen va en `variante`
  const e = ESC[ESC.length - 1];
  const caen = e.componentes.find((c) => c.tipo === 'bCaen');
  delete caen.tipo2;
  caen.tipo = 'bCaen';
  caen.variante = 'nulo';
  e.componentes.push({tipo: 'bCaen', variante: 'sofa', xSofa: 780, ySofa: 695, en: R(t(153) - 0.1)});
}
{
  // plano general
  const a = S(159), b = S(172);
  const R = (x) => r(x - a);
  esc(a, b, {}, [
    rot(`Solo importa si alguien roza el 3${NB}%`, 335, 0.05),
    ETIQ(),
    {tipo: 'bPlano', enListon: 0.9, parpadeo: R(t(165)), enEt: R(t(169)), en: 0.05, y0: 700},
  ]);
}

// 5 · Cierre
{
  const a = S(172), b = S(183);
  const R = (x) => r(x - a);
  const fFoto = t(180) - 0.2;
  esc(a, b, {}, [
    rot('¿AL GANADOR? NO', 335, 0.05),
    rot('¿INVISIBLE? TAMPOCO', 435, R(t(179)) - 0.1),
    {tipo: 'bGancho', modo: 'bucle', tPasa: 0.5, hasta: R(fFoto)},
    {tipo: 'recorte', src: 'urna-and.png', x: 500, y: 900, ancho: 800, giro: 2, desde: 'abajo', en: R(fFoto),
      notas: ['Urna andaluza, Montalbán, 2015'], credito: 'Foto: Américo Toledano · CC BY-SA 4.0 · Wikimedia Commons'},
  ]);
}
esc(S(183), DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '¿LO SABÍAS?', pregunta: 'Te leemos en comentarios', tamano: 110, yFrase: 460, yGuardalo: 1180, cta: 'guardalo', pulso: true},
  {tipo: 'bUrnas', mini: true, yMini: 900, en: 0.2},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'gancho', texto: 'VOTO EN BLANCO: ¿PARA QUIÉN VA?', y: 330, tamano: 100, en: -1},
  {tipo: 'recorte', src: 'urna-cyl.png', x: 540, y: 1090, ancho: 480, giro: -2, desde: 'escala', flota: false, en: -1, credito: 'Foto: MiguelAlanCS · CC BY-SA 4.0 (recorte)'},
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subDy: 90,
  musica: {pista: 'investigations.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
ESC.forEach((x, i) => { const d = x.fin - x.inicio; if (d < 1.4) console.log('corta', i + 1, x.inicio, d.toFixed(2)); });
