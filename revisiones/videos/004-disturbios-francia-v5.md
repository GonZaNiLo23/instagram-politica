# Revisión de vídeo · 004-disturbios-francia · vuelta 1 (render v5, versión larga)
**Veredicto:** CAMBIOS  →  vuelve a: generador-video (el punto 4 de "Obligatorio" lo confirma el coordinador con el guionista)
**Técnica:** 1080×1920 · 30 fps · H.264 + AAC (44,1 kHz) · 99,1 s (dentro de los 90–120 s pedidos) · -14,1 LUFS · pico real -1,4 dBTP · sin cortes de audio (solo la cola final de 2,15 s en silencio, prevista)
**Test de formato Reel/TikTok:** 9/10 (criterio flojo: 5, ritmo; el 4, duración, no se penaliza por encargo)

## Comprobaciones hechas
- **Sincronía subtítulos-voz:** `tiempos.json` es real (`provisional:false`, ElevenLabs). He contrastado el inicio de cada frase con los silencios del audio del render y la diferencia es ≤ 0,06 s en las 36 frases (p. ej. 4,22 vs 4,24; 8,66 vs 8,72; 93,01 vs 93,00). Sin desincronía.
- **Rótulos y cifras:** todas las cifras coinciden con el guion (550.000 / 800.000, 2.397 / 997, 3,1 % / 2,4 %, +21 % / 21,3 %, 149 / 236, 54.000 M€, 5,1 %, fechas 22-10, 24-10, 31-10, 5-11, 17-11). Las barras mantienen la proporción con el eje en 0 (550/800 = 0,69; 2,4/3,1 = 0,77). Diferencias literales: ver puntos 3 y 4.
- **Zonas seguras:** con `drawbox` y con `signalstats` sobre la franja derecha (x > 960) cada 0,5 s: ningún texto invade la zona. Logo en y ≈ 294. Créditos y notas acaban en y ≈ 1485 (< 1500). Excepciones: puntos 2 y 6. Las fotos en pastilla llegan a x ≈ 990, pero no llevan texto.
- **Vídeo viral de Nike:** no se reproduce. Solo hay un móvil plano con un rectángulo gris y un icono de *play*, y el sello MITO (gancho y cierre).
- **Rótulos ≥ 64 px:** los titulares y rótulos de cada escena son de 64 px o más. Lo que baja a 36 px son notas, fuentes y créditos, como permite la guía.
- **Portada:** titular y crédito dentro del recorte 4:5 (y 285–1635), contraste correcto sobre tinta al 40 %. Ojo: "FRANCIA: QUÉ HA PASADO Y POR QUÉ" tiene 7 palabras, no 6 (ver Recomendado).

## Obligatorio (bloqueante)
1. **[01:13,3–01:14,1] Texto sobre texto ilegible.** Al entrar "¿Y AHORA?" (gancho gris en fundido) ya está dibujada la línea vertical de convocatorias, y el calendario "OCT 19" pisa los hitos "24-10 chalecos…", "31-10 chalecos…", "5-11 huelga…". Durante unos 0,8 s se montan tres capas de texto. → Que la escena "Próximas convocatorias" (línea vertical, calendario, título) no entre hasta que salga "¿Y AHORA?" (sobre unos 74,1 s), o que `lineaVertical` empiece con `en` ≥ 1 s y sin la capa fantasma. El calendario no debe cubrir los hitos: subirlo o quitarlo cuando entre la línea.
2. **[00:51] Contador "54.000 M€" fuera de la zona segura derecha** (acaba en x ≈ 969 mientras la cifra se anima). → Reducir el tamaño un 8 % o dejar un margen derecho de 130 px (componente `contador`).
3. **[00:25–00:28] Dato añadido al rótulo.** La nota de la línea de tiempo dice "Fin de sept.: unos 400 **de 3.700** institutos afectados". El guion aprobado dice "unos 400 institutos afectados". El dato es cierto (fuente 7 del guion), pero la regla es literal. → Volver al texto del guion. Si el coordinador prefiere conservar el "3.700", que lo apruebe el guionista y lo incorpore al guion.
4. **[00:47–00:50] Nota del 13-10 recortada y con sigla sin explicar.** Render: "13-10: el PS pidió rechazarlo sin debate · RN votó no". Guion: "13-10: el PS (socialistas) pidió rechazarlo sin debate · 149 sí / 236 no · el RN votó no: tenía la llave". "PS" queda sin explicar y falta "tenía la llave", que es lo que da sentido a la balanza. → Restaurar el texto literal del guion (con "PS (socialistas)" y "el RN votó no: tenía la llave"). Si no cabe en 36 px, que el guionista dé una versión más corta y la apruebe el revisor de guion.
5. **[00:43–00:50 y 01:02–01:11] Equidad de los retratos (ver análisis abajo).** Los cuatro van a color natural con fondos y expresiones muy distintos (cielo, banderas, estudio oscuro, lámparas). → Aplicar el mismo duotono (tinta `#14213D` / crema `#F4EFE6`) a los cuatro, con el mismo recorte (cara ≈ 55 % del diámetro del círculo, ojos a la misma altura). Cambios en `ret-P1..P4.jpg` o un filtro CSS idéntico en el componente `foto` (`circulo`). Además, en la tabla "Imágenes" y en el post, añadir el año de la foto de Lecornu (2020) y Le Pen (2014) para ser transparentes (la regla de crédito "exacto" sigue valiendo para la leyenda en pantalla; el año va en la descripción).
6. **[01:34–01:35] Sello MITO del cierre tapa el subtítulo** ("real;" queda medio oculto) y su borde se acerca a x = 960. → Mover el sello a x ≤ 880 y por encima de la pastilla de subtítulos (y ≤ 1090), o retrasar su caída hasta que acabe esa frase (componente `sello` del cierre, props `x` e `y`).

