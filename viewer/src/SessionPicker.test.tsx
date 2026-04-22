import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SessionPicker } from './SessionPicker';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SessionPicker', () => {
  it('renders each session as a card with truncated id, event count, and last timestamp', async () => {
    const summaries = [
      {
        sessionId: 'd886289b-6710-482e-a5e5-ebbf146318ae',
        eventCount: 12,
        firstTimestamp: '2026-04-20T10:00:00Z',
        lastTimestamp: '2026-04-20T11:00:00Z',
      },
      {
        sessionId: 'xyz-4567890abc',
        eventCount: 3,
        firstTimestamp: '2026-04-19T09:00:00Z',
        lastTimestamp: '2026-04-19T09:30:00Z',
      },
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
      { id: 'd886289b…', count: '12 events', time: new Date('2026-04-20T11:00:00Z').toLocaleString() },
      { id: 'xyz-4567…', count: '3 events', time: new Date('2026-04-19T09:30:00Z').toLocaleString() },
    ]);
  });
});
