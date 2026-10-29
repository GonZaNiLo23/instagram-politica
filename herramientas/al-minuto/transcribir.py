# Transcribe los vídeos del radar de Al minuto con faster-whisper (en GitHub Actions; gratis, sin clave).
# Uso: python herramientas/al-minuto/transcribir.py <carpeta del radar>
# Lee <carpeta>/candidatos.json y añade a cada candidato con archivo: "frases" [{inicio, fin, texto}] y
# "palabras" [{t, inicio, fin}] (segundos del vídeo original). Whisper se equivoca a veces con nombres propios.
import json
import os
import subprocess
import sys

import numpy as np

from faster_whisper import WhisperModel

carpeta = sys.argv[1]
ruta = os.path.join(carpeta, "candidatos.json")
datos = json.load(open(ruta, encoding="utf-8"))

def audio(ruta):
    # Se decodifica con ffmpeg (16 kHz mono) en vez de PyAV: evita incompatibilidades de versiones
    crudo = subprocess.run(["ffmpeg", "-v", "error", "-i", ruta, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(crudo, np.float32)


modelo = WhisperModel(os.environ.get("WHISPER_MODELO", "small"), device="cpu", compute_type="int8")

for c in datos["candidatos"]:
    if not c.get("archivo"):
        continue
    try:
        segmentos, info = modelo.transcribe(audio(os.path.join(carpeta, c["archivo"])), language="es", word_timestamps=True, vad_filter=True)
        segmentos = list(segmentos)
    except Exception as e:  # sin pista de audio o archivo dañado: se queda sin transcripción
        c["habla"], c["error"] = False, str(e)[:120]
        print(f"{c['id']}: sin transcripción ({type(e).__name__})")
        continue
    frases, palabras = [], []
    for s in segmentos:
        frases.append({"inicio": round(s.start, 2), "fin": round(s.end, 2), "texto": s.text.strip()})
        for w in s.words or []:
            palabras.append({"t": w.word.strip(), "inicio": round(w.start, 2), "fin": round(w.end, 2)})
    c["frases"], c["palabras"] = frases, palabras
    c["habla"] = bool(palabras)
    print(f"{c['id']}: {len(frases)} frases, {len(palabras)} palabras")

json.dump(datos, open(ruta, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
