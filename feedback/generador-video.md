# Feedback para el generador de vídeo

Léelo antes de producir cada vídeo. Las reglas más recientes van arriba.

## Resumen de reglas activas (léelo siempre; la entrada completa, con ejemplo, está debajo)
1. **Literal del guion**: rótulos, notas, nombres, iniciales y atribuciones, carácter a carácter. Si no cabe, se pide una versión corta; no se recorta ni se añade nada, tampoco cifras o notas "de ayuda": si algo del guion no se entiende, decláralo al coordinador. (4 ocurrencias: 004 ×2, 002, 010 sigla "DNI" en icono; compruébala la primera.)
2. **Fundidos sin texto sobre texto**: la escena nueva espera a que salga la anterior (o entra con `en` ≥ 1 s).
3. **Retratos**: mismo duotono, mismo recorte (≈ 55 % del círculo) y fotos de años y gestos parecidos.
4. **Anchura y zona inferior**: notas ancladas por su base (y ≤ 1490, 36 px; reincide en 008-v1) y contadores con x ≤ 960 (008-v1); nada con x > 960 (fotos incluidas), ni siquiera durante la animación (compruébalo con `drawbox`); los sellos no tapan subtítulos ni etiquetas de datos, tampoco al rebotar (013-v1: etiqueta "27-OCT" de la línea de tiempo llega a x≈1000; sobre y carpeta tapan "GENERALITAT" y "COMUNIDAD AUTÓNOMA" en las tarjetas; reincide en 003-v1: sello DATO tapa "MADRID ≈ 188.000", foto de 900 px llega a x 990, notas de hito a 34 px). Ningún elemento animado ni foto cruza un rótulo, ni al entrar (007-v1: papeleta tapa "REFERÉNDUM"; 008-v2: foto tapa la 3.ª línea de "Custodiado hasta el día de votar": al aumentar líneas de rótulo, baja la foto). 018-v1: sobre que cae y urnas que se encogen tapan rótulos; contador y sobres chocan con rótulo de 3 líneas. Reincide en 012-v1 y v2 (sello DATO tapa "38,2 %" al rebotar y, en v2, "19,5 %" al entrar; cucharones sobre "microdatos CIS"; olla entra desde x>960). Márgenes justos en 009-v1 (hito "previsto" en x ≈ 960; nota de 4 líneas hasta y ≈ 1486): deja ≥ 20 px.
5. **Ritmo**: ningún hueco > 3 s sin movimiento en la zona de contenido (`select='gt(scene,0.004)'`); si lo hay, Ken Burns o hitos que se encienden.
6. **Animaciones con "peso"** (balanza…): terminan en un estado coherente con el dato.
7. **Tiempo de lectura**: ≥ 1 s por cada 3 palabras de rótulo; si la voz es más corta, el rótulo entra antes; incluye notas con dato (022-v1: 12 palabras en 1,2 s; 016-v1: foto F2 de 1,3 s y rótulo de 5 palabras + nota en 1,5 s); recalcúlalo tras reanclar a una voz nueva (006-v2: 6 palabras en 1,7 s; 023-v1: rótulo + subrótulo de 11 palabras en 2,0 s: con rótulos + subrótulo, suma las palabras de los dos y empieza antes o pide pausa de voz).
8. **Cierre**: toda frase hablada (CTA incluido) tiene texto en pantalla; el pin es 📌. Nunca entregar con `--aviso` una versión con voz real.
9. **Iconos**: candados y tachados al lado o debajo del icono, nunca encima; si un icono no se reconoce solo, lleva etiqueta de 64 px. Con línea de tiempo + icono + subtítulo, ≥ 40 px de aire y sin etiquetas escalonadas.
10. **Rótulos ≥ 64 px**; sobre foto o mapa, pastilla tinta con texto crema.
11. **Contadores**: la etiqueta cambia en el mismo fotograma en que empieza la cuenta; nunca una cifra intermedia con la etiqueta de un dato oficial ni sin etiqueta (023-v1: "REGIONAL" 1,3 s después de empezar la cuenta de 600+).
12. **Pantalla partida**: un icono y un rótulo por mitad, con línea divisoria.
13. **Cifras**: separador de miles bien pegado (compruébalo ampliado); titulares de cierre en ≤ 3 líneas y con ≥ 40 px antes de la pregunta.
14. **Ejemplos con cifras inventadas**: la etiqueta "EJEMPLO" dura lo que dure el gráfico inventado, desde su primer fotograma, en tinta (no gris piedra), sin sello DATO y sin una "Fuente:" encima que lo haga pasar por dato. En gráficos, ninguna etiqueta de valor se cruza con una línea de referencia.

