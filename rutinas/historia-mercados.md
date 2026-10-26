# Rutina: historia diaria de mercados (lunes a viernes, 22:15 Europe/Madrid)

Instrucciones para el agente programado en la nube. Formato aprobado una vez por la persona usuaria (pendiente de su "aprobado el formato" sobre la plantilla del 2026-10-26); si no consta en CLAUDE.md, **no publiques**: deja la historia renderizada y el informe.

1. `node videos/scripts/mercados.mjs <hoy>`. Si algún activo dice "no hay sesión" para hoy en el IBEX y en Wall Street, es festivo: no hay historia; escribe una línea en `estado/mercados/registro.md` y termina.
2. Contrasta las cifras de cierre del IBEX 35, S&P 500, Dow Jones y Nasdaq con una segunda fuente de referencia (Reuters, AP, WSJ, Expansión o BME). Si alguna difiere en más de 0,01 puntos porcentuales en la variación, no publiques: anótalo en el registro.
3. Busca la causa principal del día en agencias y medios de referencia (Reuters, AP, Bloomberg, FT, WSJ, Expansión, Cinco Días; nunca medios de línea marcada como única fuente). Escribe `estado/mercados/<hoy>-textos.json`:
   - `titular`: máx. 6 palabras, con el hecho que mueve el mercado, sin adjetivos valorativos.
   - `subtitulo`: las dos cifras clave del día.
   - `causas`: 1–2, cada una con `"fuente": "Según <agencia o medio>"`.
   - `fuentes`: "Cierres: Yahoo Finance, contrastados con <segunda fuente>".
   Nunca recomendaciones de inversión, objetivos de precio ni valores como oportunidad.
4. `node videos/scripts/historia-mercados.mjs <hoy>` y revisa los tres PNG (cifras = JSON, textos sin cortes, aviso de inversión presente).
5. Publica las tres pantallas en orden: `node publicar-api/instagram.mjs historia estado/mercados/<hoy>/1-portada.png estado/mercados/<hoy>/2-cifras.png estado/mercados/<hoy>/3-porque.png`.
6. Anota en `estado/mercados/registro.md`: fecha, titular, fuentes, resultado de la publicación (ids o error).
