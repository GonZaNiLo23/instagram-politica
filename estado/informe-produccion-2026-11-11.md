# Informe de producción · 2026-11-11 (rutina nocturna de claude.ai, 03:15 Madrid)

## Resultado
Sin producción en esta sesión: la red del entorno sigue sin abrir las fuentes (curl a ine.es, boe.es, europapress.es y commons.wikimedia.org: sin conexión). Protocolo de `memoria/coordinador.md`: no se encarga nada a los subagentes.

## Avería encontrada y corregida: produccion.yml no producía desde el 9-11 por la tarde
- Los dos trabajos del 10-11 (07:31 y 07:57 UTC) acabaron en "success" pero el paso «Producción» duró 16 s: Claude solo recibió la línea «Hoy es…» y respondió «¿Qué quieres que haga?».
- Causa: el commit `0eded66` (radar del 2026-11-09 15:28Z) dejó `tareas/produccion-nube.md` con finales de línea CRLF. El flujo extrae el encargo con `sed -n '/^---$/,$p'`, que ya no encontraba el separador `---\r`: el encargo llegaba vacío.
- Corregido: `tareas/produccion-nube.md` vuelto a LF (comprobado: salen las 19 líneas del encargo). **Pendiente para la persona usuaria:** blindar `.github/workflows/produccion.yml` línea 82 con `tr -d '\r' < tareas/produccion-nube.md | sed -n '/^---$/,$p' | tail -n +2` (esta sesión no puede subir cambios de flujos: falta el permiso `workflow`), o añadir `.gitattributes` con `*.md text eol=lf`, para que otro commit en CRLF no lo vuelva a romper.
- `tareas/al-minuto-horario.md` también está en CRLF (lo lee una rutina de claude.ai entero, no le afecta).

## Cobertura (programado-hoy.md + cola)
| Día | 1.ª | 2.ª |
|---|---|---|
| Mié 2026-11-11 | 13:30 **vacío** | 19:00 **vacío** |
| Jue 2026-11-12 | 13:30 **vacío** | 19:00 **vacío** |

No hay piezas trabajadas pendientes en la cola. Lo más avanzado: 040 (guion aprobado el 09-11; caduca el 12-11; bloqueante: recomprobar la referencia del Consejo de Ministros). La próxima ejecución de produccion.yml (cron 01:00 UTC o el radar desde las 05:00 UTC) ya recibe el encargo completo.

## Qué quedó en cola
Nada nuevo.

## A medias
040 tu-casa-50000-euros (guion aprobado, sin vídeo) para produccion.yml.

## TikTok a mano
Nada nuevo de esta noche.
