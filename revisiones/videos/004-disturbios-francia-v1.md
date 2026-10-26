# Revisión de vídeo · 004-disturbios-francia · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264 + AAC · 32,5 s (objetivo 32) · -14,2 LUFS · pico -1,5 dBTP (todo correcto). Sin cortes de audio: los únicos silencios (0,7 s) son las pausas entre frases; el último (1,5 s) es el final.
**Test de formato Reel/TikTok:** 9/10 (falla el 7: texto por debajo del mínimo de 64 px en la escena de posturas y rótulo ilegible en Limoges). Tras los cambios queda en 10/10.

Voz provisional: no puntúa. Con la aceleración 1,1x todas las frases se entienden y los subtítulos casan con el audio (desfase < 0,2 s en los puntos revisados: "Lo del sábado", "Limoges", "casi dos mil cuatrocientos", cierre). Sin personas reales ni recreación del vídeo viral: el gancho usa solo un móvil genérico con rectángulo y "play".

Fidelidad al guion v2: rótulos, cifras (550.000 / 800.000 / 2.397 / 997 / fechas), fuentes y atribuciones coinciden con el guion. Las barras parten de 0 y comparten escala (max 800.000). La etiqueta NUESTRA LECTURA va en fondo tinta durante todo el bloque. Única desviación: la pantalla partida de posturas añade un rótulo ("IGPN investiga") y parte el rótulo del guion en dos.

## Obligatorio (bloqueante)
1. [00:11,4–00:15] Rótulo "Limoges: ayuntamiento incendiado" ilegible: texto gris claro sobre el mapa gris atenuado, y arranca fundido. El mapa además entra en los 250 px superiores y en los 120 px de la derecha → Dale pastilla tinta con texto crema (prop `pastilla` del `rotulo`) o sube la opacidad del texto a 100 % y atenúa menos el mapa. Asegura contraste ≥ 4,5:1 desde el primer fotograma de la entrada. Mantén el mapa decorativo fuera de la zona de texto (que ningún rótulo quede encima del mapa).
2. [00:15–00:16,5] El contador muestra "1.996 detenidos (sáb. noche)" a mitad de la cuenta: una cifra intermedia con la etiqueta de un dato oficial que nunca existió (el de la noche fue 1.200). Con sonido apagado se lee como dato falso → En el contador `desde 1200 → 2397`, cambia la etiqueta a "(dom., último balance)" en el mismo fotograma en que empieza a subir, o haz un corte seco 1.200 → 2.397 (sin cifras intermedias) con la etiqueta cambiando a la vez. Lo mismo para el contador de 997 si se queda con cifras intermedias: acelera la cuenta (≤ 0,6 s) para que no se lea ("186" se vio en pantalla).
3. [00:19,4–00:24,5] Rótulos de 48 y 58 px ("Gobierno francés", "IGPN investiga", rótulos principales), por debajo del mínimo de 64–80 px para rótulos de la guía → Subir todo rótulo de esta escena a ≥ 64 px (ver cambio de composición en Formato 1).

## Formato Reel/TikTok
1. [00:19,4–00:24,5] Posturas: demasiado densa y partida (respuesta a dudas 1 y 2). Hay 5 rótulos (el de "Críticas a la policía:" y "la IGPN investiga un caso" separados, más el redundante "IGPN investiga") → Sustituir por 2 bloques apilados, cada uno con icono centrado arriba (≈ 150 px) y UN solo rótulo a ≥ 64 px a ancho completo (x 120–960):
   - Arriba (y 330–700): palacio + "Gobierno: culpa a la ultraizquierda" (5 palabras). Quitar "Gobierno francés" (lo dice el icono y la voz).
   - Línea divisoria tinta de 4 px, ancho 700, en y ≈ 740.
   - Abajo (y 780–1130): lupa-placa + "Críticas a la policía: la IGPN investiga un caso" en un único rótulo. Es el texto literal del guion v2 (8 palabras: pasa 1 sobre el máximo de 7; se acepta aquí porque lo fijó el guion aprobado y va en una sola unidad; se avisa al guionista). Eliminar "IGPN investiga" suelto.
   - Opcional si cabe: 36 px "IGPN: inspección de la policía" debajo, para que sin sonido se entienda la sigla.
2. [00:19,0–00:19,6] Medio segundo de pantalla vacía (solo el logo) al empezar posturas → Iconos y primer rótulo con `en: 0` (que entren con la escena).
3. [00:29–00:32,5] Cierre (duda 4): titular de 4 líneas y la pregunta pegada → Reducir el titular a 3 líneas (tamaño ≈ 100 px o ancho más generoso, dentro de x ≤ 960) y dejar ≥ 40 px de aire antes de "¿Te había llegado alguno?". Queda dentro de zonas seguras, solo es de aire.
4. [00:15,3–00:18] Contador "2 . 397" (duda 5): el punto de JetBrains Mono ocupa una casilla entera y se lee como "2 397" → Usar `font-variant-numeric: tabular-nums` con Archivo Black/Inter para las cifras, o recortar el ancho del punto (letterSpacing negativo en el separador, ≈ -0,35 em). Comprobar que "1.200" y "2.397" se ven como una sola cifra.

## Recomendado
1. [00:01,6] Sello MITO sobre el "play" (duda 3): correcto. El sello MITO tapa el rectángulo, pero el "play" se ve en 0–1,6 s y el móvil sigue reconociéndose. Dejar tal cual.
2. [Portada] (duda 7) El aviso "VOZ PROVISIONAL (solo prueba)" aparece en la portada y en todo el vídeo, y no hay que arreglarlo ahora. Pero el render final con ElevenLabs no debe llevar el aviso: comprobar al re-renderizar con voz real que `--aviso` no está activado y que `portada.png` sale limpia. La portada en sí está bien: "FRANCIA: LO REAL Y LO FALSO" (6 palabras), todo dentro del recorte 4:5 (y 285–1635); el logo queda justo en el borde del recorte y sobra aire arriba, subir el titular ≈ 60 px.
3. [00:05,5–00:11,4] Barras: las cifras intermedias (488.609, 633.521) se ven al pasar; acortar la animación para que el ojo llegue rápido a 550.000 / 800.000.
4. [00:03,4] El rótulo "SÁBADO 17 DE OCTUBRE: REAL" aparece fundido bajo el sello DATO gigante en el primer fotograma; dar 3–4 fotogramas al rótulo antes de que caiga el sello.

## Lo que funciona bien
- Gancho claro en el segundo 0: "ESTE SAQUEO NO ES DE FRANCIA" a 112 px y sello MITO a 1,6 s; la fuente "Maldita · Grabado en Los Ángeles, 2023" está visible y dentro de la zona segura.
- Sin sonido se entiende todo: MITO → DATO → barras con las dos cifras → contador con "sáb. noche / dom., último balance" → bloque de opinión.
- Línea editorial: la opinión va aislada en fondo tinta con etiqueta NUESTRA LECTURA, la cifra del balance se atribuye ("Según Interior" y fuente en pantalla) y ambas cifras de manifestantes tienen igual peso visual. Sin burlas, sin personas, sin rostros.
- Ritmo: cambio visual cada 1–3 s; el tramo más estático (posturas, 22,7–24,5 s) dura < 2 s. Frase más larga: 11 palabras.
- Cierre con bucle (móvil + calendario) y pregunta; audio en rango.
