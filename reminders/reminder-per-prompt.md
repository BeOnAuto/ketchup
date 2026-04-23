---
when:
  hook: UserPromptSubmit
priority: 100
---

**MANDATORY WORKFLOW, every task, no exceptions:**

1. Create/update `ketchup-plan.md` (TODO/DONE sections), commit before coding
2. ONE failing test → MINIMAL passing code → TCR (`test && commit || revert`)
3. 100% test coverage, no escape hatches
4. One burst = one test = one behavior = one commit
5. No comments, no dead code, no `any`, no `@ts-ignore`
6. Conventional commits: `type(scope): subject`

If tests fail: REVERT and RETHINK. Never patch failing code.
