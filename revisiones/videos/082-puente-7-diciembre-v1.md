# Revisión de vídeo · 082-puente-7-diciembre · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 35,37 s · -14,3 LUFS · -1,4 dBTP · sin huecos >3 s (select 0,001) · voz real elevenlabs (última palabra 32,4 s, cola 3 s)
**Test de formato Reel/TikTok:** 8/10 (fallan: claridad visual / info completa del mapa; tercio inferior vacío)

## Obligatorio (bloqueante)
1. [03:54–13:40] Melilla y Ceuta no se ven: `mapaPuente` de las escenas 2 y 3 lleva `cajaEn:-1`, así que no aparece la caja CEUTA/MELILLA. La voz dice "diez territorios... y Melilla" y solo se ven 9 coloreados; en la escena 3 falta Ceuta. → `cajaEn:0.3` en ambas (Melilla turquesa, Ceuta gris).
2. [09:30–13:40] Etiquetas del bloque 3 incompletas: el guion pide todas, sin omitir (Baleares, Canarias, Castilla-La Mancha, Cataluña, Galicia, Navarra, País Vasco, C. Valenciana, Ceuta). Faltan Baleares, Canarias y Ceuta (ETIQ en Puente.tsx tiene 6). → añadirlas.
3. [03:54–13:40] Faltan los contadores "10" y "9" del guion. → añadirlos (x ≤ 960, fuera de y 1250–1400).
4. [18:86–26:62] Mapa de la escena 5 (y=780, esc 0,31) queda tapado por la pastilla de subtítulos (Andalucía/Canarias cortadas). → subir mapa o reducir esc para acabar en y ≤ 1230.

## Formato Reel/TikTok
1. Tercio inferior vacío en las escenas 4–5 (calendario arriba). → agrandar calendario/mapa.

## Recomendado
1. Subtítulo de 2 líneas "nueve comunidades autónomas" (8,5 s) cubre el sur del mapa; subir mapa ~60 px.
2. Guion está en borradores/: comprobar.mjs no verificó literalidad; revisada a mano con escenas.json: rótulos, pies y nota coinciden con el guion.

## Lo que funciona bien
- Rótulos literales, sin opinión; gancho claro; leyenda del mapa; audio y sincronía correctos; cierre "Síguenos"; nada x>960.
