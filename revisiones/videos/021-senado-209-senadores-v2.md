# Revisión de vídeo · 021-senado-209-senadores · vuelta 2
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 32,2 s · -14,0 LUFS · pico -1,4 dBTP. Sin huecos (select 0,001; con 0,004 solo el cierre). Voz real; sincronía sin cambios respecto a v1.
**Test de formato Reel/TikTok:** 7/10 (fallan: legibilidad de mapas, aprovechamiento del cuadro, gancho aún flojo)

## Verificación de la lista de v1
1. Baleares: PARCIAL. Mapa ampliado y círculos separados, pero ver bloqueante 1.
2. Mapa de topes: PARCIAL (esc 1,0 pero sigue ~400 px de ancho; ver bloqueante 2).
3. Lectura 9 palabras: OK (3,04 s).
4. "Candidata/Candidato" cortado: OK (w 820, se lee entero).
Recomendado v1 (nota RD 605/1999): sigue; tolerada.

## Obligatorio (bloqueante)
1. [25,5–26,7] `mapaBalearesS`: el subtítulo ("Ibiza, estrena senador propio") tapa Formentera y su círculo "1", que es justo la idea del bloque; además el dibujo de Ibiza tiene aristas y trazos sueltos (artefactos del bake). → subir el mapa (y ≈ 650 → ≈ 900-1000) para que Formentera quede encima de los subtítulos (y < 1250) y regenerar el contorno de Ibiza sin artefactos.
2. [15,0–17,9] `mapaTopeS`: los círculos de Canarias/Baleares (2 y 1) quedan bajo el subtítulo ("dos o uno") y no se leen; España ocupa ~400 px. → subir y/o esc 1,3 hasta que islas y círculos queden en y < 1250.

## Formato Reel/TikTok
1. [0–2,9] Gancho: la franja de papeleta sigue ilegible a 880 px (texto ~18 px), aunque ahora hay 3 cruces desde el 0,0 y se entiende con el rótulo. → aceptable; mejor ampliar al ancho 1000.
2. [todo] Siguen ~450 px vacíos entre el contenido y los subtítulos en casi todas las escenas. → escalar ×1,2 papeletas, hemiciclo y mapas (resuelve también los bloqueantes).

## Lo que funciona bien
- Audio en rango, sin cortes; rótulos literales al guion; créditos y "(recortada)" correctos; EJEMPLO fijo; sello NULO; cierre con 📌 y "PARA EL 29‑N"; sin opinión ni siglas.
- Tramos sin cambios respecto a v1 (papeletas, hemiciclo, cierre) conservan su valoración.
