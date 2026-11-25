# Revisión de vídeo · 077-ratios-guarderia · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 36,4 s · -14,1 LUFS · pico -1,5 dBTP (OK). Voz real ElevenLabs (`provisional:false`). Voz acaba a 34,08 s (cola 2,3 s).
**Test de formato Reel/TikTok:** 8/10 (criterios fallados: contenido compacto arriba con tercio inferior vacío; hueco de ritmo en el gancho)

## Obligatorio (bloqueante)
1. [03,1–03,8] El sello "AÚN NO" (selloTexto, desde 60) entra grande y tapa la educadora y las dos primeras cunas durante el rebote → entrar sin escala > 1 sobre las cunas, o moverlo a y ≈ 940 (entre la línea de suelo y el eje 2027-28) para que ni al rebotar pise las cunas.
2. [00:03,8–00:06,8] Hueco de 3,0 s sin cambio en la zona de contenido (select 0,004; confirmar con 0,001) → Ken Burns suave de las cunas, que el eje 2027-28 se encienda o que el bebé parpadee.

## Formato Reel/TikTok
1. [todo el vídeo] El contenido llega a y ≈ 1300 y de 1300 a 1920 queda vacío salvo subtítulos y "Fuente: Moncloa" → bajar el bloque central 150–200 px o agrandar cunas/hitos/mapa (la línea del tiempo del bloque 3 y el bloque 4 son los más compactos).
2. Sin guion en `aprobados/`: comprobar.mjs no verificó literalidad; comparado a mano `escenas.json` con el guion borrador: rótulos literales. Si el guion final cambia, repetir.

## Recomendado
1. [32–36 s] Cierre algo largo (voz + 2,3 s): acortar a voz + 1,5 s.
2. El cierre usa `cta: siguenos` y "¿4 O MENOS?": coherente con el guion; no se ha visto el A/B (abSerie, 29,9 s) en los fotogramas de control: confirmar que no pisa las cunas (y=1040).

## Lo que funciona bien
- Sincronía cunas 4→6→8 con la voz (≤ 0,1 s: "seis" 9,92 s / cunas 9,82 s; "ocho" 11,92 / 11,82); rótulos de edades sincronizados.
- Rótulos legibles ≥ 64 px, todo ≤ x 960; sello "POR CURSOS" en x ≤ 860 sin tapar hitos; audio en rango.
- Se entiende sin sonido: 4 bebés, aún no, edades, fechas, CCAA.
