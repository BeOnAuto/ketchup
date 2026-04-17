import { describe, expect, it } from 'vitest';

import { parseSessionStarted } from './translator.js';

describe('parseSessionStarted', () => {
  it('translates a SessionStart hook_progress line into a SessionStarted event', () => {
    const line = JSON.stringify({
      type: 'progress',
      data: {
        type: 'hook_progress',
        hookEvent: 'SessionStart',
        hookName: 'SessionStart:startup',
        command: 'node session-start.js',
      },
      uuid: 'd18b3b7d-cf88-42e3-9cd4-8c23220c3b3a',
      timestamp: '2026-03-24T13:04:50.596Z',
      sessionId: '1c62519e-23e0-4da5-b54f-a23c75943f1e',
      cwd: '/Users/igor/Projects/xolvio/claude-auto',
      gitBranch: 'main',
      version: '2.1.81',
      entrypoint: 'cli',
    });

    expect(parseSessionStarted(line)).toEqual({
      type: 'SessionStarted',
      sessionId: '1c62519e-23e0-4da5-b54f-a23c75943f1e',
      cwd: '/Users/igor/Projects/xolvio/claude-auto',
      gitBranch: 'main',
      version: '2.1.81',
      entrypoint: 'cli',
      timestamp: '2026-03-24T13:04:50.596Z',
      source: {
        line,
        uuid: 'd18b3b7d-cf88-42e3-9cd4-8c23220c3b3a',
      },
    });
  });
});
