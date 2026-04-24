import { useState } from 'react';

import { SessionHeader } from './SessionHeader';
import { SessionPicker, type SessionSummary } from './SessionPicker';
import { Timeline } from './Timeline';

export function App() {
  const [selected, setSelected] = useState<SessionSummary | null>(null);
  return (
    <div className="flex min-h-screen gap-4 p-4 font-sans">
      <aside className="w-80 shrink-0 border-r border-slate-200 pr-4">
        <h1 className="mb-4 text-xl font-semibold">Ketchup Viewer</h1>
        <SessionPicker onSelect={setSelected} />
      </aside>
      <main className="min-w-0 flex-1">
        {selected ? (
          <>
            <SessionHeader
              sessionId={selected.sessionId}
              summary={selected.summary}
              onCopy={(command) => navigator.clipboard.writeText(command)}
            />
            <Timeline sessionId={selected.sessionId} />
          </>
        ) : (
          <p className="text-slate-500">Pick a session.</p>
        )}
      </main>
    </div>
  );
}
