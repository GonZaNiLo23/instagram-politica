# Informe de producción nocturna · 2026-10-30 (en la nube)

## Cobertura de los próximos días
| Día | Hueco 1 | Hueco 2 |
|---|---|---|
| Vi 30-10 | 13:30 020 (Meta Business Suite) | **19:00: HUECO SIN CUBRIR** (2.ª noche seguida) |
| Sá 31-10 | 12:00 007 (Metricool) | 19:00 017 (Meta Business Suite; recomprobar escaños en clerk.house.gov) |

Además, la cadena "Al minuto horario" sigue publicando cada hora (07:00–22:00), así que la cuenta no se queda sin contenido el viernes por la tarde.

## Qué quedó en la cola
- Nada nuevo. `estado/cola-publicacion.json` solo tiene las dos piezas "Al minuto" ya publicadas el 29-10.

## Qué quedó a medias y por qué
- **No se ha encargado ninguna pieza nueva.** A las 03:15 esta sesión en la nube no tiene salida a ninguna fuente: curl y WebFetch fallan con ine.es, boe.es, congreso.es, senado.es, hacienda.gob.es, bde.es, airef.es, lamoncloa.gob.es, poderjudicial.es, eur-lex.europa.eu, commons.wikimedia.org, upload.wikimedia.org, es.wikipedia.org e incluso medios (europapress.es, rtve.es, efe.com, epdata.es, expansion.com). Sin fuente primaria ni dos medios legibles no se cumple §7 del planificador, y sin Commons el generador de vídeo no puede bajar fotos reales. Encargar guion y revisión habría gastado tokens para acabar otra vez bloqueado, como la 028 anoche.
- **028-dos-cifras-de-paro** sigue en `guion-revision` (CAMBIOS v1, literal de 88 palabras en `revisiones/guiones/028-dos-cifras-de-paro-v1.md`), bloqueada por la misma causa.
- **029-luto-oficial**: aprobada (piloto) pero no entra en la cola sin el OK expreso de la persona usuaria. El luto oficial dura hasta el 31-10 a las 24:00: si se quiere para el hueco de hoy a las 19:00, hay que dar el OK.

## Qué hace falta para desbloquear
- Ampliar el acceso de red del entorno en la nube (menú del entorno en la barra de título de la sesión → Edit → Network access): nivel más amplio, o añadir en *Allowed domains* al menos ine.es, boe.es, congreso.es, senado.es, hacienda.gob.es, lamoncloa.gob.es, commons.wikimedia.org y upload.wikimedia.org (y algún medio de referencia: europapress.es, efe.com, rtve.es). Pasos: https://code.claude.com/docs/en/cloud-environments#network-access
- Con eso, la próxima ejecución nocturna puede cerrar la 028 (vuelta 2 solo de datos) y producir piezas nuevas.

## TikTok a mano
- Nada nuevo de esta noche.
