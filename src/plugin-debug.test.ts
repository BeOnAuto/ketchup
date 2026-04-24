import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { logPluginDiagnostics } from './plugin-debug.js';

describe('logPluginDiagnostics', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'plugin-debug-'));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('does not write log file when autoDir does not exist', () => {
    vi.stubEnv('CLAUDE_PLUGIN_ROOT', '/plugins/ketchup');
    const nonExistentDir = path.join(tempDir, 'not-created');

    logPluginDiagnostics('SessionStart', {
      projectRoot: '/project',
      claudeDir: '/project/.claude',
      autoDir: nonExistentDir,
      validatorsDirs: ['/plugins/ketchup/validators'],
      remindersDirs: ['/plugins/ketchup/reminders'],
      protectedValidatorsDirs: ['/plugins/ketchup/validators'],
    });

    expect(fs.existsSync(nonExistentDir)).toBe(false);
  });

  it('writes to file in plugin mode', () => {
    vi.stubEnv('CLAUDE_PLUGIN_ROOT', '/plugins/ketchup');
    vi.stubEnv('CLAUDE_PLUGIN_DATA', '/data/ketchup');
    vi.spyOn(console, 'error').mockImplementation(() => {});

    logPluginDiagnostics('SessionStart', {
      projectRoot: '/project',
      claudeDir: '/project/.claude',
      autoDir: tempDir,
      validatorsDirs: ['/plugins/ketchup/validators'],
      remindersDirs: ['/plugins/ketchup/reminders'],
      protectedValidatorsDirs: ['/plugins/ketchup/validators'],
    });

    const logFile = path.join(tempDir, 'logs', 'plugin-debug.log');
    expect(fs.existsSync(logFile)).toBe(true);
    const content = fs.readFileSync(logFile, 'utf8');
    expect(content).toContain('plugin mode');
  });

  it('writes to file when KETCHUP_DEBUG is set in legacy mode', () => {
    vi.stubEnv('KETCHUP_DEBUG', '1');
    delete process.env.CLAUDE_PLUGIN_ROOT;
    delete process.env.CLAUDE_PLUGIN_DATA;
    vi.spyOn(console, 'error').mockImplementation(() => {});

    logPluginDiagnostics('PreToolUse', {
      projectRoot: '/project',
      claudeDir: '/project/.claude',
      autoDir: tempDir,
      validatorsDirs: ['/project/.ketchup/validators'],
      remindersDirs: ['/project/.ketchup/reminders'],
      protectedValidatorsDirs: [],
    });

    const logFile = path.join(tempDir, 'logs', 'plugin-debug.log');
    const content = fs.readFileSync(logFile, 'utf8');
    expect(content).toContain('legacy mode');
  });

  it('writes to stderr only when KETCHUP_DEBUG is set', () => {
    vi.stubEnv('KETCHUP_DEBUG', '1');
    vi.stubEnv('CLAUDE_PLUGIN_ROOT', '/plugins/ketchup');
    vi.stubEnv('CLAUDE_PLUGIN_DATA', '/data/ketchup');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    logPluginDiagnostics('SessionStart', {
      projectRoot: '/project',
      claudeDir: '/project/.claude',
      autoDir: tempDir,
      validatorsDirs: ['/plugins/ketchup/validators'],
      remindersDirs: ['/plugins/ketchup/reminders'],
      protectedValidatorsDirs: ['/plugins/ketchup/validators'],
    });

    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });

  it('does not write to stderr in plugin mode without KETCHUP_DEBUG', () => {
    vi.stubEnv('CLAUDE_PLUGIN_ROOT', '/plugins/ketchup');
    vi.stubEnv('CLAUDE_PLUGIN_DATA', '/data/ketchup');
    delete process.env.KETCHUP_DEBUG;
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    logPluginDiagnostics('SessionStart', {
      projectRoot: '/project',
      claudeDir: '/project/.claude',
      autoDir: tempDir,
      validatorsDirs: ['/plugins/ketchup/validators'],
      remindersDirs: ['/plugins/ketchup/reminders'],
      protectedValidatorsDirs: ['/plugins/ketchup/validators'],
    });

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('does nothing in legacy mode without KETCHUP_DEBUG', () => {
    delete process.env.KETCHUP_DEBUG;
    delete process.env.CLAUDE_PLUGIN_ROOT;
    delete process.env.CLAUDE_PLUGIN_DATA;
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    logPluginDiagnostics('SessionStart', {
      projectRoot: '/project',
      claudeDir: '/project/.claude',
      autoDir: tempDir,
      validatorsDirs: ['/project/.ketchup/validators'],
      remindersDirs: ['/project/.ketchup/reminders'],
      protectedValidatorsDirs: [],
    });

    expect(spy).not.toHaveBeenCalled();
    const logFile = path.join(tempDir, 'logs', 'plugin-debug.log');
    expect(fs.existsSync(logFile)).toBe(false);
    spy.mockRestore();
  });
});
