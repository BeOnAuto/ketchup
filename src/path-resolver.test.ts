import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resolveClaudeDirFromScript, resolvePathsFromEnv } from './path-resolver.js';

describe('resolveClaudeDirFromScript', () => {
  it('resolves .claude dir two levels up from script directory', () => {
    const scriptDir = '/project/.claude-auto/scripts';

    const result = resolveClaudeDirFromScript(scriptDir);

    expect(result).toBe('/project/.claude');
  });

  it('handles trailing slashes in script directory', () => {
    const scriptDir = '/project/.claude-auto/scripts/';

    const result = resolveClaudeDirFromScript(scriptDir);

    expect(result).toBe('/project/.claude');
  });

  it('works with nested project paths', () => {
    const scriptDir = '/home/user/code/my-project/.claude-auto/scripts';

    const result = resolveClaudeDirFromScript(scriptDir);

    expect(result).toBe('/home/user/code/my-project/.claude');
  });
});

describe('resolvePathsFromEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.stubEnv('CLAUDE_PLUGIN_ROOT', '');
    vi.stubEnv('CLAUDE_PLUGIN_DATA', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns plugin-mode paths when CLAUDE_PLUGIN_ROOT and CLAUDE_PLUGIN_DATA are set', async () => {
    vi.stubEnv('CLAUDE_PLUGIN_ROOT', '/plugins/claude-auto');
    vi.stubEnv('CLAUDE_PLUGIN_DATA', '/data/claude-auto');

    const result = await resolvePathsFromEnv();

    expect(result.autoDir).toBe(path.join(process.cwd(), '.claude-auto'));
    expect(result.claudeDir).toBe(path.join(process.cwd(), '.claude'));
    expect(result.projectRoot).toBe(process.cwd());
    expect(result.validatorsDirs).toEqual([
      '/plugins/claude-auto/validators',
      path.join(process.cwd(), '.claude-auto', 'validators'),
    ]);
    expect(result.remindersDirs).toEqual([
      '/plugins/claude-auto/reminders',
      path.join(process.cwd(), '.claude-auto', 'reminders'),
    ]);
  });

  it('falls back to legacy mode when env vars are not set', async () => {
    delete process.env.CLAUDE_PLUGIN_ROOT;
    delete process.env.CLAUDE_PLUGIN_DATA;

    const result = await resolvePathsFromEnv();

    expect(result.validatorsDirs.length).toBe(1);
    expect(result.remindersDirs.length).toBe(1);
    expect(result.validatorsDirs[0]).toContain('validators');
    expect(result.remindersDirs[0]).toContain('reminders');
  });

  it('falls back to legacy mode when only CLAUDE_PLUGIN_ROOT is set', async () => {
    vi.stubEnv('CLAUDE_PLUGIN_ROOT', '/plugins/claude-auto');
    delete process.env.CLAUDE_PLUGIN_DATA;

    const result = await resolvePathsFromEnv();

    expect(result.validatorsDirs.length).toBe(1);
    expect(result.remindersDirs.length).toBe(1);
  });

  it('includes project-local dirs for plugin-mode multi-dir loading', async () => {
    vi.stubEnv('CLAUDE_PLUGIN_ROOT', '/plugins/claude-auto');
    vi.stubEnv('CLAUDE_PLUGIN_DATA', '/data/claude-auto');

    const result = await resolvePathsFromEnv();

    expect(result.validatorsDirs).toHaveLength(2);
    expect(result.remindersDirs).toHaveLength(2);
    expect(result.validatorsDirs[0]).toBe('/plugins/claude-auto/validators');
    expect(result.remindersDirs[0]).toBe('/plugins/claude-auto/reminders');
  });
});
