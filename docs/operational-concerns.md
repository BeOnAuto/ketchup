# Operational Concerns

Honest answers to the questions you'd ask before putting Ketchup in front of your team.

This page is the place we publish real measurements. Where we don't have a hard number yet, we say so and tell you what determines it.

---

## What does it cost to run?

Ketchup runs every commit through a separate Claude subagent. The subagent is invoked through the same `claude` CLI Claude Code uses, which means: if you're on a Claude Pro or Team plan, the calls draw from your existing rate limits. There's no separate Anthropic key, no separate billing, and no separate auth.

**What determines the per-commit cost:**

- **Batch size** (default 3): validators are batched 3 per CLI call to amortize prompt overhead. Lower batch = more calls per commit = more tokens spent on prompt prefix.
- **Number of enabled validators** (17 by default): each batch of 3 is a separate CLI invocation, so a project with 17 enabled validators issues 6 calls per commit.
- **Diff size**: the staged diff is the largest variable input. A 500-line diff costs noticeably more than a 50-line one. (This is one reason the `burst-atomicity` validator exists: it keeps diffs evaluable.)
- **Validator prompt length**: the 17 defaults are short (median ~30 lines). Custom validators can be longer.

**What we'll publish:** p50 / p95 latency per commit, median tokens per commit at default settings, and observed false-positive rate from our own usage. We're collecting these numbers from a month of dogfooding on the on.auto monorepo and will post them here.

**What you can do today:** enable activity logging (`DEBUG=auto-ketchup`) and watch `.ketchup/logs/auto-ketchup/debug.log` in your own repo for one week. The logs include per-validator timing.

---

## What's the latency on a commit?

The PreToolUse hook blocks `git commit` until every batch returns ACK or NACK. With the default 17 validators batched 3-per-call, that's 6 sequential CLI invocations against `claude`.

Each call is bounded by Claude's response time on a short structured-output prompt. In practice this is a few seconds per call, so a clean commit at default settings takes on the order of seconds (not minutes). We'll publish the actual p50/p95 once dogfooding measurements are stable.

**If latency matters more than thoroughness:**

