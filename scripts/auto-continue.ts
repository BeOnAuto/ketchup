#!/usr/bin/env npx tsx
import * as fs from 'node:fs';

import { activityLog } from '../src/activity-logger.js';
import { writeHookLog } from '../src/hook-logger.js';
import { handleStop, type StopHookInput } from '../src/hooks/auto-continue.js';
import { resolvePathsFromEnv } from '../src/path-resolver.js';
import { logPluginDiagnostics } from '../src/plugin-debug.js';

const stdin = fs.readFileSync(0, 'utf8').trim();

if (!stdin) {
  process.exit(0);
}

const input: StopHookInput = JSON.parse(stdin);
const startTime = Date.now();

(async () => {
  const paths = await resolvePathsFromEnv();
  logPluginDiagnostics('Stop', paths);
  try {
    const result = handleStop(paths.autoDir, input);

    const output = result.decision === 'block' ? { decision: 'block', reason: result.reason } : null;

    writeHookLog(paths.autoDir, {
      hookName: 'auto-continue',
      timestamp: new Date().toISOString(),
      input,
      output: output ?? { decision: result.decision, reason: result.reason },
      durationMs: Date.now() - startTime,
    });

    if (output) {
      console.log(JSON.stringify(output));
    }

    process.exit(0);
  } catch (err) {
    activityLog(paths.autoDir, input.session_id ?? 'unknown', 'auto-continue', `error: ${String(err)}`);
    writeHookLog(paths.autoDir, {
      hookName: 'auto-continue',
      timestamp: new Date().toISOString(),
      input,
      output: null,
      error: String(err),
      durationMs: Date.now() - startTime,
    });
    console.error('auto-continue hook failed:', err);
    process.exit(1);
  }
})();
