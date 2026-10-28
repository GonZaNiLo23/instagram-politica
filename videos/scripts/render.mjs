// Uso: node videos/scripts/render.mjs NNN-slug [--v=v1] [--voz] [--objetivo=32] [--aviso]
//  --voz       regenera la voz aunque ya exista tiempos.json
//  --aviso     pinta "VOZ PROVISIONAL" en pantalla (solo pruebas)
// Hace: voz -> props.json -> render H.264 CRF 18 -> música de fondo (si escenas.json trae "musica") -> loudnorm -14 LUFS -> ffprobe -> 6 fotogramas de control -> portada -> comprobar.mjs (avisos mecánicos).
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {REMOTION, RAIZ_VIDEOS, FFMPEG, FFPROBE, ejecutar, rutaPieza, cargarEnv} from './herramientas.mjs';

cargarEnv();
const [id, ...resto] = process.argv.slice(2);
if (!id) { console.error('Falta NNN-slug'); process.exit(1); }
const arg = (k, d) => (resto.find((a) => a.startsWith(`--${k}=`)) || '').split('=')[1] ?? d;
const flag = (k) => resto.includes(`--${k}`);
const version = arg('v', 'v1');
const dir = rutaPieza(id);
const node = process.execPath;
const cli = path.join(REMOTION, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');

// Sin salida mientras va bien (el progreso de Remotion llenaría el contexto del agente); si falla, las últimas 30 líneas
const sh = (cmd, args, cwd, verTodo = false) => {
  const r = spawnSync(cmd, args, {cwd, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024});
  if (verTodo && r.stdout) process.stdout.write(r.stdout);
  if (r.status !== 0) {
    console.error(`${r.stdout || ''}${r.stderr || ''}`.trim().split('\n').slice(-30).join('\n'));
    console.error(`Falló: ${cmd} ${args.slice(0, 3).join(' ')}`);
    process.exit(r.status || 1);
  }
  const avisos = `${r.stdout || ''}\n${r.stderr || ''}`.split('\n').filter((l) => /aviso|warn|provisional/i.test(l));
  if (avisos.length) console.log(avisos.slice(-10).join('\n'));
};

// 1. Voz
if (flag('voz') || !fs.existsSync(path.join(dir, 'tiempos.json'))) sh(node, [path.join(RAIZ_VIDEOS, 'scripts', 'voz.mjs'), id], RAIZ_VIDEOS, true);
const tiempos = JSON.parse(fs.readFileSync(path.join(dir, 'tiempos.json'), 'utf8'));

// 2. Props
const esc = JSON.parse(fs.readFileSync(path.join(dir, 'escenas.json'), 'utf8'));
const finEscenas = Math.max(...esc.escenas.map((e) => e.fin));
const props = {
  ...esc,
  id,
  audio: 'voz.mp3',
  provisional: tiempos.provisional,
  avisoProvisional: flag('aviso'),
  palabras: tiempos.palabras,
  duracion: esc.duracion ?? Math.max(finEscenas, 1),
};
const propsF = path.join(dir, 'props.json');
fs.writeFileSync(propsF, JSON.stringify(props, null, 2));
if (tiempos.duracion > props.duracion + 0.5) console.warn(`AVISO: la voz dura ${tiempos.duracion.toFixed(1)} s y el vídeo ${props.duracion} s`);

// 3. Render
const renders = path.join(RAIZ_VIDEOS, 'renders');
fs.mkdirSync(renders, {recursive: true});
const crudo = path.join(dir, '_crudo.mp4');
const final = path.join(renders, `${id}-${version}.mp4`);
sh(node, [cli, 'render', 'src/index.ts', 'Pieza', crudo, `--props=${propsF}`, `--public-dir=${dir}`, '--codec=h264', '--crf=18', '--audio-codec=aac', '--audio-bitrate=192k'], REMOTION);

// 3b. Música de fondo opcional: "musica": {"pista": "wallpaper.mp3", "volumen": -20} en escenas.json (pistas y licencias en videos/musica/).
// Baja sola cuando habla la voz (sidechain) y entra y sale con fundido.
let fuente = crudo;
if (esc.musica?.pista) {
  const pista = path.join(RAIZ_VIDEOS, 'musica', esc.musica.pista);
  if (!fs.existsSync(pista)) { console.error(`No existe la pista ${pista}`); process.exit(1); }
  const vol = esc.musica.volumen ?? -20;
  const d = props.duracion;
  fuente = path.join(dir, '_mezcla.mp4');
  const fc = `[1:a]volume=${vol}dB,afade=t=in:d=1,afade=t=out:st=${Math.max(0, d - 2.5)}:d=2.5[m];[0:a]asplit=2[v1][v2];[m][v1]sidechaincompress=threshold=0.02:ratio=6:attack=30:release=500[md];[v2][md]amix=inputs=2:duration=first:normalize=0[a]`;
  sh(FFMPEG, ['-y', '-loglevel', 'error', '-i', crudo, '-stream_loop', '-1', '-i', pista, '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', String(d), fuente], RAIZ_VIDEOS);
  console.log(`Música: ${esc.musica.pista} a ${vol} dB (crédito obligatorio en el post: ver videos/musica/LICENCIAS.md)`);
}

// 4. Normalización a -14 LUFS (dos pasadas)
const medida = ejecutar(FFMPEG, ['-hide_banner', '-i', fuente, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-']);
const jm = (medida.stderr.match(/\{[\s\S]*?\}/g) || []).pop();
let af = 'loudnorm=I=-14:TP=-1.5:LRA=11';
try {
  const m = JSON.parse(jm);
  if (isFinite(parseFloat(m.input_i))) af += `:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}`;
} catch { /* pista en silencio: se deja loudnorm de una pasada */ }
sh(FFMPEG, ['-y', '-loglevel', 'error', '-i', fuente, '-c:v', 'copy', '-af', af, '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', final], RAIZ_VIDEOS);
fs.rmSync(crudo, {force: true});
if (fuente !== crudo) fs.rmSync(fuente, {force: true});

// 5. Autocomprobación
const pr = JSON.parse(ejecutar(FFPROBE, ['-v', 'error', '-show_entries', 'stream=codec_name,width,height,r_frame_rate,duration', '-show_entries', 'format=duration', '-of', 'json', final]).stdout);
const v = pr.streams.find((s) => s.width);
const dur = parseFloat(pr.format.duration);
const objetivo = parseFloat(arg('objetivo', props.duracion));
const ok = v.width === 1080 && v.height === 1920 && v.r_frame_rate === '30/1' && Math.abs(dur - objetivo) <= 5;
console.log(`ffprobe: ${v.codec_name} ${v.width}x${v.height} @${v.r_frame_rate} · ${dur.toFixed(2)} s (objetivo ${objetivo} s) -> ${ok ? 'OK' : 'REVISAR'}`);
const ln = ejecutar(FFMPEG, ['-hide_banner', '-i', final, '-af', 'loudnorm=I=-14:TP=-1.5:print_format=summary', '-f', 'null', '-']).stderr;
const lufs = (ln.match(/Input Integrated:\s*(-?[\d.inf]+)/) || [])[1];
console.log(`Volumen integrado: ${lufs ?? '?'} LUFS (objetivo -14; con voz provisional en silencio no aplica)`);

// 6. Fotogramas de control
const ctl = path.join(dir, 'control');
fs.mkdirSync(ctl, {recursive: true});
const ts = Array.from({length: 6}, (_, i) => +(((i + 0.5) / 6) * dur).toFixed(2));
ts.forEach((t, i) => ejecutar(FFMPEG, ['-y', '-loglevel', 'error', '-ss', String(t), '-i', final, '-frames:v', '1', path.join(ctl, `control-${i + 1}.png`)]));
console.log(`Control: ${ctl} (6 fotogramas en ${ts.join(', ')} s)`);

// 7. Portada (sin subtítulos) en el fotograma indicado por escenas.json -> portadaSegundo (por defecto 1,5 s)
const pf = path.join(dir, 'props-portada.json');
fs.writeFileSync(pf, JSON.stringify({...props, escenas: esc.portada?.escenas ?? props.escenas, palabras: [], audio: null}));
const frame = Math.round((esc.portadaSegundo ?? 1.5) * 30);
sh(node, [cli, 'still', 'src/index.ts', 'Pieza', path.join(dir, 'portada.png'), `--props=${pf}`, `--public-dir=${dir}`, `--frame=${frame}`], REMOTION);
fs.rmSync(pf, {force: true});

// 8. Comprobaciones mecánicas (literalidad, lectura, borde x>960, quietud, franja de subtítulos)
sh(node, [path.join(RAIZ_VIDEOS, 'scripts', 'comprobar.mjs'), id, `--v=${version}`], RAIZ_VIDEOS, true);
console.log(`Render: ${final}\nPortada: ${path.join(dir, 'portada.png')}${tiempos.provisional ? '\n*** VOZ PROVISIONAL ***' : ''}`);
