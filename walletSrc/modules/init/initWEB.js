const path = require('path');

const { shell } = require('electron');
const serve = require('electron-serve');

serve({directory: path.join(global.APP_PATH, 'walletPages')});


// require('~app/modules/electron-ga');
// require('~app/modules/electron-baidu-tongji');

const allowHost = [
    'https://reward.vite.net', 
    'https://testnet.vite.net', 
    'http://132.232.134.168:8080', 
    'https://vite.net', 
    'https://vite.org', 
    'https://github.com',
    'https://etherscan.io',
    'https://ropsten.etherscan.io',
    'http://localhost:8081'
];

function loadWebDom() {
    const walletWindow = global.WALLET_WIN;

    walletWindow.webContents.openDevTools();

    if (process.env.HOT_RELOAD === 'true') {
        walletWindow.loadURL('http://localhost:8081');
    } else {
        walletWindow.loadURL('app://x.vite.net');
    }

    walletWindow.webContents.once('dom-ready', () => {
        global.walletLog.info('Web dom ready');
    });
}

module.exports = function loadWeb() {
    if (!global.WALLET_WIN) {
        return;
    }

    global.walletLog.info('Start to load web.');
    loadWebDom();

    global.WALLET_WIN.webContents.on('will-navigate', (event, url) => {
        if (url.indexOf('file') !== 0) {
            return;
        }

        event.preventDefault();
        global.walletLog.info(`Location change: ${url}`);
        loadWebDom();
    });

    // Redefine file
    global.WALLET_WIN.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        global.walletLog.info(`Open url: ${url}`);

        try {
            let urlRes = require('url').parse(url);
            let host = `${urlRes.protocol}//${urlRes.host}`;
            global.walletLog.info(`Open url: ${host}`);

            if (allowHost.indexOf(host) > -1) {
                shell.openExternal(url);
            }
        } catch(err) {
            global.walletLog.error(`Open url error: ${JSON.stringify(err)}`);
        }
    });

    global.WALLET_WIN.webContents.on('crashed', () => {
        global.dialog.crash('win-crashed');
        global.walletLog.info('win-crashed', false);
    });
};
