# Informe de producción 2026-11-14 (rutina de claude.ai, 03:15 Madrid)

- **Red:** sin conexión a fuentes (curl 000 a ine.es, boe.es, europapress.es, commons.wikimedia.org y la API de Eurostat). Protocolo de memoria/coordinador.md: comprobar, informar y salir; la producción la hace `produccion.yml` en GitHub Actions.
- **En cola hoy (sáb 14-11):** 047-8-anos-pensiones v1 a las 12:00 y 048-8-anos-productividad v2 a las 19:00 (pendientes). Hoy cubierto.
- **Huecos para produccion.yml:** dom 15-11 12:00 y 19:00; lun 16-11 13:30 y 19:00. Prioridad (informe de rendimiento): explicativos "¿Por qué…?" de instituciones y dinero público con ejemplo numérico.
- **Fallo de ayer:** 046-8-anos-paro-juvenil (vie 13-11 19:00) quedó en `error` en la cola: la API de Instagram respondió "The ig container is not in the status to upload a video" (ProcessingFailedError, no reintentable). No se publicó. Para reintentar, poner `"estado": "pendiente"` con una hora nueva (≥ 2 h de margen) en estado/cola-publicacion.json.
- **A medias:** 045-debates-academia-tv (premisa superada).
- **TikTok a mano:** 047 y 048 (borradores al publicarse en IG); las piezas Al minuto con `tiktok_estado: "error"` (am20261112-1926, am20261113-1648) no llegaron a borradores.
