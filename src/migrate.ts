import * as fs from 'node:fs';
import * as path from 'node:path';

import { BRAND } from './brand.js';

const LEGACY_DATA_DIR = '.claude-auto';
const LEGACY_STATE_FILE = '.claude.hooks.json';
const LEGACY_CLAUDE_DIR = '.claude';
const DENY_LIST_FILES = ['deny-list.project.txt', 'deny-list.local.txt'];

export interface MigrateResult {
  migrated: boolean;
  conflict?: boolean;
}

export function migrateLegacyDataDir(projectRoot: string): MigrateResult {
  const legacy = path.join(projectRoot, LEGACY_DATA_DIR);
  const current = path.join(projectRoot, BRAND.dataDir);

  const legacyExists = fs.existsSync(legacy);
  const currentExists = fs.existsSync(current);

  if (legacyExists && currentExists) {
    return { migrated: false, conflict: true };
  }

  if (legacyExists) {
    fs.renameSync(legacy, current);
    return { migrated: true };
  }

  return { migrated: false };
}

export function migrateLegacyStateFile(projectRoot: string): MigrateResult {
  const dataDir = path.join(projectRoot, BRAND.dataDir);

  if (!fs.existsSync(dataDir)) {
    return { migrated: false };
  }

  const legacy = path.join(dataDir, LEGACY_STATE_FILE);
  const current = path.join(dataDir, BRAND.stateFile);

  const legacyExists = fs.existsSync(legacy);
  const currentExists = fs.existsSync(current);

  if (legacyExists && currentExists) {
    return { migrated: false, conflict: true };
  }

  if (legacyExists) {
    fs.renameSync(legacy, current);
    return { migrated: true };
  }

  return { migrated: false };
}

export function migrateLegacyDenyList(projectRoot: string): MigrateResult {
  const dataDir = path.join(projectRoot, BRAND.dataDir);
  const legacyDir = path.join(projectRoot, LEGACY_CLAUDE_DIR);

  if (!fs.existsSync(dataDir) || !fs.existsSync(legacyDir)) {
    return { migrated: false };
  }

  let migratedAny = false;
  let conflictedAny = false;

  for (const file of DENY_LIST_FILES) {
    const legacy = path.join(legacyDir, file);
    const current = path.join(dataDir, file);

    if (!fs.existsSync(legacy)) {
      continue;
    }

    if (fs.existsSync(current)) {
      conflictedAny = true;
      continue;
    }

    fs.renameSync(legacy, current);
    migratedAny = true;
  }

  if (conflictedAny && !migratedAny) {
    return { migrated: false, conflict: true };
  }

  return { migrated: migratedAny };
}