15. **Orden y tamaño**: elementos que enumeran (pastillas, hitos) en el orden en que los dice la voz, cada uno ≤ 0,2 s de su palabra; iconos que cuentan la idea ≥ 240 px (llaves ≥ escala 1,1), no 70–140 px (005-v1, bloque 4c).

## Reglas activas
### 2026-10-26 · 013-articulo-155-27-octubre (v1, voz real) · revisor-video
- Problema: (1) etiqueta "27-OCT" de lineaS cruza x=960; (2) sobre y carpeta animados tapan el nombre de las tarjetas "GENERALITAT" y "COMUNIDAD AUTÓNOMA" (equidad visual); (3) carpeta con texto "SOLICITUD DEL GOBIERNO" no está en el guion; (4) contador con etiquetas oficiales y cifras intermedias (44 NO, 151 SÍ).
- Regla para el futuro: hitos de lineaS dentro de x ≤ 900; los objetos que viajan hacia una tarjeta acaban en su borde, nunca sobre el texto; sin texto añadido en objetos animados.
- Ejemplo: sobreS/carpetaS con `a` en el borde de la tarjeta; sin `lineas` en la carpeta de la escena 4.
- Ocurrencias: 1 (pieza 013); suma a reglas 1, 4 y 11.

### 2026-10-23 · 022-leones-congreso (v1, voz real) · revisor-video
- Problema: nota de transcripción de 12 palabras (con el dato 1860) entra a 1,2 s del fin de la escena (mín. 4 s); las notas de 36 px también cuentan para el tiempo de lectura.
- Regla para el futuro: suma también las `notas` con dato (no solo créditos) al cálculo palabras ÷ 3; si la nota va al final de la escena, adelanta su `en` o alarga la escena.
- Ejemplo: nota en `en` 0,9 (≈ 10,9 s) en vez de 2,0 (11,98 s).
- Ocurrencias: 1 (pieza 022); suma a regla 7.

