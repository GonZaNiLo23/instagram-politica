# Vídeo: cómo se usa

Proyecto Remotion (React + TypeScript), 1080x1920, 30 fps. Cada pieza es sobre todo **datos** (`escenas.json`), no código.

## Requisitos (ya instalados en este equipo)
Node 24 y ffmpeg 9 (winget). En Git Bash `node` puede no estar en el PATH: usa `export PATH="/c/Program Files/nodejs:$PATH"` o PowerShell. Los scripts localizan ffmpeg/ffprobe solos.
Primera vez: `cd videos/remotion && npm install` (ya hecho). Las fuentes (Archivo Black, Inter, JetBrains Mono) se descargan de Google Fonts al renderizar: hace falta internet.

## Flujo de una pieza
1. `videos/piezas/NNN-slug/escenas.json`: copia `videos/plantillas/flash.escenas.json` (20-35 s) o `estandar.escenas.json` (60-90 s) y rellénalo con las escenas del guion aprobado (tiempos en segundos).
2. `node videos/scripts/render.mjs NNN-slug --v=v1` hace todo: voz, props, render H.264 CRF 18, normalización a -14 LUFS, ffprobe, 6 fotogramas en `control/` y `portada.png`. Salida: `videos/renders/NNN-slug-v1.mp4`.
   - Solo la voz: `node videos/scripts/voz.mjs NNN-slug` (extrae "Texto de voz limpio" de `guiones/aprobados/NNN-slug.md` a `voz.txt`; edítalo para guías fonéticas, p. ej. "Limósh").
   - `--voz` fuerza regenerar la voz; `--aviso` pinta "VOZ PROVISIONAL" en pantalla (solo pruebas internas); `--objetivo=32` fija la duración objetivo para la comprobación (±5 s).
3. Vista previa interactiva: `cd videos/remotion && npx remotion studio` (pasa las props de `piezas/NNN/props.json`).

## Voz y subtítulos
- **Azure Speech** (principal): rellena en `videos/.env` `AZURE_SPEECH_KEY` y `AZURE_SPEECH_REGION` (`francecentral`). `node videos/scripts/voz.mjs NNN-slug` genera `voz.mp3` y `tiempos.json` con marcas por palabra. (Script escrito; pendiente de probar con la clave real.)
- **PROVISIONAL** (sin clave): voz del sistema de Windows si hay voz en español; si no, silencio. Tiempos estimados a 150 palabras/min. `tiempos.json` lleva `"provisional": true` y el script avisa. **Nunca publicar con voz provisional.**
- Whisper como alternativa de marcas de tiempo: no implementado (hace falta Python/whisper; no instalado).

## escenas.json
```
{ "plantilla": "flash"|"estandar", "duracion": 32, "portadaSegundo": 1.5, "marca": "@loquepasaenunminuto",
  "escenas": [ {"inicio": 0, "fin": 4, "fondo": "crema"|"tinta"|"mostaza",
                "lectura": true,        // etiqueta NUESTRA LECTURA fija (usar con fondo tinta)
                "sinSubtitulos": true,  // p. ej. en el cierre
                "fuente": "INE",        // pinta "Fuente: INE" a 36 px
                "componentes": [ {"tipo": "...", ...props} ] } ] }
```
Los tiempos `en`/`hasta` de cada componente son segundos **desde el inicio de su escena**.

| tipo | props principales |
|---|---|
| `gancho` | texto, resalta, y, tamano (110-140), en |
| `rotulo` | texto (máx. 7 palabras; avisa si no), y, pastilla, en, hasta |
| `sello` | valor: "MITO" o "DATO", en, y |
| `contador` | desde, hasta, dur, prefijo, sufijo, etiqueta, y |
| `barras` | datos [{etiqueta, valor, color}], max, sufijo (eje desde 0) |
| `lineaTiempo` | hitos [{etiqueta, detalle, en}] |
| `hemiciclo` | grupos [{nombre, escanos, color o partido, en}], total (350), ancho, centro, leyenda |
| `cierre` | frase, pregunta (Guárdalo + Fuentes en la descripción + logo, ya incluidos) |

Se añaden solos: logo (esquina sup. izq.), subtítulos (palabra activa en mostaza, y=1150) y barra de progreso en Estándar. Sobre fondo tinta los textos pasan a crema.
Zonas seguras (en `src/tema.ts`): nada importante en y<250, y>1500 ni x>960. Contenido propio: y entre 330 y 1130 para no chocar con los subtítulos.
Colores de partidos: solo vía `partido` en `hemiciclo` (PP, PSOE, VOX, SUMAR, ERC, JUNTS, BILDU, PNV, OTROS), con leyenda por nombre.

## Añadir un componente nuevo
Crea `src/componentes/X.tsx`, expórtalo y regístralo en `src/componentes/index.tsx` (`REGISTRO`). Reutilízalo luego desde cualquier JSON.

## Pendiente de la infraestructura
Componentes `Mapa` (España/Francia en SVG), `Icono` (móvil, carrito, edificio, lupa...), `Transicion` y silueta de busto. Logo y nombre de cuenta aplicados (ver `videos/marca/`). Música: una pista por pilar con el campo `musica` de `escenas.json` (pistas y licencias en `videos/musica/`).

## Fotos reales y componentes añadidos (pieza 004 v4)
- Fotos en `piezas/NNN-slug/imagenes/` (se leen con `staticFile('imagenes/...')`). Componentes: `foto` (forma `rect` | `circulo` | `completa`, Ken Burns `zoom`/`pan`, `credito` de 36 px y `notas`), `comparador` (barrido antes/después con créditos), `notas` (notas y créditos de 36 px alineados abajo, o en `y` fija), `caja` (pastilla tinta tras un texto sobre foto), `barrasV` (barras verticales con eje desde 0), `lineaVertical` (línea de tiempo vertical con fechas), `marca` (logo como componente).
- Iconos nuevos (en `IconosFrancia.tsx`): instituto, aula, pupitre, chaleco, megafono, bombilla, relojArena, hucha, nomina, pensiones, balanzaSaco, matignon, asamblea, escaparate, manos, pin, eeuu, reloj, tarjetas, pancartaCheck, edificioAspa, cartel. `Icono` admite `disco: true` (disco crema detrás, para fondo tinta). `Mapa`, `Barras` y `Sello` admiten `hasta`; `Sello` admite `x`; `Mapa` incluye Saint-Étienne.
- Caras de menores o público: se difuminan antes de usar la foto (ver `imagenes/F4b.jpg`, `F6b.jpg`); los retratos se recortan cuadrados con el mismo encuadre (`ret-P1..P4.jpg`).
- `piezas/004-disturbios-francia/_generar-escenas.mjs` genera `escenas.json` desde `tiempos.json` (tiempos reales de palabra).
- `voz.mjs` ya no incluye en `voz.txt` las notas del guion que empiezan por `>`.
