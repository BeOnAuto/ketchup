import * as fs from 'node:fs';

import { activityLog } from '../activity-logger.js';
import { BRAND } from '../brand.js';
import {
  type Executor,
  getCommitContext,
  isCommitCommand,
  type ValidatorLogger,
  validateCommit,
} from '../commit-validator.js';
import { debugLog } from '../debug-logger.js';
import { isDenied, loadDenyPatterns } from '../deny-list.js';
import { createHookState } from '../hook-state.js';
import type { ResolvedPaths } from '../path-resolver.js';
import { loadReminders } from '../reminder-loader.js';
import { loadValidators } from '../validator-loader.js';

export function isProtectedPath(filePath: string, validatorsDirs: string[]): boolean {
  return validatorsDirs.some((dir) => filePath.startsWith(`${dir}/`));
}

export function commandTargetsProtectedPath(command: string, validatorsDirs: string[]): string | undefined {
  for (const dir of validatorsDirs) {
    if (command.includes(`${dir}/`)) {
      const idx = command.indexOf(`${dir}/`);
      const rest = command.slice(idx);
      const match = rest.match(/^(\S+)/);
      if (match) return match[1];
    }
  }
  return undefined;
}

type ToolInput = Record<string, unknown>;

type HookResult = {
  hookSpecificOutput: {
    hookEventName: 'PreToolUse';
    permissionDecision: 'deny' | 'allow';
    permissionDecisionReason?: string;
    additionalContext?: string;
  };
};

interface PreToolUseOptions {
  executor?: Executor;
  toolName?: string;
  cwd?: string;
}

export async function handlePreToolUse(
  paths: ResolvedPaths,
  sessionId: string,
  toolInput: ToolInput,
  options: PreToolUseOptions = {},
): Promise<HookResult> {
  if (!fs.existsSync(paths.autoDir)) {
    return {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'allow',
      },
    };
  }

  const command = toolInput.command as string | undefined;

  if (command && isCommitCommand(command)) {
    const gitCwd = options.cwd ?? process.cwd();
    return handleCommitValidation(paths, sessionId, command, options, gitCwd);
  }

  if (command) {
    const targetedPath = commandTargetsProtectedPath(command, paths.protectedValidatorsDirs);
    if (targetedPath) {
      activityLog(paths.autoDir, sessionId, 'pre-tool-use', `blocked protected: ${targetedPath}`);
      debugLog(paths.autoDir, 'pre-tool-use', `${targetedPath} blocked (immutable validator)`);
      return {
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'deny',
          permissionDecisionReason: `Validator files are immutable: ${targetedPath}`,
        },
      };
    }
  }

  const filePath = toolInput.file_path as string;

  if (filePath && isProtectedPath(filePath, paths.protectedValidatorsDirs)) {
    activityLog(paths.autoDir, sessionId, 'pre-tool-use', `blocked protected: ${filePath}`);
    debugLog(paths.autoDir, 'pre-tool-use', `${filePath} blocked (immutable validator)`);
    return {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: `Validator files are immutable: ${filePath}`,
      },
    };
  }

  const patterns = loadDenyPatterns(paths.autoDir);

  if (filePath && isDenied(filePath, patterns)) {
    activityLog(paths.autoDir, sessionId, 'pre-tool-use', `blocked: ${filePath}`);
    debugLog(paths.autoDir, 'pre-tool-use', `${filePath} blocked by deny-list`);
    return {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: `Path ${filePath} is denied by ${BRAND.packageName} deny-list`,
      },
    };
  }

  const state = createHookState(paths.autoDir).read();
  const reminders = loadReminders(
    paths.remindersDirs,
    {
      hook: 'PreToolUse',
      toolName: options.toolName,
    },
    state.overrides.reminders,
  );

  const reminderContent = reminders.map((r) => r.content).join('\n\n');

  if (reminderContent) {
    return {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'allow',
        additionalContext: reminderContent,
      },
    };
  }

  return {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'allow',
    },
  };
}

async function handleCommitValidation(
  paths: ResolvedPaths,
  sessionId: string,
  command: string,
  options: PreToolUseOptions,
  gitCwd: string,
): Promise<HookResult> {
  const state = createHookState(paths.autoDir).read();

  if (state.validateCommit.mode === 'off') {
    activityLog(paths.autoDir, sessionId, 'pre-tool-use', 'commit allowed (validation off)');
    return {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'allow',
      },
    };
  }

  const allValidators = loadValidators(paths.validatorsDirs, state.overrides.validators);
  const validators = allValidators.filter((v) => v.name !== 'appeal-system');

  if (validators.length === 0) {
    activityLog(paths.autoDir, sessionId, 'pre-tool-use', 'commit allowed (no validators)');
    return {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'allow',
      },
    };
  }

  const context = getCommitContext(gitCwd, command);
  const onLog: ValidatorLogger = (event, name, detail) => {
    activityLog(paths.autoDir, sessionId, 'pre-tool-use', `validator ${event}: ${name} → ${detail}`);
  };
  const results = await validateCommit(validators, context, options.executor, onLog, state.validateCommit.batchCount);

  const nacks = results.filter((r) => r.decision === 'NACK');

  if (nacks.length > 0) {
    const reasons = nacks.map((n) => `${n.validator}: ${n.reason}`).join('\n');
    activityLog(paths.autoDir, sessionId, 'pre-tool-use', `commit blocked: ${reasons}`);
    debugLog(paths.autoDir, 'pre-tool-use', `commit blocked: ${reasons}`);
    return {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: reasons,
      },
    };
  }

  activityLog(paths.autoDir, sessionId, 'pre-tool-use', 'commit allowed');
  debugLog(paths.autoDir, 'pre-tool-use', 'commit allowed');
  return {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'allow',
    },
  };
}
