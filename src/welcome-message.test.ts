import { describe, expect, it } from 'vitest';

import { INIT_HINT_MESSAGE } from './welcome-message.js';

describe('INIT_HINT_MESSAGE', () => {
  it('is a plain one-line reminder to run /claude-auto-init', () => {
    expect(INIT_HINT_MESSAGE).toBe('Reminder: Use /claude-auto-init to enable https://claude.on.auto in this folder');
  });
});