### 2026-10-23 · 023-belgica-541-dias (v1, voz real) · revisor-video
- Problema: (1) rótulo "GOBIERNO LETERME, EN FUNCIONES" + subrótulo de 6 palabras = 11 palabras en 2,0 s (mín. 3,7 s); (2) contador "600+" empieza a contar 1,3 s antes de que aparezca la etiqueta "REGIONAL" (271+ sin etiqueta); (3) contador del gancho en 0 en el fotograma 1 y termina 0,7 s antes que la voz.
- Regla para el futuro: suma las palabras de rótulo y subrótulo de la escena; si la voz es corta, adelanta el rótulo a la escena anterior o pide una pausa de voz. La etiqueta de un contador entra en su mismo fotograma de inicio. El contador del gancho arranca a mitad de cuenta y acaba con la voz de la cifra.
- Ejemplo: rotulo REGIONAL en 1.9 (no 3.2); contador del gancho desde 300 hasta 541 hacia 2,1 s.
- Ocurrencias: 1 (pieza 023); suma a reglas 7 y 11.
### 2026-10-22 · 009-cambio-de-hora-ue (v1, voz real) · revisor-video
- Problema: pieza sin bloqueantes (APROBADO). Solo márgenes justos: el hito final "previsto" termina en x ≈ 960 y la nota de 4 líneas de la escena 28,5 s (hemiciclo + crédito) llega a y ≈ 1486; el rótulo y el reloj del fotograma 1 del gancho nacen con opacidad ~25 %.
- Regla para el futuro: deja ≥ 20 px de margen respecto a x = 960 e y = 1490 en etiquetas bajo hitos y notas de 4 líneas (acórtalas o añade ancho); el rótulo del gancho entra a opacidad completa en el fotograma 1.
- Ejemplo: etiqueta "previsto" desplazada 20 px a la izquierda; crédito de F1 en una línea menos.
- Ocurrencias: 1 (pieza 009); suma a la regla 4. Bien resuelto: barras con eje 0–4 % y 0–100 % rotulados, EJEMPLO continuo, `SelloTexto.desde` con valor por defecto 700 (no afecta a 004/005/006).
### 2026-10-22 · 010-brasil-voto-obligatorio (v1, voz real) · revisor-video
- Problema: el icono compartido `dib` "dni" muestra la sigla "DNI" (documento español) en una pieza sobre Brasil y no está en el guion; la nota de 5 palabras de la escena 16,99–19,7 s duraba 1,0 s (necesita 1,7 s). El resto (foto Madrid sin personas ni siglas, literales, EJEMPLO en 4b, zonas seguras, loudness) quedó bien.
- Regla para el futuro: los iconos reutilizados de otras piezas no llevan texto ni siglas que el guion no pide (regla 1); al fijar el `en` de notas por la voz, comprobar palabras ÷ 3 de la nota (regla 7).
- Ejemplo: `dib` dni sin texto "DNI"; nota "Se cancela la inscripción electoral" `en` 1,69 → ~0,9.
- Ocurrencias: 1 (pieza 010); suma a reglas 1 y 7.
### 2026-10-22 · 005-decretos-vivienda (v1, voz real) · revisor-video
- Problema: (1) Pastillas del bloque 4b en orden alfabético (Junts, PP, UPN, Vox) mientras voz y rótulo dicen PP, Vox, Junts, UPN: desfase de 0,6–1,2 s por pastilla. (2) Bloque 4c con llaves a escala 0,7 y urna de 140 px: la llave A con contorno discontinuo no se reconoce, con 400 px vacíos debajo. (3) Dos rótulos justos de lectura tras reanclar a la voz: "Representa a los grupos según su peso" 1,74 s (6 palabras) y "11 NOV · huelga general" 1,22 s. (4) Resalte del hemiciclo de 70 puntos (20 %) donde el guion pide un semicírculo pequeño. El resto (literales, zonas seguras, sincronía ≤ 0,06 s, audio, componente compartido) bien.
- Regla para el futuro: cuando el guion fije un orden distinto al de la voz, el generador lo declara y el orden visible sigue a la voz; los iconos que sostienen la idea de una escena se dimensionan para el móvil (≥ 240 px), sobre todo si sobra espacio; tras reanclar, recalcular palabras ÷ 3 (regla 7) también en rótulos secundarios de escenas cortas.
- Ejemplo: `pildoras` items PP/Vox/Junts/UPN con `en` 0,1 · 0,82 · 1,46 · 2,1; llaves escala 1,1 y urnas 240 px en la escena 8.
- Ocurrencias: 1 (pieza 005); la regla 7 suma una (006, 005).
### 2026-10-20 · 006-cortes-disueltas-quien-manda (v2, voz real) · revisor-video
- Problema: al reanclar los tiempos a la voz real, el rótulo "NO PUEDE AFECTAR A DERECHOS, AUTONOMÍAS…" (6 palabras) quedó en 1,7 s (guion: 2,2 s) y el cierre dejó 3,06 s sin cambio visual. El resto (CTA, 📌, "de" suelta, sincronía, zonas seguras) quedó bien.
- Regla para el futuro: tras reanclar tiempos, recalcular palabras ÷ 3 ≥ segundos de cada rótulo y alargar la escena (o adelantar la entrada) si no llega; comprobar el hueco final con `select='gt(scene,0.004)'`. Es una ocurrencia más de las reglas 7 y 5.
- Ejemplo: escena 34,86–36,56 s → 34,86–36,9 s (la voz "Entra" empieza a 36,0 y "pero" a 37,2).
- Ocurrencias: 1 (pieza 006); la regla 7 suma una.
### 2026-10-20 · 001-mocion-de-censura (v1) · revisor-video
- Problema: (1) Barras SÍ/NO con cifras inventadas: "Ejemplo ilustrativo" entró 0,3 s tarde y salió a los 2,4 s de escena, mientras las barras seguían 3 s más y pasaban a llevar "Fuente: Constitución, art. 114.2". (2) La etiqueta "152" del gráfico de mociones quedó tachada por la línea discontinua de 176.
- Regla para el futuro: (1) La marca de ejemplo dura lo que dura el gráfico inventado; si se añade texto que no está en el guion, se declara y se pide al guionista que lo incorpore. (2) Mirar los fotogramas donde una etiqueta de valor se acerca a una línea de referencia (176) y moverla.
- Ejemplo: "Ejemplo ilustrativo" 29,88–31,98 s → "EJEMPLO" en 29,58–35,26 s; etiqueta 152 encima de la línea o dentro de la barra.
- Ocurrencias: 1.
### 2026-10-20 · 002-ley-dhondt (v1) · revisor-video
- Problema: en el giro, en lugar de la flecha del guion, se escribieron cifras nuevas ("1 escaño = 20 %", "1 escaño ≈ 3 %") y una nota nueva ("Cálculo propio: 100 % ÷ nº de escaños"). Son correctas, pero no están en el guion aprobado.
- Regla para el futuro: si lo que pide el guion no se entiende bien tal cual, el generador no lo sustituye por otro dato: lo declara y pide al coordinador que el guionista lo añada al guion. Es una ocurrencia más de la regla 1 (literal del guion).
- Ocurrencias: 1 (pieza 002); la regla 1 acumula reincidencias en 004 y 002.
### 2026-10-19 · 004-disturbios-francia (v5, versión larga con fotos) · revisor-video
- Problema: (1) Al cambiar de escena, la siguiente (línea de convocatorias + calendario) ya estaba dibujada mientras "¿Y AHORA?" seguía en pantalla: tres capas de texto montadas ~0,8 s. (2) Retratos de políticos a color natural, con fondos, años (2014, 2020, 2025) y expresiones muy distintos (Le Pen sonriendo, Lecornu serio con banderas). (3) Notas del guion recortadas o ampliadas sin permiso: "unos 400 de 3.700" (añadido) y "PS" sin "(socialistas)" ni "tenía la llave" (quitado). (4) Contador animado que roza x = 960 y sello MITO que tapa el subtítulo y entra en la zona derecha. (5) Tramos de ~3,3 s sin movimiento en la zona de contenido (gancho, retratos).
- Regla para el futuro: (1) Un fundido entre escenas nunca superpone texto con texto: la escena nueva espera a que acabe la salida de la anterior (o entra con `en` ≥ 1 s). (2) Retratos: mismo duotono (tinta/crema), mismo recorte de cara (≈ 55 % del círculo) y, si hay más de 3 años de diferencia o una sonrisa frente a gesto serio, buscar otra foto o indicar el año en la descripción. (3) Las notas se copian literales del guion; si no caben, se pide una versión corta al guionista, no se recorta ni se añade. (4) Contadores y sellos: revisar con `drawbox` la anchura máxima durante la animación (x ≤ 960) y que el sello no cubra los subtítulos. (5) Comprobar con `select='gt(scene,0.004)'` sobre la zona de contenido que no hay huecos > 3 s; si los hay, Ken Burns o hitos que se encienden.
- Ejemplo: "¿Y AHORA?" saliendo en 73,3–74,1 s mientras entran los hitos y el calendario; retratos P1–P4 en duotono con el mismo círculo.
- Ocurrencias: 1. Corregidas todas en la v6 (APROBADA, vuelta 2).
- v8 (2026-10-20): reglas (3), (6), (7) y (8) cumplidas; APROBADA.
- Reincidencia en la v7 (2026-10-20): la regla (3) vuelve a fallar. Rótulos del contador de detenidos reescritos ("Primer balance (sáb. noche): L. Lecornu"; el primer ministro es Sébastien, no "L."). Ocurrencias de la regla (3): 2. Añadir: (6) Los nombres propios, iniciales y atribuciones se copian del guion carácter a carácter; si se reescribe un rótulo, se comprueba la inicial de cada persona. (7) Las animaciones con "peso" (balanza) acaban en un estado coherente con el dato: sin rebote a la horizontal; el elemento que cae entra en el plato, no en la barra. (8) Todo rótulo grande necesita ≥ 1 s por cada 3 palabras en pantalla (4 palabras ≈ 1,3 s); si la voz es más corta, el rótulo entra antes, bajo la frase anterior.
### 2026-10-19 · 006-cortes-disueltas-quien-manda · revisor-video
- Problema: (1) En el cierre, la voz dice "Cuéntamelo en comentarios" (81,9–83,05 s) y en pantalla solo hay "¿LO SABÍAS?" y "Guárdalo": sin sonido no se ve el CTA, y el centro del cierre queda vacío. (2) Icono de pin del cierre es 📍 (chincheta redonda) y la plantilla pide 📌. (3) Candados que tapan el símbolo que deberían proteger (libro, mapa, urna) y atril tachado poco reconocible. (4) Línea de tiempo con tres hitos y etiquetas escalonadas (una pegada a la pastilla de subtítulos, ~10 px) cuando comparte pantalla con icono y subtítulos.
- Regla para el futuro: (1) Toda frase hablada del cierre, CTA incluido, tiene subtítulo o rótulo en pantalla (usar la prop `pregunta` del cierre o no marcar `sinSubtitulos` hasta el final de la voz). (2) El pin de "Guárdalo" es 📌 como en la plantilla. (3) Candados y tachados van en una esquina o debajo del icono, nunca encima de lo que explican; si un icono no se reconoce solo (atril), añadir su etiqueta de 64 px o un contexto (edificio, hemiciclo vacío). (4) Con línea de tiempo + icono + subtítulo, dejar ≥ 40 px entre la última etiqueta y la pastilla de subtítulos y no escalonar etiquetas en tres alturas.
- Ejemplo: cierre 81,6–83,6 s con "¿LO SABÍAS?" + subtítulo "Cuéntamelo en comentarios" en el tercio inferior.
- Ocurrencias: 1 (pieza 006). Nota: los render con `--aviso` pintan "VOZ PROVISIONAL" en y≈1590 (zona segura inferior); no entregar así una versión con voz real.

