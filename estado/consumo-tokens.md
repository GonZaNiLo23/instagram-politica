# Consumo de tokens por agente

Generado el 2026-10-26 08:53 con `node herramientas/medir-tokens.js 2026-10-26`.
"Peso" = entrada + escritura de caché ×1,25 + lectura de caché ×0,1 + salida ×5 (aproximación al coste relativo). "Arranque" = contexto medio en el primer turno (lo que el agente carga antes de trabajar).

| Agente | Modelo | Ejecuciones | Turnos | Escr. caché | Lect. caché | Salida | Imágenes | Arranque | Contexto máx. | Peso | % | Peso/ejecución |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| generador-video | sonnet-5-5 | 14 | 306 | 1465k | 18036k | 398k | 54 | 10k | 176k | 5626k | 49.4 | 402k |
| revisor-guion | opus-5-5 | 6 | 84 | 1005k | 8400k | 102k | 1 | 10k | 317k | 2608k | 22.9 | 435k |
| guionista | sonnet-5-5 | 3 | 43 | 237k | 2772k | 82k | 1 | 12k | 144k | 982k | 8.6 | 327k |
| coordinador (sesión principal) | haiku-5-5 | 3 | 57 | 181k | 3676k | 33k | 1 | 26k | 102k | 759k | 6.7 | 253k |
| revisor-video | sonnet-5-5 | 11 | 73 | 284k | 1468k | 47k | 26 | 11k | 43k | 738k | 6.5 | 67k |
| generador-carrusel | sonnet-5-5 | 3 | 26 | 103k | 1130k | 41k | 3 | 7k | 78k | 447k | 3.9 | 149k |
| monitoreador | sonnet-5-5 | 1 | 13 | 59k | 457k | 10k | 1 | 15k | 59k | 170k | 1.5 | 170k |
| publicador | sonnet-5-5 | 1 | 4 | 26k | 64k | 3k | 0 | 17k | 26k | 54k | 0.5 | 54k |

## Qué herramientas meten más texto en el contexto (miles de caracteres de resultados)

- **generador-video:** Bash 566k · Read 354k · Grep 3k · Write 2k · Edit 1k · SubagentHandback 0k
- **revisor-guion:** Read 340k · WebSearch 26k · WebFetch 26k · Grep 21k · Edit 2k · Write 1k
- **guionista:** Read 155k · WebSearch 40k · WebFetch 21k · Edit 8k · Grep 2k · Glob 1k
- **coordinador (sesión principal):** Read 83k · chrome:get_page_text 52k · Agent 19k · Bash 16k · chrome:computer 5k · chrome:navigate 2k
- **revisor-video:** Read 150k · Bash 90k · Glob 1k · SubagentHandback 1k · Write 0k
- **generador-carrusel:** Read 49k · Bash 29k · Write 1k · Edit 0k · SubagentHandback 0k · Grep 0k
- **monitoreador:** chrome:get_page_text 36k · Read 26k · chrome:computer 3k · chrome:navigate 1k · chrome:find 1k · chrome:tabs_context_mcp 1k
- **publicador:** Read 6k · Bash 3k · Grep 1k · SubagentHandback 0k

## Las 15 ejecuciones que más pesan

| Inicio | Sesión | Agente | Turnos | Imágenes | Contexto máx. | Peso |
|---|---|---|---|---|---|---|
| 2026-10-26 08:24 | 4f984316 | generador-video | 38 | 7 | 176k | 1322k |
| 2026-10-26 03:20 | 8ae4096c | revisor-guion | 27 | 0 | 243k | 853k |
| 2026-10-26 03:20 | 8ae4096c | generador-video | 38 | 5 | 158k | 850k |
| 2026-10-26 08:24 | 4f984316 | revisor-guion | 17 | 0 | 317k | 810k |
| 2026-10-26 08:34 | 4f984316 | generador-video | 36 | 5 | 136k | 742k |
| 2026-10-26 03:20 | 8ae4096c | guionista | 32 | 1 | 144k | 685k |
| 2026-10-26 03:20 | 8ae4096c | generador-video | 26 | 6 | 131k | 565k |
| 2026-10-26 03:20 | 8ae4096c | coordinador (sesión principal) | 38 | 0 | 102k | 497k |
| 2026-10-26 03:20 | 8ae4096c | generador-video | 29 | 5 | 102k | 469k |
| 2026-10-26 08:24 | 4f984316 | generador-video | 33 | 8 | 84k | 463k |
| 2026-10-26 03:29 | 8ae4096c | revisor-guion | 8 | 0 | 280k | 392k |
| 2026-10-26 03:24 | 8ae4096c | generador-carrusel | 19 | 2 | 78k | 386k |
| 2026-10-26 03:24 | 8ae4096c | generador-video | 17 | 1 | 87k | 363k |
| 2026-10-26 03:20 | 8ae4096c | revisor-guion | 15 | 0 | 73k | 244k |
| 2026-10-26 08:27 | 6ecbefa6 | coordinador (sesión principal) | 18 | 1 | 76k | 238k |
