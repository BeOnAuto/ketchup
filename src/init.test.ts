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

    expect(result).toEqual({ created: true, autoDir, gitignoreAdvice: true, permissionsUpdated: false });

    const stateFile = path.join(autoDir, 'state.json');
    expect(JSON.parse(fs.readFileSync(stateFile, 'utf-8'))).toEqual(DEFAULT_HOOK_STATE);
  });

  it('returns created false when already initialized and preserves existing state', () => {
    const autoDir = path.join(tempDir, '.ketchup');
    fs.mkdirSync(autoDir, { recursive: true });
    const existingState = { autoContinue: { mode: 'off' } };
    fs.writeFileSync(path.join(autoDir, 'state.json'), JSON.stringify(existingState));

    const result = initKetchup(tempDir);

    expect(result).toEqual({ created: false, autoDir, gitignoreAdvice: true, permissionsUpdated: false });
    expect(JSON.parse(fs.readFileSync(path.join(autoDir, 'state.json'), 'utf-8'))).toEqual(existingState);
  });

  it('writes Bash allow patterns to <home>/.claude/settings.json when plugin root is provided', () => {
    const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'ketchup-home-'));
    try {
      const result = initKetchup(tempDir, { pluginRoot: '/opt/ketchup', userHomeDir: fakeHome });
      const settings = JSON.parse(fs.readFileSync(path.join(fakeHome, '.claude', 'settings.json'), 'utf-8'));

      expect({ updated: result.permissionsUpdated, allow: settings.permissions.allow }).toEqual({
        updated: true,
        allow: ['Bash(node "/opt/ketchup/*")', 'Bash(node "/opt/ketchup/*" *)'],
      });
    } finally {
      fs.rmSync(fakeHome, { recursive: true, force: true });
    }
  });

  it('preserves existing user settings when merging Ketchup allow patterns', () => {
    const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'ketchup-home-'));
    try {
      fs.mkdirSync(path.join(fakeHome, '.claude'));
      fs.writeFileSync(
        path.join(fakeHome, '.claude', 'settings.json'),
        JSON.stringify({ theme: 'dark', permissions: { allow: ['Bash(echo ok)'] } }),
      );

      const result = initKetchup(tempDir, { pluginRoot: '/opt/ketchup', userHomeDir: fakeHome });
      const settings = JSON.parse(fs.readFileSync(path.join(fakeHome, '.claude', 'settings.json'), 'utf-8'));

      expect({
        updated: result.permissionsUpdated,
        theme: settings.theme,
        allow: settings.permissions.allow,
      }).toEqual({
        updated: true,
        theme: 'dark',
        allow: ['Bash(echo ok)', 'Bash(node "/opt/ketchup/*")', 'Bash(node "/opt/ketchup/*" *)'],
      });
    } finally {
      fs.rmSync(fakeHome, { recursive: true, force: true });
    }
  });

  it('reports permissionsUpdated false when patterns are already in user settings', () => {
    const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'ketchup-home-'));
    try {
      fs.mkdirSync(path.join(fakeHome, '.claude'));
      fs.writeFileSync(
        path.join(fakeHome, '.claude', 'settings.json'),
        JSON.stringify({
          permissions: { allow: ['Bash(node "/opt/ketchup/*")', 'Bash(node "/opt/ketchup/*" *)'] },
        }),
      );

      const result = initKetchup(tempDir, { pluginRoot: '/opt/ketchup', userHomeDir: fakeHome });

      expect(result.permissionsUpdated).toBe(false);
    } finally {
      fs.rmSync(fakeHome, { recursive: true, force: true });
    }
  });

  it('returns gitignoreAdvice true when .ketchup not in .gitignore', () => {
    fs.writeFileSync(path.join(tempDir, '.gitignore'), 'node_modules\n');

    const result = initKetchup(tempDir);

    expect(result).toEqual({
      created: true,
      autoDir: path.join(tempDir, '.ketchup'),
      gitignoreAdvice: true,
      permissionsUpdated: false,
    });
  });

  it('returns gitignoreAdvice false when .ketchup is in .gitignore', () => {
    fs.writeFileSync(path.join(tempDir, '.gitignore'), 'node_modules\n.ketchup\n');

    const result = initKetchup(tempDir);

    expect(result).toEqual({
      created: true,
      autoDir: path.join(tempDir, '.ketchup'),
      gitignoreAdvice: false,
      permissionsUpdated: false,
    });
  });
});

describe('formatInitResult', () => {
  it('formats newly created result with directive-wrapped config reminder', () => {
    const output = formatInitResult({
      created: true,
      autoDir: '/project/.ketchup',
      gitignoreAdvice: true,
      permissionsUpdated: false,
    });

    expect(output).toContain('Initialized Ketchup at /project/.ketchup');
    expect(output).toContain('.gitignore');
    expect(output).toContain('On your next reply, mention once');
    expect(output).toContain('Reminder: Defaults are active. Run /ketchup:config show');
    expect(output).not.toMatch(/ask the user/i);
  });

  it('formats already initialized result without config prompt', () => {
    const output = formatInitResult({
      created: false,
      autoDir: '/project/.ketchup',
      gitignoreAdvice: false,
      permissionsUpdated: false,
    });

    expect(output).toContain('already initialized');
    expect(output).not.toContain('/ketchup:config');
  });

  it('mentions the permissions update on already-initialized projects too', () => {
    const output = formatInitResult({
      created: false,
      autoDir: '/project/.ketchup',
      gitignoreAdvice: false,
      permissionsUpdated: true,
    });

    expect(output).toContain('already initialized');
    expect(output).toMatch(/Bash permission|allow list|~\/\.claude\/settings\.json/i);
  });

  it('mentions the permissions update when Bash patterns were written', () => {
    const output = formatInitResult({
      created: true,
      autoDir: '/project/.ketchup',
      gitignoreAdvice: false,
      permissionsUpdated: true,
    });

    expect(output).toMatch(/Bash permission|allow list|~\/\.claude\/settings\.json/i);
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
    expect(fs.existsSync(path.join(tempDir, '.ketchup', 'state.json'))).toBe(true);
  });
});
