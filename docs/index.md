---
layout: home

hero:
  name: Ketchup
  text: Turn every AI mistake into a rule AI can't repeat.
  tagline: Ketchup runs 15+ LLM-powered guardrails on every AI commit, so bad commits don't land.
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
    title: Validators
    details: "LLM-powered commit gate. An impartial AI reads every diff against your rules and returns ACK or NACK. 17 ship. Add your own."
  - icon:
      src: /icon-janitor.png
    title: Reminders
    details: "Your operating context, re-injected every session and every prompt. AI's amnesia can't erode the rules."
  - icon:
      src: /icon-architect.png
    title: Deny-list
    details: "Glob-pattern protection for files AI must never touch. Structural, not procedural."
  - icon:
      src: /icon-parallel.png
    title: Auto-Continue
    details: "Reads `ketchup-plan.md` and session signals. Keeps the agent working while work remains and commits stay clean."
  - icon:
      src: /icon-tcr.png
    title: TCR gate
    details: "<code>test && commit || revert</code>. Red commits don't land. The rhythm holds."
  - icon:
      src: /icon-coverage.png
    title: Appeals
    details: "Rigid rules don't trap legitimate edge cases. Mark a commit `[appeal: reason]` and a separate validator re-evaluates."
---

## The loop

Observe an AI mistake. Encode it as a rule. AI can't repeat it.

Ketchup is how you make that loop real. Validators on every commit. Reminders on every prompt. Deny-lists on every file. The codebase gets permanently safer as you keep working, not just temporarily cleaner.

```
/plugin install ketchup
```

Ketchup is an open-source guardrail engine for Claude Code, from the team at [Auto](https://on.auto).

> Today: Claude Code only. If your agent exposes hooks or an equivalent integration surface, [open an issue](https://github.com/BeOnAuto/ketchup/issues).

---

## What ships

**17 validators** ship by default: `burst-atomicity`, `new-code-requires-tests`, `testing-weak-assertions`, `no-dangerous-git`, `coverage-rules`, `dead-code`, `tcr-workflow`, and more. [Full list →](/validators-guide)

**10 reminders** that keep the discipline loaded: core workflow, extreme ownership, IDE diagnostics, rethink-after-revert, test-title-matches-spec, and more. [Full list →](/reminders-guide)

Every rule is runtime-configurable. Disable what you don't need. Reorder what you do. Add your own in `.ketchup/validators/` and `.ketchup/reminders/`. No forking.

---

## Why LLM guardrails

Static tools catch syntax. Tests catch regressions. Neither catches *semantic* failures:

- A test that asserts nothing meaningful (`expect(result).toBeDefined()`)
- A commit that bundles three unrelated concerns
- A "fix" that rationalizes a shortcut
- A new data-access pattern that contradicts an architectural rule you wrote three months ago

Semantic failures need semantic understanding. Ketchup runs a separate Claude subagent against every commit. It has no investment in shipping, no attachment to the diff, no reason to rationalize. Just the rules, read from your validator files.

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

This creates `.ketchup/` with default configuration, seeded with the 17 validators and 10 reminders.

### 3. Work

Write a test, let AI implement it, commit. Validators read the diff. If anything's off, the commit is rejected with a reason. Encode any new failure pattern as a validator in `.ketchup/validators/`. The next AI agent can't repeat it.

**[Get Started →](/getting-started)**

---

<sub>From the team building [Auto](https://on.auto), a spec-driven development platform. [How Ketchup fits in the stack →](/in-the-stack)</sub>
