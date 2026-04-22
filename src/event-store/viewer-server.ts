import express, { type Express } from 'express';

import type { SessionSummary } from './list-sessions.js';
import type { SessionEvent } from './translate-session.js';

export interface ViewerDeps {
  listSessions: () => Promise<SessionSummary[]>;
  readSessionEvents: (sessionId: string) => Promise<SessionEvent[]>;
  staticDir?: string;
}

export function createViewerApp(deps: ViewerDeps): Express {
  const app = express();

  app.get('/api/sessions', async (_req, res) => {
    const sessions = await deps.listSessions();
    res.json({ sessions });
  });

  app.get('/api/sessions/:id/events', async (req, res) => {
    const events = await deps.readSessionEvents(req.params.id);
    res.json({ events });
  });

  if (deps.staticDir) {
    app.use(express.static(deps.staticDir));
  }

  return app;
}
