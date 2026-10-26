// Genera escenas.json a partir de tiempos.json (marcas reales de palabra). Uso: node _generar-escenas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));
const t = (i) => T.palabras[i].inicio;
const f = (i) => T.palabras[i].fin;
const r = (x) => +x.toFixed(2);
const FIN_VOZ = T.duracion;
const DUR = r(FIN_VOZ + 2.0);

// Límites de escena (en segundos): justo antes de la primera palabra de cada bloque
const B = {
  s1: 0, s3: r(t(20) - 0.1), s4: r(t(27) - 0.12), s5: r(t(35) - 0.1), s6: r(t(40) - 0.1), s7: r(t(45) - 0.1), s8: r(t(54) - 0.1),
  s9: r(t(66) - 0.1), s10: r(t(78) - 0.1), s11: r(t(89) - 0.1), s12: r(t(103) - 0.1), s13: r(t(114) - 0.1), s14: r(t(122) - 0.1),
  s15: r(t(135) - 0.1), s16: r(t(146) - 0.1), s17: r(t(156) - 0.1), s18: r(t(164) - 0.1), s19: r(t(172) - 0.1), s20: r(t(178) - 0.1),
  s21: r(t(192) - 0.1), s22: r(t(205) - 0.1), s23: r(t(211) - 0.1), s24: r(t(221) - 0.1), s25: r(t(233) - 0.12), s26: r(t(267) - 0.15),
};
const fin = DUR;
const ESC = [];
const rel = (a, abs) => r(abs - a); // segundo absoluto -> relativo a la escena
const esc = (a, b, extra, componentes) => ESC.push({inicio: a, fin: b, ...extra, componentes});
const ic = (nombre, x, y, tamano, en, o = {}) => ({tipo: 'icono', nombre, x, y, tamano, en, ...o});
const rot = (texto, y, en = 0, o = {}) => ({tipo: 'rotulo', texto, y, en, ...o});
const nota = (lineas, en = 0, hasta, sobre) => ({tipo: 'notas', lineas, en, ...(hasta ? {hasta} : {}), ...(sobre ? {sobre} : {})});

