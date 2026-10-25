# Probar el asistente institucional con n8n

Este workflow es una **prueba de integración**, no la versión final con IA. Permite validar el contrato entre la interfaz web y n8n sin configurar una API externa ni una clave.

## Archivos

- `package.json` / `package-lock.json`: fijan n8n en la versión exacta `2.44.5`.
- `start-n8n.mjs`: arranca n8n solo en `127.0.0.1:5678`, con datos en `n8n/.n8n-data/` (ignorado por Git) y sin telemetría.
- `asistente-institucional-demo.json`: workflow importable de n8n.
- `../prototipos/asistente-institucional.html`: página de prueba del asistente, que usa el módulo compartido en modo página.
- `../assets/asistente-institucional/`: módulo compartido del asistente (`asistente-institucional.js` y `.css`), incluido en todas las páginas públicas del sitio.

## Requisitos

- Windows con PowerShell. Se usa `npm.cmd` porque PowerShell puede bloquear `npm.ps1` por la política de ejecución.
- Node.js 24.x. n8n 2.44.5 declara `node >=24.0.0`; la documentación oficial de n8n indica Node entre 20.19 y 24.x para instalaciones por npm. Probado con `v24.15.0`.
- Docker no es necesario.
- Nota: la documentación oficial indica que las instalaciones por npm quedan obsoletas desde n8n 3.0. Para esta demo se fija 2.44.5; migrar a Docker sería una decisión futura.

Fuentes: <https://docs.n8n.io/deploy/host-n8n/install-options/install-with-npm.md> y metadatos del paquete en npm (`npm.cmd view n8n@2.44.5 engines`).

## Instalación

```powershell
cd n8n
npm.cmd install
```

## Arranque

```powershell
cd n8n
npm.cmd run n8n
```

Abrí <http://localhost:5678>. La primera vez n8n pide crear una cuenta de propietario **local** (queda en `n8n/.n8n-data/`, no en Git). Para detenerlo, `Ctrl+C`.

## 1. Importar el workflow

1. Iniciá n8n (sección anterior).
2. En n8n, creá un workflow vacío, abrí el menú `...` y elegí **Import from file**; seleccioná `asistente-institucional-demo.json`.
   Alternativa por terminal (probada), con n8n **detenido**, desde `n8n/`:

   ```powershell
   $env:N8N_USER_FOLDER = "$PWD\.n8n-data"
   node node_modules\n8n\bin\n8n import:workflow --input=asistente-institucional-demo.json
   node node_modules\n8n\bin\n8n list:workflow          # muestra el ID
   node node_modules\n8n\bin\n8n publish:workflow --id=<ID>
   ```

   El JSON versionado incluye el `id` del workflow: reimportarlo actualiza el mismo workflow y no crea un duplicado (el CLI de n8n no tiene comando para borrarlos). Luego iniciá n8n de nuevo: la publicación solo tiene efecto al arrancar.
3. Guardalo. El flujo contiene tres nodos: Webhook, validación/respuesta de demostración y respuesta HTTP.
4. No lo publiques ni expongas tu instancia a Internet. Está pensado para una demostración local.

## 2. Conectar la interfaz con el webhook

La interfaz apunta a `http://localhost:5678/webhook/iseta-asistente` solo cuando la página se abre desde `localhost` o `127.0.0.1`. Esa URL está en `CONFIGURACION.urlDesarrollo` de `assets/asistente-institucional/asistente-institucional.js`, el único archivo donde se configuran las URL del asistente. No hace falta copiar ninguna URL en las páginas.

1. Verificá que el workflow esté **Published** y que n8n esté en marcha. La publicación solo tiene efecto al arrancar n8n: si publicaste con n8n abierto, reiniciá `npm.cmd run n8n`.
2. Serví el sitio desde un servidor local de desarrollo, por ejemplo Live Server de VS Code abierto en la raíz del repositorio (`http://127.0.0.1:5500`). Podés probar el prototipo en `http://127.0.0.1:5500/prototipos/asistente-institucional.html` o cualquier página del sitio. Evitá abrirlo con `file://`: en ese caso `location.hostname` queda vacío, el módulo no lo considera entorno local, no usa `urlDesarrollo` y el asistente funciona solo en modo demostración, sin llamar a n8n. (Además, un origen `file://` no figura en la lista CORS.) El puerto 5500 es la configuración local concreta de Live Server y puede variar; si usás otro puerto, ajustá los orígenes permitidos (sección 4).
3. Enviá una pregunta de prueba, como “¿Qué carreras ofrece el ISETA?”.

