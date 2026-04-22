import { useState } from 'react';

import { SessionPicker } from './SessionPicker';
import { Timeline } from './Timeline';

export function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <div className="flex min-h-screen gap-4 p-4 font-sans">
      <aside className="w-80 shrink-0 border-r border-slate-200 pr-4">
        <h1 className="mb-4 text-xl font-semibold">Claude Auto Viewer</h1>
        <SessionPicker onSelect={setSelectedId} />
      </aside>
      <main className="min-w-0 flex-1">
        {selectedId ? <Timeline sessionId={selectedId} /> : <p className="text-slate-500">Pick a session.</p>}
      </main>
    </div>
  );
}
