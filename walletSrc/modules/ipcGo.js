const ipcBase = require('~app/utils/ipc/index.js');

const VITE_WALLET_IPC = 'vite.ipc';
const FILE_PATH = global.GO_FILE;

ipcBase.config.appspace = '';
ipcBase.config.socketRoot = FILE_PATH;
ipcBase.config.retry = 100;
ipcBase.config.maxRetries = 5;
ipcBase.config.silent = true;

let rpcRequestId = 0;

class ipc {
    constructor() {
        this.__connectStatus = -1;

        ipcBase.connectTo(VITE_WALLET_IPC, () => {
            // listening connect
            ipcBase.of[VITE_WALLET_IPC].on('connect', () => {
                this.emitConnected(1);
            });

            // listening err
            ipcBase.of[VITE_WALLET_IPC].on('error', () => {
                console.log('error');

                if (ipcBase.of[VITE_WALLET_IPC].retriesRemaining === 0) {
                    ipcBase.disconnect(VITE_WALLET_IPC);
                    this.emitConnected(0);
                }
            });

            // listening disconnect
            ipcBase.of[VITE_WALLET_IPC].on('disconnect', () => {
                console.log('disconnect');
                if (!ipcBase.of[VITE_WALLET_IPC] || 
                        !ipcBase.of[VITE_WALLET_IPC].retriesRemaining ||
                        ipcBase.of[VITE_WALLET_IPC].retriesRemaining <= 0) {
                    this.emitConnected(0);
                }
            });
        });

        const apiList = {
            wallet: [
                'ListAddress', 'NewAddress', 'Status', 'UnLock', 'Lock', 'ReloadAndFixAddressFile', 'IsMayValidKeystoreFile', 'GetDataDir'
            ],
            ledger: [
                'CreateTxWithPassphrase', 'GetBlocksByAccAddr', 'GetUnconfirmedBlocksByAccAddr', 'GetAccountByAccAddr', 'GetUnconfirmedInfo', 'GetInitSyncInfo'
            ],
            p2p: [
                'NetworkAvailable'
            ],
            types: [
                'IsValidHexAddress', 'IsValidHexTokenTypeId'
            ]
        };
        for (let namespace in apiList) {
            apiList[namespace].forEach((func) => {
                let apiName = `${namespace}.${func}`;
                this[apiName] = netToIPC.bind(this, apiName);
            });
        }
    }

    emitConnected(connectStatus) {
        this.__connectStatus = connectStatus;
        this.__connectCB && this.__connectCB(connectStatus);
    }

    onConnected(cb) {
        if (this.__connectStatus === 1) {
            cb && cb(1);
            return;
        }
        this.__connectCB = cb;
    }

    disconnect() {
        ipcBase.disconnect(VITE_WALLET_IPC);
    }
}

function netToIPC(methodName, arg) {
    if (this.__connectStatus === 0 || !ipcBase.of[VITE_WALLET_IPC]) {
        return Promise.reject({
            code: -50000,
            message: 'IPC no connection.'
        });
    }

    // Simple compatible with this case.
    // If there is only one parameter, go-api needs an array containing this parameter.
    arg = arg === null ? undefined : arg;
    if (typeof arg !== 'object' && typeof arg !== 'undefined') {
        arg = [arg];
    }

    let payload = jsonrpcPayload(methodName, arg);
    // console.log('fetch', payload);
    ipcBase.of[VITE_WALLET_IPC].emit(methodName, payload);

    return new Promise((res, rej) => {
        // listening api
        ipcBase.of[VITE_WALLET_IPC].on(payload.id, function(data) {
            // console.log(data);

            // system error
            if (data.error) {
                return rej({
                    code: data.error.code,
                    message: data.error.message || ''
                });
            }

            // Compatible: somtimes data.result is a json string, sometimes not.
            let result;
            try {
                result = JSON.parse(data.result || '');
            } catch (e) {
                result = data.result;    
            }

            // server error
            if (result && result.code) {
                return rej({
                    code: result.code,
                    message: result.message || 'server error'
                });
            }

            // server success
            res(result);
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