import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

interface Manifest {
  contributes: {
    commands: Array<{ command: string; title: string }>;
  };
  main: string;
  scripts: Record<string, string>;
}

describe('vscode extension manifest', () => {
  it('declares the ketchup.openViewer command and runs asset-copy before tsc on build', () => {
    const manifest = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8')) as Manifest;

    expect({
      commands: manifest.contributes.commands.map((c) => c.command),
      main: manifest.main,
      buildCopiesAssetsFirst: manifest.scripts.build?.includes('copy:assets'),
    }).toEqual({
      commands: ['ketchup.openViewer'],
      main: './dist/extension.js',
      buildCopiesAssetsFirst: true,
    });
  });
});
