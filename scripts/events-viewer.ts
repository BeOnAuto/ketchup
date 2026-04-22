#!/usr/bin/env npx tsx

import { resolve } from 'node:path';

import { sqliteConnection } from '@event-driven-io/emmett-sqlite';

import { ingestProject } from '../src/event-store/ingest-project.js';
import { listSessions } from '../src/event-store/list-sessions.js';
import { readSessionEvents } from '../src/event-store/read-session-events.js';
import { startViewerServer } from '../src/event-store/start-viewer-server.js';
import { createEventStore } from '../src/event-store/store.js';
import { createViewerApp } from '../src/event-store/viewer-server.js';

async function main(): Promise<void> {
  const dbPath = resolve(process.argv[2] ?? './events.db');
  const port = Number(process.argv[3] ?? 4321);
  const projectDir = process.argv[4] ? resolve(process.argv[4]) : null;
  const reingestSeconds = Number(process.argv[5] ?? 5);

  const store = await createEventStore(dbPath);
  const connection = sqliteConnection({ fileName: dbPath });

  if (projectDir) {
    console.log(`Re-ingesting ${projectDir} every ${reingestSeconds}s`);
    await ingestProject(projectDir, store);
    setInterval(() => {
      ingestProject(projectDir, store).catch((error) => console.error('re-ingest failed:', error));
    }, reingestSeconds * 1000);
  }

  const app = createViewerApp({
    listSessions: () => listSessions(connection),
    readSessionEvents: (id) => readSessionEvents(store, id),
  });
  const server = await startViewerServer(app, port);
  const address = server.address();
  const actualPort = typeof address === 'object' && address !== null ? address.port : port;
  console.log(`Viewer API at http://127.0.0.1:${actualPort}`);
  console.log(`DB: ${dbPath}`);
  console.log(`Run \`cd viewer && pnpm dev\` to open the UI.`);
}

main();
