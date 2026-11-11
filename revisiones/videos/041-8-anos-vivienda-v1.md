# Revisión de vídeo · 041-8-anos-vivienda · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video (el punto 4 puede requerir pausa de voz / guion vía coordinador)
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 45,2 s (fuera del 40–43,6 s del guion, voz acaba en 43,36 s) · -14,1 LUFS · pico -1,4 dBTP · voz ElevenLabs real (tiempos.json: provisional=false). Sin huecos > 3 s (máx. 2,2 s). Sin copia en `renders/subida`.
**Test de formato Reel/TikTok:** 7/10 (fallan: legibilidad/tiempo de lectura, texto sobre texto en el gancho, aire/composición)

Nota: el guion está en `guiones/borradores/` (no en `aprobados/`), así que `comprobar.mjs` no pudo verificar literalidad; lo hice a mano con `escenas.json`: rótulos y cifras (+52, +41, 118,6→180,6, 114,8→161,9, +12,2, +24, +11,8, +14,8, Ley 12/2023) coinciden con el guion; los cálculos de Eurostat cuadran (180,6/118,6 = +52 %; 161,9/114,8 = +41 %). Pendiente que el guion pase por `aprobados/` antes de programar.

## Obligatorio (bloqueante)
1. [03,4–04,2] Gancho: el "¿UE?" mostaza entra encima de la etiqueta "CIFRA 2" (texto sobre texto) y la etiqueta "ESPAÑA +52 %" roza la nota "Eurostat" → mover "¿UE?" a una zona libre (y ≈ 800–950) o retirar la etiqueta CIFRA 2 al entrar; subir 40 px la línea/etiquetas de `lineasSerie` en la escena 0.
2. [16,1–18,6] Escena de sueldos: la etiqueta "COSTE SALARIAL +8 %" se sale por la izquierda (x < 0, "OSTE SALARIAL") y pisa "2018"; al final cruza "UE +41 %". El sello DATO tapa "propio" de la nota → etiqueta de la 3.ª serie a la derecha del extremo (como ESPAÑA/UE) o en bloque aparte con ≥ 20 px de aire; sello `en` tardío o desplazado fuera de la nota.
3. [07,3–11,1], [11,1–16,1], [16,1–18,6], [18,6–22,3], [36,0–38,5] Tiempo de lectura (< 1 s por 3 palabras): escena Eurostat ≈ 19 palabras en 3,8 s; INE ≈ 19 en 5,0 s (la nota de 15 palabras entra a los 0,1 s pero se lee en ~5 s más); sueldos ≈ 13 en 2,5 s; alquiler ≈ 12 en 3,6 s (ZONA EURO entra a 0,9 s y la nota a 1,2 s); "NO ES TU ESFUERZO" ≈ 11 en 2,5 s (el sello NO MIDE entra a 2,2 s: solo 0,3 s en pantalla). → Acortar las notas (pedir versión corta al coordinador, no recortar por cuenta propia), o repartir la voz con pausas; que la nota salga al inicio de la escena y no tras 1 s.
4. Duración 45,2 s: 1,8 s de cola tras la voz (43,36) más el cierre; revisar que el cierre no sea >1,5 s de cola sin voz (el guion preveía ≈ 43,6 s).

## Formato Reel/TikTok
1. [todas las escenas] Contenido concentrado en y 300–1250; ~40 % inferior vacío salvo la pastilla de subtítulos. Las gráficas son pequeñas (hMax 330 px). → ampliar `hMax` y bajar el gráfico (base ≈ 1250) para que la línea sea el héroe.
2. [11–16 s] Fichas de fuente con texto de 44 px sin logotipo de Eurostat/INE/Ministerio (el guion los pedía): añadirlos o avisar al coordinador de que no se usan.
3. [04–07 s] Etiqueta "2018" del eje solapada con "UE +7 %" en la entrada de la serie UE.

## Recomendado
1. [20 s] La nota "CONTRATOS EN VIGOR, NO SOLO NUEVOS" es clave para no inducir a error con el alquiler: mantenerla en pantalla mientras se ve el grupo de iconos (ya ocurre; bien).
2. Cierre A/B (38,5–41,5) con hueco amplio entre rótulo y botones: bajarlos o subirlos 80 px.

## Lo que funciona bien
- Gancho con cifra +52 % y pregunta "¿Y en Europa?" resuelta en el segundo 4; dos líneas que se separan, idea única clara.
- Gráficos honestos: mismo eje de 0 a 60, base común 2018, sin truncar; alquiler con la salvedad de "contratos en vigor".
- Voz y subtítulos sincronizados, loudnorm correcto, sin líneas de opinión ni burlas; cierre con pregunta A/B y serie ("Cifra 3 la próxima semana").
