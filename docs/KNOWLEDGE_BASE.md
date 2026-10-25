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

## Clasificación del conocimiento (actualizada 24/10/2026)

**A. Confirmado por el responsable del proyecto**
- Denominación: Instituto Superior Experimental de Tecnología Alimentaria (ISETA).
- Nombres de carreras: Tec. Sup. en Higiene, Seguridad y Ambiente Laboral; Tec. Sup. en Gestión de Energías Renovables.

**B. Respaldado por páginas institucionales revisadas** (copia local, 22/10/2026)
- Dependencia de la Dirección General de Cultura y Educación de la Provincia de Buenos Aires (¿Quiénes somos?).
- Oferta de ocho carreras (menú del sitio), cada una con página propia. Los nombres coinciden con los del punto A.
- Gestión de Energías Renovables se dicta en la extensión áulica de Henderson, partido de Hipólito Yrigoyen (¿Quiénes somos?).
- Perfil profesional de Análisis de Sistemas (página de la carrera).
- Sección de horarios, con la aclaración de que se están actualizando para el ciclo lectivo vigente.

**C. Pendiente de verificar** (el asistente responde que no tiene datos verificados)
- Duración, planes de estudio, requisitos, aranceles y fechas de inscripción de todas las carreras.
- Sede de las carreras distintas de Gestión de Energías Renovables.
- Horarios por carrera (enlaces «Ver Horarios») y resoluciones (enlaces «Ver Resolución»).
- Dirección, teléfono, correo y horarios de atención (figuran en el pie de página de la copia local; no están cargados en el asistente).
- Fecha de inauguración (17/7/1978, según ¿Quiénes somos?): verificada en el texto, todavía no cargada.
- Autoridades, biblioteca, departamentos individuales, convocatorias e inscripciones vigentes.
- Título y slogan del sitio, que dicen «Instituto Experimental…».
- Cuerpo de la página de Higiene, Seguridad y Ambiente Laboral, que todavía dice «Higiene y Seguridad en el Trabajo».

## Detalle del inventario (copia local, 22/10/2026)

Verificación realizada contra la **copia local** del sitio (carpeta HTTrack del repositorio). No se consultó el sitio en vivo en esta etapa; antes de presentar el proyecto, volver a comprobar cada dato en <https://iseta.edu.ar/iseta/>.

| Tema | Qué puede responder hoy | Fuente revisada | Estado |
|---|---|---|---|
| Identidad | Nombre: Instituto Superior Experimental de Tecnología Alimentaria (ISETA). Depende de la Dirección General de Cultura y Educación de la Provincia de Buenos Aires. | `institucionales/quienes-somos/`; denominación confirmada por el equipo (22/10/2026) | Verificado. El título y el slogan del sitio todavía dicen «Instituto Experimental de Tecnología Alimentaria»: informar a la institución para que lo actualice. El asistente no usa esa forma |
| Carreras (general) | Existe una sección de carreras | Menú de carreras; `institucionales/quienes-somos/` | Verificado |
| Tec. Sup. en Análisis de Sistemas | Página propia con el perfil profesional (planificar y gestionar proyectos de desarrollo; diagnosticar problemas y diseñar soluciones informáticas) | `carreras/tec-sup-en-analisis-de-sistemas/` | Verificado (perfil). **Pendiente:** duración, plan de estudios, requisitos e inscripción. «Ver Resolución» no revisado |
| Lista de carreras | Ocho carreras en el menú del sitio, cada una con página propia. Nombres confirmados por el responsable para Higiene, Seguridad y Ambiente Laboral y Gestión de Energías Renovables. La segunda se dicta en la extensión áulica de Henderson (partido de Hipólito Yrigoyen) | Menú del sitio; `institucionales/quienes-somos/`; páginas de cada carrera | Verificado e incorporado al asistente (24/10/2026). **Pendiente:** el cuerpo de la página de Higiene todavía dice «Higiene y Seguridad en el Trabajo» |
| Horarios | Existe la sección. La página indica: «Los horarios se están actualizando para el presente ciclo lectivo» | `horarios/` | Parcial. Los horarios por carrera están en enlaces «Ver» que no fueron revisados. No afirmar qué horario está vigente |
| Contacto y horarios de atención | Teléfono +54 02317 422305; correo iseta@abc.gob.ar; H. Yrigoyen 931 – 9 de Julio, Buenos Aires. Departamentos: lunes a viernes de 8 a 12 hs; área académica: lunes a viernes de 8 a 22.40 hs | Pie de página (presente en `institucionales/quienes-somos/` y `horarios/`) | Verificado en la copia local. **No está** en el workflow todavía |
| Departamentos, servicios e investigación | Descripción general: análisis de suelos, aguas, semillas y alimentos; asesoramiento a industrias y productores; investigación en alimentos | `institucionales/quienes-somos/` | Solo descripción general. Departamentos individuales no revisados |
| Autoridades, legales, biblioteca, capacitaciones | — | — | Pendiente. No revisado |
| Inscripciones, pruebas de selección, convocatorias | — | — | Pendiente. Requieren fuente vigente; no usar noticias o entradas de feed antiguas |
| Aula virtual, webmail, trámites, datos personales | — | — | Fuera de alcance (D-010) |

**Temas que el asistente responde hoy con evidencia:** identidad de la institución (nombre y dependencia); el listado de las ocho carreras; el nombre y la página de cada carrera; la sede de Gestión de Energías Renovables (extensión áulica en Henderson); el perfil profesional de Análisis de Sistemas; y la existencia de la sección de horarios con la aclaración de actualización.

**Temas que requieren incorporar fuentes:** duración, planes de estudio, requisitos e inscripción de cada carrera; sede de las carreras distintas de Gestión de Energías Renovables; horarios por carrera; contacto y horarios de atención; autoridades; convocatorias e inscripciones vigentes.

**Denominación:** el equipo confirmó el 22/10/2026 que el nombre correcto es Instituto Superior Experimental de Tecnología Alimentaria, que es la respuesta del asistente. El título y el slogan del sitio siguen con la forma «Instituto Experimental…»; es una inconsistencia del sitio para informar a la institución, no una duda sobre la respuesta.
