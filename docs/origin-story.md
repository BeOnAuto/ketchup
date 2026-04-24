# The Origin Story

## The babysitter problem

I was running an infinitely productive amnesiac, and I was the only memory in the system.

Every Claude session demanded my full attention, watching for drift and nudging it back on track. Worse, I'd fix a mistake once and the next session would make the same mistake: I'd caught the failure but the fix didn't persist, because nothing I did transferred *negative knowledge* (what not to do, what I'd already caught) into something the next session could enforce.

You can only relax attention if the system enforces what you'd otherwise enforce yourself. I didn't have that system, so I watched.

## The XP and TCR lineage

My background is Extreme Programming: TDD, pair programming, continuous integration. The key insight from TDD: if it's hard to test, the design is wrong. When you're fighting the tests, you're fighting a smell.

In 2019, I read [Kent Beck's article on TCR](https://medium.com/@kentbeck_7670/test-commit-revert-870bbd756864) (Test && Commit || Revert). The rule: run your tests, and if they pass, commit automatically; if they fail, revert everything. No debugging, no patching, just start fresh.

Run that loop with AI in the seat and you get something close to the infinite-monkeys thought experiment, except the tests act as the filter and only the work that holds up is allowed through.

The revert isn't a problem; it's a tool. The code disappears, but the learning stays in the context window: the LLM still has the reasoning that led to the failure, and a clean slate to apply that lesson differently. Reverts aren't punishment, they're information.

## What changed

Each AI failure became a guardrail.

The first time AI wrote a meaningless test with `toBeDefined()`, I wrote `testing-weak-assertions`. The first time it bundled a test and a refactor into one commit, I wrote `burst-atomicity`. The first time it rationalized a shortcut, I added an impartial reviewer that has no stake in the diff.

Each mistake got paid once, not repeatedly. The codebase got permanently safer, not just temporarily cleaner.

My attention didn't disappear; it moved from supervising keystrokes to engineering constraints, which is a higher-value place to spend it and the only place where the investment compounds.

## Now

20+ validators and 9+ reminders ship by default, encoded from the failure patterns I hit on the on.auto team. Most projects will add their own architectural constraints as they discover failure patterns specific to their system.

See [Guardrail Engineering](/guardrail-engineering) for the mechanism and [the Ketchup Technique](/ketchup-technique) for the planning rhythm that feeds clean work into it.

**[Get Started →](/getting-started)**
