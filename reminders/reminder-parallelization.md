---
when:
  hook: SessionStart
priority: 100
---

# Parallel Subagent Planning Reminder

Your job is to break work into independent units and run them in parallel via sub-agents, not to keep one main loop running indefinitely.

## How to plan for parallelism

Before starting any non-trivial task, write `ketchup-plan.md` with explicit dependency notation on every burst:

```markdown
### Bottle: Authentication
- [ ] Burst 10: createUser returns user object [depends: none]
- [ ] Burst 11: hashPassword uses bcrypt [depends: none]
- [ ] Burst 12: validatePassword checks hash [depends: 11]
- [ ] Burst 13: generateToken creates JWT [depends: 10]
- [ ] Burst 14: login combines all [depends: 10, 12, 13]
```

The dependency graph tells you which bursts can run in parallel:

- `[depends: none]` bursts can launch immediately, in parallel sub-agents.
- `[depends: N]` bursts wait for burst N to finish before launching.
- Bursts at the same dependency level run together.

## How to launch sub-agents

When the plan has independent bursts, launch a sub-agent per burst (or per cluster of related bursts) using the Task tool. Each sub-agent gets:

- The CLAUDE.md context (the same rules apply, no exceptions for sub-agents).
- The relevant slice of `ketchup-plan.md`.
- An explicit list of bursts it owns and the dependencies it can assume are complete.

Sub-agents commit their own work and report back. The validators on every commit keep each sub-agent honest, and the deny-list keeps sensitive files protected across all of them.

## Common parallelization patterns

- **Independent bursts in the same Bottle**: launch one sub-agent per burst at `[depends: none]` level.
- **Exploration**: split by area (e.g., one sub-agent searches tests, another searches implementation).
- **Multiple files needing similar changes**: one sub-agent per file or per cluster.
- **Independent Bottles**: open another worktree and run a separate Ketchup session against that branch.

## What NOT to do

- Do not run all bursts in one long serial session expecting to drift to the finish line. The plan is the parallelization signal; use it.
- Do not launch a sub-agent without the dependency context from `ketchup-plan.md`. It will rebuild a different mental model and the work won't compose.
- Do not let sub-agents skip validators "for speed". The whole point is that every commit goes through the same gate regardless of which agent wrote it.
