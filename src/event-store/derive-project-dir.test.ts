import { homedir } from 'node:os';
import { describe, expect, it } from 'vitest';

import { deriveProjectDir } from './derive-project-dir.js';

describe('deriveProjectDir', () => {
  it('maps an absolute cwd into ~/.claude/projects with slashes flattened to dashes', () => {
    expect(deriveProjectDir('/Users/igor/Projects/xolvio/claude-auto')).toEqual(
      `${homedir()}/.claude/projects/-Users-igor-Projects-xolvio-claude-auto`,
    );
  });
});
