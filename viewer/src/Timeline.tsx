import { useEffect, useState } from 'react';

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

function EventBody({ event }: { event: SessionEvent }) {
  if (event.type === 'PromptSubmitted') {
    return (
      <div data-testid="prompt-bubble" className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-lg bg-blue-500 px-4 py-2 text-white">
          {event.prompt}
        </div>
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
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  return (
    <li data-level={depth}>
      {hasChildren && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-label={expanded ? 'collapse' : 'expand'}
        >
          {expanded ? '▾' : '▸'}
        </button>
      )}
      <EventBody event={node.event} />
      {hasChildren && expanded && (
        <ul>
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
    <ul>
      {tree.map((node, index) => (
        <EventNode key={`${node.event.type}-${index}-${node.event.timestamp}`} node={node} depth={1} />
      ))}
    </ul>
  );
}
