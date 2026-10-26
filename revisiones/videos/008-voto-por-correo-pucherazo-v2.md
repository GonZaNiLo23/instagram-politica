# Revisión de vídeo · 008-voto-por-correo-pucherazo · vuelta 2
**Veredicto:** CAMBIOS (un único arreglo de maquetación, sin tocar voz ni tiempos)  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 80,0 s · -14,1 LUFS · pico -1,4 dBTP (OK). Voz sin cambios: sincronía de la v1 (≤ 0,07 s) vigente; el último inicio de frase cae en 77,27 s (OK). Sin voz provisional.
**Test de formato Reel/TikTok:** 9/10 (falla 7 zonas/legibilidad en la escena de "Custodiado…"; el resto ≥ v1)

## Obligatorio (bloqueante)
1. [22,4–26,6 s, escenas "3 · LO ENTREGAS"] La foto de la oficina de Correos tapa la última línea del rótulo "Custodiado hasta el día de votar" (se lee "votar" cortado, medido en 23,0 / 23,8 / 24,6 s; fotograma `revisiones/videos/tmp/008/tire.png`). El rótulo ocupa ahora 3 líneas + "Controles: 3" más arriba y la foto no se desplazó. → Bajar la foto ≥ 50 px (y encoger algo su alto) o reducir a 2 líneas el bloque de rótulo; comprobar que el crédito de la foto sigue visible (hoy está bien, termina por encima de y=1500).

## Formato Reel/TikTok
1. [39,7–45,3 s] Escena del Supremo: 21 palabras en 5,6 s (7 s necesarios). "2018 Audiencia · 2021 Supremo" entra a +2,3 s y completo desde ≈ 43,5 s: ahora hay ≈ 1,8 s de lectura para esa pareja, mejor que 1 s en la v1, pero sigue justo. → Aceptable para publicar (rótulos cortos y repetidos por la voz); si se toca, entrar esa pareja a +1,8 s.
2. [58,0–65,2 s] Tarjetas PP/Vox: la locución es de 3,4 s, pero las tarjetas se quedan en pantalla las dos escenas (58,0–65,2 = 7,2 s) con el mismo texto; basta como lectura (no los 9,7 s pedidos, pero con 7,2 s es legible). Resuelto de forma aceptable.
3. [77,3–80,0 s] Cierre: acaba 1,5 s tras la voz (78,56) y el pulso del icono es sutil (el detector de movimiento con crop 250–1350 lo da como tramo quieto de 2,7 s). Es corto y la mesa con "Guárdalo" se lee; sin cambios.

## Recomendado
1. [36,8–39,7 s] `manoCorta`: ya son brazos con puño entre x ≈ 60 y 960, el sobre pasa de uno a otro y no hay brazos cortados en el borde. Se lee como "pasar un sobre"; los puños tipo tubo son algo rudimentarios. Sin acción.
2. Sincronizar el guion aprobado con el vídeo (coordinador): el guion dice nota de Ayuso "Isabel Díaz Ayuso, 5-10-2026 · según Europa Press" y barra "≈ 20 %". El vídeo lleva "5-10-2026 · según Europa Press" y "≈ 21 %" (lo propuse yo en la v1; el post del guion ya dice 21 %). Hay que actualizar el guion aprobado (líneas de escena 2 y 4) o con el OK explícito del coordinador queda como cambio autorizado. 21,2 % sigue pendiente de verificar en origen (11.707/55.109) y 3,05 % nacional.
3. Regresión del componente compartido `Voto.tsx`: solo la pieza 010 comparte tipo (`dib`, con nombre "dni"); los cambios son props opcionales y `manoCorta` es una clave nueva, así que no debería alterarla. Revisar de pasada el dibujo "dni" cuando se revise la 010.

## Verificado de la lista de la v1
- Contador "Controles: N": ahora bajo el logo, x máx. ≈ 500 (OK, bien por debajo de 960).
- Notas: ancladas por la base, 36 px, todas por encima de y=1500 (tarjetas Ayuso/Feijóo/Abascal, Supremo 4 líneas, 22–26 s, 51–55 s, 65–69 s, 60 s). La del Supremo termina ≈ 1480 y no choca con el subtítulo. Créditos visibles en todas (F6, F7, F8, F1, F4, F3, F2).
- Nada con x > 960 en 7 + 7 + 7 + 7 fotogramas con drawbox (incluidas barras "≈ 21 %", tarjetas y MITO).
- Tarjetas de postura: más grandes y centradas; Ayuso → Feijóo → Abascal en orden y sin hueco vacío (Abascal entra en 10,5 s).
- Barra "≈ 21 %": correcta, con eje 0–25 compartido con España ≈ 3 %.
- Ritmo: sin huecos > 2,5 s salvo el cierre (ver arriba).
- Textos de rótulos y notas: iguales al guion salvo los dos cambios autorizados (ver Recomendado 2).

## Lo que funciona bien
- Gancho claro, recorrido 1-4, barras con eje común, tarjetas PP/Vox sin logos, "MITO" con puerta, cierre con 📌 y CTA.
- Sin burlas ni iconos humillantes; riesgo legal igual que en la v1 (OK).
- Audio estable, sin cortes.

## Para que la persona usuaria escuche (no puedo oír el audio; voz sin cambios)
"de ene i" (×3), "pe pe", "pe-soe", "Feijóo", "Correos", "dos mil ocho", "uno de cada cinco", "tres de cada cien", "diecinueve de noviembre".

## Cierre del coordinador (2026-10-22)
Render v3 (`videos/renders/008-voto-por-correo-pucherazo-v3.mp4`): único cambio, foto de Correos bajada (y 975, alto 350). Comprobado por el coordinador en el fotograma de control `control/v3-23.8s.png`: "votar" entero, foto sin tapar texto, crédito por encima de y=1500, nada más allá de x 960. Tal como indicaba esta revisión, basta un fotograma → **APROBADO (v3)**.
