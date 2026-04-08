import { describe, expect, it } from 'vitest';

import { INIT_HINT_MESSAGE } from './welcome-message.js';

describe('INIT_HINT_MESSAGE', () => {
  it('contains init instruction and is non-blocking', () => {
    expect(INIT_HINT_MESSAGE).toContain('/claude-auto-init');
    expect(INIT_HINT_MESSAGE).toContain('do not block');
    expect(INIT_HINT_MESSAGE).not.toContain('CRITICAL');
  });
});
