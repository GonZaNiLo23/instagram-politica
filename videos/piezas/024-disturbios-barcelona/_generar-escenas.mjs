// Genera escenas.json desde tiempos.json (tiempos reales de palabra). Uso: node _generar-escenas.mjs
// Los planos con vídeo/foto de X (I1, I2, I4, I5) NO se pudieron descargar: se resuelven con animación provisional.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos-fonetico.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const DUR = r(T.duracion + 2.0);
const rel = (a, abs) => r(abs - a);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});
const nota = (lineas, en = 0.1, o = {}) => ({tipo: 'notas', lineas, en, ...o});
const NB = ' ';
const B = [0, S(12), S(25), S(31), S(37), S(47), S(55), S(67), S(75), S(88), S(91), S(102), S(117), S(132), S(135), S(145), S(146), S(156), S(169), S(178), S(188), S(202), S(205), S(216), S(228), S(241), S(254), S(256), S(270), S(281), DUR];
// b(n) = inicio del plano n (1-based); fin = b(n+1)
const b = (n) => B[n - 1];
const e = (n, ...c) => esc(b(n), b(n + 1), {}, c);
const tt = (n, i) => rel(b(n), t(i)); // segundo de escena de la palabra i

// Posiciones del mapa (coordenadas internas 0-900 x 0-440)
const FURG = [
  {en: 0.8, de: [40, 180], a: [390, 205]},
  {en: 1.5, de: [450, 420], a: [470, 262]},
  {en: 2.2, de: [580, 12], a: [500, 170]},
];
const FURG_FIJOS = FURG.map((f) => ({...f, en: -1}));
const HORAS = ['16:00', '18:00', '20:24', '22:00'];

// 1 · Gancho
esc(0, b(2), {}, [
  rot('TIKTOK → 128 DETENIDOS', 335, -1, {tamano: 72}),
  {tipo: 'movilBcn', x: 540, y: 860, w: 330, en: -1, notif: true, rompe: tt(1, 8) - 0.1, hasta: tt(1, 8) + 0.9},
  {tipo: 'caja', x: 280, y: 770, ancho: 520, alto: 270, opacidad: 1, en: tt(1, 8) - 0.1},
  {tipo: 'contador', desde: 0, hasta: 128, salto: true, en: tt(1, 8) - 0.1, y: 800, tamano: 210, izq: 330, color: '#F2B134'},
]);
// 2 · Cronología
e(2,
  rot('SÁBADO 24-10 · 16:00', 335, 0.05),
  {tipo: 'mapaBcn', y: 500, en: 0.1, furgones: FURG},
  {tipo: 'relojBcn', x: 880, y: 590, desde: [16, 0], en: 0.3},
  {tipo: 'lineaHorasBcn', hitos: HORAS, ens: [0.4, 99, 99, 99], en: 0.3},
  nota(['Despliegue de los Mossos · Fuente: Mossos, vía The Objective']));
e(3,
  rot('18:00 · empiezan los incidentes', 335, 0.05),
  {tipo: 'mapaBcn', y: 500, en: -1, furgones: FURG_FIJOS, puntos: {en: 0.5, dur: 1.4, n: 10}},
  {tipo: 'relojBcn', x: 880, y: 590, desde: [16, 0], a: [18, 0], giraEn: 0.1, dur: 1.4, en: -1},
  {tipo: 'lineaHorasBcn', hitos: HORAS, ens: [-1, 1.3, 99, 99], en: -1});
e(4,
  rot('Barricadas, fuego y saqueos', 335, 0.05),
  {tipo: 'mapaBcn', y: 500, en: -1, furgones: FURG_FIJOS, puntos: {en: -3, n: 10}, iconos: [
    {k: 'contenedor', x: 200, y: 150, en: tt(4, 31)},
    {k: 'barricada', x: 520, y: 88, en: tt(4, 33)},
    {k: 'escaparate', x: 290, y: 345, en: tt(4, 35)},
  ]},
  {tipo: 'relojBcn', x: 880, y: 590, desde: [18, 0], en: -1},
  {tipo: 'lineaHorasBcn', hitos: HORAS, ens: [-1, -1, 99, 99], en: -1});
