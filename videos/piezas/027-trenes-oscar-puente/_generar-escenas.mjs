// v2: fotos reales de Commons + vectoriales, contador fijo "HECHO n DE 6" y bucle con el gancho.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const r = (x) => +x.toFixed(2);
const S = (i) => r(t(i) - 0.1);
const rel = (base, i) => r(t(i) - base);
const DUR = r(T.duracion + 2.6);
const ESC = [];
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const rot = (texto, y, en = 0.05, o = {}) => ({tipo: 'rotulo', texto, y, en, tamano: 64, ...o});

// === Cifras que pueden cambiar ===
const ADAMUZ_MUERTOS = '45';
const URDA_VICTIMAS = 'SIN CERRAR';
const TITULAR = `ADAMUZ: ${ADAMUZ_MUERTOS} MUERTOS · CAUSA SIN CERRAR`;

// Créditos (texto de la tabla del guion)
const CR = {
  I1: 'Foto: Savh / Wikimedia Commons, CC BY-SA 3.0',
  I2: 'Foto: Carlos Teixidor Cadenas / Wikimedia Commons, CC BY-SA 4.0',
  I3: 'Foto: La Moncloa / Wikimedia Commons',
  I4: 'Foto: Pool Moncloa / José Manuel Álvarez / Wikimedia Commons',
  I5: 'Foto: Carlos Teixidor Cadenas / Wikimedia Commons, CC BY-SA 3.0',
  I6: 'Foto: Brunnaiz / Wikimedia Commons, CC BY-SA 4.0',
  I7: 'Foto: Peter elektro / Wikimedia Commons, CC BY-SA 3.0',
  I8: 'Foto: Dilema / Wikimedia Commons, CC BY 3.0',
  I9: 'Foto: La Moncloa / Wikimedia Commons',
};
const ARCH = (y = 1040) => rot('Imagen de archivo', y, -1, {pastilla: true});
// Foto a pantalla completa (tren / edificio). Corte seco: en -1.
const full = (id, a, b, o = {}) => ({tipo: 'foto', src: `${id}.jpg`, forma: 'completa', en: -1, dur: (b - a) + 1, zoom: o.zoom ?? [1.0, 1.22], foco: o.foco ?? '50% 50%', pan: o.pan ?? [0, 0], velo: o.velo ?? 0, credito: CR[id], sobre: 'oscuro'});
// Tarjeta propia de Puente (sobre fondo crema, sin trenes)
const card = (id, a, b, o = {}) => ({tipo: 'foto', src: `${id}.jpg`, forma: 'rect', x: 500, y: o.y ?? 850, ancho: 880, alto: o.alto ?? 640, en: o.en ?? 0.05, dur: (b - a) + 1, zoom: o.zoom ?? [1.0, 1.2], foco: o.foco ?? '50% 30%', pan: o.pan ?? [0, 0], credito: CR[id]});
const badge = (n, en = -1) => rot(`HECHO ${n} DE 6`, 330, en, {pastilla: true});
const rt = (txt, y, en, o = {}) => rot(txt, y, en, o); // rótulo sobre fondo crema
const rp = (txt, y, en, o = {}) => rot(txt, y, en, {pastilla: 'tinta', ...o}); // rótulo sobre foto

// ================= 1 · Gancho (0 – 7,3 s) =================
const g1 = S(8), g2 = S(14), b2 = S(24);
esc(0, g1, {fondo: 'tinta'}, [
  full('I1', 0, g1, {zoom: [1.0, 1.25], foco: '50% 62%', velo: 0.4}),
  rp(TITULAR, 335, -1, {tamano: 72, hasta: rel(0, 14) - 0.1}), ARCH(),
  {tipo: 'numTr', x: 540, y: 960, valor: ADAMUZ_MUERTOS, tam: 380, en: -1, color: '#FFF8EC'},
]);
esc(g1, g2, {fondo: 'tinta'}, [
  full('I1', g1, g2, {zoom: [1.5, 1.2], foco: '52% 55%', velo: 0.4}),
  rp(TITULAR, 335, -1, {tamano: 72, hasta: rel(g1, 14) - 0.1}), ARCH(),
  {tipo: 'numTr', x: 540, y: 960, valor: ADAMUZ_MUERTOS, tam: 380, en: -1, color: '#FFF8EC'},
]);
esc(g2, b2, {fondo: 'tinta'}, [
  full('I2', g2, b2, {zoom: [1.0, 1.3], foco: '78% 55%', velo: 0.1}),
  rp('El tren desde 2023', 335, -1, {tamano: 72}), ARCH(),
]);

