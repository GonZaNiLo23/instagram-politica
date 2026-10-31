# Feedback a los agentes

Aquí los revisores dejan **lecciones aprendidas** para los agentes que producen. No es el informe de una pieza (eso va en `revisiones/`): son patrones que se repiten y que el agente debe tener en cuenta **siempre**.

| Archivo | Lo escriben | Lo lee antes de trabajar |
|---|---|---|
| `guionista.md` | revisor-guion, revisor-video | guionista |
| `generador-video.md` | revisor-video | generador-video |
| `al-minuto.md` | monitoreador (métricas), coordinador | rutina Al minuto horario |
| `buscador-temas.md` | revisor-guion, revisor-video, coordinador | buscador-temas |

## Formato de cada entrada
```
### AAAA-MM-DD · NNN-slug · [revisor que lo escribe]
- Problema: (qué ha fallado, en una línea)
- Regla para el futuro: (qué hacer a partir de ahora, en una línea accionable)
- Ejemplo: (antes → después)
```

## Resumen (ahorro de tokens)
Cada archivo empieza por un **resumen de reglas activas, una línea por regla**. Los agentes que producen leen solo el resumen y buscan con Grep la entrada completa cuando necesitan el ejemplo. Quien añade o cambia una regla actualiza también su línea del resumen (nueva línea o la existente).

## Mantenimiento
- Antes de añadir una entrada, el revisor comprueba si ya existe una regla parecida; si es así, añade la pieza como nueva ocurrencia en vez de duplicarla.
- Cuando una regla se haya repetido 3 veces, el coordinador la propone a la persona usuaria para incorporarla de forma permanente a la guía de estilo o al agente correspondiente.
- Cada mes, el coordinador resume y archiva las entradas resueltas en una sección "Histórico".
