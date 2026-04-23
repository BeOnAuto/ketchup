---
"claude-auto": patch
---

- Renamed internal initialization function from initClaudeAuto to initKetchup for consistency with the Ketchup rebrand
- Updated init hint to point at the new /auto-ketchup:config slash command
- Replaced hard-coded '.claude-auto' path strings with centralized BRAND constants
