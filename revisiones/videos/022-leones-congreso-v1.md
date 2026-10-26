# Revisión de vídeo · 022-leones-congreso · vuelta 1
**Veredicto:** CAMBIOS (un único bloqueante, ajuste de tiempo)  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 33,77 s · -14,1 LUFS · pico -1,4 dBTP · voz real ElevenLabs (provisional=false) · sin cortes; sincronía voz-subtítulos ≤ 0,08 s (silencedetect vs tiempos.json).
**Test de formato Reel/TikTok:** 9/10 (criterio flojo: 2 sin sonido/legibilidad, por la nota de la inscripción; con el arreglo, 10/10)

## Obligatorio (bloqueante)
1. [00:12–00:13,2] Transcripción de la inscripción (12 palabras, "FUNDIDO CON CAÑONES… EN 1860") entra en 11,98 s y la escena acaba en 13,18 s: 1,2 s para 12 palabras (mín. 4 s). Es además donde está el dato 1860. → Adelantar `en` de esa nota (escena 4, `notas` y=925) de 2,0 a ≈ 0,9 (≈ 10,9 s, cuando la voz dice "Wad-Ras") y/o alargar la escena unos 0,5 s si la voz lo permite; lo ideal es que esté ≥ 3 s. Mantener la nota de crédito y la de fuente. Comprobar que el rótulo "BATALLA DE WAD-RAS" y la foto siguen sin solape (la foto entra a 0,15).

## Literales y contenido (comprobados, OK)
- "AL PRINCIPIO:" / "HIPÓMENES Y ATALANTA" en dos líneas, literal (22,5 s aprox.). "DAOÍZ Y VELARDE" sube y pasa a gris, sin tachar. Ningún león rotulado con nombre propio (pantalla partida con rótulo único; medallones sin nombre). Transcripción "…EN 1860" literal. Resto de rótulos y notas = guion. Solo informativo, sin opinión, sin burlas. Créditos de A, B y C/D en 36 px dentro de zona; Ovidio y RAE citados.
- Dato 1860: dado por verificado por el revisor de guion; en el render la inscripción de la foto es ilegible a este tamaño, así que la transcripción es lo que lo sostiene (ver bloqueante).

## Formato Reel/TikTok
1. Gancho (0–3,7 s): "¿DE QUÉ ESTÁN HECHOS?" desde el fotograma 1 sobre foto fuerte; "DE CAÑONES" a 106 px entra en 2,46 s con el cañón (voz "De cañones" 2,6 s). Rótulo ocupa x 60–880: cabe. OK.
2. Fotos A a sangre (gancho y bucle): llegan a x > 960 pero solo con columna y cuerpo del león; todo el texto, cañón y crédito quedan en x ≤ 960. ACEPTABLE (la regla "nada con x > 960" es para texto y elementos, y aquí no hay nada legible). Consecuencia: no es regresión.
3. Ritmo: ningún hueco > 2 s hasta el cierre; el cierre (29,6–33,8) solo se mueve con el pulso (umbral 0,001: último cambio 32,8 s). Cierre = voz (31,4) + 2,3 s: recomendable recortar a voz + 1,5 s.
4. Nota de 4 líneas de Wad-Ras: acaba ~54 px por encima del subtítulo, sin cruzar y = 1500 ni solapar el subtítulo. OK (margen ≥ 20 px).
5. Greca y vasija (22,5–27 s): funcionan como ambientación "mito griego" y no confunden; enmarcan bien el rótulo. Detalle: la boca de la vasija toca la greca superior (x ≈ 540–560): bajarla 20–30 px (`vasijaL` y 880 → 910) o subir la greca. Trivial.
6. Sin sonido: se entiende toda la idea (cañones, Ponzano, Wad-Ras, Daoíz y Velarde, 1808, Hipómenes y Atalanta).
7. Tiempo de lectura: resto de rótulos cumple (el más justo, "AL PRINCIPIO:" + "HIPÓMENES Y ATALANTA", 5 palabras, 3,4 s).

## Recomendado
1. [15,9–19,5] Cada busto (turquesa/mostaza) queda justo bajo un medallón (izq./der.) y sugiere "león izquierdo = Daoíz", justo lo que el guion evita. Valorar que ambos bustos vayan juntos centrados o del mismo color. No bloquea.
2. [17,3–19,5] "2 MAYO 1808" (hito) y "2 DE MAYO DE 1808" duplican la fecha; viene así del guion, pero el rótulo grande está alineado a la izquierda y el resto centrado. Trivial.
3. Cierre: recortar cola a voz + 1,5 s (≈ 33,0 s).

## A escuchar con sonido (la voz real)
- "Wad-Ras" (voz "Uad-Rás"): 10,9–11,7 s (palabra "Wad-Ras," a 10,9 s).
- "Daoíz": 14,4–15,0 s (comprobar tres sílabas, da-o-íz).
- "Hipómenes": 22,7–23,4 s (comprobar esdrújula).

## Componente nuevo
`remotion/src/componentes/Leones.tsx`: registro propio `REGISTRO_022` con claves únicas terminadas en "L" (ganchoL, rotuloL, canonL…), ninguna otra `escenas.json` las usa y no se tocó ningún componente compartido. Sin riesgo de regresión.

## Lo que funciona bien
- Gancho y bucle (misma foto y cañón) muy sólidos; cañón que cae sobre "DE CAÑONES".
- Gris sin tachar en "DAOÍZ Y VELARDE" transmite el matiz sin burla.
- Audio en rango y sincronía excelente; créditos y fuentes visibles en cada escena.

## Cierre del coordinador (2026-10-23)
Render v2 (`videos/renders/022-leones-congreso-v2.mp4`, 33,1 s). Comprobado por el coordinador en `control/v2-nota1860-11.5s.png` y `control/v2-bustos-18.0s.png`: la transcripción "…EN 1860" se lee completa (≈ 3,3 s en pantalla) sin choque con foto ni crédito; los bustos van juntos, centrados y del mismo color (no se asigna nombre a cada león). Tal como indicaba esta revisión, basta un fotograma → **APROBADO (v2)**.
