const ipcBase = require('~app/utils/ipc/index.js');

const VITE_WALLET_IPC = 'vite.ipc';
const FILE_PATH = global.GO_FILE;

ipcBase.config.appspace = FILE_PATH;
ipcBase.config.retry = 100;
ipcBase.config.maxRetries = 5;

let rpcRequestId = 0;

class ipc {
    constructor() {
        this.__connectStatus = -1;

        const apiList = {
            wallet: [
                'ListAddress', 'NewAddress', 'Status', 'UnLock', 'Lock', 'ReloadAndFixAddressFile', 'IsMayValidKeystoreFile', 'GetDataDir'
            ],
            ledger: [
                'CreateTxWithPassphrase', 'GetBlocksByAccAddr', 'GetUnconfirmedBlocksByAccAddr', 'GetAccountByAccAddr', 'GetUnconfirmedInfo', 'GetInitSyncInfo', 'GetSnapshotChainHeight'
            ],
            p2p: [
                'NetworkAvailable'
            ],
            types: [
                'IsValidHexAddress', 'IsValidHexTokenTypeId'
            ],
            common: [
                'LogDir'
            ]
        };
        for (let namespace in apiList) {
            apiList[namespace].forEach((func) => {
                let apiName = `${namespace}.${func}`;
                this[apiName] = netToIPC.bind(this, apiName);
            });
        }
    }

    connectTo(cb) {
        ipcBase.connectTo(VITE_WALLET_IPC, () => {
            // Listening connect
            ipcBase.of[VITE_WALLET_IPC].on('connect', () => {
                global.walletLog.info('GoViteIPC connected successfully');

                this.__connectStatus = 1;
                cb && cb();
            });

            // Listening err
            ipcBase.of[VITE_WALLET_IPC].on('error', (err) => {
                console.log('error');
                // if (ipcBase.of[VITE_WALLET_IPC].retriesRemaining === 0) {
                //     console.log('???');
                //     cb && cb();
                // }
            });

            // Listening disconnect
            ipcBase.of[VITE_WALLET_IPC].on('disconnect', () => {
                console.log('disconnect');

                if (!ipcBase.of[VITE_WALLET_IPC] || 
                        !ipcBase.of[VITE_WALLET_IPC].retriesRemaining ||
                        ipcBase.of[VITE_WALLET_IPC].retriesRemaining <= 0) {
                    global.walletLog.info('GoViteIPC is disconnected');
                    console.log('???');
                    
                    this.__connectStatus = 0;
                    cb && cb();
                }
            });
        });
    }

    disconnect() {
        ipcBase.disconnect(VITE_WALLET_IPC);
    }
}

function netToIPC(methodName, arg) {
    if (this.__connectStatus !== 1 || !ipcBase.of[VITE_WALLET_IPC]) {
        global.walletLog.error(`GoViteIPC APIs ${methodName}: IPC no connection.`);

        return Promise.reject({
            code: -50000,
            message: 'IPC no connection.'
        });
    }

    let requestId = rpcRequestId;
    rpcRequestId++;

    global.walletLog.info(`GoViteIPC APIs ${methodName} ${requestId}`);
    ipcBase.of[VITE_WALLET_IPC].emit(requestId, methodName, arg);

    return new Promise((res, rej) => {
        // Listening api
        ipcBase.of[VITE_WALLET_IPC].on(requestId, function(data) {
            global.walletLog.info(`GoViteIPC APIs responce ${methodName} ${requestId}: ${JSON.stringify(data)}`);

            // system error
            if (data.error) {
                return rej({
                    code: data.error.code,
                    message: data.error.message || ''
                });
            }

            let result = data.result || {};

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

module.exports = ipc;
