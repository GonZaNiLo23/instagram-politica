# Revisión de vídeo · 065-epa-dos-titulares · vuelta 2
**Veredicto:** APROBADO  →  vuelve a: coordinador
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 33,6 s · -14,1 LUFS · pico -1,4 dBTP · voz real (elevenlabs). Cola: voz acaba 32,16 s, vídeo 33,63 s (1,5 s, corregido).
**Test de formato Reel/TikTok:** 9/10 (tercio inferior vacío, aceptable en serie 'flash')

## Verificación de la lista cerrada de v1
1. Signo "−": corregido en el código (Epa.tsx usa U+2212 en gancho, mitades y barra). En el render la fuente mono lo dibuja corto, casi como guion ("−21.900", "−1,2"); no distinguible a simple vista, se acepta por literalidad de código.
2. "22.852.600 ocupados": ahora en tinta, 64 px, legible (fotograma 26,3 s). Corregido.
3. "+95,9": cola de la última cifra en x≈955 (antes 956). Cumple x ≤ 960 pero con margen de 5 px; no se movió los 20 px pedidos. Recomendado, no bloqueante.
4. Cola de cierre: corregida.

## Recomendado
1. Desplazar 20 px a la izquierda la etiqueta "+95,9" (barrasTrimEpa).
2. Comprobar.mjs no verifica literalidad (guion en borradores/); rótulos sin cambios frente a v1, que se comparó a mano.

## Lo que funciona bien
- Gancho con dos flechas y cifras, pregunta A/B, idea única; barras sobre eje en cero; +0,14 % en tarjeta aparte; voz y subtítulos sincronizados.
