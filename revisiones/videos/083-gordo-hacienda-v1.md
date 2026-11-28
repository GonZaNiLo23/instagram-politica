# Revisión de vídeo · 083-gordo-hacienda · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 34,8 s · -14,1 LUFS · pico -1,5 dBTP · voz ElevenLabs real (no provisional) · sin cortes de audio
**Test de formato Reel/TikTok:** 8/10 (falla: primer cambio visual antes de 1,5 s / gancho con impacto en 0–3 s)

## Obligatorio (bloqueante)
Ninguno. `comprobar.mjs`: OK (literalidad, lectura, borde x>960, quietud, franja de subtítulos). EJEMPLO visible desde el fotograma 0 en todo el vídeo. Cifras y operaciones coinciden con el guion (400.000 / 40.000 / 360.000 / 72.000 / 328.000).

## Formato Reel/TikTok
1. [00:00–00:03,5] Gancho estático: solo la barra "400.000 €" y el titular, sin ningún cambio visual hasta ~3,5 s. El tajo que revela "RETENCIÓN: 72.000 €" llega con la voz de "retiene", no a 1 s como pide el guion (bloque 1). Con sonido apagado no hay nada que pare el dedo. → Adelantar el tajo y el rótulo "RETENCIÓN: 72.000 €" a ≈ 1,0 s (antes de que la voz lo diga), con el rótulo en tinta pleno desde la entrada (a 3,5 s aparece en gris de fundido). Alternativa: anclar el titular directamente a "400.000 €: HACIENDA RETIENE 72.000 €".
2. [00:00–00:03] El titular del gancho es "400.000 € EN UN DÉCIMO"; el guion pide "400.000 €" → "RETENCIÓN: 72.000 €". Es razonable, pero queda sin la cifra de la retención en los primeros 3 s. Se corrige con el punto 1.

## Recomendado
1. [00:05–00:34] La zona inferior (y > 1500) queda vacía en todo el vídeo salvo el cierre; el contenido compacto arriba es legible, sin necesidad de moverlo.
2. [00:34] Cola tras la voz ≈ 2,4 s (última palabra a 32,5 s): correcta.
3. Pronunciación no verificable sin escucha: `voz.txt` revisado, sin guías anómalas.

## Lo que funciona bien
- Las dos barras comparten eje y proporciones (10/90, 82/18): gráfico honesto, sin ejes truncados.
- Operaciones en pantalla literales y legibles; fuente en 36 px dentro de zona segura.
- Cierre A/B con pregunta y "Síguenos"; subtítulos sincronizados y sin huecos > 3 s (sin tramos quietos).
- Sin partidos, candidatos ni opinión: informativo puro.
