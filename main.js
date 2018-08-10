// [TODO] app-log test mock-server deal-crash
const path = require('path');

require('./walletSrc/modules/init/initGlobalVars.js');   // Global vars must be defined in advance

const initServer = require(path.join(global.APP_PATH, '/walletSrc/modules/init/initServer.js'));
const initAPP = require(path.join(global.APP_PATH, '/walletSrc/modules/init/initAPP.js'));
const initWEB = require( path.join(global.APP_PATH, '/walletSrc/modules/init/initWEB.js') );
const initMenu = require(path.join(global.APP_PATH, '/walletSrc/modules/menus.js'));

let serverStatus = -1;
let appStatus = -1;

let serverStautsEvent = global.viteEventEmitter.on('serverStatus', function(status) {
    console.log(status);
    setReadyStatus({
        appStatus,
        serverStatus: status
    });
});
let appStautsEvent = global.viteEventEmitter.on('appStatus', function(status) {
    setReadyStatus({
        serverStatus,
        appStatus: status
    });
});

// Needs nothing
initServer();

// Needs status: go-server
initAPP();

function setReadyStatus({
    serverStatus, appStatus
}) {
    serverStatus === 1 && global.viteEventEmitter.off(serverStautsEvent);
    appStatus === 1 && global.viteEventEmitter.off(appStautsEvent);

    if (serverStatus !== 1 || appStatus !== 1) {
        return;
    }
    
    initWEB();
    initMenu();
}
