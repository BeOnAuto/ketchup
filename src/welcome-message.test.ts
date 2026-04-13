import { describe, expect, it } from 'vitest';

import { INIT_HINT_MESSAGE } from './welcome-message.js';

describe('INIT_HINT_MESSAGE', () => {
  it('contains init instruction and is non-blocking', () => {
    expect(INIT_HINT_MESSAGE).toContain('/claude-auto-init');
    expect(INIT_HINT_MESSAGE).toContain('do not block');
    expect(INIT_HINT_MESSAGE).not.toContain('CRITICAL');
  });

  it('uses emojis for visibility', () => {
    expect(INIT_HINT_MESSAGE).toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
  });
});
