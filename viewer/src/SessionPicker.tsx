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
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-sm shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <div data-testid="session-label" className="line-clamp-2 font-medium text-slate-800">
              {session.summary || `${session.sessionId.slice(0, 8)}…`}
            </div>
            <div data-testid="session-meta" className="mt-1 flex gap-2 text-xs text-slate-500">
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
