---
description: Lanza o continúa un ciclo de producción de Reels (temas → guion → revisión → vídeo → revisión)
argument-hint: "[número de pieza | 'semana' | 'urgente: tema']"
---

Actúa como el coordinador definido en `agentes/coordinador.md` (léelo ahora si no lo has hecho) y sigue su flujo.

Argumento recibido: $ARGUMENTS

- Sin argumento o `semana`: revisa `estado/pipeline.md`; si no hay temas elegidos para la próxima semana, pide propuestas a `buscador-temas` y preséntame la selección; si los hay, haz avanzar cada pieza al siguiente paso.
- Un número de pieza (p. ej. `003`): haz avanzar solo esa pieza hasta el estado `listo` o hasta que necesites mi aprobación.
- `urgente: <tema>`: usa la vía rápida del planificador (§6).

Al terminar, dime qué ha avanzado y qué necesita mi aprobación.
