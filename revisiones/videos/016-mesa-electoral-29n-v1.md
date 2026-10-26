# Revisión de vídeo · 016-mesa-electoral-29n · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 69,4 s · -14,1 LUFS · pico -1,4 dBTP. Subtítulos: desvío ≤ 0,05 s frente a `tiempos.json`. Voz acaba en 64,4 s; cierre de 5 s tras la última palabra (música sin voz). Sin cortes de audio.
**Test de formato Reel/TikTok:** 8/10 (fallan: lectura/ritmo en escena 2 y en la foto F2; mitad inferior del encuadre vacía en casi todo el vídeo)

## Obligatorio (bloqueante)
1. [08:41–10:21 aprox., escena 2 "SORTEO PÚBLICO EN TU AYUNTAMIENTO"] 5 palabras de rótulo + nota de 6 palabras en 1,52 s (mínimo 1,67 s solo el rótulo). Se acorta al pasar a la voz real. → adelantar la entrada de la escena (cortar la escena 1 ≈ 0,3 s antes si la voz lo permite) o dejar el rótulo en 4 palabras no es posible (literal): pedir al coordinador una pausa de voz de 0,3 s tras "Lo hace tu ayuntamiento" o alargar la escena hasta ≥ 2,0 s moviendo la 3 (la escena 1 tiene margen de ≈ 0,4 s tras la frase).
2. [40,1–41,5, escena 13, foto F2] La foto sale 1,3 s: no da tiempo a reconocerla ni a leer crédito + "Imagen de archivo · Bizkaia 2023". → mínimo 2,5 s: empezarla con "cuentas los votos al final" (≈ 39,5 s) y que el rótulo "DIETA: 75 €" entre con "Cobras". Si no cabe, quitar la foto (el guion no la exige con ≥ 2,5 s) y avisar al coordinador para ajustar la tabla de imágenes.
3. [62,4–69,4, cierre] "Síguenos / para estar informado" en lugar de "📌 Guárdalo" del guion aprobado. El generador lo avisó: es el CTA por defecto del componente desde 2026-10-26 (decisión de proyecto), no un error de render. → el coordinador debe confirmar que ese CTA sustituye al del guion; si no, `cta: 'guardalo'`. Resto de rótulos y notas: literales al guion (comparado con `escenas.json`).

## Formato Reel/TikTok
1. [todo el vídeo] El contenido ocupa y ≈ 450–1250; entre el subtítulo y las notas (y ≈ 1300–1450) hay un tercio de pantalla vacío. → subir/agrandar los iconos (≥ 360–480 px) y bajar el subtítulo cerca del icono, o centrar el bloque en vertical.
2. [00:00–00:05] Gancho correcto: rótulo desde el fotograma 1, bombo y ficha moviéndose, "ES OBLIGATORIO" con sello. Funciona.
3. [62,7–69,4] Cierre: 5 s sin voz. Hay pulso (27 cambios a umbral 0,001), pero es largo → voz + 1,5–2 s (≈ 66 s) o aprovechar para el CTA.

## Recomendado
1. [17,9–19,7, F1] Foto de 1,8 s con el rótulo repetido de la escena anterior; es demasiado corta para el manual (texto ilegible). Alargar a ≈ 2,5 s o recortar más sobre el manual.
2. [37,3–40,1] Escena de 8:00 → 9:00 → 20:00: el reloj salta a "20:00" en 0,4 s; comprobar que la hora final se lee (8:00 aún visible en la franja de la hoja).
3. F2 muestra sobres y rótulos "Elecciones a Juntas Generales": no son manos contando. Aceptable con "Imagen de archivo", pero no ilustra "recuento".

## Lo que funciona bien
- Audio y técnica correctos; subtítulos sincronizados (≤ 0,05 s).
- Datos y rótulos literales al guion; créditos CC BY-SA presentes y dentro de la zona segura; sin caras ni burlas; sin opinión.
- Ningún hueco > 2,5 s sin movimiento en la zona de contenido; balanza, casillas y mesa con suplentes se entienden sin sonido.
- Sin sonido se entiende la idea (sorteo → quién → cómo librarse → dieta → delito).
Pronunciación ("FP", cifras): solo verificada en `voz.txt`, no escuchada.
