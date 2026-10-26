# Revisión de vídeo · 005-decretos-vivienda · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video (nada que tocar en el guion; una consulta al coordinador en el punto F2)
**Técnica:** 1080×1920 · 30 fps · H.264 + AAC 44,1 kHz · 90,1 s · -14,1 LUFS · pico -1,4 dBTP. Voz real (`provisional: false`, ElevenLabs Dani v4, 85,4 s) y cola de cierre de 4,8 s sin voz. Sin cortes: los silencios se corresponden con inicios de frase.
**Test de formato Reel/TikTok:** 8/10 (criterios flojos: 2 sin sonido y 5 ritmo/legibilidad en el bloque 4c, por iconos demasiado pequeños; 4b con imagen desfasada de la voz)

## Obligatorio (bloqueante)
1. [00:10–00:13] "Representa a los grupos según su peso" (6 palabras) está 1,74 s en pantalla (necesita ≥ 2,0 s) → `rotulo` de la escena 2, `en` 1,65 → 1,0 (el hemiciclo termina de apagarse en 2,0; no choca).
2. [01:10–01:12] Calendario "11 NOV · huelga general" (4 palabras) 1,22 s hasta el corte (necesita 1,33 s) → `en` 16,52/16,57 → 16,3 (abs. 70,7; la voz dice "y llama" a 70,92) o recortar 0,1 s el final de la escena 7 solo si la voz lo permite. Sin ese ajuste, no hay forma de leerlo a esta velocidad.
3. [00:56–00:58] Orden de las pastillas del bloque 4b (escena 7, `pildoras`): siguen el orden alfabético (Junts 54,9 · PP 55,4 · UPN 55,9 · Vox 56,4) y la voz dice PP 54,48 · Vox 55,20 · Junts 55,84 · UPN 56,48; el rótulo de arriba también dice "PP, VOX, JUNTS, UPN". Cada pastilla llega entre 0,6 y 1,2 s desfasada y el orden no coincide con el que se oye y se lee → `items` en el orden de la voz con `en` 0,1 · 0,82 · 1,46 · 2,1 (abs. 54,48 · 55,2 · 55,84 · 56,48). El guion pedía orden alfabético; es una decisión neutra y la voz manda (aviso al coordinador: el guion puede decir "en el orden en que se mencionan").

## Formato Reel/TikTok
1. [01:12–01:22] Bloque 4c (escena 8): las llaves (escala 0,7 ≈ 70 px de alto), la urna (140 px) y sobre todo la llave A con contorno discontinuo (el mensaje "si cae la A") no se reconocen en móvil, mientras debajo hay 400 px vacíos entre la línea de tiempo y la pastilla de subtítulos → llaves escala 1,1–1,2, urnas ≥ 240 px, línea de tiempo con `y` ≈ 700 y bajar las llaves y la urna a un carril propio (y ≈ 860–900) para que no se monten sobre los hitos. Mantener ≥ 40 px de aire con la pastilla de subtítulos (y ≈ 1195).
2. [00:04–00:07] Barras de votos (bloque 2): ambas filas completas solo 1,7 s antes de que salgan, con 10 tokens de lectura → entrada de las filas en `en` 0,0 y 0,5 (abs. 4,4 y 4,9) para ganar 0,6 s; el eje sigue desde 0, sin manipulación.
3. [00:13–00:27] Notas de 36 px: hay 3–4 líneas de 36 px por escena (p. ej. "Si vence antes de 2029 · 8 meses al día · con excepciones" + "Fuente: BOE…", 21 palabras en 3 s). Ninguna cruza y ≤ 1490, pero a 3 palabras/s no se leen todas. Son literales del guion, así que se mantienen; la idea de cada escena se entiende sin ellas (test sin sonido: sí). Quedan como carga de lectura aceptada; la persona usuaria puede valorarlo al ver el vídeo.
4. [01:26–01:30] Cierre: 4,8 s sin voz con la pantalla casi inmóvil (el `select` no detecta cambios desde 82,5 s). Es la cola prevista; si se quiere ganar fuerza, `pulso` más visible en la B (interrogación parpadeando) en lugar de estático. Opcional.

