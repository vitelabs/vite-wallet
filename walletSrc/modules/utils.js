const fs = require('fs');
const path = require('path');

const { app, shell, dialog } = require('electron');
const { autoUpdater } = require("electron-updater");
const semver = require('semver');
const log = require("electron-log");

let autoUpdateTimer = null;
let dialogPending = false;

exports.getWalletList = () => {
    try {
        let dirs = fs.readdirSync(path.join(global.USER_DATA_PATH, 'wallet'));

        let walletList = dirs.filter(item => /\.json$/.test(item)).map(item => item.replace(/\.json$/, ''));
        return walletList;
    } catch (err) {
        console.error(err);
        return [];
    }
}

exports.initUpdater = () => {
    // Init auto update
    autoUpdater.logger = log;
    autoUpdater.autoDownload = false;
    checkUpdate();

    // Checking updates every 1h
    if (!autoUpdateTimer) {
        autoUpdateTimer = setInterval(() => {
            checkUpdate();
        }, 1000 * 60 * 60 * 1);
    }
}

function showUpdaterDialog (forceUpdate, updateInfo) {
    const downloadUrl = `https://github.com/vitelabs/vite-wallet/releases/tag/v${updateInfo.version}`;
    if (dialogPending) return;

    dialogPending = true;
    if (forceUpdate) {
        dialog.showMessageBox(global.WALLET_WIN, {
            type: 'question',
            buttons: [global.$t('yes')],
            title: global.$t('updateTitle'),
            message: global.$t('updateAPPForce'),
            defaultId: 0
        }).then(({ response }) => {
            dialogPending = false;
            if (response === 0) {
                shell.openExternal(downloadUrl);
                global.APPQuit();
            }
        });
    } else {
        dialog.showMessageBox(global.WALLET_WIN, {
            type: 'question',
            buttons: [global.$t('cancel'), global.$t('yes')],
            title: global.$t('updateTitle'),
            message: global.$t('updateAPP'),
            defaultId: 1
        }).then(({ response }) => {
            dialogPending = false;
            if (response === 1) {
                shell.openExternal(downloadUrl);
            }
        });
    }
}

function checkUpdate() {
    autoUpdater.allowPrerelease = !!global.settingsStore.get('allowPrerelease');
    return autoUpdater.checkForUpdates().then(({ updateInfo }) => {
        if (!updateInfo) throw 'updateInfo is null';
        const currentVersion = require('../../package.json').version;
        console.info(updateInfo);
        if (semver.gt(updateInfo.version, currentVersion)) {
            let diff = semver.diff(updateInfo.version, currentVersion);
            console.info(`Version semver diff: ${diff}`);
            showUpdaterDialog(diff === 'major', updateInfo);
        }
    }).catch(err => console.error(err));
}