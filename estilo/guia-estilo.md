# Guía de estilo · gráfica, voz y ritmo

## Concepto visual
**"Pizarra política animada":** ilustración vectorial plana, formas geométricas limpias, mucho espacio, iconos simpáticos pero serios. Referencias de tono: vídeos explicativos de divulgación (estilo *motion graphics* editorial), infografías de prensa animadas.

## Imágenes reales (fotos de hechos y personajes)
*(Añadido el 2026-10-19 a petición de la persona usuaria. Se combinan con la animación, no la sustituyen.)*
- **Solo con licencia que permita uso comercial:** Wikimedia Commons (CC0, CC BY, CC BY-SA, dominio público), bancos oficiales que autoricen la reutilización con cita (La Moncloa, Congreso, Parlamento Europeo, Comisión Europea, Élysée, etc.; comprueba el aviso legal de cada uno) o material propio.
- **Prohibido:** fotos de agencias o de medios (AFP, Reuters, EFE, Getty, capturas de prensa), fotogramas de televisión y vídeos virales. Tampoco las imágenes que estemos desmintiendo (nunca se reproduce un bulo).
- **Crédito visible** en pantalla (36 px, dentro de la zona segura: "Foto: Autor · CC BY-SA 4.0 · Wikimedia Commons") y en la descripción del post. Si la licencia es BY-SA, se indica.
- **Retratos de políticos:** foto oficial o de Commons, neutra, en el mismo encuadre y tratamiento para todos (sin elegir fotos favorecedoras para unos y desfavorables para otros). Nada de retoques, montajes ni deepfakes.
- **Tratamiento:** recorte limpio, marco o pastilla de la marca, leve movimiento (Ken Burns). La foto ilustra; el dato va en el rótulo.
- **Fecha y contexto reales:** cada foto de un hecho tiene que ser de ese hecho (lugar y fecha comprobados en la ficha de Commons). Si no la hay con licencia libre, se usa animación.
- El guion lleva una tabla "Imágenes" con: momento, qué muestra, URL de la ficha, autor, licencia y fecha de la foto.

## Objetos reales recortados en lugar de dibujos (2026-10-26, a petición de la persona usuaria)
A la persona usuaria no le gusta que el vídeo parezca "generado con IA". Los **objetos y lugares reales** (coche de policía, urna, papeleta, furgón, edificio del Congreso, bandera de la UE, billete, contenedor…) ya **no se dibujan**: se usa una foto con licencia libre (mismas reglas que arriba), se le quita el fondo con `node videos/recorte/recortar.mjs <foto> <salida.png> [x,y,ancho,alto]` (en local) y se coloca con el componente `recorte` (contorno blanco tipo pegatina de collage, sombra plana y entrada con rebote), con su crédito.
- **Siguen siendo vectoriales:** gráficas, mapas, hemiciclos, contadores, líneas de tiempo, iconos de interfaz y ejemplos inventados (partidos ficticios).
- Personas: no se recortan particulares; políticos, solo con las reglas de retratos de arriba (mismo tratamiento para todos).
- Elige fotos con fondo sencillo y revisa el recorte en un fotograma: si quedan trozos del fondo, usa el encuadre opcional. Matrículas de vehículos particulares, pixeladas.

## Paleta de marca
Elegida **a propósito lejos de los colores de los partidos españoles**: la cuenta tiene línea de derecha liberal-conservadora, pero no es de ningún partido, y una marca con colores propios transmite independencia.

| Rol | Color | Hex |
|---|---|---|
| Fondo principal | Crema papel | `#F4EFE6` |
| Texto y trazos | Tinta | `#14213D` |
| Acento 1 (marca, resaltados) | Mostaza | `#F2B134` |
| Acento 2 (datos secundarios) | Turquesa grisáceo | `#2A9D8F` |
| Neutro | Gris piedra | `#8D99AE` |
| Alerta / "mito" | Teja apagado | `#C8553D` (solo para el sello "MITO") |

**Colores de partidos:** solo dentro de gráficos donde haga falta identificar grupos (hemiciclos, resultados), con sus colores habituales, la misma saturación para todos y siempre con el nombre en rótulo (no depender solo del color).

