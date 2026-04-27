import type { ChildProcess } from 'node:child_process';

import { readPortFrom } from './read-port';

export type SpawnFn = (command: string, args: string[]) => ChildProcess;

export interface ViewerHandle {
  process: ChildProcess;
  port: number;
}

export async function spawnViewer(
  scriptPath: string,
  dbPath: string,
  startPort: number,
  spawn: SpawnFn,
): Promise<ViewerHandle> {
  const child = spawn('node', [scriptPath, dbPath, String(startPort)]);
  if (!child.stdout) {
    throw new Error('spawned viewer has no stdout');
  }
  const port = await readPortFrom(child.stdout);
  return { process: child, port };
}
