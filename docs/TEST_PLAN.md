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

## Pruebas automatizadas reproducibles

Comando (desde la raíz del repositorio, PowerShell):

```powershell
npm.cmd --prefix n8n run comprobar
```

Ejecuta `n8n/scripts/comprobar-conocimiento.mjs`: corre el código del workflow y la lógica de demostración del módulo compartido con las mismas consultas y verifica estado, texto y que ambos coincidan. No requiere n8n en ejecución ni navegador. Cubre qué es ISETA, ubicación («¿Dónde queda el ISETA/instituto?»), carreras, horarios, aula virtual, webmail, preguntas fuera del conocimiento, intentos de manipulación de instrucciones (relacionados con T16/T17) y los límites de entrada (vacío, 500 y 501 caracteres). Última ejecución: ver el informe de la etapa 4.

T17 (aula virtual/webmail): el workflow y el módulo compartido responden que están fuera de alcance (`insufficient_context`, fuente: sitio institucional) y el script comprueba ese texto. Se mantiene el criterio de D-010 y de `PROJECT_SPEC.md`; no se agregó información institucional.

Comprobación de sintaxis: `node --check assets/asistente-institucional/asistente-institucional.js`.

## Integración global del asistente

Ejecutado y reproducible con el comando anterior:
- [x] Comprobación del contenido de demostración adaptada al módulo compartido.

Reportado en etapas anteriores, **sin script ni evidencia en el repositorio** (no reproducible; repetir manualmente antes de darlo por verificado):
- [ ] Pruebas de navegador en 42 páginas (un componente por página, sin IDs duplicados, recursos desde cada profundidad, sin errores de consola).
- [ ] Sin solicitudes a `localhost` desde un host que no es local (simulado con `[::1]`).

## Prueba manual breve (pendiente de ejecutar en navegador)

Requisitos: n8n en `http://localhost:5678` con el workflow reimportado y publicado; sitio servido en la raíz del repo (p. ej. `http://127.0.0.1:5500`, el puerto puede variar).
1. Abrir `/index.html` (o la portada) y `/carreras/tec-sup-en-alimentos/`: hay un solo botón del asistente y carga sin errores en consola.
2. Abrir `/prototipos/asistente-institucional.html`: el asistente funciona igual.
3. Teclado: Tab hasta el botón, Enter/Espacio abre; el foco pasa al panel; Escape cierra y el foco vuelve al botón.
4. Preguntar «¿Qué carreras ofrece el ISETA?»: respuesta con fuente. Preguntar «¿Quién es el rector?»: abstención sin datos inventados.
5. «¿Cómo entro al webmail?»: aclara que está fuera de alcance.
6. Error de conexión: detener n8n (solo en tu entorno de prueba) y preguntar: mensaje de error comprensible y botón de modo demostración.
7. Host no local: abrir el sitio por otro host (p. ej. `http://[::1]:5500/`, si el servidor lo admite): en Network no hay solicitudes a `localhost:5678` y las respuestas salen identificadas como demostración.

Pendientes:
- [ ] Pruebas manuales T01–T18 en navegador (T06, T07, T11, T12, T14, T15, T18 requieren navegador).
- [ ] Revisión manual en un navegador real y en un teléfono.
- [ ] Backend público con URL HTTPS para el modo conectado (`urlProduccion`); hoy no existe, no está listo para producción.
- [ ] Revisión institucional del contenido de las respuestas de demostración.

## Registro
Por cada ejecución, anotar fecha, versión/commit, pregunta, resultado, estado, fuentes, observaciones y si se aprobó. Diferenciar pruebas ejecutadas de pruebas pendientes.
