# Revisión de vídeo · 001-mocion-de-censura · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video (el punto 3 lo cierra el coordinador/guionista)
**Técnica:** 1080×1920 · 30 fps · H.264 + AAC 44,1 kHz estéreo · 65,8 s (objetivo ≈ 66 s) · -14,1 LUFS · pico -1,2 dBTP (cumple < -1) · sin cortes de audio (único silencio: cola de cierre 62,6–65,8 s, prevista)
**Test de formato Reel/TikTok:** 9/10 (criterio fallado: 5, ritmo, por la cola estática del cierre de 4,3 s; el resto cumple)

Método: hojas de contactos, fotogramas completos de gancho, 3e/3f, 4c, 4d y cierre, comparación de `escenas.json` y `voz.txt` con el guion, y detección de escenas en la zona de contenido. Verifiqué zonas seguras a ojo sobre los fotogramas (texto entre y ≈ 265 y 1490, x ≤ 960): sin invasiones. Frases de voz y `voz.txt`: idénticos al guion.

Fotogramas citados: `revisiones/videos/tmp/001/f30.0.png`, `f34.5.png`, `g47.2.png`.

## Obligatorio (bloqueante)
1. [29,58–35,26 · filas 3e y 3f] **Cifras de ejemplo sin marca de ejemplo durante la mayor parte del tramo.** Las barras SÍ/NO (SÍ 150 → 196, NO 100 sobre eje 0–350) son inventadas. "Ejemplo ilustrativo" (en escena `en: 0.3`, hasta 2.4) aparece 0,3 s después de que arranquen las barras y desaparece a los 31,98 s. Desde ahí, las mismas barras (SÍ cruza 176, check, candidato a la silla) siguen hasta 35,26 s con "Fuente: Constitución, art. 114.2" debajo (ver `f34.5.png`), lo que las hace pasar por dato sourced. → Mantener la marca desde el primer fotograma de la escena 3e (29,58 s) hasta el final de la 3f (35,26 s). Mejor una etiqueta "EJEMPLO" junto a las barras (no solo la nota de 36 px en gris piedra, que sobre crema tiene poco contraste: usar tinta). En 3f la fuente del art. 114.2 se mantiene, pero junto a la marca de ejemplo ("Ejemplo ilustrativo" y "Fuente: Constitución, art. 114.2" a la vez, en dos líneas), o pasar la fuente a la fila 3f solo para el check/investidura. Sin sello DATO ni cifras en las barras (así está: bien).
2. [46,5–48,2 · fila 4b/4c, escena "1 APROBADA"] **La cifra "152" del gráfico de mociones queda tachada por la línea discontinua de 176** (ver `g47.2.png`: la línea dorada pasa por el centro de los dígitos). Es un dato real y debe leerse limpio. Ocurre en todo el gráfico (también 44,7–51 s). → Subir la etiqueta de valor de la barra de 1980 por encima de la línea (o ponerla dentro de la barra) y revisar que ninguna etiqueta de valor se cruce con la línea 176 (1980: 152 y 2018: 180 son las que rozan). Componente `mociones`.
3. [Gráfico de mociones, 1987: 66] **Verificar el dato antes de dar por bueno el render.** El gráfico coincide con el guion (66) y con su fila de fuentes nº 4, pero mi memoria de la tabla de Congreso.es para 1987 (Hernández Mancha) es **67** votos a favor. No he podido consultarla (sin acceso web). → El coordinador/guionista abre `https://www.congreso.es/es/cem/mociones-de-censura` y confirma 1987. Si es 67, hay que corregir guion (fila 4b y fuentes), `escenas.json` (`valor` de 1987) y el post, y volver a renderizar. Los otros cinco valores (152, 82, 52, 180, 53) coinciden con mi memoria y con el guion. No cambia nada más del vídeo: la cifra no se habla.

