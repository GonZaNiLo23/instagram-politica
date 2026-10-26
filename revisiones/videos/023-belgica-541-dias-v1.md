# Revisión de vídeo · 023-belgica-541-dias · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video (ajuste de tiempos y una etiqueta; sin tocar guion ni voz salvo la opción B del punto 1)
**Técnica:** 1080×1920 · 30 fps · H.264 + AAC · 35,17 s · -14,1 LUFS · pico -1,5 dBTP. Sin cortes de audio (silencios = pausas entre frases). Cola tras la voz: 33,36 → 35,18 = 1,8 s, OK.
**Test de formato Reel/TikTok:** 9/10 (criterio flojo: 2, sin sonido, por el bloque de "en funciones", que no da tiempo a leerse). Con el punto 1 corregido, 10/10.

## Obligatorio (bloqueante)
1. [12,30–14,30] Lectura. "GOBIERNO LETERME, EN FUNCIONES" (4 palabras) + "= provisional, gestiona el día a día" (6 + "=") son 11 palabras en 2,0 s; el subrótulo entra a +0,45 s y se lee 1,55 s. Mínimo: 3,7 s para el bloque (el subrótulo, 2,0 s). Voz: "El anterior, en funciones" va de 12,40 a 14,00 y "Ojo" empieza en 14,40, así que no hay margen sin tocar nada. Corrección (elige una):
   - A) Sin tocar la voz: el rótulo "GOBIERNO LETERME, EN FUNCIONES" entra ya a 11,9 s (la escena 3 acaba en 12,08 con "mandaba") y el subrótulo a 12,3, y la escena se alarga hasta 14,4 (voz de "Ojo"). Consigue ≈ 2,5 s para el bloque y ≈ 2,1 s para el subrótulo. Es lo máximo posible, aún corto para 11 palabras. Solo vale si el coordinador acepta 11 palabras en 2,5 s.
   - B) Recomendada: añadir ≈ 1,3 s de pausa de voz tras "en funciones." (silencio en el mp3 y reanclar tiempos; la pieza pasa a ≈ 36,5 s, sigue en flash) y mantener las carpetas animándose. Con el rótulo desde 12,1 y la escena hasta 15,7 hay 3,6 s.
   - C) Si no se quiere tocar nada: quitar el subrótulo de pantalla y llevarlo al post (el guion lo exige; requeriría OK del coordinador). El rótulo solo ya cumple (4 palabras).
2. [17,50–19,10] Contador regional sin etiqueta. "600+" empieza a contar en 16,2 s (escena 14,3 + 1,9) pero "REGIONAL" no aparece hasta 17,5 s (+3,2): durante 1,3 s se ve "271+ … 598+" sin etiqueta, al lado de "541 FEDERAL" (fotograma 17,2 s = "598+" sin etiqueta). Corrección: `rotulo` "REGIONAL" con `en: 1.9` (el mismo que el contador). Regla 11 del feedback.

## Formato Reel/TikTok
1. [0,00–1,35] El contador del fotograma 1 NO va a mitad de cuenta: fotograma 0 = "0", fotograma 3 = "74", llega a 541 a ≈ 1,35 s (la voz dice "quinientos cuarenta y un" de 1,0 a 2,08 s, o sea la cifra acaba 0,7 s antes). Un "0" parado en el primer fotograma/autoplay da menos gancho. Propuesta: empezar a contar desde ≈ 300 (o con `espera` 0 y `desde: 300`) y terminar en 541 hacia 2,1 s. Aviso: el `espera: 1` de escenas.json no tiene efecto visible (la cuenta ya corre desde el fotograma 0); revisar el componente. No bloquea.
2. [22,78–25,50] Escena "INVESTIDURA": 9 palabras (4 + 5) en 2,72 s (mínimo 3,0 s). El subrótulo entra a +0,8 y se lee 1,9 s (OK por separado). Para estar dentro de regla, adelantar la escena a 22,5 s (la voz del Congreso empieza en 22,88; el rótulo ya se anticipa por el barrido del cierre anterior). Casi trivial.

## Recomendado
1. [00:04,3–00:04,7] Escuchar aquí "Guinness" ("guínes" en voz.txt: palabra `guínes` 4,32–4,64 s en tiempos.json; "Récord" 3,92–4,24). El subrótulo muestra "Guinness" bien escrito en este tramo (comprobado en fotograma a 4,5 s). Pronunciación a confirmar por el coordinador a oído.
2. [28,70–29,05 y todo el bloque 2 final] Nota "Fuente: Constitución, art. 99 · LOREG, art. 162 · RD / 806/2026" parte "RD 806/2026" entre líneas (fotograma 28,5 s, y 22,78–25,5 s, 19,1–22,78 s). Trivial: añadir espacio duro (U+00A0) entre "RD" y "806/2026". Sigue dentro de y ≤ 1500.
3. Hueco del cierre (32,83–35,18 s con umbral 0,004): es el pulso del cierre (regla ya conocida); coincide con voz + 1,8 s, OK.

