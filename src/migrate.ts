import * as fs from 'node:fs';
import * as path from 'node:path';

import { BRAND } from './brand.js';

const LEGACY_DATA_DIR = '.claude-auto';

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
