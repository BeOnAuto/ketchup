import { type ReactNode, useEffect, useState } from 'react';

import { buildEventTree, type TreeNode } from './event-tree';

type Base = { timestamp: string; sessionId: string; source: unknown };

export type SessionEvent =
  | (Base & { type: 'SessionStarted'; cwd: string; gitBranch: string; version: string; entrypoint: string })
  | (Base & { type: 'PromptSubmitted'; prompt: string })
  | (Base & { type: 'AssistantResponded'; text: string })
  | (Base & { type: 'ThoughtRecorded'; thinking: string; signature: string })
  | (Base & { type: 'ToolInvoked'; toolName: string; toolUseId: string; input: Record<string, unknown> })
  | (Base & { type: 'ToolInvocationSucceeded'; toolUseId: string; content: string })
  | (Base & { type: 'ToolInvocationFailed'; toolUseId: string; error: string })
  | (Base & { type: 'HookExecuted'; hookEvent: string; hookName: string; command: string })
  | (Base & { type: 'SubagentProgressed'; parentToolUseId: string })
  | (Base & { type: 'FileModified'; filePath: string; operation: 'create' | 'update' })
  | (Base & { type: 'SessionEnded' });

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function formatToolInput(input: Record<string, unknown>): string {
  return Object.entries(input)
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join(' ');
}

function summarize(event: SessionEvent): string {
  switch (event.type) {
    case 'SessionStarted':
      return `${event.cwd} @ ${event.gitBranch}`;
    case 'PromptSubmitted':
      return truncate(event.prompt, 80);
    case 'AssistantResponded':
      return truncate(event.text, 80);
    case 'ThoughtRecorded':
      return truncate(event.thinking, 80);
    case 'ToolInvoked':
      return event.toolName;
    case 'ToolInvocationSucceeded':
      return `✓ ${truncate(event.content, 40)}`;
    case 'ToolInvocationFailed':
      return `✗ ${truncate(event.error, 40)}`;
    case 'HookExecuted':
      return `${event.hookEvent}:${event.hookName}`;
    case 'SubagentProgressed':
      return `parent=${event.parentToolUseId}`;
    case 'FileModified':
      return `${event.operation} ${event.filePath}`;
    case 'SessionEnded':
      return '';
  }
}

function EventBody({ event, toggle }: { event: SessionEvent; toggle?: ReactNode }) {
  if (event.type === 'PromptSubmitted') {
    return (
      <div data-testid="prompt-bubble" className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-lg bg-blue-500 px-4 py-2 text-white">
          {event.prompt}
        </div>
      </div>
    );
  }
  if (event.type === 'AssistantResponded') {
    return (
      <div data-testid="response-bubble" className="flex justify-start">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-lg bg-slate-100 px-4 py-2 text-slate-900">
          {event.text}
        </div>
      </div>
    );
  }
  if (event.type === 'ThoughtRecorded') {
    return (
      <details data-testid="thought-card" className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
        <summary className="cursor-pointer text-slate-500">💭 Thought</summary>
        <div className="mt-2 whitespace-pre-wrap text-slate-600 italic">{event.thinking}</div>
      </details>
    );
  }
  if (event.type === 'ToolInvoked') {
    return (
      <div data-testid="tool-card" className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <div className="flex min-w-0 items-center gap-2">
          {toggle}
          <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-700">
            {event.toolName}
          </span>
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-500">
            {formatToolInput(event.input)}
          </span>
        </div>
      </div>
    );
  }
  if (event.type === 'HookExecuted') {
    return (
      <div data-testid="hook-row" className="flex items-center gap-2 text-xs text-slate-500">
        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-700">hook</span>
        <span>
          {event.hookEvent}:{event.hookName}
        </span>
      </div>
    );
  }
  if (event.type === 'FileModified') {
    return (
      <div data-testid="file-row" className="flex items-center gap-2 text-xs text-slate-500">
        <span className="rounded bg-purple-100 px-1.5 py-0.5 text-purple-700">file</span>
        <span>
          {event.operation} {event.filePath}
        </span>
      </div>
    );
  }
  if (event.type === 'SessionStarted') {
    return (
      <div data-testid="session-divider" className="my-2 border-t border-slate-200 pt-2 text-xs text-slate-500">
        Session started — {event.cwd} @ {event.gitBranch}
      </div>
    );
  }
  if (event.type === 'SessionEnded') {
    return (
      <div data-testid="session-divider" className="my-2 border-t border-slate-200 pt-2 text-xs text-slate-500">
        Session ended
      </div>
    );
  }
  return (
    <span data-testid="event-label">
      <strong>{event.type}</strong> — {event.timestamp} — {summarize(event)}
    </span>
  );
}

function EventNode({ node, depth }: { node: TreeNode; depth: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children.length > 0;
  const toggle = hasChildren ? (
    <button
      type="button"
      onClick={() => setExpanded((value) => !value)}
      aria-label={expanded ? 'collapse' : 'expand'}
      className="text-slate-400 hover:text-slate-700"
    >
      {expanded ? '▾' : '▸'}
    </button>
  ) : null;
  return (
    <li data-level={depth} className="list-none">
      <EventBody event={node.event} toggle={toggle} />
      {hasChildren && expanded && (
        <ul className="ml-4 mt-2 space-y-2 border-l border-slate-200 pl-4">
          {node.children.map((child, index) => (
            <EventNode key={`${child.event.type}-${index}-${child.event.timestamp}`} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function Timeline({ sessionId, pollIntervalMs = 2000 }: { sessionId: string; pollIntervalMs?: number }) {
  const [events, setEvents] = useState<SessionEvent[]>([]);

  useEffect(() => {
    const fetchEvents = () => {
      fetch(`/api/sessions/${sessionId}/events`)
        .then((response) => response.json())
        .then((body: { events: SessionEvent[] }) => setEvents(body.events));
    };
    fetchEvents();
    const interval = setInterval(fetchEvents, pollIntervalMs);
    return () => clearInterval(interval);
  }, [sessionId, pollIntervalMs]);

  const tree = buildEventTree(events);

  return (
    <ul className="space-y-3">
      {tree.map((node, index) => (
        <EventNode key={`${node.event.type}-${index}-${node.event.timestamp}`} node={node} depth={1} />
      ))}
    </ul>
  );
}
