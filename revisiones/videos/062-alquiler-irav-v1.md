# Revisión de vídeo · 062-alquiler-irav · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: guionista (aplicar literales en el guion) y luego generador-video (re-render con voz nueva)
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 34,6 s · -14,1 LUFS · pico -1,5 dBTP · voz ElevenLabs real, sin huecos > 3 s (select 0,004)
**Test de formato Reel/TikTok:** 8/10 (falla: cierre sin ritmo de pantalla vacía en el tercio inferior; escenas 3 y 4 de 4,7 s y 5,5 s con solo una barra que cambia)

## Obligatorio (bloqueante)
1. [Todo el vídeo] Los literales del informe de guion (revisiones/guiones/062-alquiler-irav-v1.md) NO están aplicados ni en el guion (`guiones/borradores/062-alquiler-irav.md` conserva la redacción vieja) ni en el vídeo. Falta, en voz y rótulo:
   - Bloque 2: voz "Si firmaste desde finales de mayo de dos mil veintitrés, el tope es el IRAV"; hoy `voz.txt` dice "a finales de mayo… o después" y el rótulo "CONTRATO TRAS EL 26-5-2023" (debe ser **FIRMADO TRAS EL 26-5-2023**).
   - Bloque 3: rótulo **HASTA 31-12-2027, TODOS LOS CONTRATOS** (hoy "HASTA 31-12-2027: OTRO TOPE") y **SIN NUEVO PACTO: MÁXIMO 2 %** (hoy "SIN PACTO: COMO MUCHO 2 %"); línea de 36 px con "contratos de vivienda (LAU), firmados en cualquier fecha" (hoy solo "RDL 29/2026, disp. final 6.ª · subidas que toquen…"). Sin ella, el segundo tope parece aplicar solo a contratos posteriores a 2023: error de contenido.
   - Voz bloque 3: "…para cualquier contrato, otro tope, hoy más bajo. Si no pactáis otra cosa, como mucho un dos por ciento" coincide con lo pedido; mantener.
2. [20,2–23,7 s] Nota "si la renta supera el precio de referencia, sin subida": el informe recomendaba "si supera el índice de precios de referencia de su zona: sin subida" (BOE: "límite máximo del precio aplicable"); no es bloqueante, pero conviene alinearla.
3. Sin `guiones/aprobados/062-alquiler-irav.md` (borrado en el árbol): comprobar.mjs no verifica literalidad; hay que restaurar/aprobar el guion antes de la vuelta 2.

## Formato Reel/TikTok
1. [14,7–23,7 s] Escenas 3–4: la misma gráfica de barras 9 s seguidos; aceptable por la barra que entra, pero es lo más plano del vídeo → añadir calendario 2026–2027 (previsto en el guion) a la escena del segundo tope.
2. [30,8–34,6 s] Cola de 2,0 s tras la voz (acaba a 32,64 s): correcta; el A/B del guion está en la escena 6 (bien).
3. Tercio inferior (y > 1500) vacío en las escenas con gráfico: persistente, tolerable.

## Recomendado
1. Gancho 0–4,9 s: la llave y el candado funcionan; el segundo rótulo entra a 2,99 s (cambio visual antes de 1,5 s no verificado en el A/B, mirar en la vuelta 2).

## Lo que funciona bien
- Datos y cifras del vídeo = guion y fuentes (IPC 4,9 %, IRAV 2,57 %, 35–34, BOE 13-11); barras proporcionadas (2 < 2,57 < 4,9), eje desde 0.
- Audio en rango, voz real, sincronía sin incidencias en el tramo final; nada pasa de x = 960 en 3 escenas muestreadas; ningún solape con subtítulos.
- Sin opinión ni siglas de partido en el marcador.
