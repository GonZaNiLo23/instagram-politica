# 042 · 8 años en cifras · Cifra 3: la presión fiscal

| Campo | Valor |
|---|---|
| Pilar | 💶 Economía (serie "8 años en cifras", episodio 3, "Cifra 3") |
| Formato | Flash serie (35–45 s) |
| Duración objetivo | ≈ 41 s (110 palabras ÷ 165 × 60 = 40,0 s) |
| Palabras de voz | 110, contadas en el "Texto de voz limpio" con las cifras leídas en letra. Frase más larga: 15 |
| Vigencia | ATEMPORAL (Eurostat actualiza esta serie cada octubre: la próxima, en octubre de 2027) |
| Portada | "IMPUESTOS 38,1 % DEL PIB" + "2018: 35,2 % · UE 40,7 %" (38,1 mostaza grande) dentro del recorte 4:5 |
| Versión | v1 |
| Estado | borrador; 2018 verificado el 2026-11-12 en gov_10a_taxag (ES 35,2; UE 41,1; 2025: 38,1 y 40,7) |

## Idea en una frase
Impuestos y cotizaciones sociales pesan en España un 38,1 % del PIB en 2025 (Eurostat, datos de octubre de 2026), 0,9 puntos más que en 2024 y por encima de 2018; la media de la UE, un 40,7 %, queda 2,6 puntos por encima de España. La cifra mide recaudación sobre el PIB, no lo que paga cada persona, y no toda es del Gobierno central.

## Aviso para el coordinador (leer antes de producir)
La propuesta del 28-10 ("España sube 2 puntos, la UE baja casi 1") usa la versión de Eurostat de antes del 29-10-2026. La nueva (Eurostat, 29-10-2026, con el PIB de la notificación de septiembre) cambia el panorama: en su gráfico, la UE en 2018 está 41,1 % y en 2025 en 40,7 %, es decir, **una bajada de unas 0,3–0,4 décimas, no de casi 1 punto**, y España pasa a 38,1 % en 2025. El titular del encargo ya no sirve tal cual. Esta versión no lo usa: dice solo las cifras que pueden leerse. La API de Eurostat devolvió el bloqueo "sorry.ec.europa.eu" en toda la sesión (también con prc_hpi_a, que sí abría por la mañana), así que **no pude leer España 2018 ni UE 2018 en la versión vigente**. Hay que abrir `gov_10a_taxag` (geo ES y EU27_2020, unit PC_GDP, sector S13_S212, na_item D2_D5_D91_D61_M_D995, años 2018 y 2025) y sustituir los dos valores marcados.

## Guion por bloques
Tiempos a 2,75 palabras/s (165 pal/min). Hilo de retención: "¿Y en 2018?" se resuelve en el segundo 5; la brecha con la UE, en el 17.

