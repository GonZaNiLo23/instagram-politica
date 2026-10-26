# Revisión de vídeo · 013-articulo-155-27-octubre · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 81,8 s · -14,1 LUFS · pico -1,4 dBTP. Voz definitiva: tiempos.json `motor: elevenlabs`, `provisional: false`, voz 7QQzpAyzlKTVrRzQJmTE (la misma que 016/023/024); la mención "voz provisional" del `_render.log` es solo texto fijo de render.mjs. Voz 79,2 s + 2,5 s de cola. Sin cortes de audio.
**Test de formato Reel/TikTok:** 8/10 (fallan: zona segura en la línea de tiempo y elementos animados que tapan texto de tarjetas; pantalla densa en bloques 5 y 6)

## Obligatorio (bloqueante)
1. [00:36–00:44] La etiqueta "27-OCT" de la línea de tiempo (escenas 7, 8 y 9) cruza x = 960 (llega a x ≈ 1000; la "T" queda fuera) → acorta el ancho de `lineaS` (hitos entre x ≈ 120 y 900) o separa los hitos; deja ≥ 20 px.
2. [00:31–00:34] La carpeta "MEDIDAS" tapa el texto de la tarjeta "COMUNIDAD AUTÓNOMA" ("COMU…NOMA") durante ~2 s → la carpeta debe quedarse debajo de la tarjeta o terminar su recorrido por debajo del texto (`carpetaS` a/abreEn en la escena 6).
3. [00:37–00:39] El sobre tapa "GENERALITAT" ("GENE…LITAT") en la tarjeta de destino → el sobre debe acabar en el borde inferior de la tarjeta (no encima del nombre) o llegar a la tarjeta con escala y fin fuera del texto (`sobreS` a en la escena 7). Es el único elemento de equidad visual: el Gobierno no sufre esto y la Generalitat sí.
4. [00:22–00:26] La carpeta de la escena 4 lleva un texto que no está en el guion ("SOLICITUD DEL GOBIERNO"; el guion pide un sobre que entra en el edificio) → regla 1: o se quita el texto (sobre sin letras) o el coordinador lo da por bueno por escrito. Dato correcto, pero no literal.

## Formato Reel/TikTok
1. [00:03 y 00:71] Contador de votos pasa por cifras intermedias con la etiqueta oficial ("44 NO", "151 SÍ") → regla 11: que la barra suba con el rótulo "214 SÍ · 47 NO · 1 ABSTENCIÓN" ya visible, o que las cifras intermedias vayan sin etiqueta; ahorra al espectador un dato falso aunque sea 0,5 s.
2. [00:53–00:55] El rótulo "NO PERMITE SUSTITUIR…" entra con el contenido vacío ~1,5 s (solo el subtítulo "Su argumento:") → adelantar la primera casilla ("OBLIGAR A CUMPLIR") a `en` 0,3.
3. Pieza densa (17 palabras de casillas + rótulo en 6,2 s en el bloque 5; escena 11 con 11 palabras en 3,7 s, justo en el límite) → vale, pero no recortar más la escena.

## Recomendado
1. Hueco de 2,7 s en el cierre (74,7–77,5 s con umbral 0,001) por debajo de 3 s: bien. El cierre usa CTA "Síguenos para estar informado" como en el guion.
2. Zona inferior vacía en gancho y escena 15 (~300 px): se podría subir la barra o ampliar el recorte del Senado.
3. Tarjeta del Parlament: el guion indicaba "PARLAMENT DE CATALUNYA · DIPUTADOS DE UNIDOS PODEMOS"; el vídeo solo pone "PARLAMENT DE CATALUNYA" y los diputados quedan en el rótulo. Aceptable (rótulo literal, equidad intacta); el coordinador decide.
4. Pronunciación: no se puede escuchar; en voz.txt "ciento cincuenta y cinco" y "Generalitat" (la guía de g suave la aplica la voz; no verificado de oído).

## Lo que funciona bien
- Fidelidad: rótulos y notas de escenas.json iguales al guion (cifras 214/47/1, fechas 11, 19 y 27-oct, STC 89/2019 y 90/2019, art. 189.5). Cumple el literal salvo el punto 4.
- Equidad: Gobierno, Generalitat y Parlament en tarjetas tipográficas del mismo estilo; "según el Gobierno" atribuido; sin nombres, sin opinión, sin valorar el procés.
- Gancho potente en el fotograma 1 (rótulo + Senado + "155"); la cifra de votos aparece a los 3 s.
- Sincronía rótulos-voz correcta (escenas empiezan en la palabra clave, ±0,1 s); tiempo de lectura OK en todas las escenas (mínimo exacto en 8 y 11).
- Ritmo: sin huecos > 3 s. Crédito CC BY-SA con autor y licencia en el recorte (gancho, bloque 4 y 15). Sin gráficos engañosos.
- Test sin sonido: la idea (art. 155: 3 pasos, Senado por mayoría absoluta, límites del TC) se entiende solo con rótulos y hojas.
