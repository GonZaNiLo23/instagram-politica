# Ciclo de producción nocturno (lo lanza el Programador de tareas de Windows).
# Produce guiones y vídeos hasta "listo". NUNCA programa ni publica: eso requiere el "aprobado" de la persona usuaria en el chat.
$ErrorActionPreference = 'Continue'
Set-Location -LiteralPath $PSScriptRoot
$hoy = Get-Date -Format 'yyyy-MM-dd'
New-Item -ItemType Directory -Force 'estado\logs' | Out-Null
$log = "estado\logs\produccion-$hoy.log"
# Si el Programador de tareas despertó el portátil, impide que vuelva a suspenderse mientras dura este proceso
Add-Type -Name Power -Namespace Win32 -MemberDefinition '[DllImport("kernel32.dll")] public static extern uint SetThreadExecutionState(uint esFlags);'
[Win32.Power]::SetThreadExecutionState([uint32]'0x80000001') | Out-Null  # ES_CONTINUOUS | ES_SYSTEM_REQUIRED
# Herramientas instaladas con winget (yt-dlp, ffmpeg)
$env:Path = [Environment]::GetEnvironmentVariable('Path', 'User') + ';' + [Environment]::GetEnvironmentVariable('Path', 'Machine')

$prompt = @"
Hoy es $hoy. Ejecución nocturna sin persona usuaria delante. Actúa como COORDINADOR según CLAUDE.md: lee agentes/coordinador.md, PLANIFICADOR.md, estado/pipeline.md y memoria/coordinador.md, y delega en los subagentes con la herramienta Agent.

Objetivo: llenar los huecos del 26 al 30-10 (2 piezas al día) dejando piezas en estado "listo" (guion y vídeo aprobados por los revisores). Por orden de prioridad:
1. Vídeos de 016-mesa-electoral-29n, 018-voto-en-blanco y 021-senado-209-senadores (guion ya aprobado; el tablero dice "vídeo en curso", pero no hay render). Generador de vídeo, en paralelo, y después revisor de vídeo hasta APROBADO.
2. Guiones de 014-28-octubre-1982 (aniversario el 28-10) y 013-articulo-155-27-octubre (27-10, tema sensible: ficha de equidad): guionista, luego revisor de guion; aplica tú los literales cerrados. Después, vídeo y revisión.
3. Carruseles (generador-carrusel, 6-10 diapositivas 1080x1350, a partir de guiones ya aprobados; revisa cada uno el revisor-video como pieza visual, con verificación de que los datos son los del guion aprobado), en este orden:
   a. 024-disturbios-barcelona (actualidad, sale primero): cronología y balance. Solo animación y gráficos, SIN fotos de redes ni caras. La cita de Vox, atribuida y seguida del dato de que los Mossos no han dado nacionalidad, igual que en el vídeo.
   b. 002-ley-dhondt: el ejemplo de los tres partidos inventados (la pieza con más guardados).
   c. 003-por-que-350-diputados.
   d. 011-calendario-generales-54-dias: el guion está en borrador; antes, guionista y revisor de guion (verificar contra la JEC y la LOREG). Si no queda aprobado, déjalo.
   Carpeta carruseles/NNN-slug-vX; texto del post en publicado/NNN-slug-carrusel.md.
4. Si queda tiempo: 015-voto-exterior-fin-voto-rogado y 012-encuestas-cis-privadas.

Reglas:
- PROHIBIDO programar, publicar, responder comentarios o usar Chrome/Metricool/Meta/TikTok. Ninguna pieza tiene el "aprobado" de la persona usuaria; se le pedirá por la mañana.
- Verificación estricta de hechos (§7 del planificador). Si un dato no se puede verificar, la pieza se queda a medias con la nota, sin inventar.
- Preferencias: actualidad de 90-120 s con contexto, voz Dani v4 de ElevenLabs, imágenes reales con licencia libre.
- Máximo 2 vueltas de revisión por pieza esta noche; si no aprueba, déjala con el informe y sigue con la siguiente.
- Mantén estado/pipeline.md al día.
- Ahorro de tokens: sigue la sección "Eficiencia" de agentes/coordinador.md (respuestas cortas de los subagentes, rutas en vez de textos, node seccion.js para leer partes de un guion). Al terminar, ejecuta node medir-tokens.js $hoy y copia al informe la tabla de consumo por agente.
- Al terminar, escribe estado/informe-produccion-$hoy.md: qué piezas quedaron "listo" (render, duración, portada y texto del post en publicado/NNN), cuáles quedaron a medias y por qué, y una propuesta de calendario 26-30-10 (13:30 y 19:00; fin de semana 12:00 y 19:00) para que la persona usuaria la apruebe.
"@

& "$env:USERPROFILE\.local\bin\claude.exe" -p $prompt `
    --allowedTools 'Agent,Read,Write,Edit,Glob,Grep,Bash,WebSearch,WebFetch' `
    --disallowedTools 'mcp__claude-in-chrome' `
    *>&1 | Out-File -FilePath $log -Encoding utf8
