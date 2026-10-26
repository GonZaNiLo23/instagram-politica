# Consumo de tokens por agente

Generado el 2026-10-25 22:38 con `node medir-tokens.js `.
"Peso" = entrada + escritura de caché ×1,25 + lectura de caché ×0,1 + salida ×5 (aproximación al coste relativo). "Arranque" = contexto medio en el primer turno (lo que el agente carga antes de trabajar).

| Agente | Modelo | Ejecuciones | Turnos | Escr. caché | Lect. caché | Salida | Imágenes | Arranque | Contexto máx. | Peso | % | Peso/ejecución |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| coordinador (sesión principal) | opus-5-5 | 5 | 986 | 4245k | 209785k | 574k | 199 | 46k | 558k | 29158k | 37.1 | 5832k |
| generador-video | sonnet-5-5 | 32 | 1041 | 6102k | 101470k | 675k | 307 | 10k | 405k | 21153k | 26.9 | 661k |
| guionista | opus-5-5 | 30 | 729 | 5014k | 54418k | 306k | 51 | 9k | 312k | 13241k | 16.8 | 441k |
| revisor-guion | opus-5-5 | 27 | 557 | 2697k | 35555k | 213k | 15 | 10k | 284k | 7990k | 10.2 | 296k |
| revisor-video | sonnet-5-5 | 25 | 420 | 1881k | 21305k | 146k | 199 | 10k | 214k | 5211k | 6.6 | 208k |
| buscador-temas | sonnet-5-5 | 3 | 65 | 400k | 4024k | 29k | 0 | 9k | 144k | 1047k | 1.3 | 349k |
| monitoreador | sonnet-5-5 | 2 | 38 | 132k | 1621k | 30k | 17 | 15k | 80k | 475k | 0.6 | 238k |
| publicador | sonnet-5-5 | 4 | 41 | 132k | 1356k | 14k | 24 | 13k | 61k | 370k | 0.5 | 93k |

## Qué herramientas meten más texto en el contexto (miles de caracteres de resultados)

- **coordinador (sesión principal):** Bash 517k · chrome:computer 237k · Agent 145k · Read 81k · chrome:find 43k · WebSearch 35k
- **generador-video:** Bash 1626k · Read 1338k · Grep 43k · Write 14k · Glob 12k · Edit 6k
- **guionista:** Read 1948k · WebFetch 654k · WebSearch 520k · Grep 63k · Edit 27k · Glob 8k
- **revisor-guion:** Read 1557k · WebFetch 359k · WebSearch 347k · Grep 56k · Edit 13k · Write 5k
- **revisor-video:** Read 835k · Bash 425k · Glob 4k · Write 3k · SubagentHandback 3k · Edit 2k
- **buscador-temas:** WebSearch 278k · Read 88k · WebFetch 69k · Write 2k · Grep 2k · SubagentHandback 0k
- **monitoreador:** chrome:get_page_text 59k · Read 26k · chrome:computer 21k · chrome:navigate 7k · Bash 1k · chrome:tabs_context_mcp 1k
- **publicador:** chrome:computer 21k · Read 18k · Bash 3k · Grep 2k · chrome:find 2k · chrome:navigate 1k

## Las 15 ejecuciones que más pesan

| Inicio | Sesión | Agente | Turnos | Imágenes | Contexto máx. | Peso |
|---|---|---|---|---|---|---|
| 2026-10-22 10:47 | f80da6ec | coordinador (sesión principal) | 388 | 147 | 558k | 12497k |
| 2026-10-19 10:10 | 7546fdc6 | coordinador (sesión principal) | 220 | 10 | 448k | 8143k |
| 2026-10-19 20:14 | 7546fdc6 | generador-video | 115 | 84 | 405k | 4621k |
| 2026-10-25 11:32 | 4f984316 | coordinador (sesión principal) | 181 | 29 | 246k | 3846k |
| 2026-10-20 13:46 | 31a13902 | coordinador (sesión principal) | 125 | 13 | 280k | 3329k |
| 2026-10-22 18:05 | f80da6ec | generador-video | 53 | 17 | 223k | 1863k |
| 2026-10-19 10:26 | 7546fdc6 | guionista | 52 | 0 | 251k | 1709k |
| 2026-10-25 12:38 | 4f984316 | generador-video | 54 | 23 | 219k | 1688k |
| 2026-10-19 10:26 | 7546fdc6 | guionista | 55 | 0 | 255k | 1674k |
| 2026-10-20 14:39 | 9bcfd4b4 | coordinador (sesión principal) | 72 | 0 | 195k | 1343k |
| 2026-10-19 14:42 | 7546fdc6 | revisor-guion | 76 | 5 | 216k | 1324k |
| 2026-10-22 18:00 | f80da6ec | generador-video | 53 | 11 | 160k | 1214k |
| 2026-10-19 19:42 | 7546fdc6 | guionista | 51 | 0 | 231k | 1212k |
| 2026-10-19 20:43 | 7546fdc6 | revisor-video | 49 | 39 | 214k | 1188k |
| 2026-10-19 14:42 | 7546fdc6 | revisor-guion | 58 | 0 | 220k | 1112k |
