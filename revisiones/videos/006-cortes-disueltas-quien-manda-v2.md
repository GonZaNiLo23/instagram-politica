# Revisión de vídeo · 006-cortes-disueltas-quien-manda · vuelta 2
**Veredicto:** CAMBIOS  →  vuelve a: generador-video (un ajuste de tiempos de 0,3 s; sin tocar guion ni voz)
**Técnica:** 1080×1920 · 30 fps · 79,03 s · H.264 + AAC · -14,1 LUFS · pico -1,3 dBTP · voz real (ElevenLabs, `provisional: false`); sin rótulo "VOZ PROVISIONAL".
**Test de formato Reel/TikTok:** 9/10 (criterio justo: 5, hueco de 3,06 s en el cierre)

## Lista cerrada de la vuelta 1
- CTA en pantalla: CORREGIDO. "Cuéntamelo en comentarios" aparece en 75,8 s con la voz (75,80 s) y se queda hasta el final; el cierre lleva "¿LO SABÍAS?", CTA, "Guárdalo" y "Fuentes en la descripción".
- Pin: CORREGIDO, ahora es 📌 (chincheta inclinada).
- "de" suelta del subtítulo: CORREGIDO. El corte es "ni Presupuestos ni proyectos / de ley.".
- Regresión (hojas de contactos, 3 hojas): sin escenas nuevas ni cambios de composición. Los tramos sin cambios conservan la valoración de la vuelta 1 (neutralidad del hemiciclo, sin personas, gráficos sin manipulación, tamaños de rótulos, fuentes en pantalla).

## Obligatorio (bloqueante)
1. [34,86–36,56 s] El rótulo "NO PUEDE AFECTAR A DERECHOS, AUTONOMÍAS…" (6 palabras) dura 1,7 s; el mínimo es 2,0 s (1 s por cada 3 palabras). El guion le daba 2,2 s y se acortó al reanclar a la voz. → Alargar esa escena a 34,86–36,9 s (retrasando 0,35 s el inicio de la escena "VOTO OBLIGATORIO EN 30 DÍAS"; la voz "Entra en vigor ya" empieza a 36,0 s y "pero el Congreso debe votarlo" a 37,2 s, así que el rótulo de 30 días sigue entrando antes de la voz). Mover a la vez el cronómetro (`en` 0,17).

## Formato Reel/TikTok
1. [75,97–79,03 s] Cierre estático 3,06 s (la voz acaba en 77,2 s y el resto es cola). → Recortar la cola a ≈ 78 s (queda 0,8 s tras la voz) o animar algo (el pin o el rótulo con un pequeño muelle a los 77 s). Bajar de 3 s es lo único que hace falta.
2. Sin sonido: se entiende (un rótulo por idea, 64 px o más, semáforo, balanza, cronómetro). Gancho desde el fotograma 1 y bucle con el cierre (hemiciclo apagado → encendido).

## Comprobado en esta vuelta (los tiempos se reanclaron a la voz nueva)
- Fidelidad: los 22 rótulos, notas y fuentes de `escenas.json` coinciden con el guion; las 209 palabras de `tiempos.json` coinciden una a una con `voz.txt` y con el texto de voz limpio.
- Sincronía voz-subtítulos: inicio de cada frase tras pausa frente a `silencedetect` del audio, desviación ≤ 0,08 s en todas las pausas (lo demás son colas de palabra de ~0,3 s, normales). Sin cortes de audio.
- Loudness: -14,1 LUFS, -1,3 dBTP. Los únicos silencios > 0,25 s son pausas de la voz y la cola final.
- Zonas seguras (`drawbox` en 12 fotogramas, y=250–1500, x ≤ 960): rótulos, subtítulos (y≈1200), fuentes (la de 2 líneas llega a y≈1465) y notas dentro. Extremos: "AUTONOMÍAS…" x≈942 y etiqueta "Congreso" x≈951. Bien.
- Ritmo: 487 cambios en la zona de contenido; ningún hueco > 3 s salvo el cierre. Los rótulos cumplen 1 s por 3 palabras, salvo el del bloqueante.
- Voz real aplicada: los rótulos entran con la voz (p. ej. "LEYES EN TRÁMITE" a 12,32 s con "las leyes" a 12,4 s; "AHORA VOTA LA DIPUTACIÓN" a 43,53 s con "Con las Cortes" a 43,44 s). Duración 79 s, dentro de 60–90.

## Recomendado
1. [15,67–21,85 s] El hemiciclo con zoom a los 69 puntos se sale del cuadro por ambos lados (llega a x > 960 y a x = 0). Es gráfico, no texto, y es lo que pedía el guion ("zoom a ese grupo"), pero la regla de anchura dice x ≤ 960 también en la animación. → Limitar el zoom o aceptarlo expresamente.
2. [34,86–38 s] Los candados siguen tapando la mitad inferior del libro y del mapa (ya señalado en la vuelta 1). → Moverlos a la esquina inferior derecha del icono. Prioridad baja; el rótulo ya explica la idea.
3. [71,12–75,61 s] La fuente del cierre sale como "Fuente: RD 806/2026, art. 5 · CE art. 78.3" y el guion pone "RD 806/2026, art. 5 · CE art. 78.3" sin "Fuente:". Dato correcto; si se quiere literal exacto, quitar el prefijo, o confirmar con el coordinador que el prefijo es la convención.
4. Subtítulos que cortan en artículo o preposición ("…disolución de / las Cortes", "…el / BOE"). Es el estilo de pastilla por trozos y se lee bien; solo se vigilan si en otra pieza aparece un trozo de una sola palabra.

## Lo que funciona bien
- Gancho claro desde el fotograma 1 y cierre que responde la pregunta y devuelve el hemiciclo encendido.
- Sellos SPOILER (13,2 s) y DATO (53 s) dan el momento compartible y retienen hasta el giro.
- Neutralidad impecable (hemiciclo sin colores de partido, sin personas) y fuente en pantalla en cada dato.
- Sincronía voz-subtítulos ≤ 0,08 s y audio dentro de rango con la voz real.
