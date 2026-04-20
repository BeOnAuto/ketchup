import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Timeline } from './Timeline';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Timeline', () => {
  it('fetches events for the given session id and renders them in order', async () => {
    const events = [
      { type: 'SessionStarted', timestamp: '2026-04-20T10:00:00Z', sessionId: 'abc' },
      { type: 'PromptSubmitted', timestamp: '2026-04-20T10:00:05Z', sessionId: 'abc', prompt: 'hi' },
      { type: 'AssistantResponded', timestamp: '2026-04-20T10:00:10Z', sessionId: 'abc', text: 'hello' },
    ];
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ events }))),
    );

    render(<Timeline sessionId="abc" />);
    const items = await screen.findAllByRole('listitem');

    expect(items.map((item) => item.textContent)).toEqual([
      'SessionStarted — 2026-04-20T10:00:00Z',
      'PromptSubmitted — 2026-04-20T10:00:05Z',
      'AssistantResponded — 2026-04-20T10:00:10Z',
    ]);
  });
});
