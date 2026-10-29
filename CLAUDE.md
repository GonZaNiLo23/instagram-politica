# Proyecto: cuenta de Instagram de política animada

Este repositorio produce Reels animados, informativos y educativos sobre actualidad política, curiosidades e instituciones.

## Instalación (una sola vez)
Ejecuta `instalar-agentes.bat` (doble clic): copia `agentes/` a `.claude/agents/` y `comandos/` a `.claude/commands/`. Si editas un agente, edítalo en `agentes/` y vuelve a ejecutar el instalador.

## Rol de la sesión principal
**La sesión principal actúa como COORDINADOR.** Antes de hacer nada, lee:
1. `agentes/coordinador.md` (tu rol y reglas: síguelas como si fueran tus instrucciones)
2. `PLANIFICADOR.md` (estrategia, pilares, calendario, principios editoriales)
3. `estado/pipeline.md` (en qué punto está cada pieza)

Los subagentes no pueden lanzar otros subagentes, por eso la coordinación la hace la sesión principal y delega con la herramienta Agent en:
`buscador-temas`, `guionista`, `revisor-guion`, `generador-video`, `revisor-video`, `generador-carrusel`, `publicador` (Meta Business Suite + TikTok Studio) y `monitoreador` (métricas; se ejecuta solo cada día con `tareas/monitoreo-diario.ps1`).

## Estructura de carpetas
```
PLANIFICADOR.md            estrategia y calendario
agentes/                   definición de los 9 agentes (fuente; se copian a .claude/agents)
comandos/producir.md       comando /producir (se copia a .claude/commands)
estilo/guia-estilo.md      estilo gráfico, voz y ritmo (lo leen guionista y vídeo)
estilo/linea-editorial.md  línea editorial de derecha liberal-conservadora (la leen todos)
estilo/test-formato-reel.md  test de 10 criterios Reel/TikTok (lo aplican los revisores)
feedback/                  lecciones de los revisores para cada agente (las leen antes de trabajar; resumen de una línea por regla arriba)
memoria/                   cuaderno de experiencia de cada agente (atajos y trampas; lo leen primero y lo amplían al terminar)
estado/pipeline.md         tablero de estado de cada pieza (lo mantiene el coordinador)
estado/informe-rendimiento.md  análisis diario del monitoreador (qué temas funcionan)
estado/plan-crecimiento.md     plan e hitos hasta 100.000 seguidores (revisión cada lunes)
estado/programado-hoy.md       lo programado con la aprobación permanente (para vetar)
estado/mercados/           datos y pantallas de la historia diaria de mercados
temas/backlog.md           ideas atemporales y preguntas de seguidores
temas/propuestas/          propuestas semanales del buscador de temas
guiones/_plantilla-guion.md
guiones/borradores/        guiones en curso  (NNN-slug.md)
guiones/aprobados/         guiones aprobados por el revisor
revisiones/guiones/        informes del revisor de guion
revisiones/videos/         informes del revisor de vídeo
videos/                    proyecto Remotion (remotion/), piezas, scripts de voz y render, música, recortes (recorte/)
videos/renders/            solo la última versión de cada pieza; subida/ = copias < 10 MB pendientes de subir
carruseles/                carruseles en PNG + texto del post (NNN-slug-vX)
publicado/                 fichas de publicación, textos del post y métricas
herramientas/              seccion.js (leer partes de un .md), medir-tokens.js (consumo por agente), publicar-api/ (API de Instagram)
tareas/                    scripts de las tareas programadas de Windows (producción nocturna, monitoreo, revisión semanal) y rutina de mercados
```
Limpieza: cuando una pieza tiene una versión nueva aprobada, las anteriores de `videos/renders/` y sus copias de `subida/` sobran (van a la Papelera, nunca se borran del todo).

## Convenciones
- Cada pieza tiene un número de 3 cifras y un slug: `004-presupuestos-prorrogados`. Se usa igual en guion, revisiones y render.
- Idioma: español de España. Fechas en formato `AAAA-MM-DD`.
- Publicación (desde el 2026-10-20): el coordinador (a través del agente `publicador`) programa en **Meta Business Suite** (Instagram) y **TikTok Studio** (TikTok) desde el 2026-10-25, vía Claude in Chrome (Metricool, de reserva; las métricas se siguen leyendo en Metricool) **solo después del "aprobado" explícito de la persona usuaria para esa pieza concreta**, en el chat. Sin ese OK no se programa ni se publica nada. La aprobación de una pieza no vale para otras. **Excepción, aprobación permanente (decisión de la persona usuaria del 2026-10-26: "has aprendido lo suficiente con el formato"):** un vídeo o carrusel con veredicto APROBADO de `revisor-guion` y de `revisor-video` (test de formato ≥ 9) queda aprobado y se programa sin preguntar, con al menos 2 h de margen para que la persona usuaria pueda vetarlo; se le deja la lista de lo programado en `estado/programado-hoy.md`. Si dice "no" o "para" sobre una pieza, se desprograma y se vuelve a pedir OK pieza a pieza hasta que lo reactive. Receta en `memoria/coordinador.md`.
- **Al minuto horario (decisión de la persona usuaria del 2026-10-29):** cada hora en punto (07:00–22:00) se publica **directamente, sin revisores**, el vídeo más relevante (nota 3–5) de las cuentas de Instagram de `herramientas/al-minuto/cuentas.json`, La Moncloa o el buzón `estado/buzon-al-minuto.md`. Lo hace la cadena radar (`.github/workflows/al-minuto.yml`, :20) → rutina en la nube "Al minuto horario" (:38, `tareas/al-minuto-horario.md`) → `render.yml`, que publica en punto. Solo lo para un veto en `estado/vetos.md`. Se pueden usar clips con imágenes de televisión; siempre se cita el @ de origen.
- **Repositorio público (desde el 2026-10-29):** nunca escribas claves, tokens ni datos personales en archivos del repo ni en registros; todo script que use claves importa `herramientas/publicar-api/ocultar.mjs`.
- Línea editorial de derecha liberal-conservadora, espacio afín PP, SALF y Vox (`estilo/linea-editorial.md`) con verificación estricta de hechos según §7 del planificador: la línea decide la opinión, nunca los datos. Es la regla más importante del proyecto.
- Historia diaria de mercados (`tareas/historia-mercados.md`): **formato aprobado** por la persona usuaria el 2026-10-26 ("aprobado el formato", sobre la plantilla de ese día). Con él, la rutina publica las tres pantallas sin pedir OK cada día, siempre que pase sus propias comprobaciones (cifras contrastadas, sin recomendaciones de inversión). Si cambia la plantilla, vuelve a pedir el OK.
- Veredictos de los revisores: APROBADO, CAMBIOS o REHACER (no apto como Reel/TikTok).
