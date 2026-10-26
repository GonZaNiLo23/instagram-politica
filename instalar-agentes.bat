@echo off
REM Copia los agentes y el comando /producir a la carpeta .claude para que Claude Code los reconozca.
cd /d "%~dp0"
if not exist ".claude\agents" mkdir ".claude\agents"
if not exist ".claude\commands" mkdir ".claude\commands"
copy /Y "agentes\*.md" ".claude\agents\" >nul
copy /Y "comandos\*.md" ".claude\commands\" >nul
echo.
echo Agentes instalados en .claude\agents:
dir /b ".claude\agents"
echo.
echo Comando instalado en .claude\commands:
dir /b ".claude\commands"
echo.
echo Listo. Abre Claude Code en esta carpeta y escribe /agents para comprobarlo.
pause
