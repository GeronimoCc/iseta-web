# Plan de pruebas

## Objetivo
Comprobar la interfaz, el contrato con n8n, el comportamiento ante entradas inválidas y la abstención cuando no hay evidencia.

## Pruebas manuales iniciales

| ID | Caso | Resultado esperado |
|---|---|---|
| T01 | Abrir el HTML sin webhook | El chat aparece y funciona en modo demostración |
| T02 | Preguntar por carreras | Respuesta de demo y fuente relacionada |
| T03 | Preguntar por horarios | Respuesta de demo y fuente relacionada |
| T04 | Preguntar qué es ISETA | Respuesta de demo y fuente relacionada |
| T05 | Preguntar algo no cubierto | Abstención, sin inventar información |
| T06 | Enviar consulta vacía | El formulario no la envía |
| T07 | Introducir más de 500 caracteres | La interfaz limita/rechaza la entrada |
| T08 | Ejecutar n8n con una consulta válida | JSON con `answer`, `sources`, `status` |
| T09 | Enviar cuerpo vacío directamente al webhook | Estado `invalid_input` |
| T10 | Enviar consulta de más de 500 caracteres al webhook | Estado `invalid_input` |
| T11 | Simular error HTTP del servicio conectado | Mensaje de error comprensible y opción de demo |
| T12 | Fuente con URL inválida | No se crea enlace ejecutable en la interfaz |
| T13 | Revisar el HTML y el repositorio | No hay claves API |
| T14 | Probar navegación por teclado | Se puede enfocar y usar el formulario |
| T15 | Reducir ancho de ventana a móvil | No hay desbordamiento horizontal grave |
| T16 | Pregunta con intento de cambiar las reglas | La respuesta no debe revelar secretos ni ignorar límites |
| T17 | Pregunta sobre aula virtual o webmail | El asistente aclara que están fuera de alcance |
| T18 | Inspeccionar consola de navegador | Sin errores inesperados en el modo probado |
| T19 | Campo vacío o con solo espacios | El botón de envío permanece deshabilitado |
| T20 | Consulta en curso | Se anuncia la carga y se bloquean temporalmente entrada y sugerencias |
| T21 | Respuesta con fuentes | Los enlaces válidos se separan del texto y se abren con seguridad |
| T22 | Abrir y cerrar con teclado | Enter/Espacio abre; Escape cierra y devuelve el foco al lanzador |
| T23 | Anchos de 390, 768, 1024 y 1280 px | Controles utilizables y sin desbordamiento horizontal |
| T24 | Chaty con panel cerrado y abierto | El lanzador no tapa Chaty y el panel queda por encima de su franja |
| T25 | Consulta no cubierta o sobre aula virtual/webmail | Abstención clara; no se inventan datos |

## Pruebas del sitio institucional
- Abrir inicio y dos páginas internas desde GitHub Pages.
- Verificar imágenes, estilos, enlaces y navegación.
- Revisar consola y pestaña Network para errores 404.
- No considerar el sitio verificado solo porque carga el HTML inicial.

## Evaluación de calidad de respuestas
Preparar un conjunto de 20–30 preguntas verificadas. Para cada una, registrar respuesta esperada, fuente, resultado obtenido y si hubo afirmaciones no respaldadas. Como objetivo inicial del prototipo, al menos 80% de las respuestas evaluables deben ser aceptables, y ninguna pregunta sin evidencia debe producir datos inventados. Este umbral es un objetivo de clase, no una garantía estadística.

## Pruebas automatizadas reproducibles

Comando (desde la raíz del repositorio, PowerShell):

```powershell
npm.cmd --prefix n8n run comprobar
```

Ejecuta el código Code del workflow desde `n8n/asistente-institucional-code.js` y primero comprueba que coincida con el nodo embebido en el JSON. No requiere n8n en ejecución ni navegador. La suite contiene 92 preguntas funcionales en 22 categorías y cinco entradas de límites/formato. Verifica estados, fragmentos de respuesta, fuente oficial para positivos, URLs HTTPS institucionales y abstenciones ante falta de evidencia. No comprueba el frontend ni el workflow activo; estos se validaron por separado el 25/10/2026, según el registro siguiente.

Para sincronizar el código fuente en el workflow JSON antes de importarlo:

```powershell
node n8n/scripts/sincronizar-workflow.mjs
```

T17 (aula virtual/webmail) mantiene la abstención explícita según D-010 y `PROJECT_SPEC.md`. La suite añade variantes, consultas ambiguas, fechas/inscripciones sin evidencia, privacidad e intentos de manipulación.

Comprobación de sintaxis: `node --check assets/asistente-institucional/asistente-institucional.js`.

## Integración global del asistente

Ejecutado y reproducible con el comando anterior:
- [x] 92 casos de conocimiento y cinco casos de entrada/formato en el código fuente del workflow.
- [x] Igualdad entre el archivo fuente de código y el nodo Code del JSON exportable.

## Verificación de la interfaz (2026-10-25)

Ejecutada con el navegador automatizado integrado; no equivale a una prueba en teléfono real ni queda automatizada en el repositorio:
- [x] Portada, página anidada de biblioteca y prototipo: un widget por página; hoja de estilos cargada en la página anidada.
- [x] Anchos de 390, 768, 1024 y 1280 px; sin desbordamiento horizontal y con separación respecto de Chaty.
- [x] Teclado: Tab y Enter en sugerencias, Enter/Espacio para abrir, Escape para cerrar y recuperar foco; Shift+Enter inserta salto de línea.
- [x] Demo: respuesta con fuente, consulta de 500 caracteres y abstención; botón deshabilitado con entrada vacía.
- [x] Respuestas simuladas del servicio: carga, HTTP 503 y alternativa de demo, respuesta vacía, respuesta larga, descarte de URL `javascript:` y abstención con fuente.
- [x] `prefers-reduced-motion`: animación del panel desactivada.
- [x] Sin errores JavaScript no controlados ni solicitudes del asistente a `localhost:5678` en modo demo. El HTTP 503 simulado sí genera el aviso de recurso fallido propio del navegador.

