// [TODO] app-log test mock-server deal-crash Server-process-guard
const path = require('path');

require('./walletSrc/modules/init/initGlobalVars.js');   // Global vars must be defined in advance

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

updateAPP();
initServer();
initAPP();

function setReadyStatus({
    ipcReady, appReady
}) {
    ipcReady && global.viteEventEmitter.off(ipcEvent);
    appReady && global.viteEventEmitter.off(appEvent);

    if (!ipcReady || !appReady) {
        return;
    }
    
    initWEB();
    initMenu();
}
