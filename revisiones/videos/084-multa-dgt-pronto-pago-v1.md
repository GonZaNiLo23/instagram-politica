# Revisión de vídeo · 084-multa-dgt-pronto-pago · vuelta 1
**Veredicto:** APROBADO (con 3 mejoras opcionales) → vuelve a: generador-video solo si se quieren aplicar
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 31,8 s (voz ElevenLabs real, termina 29,4 s; cola 2,4 s) · -14,3 LUFS · -1,4 dBTP. `comprobar.mjs`: OK (literalidad, lectura, borde x, quietud, franja de subtítulos).
**Test de formato Reel/TikTok:** 9/10 (criterio flojo: la escena 3 pierde fuerza visual al quedar a 0 antes de tiempo)

## Obligatorio (bloqueante)
Ninguno. Textos literales al guion; "EJEMPLO" presente en gancho, barras y escena 6; fuentes en pie; sin opinión ni burlas; barras con eje común (200 € = 100 %, 240 € = 120 %).

## Formato Reel/TikTok
1. [07:46–11:34, escena 3 casillas] El contador y las 20 casillas llegan a 0 hacia 10,3 s, antes de que la voz diga "la notificación"; ~1 s de "0 DÍAS" con todas vacías puede leerse como plazo agotado. Propuesta: `casillasM` con `dur` ≈ 3,4 para acabar con la voz, o detener en 1. El subrótulo entra en gris (fundido) y se ve lento; no es fallo.
2. [07:46–11:34] El guion pedía calendario con "Notificación" (día 0) y casilla 1 resaltada: no está; solo casillas. Aceptable (idea clara), opcional.
3. [07:46–11:34] La nota "También vale pagar en el acto…" queda a y≈1465, junto a la franja inferior (<1490) y bajo la pastilla de subtítulos; legible, pero súbela ~60 px si se retoca.

## Portada
Clara: "200 € → 100 €: 20 DÍAS" 104 px, EJEMPLO y sobre con 100 € en mostaza; margen izquierdo correcto, sin recortes. Un 1/3 inferior vacío (normal en esta plantilla).

## Correcto
Gancho en 0 s con cifra; barras proporcionales; escena 4 y 5 claras (candado + documento); cierre pregunta A/B con "Síguenos" y fuentes. Duración guion 27,6 s vs 31,8 s real: por la voz, ritmo sin huecos. Pronunciación no verificable sin audio; `voz.txt` OK.
