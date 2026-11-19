# Revisión de vídeo · 058-compraventas-vs-precios · vuelta 2
**Veredicto:** CAMBIOS (menor)  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 32,8 s · -14,1 LUFS · pico -1,1 dBTP · voz real
**Test de formato Reel/TikTok:** 8/10 (falla: zona inferior vacía; sello "?" tapa el eje)

## Verificación de la lista cerrada de v1
1. Gancho a 104 px cruzando x=960 → CORREGIDO (tamano 90, 2 líneas; termina en x≈900; portada también en 2 líneas).
2. PROVISIONAL tapaba DATO → CORREGIDO (PROVISIONAL en x=520, y=1060; "DATO" legible).
3. Relojes idénticos → CORREGIDO (1 cuña frente a 3 cuñas, etiquetas "1 MES"/"3 MESES", "≠" centrado).

## Obligatorio (bloqueante)
Ninguno de realización. Una cosa a confirmar con el coordinador:
- Las etiquetas "1 MES" y "3 MESES" no están en el guion (las pedí yo en v1 como opción). Se aceptan; añadirlas al guion/tabla de rótulos. Lo mismo con la escena 7 (pregunta A/B con `abSerie`, el guion la pone sobre las barras del gancho).
- Guion aún en `borradores/`: comprobar.mjs no verificó literalidad. Comparé `escenas.json` a mano: 54.548, −13,4 %, +12,2 %, −3,6 %, 4-12, 2T/3T, fuentes y rótulos coinciden.

## Formato Reel/TikTok
1. [03:7–04:4] El sello "?" sigue tapando parte de la etiqueta "15 %" del eje (x 800, y 1120). → moverlo a y≈1000 o x≈640, sobre el hueco de la barra, sin cruzar el eje.
2. Tercio inferior vacío en casi todas las escenas (contenido acaba en y≈1100). → subir/ampliar gráficos (persiste de v1).
3. "COMPRAVENTAS INSCRITAS" (8,3 s) termina en x≈956: justo dentro de 960; margen de 4 px. → bajar a tamano 60 para dejar ≥ 20 px.

## Recomendado
1. Nota "Registros de la Propiedad" (40 px, gris claro) poco contraste: usar tinta.
2. Logotipo del INE no aparece; quitarlo de la tabla de imágenes del guion.

## Lo que funciona bien
- Audio en rango, sin tramos de voz provisional; sin opinión; gráfico honesto (eje común 0–15 %, −3,6 % proporcional).
- Gancho con cifra y pregunta; "¿Y EL PRECIO?" en portada; cierre con CTA "Síguenos" y pregunta A/B.
- Test sin sonido: se entiende (cifra, precio, mes ≠ trimestre, acumulado).
- Tramos sin cambios respecto a v1 (escenas 2–3, 5–6: ritmo, lectura, sincronía) conservan la valoración anterior.
