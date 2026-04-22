export function SessionHeader({
  sessionId,
  summary,
  onCopy,
}: {
  sessionId: string;
  summary: string;
  onCopy: (command: string) => void;
}) {
  const resumeCommand = `claude --resume ${sessionId}`;
  return (
    <div data-testid="session-header" className="mb-4 border-b border-slate-200 pb-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">session id</span>
        <code className="font-mono text-xs text-slate-600">{sessionId}</code>
        <button
          type="button"
          onClick={() => onCopy(resumeCommand)}
          className="ml-auto rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
        >
          copy resume command
        </button>
      </div>
      <div className="mt-2 text-sm text-slate-800">{summary}</div>
    </div>
  );
}
