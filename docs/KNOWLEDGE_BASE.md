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
El prototipo HTML conserva una base de demostración anterior y acotada. El conocimiento ampliado de esta revisión se aplica al workflow de n8n; no se modificó el frontend. La instancia activa tampoco se actualizó. Las pruebas del workflow no implican que el widget integrado o el modo demostración local tengan la misma cobertura.

## Clasificación del conocimiento (actualizada 25/10/2026)

**A. Confirmado por el responsable del proyecto**
- Denominación: Instituto Superior Experimental de Tecnología Alimentaria (ISETA).
- Nombres de carreras: Tec. Sup. en Higiene, Seguridad y Ambiente Laboral; Tec. Sup. en Gestión de Energías Renovables.

**B. Respaldado por páginas institucionales** (copia local revisada el 22/10/2026 y páginas oficiales consultadas el 25/10/2026)
- Dependencia de la Dirección General de Cultura y Educación de la Provincia de Buenos Aires (¿Quiénes somos?).
- Inauguración institucional el 17/7/1978 (¿Quiénes somos?).
- La página oficial de oferta académica 2026 enumera siete carreras y enlaza resoluciones/diseños curriculares para las publicadas. La copia local anterior y la página de horarios aún incluyen Mecánica Liviana; su situación actual no está confirmada y el asistente no afirma que siga abierta.
- Gestión de Energías Renovables se dicta en la extensión áulica de Henderson, partido de Hipólito Yrigoyen (¿Quiénes somos?).
- Perfil profesional de Análisis de Sistemas y servicio de consultas (página de la carrera).
- Dirección, teléfono, correo y horarios de atención (página oficial de Autoridades/contacto).
- Servicios generales, investigación y áreas de trabajo (¿Quiénes somos?).
- Servicios, horario y contacto de Biblioteca (página oficial de Biblioteca).
- Régimen Académico Marco Jurisdiccional (Resolución 4196/24; página Legales indica vigencia desde 2025) y Resolución 6179/25 de pruebas de selección.

**C. Pendiente de verificar** (el asistente responde que no tiene datos verificados)
- Interpretación de planes/resoluciones, duración, requisitos de ingreso, aranceles y fechas/procedimientos de inscripción. La oferta enlaza documentos curriculares, pero el asistente no los interpreta.
- Sede de las carreras distintas de Gestión de Energías Renovables.
- Vigencia de cada horario de cursada y actividades/capacitaciones abiertas. La página de horarios dice que se actualiza; las fechas de cursos y noticias pueden ser históricas.
- Nombres de autoridades actuales y responsables de departamentos.
- Convocatorias de inscripción vigentes, carnet estudiantil y vigencia de actividades sobre carnet de manipulación.
- Título y slogan de la copia HTTrack, que dicen «Instituto Experimental…»; no se confirmó si esa copia representa el sitio vivo actual.
- Cuerpo de la página de Higiene, Seguridad y Ambiente Laboral, que todavía dice «Higiene y Seguridad en el Trabajo».

## Detalle del inventario (copia local, 22/10/2026)

Verificación realizada contra la **copia local** del sitio (carpeta HTTrack del repositorio). No se consultó el sitio en vivo en esta etapa; antes de presentar el proyecto, volver a comprobar cada dato en <https://iseta.edu.ar/iseta/>.

