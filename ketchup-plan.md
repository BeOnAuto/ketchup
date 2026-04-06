# Ketchup Plan: Protect Validators from Modification

## TODO

- [ ] Burst 1: isProtectedPath returns true for files inside any validatorsDirs path [depends: none]
- [ ] Burst 2: isProtectedPath returns false for files outside validatorsDirs [depends: none]
- [ ] Burst 3: handlePreToolUse denies Edit/Write to validator files [depends: 1, 2]
- [ ] Burst 4: handlePreToolUse denies Bash commands that target validator files (rm, mv, cp, cat >) [depends: 3]
- [ ] Burst 5: handlePreToolUse still allows non-validator file operations [depends: 3]

## DONE
