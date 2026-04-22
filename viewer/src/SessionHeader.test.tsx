import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SessionHeader } from './SessionHeader';

describe('SessionHeader', () => {
  it('shows a session id label and copies the resume command when the button is clicked', async () => {
    const onCopy = vi.fn();
    const user = userEvent.setup();

    render(<SessionHeader sessionId="abc-12345678" summary="hello" onCopy={onCopy} />);
    await user.click(screen.getByRole('button', { name: /copy resume command/i }));

    expect({
      label: screen.getByText('session id').textContent,
      id: screen.getByText('abc-12345678').textContent,
      summary: screen.getByText('hello').textContent,
      copied: onCopy.mock.calls[0]?.[0],
    }).toEqual({
      label: 'session id',
      id: 'abc-12345678',
      summary: 'hello',
      copied: 'claude --resume abc-12345678',
    });
  });
});