## Comprobaciones pedidas
- **Contadores:** OK. "541 FEDERAL" (izq. x 60) y "600+ REGIONAL" (izq. x 540, mismo tamaño 130 px) lado a lado; el 600+ no se "adelanta" ni cambia de tamaño; la nota "Región de Bruselas-Capital, no el Gobierno federal" está en pantalla de 16,0 a 19,1 s. Bruselas no aparece como récord. Solo falta la etiqueta a tiempo (Obligatorio 2).
- **Cierre de España:** OK, neutral. Hemiciclo de 350 puntos todo en gris piedra (#8D99AE), sin partidos, sin cifras de escaños; urna final (eco del hito 2010). Sin candidato en silueta ni nombres.
- **Lectura del bloque "LETERME":** falla (Obligatorio 1).
- **Solo informativo:** OK. Sin opinión, sin personas (solo nombres "LETERME", "DI RUPO" en rótulo), sin burlas. El sello "EN FUNCIONES" es turquesa grisáceo, neutro.
- **Desviaciones declaradas:** aceptables las tres. (a) Iconos de investidura: edificio del Congreso + pluma con corona sobre documento en lugar de atril con silueta: mejor que la silueta (evita figuras humanas) y se entiende sin sonido. (b) Línea de tiempo: urna → documento con llave "541 DÍAS": clara; la fecha va en el rótulo. (c) Mapa simplificado de Bélgica/Bruselas: silueta muy esquemática (parece una mancha), Flandes/Valonia sin nombre; aceptable porque el rótulo dice "BRUSELAS: GOBIERNO REGIONAL" y el punto mostaza señala Bruselas; no es un mapa que se use para datos. Si hay tiempo, sin riesgo, pero no bloquea.
- **Textos/fidelidad:** todos los rótulos y notas de escenas.json coinciden con el guion recortado (541 DÍAS SIN FORMAR GOBIERNO · RÉCORD GUINNESS EN TIEMPO DE PAZ · 13-6-2010 · ELECCIONES · 6-12-2011 · JURA EL GOBIERNO DI RUPO · ¿Y QUIÉN MANDABA? · GOBIERNO LETERME, EN FUNCIONES · BRUSELAS: GOBIERNO REGIONAL · MÁS DE 600 DÍAS (2024–2026) · ¿Y EN ESPAÑA, TRAS EL 29‑N? · INVESTIDURA: VOTA EL CONGRESO · 2 MESES SIN INVESTIDURA = ELECCIONES + "plazo desde la 1.ª votación" · ¿LO SABÍAS? · 541 DÍAS). Fechas de Bruselas y fuentes (VRT y BX1) OK. Sello "RÉCORD" y trofeo genérico, sin logo de Guinness. Sin errata vista.
- **Créditos:** presentes y ≥ 36 px en foto 1 (Trougnouf, CC BY 4.0), foto 2 (Davidh820, CC BY-SA 4.0) y en el cierre (Trougnouf). Coinciden con el guion.
- **Zonas seguras:** nada con x > 960 (contadores, sello, fotos, notas; comprobado con drawbox en 8 instantes) ni por debajo de y 1500 (notas de 3 líneas terminan en ≈ 1485).
- **Ritmo:** huecos máx. 2,1 s (28,2–30,3, hemiciclo/reloj en movimiento sutil); ninguno > 3 s.
- **Sincronía voz-subtítulos:** `silence_end` frente a `inicio` de tiempos.json en las 14 frases: desvío máximo 0,08 s (< 0,2). Cambio de escenas alineado con la voz (14,3 → "Ojo" 14,40; 19,1 → "¿Y en España" 19,20; 30,3 → "¿Lo sabías" 30,40).
- **Componente nuevo `Belgica.tsx`:** sin riesgo. Solo registra 4 claves nuevas (lineaBe, trofeoBe, mapaBe, barridoBe), que no usa ninguna otra pieza ni colisionan con otras (grep); en `componentes/index.tsx` solo se añade el import y `...REGISTRO_023`. No hace falta re-renderizar otras piezas. `carpetaH`, `mapaH` y `plumaCorona` son de Hora/Cumple, ya usados en 009 y 007 y no tocados.

## Lo que funciona bien
- Gancho claro sin sonido: titular + fachada + contador gigante; sello "RÉCORD" a 3,9 s justo con "Récord".
- Pieza de 35 s, un solo mensaje, giro de Bruselas muy compartible y bien acotado como "regional".
- Voz real, -14,1 LUFS, cierre con pin 📌 y bucle con el 541.

## Cierre del coordinador (2026-10-23)
Render v2 (`videos/renders/023-belgica-541-dias-v2.mp4`, 36,5 s; pausa de 1,3 s insertada tras "en funciones"). Comprobado por el coordinador en `control-v2/leterme-13.8s.png` y `control-v2/regional-17.7s.png`: el bloque Leterme y su subrótulo se leen (≈ 3,5 s); "REGIONAL" visible desde que arranca el contador, junto a la nota "Región de Bruselas-Capital, no el Gobierno federal". → **APROBADO (v2)**.