Si la interfaz muestra un error de conexión, el botón **Responder en modo demostración** genera una respuesta local. Esa respuesta aparece identificada como demostración y **no proviene de n8n**.

La **Test URL** (`/webhook-test/...`) solo sirve para depurar desde el editor de n8n con **Listen for test event**. La interfaz no la usa.

### Prueba por terminal (workflow publicado)

En PowerShell 5.1, pasar JSON con comillas dobles directamente a `curl.exe` las elimina y n8n responde HTTP 422 (JSON mal formado) aunque el mensaje sea válido. Enviá el cuerpo desde un archivo UTF-8 sin BOM:

```powershell
[IO.File]::WriteAllText("$env:TEMP\q.json", '{"message":"¿Qué carreras ofrece el ISETA?"}', (New-Object Text.UTF8Encoding($false)))
curl.exe -s -X POST http://localhost:5678/webhook/iseta-asistente -H "Content-Type: application/json" --data-binary "@$env:TEMP\q.json"
```

Resultados verificados con n8n 2.44.5 (ver también la comprobación automática abajo): "¿Qué es ISETA?", "¿Qué significa ISETA?" y "¿Qué es el ISETA?" → `ok` con la denominación correcta; listado de carreras y consultas por cada una → `ok` con fuente; duración, inscripción, planes, requisitos o aranceles → `insufficient_context`; consulta sin cobertura → `insufficient_context`; vacío, solo espacios o más de 500 caracteres → `invalid_input`; exactamente 500 caracteres se acepta. JSON mal formado no llega al workflow: n8n responde HTTP 422.

### Comprobación automática de conocimiento

Desde `n8n/` (no requiere n8n en ejecución):

```powershell
npm.cmd run comprobar
```

El script ejecuta el código real del nodo de código del workflow y la lógica de demostración del HTML con las mismas consultas. Falla si las respuestas, estados o fuentes difieren, o si una consulta no devuelve el estado esperado. Las consultas están en `scripts/comprobar-conocimiento.mjs`; agregá allí cada caso nuevo.

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

`invalid_input` se devuelve con HTTP 200 y el mismo JSON (`answer`, `sources`, `status`). Se mantuvo así porque el frontend trata cualquier respuesta HTTP no exitosa como error de servicio y mostraría el mensaje genérico en lugar del texto de la consulta inválida (ver D-015 en `docs/DECISIONS.md`). Además, la interfaz ya valida vacío y 500 caracteres antes de enviar.

La interfaz envía `Content-Type: application/json`. Como ese tipo no es “simple” para CORS, el navegador hace primero una petición `OPTIONS` (preflight); n8n la responde automáticamente si el origen está permitido. El workflow interpreta el cuerpo y devuelve JSON.

## 4. CORS y orígenes permitidos

El navegador impide que una página de un origen (esquema + host + puerto) lea la respuesta de otro origen, salvo que el servidor lo permita. En n8n, el nodo **Webhook** controla esto con la opción **Allowed Origins (CORS)**.

- Valor versionado en `asistente-institucional-demo.json`: `http://localhost:5500,http://127.0.0.1:5500`. El 5500 es solo el puerto habitual de Live Server en esta configuración local; puede variar según tu equipo o servidor.
- No usar `*`: permite que cualquier sitio abierto en tu navegador envíe peticiones a tu n8n local.
- Si servís la interfaz desde otro puerto o host, agregalo a la lista separada por comas (por ejemplo `http://localhost:8080`). Un origen fuera de la lista no recibe permiso y el navegador bloquea la respuesta.
- CORS solo impide que el navegador **lea** la respuesta de otro origen. n8n igual procesa la petición: en la prueba, un origen ajeno recibió `ok`. Además, el workflow acepta cuerpos `text/plain`, que un sitio puede enviar sin preflight. Por eso el webhook no debe quedar accesible fuera de esta computadora.

### Aplicar el cambio en la instancia en ejecución

