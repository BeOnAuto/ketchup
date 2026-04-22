import { useEffect, useState } from 'react';

export interface SessionSummary {
  sessionId: string;
  eventCount: number;
  firstTimestamp: string;
  lastTimestamp: string;
}

export function SessionPicker({ onSelect }: { onSelect: (sessionId: string) => void }) {
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
            onClick={() => onSelect(session.sessionId)}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-sm shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <div data-testid="session-id" className="font-mono text-xs text-slate-500">
              {session.sessionId.slice(0, 8)}…
            </div>
            <div data-testid="session-count" className="mt-1 text-slate-800">
              {session.eventCount} events
            </div>
            <div data-testid="session-time" className="text-xs text-slate-400">
              {session.lastTimestamp}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
