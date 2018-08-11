const path = require('path');
const { startIPCServer } = require( path.join(global.APP_PATH, '/walletSrc/modules/viteNode.js') );

function connectGoServer() {
    global.goViteIPC.connectTo();
    global.goViteIPC.onConnected(function (connectStatus) {
        if (!connectStatus) {
            console.log('error: can not connect to go-server');
            return;
        }
        global.viteEventEmitter.emit('ipcReady');
    });
}

module.exports = function() {
    // Try to connect
    global.goViteIPC.connectTo();
    global.goViteIPC.onConnected(function (connectStatus) {
        // Server already start
        if (connectStatus) {
            global.viteEventEmitter.emit('serverStatus', 1);
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
