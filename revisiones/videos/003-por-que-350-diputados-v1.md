# Revisión de vídeo · 003-por-que-350-diputados · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264 + AAC · 32,1 s (objetivo ≈ 32) · -14,1 LUFS · pico real -1,5 dBTP · sin silencios salvo la cola final de 2,1 s
**Test de formato Reel/TikTok:** 9/10 (criterio flojo: 7, vertical/zonas seguras, por los obligatorios 1–3)

Rótulos literales comprobados contra el guion (escenas.json): sin erratas ni cifras distintas. Cifras de las barras correctas: Soria 45.117 / Madrid 187.817 (4,16 veces), eje en cero, encabezado "HABITANTES POR DIPUTADO", verbo "elige" en la voz. Sincronía voz-subtítulos por tiempos.json: sin desfase.

## Obligatorio (bloqueante) · lista cerrada
1. [23,7–24,1 s] El sello "DATO" rebota y tapa la etiqueta "MADRID ≈ 188.000" (en 23,9–24,0 s la cifra queda ilegible) y su borde derecho llega a x ≈ 960–972 → que entre desde arriba y se pare en una posición final (y ≈ 640–700, x ≤ 800) sin pasar nunca por la franja de la etiqueta de Madrid (y ≈ 870–930) ni por x > 960; rebote solo vertical y corto. Componente `sello` (x, y, `en`).
2. [4,5–9,2 s] La foto F1 ocupa x 90–990 (900 px centrados): invade la zona segura derecha (> 960) → `foto` F1 con ancho ≤ 780 centrado (x 150–930). Mantener la zona y ≈ 520–880.
3. [9,4–14,8 s] Las notas de hito de la línea de tiempo ("1977 · Ley para la Reforma Política", "1978 · Constitución", "1985 · LOREG: se mantiene") están a ≈ 34 px: ilegibles en móvil y por debajo del mínimo de 64 px (regla 10 de feedback). → subirlas a 64 px (columna derecha, x 510–930, hasta 3 líneas, sin escalonar) o, si no caben con los textos literales del guion, pedir versión corta al guionista; no recortar por cuenta propia. Mantener ≥ 40 px de aire con la línea de tiempo y la pastilla de subtítulos.

## Puntos que declaraba el generador
1. **Cartograma de 52 casillas + lluvia de 248 puntos (14,9–18,2 s):** aritmética correcta (50 × 2 + 2 = 102; 102 + 248 = 350, confirmado en el código: 248 puntos) y no hay dato falso ni gráfico que manipule. No induce a error, pero tampoco explica "según la población": el montón es uniforme y no está ligado a ninguna casilla (sin nombre), así que es una ilustración, no un reparto. No bloqueante: aceptable como esquema en un Flash; ver recomendado 1. Casillas neutras, sin colores de partido: correcto.
2. **Regla 300–400 y foto 4,5–9,2 s:** aceptable (la voz de ese tramo termina en 9,2 s). El contador de la regla pasa por 349 y 356 antes de parar en 350: no es una cifra oficial etiquetada, sin problema.
3. **Rótulos "1977: 350", "1978: 300–400", "1985: 350":** literales del guion y legibles (≈ 56 px monoespaciado). Las notas de hito sí son demasiado pequeñas (obligatorio 3).
4. **Sello DATO:** ver obligatorio 1 (el rebote sí tapa la etiqueta de Madrid). Asentado (≥ 24,4 s) no tapa nada.
5. **Créditos de foto de 3 líneas:** el aire real con el subtítulo es ≈ 90 px (mejor que 40) y el texto acaba en y ≈ 1490 < 1500, dentro de la zona segura. Aceptados; con la F1 quedan 4 líneas pegadas (crédito + "Fuente: CE art. 68"): ver recomendado 2.
6. **Cierre en bucle (25,0–29,3 s):** vuelve el hemiciclo con "400" y los 50 puntos mostaza; al llegar a "176 de 350" los 50 extra se atenúan y el 176 cuenta sobre los 350: coherente con el guion y con el dato. Bucle logrado. La pregunta final está en pantalla mientras suena "¿Lo harías?".

## Formato Reel/TikTok
1. [00:00–00:03] Gancho: "¿400 DIPUTADOS?" + contador 350 → 400 desde el fotograma 1; funciona.
2. Ritmo: 104 cambios de escena; huecos máximos sin movimiento 1,7 s (16,5–18,2) y 1,6 s (22,1–23,7). Ninguna frase de voz > 11 palabras.
3. Sin sonido: se entiende (¿400? → mínimo 300 / máximo 400 → 350 desde 1977 → Soria 45.000 vs Madrid 188.000 → basta ley orgánica y mayoría absoluta).
4. Portada (portada.png): "¿POR QUÉ 350 DIPUTADOS?" + hemiciclo con 350 en mostaza, completa en el recorte 4:5.
5. Criterio 7: penalizado por los obligatorios 1–3.

## Recomendado
1. [14,9–18,2 s] Que la "lluvia" caiga sobre las casillas (o con densidad desigual) para que se lea "según la población" sin sonido, o acortar el cartograma. Sin añadir datos que no estén en el guion.
2. [4,5–9,2 s] Unir crédito y fuente en un bloque con algo de separación, o acortar el crédito, para que no se lean como 4 líneas seguidas.
3. [28,2 s] "176 de 350" entra en gris claro sobre crema: entrar ya en tinta.
4. [Barras] La etiqueta "MADRID ≈ 188.000" casi toca el eje vertical: 20–30 px más de aire.

## Lo que funciona bien
- Gancho visual y bucle hemiciclo 350 → 400 → 176 de 350; portada limpia.
- Barras con eje en cero y proporción exacta 4,16; neutras, sin colores de partido; unidad "habitantes por diputado" clara.
- Audio en objetivo (-14,1 LUFS, -1,5 dBTP); subtítulos sincronizados; fotos con crédito y sin logos.
- Cierre con la pregunta en pantalla y CTA en plantilla.
