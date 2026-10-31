# Revisión semanal del plan de crecimiento (la lanza el Programador de tareas los lunes a las 10:30).
# Solo lee y escribe archivos del proyecto. NUNCA programa, publica ni usa Chrome.
$ErrorActionPreference = 'Continue'
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)  # raíz del proyecto: los scripts viven en tareas/
$hoy = Get-Date -Format 'yyyy-MM-dd'
New-Item -ItemType Directory -Force 'estado\logs' | Out-Null
$log = "estado\logs\revision-semanal-$hoy.log"
$env:Path = [Environment]::GetEnvironmentVariable('Path', 'User') + ';' + [Environment]::GetEnvironmentVariable('Path', 'Machine')

$prompt = @"
Hoy es $hoy. Revisión semanal sin persona usuaria delante. Actúa como COORDINADOR (redactor jefe) según CLAUDE.md y agentes/coordinador.md.

1. Lee estado/plan-crecimiento.md, estado/informe-rendimiento.md, publicado/metricas-diarias.md (solo las filas de los últimos 7 días, con Grep), estado/pipeline.md y, si existe, la revisión semanal anterior en estado/revisiones-semanales/.
2. Calcula: seguidores por red y total, ganados en la semana, % de la ruta de hitos por red (interpolación geométrica entre hitos, ver el plan) y si se ha alcanzado algún hito (entonces, propón su premio), seguidores por cada 1.000 visualizaciones, guardados+compartidos por cada 1.000, vídeos de más de 100.000 visualizaciones. Si un dato falta, "n/d"; nunca lo estimes.
3. Diagnostica el cuello de botella con la sección "Diagnóstico semanal" del plan y evalúa los experimentos de la semana anterior (funcionó / no / sin datos suficientes, con n).
4. Elige 1-3 experimentos para esta semana y, si el diagnóstico lo pide, cambios concretos para el buscador de temas, el guionista o el calendario.
5. Añade una fila a la tabla "Seguimiento" de estado/plan-crecimiento.md. Si se cumple la condición de "Alerta" o toca cambiar de fase, márcalo en negrita en la fila.
6. Aprendizaje continuo (decisión de la persona usuaria del 2026-10-31): aplica tú los cambios que pida el diagnóstico en los agentes que producen (agentes/guionista.md, generador-video.md, generador-carrusel.md, buscador-temas.md, tareas/al-minuto-horario.md, estilo/guia-estilo.md) y copia cada agente cambiado a .claude/agents/. Basa cada cambio en datos (n >= 3) o en una regla de feedback/ repetida 3 veces; anótalo en estado/cambios-agentes.md (qué, por qué, métrica que debe mejorar, fecha de evaluación). Evalúa los cambios de hace 2 semanas o más: si la métrica empeoró, reviértelos y anótalo. Haz git commit y git push de los cambios. Límites: NO cambies estilo/linea-editorial.md, las reglas de verificación de datos, las de aprobación y publicación, los hitos ni las claves: eso se propone.
7. Escribe estado/revisiones-semanales/$hoy.md (máx. 40 líneas): números, diagnóstico, experimentos, cambios aplicados a los agentes y qué decisiones necesitan el OK de la persona usuaria.

Reglas: PROHIBIDO programar, publicar, responder comentarios o usar Chrome/Metricool/Meta/TikTok. Respuestas cortas de subagentes si los usas (no deberías necesitarlos).
"@

# El prompt va por la entrada estándar: como argumento, PowerShell 5.1 lo corta en la primera comilla doble
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$prompt | & "$env:USERPROFILE\.local\bin\claude.exe" -p `
    --allowedTools 'Read,Write,Edit,Glob,Grep,Bash' `
    --disallowedTools 'mcp__claude-in-chrome' `
    *>&1 | Out-File -FilePath $log -Encoding utf8
