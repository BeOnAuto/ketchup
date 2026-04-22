import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { type SessionEvent, Timeline } from './Timeline';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Timeline', () => {
  it('renders remaining non-variant events with generic label at depth 1', async () => {
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
      { level: 1, label: 'HookExecuted — t9 — Stop:tcr' },
      { level: 1, label: 'FileModified — t10 — update /a' },
      { level: 1, label: 'SessionEnded — t11 — ' },
    ]);
  });

  it('renders a tool invocation as a card with the tool name and JSON-formatted input', async () => {
    const events: SessionEvent[] = [
      {
        type: 'ToolInvoked',
        timestamp: 't1',
        sessionId: 'a',
        toolName: 'Bash',
        toolUseId: 'A',
        input: { command: 'ls -la' },
        source: {},
      },
    ];
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ events }))),
    );

    render(<Timeline sessionId="abc" pollIntervalMs={60000} />);
    const card = await screen.findByTestId('tool-card');

    expect(card.textContent).toEqual('Bashcommand="ls -la"');
  });

  it('renders a thought as a collapsed disclosure with italic body when expanded', async () => {
    const thinking = 'Let me reason through this carefully step by step';
    const events: SessionEvent[] = [
      { type: 'ThoughtRecorded', timestamp: 't1', sessionId: 'a', thinking, signature: 'sig', source: {} },
    ];
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ events }))),
    );

    render(<Timeline sessionId="abc" pollIntervalMs={60000} />);
    const card = await screen.findByTestId('thought-card');
    const body = card.querySelector('div');

    expect({
      initiallyOpen: card.hasAttribute('open'),
      bodyText: body?.textContent,
      bodyClasses: body?.className,
    }).toEqual({
      initiallyOpen: false,
      bodyText: thinking,
      bodyClasses: 'mt-2 whitespace-pre-wrap text-slate-600 italic',
    });
  });

  it('renders an assistant response as a left-aligned chat bubble with the full text', async () => {
    const fullText = 'Here is the full assistant response without truncation so the user can read everything';
    const events: SessionEvent[] = [
      { type: 'AssistantResponded', timestamp: 't1', sessionId: 'a', text: fullText, source: {} },
    ];
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ events }))),
    );

    render(<Timeline sessionId="abc" pollIntervalMs={60000} />);
    const bubble = await screen.findByTestId('response-bubble');

    expect({
      alignment: bubble.className,
      text: bubble.firstElementChild?.textContent,
    }).toEqual({
      alignment: 'flex justify-start',
      text: fullText,
    });
  });

  it('renders a prompt event as a right-aligned chat bubble with the full prompt text', async () => {
    const fullPrompt = 'Please summarize the session events for me in great detail with context';
    const events: SessionEvent[] = [
      { type: 'PromptSubmitted', timestamp: 't1', sessionId: 'a', prompt: fullPrompt, source: {} },
    ];
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ events }))),
    );

    render(<Timeline sessionId="abc" pollIntervalMs={60000} />);
    const bubble = await screen.findByTestId('prompt-bubble');

    expect({
      alignment: bubble.className,
      text: bubble.firstElementChild?.textContent,
    }).toEqual({
      alignment: 'flex justify-end',
      text: fullPrompt,
    });
  });

  it('polls for new events on the configured interval and renders newcomers', async () => {
    let callCount = 0;
    const firstEvents: SessionEvent[] = [
      {
        type: 'SessionStarted',
        timestamp: 't0',
        sessionId: 'a',
        cwd: '/w',
        gitBranch: 'main',
        version: '1',
        entrypoint: 'cli',
        source: {},
      },
    ];
    const secondEvents: SessionEvent[] = [
      ...firstEvents,
      {
        type: 'HookExecuted',
        timestamp: 't1',
        sessionId: 'a',
        hookEvent: 'Stop',
        hookName: 'tcr',
        command: 'sh',
        source: {},
      },
    ];
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        callCount += 1;
        return new Response(JSON.stringify({ events: callCount === 1 ? firstEvents : secondEvents }));
      }),
    );
    vi.useFakeTimers();

    render(<Timeline sessionId="abc" pollIntervalMs={50} />);
    await vi.advanceTimersByTimeAsync(100);
    const items = screen.getAllByRole('listitem');
    vi.useRealTimers();

    expect(items.map((li) => li.querySelector('[data-testid="event-label"]')?.textContent)).toEqual([
      'SessionStarted — t0 — /w @ main',
      'HookExecuted — t1 — Stop:tcr',
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

    expect(screen.queryAllByTestId('event-label').map((el) => el.textContent)).toEqual([]);
  });
});