// 5 · 20:24 (tarjeta + animación en el mapa en lugar del clip I1)
const tarjetaFin = r(tt(5, 42) - 0.2);
esc(b(5), b(6), {}, [
  rot('20:24 · Mossos: que nadie se acerque', 335, 0.05),
  {tipo: 'avisoBcn', x: 60, y: 640, en: 0.1, hasta: tarjetaFin},
  {tipo: 'relojBcn', x: 850, y: 560, desde: [20, 24], en: 0.2, hasta: tarjetaFin},
  nota(['Aviso en X de @mossos, 20:24'], 0.2, {hasta: tarjetaFin}),
  // I1 (@ASAPLUX_): tramo 22,0-24,8 s del clip, recortado y con mosaico de zona amplia (ver imagenes/i1-pelai.mp4)
  {tipo: 'clipBcn', src: 'i1-pelai.mp4', x: 500, y: 812, ancho: 880, alto: 624, en: tarjetaFin + 0.1},
  nota(['Vídeo: @ASAPLUX_ en X · Pelai · publicado 24-10, 21:35'], tarjetaFin + 0.1),
]);
e(6,
  rot('22:00 · últimos incendios apagados', 335, 0.05),
  {tipo: 'mapaBcn', y: 500, en: -1, furgones: FURG_FIJOS, llamas: [
    {x: 200, y: 150, apaga: tt(6, 51) + 0.1},
    {x: 520, y: 100, apaga: tt(6, 51) + 0.5},
    {x: 290, y: 345, apaga: tt(6, 53) + 0.1},
    {x: 450, y: 190, apaga: tt(6, 53) + 0.5},
  ]},
  {tipo: 'relojBcn', x: 880, y: 590, desde: [20, 24], a: [22, 0], giraEn: 0.1, dur: 1.1, en: -1},
  {tipo: 'lineaHorasBcn', hitos: HORAS, ens: [-1, -1, -1, 1.2], en: -1},
  nota(['Fuente: Mossos, vía The Objective']));
// 7 · Balance: detenidos y heridos (la foto I4/I5 va como icono provisional)
e(7,
  {tipo: 'foto', src: 'i4-optica1.jpg', x: 500, y: 520, ancho: 880, alto: 360, foco: '50% 50%', zoom: [1.0, 1.08], dur: 2.6, en: 0.05, hasta: 2.65},
  {tipo: 'foto', src: 'i5-portaferrissa1.jpg', x: 500, y: 520, ancho: 880, alto: 360, foco: '50% 50%', zoom: [1.0, 1.08], dur: 2.6, en: 2.65},
  nota(['Foto: @ASAPLUX_ en X · publicado 25-10, 07:48'], 0.05, {y: 1452, hasta: 2.65}),
  nota(['Foto: @ASAPLUX_ en X · publicado 25-10, 08:06'], 2.65, {y: 1452}),
  {tipo: 'dibujoBcn', nombre: 'puertaFurgon', x: 390, y: 925, tam: 130, en: 0.3},
  {tipo: 'icono', nombre: 'casco', x: 850, y: 920, tamano: 120, en: tt(7, 64) - 0.3},
  {tipo: 'contador', desde: 0, hasta: 128, salto: true, en: tt(7, 60) - 0.05, y: 850, tamano: 130, izq: 60, etiqueta: 'detenidos'},
  {tipo: 'contador', desde: 0, hasta: 15, salto: true, en: tt(7, 64) - 0.05, y: 850, tamano: 130, izq: 560, etiqueta: 'agentes heridos'},
  nota(['14 mossos y 1 guardia urbano · Fuente: Mossos, 25‑10'], 0.1, {y: 1360}));
// 8 · Comercios e incendios
e(8,
  rot('23 comercios · 33 incendios', 335, 0.05),
  {tipo: 'barras', datos: [{etiqueta: 'Comercios', valor: 23, color: '#14213D'}, {etiqueta: 'Incendios', valor: 33, color: '#C8553D'}], max: 33, y: 790, alto: 44, en: 0.2},
  {tipo: 'foto', src: 'i5-portaferrissa2.jpg', x: 500, y: 640, ancho: 880, alto: 250, foco: '50% 60%', zoom: [1.0, 1.08], dur: 3.5, en: 0.05},
  nota(['Foto: @ASAPLUX_ en X · publicado 25-10, 08:06'], 0.05, {y: 1452}),
  nota(['Fuentes: Mossos y Bombers'], 0.1, {y: 1410}));
// 9 · Acampada
e(9,
  rot('Nada que ver con la acampada', 335, 0.05),
  {tipo: 'mapaBcn', y: 530, en: 0.1, acampada: {en: 0.3}},
  nota(['Lo dice el alcalde, Jaume Collboni · 25-10']));
