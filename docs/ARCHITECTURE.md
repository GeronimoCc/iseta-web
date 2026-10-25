# Arquitectura del asistente institucional

## 1. Decisión actual
Mantener una arquitectura mínima, con dos modos claramente separados:

1. **Modo demostración sin IA:** frontend HTML/CSS/JS y workflow local de n8n con respuestas controladas.
2. **Evolución posterior:** sustituir la respuesta de demostración por una llamada a un modelo remoto gratuito, solamente después de comprobar límites, condiciones de datos y estabilidad del proveedor.

No se usa modelo local, base de datos, RAG ni vector store en esta etapa.

## 2. Componentes

```text
Navegador local
  └── prototipos/asistente-institucional.html
        └── POST { message } (solo si se configura la URL)
              └── n8n local
                    ├── Webhook
                    ├── Validar entrada y preparar contexto
                    └── Responder JSON
```

La interfaz puede operar sin webhook en modo demostración. La integración con n8n se prueba desde un servidor local de desarrollo y una instancia local de n8n.

## 3. Contrato HTTP
Solicitud:

```json
{ "message": "¿Qué carreras ofrece el ISETA?" }
```

Respuesta:

```json
{
  "answer": "Texto de respuesta",
  "sources": [
    { "title": "Nombre de la fuente", "url": "https://iseta.edu.ar/iseta/" }
  ],
  "status": "ok"
}
```

Estados previstos: `ok`, `invalid_input`, `insufficient_context` y, si se decide agregarlo, `service_error`.

## 4. Responsabilidades
- **Frontend:** interfaz, validación básica, envío de consulta, presentación de respuesta/fuentes y errores.
- **n8n:** validar la solicitud, controlar el flujo, seleccionar el contexto autorizado y devolver un contrato estable.
- **Base de conocimiento:** información pública revisada manualmente, con fuente y fecha de verificación cuando esté disponible.
- **Modelo remoto futuro:** redactar una respuesta basada exclusivamente en el contexto suministrado; no decidir permisos ni ejecutar acciones.

## 5. Seguridad y límites
- Nunca incluir claves de API en el HTML o JavaScript del navegador.
- No enviar datos personales ni confidenciales.
- Validar longitud y formato tanto en frontend como en n8n.
- Tratar la respuesta del modelo como texto sin confianza; no insertarla como HTML ejecutable.
- Validar URLs de fuentes y permitir solamente HTTP/HTTPS.
- No exponer una instancia local de n8n a Internet para esta demo.
- No conectar el sitio de GitHub Pages a `localhost` esperando que los visitantes accedan a la computadora del desarrollador. Cada navegador interpreta localhost como su propia máquina y además existen controles de origen/red.
- Si se decide un despliegue público, diseñar primero un backend accesible, autenticación o controles de abuso, CORS limitado, límites de uso, manejo de secretos y privacidad.

## 6. Evolución a IA remota
La selección de proveedor no está cerrada. Antes de implementarla hay que revisar la disponibilidad actual de la capa gratuita, límites, retención y uso de datos. La llamada debe realizarse desde n8n usando credenciales protegidas. El modelo no debe recibir todo el repositorio, solo fragmentos públicos y pertinentes.

## 7. Integración global en el sitio

- **Módulo compartido:** `assets/asistente-institucional/asistente-institucional.js` contiene la lógica, la demostración, la conversación y el botón flotante. `asistente-institucional.css` contiene los estilos, con el prefijo `ia-` para no chocar con el tema del sitio. El script carga su propio CSS desde su ruta, por eso cada página solo necesita una línea.
- **Inclusión:** antes de `</body>` de cada página pública HTML: `<script src="<ruta>/assets/asistente-institucional/asistente-institucional.js" defer></script>`. La ruta depende de la profundidad (`assets/` en la raíz, `../assets/` en `carreras/`, `../../assets/` en `carreras/tec-sup-en-.../`). El sitio se publica bajo `/iseta-web/` y no usa rutas absolutas, así que las rutas relativas son obligatorias.
- **Páginas excluidas:** `feed/`, `comments/feed/` y `author/cueiseta/feed/` son fuentes RSS, y `wp-json/` es una API JSON. No son páginas que vea una persona visitante.
- **Modo página:** el prototipo monta el mismo módulo dentro de `[data-iseta-asistente-pagina]`, sin botón flotante. Así no hay dos implementaciones.
- **Sin duplicados:** si el script ya se cargó (`window.IsetaAsistente`) o ya existe `#iseta-asistente-raiz`, no vuelve a montar nada.
- **Posición:** el botón va abajo a la izquierda. El widget de Chaty del sitio va abajo a la derecha. En pantallas de hasta 600 px el botón es circular y queda por encima de la franja de Chaty.
- **Configuración:** un único objeto `CONFIGURACION` al inicio del módulo. `urlProduccion` está vacía, así que el sitio publicado funciona en modo demostración. `urlDesarrollo` solo se usa cuando la página se abre desde `localhost` o `127.0.0.1`. Ver [n8n/README.md](../n8n/README.md), sección 5.
- **Agregar una página nueva:** copiar la línea `<script>` anterior ajustando la ruta relativa. No hace falta copiar HTML ni CSS.
