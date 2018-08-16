const isWindows = require('~app/modules/is-windows')();
const spawn = require('~app/modules/cross-spawn');
const fs = require('fs');
const path = require('path');

let serverName = isWindows ? '/viteGoServer.exe' : '/viteGoServer';
let oldPath = path.join(global.APP_PATH, serverName);
let binPath = path.join(global.USER_DATA_PATH, serverName);

try {
    // [NOTICE] MAC: this file is read-only under the dmg, so move to /appData
    fs.existsSync(oldPath) && fs.writeFileSync(binPath, fs.readFileSync(oldPath));
    !isWindows && fs.chmodSync(binPath, 0o777);
} catch(err) {
    console.log(err);
}

let subProcess = null;

module.exports = {
    startIPCServer: function(cb) {
        if ( !fs.existsSync(binPath) ) {
            global.walletLog.error(`start ipc server, don\'t have ${binPath}`, false);
            return;
        }

        // [NOTICE] avoid multiple services open
        if (subProcess) {
            cb && cb();
            return;
        }

        global.walletLog.info('start open ipc server', false);

        let subPro = spawn(binPath, {
            stdio: [fs.openSync(global.SERVER_LOG_PATH, 'w'), 'pipe', fs.openSync(global.SERVER_LOG_PATH, 'w')]
        }, (error) => {
            error && global.walletLog.error({
                info: 'open ipc server error',
                error
            }, false);
        });

        subPro.once('error', error => {
            global.walletLog.error({
                info: 'ipc server error',
                error
            }, false);
        });
        
        subPro.stdout.on('data', data => {
            global.walletLog.info(data.toString(), false);

            if (data.toString().indexOf('Vite rpc start success!') < 0) {
                return;
            }

            subProcess = subPro;
            cb && cb();
        });
        
        subPro.on('close', (code) => { 
            global.walletLog.info({
                info: 'ipc server quit',
                code
            });
            // Close: clear subProcess
            subProcess = null;
        });
    },
    
    stopIPCServer
};

function stopIPCServer () {
    global.walletLog.info({
        info: 'stop ipc server ?',
        subProcess: !!subProcess
    });

    if (!subProcess) {
        return;
    }

    global.walletLog.info('stop ipc server');
    if (isWindows) {
        spawn('taskkill /pid ' + subProcess.pid + ' /T /F');
        return;
    }
    subProcess.kill('SIGHUP');
}