## Formato Reel/TikTok
1. [61,5–65,8 s] Cola de cierre sin movimiento: 4,3 s sin cambio en la zona de contenido (la silla vibra, pero por debajo del umbral de detección; la pregunta, "Guárdalo" y las fuentes ya están desde ~62 s). La voz acaba en 62,6 s. → Ken Burns suave sobre la silla, o que el pin y "Fuentes en la descripción" entren escalonados hasta ~64,5 s, o acortar la cola a ≈ 3 s (el vídeo bajaría a ≈ 64,5 s, igualmente dentro de 60–90 s).
2. [0–2,4 s] Gancho: funciona (pregunta + silla que tiembla + bustoSilla que sale despedido a los 2,4 s). Sin saludo ni logo grande. Sin problemas.

## Desviaciones declaradas por el generador (veredicto de cada una)
1. **"Ejemplo ilustrativo" (29,6–32 s):** el guion NO lo pedía (el guion 3e solo describe las barras, sin cifras ni etiqueta). Es texto añadido, pero lo exige la regla de ejemplos hipotéticos (feedback guionista, regla 18: marca desde el primer fotograma, sin sello DATO). Aceptado en cuanto al texto; **falla en la duración y el momento de entrada** (obligatorio 1). Ruta correcta: que el guionista lo añada al guion en las filas 3e–3f para que sea literal.
2. **Gancho a 100 px en 4 líneas y "1" en tinta:** el mínimo de la guía es 110 px. 4 líneas son legibles y el recorte 4:5 se respeta (portada.png: titular y silla dentro de y 380–1370). El "1" en tinta es aceptable (mostaza sobre crema tiene poco contraste) y el acento lo da el sello DATO. No bloquea; recomendado subir a 110 px (la línea más larga, "ELECCIONES?", cabe: ≈ 920 px < 960).
3. **Retratos a 260 px apilados:** aceptable. Mismo duotono, mismo recorte, misma foto y mismo marco en los dos; los dos nombres en 64 px legibles; la composición apilada evita que los rótulos se corten. Los gestos son los del mismo momento (Rajoy de perfil mirando arriba, Sánchez mirando abajo); neutros, sin ventaja visual para nadie.
4. **F3 recortada en pastilla de 660×350 con zoom 1,55–1,8:** aceptable. Rajoy es reconocible en la tribuna y la foto no tapa ninguna barra. Sí tapa en parte la línea de 350 y el hueco de la barra de 2018, sin incidencia. El crédito de 36 px (3 líneas) es legible y está dentro de la zona segura.
5. **Rótulo de cierre (7 palabras, 2,76 s):** cumple (7 palabras ≈ 2,3 s mínimos). Además se repite en la plantilla final.
6. **Pico -1,2 dBTP:** cumple el criterio de revisión (< -1 dBTP). Integrado -14,1 LUFS. No es defecto.
7. **Resultados del gráfico:** coinciden con el guion (152, 66, 82, 180, 52, 53; eje 0–350 lineal con la línea 176 a escala). Véase obligatorio 3 por el valor de 1987.

## Recomendado
1. [0–3 s] Subir el gancho de 100 a 110 px (mínimo de la guía).
2. [47–48 s] Si se sube la etiqueta de 152, comprobar que la pastilla F3 no queda más cerca de la línea 176.
3. [Guion, fuera de la escena] El crédito de las fotos pone la fecha antes de "Ministerio…"; la plantilla del guion lo pone al final ("… Gobierno de España · [fecha] · Wikimedia Commons"). Es cosmético: unificar con el guion.

## Lo que funciona bien
- Rótulos literales respecto al guion (comprobados en `escenas.json`), voz idéntica, sin erratas.
- Sin sonido se entiende todo: pregunta, "SE PUEDE", "SOLO UNA VEZ", 176 SÍES, barras frente a la línea 176, 6 mociones/5 fracasaron/1 aprobada.
- Ritmo: 493 cambios de escena en la zona de contenido; ningún hueco > 3 s salvo la cola de cierre.
- Gráfico honesto: eje 0–350 desde cero, línea 176 a escala; las cinco fallidas atenuadas pero visibles.
- Retratos con tratamiento idéntico, fotos con licencia y crédito; sin partidos ni banderas.
- Bucle final: la silla del gancho vuelve en el cierre con el candidato.
- Sin opinión ni iconos burlescos.
