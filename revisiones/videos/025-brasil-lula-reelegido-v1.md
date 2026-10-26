# Revisión de vídeo · 025-brasil-lula-reelegido · vuelta 1 (vía rápida)
**Veredicto:** CAMBIOS (3 ajustes pequeños y cerrados)  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 105,4 s · -14,1 LUFS · -1,4 dBTP. Voz ElevenLabs real (`tiempos.json`: provisional=false). Voz acaba en 99,9 s.
**Test de formato Reel/TikTok:** 8/10 (falla: aire inferior vacío ~1/3 de pantalla en casi todas las escenas; cola de cierre larga)

## Obligatorio (bloqueante)
1. [65,1–68,9 s · escena 17, "Dónde valía la prórroga"] El mapa reparte los puntos turquesa/grises al azar (no hay dato por estado): induce a pensar que se sabe dónde valía. → En `mapaL` añade un texto fijo desde el primer fotograma hasta el final de la escena: "Esquema ilustrativo · sin datos por estado" (≥ 36 px, tinta, bajo el mapa, y ≤ 1490). Alternativa válida: quitar los puntos y dejar el mapa gris con solo la leyenda. Lo demás (leyenda, rótulo) correcto.
2. [73,9–77,0 s · escena 19] El rótulo de Fachin se queda 3 s como "Fachin (STF): respetar" (frase incompleta) y la 2.ª línea "la voluntad de los electores" entra en `en: 3.14`. → Pon el segundo rótulo con `en: 0.05` (o un único rótulo de dos líneas, texto literal del guion) y sube/baja la tarjeta si hace falta (tarjeta en y=770, hay sitio).

## Formato Reel/TikTok
1. [escena 7, 25,0–29,5 s] El rótulo "1.ª vuelta, 4-10: Flávio 47,03 %" deja "%" huérfano en la 2.ª línea → parte en "1.ª vuelta, 4-10:" / "Flávio 47,03 %" (salto de línea explícito, mismo texto).
2. [cola 99,9–105,3 s] 5,4 s de cierre quieto tras acabar la voz (hueco 93,5–98,2 s en `select` por el pulso) → recorta a voz + ~2 s si es fácil; no bloquea.
3. Contenido pegado arriba, ~1/3 inferior vacío en la mayoría de escenas (aceptable, como otras piezas).

## Recomendado
1. [4,8–9,6 s, retratos] Trato igual en lo esencial (círculo 250 px, mismo aro mostaza, "Imagen de archivo" + crédito en ambos, mismo tamaño de letra). Lula sale algo más alejado (banda presidencial, cara más pequeña) que Flávio: recorta Lula un ~10 % más cerrado. No bloquea.
2. [escena 1, crédito de Flávio] Medí ~55 px entre el crédito (3 líneas) y el subtítulo, no 10 px: sin solape. Si lo quieres más holgado, acorta a "Foto: Agência Senado · Wikimedia Commons" no es literal → mejor dejarlo.
3. Cierre: "ANULAR" (tinta) y "RESPETAR" (turquesa) distinto color: neutral, pero si quieres equidad total, mismo estilo en ambos.

## Verificado y correcto
- Voz (`voz.txt`) = guion v2: "presidencial", "al Tribunal Superior Electoral", "no consta que la haya presentado", prórroga también pedida por la campaña de Flávio; sin sello "sin confirmar" ni "NUNCA ANTES" problemático (solo hueco de 2026, sin nombres). Guía fonética ok (pe ele, Zanín, Fashín); pronunciación real no escuchada.
- Rótulos y notas de `escenas.json` literales al guion (Zanin/Fachin/Flávio/Lula, "A 26-10: no consta la petición", "Comprobado el 26-10", "Al TSE, por lluvias · Poder360, InfoMoney, Reuters"). Cifras 51,8/48,2/47,03/45,16/+4,4 M correctas; barras desde 0 y misma escala.
- Equidad: mismo formato de tarjeta (silueta) para Zanin, Campaña de Lula, Campaña de Flávio y Fachin; sin burlas ni iconos humillantes (el "?" sobre Flávio es neutro y está en el guion).
- Tiempos de lectura ≥ palabras÷3 en todas las escenas; ningún hueco > 3 s en contenido (salvo cierre); sin nada pasado x=960 en las hojas; fotos con licencia y crédito.
- Gancho correcto (barras + GANÓ), idea única clara y se entiende sin sonido.
