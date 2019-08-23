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
            let documentName = "image_"; //editor.document.fileName;
            let time = moment().valueOf();
            // let time = moment().format("YY-MM-DD-HH:mm:ss");
            let pngName = documentName + time;
            let last = new vscode.Position(editor.document.lineCount, 0);
            editor.viewColumn
            switch (editor.document.languageId) {
                case "markdown":
                    editor.edit(edit => {
                        let currentString = `!` + `[` + pngName + `]` + `[` + pngName + `]`;
                        let lastString = `\n[` + pngName + `]:data:image/png;base64,` + dataUrl;
                        if (current.isEmpty) {
                            edit.insert(current.start, currentString);
                        } else {
                            edit.replace(current, currentString);
                        }
                        edit.insert(last, lastString);
                    });
                    break;
                default:
                    Logger.showErrorMessage("暂时不支持其他文档!");
                    break;
            }
        }
    }
}