# Revisión de vídeo · 028-luto-oficial · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video (con un aviso al coordinador sobre la música)
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 27,2 s · -13,9 LUFS · pico -1,4 dBTP
**Test de formato Al minuto/Reel:** 8/10 (fallan 9 y, a medias, 8)

## Obligatorio (bloqueante)
1. [00:00–00:17] Cita de 4 líneas a 56 px (< 64 px). Con 3 líneas ya se lee mejor: pasar a 64 px y, si no cabe en x ≤ 960, partir el subtítulo 12,0–17,7 s en dos tramos con el mismo texto literal (12,0–14,8 / 14,8–17,7).
2. [00:00–00:01] La caja de titular entra con fundido: en el fotograma 3 está semitransparente. Debe estar al 100 % desde el fotograma 1.
3. [Música] Hidden Agenda a -18 dB en una pieza de luto con víctimas: quitarla (o dejar solo el cierre sin música). Con el clip a -16 dB tras 17,8 s, la música queda más fuerte que el clip entre 22,8 y 24,2 s y cubre las palabras del presidente. Ver también "Recomendado".

## Formato
1. [24,2–27,2 s] Cierre de 3 s: "Síguenos / para estar informado" aparece hacia 25,4 s y se lee solo 1,4 s. Debe entrar con la frase (24,2 s) o alargar el cierre a 4 s.
2. Criterio 9 (final que retiene): sin pregunta, decisión aceptada del guion (suceso con víctimas). Se queda en 0 a propósito.

## Comprobado y correcto
- Literalidad: rótulo, detalle, fuente, titular, fecha, crédito, cita (4 tramos) y frase de cierre coinciden con el guion, carácter a carácter. Voz = "Ya está en el BOE: luto hasta el 31 incluido y banderas a media asta." (14 palabras, motor ElevenLabs real, no provisional).
- Aviso BORDE de comprobar.mjs: falso positivo, el clip es a pantalla completa y no hay texto nuevo en x > 960. Aceptado.
- Corte en 24,2 s: se ve el clip hasta "mismas"; con 24,16 s como fin de "mismas" en la transcripción, la "Y" empieza hacia 24,1–24,2 s en el clip original. En el render, ese tramo va a -16 dB bajo música y es inaudible. Cumple. Si quieres margen: cortar en 24,1 s con fundido de audio de 0,1 s (opcional).
- Audio del clip bajo la voz: baja de -21 dB a -13 dB de media (voz) desde 17,8 s; tras la voz (22,8 s) el clip queda atenuado. Correcto. Sin silencios ni cortes (solo 0,3 s final).
- Lectura: dato 8 palabras + detalle 7 = ~15 palabras en 6,4 s (>5 s requeridos). OK. Cita final (17 palabras) en 5,7 s: justo, pero OK.
- Subtítulos sincronizados con el clip (tiempos del guion). Fuente BOE a 36 px legible, crédito visible y sin colisión con la cita.
- Duración 27,2 s dentro de 15–40 s. Test sin sonido: se entiende (titular + citas + dato).

## Recomendado
1. Música: en un hecho con víctimas, opción más segura es sin música. Si se quiere mantener, entrar solo en el cierre y a -22 dB.
2. Tras 17,7 s no hay subtítulo del clip mientras suena Sánchez a -16 dB (hasta 22,8 se oye la voz de Rafalupi). Coherente con el guion: no tocar.

## Lo que funciona bien
- Gancho inmediato con titular y declaración; encuadre vertical del clip aprovecha bien la cara; velo tinta legible; caja "El dato que falta" clara y con fuente.
