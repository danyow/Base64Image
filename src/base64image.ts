import * as path from 'path';
import { logger } from './logger';
import { spawn } from 'child_process';

export class base64image {

	public static paste() {
        logger.showInformationMessage("准备粘贴!");

        // let platform = process.platform;

        // if (platform === "darwin") {
            
        // }

        let scriptPath = path.join(__dirname, '../res/main.py');
        logger.showInformationMessage(scriptPath);

        let pyscript = spawn('python3', [scriptPath]);

        pyscript.on('close', function(e) {
            logger.showErrorMessage(e.toString());
        });

        pyscript.on('exit', function(code, signal) {
            console.log('exit', code, signal);
        });

        pyscript.stdout.on('data', function (data: Buffer) {
            // console.log(data);
            let result = data.toString().trim();
            if (result == "no image") {
                return;
            }
            console.log(data.toString().trim());
        });
	}
}