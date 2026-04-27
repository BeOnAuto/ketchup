"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readPortFrom = readPortFrom;
function readPortFrom(stream) {
    return new Promise((resolve, reject) => {
        let buffer = '';
        const onData = (chunk) => {
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
//# sourceMappingURL=read-port.js.map