// 1 · Gancho (0 -> 6,5): móvil, sello MITO en el segundo 3,6, pin a Los Ángeles
{
  const a = 0, b = B.s3;
  esc(a, b, {}, [
    {tipo: 'gancho', texto: '¿Estudiantes franceses saqueando una Nike?', y: 340, tamano: 100, en: 0.05, hasta: 4.4},
    ic('movil', 540, 950, 340, 0.1, {hasta: 4.7, vibra: [0.9, 3.6]}),
    {tipo: 'sello', valor: 'MITO', en: 3.6, y: 830, tamano: 130, hasta: 4.7},
    nota(['Saqueo de una tienda Nike: Los Ángeles, 2023', 'Fuente: Maldita'], 3.7),
    ic('eeuu', 540, 840, 560, rel(a, t(14)) - 0.05),
    ic('pin', 540, 1000, 110, rel(a, t(14)) - 0.1, {mover: {x: 346, y: 800, en: rel(a, t(14)), dur: 0.7, arco: 150}}),
    rot('Los Ángeles', 1010, rel(a, t(15)) + 0.2, {tamano: 72, align: 'center', izq: 60, ancho: 900}),
  ]);
}
// 2 · "Pero lo de Francia sí es real" (DATO)
{
  const a = B.s3, b = B.s4;
  esc(a, b, {}, [
    rot('LO DE FRANCIA ES REAL', 340, 0.1, {tamano: 72}),
    {tipo: 'sello', valor: 'DATO', en: 0.05, y: 470, tamano: 130, angulo: 5},
    {tipo: 'mapa', puntos: [], x: 540, y: 920, ancho: 440},
    ic('pin', 300, 1100, 100, 0.1, {mover: {x: 564, y: 738, en: 0.25, dur: 0.6, arco: 120}}),
  ]);
}
// 3 · Sábado 17-10, F4 con calendario
{
  const a = B.s4, b = B.s5;
  esc(a, b, {fuente: undefined}, [
    rot('SÁBADO 17 DE OCTUBRE', 340, 0.1, {tamano: 72}),
    {tipo: 'foto', src: 'F4b.jpg', forma: 'rect', x: 540, y: 780, ancho: 900, alto: 600, foco: '50% 45%', zoom: [1.04, 1.16], pan: [-30, 0], dur: rel(a, b), en: 0.1, credito: 'Foto: Gabriel from92 · CC0 · Wikimedia Commons'},
    ic('calendario', 800, 1010, 250, 0.4, {mes: 'SÁB OCT', dia: '17'}),
  ]);
}
// 4 · ¿Cuántos? barras
{
  const a = B.s5, b = B.s6;
  esc(a, b, {}, [
    rot('¿Cuántos? Depende de quién cuente', 340, 0.05, {tamano: 72}),
    {tipo: 'barras', datos: [{etiqueta: 'Interior', valor: 550000, color: '#14213D'}], max: 800000, en: 0.15, y: 580},
    {tipo: 'barras', datos: [{etiqueta: 'CGT (organizadores)', valor: 800000, color: '#8D99AE'}], max: 800000, en: rel(a, t(38)) - 0.3, y: 810},
    nota(['Fuentes: Min. Interior, CGT, vía France 24 y AP']),
  ]);
}
// 5 · La mayoría en paz
{
  const a = B.s6, b = B.s7;
  esc(a, b, {}, [
    rot('La mayoría, en paz', 340, 0.05, {tamano: 80}),
    ...[0, 1, 2].map((i) => ic('cartel', 200 + i * 340 - 260, 740, 250, 0.1 + i * 0.2, {mover: {x: 200 + i * 340, y: 740, en: 0.1 + i * 0.15, dur: 0.7}})),
    ic('check', 540, 1000, 200, 0.4, {animEn: 0.4, dur: 0.5}),
  ]);
}
// 6 · Limoges: mapa + antes/después
{
  const a = B.s7, b = B.s8;
  const pts = [['París', 0.5], ['Lyon', 0.7], ['Marsella', 0.9], ['Burdeos', 1.1], ['Lille', 1.3]].map(([nombre, en]) => ({nombre, en}));
  esc(a, b, {}, [
    rot('Limoges: ayuntamiento incendiado', 340, 0.05, {tamano: 64}),
    {tipo: 'mapa', puntos: [...pts, {nombre: 'Limoges', en: rel(a, t(50)) - 0.1}], x: 540, y: 840, ancho: 580, zoom: {punto: 'Limoges', en: rel(a, t(50)) + 0.15, escala: 2.2}, hasta: rel(a, t(51)) - 0.1},
    {tipo: 'comparador', srcA: 'F1.jpg', srcB: 'F2.jpg', x: 540, y: 800, ancho: 900, alto: 620, focoA: '50% 35%', focoB: '55% 40%', barridoEn: rel(a, t(53)) - 0.1, barridoDur: 0.5, en: rel(a, t(51)) - 0.05, dur: rel(a, b),
      creditoA: 'Foto: Oooer · CC0 · Wikimedia Commons', creditoB: 'Foto: Lucas Destrem · CC BY-SA 4.0 · Wikimedia Commons'},
  ]);
}
// 7 · Balance de detenidos y heridos
{
  const a = B.s8, b = B.s9;
  esc(a, b, {}, [
    {tipo: 'contador', desde: 1200, hasta: 2397, salto: true, en: 0.1, espera: rel(a, t(56)) - 0.1, etiquetaDesde: 'detenidos (sáb. noche)', etiqueta: 'detenidos (dom., último balance)', y: 360, tamano: 170},
    ic('casco', 190, 900, 240, rel(a, t(62)) - 0.2),
    {tipo: 'contador', desde: 0, hasta: 997, salto: true, en: rel(a, t(62)) - 0.2, espera: rel(a, t(63)) - rel(a, t(62)) + 0.2, etiqueta: 'policías y gendarmes heridos', y: 780, tamano: 170, izq: 340},
    nota(['Primer balance (sáb. noche): L. Lecornu'], 0, rel(a, t(56)) - 0.1),
    nota(['Según el ministro del Interior, L. Nuñez (18-10)'], rel(a, t(56)) - 0.1),
  ]);
}
// 8 · Origen: institutos (línea de tiempo)
{
  const a = B.s9, b = B.s10;
  esc(a, b, {}, [
    rot('Empezó en los institutos', 340, 0.05, {tamano: 72}),
    ic('instituto', 540, 690, 250, 0.15),
    {tipo: 'lineaTiempo', y: 860, hitos: [{etiqueta: 'Mediados sept.', en: rel(a, t(70)) - 0.2}, {etiqueta: 'Fin sept.', en: rel(a, t(75))}, {etiqueta: '17-10', en: rel(a, t(77)) + 0.4}]},
    nota(['Mediados de sept. · Créteil (afueras de París)', 'Fin de sept.: unos 400 institutos afectados']),
  ]);
}
// 9 · Aulas de 35 + faltan profesores (F6)
{
  const a = B.s10, b = B.s11;
  const cambio = rel(a, t(85)) - 0.1;
  esc(a, b, {}, [
    rot('Aulas de hasta 35 alumnos', 340, 0.05, {tamano: 72, hasta: cambio + 0.12}),
    ic('aula', 540, 800, 520, 0.1, {dur: Math.max(1.4, cambio - 0.6), hasta: cambio + 0.12}),
    rot('Faltan profesores', 340, cambio, {tamano: 72}),
    {tipo: 'foto', src: 'F6b.jpg', forma: 'rect', x: 540, y: 780, ancho: 900, alto: 560, foco: '50% 55%', zoom: [1.02, 1.14], dur: rel(cambio, b), en: cambio, notas: ['Según el sindicato de estudiantes USL'], credito: 'Foto: Coolpix2026 · CC0 · Wikimedia Commons'},
  ]);
}
// 10 · Sindicatos y chalecos -> cesta de la compra (F7)
{
  const a = B.s11, b = B.s12;
  const cambio = rel(a, t(94)) - 0.1;
  esc(a, b, {}, [
    rot('Del aula a la cesta de la compra', 340, 0.05, {tamano: 72}),
    ic('megafono', 260, 760, 270, rel(a, t(90)) - 0.1, {hasta: cambio + 0.12, etiqueta: 'Sindicatos (CGT)', anchoEtiqueta: 420}),
    ic('chaleco', 740, 760, 270, rel(a, t(92)) - 0.1, {hasta: cambio + 0.12, etiqueta: 'Chalecos amarillos', anchoEtiqueta: 440}),
    nota(['Chalecos amarillos: movimiento nacido en 2018', 'CGT: 2.º sindicato, tras la CFDT'], 0.3, cambio),
    ic('carrito', 320, 780, 380, cambio),
    {tipo: 'foto', src: 'F7.jpg', forma: 'rect', x: 760, y: 780, ancho: 380, alto: 520, foco: '55% 62%', zoom: [1.0, 1.1], dur: rel(cambio, b), en: cambio + 0.15, credito: 'Foto: Florian Cuny · CC BY-SA 4.0 · Wikimedia Commons'},
  ]);
}
// 11 · Inflación 3,1 %
{
  const a = B.s12, b = B.s13;
  esc(a, b, {}, [
    rot('Inflación: 3,1 %', 340, 0.05, {tamano: 80}),
    {tipo: 'barrasV', datos: [{etiqueta: 'Agosto', valor: 2.4, texto: '2,4 %', color: '#8D99AE'}, {etiqueta: 'Septiembre', valor: 3.1, texto: '3,1 %', color: '#14213D'}], max: 3.5, x: 400, base: 1030, altoMax: 400, ancho: 620, en: 0.5},
    ic('carrito', 850, 760, 230, 0.4),
    nota(['Septiembre 2026, interanual · agosto: 2,4 %', 'Fuente: INSEE']),
  ]);
}
// 12 · Energía +21 %
{
  const a = B.s13, b = B.s14;
  esc(a, b, {}, [
    rot('Energía: +21 % en un año', 340, 0.05, {tamano: 72}),
    ic('surtidor', 300, 650, 250, 0.1),
    ic('bombilla', 700, 650, 250, 0.3),
    {tipo: 'contador', desde: 0, hasta: 21, salto: true, prefijo: '+', sufijo: ' %', en: 0.2, espera: rel(a, t(117)) - 0.2, y: 820, tamano: 190, izq: 340},
    nota(['Fuente: INSEE, sept. 2026 (+21,3 %)']),
  ]);
}
// 13 · ¿Y quién manda? + Macron
{
  const a = B.s14, b = B.s15;
  const ini = rel(a, t(125)) - 0.1;
  const dos = rel(a, t(129)) - 0.15;
  esc(a, b, {}, [
    {tipo: 'gancho', texto: '¿Y quién manda?', y: 420, tamano: 130, en: 0.05, hasta: ini + 0.1},
    ic('tarjetas', 540, 940, 440, 0.1, {hasta: ini + 0.1, dur: 0.8}),
    {tipo: 'foto', src: 'ret-P1.jpg', forma: 'circulo', x: 540, y: 590, alto: 440, zoom: [1.0, 1.2], dur: rel(ini, b), en: ini, credito: 'Foto: © European Union · CC BY 4.0 · Wikimedia Commons'},
    rot('Emmanuel Macron · presidente', 850, ini + 0.1, {tamano: 64, align: 'center', hasta: dos}),
    rot('Presidenciales: abril de 2027', 850, dos, {tamano: 64, align: 'center'}),
    ic('relojArena', 860, 560, 190, dos),
    nota(['No puede repetir: máx. 2 mandatos seguidos (Const., art. 6) · 1.ª vuelta: 18-04-2027', 'Foto: © European Union · CC BY 4.0 · Wikimedia Commons'], dos),
  ]);
}
// (la nota de Macron incluye el crédito; se quita el del componente foto para no duplicarlo)
ESC[ESC.length - 1].componentes.find((c) => c.tipo === 'foto').credito = undefined;
// 14 · Lecornu: sin mayoría
{
  const a = B.s15, b = B.s16;
  const cambio = rel(a, t(140)) - 0.1;
  esc(a, b, {}, [
    {tipo: 'foto', src: 'ret-P2.jpg', forma: 'circulo', x: 540, y: 590, alto: 440, zoom: [1.0, 1.2], dur: cambio, en: 0.05, hasta: cambio + 0.12, notas: ['Su presupuesto de 2026 salió por el art. 49.3, sin votarse'], credito: 'Foto: GautierGadriot · CC BY-SA 4.0 · Wikimedia Commons'},
    rot('Sébastien Lecornu · primer ministro', 850, 0.15, {tamano: 64, align: 'center', hasta: cambio + 0.12}),
    rot('Sin mayoría en la Asamblea', 340, cambio, {tamano: 64}),
    {tipo: 'balanza', x: 540, y: 660, en: cambio + 0.1, ticEn: cambio + 0.6, cruzEn: cambio + 0.9, oscila: [cambio + 0.6, cambio + 0.9], etiquetaIzq: '149 sí', etiquetaDer: '236 no'},
    nota(['13-10: el PS (socialistas) pidió rechazarlo sin debate · 149 sí / 236 no · el RN votó no: tenía la llave', 'Fuente: Asamblea Nacional (vía LCP, datan)'], cambio),
  ]);
}
// 15 · 54.000 millones
{
  const a = B.s16, b = B.s17;
  esc(a, b, {}, [
    rot('54.000 millones de ahorro', 340, 0.05, {tamano: 72}),
    ic('hucha', 540, 700, 340, 0.15, {dur: 3}),
    {tipo: 'contador', desde: 0, hasta: 54000, salto: true, sufijo: ' M€', en: 0.2, espera: rel(a, t(149)) - 0.2, y: 900, tamano: 128, izq: 140},
    nota(['Presupuesto 2027 · objetivo: déficit del 5 %', 'Fuente: Gobierno, vía AFP y LCP']),
  ]);
}
// 16 · Congelar sueldo
{
  const a = B.s17, b = B.s18;
  esc(a, b, {}, [
    rot('Propuesta: congelar el sueldo de funcionarios', 340, 0.05, {tamano: 64}),
    ic('nomina', 290, 790, 330, rel(a, t(157)) - 0.2, {dur: 0.8}),
    ic('pensiones', 750, 790, 330, rel(a, t(157)) + 0.8, {dur: 1.2}),
    nota(['Sueldo base (punto de índice), 2027 · y menos subida para algunas pensiones (las de más de 1.256 €)']),
  ]);
}
// 17 · CGT: que paguen los más ricos
{
  const a = B.s18, b = B.s19;
  esc(a, b, {}, [
    rot('CGT: que paguen los más ricos', 340, 0.05, {tamano: 72}),
    ic('megafono', 270, 790, 320, 0.15),
    ic('balanzaSaco', 740, 790, 360, 0.5, {dur: 1.6}),
    nota(['Y que no se recorten servicios públicos · S. Binet (16-10)']),
  ]);
}
// 18 · Gobierno culpa a la ultraizquierda
{
  const a = B.s19, b = B.s20;
  esc(a, b, {}, [
    rot('Gobierno: culpa a la ultraizquierda', 340, 0.05, {tamano: 72}),
    ic('matignon', 540, 800, 400, 0.15),
    nota(['Interior: protestar es un derecho fundamental · Macron: quien saqueó pagará los daños']),
  ]);
}
// 19 · ¿Lo curioso? Le Pen y Mélenchon (pantalla partida)
{
  const a = B.s20, b = B.s21;
  const ini = rel(a, t(180)) - 0.15;
  const hh = 200;
  const tx = {izq: 290, ancho: 670};
  esc(a, b, {}, [
    {tipo: 'gancho', texto: '¿Lo curioso?', y: 620, tamano: 130, en: 0.05, hasta: ini - 0.05},
    rot('Le Pen y Mélenchon: no a los saqueos', 340, ini, {tamano: 64}),
    {tipo: 'linea', y: 806, ancho: 700, grosor: 6, en: ini},
    {tipo: 'foto', src: 'ret-P3.jpg', forma: 'circulo', x: 160, y: 655, alto: hh, zoom: [1.0, 1.25], dur: rel(ini, b), en: ini + 0.05},
    rot('Marine Le Pen', 510, ini + 0.15, {tamano: 64, ...tx}),
    {tipo: 'notas', lineas: ['RN (Reagrupamiento Nacional)'], y: 578, en: ini + 0.15, ...tx},
    {tipo: 'notas', lineas: ['Reivindicaciones legítimas, secuestradas por la ultraizquierda'], y: 626, en: ini + 1.9, tamano: 44, ...tx},
    {tipo: 'foto', src: 'ret-P4.jpg', forma: 'circulo', x: 160, y: 950, alto: hh, zoom: [1.0, 1.25], dur: rel(ini, b), en: ini + 0.45},
    rot('Jean-Luc Mélenchon', 822, ini + 0.55, {tamano: 64, ...tx}),
    {tipo: 'notas', lineas: ['LFI (Francia Insumisa)'], y: 890, en: ini + 0.55, ...tx},
    {tipo: 'notas', lineas: ['El saqueo no cabe en nuestra lucha · culpa a Lecornu'], y: 938, en: ini + 2.6, tamano: 44, ...tx},
    ic('escaparate', 160, 806, 84, ini + 1.2, {vibra: [ini + 1.2, ini + 4.5]}),
    nota(['Foto: Foto-AG Gymnasium Melle · CC BY-SA 3.0 / Foto: Lula Oficial · CC BY-SA 2.0 · Wikimedia Commons'], ini),
  ]);
}
// 20 · Críticas a la policía (Saint-Étienne)
{
  const a = B.s21, b = B.s22;
  esc(a, b, {}, [
    rot('Críticas a la policía', 340, 0.05, {tamano: 72}),
    ic('lupaPlaca', 250, 720, 300, 0.15),
    {tipo: 'mapa', puntos: [{nombre: 'Saint-Étienne', en: rel(a, t(199)) - 0.1}], x: 730, y: 720, ancho: 380},
    rot('Saint-Étienne', 990, rel(a, t(199)), {tamano: 72, align: 'center', izq: 60, ancho: 900}),
    nota(['Saint-Étienne: chico de 17 años · Interior no descarta una granada de la gendarmería']),
  ]);
}
// 21 · Investigación abierta
{
  const a = B.s22, b = B.s23;
  esc(a, b, {}, [
    rot('Investigación abierta', 340, 0.05, {tamano: 72}),
    ic('lupaPlaca', 540, 680, 340, 0, {animEn: 0}),
    {tipo: 'selloTexto', lineas: ['EN INVESTIGACIÓN'], en: 0.7, y: 930, tamano: 64, fondo: '#8D99AE'},
    nota(['IGPN: inspección de la policía']),
  ]);
}
// 22 · ¿Y ahora? + próximas convocatorias
{
  const a = B.s23, b = B.s24;
  const ini = rel(a, t(213)) - 0.1;
  esc(a, b, {}, [
    {tipo: 'gancho', texto: '¿Y ahora?', y: 420, tamano: 130, en: 0.05, hasta: ini + 0.05},
    ic('calendario', 540, 900, 380, 0.1, {hasta: ini + 0.05, mes: 'OCT', dia: '19'}),
    rot('Próximas convocatorias', 340, ini + 0.1, {tamano: 72}),
    {tipo: 'lineaVertical', en: ini + 0.1, y: 560, paso: 112, filas: [
      {fecha: '22-10', texto: 'institutos', en: ini + 0.4},
      {fecha: '24-10', texto: 'chalecos amarillos', en: ini + 0.8},
      {fecha: '31-10', texto: 'chalecos amarillos', en: ini + 1.3},
      {fecha: '5-11', texto: 'huelga sindical', nota: 'CFDT, CGT, FO, Unsa, FSU', en: rel(a, t(218)) - 0.1},
    ]},
    nota(['Lecornu pide toques de queda parciales (19-10)', 'Fuente: France 24, 19-10 · a fecha de hoy'], ini + 0.1),
  ]);
}
// 23 · Plazo del presupuesto
{
  const a = B.s24, b = B.s25;
  esc(a, b, {}, [
    rot('Presupuesto: plazo hasta el 17-11', 340, 0.05, {tamano: 72}),
    ic('asamblea', 320, 790, 360, 0.15),
    ic('reloj', 760, 790, 320, 0.4, {dur: rel(a, b) - 0.6}),
    nota(['40 días en 1.ª lectura; si no, pasa al Senado (Const., art. 47)']),
  ]);
}
// 24 · Nuestra lectura (opinión, fondo tinta)
{
  const a = B.s25, b = B.s26;
  const deficit = rel(a, t(251)) - 0.2;
  const pacto = rel(a, t(263)) - 0.15;
  esc(a, b, {fondo: 'tinta', lectura: true}, [
    rot('Protestar, sí. Quemar ayuntamientos, no.', 440, rel(a, t(235)) - 0.3, {tamano: 72, color: '#F4EFE6', hasta: deficit - 0.05}),
    ic('pancartaCheck', 300, 870, 300, rel(a, t(235)) - 0.1, {hasta: deficit - 0.05, disco: true, vibra: [rel(a, t(235)) + 1.0, rel(a, t(242))]}),
    ic('edificioAspa', 740, 870, 300, rel(a, t(242)) - 0.1, {hasta: deficit - 0.05, disco: true, dur: 5}),
    ic('aspa', 860, 990, 130, rel(a, t(242)) + 0.5, {hasta: deficit - 0.05}),
    rot('Déficit 2025: 5,1 % del PIB', 440, deficit, {tamano: 72, color: '#F4EFE6', hasta: pacto - 0.05}),
    {tipo: 'barras', datos: [{etiqueta: 'Déficit 2025 (% del PIB)', valor: 5.1, texto: '5,1 %', color: '#F2B134'}], max: 6, en: deficit + 0.15, y: 760, color: '#F4EFE6', hasta: pacto - 0.05},
    nota(['Fuente: INSEE'], deficit, pacto - 0.05, 'oscuro'),
    rot('Ajustar, sí. Pero pactado.', 440, pacto, {tamano: 72, color: '#F4EFE6'}),
    ic('manos', 540, 880, 340, pacto, {disco: true}),
  ]);
}
// 25 · Cierre
{
  const a = B.s26, b = fin;
  esc(a, b, {fondo: 'mostaza'}, [
    {tipo: 'cierre', frase: 'Lo real: vida cara y Gobierno sin mayoría', tamano: 76, yGuardalo: 1345, yFuentes: 1432},
    ic('movil', 360, 950, 300, 0.3, {vibra: [0.5, 2.9]}),
    {tipo: 'sello', valor: 'MITO', en: rel(a, f(276)) + 0.05, y: 880, tamano: 80, x: 700},
  ]);
}

