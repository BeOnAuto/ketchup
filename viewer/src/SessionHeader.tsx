export function SessionHeader({ sessionId, summary }: { sessionId: string; summary: string }) {
  return (
    <div data-testid="session-header" className="mb-4 border-b border-slate-200 pb-3">
      <div className="font-mono text-xs text-slate-500">{sessionId}</div>
      <div className="mt-1 text-sm text-slate-800">{summary}</div>
    </div>
  );
}