- Reduce `validateCommit.batchCount` in `.ketchup/.claude.hooks.json` (raise from 3 to 5 or 7 to fewer total calls)
- Disable validators you don't need: `/auto-ketchup-config validators disable <name>`
- Set `validateCommit.mode` to `warn` instead of `strict` (NACK becomes a warning, doesn't block)

---

## What happens when the validator subagent hallucinates?

It happens. The subagent occasionally returns a NACK for a reason that's wrong, vague, or matches the wrong line. Three things mitigate this:

1. **The subagent can only return JSON** (`{"decision":"ACK"}` or `{"decision":"NACK","reason":"..."}`). Unparseable output is treated as ACK by default, so a malformed response doesn't block your commit.
2. **The appeal system** is the bounded override. Add `[appeal: <reason>]` to the commit message and a separate `appeal-system` validator re-evaluates the NACK with your reason in context. Either the appeal is accepted and the commit proceeds, or it's rejected with the reason logged. Not a bypass; a formal re-evaluation that leaves a trail.
3. **You can disable noisy validators** at runtime: `/auto-ketchup-config validators disable testing-weak-assertions`. No fork, no rebuild.

In our own usage the appeal rate is low single-digit percent of NACKs. We'll publish the observed rate once dogfooding is stable.

---

## What happens when a validator times out?

Each Claude CLI call has a process-level timeout. If a call doesn't return in time, the validator is treated as failed (not as ACK), and the commit is blocked with a "validator timeout" reason. You can re-run the commit immediately (often the second attempt succeeds) or appeal with a reason.

Logs are written to `.ketchup/logs/auto-ketchup/debug.log` so you can see which validator timed out and why.

---

## Does this lock me into Anthropic?

Today, yes. Ketchup is built on Claude Code's hook system and invokes Claude via the `claude` CLI for validator decisions. If your agent or the CLI changes, Ketchup will need adapters.

What's portable:

- **The Ketchup Technique** (planning rhythm: bursts, `ketchup-plan.md`, TCR cycle) is methodology, not tooling. Adopt it with any agent by hand.
- **The validator file format** (Markdown + YAML frontmatter + LLM prompt) is a simple convention that other tools could implement.

What's not portable:

- The hook integrations (SessionStart, PreToolUse, UserPromptSubmit, Stop) are Claude Code-specific.
- The subagent invocation uses the `claude` CLI directly.

If your agent exposes hooks or an equivalent integration surface, [open an issue](https://github.com/BeOnAuto/auto-ketchup/issues) and we'll scope adapter work.

---

## Can I run a non-LLM mode?

Not currently. The differentiator of LLM validators is exactly the semantic judgment that static tools can't provide (a test that asserts nothing, a commit bundling unrelated concerns, an architectural rule violated). Stripping the LLM removes the value.

If you want lighter checks alongside Ketchup, run [Biome](https://biomejs.dev), [eslint](https://eslint.org), or [husky](https://typicode.github.io/husky) for syntactic / static work. Ketchup is designed to layer on top, not replace them.

---

## How do I disable a noisy validator?

Three ways:

```bash
# Inside Claude Code
/auto-ketchup-config validators disable testing-weak-assertions
```

```bash
# Or edit the file directly:
# .ketchup/.claude.hooks.json
# Set "validators": { "disabled": ["testing-weak-assertions"] }
```

```bash
# Or set enabled: false in the validator's frontmatter:
# .ketchup/validators/testing-weak-assertions.md
# ---
# name: testing-weak-assertions
# enabled: false
# ---
```

The first form is the easiest and is auditable in `git log` because the change lands in `.claude.hooks.json`.

---

## Can I run Ketchup in CI instead of (or in addition to) the local commit hook?

Today: no. Ketchup runs as a Claude Code plugin and depends on the local Claude Code session for the validator subagent. It's an interactive-loop tool, not a CI tool.

What's possible: the validators themselves (Markdown + YAML + prompt) are reusable artifacts. A CI integration that runs them against PR diffs is on the roadmap. If this is high-priority for your team, [open an issue](https://github.com/BeOnAuto/auto-ketchup/issues).

---

## What's the false-positive rate?

We're publishing this number from our own dogfooding. To self-measure today: count NACKs that you appealed and won (the validator was wrong) vs. total NACKs over a week. Activity logging (`DEBUG=auto-ketchup`) records both.

In our usage the appeals system catches most false positives without manual intervention being painful. We'll publish the observed rate once stable.

---

## What if I'm worried about token spend?

Three things to know:

1. **There is no separate billing.** Subagent calls go through the same `claude` CLI on your existing Claude Pro / Team subscription.
2. **You control how often it fires.** Disabling validators or raising `batchCount` reduces calls per commit. Setting `validateCommit.mode` to `warn` removes the blocking call entirely (validators still run for visibility but don't gate the commit).
3. **Activity logs tell you exactly what's running.** `DEBUG=auto-ketchup` writes per-validator timing and decisions to `.ketchup/logs/auto-ketchup/debug.log`.

If you're rate-limited on Claude Pro and Ketchup is making it worse, switch to `warn` mode or disable the heaviest validators until you're back inside your budget.

---

## Summary table

| Concern | Today | Pending |
|---------|-------|---------|
| Per-commit cost ($) | Tokens drawn from your existing Claude Pro / Team plan | Median $/commit at default settings, after dogfooding |
| Latency | Seconds at default settings | Real p50/p95 measurements |
| False-positive rate | Mitigated by appeals + runtime disable | Observed rate from our usage |
| Hallucination handling | JSON-only output, malformed = treated as ACK | (No change planned) |
| Vendor lock-in | Claude Code-only today | Adapter surface for other agents (open an issue) |
| CI mode | Not supported today | On roadmap if demand surfaces |

---

If you have an operational concern not covered here, [open an issue](https://github.com/BeOnAuto/auto-ketchup/issues) and we'll add it.
