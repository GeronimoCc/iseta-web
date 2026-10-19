# Auditoría del repositorio

**Fecha de revisión:** 19/10/2026  
**Rama de referencia:** `main`  
**Repositorio:** `GeronimoCc/iseta-web`

## 1. Estructura observada
La rama principal contiene una copia estática del sitio del ISETA, generada con HTTrack. En la revisión de la API de GitHub se observaron 337 archivos y 213 archivos de imagen (extensiones PNG, JPG/JPEG, GIF, WebP, SVG o AVIF). La página principal contiene rutas relativas para imágenes y navegación interna en los ejemplos inspeccionados.

La copia incluye páginas de carreras, horarios, información institucional, departamentos/servicios, noticias y otros contenidos. También hay archivos JSON exportados desde rutas de WordPress y documentos que deben revisarse individualmente antes de usarlos como conocimiento del chatbot.

## 2. Hallazgos
- `README.md` en `main` era únicamente `# iseta-web`; esta rama añade una descripción del proyecto y documentos de trabajo.
- En la instantánea de `main` inspeccionada no se encontraron hojas CSS o scripts JS locales con extensión `.css` o `.js`. Algunas páginas conservan referencias a recursos del sitio original; se debe comprobar el comportamiento en el navegador y la pestaña Network.
- El HTML conserva comentarios y estructura de HTTrack/WordPress. No conviene reformatear o reescribir todo el sitio automáticamente.
- Las imágenes ahora están presentes en el repositorio; verificar rutas y carga real en varias páginas.
- La existencia de archivos no prueba que el sitio publicado cargue todos sus recursos. Se requiere prueba de navegador para confirmar estilos, imágenes, navegación y consola.
- Los datos JSON de WordPress y los documentos no deben incorporarse todos automáticamente al contexto del modelo. Primero hay que filtrar relevancia, vigencia y procedencia.

## 3. Prototipo agregado en esta rama
- `prototipos/asistente-institucional.html`: interfaz independiente del sitio copiado.
- `n8n/asistente-institucional-demo.json`: workflow inicial sin proveedor de IA.
- `n8n/README.md`: instrucciones de importación y prueba.
- `AGENTS.md` y `.github/agents/`: contexto e instrucciones para agentes de desarrollo.

Estos archivos se vuelven a aplicar sobre la rama actualizada de `main`, de modo que no dependan de la versión antigua de la rama anterior.

## 4. Próximas comprobaciones
1. Abrir la página principal y al menos dos páginas internas en GitHub Pages.
2. Confirmar imágenes, estilos, enlaces internos y consola del navegador.
3. Probar el HTML del asistente en local.
4. Importar y ejecutar el workflow de n8n.
5. No activar un proveedor de IA hasta que el flujo de demostración funcione.
