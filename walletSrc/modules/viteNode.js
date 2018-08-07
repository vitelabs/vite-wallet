const isWindows = require('~app/modules/is-windows')();
const spawn = require('~app/modules/cross-spawn');
const fs = require('fs');
const path = require('path');

let binPath = '';
if (!isWindows) {
    // [NOTICE] MAC: this file is read-only under the dmg, so move to /appData
    binPath = path.join(global.APP_DATA_PATH, '/viteGoServer');
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
        console.log('startIPCServer');
        // [NOTICE] avoid multiple services open
        stopIPCServer();

        let subPro = spawn(binPath, {
            stdio: ['ignore', 'pipe', fs.openSync(global.SERVER_LOG_PATH, 'w')]
        }, (error) => {
            error && console.log('error', error);
        });

        subPro.once('error', error => {
            console.log('error', error);
        });
        
        subPro.stdout.on('data', data => {
            console.log(data.toString());
            if (data.toString().indexOf('Vite rpc start success!') < 0) {
                return;
            }
            console.log('start ipc Server');
            // Start: Assign subPro to subProcess
            subProcess = subPro;
            cb && cb();
        });
        
        subPro.on('close', (code) => { 
            console.log(`quit code: ${code}`);
            // Close: clear subProcess
            subProcess = null;
        });
    },
    
    stopIPCServer
};

function stopIPCServer () {
    console.log(`subProcess: ${!!subProcess}`);
    if (!subProcess) {
        return;
    }
    if (isWindows) {
        spawn('taskkill /pid ' + subProcess.pid + ' /T /F');
        return;
    }
    subProcess.kill('SIGHUP');
}
