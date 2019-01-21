const { shell } = require('electron');
const path = require('path');
require('~app/modules/electron-ga');
require('~app/modules/electron-baidu-tongji');

const allowHost = [
    'https://reward.vite.net', 'https://testnet.vite.net', 'http://132.232.134.168:8080', 'https://vite.net', 'https://vite.org', 'https://github.com'
];

function loadWebDom() {
    // global.WALLET_WIN.webContents.openDevTools();

    // global.WALLET_WIN.loadURL('https://wallet.vite.net/#/');
    global.WALLET_WIN.loadFile( path.join(global.APP_PATH, '/walletPages/index.html') );

    global.WALLET_WIN.webContents.once('dom-ready', () => {
        global.walletLog.info('Web dom ready');

        // FromPath: app-root
        global.WALLET_WIN && global.WALLET_WIN.webContents.executeJavaScript(`
            const { remote } = require('electron');
            const {
                appLocalStorage, appHttp, appI18n
            } = remote.require('./walletSrc/modules/toWeb.js');
            window.viteWalletStorage = appLocalStorage;
            window.viteWalletRequest = appHttp;
            window.viteWalletI18n = appI18n;

            const { Analytics } = require('../modules/electron-ga');
            window.analytics = new Analytics('UA-123680072-1');
            analytics.send('event', {
                dp: 'home'
            });
        `);
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
