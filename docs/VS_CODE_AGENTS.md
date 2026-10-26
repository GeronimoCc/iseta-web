# Trabajar con agentes en VS Code

## Objetivo
Usar agentes como asistentes especializados durante el desarrollo. No son varios bots que deban ejecutarse dentro del producto: son roles para planificar, modificar y revisar el código.

Los archivos de agentes de este repositorio están en `.github/agents/`. VS Code documenta los agentes personalizados en [Custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents) y las instrucciones de repositorio en [Custom instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions).

## Agentes incluidos
- **Analista planificador:** investiga el estado y propone pasos; no edita.
- **Frontend web:** trabaja sobre la interfaz del prototipo sin alterar el sitio HTTrack entero.
- **Integración n8n:** trabaja sobre el workflow y su contrato.
- **Revisor QA:** revisa cambios, seguridad y pruebas; no edita.

## Cómo usarlos
1. Abrí la carpeta raíz del repositorio en VS Code.
2. Usá una sesión de agente compatible con archivos `.agent.md` (por ejemplo, GitHub Copilot Chat en modo Agent si tu instalación lo soporta).
3. Abrí la lista de agentes en el selector de Agent/Chat.
4. Elegí **Analista planificador** para investigar o definir el siguiente cambio.
5. Revisá su propuesta antes de pasar a **Frontend web** o **Integración n8n** para implementar.
6. Elegí **Revisor QA** después de los cambios.
7. Revisá el diff de Git, ejecutá las pruebas y decidí si aceptás los cambios. No aceptes automáticamente una modificación solo porque un agente diga que terminó.

Si los agentes no aparecen, verificá que los archivos estén en `.github/agents/`, que abriste la raíz del repositorio y que tu versión/harness de VS Code admita esa configuración. Los formatos y las herramientas disponibles pueden variar entre Copilot, Claude y otros harnesses.

## Flujo recomendado por tarea
1. Analista: “Inspeccioná el problema X. No edites. Indicá archivos, evidencia, propuesta mínima y pruebas”.
2. Usuario: aprueba o ajusta el plan.
3. Implementador: “Implementá solo el plan aprobado. No amplíes alcance”.
4. Revisor QA: “Revisá el diff. No edites. Priorizá errores, seguridad, regresiones y pruebas faltantes”.
5. Usuario: revisa el diff y ejecuta las pruebas localmente.

## Regla importante
Los nombres y las instrucciones de un agente no son una barrera de seguridad absoluta. Revisá herramientas, permisos, cambios y comandos antes de aprobarlos. Mantené Git como punto de recuperación y no permitas que un agente publique secretos o fusione a `main` sin tu autorización.
