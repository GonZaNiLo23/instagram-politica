# Revisión de vídeo · 051-ipc-comida · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080x1920 · 30 fps · H.264+AAC · 28,07 s · -14,2 LUFS · -1,5 dBTP (OK). comprobar.mjs: OK.
**Test de formato Reel/TikTok:** 8/10 (fallan: gancho legible a la primera, cierre con CTA en pantalla)

## Obligatorio (bloqueante)
1. [00:00–06:30] Gancho con solapes: el rótulo "Tasa anual · octubre 2026 · INE" parte en 2 líneas (y=700) y la 2.ª ("INE") pisa la etiqueta "INFLACIÓN 4,9 %" del gráfico (y≈860); la etiqueta "COMIDA 2,4 %" queda cruzada por la barra de inflación. Además las cifras salen duplicadas (gancho 110 px + etiquetas del gráfico). → Acortar el rótulo a una línea o bajar barrasHSerie (y0 ≥ 960) y subir alto/separación entre filas; quitar el texto duplicado o las etiquetas del gráfico.
2. [00:22–00:28] Cierre sin el "Síguenos" hablado: la tarjeta final solo dice "¿COMIDA O VIVIENDA?" (el guion pide "Síguenos" y "Fuentes en la descripción"). → Añadir `cta` "Síguenos" / texto de fuentes en el cierre (regla 8).

## Formato Reel/TikTok
1. [00:15–00:20] Tras "Sin energía ni alimentos no elaborados" el hueco entre rótulo (y 450) y gráfico (y 760) deja el tercio inferior vacío; la barra subyacente entra tarde (`en` 2,88 s). → Adelantar la barra o subir el gráfico.
2. Tercio inferior vacío en todas las escenas. Tolerable en serie "flash".

## Recomendado
1. [00:19–00:22] Cola del gráfico sin rótulo largo: valorar mantener "Sin energía…" hasta el final de la frase.

## Lo que funciona bien
- Literalidad y cifras OK con el guion (4,9 / 2,4 / 7,6 / 10,3 / 3,1; INE 13-11), nada con x > 960.
- Voz y audio en rango; barras con eje 0–12 sin truncar, honestas. Idea única clara y pregunta A/B con bucle.
