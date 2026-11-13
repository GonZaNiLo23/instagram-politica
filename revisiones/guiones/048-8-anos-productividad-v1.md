# Revisión de guion · 048-8-anos-productividad · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: guionista (cambios literales y cerrados; no hace falta otra vuelta de investigación)
**Duración estimada:** ≈ 31 s (85 palabras con los cambios; 87 en la v1, recuento comprobado)
**Formato:** gancho no (3/5) · idea única OK · duración OK

## Comprobación de datos
Comprobados sin incidencias (API de Eurostat, nama_10_lp_ulc, RLPR_HW, I15, actualizada el 11-11-2026, consultada el 13-11-2026):
- España 2018 = 101,023 → 2025 = 103,250 (p) → +2,20 % ✔ · UE-27 103,002 → 107,415 → +4,28 % ✔ · mínimo desde 2018 = 2021 (100,784) ✔ · 2018 no es un mínimo ni un máximo ✔.
- **Rotura de serie y base (resuelve el [VERIFICAR]):** ninguna observación de ES ni de EU27_2020 lleva la marca "b" entre 1995 y 2025; solo hay "p" en ES 2024 y 2025. Los metadatos ESMS (nama10_esms, apdo. 15.2) no señalan ninguna rotura. La revisión estadística de 2024 (apdo. 17.2) se aplicó a toda la serie hacia atrás, así que es homogénea. La base (2015 = 100) no afecta a las variaciones porque es un cociente de volúmenes encadenados. **Sin rotura.**
- "Ya sin inflación" = productividad real (volúmenes encadenados / horas) ✔.

| Afirmación | Problema | Fuente comprobada | Nota |
|---|---|---|---|
| "El de 2025 […] es el más alto desde 2015" (voz, rótulo "MÁXIMO DESDE 2015", post) | Sugiere que en 2015 o antes hubo un valor igual o más alto, y no es así: 2015 = 100. En realidad, 2025 (103,250) es el máximo de toda la serie de España, que empieza en 1995 (87,073). | API de Eurostat, geo=ES, sinceTimePeriod=1995 | Hay que corregirlo: tal como está redactado, es inexacto. |
| Gancho "Cada hora trabajada: dos coma dos por ciento más" | La voz no dice "más que cuándo": suena a una subida anual o reciente. El periodo de 7 años solo aparece en el rótulo. | ídem | Verdad dudosa: ver el apartado Gancho. |

## Obligatorio (bloqueante)
Cambios literales y cerrados (aplícalos en la tabla de bloques, el texto limpio, la tabla de ganchos y el post; regla 31):
1. **[Bloque 1 · voz]** "Cada hora trabajada: dos coma dos por ciento más. ¿Y en Europa?" → **"Siete años: cada hora, dos coma dos más. ¿Y Europa?"** (8 + 3 = 11 palabras). El rótulo no cambia.
2. **[Bloque 4 · voz]** "El de dos mil veinticinco, aún provisional, es el más alto desde dos mil quince." → **"El de dos mil veinticinco, aún provisional, es el más alto de la serie."** (14 palabras).
3. **[Bloque 4 · rótulo]** "MÁXIMO DESDE 2015" → **"MÁXIMO DE LA SERIE (1995–2025)"**.
4. **[Post]** "el valor más alto desde 2015" → **"el valor más alto de la serie, que empieza en 1995"**. Añade al final del segundo párrafo: **"Sin rotura de serie entre 2018 y 2025."**
5. **[Idea en una frase, Equilibrio y Fuentes]** "más alta desde 2015" / "máximo 2015–2025" → "máximo de la serie (1995–2025)". En la fila 1 de fuentes, añade "ES 1995 = 87,073 (inicio de la serie)". Quita el [VERIFICAR] de la rotura y pon: "Sin marca 'b' en 1995–2025 (API) ni rotura en el ESMS nama10, apdo. 15.2; consultado el 13-11-2026".
6. **[Cabecera]** Palabras: 85. Recuento: 8 + 3 + 13 + 15 + 1 + 14 + 10 + 12 + 5 + 4 = 85. Duración ≈ 31 s.

## Gancho
- Actual: Tú 0 ("cada hora" es una media nacional, el mismo motivo por el que se descarta el gancho 2) · Choque 1 · Bucle 1 · Breve 0 (frase 1 = 9 palabras) · Verdad dudosa (falta el periodo) → **3/5 como mucho**.
- **Alternativa A (la elegida en el obligatorio 1):** "Siete años: cada hora, dos coma dos más. ¿Y Europa?" → Tú 0 · Choque 1 · Bucle 1 · Breve 1 (8/11) · Verdad 1 = **4/5**.
- Alternativa B: "Siete años después, ¿cuánto más rinde una hora? Dos coma dos. ¿Y Europa?" → Tú 0 · Choque 1 · Bucle 1 · Breve 1 (8/14) · Verdad 1 = **4/5**.
- En la tabla de ganchos, el 3 y el 5 tienen el mismo fallo de Verdad (sin periodo): corrige su puntuación o añade "en siete años".

## Recomendado (máx. 3)
1. El cierre "¿Más empleo o más productividad?" plantea un dilema (efecto composición) que la pieza decide no tratar por falta de fuente. Mejor: **"¿Lo notas en tu trabajo?"** (A/B: sí / no), que es concreta y no da por hecha ninguna causa.
2. En el rótulo del bloque 3 o en el post, di que 2024 también es provisional (Eurostat lo marca así en España) para que nadie lo compare con un dato cerrado.
