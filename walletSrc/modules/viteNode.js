const isWindows = require('~app/modules/is-windows')();
const spawn = require('~app/modules/cross-spawn');
const fs = require('fs');
const path = require('path');

let binPath = '';
if (!isWindows) {
    binPath = path.join(global.APP_PATH, '/viteGoServer');
    fs.chmodSync(binPath, 0o777);
} else {
    binPath = path.join(global.APP_PATH, '/viteGoServer.exe');
}

let subProcess = null;

module.exports = {
    startIPCServer: function(cb) {
        subProcess = spawn(binPath, {
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
            subProcess = null;
        });
    },
    stopIPCServer: function() {
        subProcess && subProcess.unref();
    }
};