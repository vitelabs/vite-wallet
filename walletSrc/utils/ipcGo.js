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

    setConfig({
        retry = 100, maxRetries = 5
    }) {
        ipcBase.config.retry = retry;
        ipcBase.config.maxRetries = maxRetries;
    }

    connectTo(cb) {
        global.walletLog.info('GoViteIPC start to connect.');
        let connectCB = () => {
            cb && cb();
            cb = null;
        };

        ipcBase.connectTo(VITE_WALLET_IPC, () => {
            // Listening connect
            ipcBase.of[VITE_WALLET_IPC].on('connect', () => {
                global.walletLog.info('GoViteIPC connected successfully.');
                this.__connectStatus = 1;
                connectCB();
            });

            // Listening err
            ipcBase.of[VITE_WALLET_IPC].on('error', (err) => {
                global.walletLog.error(`GoViteIPC connected error: ${JSON.stringify(err)}.`);
            });

            // Listening disconnect
            ipcBase.of[VITE_WALLET_IPC].on('disconnect', () => {
                global.walletLog.error('GoViteIPC is disconnected.');
                this.__connectStatus = 0;
            });

            ipcBase.of[VITE_WALLET_IPC].on('destroy', () => {
                this.__connectStatus = 0;
                connectCB();

                // [NOTICE] Separate from the 'GoViteIPC destroy'
                if (!ipcBase.of[VITE_WALLET_IPC] || ipcBase.of[VITE_WALLET_IPC].explicitlyDisconnected) {
                    global.walletLog.error('GoViteIPC has been destroyed.');
                    return;
                }
                    
                global.walletLog.error('GoViteIPC connection timeout.');
                global.viteEventEmitter.emit('ipcDisconnect');
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

    ipcBase.of[VITE_WALLET_IPC].emit(requestId, methodName, arg);

    return new Promise((res, rej) => {
        let ipcTimeout = setTimeout(()=>{
            clearIpcTimeout();

            global.walletLog.info(`GoViteIPC APIs ${methodName}: IPC connection timeout.`);
            return rej({
                code: -50005,
                message: 'IPC connection timeout.'
            });
        }, 6000);

        let clearIpcTimeout = ()=>{
            clearTimeout(ipcTimeout);
            ipcTimeout = null;
        };

        // Listening api
        ipcBase.of[VITE_WALLET_IPC].on(requestId, function(data) {
            global.walletLog.info(`GoViteIPC APIs ${methodName}: ${JSON.stringify(data)}`);
            
            clearIpcTimeout();
            // system error
            if (data.error) {
                return rej({
                    code: data.error.code,
                    message: data.error.message || ''
                });
            }

            let result = data.result || null;

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
