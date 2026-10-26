# Revisión de vídeo · 012-encuestas-cis-privadas · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video (y el coordinador confirma las fotos añadidas, ver bloqueante 4)
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 87,0 s · -14,1 LUFS · pico -1,4 dBTP · voz ElevenLabs real (provisional: false) · sin cortes de audio; la voz acaba en 83,2 s (cola de cierre 3,8 s).
**Test de formato Reel/TikTok:** 8/10 (fallan: zonas seguras/animaciones con elementos que cruzan x=960 o tapan datos; carga de lectura en 2–3 escenas con notas largas).

## Obligatorio (bloqueante)
1. [01:02–01:03, escena 20 "PSOE 31,7 %"] El sello DATO, al rebotar, tapa la etiqueta "38,2 %" y parte de la barra PP del par A (se ve en el fotograma ≈ 62,8 s). Regla 4: los sellos no tapan etiquetas de datos, tampoco al rebotar → colocar el sello sobre el par B sin solape con el par A (bajar `y`, o sin rebote), o retrasar su `en`.
2. [01:08–01:12, escena 22 "datos en abierto"] Los cucharones/círculos pasan por encima de la etiqueta "microdatos CIS" y la hacen ilegible ("micro…s CIS", ≈ 71 s). → Subir la etiqueta ≥ 40 px por debajo de la carpeta o hacer que los cucharones salgan por debajo del texto.
3. [01:12–01:16, escena 23] La olla entra desde la derecha y cruza x = 960 durante la animación (regla 4). Igual los checks de la cuadrícula de la escena 10 (≈ 29,8 s) rozan x ≈ 965 y el cocinero derecho de la escena 15 llega a x = 960. → Entrada de la olla desde dentro de la zona segura (fundido/escala) y cuadrícula/cocineros con x ≤ 960.
4. [escenas 13, 14, 15, 21, 22, 23 y portada] Fotos de terceros que NO están en la tabla "Imágenes" del guion aprobado (solo F1): olla (Matti Blume, CC BY-SA 4.0), cámara (Jacek Halicki, CC BY-SA 4.0), paellas (Jebulon CC0, RecoveryMinded dominio público). El guion pedía iconos planos. Los créditos se ven en pantalla y el formato es correcto, pero no he podido verificar licencias sin acceso web. → Coordinador: validar en Commons autor/licencia y que el guion lo admita (o volver a iconos planos); el crédito debe ir también en el texto del post.

## Formato Reel/TikTok
1. [escenas 9–10, 12, 15] Cuadrículas de personas muy anchas (hasta x ≈ 960–1055 en la hoja): reduce el ancho a ≤ 900 px centrado.
2. [escena 20 y 18] Rótulo + nota de 12–25 palabras en 2,3–4,8 s (≥ palabras ÷ 3 no se cumple en la 20: 12 palabras en 2,33 s). → acorta la nota de la 20 a "Bases distintas" o adelanta su entrada; mismo ajuste en 18 (25 palabras en 4,84 s, justo).
3. [todo el vídeo] El contenido ocupa y ≈ 300–1100 y deja ~300 px vacíos entre el contenido y los subtítulos en la mayoría de las escenas. Centra las composiciones algo más abajo o aumenta escala de barras/iconos.
4. [escena 4–5, 11] Barras con eje desde 0 y misma escala: correcto, sin manipulación.

## Recomendado
1. [79,8–87 s] El cierre dice "+ Síguenos / Fuentes en la descripción"; el guion decía "📌 Guárdalo". Es el CTA por defecto desde 2026-10-26, no es error de render: el coordinador decide si lo mantiene.
2. [portada] Lleva la foto de la olla; el guion decía solo cucharón mostaza y sin foto.
3. [0–6,9 s] Gancho correcto; la balanza es legible en miniatura.

## Lo que funciona bien
- Fidelidad: todos los rótulos, notas, cifras (34 · 22,2 · 25,3 · 14,7 · 17,3 · 38,2 · 19,5 · 33,1 · 31,7 · 5.024), fuentes y citas coinciden con el guion; tarjetas PP/CIS simétricas con icono de silueta, sin comillas.
- Sincronía rótulo-voz ≤ 0,1 s por escena (tiempos-fonetico.json); sin huecos > 2,5 s (select 0,001).
- Etiqueta EJEMPLO desde el primer fotograma; pares de barras con el mismo eje; audio dentro de rango.
- Sin opinión; se mantiene la neutralidad PP/CIS. Pronunciación "Cis" solo validada en texto de voz (no escuchada).
