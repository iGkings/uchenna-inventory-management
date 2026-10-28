import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('\x1b[36m%s\x1b[0m', '=====================================================');
console.log('\x1b[33m%s\x1b[0m', '  iGKINGS INNOVATION — INVENTORY MANAGEMENT SYSTEM  ');
console.log('\x1b[36m%s\x1b[0m', '  Starting Client & Server in Concurrent Dev Mode...  ');
console.log('\x1b[36m%s\x1b[0m', '=====================================================\n');

function runProcess(name, command, args, cwd, color) {
  const proc = spawn(command, args, {
    cwd,
    stdio: 'pipe',
    shell: isWindows,
  });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => {
      if (line) console.log(`${color}[${name}]\x1b[0m ${line}`);
    });
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => {
      if (line) console.error(`${color}[${name} ERR]\x1b[0m ${line}`);
    });
  });

  proc.on('close', (code) => {
    console.log(`${color}[${name}]\x1b[0m exited with code ${code}`);
  });

  return proc;
}

const serverProc = runProcess('Server', npmCmd, ['run', 'dev'], path.join(rootDir, 'server'), '\x1b[32m');
const clientProc = runProcess('Client', npmCmd, ['run', 'dev'], path.join(rootDir, 'client'), '\x1b[34m');

const shutdown = () => {
  console.log('\nShutting down development servers...');
  serverProc.kill();
  clientProc.kill();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
