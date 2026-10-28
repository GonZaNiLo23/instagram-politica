# Configuración de la publicación en la nube (pasos de la persona usuaria)

Estos pasos crean cuentas o dan permisos, así que los hace la persona usuaria. Claude prepara todo lo técnico y comprueba cada paso al terminar. Ninguna clave se escribe en el chat: se pegan directamente en `herramientas/publicar-api/.env` (local) o en los secretos de la nube.

## 1. GitHub (repositorio privado)
1. Si no tienes cuenta: https://github.com/signup (gratis).
2. En la terminal de Claude Code escribe `! gh auth login` y sigue el asistente: GitHub.com → HTTPS → "Login with a web browser". Se abre el navegador y confirmas el código.
3. Avisa a Claude: crea el repositorio **privado** y sube el proyecto (sin `.env`, renders ni dependencias).

## 2–5. Meta e Instagram (HECHO el 2026-10-28)
- Desarrollador de Meta: Facebook personal "[persona usuaria]". App **Occidente Publicador** (ID 1659328179198880, modo desarrollo), caso de uso de Instagram con **inicio de sesión con Facebook** (en esta cuenta no aparece la variante con inicio de sesión de Instagram). Permisos: instagram_basic, instagram_content_publish, instagram_manage_insights, pages_read_engagement, pages_show_list, business_management.
- Página de Facebook **Lo que pasa en un minuto** (id 61595882946292) vinculada a @loquepasaenunminuto.
- En `.env`: `IG_USER_ID=17841461067202034` y `IG_ACCESS_TOKEN` = token de la página (no caduca; se obtuvo de `me/accounts` con un token de usuario ampliado a 60 días). Si se cambia la contraseña de Facebook o se quitan permisos a la app, hay que regenerarlo igual: Explorador de la API Graph → Generate Access Token → ampliar en el depurador → `me/accounts?fields=access_token`.
- **Sin Cloudflare R2 (0 €):** `instagram.mjs` sube los vídeos directamente a Meta (subida reanudable a `rupload.facebook.com/ig-api-upload/<id>`, sin versión en la ruta, con espera y reintentos). Las imágenes de historias se convierten antes en vídeos de 5 s con ffmpeg.
- Prueba superada el 2026-10-28 con `--prueba` (reel 002 e historia de mercados): contenedores listos, nada publicado.

## 6. Render en la nube (HECHO el 2026-10-28)
`.github/workflows/render.yml` ("Render de pieza"): renderiza en un servidor de GitHub (≈ 4 min por pieza de 30 s; gratis dentro de los minutos del plan), devuelve vídeo, portada y fotogramas de control como artefacto (14 días), guarda en el repositorio la voz y la portada, y si se pide sube a Instagram (`prueba` o `reel`). Lanzarlo: GitHub → Actions → Render de pieza → Run workflow, o `gh workflow run render.yml -f pieza=NNN-slug -f version=v1`. Probado con 015: mismo resultado que en el PC.
Secretos necesarios (los pone la persona usuaria; Claude no puede escribir en el almacén de secretos): ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID, ELEVENLABS_MODEL, ELEVENLABS_AJUSTES, IG_USER_ID, IG_ACCESS_TOKEN.

## 7. Agentes en la nube
Con el repositorio en GitHub, Claude crea los agentes programados (historia de mercados a las 22:15, producción nocturna, programación de lo aprobado) y guarda las claves como secretos del entorno en la nube.
