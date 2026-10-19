# Probar el asistente institucional con n8n

Este workflow es una **prueba de integración**, no la versión final con IA. Permite validar el contrato entre la interfaz web y n8n sin configurar una API externa ni una clave.

## Archivos

- `asistente-institucional-demo.json`: workflow importable de n8n.
- `../prototipos/asistente-institucional.html`: interfaz del chat.

## 1. Importar el workflow

1. Iniciá n8n en tu computadora.
2. En n8n, creá un workflow e importá el archivo JSON de esta carpeta.
3. Guardalo. El flujo contiene tres nodos: Webhook, validación/respuesta de demostración y respuesta HTTP.
4. No lo publiques ni expongas tu instancia a Internet. Está pensado para una demostración local.

## 2. Probar el webhook

1. Abrí el nodo **Webhook - consulta**.
2. Hacé clic en **Listen for test event**.
3. Copiá la **Test URL** que muestra n8n. Normalmente tiene la forma `http://localhost:5678/webhook-test/iseta-asistente`.
4. En `prototipos/asistente-institucional.html`, buscá `const N8N_WEBHOOK_URL = "";` y pegá la Test URL entre las comillas.
5. Serví el HTML desde un servidor local de desarrollo (por ejemplo, Live Server de VS Code). Evitá asumir que abrirlo con `file://` funcionará con las restricciones del navegador.
6. Enviá una pregunta de prueba, como “¿Qué carreras ofrece el ISETA?”. Mientras el nodo escucha, n8n espera la solicitud de prueba.

Cuando el flujo funcione, activá el workflow y usá la **Production URL** que muestra el nodo, normalmente `http://localhost:5678/webhook/iseta-asistente`. No uses la Test URL para una demostración estable.

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

La interfaz envía el cuerpo como `text/plain` para reducir los problemas de preflight CORS durante la prueba local. El workflow interpreta el cuerpo y devuelve JSON.

## Limitaciones actuales

- Las respuestas son reglas y textos de ejemplo; todavía no se usa un modelo de IA.
- La base de conocimiento es pequeña y debe verificarse contra documentos institucionales vigentes antes de presentar el proyecto.
- El webhook de demo no tiene autenticación. No debe exponerse públicamente.
- La configuración CORS permisiva es solo para pruebas; no debe copiarse sin revisión a un despliegue público.
- No pongas claves de proveedores de IA en el HTML ni en Git. Las futuras credenciales se configurarán del lado de n8n.
- GitHub Pages no puede acceder a la instancia n8n que corre en la computadora del desarrollador. La integración conectada se prueba localmente hasta diseñar un backend público seguro.
