import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resolvePathsFromEnv } from './path-resolver.js';

describe('resolvePathsFromEnv', () => {
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

    expect(result).toEqual({
      projectRoot: process.cwd(),
      claudeDir: path.join(process.cwd(), '.claude'),
      autoDir: path.join(process.cwd(), '.ketchup'),
      validatorsDirs: ['/plugins/claude-auto/validators', path.join(process.cwd(), '.ketchup', 'validators')],
      remindersDirs: ['/plugins/claude-auto/reminders', path.join(process.cwd(), '.ketchup', 'reminders')],
      protectedValidatorsDirs: ['/plugins/claude-auto/validators'],
    });
  });

  it('throws when env vars are not set and no pluginRoot provided', async () => {
    delete process.env.CLAUDE_PLUGIN_ROOT;
    delete process.env.CLAUDE_PLUGIN_DATA;

    await expect(resolvePathsFromEnv()).rejects.toThrow(
      'CLAUDE_PLUGIN_ROOT must be set. Claude Auto requires plugin mode.',
    );
  });

  it('uses explicit pluginRoot when env var is not set', async () => {
    delete process.env.CLAUDE_PLUGIN_ROOT;
    delete process.env.CLAUDE_PLUGIN_DATA;

    const result = await resolvePathsFromEnv('/explicit/plugin-root');

    expect(result).toEqual({
      projectRoot: process.cwd(),
      claudeDir: path.join(process.cwd(), '.claude'),
      autoDir: path.join(process.cwd(), '.ketchup'),
      validatorsDirs: ['/explicit/plugin-root/validators', path.join(process.cwd(), '.ketchup', 'validators')],
      remindersDirs: ['/explicit/plugin-root/reminders', path.join(process.cwd(), '.ketchup', 'reminders')],
      protectedValidatorsDirs: ['/explicit/plugin-root/validators'],
    });
  });

  it('works when only CLAUDE_PLUGIN_ROOT is set (skills context)', async () => {
    vi.stubEnv('CLAUDE_PLUGIN_ROOT', '/plugins/claude-auto');
    delete process.env.CLAUDE_PLUGIN_DATA;

    const result = await resolvePathsFromEnv();

    expect(result).toEqual({
      projectRoot: process.cwd(),
      claudeDir: path.join(process.cwd(), '.claude'),
      autoDir: path.join(process.cwd(), '.ketchup'),
      validatorsDirs: ['/plugins/claude-auto/validators', path.join(process.cwd(), '.ketchup', 'validators')],
      remindersDirs: ['/plugins/claude-auto/reminders', path.join(process.cwd(), '.ketchup', 'reminders')],
      protectedValidatorsDirs: ['/plugins/claude-auto/validators'],
    });
  });

  it('includes project-local dirs for multi-dir loading', async () => {
    vi.stubEnv('CLAUDE_PLUGIN_ROOT', '/plugins/claude-auto');
    vi.stubEnv('CLAUDE_PLUGIN_DATA', '/data/claude-auto');

    const result = await resolvePathsFromEnv();

    expect(result.validatorsDirs).toHaveLength(2);
    expect(result.remindersDirs).toHaveLength(2);
    expect(result.validatorsDirs[0]).toBe('/plugins/claude-auto/validators');
    expect(result.remindersDirs[0]).toBe('/plugins/claude-auto/reminders');
  });

  it('exposes protectedValidatorsDirs containing only the plugin validators dir', async () => {
    vi.stubEnv('CLAUDE_PLUGIN_ROOT', '/plugins/claude-auto');

    const result = await resolvePathsFromEnv();

    expect(result).toEqual({
      projectRoot: process.cwd(),
      claudeDir: path.join(process.cwd(), '.claude'),
      autoDir: path.join(process.cwd(), '.ketchup'),
      validatorsDirs: ['/plugins/claude-auto/validators', path.join(process.cwd(), '.ketchup', 'validators')],
      remindersDirs: ['/plugins/claude-auto/reminders', path.join(process.cwd(), '.ketchup', 'reminders')],
      protectedValidatorsDirs: ['/plugins/claude-auto/validators'],
    });
  });
});
