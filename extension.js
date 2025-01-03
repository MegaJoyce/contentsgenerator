// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
let existedIDs = {};
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	
	console.log('"TOC Generator for Markdown" is now active.');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable1 = vscode.commands.registerCommand('tocgenerator.generateContentsTable', function () {
		let activeEditor = vscode.window.activeTextEditor;
		// if no active markdown file
		if (!activeEditor) {
			vscode.window.showInformationMessage('Please select a Markdown file.');
            return;
		}
		// get text of active window
		const text = activeEditor.document.getText();
		try {
			const table = generateTOC(text);
			activeEditor.edit(edit => {
				edit.insert(new vscode.Position(0, 0), table);
			})
		} catch (e) {
			vscode.window.showErrorMessage(e);
            return;
		}
		vscode.window.showInformationMessage('Table of contents generated successfully.');
	});

	const disposable2 = vscode.commands.registerCommand('tocgenerator.generateContentsTablegh', function () {
		let activeEditor = vscode.window.activeTextEditor;
		// if no active markdown file
		if (!activeEditor) {
			vscode.window.showInformationMessage('Please select a Markdown file.');
            return;
		}
		// get text of active window
		const text = activeEditor.document.getText();
		try {
			const table = generateTOCgh(text);
			activeEditor.edit(edit => {
				edit.insert(new vscode.Position(0, 0), table);
			})
		} catch (e) {
			vscode.window.showErrorMessage(e);
            return;
		}
		vscode.window.showInformationMessage('Table of contents generated successfully.');
	});

	context.subscriptions.push(disposable1, disposable2);
}

function generateTOC(text){
	existedIDs = {}; // Reset IDs
	// Object.keys(existedIDs).forEach(key => delete existedIDs[key]); 
	const lines = text.split("\n");
	const table = new Array();
	lines.forEach(line => {
		if (line.startsWith('#')){
			// count the number of #
			const headerLevel = line.match(/^#+/);
			// remove the # for the title text
			const headerText = line.replace(/^#+\s*/, '').trim();
			// level 1 zero spaces, level 2 two spaces
			const indent = ' '.repeat((headerLevel[0].length - 1) * 2);
			// generate unique anchor ID
			const uniqAnchor = generateUniqueAnchorID(headerText);
			table.push(`${indent}* [${headerText}](#${uniqAnchor})  `);
		}
	});
	return table.join('\n') + '\n---\n'
}

function generateTOCgh(text){
	existedIDs = {}; // Reset IDs
	// Object.keys(existedIDs).forEach(key => delete existedIDs[key]); 
	const lines = text.split("\n");
	const table = new Array();
	lines.forEach(line => {
		if (line.startsWith('#')){
			// count the number of #
			const headerLevel = line.match(/^#+/);
			// remove the # for the title text
			const headerText = line.replace(/^#+\s*/, '').trim();
			// level 1 zero spaces, level 2 two spaces
			const indent = ' '.repeat((headerLevel[0].length - 1) * 2);
			// generate unique anchor ID
			const uniqAnchor = generateUniqueAnchorIDgh(headerText);
			table.push(`${indent}* [${headerText}](#${uniqAnchor})  `);
		}
	});
	return table.join('\n') + '\n---\n'
}

function generateAnchorID(header) {
	// trim spaces and lowercase letters
    header = header.trim().toLowerCase();
	// replace spaces with hyphens
    header = header.replace(/\s+/g, ' ');
	// collapse multiple spaces into one single space
    header = header.replace(/\s+/g, '-');
    // remove non-alphanumeric characters but keep hyphens
    header = header.replace(/[^a-z0-9-\p{Emoji_Presentation}\p{Emoji_Modifier_Base}\p{Emoji_Component}]/gu, '');
	// remove leading and trailing hyphens
    if (header.endsWith('-')) {
        header = header.slice(0, -1);
    }
	if (header.startsWith('-')) {
        header = header.slice(1, header.length);
    }
    // Ensure the anchor ID works for both the editor and preview (i.e., avoid leading/trailing hyphen conflicts)
    if (header === '') {
        return 'empty-header';  // Return a default ID if header is empty
    }
    // return link
    return header;
}

function generateAnchorIDgh(header) {
	// trim spaces and lowercase letters
    header = header.trim().toLowerCase();
	// replace spaces with hyphens
    header = header.replace(/\s/g, '-');
    // remove non-alphanumeric characters but keep hyphens
    header = header.replace(/[^a-z0-9-]/g, '');
    // Ensure the anchor ID works for both the editor and preview (i.e., avoid leading/trailing hyphen conflicts)
    if (header === '') {
        return 'empty-header';  // Return a default ID if header is empty
    }
    // return link
    return header;
}

function generateUniqueAnchorID(header) {
	// use map to record the duplicated anchor ID
	let uniqueAnchorID = generateAnchorID(header);
	if (uniqueAnchorID in existedIDs) {
		existedIDs[uniqueAnchorID] += 1;
		uniqueAnchorID = `${uniqueAnchorID}-${existedIDs[uniqueAnchorID]}`;
	} else {
		existedIDs[uniqueAnchorID] = 0;
	}
	return uniqueAnchorID;
}

function generateUniqueAnchorIDgh(header) {
	// use map to record the duplicated anchor ID
	let uniqueAnchorID = generateAnchorIDgh(header);
	if (uniqueAnchorID in existedIDs) {
		existedIDs[uniqueAnchorID] += 1;
		uniqueAnchorID = `${uniqueAnchorID}-${existedIDs[uniqueAnchorID]}`;
	} else {
		existedIDs[uniqueAnchorID] = 0;
	}
	return uniqueAnchorID;
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate,
	generateTOC,
    generateAnchorID,
    generateUniqueAnchorID
}
