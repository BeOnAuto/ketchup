# The Ketchup Technique

> The planning rhythm that feeds clean work into the guardrails.

The Ketchup Technique is the *methodology*. [Guardrail Engineering](/guardrail-engineering) is the *mechanism*. Ketchup is the tool that implements both.

You can use the Technique on any project without the tool. You can use the tool without the Technique. They compose best together, because the Technique structures work into atomic units the mechanism can evaluate one commit at a time.

---

## The vocabulary problem

The internet is polluted with PM vocabulary. Epics, sprints, stories, SAFe. LLM training data is saturated with these terms. When you tell an AI to plan work using established agile terminology, it hallucinates toward Jira tickets, estimation theater, and ceremony-heavy processes.

The Ketchup Technique uses fresh vocabulary on purpose:

- **Burst**: one test, one behavior, one commit. Atomic, independent, valuable.
- **Bottle**: a named group of related bursts, organized by capability, not sequence.
- **ketchup-plan.md**: the durable plan. TODO / DONE sections, committed before coding.

Same way the Pomodoro Technique used a tomato timer instead of "timeboxing" to escape existing baggage, these terms exist to stop pattern-matching against someone else's process.

---

## The rhythm

```
Red → Green → TCR → Refactor → TCR → Done
```

- **Red**: write one failing test. One behavior. Not a suite.
- **Green**: write the minimum code to make that test pass.
- **TCR**: `test && commit || revert`. Tests pass, the change is committed. Tests fail, the change is reverted.
- **Refactor**: improve what works without changing behavior. Tests still pass.
- **TCR again**: commit the refactor.
- **Done**: move the burst from TODO to DONE.

Never patch failing code. Revert and rethink.

---

## The `ketchup-plan.md` format

```markdown
# Ketchup Plan: User Authentication

## TODO

### Bottle: Authentication
- [ ] Burst 10: createUser returns user object [depends: none]
- [ ] Burst 11: hashPassword uses bcrypt [depends: none]
- [ ] Burst 12: validatePassword checks hash [depends: 11]
- [ ] Burst 13: generateToken creates JWT [depends: 10]
- [ ] Burst 14: login combines all [depends: 10, 12, 13]

## DONE

- [x] Burst 0: Project setup (abc123)
```

The plan is a real artifact in the repo. It's the first thing the `ketchup-plan-format` validator checks, and it's what [Auto-Continue](/guardrail-engineering#_5-auto-continue) reads to decide whether to keep working.

### Dependency notation

Every burst ends with `[depends: ...]`:

- `[depends: none]` — can start immediately, parallelizable with other `none` bursts
- `[depends: N]` — must wait for burst N to complete
- `[depends: N, M]` — must wait for both N and M

Bursts at the same dependency level can run in parallel worktrees.

---

## Burst atomicity

A burst is:

- **Independent** — can be reverted without unravelling anything else
- **Valuable** — delivers one observable behavior
- **Small** — reviewable in minutes
- **Testable** — covered by the test that drove it

One test, one behavior, one commit. This is enforced by the `burst-atomicity` validator at commit time. Multi-concern commits get NACK'd.

---

## RETHINK after a revert

A revert isn't punishment. It's information. But it's also a signal to change approach, not try harder at the same thing.

After a revert, ask:

1. **Was the burst too big?** → Split it smaller.
2. **Was the design flawed?** → Try a different approach.
3. **Was the test wrong?** → Clarify the requirement first.

Only then write the next failing test. Never patch.

---

## Testing rules

The validators enforce these. The Technique reminds you of them before you write the test:

- **Title = Spec**: the test body proves exactly what `it('should...')` claims. One assertion per behavior.
- **Assert whole objects**: `expect(result).toEqual({...})`, not cherry-picked properties.
- **No weak assertions**: never `toBeDefined`, `toBeTruthy`, `not.toBeNull`. Assert the exact shape.
- **Stubs over mocks**: deterministic stubs preferred. Mock only at boundaries.
- **Setup → Execute → Verify**: one cycle per test, no multiple execute/verify loops.
- **No state peeking**: test observable behavior, not internal state. If a change to internal data structures would break the test, the test is wrong.

---

## Coverage by construction

If code exists, a test demanded it. This isn't enforced through willpower. It's structural:

- Write test first (red)
- Write minimal code to pass (green)
- No code without a test

Uncovered code = code nobody asked for = delete on the next revert. 100% enforced via the `coverage-rules` validator.

Exclusions are narrow: barrel `index.ts` re-exports, `*.test.ts` files. That's it.

---

## Extreme ownership

Every problem is your problem. See a problem → fix it or add a burst to fix it. No third option.

| Situation | Wrong response | Ownership response |
|-----------|----------------|---------------------|
| Bug in existing code | "The existing code has a bug where..." | Fix it or add a burst to fix it |
| Test suite has gaps | "Coverage was incomplete before..." | Add the missing tests |
| Confusing function names | "The naming is unclear..." | Rename in refactor step |

---

## Infrastructure commits

Config files need no tests: `package.json`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`, `ketchup-plan.md`.

Format: `chore(scope): description`. Enforced by the `infra-commit-format` validator.

---

## The TCR command

```bash
pnpm test --run && git add -A && git commit -m "<MSG>" || git checkout -- .
```

Tests pass, everything commits. Tests fail, everything reverts. This is the operation Ketchup's `tcr-workflow` validator enforces at commit time.

---

## Git worktrees

Once a Bottle's bursts are running cleanly, open another worktree and work on an independent Bottle in parallel. Each worktree runs its own Ketchup instance. The guardrails enforce quality in each; the Technique keeps each focused.

```bash
git worktree add ../feature-auth feature/auth
git worktree add ../feature-payments feature/payments
```

This compounds only when the rhythm holds inside each worktree. Broken rhythm in one worktree is not solved by opening another.

---

## Relation to Guardrail Engineering

The Technique and the Engineering exist because AI does two things badly: it doesn't know what to *not* produce, and it forgets everything between prompts.

[Guardrail Engineering](/guardrail-engineering) handles the "doesn't know what to not produce" problem by encoding rules AI can't get past. The Ketchup Technique handles the "forgets everything" problem by giving work a durable shape (the plan) and an enforced rhythm (TCR on atomic bursts).

Together: the plan says *what*, the Technique says *how to break it down*, and the guardrails verify *that what got built matches what was specified*.

---

**[Get Started →](/getting-started)** or read the [Guardrail Engineering](/guardrail-engineering) mechanism page.
