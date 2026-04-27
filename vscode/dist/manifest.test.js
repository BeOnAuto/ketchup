"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const vitest_1 = require("vitest");
(0, vitest_1.describe)('vscode extension manifest', () => {
    (0, vitest_1.it)('declares the ketchup.openViewer command and points main at the compiled entry', () => {
        const manifest = JSON.parse((0, node_fs_1.readFileSync)((0, node_path_1.join)(__dirname, '..', 'package.json'), 'utf8'));
        (0, vitest_1.expect)({
            commands: manifest.contributes.commands.map((c) => c.command),
            main: manifest.main,
        }).toEqual({
            commands: ['ketchup.openViewer'],
            main: './dist/extension.js',
        });
    });
});
//# sourceMappingURL=manifest.test.js.map