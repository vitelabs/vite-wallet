// [TODO] app-log test mock-server deal-crash
const { app, BrowserWindow } = require('electron');
const path = require('path');

require('./walletSrc/modules/init/initGlobalVars.js');   // Global vars must be defined in advance

const updateAPP = require( path.join(global.APP_PATH, '/walletSrc/modules/updateAPP.js') );
const { startIPCServer, stopIPCServer } = require( path.join(global.APP_PATH, '/walletSrc/modules/viteNode.js') );

const initAPP = require(path.join(global.APP_PATH, '/walletSrc/modules/init/initAPP.js'));
const initWEB = require( path.join(global.APP_PATH, '/walletSrc/modules/init/initWEB.js') );
const initMenu = require(path.join(global.APP_PATH, '/walletSrc/modules/menus.js'));

let ipcServerFinish = false;
let ipcServerCb;

connectGoServer(true);

initAPP(function createWindow () {
    global.WALLET_WIN = new BrowserWindow({
        width: 1200,
        minWidth: 1210,
        height: 768,
        title: 'VITE WALLET',
        images: true
    });

    global.WALLET_WIN.on('close', (event) => {
        global.dialog.quit();        
        event.preventDefault();
    });

    global.WALLET_WIN.on('closed', () => {
        global.WALLET_WIN = null;
        stopIPCServer();
        app.quit();
    });

    // Loading first
    global.WALLET_WIN.loadURL(
        'data:text/html,<div class="lds-ripple"><div></div><div></div></div><style>body{background: #f1f1f1;height:100vh;margin: 0;padding: 0;display: flex;justify-content: center;align-items: center;}.lds-ripple{display:inline-block;position:relative;width:64px;height:64px;}.lds-ripple div{position: absolute;border: 4px solid #4169E1;opacity: 1;border-radius: 50%;animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;}.lds-ripple div:nth-child(2) {animation-delay: -0.5s;}@keyframes lds-ripple {0% {top: 28px;left: 28px;width: 0;height: 0;opacity: 1;}100% {top: -1px;left: -1px;width: 58px;height: 58px;opacity: 0;}}</style>'
    );

    onIPCServer(()=>{
        updateAPP();    // [TODO] symple deal with go-server (ensure opening && ensure closing)
        initWEB();
        initMenu();
    });
});

function connectGoServer(isStart) {
    global.goViteIPC.connectTo();
    global.goViteIPC.onConnected(function (connectStatus) {
        if (!connectStatus) {
            isStart && startIPCServer(connectGoServer);
            return;
        }
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
