# Ketchup Plan: Make claude-auto opt-in per repository

## TODO

- [ ] Burst 6.2: `INIT_HINT_MESSAGE` uses emojis for visibility

## DONE

- [x] Burst 6.1: `formatInitResult` uses emojis and does not instruct Claude to ask the user

- [x] Burst 1.1: `createHookState` does not create autoDir (6fe15c2)
- [x] Burst 1.2: `read()` returns defaults when autoDir missing (7ee52cd)
- [x] Burst 1.3: `write()` is no-op when autoDir missing (c70de21)
- [x] Burst 1.4: `update()` returns defaults when autoDir missing (c70de21)
- [x] Burst 1.5: Remove `firstSetupRequired` from initial state creation (7ee52cd)
- [x] Burst 2.1: `activityLog` no-op when autoDir missing (e33d77f)
- [x] Burst 2.2: `debugLog` no-op when autoDir missing (e33d77f)
- [x] Burst 2.3: `writeHookLog` no-op when autoDir missing (e33d77f)
- [x] Burst 2.4: `logPluginDiagnostics` no file write when autoDir missing (e33d77f)
- [x] Burst 3.1: `INIT_HINT_MESSAGE` constant (86fac7f)
- [x] Burst 3.2: `handleSessionStart` returns only hint when autoDir missing (86fac7f)
- [x] Burst 3.3: `handlePreToolUse` allows everything when autoDir missing (62efee8)
- [x] Burst 3.4: `handleUserPromptSubmit` returns empty when autoDir missing (86fac7f)
- [x] Burst 3.5: `handleStop` returns stop when autoDir missing (62efee8)
- [x] Burst 4.1: Remove `firstSetupRequired` block from user-prompt-submit (86fac7f)
- [x] Burst 4.2: Remove `FIRST_SETUP_MESSAGE` (86fac7f)
- [x] Burst 5.1: `initClaudeAuto` creates `.claude-auto/` with default state (43244eb)
- [x] Burst 5.2: Returns `created: false` when already initialized (43244eb)
- [x] Burst 5.3: Detects `.gitignore` status for `.claude-auto` (43244eb)
- [x] Burst 5.4: Script entry point + SKILL.md (7526a57)
