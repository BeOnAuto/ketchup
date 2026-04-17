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

- [ ] Burst 1: `parseSessionStarted` — jsonl `SessionStart` progress line → `SessionStarted` event [depends: none]
- [ ] Burst 2: `parsePromptSubmitted` — `user` message line → `PromptSubmitted` event [depends: none]
- [ ] Burst 3: `parseAssistantResponded` — `assistant` text segment → `AssistantResponded` event [depends: none]
- [ ] Burst 4: `parseThoughtRecorded` — `thinking` line → `ThoughtRecorded` event [depends: none]
- [ ] Burst 5: `parseToolInvoked` — `tool_use` line → `ToolInvoked` event [depends: none]
- [ ] Burst 6: `parseToolInvocationSucceeded` — successful `tool_result` line [depends: 5]
- [ ] Burst 7: `parseToolInvocationFailed` — failed `tool_result` line [depends: 5]
- [ ] Burst 8: `parseHookExecuted` — `hook_progress` line → `HookExecuted` event [depends: none]
- [ ] Burst 9: `parseSubagentSpawned` / `parseSubagentCompleted` — `agent_progress` lines [depends: none]
- [ ] Burst 10: `parseFileModified` — `update` / `create` lines → `FileModified` event [depends: none]
- [ ] Burst 11: `parseSessionEnded` — end-of-stream marker → `SessionEnded` event [depends: 1]
- [ ] Burst 12: `translateSession(jsonlPath)` — line-by-line orchestration, returns event array [depends: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
- [ ] Burst 13: Emmett SQLite store init — opens `events.db`, creates schema [depends: none]
- [ ] Burst 14: `ingestSession(jsonlPath, store)` — append events with high-water-mark dedupe [depends: 12, 13]
- [ ] Burst 15: `ingestProject(projectDir, store)` — scan all sessions, ingest each [depends: 14]
- [ ] Burst 16: CLI: `claude-auto events ingest [project-dir]` [depends: 15]
- [ ] Burst 17: Stop hook wiring — auto-ingest current session on Stop [depends: 14]

## DONE
