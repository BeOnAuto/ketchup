---
layout: home

hero:
  name: Ketchup
  text: Turn every AI mistake into a rule AI can't repeat.
  tagline: Ketchup runs 20+ LLM-powered guardrails on every AI commit, so bad commits don't land.
  image:
    light: /hero-light.png
    dark: /hero-dark.png
    alt: Ketchup - LLM-powered guardrails for AI coding agents.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Guardrail Engineering
      link: /guardrail-engineering
    - theme: alt
      text: View on GitHub
      link: https://github.com/BeOnAuto/ketchup

features:
  - icon:
      src: /icon-supervisor.png
    title: LLM-powered commit gate
    details: "An impartial AI validates Claude's commits. 20+ validators ship by default, and you can add your own."
  - icon:
      src: /icon-janitor.png
    title: Persistent operating context
    details: "Reminders inject your rules into Claude at the hook points you choose. 9+ ship by default, and you can add your own."
  - icon:
      src: /icon-architect.png
    title: Structural file protection
    details: "Ketchup blocks Claude from touching files you've forbidden, using hooks, so it doesn't ignore you as it's known to do."
  - icon:
      src: /icon-parallel.png
    title: Parallel by design
    details: "Plans express dependency chains, so independent bursts run in parallel sub-agents."
  - icon:
      src: /icon-tcr.png
    title: Emergent design through TCR
    details: "<code>test && commit || revert</code> forces Claude to rethink rather than keep patching a bad design."
  - icon:
      src: /icon-coverage.png
    title: Formal appeals
    details: "If validators are too strict, Claude can appeal with `[appeal: reason]` and a separate LLM re-judges."
---

## The loop

You observe an AI mistake, encode it as a rule, and AI can't repeat it.

Ketchup makes that loop real with validators on every commit, reminders on every prompt, and deny-lists on every file. The codebase gets permanently safer as you keep working, not just temporarily cleaner.

```
/plugin install ketchup
```

Ketchup is an open-source guardrail engine for Claude Code, from the team at [Auto](https://on.auto).

> Today: Claude Code only. If your agent exposes hooks or an equivalent integration surface, [open an issue](https://github.com/BeOnAuto/ketchup/issues).

---

## What ships

**20+ validators** ship by default: `burst-atomicity`, `new-code-requires-tests`, `testing-weak-assertions`, `no-dangerous-git`, `coverage-rules`, `dead-code`, `tcr-workflow`, and more. [Full list →](/validators-guide)

**9+ reminders** that keep the discipline loaded: core workflow, extreme ownership, IDE diagnostics, rethink-after-revert, test-title-matches-spec, and more. [Full list →](/reminders-guide)

Every rule is runtime-configurable. Disable what you don't need. Reorder what you do. Add your own in `.ketchup/validators/` and `.ketchup/reminders/`. No forking.

---

## Why LLM guardrails

Static tools catch syntax. Tests catch regressions. Neither catches _semantic_ failures:

- A test that asserts nothing meaningful (`expect(result).toBeDefined()`)
- A commit that bundles three unrelated concerns
- A "fix" that rationalizes a shortcut
- A new data-access pattern that contradicts an architectural rule you wrote three months ago

Semantic failures need semantic understanding, which is why Ketchup runs a separate Claude subagent against every commit, with no investment in shipping, no attachment to the diff, and no reason to rationalize. Just the rules, read from your validator files, returning ACK or NACK.

Cost, latency, false-positive rate, and what happens when the subagent hallucinates: see [Operational Concerns](/operational-concerns).

---

## Three steps

### 1. Install

From within a Claude Code session:

```
/plugin marketplace add BeOnAuto/auto-plugins
/plugin install ketchup
```

### 2. Initialize

```
/ketchup:init
```

This creates `.ketchup/` with default configuration, seeded with the 20+ validators and 9+ reminders.

### 3. Work

Write a test, let AI implement it, then commit. Validators read the diff and reject the commit with a reason if anything is off. When you spot a new failure pattern, encode it as a validator in `.ketchup/validators/`, and the next AI agent can't repeat it.

**[Get Started →](/getting-started)**

---

<sub>From the team building [Auto](https://on.auto), a spec-driven development platform. [How Ketchup fits in the stack →](/in-the-stack)</sub>
