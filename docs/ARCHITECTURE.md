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
