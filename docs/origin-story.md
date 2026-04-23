# The Origin Story

> How I stopped supervising AI and started engineering guardrails.

---

## The Babysitter Phase

I was stuck in a loop.

Every Claude session demanded my full attention. Watching for drift. Nudging it back on track. Correcting hallucinations in real-time.

I couldn't shift focus. I couldn't context-switch. AI-assisted coding had captured my cognitive load. I adopted AI to multiply my output. Instead, I was doing one thing at a time with help that required constant supervision.

Worse: I'd fix a mistake once, and the next session would make the same mistake. I'd caught the failure, but the fix didn't persist. Nothing I did prevented the repeat. I was running an infinitely productive amnesiac, and I was the only memory in the system.

---

## The Search for a System

### The problem wasn't speed

The bottleneck wasn't AI's speed. It was my attention, specifically: my inability to transfer *negative knowledge* (what not to do, what I'd already caught) into something the next session could enforce.

You can only relax attention if the system enforces what you'd otherwise enforce yourself. I didn't have that system. So I watched.

### Extreme Programming roots

My background is in Extreme Programming: Test-Driven Development, pair programming, continuous integration, extreme ownership. These weren't just practices. They were a philosophy about how software should grow.

The key insight from TDD: if it's hard to test, the design is wrong. Code flows naturally when the design is right. When you're fighting the tests, you're fighting a smell.

### TCR

In 2019, I read [Kent Beck's article](https://medium.com/@kentbeck_7670/test-commit-revert-870bbd756864) on TCR (Test && Commit || Revert). The rule: run your tests, and if they pass, commit automatically. If they fail, revert everything. No debugging. No patching. Start fresh.

What if I put this in a loop with AI? The thought experiment of infinite monkeys with typewriters producing Shakespeare, but with tests as the filter. A million AIs, and the ones that work are the ones that meet the tests.

The revert isn't a problem. It's a tool.

---

## The Ketchup Technique

I needed fresh vocabulary. The internet is polluted with PM terms: epics, sprints, stories, SAFe. LLM training data is saturated with these, which means any prompt using them collapses toward Jira-ticket ceremony.

**The Ketchup Technique** was born, a play on "catch up." Like the Pomodoro Technique gave fresh vocabulary for time management (a tomato timer instead of "timeboxing"), the Ketchup Technique gives fresh vocabulary for AI-assisted planning.

A **Burst** is one test, one behavior, one commit. Atomic, independent, valuable. A **Bottle** groups related bursts. The plan lives in `ketchup-plan.md` in the repo.

These terms have no baggage. No billions of parameters pulling them toward someone else's interpretation.

---

## The Core Insight: Never Patch, Always Revert

Watch what Claude does when something breaks: debug, find the broken variable, fix it, something else breaks, fix that, the wiring's wrong, fix the wiring. Keep going, keep patching, keep assuming the original design was correct.

Developers do this too. Human nature to protect sunk costs.

But the TDD lesson is clear: when code isn't flowing smoothly, the design is usually wrong. You're not debugging a mistake. You're polishing a flawed foundation.

Revert. The code disappears. The learning stays in the context window. The LLM still has all the context of why it failed. It has a clean slate to apply that lesson differently. It has space to think.

Reverts aren't punishment. They're information.

---

## The Transformation

What changed wasn't the AI. It was my role.

**Before:** Watch AI's work, catch problems, nudge corrections, watch more.

**After:** Observe an AI failure *once*. Encode it as a rule. The next agent can't repeat it.

That's guardrail engineering. The first time AI wrote a meaningless test with `toBeDefined()`, I wrote a validator for it. The first time AI bundled a test and a refactor into one commit, I wrote `burst-atomicity`. The first time AI rationalized a shortcut, I added an impartial reviewer that has no stake in the diff.

Each mistake got paid once, not repeatedly. The codebase got permanently safer, not just temporarily cleaner.

My attention didn't disappear. It moved. From supervising keystrokes to engineering constraints. That's a higher-leverage place for a senior engineer to spend their time, and it's the only place where the investment compounds.

---

## What Ships

Ketchup is the engine for that loop. It runs LLM-powered guardrails on every commit. It re-injects operating context every session and every prompt so AI's amnesia can't erode the rules. It protects files by structural deny-list. It decides continue-or-stop from the plan state and session signals.

17 validators and 10 reminders ship by default, encoded from over 40 years of my coding practice. Every one is customizable. Most projects will add their own architectural constraints as they discover failure patterns specific to their system.

See the [Guardrail Engineering](/guardrail-engineering) page for the mechanism, or the [Ketchup Technique](/ketchup-technique) page for the planning rhythm.

---

## Battle-Tested

I built over ten features on the on.auto team using this technique. Nursing it along, automating more of what needed nursing, refining the hooks, tuning the behaviors.

Each problem became a validator. Each validator prevented that class of problem permanently. The system evolved to be collaborative: team members can contribute without understanding every detail, because the guardrails enforce the discipline automatically.

---

## Your Turn

You don't have to be the babysitter.

| Before (babysitter) | After (guardrail engineer) |
|----------------------|-----------------------------|
| Watching one AI session | Engineering the rules that watch for you |
| Fixing the same mistake every session | Encoding it once; it can't recur |
| Negative knowledge stuck in your head | Negative knowledge in executable guardrails |
| Attention on keystrokes | Attention on design and constraint |

**[Get Started →](/getting-started)**