## Fotos: resultado
| Foto | Muestra lo que dice el guion | Crédito en pantalla = tabla | Menores / símbolos |
|---|---|---|---|
| F1 Limoges, antes | Sí (ayuntamiento intacto, de día) | "Foto: Oooer · CC0 · Wikimedia Commons" ✔ | Sin personas |
| F2 Limoges, incendio | Sí (incendio nocturno) | "Foto: Lucas Destrem · CC BY-SA 4.0 · Wikimedia Commons" ✔ | Solo siluetas lejanas de policías y dos peatones, no reconocibles. Sin símbolos de partido. **Aceptable sin difuminar.** |
| F4b Aix-en-Provence | Sí (marcha en una avenida arbolada) | "Foto: Gabriel from92 · CC0 · Wikimedia Commons" ✔ | Primer plano difuminado, fondo con figuras diminutas. Se ha eliminado la pancarta legible del original. ✔ |
| F6b Reims | Sí (estudiantes en una plaza) | "Foto: Coolpix2026 · CC0 · Wikimedia Commons" ✔ | Todo el grupo difuminado ✔ |
| F7 Nancy | Sí (pancarta "Prof en grève") | "Foto: Florian Cuny · CC BY-SA 4.0 · Wikimedia Commons" ✔ | Sin personas, sin símbolos |
| P1 Macron | Sí | "Foto: © European Union · CC BY 4.0 · Wikimedia Commons" ✔ | n/a |
| P2 Lecornu | Sí | "Foto: GautierGadriot · CC BY-SA 4.0 · Wikimedia Commons" ✔ | Detrás se ven una bandera francesa y otra europea: símbolos del Estado, no de partido |
| P3 Le Pen | Sí | "Foto: Foto-AG Gymnasium Melle · CC BY-SA 3.0" ✔ (en una sola leyenda con la de Mélenchon, con "· Wikimedia Commons" al final) | Sin símbolos |
| P4 Mélenchon | Sí | "Foto: Lula Oficial · CC BY-SA 2.0" ✔ | Sin símbolos (lámparas de un salón) |
| F3 portada | Sí (ayuntamiento el día después, con la grúa de bomberos) | "Foto: Alacoolwiki · CC BY 4.0 · Wikimedia Commons" ✔ | Sin personas |

Los créditos de los retratos de Lecornu, Le Pen y Mélenchon coinciden con la tabla en autor y licencia. Los de los pares (F1/F2, Le Pen/Mélenchon) llevan una sola vez "Wikimedia Commons". No hay F5 ni P5.

