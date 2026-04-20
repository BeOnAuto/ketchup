import request from 'supertest';
import { describe, expect, it } from 'vitest';

import type { SessionEvent } from './translate-session.js';
import { createViewerApp } from './viewer-server.js';

const noopListSessions = async () => [];
const noopReadSessionEvents = async () => [];

describe('viewer server', () => {
  it('GET /api/sessions returns session summaries from the injected lister', async () => {
    const summaries = [
      {
        sessionId: 'xyz',
        eventCount: 3,
        firstTimestamp: '2026-04-20T11:00:00Z',
        lastTimestamp: '2026-04-20T11:05:00Z',
      },
      {
        sessionId: 'abc',
        eventCount: 2,
        firstTimestamp: '2026-04-20T10:00:00Z',
        lastTimestamp: '2026-04-20T10:01:00Z',
      },
    ];
    const app = createViewerApp({
      listSessions: async () => summaries,
      readSessionEvents: noopReadSessionEvents,
    });

    const response = await request(app).get('/api/sessions');

    expect({ status: response.status, body: response.body }).toEqual({
      status: 200,
      body: { sessions: summaries },
    });
  });

  it('GET /api/sessions/:id/events returns events from the injected reader for that id', async () => {
    const events: SessionEvent[] = [
      {
        type: 'SessionStarted',
        sessionId: 'abc',
        cwd: '/w',
        gitBranch: 'main',
        version: '1',
        entrypoint: 'cli',
        timestamp: '2026-04-20T10:00:00Z',
        source: { line: '{}', uuid: 'u1' },
      },
    ];
    let requestedId = '';
    const app = createViewerApp({
      listSessions: noopListSessions,
      readSessionEvents: async (id) => {
        requestedId = id;
        return events;
      },
    });

    const response = await request(app).get('/api/sessions/abc/events');

    expect({ requestedId, status: response.status, body: response.body }).toEqual({
      requestedId: 'abc',
      status: 200,
      body: { events },
    });
  });
});