| Tema | Qué puede responder hoy | Fuente revisada | Estado |
|---|---|---|---|
| Identidad | Nombre: Instituto Superior Experimental de Tecnología Alimentaria (ISETA). Depende de la Dirección General de Cultura y Educación de la Provincia de Buenos Aires. | `institucionales/quienes-somos/`; denominación confirmada por el equipo (22/10/2026) | Verificado. El título y el slogan del sitio todavía dicen «Instituto Experimental de Tecnología Alimentaria»: informar a la institución para que lo actualice. El asistente no usa esa forma |
| Carreras (general) | La página oficial de oferta académica 2026 enumera siete carreras y enlaza documentos curriculares. Mecánica Liviana aparece en la copia local y horarios, pero no en esa lista 2026 | <https://iseta.edu.ar/iseta/carreras/> (consultada 25/10/2026) | La situación vigente de Mecánica Liviana no se infiere |
| Tec. Sup. en Análisis de Sistemas | Página propia con el perfil profesional (planificar y gestionar proyectos de desarrollo; diagnosticar problemas y diseñar soluciones informáticas) | `carreras/tec-sup-en-analisis-de-sistemas/` | Verificado (perfil). **Pendiente:** duración, plan de estudios, requisitos e inscripción. «Ver Resolución» no revisado |
| Lista de carreras | La página vigente de oferta 2026 enumera siete títulos; Mecánica Liviana persiste en la copia local y en horarios, sin estado actual confirmado | <https://iseta.edu.ar/iseta/carreras/> y <https://iseta.edu.ar/iseta/horarios/> (25/10/2026) | Verificado con discrepancia; abstenerse sobre la situación de Mecánica |
| Horarios | La sección indica que la información se está actualizando y enlaza planillas por carrera/año | <https://iseta.edu.ar/iseta/horarios/> (25/10/2026) | No confirmar vigencia de cada planilla |
| Contacto y atención | Teléfono +54 02317 422305; correo iseta@abc.gob.ar; H. Yrigoyen 931 – 9 de Julio, Buenos Aires. Departamentos: lunes a viernes de 8 a 12 h; área académica: lunes a viernes de 8 a 22:40 h | <https://iseta.edu.ar/iseta/institucionales/autoridades/> (25/10/2026) | Publicado por el sitio; confirmar cambios |
| Biblioteca | Consulta de libros en sala, orientación informativa y formación de usuarios; horarios publicados y contacto bibliotecaiseta@gmail.com | <https://iseta.edu.ar/iseta/departamentos-y-servicios/biblioteca/> (25/10/2026) | Publicado por el sitio; confirmar cambios |
| Servicios e investigación | Análisis de suelos, aguas, semillas, alimentos y asesoramiento técnico; I+D en alimentos y áreas relacionadas | <https://iseta.edu.ar/iseta/institucionales/quienes-somos/> (25/10/2026) | Descripción general, no catálogo de análisis ni tarifas |
| Autoridades y áreas | La página de contacto no incluye nombres actuales. La descripción institucional agrupa docencia, servicios e investigación | Páginas oficiales de Autoridades y ¿Quiénes somos? (25/10/2026) | Nombres y responsabilidades particulares pendientes |
| Capacitaciones, noticias y carnets | Hay páginas oficiales, pero sus publicaciones tienen fechas, plazos y condiciones temporales; la publicación del carnet consultada es de 2025 | `/departamentos-y-servicios/cursos/`, `/noticias/` y publicación de carnet (25/10/2026) | No afirmar que haya convocatoria abierta |
| Inscripciones, pruebas de selección, convocatorias | — | — | Pendiente. Requieren fuente vigente; no usar noticias o entradas de feed antiguas |
| Aula virtual, webmail, trámites, datos personales | — | — | Fuera de alcance (D-010) |

**Temas cubiertos por el workflow del repositorio:** identidad e inauguración; oferta académica 2026 y enlaces curriculares; perfil de Análisis de Sistemas; extensión de Henderson; ubicación/contacto y horarios de atención; servicios generales, investigación y Biblioteca; orientación a páginas de horarios, capacitaciones, noticias y legales. Las fechas de atención y biblioteca incluyen fecha de consulta y advertencia de vigencia.

**Límites vigentes:** no interpreta los documentos curriculares; no conoce requisitos, duración, aranceles ni procedimientos de inscripción; no confirma horarios de cursada, actividades abiertas o autoridades actuales; no hay sede confirmada para las demás carreras; aula virtual, webmail, acceso autenticado y datos personales continúan fuera de alcance. El widget del frontend y el workflow activo no reciben automáticamente este conocimiento.

**Denominación:** el equipo confirmó el 22/10/2026 que el nombre correcto es Instituto Superior Experimental de Tecnología Alimentaria, que es la respuesta del asistente. El título y el slogan del sitio siguen con la forma «Instituto Experimental…»; es una inconsistencia del sitio para informar a la institución, no una duda sobre la respuesta.
