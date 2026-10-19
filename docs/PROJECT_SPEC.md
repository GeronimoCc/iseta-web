# Especificación del proyecto

**Proyecto:** Asistente Institucional ISETA  
**Versión:** 0.4  
**Estado:** Prototipo de interfaz y flujo de demostración; pendiente de prueba local por el estudiante.

## 1. Problema
La información pública del instituto se encuentra distribuida entre páginas y documentos. El proyecto propone una interfaz conversacional que ayude a localizarla sin sustituir las fuentes oficiales.

## 2. Objetivo
Construir y presentar una demostración institucional sencilla, comprensible y segura que reciba preguntas en español, las procese mediante n8n y responda con información institucional acotada, enlaces a fuentes o una abstención cuando no haya evidencia suficiente.

## 3. Usuarios y contexto
- Visitante que busca información institucional pública.
- Estudiante/desarrollador que ejecuta la demostración localmente y explica su arquitectura.
- Docente que evalúa el problema, el diseño, la implementación y las pruebas.

## 4. Alcance inicial
- Chat accesible y adaptable a móvil/escritorio.
- Preguntas escritas en español.
- Límite de 500 caracteres por consulta en la interfaz.
- Workflow de n8n con webhook, validación, respuesta de demostración y respuesta HTTP.
- Respuestas con fuentes y estados identificables.
- Instrucciones reproducibles de importación y prueba.
- Base de conocimiento pequeña, revisada manualmente.

## 5. Requisitos funcionales
- **RF-01:** mostrar el chat y preguntas sugeridas.
- **RF-02:** validar consultas vacías y limitar su longitud.
- **RF-03:** enviar `{ "message": "..." }` al webhook configurado.
- **RF-04:** recibir `answer`, `sources` y `status`.
- **RF-05:** mostrar las fuentes como enlaces HTTP/HTTPS válidos.
- **RF-06:** indicar cuando la información disponible es insuficiente.
- **RF-07:** mostrar un error comprensible cuando el servicio falla.
- **RF-08:** mantener un modo de demostración que no requiera API externa.

## 6. Requisitos no funcionales
- Dependencias mínimas y código fácil de explicar.
- No exponer claves en el navegador ni en el repositorio.
- No enviar información personal o confidencial a proveedores de IA.
- No ejecutar acciones, transacciones ni acceso autenticado.
- Diseño usable con teclado, lectores de pantalla y pantallas pequeñas.
- Las respuestas deben ser trazables a fuentes revisadas.

## 7. Fuera de alcance
- Aula virtual y webmail.
- Inscripciones, turnos, trámites o modificación de datos.
- Entrenar modelos, ejecutar LLM local, RAG/vector DB, base de datos o agentes autónomos en el producto.
- Publicar un backend o webhook sin diseñar su seguridad.
- Asegurar que el modelo gratuito elegido vaya a seguir siendo gratuito indefinidamente.

## 8. Criterios de aceptación
1. El chat funciona en modo demostración sin API.
2. El workflow se importa en n8n y devuelve el contrato acordado.
3. Las entradas inválidas se rechazan de forma controlada.
4. Las respuestas incluyen fuentes cuando corresponde y se abstienen ante preguntas sin respaldo.
5. Los errores del servicio no rompen la interfaz.
6. No hay secretos en HTML, Git ni documentación.
7. Se documentan los pasos de prueba y los resultados reales.
8. El estudiante puede explicar cada componente y sus limitaciones.

## 9. Estado actual y limitación de despliegue
El prototipo se encuentra en `prototipos/asistente-institucional.html`; el workflow inicial, en `n8n/asistente-institucional-demo.json`. La prueba conectada está pensada para ejecutarse localmente. El sitio público de GitHub Pages no puede utilizar el n8n local del desarrollador para atender a visitantes externos. Para una integración pública hará falta evaluar un backend remoto y sus medidas de seguridad por separado.
