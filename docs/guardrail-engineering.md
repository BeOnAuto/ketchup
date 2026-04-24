# Guardrail Engineering

> The mechanism behind Ketchup: observe a failure, encode the constraint, and make sure AI can't repeat it.

## The loop

AI coding agents have three problems that static tools can't fix:

1. **They're biased for delivery.** They predict the next token and ship. They don't stop to wonder if the design decision you made three months ago is still valid.
2. **They have no negative knowledge.** A senior developer's real superpower is what they choose *not* to produce. An LLM has none of that for your system.
3. **Every prompt is a clean slate.** Whatever you taught them yesterday is gone. Today's session has no memory of the 47 constraints you set last week.

The answer isn't to watch harder; it's to move your attention from supervising keystrokes to engineering constraints. Every mistake AI makes gets encoded once as a rule the next AI can't get past, so the codebase becomes permanently safer rather than temporarily cleaner.

That's guardrail engineering, and Ketchup is the engine that runs it.

---

## Why LLM guardrails specifically

Static tools (eslint, commitlint, husky, lefthook) are excellent at what they do, and Ketchup doesn't replace them: it handles what they can't.

| Failure | Static catches? | Semantic catches? |
|---------|:---:|:---:|
| Unused import | ✓ | ✓ |
| Wrong indentation | ✓ | ✓ |
| Test that asserts nothing meaningful | ✗ | ✓ |
| Commit that bundles three unrelated concerns | ✗ | ✓ |
| A "fix" that rationalizes a shortcut | ✗ | ✓ |
| New data-access pattern contradicting an architectural rule | ✗ | ✓ |
| Burst that violates the scope contract in `ketchup-plan.md` | ✗ | ✓ |

Semantic failures need semantic understanding. Ketchup runs a separate Claude subagent against every commit, with your rules as its context and no investment in whether the commit ships.

---

## The five mechanisms

### 1. Validators

A validator is a Markdown file with YAML frontmatter and an LLM prompt. On `git commit`, Ketchup loads all enabled validators, batches them 3 per CLI call, passes the staged diff plus file list plus commit message to each, and waits for ACK or NACK. NACK blocks the commit with the validator's reason; ACK lets it through.

Ships with 17: `burst-atomicity`, `new-code-requires-tests`, `testing-weak-assertions`, `testing-no-state-peeking`, `testing-structure`, `testing-stubs-over-mocks`, `no-comments`, `dead-code`, `no-dangerous-git`, `coverage-rules`, `hygiene`, `type-organization`, `backwards-compat`, `tcr-workflow`, `ketchup-plan-format`, `infra-commit-format`, `appeal-system`.

Add yours in `.ketchup/validators/`. [Full guide →](/validators-guide)

### 2. Reminders

AI is amnesiac, so reminders keep your operating context loaded. Each reminder is a Markdown file with YAML frontmatter, injected as a `<system-reminder>` block at two points:

- **SessionStart** (once per session): core workflow, emergent design, extreme ownership, IDE diagnostics, parallelization, sub-agent rules, rethink-after-revert, test-title-matches-spec
- **UserPromptSubmit** (every turn): the mandatory-workflow reminder that keeps the discipline in front of the agent

Drift can't accumulate across prompts because the rules re-inject every turn. [Full guide →](/reminders-guide)

### 3. Deny-list

Some files must not be edited by AI: `.env`, CI configs, migrations, secrets, generated code. The deny-list is a set of micromatch glob patterns, configured in `.ketchup/deny-list.project.txt` (team) and `.ketchup/deny-list.local.txt` (personal). On any tool call that would touch a denied path, the PreToolUse hook blocks it.

This is structural protection rather than procedural trust: AI can't forget not to touch denied files because it's physically prevented.

### 4. TCR gate

If tests pass, the commit lands automatically; if they fail, the change is reverted. The `tcr-workflow` validator enforces this at the commit boundary by NACK-ing any commit message that indicates failing tests. Paired with `burst-atomicity` and `new-code-requires-tests`, the shape of acceptable work is enforced:

- Red commits are rejected
- Untested behavioral code is rejected
- Commits that bundle multiple concerns are rejected

The rhythm is red → green → TCR → refactor → TCR → done, and it holds because the validators won't let it slip. [Planning rhythm details →](/ketchup-technique)

### 5. Parallel subagent planning

`ketchup-plan.md` carries dependency notation on every burst (`[depends: none]`, `[depends: 11]`, `[depends: 10, 12]`), and the SessionStart reminder tells the agent to read that graph and launch one sub-agent per independent burst. Bursts at the same dependency level run together, downstream bursts wait, and the work composes.

Sub-agents inherit the same validators, reminders, and deny-list, so the guardrails on every commit hold regardless of which agent wrote the diff. When a Bottle's bursts are running cleanly, open a fresh worktree and run an independent Bottle in parallel.

The plan is the parallelization signal, and sub-agents are the execution mechanism.

---

## The appeal system

Rigid rules trap legitimate edge cases. Ketchup's answer is appeals, not overrides.

When the validator is wrong (or the commit is a genuine exception), the developer adds `[appeal: reason]` to the commit message and a separate `appeal-system` validator re-evaluates the NACK with the appeal reason in context. Either the appeal is accepted and the commit proceeds, or it's rejected and the commit stays blocked.

This is not a bypass and not `--no-verify`; it's a formal re-evaluation that leaves a trail.

---

## Why this compounds

Every guardrail you add solves a specific AI failure permanently, which isn't true of prompting: prompts work this session and then evaporate when the session ends. A validator is a commitment the codebase makes to itself, forever.

Concretely:

- Month 1: AI writes a meaningless test (`toBeDefined()`). You add `testing-weak-assertions`. It can't happen again.
- Month 2: AI bundles a test and a refactor in the same commit. You add `burst-atomicity`. It can't happen again.
- Month 3: AI introduces a new data-access pattern that bypasses your repository layer. You add a project-specific architecture validator. It can't happen again.
- Month 6: your validator set *is* the documentation of your team's accumulated taste. A new engineer onboarding sees the rules the codebase enforces and understands the system's values.

> Don't hope AI got it right. Prove it did.

---

## How this relates to the Ketchup Technique

Guardrail engineering is the *mechanism*. [The Ketchup Technique](/ketchup-technique) is the *planning rhythm* you use to structure work so the mechanism has something clean to validate: one test, one behavior, one commit, in a durable `ketchup-plan.md`.

You can use guardrails without the planning rhythm and you can follow the rhythm without guardrails, but they compose best together, which is why Ketchup ships both.

---

## Further reading

- [Fool Me Once, I Write a Spec](https://specdriven.com/perspectives/the-spec-driven-shift/fool-me-once-i-write-a-spec-fool-me-twice-there-is-no-twice): the essay behind this page, with Sam's broader daily workflow
- [Validators Guide](/validators-guide): every built-in validator and how to write your own
- [Reminders Guide](/reminders-guide): every built-in reminder and how to write your own
- [The Ketchup Technique](/ketchup-technique): the planning rhythm that feeds work into the guardrails
