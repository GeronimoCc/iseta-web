# ISETA Web y Asistente Institucional

Repositorio académico para el proyecto de Seminario de Programación (Analista de Sistemas).

El repositorio conserva una copia estática del sitio institucional del ISETA y contiene un prototipo separado de asistente conversacional. El asistente se desarrolla de forma incremental: primero una demostración local con respuestas controladas y n8n; un modelo remoto gratuito se evaluará solo cuando el flujo básico esté probado.

## Estado actual

- Sitio estático de referencia: HTML exportado con HTTrack.
- Interfaz del asistente: `prototipos/asistente-institucional.html`.
- Workflow inicial importable de n8n: `n8n/asistente-institucional-demo.json`.
- Instrucciones para probar el workflow: `n8n/README.md`.
- Guía para agentes de desarrollo en VS Code: `docs/VS_CODE_AGENTS.md`.

**La conexión con n8n está pensada para pruebas locales.** GitHub Pages sirve archivos estáticos y no puede usar la instancia local de n8n del desarrollador para responder a visitantes externos. No se debe publicar un webhook sin diseñar antes la seguridad del backend.

## Inicio rápido

1. Abrí el HTML del prototipo para comprobar la interfaz en modo demostración.
2. Seguí [n8n/README.md](n8n/README.md) para importar y probar el workflow.
3. Consultá [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) antes de avanzar al siguiente paso.

## Documentación

- [Especificación del proyecto](docs/PROJECT_SPEC.md)
- [Auditoría del repositorio](docs/REPO_AUDIT.md)
- [Arquitectura](docs/ARCHITECTURE.md)
- [Base de conocimiento](docs/KNOWLEDGE_BASE.md)
- [Plan de pruebas](docs/TEST_PLAN.md)
- [Registro de decisiones](docs/DECISIONS.md)
- [Plan de implementación](docs/IMPLEMENTATION_PLAN.md)
- [Agentes de VS Code](docs/VS_CODE_AGENTS.md)
- [Instrucciones generales para agentes](AGENTS.md)

## Límites

No incluye aula virtual, webmail, datos personales, autenticación, trámites ni acciones automáticas. No usa un modelo local, RAG, base vectorial o base de datos en el MVP. Las respuestas de demostración deben verificarse contra las fuentes institucionales antes de la presentación.

## Sitio publicado

- [Sitio estático en GitHub Pages](https://geronimocc.github.io/iseta-web/)
- [Repositorio GitHub](https://github.com/GeronimoCc/iseta-web)
