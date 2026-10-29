# Auditoría de TikTok para publicar directamente (Direct Post)

Sin auditoría, lo publicado por la API sale **privado** (solo lo ve la cuenta). Mientras tanto, cada pieza llega a la bandeja de borradores.
Lo envía la persona usuaria desde developers.tiktok.com: supone aceptar las condiciones de TikTok en su nombre.

## Páginas públicas (GitHub Pages, sin datos personales)
- Web: https://gonzanilo23.github.io/instagram-politica/
- Condiciones: https://gonzanilo23.github.io/instagram-politica/terminos.html
- Privacidad: https://gonzanilo23.github.io/instagram-politica/privacidad.html

## Pasos en el portal (app "Occidente Publicador")
1. **App details:** Website URL, Terms of Service URL y Privacy Policy URL → las tres de arriba (sustituyen a la página de Facebook provisional).
2. **Products → Content Posting API:** activar **Direct Post** (además de la subida a borradores que ya está).
3. **Scopes:** añadir `video.publish` (se mantienen `user.info.basic` y `video.upload`).
4. **Submit for review** con los textos de abajo y el vídeo de demostración.
5. Al aprobarse: volver a autorizar la app (`node herramientas/publicar-api/tiktok.mjs autorizar`, para que el refresh token incluya `video.publish`), subir el refresh token nuevo a los secretos (`herramientas/subir-secretos.sh`) y crear la variable del repositorio `TIKTOK_DIRECTO` = `1` (GitHub → Settings → Secrets and variables → Actions → Variables). Desde ese momento `cola.mjs` publica en TikTok con el mismo texto que en Instagram.

## Texto de la solicitud (en inglés, como lo pide TikTok)
**App description:**
Occidente Publicador is an internal publishing tool for the Spanish news outlet "Lo que pasa en un minuto" (@loquepasaenunminuto). It uploads the short news videos produced by our newsroom to our own TikTok account. It is used only by the account owner; it does not manage third-party accounts and does not collect any user data.

**How do you use each product / scope:**
- `user.info.basic`: to identify our own account after authorization.
- `video.upload`: to send videos to our account's draft inbox for manual review.
- `video.publish` (Direct Post): to publish our own news videos to our own account at scheduled times (on the hour). Before each post the tool queries creator_info, uses only the privacy options returned for the account, and keeps comments, duet and stitch enabled. Captions credit the original source of any third-party clip.

**Demo video (lo graba la persona usuaria, 1–2 min, pantalla del ordenador):**
1. Autorización: abrir el enlace de `tiktok.mjs autorizar`, iniciar sesión en la cuenta de la marca y aceptar los permisos.
2. Publicación: ejecutar `node herramientas/publicar-api/tiktok.mjs publicar <video.mp4> <texto.txt>` con un vídeo de prueba.
3. Resultado: enseñar el vídeo publicado en el perfil de TikTok.

## Riesgo conocido
Las normas de TikTok para Direct Post piden que el usuario vea una vista previa y elija la privacidad y las interacciones antes de cada publicación. Una herramienta que publica sola, sin esa pantalla, puede ser rechazada. Si la rechazan: se sigue con los borradores (cumplen las normas) y la persona usuaria publica desde la app con un toque.
