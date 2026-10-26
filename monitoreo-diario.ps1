# Ejecuta el agente monitoreador una vez (lo lanza el Programador de tareas de Windows cada día).
# Requisitos: Chrome abierto con la extensión Claude in Chrome conectada y la sesión de Metricool iniciada.
$ErrorActionPreference = 'Continue'
Set-Location -LiteralPath $PSScriptRoot
$hoy = Get-Date -Format 'yyyy-MM-dd'
New-Item -ItemType Directory -Force 'estado\logs' | Out-Null
$log = "estado\logs\monitoreo-$hoy.log"

$prompt = "Hoy es $hoy. Haz la recogida diaria de métricas y el informe de rendimiento según tus instrucciones. Solo lectura."
& "$env:USERPROFILE\.local\bin\claude.exe" -p $prompt `
    --agent monitoreador `
    --chrome `
    --allowedTools 'Read,Write,Edit,Glob,Grep,Bash(node:*),Bash(ls:*),Bash(date:*),mcp__claude-in-chrome' `
    *>&1 | Out-File -FilePath $log -Encoding utf8
