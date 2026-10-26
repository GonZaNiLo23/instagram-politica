# Revisión de vídeo · 004-disturbios-francia · vuelta 3 (render v7, solo informativo)
**Veredicto:** CAMBIOS  →  vuelve a: generador-video (3 cambios cerrados; no hace falta tocar el guion)
**Técnica:** 1080×1920 · 30 fps · H.264 + AAC · 98,6 s · -14,1 LUFS · pico real -1,2 dBTP (dentro de rango) · sin cortes ni silencios (solo la cola final de 2,1 s)
**Test de formato Reel/TikTok:** 9/10 (criterio flojo: 5, ritmo, por el tramo de 1 s de "¿Qué está en juego?"; la duración no se penaliza por encargo)

## Obligatorio (bloqueante), lista cerrada
1. **[00:19,9–00:21] Errata y atribución del primer balance.** La nota bajo el contador dice "Primer balance (sáb. noche): **L. Lecornu**". El primer ministro es **Sébastien** Lecornu (la "L." es de otra persona). Además, los rótulos del contador no son los del guion v5:
   - Guion: "1.200 (sáb. noche, según el primer ministro Lecornu)" → "2.397 (dom., según el ministro Nuñez)", y nota "Último balance: ministro del Interior, L. Nuñez (18-10)".
   - Render: "detenidos (sáb. noche)" → "detenidos (dom., último balance)", y nota "Primer balance (sáb. noche): L. Lecornu" → "Según el ministro del Interior, L. Nuñez (18-10)".
   → Poner los textos literales del guion en las etiquetas del contador (`etiqueta` de cada tramo del `contador`) y en la nota. Así queda atribuido a Lecornu el 1.200 y a Nuñez el 2.397, sin la "L.".
2. **[01:26,5–01:30,5] Balanza del RN con la animación incoherente.** El bloque "RN" no cae en el plato de "236 no": se posa sobre el extremo de la barra, la barra se inclina y luego vuelve casi a la horizontal mientras el plato derecho se queda abajo. El estado final contradice al gráfico: barra casi nivelada con un plato más bajo que el otro (parece un empate). → En el componente de la balanza, que el bloque RN entre en el plato derecho y que la barra mantenga la inclinación hacia el "no" hasta el final de la escena (sin rebote de vuelta a 0°). El plato izquierdo (149 sí) queda arriba.
3. **[01:20,8–01:21,9] "¿QUÉ ESTÁ EN JUEGO?" dura 1,07 s** para 4 palabras (el criterio mínimo es 1 s por cada 3 palabras, es decir ≈ 1,3 s). Además, justo antes hay ≈ 0,4 s de pantalla vacía (solo el subtítulo "la Asamblea."). → Hacer entrar las tarjetas en 80,4 s (cuando acaba la escena del reloj, que se corta limpio) y mantenerlas hasta 82,0 s: ≈ 1,5 s de rótulo sin tocar la voz.

## Comprobaciones pedidas
1. **Sin opinión:** correcto. No hay etiqueta "NUESTRA LECTURA", ni fondo tinta (ningún fotograma con luminosidad baja), ni frases de opinión en rótulos ni en voz. Las posturas (Le Pen, Mélenchon, CGT, Gobierno) siguen atribuidas a quien las defiende.
2. **Bloque 6b:**
   - Fidelidad: "¿QUÉ ESTÁ EN JUEGO?", "Déficit 2025: 5,1 % del PIB · Fuente: INSEE (27-03-2026)", "Objetivo del Gobierno: 5 % en 2027 · Con 54.000 M€ de ahorro · vía AFP y LCP", "13-10: decidió el voto del RN · Moción de rechazo del PS: 149 sí / 236 no · con el sí del RN, 211 a 174" y "Presidenciales: 1.ª vuelta, 18-04-2027 · Fuente: service-public.gouv.fr" son literales. Única diferencia: "17-11 plazo Asamblea" (el guion dice "plazo de la Asamblea").
   - Barras del déficit: correctas. Eje desde 0 y `max` 6 en las dos; medidas finales 485 px (5,1) y 476 px (5): 98 %, proporcional a 5/5,1. La barra del objetivo termina de crecer ≈ 0,9 s después de entrar, así que al principio parece más corta (animación, no escala).
   - Balanza: ver obligatorio 2.
   - Escena "¿Qué está en juego?": ver obligatorio 3.
