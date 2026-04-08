import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DEFAULT_HOOK_STATE } from './hook-state.js';
import { initClaudeAuto } from './init.js';

describe('initClaudeAuto', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'claude-auto-init-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('creates .claude-auto directory with default state', () => {
    const result = initClaudeAuto(tempDir);
    const autoDir = path.join(tempDir, '.claude-auto');

    expect(result).toEqual({ created: true, autoDir, gitignoreAdvice: true });

    const stateFile = path.join(autoDir, '.claude.hooks.json');
    expect(JSON.parse(fs.readFileSync(stateFile, 'utf-8'))).toEqual(DEFAULT_HOOK_STATE);
  });

  it('returns created false when already initialized and preserves existing state', () => {
    const autoDir = path.join(tempDir, '.claude-auto');
    fs.mkdirSync(autoDir, { recursive: true });
    const existingState = { autoContinue: { mode: 'off' } };
    fs.writeFileSync(path.join(autoDir, '.claude.hooks.json'), JSON.stringify(existingState));

    const result = initClaudeAuto(tempDir);

    expect(result).toEqual({ created: false, autoDir, gitignoreAdvice: true });
    expect(JSON.parse(fs.readFileSync(path.join(autoDir, '.claude.hooks.json'), 'utf-8'))).toEqual(existingState);
  });

  it('returns gitignoreAdvice true when .claude-auto not in .gitignore', () => {
    fs.writeFileSync(path.join(tempDir, '.gitignore'), 'node_modules\n');

    const result = initClaudeAuto(tempDir);

    expect(result).toEqual({
      created: true,
      autoDir: path.join(tempDir, '.claude-auto'),
      gitignoreAdvice: true,
    });
  });

  it('returns gitignoreAdvice false when .claude-auto is in .gitignore', () => {
    fs.writeFileSync(path.join(tempDir, '.gitignore'), 'node_modules\n.claude-auto\n');

    const result = initClaudeAuto(tempDir);

    expect(result).toEqual({
      created: true,
      autoDir: path.join(tempDir, '.claude-auto'),
      gitignoreAdvice: false,
    });
  });
});