## Recomendado
1. [00:10–00:13] Hemiciclo: se resalta un tramo central de 70 puntos (20 % del hemiciclo), cuando el guion pide "un pequeño semicírculo central". Un 20 % sugiere un peso que no es real y no hay dato en el guion → resaltar una franja pequeña (≈ 10–20 puntos) o un semicírculo interior, como pide el guion. Sin número ni reparto, no es bloqueante.
2. [00:07–00:09] Sello "BOE 7-10" sin las "dos hojas" del guion. Desviación menor y sin consecuencias; añadirlas si cuesta poco.
3. [00:13] "LLAVE A · EN VIGOR DESDE 8-10": "8-10" queda huérfano en la segunda línea → forzar salto tras "A ·" o reducir a `tamano` 64 con `ancho` mayor (≈ 900 px).
4. [00:30] "8 meses al día" (escena 3a): la primera línea llega a x ≈ 955, justo en el límite de 960 → bajar `izq` 620 → 600.
5. Datos vivos: "prevista el 12-11, según la prensa" y "sin convocar a 2026-10-20" quedan correctos y se recomprueban el 25-10 (no marcados como error). Si la Mesa fija la fecha, cambia en los rótulos de 36 px de 4 y 4c, en la voz del 4c y en la `fechasV` de las escenas 1, 6 y 8.

## Lo que funciona bien
- Fidelidad: todos los rótulos y notas de `escenas.json` coinciden carácter a carácter con el guion (aprobado v6), incluidas cifras (172/178, 166/184), RDL 28 y 29/2026, "prevista (prensa)" en gris y "solo si la derogan" en gris como posibilidad. Sin errata.
- Línea editorial: pieza solo informativa; las posturas van atribuidas (Gobierno, Vox y Junts, PP, PNV, Inquilinas) y con fecha; sin retratos, sin iconos humillantes, sin pronóstico de voto, "si cae la A" con contorno discontinuo y no con aspa. Barras con eje desde 0.
- Gancho: rótulo desde el fotograma 1, llave A con check y B con "?", el conflicto suena antes de 4,4 s. Portada correcta (recorte 4:5 centrado, título 112 px, llaves YA y ¿?).
- Sincronía voz-subtítulos: desvío ≤ 0,06 s en todos los inicios de frase (silencedetect frente a `tiempos.json`); los cambios de escena caen en la primera palabra de cada bloque (±0,1 s) y los rótulos del 4c y la línea de tiempo van con "Se votan", "Si cae" y "Y el veintinueve" (≤ 0,1 s).
- Ritmo: ningún hueco > 3 s en la zona de contenido (556 cambios detectados). Lectura de rótulos: todos ≥ 1 s por cada 3 palabras salvo los dos de arriba.
- Zonas seguras: nada en x > 960 (llave B de la escena 3b acaba en x ≈ 940; calendario de 4b ≈ 935); las notas de 36 px acaban en y ≈ 1475–1483, dentro de 1490, incluso las de dos líneas. Fotos con crédito y licencia en pantalla (F1, F3, F4, F5).
- Audio: -14,1 LUFS, -1,4 dBTP. Cierre con 📌 Guárdalo y "Fuentes en la descripción".
- Componente compartido: `Vivienda.tsx` solo registra tipos propios de la 005 (`REGISTRO_005`: llaveV, cerraduraV, fechasV, corchete, votosDecretos, tarjetaCita, pildoras, bocadillo, etc.). Ninguna otra `escenas.json` (000–004, 006–008) usa esos tipos, así que el cambio no afecta a otras piezas. La 005 usa el `hemiciclo` común con sus propiedades `apagar` y `resalta`, y `Hemiciclo.tsx` no se ha tocado desde el 19-10.

## Para escuchar (no puedo oír el audio)
La persona usuaria debe comprobar estos segundos del audio:
- PP: 54,48 s ("PP, Vox…"), 61,76 s ("para el PP, llegan tarde") → "pe pe", sin deletrear raro.
- Vox/Junts: Junts a 55,84 y 59,12 s → "yunts".
- UPN: 56,48 s → "u pe ene". PNV: 63,52 s → "pe ene uve".
- "Llave A" a 13,44 s y 76,88 s → "llave a"; "Llave B" a 27,28 s y 46,32 s → "llave be".
- Entonación y pausa de "¿Y ahora?" a 72,27 s (pausa de ~0,3 s tras la pregunta; hay silencio previo a 72,17 s).
- "dos mil treinta" a 26,08–26,40 s (no "veinte treinta") y "el doce de noviembre" a 75,20 s.
