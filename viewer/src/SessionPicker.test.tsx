import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SessionPicker } from './SessionPicker';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SessionPicker', () => {
  it('fetches session summaries and renders them as selectable buttons in order', async () => {
    const summaries = [
      { sessionId: 'abc-123', eventCount: 12, firstTimestamp: 't1', lastTimestamp: 't2' },
      { sessionId: 'xyz-456', eventCount: 3, firstTimestamp: 't3', lastTimestamp: 't4' },
    ];
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ sessions: summaries }))),
    );

    render(<SessionPicker onSelect={() => {}} />);
    const buttons = await screen.findAllByRole('button');

    expect(buttons.map((button) => button.textContent)).toEqual([
      'abc-123 — 12 events (t2)',
      'xyz-456 — 3 events (t4)',
    ]);
  });
});
