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
| T11 | Apagar n8n y consultar desde el frontend conectado | Mensaje de error comprensible |
| T12 | Fuente con URL inválida | No se crea enlace ejecutable en la interfaz |
| T13 | Revisar el HTML y el repositorio | No hay claves API |
| T14 | Probar navegación por teclado | Se puede enfocar y usar el formulario |
| T15 | Reducir ancho de ventana a móvil | No hay desbordamiento horizontal grave |
| T16 | Pregunta con intento de cambiar las reglas | La respuesta no debe revelar secretos ni ignorar límites |
| T17 | Pregunta sobre aula virtual o webmail | El asistente aclara que están fuera de alcance |
| T18 | Inspeccionar consola de navegador | Sin errores inesperados en el modo probado |

## Pruebas del sitio institucional
- Abrir inicio y dos páginas internas desde GitHub Pages.
- Verificar imágenes, estilos, enlaces y navegación.
- Revisar consola y pestaña Network para errores 404.
- No considerar el sitio verificado solo porque carga el HTML inicial.

## Evaluación de calidad de respuestas
Preparar un conjunto de 20–30 preguntas verificadas. Para cada una, registrar respuesta esperada, fuente, resultado obtenido y si hubo afirmaciones no respaldadas. Como objetivo inicial del prototipo, al menos 80% de las respuestas evaluables deben ser aceptables, y ninguna pregunta sin evidencia debe producir datos inventados. Este umbral es un objetivo de clase, no una garantía estadística.

## Registro
Por cada ejecución, anotar fecha, versión/commit, pregunta, resultado, estado, fuentes, observaciones y si se aprobó. Diferenciar pruebas ejecutadas de pruebas pendientes.
