const { shell } = require('electron');
// const path = require('path');
require('~app/modules/electron-ga');
require('~app/modules/electron-baidu-tongji');

const allowHost = ['https://testnet.vite.net'];

module.exports = function loadWeb() {
    if (!global.WALLET_WIN) {
        return;
    }
    global.walletLog.info('Start to load web.');

    global.WALLET_WIN.loadURL('https://wallet.vite.net/#/');

    // Load file
    // global.WALLET_WIN.loadFile( path.join(global.APP_PATH, ) );

    // global.WALLET_WIN.webContents.once('dom-ready', () => {
    //     global.walletLog.info('Web dom ready');

    //     // FromPath: app-root
    //     // Account, Net, Block, Keystore, System, Types, TestToken
    //     global.WALLET_WIN && global.WALLET_WIN.webContents.executeJavaScript(`
    //         const { remote } = require('electron');
    //         window.viteWallet = remote.require('./walletSrc/middle/index.js');
    //         window.viteWallet.System.walletLog.info({
    //             userAgent: window.navigator.userAgent
    //         });

    //         const { Analytics } = require('../modules/electron-ga');
    //         window.analytics = new Analytics('UA-123680072-1');
    //         analytics.send('event', {
    //             dp: 'home'
    //         });

    //         window.baiduTongji = require('../modules/electron-baidu-tongji');
    //     `);
    // });

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