La instancia local guarda su propia copia del workflow. Si fue importada antes de este cambio, aplicá el JSON versionado: con n8n detenido, repetí el paso 1 (importación por terminal), publicá de nuevo y reiniciá `npm.cmd run n8n`.

Verificado tras reimportar: el preflight desde `http://127.0.0.1:5500` devuelve `Access-Control-Allow-Origin: http://127.0.0.1:5500`. Un origen ajeno (`http://evil.example`) recibe como cabecera otro origen permitido (`http://localhost:5500`); el navegador lo rechaza porque no coincide con su propio origen, así que no obtiene acceso. El POST desde ese origen igual se procesa: por eso el webhook no debe quedar accesible fuera de esta computadora.

## 5. Modo conectado en producción

El sitio publicado en GitHub Pages es estático y no puede llamar al n8n de tu computadora. Por eso `CONFIGURACION.urlProduccion` está vacía: en el sitio publicado, el asistente funciona en **modo demostración** y muestra una nota que indica que el servicio conectado no está configurado. Las respuestas de demostración se rotulan como tales y no consultan ningún servidor.

Para activar el modo conectado hace falta un backend HTTPS accesible desde internet, con estas condiciones:

1. Control de abuso (límite de solicitudes), sin datos personales en los registros y sin claves de proveedores en el navegador.
2. CORS limitado al origen de GitHub Pages (`https://geronimocc.github.io`), no `*`.
3. Completar `urlProduccion` en `assets/asistente-institucional/asistente-institucional.js`. Es el único lugar donde va la URL pública.
4. Probar desde el sitio publicado y revisar la consola del navegador.

No pongas la URL local en `urlProduccion`: cada visitante la interpretaría como su propia computadora.

## Limitaciones actuales

- Las respuestas son reglas y textos de ejemplo; todavía no se usa un modelo de IA.
- La base de conocimiento es pequeña y debe verificarse contra documentos institucionales vigentes antes de presentar el proyecto.
- La misma base de conocimiento está en el workflow (nodo de código) y en `assets/asistente-institucional/asistente-institucional.js`. Para cambiarla, seguí el procedimiento de la sección siguiente.
- La coincidencia es por palabras o frases listadas en `terms`. Una formulación distinta puede caer en "sin evidencia": por ejemplo, "¿Dónde queda el ISETA?" (la dirección no está cargada todavía). Ver [KNOWLEDGE_BASE.md](../docs/KNOWLEDGE_BASE.md) para el inventario verificado y lo pendiente.

## Mantener sincronizados el workflow y el HTML

La base de conocimiento no está centralizada: se mantiene en dos lugares, por diseño de esta etapa. Procedimiento para cambiarla:

1. Editar el arreglo `knowledge`, la lista `unsupported` y sus textos **en ambos archivos**: el campo `jsCode` de `asistente-institucional-demo.json` y el bloque que va desde `const unsupported` hasta `function urlWebhook` (incluye `knowledge`) y la función `demoAnswer` de `assets/asistente-institucional/asistente-institucional.js`. Mantener los términos normalizados (sin tildes ni mayúsculas).
2. Ejecutar `npm.cmd run comprobar` desde `n8n/`. Debe terminar con "Todas las comprobaciones pasaron".
3. Si se agrega una consulta nueva, incluirla en `scripts/comprobar-conocimiento.mjs`.
4. Reimportar y publicar el workflow (sección 1), reiniciar n8n y recargar la página del prototipo.

Si el script falla con "difieren", los dos lados tienen textos o términos distintos: alinearlos antes de publicar.
- El webhook de demo no tiene autenticación. No debe exponerse públicamente.
- La lista de orígenes CORS es solo para desarrollo local; no debe copiarse sin revisión a un despliegue público. Si la instancia conserva `*`, cualquier sitio abierto en tu navegador puede consultar el webhook.
- Si n8n no responde, la interfaz muestra un error y ofrece una respuesta de demostración claramente identificada como no proveniente de n8n.
- No pongas claves de proveedores de IA en el HTML ni en Git. Las futuras credenciales se configurarán del lado de n8n.
- GitHub Pages no puede acceder a la instancia n8n que corre en la computadora del desarrollador. La integración conectada se prueba localmente hasta diseñar un backend público seguro.
