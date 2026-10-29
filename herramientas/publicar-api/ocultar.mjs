// Tapa claves y tokens en todo lo que escriben los scripts (los registros de GitHub Actions son públicos).
// Se importa el primero en cada script: `import './ocultar.mjs';`. Lee las variables en cada escritura,
// así que también cubre las que se cargan después desde .env. Para tokens que se obtienen en marcha
// (p. ej. el access token de TikTok), llama a ocultarValor(token) en cuanto se recibe.
const NOMBRES = /KEY|TOKEN|SECRET|PASSWORD|AJUSTES/i;
const extra = new Set();
const PATRONES = [
  /(access_token|refresh_token|client_secret|xi-api-key|authorization)(["']?\s*[:=]\s*["']?(Bearer\s+)?)[^\s"'&,}]+/gi,
  /\bEAA[A-Za-z0-9]{20,}/g, // tokens de Meta
  /\b(act|rft)\.[A-Za-z0-9!*._-]{20,}/g, // tokens de TikTok
  /\bgh[pousr]_[A-Za-z0-9]{20,}/g, // tokens de GitHub
];

export function ocultarValor(v) {
  if (!v || String(v).length < 8) return;
  extra.add(String(v));
  // En GitHub Actions, además, que el propio registro lo tape
  if (process.env.GITHUB_ACTIONS === 'true') escribirCrudo(process.stdout, `::add-mask::${v}\n`);
}

export function ocultar(texto) {
  let s = String(texto);
  const valores = [...extra];
  for (const [k, v] of Object.entries(process.env)) if (NOMBRES.test(k) && v && v.length >= 8) valores.push(v);
  for (const v of valores.sort((a, b) => b.length - a.length)) s = s.split(v).join('***');
  for (const p of PATRONES) s = s.replace(p, (m, a, b) => (typeof a === 'string' && typeof b === 'string' ? `${a}${b}***` : '***'));
  return s;
}

const originales = new Map();
function escribirCrudo(flujo, texto) { (originales.get(flujo) || flujo.write.bind(flujo))(texto); }
for (const flujo of [process.stdout, process.stderr]) {
  const w = flujo.write.bind(flujo);
  originales.set(flujo, w);
  flujo.write = (chunk, ...resto) => w(typeof chunk === 'string' || Buffer.isBuffer(chunk) ? ocultar(chunk.toString()) : chunk, ...resto);
}
// Errores no capturados: se imprimen ya tapados y se sale con error
const fatal = (e) => { process.stderr.write(`${e?.stack || e}\n`); process.exit(1); };
process.on('uncaughtException', fatal);
process.on('unhandledRejection', fatal);
