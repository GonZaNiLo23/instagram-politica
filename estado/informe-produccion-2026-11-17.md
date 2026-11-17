# Informe de producción · 2026-11-17 (rutina de claude.ai, 03:15 Madrid)

## Red
Sin conexión a fuentes primarias (curl 000 a ine.es, boe.es, europapress.es, commons.wikimedia.org y Eurostat). Sin red no se puede verificar §7 ni bajar fotos: no se encargó ningún guion. La producción la hace `produccion.yml` (GitHub Actions, red completa).

## Cola
| Fecha | 13:30 | 19:00 |
|---|---|---|
| 2026-11-17 (mar) | 053-compra-ahora-paga-despues v2 (pendiente; antes: BOE y Consejo de Ministros del 17-11) | 054-audiencias-debates v1 (pendiente) |
| 2026-11-18 (mié) | **vacío** | **vacío** |
| 2026-11-19 (jue) | **vacío** | **vacío** |

Huecos del 18 y 19-11 para `produccion.yml`.

## Incidencia
- **052-voto-correo-29n v1 NO se publicó** (16-11 19:00): la API de Instagram devolvió `ProcessingFailedError` (Video Transcoding Error: both HD and SD progressive failed), no reintentable. Para recuperarla hace falta reencodar el vídeo (H.264 yuv420p, faststart, AAC) en un ejecutor con red y volver a encolarla, **recomprobando antes los plazos del voto por correo del 29-N** (la pieza es sensible a fecha). No la he reencolado desde aquí.

## TikTok a mano
Cuando salgan en IG: 053 y 054 (borradores en la bandeja de TikTok; descripción en publicado/NNN-slug.md).

## A medias
- 045-debates-academia-tv: premisa superada (sin cambios).
