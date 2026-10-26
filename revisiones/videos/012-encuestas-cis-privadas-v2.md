# Revisión de vídeo · 012-encuestas-cis-privadas · vuelta 2
**Veredicto:** CAMBIOS (retoques menores)  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 87,03 s · -14,1 LUFS · pico -1,4 dBTP · voz ElevenLabs real (provisional: false) · sin huecos > 3 s (0,001: ninguno; 0,004: solo cola de cierre 80,9–87 s, pulso).
**Test de formato Reel/TikTok:** 9/10 (falla: sello DATO sobre etiqueta de dato).

## Obligatorio (bloqueante)
1. [01:02,4–01:05, escena 21 "PSOE 31,7 %"] El sello DATO sigue tapando "19,5 %" del par A: lo corta por completo al entrar (≈ 62,8 s) y lo roza en reposo (≈ 63,6–64,5 s). Ya no rebota sobre "38,2 %", pero reincide en la regla 4. → Bajar el sello ≥ 30 px (entre pares, y ≈ 790–800 en pantalla, a la derecha de "Lo que salió en las urnas") o sacarlo de x < 700.
2. [escena 19, nota] Rigor: al acortar a "Recuerdo de voto 2023 · CIS, estudio 3582, pregunta 24a" desaparece "% sobre entrevistados que dicen haber votado" y la base de la muestra ya no aparece en ningún sitio (la 20 solo da "% sobre votos válidos"; la 21 "Bases distintas" no dice cuáles). Sin ello el espectador compara 38,2 con 33,1 sin saber de qué base sale cada cifra. → Restaurar en la 19 "Recuerdo de voto 2023 · % sobre entrevistados que dicen haber votado · CIS, estudio 3582, pregunta 24a" (14 palabras en 4,84 s: cumple). Con eso, "Bases distintas" en la 21 queda aceptable (las dos bases se leen en la 19 y la 20); no hay que restaurar la frase completa (11 palabras en 2,33 s no cumpliría).

## Formato Reel/TikTok
1. [01:10,4 s, escena 23] En un fotograma el cucharón cruza la "S" de "microdatos CIS". Mucho mejor que en v1 (ya no hace ilegible la etiqueta), pero conviene que salgan por debajo de y ≈ etiqueta + 40 px.
2. [escena 23] La pastilla de subtítulos tapa media olla; subir las ollas ≈ 60 px.

## Recomendado
1. [escena 20] 13 palabras (rótulo + nota) en 2,99 s: justo; la nota de fuente es estática, aceptable.
2. [escena 6] Tarjeta "Privadas de octubre (40dB, GAD3…): PP primero" 2,33 s con 7 palabras: cumple justo; legible (4 líneas, 64 px).
3. [cierre] "+ Síguenos" por defecto en lugar de "📌 Guárdalo": decisión del coordinador (no es error de render).

## Verificado vs. v1
- Fotos de terceros: solo F1 en escenas.json (olla, cámara y paellas son iconos planos): resuelto, el crédito de F1 es el del guion.
- Anchura: nada cruza x = 960 en la hoja (cuadrículas de 10–13 y cocineros OK; olla de la 23 ya no entra desde la derecha).
- Sello de la escena 19 (par A) sin rebote ni solape; "microdatos CIS" casi libre (ver Formato 1).
- Fidelidad de rótulos/cifras/fuentes igual que en v1 (sin cambios en escenas 1–18 salvo fotos); sincronía voz-rótulo sin cambios (tiempos.json real); test sin sonido: la idea se entiende.

## Lo que funciona bien
- Gancho con dos balanzas enfrentadas, legible en miniatura; cifras exactas; barras con el mismo eje; EJEMPLO desde el primer fotograma; sin opinión y simetría PP/CIS.
