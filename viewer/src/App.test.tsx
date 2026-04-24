import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from './App';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('App', () => {
  it('renders the viewer shell with tailwind utility classes and a placeholder', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ sessions: [] }))),
    );

    render(<App />);

    const shell = screen.getByRole('heading', { name: /ketchup viewer/i }).closest('div');

    expect({
      shellClasses: shell?.className,
      placeholder: screen.getByText(/pick a session/i).textContent,
    }).toEqual({
      shellClasses: 'flex min-h-screen gap-4 bg-ketchup-bg p-4 font-sans text-ketchup-text',
      placeholder: 'Pick a session.',
    });
  });

  it('renders the viewer title with the Ketchup rainbow gradient class', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ sessions: [] }))),
    );

    render(<App />);

    expect(screen.getByRole('heading', { name: /ketchup viewer/i }).className).toEqual(
      'mb-4 ketchup-brand-gradient text-xl font-semibold',
    );
  });

  it('constrains the main content area with min-w-0 so long content does not push the page wide', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ sessions: [] }))),
    );

    render(<App />);

    expect(screen.getByRole('main').className).toEqual('min-w-0 flex-1');
  });

  it('shows a session header with id and summary after the user picks a session', async () => {
    const sessions = [
      {
        sessionId: 'abc-12345678',
        eventCount: 5,
        firstTimestamp: '2026-04-20T10:00:00Z',
        lastTimestamp: '2026-04-20T11:00:00Z',
        summary: 'my first prompt',
      },
    ];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) =>
        url.endsWith('/events')
          ? new Response(JSON.stringify({ events: [] }))
          : new Response(JSON.stringify({ sessions })),
      ),
    );
    const user = userEvent.setup();

    render(<App />);
    const pickerButton = await screen.findByRole('button');
    await user.click(pickerButton);
    const header = await screen.findByTestId('session-header');

    expect(header.textContent).toEqual('session idabc-12345678copy resume commandmy first prompt');
  });
});
