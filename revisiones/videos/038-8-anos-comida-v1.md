# Revisión de vídeo · 038-8-anos-comida · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 43,2 s · -14,1 LUFS · pico -1,4 dBTP (OK)
**Test de formato Reel/TikTok:** 8/10 (falla 5, ritmo/legibilidad en la escena de sueldos, y 7, zona segura por la derecha)

## Obligatorio (bloqueante)
1. [20,8–24,3 s] Escena de sueldos: el sello DATO (x 700, y 590, en 4,3) tapa "(media de los 4 trimestres)", la base de la cifra 1.919 → 2.377 €. Texto parcialmente ilegible durante 3,5 s. → Mover el sello a y ≈ 700–760 (sobre el hueco entre rótulo y barras, sin tocar el rótulo de 44 px) o bajarlo a la derecha de la barra SUELDO; comprobar con crop 250–1250.
2. [4,4–7,3 s, 16,5–24,3 s, 33–36 s] Zona segura derecha: la barra PRECIOS llega a x ≈ 981 y su etiqueta "PRECIOS" cruza x = 960 (avisos BORDE de comprobar.mjs en 4,40, 20,77, 36,2 s). → Recentrar `barrasVSerie` (centros dentro de 100–940; p. ej. [200, 540, 880] con anchura menor) en las escenas 2, 5, 7 y 8.

## Formato Reel/TikTok
1. [28,7–33,3 s] IVA: la etiqueta pasa a "2025 · 4 % / 10 %" a los 28,96 s, mientras la voz aún dice "alimentos básicos" (la voz no menciona 2025). No es error, pero retrasar `fases[2].en` hasta ≈ 31,5 s (tras "Hacienda") ordena imagen y voz. → propuesta, no bloqueante.
2. [28,7 s] "SEGÚN HACIENDA (25-6-2024): respuesta…" (12 palabras) entra 1,7 s antes de que la voz diga "Hacienda" (30,4 s), pero se queda 4,7 s en pantalla: tiempo de lectura OK (no es el caso de 5 palabras en 0,4 s; el rótulo entra con fundido gris y se lee entero desde 29,0 s). La atribución ("según Hacienda") es correcta y fiel al guion.
3. [6,0 s] Sello DATO escena 2 (en 1,8): no tapa texto (queda a la derecha del rótulo, sobre la barra de precios). OK. Sello de 4,4 s: es la entrada de la barra PRECIOS, no un sello.
4. Notas de 40 px: legibles; la del cierre de la escena de sueldos (2 líneas) queda sobre la franja de subtítulos sin pisarla.

## Correcto
Textos de rótulos y cifras literales al guion (+39, +22, +36/+24, 1.919/2.377, +24, IVA 0/5 → 4/10, "NO ES TU SUELDO", cierre A/B); gancho con cifra en el fotograma 1; sin gráficos engañosos (todas las barras parten de 0, misma escala); atribución "Según Hacienda" y aviso "NO MIDE"/media; sin opinión ni fotos de terceros; cierre de serie con cola 3,7 s y bucle con "¿Y tu sueldo?". Pronunciación no verificable sin audio (solo voz.txt).
Aviso informativo: la escena 3 (Eurostat, 7,3–11,4 s, 4 s) es solo rótulo + años, sin gráfico (3 s casi estáticos); aceptable.
