import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DEFAULT_HOOK_STATE } from './hook-state.js';
import { formatInitResult, initKetchup } from './init.js';

describe('initKetchup', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ketchup-init-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('creates .ketchup directory with default state', () => {
    const result = initKetchup(tempDir);
    const autoDir = path.join(tempDir, '.ketchup');

    expect(result).toEqual({ created: true, autoDir, gitignoreAdvice: true });

    const stateFile = path.join(autoDir, '.claude.hooks.json');
    expect(JSON.parse(fs.readFileSync(stateFile, 'utf-8'))).toEqual(DEFAULT_HOOK_STATE);
  });

  it('returns created false when already initialized and preserves existing state', () => {
    const autoDir = path.join(tempDir, '.ketchup');
    fs.mkdirSync(autoDir, { recursive: true });
    const existingState = { autoContinue: { mode: 'off' } };
    fs.writeFileSync(path.join(autoDir, '.claude.hooks.json'), JSON.stringify(existingState));

    const result = initKetchup(tempDir);

    expect(result).toEqual({ created: false, autoDir, gitignoreAdvice: true });
    expect(JSON.parse(fs.readFileSync(path.join(autoDir, '.claude.hooks.json'), 'utf-8'))).toEqual(existingState);
  });

  it('returns gitignoreAdvice true when .ketchup not in .gitignore', () => {
    fs.writeFileSync(path.join(tempDir, '.gitignore'), 'node_modules\n');

    const result = initKetchup(tempDir);

    expect(result).toEqual({
      created: true,
      autoDir: path.join(tempDir, '.ketchup'),
      gitignoreAdvice: true,
    });
  });

  it('returns gitignoreAdvice false when .ketchup is in .gitignore', () => {
    fs.writeFileSync(path.join(tempDir, '.gitignore'), 'node_modules\n.ketchup\n');

    const result = initKetchup(tempDir);

    expect(result).toEqual({
      created: true,
      autoDir: path.join(tempDir, '.ketchup'),
      gitignoreAdvice: false,
    });
  });
});

describe('formatInitResult', () => {
  it('formats newly created result with directive-wrapped config reminder', () => {
    const output = formatInitResult({ created: true, autoDir: '/project/.ketchup', gitignoreAdvice: true });

    expect(output).toContain('Initialized Ketchup at /project/.ketchup');
    expect(output).toContain('.gitignore');
    expect(output).toContain('On your next reply, mention once');
    expect(output).toContain('Reminder: Defaults are active. Run /ketchup:config show');
    expect(output).not.toMatch(/ask the user/i);
  });

  it('formats already initialized result without config prompt', () => {
    const output = formatInitResult({ created: false, autoDir: '/project/.ketchup', gitignoreAdvice: false });

    expect(output).toContain('already initialized');
    expect(output).not.toContain('/ketchup:config');
  });
});

describe('scripts/init.ts', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ketchup-script-init-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('creates .ketchup and prints initialization message', () => {
    const scriptPath = path.resolve(__dirname, '..', 'scripts', 'init.ts');
    const output = execSync(`npx tsx ${scriptPath}`, { cwd: tempDir, encoding: 'utf-8' });

    expect(output).toContain('Initialized Ketchup');
    expect(fs.existsSync(path.join(tempDir, '.ketchup', '.claude.hooks.json'))).toBe(true);
  });
});
