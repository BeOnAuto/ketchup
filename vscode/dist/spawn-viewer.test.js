"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_events_1 = require("node:events");
const node_stream_1 = require("node:stream");
const vitest_1 = require("vitest");
const spawn_viewer_1 = require("./spawn-viewer");
(0, vitest_1.describe)('spawnViewer', () => {
    (0, vitest_1.it)('spawns node with the given script and resolves with the reported port', async () => {
        const stdout = new node_stream_1.PassThrough();
        const fakeChild = Object.assign(new node_events_1.EventEmitter(), { stdout, kill: vitest_1.vi.fn() });
        const spawn = vitest_1.vi.fn(() => fakeChild);
        const promise = (0, spawn_viewer_1.spawnViewer)('/path/to/events-viewer.js', '/tmp/events.db', 4321, spawn);
        stdout.write('Viewer at http://127.0.0.1:4324\n');
        const handle = await promise;
        (0, vitest_1.expect)({
            spawnArgs: spawn.mock.calls[0],
            port: handle.port,
            sameProcess: handle.process === fakeChild,
        }).toEqual({
            spawnArgs: ['node', ['/path/to/events-viewer.js', '/tmp/events.db', '4321']],
            port: 4324,
            sameProcess: true,
        });
    });
});
//# sourceMappingURL=spawn-viewer.test.js.map