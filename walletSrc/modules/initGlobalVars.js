const { app } = require('electron');
const os = require('os');
const fs = require('fs');
const path = require('path');
const i18n = require('../i18n/index.js');

global.GO_FILE = path.join(os.homedir(), '/viteisbest/');   // ipc path
global.APP_PATH = process.env.NODE_ENV === 'dev' ? path.join(app.getAppPath(), 'app') : app.getAppPath();   // app-root
global.APP_DATA_PATH = path.join(app.getPath('appData'), '/viteWallet/');   // app data path

global.USER_DATA_PATH = app.getPath('userData');
global.LOG_PATH = path.join(global.USER_DATA_PATH, '/log');
global.SERVER_LOG_PATH = path.join(global.LOG_PATH, '/server.log'); // server log path
global.CLIENT_LOG_PATH = path.join(global.LOG_PATH, '/client.log'); // client log path

!fs.existsSync(global.APP_DATA_PATH) && fs.mkdirSync(global.APP_DATA_PATH);
!fs.existsSync(global.LOG_PATH) && fs.mkdirSync(global.LOG_PATH);

global.WALLET_WIN = null;
global.$i18n = new i18n();
global.$t = global.$i18n.t.bind(global.$i18n);
global.netStatus = -1;

// Log needs environmental information
global.walletLog = require( path.join(global.APP_PATH, '/walletSrc/utils/log.js') );
