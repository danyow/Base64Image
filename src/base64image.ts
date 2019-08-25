import * as vscode from 'vscode';
import * as path from 'path';
import { Logger } from './Logger';
import { spawn } from 'child_process';
import moment = require('moment');

export class Base64Image {
    //Class name must be in pascal case
	public static paste() {
        Logger.showInformationMessage("准备粘贴!");
        switch (process.platform) {
            case "darwin":
                let scriptPath = path.join(__dirname, '../res/main.py');
                Logger.showInformationMessage(scriptPath);
        
                let pyscript = spawn('python3', [scriptPath]);
        
                pyscript.on('close', function(e) {
                    if (e == 0) {
                        Logger.showInformationMessage("Python脚本执行成功!");
                    } else {
                        Logger.showErrorMessage("Python脚本执行失败!");
                    }
                });
        
                pyscript.on('exit', function(code, signal) {
                    console.log('exit', code, signal);
                });
        
                pyscript.stdout.on('data', function (data: Buffer) {
                    let result = data.toString().trim();
                    if (result == "no image") {
                        Logger.showErrorMessage("当前剪切板里面没有图片!");
                        return;
                    }
                    Base64Image.renderFile(result);
                });
                break;
        
            default:
                Logger.showErrorMessage("暂时只支持mac平台!");
                break;
        }
    }
    
    public static renderFile(dataUrl: string) {
        let editor = vscode.window.activeTextEditor;
        if (editor) {

            let current = editor.selection;
            // 文件名|年-月-日_时:分:秒 
            // 秒删除!
            let pngName = "${TM_FILENAME_BASE}|${CURRENT_YEAR_SHORT}-${CURRENT_MONTH}-${CURRENT_DATE}_${CURRENT_HOUR}:${CURRENT_MINUTE}";
            let last = new vscode.Position(editor.document.lineCount, 0);
            let currentSnippet = new vscode.SnippetString(`!` + '[${TM_LINE_NUMBER}]' + `[` + pngName + `]`);
            let lastSnippet = new vscode.SnippetString(`\n[` + pngName + `]:data:image/png;base64,` + dataUrl); 
            switch (editor.document.languageId) {
                case "markdown":
                    // 先插入最底下的
                    editor.insertSnippet(lastSnippet, last);
                    editor.insertSnippet(currentSnippet, current);
                    break;
                default:
                    Logger.showErrorMessage("暂时不支持其他文档!");
                    break;
            }
        }
    }
}