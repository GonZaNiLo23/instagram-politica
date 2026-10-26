# Revisión de vídeo · 005-decretos-vivienda · vuelta 2
**Veredicto:** APROBADO  →  vuelve a: coordinador (sin bloqueantes; un recorte opcional de la cola)
**Técnica:** 1080×1920 · 30 fps · H.264 + AAC · 90,1 s · -14,1 LUFS · pico -1,4 dBTP. Voz real sin cambios: los `silence_end` coinciden con inicios de frase de `tiempos.json` (misma sincronía que en v1, ≤ 0,06 s).
**Test de formato Reel/TikTok:** 9/10 (flojo solo el criterio de carga de lectura de las notas de 36 px, aceptada en v1; cola de cierre algo larga)

## Obligatorio (bloqueante)
Ninguno. Los tres bloqueantes de la v1 están corregidos:
1. Escena 2: rótulo `en` 1,0 (abs. 10,95 → 13,34 = 2,39 s para 6 palabras, necesita 2,0). Barras `en` 0 y 0,5 (abs. 4,38 y 4,88), eje desde 0.
2. "11 NOV · huelga general": `en` 16,32 → abs. 70,7, 1,47 s en pantalla (4 palabras, necesita 1,33). Fotograma a 71,9 s: legible, termina en x ≈ 930.
3. Pastillas 4b: `en` 0,1 · 0,82 · 1,46 · 2,1 = abs. 54,48 · 55,2 · 55,84 · 56,48, idénticas a la voz (PP, Vox, Junts, UPN). La UPN acaba en x ≈ 925.

## Formato Reel/TikTok
1. [00:82,5–00:90] Cola de cierre: la voz acaba en 85,44 s, así que quedan ~4,7 s con el cierre quieto. Con `select` 0,004 el hueco es 82,5–90,1 (7,5 s), pero con 0,001 no hay ningún hueco > 3 s (el `pulso` de "¿TE AFECTA ALGUNO?" y las llaves se mueven siempre). Cumple la regla, pero es larga frente a las otras piezas → recomendable `duracion` 90 → ~87 (voz + 1,5 s) y escena 9 `fin` a juego. No bloquea; si se recorta, comprobar que el 📌 "Guárdalo" y "Fuentes en la descripción" siguen ≥ 2 s en pantalla (aparecen sobre 84,5 s).
2. Bloque 4c (72–82 s): llaves 1,1, urnas grandes y carril propio; "solo si la derogan" acaba en y ≈ 1119 y el subtítulo empieza en y ≈ 1152 (≈ 33 px de aire, no chocan; la v1 pedía ≥ 40). Aceptable; para cumplirlo, subir esa pastilla 10 px (fotograma a 77,9 s).
3. Notas de 36 px: sin cambios, carga de lectura aceptada en v1.

## Recomendado
1. [00:80] Último fotograma de 4c (79,6 s): urna de 29 NOV acaba en x ≈ 939; correcto, sin margen. No tocar.

## Lo que funciona bien
- Fidelidad: `escenas.json` sin cambios de texto respecto a la v1 aprobada (rótulos, notas, cifras 172/178 y 166/184, RDL 28 y 29/2026). Sin errata.
- Hemiciclo con 14 puntos centrales (`resalta.cuenta` 14), como pide el guion. Dos iconos de documento al lado del sello BOE 7-10 (hoja de contactos, 2.ª sección). "LLAVE A · EN VIGOR DESDE 8-10" ya no deja "8-10" huérfano (fotograma 14,5 s). "8 meses al día" `izq` 600.
- Zonas seguras: `drawbox` x = 960 e y = 1500 en 6 fotogramas (barras, foto vivienda, pastillas, calendario, 4c, 29 NOV): nada pasa de 960, notas y créditos por encima de 1500. Fotos en x = 495 con crédito y licencia visibles (CC BY-SA, Wikimedia Commons).
- Tarjeta de cita "mantienen la esencia" con `deIzq`: la prop es opcional y solo está en `Vivienda.tsx`; `tarjetaCita` solo lo usa la 005 (Grep en `remotion/src` y todas las `escenas.json`), no afecta a otras piezas.
- Lectura: todos los rótulos ≥ 1 s por cada 3 palabras (node sobre `escenas.json`); "11 NOV · huelga general" lo cumple contando 4 palabras.
- Ritmo y audio: sin huecos > 3 s con umbral 0,001; -14,1 LUFS y -1,4 dBTP. Test sin sonido: se entiende (A en vigor, B pendiente, qué pasa si cae la A).
- Tramos sin cambios (gancho, 3a/3b, 4, 5): conservan la valoración de la v1.

## Para escuchar (no puedo oír el audio)
Igual que en v1 (voz sin cambios): PP/Vox/Junts/UPN a 54,5–56,5 s, "llave A/be", "¿Y ahora?" a 72,3 s, "dos mil treinta" a 26,1 s.
