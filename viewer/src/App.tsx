import { useState } from 'react';

import { SessionHeader } from './SessionHeader';
import { SessionPicker, type SessionSummary } from './SessionPicker';
import { ThemeToggle } from './ThemeToggle';
import { Timeline } from './Timeline';

export function App() {
  const [selected, setSelected] = useState<SessionSummary | null>(null);
  return (
    <div className="flex min-h-screen gap-4 bg-ketchup-bg p-4 font-sans text-ketchup-text">
      <aside className="w-80 shrink-0 border-r border-ketchup-divider pr-4">
        <div className="mb-4 flex items-center gap-2">
          <h1 className="ketchup-brand-gradient text-xl font-semibold">Ketchup Viewer</h1>
          <span className="ml-auto">
            <ThemeToggle />
          </span>
        </div>
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
          <p className="text-ketchup-text-3">Pick a session.</p>
        )}
      </main>
    </div>
  );
}
