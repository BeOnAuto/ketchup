---
"claude-auto": minor
---

- Migrated to plugin-only mode with native Claude Code plugin support via the BeOnAuto/auto-plugins marketplace, removing the legacy npx CLI installation
- Added a new config skill with runtime overrides for validators and reminders, plus first-setup guidance on initial plugin use
- Added support for user-defined custom validators and reminders with documentation in the README
- Fixed commit validation to respect the validateCommit.mode off setting, and resolved plugin path handling when only CLAUDE_PLUGIN_ROOT is set
- Updated all documentation and install instructions for plugin-only mode
