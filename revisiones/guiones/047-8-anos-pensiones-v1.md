# Revisión de guion · 047-8-anos-pensiones · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: guionista
**Duración estimada:** 27 s (75 palabras recontadas; el guion declara 76). Con el texto propuesto abajo: 24 s (66 palabras).
**Formato:** gancho no (0/5 por Verdad) · idea única OK · duración OK

## Comprobación de datos
14 cifras sin incidencias. API de Eurostat gov_10a_exp (S13, GF1002, TE, PC_GDP; actualizada el 2026-10-21, consultada el 2026-11-13): España 2018–2024 = 9,3 / 9,5 / 10,9 / 10,5 / 10,0 / 10,2 / 10,4 (p); UE-27 = 10,3 / 10,4 / 11,2 / 10,6 / 10,3 / 10,4 / 10,6. Solo la "p" de España 2024; no hay "b" ni "e". 2025 sin dato. Cálculos: +1,1 puntos; brecha de 1,0 → 0,2, correctos.

| Afirmación | Problema | Fuente comprobada | Nota |
|---|---|---|---|
| "2018 es el valor más bajo de la serie" (voz, rótulo y post) | Falso tal como suena: 2015, 2016 y 2017 = 9,1 (España). Solo es el mínimo de una ventana que empieza en 2018, y eso no aporta nada. 2018 no es un valle elegido a dedo, así que no hace falta el aviso | Misma API con sinceTimePeriod=2015 | Se quita (obligatorio 3) |
| "incluidas las pensiones" / título "(pensiones)" | COFOG 10.2 Vejez = pensiones de jubilación (incluidas las anticipadas y parciales), "care allowances" y prestaciones en especie (alojamiento, ayuda a domicilio). Las pensiones de **viudedad y orfandad** están en 10.3 Supervivencia ("survivors' pensions"), y la jubilación por incapacidad, en 10.1.2. "Las pensiones" a secas sugiere todas | Notas de la ONU, COFOG 10.2.0 y 10.3.0 (unstats.un.org/unsd/classifications/Econ/Structure/Detail/EN/4/10_2_0 y …/10_3_0) | Obligatorio 2. Resuelve el [VERIFICAR] |
| Gancho "Diez coma cuatro euros de cada cien" | Sin decir "de lo que produce el país", suena a "de cada 100 € de gasto público", que sería ≈ 23 €. El "% del PIB" solo sale en un rótulo y la voz no lo dice hasta el segundo 6 | — | Obligatorio 1 |
| "Europa está en diez coma seis" | Es la UE-27 y el dato de 2024: "Europa" es inexacto | API | Va en el texto propuesto |

## Obligatorio (bloqueante)
1. **[Gancho, Verdad = 0]** Puntuación del elegido: Tú 0 · Choque 0 (10,4 sin referencia no sorprende) · Bucle 1 · Breve 1 · Verdad 0 (matiz escondido: ¿100 € de qué?) → **0/5**. Cámbialo por la alternativa A (abajo) y sustituye el **texto de voz limpio entero** por este (66 palabras ≈ 24 s):
   > ¿España gasta en vejez más que la UE? No. Sobre el PIB, casi igual. Cuenta jubilaciones y cuidados a mayores; no viudedad. En dos mil dieciocho, España, nueve coma tres; la UE, diez coma tres. En dos mil veinticuatro, diez coma cuatro frente a diez coma seis. El dato español de dos mil veinticuatro es provisional. ¿Quién debería pagarlo: impuestos o cotizaciones? Síguenos para estar informado.

   Tabla de bloques (la voz, igual que el texto limpio):
   | # | Tiempo | Voz | En pantalla | Visual |
   |---|---|---|---|---|
   | 1 · Gancho | 0–5 s | ¿España gasta en vejez más que la UE? No. Sobre el PIB, casi igual. | F1: "ESPAÑA 10,4 % · UE 10,6 %" · "GASTO PÚBLICO EN VEJEZ · % DEL PIB · 2024" · "CIFRA 8 · 8 años en cifras" | Dos barras (España/UE) casi iguales desde el fotograma 0 |
   | 2 · Qué es | 5–8 s | Cuenta jubilaciones y cuidados a mayores; no viudedad. | "EUROSTAT · COFOG 10.2 VEJEZ" · "SIN VIUDEDAD NI INCAPACIDAD" | Ficha de fuente; "PIB = lo que produce el país en un año" |
   | 3 · Antes y ahora | 8–18 s | En dos mil dieciocho, España, nueve coma tres; la UE, diez coma tres. En dos mil veinticuatro, diez coma cuatro frente a diez coma seis. | "2018: 9,3 % · UE 10,3 %" → "2024: 10,4 % · UE 10,6 %" · "DISTANCIA: 1,0 → 0,2 PUNTOS (cálculo propio)" | Dos líneas 2018–2024; la brecha se estrecha |
   | 4 · Aviso | 18–21 s | El dato español de dos mil veinticuatro es provisional. | "ESPAÑA 2024: PROVISIONAL" | Punto 2024 con la "p" |
   | 5 · Cierre | 21–24 s | ¿Quién debería pagarlo: impuestos o cotizaciones? Síguenos para estar informado. | "¿IMPUESTOS O COTIZACIONES?" · "Cifra 9 la próxima semana" | Botones A/B; tarjeta de serie |

2. **[Definición: voz, rótulo y post]** "incluidas las pensiones" → "Cuenta jubilaciones y cuidados a mayores; no viudedad." (ya en el texto de arriba). En el post, sustituye "Gasto público en vejez (incluidas las pensiones):" por: "Gasto público en vejez (COFOG 10.2: pensiones de jubilación y cuidados a mayores; las de viudedad y orfandad y las de incapacidad van en otras partidas):". Título interno: "gasto público en vejez (jubilación)".
3. **[Aviso de mínimo: bloque 4, rótulo y post]** Quita "Ojo: dos mil dieciocho es el valor más bajo de la serie", el rótulo "2018: MÍNIMO DE LA SERIE 2018–2024" y, en el post, "2018 es el valor más bajo de la serie 2018–2024." En el post, pon en su lugar: "En 2015–2017 fue del 9,1 %." En el bloque "Cifras verificadas", corrige la nota en el mismo sentido.
4. **[Post, frase de causas]** "Eurostat no explica las causas." → "Esta estadística no desglosa las causas." (no se ha comprobado que Eurostat no las comente en ninguna publicación).
5. **[Portada]** "GASTO EN VEJEZ 10,4 % DEL PIB" + "2018: 9,3 % · UE 2024: 10,6 %" → "VEJEZ: ESPAÑA 10,4 % · UE 10,6 %" + "% DEL PIB · 2024 (ESPAÑA, PROVISIONAL)".

## Gancho
- Actual (0/5): "Diez coma cuatro euros de cada cien. Van a la vejez. ¿Y en 2018?"
- **Alternativa A (elegida, 4/5: Choque, Bucle, Breve, Verdad):** "¿España gasta en vejez más que la UE? No. Sobre el PIB, casi igual." (frase 1 = 8 palabras; el gancho, 14; el matiz "sobre el PIB" va en la voz porque, en euros por habitante, la distancia es mucho mayor).
- Alternativa B (4/5): "España ya casi iguala a la UE. En gasto en vejez, sobre el PIB."
- Lista de 5 ganchos: actualízala con A y B en las posiciones 1 y 2.

## Recomendado
1. Hashtags: añade #jubilación junto a #pensiones.
2. En la tabla de fuentes, añade la fila "Definición COFOG 10.2/10.3 · nivel 1 · ONU, notas explicativas COFOG · consultada el 2026-11-13".
