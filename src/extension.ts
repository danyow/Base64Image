import * as vscode from 'vscode';
import { Base64Image } from './Base64Image';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('extension.base64image', () => {
		Base64Image.paste();
	});
	context.subscriptions.push(disposable);
}

export function deactivate() {}
