---
"claude-auto": patch
---

- Removed the entire CLI system including install, doctor, repair, status, and TUI commands
- Claude Auto now requires plugin mode exclusively — install via `/plugin marketplace add BeOnAuto/claude-auto`
- Removed legacy dependencies (commander, cosmiconfig, yaml) reducing package size
