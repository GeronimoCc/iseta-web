/*
  Asistente institucional ISETA: script compartido por todo el sitio.
  Se incluye al final de cada página con <script src="…/asistente-institucional.js" defer>.
  - Sin contenedor [data-iseta-asistente-pagina]: monta un botón flotante y un panel de conversación.
  - Con ese contenedor (prototipo): monta la conversación dentro de él, sin botón flotante.
  No usa innerHTML: el texto de la persona usuaria y del servicio se escribe con textContent.
*/
(function () {
  "use strict";

  // Única configuración de la URL del webhook. Ver docs/ARCHITECTURE.md.
  const CONFIGURACION = {
    // Producción: URL HTTPS pública del webhook. Vacía = modo demostración (todavía no hay backend público).
    urlProduccion: "",
    // Desarrollo: solo se usa cuando la página se abre desde localhost o 127.0.0.1.
    urlDesarrollo: "http://localhost:5678/webhook/iseta-asistente",
    longitudMaxima: 500,
    tiempoEsperaMs: 15000
  };

  const ID = "iseta-asistente";
  const SVG_NS = "http://www.w3.org/2000/svg";
  const ORIGEN_SCRIPT = document.currentScript ? document.currentScript.src : location.href;
  // El sitio publicado nunca apunta a localhost: esa rama solo existe para el desarrollo local con n8n.
  const ES_LOCAL = ["localhost", "127.0.0.1"].includes(location.hostname);
  const ETIQUETAS = ES_LOCAL
    ? { demo: "Modo demostración", configurado: "n8n local configurado", disponible: "n8n local disponible", caido: "n8n no disponible" }
    : { demo: "Modo demostración", configurado: "Servicio configurado", disponible: "Servicio disponible", caido: "Servicio no disponible" };
  const NOMBRE_SERVICIO = ES_LOCAL ? "n8n" : "el servicio del asistente";
  const MENSAJES_ERROR = ES_LOCAL
    ? {
        conexion: "No se pudo conectar con n8n. Verificá que esté iniciado en esta computadora y que el workflow esté publicado. Si el navegador bloquea la conexión, revisá la configuración CORS del nodo Webhook.",
        tiempo: "n8n tardó demasiado en responder. Intentá nuevamente.",
        formato: "La respuesta de n8n no tiene el formato esperado.",
        json: "La respuesta de n8n no es JSON válido.",
        http: (estado) => "n8n respondió con un error (estado " + estado + "). Verificá que el workflow esté publicado y revisá la consola de n8n."
      }
    : {
        conexion: "No se pudo conectar con el servicio del asistente. Intentá nuevamente más tarde o usá el modo demostración.",
        tiempo: "El servicio del asistente tardó demasiado en responder. Intentá nuevamente.",
        formato: "La respuesta del servicio no tiene el formato esperado.",
        json: "La respuesta del servicio no es JSON válido.",
        http: (estado) => "El servicio del asistente respondió con un error (estado " + estado + "). Intentá nuevamente más tarde."
      };
  const SUGERENCIAS = ["¿Qué carreras ofrece el ISETA?", "¿Dónde encuentro los horarios?", "¿Qué es el ISETA?"];
  const ICONO_ASISTENTE = ["M12 3a8 8 0 0 0-8 8v3a2 2 0 0 0 2 2h1v-6H5", "M20 10h-2v6h1a2 2 0 0 0 2-2v-3a8 8 0 0 0-8-8", "M8 19c1 .8 2.3 1.2 4 1.2h2"];
  const ICONO_CHAT = ["M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"];
  const ICONO_ENVIAR = ["m22 2-7 20-4-9-9-4Z", "M22 2 11 13"];
  const ICONO_CERRAR = ["M18 6 6 18", "m6 6 12 12"];

  const unsupported = ["cuanto dura", "cuantos anos", "duracion", "plan de estudios", "requisit", "inscrip", "inscrib", "arancel", "cuota", "cuesta", "costo", "precio", "fecha", "matricul"];
  const unsupportedAnswer = "No tengo datos verificados sobre duración, planes de estudio, requisitos, aranceles ni fechas de inscripción. Consultá la página de la carrera o el sitio institucional del ISETA.";
  const homeSource = { title: "Sitio institucional del ISETA", url: "https://iseta.edu.ar/iseta/" };
  const outOfScope = ["aula virtual", "webmail"];
  const outOfScopeAnswer = "El aula virtual y el webmail están fuera del alcance de este asistente: no puedo acceder a esos servicios, ayudar con ingresos ni gestionar cuentas o datos personales. Consultá el sitio institucional del ISETA o a la institución.";

  const knowledge = [
    {
      terms: ["energias renovables", "energia renovable"],
      answer: "La Tec. Sup. en Gestión de Energías Renovables figura en la oferta del ISETA. Según la página ¿Quiénes somos?, la carrera se dicta en la extensión áulica de Henderson, partido de Hipólito Yrigoyen. Para más información, consultá su página.",
      sources: [
        { title: "Tec. Sup. en Gestión de Energías Renovables", url: "https://iseta.edu.ar/iseta/carreras/tec-sup-en-gestion-de-energias-renovables/" },
        { title: "¿Quiénes somos?", url: "https://iseta.edu.ar/iseta/institucionales/quienes-somos/" }
      ]
    },
    {
      terms: ["analisis de sistemas"],
      answer: "La Tec. Sup. en Análisis de Sistemas tiene página propia en el sitio del ISETA. Esa página describe su perfil profesional: planificar y gestionar proyectos de desarrollo, y diagnosticar problemas para diseñar soluciones informáticas. Para otros datos, consultá la página de la carrera.",
      sources: [{ title: "Tec. Sup. en Análisis de Sistemas", url: "https://iseta.edu.ar/iseta/carreras/tec-sup-en-analisis-de-sistemas/" }]
    },
    {
      terms: ["tec. sup. en alimentos", "tecnico superior en alimentos", "tecnicatura superior en alimentos", "tecnicatura en alimentos"],
      answer: "La Tec. Sup. en Alimentos figura en la oferta de carreras del ISETA y tiene página propia en el sitio. Este prototipo todavía no tiene verificados otros datos de la carrera, como sede, duración o requisitos; consultá su página.",
      sources: [{ title: "Tec. Sup. en Alimentos", url: "https://iseta.edu.ar/iseta/carreras/tec-sup-en-alimentos/" }]
    },
    {
      terms: ["biotecnologia"],
      answer: "La Tec. Sup. en Biotecnología figura en la oferta de carreras del ISETA y tiene página propia en el sitio. Este prototipo todavía no tiene verificados otros datos de la carrera, como sede, duración o requisitos; consultá su página.",
      sources: [{ title: "Tec. Sup. en Biotecnología", url: "https://iseta.edu.ar/iseta/carreras/tec-sup-en-biotecnologia/" }]
    },
    {
      terms: ["higiene, seguridad", "higiene seguridad", "ambiente laboral"],
      answer: "La Tec. Sup. en Higiene, Seguridad y Ambiente Laboral figura en la oferta de carreras del ISETA y tiene página propia en el sitio. Este prototipo todavía no tiene verificados otros datos de la carrera, como sede, duración o requisitos; consultá su página.",
      sources: [{ title: "Tec. Sup. en Higiene, Seguridad y Ambiente Laboral", url: "https://iseta.edu.ar/iseta/carreras/tec-sup-en-higiene-y-seguridad-en-el-trabajo/" }]
    },
    {
      terms: ["mecanica liviana"],
      answer: "La Tec. Sup. en Mecánica Liviana figura en la oferta de carreras del ISETA y tiene página propia en el sitio. Este prototipo todavía no tiene verificados otros datos de la carrera, como sede, duración o requisitos; consultá su página.",
      sources: [{ title: "Tec. Sup. en Mecánica Liviana", url: "https://iseta.edu.ar/iseta/carreras/tec-sup-en-mecanica-liviana/" }]
    },
    {
      terms: ["produccion agricola ganadera"],
      answer: "La Tec. Sup. en Producción Agrícola Ganadera figura en la oferta de carreras del ISETA y tiene página propia en el sitio. Este prototipo todavía no tiene verificados otros datos de la carrera, como sede, duración o requisitos; consultá su página.",
      sources: [{ title: "Tec. Sup. en Producción Agrícola Ganadera", url: "https://iseta.edu.ar/iseta/carreras/tec-sup-en-produccion-agricola-ganadera/" }]
    },
    {
      terms: ["servicios gastronomicos"],
      answer: "La Tec. Sup. en Servicios Gastronómicos figura en la oferta de carreras del ISETA y tiene página propia en el sitio. Este prototipo todavía no tiene verificados otros datos de la carrera, como sede, duración o requisitos; consultá su página.",
      sources: [{ title: "Tec. Sup. en Servicios Gastronómicos", url: "https://iseta.edu.ar/iseta/carreras/tec-sup-en-servicios-gastronomicos/" }]
    },
    {
      terms: ["carrera", "carreras", "tecnicatura", "tecnicaturas", "tecnico superior", "estudiar", "oferta academica"],
      answer: "El ISETA ofrece estas carreras, según el menú de carreras del sitio: Tec. Sup. en Alimentos; Tec. Sup. en Análisis de Sistemas; Tec. Sup. en Biotecnología; Tec. Sup. en Gestión de Energías Renovables (extensión áulica en Henderson); Tec. Sup. en Higiene, Seguridad y Ambiente Laboral; Tec. Sup. en Mecánica Liviana; Tec. Sup. en Producción Agrícola Ganadera; y Tec. Sup. en Servicios Gastronómicos. Para detalles de cada una, consultá su página.",
      sources: [homeSource]
    },
    {
      terms: ["horario", "horarios", "cronograma"],
      answer: "El sitio dispone de una sección de Horarios. Según esa página, los horarios se están actualizando para el ciclo lectivo vigente; revisá allí la información publicada. Este prototipo no puede confirmar qué horarios están vigentes.",
      sources: [{ title: "Horarios", url: "https://iseta.edu.ar/iseta/horarios/" }]
    },
    {
      terms: ["que es iseta", "que es el iseta", "que significa iseta", "que significa el iseta", "que es el instituto", "quienes son", "sobre iseta"],
      answer: "ISETA es el Instituto Superior Experimental de Tecnología Alimentaria. Depende de la Dirección General de Cultura y Educación de la Provincia de Buenos Aires. La página ¿Quiénes somos? describe sus áreas de docencia, servicios e investigación.",
      sources: [{ title: "¿Quiénes somos?", url: "https://iseta.edu.ar/iseta/institucionales/quienes-somos/" }]
    }
  ];

  function urlWebhook() {
    return ES_LOCAL ? CONFIGURACION.urlDesarrollo : CONFIGURACION.urlProduccion;
  }

  function normalize(text) {
    return text.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  }

  function demoAnswer(question) {
    const normalized = normalize(question);
    if (outOfScope.some(term => normalized.includes(term))) {
      return { answer: outOfScopeAnswer, sources: [homeSource], status: "insufficient_context", origin: "demo" };
    }
    if (unsupported.some(term => normalized.includes(term))) {
      return { answer: unsupportedAnswer, sources: [homeSource], status: "insufficient_context", origin: "demo" };
    }
    const found = knowledge.find(entry => entry.terms.some(term => normalized.includes(normalize(term))));
    if (found) return { answer: found.answer, sources: found.sources, status: "ok", origin: "demo" };
    return {
      answer: "No tengo información verificada suficiente para responder esa consulta en esta versión de prueba. Probá con una pregunta sobre carreras, horarios o información institucional, o consultá directamente el sitio del ISETA.",
      sources: [homeSource],
      status: "insufficient_context",
      origin: "demo"
    };
  }

  class ErrorServicio extends Error {
    constructor(mensajeUsuario, detalleTecnico) {
      super(detalleTecnico);
      this.name = "ErrorServicio";
      this.mensajeUsuario = mensajeUsuario;
    }
  }

  async function consultarServicio(pregunta, url) {
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), CONFIGURACION.tiempoEsperaMs);
    try {
      const respuesta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: pregunta }),
        signal: controlador.signal
      });
      if (!respuesta.ok) throw new ErrorServicio(MENSAJES_ERROR.http(respuesta.status), "HTTP " + respuesta.status);
      const datos = await respuesta.json();
      if (!datos || typeof datos.answer !== "string" || !datos.answer.trim()) {
        throw new ErrorServicio(MENSAJES_ERROR.formato, "Falta el campo answer");
      }
      return {
        answer: datos.answer,
        sources: Array.isArray(datos.sources) ? datos.sources : [],
        status: typeof datos.status === "string" ? datos.status : "ok",
        origin: "servicio"
      };
    } catch (error) {
      if (error instanceof ErrorServicio) throw error;
      if (error.name === "AbortError") throw new ErrorServicio(MENSAJES_ERROR.tiempo, "Tiempo de espera agotado");
      if (error instanceof SyntaxError) throw new ErrorServicio(MENSAJES_ERROR.json, error.message);
      throw new ErrorServicio(MENSAJES_ERROR.conexion, error.message);
    } finally {
      clearTimeout(temporizador);
    }
  }

  // Sin URL de producción no se hace ninguna petición: la respuesta sale de los datos de demostración.
  async function getAnswer(question) {
    const url = urlWebhook();
    if (!url) return demoAnswer(question);
    return consultarServicio(question, url);
  }

  function validarPregunta(pregunta) {
    if (!pregunta) return "Escribí una consulta antes de enviarla.";
    if (pregunta.length > CONFIGURACION.longitudMaxima) {
      return "La consulta supera el límite de " + CONFIGURACION.longitudMaxima + " caracteres. Acortala e intentá de nuevo.";
    }
    return "";
  }

  function crearElemento(etiqueta, clase) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    return elemento;
  }

  function crearIcono(trazos) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("class", "ia-icono");
    trazos.forEach((d) => {
      const trazo = document.createElementNS(SVG_NS, "path");
      trazo.setAttribute("d", d);
      svg.appendChild(trazo);
    });
    return svg;
  }

  // Construye la conversación completa. Modo "flotante" (dentro del panel) o "pagina" (prototipo).
  function crearChat(opciones) {
    const enPanel = opciones.modo === "flotante";
    const chat = crearElemento("div", "ia-chat " + (enPanel ? "ia-chat--flotante" : "ia-chat--pagina"));

    const encabezado = crearElemento("header", "ia-encabezado");
    const avatar = crearElemento("div", "ia-avatar");
    avatar.setAttribute("aria-hidden", "true");
    avatar.appendChild(crearIcono(ICONO_ASISTENTE));
    const textos = crearElemento("div", "ia-encabezado-texto");
    const titulo = crearElemento("h" + opciones.nivel, "ia-titulo");
    titulo.id = ID + "-titulo";
    titulo.tabIndex = -1;
    titulo.textContent = opciones.titulo;
    const subtitulo = crearElemento("p", "ia-subtitulo");
    subtitulo.textContent = opciones.subtitulo;
    subtitulo.hidden = !opciones.subtitulo;
    const estado = crearElemento("span", "ia-estado");
    estado.id = ID + "-estado";
    estado.setAttribute("role", "status");
    textos.append(titulo, subtitulo, estado);
    encabezado.append(avatar, textos);
    if (enPanel) {
      const cerrar = crearElemento("button", "ia-cerrar");
      cerrar.type = "button";
      cerrar.setAttribute("aria-label", "Cerrar asistente");
      cerrar.appendChild(crearIcono(ICONO_CERRAR));
      cerrar.addEventListener("click", () => opciones.onCerrar());
      encabezado.appendChild(cerrar);
    }

    const nota = crearElemento("p", "ia-nota");
    nota.textContent = "El servicio conectado todavía no está configurado en esta versión del sitio. Las respuestas son de demostración y no consultan ningún servidor.";
    nota.hidden = Boolean(urlWebhook());

    const mensajes = crearElemento("div", "ia-mensajes");
    mensajes.id = ID + "-mensajes";
    mensajes.setAttribute("role", "log");
    mensajes.setAttribute("aria-live", "polite");
    mensajes.setAttribute("aria-relevant", "additions text");

    const sugerencias = crearElemento("div", "ia-sugerencias");
    sugerencias.setAttribute("role", "group");
    sugerencias.setAttribute("aria-label", "Preguntas sugeridas");
    const botonesSugerencia = SUGERENCIAS.map((texto) => {
      const boton = crearElemento("button", "ia-sugerencia");
      boton.type = "button";
      boton.textContent = texto;
      boton.addEventListener("click", () => enviar(texto));
      sugerencias.appendChild(boton);
      return boton;
    });

    const formulario = crearElemento("form", "ia-formulario");
    formulario.noValidate = true;
    const etiqueta = crearElemento("label", "ia-sr-only");
    etiqueta.htmlFor = ID + "-pregunta";
    etiqueta.textContent = "Escribí tu consulta";
    const entrada = crearElemento("div", "ia-entrada");
    const campo = crearElemento("textarea", "ia-pregunta");
    campo.id = ID + "-pregunta";
    campo.name = "pregunta";
    campo.rows = 1;
    campo.maxLength = CONFIGURACION.longitudMaxima;
    campo.placeholder = "Escribí tu consulta…";
    campo.setAttribute("aria-describedby", ID + "-ayuda " + ID + "-feedback");
    const botonEnviar = crearElemento("button", "ia-enviar");
    botonEnviar.id = ID + "-enviar";
    botonEnviar.type = "submit";
    botonEnviar.setAttribute("aria-label", "Enviar consulta");
    const textoEnviar = crearElemento("span", "ia-enviar-texto");
    textoEnviar.textContent = "Enviar";
    botonEnviar.append(crearIcono(ICONO_ENVIAR), textoEnviar);
    entrada.append(campo, botonEnviar);
    const ayuda = crearElemento("div", "ia-ayuda");
    ayuda.id = ID + "-ayuda";
    const textoAyuda = crearElemento("span");
    textoAyuda.textContent = "Máximo " + CONFIGURACION.longitudMaxima + " caracteres. No compartas datos personales.";
    const contador = crearElemento("span");
    contador.id = ID + "-contador";
    contador.textContent = "0/" + CONFIGURACION.longitudMaxima;
    ayuda.append(textoAyuda, contador);
    const feedback = crearElemento("p", "ia-feedback");
    feedback.id = ID + "-feedback";
    feedback.setAttribute("role", "status");
    formulario.append(etiqueta, entrada, ayuda, feedback);

    chat.append(encabezado, nota, mensajes, sugerencias, formulario);

    let enviando = false;

    function marcarEstado(clave) {
      estado.textContent = ETIQUETAS[clave];
      estado.classList.toggle("ia-estado--caido", clave === "caido");
    }

    function agregarMensaje(texto, rol, extras = {}) {
      const { fuentes = [], textoMeta = "", clase = "", acciones = [] } = extras;
      const modificadores = [
        "ia-mensaje",
        rol === "usuario" ? "ia-mensaje--usuario" : "",
        clase ? "ia-mensaje--" + clase : ""
      ].filter(Boolean);
      const articulo = crearElemento("article", modificadores.join(" "));
      const burbuja = crearElemento("div", "ia-burbuja");
      burbuja.textContent = texto;
      articulo.appendChild(burbuja);

      if (fuentes.length) {
        const cajaFuentes = crearElemento("div", "ia-fuentes");
        const encabezadoFuentes = crearElemento("strong");
        encabezadoFuentes.textContent = "Fuentes";
        cajaFuentes.appendChild(encabezadoFuentes);
        const lista = crearElemento("ul");
        fuentes.forEach((fuente) => {
          if (!fuente || typeof fuente.title !== "string" || typeof fuente.url !== "string") return;
          try {
            const parseada = new URL(fuente.url);
            if (parseada.protocol !== "https:" && parseada.protocol !== "http:") return;
            const item = crearElemento("li");
            const enlace = crearElemento("a");
            enlace.href = parseada.href;
            enlace.target = "_blank";
            enlace.rel = "noopener noreferrer";
            enlace.textContent = fuente.title;
            item.appendChild(enlace);
            lista.appendChild(item);
          } catch {
            // Se omiten las fuentes con una URL inválida.
          }
        });
        if (lista.childElementCount) {
          cajaFuentes.appendChild(lista);
          articulo.appendChild(cajaFuentes);
        }
      }

      if (acciones.length) {
        const cajaAcciones = crearElemento("div", "ia-acciones");
        acciones.forEach((accion) => {
          const boton = crearElemento("button", "ia-accion");
          boton.type = "button";
          boton.textContent = accion.etiqueta;
          boton.addEventListener("click", () => {
            cajaAcciones.remove();
            accion.alElegir();
          });
          cajaAcciones.appendChild(boton);
        });
        articulo.appendChild(cajaAcciones);
      }

      const meta = crearElemento("span", "ia-meta");
      meta.textContent = textoMeta || (rol === "usuario" ? "Vos" : "Asistente");
      articulo.appendChild(meta);
      mensajes.appendChild(articulo);
      mensajes.scrollTop = mensajes.scrollHeight;
      return articulo;
    }

    function describirRespuesta(resultado) {
      const origen = resultado.origin === "demo"
        ? "demostración local (no consultó el servicio)"
        : (ES_LOCAL ? "respuesta de n8n" : "respuesta del servicio");
      const notas = {
        insufficient_context: "sin evidencia suficiente en las fuentes disponibles",
        invalid_input: "consulta no válida"
      };
      return ["Asistente", origen, notas[resultado.status]].filter(Boolean).join(" · ");
    }

    function responderConDemo(pregunta) {
      const resultado = demoAnswer(pregunta);
      agregarMensaje(resultado.answer, "asistente", { fuentes: resultado.sources, textoMeta: describirRespuesta(resultado) });
      campo.focus();
    }

    function mostrarError(texto) {
      feedback.textContent = texto;
      feedback.classList.add("ia-feedback--error");
      campo.setAttribute("aria-invalid", "true");
    }

    function limpiarError() {
      feedback.textContent = "";
      feedback.classList.remove("ia-feedback--error");
      campo.removeAttribute("aria-invalid");
    }

    function marcarOcupado(ocupado) {
      enviando = ocupado;
      botonEnviar.disabled = ocupado;
      campo.disabled = ocupado;
      botonesSugerencia.forEach((boton) => { boton.disabled = ocupado; });
    }

    async function enviar(textoOriginal) {
      if (enviando) return;
      const pregunta = textoOriginal.trim();
      const problema = validarPregunta(pregunta);
      if (problema) {
        mostrarError(problema);
        campo.focus();
        return;
      }
      limpiarError();
      agregarMensaje(pregunta, "usuario");
      campo.value = "";
      contador.textContent = "0/" + CONFIGURACION.longitudMaxima;
      marcarOcupado(true);
      const pendiente = agregarMensaje("Consultando…", "asistente", { clase: "pendiente", textoMeta: "Asistente · consultando" });
      try {
        const resultado = await getAnswer(pregunta);
        if (resultado.origin === "servicio") marcarEstado("disponible");
        agregarMensaje(resultado.answer, "asistente", { fuentes: resultado.sources, textoMeta: describirRespuesta(resultado) });
      } catch (error) {
        if (error instanceof ErrorServicio) {
          console.warn(NOMBRE_SERVICIO + " no disponible:", error.message);
          marcarEstado("caido");
          agregarMensaje(error.mensajeUsuario, "asistente", {
            textoMeta: "Asistente · sin conexión con " + NOMBRE_SERVICIO,
            acciones: [{ etiqueta: "Responder en modo demostración", alElegir: () => responderConDemo(pregunta) }]
          });
        } else {
          console.error("Error inesperado en el asistente:", error);
          agregarMensaje("Ocurrió un error inesperado. Intentá nuevamente.", "asistente", { textoMeta: "Asistente · error" });
        }
      } finally {
        pendiente.remove();
        marcarOcupado(false);
        campo.focus();
      }
    }

    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();
      enviar(campo.value);
    });

    campo.addEventListener("input", () => {
      contador.textContent = campo.value.length + "/" + CONFIGURACION.longitudMaxima;
      limpiarError();
    });

    campo.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter" && !evento.shiftKey) {
        evento.preventDefault();
        formulario.requestSubmit();
      }
    });

    marcarEstado(urlWebhook() ? "configurado" : "demo");
    agregarMensaje("¡Hola! Soy el asistente institucional del ISETA. Puedo orientarte con la información disponible en este sitio. ¿Qué te gustaría saber?", "asistente", { textoMeta: "Asistente · respuesta inicial" });

    return {
      elemento: chat,
      enfocarTitulo: () => titulo.focus()
    };
  }

  function montarFlotante() {
    const raiz = crearElemento("div", "ia-raiz");
    raiz.id = ID + "-raiz";

    const lanzador = crearElemento("button", "ia-lanzador");
    lanzador.id = ID + "-lanzador";
    lanzador.type = "button";
    lanzador.setAttribute("aria-controls", ID + "-panel");
    lanzador.setAttribute("aria-expanded", "false");
    const textoLanzador = crearElemento("span", "ia-lanzador-texto");
    textoLanzador.textContent = "Asistente institucional";
    lanzador.append(crearIcono(ICONO_CHAT), textoLanzador);

    const panel = crearElemento("section", "ia-panel");
    panel.id = ID + "-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-labelledby", ID + "-titulo");
    panel.hidden = true;
    const chat = crearChat({
      modo: "flotante",
      nivel: 2,
      titulo: "Asistente institucional",
      subtitulo: "Consultá información pública del ISETA.",
      onCerrar: () => cerrar()
    });
    panel.appendChild(chat.elemento);

    function abrir() {
      panel.hidden = false;
      lanzador.setAttribute("aria-expanded", "true");
      chat.enfocarTitulo();
    }

    function cerrar() {
      panel.hidden = true;
      lanzador.setAttribute("aria-expanded", "false");
      lanzador.focus();
    }

    lanzador.addEventListener("click", () => (panel.hidden ? abrir() : cerrar()));
    panel.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") {
        evento.preventDefault();
        cerrar();
      }
    });

    raiz.append(panel, lanzador);
    document.body.appendChild(raiz);
    return raiz;
  }

  function cargarEstilos(alCargar) {
    const enlace = crearElemento("link");
    enlace.rel = "stylesheet";
    enlace.href = new URL("asistente-institucional.css", ORIGEN_SCRIPT).href;
    enlace.addEventListener("load", alCargar);
    enlace.addEventListener("error", alCargar);
    document.head.appendChild(enlace);
  }

  function iniciar() {
    if (window.IsetaAsistente || document.getElementById(ID + "-raiz")) return;
    window.IsetaAsistente = { iniciado: true };

    const contenedorPagina = document.querySelector("[data-iseta-asistente-pagina]");
    let raiz;
    if (contenedorPagina) {
      raiz = contenedorPagina;
      raiz.appendChild(crearChat({
        modo: "pagina",
        nivel: 1,
        titulo: "¿En qué te puedo ayudar?",
        subtitulo: "Consultá información institucional y orientate entre las secciones del sitio."
      }).elemento);
    } else {
      raiz = montarFlotante();
    }

    // Se muestra recién cuando cargan los estilos, para no ver el componente sin formato.
    raiz.style.visibility = "hidden";
    cargarEstilos(() => { raiz.style.visibility = ""; });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
