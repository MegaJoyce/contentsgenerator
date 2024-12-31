// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('"Contents Generator for Markdown" is now active.');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('contentsgenerator.generateContentsTable', function () {
		let activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			vscode.window.showInformationMessage('No active editor selected.');
            return;
		}
		const text = activeEditor.document.getText();
		try {
			const lines = text.split("\r\n");
			const table = new Array();
			lines.forEach(line => {
				if (line.startsWith('#')){
					const itemTitle = line.replace('#### ', '      * [')
					        .replace('### ', '    * [')
							.replace('## ', '  * [')
							.replace('# ', '* [');
					const itemLink = itemTitle.toLowerCase().trim().replace('*', '').trim().replace(/\s/g, '-').replace('[','');
					table.push(`${itemTitle}](#${itemLink})<br>`);
				}
			});
			activeEditor.edit(edit => {
				edit.insert(new vscode.Position(0, 0), table.join('\r\n') + '\r\n---\r\n');
			})
		} catch (e) {
			vscode.window.showErrorMessage(e);
            return;
		}
		vscode.window.showInformationMessage('Markdown contents table generated successfully.');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
