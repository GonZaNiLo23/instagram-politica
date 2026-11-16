# Revisión de vídeo · 053-compra-ahora-paga-despues · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 45,47 s · -14,2 LUFS · pico -1,4 dBTP (OK). Sin copia en `videos/renders/subida` (no existe la carpeta en la nube).
**Test de formato Reel/TikTok:** 8/10 (criterios flojos: cierre/aire inferior y soporte de fuente en 2b)

## Obligatorio (bloqueante)
1. [13,4–19,9 s, bloque 2b] Falta el pie fijo del guion "Ley 16/2011, art. 3.c · Directiva, art. 2" (no está en `escenas.json`): es la fuente jurídica de la afirmación central → añadir `notas` con el literal, anclada y ≤ 1490, durante toda la escena.
2. [19,9–25,3, bloque 2c] La línea de tiempo del guion (marca 20-11-2026 de aplicación y sello "SIN LEY") no se ve: solo hay rótulos y 2 iconos. Añadir la marca 20-11-2026 y el sello, o declarar al coordinador que se simplifica.

## Formato Reel/TikTok
1. Tercio inferior (y > 1300) vacío en casi todas las escenas; contenido compacto arriba → bajar iconos/gráficos ~150 px o ampliarlos.
2. [39,3–41,9] El móvil del cierre toca la caja B (y ≈ 965) → separarlo ≥ 20 px. El cierre no muestra "Síguenos" visible en el control-6 (solo en la tarjeta posterior 41,9–45,5; confirmar que está).

## Aviso LECTURA (casilla A, 39,31–39,56 s)
Falso positivo, se acepta: "A" es una casilla de una sola letra que sigue en pantalla hasta 41,86 s (el aviso mide solo hasta que entra la B, 0,25 s después). El texto que hay que leer es el rótulo "¿Crédito… o solo un pago?" (4 palabras, 2,6 s). No requiere cambio.

## Recomendado
1. Voz: sin poder escuchar, la pronunciación se valida solo en `voz.txt`.

## Lo que funciona bien
- Rótulos literales respecto al guion (comprobar.mjs sin LITERAL), gancho con cifra/fecha desde el fotograma 0, sin huecos de ritmo, sin x > 960, audio en rango, subtítulos sincronizados.
- Idea única clara y pregunta A/B de cierre que reenlaza con el gancho.
