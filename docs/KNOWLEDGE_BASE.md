# Diseño de la base de conocimiento

## Objetivo
Mantener un conjunto pequeño de información pública, verificable y útil para preguntas frecuentes. La primera versión no necesita un sistema de búsqueda vectorial ni una base de datos.

## Fuentes candidatas
1. Carreras y páginas académicas.
2. Horarios publicados.
3. Información institucional y autoridades.
4. Ubicación, contacto y servicios institucionales.
5. Documentos oficiales (PDF u otros) solo después de comprobar vigencia y pertinencia.

## Formato de cada entrada
- **Tema**
- **Preguntas posibles**
- **Respuesta o fragmento verificado**
- **Título de la fuente**
- **URL pública o ruta relativa**
- **Fecha de verificación** (si se conoce)
- **Observaciones de vigencia** (por ejemplo, año lectivo)
- **Estado:** verificado / pendiente / desactualizado

## Reglas de selección
- No incorporar automáticamente todos los archivos del repositorio.
- Priorizar páginas oficiales y documentos institucionales vigentes.
- Diferenciar información permanente de fechas, horarios o convocatorias que pueden cambiar.
- No usar noticias antiguas para afirmar que una convocatoria sigue abierta.
- No usar páginas de feed, comentarios, autores, metadatos irrelevantes o contenido duplicado como fuente de respuestas.
- Si dos fuentes se contradicen, no resolver la contradicción por intuición: registrar el caso y abstenerse hasta verificarlo.
- Excluir aula virtual, webmail, datos personales y contenido que requiera autenticación.

## Comportamiento esperado
- Responder solo si el contexto respalda la respuesta.
- Enlazar la fuente utilizada.
- Si no hay evidencia suficiente, decirlo con claridad y orientar a la web institucional.
- No inventar fechas, requisitos, aranceles, teléfonos ni trámites.
- Indicar cuando un dato debe confirmarse porque puede haber cambiado.

## Estado inicial
El prototipo HTML contiene respuestas de demostración sobre carreras, horarios e información institucional. No deben considerarse una base definitiva: verificar el texto contra la página vigente antes de presentar el proyecto. La versión de n8n repite un conjunto mínimo de respuestas para validar el contrato; cuando se conecten ambos componentes, evitar mantener dos fuentes divergentes sin necesidad.
