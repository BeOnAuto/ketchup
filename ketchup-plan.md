# Ketchup Plan: Allow user-defined validators

## TODO

- [ ] Burst 3: Fix configuration.md to show plugin-bundled validators and reminders live at $CLAUDE_PLUGIN_ROOT, not in .claude-auto/ [depends: none]

## DONE

- [x] Burst 1: resolvePathsFromEnv returns protectedValidatorsDirs field (5e9d98f)
- [x] Burst 2: handlePreToolUse uses protectedValidatorsDirs for immutability checks (4ac31ff)
