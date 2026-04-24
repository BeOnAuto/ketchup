import { useEffect, useState } from 'react';

export interface SessionSummary {
  sessionId: string;
  eventCount: number;
  firstTimestamp: string;
  lastTimestamp: string;
  summary: string;
}

export function SessionPicker({ onSelect }: { onSelect: (session: SessionSummary) => void }) {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);

  useEffect(() => {
    fetch('/api/sessions')
      .then((response) => response.json())
      .then((body: { sessions: SessionSummary[] }) => setSessions(body.sessions));
  }, []);

  return (
    <ul className="space-y-2">
      {sessions.map((session) => (
        <li key={session.sessionId}>
          <button
            type="button"
            onClick={() => onSelect(session)}
            className="w-full rounded-md border border-ketchup-divider bg-ketchup-surface px-3 py-2 text-left text-sm transition hover:bg-ketchup-bg-soft"
          >
            <div data-testid="session-label" className="line-clamp-2 font-medium text-ketchup-text">
              {session.summary || `${session.sessionId.slice(0, 8)}…`}
            </div>
            <div data-testid="session-meta" className="mt-1 flex gap-2 text-xs text-ketchup-text-3">
              <span>{session.eventCount} events</span>
              <span>·</span>
              <span>{new Date(session.lastTimestamp).toLocaleString()}</span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
