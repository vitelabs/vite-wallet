const isWindows = require('~app/modules/is-windows')();
const spawn = require('~app/modules/cross-spawn');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

let binPath = '';
if (!isWindows) {
    // [NOTICE] MAC: this file is read-only under the dmg, so move to /appData
    binPath = path.join(app.getPath('appData'), '/viteGoServer');
    fs.writeFileSync(binPath, fs.readFileSync(path.join(global.APP_PATH, '/viteGoServer')));
    try {
        fs.chmodSync(binPath, 0o777);
    } catch(err) {
        console.log(err);
    }
} else {
    binPath = path.join(global.APP_PATH, '/viteGoServer.exe');
}

let subProcess = null;

module.exports = {
    startIPCServer: function(cb) {
        subProcess = spawn(binPath, {
            stdio: ['ignore', 'pipe', 'ignore']
            // stdio: ['ignore', 'pipe', fs.openSync('./err.out', 'w')]
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
        subProcess && subProcess.kill('SIGHUP');
    }
};