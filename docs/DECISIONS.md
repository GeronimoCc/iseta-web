# Registro de decisiones

| ID | Decisión | Estado | Motivo |
|---|---|---|---|
| D-001 | Preservar la copia estática del sitio existente | Aceptada | Evita rehacer un sitio que ya funciona como fuente de referencia |
| D-002 | Usar n8n como orquestador | Aceptada | Requisito de la materia |
| D-003 | No ejecutar un LLM local | Aceptada | El usuario prefiere una solución simple y gratuita; no hace falta para el MVP |
| D-004 | Comenzar con respuestas de demostración, sin proveedor externo | Aceptada | Permite probar interfaz y contrato antes de introducir IA |
| D-005 | Evaluar un modelo remoto gratuito más adelante | Pendiente | Revisar límites, privacidad, disponibilidad y condiciones vigentes antes de elegir |
| D-006 | Mantener una base de conocimiento pequeña y curada | Aceptada | Mejor trazabilidad y menor complejidad que indexar todo el sitio |
| D-007 | No usar RAG, vector DB ni base de datos en el MVP | Aceptada | No hay necesidad demostrada en esta etapa |
| D-008 | Guardar credenciales del proveedor dentro de n8n, nunca en frontend/Git | Aceptada | Reduce el riesgo de exposición |
| D-009 | Probar primero de forma local | Aceptada | No requiere publicar un backend ni exponer un webhook |
| D-010 | Excluir aula virtual, webmail, datos personales y trámites | Aceptada | Reduce riesgos y alcance |
| D-011 | Usar agentes de VS Code como roles auxiliares de desarrollo, no como agentes autónomos dentro del producto | Aceptada | Ayudan a planificar, implementar y revisar sin agregar complejidad al chatbot |
| D-012 | Mantener el sitio de GitHub Pages separado de la integración local de n8n | Aceptada | Los visitantes de Pages no pueden usar la instancia local del desarrollador |
| D-013 | No fusionar a `main` sin revisión del usuario | Aceptada | Preserva control de cambios |
| D-014 | Actualizar los documentos en GitHub como fuente compartida | Aceptada | Evita que las instrucciones dependan solo de un Drive no conectado |
