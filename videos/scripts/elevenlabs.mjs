// ElevenLabs: voz + marcas de tiempo por carácter (endpoint with-timestamps), agrupadas en palabras.
// Variables en videos/.env: ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID, opcional ELEVENLABS_MODEL y ELEVENLABS_AJUSTES
// (JSON de voice_settings, p. ej. {"stability":0.35,"style":0.3}; sin él, los ajustes por defecto de la voz).
import '../../herramientas/publicar-api/ocultar.mjs';
import fs from 'node:fs';

export const hayElevenLabs = () => !!(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID);

export async function sintetizarElevenLabs(texto, salidaMp3) {
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  const modelo = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2';
  const ajustes = process.env.ELEVENLABS_AJUSTES ? JSON.parse(process.env.ELEVENLABS_AJUSTES) : null;
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}/with-timestamps?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: {'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json'},
      body: JSON.stringify({text: texto, model_id: modelo, ...(ajustes ? {voice_settings: ajustes} : {})}),
    }
  );
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  fs.writeFileSync(salidaMp3, Buffer.from(json.audio_base64, 'base64'));

  // Se usa el alignment del texto original (no el normalizado) para que los subtítulos coincidan con voz.txt.
  const al = json.alignment || json.normalized_alignment;
  if (!al) throw new Error('ElevenLabs no devolvió marcas de tiempo');
  const palabras = [];
  let cur = null;
  al.characters.forEach((c, i) => {
    if (/\s/.test(c)) {
      if (cur) palabras.push(cur);
      cur = null;
      return;
    }
    if (!cur) cur = {t: '', inicio: al.character_start_times_seconds[i], fin: al.character_end_times_seconds[i]};
    cur.t += c;
    cur.fin = al.character_end_times_seconds[i];
  });
  if (cur) palabras.push(cur);
  return {
    palabras: palabras.map((p) => ({t: p.t, inicio: +p.inicio.toFixed(3), fin: +p.fin.toFixed(3)})),
    voz: voiceId,
  };
}
