# Ciclo de producción nocturno (lo lanza el Programador de tareas de Windows).
# Produce guiones y vídeos y, con la aprobación permanente (CLAUDE.md), los deja en la cola de publicación (estado/cola-publicacion.json).
$ErrorActionPreference = 'Continue'
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)  # raíz del proyecto: los scripts viven en tareas/
$hoy = Get-Date -Format 'yyyy-MM-dd'
New-Item -ItemType Directory -Force 'estado\logs' | Out-Null
$log = "estado\logs\produccion-$hoy.log"
# Si el Programador de tareas despertó el portátil, impide que vuelva a suspenderse mientras dura este proceso
Add-Type -Name Power -Namespace Win32 -MemberDefinition '[DllImport("kernel32.dll")] public static extern uint SetThreadExecutionState(uint esFlags);'
[Win32.Power]::SetThreadExecutionState([uint32]'0x80000001') | Out-Null  # ES_CONTINUOUS | ES_SYSTEM_REQUIRED
# Herramientas instaladas con winget (yt-dlp, ffmpeg)
$env:Path = [Environment]::GetEnvironmentVariable('Path', 'User') + ';' + [Environment]::GetEnvironmentVariable('Path', 'Machine')

$prompt = @"
Hoy es $hoy. Producción nocturna EN ESTE PC (local; desde el 2026-10-31 sustituye a la rutina de la nube, que no tiene red a las fuentes), sin persona usuaria delante. Actúa como COORDINADOR según CLAUDE.md: lee agentes/coordinador.md, memoria/coordinador.md, estado/pipeline.md, el resumen de estado/informe-rendimiento.md, estado/programado-hoy.md y estado/cola-publicacion.json, y delega en los subagentes con la herramienta Agent. Haz git pull --rebase antes de empezar.

Objetivo: que los próximos 2 días tengan 2 piezas al día (13:30 y 19:00; fin de semana 12:00 y 19:00, hora de Madrid). Cuenta como cubierto lo que ya figure en estado/programado-hoy.md o en la cola. Encarga solo lo necesario para los huecos inmediatos (ahorro de tokens). Temas: primero lo que ya esté a medias en el tablero; después, la serie "8 años en cifras" (temas/propuestas/2026-10-28-serie-8-anos.md, en su orden recomendado y respetando la rotación) y las propuestas recientes de temas/propuestas/, priorizando lo que el informe de rendimiento dice que funciona. Si no queda nada, pide propuestas a buscador-temas. Tienes autorización de la persona usuaria para elegir los temas (2026-10-31, "hazlo tú").

Flujo: guionista -> revisor-guion (máx. 2 vueltas; los literales cerrados, aplícalos tú) -> generador-video (render local con node videos/render.mjs y voz real) -> revisor-video (máx. 2 vueltas). Con los dos APROBADO y test de formato >= 9 rige la aprobación permanente (CLAUDE.md, 2026-10-26):
1. Sube el render al release "listos": gh release upload listos videos/renders/NNN-slug-vX.mp4 --clobber.
2. Comprueba que publicado/NNN-slug.md tiene "## Texto del post" (<= 2.200 caracteres, mídelo con node; termina con "Síguenos para estar informado").
3. Añade a estado/cola-publicacion.json {"pieza","version","hora": ISO con zona +01:00 al menos 2 h después de ahora,"aprobacion": "permanente (CLAUDE.md 2026-10-26): <informe guion> APROBADO · <informe vídeo> APROBADO test N/10","estado": "pendiente"}. GitHub Actions la publica en Instagram a esa hora (salvo veto en estado/vetos.md) y deja TikTok en borradores.
4. Fila en estado/programado-hoy.md con TikTok "borrador (publicar a mano)".

Reglas: verificación estricta de hechos (§7 del planificador): si un dato no se verifica en la fuente primaria, la pieza se queda a medias con la nota. Imágenes reales con licencia libre. No uses Chrome ni llames tú a las API de Instagram o TikTok: solo la cola. Mantén estado/pipeline.md al día y sigue la sección "Eficiencia" de agentes/coordinador.md. Al terminar, ejecuta node herramientas/medir-tokens.js $hoy, escribe estado/informe-produccion-$hoy.md (qué quedó en cola y a qué hora, qué quedó a medias y por qué, qué hay que publicar a mano en TikTok) y haz git commit y git push a main (si falla, git pull --rebase y repite).
"@

# El prompt va por la entrada estándar: como argumento, PowerShell 5.1 lo corta en la primera comilla doble (el 2026-10-26 llegó truncado)
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$prompt | & "$env:USERPROFILE\.local\bin\claude.exe" -p `
    --allowedTools 'Agent,Read,Write,Edit,Glob,Grep,Bash,WebSearch,WebFetch' `
    --disallowedTools 'mcp__claude-in-chrome' `
    *>&1 | Out-File -FilePath $log -Encoding utf8
