import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createViewerApp } from './viewer-server.js';

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
    const app = createViewerApp({ listSessions: async () => summaries });

    const response = await request(app).get('/api/sessions');

    expect({ status: response.status, body: response.body }).toEqual({
      status: 200,
      body: { sessions: summaries },
    });
  });
});
