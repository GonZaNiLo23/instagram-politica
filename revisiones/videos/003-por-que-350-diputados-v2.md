# Revisión de vídeo · 003-por-que-350-diputados · vuelta 2
**Veredicto:** CAMBIOS  →  vuelve a: generador-video (dos retoques menores)
**Técnica:** 1080×1920 · 30 fps · H.264 + AAC · 32,1 s · -14,1 LUFS · pico real -1,5 dBTP (sin cambios respecto a v1)
**Test de formato Reel/TikTok:** 9/10 (criterio flojo: 5, una idea/claridad sin sonido del tramo "248 por población", por la lluvia ilegible)

## Lista cerrada de v1: resultado
1. **Sello DATO — PARCIAL (no cumple el rebote).** Medido en fotogramas a 15 fps (23,6–24,6 s, con cuadrícula de 24 px):
   - Posición final: borde superior en y ≈ 647, x ≈ 484–916 (centro ≈ 700). Correcto, x ≤ 960 siempre (máx. ≈ 918).
   - No toca la etiqueta "MADRID ≈ 188.000" en ningún fotograma: hueco mínimo ≈ 20 px entre la sombra del sello (y ≈ 864) y la parte alta de las cifras (y ≈ 884). La cifra se lee siempre.
   - Rebote: el sello llega a y ≈ +16 px por debajo de su posición final y rebota ≈ 43 px POR ENCIMA de ella (borde superior en ≈ 3 frente a ≈ 38 de reposo en la rejilla; ≈ 59 px de oscilación total) y se asienta en ≈ 0,5 s. Supera el límite pedido de ≤ 24 px, aunque `escenas.json` declara `reboteMax: 24` (el muelle no lo respeta, o el tope solo afecta a una de las direcciones). Corrección: recortar el overshoot del sello (más amortiguación o limitar |desplazamiento| ≤ 24 px respecto a y = 650). Componente `sello`.
2. **Foto F1 — CORRECTA.** x 150–930 (medido en 6 s, con zona segura derecha superpuesta). Crédito y fuente dentro de zona segura (acaban en y ≈ 1490).
3. **Hitos de línea de tiempo — CORRECTOS.** Texto ≈ 64 px (interlínea ≈ 78 px), literales del guion ("1977 · Ley para la Reforma Política", "1978 · Constitución", "1985 · LOREG: se mantiene"), en 2–3 líneas, columna derecha. Solo hay un rótulo a la vez (el siguiente entra en fundido cuando el anterior ya salió). Lectura: 1977 ≈ 3,5 s; 1978 ≈ 1,0–1,5 s (2 palabras); 1985 ≈ 1,0 s (3 palabras): al límite de la regla de 1 s por 3 palabras, aceptable. Los rótulos "1977: 350 / 1978: 300–400 / 1985: 350" siguen visibles.
4. **Lluvia de 248 puntos — INSUFICIENTE (no bloqueante).** Ahora cae sobre las casillas y se acumula en el borde inferior izquierdo (mejor que en v1; matices de densidad visibles en el fotograma a 17,2 s). Pero los puntos son muy pequeños (≈ 8–10 px) y de color mostaza pálido sobre crema, y el resultado final (puntos minúsculos en las esquinas de las casillas) no se lee en el móvil ni sin sonido como "más población, más escaños". La suma 102 + 248 = 350 se mantiene en datos (50 × 2 + 2 = 102, 248 puntos) pero no se ve en pantalla. Corrección: puntos de ≥ 20 px, tinta o turquesa con contraste, y que cada casilla muestre su acumulado (p. ej. rellenar la casilla en proporción) o, si no cabe, al menos el contraste y el tamaño.
5. **Etiqueta de Madrid — CORRECTA en zona segura.** Llega a x ≈ 944 (< 960); el margen de 16 px es justo pero dentro. Aviso: la barra de Madrid acaba en x ≈ 960 y toca el límite de la zona segura; el aire con el borde es nulo. Recomendado reducir la escala de las barras ≈ 30 px. "176 de 350" entra ya en tinta (visto en 28,6 s); correcto.

## Obligatorio (bloqueante)
Ninguno nuevo. Cifras, rótulos y gráficos coinciden con el guion aprobado (Soria 45.000 / Madrid 188.000, eje en cero).

## Formato Reel/TikTok
1. [14,9–18,2 s] Tramo de la lluvia: ver punto 4; es lo que impide el 10/10.
2. Ritmo (control de regresión): ningún tramo > 1,5 s sin cambio de escena (comprobado con detección de escenas a 0,2); sin huecos nuevos. Gancho "¿400 DIPUTADOS?" + contador 350 → 400 intacto en los segundos 0–3. Hoja de contactos sin regresiones: bucle del cierre con "400" → "176 de 350", CTA mostaza, créditos de foto presentes.

## Recomendado
1. [24–25 s] Dejar que la etiqueta de Madrid y el sello respiren: bajar la oscilación del sello también reduce el roce con la etiqueta.
2. [Barras] Reducir 30 px el largo máximo de la barra de Madrid (hoy llega a x ≈ 960).

## Lo que funciona bien
- Fotos y créditos ya dentro de zona segura; F1 limpia; hitos legibles a 64 px y con texto literal.
- Etiquetas de barras legibles, "176 de 350" en tinta, hemiciclo de cierre coherente (176 sobre 350).
- Audio en objetivo; duración 32,1 s.

## Feedback a trabajadores
No se ha escrito: el rebote del sello es un caso puntual (si reaparece en v3, añadir regla en `feedback/generador-video.md`: "los parámetros `reboteMax`/límites del guion deben respetarse medidos en el render, no solo declarados").
