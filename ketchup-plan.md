# Ketchup Plan: Event Store — Claude session transcripts as domain events

Translate `~/.claude/projects/**/*.jsonl` transcripts into a domain event stream
stored in Emmett (SQLite backend). One stream per `sessionId`. Events preserve
interleave by order; raw jsonl line is stashed on each event under `source`.

**Design decisions (locked):**

- Domain-first vocabulary (noise types folded or dropped; raw line kept on `source`)
- SQLite backend via `@event-driven-io/emmett-sqlite`
- `ThoughtRecorded` events kept (privacy revisit later if needed)
- `AssistantResponded` emitted per text segment (interleave preserved by order)
- Ingestion: on-demand CLI + Stop hook piggyback (live tail deferred)

**Event vocabulary:**
`SessionStarted` · `PromptSubmitted` · `AssistantResponded` · `ThoughtRecorded` ·
`ToolInvoked` · `ToolInvocationSucceeded` · `ToolInvocationFailed` ·
`FileModified` · `HookExecuted` · `SubagentSpawned` · `SubagentCompleted` ·
`SessionCompacted` · `SessionEnded`

## TODO

- [ ] Burst 12: `translateSession(jsonlPath)` — line-by-line orchestration, returns event array [depends: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
- [ ] Burst 14: `ingestSession(jsonlPath, store)` — append events with high-water-mark dedupe [depends: 12, 13]
- [ ] Burst 15: `ingestProject(projectDir, store)` — scan all sessions, ingest each [depends: 14]
- [ ] Burst 16: CLI: `claude-auto events ingest [project-dir]` [depends: 15]
- [ ] Burst 17: Stop hook wiring — auto-ingest current session on Stop [depends: 14]

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