// ================= 2 · Contexto (7,3 – 19,9 s) =================
const c2 = S(33), c3 = S(39), c4 = S(44), c5 = S(49), b3 = S(58);
esc(b2, c2, {}, [
  card('I3', b2, c2, {foco: '50% 25%', zoom: [1.0, 1.25]}),
  rt('MINISTRO DESDE EL 21-11-2023', 335, 0.05),
]);
esc(c2, c3, {}, [
  card('I3', c2, c3, {en: -1, foco: '50% 30%', zoom: [1.35, 1.1]}),
  rt('MINISTRO DESDE EL 21-11-2023', 335, -1),
]);
esc(c3, c4, {}, [
  card('I4', c3, c4, {foco: '50% 45%', zoom: [1.0, 1.35]}),
  rt('NO ES UN BALANCE COMPLETO', 335, 0.05),
]);
esc(c4, c5, {}, [
  card('I4', c4, c5, {en: -1, foco: '50% 68%', zoom: [1.9, 1.6]}),
  rt('NO ES UN BALANCE COMPLETO', 335, -1),
]);
esc(c5, b3, {}, [
  rt('CAUSAS: CIAF Y JUZGADO', 335, 0.05),
  {tipo: 'lupaMazoTr', x: 540, y: 830, en: 0.2, mazoEn: rel(c5, 55)},
]);

// ================= 3 · Explicación =================
// Hecho 1 (19,9 – 33,7)
const h1b = S(65), h1c = S(77), h1d = S(81), h1e = S(85), b3b = S(97);
esc(b3, h1b, {}, [
  full('I5', b3, h1b, {zoom: [1.0, 1.3], foco: '70% 55%', velo: 0.25}), badge(1, 0.05),
  rp('4-5-2025 · ROBO DE CABLE', 425, 0.05), ARCH(),
]);
esc(h1b, h1c, {}, [
  badge(1), rt('4-5-2025 · ROBO DE CABLE', 425, -1),
  {tipo: 'toledoTr', y: 170, en: 0.15, corteEn: rel(h1b, 70) - 0.1, esposasEn: 99},
]);
esc(h1c, h1d, {}, [
  full('I5', h1c, h1d, {zoom: [1.5, 1.15], foco: '30% 50%', velo: 0.25}), badge(1),
  rp('MILES DE VIAJEROS AFECTADOS', 425, 0.05), ARCH(),
]);
esc(h1d, h1e, {}, [
  card('I3', h1d, h1e, {foco: '50% 22%', zoom: [1.15, 1.0], y: 880, alto: 600}), badge(1),
]);
esc(h1e, b3b, {}, [
  badge(1), rt('JULIO: 2 DETENIDOS POR EL ROBO', 425, 0.05),
  {tipo: 'toledoTr', y: 190, en: 0.1, corteEn: 0, esposasEn: rel(h1e, 90) - 0.1},
]);

// Hecho 2 (33,7 – 41,6)
const h2b = S(104), b3c = S(121);
esc(b3b, h2b, {}, [
  full('I2', b3b, h2b, {zoom: [1.4, 1.05], foco: '60% 60%', velo: 0.55}), badge(2, 0.05),
  rp('18-1-2026 · ADAMUZ (CÓRDOBA)', 425, 0.05), ARCH(),
]);
esc(h2b, b3c, {}, [
  badge(2), rt('18-1-2026 · ADAMUZ (CÓRDOBA)', 425, -1),
  {tipo: 'viasTr', y: 720, en: 0.1, descarrilaEn: rel(h2b, 108) - 0.2, chocaEn: rel(h2b, 118) - 0.1, bEn: rel(h2b, 114) - 0.4},
]);

// Hecho 3 (41,6 – 49,7)
const h3b = S(131), h3c = S(140), b3d = S(145);
esc(b3c, h3b, {}, [
  full('I7', b3c, h3b, {zoom: [1.0, 1.3], foco: '65% 55%'}), badge(3, 0.05),
  rp('20-1-2026 · GELIDA (BARCELONA)', 425, 0.05), ARCH(),
]);
esc(h3b, h3c, {}, [
  badge(3), rt('20-1-2026 · GELIDA (BARCELONA)', 425, -1, {hasta: rel(h3b, 135) - 0.15}),
  rt('1 MUERTO: MAQUINISTA EN PRÁCTICAS', 425, rel(h3b, 135) - 0.05),
  {tipo: 'muroTr', y: 780, en: 0.1, luto: rel(h3b, 135) - 0.1, paradaEn: 99},
]);
esc(h3c, b3d, {}, [
  full('I6', h3c, b3d, {zoom: [1.0, 1.3], foco: '50% 35%', pan: [0, -120], velo: 0.3}), badge(3),
  rp('RODALIES PARADA DOS DÍAS', 425, 0.05), ARCH(),
]);

