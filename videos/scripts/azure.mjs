// Síntesis con Azure Speech (voces neuronales) + marcas de tiempo por palabra (evento wordBoundary).
// Variables en videos/.env: AZURE_SPEECH_KEY, AZURE_SPEECH_REGION, opcionales AZURE_SPEECH_VOICE y AZURE_SPEECH_RATE.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {REMOTION} from './herramientas.mjs';

const require = createRequire(path.join(REMOTION, 'package.json'));
const sdk = require('microsoft-cognitiveservices-speech-sdk');

export const VOZ_AZURE_DEFECTO = 'es-ES-AlvaroNeural';
export const hayAzure = () => !!(process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION);

const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Devuelve [{t, inicio, fin}] alineado con las palabras del texto (se conserva la puntuación original).
export function sintetizarAzure(texto, salidaMp3, {voz, velocidad} = {}) {
  voz = voz || process.env.AZURE_SPEECH_VOICE || VOZ_AZURE_DEFECTO;
  velocidad = velocidad || process.env.AZURE_SPEECH_RATE || '+0%';
  const cfg = sdk.SpeechConfig.fromSubscription(process.env.AZURE_SPEECH_KEY, process.env.AZURE_SPEECH_REGION);
  cfg.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio48Khz192KBitRateMonoMp3;
  const sintetizador = new sdk.SpeechSynthesizer(cfg, null);
  const limites = [];
  sintetizador.wordBoundary = (_s, e) => {
    if (e.boundaryType !== sdk.SpeechSynthesisBoundaryType.Word) return;
    limites.push({t: e.text, inicio: e.audioOffset / 1e7, fin: (e.audioOffset + e.duration) / 1e7});
  };
  const lang = voz.slice(0, 5);
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${lang}"><voice name="${voz}"><prosody rate="${velocidad}">${escapar(texto)}</prosody></voice></speak>`;
  return new Promise((ok, mal) => {
    sintetizador.speakSsmlAsync(ssml, (r) => {
      sintetizador.close();
      if (r.reason !== sdk.ResultReason.SynthesizingAudioCompleted) return mal(new Error(`Azure: ${r.errorDetails || r.reason}`));
      fs.writeFileSync(salidaMp3, Buffer.from(r.audioData));
      const palabras = texto.split(/\s+/).filter(Boolean);
      // Si el recuento coincide, se usan las palabras del guion (con su puntuación) para los subtítulos.
      const res = palabras.length === limites.length
        ? palabras.map((t, i) => ({t, inicio: +limites[i].inicio.toFixed(3), fin: +limites[i].fin.toFixed(3)}))
        : limites.map((l) => ({t: l.t, inicio: +l.inicio.toFixed(3), fin: +l.fin.toFixed(3)}));
      ok({palabras: res, voz, alineado: palabras.length === limites.length});
    }, (e) => { sintetizador.close(); mal(new Error(`Azure: ${e}`)); });
  });
}
