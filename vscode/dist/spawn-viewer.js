"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnViewer = spawnViewer;
const read_port_1 = require("./read-port");
async function spawnViewer(scriptPath, dbPath, startPort, spawn) {
    const child = spawn('node', [scriptPath, dbPath, String(startPort)]);
    if (!child.stdout) {
        throw new Error('spawned viewer has no stdout');
    }
    const port = await (0, read_port_1.readPortFrom)(child.stdout);
    return { process: child, port };
}
//# sourceMappingURL=spawn-viewer.js.map