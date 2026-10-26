# Revisión de vídeo · 009-cambio-de-hora-ue · vuelta 1
**Veredicto:** APROBADO  →  vuelve a: coordinador (listo para la aprobación de la persona usuaria)
**Técnica:** 1080×1920 · 30 fps · H.264 + AAC 44,1 kHz · 99,7 s (voz hasta 97,84 s, cola de 1,86 s) · -14,1 LUFS · pico -1,4 dBTP · sin cortes (los silencios son pausas de frase)
**Test de formato Reel/TikTok:** 9/10 (duración fuera de 60–90 s, pero dentro de los 90–120 s pedidos y no penalizada aquí)

## Obligatorio (bloqueante)
Ninguno.
- Literales: los 32 rótulos y todas las notas de `escenas.json` coinciden con el guion (4,6 MILLONES DE RESPUESTAS; 84 %; ALEMANIA 3,79 %; ESPAÑA 0,19 %; 26-3-2019: 410 A FAVOR con "410 a favor · 192 en contra · 51 abstenciones"; HASTA 2031; CANARIAS: A LAS 2, SERÁ LA 1). Sin erratas vistas.
- Solo informativo, sin opinión ni burla. Sánchez solo como silueta de busto con paráfrasis sin comillas y nota "No eligió entre verano e invierno". España y Polonia con el mismo tratamiento (icono + rótulo + nota, dos escenas cada una).
- Gráficos honestos: barra del 84 % con eje 0 / 50 / 100 % rotulado y tramos "84 % quitarlo / 16 % resto"; barras de participación con eje 0–4 % rotulado (0,1,2,3,4 %), Alemania llega a 3,79 % (final de la animación, no 3,2 %) y España es una barra corta pero visible con su "0,19 %". Ninguna etiqueta cruza líneas de referencia.
- EJEMPLO: etiqueta en tinta desde el primer fotograma de la escena 50,1 s hasta el final de la frontera (56,6 s), sin sello DATO ni "Fuente".
- Fotos y créditos: las 4 con autor, licencia CC BY-SA y "Wikimedia Commons" en cada aparición. F2 (edificio Europa): sin matrículas ni coches en el recorte usado (solo parte alta de la fachada); se ven andamios, no es un fallo. F1: solo escaños del hemiciclo, sin tribuna del público. F3 y F4 limpias.
- Sincronía voz-subtítulos y escenas: desvío ≤ 0,06 s en 30 de 31 inicios de frase (escena 61,06 s vs "Dos" a 61,16: 0,10 s, vale; escenas cortan 0,10 s antes de la palabra por diseño). Lectura ≥ palabras ÷ 3 en los 32 rótulos (el más justo: "¿QUÉ HA PASADO?" 3 palabras en 1,12 s).
- Ritmo: `select` 0,004 sobre la zona de contenido solo deja un hueco en el cierre (95,1–99,4 s); a 0,001 desaparece (pulso del cierre). Resto, Ken Burns y animaciones continuas sin huecos > 3 s. Se recomienda mantener el cierre como está (voz + 1,86 s).
- Zonas seguras: nada con x > 960 salvo la palabra "previsto" del hito final, que acaba justo en x ≈ 960 (ver Recomendado). Notas ≤ y 1490: la de 4 líneas de 28,5–32 s llega a ≈ 1486 y la de 3 líneas de 43,7 s a ≈ 1465.
- Componente compartido: `SelloTexto` gana `desde` con valor por defecto 700 (el comportamiento anterior). Solo lo usan además 004 (×2), 005 y 006, sin `desde`, así que no cambian. Las demás piezas no necesitan revisión.

## Formato Reel/TikTok
1. Gancho (0–3 s): contradicción clara "2019: VOTARON QUITARLO · DOMINGO: OTRA VEZ" con sello 2019 y reloj. Bien. Detalle: en el fotograma 1 rótulo y reloj están a ~25 % de opacidad (entrada con fundido); ver Recomendado.
2. Sin sonido: se entiende la historia con la línea de tiempo 2018 → 2019 → 2025 → HOY y los rótulos.
3. Duración 99,7 s: aceptada por el encargo. Giro "¿LO CURIOSO?" al 77 %, compensado por el dato Alemania/España (18–25 s).

## Recomendado (todo comprobable en un fotograma)
1. [86,5–88,6 s] Etiqueta "previsto" del hito final acaba en x ≈ 960 (fotograma 88,4 s, recorte x 780–1080): moverla 20–30 px a la izquierda (o "2026" y "previsto" centrados bajo el hito). Declarado y aceptable: el guion pedía "FINALES 2026 · Estudio" y el generador usa "2026 / previsto".
2. [0,05 s] Rótulo y reloj del primer fotograma al 25 %: el guion pide el rótulo "desde el fotograma 1"; poner `en` = 0 sin fundido (ganchos de 1 s).
3. [28,5–32 s] Nota de 4 líneas hasta y ≈ 1486: acortar el crédito o ensanchar la nota para dejar margen.
4. [0–32 s] Hito 2019 sin escena propia: aceptable; el hito se enciende en 56,6 s ("ya"). Barras sin siluetas de países: aceptable y mejor para el equilibrio.
5. [portada] Flecha-reloj tapa parte de la segunda esfera de la torre; título y crédito dentro del recorte 4:5. Sin cambio necesario.

## Dónde escuchar (no he podido oír el audio)
- "cuatro millones seiscientas mil": 12,48 s ("cuatro") a 14,2 s ("respuestas"); "mil" a 13,92 s.
- "cero coma dos": 23,44 s ("cero") a 24,2 s ("dos" a 23,92 s).
- "dos mil treinta y uno": 80,48 s a 81,7 s ("treinta" 80,8; "uno" 81,28).
- "Pirineos": 55,68–56,64 s.
- Extras: "ochenta y cuatro por ciento" desde 15,28 s; "Alemania" 18,88 s; "cuatrocientos diez" 30,0 s; "Canarias" 92,16 s.

## Lo que funciona bien
- Técnica y volumen en rango, voz real Dani v4, sincronía precisa.
- Cifras literales, gráficos honestos con escala rotulada, EJEMPLO continuo, créditos en cada foto.
- Equilibrio España/Polonia, Sánchez solo como silueta, sin banderas ni opinión.
- Cierre con bucle (reloj partido sol/luna del mismo tamaño), 📌 y fuentes.

Nota para el coordinador: antes de publicar (23 o 24-10) recomprobar el estado del Consejo en el OEIL (dato vivo, marcado en el guion).
