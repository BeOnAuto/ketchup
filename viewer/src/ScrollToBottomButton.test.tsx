import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ScrollToBottomButton } from './ScrollToBottomButton';

const originalScrollTo = window.scrollTo;

beforeEach(() => {
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    value: 2000,
  });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: 800,
    writable: true,
  });
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value: 0,
    writable: true,
  });
});

afterEach(() => {
  window.scrollTo = originalScrollTo;
});

describe('ScrollToBottomButton', () => {
  it('renders when content is below the fold and scrolls to the bottom on click', () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo as typeof window.scrollTo;

    render(<ScrollToBottomButton />);
    const initialButton = screen.queryByRole('button', { name: /scroll to bottom/i });
    if (initialButton) fireEvent.click(initialButton);

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1200, writable: true });
    fireEvent.scroll(window);
    const afterScrollButton = screen.queryByRole('button', { name: /scroll to bottom/i });

    expect({
      initialRendered: !!initialButton,
      hiddenAtBottom: !afterScrollButton,
      scrolledTo: scrollTo.mock.calls[0]?.[0],
    }).toEqual({
      initialRendered: true,
      hiddenAtBottom: true,
      scrolledTo: { top: 2000, behavior: 'smooth' },
    });
  });
});
