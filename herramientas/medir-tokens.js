// Suma el consumo de tokens por agente a partir de los registros de Claude Code.
// Uso: node herramientas/medir-tokens.js [desde AAAA-MM-DD]   → escribe estado/consumo-tokens.md
const fs = require('fs');
const path = require('path');
const os = require('os');

const dir = path.join(os.homedir(), '.claude', 'projects', 'C--Users-gonza-Documents-Instagram-Politica');
const desde = process.argv[2] || '0000';

// Peso aproximado frente a un token de entrada normal (precio relativo de la API)
const PESO = { input: 1, cacheWrite: 1.25, cacheRead: 0.1, output: 5 };
const CAMPOS = ['input', 'cacheWrite', 'cacheRead', 'output', 'turnos', 'imagenes', 'peso', 'arranque'];

const agentes = {};
const ejecuciones = [];

function leer(file, agente, sesion) {
  const vistos = new Set();
  const nombres = {};
  const s = { input: 0, cacheWrite: 0, cacheRead: 0, output: 0, turnos: 0, imagenes: 0, maxContexto: 0, arranque: 0, modelo: '', herramientas: {} };
  let inicio = '';
  for (const linea of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!linea) continue;
    let e;
    try { e = JSON.parse(linea); } catch { continue; }
    if (!inicio && e.timestamp) inicio = e.timestamp;
    const m = e.message;
    if (!m) continue;
    if (e.type === 'user' && Array.isArray(m.content)) {
      for (const b of m.content) {
        if (b.type === 'image') s.imagenes++;
        if (b.type !== 'tool_result') continue;
        if (Array.isArray(b.content)) s.imagenes += b.content.filter(c => c.type === 'image').length;
        // Tamaño del resultado en caracteres, sin contar los datos de las imágenes
        const len = typeof b.content === 'string' ? b.content.length : JSON.stringify(b.content || '').replace(/"data":"[^"]*"/g, '').length;
        const n = nombres[b.tool_use_id] || '?';
        s.herramientas[n] = (s.herramientas[n] || 0) + len;
      }
    }
    if (e.type !== 'assistant') continue;
    if (Array.isArray(m.content)) {
      for (const b of m.content) if (b.type === 'tool_use') nombres[b.id] = b.name.replace('mcp__claude-in-chrome__', 'chrome:');
    }
    if (!m.usage || vistos.has(m.id)) continue;
    vistos.add(m.id);
    const u = m.usage;
    s.input += u.input_tokens || 0;
    s.cacheWrite += u.cache_creation_input_tokens || 0;
    s.cacheRead += u.cache_read_input_tokens || 0;
    s.output += u.output_tokens || 0;
    s.turnos++;
    if (m.model && m.model !== '<synthetic>') s.modelo = m.model;
    const ctx = (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0);
    if (s.turnos === 1) s.arranque = ctx;
    if (ctx > s.maxContexto) s.maxContexto = ctx;
  }
  if (inicio.slice(0, 10) < desde || !s.turnos) return;
  s.peso = s.input * PESO.input + s.cacheWrite * PESO.cacheWrite + s.cacheRead * PESO.cacheRead + s.output * PESO.output;
  ejecuciones.push({ agente, sesion, inicio, ...s });
  const a = agentes[agente] ||= { ejecuciones: 0, maxContexto: 0, modelo: '', herramientas: {}, ...Object.fromEntries(CAMPOS.map(c => [c, 0])) };
  a.ejecuciones++;
  for (const c of CAMPOS) a[c] += s[c];
  for (const [n, len] of Object.entries(s.herramientas)) a.herramientas[n] = (a.herramientas[n] || 0) + len;
  a.maxContexto = Math.max(a.maxContexto, s.maxContexto);
  a.modelo = s.modelo || a.modelo;
}

for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.jsonl')) continue;
  const sesion = f.slice(0, 8);
  leer(path.join(dir, f), 'coordinador (sesión principal)', sesion);
  const sub = path.join(dir, f.replace('.jsonl', ''), 'subagents');
  if (!fs.existsSync(sub)) continue;
  for (const g of fs.readdirSync(sub)) {
    if (!g.endsWith('.jsonl')) continue;
    let tipo = 'desconocido';
    try { tipo = JSON.parse(fs.readFileSync(path.join(sub, g.replace('.jsonl', '.meta.json')), 'utf8')).agentType || tipo; } catch {}
    leer(path.join(sub, g), tipo, sesion);
  }
}

const k = n => (n / 1000).toFixed(0) + 'k';
const orden = Object.entries(agentes).sort((x, y) => y[1].peso - x[1].peso);
const total = orden.reduce((t, [, a]) => t + a.peso, 0);
let md = `# Consumo de tokens por agente\n\nGenerado el ${new Date().toISOString().slice(0, 16).replace('T', ' ')} con \`node herramientas/medir-tokens.js ${process.argv[2] || ''}\`.\n`;
md += '"Peso" = entrada + escritura de caché ×1,25 + lectura de caché ×0,1 + salida ×5 (aproximación al coste relativo). "Arranque" = contexto medio en el primer turno (lo que el agente carga antes de trabajar).\n\n';
md += '| Agente | Modelo | Ejecuciones | Turnos | Escr. caché | Lect. caché | Salida | Imágenes | Arranque | Contexto máx. | Peso | % | Peso/ejecución |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n';
for (const [n, a] of orden) {
  md += `| ${n} | ${a.modelo.replace('claude-', '')} | ${a.ejecuciones} | ${a.turnos} | ${k(a.cacheWrite)} | ${k(a.cacheRead)} | ${k(a.output)} | ${a.imagenes} | ${k(a.arranque / a.ejecuciones)} | ${k(a.maxContexto)} | ${k(a.peso)} | ${(100 * a.peso / total).toFixed(1)} | ${k(a.peso / a.ejecuciones)} |\n`;
}
md += '\n## Qué herramientas meten más texto en el contexto (miles de caracteres de resultados)\n\n';
for (const [n, a] of orden) {
  const top = Object.entries(a.herramientas).sort((x, y) => y[1] - x[1]).slice(0, 6);
  md += `- **${n}:** ${top.map(([h, len]) => `${h} ${k(len)}`).join(' · ')}\n`;
}
md += '\n## Las 15 ejecuciones que más pesan\n\n| Inicio | Sesión | Agente | Turnos | Imágenes | Contexto máx. | Peso |\n|---|---|---|---|---|---|---|\n';
for (const e of ejecuciones.sort((x, y) => y.peso - x.peso).slice(0, 15)) {
  md += `| ${e.inicio.slice(0, 16).replace('T', ' ')} | ${e.sesion} | ${e.agente} | ${e.turnos} | ${e.imagenes} | ${k(e.maxContexto)} | ${k(e.peso)} |\n`;
}
fs.writeFileSync(path.join(__dirname, '..', 'estado', 'consumo-tokens.md'), md);
console.log(md);
