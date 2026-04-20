import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from './App';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('App', () => {
  it('renders the viewer heading and a placeholder until a session is picked', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ sessions: [] }))),
    );

    render(<App />);

    expect({
      heading: screen.getByRole('heading', { name: /claude auto viewer/i }).textContent,
      placeholder: screen.getByText(/pick a session/i).textContent,
    }).toEqual({
      heading: 'Claude Auto Viewer',
      placeholder: 'Pick a session.',
    });
  });
});