// ---- Portada: titular sobre F3 con velo tinta al 40 % (dentro del recorte 4:5) ----
const portada = {escenas: [{inicio: 0, fin: 3, fondo: 'tinta', componentes: [
  {tipo: 'foto', src: 'F3.jpg', forma: 'completa', foco: '50% 50%', zoom: [1.0, 1.0], dur: 3, velo: 0.4, credito: 'Foto: Alacoolwiki · CC BY 4.0 · Wikimedia Commons', sobre: 'oscuro'},
  {tipo: 'marca', sobre: 'oscuro'},
  {tipo: 'caja', y: 505, alto: 575, opacidad: 0.78},
  {tipo: 'gancho', texto: 'FRANCIA: QUÉ PASÓ Y POR QUÉ', y: 540, tamano: 118, en: 0, color: '#F4EFE6'},
]}]};

// Sin cierres de escena superpuestos: ajustar `fin` de cada una al inicio de la siguiente
const out = {plantilla: 'estandar', duracion: DUR, portadaSegundo: 1.2, marca: '@loquepasaenunminuto', portada, escenas: ESC};
fs.writeFileSync(path.join(dir, 'escenas.json'), JSON.stringify(out, null, 2));
console.log('escenas:', ESC.length, 'duración', DUR, 'fin de voz', FIN_VOZ.toFixed(2));
ESC.forEach((e, i) => console.log(i + 1, e.inicio, e.fin, (e.fin - e.inicio).toFixed(2)));
