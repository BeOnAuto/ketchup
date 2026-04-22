import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { type SessionEvent, Timeline } from './Timeline';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Timeline', () => {
  it('renders events as a nested tree with per-event-type summary', async () => {
    const events: SessionEvent[] = [
      {
        type: 'SessionStarted',
        timestamp: 't0',
        sessionId: 'a',
        cwd: '/foo',
        gitBranch: 'main',
        version: '1',
        entrypoint: 'cli',
        source: {},
      },
      { type: 'PromptSubmitted', timestamp: 't1', sessionId: 'a', prompt: 'A'.repeat(100), source: {} },
      { type: 'AssistantResponded', timestamp: 't2', sessionId: 'a', text: 'hi', source: {} },
      {
        type: 'ThoughtRecorded',
        timestamp: 't3',
        sessionId: 'a',
        thinking: 'reason',
        signature: 'sig',
        source: {},
      },
      {
        type: 'ToolInvoked',
        timestamp: 't4',
        sessionId: 'a',
        toolName: 'Bash',
        toolUseId: 'A',
        input: {},
        source: {},
      },
      {
        type: 'ToolInvocationSucceeded',
        timestamp: 't5',
        sessionId: 'a',
        toolUseId: 'A',
        content: 'ok',
        source: {},
      },
      {
        type: 'ToolInvoked',
        timestamp: 't6',
        sessionId: 'a',
        toolName: 'Task',
        toolUseId: 'B',
        input: {},
        source: {},
      },
      { type: 'SubagentProgressed', timestamp: 't7', sessionId: 'a', parentToolUseId: 'B', source: {} },
      {
        type: 'ToolInvocationFailed',
        timestamp: 't8',
        sessionId: 'a',
        toolUseId: 'B',
        error: 'bad',
        source: {},
      },
      {
        type: 'HookExecuted',
        timestamp: 't9',
        sessionId: 'a',
        hookEvent: 'Stop',
        hookName: 'tcr',
        command: 'sh',
        source: {},
      },
      {
        type: 'FileModified',
        timestamp: 't10',
        sessionId: 'a',
        filePath: '/a',
        operation: 'update',
        source: {},
      },
      { type: 'SessionEnded', timestamp: 't11', sessionId: 'a', source: {} },
    ];
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ events }))),
    );

    render(<Timeline sessionId="abc" />);
    const items = await screen.findAllByRole('listitem');

    expect(
      items.map((li) => ({
        level: Number(li.getAttribute('data-level')),
        label: li.querySelector('[data-testid="event-label"]')?.textContent,
      })),
    ).toEqual([
      { level: 1, label: 'SessionStarted — t0 — /foo @ main' },
      { level: 1, label: `PromptSubmitted — t1 — ${'A'.repeat(80)}…` },
      { level: 1, label: 'AssistantResponded — t2 — hi' },
      { level: 1, label: 'ThoughtRecorded — t3 — reason' },
      { level: 1, label: 'ToolInvoked — t4 — Bash' },
      { level: 2, label: 'ToolInvocationSucceeded — t5 — ✓ ok' },
      { level: 1, label: 'ToolInvoked — t6 — Task' },
      { level: 2, label: 'SubagentProgressed — t7 — parent=B' },
      { level: 2, label: 'ToolInvocationFailed — t8 — ✗ bad' },
      { level: 1, label: 'HookExecuted — t9 — Stop:tcr' },
      { level: 1, label: 'FileModified — t10 — update /a' },
      { level: 1, label: 'SessionEnded — t11 — ' },
    ]);
  });

  it('hides a parent node children when its collapse toggle is clicked', async () => {
    const events: SessionEvent[] = [
      {
        type: 'ToolInvoked',
        timestamp: 't1',
        sessionId: 'a',
        toolName: 'Bash',
        toolUseId: 'A',
        input: {},
        source: {},
      },
      {
        type: 'ToolInvocationSucceeded',
        timestamp: 't2',
        sessionId: 'a',
        toolUseId: 'A',
        content: 'ok',
        source: {},
      },
    ];
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ events }))),
    );
    const user = userEvent.setup();

    render(<Timeline sessionId="abc" />);
    await screen.findByRole('button', { name: /collapse/i });
    await user.click(screen.getByRole('button', { name: /collapse/i }));
    const items = screen.getAllByRole('listitem');

    expect(items.map((li) => li.querySelector('[data-testid="event-label"]')?.textContent)).toEqual([
      'ToolInvoked — t1 — Bash',
    ]);
  });
});
