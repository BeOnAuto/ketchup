import * as path from 'node:path';

import { DEFAULT_AUTO_DIR, loadConfig } from './config-loader.js';

export interface ResolvedPaths {
  projectRoot: string;
  claudeDir: string;
  autoDir: string;
  remindersDirs: string[];
  validatorsDirs: string[];
}

export function resolveClaudeDirFromScript(scriptDir: string): string {
  const projectRoot = path.resolve(scriptDir, '..', '..');
  return path.join(projectRoot, '.claude');
}

export async function resolvePaths(claudeDir: string): Promise<ResolvedPaths> {
  const projectRoot = path.dirname(claudeDir);
  const config = await loadConfig(projectRoot);

  const autoDirName = config.autoDir ?? DEFAULT_AUTO_DIR;
  const autoDir = path.join(projectRoot, autoDirName);

  return {
    projectRoot,
    claudeDir,
    autoDir,
    remindersDirs: [path.join(autoDir, 'reminders')],
    validatorsDirs: [path.join(autoDir, 'validators')],
  };
}

export async function resolvePathsFromEnv(): Promise<ResolvedPaths> {
  const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT;
  const pluginData = process.env.CLAUDE_PLUGIN_DATA;

  if (pluginRoot && pluginData) {
    const projectRoot = process.cwd();
    const claudeDir = path.join(projectRoot, '.claude');
    const projectAutoDir = path.join(projectRoot, DEFAULT_AUTO_DIR);
    const autoDir = projectAutoDir;

    return {
      projectRoot,
      claudeDir,
      autoDir,
      remindersDirs: [path.join(pluginRoot, 'reminders'), path.join(projectAutoDir, 'reminders')],
      validatorsDirs: [path.join(pluginRoot, 'validators'), path.join(projectAutoDir, 'validators')],
    };
  }

  const claudeDir = resolveClaudeDirFromScript(__dirname);
  return resolvePaths(claudeDir);
}
