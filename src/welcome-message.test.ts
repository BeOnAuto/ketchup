import { describe, expect, it } from 'vitest';

import { INIT_HINT_MESSAGE } from './welcome-message.js';

describe('INIT_HINT_MESSAGE', () => {
  it('instructs Claude to surface the reminder once on first reply', () => {
    expect(INIT_HINT_MESSAGE).toBe(
      'On your first reply, mention once (then proceed with the user\'s request): "Reminder: Use /claude-auto-init to enable https://claude.on.auto in this folder"',
    );
  });
});