3. **Se conserva lo aprobado en la v6:** sí. Retratos en el mismo tono (blanco y negro) y mismo círculo; fotos con créditos; "¿Y AHORA?" sin superposición con las convocatorias; nota del 13-10 literal; pancartas separadas y con check; notas de Le Pen y Mélenchon a mayor tamaño (máx. x ≈ 946); cierre sin duplicados; portada "FRANCIA: QUÉ PASÓ Y POR QUÉ".
4. **Sincronía de subtítulos:** el inicio de cada una de las 36 frases coincide con la voz con una diferencia máxima de 0,06 s (p. ej. 80,89 vs 80,83; 95,86 vs 95,80). **Las 283 palabras contra las 281 declaradas:** la diferencia está en el recuento del guion, no en la voz. Las 283 palabras de `voz.txt`, `tiempos.json` y el texto limpio del guion coinciden una a una (solo cambian las grafías fonéticas "Naiki", "ce-ge-te", "erre-ene", "Limósh"... en la voz; los subtítulos muestran la forma correcta). El recuento por frase del guion se equivoca en dos frases: "La CGT pide que paguen los más ricos" tiene 8 palabras (no 7) y "En la primera votación del pleno, la llave la tuvo el RN" tiene 12 (no 11). La frase más larga sigue en 14 (< 15).
5. **Sello MITO en 4,4 s:** el sello cae desde arriba sobre el titular (3,6–3,8 s, es la caída prevista) y a los 4,4 s queda un fundido de ≈ 0,2 s en el que el titular y el sello se ven en gris sobre el mapa. Es transitorio y legible por la voz y el subtítulo; no bloquea. Recomendado: retrasar la entrada del mapa 0,2 s.
6. **Atribución del primer balance a Lecornu:** presente, pero con la errata y con el rótulo distinto del guion: ver obligatorio 1.

## Formato Reel/TikTok
- Gancho (0–3 s): bien. Titular de 4 líneas con el móvil en movimiento y sello MITO.
- Ritmo: no hay ningún tramo > 2,8 s sin movimiento en la zona de contenido (el hueco del bloque de opinión, que quedaba en la v6, ha desaparecido con el nuevo bloque 6b). Ver obligatorio 3 por el tramo de 1 s de "¿Qué está en juego?".
- Zonas seguras: sin texto en la franja derecha. El texto más cercano acaba en x ≈ 946.
- Cierre: bucle con el móvil y el sello MITO, "Guárdalo" y "Fuentes en la descripción", sin duplicados.

## Recomendado
1. **[00:20–00:21]** El 1.200 sigue en pantalla durante "Según Interior, casi dos mil" (≈ 1 s). Con la atribución nueva a Lecornu el contraste voz/pantalla es más visible. → Cambiar a 2.397 en cuanto empiece la voz (≈ 20,2 s).
2. **[01:24,7–01:26,4]** La hucha aparece junto a la barra del déficit de 2025. No está en el guion y puede leerse como que el 5,1 % es ahorro. → Quitarla de esa escena o ponerla en la de 54.000 M€.
3. **[00:47]** "el RN votó no" aparece en la nota del 13-10 antes de que se explique "RN (Reagrupamiento Nacional)" en la escena de Le Pen (≈ 1 min). Es literal del guion, pero se puede añadir "RN" ya en esa nota si el guionista lo aprueba.
4. **[01:32–01:34]** "17-11 plazo Asamblea" → "17-11 plazo de la Asamblea" (literal del guion).
5. Para el guionista: corregir el recuento por frase del guion (283 palabras, no 281).

## Lo que funciona bien
- El bloque informativo 6b cumple el encargo: tres datos ya verificados, con fuente en pantalla y sin opinión.
- Voz nueva bien sincronizada (≤ 0,06 s) y audio en rango.
- Barras del déficit proporcionales con el eje desde 0.
- Todo lo aprobado en la v6 sigue en su sitio.
