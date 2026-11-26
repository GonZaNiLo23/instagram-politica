# Informe de producción 2026-11-26 (rutina claude.ai, 03:15 Madrid)

**Red:** igual que las noches anteriores, sin conexión (curl 000 a boe.es, ine.es, Eurostat y commons.wikimedia.org). Sin red no se pueden verificar datos (§7) ni bajar imágenes con licencia, así que esta rutina no produce: comprueba, informa y sale. La producción la hace `produccion.yml` (GitHub Actions, red completa).

## En cola (Instagram, publica GitHub Actions salvo veto en estado/vetos.md)
| Hora (Madrid) | Pieza | Estado |
|---|---|---|
| 2026-11-26 13:30 | 077-ratios-guarderia v2 | pendiente (ANTES: recomprobar el RD de ratios en el BOE) |
| 2026-11-26 19:00 | 078-fp-online-presencial v2 | pendiente |

## Huecos sin cubrir
- **Viernes 2026-11-27, 13:30 y 19:00**: vacíos. Ninguna propuesta libre (las de 2026-11-23 y 2026-11-24 ya están usadas). Quedan para `produccion.yml`: buscador-temas → 2 flashes "¿Por qué…?" de instituciones o dinero público con ejemplo numérico. El 27-11 es el último día de campaña del 29-N. Próximo número libre: 079.

## A medias / incidencias
- **069-permiso-fallecimiento-diez-dias v2**: falló en IG el 25-11 ("The ig container is not in the status to upload a video", no reintentable). No se ha vuelto a encolar: es actualidad del 25-11 y hay que recomprobar en Moncloa/BOE antes de reutilizarla. Si se reintenta, conviene reencodar (yuv420p), como se hizo con la 052.

## TikTok (manual, pendiente de la persona usuaria)
- 077-ratios-guarderia v2 y 078-fp-online-presencial v2 (release "listos").
