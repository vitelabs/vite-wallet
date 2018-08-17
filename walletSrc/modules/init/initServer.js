const path = require('path');
const { startIPCServer } = require( path.join(global.APP_PATH, '/walletSrc/modules/viteNode.js') );

let ipcConnectEvent = null;

function connectGoServer() {
    global.goViteIPC.connectTo();
    global.goViteIPC.onConnected(function (connectStatus) {
        if (ipcConnectEvent) {
            return;
        }

        console.log('connectGoServer', connectStatus);
        if (!connectStatus) {
            console.log('error: can not connect to go-server');
            return;
        }

        global.viteEventEmitter.emit('ipcReady');
        on();
    });
}

module.exports = function() {
    // Try to connect
    global.goViteIPC.connectTo();
    global.goViteIPC.onConnected(function (connectStatus) {
        console.log('start  first  connectGoServer', connectStatus);

        // Server already start
        if (connectStatus) {
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

    ipcConnectEvent = global.viteEventEmitter.on('ipcConnect', function(connectStatus) {
        console.log('onipc', connectStatus);

        if (connectStatus !== 0) {
            return;
        }

        setTimeout(()=>{
            startIPCServer(()=>{
                global.goViteIPC.connectTo();
            });
        }, 5000);
    });
}
