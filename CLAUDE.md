# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Ketchup (npm: `ketchup`) runs LLM-powered guardrails on every AI commit for Claude Code. It validates commits with an impartial LLM subagent, injects reminders to keep operating context loaded across sessions, manages deny-lists for structural file protection, and enforces TCR discipline. 17 validators and 10 reminders ship by default; all are runtime-configurable. Brand: Ketchup. Package: ketchup.

## Commands

```bash
pnpm build            # TypeScript compile + esbuild bundle scripts
pnpm test             # Vitest (single run)
pnpm test:watch       # Vitest watch mode
pnpm type-check       # tsc --noEmit
pnpm lint             # Biome check
pnpm lint:fix         # Biome auto-fix
pnpm format           # Biome format --write
pnpm check            # Full CI: build + type-check + test + lint
```

Run a single test file:
```bash
pnpm vitest run src/hooks/validate-commit.test.ts
```

## Code Quality Requirements

- **100% test coverage** enforced via vitest thresholds (lines, functions, branches, statements). No escape hatches. Coverage excludes `src/**/*.test.ts` and `src/index.ts` (barrel exports only).
- **Biome linting**: `useImportType: error`, `noUnusedImports: error`, `noExplicitAny: warn`. Max cognitive complexity 15 (20 in tests). Line width 120, single quotes, semicolons, trailing commas.
- **Conventional commits required** with scope: `type(scope): subject`. Valid types: `feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`. Valid scopes: `hooks|skills|core|docs|global|ci|release`.

## Architecture

### Hook System

Claude Code hooks are the core integration. Four hook points with bundled scripts in `scripts/`:

| Hook | Script | Purpose |
|------|--------|---------|
| SessionStart | `session-start.ts` | Load and inject reminders |
| PreToolUse | `pre-tool-use.ts` | Validate commits, enforce deny-list |
| UserPromptSubmit | `user-prompt-submit.ts` | Inject context-aware reminders |
| Stop | `auto-continue.ts` | Decide auto-continue vs stop |

Scripts are bundled via esbuild to `dist/bundle/scripts/` and executed from `$CLAUDE_PLUGIN_ROOT/dist/bundle/scripts/` in plugin mode.

### Key Source Modules (`src/`)

- **`hooks/`**, Hook handlers: `session-start.ts`, `pre-tool-use.ts`, `user-prompt-submit.ts`, `auto-continue.ts`, `validate-commit.ts`
- **`commit-validator.ts`**, Batched validator execution (default batch size: 3), appeals parsing, Claude CLI spawning
- **`validator-loader.ts`** / **`reminder-loader.ts`**, Load markdown files with YAML frontmatter from `.ketchup/validators/` and `.ketchup/reminders/`
- **`hook-state.ts`**, Manages `.claude.hooks.json` (autoContinue mode, validateCommit mode, deny-list config)
- **`deny-list.ts`**, File path protection via micromatch glob patterns
- **`path-resolver.ts`**, Resolves plugin and project paths from `CLAUDE_PLUGIN_ROOT` / `CLAUDE_PLUGIN_DATA` env vars
- **`clue-collector.ts`**, Extracts signals from session transcripts for auto-continue decisions
- **`subagent-classifier.ts`**, Classifies prompts as explore/work/unknown to control hook behavior

### Data Flow: Commit Validation

1. PreToolUse hook detects `git commit` command
2. Gets staged diff, files, commit message
3. Loads validators from `.ketchup/validators/` (markdown with YAML frontmatter)
4. Batches validators (3 per Claude CLI call), each returns ACK or NACK
5. If NACK and commit message contains `[appeal: reason]`, runs appeal validator
6. Returns allow/block decision

### Validators and Reminders

Both are markdown files with YAML frontmatter. Validators gate commits (ACK/NACK decisions). Reminders inject context into prompts based on matching conditions (`hook`, `mode`, `toolName`, `priority`).

### Installation Model

Ketchup runs as a Claude Code plugin. Install via `/plugin marketplace add BeOnAuto/auto-plugins` followed by `/plugin install ketchup`, or as a local plugin via `claude --plugin-dir /path/to/ketchup`. The plugin is opt-in per repository: hooks are inactive until the user runs `/ketchup:init`, which creates `.ketchup/` with default config. Without initialization, session-start shows a non-blocking hint. The plugin provides validators, reminders, and hook scripts. Projects can add local overrides in `.ketchup/`. Existing `.claude-auto/` directories from the legacy package name auto-rename to `.ketchup/` on first session-start (see `src/migrate.ts`).

## Coding Patterns

- **Dependency injection** for testability: executor functions passed as params (e.g., `validateCommit(validators, context, executor = spawnAsync)`)
- **Async/await** throughout, no `.then()` chains
- **Absolute paths** everywhere, no relative path assumptions
- **Module naming conventions**: `*-loader.ts` (disk I/O), `*-manager.ts` (state), `*-classifier.ts` (categorization), `*-collector.ts` (aggregation), `*-logger.ts` (logging)
- **Tests**: co-located as `*.test.ts`, use temp directories for file I/O, mock executors via injection, whole-object assertions preferred
