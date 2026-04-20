# Ketchup Plan: Event Store — ingestion and tree viewer

Translate `~/.claude/projects/**/*.jsonl` transcripts into a domain event stream
stored in Emmett (SQLite backend). One stream per `sessionId`. Events preserve
interleave by order; raw jsonl line is stashed on each event under `source`.

**Phase 1 — Ingestion (done):** parsers, translator, ingester, CLI + Stop hook.

**Phase 2 — Viewer (in progress):** Express server + Vite/React SPA rendering an
auto-collapsed tree of events per session. Session picker in left pane, tree in
right pane. Live updates via SSE. Self-contained bundle so a future IDE webview
can embed the same assets.

**Design decisions (locked):**

- Domain-first vocabulary (noise types folded or dropped; raw line kept on `source`)
- SQLite backend via `@event-driven-io/emmett-sqlite`
- `ThoughtRecorded` events kept (privacy revisit later if needed)
- `AssistantResponded` emitted per text segment (interleave preserved by order)
- Ingestion: on-demand CLI + Stop hook piggyback (live tail deferred)
- Viewer server: Express, bound to `127.0.0.1`, no auth (local only)
- Viewer client: Vite + React SPA, self-contained for IDE webview embedding
- Live: server polls SQLite every ~500ms and pushes new events over SSE
- Tree: subagent spawn/completion pairs drive nesting; deep branches auto-collapsed

**Event vocabulary:**
`SessionStarted` · `PromptSubmitted` · `AssistantResponded` · `ThoughtRecorded` ·
`ToolInvoked` · `ToolInvocationSucceeded` · `ToolInvocationFailed` ·
`FileModified` · `HookExecuted` · `SubagentSpawned` · `SubagentCompleted` ·
`SessionCompacted` · `SessionEnded`

## TODO

- [ ] Burst 23: `SessionPicker` component fetches and renders `/api/sessions` [depends: 22]
- [ ] Burst 24: `Timeline` component renders flat events for selected session [depends: 23]
- [ ] Burst 25: Tree nesting by subagent spawn/completion pairing [depends: 24]
- [ ] Burst 26: Auto-collapse deep tree branches [depends: 25]
- [ ] Burst 27: SSE variant `/api/sessions/:id/events/stream` that follows new events [depends: 21]
- [ ] Burst 28: Client wires SSE to append live events into the tree [depends: 25, 27]


## DONE

- [x] Burst 1: `parseSessionStarted` — jsonl `SessionStart` progress line → `SessionStarted` event (a31a987)
- [x] Burst 2: `parsePromptSubmitted` — `user` message line → `PromptSubmitted` event (a4b48d5)
- [x] Burst 3: `parseAssistantResponded` — `assistant` text segment → `AssistantResponded` event (651a361)
- [x] Burst 4: `parseThoughtRecorded` — `thinking` item → `ThoughtRecorded` event (b443876)
- [x] Burst 5: `parseToolInvoked` — `tool_use` item → `ToolInvoked` event (4f53bae)
- [x] Burst 8: `parseHookExecuted` — `hook_progress` line → `HookExecuted` event (1380fa5)
- [x] Burst 9: `parseSubagentProgressed` — `agent_progress` line → `SubagentProgressed` event (19ca15c)
- [x] Burst 10: `parseFileModified` — `tool_result` line with `create`/`update` → `FileModified` event (98e01a6)
- [x] Burst 6: `parseToolInvocationSucceeded` — successful `tool_result` → event (d0d02d3)
- [x] Burst 7: `parseToolInvocationFailed` — failed `tool_result` → event (1bde829)
- [x] Burst 11: `parseSessionEnded` — Stop hook line → `SessionEnded` event (39b6598)
- [x] Burst 13: `createEventStore` — Emmett SQLite store factory (183e82b)
- [x] Refactor: `parseSessionStarted` returns array with hook_progress filter (4080c31)
- [x] Burst 12: `translateSession` orchestrates parsers over jsonl lines (8f9f2c5)
- [x] Burst 14: `ingestSession` appends translated events to per-session stream (222ebba)
- [x] Burst 15: `ingestProject` invokes session ingester for each jsonl file (145d11d)
- [x] Burst 16: `ingestCliRun` + `scripts/events-ingest.ts` CLI entry (0e42410)
- [x] Burst 17: `ingestOnStop` wires Stop hook input to session ingestion (45ffc39)
- [x] Burst 18: `listSessions` returns per-session summaries from event store (f5c225c)
- [x] Burst 19: `readSessionEvents` returns domain events for a session stream (fa2a662)
- [x] Burst 20: `createViewerApp` serves `/api/sessions` from injected lister (7cfc9ad)
- [x] Burst 21: Viewer serves `/api/sessions/:id/events` from injected reader (38f74fd)
- [x] Burst 22: Scaffold `viewer/` workspace with vite, react, and testing-library (15a1ad9)
