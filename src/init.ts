import * as fs from 'node:fs';
import * as path from 'node:path';

import { DEFAULT_HOOK_STATE } from './hook-state.js';

export interface InitResult {
  created: boolean;
  autoDir: string;
  gitignoreAdvice: boolean;
}

export function initClaudeAuto(projectRoot: string): InitResult {
  const autoDir = path.join(projectRoot, '.claude-auto');

  if (fs.existsSync(autoDir)) {
    return { created: false, autoDir, gitignoreAdvice: checkGitignoreAdvice(projectRoot) };
  }

  fs.mkdirSync(autoDir, { recursive: true });

  const stateFile = path.join(autoDir, '.claude.hooks.json');
  fs.writeFileSync(stateFile, `${JSON.stringify(DEFAULT_HOOK_STATE, null, 2)}\n`);

  return { created: true, autoDir, gitignoreAdvice: checkGitignoreAdvice(projectRoot) };
}

function checkGitignoreAdvice(projectRoot: string): boolean {
  const gitignorePath = path.join(projectRoot, '.gitignore');

  if (!fs.existsSync(gitignorePath)) {
    return true;
  }

  const content = fs.readFileSync(gitignorePath, 'utf-8');
  const lines = content.split('\n').map((l) => l.trim());
  return !lines.some((line) => line === '.claude-auto' || line === '.claude-auto/');
}
