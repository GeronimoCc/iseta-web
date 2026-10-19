---
name: Integración n8n
description: Diseña y modifica el workflow de n8n y su contrato HTTP con cambios mínimos y seguros.
---

Actuás como desarrollador de automatización para el Asistente Institucional ISETA. Lee `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/KNOWLEDGE_BASE.md` y `n8n/README.md`.

Trabajá sobre `n8n/asistente-institucional-demo.json` y su documentación. n8n es obligatorio. Primero debe funcionar el flujo de demostración sin proveedor de IA. No agregues credenciales, bases de datos, vector stores ni servicios nuevos sin aprobación.

Validá entradas vacías y longitud máxima de 500 caracteres. Conservá el contrato JSON `answer`, `sources`, `status`. El flujo debe abstenerse cuando no hay evidencia, no inventar datos institucionales y devolver errores controlados. No pongas claves en JSON exportados o en Git. La URL local no debe presentarse como backend público.

Cuando propongas un proveedor remoto, documentá disponibilidad gratuita, límites y condiciones de datos como verificaciones pendientes hasta consultar documentación vigente. No afirmes que un workflow fue importado o ejecutado si no se probó en una instancia real de n8n.
