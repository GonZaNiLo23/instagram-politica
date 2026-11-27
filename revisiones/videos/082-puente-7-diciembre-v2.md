# Revisión de vídeo · 082-puente-7-diciembre · vuelta 2
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 35,4 s · -14,3 LUFS · -1,4 dBTP · comprobar.mjs solo avisa de que el guion está en borradores (literalidad no verificada por script). Audio, voz y sincronía no cambiaron respecto a v1 (valoración anterior conservada).
**Test de formato Reel/TikTok:** 8/10 (fallan: claridad visual del mapa, tercio inferior vacío)

## Verificación de la lista de v1
1. Melilla y Ceuta (caja CEUTA/MELILLA) en esc. 2–3: corregido. Melilla turquesa, Ceuta gris.
2. Contadores 10 y 9: corregidos, x ≤ 960.
3. Mapa de esc. 5 ya no queda bajo los subtítulos: corregido.
4. Etiquetas del bloque 3: sigue incompleto (ver obligatorio).

## Obligatorio (bloqueante)
1. [09:50–13:60] Etiquetas del guion "todas, sin omitir": se ven Galicia, Navarra, País Vasco, Canarias, Baleares, pero faltan Castilla-La Mancha y C. Valenciana. La de Cataluña queda tapada por el contador "9" (se lee "ataluña"). Ceuta solo aparece como caja. → añadir las dos que faltan y mover la etiqueta de Cataluña (o el contador) para que no se crucen.

## Formato Reel/TikTok
1. [13:66–26:60] Escenas 4–5: tercio inferior vacío (y > 1250 sin contenido salvo subtítulos). El mapa de la esc. 5 no lleva caja CEUTA/MELILLA (`cajaEn:-1`). → agrandar calendario/mapa y activar `cajaEn` en la esc. 5.

## Lo que funciona bien
- Rótulos de las escenas 3–5 literales respecto al guion; nada con x > 960; el calendario y el mapa se leen sin sonido; gancho claro; cierre "Síguenos".
