# Revisión de vídeo · 018-voto-en-blanco · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 69,9 s (voz acaba en 67,8 s: cola 2,1 s, OK) · -14,2 LUFS · pico -1,3 dBTP · sin cortes de audio. Sin hueco >3 s en la zona de contenido (solo el cierre, con pulso). Lectura ≥ palabras÷3 en todos los rótulos.
**Test de formato Reel/TikTok:** 8/10 (fallan: legibilidad/limpieza visual por solapes de elementos animados con rótulos; zona inferior vacía en varias escenas)

## Obligatorio (bloqueante)
1. [00:08] El sobre que cae ("bSobreCae", yTope 410) tapa "BLANCO = sobre sin papeleta" (letras "BLAN" y "papeleta" cortadas, fotogramas 7,6–8,0 s). → Bajar `yTope` por debajo del rótulo (≥ y 560) o retrasar `abre/cae` hasta que el rótulo salga.
2. [00:18–00:19] Al encoger las urnas hacia la franja superior (`miniEn` 12,04 en bUrnas), las etiquetas BLANCO/NULO/NO VOTAR cruzan el rótulo "ABSTENCIÓN = no ir a votar" (texto ilegible ~0,5 s, fotograma 18,6 s). → Que el rótulo espere a que las urnas lleguen arriba (o que las urnas suban antes de que entre el rótulo, `en` ≥ 1 s tras el inicio del encogimiento) o que el rótulo entre ya en la posición final (y 430).
3. [00:52–00:56] Escena "+1.000 nulos o abstenciones → sigue en 3.000": el rótulo (64 px) pasa a 3 líneas y su "3.000" choca con el contador "100.000" y con los sobres/papeletas que caen (bCaen, "100.000" ilegible en 53,0 s). → Rótulo más corto a 2 líneas o mover el contador y la animación ≥ 40 px más abajo; que los sobres caigan sobre una zona libre y no sobre la cifra.

## Formato Reel/TikTok
1. [00:37–00:52] Rótulo de 2 líneas pegado a "VOTOS VÁLIDOS" y "cada sobre = 100" casi en x = 960 (margen justo). → Subir el contador ≥ 40 px y dar ≥ 20 px de margen a la derecha.
2. [00:31–00:34] El mapa de la provincia resaltada no se reconoce como España (mancha gris con listón). → Silueta reconocible o zoom con nombre de la provincia.
3. [Varias] Zona inferior (y 1250–1490) vacía en gran parte del vídeo (contenido compacto arriba). → Bajar el centro de gravedad o agrandar gráficos/iconos (≥ 240 px los que cuentan la idea).
4. [00:56–00:61] El plano de barras de la escena 8 es inventado y no lleva la etiqueta EJEMPLO (el guion la quita en 63,2 s, pero aquí ya hay barras ficticias). Solo informativo: considera mantener "EJEMPLO" hasta 61,2 s; si se cambia, requiere OK del guion.

## Recomendado
1. [00:65] Cierre con "Síguenos" por defecto, no "📌 Guárdalo" del guion: aviso al coordinador (no es error de render).
2. [00:22] El sello MITO se apoya sobre los puntos del hemiciclo: funciona, pero separarlo un poco.
3. Pronunciación de D'Hondt: validada solo en `voz.txt` (sin poder escuchar).

## Lo que funciona bien
- Gancho claro desde el fotograma 0 con sobre, flecha y podio; bucle con el cierre.
- Rótulos literales respecto al guion; fuentes LOREG y créditos de foto (CC BY-SA) presentes; foto F2 sin caras.
- Ejemplo con eje "desde 2.900" avisado, sin trucos de escala; "EJEMPLO" fijo de 37 a 56 s.
- Audio en rango, subtítulos y rótulos alineados con la voz; ritmo sin huecos.
