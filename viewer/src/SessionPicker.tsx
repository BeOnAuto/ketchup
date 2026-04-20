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
    <ul>
      {sessions.map((session) => (
        <li key={session.sessionId}>
          <button type="button" onClick={() => onSelect(session.sessionId)}>
            {session.sessionId} — {session.eventCount} events ({session.lastTimestamp})
          </button>
        </li>
      ))}
    </ul>
  );
}
