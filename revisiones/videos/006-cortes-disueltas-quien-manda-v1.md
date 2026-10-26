# Revisión de vídeo · 006-cortes-disueltas-quien-manda · vuelta 1
**Veredicto:** APROBADO  →  vuelve a: (nadie; los ajustes de abajo se aplican en el render final con la voz real)
**Técnica:** 1080×1920 · 30 fps · 84,0 s (objetivo 84) · H.264 + AAC · -14,0 LUFS · pico -1,4 dBTP · sin silencios anómalos (huecos de 0,4–1,0 s coinciden con las pausas de la voz).
**Test de formato Reel/TikTok:** 9/10 (criterio flojo: 9, el CTA hablado no se ve en pantalla)

Nota: la voz es provisional (Helena SAPI) y el render lleva el rótulo "VOZ PROVISIONAL" (y≈1590, zona segura inferior). No es publicable así. Con la voz real habrá que repasar sincronía y loudness.

## Obligatorio (bloqueante)
Ninguno. Comprobado:
- Fidelidad: los 22 rótulos, fuentes, cifras (69, 30 días, 16-OCT, 6-OCT, 29-N, 23-DIC, RDL 24/25) y notas coinciden con el guion aprobado; sin erratas. Los subtítulos reproducen la voz.
- Sincronía voz-subtítulos: las marcas de `tiempos.json` coinciden con las pausas del audio (p. ej. 1,32–2,28 s frente a 1,32–2,29 s) con < 0,1 s de desviación hasta el final (82,5–83,05 s).
- Tamaños (leídos en el código y en los fotogramas): rótulos 64–72 px, subtítulos 56 px, fuentes 36 px, etiquetas de iconos y línea de tiempo 64 px. Todo el contenido útil está dentro de las zonas seguras (el rótulo más ancho, "DERECHOS, AUTONOMÍAS…", llega a x≈945, y el sello a x≈935; el límite es 960).
- Neutralidad: hemiciclo sin colores de partido (solo marca: mostaza, turquesa, tinta, piedra), sin personas reales, sin burlas; sin gráficos engañosos. No hay opinión (formato divulgativo).

## Formato Reel/TikTok
1. [81,6–83,6] Cierre (criterio 9): la voz dice "Cuéntamelo en comentarios" (81,9–83,05 s) y no hay subtítulo ni rótulo; el centro de la pantalla queda vacío. Con el sonido apagado el CTA no existe. → Mostrar "Cuéntamelo en comentarios" (64 px, ya sea con la prop `pregunta` del componente `cierre` o con subtítulos hasta el final). El pin es 📍 y la plantilla pide 📌.
2. [00:00–00:03] Gancho: bien. El titular de 3 líneas (110–140 px) está desde el fotograma 1. Los subtítulos NO tapan el hemiciclo (hay ~25 px de hueco bajo los puntos; la pastilla de 2 líneas crece hacia abajo). Sin cambios. El icono del interruptor es poco legible a ese tamaño, pero el apagado en cascada cuenta la idea.
3. Ritmo: sin tramos > 3 s sin movimiento (rótulo, icono, contador o cursor cambian dentro de cada tramo). Único tramo casi quieto: 82–83,6 s, cierre estático.

## Recomendado
Las seis dudas del generador:
1. **Línea de tiempo y "elecciones" hacia el s 9:** no hay roce (la etiqueta queda a ~10 px de la pastilla), pero la pantalla es densa: icono BOE, 3 hitos y etiquetas en tres alturas más subtítulo. → Dejar ≥ 40 px (subir el bloque entero) o quitar el escalonado. Prioridad media.
2. **Sello SPOILER en 3 líneas:** válido. Se lee bien (≥ 64 px), cabe en zona segura y la rotación no lo saca. Mantener las 3 líneas, con el corte tras "SPOILER:", mejor que forzar 2 líneas con texto más pequeño. Sin cambios.
3. **Atril tachado y candados:** el atril parece un cubo o una maceta con la raya roja, y los candados tapan la mitad inferior del libro, el mapa y la urna. → Mover los candados a la esquina inferior derecha de cada icono (o debajo) y, en el atril, añadir una etiqueta "Plenos" o el hemiciclo vacío como contexto. Prioridad media; el rótulo ya explica la idea.
4. **Puntos suspensivos del bloque 3:** el rótulo "DERECHOS, AUTONOMÍAS…" ya lleva "…". Basta con eso para el sentido y para la fidelidad con la fuente. Sin cambios; opcional un "…" como cuarto candado.
5. **Subtítulos tapan el hemiciclo en el gancho:** no ocurre (ver Formato 2). Sin cambios.
6. **"Cuéntamelo en comentarios" sin subtítulo:** sí, es el único cambio que pido (Formato 1).
- [71–73 s] El subtítulo "ni Presupuestos ni proyectos / de" deja una "de" huérfana. Con la voz real puede cambiar el corte; ajustar el ancho máximo de línea si se repite.

## Lo que funciona bien
- Gancho claro desde el fotograma 1 y bucle con el cierre (el hemiciclo vuelve y se enciende).
- Se entiende sin sonido: un rótulo por idea, todos de 64 px o más; semáforo, balanza y cronómetro hacen visual cada concepto.
- Sellos SPOILER (14,6 s) y DATO (55,6 s) dan el momento compartible y retienen hasta el giro.
- Neutralidad impecable en el hemiciclo (69 puntos mostaza, sin colores de partido) y fuentes en pantalla en cada dato.
- Audio en -14,0 LUFS y -1,4 dBTP; formato y duración correctos.
