import * as fs from 'node:fs';
import * as path from 'node:path';

import type { ResolvedPaths } from './path-resolver.js';

export function logPluginDiagnostics(hookName: string, paths: ResolvedPaths): void {
  const isPluginMode = !!process.env.CLAUDE_PLUGIN_ROOT;
  const isDebug = !!process.env.CLAUDE_AUTO_DEBUG;

  if (!isPluginMode && !isDebug) {
    return;
  }

  const mode = isPluginMode ? 'plugin' : 'legacy';
  const timestamp = new Date().toISOString();
  const lines = [
    `[${timestamp}] ${hookName} hook fired (${mode} mode)`,
    `  CLAUDE_PLUGIN_ROOT: ${process.env.CLAUDE_PLUGIN_ROOT ?? '(not set)'}`,
    `  CLAUDE_PLUGIN_DATA: ${process.env.CLAUDE_PLUGIN_DATA ?? '(not set)'}`,
    `  projectRoot: ${paths.projectRoot}`,
    `  autoDir: ${paths.autoDir}`,
    `  validatorsDirs: ${JSON.stringify(paths.validatorsDirs)}`,
    `  remindersDirs: ${JSON.stringify(paths.remindersDirs)}`,
    '',
  ];
  const message = lines.join('\n');

  if (isDebug) {
    console.error(message);
  }

  const logsDir = path.join(paths.autoDir, 'logs');
  fs.mkdirSync(logsDir, { recursive: true });
  fs.appendFileSync(path.join(logsDir, 'plugin-debug.log'), message);
}
