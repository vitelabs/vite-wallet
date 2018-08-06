const { app } = require('electron');
const os = require('os');
const fs = require('fs');
const path = require('path');
const $i18n = require('../i18n/index.js');


global.APP_START_TIME = new Date().getTime();
global.$i18n = function(key) {
    return $i18n[global.userLocale] ? $i18n[global.userLocale][key] || key : key;
};

global.GO_FILE = path.join(os.homedir(), '/viteisbest/');   // ipc path
global.APP_PATH = process.env.NODE_ENV === 'dev' ? path.join(app.getAppPath(), 'app') : app.getAppPath();   // app-root
global.APP_DATA_PATH = path.join(app.getPath('appData'), '/viteWallet/');   // app data path
global.LOG_PATH = path.join(global.APP_DATA_PATH, '/log');
global.SERVER_LOG_PATH = path.join(global.LOG_PATH, `/server.${global.APP_START_TIME}.log`); // server log path
global.CLIENT_LOG_PATH = path.join(global.LOG_PATH, `/client.${global.APP_START_TIME}.log`); // client log path

!fs.existsSync(global.APP_DATA_PATH) && fs.mkdirSync(global.APP_DATA_PATH);
!fs.existsSync(global.LOG_PATH) && fs.mkdirSync(global.LOG_PATH);
