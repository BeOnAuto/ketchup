import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from './App';

describe('App', () => {
  it('renders the viewer heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /claude auto viewer/i })).toBeInTheDocument();
  });
});
