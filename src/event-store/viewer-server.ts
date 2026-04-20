import express, { type Express } from 'express';

import type { SessionSummary } from './list-sessions.js';

export interface ViewerDeps {
  listSessions: () => Promise<SessionSummary[]>;
}

export function createViewerApp(deps: ViewerDeps): Express {
  const app = express();
  app.get('/api/sessions', async (_req, res) => {
    const sessions = await deps.listSessions();
    res.json({ sessions });
  });
  return app;
}
