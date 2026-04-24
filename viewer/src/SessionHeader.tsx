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
    <div data-testid="session-header" className="mb-4 border-b border-ketchup-divider pb-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium tracking-wide text-ketchup-text-3 uppercase">session id</span>
        <code className="font-mono text-xs text-ketchup-text-2">{sessionId}</code>
        <button
          type="button"
          onClick={() => onCopy(resumeCommand)}
          className="ml-auto rounded-full border border-ketchup-divider px-3 py-0.5 text-xs text-ketchup-text-2 transition hover:bg-ketchup-bg-soft"
        >
          copy resume command
        </button>
      </div>
      <div className="mt-2 text-sm text-ketchup-text">{summary}</div>
    </div>
  );
}
