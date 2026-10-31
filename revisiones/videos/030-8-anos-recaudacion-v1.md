# Revisión de vídeo · 030-8-anos-recaudacion · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 43,1 s · -14,1 LUFS · pico -1,4 dBTP · voz real elevenlabs (provisional=false) · comprobar.mjs OK
**Test de formato Reel/TikTok:** 8/10 (criterios flojos: gancho/contador, y media pantalla inferior vacía)

## Obligatorio (bloqueante)
1. [00:00–00:08] Contador del gancho: la barra y las cifras intermedias (209.337, 305.365...) suben sin etiqueta "2025" hasta el final (regla 11 del feedback: la etiqueta cambia en el mismo fotograma en que empieza la cuenta; nunca cifra intermedia sin etiqueta). → `contadorSerie` del gancho: etiqueta "2025" visible desde el primer fotograma (o desde `cuentaEn`).

## Formato Reel/TikTok
1. [00:00–04:38] Cuatro segundos y medio con la barra de 2025 casi quieta (la cuenta arranca en 4,64 s, `cuentaEn`); el guion pedía el contador en marcha desde el fotograma 1. Solo se mueven los subtítulos. → adelantar `cuentaEn` (p. ej. 1,0 s) y `cuentaDur` ≈ 3,2 s, para que acabe con "veinticinco mil".
2. Contenido concentrado en el tercio superior en casi todas las escenas; ~40 % inferior vacío salvo subtítulos. → bajar 100–150 px barras, tarta y ficha (sin pasar y 1250).

## Recomendado
1. [00:00] El rótulo del gancho parte "325.356 M€" en una línea huérfana; poner "2018: 208.685 M€" / "2025: 325.356 M€" en dos líneas (mismo literal).
2. Foto de Hacienda algo blanda (1024 px): aceptable a 480 px; crédito CC BY-SA 2.0 visible y bien fuera de la franja.

## Lo que funciona bien
- Literales: rótulos, notas y fuentes coinciden con el guion aprobado y con los literales del informe de guion; "(cálculo propio)", "Cálculo propio con datos oficiales" y "SEGÚN HACIENDA (2025)" en pantalla; ningún rótulo sugiere causalidad; la tarjeta del bloque 4 atribuye explícitamente a Hacienda.
- Gráfico de barras con eje en 0 (0–60 %), sin truncar; PIB marcado "euros corrientes", precios "IPCA".
- Foto con x máx ≈ 940 (<960); nada fuera de zona segura; sin huecos > 3 s; lectura correcta (comprobar OK).
- Test sin sonido: se entiende (2018 → 2025, +56 %, comparación con precios/PIB, "según Hacienda", "no mide lo que paga cada uno"). Cierre A/B con CTA y tarjeta de serie.
- Voz validada solo por tiempos/voz.txt (no puedo escuchar).
