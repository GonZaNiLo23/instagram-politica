// Recorte manual (polígono) de la fachada del Senado: el modelo automático borra el edificio. Uso: node _recorte-manual.mjs
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const req = createRequire(path.join(dir, '../../recorte/package.json'));
const sharp = req('sharp');
const pts = [[250,955],[250,700],[262,650],[270,415],[330,275],[500,345],[545,355],[552,478],[1240,228],[1240,955]];
const X0 = 230, Y0 = 270, W = 1015, H = 735;
const poly = pts.map(([x, y]) => `${x - X0},${y - Y0}`).join(' ');
const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><polygon points="${poly}" fill="#fff"/></svg>`);
const base = await sharp(path.join(dir, 'imagenes/senado-orig.jpg')).extract({left: X0, top: Y0, width: W, height: H}).ensureAlpha().toBuffer();
const out = await sharp(base).composite([{input: mask, blend: 'dest-in'}]).png().toBuffer();
const fin = await sharp(out).trim({threshold: 10}).extend({top: 24, bottom: 24, left: 24, right: 24, background: {r: 0, g: 0, b: 0, alpha: 0}}).png().toBuffer();
await sharp(fin).toFile(path.join(dir, 'imagenes/senado.png'));
console.log((await sharp(fin).metadata()).width, (await sharp(fin).metadata()).height);
