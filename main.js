const path = require('path');

const { app, shell, dialog } = require('electron');
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
const semver = require('semver');


// Init log and catch all error.
Object.assign(console, log.functions);
log.catchErrors({
    showDialog: false,
    onError(error, versions, submitIssue) {
        dialog.showMessageBox({
            title: 'An error occurred',
            message: error.message,
            detail: error.stack,
            type: 'error',
            buttons: ['Ignore', 'Report', 'Exit'],
        })
            .then((result) => {
                if (result.response === 1) {
                    submitIssue('https://github.com/vitelabs/vite-wallet/issues/new', {
                        title: `Error report for ${versions.app}`,
                        body: 'Error:\n```' + error.stack + '\n```\n' + `OS: ${versions.os}`
                    });
                    return;
                }

                if (result.response === 2) {
                    global.APPQuit();
                }
            });
    }
});

// Single app instance
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        // Someone tried to run a second instance, we should focus our window.
        if (global.WALLET_WIN) {
            if (global.WALLET_WIN.isMinimized()) global.WALLET_WIN.restore();
            global.WALLET_WIN.focus();
        }
    });

    init();
}

function init() {
    require('./walletSrc/modules/init/initGlobalVars.js');   // Global vars must be defined in advance

    console.info('APP start');
    const initAPP = require(path.join(global.APP_PATH, '/walletSrc/modules/init/initAPP.js'));
    const initWEB = require(path.join(global.APP_PATH, '/walletSrc/modules/init/initWEB.js'));
    const initMenu = require(path.join(global.APP_PATH, '/walletSrc/modules/menus.js'));
    const initTray = require(path.join(global.APP_PATH, '/walletSrc/modules/init/initTray.js'));

    let appEvent = global.viteEventEmitter.on('appReady', function () {
        console.info(`SetReadyStatus: ${JSON.stringify({
            appReady: true
        })}`);

        global.viteEventEmitter.off(appEvent);
        global.WALLET_WIN && global.WALLET_WIN.setSize(1210, 768);
        global.WALLET_WIN && global.WALLET_WIN.center();

        initWEB();
        initMenu();
        initTray();
    });

    initAPP();

    // Init auto update
    autoUpdater.logger = log;
    autoUpdater.autoDownload = false;
    autoUpdater.checkForUpdates().then(({ updateInfo }) => {
        if (!updateInfo) return;
        const currentVersion = require('./package.json').version;
        console.log(updateInfo);
        if (semver.gt(updateInfo.version, currentVersion)) {
            dialog.showMessageBox(global.WALLET_WIN, {
                type: 'question',
                buttons: [global.$t('cancel'), global.$t('yes')],
                title: global.$t('updateTitle'),
                message: global.$t('updateAPP'),
                defaultId: 1
            }).then(({ response }) => {
                if (response === 1) {
                    shell.openExternal('https://github.com/vitelabs/vite-wallet/releases');
                }
            })
        }
    }).catch(err => log.log(err));
}
