import type { Server } from 'node:http';

import { WebSocketServer } from 'ws';

import type { SessionEvent } from './translate-session.js';

export interface EventWebSocketDeps {
  readSessionEvents: (sessionId: string) => Promise<SessionEvent[]>;
}

const SESSION_PATH = /^\/ws\/sessions\/([^/]+)\/events$/;

export function createEventWebSocket(httpServer: Server, deps: EventWebSocketDeps): WebSocketServer {
  const wss = new WebSocketServer({ noServer: true });
  httpServer.on('upgrade', (request, socket, head) => {
    const match = request.url ? SESSION_PATH.exec(request.url) : null;
    if (!match) {
      socket.destroy();
      return;
    }
    const sessionId = match[1];
    wss.handleUpgrade(request, socket, head, async (ws) => {
      const events = await deps.readSessionEvents(sessionId);
      ws.send(JSON.stringify({ events }));
    });
  });
  return wss;
}