## Tipografía
- Titulares y ganchos: **Archivo Black** o **Bricolage Grotesque ExtraBold** (Google Fonts).
- Texto y subtítulos: **Inter** SemiBold.
- Cifras grandes: **JetBrains Mono** Bold o la misma de titulares con números tabulares.
- Tamaños mínimos (lienzo 1080×1920): gancho 110–140 px · rótulos 64–80 px · subtítulos 52–58 px · notas/fuentes 36 px.

## Composición
- Formato 9:16, 1080×1920, 30 fps.
- **Zonas seguras:** sin texto importante en los 250 px superiores, los 420 px inferiores ni los 120 px de la derecha.
- Subtítulos en el tercio central-inferior (aprox. y = 1150–1400), máx. 2 líneas, palabra activa en mostaza.
- Logo pequeño en la esquina superior izquierda dentro de la zona segura.
- Portada: titular legible dentro del recorte central 1080×1350 (vista de perfil 4:5).

## Animación
- Entradas con muelle suave (`spring` en Remotion, damping ~12–15); salidas rápidas (6–8 fotogramas).
- Nunca más de 3 s sin movimiento: cambio de rótulo, zoom lento, icono que entra, cifra que sube.
- Cortes de escena sincronizados con las pausas de la voz.
- Gráficos recurrentes (mantenerlos idénticos entre vídeos para crear identidad):
  - **Hemiciclo** de puntos (350 escaños del Congreso, 265 aprox. del Senado — comprobar la cifra vigente).
  - **Barras horizontales** con cifra al final.
  - **Línea de tiempo** horizontal con hitos que se encienden.
  - **Mapa** de España por comunidades/provincias.
  - **Sello "MITO / DATO"** que cae sobre la pantalla.
- Personas reales: silueta de busto plana en tinta + rótulo con nombre y cargo. Nunca caricaturas ni rasgos exagerados.

## Voz en off
- Español de España, cercana, ritmo vivo (~165 palabras/min, la velocidad real de la voz), sonrisa en la voz pero sin tono de anuncio.
- Volumen final ≈ -14 LUFS; música (si la hay) 18–22 dB por debajo de la voz.
- Pronunciación: revisar siglas (se leen "pe-pe", "pe-ese-o-e", "u-e" o "Unión Europea"…) y añadir guía fonética en el guion si hace falta.
- **Máximo 15 palabras por frase de voz**, contando las cifras como se leen. Las listas de fechas o cifras van en pantalla (línea de tiempo, barras) y la voz da solo el resumen. *(Incorporada el 2026-10-19 desde `feedback/guionista.md`: 3 ocurrencias.)*
- **Duración y tiempos con el recuento real:** cuenta las palabras del "Texto de voz limpio" final, calcula la duración (≈ 165 palabras/min) y asigna los tiempos de cada bloque según sus palabras. Nunca a ojo. *(Incorporada el 2026-10-19: 4 ocurrencias.)*

## Portada
- Todo guion define su portada: titular de 6 palabras como máximo más una imagen, legible en miniatura y dentro del recorte central 4:5 (1080×1350). *(Incorporada el 2026-10-19: 3 ocurrencias.)*

## Texto en pantalla
- Máx. 7 palabras por rótulo. Una idea por rótulo.
- Cifras redondeadas en pantalla ("casi 48 millones") y exactas en la descripción del post.
- Fuente siempre visible en pantalla cuando se muestra un dato: "Fuente: INE" en 36 px abajo dentro de la zona segura.

## Música de fondo (2026-10-26)
Una pista por pilar, de fondo y bajita (−16 dB, baja sola bajo la voz): Actualidad → "Hidden Agenda"; Cómo funciona y Curiosidades → "Wallpaper"; Datos y mitos → "Investigations" (Kevin MacLeod, CC BY 4.0, crédito obligatorio en el post; ver `videos/musica/LICENCIAS.md`).

## Plantilla de cierre (últimos 4–5 s)
Fondo mostaza · frase resumen · **"Síguenos / para estar informado"** (por defecto desde el 2026-10-26; `cta: "guardalo"` vuelve al "📌 Guárdalo" en piezas explicativas, si se quiere) · "Fuentes en la descripción" · logo.

## Bloque "Nuestra lectura" (opinión) · RETIRADO el 2026-10-20: los vídeos son solo informativos
Fondo tinta `#14213D` con texto crema y etiqueta mostaza "NUESTRA LECTURA" fija en la esquina superior durante todo el bloque. Así se distingue a simple vista lo que es opinión de lo que es dato.
