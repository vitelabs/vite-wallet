const { shell } = require('electron');
const path = require('path');
require('~app/modules/electron-ga');
require('~app/modules/electron-baidu-tongji');

const allowHost = ['https://testnet.vite.net'];

module.exports = function loadWeb() {
    if (!global.WALLET_WIN) {
        return;
    }
    global.walletLog.info('Start to load web.');

    // Load file
    global.WALLET_WIN.loadFile( path.join(global.APP_PATH, '/walletPages/index.html') );

    global.WALLET_WIN.webContents.once('dom-ready', () => {
        global.walletLog.info('Web dom ready');

        // fromPath: app-root
        // Account, Net, Block, Keystore, System, Types, TestToken
        global.WALLET_WIN && global.WALLET_WIN.webContents.executeJavaScript(`
            const { remote } = require('electron');
            window.viteWallet = remote.require('./walletSrc/middle/index.js');
            window.viteWallet.System.walletLog.info({
                userAgent: window.navigator.userAgent
            });

            const { Analytics } = require('../modules/electron-ga');
            window.analytics = new Analytics('UA-123680072-1');
            analytics.send('event', {
                dp: 'home'
            });

            window.baiduTongji = require('../modules/electron-baidu-tongji');
        `);
    });

    // Redefine file
    global.WALLET_WIN.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        let urlRes = require('url').parse(url);
        if (allowHost.indexOf(`${urlRes.protocol}//${urlRes.host}`) > -1) {
            shell.openExternal(url);
        }
    });

    global.WALLET_WIN.webContents.on('crashed', () => {
        global.dialog.crash('win-crashed');
        global.walletLog.info('win-crashed', false);
    });
};
