# Revisión de vídeo · 002-ley-dhondt · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video (el punto 1 lo decide antes el coordinador: o se aprueba el añadido en el guion, o se revierte)
**Técnica:** 1080×1920 · 30 fps · H.264 + AAC 44,1 kHz · 80,0 s (objetivo ≈ 82 s) · -14,2 LUFS · pico -1,4 dBTP · sin silencios salvo la cola final (77,8–80 s, 2,2 s tras la voz)
**Test de formato Reel/TikTok:** 9/10 (criterio flojo: 5, ritmo, por la cola estática del cierre; sin fallos graves)

## Obligatorio (bloqueante)
1. [00:60–00:64] Cifras y nota que no están en el guion aprobado: "1 escaño = 20 %", "1 escaño ≈ 3 %" y "Cálculo propio: 100 % ÷ nº de escaños". El guion pide una flecha (sin cifras) que muestre que en la provincia pequeña el salto votos→escaños es mayor. Los números son aritméticamente correctos (100/5 = 20; 100/30 = 3,3), pero son datos nuevos y el revisor de vídeo no puede darlos por buenos. Corrección, a elegir por el coordinador:
   - (a) Revertir al guion: `dhDosProvincias` con flecha y sin las etiquetas "1 escaño = …", y quitar la nota "Cálculo propio: 100 % ÷ nº de escaños" del componente `notas` de la escena 59,74–63,98 s.
   - (b) Mantenerlo (es más claro que la flecha): el guionista lo añade al guion (rótulos, nota y fila de fuentes) y el revisor de guion lo aprueba. Sin esa aprobación, no se puede entregar.

Todo lo demás obligatorio está limpio: rótulos literales frente a `escenas.json` y guion, "D'Hondt" bien escrito en subtítulos, 3.334 coherente, sin "3.333" como diferencia, sin sello DATO, colores y formas de partido según la guía, sin caras en F2, créditos de foto presentes, Ceuta y Melilla con 1 punto cada una, nada dentro de las zonas seguras (margen mínimo ≈ 20 px en las notas de 36 px, sobre y 1500), nada con x > 960, pico < -1 dBTP.

## Formato Reel/TikTok
1. [00:00–00:03] Gancho: bien. "14 % DE VOTOS = 0 ESCAÑOS" + EJEMPLO desde el fotograma 0, cuadrado junto a la urna y contador 0→14 %. Sin sello DATO. Sin cambios.
2. [01:14–01:20] Cola de 5,5 s sin cambios visuales (la plantilla de cierre; los últimos 2,2 s son además mudos). Es la plantilla pedida y no bloquea. Si se puede, recortar el vídeo a ≈ 78,5 s (0,6 s tras "provincia?").
3. Resto de la pieza: 189 cambios visuales detectados y ningún hueco > 2,5 s fuera del cierre.

## Desviaciones declaradas por el generador (juicio)
1. **Tabla transpuesta y cifras a 60 px:** ACEPTADO. Misma información (iconos en cabecera, filas ÷1–÷4), legible en 1080×1920, dentro de la zona segura y con contraste alto. Los 64 px eran una recomendación de la autoevaluación, no de la guía de estilo. No bloquea.
2. **"Triángulo: 38 % → 40 %" a los 51,6 s sin voz:** NO es desviación. Está literal en la columna de rótulos del guion (bloque 4, segundo rótulo) y lo pidió el revisor de guion como recomendado (v1). Visible 5 s, lectura suficiente.
3. **"1 escaño = 20 % / ≈ 3 %" + nota "Cálculo propio…":** SÍ es un dato añadido; véase el obligatorio 1.
4. **Pregunta del cierre antes de la voz:** ACEPTADO. La tarjeta entra a 73,82 s, justo con "ya sabes por qué" (73,9–75,1 s), así que el titular coincide con la voz. La pregunta se ve entera hacia 75 s y la voz la dice a 75,4 s: es un rótulo que se adelanta, permitido. Ningún tramo hablado queda sin texto.
5. **Mapa de provincias en silueta simplificada:** ACEPTADO. No destaca ninguna provincia, es reconocible como España, con Canarias en recuadro, Baleares con 2 puntos y Ceuta/Melilla con 1.
6. **Pronunciación de "D'Hondt":** NO VERIFICABLE por mi parte (no puedo escuchar el audio). Lo que consta en `tiempos-original.json`: "de" 10,64–10,72 + "Hont." 10,80–11,20 s, y "De" 64,08–64,16 + "Hont" 64,20–64,56 s; es decir, "de" casi pegado a una sola sílaba de 0,36–0,4 s, compatible con «de-hónt» y sin pausas raras. Los subtítulos escriben bien "D'Hondt" (10,64–11,2 s y 64,08–64,56 s). Alguien debe oír esos dos tramos antes de publicar.

## Recomendado
1. [00:51–00:55] Los contadores de las barras de escaños pasan por cifras intermedias ("58 %", "26 %" en gris) antes de llegar a 60 y 40. No bloquea (animación breve), pero un corte seco al valor final evita que alguien capture "26 %".
2. [00:46–01:00] La nota "Cálculo propio · partidos inventados" aparece también en barras y en "Le faltan 3.334 votos" (el guion la pide durante la tabla). Es coherente y honesta; solo se anota.
3. [00:07–00:08] La foto F1 entra algo lavada; si cuesta poco, entrar con el contraste ya final.

## Lo que funciona bien
- Gancho claro y hipotético desde el fotograma 0; el bucle del cierre ("14 % = 0") enlaza con el inicio.
- Tabla que se ilumina en el orden exacto de la voz (cociente 100.000 a 34,91 s frente a "Cien" a 34,96 s); subtítulos generados desde las marcas de tiempo de la voz.
- Funciona sin sonido: fichas → tabla → barras 48 % → 60 % → "Le faltan 3.334 votos".
- Partidos solo por forma, rótulos ≥ 64 px, créditos de foto a 36 px, sin caras, portada legible en el recorte 4:5.
- Audio -14,2 LUFS y -1,4 dBTP, dentro de rango.

Nota: es la vuelta 1, no hay informe de vídeo anterior.
