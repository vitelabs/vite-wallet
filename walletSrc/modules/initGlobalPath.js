const { app } = require('electron');
const os = require('os');
const fs = require('fs');
const path = require('path');

global.GO_FILE = path.join(os.homedir(), '/viteisbest/');   // ipc path
global.APP_PATH = process.env.NODE_ENV === 'dev' ? path.join(app.getAppPath(), 'app') : app.getAppPath();   // app-root
global.APP_DATA_PATH = path.join(app.getPath('appData'), '/viteWallet/');   // app data path
global.LOG_PATH = path.join(global.APP_DATA_PATH, '/log');
global.SERVER_LOG_PATH = path.join(global.APP_DATA_PATH, '/server.log'); // server log path

!fs.existsSync(global.APP_DATA_PATH) && fs.mkdirSync(global.APP_DATA_PATH);
