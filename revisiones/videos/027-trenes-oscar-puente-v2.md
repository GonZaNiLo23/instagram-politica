# Revisión de vídeo · 027-trenes-oscar-puente · vuelta 2
**Veredicto:** APROBADO  →  sigue a publicación (recomendados no bloquean; una licencia a verificar)
**Técnica:** 1080x1920 · 30 fps · H.264+AAC · 85,6 s · -14,1 LUFS · pico -1,3 dBTP · voz ElevenLabs real (tiempos.json, 241 palabras; último fin 83,12 s, cola ≈ 2,5 s)
**Test de formato Reel/TikTok:** 9/10 (flojo: tarjetas vectoriales con tercio inferior algo vacío)

## Obligatorio (bloqueante)
Ninguno. Literalidad de rótulos contra el guion: OK (comprobar.mjs sin avisos de literalidad/lectura/franja). Sin huecos > 2 s con select 0,001 (nada quieto > 3 s).

## Vigilancias pedidas
- Ritmo e hilo: 31 escenas, alternan foto a pantalla completa (2–3 s) y tarjeta vectorial; contador "HECHO 1…6 DE 6" presente en todas desde el hecho 1; bucle: escena 28 vuelve a I1 con "ADAMUZ: 45 MUERTOS · CAUSA SIN CERRAR" y la pregunta. Funciona.
- Puente nunca con trenes: I3, I4 e I9 van en tarjeta propia, sin tren en plano. I3 reaparece en 27,9–29,7 s ("Puente habló de sabotaje") entre dos tarjetas de Toledo: aceptable, sin tren.
- Fotos: sin víctimas ni caras reconocibles (solo un operario de espaldas/recortado en Atocha, sin rostro); sin logos dominantes (Iryo es el operador citado en la voz). Todas las fotos de tren/edificio llevan "Imagen de archivo" + crédito. Los retratos de Puente llevan crédito pero no "Imagen de archivo" (no son archivo de siniestros; ok).
- 28 avisos BORDE: los he cruzado con escenas.json; todos caen dentro de escenas con foto `completa` (0–7,3; 19,9–22,1; 26–27,9; 33,7–36,1; 41,5–44,1; 47,3–52,5; 61,5–68; 70,2–72,2; 77,7–79,7). Es el borde de la foto, no texto. Rótulos y subtítulos quedan ≤ x 960 en la hoja de contactos.
- Licencia La Moncloa (I3, I4, I9): sin acceso web fiable, **verificar** por el coordinador. Las fichas de Commons indican "Attribution" (sin versión), por lo que el uso citando la fuente (crédito en pantalla: presente) es lo previsto; el riesgo es bajo, pero no lo he podido confirmar en línea.

## Formato Reel/TikTok
1. [16–20 s, 52–57 s, 57–61 s, 72–78 s] Tarjetas vectoriales con el contenido arriba y mucho vacío bajo → recomendado bajar iconos ~100 px en próximas piezas.

## Recomendado
1. [63,6–65,5 s] Foto I7 (Rodalies/Gelida) bajo "SEMAF AVISA A ADIF" / carta sobre Adamuz con "según Reuters": solo lleva "Imagen de archivo", pero asocia Rodalies con la carta sobre Adamuz. Sustituir por I2 o I5 si hay re-render; no bloquea.
2. [74–78 s] "SIN CERRAR" ya sustituyó al "?" de la v1: corregido.
3. Sincronía voz-subtítulos: las entradas de frase coinciden con tiempos.json salvo un desvío puntual en cola/sfx (silencedetect, no reflejado en la hoja). No he podido ubicarlo; sin impacto visible.

## Lo que funciona bien
- Test sin sonido superado: fechas, contador y fotos de archivo cuentan la secuencia.
- Gancho 45 + causa sin cerrar desde el fotograma 1; cierre con bucle y pregunta Sí/No.
- Tono serio, "presuntos", "según Reuters" y "NO ES UN BALANCE COMPLETO" mantenidos.
