const ipcBase = require('../../utils/ipc/index.js');

const VITE_WALLET_IPC = 'vite.ipc';
const FILE_PATH = global.goFile;

ipcBase.config.appspace = '';
ipcBase.config.socketRoot = FILE_PATH;
ipcBase.config.retry = 1000;
ipcBase.config.maxRetries = 5;
ipcBase.config.silent = true;

let rpcRequestId = 0;

class ipc {
    constructor() {
        this.__connectStatus = -1;

        ipcBase.connectTo(VITE_WALLET_IPC, function(){
            // listening connect
            ipcBase.of[VITE_WALLET_IPC].on('connect', function(){
                this.__connectStatus = 1;
            });

            // listening err
            ipcBase.of[VITE_WALLET_IPC].on('error', function(){
                if (ipcBase.of[VITE_WALLET_IPC].retriesRemaining === 0) {
                    ipcBase.disconnect(VITE_WALLET_IPC);
                    this.__connectStatus = 0;
                }
            });
        
            // listening disconnect
            ipcBase.of[VITE_WALLET_IPC].on('disconnect', function() {
                if (!ipcBase.of[VITE_WALLET_IPC] || 
                    !ipcBase.of[VITE_WALLET_IPC].retriesRemaining || 
                    ipcBase.of[VITE_WALLET_IPC].retriesRemaining <= 0) {
                    this.__connectStatus = 0;
                }
            });
        });

        const apiList = {
            wallet: [
                'ListAddress', 'NewAddress', 'Status', 'UnLock', 'Lock', 'ReloadAndFixAddressFile', 'IsMayValidKeystoreFile'
            ],
            ledger: [
                'CreateTxWithPassphrase', 'GetBlocksByAccAddr', 'GetUnconfirmedBlocksByAccAddr', 'GetAccountByAccAddr', 'GetUnconfirmedInfo', 'GetInitSyncInfo'
            ],
            p2p: [
                'NetworkAvailable'
            ]
        };
        for (let namespace in apiList) {
            apiList[namespace].forEach((func) => {
                let apiName = `${namespace}.${func}`;
                this[apiName] = netToIPC.bind(this, apiName);
            });
        }
    }
}

function netToIPC(methodName, arg) {
    if (this.__connectStatus === 0 || !ipcBase.of[VITE_WALLET_IPC]) {
        return Promise.reject({
            code: -5000,
            message: 'server error'
        });
    }

    // [TODO] go-api should use another rpc library
    // Simple compatible with this case.
    // If there is only one parameter, go-api needs an array containing this parameter.
    arg = arg === null ? undefined : arg;
    if (typeof arg !== 'object' && typeof arg !== 'undefined') {
        arg = [arg];
    }

    let payload = jsonrpcPayload(methodName, arg);
    ipcBase.of[VITE_WALLET_IPC].emit(methodName, payload);

    return new Promise((res, rej) => {
        // listening api
        ipcBase.of[VITE_WALLET_IPC].on(payload.id, function(data) {
            if (!data.error) {
                // [TODO] go-api should be perfect
                // Compatible: somtimes data.result is a json string, sometimes not.
                let result;
                try {
                    result = JSON.parse(data.result || '');
                } catch (e) {
                    result = data.result;    
                }

                res({
                    code: 0,
                    data: result
                });
                return;
            }
            rej({
                code: data.error.code,
                message: data.error.message || ''
            });
        });
    });
}

function jsonrpcPayload(method, params) {
    rpcRequestId++;
    return {
        jsonrpc: '2.0',
        id: rpcRequestId,
        method,
        params
    };
}

module.exports = ipc;