import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DEFAULT_HOOK_STATE } from './hook-state.js';
import { formatInitResult, initClaudeAuto } from './init.js';

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

describe('formatInitResult', () => {
  it('formats newly created result with directive-wrapped config reminder', () => {
    const output = formatInitResult({ created: true, autoDir: '/project/.claude-auto', gitignoreAdvice: true });

    expect(output).toContain('Initialized claude-auto at /project/.claude-auto');
    expect(output).toContain('.gitignore');
    expect(output).toContain('On your next reply, mention once');
    expect(output).toContain('Reminder: Defaults are active — run /claude-auto-config show');
    expect(output).not.toMatch(/ask the user/i);
  });

  it('formats already initialized result without config prompt', () => {
    const output = formatInitResult({ created: false, autoDir: '/project/.claude-auto', gitignoreAdvice: false });

    expect(output).toContain('already initialized');
    expect(output).not.toContain('/claude-auto-config');
  });
});

describe('scripts/init.ts', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'claude-auto-script-init-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('creates .claude-auto and prints initialization message', () => {
    const scriptPath = path.resolve(__dirname, '..', 'scripts', 'init.ts');
    const output = execSync(`npx tsx ${scriptPath}`, { cwd: tempDir, encoding: 'utf-8' });

    expect(output).toContain('Initialized claude-auto');
    expect(fs.existsSync(path.join(tempDir, '.claude-auto', '.claude.hooks.json'))).toBe(true);
  });
});
