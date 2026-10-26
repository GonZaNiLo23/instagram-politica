# Memoria · monitoreador

- [cuenta] Metricool, marca "loquepasaenunminuto" (blogId 7542188, userId 5874684). Análisis de TikTok: `https://app.metricool.com/evolution/tiktok?blogId=7542188&userId=5874684`; el de Instagram, en la misma ruta con `instagram`. (2026-10-20)
- [Metricool] El periodo por defecto queda fijado en un rango antiguo (22 sep-4 oct): abrir el selector (1132,102) y pulsar "Mes actual" (1128,190). Luego get_page_text lista los posts/reels con todas las columnas. Sin selección previa, get_page_text devuelve vacío. (2026-10-22)
- [Metricool] Planificación: /planner/calendar funciona; /planner/list da 404. Los datos llegan con 1-2 días de retraso. TikTok no da alcance, guardados ni % visto; IG sí da tiempo medio y "% visualización (+3 seg.)". Plan gratuito: 20 publicaciones/mes. (2026-10-22)
- [Metricool] Planificación > "Listado" (/planner/history): get_page_text da fecha/hora, texto y estado (Publicado/Pendiente) de todo el mes más el cupo "N de 20"; más rápido que el calendario. (2026-10-25)
- [Metricool] Analítica IG/TikTok ya abre con el mes completo; 5 filas por página, botón "Página siguiente" localizable con find. Columnas IG: alcance, visual., interacciones, likes, guardado, compartidos, comentarios, engagement, t. medio, t. total, duración, %retención, %+3 s. TikTok: visual., likes, comentarios, compartidos, duración. El periodo acaba el día anterior. (2026-10-25)
- [Inbox] /inbox solo IG; get_page_text no devuelve la lista: usar zoom sobre la columna izquierda. TikTok sin inbox en Metricool. (2026-10-25)
- [Shell] Heredocs largos con comillas en Bash fallan a veces: usar Write para informes. (2026-10-25)
- [Metricool] IG puede mostrar "Estamos sincronizando tus datos": get_page_text devuelve vacío 1-2 s tras navegar; esperar 5-8 s con wait y reintentar. Con sincronización pendiente las cifras IG salen idénticas a ayer. (2026-10-26)
- [Metricool] El lunes el periodo "1-25 oct" ya cargaba solo; 2 páginas (5+4 filas) con find "Página siguiente" + click por ref. Posts del día anterior (008, 024) tardan >24 h en aparecer. (2026-10-26)
- [Seguidores] Metricool TikTok dio 32 mientras el plan decía 40: confirmar en TikTok Studio. Seguidores ganados por vídeo no están en Metricool. (2026-10-26)
