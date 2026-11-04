# Revisión de guion · 037-hipoteca-variable · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: guionista
**Duración estimada:** 31 s (85 palabras; 86 con el cambio 2)
**Formato:** gancho OK (5/5) · idea única OK · duración OK (flash ≤ 88)

## Comprobación de datos
Cuatro datos comprobados sin incidencias:
- Euríbor a 12 meses en octubre de 2026 = 3,239 %, nota del 3-11-2026 → BdE (bde.es, euribor-octubre-2026). La versión inglesa dice "1.052 basis points" y el PDF en español, "puntos". Es un error de traducción: 3,239 − 2,187 = 1,052 puntos porcentuales.
- Euríbor a 12 meses en octubre de 2025 = 2,187 %, nota del 3-11-2025 → BdE.
- Cuotas recalculadas con amortización francesa, 300 cuotas y 150.000 € (a mano, con ln/exp a 6 cifras; en esta sesión no había ejecución de node): con un 2,937 %, 706,40–706,41 €; con un 3,989 %, 790,84 €. Diferencia: 84,43 €/mes, 1.013 €/año. Coincide con el guion.
- Vigencia: hoy (4-11) es el último dato publicado. El de noviembre sale a primeros de diciembre.
- [VERIFICAR] "media mensual": se resuelve sin cambios. La nota no usa "media" y el guion tampoco la dice. Se queda como está.

| Afirmación | Problema | Fuente comprobada | Nota |
|---|---|---|---|
| Contador "706 € → 791 €" + "+84 €" (gancho, 3b y post) | Con los redondeos que se ven, 791 − 706 = 85, no 84 | Cálculo propio: 790,84 − 706,41 = 84,43 | Es incoherente en pantalla y provocará comentarios de "error" |
| Giro "84 € × 12 = más de 1.000 €/año" con el contador en "1.013 €" | 84 × 12 = 1.008, no 1.013 | 84,43 × 12 = 1.013,2 | Misma causa: se mezclan cifras redondeadas y con decimales |

## Obligatorio (bloqueante)
1. **[1 gancho, 3b, visual y post] Cuadrar los redondeos (regla 14).** El contador y el rótulo con decimales: "706,41 € → 790,84 €" y "+84,43 €". El fotograma 1 puede seguir con "+84 € al mes" (con "unos" en la voz).
   Voz 3b: "La cuota pasa de setecientos seis a setecientos noventa y uno." → **"La cuota pasa de setecientos seis a casi setecientos noventa y uno."** (12 pal.; total 86, unos 31,3 s)
   Post: "la cuota sale en 706 € al mes… sale en 791 €. Son unos 84 € más al mes" → **"la cuota sale en 706,41 € al mes… sale en 790,84 €. Son 84,43 € más al mes"**
2. **[4 giro] Rótulo:** "84 € × 12 = más de 1.000 €/año" → **"84,43 € × 12 = 1.013 €/año"**, con "Cálculo propio". El contador acaba en "1.013 €" y la voz se queda igual ("más de mil euros").
3. **[Imágenes, fila 1] Llaves:** quita la alternativa "llaves vectoriales genéricas". La regla 24 dice que un objeto real no se dibuja: o foto de Commons recortada, con licencia verificada y mirando la imagen, o se quitan las llaves (el contador basta). El crédito del post ("[autor, licencia: pendiente]") tiene que quedar completo antes del render.

## Recomendado (máx. 3)
1. [4b matiz] "Tu cuota cambia cuando toca revisar, no cada mes." → "Tu cuota solo cambia cuando toca revisar." (7 pal.; ahorra 2). La revisión mensual existe, aunque es rara, y la frase pasa a ser cierta para cualquier contrato.
2. [2b y 3] Logotipo del Banco de España: es mejor poner solo el texto "Fuente: Banco de España", porque el logo puede parecer un aval de la institución a nuestro cálculo.
3. [Gancho] Breve: la frase 1 dura unos 3,6 s, algo más de los 3 s. Lo compensa el "+84 € al mes" del fotograma 1. Si se ajusta el tempo, quita los puntos suspensivos largos.

Línea editorial y riesgo legal: sin incidencias. La pieza es informativa y no tiene bloque de opinión. El cierre "fija o variable" es una elección personal y no recomienda nada. No salen personas.
