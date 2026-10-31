# Cambios en los agentes (aprendizaje continuo)

Decisión de la persona usuaria del 2026-10-31: el sistema aprende del feedback y de las métricas y modifica los agentes por su cuenta (límites en `agentes/coordinador.md`, "Bucle de feedback"). Cada cambio se evalúa a las 2 semanas y se revierte si la métrica empeora.

| Fecha | Agente / archivo | Cambio | Por qué (datos, n) | Métrica que debe mejorar | Evaluar el | Resultado |
|---|---|---|---|---|---|---|
| 2026-10-31 | monitoreador, coordinador, revisión semanal, Al minuto | Se activa el bucle: lecciones de métricas a `feedback/`, cambios aplicados en la revisión semanal | Petición de la persona usuaria | Visualizaciones medias y seguidores por 1.000 visualizaciones | 2026-11-14 | — |
| 2026-10-31 | generador-video | 3 reglas pasan del feedback al agente: contadores con etiqueta desde el fotograma 1; no entregar con avisos de LECTURA; tercio inferior lleno | Reincidencias: regla 11 (013, 023, 030), regla 7 (7 piezas, última 028), tercio vacío (015, 028, 030) | Renders aprobados a la 1.ª vuelta de revisor-video (hoy casi siempre hacen falta 2–3) | 2026-11-14 | — |
