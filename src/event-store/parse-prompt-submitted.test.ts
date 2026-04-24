import { describe, expect, it } from 'vitest';

import { parsePromptSubmitted } from './parse-prompt-submitted.js';

describe('parsePromptSubmitted', () => {
  it('translates a user-typed prompt line into a PromptSubmitted event', () => {
    const line = JSON.stringify({
      parentUuid: 'fe5e95b9-38ed-449d-a115-6dc9612e42e3',
      isSidechain: false,
      promptId: 'eb2f3a27-2549-43a4-9d84-8bbb0b985826',
      type: 'user',
      message: {
        role: 'user',
        content: 'it looks like we can clean up legacy way of installing this plugin',
      },
      uuid: '1e5a0a46-542e-486e-82db-bcedb1d48dc9',
      timestamp: '2026-03-24T13:21:17.055Z',
      permissionMode: 'default',
      userType: 'external',
      entrypoint: 'cli',
      cwd: '/Users/sam/Projects/xolvio/ketchup',
      sessionId: '1c62519e-23e0-4da5-b54f-a23c75943f1e',
      version: '2.1.81',
      gitBranch: 'main',
    });

    expect(parsePromptSubmitted(line)).toEqual([
      {
        type: 'PromptSubmitted',
        sessionId: '1c62519e-23e0-4da5-b54f-a23c75943f1e',
        prompt: 'it looks like we can clean up legacy way of installing this plugin',
        timestamp: '2026-03-24T13:21:17.055Z',
        source: {
          line,
          uuid: '1e5a0a46-542e-486e-82db-bcedb1d48dc9',
        },
      },
    ]);
  });
});
