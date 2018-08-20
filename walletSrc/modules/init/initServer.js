const path = require('path');
const { startIPCServer } = require( path.join(global.APP_PATH, '/walletSrc/modules/viteNode.js') );

let ipcConnectEvent = null;

function connectGoServer() {
    global.goViteIPC.connectTo(function () {
        if (ipcConnectEvent) {
            return;
        }

        if (!global.goViteIPC.__connectStatus) {
            global.walletLog.error('Can not connect to GoVite IPC server.');
            return;
        }

        global.walletLog.info('GoVite IPC server has started.');
        global.viteEventEmitter.emit('ipcReady');
        on();
    });
}

module.exports = function() {
    // Try to connect goViteServer
    global.goViteIPC.connectTo(function () {
        // Server already start
        if (global.goViteIPC.__connectStatus) {
            global.walletLog.info('GoVite IPC server is already start.');

            global.viteEventEmitter.emit('serverStatus', 1);
            global.viteEventEmitter.emit('ipcReady');
            on();
            return;
        }

        // Start server
        global.viteEventEmitter.emit('serverStatus', 0);

        startIPCServer(function () {
            // Server OK
            global.viteEventEmitter.emit('serverStatus', 1);
            connectGoServer();
        });
    });
};

function on() {
    if (ipcConnectEvent) {
        return;
    }

    ipcConnectEvent = global.viteEventEmitter.on('ipcDisconnect', function() {
        global.walletLog.info('GoVite IPC server is closed.');

        setTimeout(()=>{
            global.walletLog.info('Start to restart GoVite IPC server.');

            startIPCServer(()=>{
                global.goViteIPC.connectTo();
            });
        }, 5000);
    });
}
