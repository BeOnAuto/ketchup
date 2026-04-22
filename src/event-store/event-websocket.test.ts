import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';

import express from 'express';
import { describe, expect, it } from 'vitest';
import WebSocket from 'ws';

import { createEventWebSocket } from './event-websocket.js';
import type { SessionEvent } from './translate-session.js';

describe('createEventWebSocket', () => {
  it('sends the initial event snapshot for the requested session on connect', async () => {
    const app = express();
    const httpServer = createServer(app);
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
    createEventWebSocket(httpServer, {
      readSessionEvents: async (id) => {
        requestedId = id;
        return events;
      },
    });
    await new Promise<void>((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
    const { port } = httpServer.address() as AddressInfo;

    const ws = new WebSocket(`ws://127.0.0.1:${port}/ws/sessions/abc/events`);
    const message = await new Promise<string>((resolve) => {
      ws.once('message', (data) => resolve(data.toString()));
    });
    ws.close();
    await new Promise<void>((resolve) => httpServer.close(() => resolve()));

    expect({ requestedId, payload: JSON.parse(message) }).toEqual({
      requestedId: 'abc',
      payload: { events },
    });
  });
});
