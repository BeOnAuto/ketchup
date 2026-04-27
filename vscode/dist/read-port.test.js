"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_stream_1 = require("node:stream");
const vitest_1 = require("vitest");
const read_port_1 = require("./read-port");
(0, vitest_1.describe)('readPortFrom', () => {
    (0, vitest_1.it)('resolves with the port once "Viewer at http://127.0.0.1:<port>" appears on the stream', async () => {
        const stream = new node_stream_1.PassThrough();
        const portPromise = (0, read_port_1.readPortFrom)(stream);
        stream.write('Watching /some/dir for jsonl changes\n');
        stream.write('Viewer at http://127.0.0.1:4322\n');
        await (0, vitest_1.expect)(portPromise).resolves.toBe(4322);
    });
});
//# sourceMappingURL=read-port.test.js.map