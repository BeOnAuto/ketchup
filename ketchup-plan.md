# Ketchup Plan: Make claude-auto opt-in per repository

## TODO

- [ ] Burst 1.1: `createHookState` does not create autoDir
- [ ] Burst 1.2: `read()` returns defaults when autoDir missing
- [ ] Burst 1.3: `write()` is no-op when autoDir missing
- [ ] Burst 1.4: `update()` returns defaults when autoDir missing
- [ ] Burst 1.5: Remove `firstSetupRequired` from initial state creation
- [ ] Burst 2.1: `activityLog` no-op when autoDir missing
- [ ] Burst 2.2: `debugLog` no-op when autoDir missing
- [ ] Burst 2.3: `writeHookLog` no-op when autoDir missing
- [ ] Burst 2.4: `logPluginDiagnostics` no file write when autoDir missing
- [ ] Burst 3.1: `INIT_HINT_MESSAGE` constant
- [ ] Burst 3.2: `handleSessionStart` returns only hint when autoDir missing
- [ ] Burst 3.3: `handlePreToolUse` allows everything when autoDir missing
- [ ] Burst 3.4: `handleUserPromptSubmit` returns empty when autoDir missing
- [ ] Burst 3.5: `handleStop` returns stop when autoDir missing
- [ ] Burst 4.1: Remove `firstSetupRequired` block from user-prompt-submit
- [ ] Burst 4.2: Remove `FIRST_SETUP_MESSAGE`
- [ ] Burst 5.1: `initClaudeAuto` creates `.claude-auto/` with default state
- [ ] Burst 5.2: Returns `created: false` when already initialized
- [ ] Burst 5.3: Detects `.gitignore` status for `.claude-auto`
- [ ] Burst 5.4: Script entry point + SKILL.md

## DONE