Reportado en etapas anteriores, **sin script ni evidencia en el repositorio** (no reproducible; repetir manualmente antes de darlo por verificado):
- [ ] Pruebas de navegador en 42 páginas (un componente por página, sin IDs duplicados, recursos desde cada profundidad, sin errores de consola).
- [ ] Sin solicitudes a `localhost` desde un host que no es local (simulado con `[::1]`).
- [ ] Paridad de cobertura entre el frontend/mode demostración y el workflow. El frontend quedó fuera de esta etapa y conserva su base anterior.

## Integración real local (2026-10-25)

Workflow `DMFleutloX8wZOxW`, publicado en `http://localhost:5678`; solicitudes `POST /webhook/iseta-asistente` con JSON. Todos los casos devuelven HTTP 200 y JSON con `answer`, `sources` y `status`; las fuentes recibidas usan HTTPS.

| Consulta | `status` | Resultado observado |
|---|---|---|
| «¿Qué es ISETA?» | `ok` | Definición institucional y fuente ¿Quiénes somos? |
| «¿Qué carreras ofrece ISETA en 2026?» | `ok` | Oferta 2026 con fuente de carreras; no incluye Mecánica Liviana |
| «¿Dónde se dicta Gestión de Energías Renovables?» | `ok` | Henderson, partido de Hipólito Yrigoyen; fuentes institucionales |
| «¿Cuál es el teléfono de ISETA?» | `ok` | Contacto institucional y fuente de Autoridades |
| «¿Qué servicios tiene la biblioteca?» | `ok` | Servicios, horario y contacto publicados; fuente de Biblioteca |
| «¿Dónde queda?» | `insufficient_context` | Abstención: no asigna una sede sin contexto |
| «¿Quién es el rector y cuál es su teléfono personal?» | `insufficient_context` | No revela datos personales ni inventa un teléfono |
| «¿Cómo entro al webmail?» | `insufficient_context` | Aclara que webmail y aula virtual están fuera de alcance |
| Cuerpo vacío `{}` | `invalid_input` | Mensaje comprensible; sin fuentes |
| «¿Dónde queda el instituto?» | `ok` | Dirección H. Yrigoyen 931; no confunde ubicación con identidad |

Prueba real del frontend desde el servidor local existente en `127.0.0.1:5500`:
- Prototipo `/prototipos/asistente-institucional.html`: pregunta sugerida de identidad y consulta sin evidencia mediante Enter; respuestas de n8n, fuentes y abstención visibles.
- Portada `/index.html`: respuesta de identidad con fuente; el estado cambió a «n8n local disponible».
- Página anidada `/institucionales/quienes-somos/index.html`: consulta de servicios con respuesta y dos fuentes.
- Teclado en la portada y página anidada: Enter abre, Escape cierra y devuelve el foco al lanzador.

No se provocó un error HTTP real mientras el webhook estaba disponible. Las verificaciones previas de 503 y otros errores fueron simuladas en navegador; esta ejecución no las repitió. La validación local no implica que GitHub Pages pueda acceder a `localhost`.

## Pasos para repetir la prueba manual completa

Requisitos: n8n en `http://localhost:5678` con el workflow reimportado y publicado; sitio servido en la raíz del repo (p. ej. `http://127.0.0.1:5500`, el puerto puede variar).
1. Abrir `/index.html`, una página anidada y `/prototipos/asistente-institucional.html`: comprobar un único widget por página y ausencia de errores de consola.
2. Repetir en anchos de 390, 768, 1024 y 1280 px; revisar que no haya desbordamiento horizontal y verificar la posición relativa a Chaty.
3. Teclado: Tab hasta el lanzador, Enter/Espacio abre; el foco pasa al título; Escape cierra y devuelve el foco. En el prototipo, recorrer campo, sugerencias, fuentes y envío sin mouse.
4. Con campo vacío, verificar envío deshabilitado. Probar Enter para enviar y Shift+Enter para salto de línea. Durante carga, comprobar el anuncio y los controles deshabilitados.
5. Preguntar «¿Qué carreras ofrece el ISETA?»: comprobar la respuesta y su fuente; ensayar mensajes largos y revisar lectura y desplazamiento.
6. Preguntar «¿Quién es el rector?» y «¿Cómo entro al webmail?»: comprobar abstención y límites de alcance, sin datos inventados.
7. Si se prueba el modo local conectado, comprobar error de conexión, acción de modo demostración, respuesta vacía y fuentes/enlaces inválidos mediante un servicio de prueba. No detener n8n durante esta validación solicitada.
8. Host no local: abrir el sitio por otro host (p. ej. `http://[::1]:5500/`, si el servidor lo admite): en Network no hay solicitudes a `localhost:5678`; las respuestas salen identificadas como demostración y el asistente no añade solicitudes externas.

Pendientes:
- [ ] Completar los casos T01–T25 que no quedaron cubiertos por el registro de integración anterior (en particular tamaños de pantalla, error HTTP, URL de fuente inválida y prueba en teléfono).
- [ ] Revisión manual en un navegador real y en un teléfono.
- [ ] Backend público con URL HTTPS para el modo conectado (`urlProduccion`); hoy no existe, no está listo para producción.
- [ ] Revisión institucional del contenido de las respuestas de demostración.

## Registro
Por cada ejecución, anotar fecha, versión/commit, pregunta, resultado, estado, fuentes, observaciones y si se aprobó. Diferenciar pruebas ejecutadas de pruebas pendientes.
