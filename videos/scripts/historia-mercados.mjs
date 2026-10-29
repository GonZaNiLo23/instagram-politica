// Renderiza la historia diaria de mercados: node videos/scripts/historia-mercados.mjs AAAA-MM-DD
// Lee estado/mercados/AAAA-MM-DD.json (cifras, de mercados.mjs) y estado/mercados/AAAA-MM-DD-textos.json
// ({"titular", "subtitulo", "causas": [{"texto", "fuente"}], "fuentes"}) y deja los PNG en estado/mercados/AAAA-MM-DD/.
import '../../herramientas/publicar-api/ocultar.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {REMOTION, RAIZ_VIDEOS} from './herramientas.mjs';

const fecha = process.argv[2];
if (!fecha) { console.error('Uso: node videos/scripts/historia-mercados.mjs AAAA-MM-DD'); process.exit(1); }
const base = path.join(RAIZ_VIDEOS, '..', 'estado', 'mercados');
const datos = JSON.parse(fs.readFileSync(path.join(base, `${fecha}.json`), 'utf8'));
const textos = JSON.parse(fs.readFileSync(path.join(base, `${fecha}-textos.json`), 'utf8'));
const fallos = datos.activos.filter((a) => a.error);
if (fallos.length) { console.error(`Faltan datos de: ${fallos.map((a) => a.nombre).join(', ')}`); process.exit(1); }

const [a, m, d] = fecha.split('-');
const dia = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'][new Date(`${fecha}T12:00:00`).getDay()];
const comun = {fecha: `${dia} ${d}-${m}-${a}`, fuentes: textos.fuentes};
const pantallas = [
  {pantalla: 'portada', titular: textos.titular, subtitulo: textos.subtitulo, numero: '1/3'},
  {pantalla: 'cifras', activos: datos.activos.map(({nombre, cierre, variacion, unidad, decimales}) => ({nombre, cierre, variacion, unidad, decimales})), numero: '2/3'},
  {pantalla: 'porque', causas: textos.causas, numero: '3/3'},
];

const salida = path.join(base, fecha);
fs.mkdirSync(salida, {recursive: true});
const cli = path.join(REMOTION, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');
pantallas.forEach((p, i) => {
  const props = path.join(salida, `_props-${i + 1}.json`);
  fs.writeFileSync(props, JSON.stringify({...comun, ...p}));
  const png = path.join(salida, `${i + 1}-${p.pantalla}.png`);
  const r = spawnSync(process.execPath, [cli, 'still', 'src/index.ts', 'HistoriaMercados', png, `--props=${props}`, '--log=error'], {cwd: REMOTION, encoding: 'utf8'});
  if (r.status !== 0) { console.error(`${r.stdout}${r.stderr}`.split('\n').slice(-20).join('\n')); process.exit(1); }
  fs.rmSync(props);
  console.log(png);
});
