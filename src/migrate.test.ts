import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { migrateLegacyDataDir, migrateLegacyDenyList, migrateLegacyStateFile } from './migrate.js';

describe('migrateLegacyDataDir', () => {
  let projectRoot: string;

  beforeEach(() => {
    projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ketchup-migrate-'));
  });

  afterEach(() => {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  });

  it('renames .claude-auto/ to .ketchup/ when only legacy exists', () => {
    const legacy = path.join(projectRoot, '.claude-auto');
    fs.mkdirSync(legacy, { recursive: true });
    fs.writeFileSync(path.join(legacy, '.claude.hooks.json'), '{}');

    const result = migrateLegacyDataDir(projectRoot);

    expect(result).toEqual({ migrated: true });
    expect(fs.existsSync(legacy)).toBe(false);
    const current = path.join(projectRoot, '.ketchup');
    expect(fs.existsSync(current)).toBe(true);
    expect(fs.readFileSync(path.join(current, '.claude.hooks.json'), 'utf-8')).toBe('{}');
  });

  it('is a no-op when only the new dir exists', () => {
    const current = path.join(projectRoot, '.ketchup');
    fs.mkdirSync(current, { recursive: true });

    const result = migrateLegacyDataDir(projectRoot);

    expect(result).toEqual({ migrated: false });
    expect(fs.existsSync(current)).toBe(true);
  });

  it('is a no-op when neither dir exists', () => {
    const result = migrateLegacyDataDir(projectRoot);

    expect(result).toEqual({ migrated: false });
    expect(fs.existsSync(path.join(projectRoot, '.claude-auto'))).toBe(false);
    expect(fs.existsSync(path.join(projectRoot, '.ketchup'))).toBe(false);
  });

  it('does not overwrite the new dir when both exist', () => {
    const legacy = path.join(projectRoot, '.claude-auto');
    const current = path.join(projectRoot, '.ketchup');
    fs.mkdirSync(legacy, { recursive: true });
    fs.mkdirSync(current, { recursive: true });
    fs.writeFileSync(path.join(legacy, '.claude.hooks.json'), '{"legacy": true}');
    fs.writeFileSync(path.join(current, '.claude.hooks.json'), '{"current": true}');

    const result = migrateLegacyDataDir(projectRoot);

    expect(result).toEqual({ migrated: false, conflict: true });
    expect(fs.readFileSync(path.join(current, '.claude.hooks.json'), 'utf-8')).toBe('{"current": true}');
    expect(fs.readFileSync(path.join(legacy, '.claude.hooks.json'), 'utf-8')).toBe('{"legacy": true}');
  });
});

describe('migrateLegacyStateFile', () => {
  let projectRoot: string;
  let dataDir: string;

  beforeEach(() => {
    projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ketchup-state-migrate-'));
    dataDir = path.join(projectRoot, '.ketchup');
  });

  afterEach(() => {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  });

  it('renames .claude.hooks.json to state.json when only legacy exists', () => {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(path.join(dataDir, '.claude.hooks.json'), '{"autoContinue":{"mode":"smart"}}');

    const result = migrateLegacyStateFile(projectRoot);

    expect(result).toEqual({ migrated: true });
    expect(fs.existsSync(path.join(dataDir, '.claude.hooks.json'))).toBe(false);
    expect(fs.readFileSync(path.join(dataDir, 'state.json'), 'utf-8')).toBe('{"autoContinue":{"mode":"smart"}}');
  });

  it('is a no-op when only state.json exists', () => {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(path.join(dataDir, 'state.json'), '{}');

    const result = migrateLegacyStateFile(projectRoot);

    expect(result).toEqual({ migrated: false });
    expect(fs.readFileSync(path.join(dataDir, 'state.json'), 'utf-8')).toBe('{}');
  });

  it('is a no-op when the data dir does not exist', () => {
    const result = migrateLegacyStateFile(projectRoot);

    expect(result).toEqual({ migrated: false });
  });

  it('is a no-op when neither file exists', () => {
    fs.mkdirSync(dataDir, { recursive: true });

    const result = migrateLegacyStateFile(projectRoot);

    expect(result).toEqual({ migrated: false });
  });

  it('does not overwrite state.json when both exist', () => {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(path.join(dataDir, '.claude.hooks.json'), '{"legacy": true}');
    fs.writeFileSync(path.join(dataDir, 'state.json'), '{"current": true}');

    const result = migrateLegacyStateFile(projectRoot);

    expect(result).toEqual({ migrated: false, conflict: true });
    expect(fs.readFileSync(path.join(dataDir, 'state.json'), 'utf-8')).toBe('{"current": true}');
    expect(fs.readFileSync(path.join(dataDir, '.claude.hooks.json'), 'utf-8')).toBe('{"legacy": true}');
  });
});

