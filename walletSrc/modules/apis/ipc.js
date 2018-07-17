const ipc = require('../../../utils/ipc/index.js');
const os = require('os');
const path = require('path');

const VITE_WALLET_IPC = 'vite.ipc';
const NAMESPACE = 'wallet';
const FILE_PATH = path.join(os.homedir(), '/viteisbest/');

ipc.config.appspace = '';
ipc.config.socketRoot = FILE_PATH;
ipc.config.retry = 1000;
ipc.config.maxRetries = 5;
ipc.config.silent = true;

let rpcRequestId = 0;

function jsonrpcPayload(methodName, params) {
    rpcRequestId++;
    return {
        jsonrpc: '2.0',
        id: rpcRequestId,
        method: `${NAMESPACE}.${methodName}`,
        params
    };
}

function netToIPC (methodName, arg, cb) {
    // Simple compatible with this case
    // If there is only one parameter, go-api needs an array containing this parameter
    if (typeof arg !== 'object' && arg) {
        arg = [arg];
    }

    ipc.connectTo(VITE_WALLET_IPC, function(){
        let payload = jsonrpcPayload(methodName, arg);
        let res = (msg) => {
            payload = null;
            cb && cb(msg);
        };

        // listening connect
        ipc.of[VITE_WALLET_IPC].on('connect', function(){
            console.log('connect');
            ipc.of[VITE_WALLET_IPC].emit(`${NAMESPACE}.${methodName}`, payload);
        });

        // listening err
        ipc.of[VITE_WALLET_IPC].on('error', function(e){
            if (ipc.of[VITE_WALLET_IPC].retriesRemaining === 0) {
                ipc.disconnect(VITE_WALLET_IPC);
                res({
                    code: -50000,
                    message: e
                });
            }
        });
    
        // listening disconnect
        // ipc.of[VITE_WALLET_IPC].on('disconnect', function() {
        //     console.log('disconnect');
        // });
    
        // listening api
        ipc.of[VITE_WALLET_IPC].on(payload.id, function(data) {
            ipc.disconnect(VITE_WALLET_IPC);
            if (!data.error) {
                res({
                    code: 0,
                    data
                });
                return;
            }
            res({
                code: data.error.code,
                message: data.error.message || ''
            });
        });
    });
}

const apiList = ['ListAddress', 'NewAddress', 'Status', 'UnLock', 'Lock', 'ReloadAndFixAddressFile', 'IsMayValidKeystoreFile'];
let rpcAPI = {};
apiList.forEach((apiName) => {
    rpcAPI[apiName] = netToIPC.bind(null, apiName);
});

module.exports = rpcAPI;
