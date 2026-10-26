import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const n8nDir = path.join(here, '..');
const workflowPath = path.join(n8nDir, 'asistente-institucional-demo.json');
const codePath = path.join(n8nDir, 'asistente-institucional-code.js');
const workflow = JSON.parse(readFileSync(workflowPath, 'utf8'));
const codeNodes = workflow.nodes.filter((node) => node.type === 'n8n-nodes-base.code');

if (codeNodes.length !== 1) {
  throw new Error(`Se esperaba un nodo Code y se encontraron ${codeNodes.length}`);
}

const code = readFileSync(codePath, 'utf8').trimEnd();
if (codeNodes[0].parameters.jsCode === code) {
  console.log('El workflow ya está sincronizado.');
} else {
  codeNodes[0].parameters.jsCode = code;
  writeFileSync(workflowPath, `${JSON.stringify(workflow, null, 2)}\n`);
  console.log('Código sincronizado en asistente-institucional-demo.json.');
}
