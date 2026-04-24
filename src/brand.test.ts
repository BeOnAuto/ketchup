import { describe, expect, it } from 'vitest';

import { BRAND } from './brand.js';

describe('BRAND', () => {
  it('exposes brand identity, package, and copy constants', () => {
    expect(BRAND).toEqual({
      packageName: 'ketchup',
      displayName: 'Ketchup',
      attribution: 'Ketchup, from Auto',
      dataDir: '.ketchup',
      stateFile: 'state.json',
      docsUrl: 'https://ketchup.on.auto',
      repoUrl: 'https://github.com/BeOnAuto/ketchup',
      leadTagline: "Turn every AI mistake into a rule AI can't repeat.",
      subTagline: "Ketchup runs 20+ LLM-powered guardrails on every AI commit, so bad commits don't land.",
      categoryLine: 'LLM-powered guardrails for AI coding agents.',
    });
  });
});
