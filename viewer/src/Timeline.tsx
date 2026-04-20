import { useEffect, useState } from 'react';

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

export function Timeline({ sessionId }: { sessionId: string }) {
  const [events, setEvents] = useState<SessionEvent[]>([]);

  useEffect(() => {
    fetch(`/api/sessions/${sessionId}/events`)
      .then((response) => response.json())
      .then((body: { events: SessionEvent[] }) => setEvents(body.events));
  }, [sessionId]);

  return (
    <ul>
      {events.map((event, index) => (
        <li key={`${event.type}-${index}-${event.timestamp}`}>
          <strong>{event.type}</strong> — {event.timestamp} — {summarize(event)}
        </li>
      ))}
    </ul>
  );
}
