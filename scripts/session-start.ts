#!/usr/bin/env npx tsx
import * as fs from 'node:fs';

import { activityLog } from '../src/activity-logger.js';
import { parseHookInput } from '../src/hook-input.js';
import { writeHookLog } from '../src/hook-logger.js';
import { handleSessionStart } from '../src/hooks/session-start.js';
import { migrateLegacyDataDir, migrateLegacyStateFile } from '../src/migrate.js';
import { resolvePathsFromEnv } from '../src/path-resolver.js';
import { logPluginDiagnostics } from '../src/plugin-debug.js';

const input = parseHookInput(fs.readFileSync(0, 'utf-8'));
const startTime = Date.now();

(async () => {
  migrateLegacyDataDir(process.cwd());
  migrateLegacyStateFile(process.cwd());
  const paths = await resolvePathsFromEnv();
  logPluginDiagnostics('SessionStart', paths);
  try {
    const { diagnostics, ...result } = await handleSessionStart(paths, input.session_id, input.agent_type);
    writeHookLog(paths.autoDir, {
      hookName: 'session-start',
      timestamp: new Date().toISOString(),
      input,
      resolvedPaths: diagnostics.resolvedPaths,
      reminderFiles: diagnostics.reminderFiles,
      matchedReminders: diagnostics.matchedReminders,
      output: result,
      durationMs: Date.now() - startTime,
    });
    console.log(JSON.stringify(result));
    process.exit(0);
  } catch (err) {
    activityLog(paths.autoDir, input.session_id, 'session-start', `error: ${String(err)}`);
    writeHookLog(paths.autoDir, {
      hookName: 'session-start',
      timestamp: new Date().toISOString(),
      input,
      output: null,
      error: String(err),
      durationMs: Date.now() - startTime,
    });
    console.error('session-start hook failed:', err);
    process.exit(1);
  }
})();
