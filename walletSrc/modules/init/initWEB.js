const path = require('path');

const { shell } = require('electron');
const serve = require('electron-serve');

const netTypes = ['mainnet', 'testnet'];

function serveFile(netType) {
    return serve({
        directory: path.join(global.APP_PATH, netType === 'mainnet' ? 'walletPages' : 'walletPages-test')
    });
}

serveFile('mainnet');
serveFile('testnet');

function loadWebDom() {
    const walletWindow = global.WALLET_WIN;

    if (process.env.NODE_ENV === 'dev') {
        walletWindow.webContents.openDevTools();
    }

    let netType = global.settingsStore.get('net');
    netType = netTypes.indexOf(netType) === -1 ? 'mainnet' : netType;

    if (process.env.HOT_RELOAD === 'true') {
        walletWindow.loadURL('http://localhost:8081');
    } else {
        global.WALLET_WIN.loadURL(`app://${netType}.vite.net`);
    }

    walletWindow.webContents.once('dom-ready', () => {
        console.info('Web dom ready');
    });

    global.viteEventEmitter.on('change-net', (_netType) => {
        global.WALLET_WIN.loadURL(`app://${_netType}.vite.net`);
    });
}

module.exports = function loadWeb() {
    if (!global.WALLET_WIN) {
        return;
    }

    console.info('Start to load web.');
    loadWebDom();

    // global.WALLET_WIN.webContents.on('will-navigate', (event, url) => {
    //     if (url.indexOf('file') !== 0) {
    //         return;
    //     }

    //     event.preventDefault();
    //     console.info(`Location change: ${url}`);
    //     loadWebDom();
    // });

    // Redefine file
    global.WALLET_WIN.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        console.info(`Open url: ${url}`);

        try {
            let urlRes = require('url').parse(url);
            let host = `${urlRes.protocol}//${urlRes.host}`;
            console.info(`Open url: ${host}`);

            if (host.indexOf('http') > -1) {
                shell.openExternal(url);
            }
        } catch(err) {
            console.error(`Open url error: ${JSON.stringify(err)}`);
        }
    });

    global.WALLET_WIN.webContents.on('crashed', () => {
        global.dialog.crash('win-crashed');
        console.info('win-crashed', false);
    });
};