describe('migrateLegacyDenyList', () => {
  let projectRoot: string;
  let claudeDir: string;
  let dataDir: string;

  beforeEach(() => {
    projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ketchup-deny-migrate-'));
    claudeDir = path.join(projectRoot, '.claude');
    dataDir = path.join(projectRoot, '.ketchup');
  });

  afterEach(() => {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  });

  it('moves deny-list files from .claude/ into .ketchup/ when only legacy exists', () => {
    fs.mkdirSync(claudeDir, { recursive: true });
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(path.join(claudeDir, 'deny-list.project.txt'), '*.secret\n');
    fs.writeFileSync(path.join(claudeDir, 'deny-list.local.txt'), '/private/**\n');

    const result = migrateLegacyDenyList(projectRoot);

    expect(result).toEqual({ migrated: true });
    expect(fs.existsSync(path.join(claudeDir, 'deny-list.project.txt'))).toBe(false);
    expect(fs.existsSync(path.join(claudeDir, 'deny-list.local.txt'))).toBe(false);
    expect(fs.readFileSync(path.join(dataDir, 'deny-list.project.txt'), 'utf-8')).toBe('*.secret\n');
    expect(fs.readFileSync(path.join(dataDir, 'deny-list.local.txt'), 'utf-8')).toBe('/private/**\n');
  });

  it('migrates only files that exist in .claude/', () => {
    fs.mkdirSync(claudeDir, { recursive: true });
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(path.join(claudeDir, 'deny-list.project.txt'), '*.secret\n');

    const result = migrateLegacyDenyList(projectRoot);

    expect(result).toEqual({ migrated: true });
    expect(fs.readFileSync(path.join(dataDir, 'deny-list.project.txt'), 'utf-8')).toBe('*.secret\n');
    expect(fs.existsSync(path.join(dataDir, 'deny-list.local.txt'))).toBe(false);
  });

  it('is a no-op when .ketchup/ does not exist', () => {
    fs.mkdirSync(claudeDir, { recursive: true });
    fs.writeFileSync(path.join(claudeDir, 'deny-list.project.txt'), '*.secret\n');

    const result = migrateLegacyDenyList(projectRoot);

    expect(result).toEqual({ migrated: false });
    expect(fs.readFileSync(path.join(claudeDir, 'deny-list.project.txt'), 'utf-8')).toBe('*.secret\n');
  });

  it('is a no-op when .claude/ does not exist', () => {
    fs.mkdirSync(dataDir, { recursive: true });

    const result = migrateLegacyDenyList(projectRoot);

    expect(result).toEqual({ migrated: false });
  });

  it('does not overwrite existing files in .ketchup/', () => {
    fs.mkdirSync(claudeDir, { recursive: true });
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(path.join(claudeDir, 'deny-list.project.txt'), 'legacy-pattern\n');
    fs.writeFileSync(path.join(dataDir, 'deny-list.project.txt'), 'current-pattern\n');

    const result = migrateLegacyDenyList(projectRoot);

    expect(result).toEqual({ migrated: false, conflict: true });
    expect(fs.readFileSync(path.join(dataDir, 'deny-list.project.txt'), 'utf-8')).toBe('current-pattern\n');
    expect(fs.readFileSync(path.join(claudeDir, 'deny-list.project.txt'), 'utf-8')).toBe('legacy-pattern\n');
  });

  it('migrates one file even if the other conflicts', () => {
    fs.mkdirSync(claudeDir, { recursive: true });
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(path.join(claudeDir, 'deny-list.project.txt'), 'legacy-project\n');
    fs.writeFileSync(path.join(claudeDir, 'deny-list.local.txt'), 'legacy-local\n');
    fs.writeFileSync(path.join(dataDir, 'deny-list.project.txt'), 'current-project\n');

    const result = migrateLegacyDenyList(projectRoot);

    expect(result).toEqual({ migrated: true });
    expect(fs.readFileSync(path.join(dataDir, 'deny-list.local.txt'), 'utf-8')).toBe('legacy-local\n');
    expect(fs.readFileSync(path.join(dataDir, 'deny-list.project.txt'), 'utf-8')).toBe('current-project\n');
  });
});
