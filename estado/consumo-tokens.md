# Consumo de tokens por agente

Generado el 2026-10-27 16:59 con `node herramientas/medir-tokens.js 2026-10-24`.
"Peso" = entrada + escritura de caché ×1,25 + lectura de caché ×0,1 + salida ×5 (aproximación al coste relativo). "Arranque" = contexto medio en el primer turno (lo que el agente carga antes de trabajar).

| Agente | Modelo | Ejecuciones | Turnos | Escr. caché | Lect. caché | Salida | Imágenes | Arranque | Contexto máx. | Peso | % | Peso/ejecución |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| coordinador (sesión principal) | sonnet-5-5 | 8 | 793 | 2361k | 185445k | 496k | 87 | 36k | 653k | 23975k | 40.7 | 2997k |
| generador-video | sonnet-5-5 | 31 | 694 | 3307k | 42456k | 955k | 136 | 12k | 219k | 13157k | 22.3 | 424k |
| publicador | sonnet-5-5 | 11 | 555 | 1154k | 46796k | 231k | 455 | 19k | 269k | 7279k | 12.3 | 662k |
| revisor-guion | opus-5-5 | 22 | 290 | 1945k | 17414k | 380k | 6 | 11k | 317k | 6075k | 10.3 | 276k |
| guionista | opus-5-5 | 12 | 238 | 1235k | 13975k | 352k | 11 | 12k | 176k | 4703k | 8.0 | 392k |
| revisor-video | sonnet-5-5 | 24 | 203 | 860k | 6031k | 161k | 88 | 12k | 94k | 2485k | 4.2 | 104k |
| monitoreador | sonnet-5-5 | 2 | 34 | 139k | 1526k | 30k | 7 | 15k | 80k | 478k | 0.8 | 239k |
| generador-carrusel | sonnet-5-5 | 3 | 26 | 103k | 1130k | 41k | 3 | 7k | 78k | 447k | 0.8 | 149k |
| buscador-temas | sonnet-5-5 | 1 | 15 | 122k | 487k | 28k | 0 | 10k | 75k | 344k | 0.6 | 344k |

## Qué herramientas meten más texto en el contexto (miles de caracteres de resultados)

- **coordinador (sesión principal):** Bash 520k · Read 186k · Agent 115k · chrome:get_page_text 52k · chrome:browser_batch 45k · WebSearch 30k
- **generador-video:** Bash 1138k · Read 894k · Grep 11k · Write 4k · Edit 3k · SubagentHandback 2k
- **publicador:** chrome:computer 473k · Read 107k · chrome:get_page_text 56k · chrome:javascript_tool 53k · chrome:find 41k · Bash 35k
- **revisor-guion:** Read 1113k · WebFetch 176k · WebSearch 176k · Grep 62k · Edit 8k · Write 4k
- **guionista:** Read 765k · WebSearch 231k · WebFetch 179k · Grep 18k · Edit 13k · Glob 8k
- **revisor-video:** Read 384k · Bash 345k · SubagentHandback 2k · Glob 1k · Write 1k
- **monitoreador:** chrome:get_page_text 87k · Read 43k · chrome:computer 10k · chrome:navigate 4k · chrome:find 2k · chrome:tabs_context_mcp 1k
- **generador-carrusel:** Read 49k · Bash 29k · Write 1k · Edit 0k · SubagentHandback 0k · Grep 0k
- **buscador-temas:** WebSearch 43k · WebFetch 29k · Read 7k · Write 1k · SubagentHandback 0k · Grep 0k

## Las 15 ejecuciones que más pesan

| Inicio | Sesión | Agente | Turnos | Imágenes | Contexto máx. | Peso |
|---|---|---|---|---|---|---|
| 2026-10-25 11:32 | 4f984316 | coordinador (sesión principal) | 504 | 70 | 653k | 18229k |
| 2026-10-26 21:49 | 523fa06d | publicador | 129 | 108 | 269k | 2431k |
| 2026-10-26 21:47 | 523fa06d | coordinador (sesión principal) | 113 | 6 | 302k | 2427k |
| 2026-10-26 10:15 | 19b640e6 | coordinador (sesión principal) | 107 | 10 | 262k | 2359k |
| 2026-10-25 12:38 | 4f984316 | generador-video | 54 | 23 | 219k | 1688k |
| 2026-10-26 08:24 | 4f984316 | generador-video | 40 | 7 | 176k | 1535k |
| 2026-10-26 10:19 | 19b640e6 | publicador | 111 | 68 | 151k | 1326k |
| 2026-10-25 12:06 | 4f984316 | guionista | 37 | 0 | 176k | 1064k |
| 2026-10-26 03:20 | 8ae4096c | revisor-guion | 27 | 0 | 243k | 853k |
| 2026-10-26 03:20 | 8ae4096c | generador-video | 38 | 5 | 158k | 850k |
| 2026-10-26 08:24 | 4f984316 | revisor-guion | 17 | 0 | 317k | 810k |
| 2026-10-26 08:34 | 4f984316 | generador-video | 41 | 5 | 137k | 801k |
| 2026-10-26 11:12 | 19b640e6 | publicador | 61 | 58 | 144k | 778k |
| 2026-10-26 22:44 | 523fa06d | publicador | 56 | 54 | 139k | 750k |
| 2026-10-26 10:41 | 19b640e6 | generador-video | 30 | 8 | 144k | 738k |
