# Revisión de vídeo · 033-vivienda-vs-sueldos · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 35,5 s · -14,1 LUFS · -1,5 dBTP · voz ElevenLabs real (no provisional) · sin huecos > 2,5 s (select 0,001) · comprobar.mjs OK
**Test de formato Reel/TikTok:** 9/10 (cumple todo salvo la errata de subtítulo, que bloquea; sin ella, 10 salvo bajo contenido vacío en el tercio inferior)

## Obligatorio (bloqueante)
1. [≈17,0–18,0 s] El subtítulo muestra la guía fonética: "El **íne** mide el precio" (la voz.txt lleva "íne" y los subtítulos la copian). Debe verse "El INE mide el precio" → mantener "íne" solo para la voz y mostrar "INE" en los subtítulos (mapa de sustitución en la generación de subtítulos, o `tiempos.json` con el texto visible "INE"). Re-renderizar sin cambiar la voz.

## Formato Reel/TikTok
1. [0–4,7 s] Gancho correcto (regla 6): barras desde el fotograma 0, cifra a 104 px, cambio visual a 1,2 s. Nada que cambiar.

## Recomendado
1. [4,5–6 s] El sello EJEMPLO sale antes que el contenido del bloque 2 y queda un tramo casi vacío con solo la barra de puntos; adelanta algo la casa/billete (opcional).
2. Tercio inferior vacío en casi toda la pieza (habitual en estos flash).

## Comprobaciones pedidas
- Comparación honesta: rótulos "INE: precio de compra, 2.º trim. 2026 (no alquiler)", "TRABAJO: convenios hasta junio 2026" y "Dos medidas distintas, mismo corte: junio" visibles; nota "Compra, INE · Convenios hasta junio, Trabajo" en el gancho; sello COMPRA / ALQUILER tachado.
- EJEMPLO visible en la cabecera durante todo el bloque 2 (≈4,5–14,5 s) y "Cálculo propio con datos de INE y Trabajo" legible (≈36 px, contraste alto, y < 960).
- Portada: "CASA +12,2 %" / "SUELDOS PACTADOS +3,01 %": coherente con el gancho del guion aprobado y con el vídeo (el "+3 %" del informe v1 era la versión redondeada; el guion v2 usa 3,01). Legible, dentro de zonas seguras.
- Literalidad de rótulos y notas respecto a `escenas.json`: OK (comprobar.mjs). La "≈ 4 veces (cálculo propio)" lleva etiqueta de cálculo propio.

## Lo que funciona bien
- Idea única clara y gancho con movimiento desde el fotograma 0; barras que mantienen el hilo hasta el cierre; la pregunta A/B y cierre con "Síguenos" y "Fuentes en la descripción".
- Sin opiniones ni personas; iconos vectoriales; audio en rango.
