const fs = require('fs');
const path = require('path');

const { app, shell, dialog } = require('electron');
const { autoUpdater } = require("electron-updater");
const semver = require('semver');
const log = require("electron-log");

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
    autoUpdater.allowPrerelease = !!global.settingsStore.get('allowPrerelease');
    checkUpdate().then(({ forceUpdate, newVersion }) => {
        newVersion && showUpdaterDialog(forceUpdate);
    }).catch(err => console.error(err));
}

function showUpdaterDialog (forceUpdate) {
    if (forceUpdate) {
        dialog.showMessageBox(global.WALLET_WIN, {
            type: 'question',
            buttons: [global.$t('yes')],
            title: global.$t('updateTitle'),
            message: global.$t('updateAPPForce'),
            defaultId: 0
        }).then(({ response }) => {
            if (response === 0) {
                shell.openExternal('https://github.com/vitelabs/vite-wallet/releases');
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
            if (response === 1) {
                shell.openExternal('https://github.com/vitelabs/vite-wallet/releases');
            }
        });
    }
}

function checkUpdate() {
    return autoUpdater.checkForUpdates().then(({ updateInfo }) => {
        if (!updateInfo) throw 'updateInfo is null';
        const currentVersion = require('../../package.json').version;
        console.info(updateInfo);
        if (semver.gt(updateInfo.version, currentVersion)) {
            let diff = semver.diff(updateInfo.version, currentVersion);
            console.info(`Version semver diff: ${diff}`);
            return {
                newVersion: true,
                forceUpdate: diff === 'major'
            };
        } 
        return {
            newVersion: false
        };
    });
}