const { shell, dialog } = require('electron');
const path = require('path');

const allowHost = ['https://test.vite.net'];

function showError(title) {
    const options = {
        type: 'info',
        message: title,
        buttons: [global.$i18n('reload'), global.$i18n('close')]
    };

    dialog.showMessageBox(options, function (index) {
        if (index === 0) {
            global.WALLET_WIN && global.WALLET_WIN.reload();
            return;
        }
        global.WALLET_WIN && global.WALLET_WIN.destroy();
    });
}

module.exports = function loadWeb() {
    // Load file
    global.WALLET_WIN.loadFile( path.join(global.APP_PATH, '/walletPages/index.html') );

    global.WALLET_WIN.webContents.once('dom-ready', () => {
        // Account, Net, Block, Keystore, System, Types, TestToken
        // fromPath: app-root
        global.WALLET_WIN.webContents.executeJavaScript(`
            const { remote } = require('electron');
            window.viteWallet = remote.require('./walletSrc/middle/index.js');
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

    global.WALLET_WIN.webContents.on('did-fail-load', () => {

    });

    global.WALLET_WIN.webContents.on('crashed', () => {
        showError('crashed');
    });
};
