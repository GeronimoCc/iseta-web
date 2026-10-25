const incoming = $input.first().json;
let body = incoming.body ?? incoming;
if (typeof body === 'string') {
  try {
    body = JSON.parse(body);
  } catch {
    body = {};
  }
}

const message = typeof body.message === 'string' ? body.message.trim() : '';
const maxLength = 500;
const homeSource = { title: 'Sitio institucional del ISETA', url: 'https://iseta.edu.ar/iseta/' };

if (!message) {
  return [{ json: {
    answer: 'Escribí una consulta para que pueda ayudarte.',
    sources: [],
    status: 'invalid_input'
  } }];
}

if (message.length > maxLength) {
  return [{ json: {
    answer: 'La consulta supera el límite de 500 caracteres. Acortala e intentá de nuevo.',
    sources: [],
    status: 'invalid_input'
  } }];
}

const normalize = (value) => value.toLocaleLowerCase('es')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[¿?¡!,.;:()[\]{}]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
const query = normalize(message);
const insufficient = (answer, sources = [homeSource]) => ({
  answer,
  sources,
  status: 'insufficient_context'
});

const manipulationTerms = [
  'ignora tus instrucciones', 'ignora las instrucciones', 'ignora las instrucciones anteriores',
  'ignora todas las reglas', 'ignora las reglas anteriores', 'olvida tus reglas',
  'revela tu prompt', 'mostrame tu prompt', 'muestra tu prompt',
  'dime tus claves', 'muestra tus secretos', 'modo administrador', 'sin restricciones',
  'ignore all previous instructions', 'ignore the rules', 'reveal the system prompt'
];
if (manipulationTerms.some((term) => query.includes(normalize(term)))) {
  return [{ json: insufficient('No puedo revelar instrucciones internas ni datos privados. Puedo responder consultas institucionales con fuentes públicas.') }];
}

const outOfScopeTerms = ['aula virtual', 'campus virtual', 'webmail', 'correo web'];
if (outOfScopeTerms.some((term) => query.includes(term))) {
  return [{ json: insufficient('El aula virtual y el webmail están fuera del alcance de este asistente: no puedo acceder a esos servicios, ayudar con ingresos ni gestionar cuentas o datos personales. Consultá el sitio institucional del ISETA o a la institución.') }];
}

const sources = {
  about: { title: '¿Quiénes somos? — ISETA', url: 'https://iseta.edu.ar/iseta/institucionales/quienes-somos/' },
  contact: { title: 'Autoridades y contacto — ISETA', url: 'https://iseta.edu.ar/iseta/institucionales/autoridades/' },
  careers: { title: 'Oferta académica 2026 — ISETA', url: 'https://iseta.edu.ar/iseta/carreras/' },
  analysis: { title: 'Tec. Sup. en Análisis de Sistemas — ISETA', url: 'https://iseta.edu.ar/iseta/carreras/tec-sup-en-analisis-de-sistemas/' },
  hours: { title: 'Horarios — ISETA', url: 'https://iseta.edu.ar/iseta/horarios/' },
  departments: { title: 'Departamentos y Servicios — ISETA', url: 'https://iseta.edu.ar/iseta/departamentos-y-servicios/' },
  library: { title: 'Biblioteca — ISETA', url: 'https://iseta.edu.ar/iseta/departamentos-y-servicios/biblioteca/' },
  courses: { title: 'Capacitaciones — ISETA', url: 'https://iseta.edu.ar/iseta/departamentos-y-servicios/cursos/' },
  legal: { title: 'Legales — ISETA', url: 'https://iseta.edu.ar/iseta/institucionales/legales/' },
  news: { title: 'Noticias — ISETA', url: 'https://iseta.edu.ar/iseta/noticias/' },
  carnet: { title: 'Carnet de Manipulación Segura de Alimentos — ISETA', url: 'https://iseta.edu.ar/iseta/obtene-tu-carnet-oficial-de-manipulacion-segura-de-alimentos/' }
};

