// Quita el fondo de una foto (en local, sin enviarla a ningún servicio) y la deja como PNG transparente recortado al objeto.
// Uso: node videos/recorte/recortar.mjs <entrada.jpg|png> <salida.png> [x,y,ancho,alto]
// El encuadre opcional (en px de la foto original) deja fuera del recorte lo que no es el objeto (carteles, otras personas…):
// el modelo a veces conserva trozos del fondo pegados al objeto. Elige fotos con fondo sencillo.
// La foto debe tener licencia libre y su crédito va en la tabla de imágenes del guion, como cualquier foto.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
// sharp tiene que cargarse antes que onnxruntime: en Windows, al revés, chocan sus DLL (ERR_DLOPEN_FAILED)
import sharp from 'sharp';
const {removeBackground} = await import('@imgly/background-removal-node');

const [entrada, salida, encuadre] = process.argv.slice(2);
if (!entrada || !salida) { console.error('Uso: node videos/recorte/recortar.mjs <entrada> <salida.png>'); process.exit(1); }

let img = sharp(fs.readFileSync(entrada));
if (encuadre) {
  const [left, top, width, height] = encuadre.split(',').map(Number);
  img = img.extract({left, top, width, height});
}
const origen = await img.png().toBuffer();
const blob = await removeBackground(new Blob([origen], {type: 'image/png'}), {model: 'medium', output: {format: 'image/png'}});
const png = Buffer.from(await blob.arrayBuffer());
// Recorta el borde transparente y deja un margen de 24 px para el contorno blanco del componente
const recortado = await sharp(png).trim({threshold: 10}).extend({top: 24, bottom: 24, left: 24, right: 24, background: {r: 0, g: 0, b: 0, alpha: 0}}).png().toBuffer();
fs.mkdirSync(path.dirname(path.resolve(salida)), {recursive: true});
fs.writeFileSync(salida, recortado);
const {width, height} = await sharp(recortado).metadata();
console.log(`OK ${salida} (${width}x${height})`);
