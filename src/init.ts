import * as fs from 'node:fs';
import * as path from 'node:path';

import { BRAND } from './brand.js';
import { DEFAULT_HOOK_STATE } from './hook-state.js';

export interface InitResult {
  created: boolean;
  autoDir: string;
  gitignoreAdvice: boolean;
}

export function initKetchup(projectRoot: string): InitResult {
  const autoDir = path.join(projectRoot, BRAND.dataDir);

  if (fs.existsSync(autoDir)) {
    return { created: false, autoDir, gitignoreAdvice: checkGitignoreAdvice(projectRoot) };
  }

  fs.mkdirSync(autoDir, { recursive: true });

  const stateFile = path.join(autoDir, '.claude.hooks.json');
  fs.writeFileSync(stateFile, `${JSON.stringify(DEFAULT_HOOK_STATE, null, 2)}\n`);

  return { created: true, autoDir, gitignoreAdvice: checkGitignoreAdvice(projectRoot) };
}

export function formatInitResult(result: InitResult): string {
  const lines: string[] = [];

  if (result.created) {
    lines.push(`✅ Initialized ${BRAND.displayName} at ${result.autoDir}`);
    lines.push(`🎯 Default configuration written to ${BRAND.dataDir}/.claude.hooks.json`);

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
