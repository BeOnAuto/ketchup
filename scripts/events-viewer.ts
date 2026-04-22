#!/usr/bin/env npx tsx

import { resolve } from 'node:path';

import { sqliteConnection } from '@event-driven-io/emmett-sqlite';

import { deriveProjectDir } from '../src/event-store/derive-project-dir.js';
import { ingestProject } from '../src/event-store/ingest-project.js';
import { listSessions } from '../src/event-store/list-sessions.js';
import { readSessionEvents } from '../src/event-store/read-session-events.js';
import { resolveViewerStaticDir } from '../src/event-store/resolve-viewer-static-dir.js';
import { startViewerServer } from '../src/event-store/start-viewer-server.js';
import { createEventStore } from '../src/event-store/store.js';
import { createViewerApp } from '../src/event-store/viewer-server.js';

async function main(): Promise<void> {
  const dbPath = resolve(process.argv[2] ?? './events.db');
  const port = Number(process.argv[3] ?? 4321);
  const projectDir = process.argv[4] ? resolve(process.argv[4]) : deriveProjectDir(process.cwd());
  const reingestSeconds = Number(process.argv[5] ?? 5);

  const store = await createEventStore(dbPath);
  const connection = sqliteConnection({ fileName: dbPath });

  console.log(`Re-ingesting ${projectDir} every ${reingestSeconds}s`);
  const safeIngest = () =>
    ingestProject(projectDir, store).catch((error) => console.error('ingest skipped:', error.message));
  await safeIngest();
  setInterval(safeIngest, reingestSeconds * 1000);

  const staticDir = resolveViewerStaticDir({
    pluginRoot: process.env.CLAUDE_PLUGIN_ROOT,
    scriptDir: __dirname,
  });
  const app = createViewerApp({
    listSessions: () => listSessions(connection),
    readSessionEvents: (id) => readSessionEvents(store, id),
    staticDir,
  });
  const server = await startViewerServer(app, port);
  const address = server.address();
  const actualPort = typeof address === 'object' && address !== null ? address.port : port;
  console.log(`Viewer at http://127.0.0.1:${actualPort}`);
  console.log(`DB: ${dbPath}`);
}

main();
