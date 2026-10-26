# Revisión de vídeo · 021-senado-209-senadores · vuelta 1
**Veredicto:** CAMBIOS  →  vuelve a: generador-video
**Técnica:** 1080×1920 · 30 fps · H.264+AAC · 32,1 s · -14,0 LUFS · pico -1,4 dBTP. Sin huecos de movimiento (select 0,004 y 0,001). Voz real; sincronía no medida al detalle (no hay cambios de tiempos respecto a tiempos.json). Pronunciación no escuchable: solo validada en voz.txt.
**Test de formato Reel/TikTok:** 7/10 (fallan: gancho visual débil, legibilidad de los mapas, aprovechamiento del cuadro)

## Obligatorio (bloqueante)
1. [25,0–26,7] El mapa de Baleares es la idea del bloque y no se lee: Ibiza y Formentera son manchas de ~60 px tapadas por los círculos "1" y estos se solapan entre sí. → `mapaBalearesS`: w ≥ 900, o inset ampliado de Pitiusas con Ibiza y Formentera separadas (≥ 40 px entre sí); los círculos "1" fuera de las islas, uno encima de cada una y sin tocarse; Formentera en mostaza visible tras el reparto.
2. [12,9–17,9] El mapa de topes (`mapaTopeS`, esc 0,78) es pequeño (~400 px) y las islas "2/1" no se distinguen del fondo. → subirlo a esc ≥ 1,0, ocupando el hueco inferior (hay ~450 px libres entre mapa y subtítulo) y círculos ≥ 70 px.
3. [10,3–12,9] "SE VOTA A PERSONAS" + "de uno o varios partidos" = 9 palabras en 2,6 s (< 3 s). → `en` del subrótulo 0,6→0,3 y fin de escena +0,4 s moviendo el corte con la voz, o reducir el subrótulo a "de varios partidos" solo si el guion lo permite (no sin permiso: literal); si no, pedir pausa de 0,4 s.
4. [10,3–12,9] "Candidata/Candidato" se corta en el borde derecho del panel `columnasS` (x ≈ 1000). → reducir `w` a ≤ 820 (x ≤ 960) o la tipografía interna para que se lea entera.

## Formato Reel/TikTok
1. [0–2,9] Gancho: franja de papeleta de ~150 px de alto, texto de 18 px ilegible; el primer fotograma no dice nada sin sonido más allá del rótulo. → ampliar la foto al ancho de 1000 con zoom hasta que se lea "máximo de 3 candidatos" (hacerlo sobre la franja ya recortada; sin bajar de y ≈ 270 del original) o mostrar ya las 3 cruces de la papeleta animada desde el 0,0.
2. [todo] Todo el contenido está en y 330–1300; hay 450 px vacíos entre la zona de contenido y los subtítulos/notas. → escalar papeletas, mapas y foto del hemiciclo ×1,2–1,3 dentro de zona segura.
3. [20,4–25] El texto "2023: 208 → 2026: 209" va como contador (2023·208 → 2026·209 +1): se entiende sin sonido; se acepta la desviación declarada.

## Recomendado
1. [6,9–10,3] Nota "Fuente: RD 605/1999, art. 4.2 · La Moncloa (20-10-2026)" no está en las notas del bloque 3 del guion, pero sí en sus fuentes: se tolera; confirmar con el guionista.
2. [10,3] Etiqueta "SENADO" roza el borde de la papeleta sepia; subirla 20 px.

## Lo que funciona bien
- Audio en rango, sin silencios ni cortes; rótulos de 64 px literales al guion (comprobado con escenas.json); créditos y "(recortada)" correctos; sin siglas ni nombres reales.
- Ritmo continuo, EJEMPLO fijo desde el primer fotograma, sello NULO, bucle del cierre y cierre con 📌 y "PARA EL 29‑N".
- Sin opinión ni burla; dato 208→209 coherente con el guion.
