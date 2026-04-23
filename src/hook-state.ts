import * as fs from 'node:fs';
import * as path from 'node:path';

import { BRAND } from './brand.js';

export type ContinueMode = 'smart' | 'non-stop' | 'off';
export type CommitMode = 'strict' | 'warn' | 'off';

export interface AutoContinueState {
  mode: ContinueMode;
  maxIterations?: number;
  skipModes: string[];
}

export interface ValidateCommitState {
  mode: CommitMode;
  batchCount?: number;
}

export interface DenyListState {
  enabled: boolean;
  extraPatterns?: string[];
}

export interface PromptReminderState {
  enabled: boolean;
  customReminder?: string;
}

export interface SubagentHooksState {
  validateCommitOnExplore: boolean;
  validateCommitOnWork: boolean;
  validateCommitOnUnknown: boolean;
}

export interface ValidatorOverride {
  enabled: boolean;
}

export interface ReminderOverride {
  enabled?: boolean;
  priority?: number;
}

export interface OverridesState {
  validators: Record<string, ValidatorOverride>;
  reminders: Record<string, ReminderOverride>;
}

export interface HookState {
  autoContinue: AutoContinueState;
  validateCommit: ValidateCommitState;
  denyList: DenyListState;
  promptReminder: PromptReminderState;
  subagentHooks: SubagentHooksState;
  overrides: OverridesState;
}

export const DEFAULT_HOOK_STATE: HookState = {
  autoContinue: {
    mode: 'smart',
    maxIterations: 0,
    skipModes: ['plan'],
  },
  validateCommit: {
    mode: 'strict',
    batchCount: 3,
  },
  denyList: {
    enabled: true,
    extraPatterns: [],
  },
  promptReminder: {
    enabled: true,
  },
  subagentHooks: {
    validateCommitOnExplore: false,
    validateCommitOnWork: true,
    validateCommitOnUnknown: true,
  },
  overrides: {
    validators: {},
    reminders: {},
  },
};

export interface HookStateManager {
  exists: () => boolean;
  read: () => HookState;
  write: (state: HookState) => void;
  update: (updates: Partial<HookState>) => HookState;
}

export function createHookState(autoDir: string): HookStateManager {
  const stateFile = path.join(autoDir, BRAND.stateFile);

  function read(): HookState {
    if (!fs.existsSync(autoDir)) {
      return { ...DEFAULT_HOOK_STATE };
    }

    if (!fs.existsSync(stateFile)) {
      const initialState = { ...DEFAULT_HOOK_STATE };
      fs.writeFileSync(stateFile, `${JSON.stringify(initialState, null, 2)}\n`);
      return JSON.parse(JSON.stringify(initialState)) as HookState;
    }

    const content = fs.readFileSync(stateFile, 'utf-8');
    const partial = JSON.parse(content) as Partial<HookState>;

    return {
      autoContinue: { ...DEFAULT_HOOK_STATE.autoContinue, ...partial.autoContinue },
      validateCommit: { ...DEFAULT_HOOK_STATE.validateCommit, ...partial.validateCommit },
      denyList: { ...DEFAULT_HOOK_STATE.denyList, ...partial.denyList },
      promptReminder: { ...DEFAULT_HOOK_STATE.promptReminder, ...partial.promptReminder },
      subagentHooks: { ...DEFAULT_HOOK_STATE.subagentHooks, ...partial.subagentHooks },
      overrides: {
        validators: { ...DEFAULT_HOOK_STATE.overrides.validators, ...partial.overrides?.validators },
        reminders: { ...DEFAULT_HOOK_STATE.overrides.reminders, ...partial.overrides?.reminders },
      },
    };
  }

  function write(state: HookState): void {
    if (!fs.existsSync(autoDir)) {
      return;
    }
    fs.writeFileSync(stateFile, `${JSON.stringify(state, null, 2)}\n`);
  }

  function update(updates: Partial<HookState>): HookState {
    if (!fs.existsSync(autoDir)) {
      return { ...DEFAULT_HOOK_STATE };
    }
    const current = read();
    const newState: HookState = {
      ...current,
      ...updates,
      autoContinue: { ...current.autoContinue, ...updates.autoContinue },
      validateCommit: { ...current.validateCommit, ...updates.validateCommit },
      denyList: { ...current.denyList, ...updates.denyList },
      promptReminder: { ...current.promptReminder, ...updates.promptReminder },
      subagentHooks: { ...current.subagentHooks, ...updates.subagentHooks },
      overrides: {
        validators: { ...current.overrides.validators, ...updates.overrides?.validators },
        reminders: { ...current.overrides.reminders, ...updates.overrides?.reminders },
      },
    };
    write(newState);
    return newState;
  }

  function exists(): boolean {
    return fs.existsSync(stateFile);
  }

  return {
    exists,
    read,
    write,
    update,
  };
}
