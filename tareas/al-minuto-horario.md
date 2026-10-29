# Rutina "Al minuto horario" (nube, cada hora a y 25, de 06:25 a 21:25 en España; se publica en punto: 07:00…22:00)

Decisión de la persona usuaria del 2026-10-29: cada hora se publica **directamente, sin revisores**, el vídeo del momento más relevante (nota 3–5) en formato Al minuto. Lo único que lo para es un veto en `estado/vetos.md`. Tú no publicas: encargas el render con `"publicar": true` y GitHub Actions renderiza y publica.

## 0. Antes de nada
- `git pull --rebase`.
- **Lanza el radar:** escribe la hora UTC actual en `cola/radar/pedir.txt`, haz commit ("Al minuto: pedir radar") y `git push` (con `git pull --rebase` si hace falta). Eso arranca `.github/workflows/al-minuto.yml`.
- **Espera sus resultados:** cada 30 s, `git pull --rebase -q` y mira el campo `generado` de `estado/al-minuto/candidatos.json`. Sigue cuando sea posterior a la hora que escribiste en `pedir.txt` (suele tardar 6–9 min). Si a los 20 min no ha llegado, apunta "radar sin respuesta" en `estado/al-minuto/registro.md`, haz commit y push y termina.
- Si no hay candidatos con `frases`, apunta "sin candidatos" en el registro y termina.
- Lee: el bloque de decisiones del principio de `estilo/linea-editorial.md`, la sección "Formato Al minuto" de `estilo/guia-estilo.md`, `estado/vetos.md`, las últimas 30 líneas de `estado/al-minuto/registro.md`, y como ejemplo `videos/piezas/029-luto-oficial/escenas.json`.

## 1. Puntúa cada candidato (1–5)
Suma de dos cosas, redondeada:
- **Relevancia:** situación política y geopolítica de España y Europa (Gobierno, oposición, UE, inmigración, defensa, Ucrania, Oriente Medio, aranceles, corrupción, tribunales, elecciones), declaraciones de líderes con frase clara.
- **Potencial viral:** el campo `viral` del radar (me gusta y comentarios por hora relativos a los seguidores), frase rotunda o choque, interés para nuestra audiencia (espacio afín PP, SALF y Vox).
Baja la nota si: no habla nadie o no se entiende sin contexto; es publicidad, música o un mitin sin frase; el mismo tema ya se publicó en las últimas 6 h (mira el registro); es un suceso con víctimas tratado con morbo.
Los de `prioridad: "buzón"` los ha mandado la persona usuaria: publícalos si tienen archivo, salvo que sean imposibles de montar (si no tienen archivo, apunta en el registro por qué).

## 2. Si el mejor tiene nota 3 o más, móntalo
- **Id:** `am<AAAAMMDD>-<HHMM UTC>-<slug corto>` (minúsculas, sin tildes).
- **Tramo:** 15–40 s del vídeo de origen con frases completas (usa `palabras` del candidato; corta en pausas, nunca a mitad de palabra; como mucho 2 tramos). Que se entienda solo y que no cambie el sentido de lo que dice.
- **Titular** (caja fija, máx. 8 palabras, mayúsculas): quién + qué. Ej.: "ABASCAL PIDE SUSPENDER LA CAMPAÑA". Sin adjetivos de opinión.
- **Subtítulos** (`citas`): literales, sin el nombre de quien habla, máx. 2 líneas y unos 45 caracteres por subtítulo, 1–6 s cada uno, cortes en pausas lógicas. Tiempos en segundos del **clip** (resta el inicio del tramo; con 2 tramos, acumula). Corrige solo errores evidentes de Whisper (nombres propios), nunca el contenido.
- `videos/piezas/<id>/escenas.json` a partir de `videos/plantillas/alminuto.escenas.json`: `"sinVoz": true`; escena 1 de 0 a D (D = duración del clip) con `clip` (`src: "clip.mp4"`, `fundidoFin: D`, `dur: D`), `titularAM` (`texto`, `fecha` "29 OCT", `credito`: "Vídeo: @cuenta" o "Vídeo: La Moncloa · DD-MM-AAAA") y `citas`; escena 2 de D a D+3,5 en mostaza con `cierre` (`frase` corta que resume el hecho, `guardaEn`: 0.1) y `sinSubtitulos`; `duracion` = D+3,5; `portadaSegundo` 1.
- `publicado/<id>.md` con `## Texto del post`: 2–4 líneas con la línea editorial (periódico afín a PP, SALF y Vox: qué significa, a quién beneficia o perjudica, crítica al Gobierno y sus socios cuando toque), luego el crédito ("Vídeo: @cuenta"; si es de La Moncloa: "Origen de los datos: sitio web de lamoncloa.gob.es. Ministerio de la Presidencia, DD-MM-AAAA"), "👉 Síguenos para estar informado" y 3–5 hashtags. Máx. 2.200 caracteres.
- **Autocomprobación (obligatoria, no es una revisión externa):** cada subtítulo está en la transcripción; todo lo que la descripción atribuye a alguien se oye en el clip o está en el texto del reel de origen; ninguna acusación de delito que no esté probada o juzgada; ningún dato inventado. Si algo falla, corrígelo; si no se puede, no lo publiques y pasa al siguiente candidato.
- **Encargo de render** `cola/render/<id>.json`: `{"pieza": "<id>", "version": "v1", "publicar": true, "clip": {"asset": "<archivo del candidato>", "tramos": "<a-b[,c-d]>", "modo": "recorte", "foco": 0.5}}`. Si el origen es horizontal (16:9) y la persona no está centrada, ajusta `foco` (0 = izquierda, 1 = derecha) o usa `"modo": "fondo"`.

## 3. Registro y subida
- Añade a `estado/al-minuto/registro.md` una línea por candidato: hora, nota, cuenta, decisión (publicado con id / descartado y por qué).
- Si publicas, añade también la pieza a `estado/pipeline.md` (una línea en la tabla, estado "publicando (Al minuto horario)").
- `git add` de lo que has creado, commit "Al minuto horario: <id o 'sin publicación'>", `git pull --rebase` y `git push`. Nunca toques `estado/cola-publicacion.json` (lo hace el render) ni las claves.
- Como mucho **una pieza por hora**.
