import { describe, expect, it } from 'vitest';

import { INIT_HINT_MESSAGE } from './welcome-message.js';

describe('INIT_HINT_MESSAGE', () => {
  it('contains init instruction', () => {
    expect(INIT_HINT_MESSAGE).toContain('/claude-auto init');
  });

  it('is non-blocking and does not contain CRITICAL or DO NOT', () => {
    expect(INIT_HINT_MESSAGE).not.toContain('CRITICAL');
    expect(INIT_HINT_MESSAGE).not.toContain('DO NOT');
  });
});
