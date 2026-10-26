// Uso: node render-carrusel.mjs NNN-slug vX
import fs from 'fs';
import {execSync} from 'child_process';
const [pieza, ver] = process.argv.slice(2);
const j = JSON.parse(fs.readFileSync(`../piezas/${pieza}/carrusel.json`, 'utf8'));
const out = `../../carruseles/${pieza}-${ver}`;
fs.mkdirSync(out, {recursive: true});
j.slides.forEach((_, i) => {
  const pf = `${out}/_props.json`;
  fs.writeFileSync(pf, JSON.stringify({slides: j.slides, indice: i}));
  const n = String(i + 1).padStart(2, '0');
  execSync(`npx remotion still src/carrusel/index.ts Carrusel ${out}/${n}.png --props=${pf}`, {stdio: 'inherit'});
});
fs.unlinkSync(`${out}/_props.json`);
