# Revisión de vídeo · 015-voto-exterior-fin-voto-rogado · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video (el punto 2 de Recomendado se consulta al coordinador/guionista)
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 33,4 s · -14,1 LUFS · pico -1,5 dBTP. Voz ElevenLabs real (tiempos.json: motor elevenlabs, provisional false). Sincronía OK (silence_end 4,54/8,64/20,95 frente a "Depende"/"no"/"¿Y" ±0,05 s). Cola tras la voz ≈1 s (voz acaba 32,4 s).
**Test de formato Reel/TikTok:** 8/10 (criterios fallados: tiempo de lectura de notas, contenido que ocupa solo la mitad superior)

## Obligatorio (bloqueante)
1. [22,4–24,4] Nota "Inscrito como no residente · RD 1621/2007, arts. 2 y 3" parte la línea con "3" huérfano y su borde llega a x≈960; además son 9 palabras de nota + rótulo en 2,0 s (necesita ≈4 s). → Parte la nota en 2 líneas equilibradas ("Inscrito como no residente" / "RD 1621/2007, arts. 2 y 3") y que `notas` entre antes, o se queda en la descripción si no cabe; misma comprobación (≥ palabras÷3) para la nota de 26,75 s (8 palabras en 2,4 s).
2. [18–21] Crédito de foto en 3 líneas: "Wikimedia" llega a x≈950 (margen < 20 px). → Acórtalo en 2 líneas ("Foto: Américo Toledano" / "CC BY-SA 4.0 · Wikimedia Commons") sin alterar el literal.

## Formato Reel/TikTok
1. [todo el vídeo] El contenido ocupa y 130–1000 y las notas van a y≈1350; el tercio inferior queda vacío (mapa, calendario, foto de ~540 px de alto). → Baja un 15 % la zona de contenido o sube el tamaño de mapa/calendario/foto.
2. [21–22,4] "¿DE PASO? (ERTA)" (1,6 s) cumple lectura, pero la sigla ERTA no se explica y el espectador no la conoce. El guion es literal, así que no es fallo de render. → Coordinador: valorar con guionista una nota de 36 px ("ERTA = electores residentes temporalmente ausentes") o quitar la sigla.
3. [29,2–33,4] Cierre con "¿DEBERÍA RECIBIRLO…?" + "Síguenos": falta "📌 Guárdalo" del guion (cierre por defecto de la plantilla; aviso al coordinador, no es error de render). Subtítulo "¿Debería recibirlo también quien" tapa casi todo el ancho en 27–29 s.

## Recomendado
1. [18–21] Foto F1 algo blanda (ampliación de una miniatura); recorte correcto: sin rotulador ni manual con escudo, sin personas.
2. Cola final: 1 s tras la voz; ideal 1,5 s.
3. Avisos del generador: sello turquesa "NO PIDES NADA" (8,5 s): sin rebase de x>960 en entrada ni reposo; no tapa el rótulo ni los subtítulos. OK.

## Lo que funciona bien
- Gancho desde el fotograma 1 (pregunta + mapa + "?"), bucle con "¿SIN PEDIRLO?" al final; sin sonido se entiende la idea (residentes no piden, de paso sí, plazo 31 OCT).
- Rótulos y notas literales al guion (escenas.json comparado). Sin opinión ni burlas. Foto con crédito CC BY-SA.
- Ritmo: sin huecos > 3 s en la zona de contenido (la cola de cierre solo se mueve con 0,001 como siempre).
- Datos de fechas coherentes con el guion (21–26 NOV, 24–30 OCT, 31 OCT sábado); no he podido contrastar fuentes por web.