// Hecho 4 (49,7 – 57,4)
const h4b = S(153), b4 = S(168);
esc(b3d, h4b, {}, [
  full('I5', b3d, h4b, {zoom: [1.2, 1.0], foco: '80% 50%', velo: 0.45}), badge(4, 0.05),
  rp('HUELGA 9–11 FEB', 425, 0.05), ARCH(),
]);
esc(h4b, b4, {}, [
  badge(4), rt('HUELGA 9–11 FEB · DESCONVOCADA EL 9', 425, -1),
  {tipo: 'calTr', x: 90, y: 640, en: 0.1, diasEn: [0.15, 0.4, 0.65], desconvocaEn: rel(h4b, 159) - 0.1},
]);

// Hecho 5 (57,4 – 70,2)
const h5b = S(181), h5c = S(188), b5 = S(192), h5d = S(202), b6a = S(205);
esc(b4, h5b, {}, [
  badge(5, 0.05), rt('AGOSTO DE 2025: SEMAF AVISA A ADIF', 425, 0.05),
  {tipo: 'giroTr', y: 700, en: 0.2, atrilEn: 99},
]);
esc(h5b, h5c, {}, [
  full('I2', h5b, h5c, {zoom: [1.8, 1.4], foco: '35% 92%', velo: 0.35}), badge(5),
  ARCH(),
]);
esc(h5c, b5, {}, [
  full('I7', h5c, b5, {zoom: [1.5, 1.15], foco: '20% 95%', velo: 0.35}), badge(5),
  ARCH(),
  rp('según Reuters', 930, rel(h5c, 190) - 0.05),
]);
esc(b5, h5d, {}, [
  full('I8', b5, h5d, {zoom: [1.0, 1.3], foco: '50% 40%'}), badge(5),
  rp('3-2-2026: PUENTE EN EL CONGRESO', 425, 0.05), ARCH(),
]);
esc(h5d, b6a, {}, [
  card('I9', h5d, b6a, {foco: '90% 35%', zoom: [1.6, 2.0], y: 930, alto: 560}), badge(5),
  rt('Prometió máxima transparencia', 425, 0.05),
]);

// Hecho 6 (70,2 – 81,4)
const h6b = S(211), b5b = S(219), b5c = S(229), b6 = S(233), b7 = S(237);
esc(b6a, h6b, {}, [
  full('I5', b6a, h6b, {zoom: [1.0, 1.3], foco: '75% 55%', velo: 0.35}), badge(6, 0.05),
  rp('28-10: CHOQUE EN URDA (TOLEDO)', 425, 0.05), ARCH(),
]);
esc(h6b, b5b, {}, [
  badge(6), rt('28-10: CHOQUE EN URDA (TOLEDO)', 425, -1),
  {tipo: 'puntoTr', y: 190, en: 0.1},
]);
esc(b5b, b5c, {}, [
  rt('CIFRA DE VÍCTIMAS SIN CERRAR', 335, 0.05),
  {tipo: 'duoTr', y: 820, valorA: ADAMUZ_MUERTOS, etiquetaA: 'ADAMUZ', valorB: URDA_VICTIMAS, etiquetaB: 'URDA', en: 0.2, enB: rel(b5b, 224) - 0.1, tamB: 64, cxB: 715},
]);

// Pregunta y bucle con el gancho (77,7 – 81,4)
esc(b5c, b6, {fondo: 'tinta'}, [
  full('I1', b5c, b6, {zoom: [1.0, 1.22], foco: '50% 62%', velo: 0.5}),
  rp('¿RESPONSABILIDADES ANTES DEL INFORME?', 335, 0.05), ARCH(),
  rp(TITULAR, 740, 0.05, {tamano: 72}),
]);
esc(b6, b7, {}, [
  rt('¿RESPONSABILIDADES ANTES DEL INFORME?', 335, -1),
  {tipo: 'botonesTr', y: 790, en: 0.3},
]);
// Cierre
esc(b7, DUR, {fondo: 'mostaza', sinSubtitulos: true}, [
  {tipo: 'cierre', frase: '¿RESPONSABILIDADES ANTES DEL INFORME?', tamano: 68, pulso: true, guardaEn: 0.6},
]);

const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'tinta', componentes: [
  {tipo: 'foto', src: 'I1.jpg', forma: 'completa', en: -1, dur: 0.01, zoom: [1.1, 1.1], foco: '50% 62%', velo: 0.45, credito: CR.I1, sobre: 'oscuro'},
  {tipo: 'gancho', texto: `ADAMUZ: ${ADAMUZ_MUERTOS} MUERTOS, CAUSA SIN CERRAR`, y: 330, tamano: 92, en: -1},
  rp('El tren desde 2023', 800, -1, {tamano: 72}), ARCH(1230),
  {tipo: 'numTr', x: 540, y: 1150, valor: ADAMUZ_MUERTOS, tam: 300, en: -1, color: '#FFF8EC'},
]}]};
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.5, marca: '@loquepasaenunminuto', subSinHuerfanas: true, musica: {pista: 'hidden-agenda.mp3', volumen: -16}, portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'voz', T.duracion.toFixed(2));
