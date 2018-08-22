// [TODO]  multi-node-modules test mock-server
const path = require('path');
const { app } = require('electron');

// Single app instance
const isSecondInstance = app.makeSingleInstance(() => {
    // Someone tried to run a second instance, we should focus our window.
    if (!global.WALLET_WIN) {
        return;
    }

    global.WALLET_WIN.isMinimized() && global.WALLET_WIN.restore();
    global.WALLET_WIN.focus();
});

if (isSecondInstance) {
    app.quit();
} else {
    init();
}

function init() {
    require('./walletSrc/modules/init/initGlobalVars.js');   // Global vars must be defined in advance

    global.walletLog.info('APP start');
    
    process.on('uncaughtException', error => {
        global.walletLog.error(`UNCAUGHT EXCEPTION: ${JSON.stringify(error)}`);
        global.dialog.crash('Program exception');
    });

    const initServer = require(path.join(global.APP_PATH, '/walletSrc/modules/init/initServer.js'));
    const initAPP = require(path.join(global.APP_PATH, '/walletSrc/modules/init/initAPP.js'));
    const initWEB = require( path.join(global.APP_PATH, '/walletSrc/modules/init/initWEB.js') );
    const initMenu = require(path.join(global.APP_PATH, '/walletSrc/modules/menus.js'));
    const updateAPP = require( path.join(global.APP_PATH, '/walletSrc/modules/updateAPP.js') );
    
    let ipcReady = false;
    let appReady = false;
    
    let ipcEvent = global.viteEventEmitter.on('ipcReady', function() {
        ipcReady = true;
        setReadyStatus({ appReady, ipcReady });
    });
    let appEvent = global.viteEventEmitter.on('appReady', function() {
        appReady = true;
        setReadyStatus({ ipcReady, appReady });
    });
    
    function setReadyStatus({
        ipcReady, appReady
    }) {
        global.walletLog.info(`SetReadyStatus: ${JSON.stringify({
            ipcReady, appReady
        })}`);

        if (ipcReady) {
            global.viteEventEmitter.off(ipcEvent);
            global.goViteIPC.setConfig({ retry: 1000, maxRetries: 20 });
        }
        appReady && global.viteEventEmitter.off(appEvent);
    
        if (!ipcReady || !appReady) {
            return;
        }
        
        initWEB();
        initMenu();
    }

    updateAPP();
    initServer();
    initAPP();  
}
