const { shell, dialog } = require('electron');
const path = require('path');

const allowHost = ['https://test.vite.net'];

function showError(win, title) {
    const options = {
        type: 'info',
        title,
        buttons: ['reload', 'close']
    };

    dialog.showMessageBox(options, function (index) {
        if (index === 0) {
            win && win.reload();
            return;
        }
        win && win.destroy();
    });
}

module.exports = function loadWeb(win) {
    // Load file
    win.loadFile( path.join(global.APP_PATH, '/walletPages/index.html') );

    win.webContents.once('dom-ready', () => {
        // Account, Net, Block, Keystore, System, Types, TestToken
        // fromPath: app-root
        win.webContents.executeJavaScript(`
            const { remote } = require('electron');
            window.viteWallet = remote.require('./walletSrc/middle/index.js');
        `);
    });

    // Redefine file
    win.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        let urlRes = require('url').parse(url);
        if (allowHost.indexOf(`${urlRes.protocol}//${urlRes.host}`) > -1) {
            shell.openExternal(url);
        }
    });

    win.webContents.on('did-fail-load', () => {
        showError(win, 'failLoad');
    });

    win.webContents.on('crashed', () => {
        showError(win, 'crashed');
    });
};