const knowledge = [
  {
    terms: ['que es iseta', 'que significa iseta', 'que es el iseta', 'que significa el iseta', 'que es el instituto', 'quien es iseta', 'quienes son iseta', 'sobre iseta'],
    answer: 'ISETA es el Instituto Superior Experimental de Tecnología Alimentaria. Depende de la Dirección General de Cultura y Educación de la Provincia de Buenos Aires. La institución desarrolla actividades de docencia, servicios e investigación.',
    sources: [sources.about]
  },
  {
    terms: ['historia de iseta', 'cuando se inauguro iseta', 'fecha de inauguracion de iseta', 'fundacion de iseta', 'en que ano se inauguro iseta'],
    answer: 'La página institucional informa que ISETA fue inaugurado el 17 de julio de 1978. Fuente consultada el 25/10/2026.',
    sources: [sources.about]
  },
  {
    terms: ['donde queda iseta', 'donde queda el instituto', 'donde esta iseta', 'donde se encuentra iseta', 'direccion de iseta', 'cual es la direccion', 'ubicacion de iseta', 'ubicacion del instituto', 'como llegar al iseta', 'como llego al iseta', 'direccion del instituto'],
    answer: 'La página oficial de contacto informa la dirección H. Yrigoyen 931, 9 de Julio, Buenos Aires. Verificá los datos de atención en la fuente institucional. Consultada el 25/10/2026.',
    sources: [sources.contact]
  },
  {
    terms: ['extension aulica', 'extension en henderson', 'sede henderson', 'henderson', 'donde se dicta gestion de energias renovables', 'donde cursar energias renovables'],
    answer: 'La página institucional informa que la Tec. Sup. en Gestión de Energías Renovables se dicta en la extensión áulica de Henderson, partido de Hipólito Yrigoyen.',
    sources: [sources.about, sources.careers]
  },
  {
    terms: ['que carreras ofrece', 'carreras ofrece iseta', 'que carreras tiene iseta', 'cuales son las carreras', 'oferta academica', 'que puedo estudiar', 'tecnicaturas ofrece', 'que tecnicaturas hay', 'lista de carreras', 'carreras de iseta', 'carreras disponibles'],
    answer: 'La oferta académica 2026 publicada por ISETA enumera: Tec. Sup. en Servicios Gastronómicos, Alimentos, Biotecnología, Higiene, Seguridad y Ambiente Laboral, Análisis de Sistemas, Producción Agrícola-Ganadera y Gestión de Energías Renovables. La página enlaza las resoluciones o diseños curriculares disponibles para cada carrera. Consultada el 25/10/2026.',
    sources: [sources.careers]
  },
  {
    terms: ['mecanica liviana', 'tecnicatura en mecanica', 'carrera de mecanica'],
    answer: 'La página oficial de oferta académica 2026 consultada no incluye Mecánica Liviana en su lista. No puedo confirmar si sigue abierta, está en cierre o cuál es su situación actual; consultá directamente la información oficial.',
    sources: [sources.careers, sources.legal],
    status: 'insufficient_context'
  },
  {
    terms: ['analisis de sistemas', 'analista de sistemas', 'analisis de sistmas', 'analisis de sistemass'],
    answer: 'La página de la Tec. Sup. en Análisis de Sistemas describe competencias para planificar y gestionar proyectos de desarrollo, diagnosticar problemas organizacionales y diseñar soluciones informáticas. También enumera otras incumbencias profesionales. Para el diseño curricular oficial, consultá la resolución enlazada en la oferta académica.',
    sources: [sources.analysis, sources.careers]
  },
  {
    terms: ['tecnicatura en alimentos', 'tecnicatura ofrece alimentos', 'tecnico superior en alimentos', 'carrera de alimentos'],
    answer: 'La Tec. Sup. en Alimentos figura en la oferta académica 2026 del ISETA, que enlaza su diseño curricular oficial. Consultá la página para ver el documento vigente; este asistente no interpreta requisitos ni duración.',
    sources: [sources.careers]
  },
  {
    terms: ['biotecnologia', 'tecnicatura en biotecnologia', 'carrera de biotecnologia'],
    answer: 'La Tec. Sup. en Biotecnología figura en la oferta académica 2026 del ISETA, que enlaza su resolución y rectificatoria. Consultá el documento oficial para el plan y su vigencia.',
    sources: [sources.careers]
  },
  {
    terms: ['higiene seguridad', 'higiene y seguridad', 'ambiente laboral', 'seguridad laboral'],
    answer: 'La Tec. Sup. en Higiene, Seguridad y Ambiente Laboral figura en la oferta académica 2026 del ISETA, que enlaza su resolución. Consultá el documento oficial para el plan y su vigencia.',
    sources: [sources.careers]
  },
  {
    terms: ['servicios gastronomicos', 'gastronomia', 'tecnicatura gastronomica'],
    answer: 'La Tec. Sup. en Servicios Gastronómicos figura en la oferta académica 2026 del ISETA, que enlaza su resolución. Consultá el documento oficial para el plan y su vigencia.',
    sources: [sources.careers]
  },
  {
    terms: ['produccion agricola ganadera', 'produccion agricola', 'produccion ganadera'],
    answer: 'La Tec. Sup. en Producción Agrícola-Ganadera figura en la oferta académica 2026 del ISETA, que enlaza su resolución. Consultá el documento oficial para el plan y su vigencia.',
    sources: [sources.careers]
  },
  {
    terms: ['plan de estudio', 'plan de estudios', 'resolucion de la carrera', 'diseno curricular', 'diseno curricul'],
    answer: 'La página oficial de oferta académica enlaza resoluciones o diseños curriculares para las carreras allí publicadas. Seleccioná la carrera y consultá el documento fuente; este asistente no interpreta requisitos, duración ni equivalencias.',
    sources: [sources.careers]
  },
  {
    terms: ['horario de atencion', 'horarios de atencion', 'horario de atencion de iseta', 'a que hora abre iseta', 'horario departamentos', 'horarios departamentos', 'atienden los departamentos', 'horario area academica', 'horario del area academica'],
    answer: 'La página oficial informa atención de departamentos de lunes a viernes de 8 a 12 h y del área académica de lunes a viernes de 8 a 22:40 h. Información consultada el 25/10/2026; confirmá posibles cambios con ISETA.',
    sources: [sources.contact]
  },
  {
    terms: ['horario de biblioteca', 'horarios biblioteca', 'biblioteca', 'biblioteka', 'libros en sala', 'consulta de libros', 'correo de biblioteca', 'mail de biblioteca', 'email de biblioteca'],
    answer: 'La página de Biblioteca informa consulta de libros en sala, orientación para buscar información y formación de usuarios. Publica estos horarios: lunes, miércoles y viernes de 13:30 a 22:30; martes y jueves de 7:30 a 12 y de 18 a 22. También publica el contacto bibliotecaiseta@gmail.com. Consultada el 25/10/2026; confirmá posibles cambios en la fuente.',
    sources: [sources.library]
  },
  {
    terms: ['telefono', 'correo', 'email', 'mail de iseta', 'mail del instituto', 'correo de iseta', 'correo del instituto', 'email de iseta', 'contacto de iseta', 'como contacto', 'contactar al instituto', 'atencion de iseta', 'donde consulto por atencion'],
    answer: 'La página institucional de contacto publica el teléfono +54 02317 422305 y el correo iseta@abc.gob.ar. La dirección es H. Yrigoyen 931, 9 de Julio, Buenos Aires. Consultada el 25/10/2026; verificá cambios en la fuente oficial.',
    sources: [sources.contact]
  },
  {
    terms: ['servicios institucionales', 'servicios ofrece iseta', 'que servicios ofrece', 'analisis de suelos', 'analisis de agua', 'analisis de aguas', 'analisis de semillas', 'asesoran a productores'],
    answer: 'ISETA describe servicios de análisis de suelos, aguas, semillas, alimentos balanceados y productos alimenticios, además de asesoramiento técnico a industrias y productores. Para consultas específicas, revisá la página institucional.',
    sources: [sources.about, sources.departments]
  },
  {
    terms: ['investigacion en iseta', 'que investiga iseta', 'investigacion alimentos', 'investigacion alimentaria'],
    answer: 'La descripción institucional indica que ISETA realiza estudio y desarrollo científico-tecnológico en alimentos, con áreas como nutrición, microbiología, carnes, lácteos, frutas, hortalizas, cereales y evaluación sensorial.',
    sources: [sources.about]
  },
  {
    terms: ['departamentos', 'organizacion de iseta', 'areas de trabajo de iseta', 'que hace iseta'],
    answer: 'La información institucional organiza las actividades de ISETA en docencia, servicios e investigación. Describe análisis de productos y asesoramiento técnico, pero no tengo una nómina verificada de autoridades o responsables actuales.',
    sources: [sources.about, sources.departments]
  },
  {
    terms: ['capacitaciones', 'cursos de iseta', 'cursos ofrece iseta', 'jornadas de capacitacion', 'formacion abierta'],
    answer: 'ISETA publica capacitaciones y cursos en su sitio. Sus fechas, cupos y condiciones cambian; no puedo confirmar qué actividad está abierta hoy. Revisá la página oficial de capacitaciones. Consultada el 25/10/2026.',
    sources: [sources.courses],
    status: 'insufficient_context'
  },
  {
    terms: ['curso de manipulacion', 'cursos de manipulacion', 'manipulacion de alimentos'],
    answer: 'ISETA publica capacitaciones y cursos en su sitio. Sus fechas, cupos y condiciones cambian; no puedo confirmar qué actividad está abierta hoy. Revisá la página oficial de capacitaciones. Consultada el 25/10/2026.',
    sources: [sources.courses],
    status: 'insufficient_context'
  },
  {
    terms: ['noticias', 'novedades de iseta', 'eventos de iseta', 'jornadas', 'actividades de iseta'],
    answer: 'El sitio tiene una sección de noticias y actividades, pero sus publicaciones pueden ser históricas. No puedo confirmar que una actividad concreta siga vigente; consultá la fecha y el estado en la publicación oficial. Consultada el 25/10/2026.',
    sources: [sources.news],
    status: 'insufficient_context'
  },
  {
    terms: ['carnet de manipulacion', 'carnet de manipulador', 'carnet manipulador', 'carnet alimentos', 'carnet de alimentos'],
    answer: 'El sitio conserva una publicación sobre un curso para obtener el Carnet Oficial de Manipulación Segura de Alimentos con fechas de mayo de 2025, ya pasadas. No puedo confirmar una convocatoria actual; consultá a ISETA antes de iniciar un trámite.',
    sources: [sources.carnet],
    status: 'insufficient_context'
  },
  {
    terms: ['regimen academico', 'resolucion 4196', 'marco jurisdiccional', 'que resolucion rige desde 2025'],
    answer: 'La sección de Legales publica el Régimen Académico Marco Jurisdiccional e indica que está en vigencia desde 2025 (Resolución 4196/24). Consultá el documento oficial para conocer su alcance; no interpreto situaciones particulares.',
    sources: [sources.legal]
  },
  {
    terms: ['prueba de seleccion', 'pruebas de seleccion', 'resolucion 6179'],
    answer: 'La sección de Legales publica la Resolución 6179/25 sobre pruebas de selección e indica que deroga las resoluciones 5886/03 y 1161/20. Consultá el documento oficial para sus condiciones.',
    sources: [sources.legal]
  }
];

