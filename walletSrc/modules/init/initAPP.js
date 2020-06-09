const path = require('path');
const { app, BrowserWindow } = require('electron');

module.exports = function () {
    app.on('gpu-process-crashed', () => {
        global.dialog.crash('gpu-process-crashed');
        global.walletLog.info('gpu-process-crashed', false);
    });

    app.on('ready', function () {
        createWindow && createWindow();
    });

    app.on('will-quit', ()=>{
        global.walletLog.info('APP quit');
    });

    app.on('window-all-closed', (event) => {
        event.preventDefault();
    });
};

function createWindow () {
    global.WALLET_WIN = new BrowserWindow({
        width: 1450,
        minWidth: 1450,
        height: 200,
        title: 'Vite Wallet',
        images: true,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    global.WALLET_WIN.on('close', (event) => {
        event.preventDefault();
        app.exit();
    });

    global.WALLET_WIN.on('closed', () => {
        global.APPQuit();
    });

    let defaultLocale = app.getLocale();
    global.$i18n.setLocale( defaultLocale );

    // Loading first
    let loadingText = global.$t('dataLoading');
    global.WALLET_WIN.loadURL(
        `data:text/html;charset=utf-8,<div class="lds-ripple"><div></div><div></div></div></br><div>${loadingText}</div><style>body{font-family: PingFangSC-Regular;font-size: 14px;background: #fafcff;flex-direction: column;height:100vh;margin: 0;padding: 0;display: flex;justify-content: center;align-items: center;}.lds-ripple{display:inline-block;position:relative;width:64px;height:64px;}.lds-ripple div{position: absolute;border: 4px solid #4169E1;opacity: 1;border-radius: 50%;animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;}.lds-ripple div:nth-child(2) {animation-delay: -0.5s;}@keyframes lds-ripple {0% {top: 28px;left: 28px;width: 0;height: 0;opacity: 1;}100% {top: -1px;left: -1px;width: 58px;height: 58px;opacity: 0;}}</style>`
    );
    
    global.viteEventEmitter.emit('appReady');
}
