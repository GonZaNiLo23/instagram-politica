# Revisión de vídeo · 055-encuestas-prohibidas · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 36,9 s · -14,1 LUFS · -1,5 dBTP · voz ElevenLabs real (no provisional) · voz acaba a 34,56 s (cola 2,3 s)
**Test de formato Reel/TikTok:** 8/10 (criterios flojos: legibilidad del gráfico del gancho y densidad visual/espacio vacío)

comprobar.mjs: OK (literalidad, lectura, borde, quietud y franja de subtítulos). Rótulos de escenas.json iguales al guion aprobado.

## Obligatorio (bloqueante)
Ninguno detectado en datos, cifras, zonas seguras ni audio.

## Formato Reel/TikTok
1. [00:00–00:05] Gancho: el gráfico de barras queda casi tapado por el sello "PROHIBIDO PUBLICAR"; solo se ve una franja oscura a la izquierda, así que el sello se lee pero no "qué" se prohíbe → reducir el sello o desplazarlo para que se vean las barras tachadas.
2. [00:09–00:17] Calendario: cifras de casillas de ~30 px (pequeñas para móvil); el círculo del 23 tapa el "16" y el 30 queda suelto en una fila sola → agrandar el calendario (ocupa ~1/3 del ancho útil) y mostrar solo las semanas 16–29, o poner el círculo sin cubrir otras cifras.
3. [todo el vídeo] Tercio inferior vacío bajo los iconos (y ≈ 1000–1200) con el contenido compacto arriba → centrar/ampliar iconos (mismo patrón de 050 y 016).
4. [00:27–00:32] Cierre: en el fotograma de control solo aparece la pregunta y "Síguenos"; confirmar que los botones A/B "Protege al votante" / "Quita información" están visibles ≥ 1 s antes del CTA (escenas.json los incluye).

## Recomendado
1. [00:05–00:09] Cita legal en 36 px: aceptable por ser cita, pero acortar con "[…]" no ayuda a la lectura; valorar subir a 40 px.
2. Guion pide "Fuente: BOE" y "Art. 153.2": constan en escenas.json (verificar en reposo que no rozan la franja de subtítulos; comprobar.mjs no marca fallo).
3. Voz: pronunciación validada solo en voz.txt (no he podido escuchar).

## Lo que funciona bien
- Gancho con rótulo de 3 líneas legible, sello con golpe y primer cambio < 1,5 s.
- Formato, volumen y sincronía correctos; sin opinión ni burlas; datos neutrales y con artículo citado.
- Línea editorial respetada: pregunta A/B abierta, sin posicionarse.
