# Revisión de vídeo · 078-fp-online-presencial · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 29,97 s · -14,1 LUFS · pico -1,5 dBTP (OK)
**Test de formato Reel/TikTok:** 8/10 (criterios fallados: composición/aire del tercio inferior; gancho sin movimiento visual fuerte y fuera de zona)

## Obligatorio (bloqueante)
1. [00:00–04:22] Gancho "FP ONLINE PRIVADA: CON CLASES PRESENCIALES" (110 px): "PRESENCIALES" llega a x≈1000 (> 960, fuera de zona segura). Es el aviso BORDE de 4,23–4,27 s (fundido de salida del gancho): real, no falso positivo. → bajar `tamano` a ≈ 96–98 o partir en 4 líneas más cortas ("FP ONLINE / PRIVADA: CON / CLASES / PRESENCIALES" a menor tamaño) hasta x ≤ 940.
2. [18:30–22:00] Escena del tope: la barra "50" y el eje vertical (y≈1190–1220) quedan tapados por la pastilla de subtítulos (y≈1195). → subir `topeFp` (y 640 → ≈ 560) o reducir `paso` (210 → 180) para que la última fila acabe en y ≤ 1150.

## Formato Reel/TikTok
1. [todo] Tercio inferior vacío (y≈1300–1900) en todas las escenas de contenido; el contenido queda comprimido arriba. → bajar barras y bajar el bloque de datos o agrandar las barras (alto 130 → 170) para ocupar hasta y≈1150.
2. [00:00–01:12] Gancho estático hasta 1,2 s: la barra entra tarde (`en` 1,2). → `en` ≈ 0,3 para que haya movimiento desde el fotograma 0 (el guion pedía portátil/puerta de aula con zoom, no está; aceptable si se declara).

## Recomendado
1. Guion en `borradores/`: comprobar.mjs no verificó literalidad; la hice a mano: rótulos, pies (Centros privados de FP, Pendiente de publicarse en el BOE, Cursos 2028-29, 2029-30 y 2031-32), fecha 24-11-2026, 15–39 %, 40–60 %, 80→65→50 y cierre coinciden con el guion. No hay errata.
2. Aprobar el guion (pasar a `aprobados/`) antes de publicar.
3. Cierre `cta` 'siguenos' por defecto: coincide con la voz ("Síguenos…").

## Lo que funciona bien
- Mensaje único y legible sin sonido; barras con ejes 0–100 %, sin manipulación gráfica.
- Audio en rango, sincronía de subtítulos correcta en los fotogramas revisados, rótulos ≥ 64 px, voz real.
- Contraste alto (tinta sobre crema, acento mostaza).

(No revisadas a fondo: portada, escena 2b y cierre; control-2/3/6 no abiertos. Voz sin escuchar.)
