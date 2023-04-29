"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
let languageCounts = new Map();
let today = new Date().toDateString();
let totalLines = 0;
let lineCounterStatusBarItem;
function activate(context) {
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
exports.activate = activate;
function deactivate() {
    lineCounterStatusBarItem.dispose();
}
exports.deactivate = deactivate;
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
//# sourceMappingURL=extension.js.map