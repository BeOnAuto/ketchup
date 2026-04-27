import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import * as vscode from 'vscode';

import { prepareWebviewHtml } from './prepare-webview-html';
import { spawnViewer, type ViewerHandle } from './spawn-viewer';

let activeViewer: ViewerHandle | null = null;

export function activate(context: vscode.ExtensionContext): void {
  const command = vscode.commands.registerCommand('ketchup.openViewer', async () => {
    if (activeViewer) {
      activeViewer.process.kill();
      activeViewer = null;
    }

    const scriptPath = join(context.extensionPath, 'media', 'scripts', 'events-viewer.js');
    const dbPath = join(context.globalStorageUri.fsPath, 'events.db');
    try {
      activeViewer = await spawnViewer(scriptPath, dbPath, 4321, spawn);
    } catch (error) {
      vscode.window.showErrorMessage(`Ketchup Viewer failed to start: ${(error as Error).message}`);
      return;
    }

    const panel = vscode.window.createWebviewPanel('ketchupViewer', 'Ketchup Viewer', vscode.ViewColumn.Beside, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });

    const viewerDistDir = vscode.Uri.file(join(context.extensionPath, 'media', 'viewer'));
    const indexHtml = readFileSync(join(viewerDistDir.fsPath, 'index.html'), 'utf8');
    const assetBase = panel.webview.asWebviewUri(viewerDistDir).toString();
    panel.webview.html = prepareWebviewHtml(indexHtml, {
      assetBase,
      apiBase: `http://127.0.0.1:${activeViewer.port}`,
    });

    panel.onDidDispose(() => {
      activeViewer?.process.kill();
      activeViewer = null;
    });
  });

  context.subscriptions.push(command);
}

export function deactivate(): void {
  activeViewer?.process.kill();
  activeViewer = null;
}
