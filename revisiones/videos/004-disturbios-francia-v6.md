# Revisión de vídeo · 004-disturbios-francia · vuelta 2 (render v6)
**Veredicto:** APROBADO  →  pasa a publicación (la hace la persona usuaria). Con una condición que no es del vídeo: ver "Antes de publicar".
**Técnica:** 1080×1920 · 30 fps · H.264 + AAC · 99,1 s · -14,1 LUFS · pico real -1,4 dBTP (igual que la v5; la voz y los tiempos no han cambiado)
**Test de formato Reel/TikTok:** 9/10 (criterio flojo: 5, ritmo, por un tramo estático de 3,2 s; la duración no se penaliza por encargo)

## Obligatorios de la v5 (en mi informe eran 6, no 7)
| # | Pedido | Resultado en la v6 |
|---|---|---|
| 1 | "¿Y AHORA?" montado sobre la línea de convocatorias y el calendario (73,3–74,1 s) | Corregido. "¿Y AHORA?" y el calendario salen del todo antes de que entre "Próximas convocatorias" (hojas de 0,2 s sin superposición). |
| 2 | Contador "54.000 M€" en la zona derecha (51 s) | Corregido. El análisis de la franja x > 960 cada 0,5 s ya no marca el segundo 51. |
| 3 | "unos 400 de 3.700 institutos" | Corregido: "Fin de sept.: unos 400 institutos afectados" (literal del guion). |
| 4 | Nota del 13-10 recortada | Corregido: "13-10: el PS (socialistas) pidió rechazarlo sin debate · 149 sí / 236 no · el RN votó no: tenía la llave" + "Fuente: Asamblea Nacional (vía LCP, datan)". |
| 5 | Retratos con tratamiento igual | Hecho a medias, pero aceptable: los cuatro van ahora en el mismo tono (blanco y negro con tinte), mismo círculo y mismo marco. Desaparecen cielo, banderas y lámparas como elementos distintivos. Ver "Retratos". |
| 6 | Sello MITO tapa el subtítulo del cierre (94 s) | Corregido: el sello queda a la derecha del móvil, por encima de la pastilla, sin tocarla, y ya no entra en la franja derecha. |

## Retratos
- La sonrisa de Le Pen (foto de 2014) sigue siendo la más cálida del conjunto y es la más antigua (Lecornu 2020; Macron y Mélenchon 2025). Con el tratamiento igual, el desequilibrio queda en un nivel aceptable. Doy por buena la decisión del coordinador de mantenerla porque no hay una foto libre más reciente que sea frontal y neutra.
- El recorte de cara no es idéntico: la cara de Le Pen ocupa algo más del círculo que la de Macron y Lecornu. Como Le Pen y Mélenchon aparecen juntos y con recorte muy parecido, no bloquea. Si se vuelve a tocar, igualar a ≈ 60 %.
- Créditos en pantalla iguales a la tabla en autor y licencia (Macron, Lecornu, Le Pen y Mélenchon).

## Recomendados de la v5
| Recomendado | Resultado |
|---|---|
| Citas de Le Pen y Mélenchon a mayor tamaño | Hecho (≈ 48 px, el nombre sigue en 64 px). El texto de Mélenchon ("Jean-Luc Mélenchon") acaba en x ≈ 946, a 14 px del margen derecho: cumple. |
| Contador 1.200 | Mejorado: 2.397 entra ≈ 0,4 s antes. La nota inferior sigue atribuyendo el 1.200 a "L. Nuñez (18-10)"; es una cuestión del guion (la fuente de ese primer balance es Lecornu), no del vídeo. Pasa al guionista, no bloquea el vídeo. |
| "¿A ti te llegó?" duplicado en el cierre | Corregido (solo queda el subtítulo). |
| Portada de 7 palabras | Corregido: "FRANCIA: QUÉ PASÓ Y POR QUÉ" (6), legible en el recorte 4:5 y con el crédito de F3 en pantalla. |
| Huecos de movimiento | Con `select='gt(scene,0.004)'` sobre la zona de contenido (y 330–1130): ya no queda el hueco del gancho (0,7–3,6 s, el móvil se mueve) ni el de Le Pen y Mélenchon (63–67 s). **Queda uno de 3,2 s (83,9–87,1 s)**, en el bloque "NUESTRA LECTURA", con los dos iconos fijos y subtítulos cambiando. No bloquea (los subtítulos y la última frase de la opinión mueven la pantalla), pero es lo que rebaja el criterio 5. |
| Pancartas "La mayoría, en paz" | Corregido: separadas, sin solaparse y con check turquesa. |
| Composición cargada arriba | No tocado. Sigue vacío el tramo de y = 1250 a 1480, pero es coherente en todo el vídeo; no se pide. |

## Comprobaciones hechas
- Metadatos y audio iguales a la v5. La sincronía no ha cambiado (mismos `tiempos.json`).
- Zonas seguras: sin texto en la franja derecha (x > 960) en todo el vídeo, salvo las fotos en pastilla y las pancartas animadas que salen de pantalla en el segundo 15,5 (decorativas, sin texto).
- Segundo 95 en adelante revisado: cierre sin duplicados, sello MITO en su sitio, "Guárdalo" y "Fuentes en la descripción" en y ≈ 1400, el final queda en silencio con la cola de 2,15 s.
- El vídeo viral de Nike sigue sin reproducirse.

## Antes de publicar (no es del vídeo, para el coordinador)
1. En el texto del post, junto a los créditos de las fotos, indicar el año de las fotos de Le Pen (2014) y Lecornu (2020).
2. Pendiente de verificar en el guion el mismo día de la publicación: las convocatorias del 22-10, 24-10, 31-10 y 5-11 (están en la línea de convocatorias del vídeo con "a fecha de hoy"). Si se publica después del 24-10 hay que rehacer esa escena.

## Lo que funciona bien
- Los seis cambios obligatorios aplicados sin romper nada más.
- Notas y cifras literales del guion; bloque de opinión claramente señalado.
- Retratos coherentes entre sí, fotos de hechos con crédito exacto y caras de menores difuminadas.
- Gancho con movimiento, cierre con bucle al móvil del inicio y portada legible.
