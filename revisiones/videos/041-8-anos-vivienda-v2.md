# Revisión de vídeo · 041-8-anos-vivienda · vuelta 2
**Veredicto:** CAMBIOS (menores)  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 43,6 s (dentro de 40–43,6; cola corregida) · -14,1 LUFS · pico -1,3 dBTP. Sin copia en `renders/subida` (no existe la carpeta).
**Test de formato Reel/TikTok:** 8/10 (fallan: tiempo de lectura en 2 escenas, aire/composición inferior)

Guion aún en `borradores/`: comprobar.mjs no verifica literalidad; rótulos de escenas.json cotejados a mano en v1 y sin cambios de cifras en v2.

## Verificación de la lista de v1
1. Gancho: "¿UE?" ya no pisa CIFRA 2 ni la etiqueta ESPAÑA → corregido.
2. Sueldos: la etiqueta ya no se sale por x<0 (pasa a rótulo superior "COSTE SALARIAL POR TRABAJADOR +24 %") → corregido.
3. Lectura: notas acortadas; ver abajo lo que queda.
4. Duración 45,2 → 43,6 s → corregido.
- AVISO BORDE 30,5 s: es la transición entre escena 7 y 8 (fundido; ficha "BOE, Ley 12/2023" termina en x≈960). No es fallo.
- Quitar "Falta tu sueldo…" del recuadro de "NO ES TU ESFUERZO": ACEPTADO. Solo rótulo, la voz ("el precio no es tu esfuerzo") se entiende sola con el sello NO MIDE; no cambia ningún dato.

## Obligatorio (bloqueante)
1. [11,1–14,9] Escena Eurostat (esc. 2): ≈14 palabras en 3,8 s (necesita 4,7 s) → quitar "Cálculo propio"/acortar la nota "ESPAÑA 118,6 → 180,6 · UE 114,8 → 161,9" o pasarla a una línea corta.
2. [00–04,2] Gancho: ≈15 palabras en 4,2 s, pero escalonadas; aceptable si la nota "precio de la vivienda · 2018 → 2025 · Eurostat" sale en la primera mitad. Si no, acortarla.

## Formato Reel/TikTok
1. [todas] Contenido en y 300–1250; ~40 % inferior vacío salvo subtítulos; gráficos pequeños → ampliar hMax y bajar la base (≈1250). Persiste desde v1.
2. [11–16 s] Fichas de fuente sin logotipo de Eurostat/INE: añadirlos o avisar al coordinador.

## Recomendado
1. Cierre A/B: hueco amplio entre rótulo y botones; acercarlos 80 px.

## Lo que funciona bien
- Gancho +52 % limpio, gráficos con mismo eje 0 y base 2018, nota "contratos en vigor, no solo nuevos".
- Voz y subtítulos sincronizados, loudnorm correcto, sin opinión.
