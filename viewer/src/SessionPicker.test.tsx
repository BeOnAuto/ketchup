import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SessionPicker } from './SessionPicker';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SessionPicker', () => {
  it('renders each session as a card with truncated id, event count, and last timestamp', async () => {
    const summaries = [
      { sessionId: 'd886289b-6710-482e-a5e5-ebbf146318ae', eventCount: 12, firstTimestamp: 't1', lastTimestamp: 't2' },
      { sessionId: 'xyz-4567890abc', eventCount: 3, firstTimestamp: 't3', lastTimestamp: 't4' },
    ];
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ sessions: summaries }))),
    );

    render(<SessionPicker onSelect={() => {}} />);
    const buttons = await screen.findAllByRole('button');

    expect(
      buttons.map((button) => ({
        id: button.querySelector('[data-testid="session-id"]')?.textContent,
        count: button.querySelector('[data-testid="session-count"]')?.textContent,
        time: button.querySelector('[data-testid="session-time"]')?.textContent,
      })),
    ).toEqual([
      { id: 'd886289b…', count: '12 events', time: 't2' },
      { id: 'xyz-4567…', count: '3 events', time: 't4' },
    ]);
  });
});
