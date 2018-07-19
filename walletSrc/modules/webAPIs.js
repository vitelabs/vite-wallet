// [TODO] Handling multi-frequency asynchronous requests. Avoid last in first out, request confusion.

const { ipcRenderer } = require('electron');

function event (funcName, ...args) {
    return new Promise((res, rej)=>{
        ipcRenderer.on(`${funcName}Back`, (event, message) => {
            return message.code === 0 ? res(message) : rej(message);
        });
        ipcRenderer.send(funcName, ...args);
    });
}

let apis = {
    'Account': [
        'create', 'getList', 'status', 'unLock', 'lock', 'reloadFile', 'isValidFile'
    ],
    'Block': [
        'getSyncInfo', 'createTX', 'getTXList', 'getUnconfirmedTX', 'getBalance'
    ],
    'Net': [
        'updateFromWeb', 'getStatus'
    ]
};

let viteWalletAPI = {};
for (let nameSpace in apis) {
    apis[nameSpace].forEach((funcName) => {
        let noticeName = `${nameSpace}.${funcName}`;
        viteWalletAPI[noticeName] = event.bind(null, noticeName);
    });
}

window.viteWalletAPI = viteWalletAPI;
