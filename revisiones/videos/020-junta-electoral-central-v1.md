# Revisión de vídeo · 020-junta-electoral-central · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video (ajuste mínimo de tiempos)
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 71,0 s · -14,2 LUFS · pico -1,4 dBTP · sin silencios ni huecos de movimiento > 2,5 s (último cambio 66,9 s; cierre con pulso). Voz real ElevenLabs (tiempos.json: provisional=false); última palabra a 68,32 s, cola de 2,7 s. Portada 1080×1920 con recorte 1080×1350 centrado: título y 13 + mesa dentro, legible.
**Test de formato Reel/TikTok:** 9/10 (flojo: criterio de composición, ~1/3 inferior vacío bajo los subtítulos y cierre mostaza con hueco central; no bloquea)

## Obligatorio (bloqueante)
1. [30,0–31,1] "¿QUÉ HACE LA JEC?" (4 palabras) dura 1,08 s: mínimo 1,33 s. La voz ("¿Y qué hace?") ocupa 30,11–30,96, así que no se puede alargar por detrás → adelantar el corte de la escena 8 a ≈29,7 s (acortar la escena del secretario, que tiene 3,2 s para 4 palabras) o hacer que el rótulo entre con `en` negativo. Se mantiene literal.

## Formato Reel/TikTok
1. [66,5–71,0] Cierre sin "📌 Guárdalo" (guion lo pedía; `cta` siguenos por defecto desde 26-10, no es error de render): avisar al coordinador. "Síguenos" y "Fuentes en la descripción" sí están.
2. Zona inferior (y > 1500) vacía en todo el vídeo: es el patrón de la cuenta; si se puede, subir/agrandar el icono principal (placa, plato) en 40–60 px.

## Recomendado
1. [12,0–13,0] Sello "PERMANENTE" tapa el borde superior de la placa JEC al reposar (JEC sigue legible): bajarlo ≈20 px o reducir el ángulo. No bloquea.
2. [49,9–58,4] Lista vertical de las 4 reglas en lugar de sobre los atriles: aceptada, es más legible y respeta el orden de la voz (pluralismo 52,4 s…). "PROPORCIONALIDAD" llega a x≈948: justo pero dentro de 960; no ampliar la fuente.
3. [24–26] Escena "propuestos por los partidos": en los primeros 1,5 s solo hay un círculo y el papel; asumible.

## Lo que funciona bien
- Literales: todos los rótulos y notas de escenas.json coinciden con el guion (fuentes LOREG incluidas); sin opinión ni burlas, siluetas sin rasgos, sin logos ni partidos reales; EJEMPLO en el gráfico de encuestas y en la franja.
- Gancho con "13 VOCALES VIGILAN LA CAMPAÑA" desde el fotograma 1 y las sillas ocupándose; mesa que vuelve en el cierre (bucle).
- Pregunta del cierre: rótulo "¿TELES PRIVADAS CON LAS MISMAS REGLAS?" entra a 62,43 s con la voz (62,53 s): la duda del generador no aplica, está sincronizada.
- Test sin sonido: la idea (13 vocales, quién los elige, qué hacen, reglas para teles) se entiende solo con rótulos e iconos.
- Pronunciación de "JEC" solo comprobable en voz.txt; no pude escuchar.
