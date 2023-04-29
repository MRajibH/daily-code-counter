import * as vscode from 'vscode';

let languageCounts: Map<string, number> = new Map();
let today: string = new Date().toDateString();
let totalLines: number = 0;
let lineCounterStatusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    // Define a command to reset the line count for all languages
    let resetLineCounts = vscode.commands.registerCommand('extension.resetLineCounts', () => {
        languageCounts.clear();
        totalLines = 0;
        today = new Date().toDateString();
        updateStatusBar();
    });

    // Create a status bar item to show the line count
    lineCounterStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    lineCounterStatusBarItem.text = `$(code) ${today}: ${totalLines} lines`;
    lineCounterStatusBarItem.tooltip = "Line counter";
    lineCounterStatusBarItem.show();

    // Subscribe to changes in the active text editor
    vscode.window.onDidChangeActiveTextEditor(updateLineCount);

    // Subscribe to changes in the text document
    vscode.workspace.onDidChangeTextDocument(updateLineCount);

    // Register the reset command and update the status bar
    context.subscriptions.push(resetLineCounts);
    updateStatusBar();
}

export function deactivate() {
    lineCounterStatusBarItem.dispose();
}

// Update the line count and status bar
let updateLineCount = () => {
    let editor = vscode.window.activeTextEditor;
    if (editor) {
        let language = editor.document.languageId;
        let currentCount = languageCounts.get(language) || 0;
        languageCounts.set(language, currentCount + 1);
        totalLines++;
        updateStatusBar();
    }
};

// Update the status bar with the current line counts
let updateStatusBar = () => {
    let totalCount = totalLines;
    let statusBarText = `$(code) ${today}: ${totalCount} lines`;
    for (let [language, count] of languageCounts) {
        statusBarText += ` | ${count} ${language}`;
    }
    lineCounterStatusBarItem.text = statusBarText;
};

