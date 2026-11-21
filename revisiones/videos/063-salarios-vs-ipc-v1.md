# Revisión de vídeo · 063-salarios-vs-ipc · vuelta 1
**Veredicto:** APROBADO  →  (condición para el coordinador: el guion v2 sigue en `guiones/borradores/`; `revisor-guion` debe aprobarlo y moverlo a `aprobados/` antes de programar)
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 26,6 s · -14,1 LUFS · pico -1,4 dBTP. Voz real (elevenlabs, provisional=false). Cola de cierre 2,35 s tras la última palabra (24,24 s).
**Test de formato Reel/TikTok:** 9/10 (flojo: criterio de aprovechamiento de pantalla, tercio inferior vacío)

## Obligatorio (bloqueante)
Ninguno. Literales comparados con el guion v2 (escenas.json frente al guion): coinciden cifras, rótulos y notas (3,06 · 4,9 · 9,58 M · 1,84 puntos · 3,5 · 3,60 · 2,91 · 3.162). `voz.txt` = "Texto de voz limpio". Sincronía rótulo-voz ≤ 0,1 s. Sin huecos > 2,5 s (select 0,001). Nada pasa de x = 960. Gráfico con eje en 0, sin truncar.

## Formato Reel/TikTok
1. [00:00] Gancho con barras desde el fotograma 0 y cambio a 1,2 s: correcto.
2. [15:02–20:40] Las líneas de referencia (rojo = 4,9, azul discontinua = 3,5) no llevan etiqueta de valor: ponles "3,5 %" y "4,9 %" (lineasRef) para leer el giro sin sonido.
3. Tercio inferior (y > 1500) vacío en todo el vídeo: recurrente en las piezas "flash".

## Recomendado
1. [00:00–00:03] La nota del gancho parte la línea con "· IPC de octubre (INE)" empezando por punto medio: cosmético.
2. [00:05] La nota "Hueco con octubre: 1,84 puntos" entra a 5,1 s, antes de que aparezca la barra de precios (8,1 s) y ocupa 3 líneas; adelantar la barra o retrasar la nota.
3. [00:09–00:13] "(cálculo propio)" va como nota aparte del rótulo "IPC MEDIO ENE–OCT: 3,5 %" (en el guion, en el mismo rótulo): aceptable, se mantiene la atribución.

## Lo que funciona bien
- Idea única (convenios frente a precios), con matiz y giro claros; se entiende sin sonido.
- Cierre con A/B/C y CTA con tiempo de lectura suficiente; audio en rango.
