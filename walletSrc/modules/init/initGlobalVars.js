const { app } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');

global.APP_PATH = process.env.NODE_ENV === 'dev' ? path.join(app.getAppPath(), 'app') : app.getAppPath();   // app-root

global.USER_DATA_PATH = app.getPath('userData');

!fs.existsSync(global.APP_PATH) && fs.mkdirSync(global.APP_PATH);
!fs.existsSync(global.USER_DATA_PATH) && fs.mkdirSync(global.USER_DATA_PATH);

global.WALLET_WIN = null;
global.netStatus = -1;

// Init app-quit func
let isQuiting = false;
global.APPQuit = function() {
    if (isQuiting) {
        return;
    }
    isQuiting = true;

    global.WALLET_WIN && !global.WALLET_WIN.isDestroyed() && global.WALLET_WIN.destroy();
    global.WALLET_WIN = null;

    isQuiting = false;
    app.quit();
};

// Init i18n
const i18n = require('../../i18n/index.js');
global.$i18n = new i18n();
global.$t = global.$i18n.t.bind(global.$i18n);

// Init dialog
global.dialog = require('../dialog.js');

global.viteEventEmitter = require('~app/utils/eventEmitter.js');


// Init electron store

// Init Setting store
global.settingsStore = new Store({
    name: 'settings'
});

// Init wallet store
global.walletStore = new Store({
    name: 'walletList'
});
