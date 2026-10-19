# Plan de implementación

## Fase 1 — Sincronizar y entender el repositorio
- [x] Revisar la rama principal actual.
- [x] Confirmar que las imágenes ya están en GitHub.
- [x] Recuperar el prototipo y el workflow de la rama anterior.
- [ ] Revisar el sitio publicado en un navegador y anotar fallos reales.
- [ ] Revisar cambios antes de crear un PR.

## Fase 2 — Preparar la base de trabajo
- [x] Mantener el chat en un HTML independiente.
- [x] Preparar workflow n8n de demostración.
- [x] Documentar arquitectura, requisitos, fuentes y pruebas.
- [x] Agregar instrucciones generales y agentes de desarrollo para VS Code.
- [ ] Probar la importación real del workflow en n8n.

## Fase 3 — Conectar la interfaz con n8n local
1. Instalar o iniciar n8n local.
2. Importar el JSON.
3. Probar primero el webhook desde n8n.
4. Servir el HTML mediante un servidor local (no asumir que abrir `file://` funcionará con CORS).
5. Configurar la Test URL, probar una consulta y comprobar la respuesta.
6. Activar el workflow y probar la Production URL local.
7. No publicar el webhook.

## Fase 4 — Verificar conocimiento
- Elegir 10–20 entradas iniciales de fuentes institucionales.
- Verificar cada afirmación y enlace.
- Preparar 20–30 preguntas de prueba.
- Registrar errores y corregirlos antes de sumar un modelo.

## Fase 5 — Incorporar modelo remoto (solo cuando el MVP funcione)
- Comparar proveedores gratuitos disponibles en ese momento.
- Revisar límites de uso y tratamiento de datos.
- Configurar credencial exclusivamente en n8n.
- Enviar solo pregunta y contexto público relevante.
- Añadir abstención, límites, errores y pruebas de respuestas no respaldadas.
- No hacer que el modelo ejecute herramientas o acciones.

## Fase 6 — Presentación
- Explicar problema, alcance, arquitectura, decisiones, pruebas y limitaciones.
- Mostrar una consulta con fuente y una consulta que provoque abstención.
- Demostrar manejo de error.
- Aclarar que la versión conectada corre localmente si no se implementa un backend público seguro.

## Criterio de avance
No pasar a la fase siguiente si la anterior no funciona o si no se pueden explicar sus componentes. No agregar servicios por anticipado.
