# Memoria · generador-carrusel

- [entorno] Remotion 4.0.250 en `videos/remotion`; marca en `videos/marca/` y `videos/remotion/src/marca`; paleta en `videos/remotion/src/tema.ts`. No hay Python: scripts con node. (2026-10-20)
- [carrusel] Stills 1080x1350 sin tocar Root.tsx compartido: entrada propia `videos/remotion/src/carrusel/index.ts` (Root.tsx + Carrusel.tsx, una diapositiva por prop `indice`). Render: `cd videos/remotion && node render-carrusel.mjs NNN-slug vX` lee `videos/piezas/NNN-slug/carrusel.json` y deja PNG en `carruseles/NNN-slug-vX/`. ~10 s por PNG. (2026-10-26)
- [trampa] Heredocs largos con comillas en Bash fallan en silencio: usa Write. Para saltos de línea en JSON usa Edit, no `node -e` con replace.
- [layout] Contenido y=140–1100 en flex (titular/esquema/pastilla/texto), regla de 54 marcas y=1118, fuente y=1214 (una línea de 28 px, máx. ~70 caracteres). Texto largo de la 6 obliga a etiquetas de esquema de 32–34 px.
- [hoja] `ffmpeg -framerate 1 -i %02d.png -vf scale=432:540,tile=5x2 -frames:v 1 hoja.png`; Read acepta el PNG en %TEMP%.
