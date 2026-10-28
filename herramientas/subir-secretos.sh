#!/usr/bin/env bash
# Copia las claves de videos/.env y herramientas/publicar-api/.env a los secretos del repositorio de GitHub
# (los usa .github/workflows/render.yml). No imprime ningún valor. Lo ejecuta la persona usuaria:
#   bash herramientas/subir-secretos.sh
set -euo pipefail
cd "$(dirname "$0")/.."
GH=$(command -v gh || echo "/c/Program Files/GitHub CLI/gh.exe")
REPO=GonZaNiLo23/instagram-politica

subir() { # subir <archivo .env> <clave>…
  local f=$1; shift
  for k in "$@"; do
    v=$(grep -m1 "^$k=" "$f" | cut -d= -f2- || true)
    if [ -z "$v" ]; then echo "  $k: vacía en $f, no se sube"; continue; fi
    printf '%s' "$v" | "$GH" secret set "$k" -R "$REPO" >/dev/null
    echo "  $k: subida"
  done
}

subir videos/.env ELEVENLABS_API_KEY ELEVENLABS_VOICE_ID ELEVENLABS_MODEL ELEVENLABS_AJUSTES
subir herramientas/publicar-api/.env IG_USER_ID IG_ACCESS_TOKEN TIKTOK_CLIENT_KEY TIKTOK_CLIENT_SECRET TIKTOK_REFRESH_TOKEN
"$GH" secret list -R "$REPO"