// 10 · ¿Cómo empezó?
e(10,
  rot('¿CÓMO EMPEZÓ?', 335, 0.05),
  {tipo: 'movilBcn', x: 540, y: 860, w: 330, en: 0.1});
// 11 · Francia
e(11,
  rot('Copiar las protestas de Francia', 335, 0.05),
  {tipo: 'movilBcn', x: 260, y: 860, w: 290, en: 0.1, tarjetas: {en: 0.4, n: 3}},
  {tipo: 'dibujoBcn', nombre: 'flecha', x: 530, y: 860, tam: 150, en: tt(11, 98)},
  {tipo: 'mapaH', paises: ['fr'], x: 620, y: 1060, k: 30, en: tt(11, 98)},
  {tipo: 'icono', nombre: 'instituto', x: 790, y: 640, tamano: 160, en: tt(11, 100), animEn: tt(11, 100) + 0.1},
  nota(['Unos 20 perfiles · Fuente: Newtral, vía Público']));
// 12 · Grupos cerrados
e(12,
  rot('Grupos cerrados: ropa negra, cara tapada', 335, 0.05),
  {tipo: 'dibujoBcn', nombre: 'burbujas', x: 290, y: 800, tam: 340, en: 0.2},
  {tipo: 'dibujoBcn', nombre: 'sudadera', x: 730, y: 800, tam: 300, en: tt(12, 113) - 0.3},
  nota(['Canal de Barcelona: unas 700 personas', 'Fuente: Público, 25-10']));
// 13 · Unas 500 personas
e(13,
  rot('Unas 500 personas', 335, 0.05),
  {tipo: 'mapaBcn', k: 1.0, y: 450, en: 0.1, personas: {en: tt(13, 121) - 0.1, dur: 1.0, n: 500}},
  {tipo: 'contador', desde: 0, hasta: 500, prefijo: '≈ ', salto: true, en: tt(13, 123) + 0.3, y: 800, tamano: 80, izq: 700},
  {tipo: 'tarjetaBcn', x: 60, y: 930, alto: 200, mini: true, nombre: 'Núria Parlon', cargo: 'consellera de Interior', en: tt(13, 129)},
  nota(['Fuente: Núria Parlon, consellera de Interior']));
// 14 · ¿Quiénes eran?
e(14,
  rot('¿QUIÉNES ERAN?', 335, 0.05),
  {tipo: 'siluetasBcn', y: 510, en: 0.1});
// 15 · Más de la mitad
e(15,
  rot('Más de la mitad, menores', 335, 0.05),
  {tipo: 'siluetasBcn', y: 510, en: -1, tinte: {n: 72, en: 0.2, dur: 1.7}},
  {tipo: 'contador', desde: 0, hasta: 56, sufijo: ' %', salto: true, en: tt(15, 142) - 0.05, y: 905, tamano: 150, izq: 60},
  nota(['72 de 128 (56 %) · Fuente: Mossos']));
// 16 · ¿Antecedentes?
e(16,
  rot('¿ANTECEDENTES?', 335, 0.05),
  {tipo: 'siluetasBcn', y: 510, en: -1, lupa: {en: 0.1, dur: 1.0}});
// 17 · Solo 2 de 128
e(17,
  rot('Solo 2 de 128', 335, 0.05),
  {tipo: 'siluetasBcn', y: 510, en: -1, destacadas: {n: 2, en: tt(17, 147) - 0.1}},
  {tipo: 'contador', desde: 0, hasta: 2, sufijo: '/128', salto: true, en: tt(17, 147) - 0.1, y: 905, tamano: 150, izq: 60},
  nota(['Ambos por desórdenes públicos · Fuente: Mossos, 25-10']));
// 18 · Catà
e(18,
  rot('Catà (Mossos): violencia gratuita', 335, 0.05),
  {tipo: 'tarjetaBcn', x: 60, y: 560, alto: 250, nombre: 'Sílvia Catà', cargo: 'comisaria jefa de los Mossos', en: 0.15},
  {tipo: 'orgBcn', x: 540, y: 960, en: tt(18, 165) - 0.3},
  nota(['Sin grupos criminales detrás, según Catà · comisaria jefa · 25-10 · vía Público']));
