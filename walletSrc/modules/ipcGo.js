const ipcBase = require('~app/utils/ipc/index.js');

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
        this.dataDIR = '';

        ipcBase.connectTo(VITE_WALLET_IPC, () => {
            // listening connect
            ipcBase.of[VITE_WALLET_IPC].on('connect', () => {
                this.emitConnected(1);
            });

            // listening err
            ipcBase.of[VITE_WALLET_IPC].on('error', () => {
                if (ipcBase.of[VITE_WALLET_IPC].retriesRemaining === 0) {
                    ipcBase.disconnect(VITE_WALLET_IPC);
                    this.emitConnected(0);
                }
            });
        
            // listening disconnect
            ipcBase.of[VITE_WALLET_IPC].on('disconnect', () => {
                if (!ipcBase.of[VITE_WALLET_IPC] || 
                    !ipcBase.of[VITE_WALLET_IPC].retriesRemaining || 
                    ipcBase.of[VITE_WALLET_IPC].retriesRemaining <= 0) {
                    this.emitConnected(0);
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

    emitConnected(connectStatus) {
        this.__connectStatus = connectStatus;
        if (!this.__connectStatus) {
            return;
        }

        // netToIPC.bind(this, 'wallet.GetDataDir')().then((data)=>{
        //     console.log(data);
        // });
        this.__connectCB && this.__connectCB();
    }

    onConnected(cb) {
        if (this.__connectStatus === 1) {
            cb && cb();
            return;
        }
        this.__connectCB = cb;
    }
}

function netToIPC(methodName, arg) {
    if (this.__connectStatus === 0 || !ipcBase.of[VITE_WALLET_IPC]) {
        return Promise.reject({
            code: -5000,
            message: 'server error'
        });
    }

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
                // Compatible: somtimes data.result is a json string, sometimes not.
                let result;
                try {
                    result = JSON.parse(data.result || '');
                } catch (e) {
                    result = data.result;    
                }

                if (data.code) {
                    rej({
                        code: data.code,
                        msg: data.message || 'server error'
                    });
                    return;
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