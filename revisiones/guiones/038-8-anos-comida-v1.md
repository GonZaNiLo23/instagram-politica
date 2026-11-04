# Revisión de guion · 038-8-anos-comida · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: guionista
**Duración estimada:** 42 s (116 palabras, recontadas frase a frase: cuadra); con los cambios, ≈ 44 s (121 palabras), dentro del flash de serie (35–45 s, como la 030)
**Formato:** gancho OK (5/5) · idea única OK · duración OK

## Comprobación de datos
Comprobados 9 datos sin incidencias:
- IPCA de la comida (CP01), España: 2018 = 71,78 (base 2025 = 100), o sea, +39,3 %. Zona euro: 73,55, +36,0 %. Fuente: Eurostat prc_hicp_ainr (actualizada el 17-9-2026).
- IPCA general (TOTAL), España: 2018 = 81,69, +22,4 %. Zona euro: 80,44, +24,3 %. Misma tabla. **Queda resuelto el [VERIFICAR] de la general:** coincide con lo que leyó el guionista en la tabla antigua. La zona euro (EA) es la composición cambiante, encadenada (EA20 en 2023 y EA21 en 2026).
- ETCL13724 ("Coste salarial total por trabajador", no ajustada, en euros). Los 8 trimestres coinciden con la tabla del guion. Medias: 1.919,42 € y 2.376,55 €; cociente 1,238, +23,8 %, que se redondea a 24. Fuente: servicios.ine.es/wstempus.
- Cálculo en términos reales: frente a los precios, +1,2 %; frente a la comida, −11 %. Cuadra.
- La rebaja del IVA la "inició [el Gobierno] con la llegada de 2023", según la nota de Hacienda del 25-6-2024 (p. 2). Allí se explica como "respuesta al incremento sobrevenido de la inflación por las consecuencias de la invasión rusa en Ucrania" (p. 3) y se fija la reversión: del 1-10 al 31-12-2024, al 2 % y al 7,5 %.
- Ganchos: hay 5 puntuados. El elegido saca 5/5: la frase 1 tiene 8 palabras (≈ 2,9 s), el periodo va en el fotograma 1 y del segundo 4 al 7 aparece la primera prueba (+22 %). Equidad: bien. Se dice lo que favorece al Gobierno (el sueldo sube más que los precios y la zona euro sube casi igual) y su motivo va atribuido.

| Afirmación | Problema | Fuente comprobada | Nota |
|---|---|---|---|
| "El Gobierno rebajó el IVA de los alimentos básicos desde 2023" (voz, rótulo y post) | "Desde" da a entender que la rebaja sigue vigente y que el dato de 2025 la incluye. Pero acabó el 31-12-2024: el 1-1-2025 los alimentos básicos volvieron al 4 % y la pasta y los aceites de semillas, al 10 %. Solo el aceite de oliva se queda al 4 % de forma fija. La medida no estaba en vigor en el año final del dato (regla 13) | Hacienda 25-6-2024, p. 2–3; EFE 1-1-2025 en elDiario.es ("Los alimentos básicos recuperan su IVA y el aceite de oliva entra en el club del 4 %"); OCU | Bloqueante |
| "Hacienda lo presentó como respuesta a la guerra de Ucrania" | La nota no habla de la guerra a secas: dice "respuesta al incremento sobrevenido de la inflación por las consecuencias de la invasión rusa" | Hacienda 25-6-2024, p. 3 | Hay que ajustar el motivo, tal como lo formula Hacienda (regla 9) |
| Portada "+24 %" sin nombre | Regla 14: si la variable tiene varias medidas, el nombre exacto va también en la portada | — | Bloqueante, por la regla activa |
| Fuentes, filas 1–3, y post: "prc_hicp_aind" | Eurostat retiró esa tabla. La URL de prc_hicp_ainr que trae el guion lleva `coicop18=CP00`, que no existe (el código es TOTAL) | prc_hicp_ainr | Corregir la tabla de fuentes y el post |
| Imagen 1 (carros, Commons) | La he mirado. Es un supermercado tailandés de noche, con rótulos en tailandés y en grande, varios coches y un aparcamiento. Los carros ocupan solo la esquina inferior derecha (x ≥ 380, y ≥ 395 sobre 960×639), en horizontal, y no dan para un recorte vertical limpio | Miniatura de 960 px | Se descarta: queda el plan B |

## Obligatorio (bloqueante)
1. **[Bloque 5, voz]** Cambiar "El Gobierno rebajó el IVA de los alimentos básicos desde dos mil veintitrés. Hacienda lo presentó como respuesta a la guerra de Ucrania." por **"En dos mil veintitrés y veinticuatro, el Gobierno rebajó el IVA de los alimentos básicos. Hacienda la presentó como respuesta a la inflación por la guerra de Ucrania."** (15 + 13 palabras; el total queda en 121).
   - **Rótulo:** "IVA DE ALIMENTOS BÁSICOS: REBAJA 2023–2024". Debajo, en pequeño: "En 2025, vuelta al 4 % (aceite de oliva: 4 % fijo)" · "SEGÚN HACIENDA (25-6-2024): respuesta a la inflación por la invasión de Ucrania".
   - **Visual:** la etiqueta "0 % / 5 %" baja en 2023 y **vuelve a subir** a "4 % / 10 %" en 2025.
   - **Post:** "El Gobierno rebajó el IVA de los alimentos básicos en 2023 y 2024 (del 4 % al 0 %; aceites y pastas, al 5 %). En 2025 volvió a los tipos normales, salvo el aceite de oliva, que se queda al 4 %. Hacienda presentó la rebaja como respuesta a la inflación por la invasión rusa de Ucrania (nota del 25-6-2024)."
2. **[Portada]** Poner nombre a la segunda cifra: "COMIDA +39 % · COSTE SALARIAL +24 % · 2018 → 2025". La pregunta "¿Y TU SUELDO?" puede quedarse como antetítulo.
3. **[Fuentes y post]**
   - Filas 1–3: sustituir por prc_hicp_ainr (`?format=JSON&geo=ES&geo=EA&time=2018&time=2025`). Valores de 2018 con base 2025 = 100: TOTAL ES 81,69 · EA 80,44; CP01 ES 71,78 · EA 73,55.
   - Post: "Fuentes: Eurostat (prc_hicp_ainr), INE (ETCL, serie ETCL13724), Ministerio de Hacienda (25-6-2024)".
   - Quitar del post la línea "Imagen de archivo… PattayaPatrol" y, del bloque 5, el carro (imagen descartada): solo la etiqueta vectorial y el logotipo de Hacienda.

## Recomendado (máx. 3)
1. Primera línea del post: "La comida cuesta un 39 % más que en 2018" → "En 2025, la comida costó un 39 % más que en 2018". El dato es la media de 2025, no lo de hoy (regla 13).
2. Por la regla 14 (033): si el coordinador puede abrir mites.gob.es (o los informes de CCOO con la tabla del Ministerio), añade al post la subida pactada en convenio 2018–2025. Una estimación sin verificar la sitúa cerca del +20 %, por debajo de los precios, y eso cambiaría "más que los precios". Si no se puede verificar, no se pone nada.
3. Bloque 3: la etiqueta "Cálculo propio con datos oficiales" va bien. Aplícala también al bloque 1, porque el +39 % es igualmente un cociente propio.
