import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { type SessionEvent, Timeline } from './Timeline';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Timeline', () => {
  it('renders per-event-type summary alongside type and timestamp', async () => {
    const events: SessionEvent[] = [
      {
        type: 'SessionStarted',
        timestamp: 't1',
        sessionId: 'a',
        cwd: '/foo',
        gitBranch: 'main',
        version: '1',
        entrypoint: 'cli',
        source: {},
      },
      { type: 'PromptSubmitted', timestamp: 't2', sessionId: 'a', prompt: 'A'.repeat(100), source: {} },
      { type: 'AssistantResponded', timestamp: 't3', sessionId: 'a', text: 'hi', source: {} },
      {
        type: 'ThoughtRecorded',
        timestamp: 't4',
        sessionId: 'a',
        thinking: 'reason',
        signature: 'sig',
        source: {},
      },
      {
        type: 'ToolInvoked',
        timestamp: 't5',
        sessionId: 'a',
        toolName: 'Bash',
        toolUseId: 'id1',
        input: {},
        source: {},
      },
      {
        type: 'ToolInvocationSucceeded',
        timestamp: 't6',
        sessionId: 'a',
        toolUseId: 'id1',
        content: 'ok',
        source: {},
      },
      {
        type: 'ToolInvocationFailed',
        timestamp: 't7',
        sessionId: 'a',
        toolUseId: 'id1',
        error: 'bad',
        source: {},
      },
      {
        type: 'HookExecuted',
        timestamp: 't8',
        sessionId: 'a',
        hookEvent: 'Stop',
        hookName: 'tcr',
        command: 'sh',
        source: {},
      },
      { type: 'SubagentProgressed', timestamp: 't9', sessionId: 'a', parentToolUseId: 'p1', source: {} },
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

    expect(items.map((item) => item.textContent)).toEqual([
      `SessionStarted — t1 — /foo @ main`,
      `PromptSubmitted — t2 — ${'A'.repeat(80)}…`,
      'AssistantResponded — t3 — hi',
      'ThoughtRecorded — t4 — reason',
      'ToolInvoked — t5 — Bash',
      'ToolInvocationSucceeded — t6 — ✓ ok',
      'ToolInvocationFailed — t7 — ✗ bad',
      'HookExecuted — t8 — Stop:tcr',
      'SubagentProgressed — t9 — parent=p1',
      'FileModified — t10 — update /a',
      'SessionEnded — t11 — ',
    ]);
  });
});