### 2026-10-19 · 004-disturbios-francia · revisor-video
- Problema: Rótulos pequeños (48–58 px) y un rótulo gris claro sobre mapa gris, ilegible; un contador de cuenta atrás mostró "1.996 (sáb. noche)", una cifra intermedia con la etiqueta de un dato oficial; escena partida con 5 rótulos (uno redundante) sin línea divisoria.
- Regla para el futuro: (1) Ningún rótulo por debajo de 64 px ni sobre un fondo no plano: si va sobre mapa o ilustración, pastilla tinta con texto crema. (2) En contadores que saltan de un balance a otro, la etiqueta cambia en el mismo fotograma en que empieza la cuenta (o corte seco sin cifras intermedias); nunca una cifra intermedia con la etiqueta de un dato oficial ni sin etiqueta (023-v1: "REGIONAL" 1,3 s después de empezar la cuenta de 600+). (3) En pantallas partidas: un icono y un solo rótulo por mitad, con línea divisoria, sin duplicar la idea. (4) Cifras con tabulares de Archivo/Inter, sin que el separador de miles ocupe una casilla entera ("2 . 397") ni se pegue al dígito siguiente (v2 de la 004: el punto se montaba sobre el 3; comprobar la cifra clave ampliada al 100 % antes de entregar). (5) Titulares de cierre en 3 líneas como máximo y ≥ 40 px antes de la pregunta.
- Ejemplo: rótulo 48 px "IGPN investiga" + "Críticas a la policía:" + "la IGPN investiga un caso" → un rótulo de 64 px "Críticas a la policía: la IGPN investiga un caso"; "1.996 detenidos (sáb. noche)" → "1.996 detenidos (dom., último balance)" o salto 1.200 → 2.397.

