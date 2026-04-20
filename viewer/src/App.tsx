import { useState } from 'react';

import { SessionPicker } from './SessionPicker';
import { Timeline } from './Timeline';

export function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <div style={{ fontFamily: 'system-ui', display: 'flex', gap: '1rem', padding: '1rem' }}>
      <aside style={{ flex: '0 0 320px', borderRight: '1px solid #ccc', paddingRight: '1rem' }}>
        <h1>Claude Auto Viewer</h1>
        <SessionPicker onSelect={setSelectedId} />
      </aside>
      <main style={{ flex: 1 }}>{selectedId ? <Timeline sessionId={selectedId} /> : <p>Pick a session.</p>}</main>
    </div>
  );
}
