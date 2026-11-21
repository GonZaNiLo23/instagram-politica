# Revisión de guion · 062-alquiler-irav · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: guionista
**Duración estimada:** 29 s (80 palabras, recontadas frase a frase; con los cambios propuestos, 87 palabras ≈ 32 s, dentro del flash)
**Formato:** gancho OK (5/5) · idea única OK (los topes de subida del alquiler) · duración OK

## Comprobación de datos
9 datos comprobados sin incidencias:
- IRAV de octubre 2,57 %, publicado el 13-11-2026; "Los contratos de alquiler firmados con posterioridad al 26 de mayo de 2023 se revisarán en base al IRAV" → INE (ine.es/uc/oC7D0Ncd). Sigue vigente el 22-11 (el de noviembre sale con el IPC definitivo de diciembre).
- IPC de octubre 4,9 % y subyacente 3,1 %, definitivos, 13-11 → INE, IPC1026.htm.
- Definición del IRAV (mínimo entre IPC, subyacente y media ajustada; α = 0,5, β = 2) y cálculo propio 2,55–2,57 → metodología del INE, dic-2024, p. 2.
- Convalidación del RDL 29/2026 el 12-11 → BOE-A-2026-23755 (BOE n.º 283, 13-11), sin tramitación como proyecto de ley.
- 35 a favor y 34 en contra → nota del Congreso del 12-11 (notaId 52634): "por 35 votos a favor y 34 en contra"; no da abstenciones. Coincide con los 69 miembros de la Diputación Permanente.
- RDL 28/2026 derogado el 12-11 → BOE-A-2026-23754 ("acordó derogar").
- Entrada en vigor del RDL 29/2026: 8-10-2026 (DF 11.ª; BOE del 7-10).
- DF 6.ª del RDL 29/2026, literal (BOE-A-2026-20823, offset 370000): título "Limitación extraordinaria de la actualización anual de la renta de los contratos de arrendamiento de vivienda". Ámbito: "La persona arrendataria de un contrato de alquiler de vivienda sujeto a la Ley 29/1994 […] cuya renta deba ser actualizada porque se cumpla la correspondiente anualidad de vigencia dentro del periodo comprendido entre la entrada en vigor de este real decreto-ley y el 31 de diciembre de 2027" "podrá negociar con el arrendador la actualización anual de la renta". a) "En el caso de que la renta sea superior al límite máximo del precio aplicable" [según el sistema de índices de referencia] "no procederá la aplicación de incremento alguno de la renta." b) "En los demás casos, el incremento de la renta será el que resulte del nuevo pacto entre las partes. En ausencia de este nuevo pacto entre las partes, […] no podrá ser superior al dos por ciento." **No distingue por fecha de firma ni cita la Ley 12/2023: cubre todos los contratos de vivienda sujetos a la LAU, también los anteriores a mayo de 2023.** `[VERIFICAR]` resuelto.
- Ejemplo: 800 × 2 % = 16 €; 800 × 2,57 % = 20,56 €.

| Afirmación | Problema | Fuente comprobada | Nota |
|---|---|---|---|
| "Si no acordáis otra cosa, un dos por ciento" | El BOE fija un máximo ("no podrá ser superior al dos por ciento"), no una subida del 2 %. Si el contrato no prevé actualización, no hay subida (art. 18.1 LAU) | DF 6.ª b) | Obligatorio 2 |
| "Hasta finales de 2027 hay otro tope" | No dice a quién se aplica. Tras el bloque "si firmaste después de mayo de 2023", parece que solo afecta a esos contratos, y en realidad cubre todos los de vivienda sujetos a la LAU | DF 6.ª, primer párrafo | Obligatorio 2 |
| "Si firmaste después de mayo de 2023, manda el IRAV" / rótulo "DESDE 26-5-2023" | El INE dice "con posterioridad al 26 de mayo": un contrato del 27 al 31 de mayo no es "después de mayo", y el 26 no está incluido. Además, el IRAV es un tope ("no podrá exceder", art. 18.1 LAU), no el índice que "manda" en todos los casos | INE; LAU art. 18.1 | Obligatorio 1 |

## Obligatorio (bloqueante)
1. [Bloque 2, voz y rótulo] La fecha y la naturaleza de tope → Voz: "Si firmaste desde finales de mayo de dos mil veintitrés, el tope es el IRAV." (14 pal.). Rótulo: **FIRMADO TRAS EL 26-5-2023 → TOPE: IRAV**.
2. [Bloque 3, voz y rótulo] Ámbito y tope máximo de la DF 6.ª → Voz: "Y hasta finales de dos mil veintisiete, para cualquier contrato, otro tope, hoy más bajo. Si no pactáis otra cosa, como mucho un dos por ciento." (15 + 11 pal.). Rótulo: **HASTA 31-12-2027, TODOS LOS CONTRATOS** → **SIN NUEVO PACTO: MÁXIMO 2 %**. En la línea de 36 px, añadir "contratos de vivienda (LAU), firmados en cualquier fecha".
3. [Post] Mismo ámbito y redacción: en "El segundo tope", después de "31 de diciembre de 2027", añadir "a cualquier contrato de vivienda sujeto a la LAU, firmado antes o después de mayo de 2023". "Tras la Ley de Arrendamientos Urbanos, sin pacto expreso…" → "Según la Ley de Arrendamientos Urbanos (art. 18), sin pacto expreso…".

Para mantener el flash en ≤ 88 palabras: bloque 4, "Lo fija un decreto convalidado el doce de noviembre." (9 pal.). Total: 87 palabras ≈ 32 s. Actualiza el recuento y los tiempos por bloque.

## Recomendado (máx. 3)
1. Rótulo del bloque 3, letra a): "si la renta supera el precio de referencia" → "si supera el índice de precios de referencia de su zona: sin subida" (el BOE dice "límite máximo del precio aplicable").
2. Post: "el Ministerio de Vivienda tiene una calculadora (enlazada por el INE)" no se ha comprobado. Compruébalo en la página del IRAV o quítalo.
3. Visual del bloque 3: la barra del 2 % está proporcionada frente a la de 2,57 % y la de 4,9 % (2 / 2,57 ≈ 0,78; 2 / 4,9 ≈ 0,41). Mantenlo así en el render.
