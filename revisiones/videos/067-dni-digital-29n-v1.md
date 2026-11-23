# Revisión de vídeo · 067-dni-digital-29n · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 34,0 s · -14,2 LUFS · -1,5 dBTP · voz real elevenlabs (provisional=false)
**Test de formato Reel/TikTok:** 8/10 (criterios fallados: legibilidad del gráfico final y tercio inferior vacío)

## Obligatorio (bloqueante)
1. [27,6–29,9 s] La etiqueta "MÓVIL" (escena móvil/cartera) queda tapada por la base del móvil, en entrada y en reposo; ilegible. → En `etiquetaDni` MÓVIL sube `y` de 1060 a ≈1100 (≥ 30 px de aire bajo el móvil, esc 1,2 en y 820) o sube el móvil. CARTERA llega a x≈950: sin margen, no la muevas a la derecha.

## Formato Reel/TikTok
1. [Todo el vídeo] Contenido entre y≈330 y 1130; el tercio inferior (salvo subtítulos) queda vacío. → Baja gráficos ~100 px o aumenta `esc` de iconos.
2. [12,9–15,9 s] El contador va "desde 60000 hasta 60000" (no sube, el guion dice "sube hasta 60.000"). Aceptable porque da el dato directo; si se quiere cuenta, desde 0.
3. [29,9–34,0 s] Cierre con "¿MÓVIL O CARTERA?" (texto no tabulado en el guion; la pregunta A/B sí está) y cola de 2,2 s tras la voz (acaba 31,8). Acepta; avisar para añadirlo al guion. Recomendable cola ≈1,5 s.

## Recomendado
1. Gancho de portada ("DNI EN EL MÓVIL: ASÍ SE VOTA") correcto: 2 líneas, ≤ x 900, buen contraste; solo el tercio inferior vacío.
2. Nota nueva "Foto: Américo Toledano, CC BY-SA 4.0" no está en el guion: el coordinador debe confirmar licencia/autor en la ficha de imagen (no pude verificarlo sin web).
3. `comprobar.mjs` no verificó literalidad (guion aún en borradores/): comparado a mano con escenas.json, rótulos y fuente "Interior, 6-11-2026" coinciden; "Resguardo del DNI: no vale", "Valen: DNI · pasaporte · permiso", "Domingo 29‑N · 9:00–20:00", "Síguenos" OK.

## Lo que funciona bien
- Gancho desde el fotograma 0 con móvil+QR; sin huecos > 2 s (select 0,001); sincronía de hitos (iconos, resguardo, horas) ≤ 0,2 s con tiempos.json; lectura de rótulos holgada; x ≤ 960 en todo; sin opinión ni burlas; test sin sonido: se entiende (QR, 60.000, tres documentos, resguardo con cruz, 9–20 h).