const asksLocation = ['donde queda', 'donde esta', 'donde se encuentra', 'donde se dicta', 'donde se cursa', 'sede de']
  .some((term) => query.includes(term));
const asksAboutInstitute = query.includes('iseta') || query.includes('instituto');
const asksAboutEnergyExtension = query.includes('energia renovable') || query.includes('energias renovables')
  || query.includes('henderson') || query.includes('extension aulica');
const asksAboutLibrary = query.includes('biblioteca');
const asksAboutRegulation = query.includes('regimen academico') || query.includes('resolucion');
if (asksLocation && !asksAboutInstitute && !asksAboutEnergyExtension && !asksAboutLibrary && !asksAboutRegulation) {
  return [{ json: insufficient('No tengo una sede verificada para esa carrera o servicio. Consultá la página oficial de la oferta académica.', [sources.careers]) }];
}

const asksSchedule = ['horario', 'horarios', 'cronograma', 'cursada'].some((term) => query.includes(term));
const asksContactHours = ['atencion', 'atienden', 'area academica', 'departamentos'].some((term) => query.includes(term));
if (asksSchedule && !asksAboutLibrary && !asksContactHours) {
  return [{ json: insufficient('La página de horarios indica que la información se está actualizando y enlaza horarios por carrera y año. No puedo confirmar que cada archivo siga vigente; revisá la fecha y la publicación oficial. Consultada el 25/10/2026.', [sources.hours]) }];
}

