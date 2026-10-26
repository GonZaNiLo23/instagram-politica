// Genera escenas.json (y tiempos.json con grafías del guion) a partir de tiempos.raw.json (marcas reales de palabra de la voz con guías fonéticas).
// Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const RAW = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.raw.json'), 'utf8'));
const t = (i) => RAW.palabras[i].inicio;
const r = (x) => +x.toFixed(2);

// tiempos.json para subtítulos: "de ene i" -> DNI, "pe pe" -> PP, "pe-soe" -> PSOE (índices de la voz cruda)
{
  const fusion = {45: ['DNI', 3], 66: ['DNI', 3], 156: ['DNI', 3], 161: ['PP', 2], 120: ['PSOE', 1]};
  const pal = [];
  for (let i = 0; i < RAW.palabras.length; i++) {
    if (fusion[i]) {
      const [txt, n] = fusion[i];
      pal.push({t: txt, inicio: RAW.palabras[i].inicio, fin: RAW.palabras[i + n - 1].fin});
      i += n - 1;
    } else pal.push(RAW.palabras[i]);
  }
  fs.writeFileSync(path.join(dir, 'tiempos.json'), JSON.stringify({...RAW, palabras: pal}));
}

const DUR = r(RAW.duracion + 1.5);
const rel = (a, abs) => r(abs - a);
const B = {
  S1: 0, S2a: r(t(9) - 0.1), S2b: r(t(19) - 0.1), S2c: r(t(31) - 0.1),
  S31: r(t(41) - 0.1), S32: r(t(51) - 0.1), S33: r(t(60) - 0.1), S34: r(t(73) - 0.1), S35: r(t(83) - 0.1),
  S4a: r(t(93) - 0.1), S4b: r(t(100) - 0.1), S4c: r(t(108) - 0.1), S4d: r(t(122) + 0.6), S4e: r(t(136) - 0.1), S4f: r(t(143) - 0.1), S4g: r(t(150) - 0.1),
  S5a: r(t(161) - 0.1), S5b: r(t(172) - 0.1), S5c: r(t(184) - 0.1),
  S6a: r(t(197) - 0.1), S6b: r(t(205) - 0.1), S6c: r(t(211) - 0.1),
};
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
// Notas ancladas por su base (y <= 1490, 36 px): sin `y`, Notas usa bottom. El argumento y se ignora a propósito.
const nota = (lineas, _y, en = 0, o = {}) => ({tipo: 'notas', lineas, en, ...o});

const CR = {
  F1: 'Foto: Benjamín Núñez González · CC BY-SA 4.0 · Wikimedia Commons',
  F2: 'Foto: Vickybol (Vicky Bolaños) · CC BY-SA 3.0 · Wikimedia Commons',
  F3: 'Foto: Javier Pérez Montes (Nerve net) · CC BY-SA 4.0 · Wikimedia Commons',
  F6: 'Foto: Barcex · CC BY-SA 4.0 · Wikimedia Commons (recorte)',
  F7: 'Foto: Pool Moncloa / Fernando Calvo · La Moncloa (recorte)',
  F8: 'Foto: Gage Skidmore · CC BY-SA 2.0 · Wikimedia Commons (recorte)',
};
// Notas de las tarjetas de postura (misma plantilla para las tres: retrato + titular + cargo + fecha/fuente; sin comillas)
const AYUSO = {tipo: 'tarjetaPostura', src: 'ret-F6.jpg', titular: 'Ayuso: no votar por correo', cargo: 'Isabel Díaz Ayuso · presidenta de la Comunidad de Madrid (PP)', nota: '5-10-2026 · según Europa Press', retrato: 240, tit: 76};
const FEIJOO = {tipo: 'tarjetaPostura', src: 'ret-F7.jpg', titular: 'Feijóo: carteros, sí · directivos de Correos, no', cargo: 'Alberto Núñez Feijóo · presidente del PP', nota: 'Pide más garantías a la JEC · 7-10-2026'};
const ABASCAL = {tipo: 'tarjetaPostura', src: 'ret-F8.jpg', titular: 'Abascal (Vox): votar en la urna', cargo: 'Santiago Abascal · presidente de Vox', nota: '5-10-2026 · según Europa Press'};

