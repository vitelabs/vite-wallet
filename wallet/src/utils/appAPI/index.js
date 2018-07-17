const EventTimeout = 5000;

let ipcRenderer = null;
let waitQueen = {};
let eventList = {};
let eventInx = 0;

// Get wallet config
(function getWalletConfig() {
    // Init finish
    if (ipcRenderer) {
        return;
    }

    // Already got it!
    if (window.walletConfig) {
        window.clearTimeout(timeout);
        timeout = null;
        ipcRenderer = window.walletConfig.electron.ipcRenderer;
        window.$i18n.locale = window.walletConfig.locale;

        for (let key in waitQueen) {
            const {
                funcName, timeout, res, rej, args
            } = waitQueen[key];
            handleEvent(funcName, timeout, res, rej, args, key);
        }
        waitQueen = {};
        return;
    }

    // Retry after 30ms.
    let timeout = window.setTimeout(()=>{
        timeout = null;
        getWalletConfig();
    }, 30);
})();

function handleEvent(funcName, timeout, res, rej, args, key) {
    eventList[key] = 1;

    ipcRenderer.on(`${funcName}Back`, (event, message) => {
        if (!eventList[key]) {
            return;
        }

        window.clearTimeout(timeout);
        timeout = null;
        delete eventList[key];

        return res(message);
    });
    ipcRenderer.send(funcName, ...args);
}

function event (funcName, ...args) {
    let currentInx =  eventInx;
    eventInx++;

    return new Promise((res, rej)=>{
        let timeout = window.setTimeout(()=>{
            timeout = null;
            waitQueen[currentInx] && delete waitQueen[currentInx];
            eventList[currentInx] && delete eventList[currentInx];

            return rej({
                code: -5000,
                message: 'timeout'
            });
        }, EventTimeout);

        if (!ipcRenderer) {
            waitQueen[currentInx] = {
                funcName, res, rej, args
            };
            return;
        }

        handleEvent(funcName, timeout, res, rej, ...args);
    });
}

let apis = ['createAccount', 'getAccountList', 'getAccount'];
let localAPI = {};
apis.forEach((funcName) => {
    localAPI[funcName] = event.bind(null, funcName);
});
window.localAPI = localAPI;
