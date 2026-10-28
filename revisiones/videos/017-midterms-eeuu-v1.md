# Revisión de vídeo · 017-midterms-eeuu · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 87,3 s · -14,1 LUFS · pico -1,3 dBTP. Voz ElevenLabs real (tiempos.json: motor elevenlabs, provisional false). Sin huecos > 3 s (select 0,004). Última palabra a 85,76 s; cola ≈ 1,5 s.
**Test de formato Reel/TikTok:** 8/10 (fallan: legibilidad en móvil de gobernadores/línea de tiempo; ritmo del tramo 61–67 s casi vacío)

## Obligatorio (bloqueante)
1. [47,5–50,0] Mapa de gobernadores: abreviaturas de ~30 px en casillas grises, ilegibles en móvil (y la escena dura solo 2,4 s) → agrandar casillas (paso ≥ 80, ancho ≤ 880) con letras ≥ 40 px, o resaltar solo los 36 estados y atenuar el resto sin texto; alargar la escena (≥ 3,5 s, dejar entrar el rótulo cuando la voz diga "treinta y seis", 48,6 s).
2. [61,5–70,2] Rótulo "DESDE 1934: SOLO 3 EXCEPCIONES" entra a 61,5 s y la voz dice "desde mil novecientos treinta y cuatro, solo se libró tres veces" a ~67 s (5 s tarde). Revela el dato antes de la voz → `en` ≈ 5,0 (entra a ~66,5 s). Pero entonces 61,5–66,5 queda sin rótulo: usa ese tramo para que la línea de tiempo arranque sola, o pide al guionista un rótulo literal para "Y hay un patrón".
3. [62–76] Línea de tiempo (`tlM`): triángulos de ~25 px y años de ~30 px (1934, 1998, 2002, 2018 ilegibles en móvil; "2002" y "2018" casi se tocan). Las tres excepciones son lo que se debe ver → barras/triángulos ≥ 2× y años ≥ 48 px, solo los tres años de excepción con etiqueta grande.
4. [10,4 s en adelante, "Trump no está en la papeleta"] El rótulo llega a x≈960 (roza el borde de zona segura) → bajar a dos líneas o reducir a 58–60 px... mejor: partir en dos líneas ("Trump no está" / "en la papeleta").
5. [~73,5–76] Contador "−28 / ESCAÑOS": la etiqueta ESCAÑOS queda a ~5 px de la pastilla de subtítulo → subir el contador unos 60 px (y 890 → 830).

## Formato Reel/TikTok
1. [5,3–8,9] Recorte del Capitolio: solo cúpula, pequeño (520 px) y con borde blanco: se ve bien pero sin resolución extra; aceptable, pero amplíalo a ~700 px (x ≤ 960) para que sea el ancla visual de la escena.
2. [32–47] Los 35 escaños "en juego" se marcan con aros dorados repartidos al azar sobre el hemiciclo: confusos. Resáltalos todos a la vez (aro fijo) o agrupa los 35 tras la frase "treinta y cinco de cien".
3. [50–61] Leyes/jueces/billete: iconos pequeños (hemiciclos de la "ley" ~100 px) → ≥ 240 px (regla 15).
4. Toda la pieza: 1/3 inferior (y > 1450) vacío; centrar un poco los gráficos o agrandarlos.
5. Contador −28: salta directo (confirmado `salto:true`); es coherente con el dato "media", no engaña; si cabe, cuenta 0→28 en 1 s.

## Recomendado
1. Datos y literales: todos los rótulos y notas coinciden con el guion (Grep de escenas.json); crédito de Falbisoner presente; "Datos a 27-10-2026" presente. Cierre con "Síguenos" (ver memoria: cta por defecto).
2. Tiempo de lectura: todos los rótulos ≥ palabras÷3 (el más justo, "36 GOBERNADORES DE ESTADO", 2,36 s para 4 palabras).
3. Sincronía: rótulos de cifras coinciden con la voz (MAYORÍA 218 a 19,7 s con "dieciocho"; 51 a 43,3 s). No comprobada la pronunciación por no poder escuchar; revisar voz.txt: sin incidencias.

## Lo que funciona bien
- Gancho claro desde el fotograma 1: "4 ESCAÑOS" + hemiciclo con 4 puntos dorados.
- Hemiciclos coloreados en sincronía con la voz; leyenda con colores reales de partido.
- Cierre con 47 + 4 = 51 que enlaza con el gancho; sonido -14 LUFS.
- Sin opinión ni burlas; tendencia "no garantía" explícita.
