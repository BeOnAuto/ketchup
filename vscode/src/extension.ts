import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext): void {
  const command = vscode.commands.registerCommand('ketchup.openViewer', () => {
    vscode.window.showInformationMessage('Ketchup Viewer: scaffold ready, server spawn lands in a follow-up burst');
  });
  context.subscriptions.push(command);
}

export function deactivate(): void {}
