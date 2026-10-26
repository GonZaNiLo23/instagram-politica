# Revisión de vídeo · 010-brasil-voto-obligatorio · vuelta 1
**Veredicto:** CAMBIOS (dos retoques menores; no hace falta re-revisión completa)  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 33,87 s · -14,1 LUFS · pico -1,5 dBTP · voz real ElevenLabs (provisional=false). Sincronía voz-subtítulos OK (silence_end frente a `tiempos.json`, desvío ≤ 0,09 s). Cola de 3,2 s de silencio tras la última palabra (30,9–33,9 s): aceptable, cierre en bucle.
**Test de formato Reel/TikTok:** 9/10 (criterio flojo: legibilidad de textos pequeños; ver Recomendado)

## Obligatorio (bloqueante)
1. [16,5 s, escena 14,27–16,99] El icono del carné lleva escrito "DNI" (componente `dib`, nombre "dni"): es la sigla del documento español, no está en el guion ("CARNÉ DE IDENTIDAD") y en una pieza sobre Brasil confunde (allí es el RG). → quitar el texto "DNI" del icono (tarjeta genérica sin sigla) o cambiarlo solo para la 010; no tocar el resto de Voto.tsx. El dibujo en sí se ve bien y no hay regresión por la 008.
2. [18,7–19,7 s, escena 16,99–19,7] La nota "Se cancela la inscripción electoral" (5 palabras, 52 px) entra en 1,69 s de escena y dura 1,0 s: necesita ≥ 1,7 s. → `en` ≈ 0,9 (entra hacia "elecciones seguidas", 17,9 s) para que dure ≥ 1,8 s; el rótulo de 3 líneas no choca con las urnas (y = 490 y urnas en 720).

## Formato Reel/TikTok
1. [10,0–14,3 s] Hueco: con umbral 0,004 solo 12,5–14,27 s (1,7 s) y con 0,001 no hay hueco; el Ken Burns de la foto TSE es continuo. OK. El cierre 28,7–33,9: con umbral 0,001 hay cambio continuo hasta 33,7 s; OK (con 0,004 se ve quieto desde 29,1 s: movimiento muy pequeño, el pasaporte con interrogación). Si se quiere más claridad, pulsar el signo "?" o el 📌 al final; opcional.
2. Test sin sonido: se entiende la idea con las hojas (pasaporte tachado → 18–70 → multa → sin pasaporte/oposiciones → 3 elecciones → ¿y en España?). OK.

## Verificaciones pedidas
- **Foto de Madrid (5a, 22,8–25,7 s) y `imagenes/U3c.jpg`:** solo urna naranja del Senado, sobres, mesa y pared de ladrillo. Sin personas, manos ni cuerpos. Los sobres solo dicen "ELECCIONES / SENADORES/AS": ninguna sigla ni papeleta de partido legible. OK. Crédito "Foto: LauraHale (Madrid, 2019) · CC BY-SA 3.0 · Wikimedia Commons" y "Fuente: LOREG, art. 5 (BOE)" presentes.
- **Literales:** rótulo "MULTA: HASTA 3,5 REALES" exacto; contador "hasta R$ 3,51" y nota "Hasta R$ 3,51 por vuelta" como el guion. Resto de rótulos, notas, fuentes y créditos coinciden con el guion (Grep de escenas.json). Sin cifras, nombres ni siglas añadidos salvo el "DNI". Neutralidad: ni candidatos, ni encuestas, ni resultados, ni banderas de partido. OK.
- **Escuchar "reales" en 13,20–13,52 s** (frase "hasta tres reales y medio", 12,96–13,9 s): debe sonar /re'ales/ en español, no "reais". Voz.txt escribe "reales" bien.
- **Tamaños:** nota "VOLUNTARIO: 16-17, +70, ANALFABETOS" a 52 px (como el guion); "analfabetos: voluntario" 52 px; etiquetas de la barra y de las urnas ("1.ª VUELTA", "2.ª VUELTA") 46–48 px. En fotograma completo se leen bien en móvil (contraste tinta sobre crema); los números de la barra (0, 18, 70) son lo más pequeño pero se leen. Basta. La regla de ≥ 64 px no se aplica aquí porque el guion fija 52.
- **Tiempos cambiados:** "EN BRASIL, ES LA LEY" a 1,82 s: la voz dice "En Brasil" en 1,2–1,9 s, correcto. Cierre a 28,73 s: "¿Te imaginas…?" empieza en 28,83 s, correcto. Escena 4b: etiqueta "EJEMPLO" (tinta, 64 px) presente en todo el tramo 19,7–22,81 s, sin sello DATO. OK.
- **Zonas seguras:** subtítulos y rótulos dentro de x 60–960; fuentes/créditos acaban en y ≈ 1375 (< 1500); ninguna foto cruza x 960 (se comprobó con `drawbox` en 4 fotogramas y la hoja). OK.
- **Lectura (palabras ÷ 3):** solo falla la nota de la escena 16,99–19,7 (punto 2). La escena 2 (7 palabras en 2,28 s) y la 3 (11 en 3,64 s) quedan justas pero cumplen.

## Recomendado
1. [13,2–14,3 s] La nota "Hasta R$ 3,51 por vuelta" (36 px, gris piedra sobre crema) tiene poco contraste; pasarla a tinta o a gris más oscuro.
2. [0–1,8 s] El gancho a 100 px queda pegado al @ de marca (hueco de pocos px): subir 10–20 px el aire entre el handle y la primera línea si la plantilla lo permite.

## Lo que funciona bien
- Gancho legible desde el fotograma 1 sin sonido; pasaporte tachado con sello.
- Voz real, loudness en rango, sin cortes; sincronía subtítulos ≤ 0,1 s.
- Gráfico EJEMPLO honesto; fuente en cada dato; fotos con licencia y crédito; pieza neutral.
- Cierre con 📌 "Guárdalo", "Fuentes en la descripción" y pregunta con bucle al pasaporte.

## Cierre del coordinador (2026-10-22)
Render v2 (`videos/renders/010-brasil-voto-obligatorio-v2.mp4`). Comprobado por el coordinador en `control/v2-par.png` (16,5 s y 18,9 s) y en un fotograma a 0,5 s: el carné sale como tarjeta genérica sin "DNI"; "Se cancela la inscripción electoral" visible a opacidad completa a 18,9 s; el gancho "¿NO VOTAS? SIN PASAPORTE NUEVO" queda separado del @ y no choca con el pasaporte. Tal como indicaba esta revisión, bastaban dos fotogramas → **APROBADO (v2)**.
