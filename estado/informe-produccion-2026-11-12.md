# Informe de producción · 2026-11-12 (rutina nocturna de claude.ai, 03:15 Madrid)

## Resultado
Sin producción en esta sesión: la red del entorno sigue sin abrir las fuentes (curl a ine.es, boe.es, europapress.es y commons.wikimedia.org: sin conexión). Protocolo de `memoria/coordinador.md`: comprobar, informar y salir; la producción la hace `produccion.yml` en GitHub Actions (con red completa).

## Cobertura (programado-hoy.md + cola)
| Día | 1.ª | 2.ª |
|---|---|---|
| Jue 2026-11-12 | 13:30 **vacío** | 19:00 **vacío** |
| Vie 2026-11-13 | 13:30 **vacío** | 19:00 **vacío** |

No hay piezas trabajadas pendientes en `estado/cola-publicacion.json` (040 y 041 salieron el 11-11).

## Lo más avanzado (para produccion.yml)
- **043 regularizados-cotizan**: guion aprobado (literales aplicados, `revisiones/guiones/043-…-v1.md`); `videos/piezas/043-…/` ya tiene escenas.json, voz y tiempos.json. Falta encargar render y revisor-video.
- **044 deuda-bajo-100**: guion aprobado (literales aplicados, `revisiones/guiones/044-…-v1.md`); sin vídeo.
- **042 8-anos-presion-fiscal**: borrador a medias (falta verificar el dato de Eurostat).

Con 043 y 044 se cubren las dos de hoy; para el viernes hace falta 042 u otra pieza.

## Qué quedó en cola
Nada nuevo.

## TikTok a mano
Nada nuevo de esta noche (040 y 041 siguen en borrador de TikTok).

## Pendiente de la persona usuaria (repetido del 11-11)
Blindar `.github/workflows/produccion.yml` contra CRLF (`tr -d '\r'` al extraer el encargo, o `.gitattributes` con `*.md text eol=lf`).
