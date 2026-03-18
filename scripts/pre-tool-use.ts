#!/usr/bin/env npx tsx
import * as fs from 'node:fs';

import { activityLog } from '../src/activity-logger.js';
import { isCommitCommand } from '../src/commit-validator.js';
import { parseHookInput } from '../src/hook-input.js';
import { writeHookLog } from '../src/hook-logger.js';
import { handlePreToolUse } from '../src/hooks/pre-tool-use.js';
import { resolvePathsFromEnv } from '../src/path-resolver.js';
import { logPluginDiagnostics } from '../src/plugin-debug.js';

const input = parseHookInput(fs.readFileSync(0, 'utf-8'));
const startTime = Date.now();

(async () => {
  const paths = await resolvePathsFromEnv();
  logPluginDiagnostics('PreToolUse', paths);
  try {
    const toolInput = input.tool_input || {};
    const command = toolInput.command as string | undefined;
    const result = await handlePreToolUse(paths, input.session_id, toolInput, { cwd: input.cwd });
    if (command && isCommitCommand(command)) {
      writeHookLog(paths.autoDir, {
        hookName: 'pre-tool-use',
        timestamp: new Date().toISOString(),
        input,
        output: result,
        durationMs: Date.now() - startTime,
      });
    }
    console.log(JSON.stringify(result));
    process.exit(0);
  } catch (err) {
    activityLog(paths.autoDir, input.session_id, 'pre-tool-use', `error: ${String(err)}`);
    writeHookLog(paths.autoDir, {
      hookName: 'pre-tool-use',
      timestamp: new Date().toISOString(),
      input,
      output: null,
      error: String(err),
      durationMs: Date.now() - startTime,
    });
    console.error('pre-tool-use hook failed:', err);
    process.exit(1);
  }
})();
