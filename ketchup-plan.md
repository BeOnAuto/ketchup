# Ketchup Plan: Remove Legacy NPX Installation

## TODO

- [ ] Burst 1: Delete src/cli/ directory (all 26 files) [depends: none]
- [ ] Burst 2: Delete bin/cli.ts [depends: none]
- [ ] Burst 3: Delete templates/ directory (settings.json, settings.local.json) [depends: none]
- [ ] Burst 4: Delete src/settings-merger.ts and src/settings-merger.test.ts [depends: none]
- [ ] Burst 5: Delete src/settings-template.test.ts [depends: 3]
- [ ] Burst 6: Delete src/e2e.test.ts [depends: 1]
- [ ] Burst 7: Delete src/linker.ts and src/linker.test.ts (symlink utils, legacy only) [depends: none]
- [ ] Burst 8: Delete src/gitignore-manager.ts and src/gitignore-manager.test.ts (legacy only) [depends: none]
- [ ] Burst 9: Delete src/state-manager.ts and src/state-manager.test.ts (legacy only) [depends: none]
- [ ] Burst 10: Delete src/root-finder.ts and src/root-finder.test.ts (legacy only) [depends: none]
- [ ] Burst 11: Remove legacy fallback from src/path-resolver.ts, update tests [depends: none]
- [ ] Burst 12: Clean up src/index.ts barrel exports (remove deleted modules) [depends: 1,4,7,8,9,10]
- [ ] Burst 13: Remove commander dependency, bin entry, legacy scripts from package.json [depends: 1,2,3]
- [ ] Burst 14: Rewrite README.md (remove all legacy CLI references) [depends: all]

## DONE
