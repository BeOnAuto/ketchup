import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SessionPicker } from './SessionPicker';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SessionPicker', () => {
  it('uses summary as the primary label and falls back to a truncated id when summary is empty', async () => {
    const summaries = [
      {
        sessionId: 'abc-123456789',
        eventCount: 12,
        firstTimestamp: '2026-04-20T10:00:00Z',
        lastTimestamp: '2026-04-20T11:00:00Z',
        summary: 'my first prompt summary',
      },
      {
        sessionId: 'empty-456789',
        eventCount: 3,
        firstTimestamp: '2026-04-19T09:00:00Z',
        lastTimestamp: '2026-04-19T09:30:00Z',
        summary: '',
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
        label: button.querySelector('[data-testid="session-label"]')?.textContent,
        meta: button.querySelector('[data-testid="session-meta"]')?.textContent,
      })),
    ).toEqual([
      {
        label: 'my first prompt summary',
        meta: `12 events·${new Date('2026-04-20T11:00:00Z').toLocaleString()}`,
      },
      {
        label: 'empty-45…',
        meta: `3 events·${new Date('2026-04-19T09:30:00Z').toLocaleString()}`,
      },
    ]);
  });
});
