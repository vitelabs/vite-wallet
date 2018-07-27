const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');

const binPath = path.join(global.APP_PATH, '/viteGoServer');
fs.chmodSync(binPath, 0o777);

module.exports = function(cb) {
    const subProcess = execFile(binPath, {
        maxBuffer: 500 * 1024
    }, (error) => {
        if (error) {
            throw error;
        }
    });

    subProcess.once('error', error => {
        console.log('error', error);
    });
    
    subProcess.stdout.on('data', data => {
        if (data.toString().indexOf('Vite rpc start success!') < 0) {
            return;
        }
        console.log('start ipc Server');
        cb && cb();
    });
    
    subProcess.on('close', (code) => { 
        console.log(`quit code: ${code}`);
    });
};