### Equidad de los retratos: análisis y solución
- **Le Pen (2014):** sonrisa amplia, fondo de estudio gris oscuro y 12 años de antigüedad respecto a los demás (Macron 2025, Mélenchon 2025, Lecornu 2020). Es el retrato más cálido y juvenil del conjunto, y el contraste con el gesto serio de Lecornu, con las banderas detrás, se nota en pantalla. Mélenchon sonríe de forma leve. La regla de la guía ("misma foto neutra, mismo tratamiento, sin elegir fotos favorecedoras") no se cumple del todo.
- **Solución propuesta (en este orden):**
  1. Duotono idéntico en los cuatro (tinta/crema) y mismo recorte de cara (punto 5). Esto iguala fondo, color de piel y atmósfera; ya no se ven banderas ni cielo ni lámparas como elementos distintivos.
  2. Sustituir a Le Pen por una foto de Commons con licencia libre de 2022 o posterior, expresión seria o neutra y fondo liso (el generador o el guionista deben buscarla y comprobarla en la ficha; aquí no he podido consultar Commons). Si no aparece, mantener la de 2014 **solo con el duotono** y con el año indicado en la descripción.
  3. No hace falta tocar Mélenchon ni Macron.
- Veredicto sobre el punto: con el duotono y el recorte iguales, el desequilibrio queda en un nivel aceptable. Sin ellos, no.

## Formato Reel/TikTok
1. **[00:00–00:03] Gancho:** correcto. Pregunta que el espectador reconoce, titular de 4 líneas, móvil con notificación y sello MITO a los 4,6 s. El rótulo ya plantea la duda sin sonido. Pero entre 0,7 y 3,6 s no cambia nada en la zona de contenido (solo se mueven los subtítulos). → Propuesta: que el móvil vibre y se mueva el sello en 1,5–3 s (props `en` del icono).
2. **Tramos sin movimiento en la zona de contenido** (los subtítulos sí cambian): 0,7–3,6 s (gancho), 63,2–66,7 s (Le Pen y Mélenchon) y 83,9–87,1 s (línea de convocatorias). → Un Ken Burns lento en los retratos y que los hitos del 83,9–87,1 s se enciendan cada ~1,5 s.
3. Criterio 3, una sola idea: se sostiene ("qué pasa en Francia y por qué"). Es el criterio más delicado, como avisaba el guion. Con 99 s no he visto dos vídeos distintos: el bulo se resuelve en 10 s y el resto responde a la misma pregunta.

## Recomendado
1. **[01:02–01:11] Citas de Le Pen y Mélenchon a 36 px:** aceptables como notas, porque el titular de 64 px ("Le Pen y Mélenchon: no a los saqueos") lleva la idea y la escena dura 8,4 s. Pero son el contenido de la escena, no una fuente, y quien mire en silencio las lee con esfuerzo. → Subirlas a 44 px (hay unos 100 px libres entre la escena y los subtítulos) y repartir igual el espacio entre ambas.
2. **[00:20–00:21] Contador:** 1.200 sigue en pantalla mientras la voz dice "casi dos mil cuatrocientos" (hasta ≈ 21,2 s). La etiqueta cambia a la vez que la cifra, como pide el feedback, pero conviene que 2.397 entre antes (≈ 20,8 s). Además, la nota inferior atribuye el 1.200 a "L. Nuñez (18-10)", cuando la fuente del guion lo atribuye a Lecornu. → Para el guionista: corregir la atribución del primer balance o quitar el 1.200.
3. **[01:34–01:37] Cierre:** "¿A ti te llegó?" aparece dos veces (rótulo y subtítulo). → Dejar solo el subtítulo o cambiar el rótulo por "Cuéntamelo en comentarios".
4. **Portada:** el titular tiene 7 palabras (el máximo de la guía es 6). → "FRANCIA: QUÉ PASÓ Y POR QUÉ" (6), si el coordinador lo acepta en el guion.
5. **Composición:** el contenido se apiña entre y = 330 y 1000 y queda vacío el tramo 1250–1480 en casi todas las escenas. → Bajar 80–100 px las escenas con icono y mapa (centrar en y ≈ 600–1000).
6. En la fila "La mayoría, en paz" (≈ 15–16 s) las pancartas se solapan entre sí y no se ve el check turquesa del guion. → Separarlas y mostrar el check.

## Lo que funciona bien
- Sincronía voz-subtítulos exacta y audio dentro de rango (-14,1 LUFS / -1,4 dBTP).
- Las cifras y las fuentes del guion se han reproducido bien; los gráficos con eje desde 0 y proporcionales.
- Bloque "NUESTRA LECTURA" claramente señalado (fondo tinta + etiqueta mostaza durante todo el bloque), con un dato del INSEE.
- Caras de menores difuminadas (F4b, F6b) y sin símbolos de partido; créditos legibles y coincidentes con la tabla.
- El bulo de Nike se trata sin reproducirlo y el final cierra con bucle al móvil del gancho.
- Portada legible en 4:5.
