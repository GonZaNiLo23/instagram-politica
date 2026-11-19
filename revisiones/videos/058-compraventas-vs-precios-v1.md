# Revisión de vídeo · 058-compraventas-vs-precios · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 32,8 s · -14,1 LUFS · pico -1,1 dBTP · voz ElevenLabs real (provisional=false); cola de cierre ≈1,9 s
**Test de formato Reel/TikTok:** 8/10 (fallan: zonas seguras/legibilidad del gancho, claridad visual de "dos relojes")

## Obligatorio (bloqueante)
1. [00:00–04:42] Gancho "COMPRAVENTAS" a 104 px llega a x≈1020 (cruza 960; el aviso BORDE de comprobar 4,43 s es esta escena). → bajar `tamano` a ≈90 o partir en 2 líneas; comprobar con drawbox x=960.
2. [08:00–10:80] Sello "PROVISIONAL" (en 3,74 s, x=610) tapa el sello "DATO" (x=200): se lee "DAT". → mover PROVISIONAL a otra y (p. ej. 1050) o retrasar/ajustar x de DATO; ninguno tapa al otro ni al rótulo.
3. [15:66–19:06] Los dos relojes son idénticos (misma cuña ≈1 sector): no se ve "un mes" frente a "tres meses (abril–junio)" como pide el guion; la idea de la escena no se entiende sin audio. → relojSerie con 1 cuña (sep) y 3 cuñas (abr–jun), o etiquetas "1 MES"/"3 MESES" bajo cada uno. El "≠" de 120 px queda pegado al reloj izquierdo (x 450–530 sobre el borde): centrarlo.

## Formato Reel/TikTok
1. [08:17–08:27] Aviso BORDE x 960: es el sello PROVISIONAL rotado (sin texto fuera); tolerable, pero se corrige con el punto 2.
2. [00:03,7] El sello "?" tapa la etiqueta/eje de la barra del gancho (cifra 5 del eje). → subir/mover a la derecha de la barra (x≈800, y≈800).
3. Tercio inferior vacío en todas las escenas (contenido acaba ≈y 1100 salvo notas): subir gráficos o ampliarlos.
4. Cierre: los botones A/B sobre fondo vacío; el guion pedía sobre las barras del gancho. Recomendado.

## Recomendado
1. [04:42+] Nota "Registros de la Propiedad" (40 px, gris muy claro) casi ilegible: tinta o gris más oscuro.
2. Falta el logotipo del INE en las fichas de fuente (guion, tabla de imágenes). Si no se usa, avisar al coordinador para quitarlo del guion.
3. Guion aprobado no existe en `aprobados/` (comprobar.mjs no verificó literalidad): comparé escenas.json a mano.

## Lo que funciona bien
- Literales: todos los rótulos, notas, cifras (54.548; −13,4 %; +12,2 %; −3,6 %; 4-12; 2T/3T; pregunta A/B) coinciden con el guion v2.
- Gráfico sin manipulación: eje común 0–15 %, barra de −3,6 % proporcional (≈3,7× menor); base y periodo en cada cifra; aviso de datos provisionales.
- Audio en rango, sincronía y ritmo correctos (sin tramos > 3 s); tiempo de lectura suficiente; sin opinión ni burlas; gancho con cifra y pregunta; cierre con CTA y pregunta A/B.
