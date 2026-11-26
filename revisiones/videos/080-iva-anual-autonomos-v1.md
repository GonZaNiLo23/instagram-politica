# Revisión de vídeo · 080-iva-anual-autonomos · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 31,7 s · -14,2 LUFS · pico -1,5 dBTP. Voz ElevenLabs real (provisional=false). Sin huecos > 2,5 s (select 0,001). Cola de cierre: voz acaba a 29,36 s, vídeo a 31,7 s (OK).
**Test de formato Reel/TikTok:** 8/10 (fallan: claridad visual del calendario; tercio inferior vacío en esc. 3–6)

Nota: el guion está en `borradores/` (revisión de guion = CAMBIOS); comprobar.mjs no verifica literalidad. Comparado a mano con el borrador: la voz ya incluye el cambio 1 ("podrá"). Rótulos literales respecto al borrador.

## Obligatorio (bloqueante)
1. [00:04–00:10, gancho y escena 2] El calendario asocia los pagos a trimestres equivocados: ABR bajo T1, JUL bajo T2 y OCT bajo T4 (T3 sin pago). Abril es T2, julio T3 y octubre T4: el gráfico contradice el dato → recolocar ABR en T2, JUL en T3, OCT en T4 (componente `calIva`, prop `pagos`), o quitar las etiquetas T1–T4 y dejar solo los tres meses.
2. [00:24–00:31, cierre] Aparece "Fuentes en la descripción", que no está en el guion → quitarlo o añadirlo al guion (es el texto por defecto de `cta: 'siguenos'`; avisar al coordinador si se acepta).

## Formato Reel/TikTok
1. [00:10–00:31] Tercio inferior (y > 1300) vacío salvo subtítulos; los iconos quedan arriba → bajar contenido ~100–150 px o agrandar el icono/tope.
2. [00:04–00:10] Escena 2: la 2.ª línea del rótulo aparece a 1,8 s; el calendario ya está a la vista antes. Aceptable.

## Recomendado
1. [00:20–00:25] En la línea de tiempo, el hito "30 DÍAS" es de 30 px; ampliar a ≥ 40 px.

## Lo que funciona bien
- Gancho de 112 px desde el fotograma 0, ancho máx. x≈895 (dentro de zona segura); tachado de trimestres claro.
- Voz y subtítulos sincronizados, audio dentro de rango, ritmo sin huecos, tiempo de lectura OK en todas las escenas.
- Sin opinión ni iconos humillantes; "podrá" y "falta convalidación" mantienen el rigor.
- Test sin sonido: se entiende (IVA anual, 3 pagos, ¼, 85.000 €, 3 años, convalidación).
