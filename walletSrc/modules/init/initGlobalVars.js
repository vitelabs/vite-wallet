const { app } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

global.GO_FILE = path.join(os.homedir(), '/viteisbest/');   // ipc path
global.APP_PATH = process.env.NODE_ENV === 'dev' ? path.join(app.getAppPath(), 'app') : app.getAppPath();   // app-root

global.USER_DATA_PATH = app.getPath('userData');
global.LOG_PATH = path.join(global.USER_DATA_PATH, '/log');
global.SERVER_LOG_PATH = path.join(global.LOG_PATH, '/server.log'); // server log path
global.CLIENT_LOG_PATH = path.join(global.LOG_PATH, '/client.log'); // client log path

!fs.existsSync(global.APP_PATH) && fs.mkdirSync(global.APP_PATH);
!fs.existsSync(global.USER_DATA_PATH) && fs.mkdirSync(global.USER_DATA_PATH);
!fs.existsSync(global.LOG_PATH) && fs.mkdirSync(global.LOG_PATH);

global.WALLET_WIN = null;
global.netStatus = -1;

// Init log: Log needs environmental information
global.walletLog = require( path.join(global.APP_PATH, '/walletSrc/utils/log.js') );

// Init i18n
const i18n = require('../../i18n/index.js');
global.$i18n = new i18n();
global.$t = global.$i18n.t.bind(global.$i18n);

// Init dialog
global.dialog = require('../dialog.js');

// Init ipc
const ipcGo = require( path.join(global.APP_PATH, '/walletSrc/utils/ipcGo.js') );
global.goViteIPC = new ipcGo();

global.viteEventEmitter = require( path.join(global.APP_PATH, '/walletSrc/utils/eventEmitter.js') );
