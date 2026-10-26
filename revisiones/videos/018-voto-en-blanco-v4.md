# Revisión de vídeo · 018-voto-en-blanco · vuelta 4
**Veredicto:** CAMBIOS (2 ajustes mecánicos)  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 68,9 s · -14,1 LUFS · -1,4 dBTP · voz ElevenLabs real (provisional=false); sin cortes.
**Test de formato Reel/TikTok:** 9/10 (como v2/v3; sin regresiones).

Literales: voz.txt y escenas.json coinciden con el guion actual (barrera "En el Congreso" a 27,10 s; "Don" solo en voz; rótulos nuevos sincronizados ≤ 0,05 s con su palabra). Los 6 cambios del informe de guion están aplicados. "FUERA DEL REPARTO POR 10 VOTOS": 2,39 s para 7 palabras (OK). EJEMPLO de 36,4 s a 55,7 s y desaparece al empezar "Eso sí". "provincia grande" a la derecha de la barra.

## Obligatorio (bloqueante)
1. [≈44,5–51,8 s, escena 6] "cada sobre = 100" roza el último "0" de 100.000/101.000 (confirmado en crop) y se queda hasta el final de la escena. → Moverlo debajo/derecha de la cifra con ≥ 20 px de aire, o quitarlo tras caer los sobres (`bEjemplo`, `sobres`).
2. [≈52,2 s, escena 7] La papeleta que cae pisa el "3.000" de la 3.ª línea del rótulo "+1.000 nulos o abstenciones → sigue en 3.000". → Bajar `yIni`/`yFin` de `bCaen` (≥ 40 px bajo el rótulo) o poner el rótulo a 2 líneas.

## Recomendado
1. [64,5–68,9 s] Cierre sin cambio visual (voz acaba a ≈ 66,7 s; cola 2,2 s); pulso mínimo, como en piezas anteriores.

## Lo que funciona bien
- Gancho y bucle; sincronía voz-rótulos; nada pasa de x=960 (casa del sofá, crédito F1 bajo la pastilla: arreglos v3 conservados); sin huecos > 3 s en contenido.
