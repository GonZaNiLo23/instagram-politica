# Revisión de vídeo · 024-disturbios-barcelona · vuelta 2
**Veredicto:** APROBADO (sin bloqueantes; tres recomendaciones menores, ninguna impide publicar)  →  vuelve a: coordinador
**Técnica:** 1080×1920 · 30 fps · H.264 + AAC · 115,3 s (voz 113,28 s + 2,0 s de cola) · -14,1 LUFS · pico -1,2 dBTP. La copia de `subida/` (13 MB, recodificada) mide 115,3 s, -14,1 LUFS y -1,1 dBTP; revisado a ojo un fotograma del clip I1 en ella: mismo pixelado. La voz no es provisional (ElevenLabs).
**Test de formato Reel/TikTok:** 9/10 (criterio fallado: 4, duración 115 s fuera de 60–90 s; aceptado por preferencia expresa de la persona usuaria de 90–120 s)

## Privacidad (prioridad 1): sin cara ni matrícula reconocible
- **I1 Pelai (clip, en pantalla 17,6–19,2 s; la tarjeta de los Mossos ocupa 16,0–17,5 s):** 8 fotogramas a 0,25 s a resolución completa. La mitad inferior del plano (donde está la calle, los furgones y la gente) lleva un pixelado de bloques muy gruesos en todo el clip; la mitad superior es solo fachada, farolas y cielo, sin personas. No se reconoce ninguna cara ni matrícula, ni de transeúntes ni de personas corriendo. Ninguna persona aparece sobre el pixelado en ningún fotograma.
- **I4 Óptica (22,3–24,9 s) e I5 Portaferrissa (24,9–27,4 s):** fotogramas al inicio y al final del zoom lento. Escaparates y suelo, sin personas ni reflejos de personas en los cristales. Hay un cartel de escaparate con texto genérico ("Tu especialista en gafas de sol, desde 1971"); no es persona ni matrícula.
- **I5 segunda foto (27,4–30,9 s) e I4 interior (98,5–103,1 s):** acera con paleta de madera y suelo con papeles; sin personas. El espejo del lateral derecho del interior no refleja a nadie.
- **Portada v2:** la persona que se veía dentro de la tienda está pixelada (bloques grandes); crédito legible dentro del recorte 4:5; titular legible.
- Muestreo de las fotos fijas: 2 fotogramas por foto (inicio y final del zoom) en vez de uno cada 0,25 s, porque son imágenes estáticas con zoom del 8 % y no puede entrar nadie en ellas. El I1 sí se revisó cada 0,25 s.

## Créditos (prioridad 2): correctos
- `escenas.json` y render: I1 con "Vídeo: @ASAPLUX_ en X · Pelai · publicado 24-10, 21:35" durante todo el clip; I4 "publicado 25-10, 07:48" y I5 "publicado 25-10, 08:06" fijos durante cada foto (el crédito cambia en el mismo instante que la foto, 24,9 s); interior de la Óptica con el de 07:48. Sin reloj sobre los clips (el reloj 20:24 va solo sobre la tarjeta y se oculta antes del clip).
- Grep de `llfreixes` y `afusilao` en `escenas.json`, `props.json` y los JSON de la pieza: sin resultados. No hay ningún plano de I2 ni de I3 en el render.
- Las notas de crédito quedan con la base entre y ≈ 1485 y 1490, sin pasar de la franja inferior; ningún elemento con x > 960.

## Fidelidad al guion (prioridad 3): correcta
- Rótulos y notas de `escenas.json` comparados con el guion aprobado: literales en los 30 planos. Cifras: 128 (gancho, balance y cierre), "72 de 128 (56 %)" con "Más de la mitad", "Solo 2 de 128", 15 agentes con "14 mossos y 1 guardia urbano", 23 comercios, 33 incendios, "≈ 500". Las barras parten de 0.
- **Cita de Vox:** va como "Garriga (Vox): jóvenes extranjeros" (atribuida, con "Vídeo en redes, 25-10 · vía EFE"), seguida del plano "Mossos: sin datos de nacionalidad" con el sello gris "SIN DATOS OFICIALES", que se queda hasta el corte a "¿Y LOS DEMÁS?". En esos planos solo hay tarjetas con busto genérico y la fila de 128 siluetas sin rasgos ni etiqueta de origen: ninguna imagen de persona real asociada a la cita.
- La voz coincide con `voz.txt` y el guion (296 palabras en `tiempos.json`; guion dice 295, por una palabra de la guía fonética).

## Legibilidad y zonas seguras (prioridad 4)
- Sincronía voz-subtítulos: 41 inicios de frase medidos contra `tiempos.json`; desvío máximo 0,11 s (en pausas), dentro de ±0,2 s. Sin cortes de audio (único silencio largo: la cola final).
- Ritmo: sin huecos > 2,6 s con umbral 0,004 hasta 107,5 s. El cierre (106,9–115,3 s) solo se mueve con el pulso (umbral 0,001), según la regla ya conocida; la cola tras la voz es de 2,0 s.
- Lectura: rótulo + subrótulo ≥ palabras ÷ 3 en todos los planos, salvo el 18 (10 palabras en 3,32 s, justo, lo admito) y "¿Y LOS DEMÁS?" (3 palabras en 1,0 s, pregunta corta).
- Pronunciación: el texto enviado al sintetizador lleva la guía fonética del guion (tiktok, guasap, télegram, guvérn, aliansa, parlón, garriga, colbóni, íya, feijó-o, pe pe). **No he podido escuchar la voz** (solo análisis de audio y texto): Catà y Orriols no se pronuncian (solo van en rótulo). Si el coordinador quiere certeza, que escuche TikTok (≈1,6 s), Govern (≈88,6 s), Parlon (≈50,7 y 91,0 s) y PP (≈93,3 s).
- **Tarjeta "Incidents violents · Mossos" (16,0–17,5 s):** recreada en tipografía de la marca, sin escudo ni cartel original, con la nota "Aviso en X de @mossos, 20:24" a la vista durante toda la tarjeta. Queda identificada como aviso de los Mossos y no parece material propio.

## Obligatorio (bloqueante)
Ninguno.

## Formato Reel/TikTok
Ninguno que baje la nota. Criterio 4 aceptado (115 s).

## Recomendado
1. [16,0–17,5 s] Tarjeta de los Mossos: el rótulo de 36 px dice "Aviso en X de @mossos, 20:24"; si el coordinador quiere blindarlo más, "Recreación del aviso de @mossos en X, 20:24". Requiere su visto bueno porque cambia un literal del guion.
2. [17,6–19,4 s] El crédito de I1 salta de línea en "24-/10, 21:35" (parte la fecha). Usar el guion no separable ("24‑10", como ya hacen las notas de 25‑10) o reducir el texto sin cambiar palabras.
3. [66–68 s] El plano de Vox y Aliança tiene 10 palabras de rótulo en 3,3 s; si cabe, empezar el segundo rótulo 0,2 s antes.

## Lo que funciona bien
- Gancho claro (móvil → contador 128 mostaza) y bucle con el cierre.
- Pixelado del I1 contundente y sin fugas; ninguna foto con personas; no hay material de los dos autores descartados.
- Cita de Vox contrapesada con el dato de la ausencia de nacionalidad y el sello neutral.
- Audio dentro de rango y subtítulos sincronizados.

## Regresión respecto a la v1
Los tramos de animación (mapa, contadores, siluetas, posturas, cierre) no se han vuelto a analizar a fondo: la hoja de contactos muestra los mismos planos que en la v1 con los cambios pedidos (I2 e I3 fuera, reloj solo sobre la tarjeta, rótulos corregidos).
