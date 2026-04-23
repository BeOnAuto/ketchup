import * as path from 'node:path';

import { BRAND } from './brand.js';

export interface ResolvedPaths {
  projectRoot: string;
  claudeDir: string;
  autoDir: string;
  remindersDirs: string[];
  validatorsDirs: string[];
  protectedValidatorsDirs: string[];
}

export async function resolvePathsFromEnv(explicitPluginRoot?: string): Promise<ResolvedPaths> {
  const pluginRoot = explicitPluginRoot || process.env.CLAUDE_PLUGIN_ROOT;

  if (!pluginRoot) {
    throw new Error('CLAUDE_PLUGIN_ROOT must be set. Claude Auto requires plugin mode.');
  }

  const projectRoot = process.cwd();
  const claudeDir = path.join(projectRoot, '.claude');
  const autoDir = path.join(projectRoot, BRAND.dataDir);

  const pluginValidatorsDir = path.join(pluginRoot, 'validators');

  return {
    projectRoot,
    claudeDir,
    autoDir,
    remindersDirs: [path.join(pluginRoot, 'reminders'), path.join(autoDir, 'reminders')],
    validatorsDirs: [pluginValidatorsDir, path.join(autoDir, 'validators')],
    protectedValidatorsDirs: [pluginValidatorsDir],
  };
}
