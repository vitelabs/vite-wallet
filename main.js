const path = require('path');

const { app } = require('electron');

// Single app instance
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        // Someone tried to run a second instance, we should focus our window.
        if (global.WALLET_WIN) {
            if (global.WALLET_WIN.isMinimized()) global.WALLET_WIN.restore();
            global.WALLET_WIN.focus();
        }
    });

    init();
}

function init() {
    require('./walletSrc/modules/init/initGlobalVars.js');   // Global vars must be defined in advance

    global.walletLog.info('APP start');

    process.on('uncaughtException', error => {
        global.walletLog.error(`UNCAUGHT EXCEPTION: ${JSON.stringify(error)}`);
        global.dialog.crash('Program exception');
    });

    const initAPP = require(path.join(global.APP_PATH, '/walletSrc/modules/init/initAPP.js'));
    const initWEB = require(path.join(global.APP_PATH, '/walletSrc/modules/init/initWEB.js'));
    const initMenu = require(path.join(global.APP_PATH, '/walletSrc/modules/menus.js'));
    const updateAPP = require(path.join(global.APP_PATH, '/walletSrc/modules/updateAPP.js'));

    let appEvent = global.viteEventEmitter.on('appReady', function () {
        global.walletLog.info(`SetReadyStatus: ${JSON.stringify({
            appReady: true
        })}`);

        global.viteEventEmitter.off(appEvent);
        global.WALLET_WIN && global.WALLET_WIN.setSize(1210, 768);
        global.WALLET_WIN && global.WALLET_WIN.center();

        initWEB();
        initMenu();
    });

    updateAPP();
    initAPP();
}
