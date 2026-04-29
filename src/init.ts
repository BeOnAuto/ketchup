import * as fs from 'node:fs';
import * as path from 'node:path';

import { BRAND } from './brand.js';
import { DEFAULT_HOOK_STATE } from './hook-state.js';
import { buildKetchupAllowPatterns, mergeAllowList } from './permissions-allow.js';

export interface InitOptions {
  pluginRoot?: string;
  userHomeDir?: string;
}

export interface InitResult {
  created: boolean;
  autoDir: string;
  gitignoreAdvice: boolean;
  permissionsUpdated: boolean;
}

export function initKetchup(projectRoot: string, options: InitOptions = {}): InitResult {
  const autoDir = path.join(projectRoot, BRAND.dataDir);
  const created = !fs.existsSync(autoDir);

  if (created) {
    fs.mkdirSync(autoDir, { recursive: true });
    const stateFile = path.join(autoDir, BRAND.stateFile);
    fs.writeFileSync(stateFile, `${JSON.stringify(DEFAULT_HOOK_STATE, null, 2)}\n`);
  }

  const permissionsUpdated =
    options.pluginRoot && options.userHomeDir ? writeUserAllowList(options.userHomeDir, options.pluginRoot) : false;

  return {
    created,
    autoDir,
    gitignoreAdvice: checkGitignoreAdvice(projectRoot),
    permissionsUpdated,
  };
}

function writeUserAllowList(userHomeDir: string, pluginRoot: string): boolean {
  const claudeDir = path.join(userHomeDir, '.claude');
  const settingsPath = path.join(claudeDir, 'settings.json');
  const existing = fs.existsSync(settingsPath)
    ? (JSON.parse(fs.readFileSync(settingsPath, 'utf-8')) as Record<string, unknown>)
    : null;
  const merged = mergeAllowList(existing, buildKetchupAllowPatterns(pluginRoot));
  if (existing && JSON.stringify(existing) === JSON.stringify(merged)) {
    return false;
  }
  fs.mkdirSync(claudeDir, { recursive: true });
  fs.writeFileSync(settingsPath, `${JSON.stringify(merged, null, 2)}\n`);
  return true;
}

export function formatInitResult(result: InitResult): string {
  const lines: string[] = [];

  if (result.created) {
    lines.push(`✅ Initialized ${BRAND.displayName} at ${result.autoDir}`);
    lines.push(`🎯 Default configuration written to ${BRAND.dataDir}/${BRAND.stateFile}`);

    if (result.permissionsUpdated) {
      lines.push(`🔓 Added Ketchup Bash patterns to ~/.claude/settings.json allow list`);
    }

    if (result.gitignoreAdvice) {
      lines.push('');
      lines.push(`📌 Note: ${BRAND.dataDir} is not in your .gitignore.`);
      lines.push('   If this is for personal use only, consider adding it:');
      lines.push(`     echo "${BRAND.dataDir}" >> .gitignore`);
    }

    lines.push('');
    lines.push(
      `On your next reply, mention once (then proceed with the user's request): "Reminder: Defaults are active. Run /${BRAND.packageName}:config show anytime to review or customize."`,
    );
  } else {
    lines.push(`✅ ${BRAND.displayName} is already initialized at ${result.autoDir}`);
    if (result.permissionsUpdated) {
      lines.push(`🔓 Added Ketchup Bash patterns to ~/.claude/settings.json allow list`);
    }
  }

  return lines.join('\n');
}

function checkGitignoreAdvice(projectRoot: string): boolean {
  const gitignorePath = path.join(projectRoot, '.gitignore');

  if (!fs.existsSync(gitignorePath)) {
    return true;
  }

  const content = fs.readFileSync(gitignorePath, 'utf-8');
  const lines = content.split('\n').map((l) => l.trim());
  return !lines.some((line) => line === BRAND.dataDir || line === `${BRAND.dataDir}/`);
}
