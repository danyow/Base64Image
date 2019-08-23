import * as vscode from 'vscode';
import { base64image } from './base64image';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('extension.base64image', () => {
		base64image.paste();
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
