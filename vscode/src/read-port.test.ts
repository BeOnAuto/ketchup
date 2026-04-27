import { PassThrough } from 'node:stream';
import { describe, expect, it } from 'vitest';

import { readPortFrom } from './read-port';

describe('readPortFrom', () => {
  it('resolves with the port once "Viewer at http://127.0.0.1:<port>" appears on the stream', async () => {
    const stream = new PassThrough();
    const portPromise = readPortFrom(stream);

    stream.write('Watching /some/dir for jsonl changes\n');
    stream.write('Viewer at http://127.0.0.1:4322\n');

    await expect(portPromise).resolves.toBe(4322);
  });
});
