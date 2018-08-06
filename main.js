// [TODO] app-log test mock-server deal-crash
const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');

// Path must be defined in advance
require('./walletSrc/modules/initGlobalVars.js');

const initMenu = require(path.join(global.APP_PATH, '/walletSrc/modules/menus.js'));
const ipcGo = require( path.join(global.APP_PATH, '/walletSrc/modules/ipcGo.js') );
const updateAPP = require( path.join(global.APP_PATH, '/walletSrc/modules/updateAPP.js') );
const loadWeb = require( path.join(global.APP_PATH, '/walletSrc/modules/loadWeb.js') );
const log = require( path.join(global.APP_PATH, '/walletSrc/utils/log.js') );

let ipcServerFinish = false;
let ipcServerCb;

const { startIPCServer, stopIPCServer } = require( path.join(global.APP_PATH, '/walletSrc/modules/viteNode.js') );
connectGoServer(true);

global.WALLET_WIN = null;
function createWindow () {
    global.WALLET_WIN = new BrowserWindow({
        width: 1200,
        minWidth: 1210,
        height: 768,
        title: 'VITE WALLET',
        images: true
    });

    updateAPP();

    // Loading first
    global.WALLET_WIN.loadURL(
        'data:text/html,<div class="lds-ripple"><div></div><div></div></div><style>body{background: #f1f1f1;height:100vh;margin: 0;padding: 0;display: flex;justify-content: center;align-items: center;}.lds-ripple{display:inline-block;position:relative;width:64px;height:64px;}.lds-ripple div{position: absolute;border: 4px solid #4169E1;opacity: 1;border-radius: 50%;animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;}.lds-ripple div:nth-child(2) {animation-delay: -0.5s;}@keyframes lds-ripple {0% {top: 28px;left: 28px;width: 0;height: 0;opacity: 1;}100% {top: -1px;left: -1px;width: 58px;height: 58px;opacity: 0;}}</style>'
    );
    onIPCServer(()=>{
        loadWeb();
    });

    global.userLocale = app.getLocale();
    initMenu();

    global.WALLET_WIN.on('close', (event) => {
        dialog.showMessageBox({
            type: 'question',
            buttons: [global.$i18n('cancel'), global.$i18n('yes')],
            title: global.$i18n('close'),
            message: global.$i18n('quitWallet'),
            cancelId: 1
        }, (id) => {
            if (id !== 1) {
                return;
            }
            global.WALLET_WIN.destroy();
            global.WALLET_WIN = null;
        });
        event.preventDefault();
    });

    global.WALLET_WIN.on('closed', () => {
        global.WALLET_WIN = null;
        stopIPCServer();
        app.quit();
    });
}

app.on('ready', createWindow);

app.on('gpu-process-crashed', () => {
    log.add('gpu-process-crashed');
});

app.on('window-all-closed', () => {
    global.goViteIPC.disconnect();
    stopIPCServer();
    app.quit();
});

app.on('will-quit', () => {
    log.saveSync();
});

function connectGoServer(isStart) {
    global.goViteIPC = new ipcGo();
    global.goViteIPC.onConnected(function (connectStatus) {
        if (!connectStatus) {
            isStart && startIPCServer(connectGoServer);
            return;
        }
        require( path.join(global.APP_PATH, './walletSrc/middle/index.js') );
        emitIPCServer();
    });
}

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
