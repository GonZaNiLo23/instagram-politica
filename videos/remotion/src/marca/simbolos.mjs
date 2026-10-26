// Fuente unica del logo @loquepasaenunminuto. La usan los componentes Remotion y los SVG de videos/marca/.
// Colores de la guia de estilo; ninguno asociado a un partido.
export const COLOR = {crema: '#F4EFE6', tinta: '#14213D', mostaza: '#F2B134', turquesa: '#2A9D8F'};

// claro = para fondos claros (crema/mostaza). oscuro = para fondo tinta.
export const TONOS = {
  claro: {linea: COLOR.tinta, cuerpo: COLOR.crema, acento: COLOR.mostaza, acento2: COLOR.turquesa},
  oscuro: {linea: COLOR.crema, cuerpo: COLOR.tinta, acento: COLOR.mostaza, acento2: COLOR.turquesa},
};

const r = (n) => Math.round(n * 100) / 100;
const pt = (cx, cy, rad, deg) => [r(cx + rad * Math.cos((deg * Math.PI) / 180)), r(cy + rad * Math.sin((deg * Math.PI) / 180))];
// Sector desde las 12 en punto, en sentido horario, hasta `grados`
const sector = (cx, cy, rad, grados) => {
  const [x, y] = pt(cx, cy, rad, -90 + grados);
  return `M${cx} ${cy}L${cx} ${cy - rad}A${rad} ${rad} 0 ${grados > 180 ? 1 : 0} 1 ${x} ${y}Z`;
};

/** Contenido SVG (viewBox 0 0 200 200) de cada variante. */
export function simboloInterior(variante = 'A', tono = 'claro') {
  const t = TONOS[tono];
  if (variante === 'A') {
    // Cronometro-bocadillo: reloj con rabito de dialogo y sector de "un minuto"
    const [pa, pb] = [pt(100, 110, 76, 163), pt(100, 110, 76, 118)];
    const burbuja = `M${pa[0]} ${pa[1]}L16 192L${pb[0]} ${pb[1]}A76 76 0 1 0 ${pa[0]} ${pa[1]}Z`;
    return `
<rect x="86" y="8" width="28" height="16" rx="5" fill="${t.linea}"/>
<rect x="94" y="20" width="12" height="16" fill="${t.linea}"/>
<path d="${burbuja}" fill="${t.cuerpo}" stroke="${t.linea}" stroke-width="10" stroke-linejoin="round"/>
<path d="${sector(100, 110, 60, 90)}" fill="${t.acento}"/>
<line x1="100" y1="110" x2="100" y2="58" stroke="${t.linea}" stroke-width="10" stroke-linecap="round"/>
<circle cx="100" cy="110" r="9" fill="${t.linea}"/>`;
  }
  if (variante === 'B') {
    // Hemiciclo-reloj: cupula de escanos con una aguja; los escanos a la derecha de la aguja, en mostaza
    const filas = [[36, 5], [60, 9], [84, 13]];
    let s = '';
    for (const [rad, n] of filas) {
      for (let i = 0; i < n; i++) {
        const deg = 180 + (180 * i) / (n - 1);
        const [x, y] = pt(100, 158, rad, deg);
        if (i === (n - 1) / 2) continue;
        const dentro = deg > 270;
        s += `<circle cx="${x}" cy="${y}" r="8" fill="${dentro ? t.acento : t.linea}"/>`;
      }
    }
    return `${s}
<line x1="100" y1="158" x2="100" y2="74" stroke="${t.linea}" stroke-width="10" stroke-linecap="round"/>
<circle cx="100" cy="158" r="13" fill="${t.linea}"/>
<rect x="10" y="176" width="180" height="10" rx="5" fill="${t.linea}"/>`;
  }
  // C: bocadillo con esfera de reloj tipo "quesito" (el minuto como porcion)
  return `
<polygon points="40,138 28,184 88,148" fill="${t.linea}" stroke="${t.linea}" stroke-width="10" stroke-linejoin="round"/>
<rect x="12" y="20" width="176" height="132" rx="40" fill="${t.linea}"/>
<circle cx="100" cy="86" r="48" fill="${t.cuerpo}"/>
<path d="${sector(100, 86, 48, 90)}" fill="${t.acento}"/>
<line x1="100" y1="86" x2="100" y2="50" stroke="${t.linea}" stroke-width="9" stroke-linecap="round"/>
<circle cx="100" cy="86" r="8" fill="${t.linea}"/>`;
}

export const svgSimbolo = (variante = 'A', tono = 'claro') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">${simboloInterior(variante, tono)}\n</svg>\n`;

/** Logo horizontal: simbolo + nombre (viewBox 720x240). Sin fondo. */
export function logoInterior(variante = 'A', tono = 'claro') {
  const t = TONOS[tono];
  const fuente = `font-family="'Archivo Black','Arial Black',sans-serif"`;
  return `
<g transform="translate(10 20)">${simboloInterior(variante, tono)}</g>
<text x="240" y="108" ${fuente} font-size="54" fill="${t.linea}" letter-spacing="1">LO QUE PASA</text>
<text x="240" y="172" ${fuente} font-size="54" fill="${t.linea}" letter-spacing="1">EN UN <tspan fill="${t.acento}">MINUTO</tspan></text>`;
}

export const svgLogo = (variante = 'A', tono = 'claro') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 240" width="720" height="240">${logoInterior(variante, tono)}\n</svg>\n`;
