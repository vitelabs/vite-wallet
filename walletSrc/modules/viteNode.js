const isWindows = require('~app/modules/is-windows')();
const spawn = require('~app/modules/cross-spawn');
const fs = require('fs');
const path = require('path');

let serverName = isWindows ? '/viteGoServer.exe' : '/viteGoServer';
let binPath = path.join(global.APP_PATH, serverName);

if (!isWindows) {
    let oldPath = binPath;
    binPath = path.join(global.USER_DATA_PATH, serverName);
    try {
        // [NOTICE] MAC: this file is read-only under the dmg, so move to /appData
        fs.existsSync(oldPath) && fs.writeFileSync(binPath, fs.readFileSync(oldPath));
        fs.chmodSync(binPath, 0o777);
    } catch(err) {
        global.walletLog.error(`Init server: ${JSON.stringify(err)}`);
    }
}

let subProcess = null;

module.exports = {
    startIPCServer: function(cb) {
        if ( !fs.existsSync(binPath) ) {
            global.walletLog.error(`Don\'t have ${binPath}`, false);
            return;
        }

        // [NOTICE] Avoid multiple services open
        if (subProcess) {
            global.walletLog.info('Avoid multiple Vite-go-services open.', false);
            cb && cb();
            return;
        }

        global.walletLog.info('Vite-go-server ready to start.', false);

        let subPro = spawn(binPath, {
            stdio: [fs.openSync(global.SERVER_LOG_PATH, 'w'), 'pipe', fs.openSync(global.SERVER_LOG_PATH, 'w')]
        }, (error) => {
            error && global.walletLog.error({
                info: 'Vite-go-server error occurred during opening.',
                error
            }, false);
        });

        subPro.once('error', error => {
            global.walletLog.error({
                info: 'Vite-go-server has encountered an error',
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
                info: 'Vite-go-server has closed',
                code
            });

            // Clear subProcess
            subPro === subProcess && (subProcess = null);
        });
    },
    
    stopIPCServer
};

function stopIPCServer (cb) {
    global.walletLog.info(`Has vite-go-server? ${!!subProcess}`);

    if (!subProcess) {
        cb && cb();
        return;
    }

    global.walletLog.info('Start to stop vite-go-server.');

    if (isWindows) {
        spawn('taskkill /pid ' + subProcess.pid + ' /T /F');
        global.walletLog.info('Stop vite-go-server success.');
        cb && cb();
        return;
    }

    subProcess.on('close', (code) => {
        global.walletLog.info({
            info: 'Stop vite-go-server success.',
            code
        });
        cb && cb();
    });

    subProcess.kill('SIGHUP');
}
