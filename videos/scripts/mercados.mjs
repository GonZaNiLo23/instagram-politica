// Cierres del día para la historia de mercados: node videos/scripts/mercados.mjs [AAAA-MM-DD]
// Escribe estado/mercados/AAAA-MM-DD.json con cierre, cierre anterior y variación de cada índice.
// Fuente de los datos: API pública de gráficos de Yahoo Finance (agregador). El revisor contrasta cada cifra
// con una segunda fuente de referencia (Reuters, WSJ, Expansión, BME) antes de publicar.
import fs from 'node:fs';
import path from 'node:path';
import {RAIZ_VIDEOS} from './herramientas.mjs';

const ACTIVOS = [
  {id: 'ibex', nombre: 'IBEX 35', simbolo: '^IBEX', zona: 'España'},
  {id: 'stoxx', nombre: 'Euro Stoxx 50', simbolo: '^STOXX50E', zona: 'Europa'},
  {id: 'sp500', nombre: 'S&P 500', simbolo: '^GSPC', zona: 'EE. UU.'},
  {id: 'dow', nombre: 'Dow Jones', simbolo: '^DJI', zona: 'EE. UU.'},
  {id: 'nasdaq', nombre: 'Nasdaq', simbolo: '^IXIC', zona: 'EE. UU.'},
  {id: 'eurusd', nombre: 'Euro/dólar', simbolo: 'EURUSD=X', zona: 'Divisas', decimales: 4},
  {id: 'brent', nombre: 'Brent', simbolo: 'BZ=F', zona: 'Materias primas', unidad: '$'},
  {id: 'bitcoin', nombre: 'Bitcoin', simbolo: 'BTC-USD', zona: 'Cripto', unidad: '$'},
];

const fecha = process.argv[2] || new Date().toISOString().slice(0, 10);
const madrid = (ts) => new Date(ts * 1000).toLocaleString('sv-SE', {timeZone: 'Europe/Madrid'}).slice(0, 16);

const salida = {fecha, generado: madrid(Date.now() / 1000), fuente: 'Yahoo Finance (API de gráficos)', activos: []};
for (const a of ACTIVOS) {
  try {
    const r = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(a.simbolo)}?range=10d&interval=1d`, {headers: {'User-Agent': 'Mozilla/5.0'}});
    const j = (await r.json()).chart.result[0];
    const ts = j.timestamp;
    const cierres = j.indicators.quote[0].close;
    // Último día con dato en la fecha pedida o antes, y el día con dato anterior a ese
    const dias = ts.map((t, i) => ({dia: madrid(t).slice(0, 10), cierre: cierres[i]})).filter((d) => d.cierre != null && d.dia <= fecha);
    const hoy = dias.at(-1);
    const ayer = dias.at(-2);
    const d = a.decimales ?? 2;
    salida.activos.push({
      ...a, dia: hoy.dia, cierre: +hoy.cierre.toFixed(d), anterior: +ayer.cierre.toFixed(d),
      variacion: +(((hoy.cierre - ayer.cierre) / ayer.cierre) * 100).toFixed(2),
      cerrado: hoy.dia === fecha ? 'sí' : `no hay sesión el ${fecha}: último cierre ${hoy.dia}`,
      horaMercado: madrid(j.meta.regularMarketTime),
    });
  } catch (e) {
    salida.activos.push({...a, error: String(e.message || e)});
  }
}

const dir = path.join(RAIZ_VIDEOS, '..', 'estado', 'mercados');
fs.mkdirSync(dir, {recursive: true});
const f = path.join(dir, `${fecha}.json`);
fs.writeFileSync(f, JSON.stringify(salida, null, 2));
for (const a of salida.activos) console.log(a.error ? `${a.nombre}: ERROR ${a.error}` : `${a.nombre}: ${a.cierre} (${a.variacion > 0 ? '+' : ''}${a.variacion} %) · ${a.dia}${a.cerrado === 'sí' ? '' : ' · ' + a.cerrado}`);
console.log(f);
