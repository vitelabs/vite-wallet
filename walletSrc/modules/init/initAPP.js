const path = require('path');
const URL = require('url').URL;

const { app } = require('electron');
const Splashscreen = require('@trodi/electron-splashscreen');
const { initUpdater, powerMonitor } = require('../utils');

// Wallet Window Config
const windowConfig = {
    width: 1450,
    minWidth: 1450,
    height: 200,
    title: 'Vite Wallet',
    images: true,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    }
};

module.exports = function () {
    // Init power monitor. Will send resume and lock event to window
    powerMonitor();


    app.on('gpu-process-crashed', () => {
        global.dialog.crash('gpu-process-crashed');
        console.info('gpu-process-crashed', false);
    });

    app.on('ready', function () {
        createWindow && createWindow();
    });

    app.on('window-all-closed', (event) => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('before-quit', () => {
        global.willQuit = true;
    });

    app.on('activate', () => { global.WALLET_WIN.show() });

    // https://www.electronjs.org/docs/tutorial/security#12-disable-or-limit-navigation
    app.on('web-contents-created', (event, contents) => {
        contents.on('will-navigate', (event, navigationUrl) => {
            const parsedUrl = new URL(navigationUrl)

            if (['mainnet', 'testnet'].indexOf(parsedUrl.protocol) === -1) {
                event.preventDefault();
            }
        })
    });
};

function createWindow() {
    global.WALLET_WIN = Splashscreen.initSplashScreen({
        windowOpts: windowConfig,
        templateUrl: path.join(global.APP_PATH, 'icon', 'splash-screen.html'),
        splashScreenOpts: {
            width: 440,
            height: 430,
            transparent: true,
            frame: false
        }
    });

    global.WALLET_WIN.on('ready-to-show', () => {
        setTimeout(() => initUpdater(), 2000);
        if (process.platform === 'darwin') {
            global.WALLET_WIN.maximize();
        }
    });

    global.willQuit = false;

    global.WALLET_WIN.on('close', (event) => {
        if (global.willQuit) {
            global.WALLET_WIN = null;
        } else {
            event.preventDefault();
            global.WALLET_WIN.hide();
        }
    });

    let defaultLocale = app.getLocale();
    global.$i18n.setLocale(defaultLocale);

    // Loading first
    let loadingText = global.$t('dataLoading');
    global.WALLET_WIN.loadURL(
        `data:text/html;charset=utf-8,<div class="lds-ripple"><div></div><div></div></div></br><div>${loadingText}</div><style>body{font-family: PingFangSC-Regular;font-size: 14px;background: #fafcff;flex-direction: column;height:100vh;margin: 0;padding: 0;display: flex;justify-content: center;align-items: center;}.lds-ripple{display:inline-block;position:relative;width:64px;height:64px;}.lds-ripple div{position: absolute;border: 4px solid #4169E1;opacity: 1;border-radius: 50%;animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;}.lds-ripple div:nth-child(2) {animation-delay: -0.5s;}@keyframes lds-ripple {0% {top: 28px;left: 28px;width: 0;height: 0;opacity: 1;}100% {top: -1px;left: -1px;width: 58px;height: 58px;opacity: 0;}}</style>`
    );

    global.viteEventEmitter.emit('appReady');
}