// 1 · Gancho
{
  const a = B.S1, b = B.S2a;
  const pu = rel(a, t(8)) - 0.35;
  esc(a, b, {}, [
    {tipo: 'gancho', texto: 'VOTO POR CORREO: ¿PUCHERAZO?', y: 335, tamano: 100, en: 0},
    rot('pucherazo = amañar votos', 690, 0.5),
    {tipo: 'puerta', x: 540, y: 960, alto: 340, ang: [0.25, 0.55], angEn: pu, angDur: 0.5, sobreEn: 0.25, interroga: pu + 0.35},
  ]);
}
// 2a · Ayuso
{
  const a = B.S2a, b = B.S2b;
  esc(a, b, {}, [
    {...AYUSO, y: 470, en: 0.05},
    nota([CR.F6], 1450, 0.1),
  ]);
}
// 2b · Feijóo y Abascal (la tarjeta de Ayuso ya ha salido)
{
  const a = B.S2b, b = B.S2c;
  esc(a, b, {}, [
    {...FEIJOO, y: 345, en: 0.05},
    {...ABASCAL, y: 807, en: rel(a, t(26)) - 0.1},
    nota([CR.F7, CR.F8], 1450, 0.1),
  ]);
}
// 2c · Temen manipulación / fraudes reales -> recorrido
{
  const a = B.S2c, b = B.S31;
  const frau = rel(a, t(36)) - 0.1;
  esc(a, b, {}, [
    rot('Temen manipulación', 345, 0.05),
    rot('Y ha habido fraudes', 425, frau),
    {tipo: 'dib', nombre: 'sobre', x: 540, y: 780, tamano: 300, en: 0.1, hasta: frau},
    {tipo: 'dib', nombre: 'manoCorta', x: 200, y: 780, tamano: 260, en: 0.15, hasta: frau, mover: {x: 330, y: 780, en: 0.5, dur: 1.2}},
    {tipo: 'dib', nombre: 'lupaSobre', x: 540, y: 800, tamano: 340, en: frau + 0.1},
    {tipo: 'recorrido', y: 1040, enc: [null, null, null, null], dibuja: rel(a, t(39)), contador: false},
  ]);
}
const CTR = {yContador: 336, alin: 'izq'}; // contador bajo el logo (logo: y 262-326)
const REC = (enc, extra = {}) => ({tipo: 'recorrido', y: 1040, enc, dibuja: -2, ...CTR, ...extra});
const Y1 = 440, Y2 = 520, Y3 = 600; // rótulos de las escenas con contador
// 3.1 · Uno
{
  const a = B.S31, b = B.S32;
  esc(a, b, {}, [
    rot('1 · LO PIDES:', Y1, 0.05),
    rot('DNI o certificado digital', Y2, 0.15),
    {tipo: 'dib', nombre: 'oficina', x: 190, y: 770, tamano: 250, en: 0.3},
    {tipo: 'dib', nombre: 'dni', x: 500, y: 770, tamano: 250, en: rel(a, t(45)) - 0.5},
    {tipo: 'dib', nombre: 'portatil', x: 800, y: 770, tamano: 250, en: rel(a, t(48)) - 0.1},
    REC([0.1, null, null, null]),
    nota(['LOREG art. 72'], 1450, 0.1),
  ]);
}
// 3.2 · Dos
{
  const a = B.S32, b = B.S33;
  esc(a, b, {}, [
    rot('2 · TE LLEGA:', Y1, 0.05),
    rot('firmas e identificas', Y2, 0.15),
    {tipo: 'dib', nombre: 'cartero', x: 290, y: 780, tamano: 320, en: 0.25},
    {tipo: 'dib', nombre: 'firma', x: 720, y: 780, tamano: 300, en: rel(a, t(57)) - 0.3, dur: 1.0},
    REC([-1, 0.1, null, null]),
    nota(['LOREG art. 73.2'], 1450, 0.1),
  ]);
}
// 3.3 · Tres: foto de Correos y luego caja fuerte con calendario
{
  const a = B.S33, b = B.S34;
  const cut = rel(a, t(71)) - 0.1; // "queda"
  const R3 = [rot('3 · LO ENTREGAS:', Y1, 0.05), rot('DNI otra vez', Y2, 0.15), rot('Custodiado hasta el día de votar', Y3, 0.4)];
  esc(a, a + cut, {}, [
    ...R3,
    {tipo: 'foto', src: 'F1.jpg', x: 510, y: 975, ancho: 900, alto: 350, dur: cut, zoom: [1.02, 1.14], en: 0.3, credito: CR.F1, notas: ['JEC, Instr. 5/2023 · LOREG art. 73.4']},
    {tipo: 'controles', n: 3, en: 0.05, ...CTR, y: CTR.yContador},
  ]);
  esc(a + cut, b, {}, [
    ...R3.map((x) => ({...x, en: -1})),
    {tipo: 'dib', nombre: 'cajaFuerte', x: 330, y: 900, tamano: 270, en: 0.1},
    {tipo: 'dib', nombre: 'sobre', x: 330, y: 770, tamano: 120, en: 0.1, mover: {x: 330, y: 870, en: 0.5, dur: 0.8}, hasta: 1.4},
    {tipo: 'dib', nombre: 'calendario', x: 770, y: 830, tamano: 0, en: 0}, // marcador sustituido abajo
    REC([-1, -1, -1, null], {}),
    nota(['JEC, Instr. 5/2023 · LOREG art. 73.4'], 1450, 0.1),
  ]);
  // calendario pequeño "29-N": se usa el icono compartido con mes/día
  const ult = ESC[ESC.length - 1];
  ult.componentes = ult.componentes.filter((c) => !(c.nombre === 'calendario'));
  ult.componentes.push({tipo: 'icono', nombre: 'calendario', x: 770, y: 910, tamano: 220, mes: 'NOV', dia: '29', en: 0.9});
}
// 3.4 · Cuatro: mesa electoral (solo la mitad inferior)
{
  const a = B.S34, b = B.S35;
  esc(a, b, {}, [
    rot('4 · EN LA MESA:', Y1, 0.05),
    rot('certificado y censo', Y2, 0.15),
    {tipo: 'foto', src: 'F4c.jpg', x: 510, y: 905, ancho: 900, alto: 480, dur: rel(a, t(83)) - rel(a, 0) + 0.5, zoom: [1.04, 1.16], en: 0.3, notas: ['LOREG art. 88.2', 'Mesa electoral, 23-J 2023, Valladolid · Foto: MiguelAlanCS · CC BY-SA 4.0 (recorte)']},
    {tipo: 'dib', nombre: 'lista', x: 780, y: 1020, tamano: 200, en: rel(a, t(76)) - 0.3, dur: 1.2},
    {tipo: 'controles', n: 4, en: 0.05, ...CTR, y: CTR.yContador},
  ]);
}
// 3.5 · Recuento público
{
  const a = B.S35, b = B.S4a;
  esc(a, b, {}, [
    rot('Recuento público,', Y1, 0.05),
    rot('con interventores', Y2, 0.15),
    {tipo: 'icono', nombre: 'papeletaSin', x: 220, y: 770, tamano: 180, en: 0.3},
    {tipo: 'icono', nombre: 'urnaSin', x: 540, y: 770, tamano: 280, en: 0.2},
    {tipo: 'icono', nombre: 'papeletaSin', x: 860, y: 770, tamano: 180, en: 0.4},
    ...['circulo', 'triangulo', 'cuadrado', 'rombo'].map((f, i) => ({tipo: 'dib', nombre: 'persona', forma: f, x: 160 + i * 230, y: 925, tamano: 130, en: rel(a, t(88)) - 0.2 + i * 0.12})),
    REC([-1, -1, -1, 0.1]),
    nota(['LOREG arts. 78.1 y 95.2–4'], 1450, 0.1),
  ]);
}
// 4a · ¿Nunca ha habido trampa? Melilla
{
  const a = B.S4a, b = B.S4b;
  esc(a, b, {}, [
    {tipo: 'sello', valor: 'DATO', x: 540, y: 335, tamano: 90, angulo: 4, seco: true, en: rel(a, t(97)) - 0.4},
    rot('¿Nunca ha habido trampa? SÍ', 520, 0.05),
    {tipo: 'mapaMelilla', x: 510, y: 930, ancho: 800, zoomEn: rel(a, t(98)) - 0.1, zoomDur: 1.0, pinEn: rel(a, t(98)) + 0.8, en: 0.05},
    nota(['Más casos, en la descripción'], 1450, 0.1),
  ]);
}
// 4b · 2008
{
  const a = B.S4b, b = B.S4c;
  esc(a, b, {}, [
    rot('2008: votos a cambio de empleo', 345, 0.05),
    {tipo: 'dib', nombre: 'manoCorta', x: 200, y: 710, tamano: 260, en: 0.2},
    {tipo: 'dib', nombre: 'manoCorta', espejo: true, x: 560, y: 710, tamano: 260, en: 0.3},
    {tipo: 'dib', nombre: 'sobre', x: 300, y: 700, tamano: 140, en: 0.4, mover: {x: 460, y: 700, en: 0.8, dur: 1.2, arco: 40}},
    {tipo: 'dib', nombre: 'maletin', x: 840, y: 720, tamano: 220, en: rel(a, t(106)) - 0.2},
    {tipo: 'lineaTiempo', y: 930, hitos: [{etiqueta: '2008', en: 0.3}]},
    nota(['Generales 2008 (Senado) · Poder Judicial'], 1450, 0.1),
  ]);
}
// 4c · Condenas del Supremo
{
  const a = B.S4c, b = B.S4d;
  esc(a, b, {}, [
    rot('Condenados: líderes de CpM y PSOE melillense', 345, 0.05),
    {tipo: 'foto', src: 'F3.jpg', x: 510, y: 640, ancho: 900, alto: 220, foco: '50% 38%', dur: rel(a, b), zoom: [1.02, 1.12], en: 0.3},
    {tipo: 'dib', nombre: 'persona', forma: 'circulo', x: 280, y: 815, tamano: 100, en: 0.9},
    rot('Presidente de CpM', 870, 1.0, {tamano: 36, izq: 60, ancho: 440, align: 'center'}),
    {tipo: 'dib', nombre: 'persona', forma: 'cuadrado', x: 740, y: 815, tamano: 100, en: 2.0},
    rot('Entonces líder del PSOE de Melilla', 870, 2.1, {tamano: 36, izq: 520, ancho: 440, align: 'center'}),
    rot('2018 Audiencia ·', 985, 2.2),
    rot('2021 Supremo', 1060, 3.0),
    nota(['presidente de CpM y ex secretario general del PSOE de Melilla · Tribunal Supremo, 17-02-2021 · poderjudicial.es · ' + CR.F3], 1450, 0.1),
  ]);
}
const BAR = (extra, f2) => ({tipo: 'barrasEje', max: 25, paso: 5, yEje: 990, x0: 330, anchoMax: 440, filas: [
  {etiqueta: 'Melilla', valor: 21, texto: '≈ 21 %', color: '#F2B134', y: 800, ...extra},
  ...(f2 ? [{etiqueta: 'España', valor: 3, texto: '≈ 3 %', color: '#8D99AE', y: 890, ...f2}] : []),
]});
// 4d · Melilla 2023: 1 de cada 5
{
  const a = B.S4d, b = B.S4e;
  esc(a, b, {}, [
    rot('MELILLA 2023: 1 DE CADA 5', 345, 0.05),
    {tipo: 'personas5', y: 660, tamano: 130, enciendeEn: rel(a, t(126)) + 0.2, en: 0.2},
    {...BAR({en: rel(a, t(129)) + 0.1, dur: 1.2}), en: 0.1},
    nota(['Solicitudes de voto por correo, 28-M · Correos, vía Maldita y Que.es'], 1450, 0.1),
  ]);
}
// 4e · España: 3 de cada 100
{
  const a = B.S4e, b = B.S4f;
  esc(a, b, {}, [
    rot('ESPAÑA: 3 DE CADA 100', 345, 0.05),
    {tipo: 'personas5', y: 660, tamano: 130, enciendeEn: -1, en: -1},
    {...BAR({en: -1, dur: 0.01}, {en: rel(a, t(139)) - 0.2, dur: 0.9}), en: -1},
  ]);
}
// 4f · Alarmas
{
  const a = B.S4f, b = B.S4g;
  esc(a, b, {}, [
    rot('Alarma: detenidos por presunta compra de votos', 345, 0.05),
    {tipo: 'dib', nombre: 'alarma', x: 290, y: 680, tamano: 190, en: 0.2, latido: [0.3, 2.6], dur: 2.5},
    {tipo: 'dib', nombre: 'lupaSobre', x: 730, y: 680, tamano: 220, en: rel(a, t(147)) - 0.2},
    {...BAR({en: -1, dur: 0.01, parpadeo: [0.3, 1.6]}, {en: -1, dur: 0.01}), en: -1},
    nota(['Mayo de 2023 · investigación judicial abierta · Fuente: Maldita'], 1450, 0.1),
  ]);
}
// 4g · Desde 2023: DNI al entregar
{
  const a = B.S4g, b = B.S5a;
  esc(a, b, {}, [
    rot('Desde 2023: DNI al entregar el voto', 345, 0.05),
    {tipo: 'dib', nombre: 'dni', x: 540, y: 740, tamano: 330, en: 0.3},
    {tipo: 'anillo', x: 540, y: 740, r: 205, en: 0.9},
    REC([-1, -1, -1, -1], {contador: false, halo: 0.5}),
    nota(['JEC, Instrucción 5/2023 (BOE 9-6-2023)'], 1450, 0.1),
  ]);
}
// 5a · PP y Vox ante la JEC
const TARJ_PP = 'PP · más medidas de custodia del voto por correo';
const TARJ_VOX = 'Vox · reclamaciones sobre el voto de residentes en el extranjero (CERA)';
{
  const a = B.S5a, b = B.S5b;
  esc(a, b, {}, [
    rot('PP: más custodia · Vox: voto exterior', 345, 0.05),
    {tipo: 'tarjetaTexto', texto: TARJ_PP, y: 540, en: 0.05},
    {tipo: 'tarjetaTexto', texto: TARJ_VOX, y: 810, en: 0.05},
    nota(['Reclamaciones ante la Junta Electoral Central · Europa Press, 16-10-2026'], 1450, 0.1),
  ]);
}
// 5b · La JEC rechaza
{
  const a = B.S5b, b = B.S5c;
  const sel = rel(a, t(178)) - 0.3; // las tarjetas se mantienen legibles hasta "aplica la ley"
  esc(a, b, {}, [
    rot('JEC: se aplica la ley vigente', 345, 0.05),
    {tipo: 'tarjetaTexto', texto: TARJ_PP, y: 540, en: -1, atenua: sel + 0.3},
    {tipo: 'tarjetaTexto', texto: TARJ_VOX, y: 810, en: -1, atenua: sel + 0.3},
    {tipo: 'dib', nombre: 'docJEC', x: 540, y: 790, tamano: 420, en: sel - 0.2, animEn: sel + 0.1, dur: 0.5},
    {tipo: 'notaEscribe', lineas: ['«…en tanto no sean modificados por el legislador» · JEC, vía Europa Press, 16-10-2026'], en: rel(a, t(176)), dur: 2.6},
  ]);
}
// 5c · Para cambiarla: reformar la LOREG
{
  const a = B.S5c, b = B.S6a;
  esc(a, b, {}, [
    rot('Cambiarla: reformar la LOREG, mayoría absoluta', 345, 0.05),
    {tipo: 'foto', src: 'F2.jpg', x: 510, y: 790, ancho: 900, alto: 340, foco: '50% 55%', dur: rel(a, b), zoom: [1.02, 1.14], en: 0.3},
    {tipo: 'escanos', y: 990, en: rel(a, t(193)) - 0.6, llena: rel(a, t(193)) - 0.3},
    nota(['CE art. 81 · Cortes disueltas desde el 6-10 · decreto-ley excluido (CE art. 86.1)', CR.F2], 1450, 0.1),
  ]);
}
// 6a · Cierre con bucle: puerta cerrada con cerrojos y alarma + sello MITO
{
  const a = B.S6a, b = B.S6b;
  const w = rel(a, t(202));
  esc(a, b, {}, [
    {tipo: 'sello', valor: 'MITO', x: 540, y: 335, tamano: 100, angulo: -6, seco: true, en: rel(a, t(199)) - 0.2},
    rot('¿Puerta abierta? No: cerrojos y alarma', 580, 0.05),
    {tipo: 'puerta', x: 540, y: 930, alto: 330, ang: [0.0, 0.0], sobreEn: null, cerrojos: [0.15, 0.35, 0.55, 0.75].map((v, i) => rel(a, t(202)) - 0.3 + i * 0.25), alarma: rel(a, t(204)) - 0.2, en: 0.1},
  ]);
}
// 6b · Plazo
{
  const a = B.S6b, b = B.S6c;
  esc(a, b, {}, [
    rot('Plazo para pedirlo:', 345, 0.05),
    rot('19 de noviembre', 425, 0.15),
    {tipo: 'icono', nombre: 'calendario', x: 300, y: 770, tamano: 330, mes: 'NOV', dia: '19', en: 0.2},
    {tipo: 'anillo', x: 300, y: 790, r: 205, en: rel(a, t(208)) - 0.2},
    {tipo: 'icono', nombre: 'calendario', x: 770, y: 770, tamano: 330, mes: 'NOV', dia: '29', en: 0.5},
    {tipo: 'icono', nombre: 'urnaSin', x: 770, y: 1010, tamano: 150, en: 0.9},
    nota(['LOREG art. 72 · elecciones 29-N'], 1450, 0.1),
  ]);
}
// 6c · Cierre
{
  const a = B.S6c;
  esc(a, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
    {tipo: 'cierre', frase: '¿En tu casa se discute?', tamano: 88, yGuardalo: 1200, yFuentes: 1310, pulso: true},
    {tipo: 'mesaComedor', y: 930, en: 0.3},
  ]);
}

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'crema', componentes: [
  {tipo: 'gancho', texto: 'VOTO POR CORREO: ¿PUCHERAZO?', y: 400, tamano: 104, en: -1},
  {tipo: 'dib', nombre: 'sobreCandado', x: 540, y: 1140, tamano: 420, en: -1, animEn: -1},
]}]};

const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'fin de voz', RAW.duracion.toFixed(2));
ESC.forEach((e, i) => console.log(i + 1, e.inicio, e.fin, (e.fin - e.inicio).toFixed(2)));
