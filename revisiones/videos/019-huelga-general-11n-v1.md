# Revisión de vídeo · 019-huelga-general-11n · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 98,0 s · -14,1 LUFS · pico -1,3 dBTP · voz ElevenLabs real (tiempos.json). Voz acaba en 92,3 s: cola de cierre de 5,7 s.
**Test de formato Reel/TikTok:** 8/10 (fallan: ritmo/atención en el tramo 3a-3c largo y escenas casi estáticas; cierre con cola larga). Sonido apagado: la idea se entiende.

## Obligatorio (bloqueante)
1. [04,9–10,9] Rótulo "REGISTRADA EL 19 DE OCTUBRE" a 2 líneas: el calendario (y=665) tapa "OCTUBRE" → bajar calendario/sobre (y ≥ 760) o acortar el rótulo con versión aprobada.
2. [72,3–75,4] La lupa cubre "NOV 11" del calendario y la fecha no se lee → mover la lupa a una esquina del calendario o reducirla.
3. [84,0–88,0] El check del contrato (x=850, esc 0,8) llega a x≈984 > 960 → x ≤ 800 o menos escala.
4. [88–98] "¿LA SECUNDARÍAS?" termina justo en x=960 (0 px de margen) → bajar tamaño a ≤ 96 o partir en dos líneas.
5. [32–36] En la nómina "0 € / ese día" la etiqueta "ese día" pisa el borde inferior de la tarjeta (se ve cortada) → subir la etiqueta o agrandar la tarjeta (también en 84–88).

## Formato Reel/TikTok
1. [90,6–98] Cierre: voz acaba en 92,3 y el vídeo sigue 5,7 s → recorta a ≈ voz + 1,5 s (≈ 94 s). Sin hueco real (pulso del cierre, 0,001).
2. [21,8–56,4] 35 s seguidos de iconos tipo "lista" (3a–3c): sin elemento de sorpresa; alternar un cambio de fondo/sello grande a mitad (≈ 40 s) para reenganchar.
3. [13,4–18,8] La línea de tiempo enciende 2026 (0,56 s) antes que 2012 (4,24 s): invierte el orden o enciende 2012 con "desde 2012" (≈17,7 s) y 2026 con "1.ª conjunta" para que acompañe la voz.

## Recomendado
1. U+2011 en "19‑10", "22‑10", "11‑N", "13‑N": se ven bien en render; mantener (no se parte la fecha).
2. Guion pide a CCOO y UGT dentro de pastillas iguales: cumplido; en 4 la de "Sindicatos" entra 1,2 s antes que "CEOE": está en orden de voz, aceptable.

## Lo que funciona bien
- Fidelidad: rótulos y notas de escenas.json coinciden con el guion (cifras, fechas, artículos, fuentes); sin erratas. Se añade "Fuente: BOE, RDL 17/1977 · ET" en 3a, que está en el guion.
- Neutralidad visual: sindicatos y CEOE en pastillas idénticas, sin logos ni retratos, sin juicio; la tarjeta "CEOE dijo que la impugnaría" y la renuncia del 22-10 tienen igual peso; sin opinión en el vídeo.
- Audio -14,1 LUFS, pico -1,3; sin cortes. Sin huecos > 2,5 s en la zona de contenido (0,004 solo marca el cierre; 0,001 limpio).
- Tiempos de lectura OK (todos los rótulos ≥ 1 s/3 palabras). Gancho claro desde el fotograma 1 con pregunta.
- Subtítulos dentro de zona segura; notas ≤ y 1490.
- Pronunciación (siglas, "dos mil doce") no verificable al oído: solo comprobado en voz.txt.
