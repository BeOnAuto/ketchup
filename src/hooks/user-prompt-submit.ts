import { activityLog } from '../activity-logger.js';
import { debugLog } from '../debug-logger.js';
import { type ResolvedPaths, resolvePaths } from '../path-resolver.js';
import { loadReminders, scanReminders } from '../reminder-loader.js';
import { isValidatorSession } from '../validator-session.js';

type HookResult = {
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit';
    additionalContext: string;
  };
};

export interface UserPromptSubmitDiagnostics {
  resolvedPaths: ResolvedPaths;
  reminderFiles: string[];
  matchedReminders: { name: string; priority: number }[];
}

export async function handleUserPromptSubmit(
  claudeDirOrPaths: string | ResolvedPaths,
  sessionId: string,
  prompt?: string,
): Promise<HookResult & { diagnostics: UserPromptSubmitDiagnostics }> {
  const paths = typeof claudeDirOrPaths === 'string' ? await resolvePaths(claudeDirOrPaths) : claudeDirOrPaths;
  const reminderFiles = paths.remindersDirs.flatMap((dir) => scanReminders(dir));

  if (isValidatorSession(prompt)) {
    activityLog(paths.autoDir, sessionId, 'user-prompt-submit', 'skipped reminders for validator session');
    debugLog(paths.autoDir, 'user-prompt-submit', 'skipped reminders for validator session');

    return {
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: '',
      },
      diagnostics: {
        resolvedPaths: paths,
        reminderFiles,
        matchedReminders: [],
      },
    };
  }

  const reminders = loadReminders(paths.remindersDirs, { hook: 'UserPromptSubmit' });

  const reminderContent = reminders.map((r) => r.content).join('\n\n');

  activityLog(
    paths.autoDir,
    sessionId,
    'user-prompt-submit',
    `injected ${reminders.length} reminder${reminders.length === 1 ? '' : 's'}`,
  );

  debugLog(
    paths.autoDir,
    'user-prompt-submit',
    `injected ${reminders.length} reminder${reminders.length === 1 ? '' : 's'}`,
  );

  const diagnostics: UserPromptSubmitDiagnostics = {
    resolvedPaths: paths,
    reminderFiles,
    matchedReminders: reminders.map((r) => ({ name: r.name, priority: r.priority })),
  };

  return {
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: reminderContent,
    },
    diagnostics,
  };
}
