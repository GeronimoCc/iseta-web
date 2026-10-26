# Instrucciones para agentes de desarrollo

## Contexto del proyecto
Este repositorio contiene una copia estática del sitio institucional del ISETA y, en una carpeta separada, un prototipo académico de asistente institucional. El objetivo es construir una demostración pequeña, verificable y segura para Seminario de Programación (Analista de Sistemas).

## Decisiones que se deben respetar
- Mantener el sitio copiado existente; no regenerarlo ni reescribirlo en masa.
- El prototipo inicial usa HTML, CSS y JavaScript sin framework.
- n8n es obligatorio para la orquestación.
- La primera integración es local y usa respuestas de demostración. Un modelo remoto gratuito puede evaluarse después; no ejecutar un LLM local.
- No agregar Python, base de datos, vector store, RAG, Docker obligatorio ni otros servicios sin justificar una necesidad concreta.
- Aula virtual, webmail, autenticación, trámites y datos personales están fuera del alcance.
- Nunca incluir claves API, tokens ni datos privados en el frontend, el repositorio o los logs.
- No prometer que una respuesta es correcta si la fuente no la respalda. Si falta evidencia, indicarlo y enlazar fuentes.
- El sitio publicado en GitHub Pages es estático. No puede llamar a una instancia local de n8n del desarrollador para atender a visitantes generales. La demostración conectada se prueba localmente hasta decidir y asegurar un backend accesible.
- No modificar `main` ni fusionar ramas sin autorización explícita del usuario. Trabajar en la rama indicada y presentar los cambios para revisión.

## Forma de trabajo
1. Leer `README.md` y los documentos pertinentes de `docs/`.
2. Inspeccionar el código existente antes de cambiarlo.
3. Proponer el cambio mínimo y explicar por qué hace falta.
4. Hacer cambios pequeños, fáciles de probar y reversibles.
5. Ejecutar las comprobaciones disponibles; nunca afirmar que se probó algo que no se ejecutó.
6. Actualizar la documentación cuando cambien comportamiento, arquitectura o pasos de prueba.
7. Informar archivos modificados, comandos/pruebas ejecutados, resultados y limitaciones.
8. Si hay ambigüedad importante, preguntar antes de asumir. No expandir el alcance por iniciativa propia.

## Estilo
- Interfaz y documentación en español claro, con vocabulario técnico explicado cuando sea útil.
- Código legible para un estudiante que debe defenderlo oralmente.
- Preferir funciones simples, nombres explícitos y dependencias mínimas.
- No ocultar errores con respuestas inventadas ni usar HTML sin sanitizar para mostrar texto del modelo.
