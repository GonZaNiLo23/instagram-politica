# Configuración de la publicación en la nube (pasos de la persona usuaria)

Estos pasos crean cuentas o dan permisos, así que los hace la persona usuaria. Claude prepara todo lo técnico y comprueba cada paso al terminar. Ninguna clave se escribe en el chat: se pegan directamente en `herramientas/publicar-api/.env` (local) o en los secretos de la nube.

## 1. GitHub (repositorio privado)
1. Si no tienes cuenta: https://github.com/signup (gratis).
2. En la terminal de Claude Code escribe `! gh auth login` y sigue el asistente: GitHub.com → HTTPS → "Login with a web browser". Se abre el navegador y confirmas el código.
3. Avisa a Claude: crea el repositorio **privado** y sube el proyecto (sin `.env`, renders ni dependencias).

## 2. Instagram profesional + página de Facebook
1. En la app de Instagram: Configuración → Tipo de cuenta y herramientas → cambiar a **cuenta profesional** (Creador o Empresa), si no lo es ya.
2. Vincúlala a una **página de Facebook** (Meta Business Suite → Configuración → Cuentas de Instagram). Si no tienes página, créala con el nombre de la cabecera.

## 3. App de Meta para desarrolladores
1. https://developers.facebook.com → "Mis apps" → **Crear app** → caso de uso "Gestionar mensajes y contenido en Instagram" (o tipo **Business**).
2. Añade el producto **Instagram** (API con inicio de sesión de Facebook) y pide los permisos `instagram_basic`, `instagram_content_publish`, `pages_show_list` y `pages_read_engagement`.
3. Mientras la app está en modo desarrollo, tú (administradora de la app) puedes publicar en tu propia cuenta sin revisión de Meta.
4. Para un token que no caduque: Meta Business Suite → Configuración del negocio → Usuarios → **Usuarios del sistema** → crear uno "Administrador", asignarle la app y la cuenta de Instagram, y **Generar token** con esos permisos.
5. Pega en `herramientas/publicar-api/.env`: `IG_ACCESS_TOKEN=` (el token) e `IG_USER_ID=` (Claude te ayuda a sacarlo con el token).

## 4. Cloudflare R2 (alojamiento de los archivos que Instagram descarga)
1. https://dash.cloudflare.com/sign-up (gratis; R2 tiene un nivel gratuito, pide una tarjeta para activarlo).
2. R2 → **Crear bucket** (`occidente-publicaciones`) → Ajustes → **Acceso público** → activar la URL `r2.dev`.
3. R2 → **Administrar tokens de API** → crear token con permiso "Lectura y escritura de objetos" solo para ese bucket.
4. Pega en `herramientas/publicar-api/.env`: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` y `R2_PUBLIC_URL`.

## 5. Prueba
Claude ejecuta `node herramientas/publicar-api/instagram.mjs historia <imagen> --prueba` (sube y prepara sin publicar). Si va bien, la primera publicación real la decides tú.

## 6. Agentes en la nube
Con el repositorio en GitHub, Claude crea los agentes programados (historia de mercados a las 22:15, producción nocturna, programación de lo aprobado) y guarda las claves como secretos del entorno en la nube.
