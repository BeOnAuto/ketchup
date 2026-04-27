import type { Readable } from 'node:stream';

export function readPortFrom(stream: Readable): Promise<number> {
  return new Promise((resolve, reject) => {
    let buffer = '';
    const onData = (chunk: Buffer | string) => {
      buffer += chunk.toString();
      const match = buffer.match(/Viewer at http:\/\/127\.0\.0\.1:(\d+)/);
      if (match) {
        stream.off('data', onData);
        resolve(Number(match[1]));
      }
    };
    stream.on('data', onData);
    stream.once('error', reject);
  });
}
