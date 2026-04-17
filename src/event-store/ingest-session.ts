import type { SQLiteEventStore } from '@event-driven-io/emmett-sqlite';

import { translateSession } from './translate-session.js';

export async function ingestSession(jsonlPath: string, store: SQLiteEventStore): Promise<void> {
  const events = await translateSession(jsonlPath);
  if (events.length === 0) return;
  const streamName = `session-${events[0].sessionId}`;
  const emmettEvents: Array<{ type: string; data: Record<string, unknown> }> = events.map((event) => ({
    type: event.type,
    data: JSON.parse(JSON.stringify(event)),
  }));
  await store.appendToStream(streamName, emmettEvents);
}
