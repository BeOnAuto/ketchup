import { describe, expect, it } from 'vitest';

import { BRAND } from './brand.js';

describe('BRAND', () => {
  it('exposes brand identity, package, and copy constants', () => {
    expect(BRAND).toEqual({
      packageName: 'auto-ketchup',
      displayName: 'Ketchup',
      attribution: 'Ketchup, from Auto',
      dataDir: '.ketchup',
      docsUrl: 'https://ketchup.on.auto',
      repoUrl: 'https://github.com/BeOnAuto/auto-ketchup',
      leadTagline: 'Stop Babysitting. Start Parallelizing.',
      subTagline: 'Trust the system. Run 3–5 features in parallel. Ship 10+ per week.',
      categoryLine: 'A quality loop for Claude Code.',
    });
  });
});
