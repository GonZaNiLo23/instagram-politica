# Revisión de vídeo · 030-8-anos-recaudacion · vuelta 2
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 43,1 s · -14,1 LUFS · pico -1,4 dBTP · voz elevenlabs (provisional=false) · comprobar.mjs OK
**Test de formato Reel/TikTok:** 9/10 (flojo: media pantalla inferior aún vacía por debajo de los subtítulos, y gancho con subtítulo rozando "2018/2025")

## Obligatorio (bloqueante)
1. [00:27,9–00:32,5] Crédito de la foto de Hacienda pegado al subtítulo: con el subtítulo de 2 líneas ("Hacienda atribuye la subida / de") el aire entre la pastilla (base y≈1405) y la fuente/crédito (y≈1410–1482) es ≈5 px, no ≥ 40. Además la 2.ª línea es huérfana ("de"). → bajar `subDy` de 90 a ≈ 40–50 (subtítulo de 2 líneas acaba en y≈1360) o subir las dos líneas de fuente/crédito; el crédito debe seguir con base ≤ 1490. Activar `subSinHuerfanas` en esta pieza.

## Formato Reel/TikTok
1. [00:00–00:03] Con subDy 90 la pastilla roza la base de las etiquetas "2018/2025" de las barras (≈2 px de aire). Resuelve con el mismo ajuste de subDy o bajando 30 px el gráfico.

## Verificado de la vuelta 1
- Etiqueta "2025" desde el fotograma 0: OK. Cuenta desde 1,0 s (`cuentaEn` 1, dur 6,86): la barra se mueve desde el inicio: OK.
- Rótulo del gancho en dos líneas "2018: 208.685 M€" / "2025: 325.356 M€": literal OK.
- Contenido bajado 90 px: mejor reparto; subtítulos (y 1240–1405) fuera de los 420 px inferiores (≥1500) y misma banda que SUBS+dy; comprobar.mjs sin avisos de franja.
- Tramos sin cambio de v1 (literales, gráfico 0–60 %, foto x<960, ritmo, lectura): conservan la valoración anterior.

## Lo que funciona bien
- Test sin sonido: se entiende (2018→2025, +56 %, precios/PIB, "según Hacienda", "no es lo que paga cada uno"), cierre A/B con CTA.
