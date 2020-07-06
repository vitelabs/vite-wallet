const path = require('path');

const { shell, protocol } = require('electron');
const serve = require('electron-serve');

const netTypes = ['mainnet', 'testnet'];
const privileges = {
    standard: true,
    secure: true,
    allowServiceWorkers: true,
    supportFetchAPI: true,
    corsEnabled: true
};


function serveFile(netType) {
    return serve({
        directory: path.join(global.APP_PATH, netType === 'mainnet' ? 'walletPages' : 'walletPages-test'),
        scheme: netType
    });
}

serveFile('testnet');
serveFile('mainnet');

// This is for fix a bugs of muti-scheme of electron-serve, details: https://www.electronjs.org/docs/api/protocol#protocolregisterschemesasprivilegedcustomschemes
protocol.registerSchemesAsPrivileged(netTypes.map(item => {
    return {
        scheme: item,
        privileges
    };
}));

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
        global.WALLET_WIN.loadURL(`${netType}://x.vite.net`);
    }

    walletWindow.webContents.once('dom-ready', () => {
        console.info('Web dom ready');
    });

    global.viteEventEmitter.on('change-net', (_netType) => {
        global.WALLET_WIN.loadURL(`${_netType}://x-test.vite.net`);
    });
}

module.exports = function loadWeb() {
    if (!global.WALLET_WIN) {
        return;
    }

    console.info('Start to load web.');
    loadWebDom();

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