if (['telefono personal', 'direccion personal', 'domicilio personal', 'datos personales'].some((term) => query.includes(term))) {
  return [{ json: insufficient('No puedo proporcionar datos personales. Consultá únicamente los canales institucionales publicados.') }];
}

const unsupportedTerms = [
  'inscripcion', 'inscribirme', 'requisito', 'requisitos',
  'cuanto dura', 'duracion', 'arancel', 'cuota', 'cuesta', 'costo',
  'precio', 'matricula', 'sigue abierta'
];
if (unsupportedTerms.some((term) => query.includes(normalize(term)))) {
  return [{ json: insufficient('No tengo información verificada suficiente sobre fechas de inscripción, requisitos, duración o aranceles. Consultá la página oficial de la carrera y confirmá la información vigente.', [sources.careers, sources.contact]) }];
}

const asksSpecificSchedule = ['horario', 'horarios', 'cronograma'].some((term) => query.includes(term))
  && ['año', 'ano', 'primer', 'segundo', 'tercer', '1ro', '2do', '3ro'].some((term) => query.includes(term))
  && !asksAboutLibrary;
if (asksSpecificSchedule) {
  return [{ json: insufficient('No puedo confirmar que el horario de esa carrera y año siga vigente. Revisá la publicación oficial de horarios.', [sources.hours]) }];
}

const libraryMatch = query.includes('biblioteca')
  ? knowledge.find((entry) => entry.sources.includes(sources.library)
    && entry.terms.some((term) => query.includes(normalize(term))))
  : null;
const match = libraryMatch ?? knowledge.find((entry) => entry.terms.some((term) => query.includes(normalize(term))));
if (match) {
  return [{ json: { answer: match.answer, sources: match.sources, status: match.status ?? 'ok' } }];
}

return [{ json: insufficient('No tengo información verificada suficiente para responder esa consulta. Probá con identidad, carreras, contacto, biblioteca o servicios institucionales, o consultá el sitio oficial del ISETA.') }];
