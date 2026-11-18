# Revisión de vídeo · 056-8-anos-vivienda · vuelta 3 (render definitivo, sustituye al informe anterior)
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080x1920 · 30 fps · h264+aac · 35,2 s · -14,1 LUFS · pico -1,4 dBTP (OK). Voz real ElevenLabs (33,3 s), subtítulos sincronizados con tiempos.json.
**Test de formato Reel/TikTok:** 8/10 (falla 8 pulido: bloque del mapa; 5 legibilidad parcial)

## Obligatorio (bloqueante)
1. [00:24–00:28] Mapa (bloque 6): la nota "Estado: Ley de Vivienda 2023 y ayudas" queda tapada por el mapa de España ("Estado: Ley de Vivienda 2023 y ayu…" cortado). Es el mismo fallo señalado en v2 y sigue sin corregir. Bajar el mapa (y en `_generar-escenas.mjs`, ~y 560 → ≥ 700) o subir la nota para que se lea entera. Además el guion pedía iconos de CCAA/ayuntamientos y solo hay un mapa gris plano: añadirlos o aceptar el mapa y avisarlo al coordinador.

## Verificado en esta vuelta (corregido)
- Gancho 0–4 s: ya sin capa duplicada; "COMPRAR CASA: +52 %" y "¿Y EN EUROPA?" legibles.
- Globo "+12,2 % EN UN AÑO" (8,6–11,4 s): se lee entero, sin pisar el subtítulo; "HACE UN AÑO" y fuente "INE, IPV 2T-2026" ya legibles en oscuro.
- Barras de remuneración: +30 % llega a 30 con el mismo eje 0–60 que vivienda (+52). Correcto.
- Alquiler IPC 11,8 / zona euro 14,8, sello CONTRATOS VIVOS (roza el subtítulo pero sin taparlo), botones A/B y cierre "Cifra 13": OK.
- Avisos BORDE x>960 (8,87 y 15,67 s): son transiciones, texto dentro de zona; no bloquean.

## Recomendado
1. [00:12–00:15] La nota de fuente de remuneración (36 px, 3 líneas) queda muy pegada al subtítulo; valorar acortarla.
2. Rótulo "HACE UN AÑO" no figura literal en el guion: avisar al coordinador para añadirlo.
