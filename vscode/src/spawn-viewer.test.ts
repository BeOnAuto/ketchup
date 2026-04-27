import type { ChildProcess } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { describe, expect, it, vi } from 'vitest';

import { type SpawnFn, spawnViewer } from './spawn-viewer';

describe('spawnViewer', () => {
  it('spawns node with the given script and resolves with the reported port', async () => {
    const stdout = new PassThrough();
    const fakeChild = Object.assign(new EventEmitter(), { stdout, kill: vi.fn() }) as unknown as ChildProcess;
    const spawn: SpawnFn = vi.fn(() => fakeChild);

    const promise = spawnViewer('/path/to/events-viewer.js', '/tmp/events.db', 4321, spawn);
    stdout.write('Viewer at http://127.0.0.1:4324\n');
    const handle = await promise;

    expect({
      spawnArgs: (spawn as unknown as { mock: { calls: Array<[string, string[]]> } }).mock.calls[0],
      port: handle.port,
      sameProcess: handle.process === fakeChild,
    }).toEqual({
      spawnArgs: ['node', ['/path/to/events-viewer.js', '/tmp/events.db', '4321']],
      port: 4324,
      sameProcess: true,
    });
  });
});
