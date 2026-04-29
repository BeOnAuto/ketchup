import { describe, expect, it } from 'vitest';

import { buildKetchupAllowPatterns, mergeAllowList } from './permissions-allow.js';

describe('buildKetchupAllowPatterns', () => {
  it('returns Bash patterns covering bare and arg-bearing invocations of files under the plugin root', () => {
    expect(buildKetchupAllowPatterns('/Users/sam/.claude/plugins/cache/BeOnAuto/ketchup')).toEqual([
      'Bash(node "/Users/sam/.claude/plugins/cache/BeOnAuto/ketchup/*")',
      'Bash(node "/Users/sam/.claude/plugins/cache/BeOnAuto/ketchup/*" *)',
    ]);
  });
});

describe('mergeAllowList', () => {
  it('seeds permissions.allow when missing, preserves other keys, and dedupes patterns', () => {
    const seeded = mergeAllowList({ voice: { enabled: true } }, ['Bash(echo a)', 'Bash(echo b)']);
    const merged = mergeAllowList({ permissions: { allow: ['Bash(echo a)', 'Bash(existing)'] }, theme: 'dark' }, [
      'Bash(echo a)',
      'Bash(echo b)',
    ]);
    const fromNothing = mergeAllowList(null, ['Bash(echo a)']);

    expect({ seeded, merged, fromNothing }).toEqual({
      seeded: { voice: { enabled: true }, permissions: { allow: ['Bash(echo a)', 'Bash(echo b)'] } },
      merged: { theme: 'dark', permissions: { allow: ['Bash(echo a)', 'Bash(existing)', 'Bash(echo b)'] } },
      fromNothing: { permissions: { allow: ['Bash(echo a)'] } },
    });
  });
});
