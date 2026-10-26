# Revisión de vídeo · 021-senado-209-senadores · vuelta 3
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 32,2 s · -14,0 LUFS · pico -1,4 dBTP. Resto sin cambios respecto a v2 (control de regresión con hoja de contactos: sin roturas).
**Test de formato Reel/TikTok:** 8/10 (fallan: legibilidad parcial del mapa de topes, aprovechamiento del cuadro)

## Verificación de la lista de v2
1. `mapaBalearesS` (26,6 s): PARCIAL. Ya no lo tapan los subtítulos (Formentera y su "1" quedan en y ≈ 1000–1110, sobre la banda) pero siguen los artefactos: Formentera es un zigzag amarillo irreconocible y Ibiza conserva aristas dentadas.
2. `mapaTopeS` (16,6 s): OK con reservas. Todas las islas y los círculos quedan sobre los subtítulos (y < 1130) y los números (2/1/3) se leen bien. España mide ~400 px de ancho y las Canarias son diminutas, pero los círculos y los rótulos grandes (3/2/1) cuentan la idea. Se acepta.

## Obligatorio (bloqueante)
1. [25,5–29,5] `mapaBalearesS`: el contorno de Formentera (bake) es una línea quebrada que no parece una isla, y Ibiza tiene el borde dentado. Es justo el dibujo de la idea del bloque. → Regenerar ambos contornos (simplificar con menos agresividad o usar el path original de Ibiza/Formentera sin el bake) y comprobar en un fotograma ampliado.

## Recomendado
1. Mapa de topes y escenas con contenido compacto: siguen ~400 px vacíos arriba de los subtítulos; si no cabe agrandar el mapa, aumenta el tamaño de las islas Canarias.

## Lo que funciona bien
- Tramos sin cambios (papeletas, hemiciclo, cierre) conservan la valoración de v2. Audio en rango, rótulos literales.