| # | Tiempo | Voz en off | En pantalla (rótulo) | Visual / animación |
|---|---|---|---|---|
| 1 · Gancho (13 pal.) | 0–4,7 s | Impuestos: treinta y ocho coma uno del PIB. ¿Y en dos mil dieciocho? | Fotograma 1: "IMPUESTOS 38,1 % DEL PIB" (110–140 px) · debajo "impuestos y cotizaciones · 2025 · Eurostat" · pequeño "CIFRA 3 · 8 años en cifras" | Fotograma 1: una columna de tinta sube desde 0 con contador "38,1 %"; al final entra "?" mostaza y el rótulo "¿2018?". |
| 2 · Primera prueba (5 pal.) | 4,7–6,5 s | Treinta y cinco coma dos. | "2018: 35,2 %" | Una segunda columna (más baja) aparece a la izquierda con "2018"; sello "DATO". |
| 3 · De dónde sale (9 pal.) | 6,5–9,8 s | Eso mide Eurostat: impuestos y cotizaciones sobre el PIB. | "EUROSTAT · impuestos + cotizaciones sociales · % del PIB" · "Datos de 29-10-2026" | Ficha de fuente con el logotipo de Eurostat (institucional); bajo ella las dos columnas con sus cifras. |
| 4 · La UE (12 pal.) | 9,8–14,2 s | La media europea pasó del cuarenta y uno al cuarenta coma siete. | "UE: 41,1 % → 40,7 %" · "2018 → 2025" | Dos líneas: España sube, UE casi plana; la UE por encima. |
| 5 · La brecha (10 pal.) | 14,2–17,8 s | La brecha con Europa sigue ahí: dos coma seis puntos. | "BRECHA CON LA UE: 2,6 PUNTOS (2025)" · "40,7 − 38,1 · cálculo propio" | Flecha entre las dos líneas con "2,6". |
| 6 · Último año (15 pal.) | 17,8–23,3 s | En un año, de treinta y siete coma dos a treinta y ocho coma uno. | "2024: 37,2 % → 2025: 38,1 %" · "Eurostat" | La línea de España gana un tramo final; globo "+0,9 PUNTOS". |
| 7 · Contexto UE (10 pal.) | 23,3–26,9 s | Eurostat la cuenta entre las mayores subidas de la UE. | "ENTRE LAS MAYORES SUBIDAS DE LA UE EN 2025" · "Alemania, Malta, España, Francia" | Cuatro barras pequeñas (sin colores de partido), la de España resaltada. |
| 8 · Lo que no mide (13 pal.) | 26,9–31,6 s | Ojo: esto mide el peso sobre el PIB, no lo que pagas tú. | "NO ES LO QUE PAGAS TÚ" · "Mide recaudación total sobre el PIB" | La columna se divide en figuras pequeñas de distinta altura; sello "NO MIDE". |
| 9 · Quién recauda (14 pal.) | 31,6–36,7 s | El Estado central recauda el cuarenta y dos coma siete; el resto, otras administraciones. | "ESTADO CENTRAL: 42,7 % DEL TOTAL (2025)" · "RESTO: COMUNIDADES, AYUNTAMIENTOS, SEGURIDAD SOCIAL" | Gráfico de una barra apilada: 42,7 % central; 16,6 % comunidades; el resto, locales y Seguridad Social, sin colores de partido. |
| 10 · Cierre (9 pal.) | 36,7–40,0 s | ¿Menos impuestos o más servicios? Síguenos para estar informado. | "¿MENOS IMPUESTOS O MÁS SERVICIOS?" · "Síguenos" | Dos botones A/B sobre las columnas del gancho. Tarjeta de cierre de la serie ("Cifra 4 la próxima semana", "Fuentes en la descripción", logo). |

## Ganchos alternativos (5, de familias distintas; ver estilo/ganchos-y-temas.md)
| # | Familia | Voz (frase 1 ≤ 8 pal.; total ≤ 14) | Texto del fotograma 1 | Tú | Choque | Bucle | Breve | Verdad | Total |
|---|---|---|---|---|---|---|---|---|---|
| 1 (elegido) | Tu bolsillo + pregunta | "Impuestos: treinta y ocho coma uno del PIB. ¿Y en dos mil dieciocho?" (8 + 5 = 13) | "IMPUESTOS 38,1 % DEL PIB" | 1 | 0 | 1 | 1 | 1 | 4 (el Choque depende de que 2018 se confirme) |
| 2 | Pregunta incómoda | "¿Cuánto pesan tus impuestos en el PIB? Treinta y ocho coma uno." (11) | "38,1 % DEL PIB" | 1 | 0 | 1 | 1 | 1 | 4 |
| 3 | Lo que crees que sabes | "¿Más impuestos que Europa? Dos coma seis puntos menos." (9) | "ESPAÑA 38,1 % · UE 40,7 %" | 0 | 1 | 1 | 1 | 1 | 4 |
| 4 | Contradicción | "España recauda más que hace siete años. Y aun así, menos que Europa." (12) | "MÁS QUE EN 2018 · MENOS QUE LA UE" | 0 | 1 | 1 | 1 | 0 hasta cerrar 2018 | 0 |
| 5 | Escena en presente | "Un año: casi un punto más del PIB en impuestos." (10) | "+0,9 PUNTOS EN UN AÑO" | 1 | 1 | 0 | 1 | 1 | 4 |
(Elegido: el 1, 4/5 con la rúbrica estricta; el 5 empata y es el plan B porque **solo usa cifras ya verificadas** (37,2 → 38,1, Eurostat 29-10-2026): si no se puede cerrar el 2018, rehacer el guion sobre el último año y la brecha con la UE.)

## Texto de voz limpio
Impuestos: treinta y ocho coma uno del PIB. ¿Y en dos mil dieciocho? Treinta y cinco coma dos. Eso mide Eurostat: impuestos y cotizaciones sobre el PIB. La media europea pasó del cuarenta y uno al cuarenta coma siete. La brecha con Europa sigue ahí: dos coma seis puntos. En un año, de treinta y siete coma dos a treinta y ocho coma uno. Eurostat la cuenta entre las mayores subidas de la UE. Ojo: esto mide el peso sobre el PIB, no lo que pagas tú. El Estado central recauda el cuarenta y dos coma siete; el resto, otras administraciones. ¿Menos impuestos o más servicios? Síguenos para estar informado.

