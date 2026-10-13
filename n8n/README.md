# Probar el asistente institucional con n8n

Este flujo es una **prueba de integración**, no la versión final con IA. Permite validar el contrato entre la interfaz web y n8n sin configurar una API externa ni una clave.

## Archivos

- `asistente-institucional-demo.json`: flujo importable de n8n.
- `../prototipos/asistente-institucional.html`: interfaz del chat.

## 1. Importar el flujo

1. Iniciá n8n en tu computadora.
2. En n8n, creá un workflow e importá `asistente-institucional-demo.json`.
3. Guardalo. El flujo contiene tres nodos: Webhook, validación/respuesta de demostración y respuesta HTTP.
4. No lo publiques ni expongas tu instancia a Internet. Está pensado para una demostración local.

## 2. Probar el webhook

1. Abrí el nodo **Webhook - consulta**.
2. Hacé clic en **Listen for test event**.
3. Copiá la **Test URL** que muestra n8n. Debería tener la forma `http://localhost:5678/webhook-test/iseta-asistente`.
4. En `prototipos/asistente-institucional.html`, buscá `const N8N_WEBHOOK_URL = "";` y pegá la Test URL entre las comillas.
5. Abrí el HTML en el navegador. Para evitar restricciones del navegador, preferí servirlo desde un servidor de desarrollo local, por ejemplo la extensión Live Server de VS Code.
6. Enviá una consulta de prueba, como “¿Qué carreras ofrece el ISETA?”. Durante el modo de escucha, n8n espera la solicitud de prueba.

Cuando el flujo esté activo, usá la **Production URL** que muestra el nodo, normalmente `http://localhost:5678/webhook/iseta-asistente`, y activá el workflow. No uses la URL de prueba para una demostración estable.

## 3. Contrato de la API

Solicitud:

```json
{ "message": "¿Qué carreras ofrece el ISETA?" }
```

Respuesta:

```json
{
  "answer": "Respuesta del asistente",
  "sources": [
    {
      "title": "Título de la fuente",
      "url": "https://iseta.edu.ar/iseta/"
    }
  ],
  "status": "ok"
}
```

Estados de esta demo: `ok`, `invalid_input` e `insufficient_context`.

La interfaz envía el cuerpo JSON como `text/plain` para evitar una solicitud CORS preflight durante la prueba local. El webhook interpreta el contenido y devuelve JSON.

## Limitaciones actuales

- Las respuestas son reglas y textos de ejemplo; todavía no se usa un modelo de IA.
- La base de conocimiento es muy pequeña y debe verificarse contra documentos institucionales vigentes antes de presentar el proyecto.
- El webhook no tiene autenticación en esta demo. La URL no debe exponerse públicamente. Si el proyecto se publica, habrá que revisar autenticación, CORS, límites de uso y protección contra abuso.
- El ajuste CORS permisivo sirve solo para pruebas locales; no debe conservarse automáticamente en una implementación pública.
- No pongas claves de proveedores de IA en el HTML ni en Git. Las credenciales de una futura API se configurarán del lado de n8n.
