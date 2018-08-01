// [TODO] app-log test mock-server
const { app, BrowserWindow, shell, dialog } = require('electron');
const path = require('path');
const os = require('os');

global.goFile = path.join(os.homedir(), '/viteisbest/');    // Must be defined in advance
global.APP_PATH = process.env.NODE_ENV === 'dev' ? path.join(app.getAppPath(), 'app') : app.getAppPath();

const initMenu = require(path.join(global.APP_PATH, '/walletSrc/modules/menus.js'));
const ipcGo = require( path.join(global.APP_PATH, '/walletSrc/modules/ipcGo.js') );
const updateAPP = require( path.join(global.APP_PATH, '/walletSrc/modules/updateAPP.js') );

let ipcServerFinish = false;
let ipcServerCb;

const { startIPCServer, stopIPCServer } = require( path.join(global.APP_PATH, '/walletSrc/modules/viteNode.js') );
startIPCServer(function() {
    global.goViteIPC = new ipcGo();
    global.goViteIPC.onConnected(function () {
        require( path.join(global.APP_PATH, './walletSrc/middle/index.js') );
        emitIPCServer();
    });
});

function emitIPCServer() {
    ipcServerFinish = true;
    ipcServerCb && ipcServerCb();
}

function onIPCServer (cb) {
    if (ipcServerFinish) {
        cb && cb();
        return;
    }
    ipcServerCb = cb;
}

function loadWeb() {
    // Load file
    win.loadFile( path.join(global.APP_PATH, '/walletPages/index.html') );
    win.webContents.once('dom-ready', () => {
        win.webContents.executeJavaScript(`
            const path = require('path');
            require(path.join(__dirname, '../walletSrc/modules/webStart.js'));
        `);
    });

    // Redefine file
    win.webContents.on('new-window', (event, url) => {
        // [TODO] only vite.net
        const protocol = require('url').parse(url).protocol;
        if (protocol === 'http:' || protocol === 'https:') {
            event.preventDefault();
            shell.openExternal(url);
        }
    });
}

let win;
function createWindow () {
    updateAPP();

    win = new BrowserWindow({
        width: 1080,
        height: 768,
        title: 'VITE WALLET',
        images: true
    });

    // Loading first
    win.loadURL(
        'data:text/html,<div class="lds-ripple"><div></div><div></div></div><style>body{background: #f1f1f1;height:100vh;margin: 0;padding: 0;display: flex;justify-content: center;align-items: center;}.lds-ripple{display:inline-block;position:relative;width:64px;height:64px;}.lds-ripple div{position: absolute;border: 4px solid #4169E1;opacity: 1;border-radius: 50%;animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;}.lds-ripple div:nth-child(2) {animation-delay: -0.5s;}@keyframes lds-ripple {0% {top: 28px;left: 28px;width: 0;height: 0;opacity: 1;}100% {top: -1px;left: -1px;width: 58px;height: 58px;opacity: 0;}}</style>'
    );

    win.on('close', (event) => {
        dialog.showMessageBox({
            type: 'question',
            buttons: ['no', 'yessss'],
            title: 'close',
            message: 'sure?',
            cancelId: 1
        }, (id) => {
            id === 1 && win.destroy();
        });
        event.preventDefault();
    });

    win.on('closed', () => {
        win = null;
        stopIPCServer();
        app.quit();
    });

    initMenu(win);

    onIPCServer(loadWeb);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    process.platform !== 'darwin' && app.quit();
});