## Histórico

### 2026-10-20 · 007-constitucion-31-octubre-1978 (v1) · revisor-video
- Problema: la papeleta "SÍ" de la urna cruza el rótulo de la escena y lo tapa ("REFER[SÍ]UM") durante ~0,7 s.
- Regla: ningún elemento animado (papeletas, sellos, flechas) se cruza con un rótulo, ni durante la entrada; la caída empieza por debajo del rótulo. (Se suma a la regla 4.)
### 2026-10-22 · 008-voto-por-correo-pucherazo (v1, voz real) · revisor-video
- Problema: (1) contador "Controles: N" a x≈1075 y pegado al logo; (2) notas de 1450 px con 2–5 líneas que llegan a y≈1650 y miden ≈32 px; (3) 29 palabras en 3,4 s (tarjetas PP/Vox) y 21 en 4,9 s (Supremo); (4) brazos cortados en el borde izquierdo (2008); (5) cierre estático 4,2 s.
- Regla para el futuro: el generador mide él mismo con `drawbox` (x=960, y=1500) y `select` antes de entregar; las notas se anclan por su BASE (y_final ≤ 1490) y no por su inicio; los dibujos nunca nacen en x=0.
- Ejemplo: notas y=1450 → empezar en y≈1330–1380 según líneas, 36 px; contador bajo el logo.
- Ocurrencias: 1 (pieza 008); suma a reglas 4, 5 y 7.

### 2026-10-22 · 008-voto-por-correo-pucherazo (v2) · revisor-video
- Problema: al subir "Controles" y las notas, el rótulo de la escena "3 · LO ENTREGAS" pasó a 3 líneas y la foto de Correos (22,4–26,6 s) tapa la última ("votar").
- Causa: se retocó la zona de contenido sin volver a medir solapes rótulo-foto.
- Regla: tras mover contadores o notas, comprueba con hoja de contactos que ningún rótulo de 3 líneas choca con foto/dibujo; baja la foto lo que haga falta.
- Ocurrencias: 1 (008-v2); suma a regla 4 (elemento cruza rótulo).
