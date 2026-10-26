// Arranca n8n solo en localhost, con datos dentro de n8n/.n8n-data y sin telemetría.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const bin = path.join(here, 'node_modules', 'n8n', 'bin', 'n8n');

const child = spawn(process.execPath, [bin, 'start'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    N8N_USER_FOLDER: path.join(here, '.n8n-data'),
    N8N_LISTEN_ADDRESS: '127.0.0.1',
    N8N_PORT: '5678',
    N8N_DIAGNOSTICS_ENABLED: 'false',
    N8N_VERSION_NOTIFICATIONS_ENABLED: 'false',
    N8N_TEMPLATES_ENABLED: 'false',
    N8N_PERSONALIZATION_ENABLED: 'false'
  }
});

child.on('exit', (code) => process.exit(code ?? 0));