Recuento por frase: 8 + 5 + 5 + 9 + 12 + 10 + 15 + 10 + 13 + 14 + 5 + 4 = 110 palabras (el gancho cuenta 8 + 5 = 13). Frase más larga: 15. Pregunta A/B: sí (menos impuestos o más servicios; bucle con "Impuestos" del gancho).

## Autoevaluación de formato Reel/TikTok
8/10 (provisional, sujeta al 1). Cumple: cifra en voz y en el fotograma 1 (1), se entiende en silencio por columnas y rótulos (2), una idea: peso de impuestos y cotizaciones sobre el PIB frente a 2018 y a la UE (3), 40 s (4), cambio visual cada 2–5 s, frases ≤ 15 palabras (5), tono conversacional (6), vertical (7), momento compartible "38,1 % frente a 40,7 % de la UE" (8), cierre A/B con bucle (9). Duda: el gancho depende de un dato de 2018 que no pude abrir (10).

## Fuentes
Cifras de 2024 y 2025 leídas en Eurostat (noticia del 29-10-2026 y Statistics Explained "Tax revenue statistics", extraído el 29-10-2026) el 2026-11-11. Definición: "total taxes and social contributions payable to general government, including voluntary contributions" (Indicator 4), tras deducir los importes que se estima que no se cobrarán (D.995).

| # | Dato que respalda | Fuente (nivel) | Enlace | Consultada |
|---|---|---|---|---|
| 1 | España: 37,2 % del PIB (2024) → 38,1 % (2025); UE: 40,2 % → 40,7 %; "tax revenue (including net social contributions)"; entre los mayores aumentos de 2025 con Alemania (40,3 → 41,4), Malta y Francia (45,1 → 46,0) | Eurostat, noticia "EU and euro area tax-to-GDP ratio up in 2025" (29-10-2026) y Statistics Explained "Tax revenue statistics" (1) | https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20261029-3 · https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Tax_revenue_statistics | 2026-11-11 |
| 2 | Verificado 2026-11-12: España 2018 (35,2 % en la versión anterior a octubre de 2026) y UE 2018 (41,1 % en la anterior; en el gráfico de octubre de 2026, 41,1 %). Cálculo de la brecha 2025: 40,7 − 38,1 = 2,6 puntos (cálculo propio) | Eurostat gov_10a_taxag, geo ES y EU27_2020, unit PC_GDP, sector S13_S212, na_item D2_D5_D91_D61_M_D995 (1) | https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_taxag?format=JSON&geo=ES&geo=EU27_2020&unit=PC_GDP&sector=S13_S212&na_item=D2_D5_D91_D61_M_D995&time=2018&time=2025 | 2026-11-12 |
| 3 | Estado central 42,7 % del total de impuestos y cotizaciones de España en 2025; comunidades autónomas, 16,6 %; "the lowest share of central government… Spain (42.7%)" | Eurostat, Statistics Explained "Tax revenue statistics", fig. 9 (1) | https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Tax_revenue_statistics | 2026-11-11 |
| 4 | Aviso de Eurostat: los aplazamientos de 2020–2022 y los distintos métodos de registro afectan a la comparación entre años | Eurostat, Statistics Explained (1) | idem | 2026-11-11 |

## Imágenes
| # | Imagen | Licencia / autoría | Uso |
|---|---|---|---|
| 1 | Logotipo de Eurostat (institucional) | Logotipo oficial | Solo en ficha de fuente; sin retratos ni fotos |

## Pendiente de verificar
- Cerrado el 2026-11-12: gov_10a_taxag da ES 35,2 y UE 41,1 (2018), ES 38,1 y UE 40,7 (2025).
- Comparación honesta: Eurostat mide recaudación total (incluye cotizaciones) sobre PIB nominal; la UE de 2018 a 2025 (40,2 en 2024, 40,7 en 2025) y España sube 0,9 solo en el último año; no se atribuye a una decisión concreta ni se dice que el Gobierno "suba impuestos". No se mezclan con los 37,8 % de la Comisión (otra definición) ni con el Juan de Mariana.
- Opcional, solo si se contrasta con primaria: "Lo que dice el Gobierno" (rebajas fiscales del RDL 25/2026 o nota de Hacienda sobre empleo); no está en la versión principal porque no se verificó.
- Opcional, solo si hay nota de Eurostat que lo diga para España: causa de la subida de 2025 (la noticia solo dice que la recaudación creció más que el PIB).

## Texto propuesto para el post
Ver `publicado/042-8-anos-presion-fiscal.md`.