// 19 · Vox y AC
const ETIQ = (en) => rot('LO QUE DICEN LOS PARTIDOS', 335, en, {pastilla: true, tamano: 64});
e(19,
  ETIQ(0.05),
  rot(`Vox y Aliança${NB}Catalana: inmigración`, 500, 0.3),
  {tipo: 'tarjetaBcn', x: 60, y: 700, alto: 190, mini: true, nombre: 'Vox', en: tt(19, 169)},
  {tipo: 'tarjetaBcn', x: 60, y: 920, alto: 190, mini: true, nombre: 'Aliança Catalana', en: tt(19, 171) - 0.1},
  nota(['Sílvia Orriols (AC), en X, 25-10: lo vincula a la inmigración · vía EFE']));
// 20 · Garriga
e(20,
  ETIQ(-1),
  rot('Garriga (Vox): jóvenes extranjeros', 500, 0.15),
  {tipo: 'tarjetaBcn', x: 60, y: 720, alto: 280, nombre: 'Ignacio Garriga', cargo: 'secretario general de Vox', en: 0.2},
  nota(['Vídeo en redes, 25-10 · vía EFE']));
// 21 · Sin datos oficiales
e(21,
  ETIQ(-1),
  rot('Mossos: sin datos de nacionalidad', 500, 0.1),
  {tipo: 'siluetasBcn', y: 700, en: 0.3},
  {tipo: 'selloTexto', lineas: ['SIN DATOS', 'OFICIALES'], x: 540, y: 820, tamano: 84, angulo: -4, fondo: '#8D99AE', desde: 400, en: tt(21, 191)},
  nota(['Es lo habitual, según EFE · 25-10']));
// 22 · ¿Y los demás?
const dorso = (x, y, en) => ({tipo: 'tarjetaBcn', x, y, ancho: 430, alto: 250, nombre: ' ', dorso: true, girar: 99, en});
e(22,
  rot('¿Y LOS DEMÁS?', 335, 0.05),
  dorso(60, 600, 0.1), dorso(510, 600, 0.25), dorso(60, 880, 0.4), dorso(510, 880, 0.55));
// 23 · Illa
e(23,
  rot('Illa (PSC): protestar sí, destrozar no', 335, 0.05),
  {tipo: 'tarjetaBcn', x: 60, y: 560, alto: 290, nombre: 'Salvador Illa', cargo: 'president de la Generalitat (PSC)', dorso: true, girar: 0.15, en: 0.05},
  {tipo: 'icono', nombre: 'pancartaCheck', x: 250, y: 990, tamano: 250, en: tt(23, 210) - 0.2, animEn: tt(23, 210)},
  {tipo: 'icono', nombre: 'escaparate', x: 640, y: 990, tamano: 240, en: tt(23, 214) - 0.2, animEn: tt(23, 214)},
  {tipo: 'icono', nombre: 'aspa', x: 850, y: 990, tamano: 120, en: tt(23, 215) - 0.1, animEn: tt(23, 215)},
  nota(['En X, 24-10']));
// 24 · Collboni
e(24,
  rot('Collboni: responsabilidades también a los padres', 335, 0.05),
  {tipo: 'tarjetaBcn', x: 60, y: 600, alto: 250, nombre: 'Jaume Collboni', cargo: 'alcalde de Barcelona (PSC)', dorso: true, girar: 0.15, en: 0.05},
  {tipo: 'dibujoBcn', nombre: 'balanzaPadres', x: 540, y: 990, tam: 240, en: tt(24, 221) - 0.3},
  nota(['El Ayuntamiento se personará en las causas · Pide que no quede impune · 25-10'], 0.1, {hasta: 2.5}),
  nota(['El Ayuntamiento conocía las convocatorias, según Collboni'], 2.6));
// 25 · Junts
e(25,
  rot('Junts: el Govern "tenía información previa"', 335, 0.05),
  {tipo: 'tarjetaBcn', x: 60, y: 600, alto: 220, nombre: 'Mònica Sales', cargo: 'Junts', dorso: true, girar: 0.15, en: 0.05},
  {tipo: 'dibujoBcn', nombre: 'carpetaAviso', x: 250, y: 990, tam: 240, en: tt(25, 233) - 0.3},
  {tipo: 'dibujoBcn', nombre: 'flecha', x: 530, y: 990, tam: 150, en: tt(25, 237) - 0.3},
  {tipo: 'dibujoBcn', nombre: 'parlament', x: 790, y: 990, tam: 240, en: tt(25, 237)},
  nota(['Mònica Sales, presidenta del grupo de Junts · en X, 25-10 · Pide que comparezca Parlon']));
