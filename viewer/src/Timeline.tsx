import { useEffect, useState } from 'react';

export interface SessionEvent {
  type: string;
  timestamp: string;
  [key: string]: unknown;
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
          {event.type} — {event.timestamp}
        </li>
      ))}
    </ul>
  );
}
