import { render, screen } from '@testing-library/react';
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

    const shell = screen.getByRole('heading', { name: /claude auto viewer/i }).closest('div');

    expect({
      shellClasses: shell?.className,
      placeholder: screen.getByText(/pick a session/i).textContent,
    }).toEqual({
      shellClasses: 'flex min-h-screen gap-4 p-4 font-sans',
      placeholder: 'Pick a session.',
    });
  });
});