// 26 · Feijóo
e(26,
  rot('Feijóo (PP): argumentos, nunca violencia', 335, 0.05),
  {tipo: 'tarjetaBcn', x: 60, y: 600, alto: 280, nombre: 'Alberto Núñez|Feijóo', cargo: 'presidente del PP', dorso: true, girar: 0.15, en: 0.05},
  {tipo: 'dibujoBcn', nombre: 'bocadillos', x: 540, y: 1010, tam: 250, en: tt(26, 245) - 0.3},
  nota(['En X, 24-10']));
// 27 · ¿Y ahora?
e(27,
  rot('¿Y AHORA?', 335, 0.05),
  {tipo: 'calendarioHojas', x: 540, y: 820, tamano: 380, hojas: [{mes: 'OCT', dia: '25', en: 0}, {mes: 'OCT', dia: '26', en: 0.3}, {mes: 'OCT', dia: '27', en: 0.55}], en: 0.05});
// 28 · Ley del Menor
e(28,
  rot('Si es responsable, responden sus padres', 335, 0.05),
  {tipo: 'foto', src: 'i4-optica2.jpg', x: 500, y: 690, ancho: 880, alto: 340, foco: '50% 50%', zoom: [1.0, 1.08], dur: 4.6, en: 0.05},
  {tipo: 'dibujoBcn', nombre: 'factura', x: 290, y: 1000, tam: 200, en: 0.3},
  {tipo: 'dibujoBcn', nombre: 'balanzaPadres', x: 730, y: 1000, tam: 200, en: tt(28, 262) - 0.3},
  nota(['Foto: @ASAPLUX_ en X · publicado 25-10, 07:48'], 0.05, {y: 1452}),
  nota(['El juez puede moderarlo si no hubo dolo o negligencia grave · LO 5/2000, art. 61.3'], 0.1, {hasta: 2.4, y: 1360}),
  nota(['Menores: la Fiscalía decide en 48 h desde la detención (art. 17.5)'], 2.5, {y: 1360}));
// 29 · Quién está detrás
e(29,
  rot('¿Quién está detrás? Se investiga', 335, 0.05),
  {tipo: 'movilBcn', x: 540, y: 840, w: 290, en: 0.1, tarjetas: {en: 0.1, n: 3, sinCaida: true}, lupa: {en: 0.5, dur: 2.6}},
  nota(['Fuente: S. Catà, vía Público']));
// 30 · Cierre
esc(b(30), DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '1 tarde · 1 convocatoria · 128 detenidos', pregunta: '¿Qué harías tú?', tamano: 88, yFrase: 400, yGuardalo: 1200, yFuentes: 1310, pulso: true},
  {tipo: 'contador', desde: 128, hasta: 128, en: 0.3, y: 780, tamano: 150, izq: 60},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'tinta', componentes: [
  {tipo: 'foto', src: 'i4-portada.jpg', forma: 'completa', velo: 0.55, foco: '50% 50%', zoom: [1.0, 1.0], dur: 3, en: -1, sobre: 'oscuro', credito: 'Foto: @ASAPLUX_ en X · publicado 25-10, 07:48'},
  {tipo: 'gancho', texto: 'TIKTOK, SAQUEOS Y 128 DETENIDOS', y: 470, tamano: 100, color: '#F4EFE6', en: -1},
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
ESC.forEach((x, i) => { const d = x.fin - x.inicio; if (d < 1.4) console.log('corta', i + 1, x.inicio, d.toFixed(2)); });

// tiempos.json con la grafía correcta del guion (los subtítulos no llevan la guía fonética); "pe pe:" se fusiona en "PP:"
const FIX = {tiktok: 'TikTok', guasap: 'WhatsApp', 'télegram': 'Telegram', 'guvérn': 'Govern', aliansa: 'Aliança', 'núria': 'Núria', 'parlón': 'Parlon', 'parlón.': 'Parlon.', 'colbóni,': 'Collboni,', 'garriga,': 'Garriga,', 'íya,': 'Illa,', 'feijó-o,': 'Feijóo,'};
const pal = [];
T.palabras.forEach((p, i, a) => {
  if (p.t === 'pe' && a[i + 1]?.t === 'pe:') { pal.push({...p, t: 'PP:', fin: a[i + 1].fin}); return; }
  if (p.t === 'pe:' && a[i - 1]?.t === 'pe') return;
  pal.push({...p, t: FIX[p.t] ?? p.t});
});
fs.writeFileSync(path.join(dir, 'tiempos.json'), JSON.stringify({...T, palabras: pal}, null, 2) + '\n');
console.log('tiempos.json corregido:', pal.length, 'palabras');
