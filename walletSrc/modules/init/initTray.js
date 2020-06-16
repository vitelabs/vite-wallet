const path = require('path');

const { app, Menu, Tray, shell, ipcMain, nativeImage } = require('electron');
const log = require("electron-log");
const AutoLaunch = require('auto-launch');

const version = require('../../../package.json');

const minecraftAutoLauncher = new AutoLaunch({
    name: 'Vite Wallet'
});

let trayApp = null;
const logoPath = path.join(global.APP_PATH, 'icon', 'tray-logo.png');

module.exports = function() {
    trayApp = new Tray(logoPath);
    const contextMenu = Menu.buildFromTemplate([
        { 
            label: global.$t('show'), 
            type: 'normal', 
            click: () => {
                global.WALLET_WIN.show();
            }
        },
        { type: 'separator' },
        { 
            label: global.$t('backup'), 
            type: 'normal', 
            click: () => {
                shell.showItemInFolder(global.walletStore.path);
            }
        },
        { 
            label: global.$t('settings'), 
            submenu: [
                { 
                    label: global.$t('autoLaunch'), 
                    type: 'checkbox',
                    checked: !!global.settingsStore.get('autoLaunch'),
                    click: ({checked}) => {
                        checked ? minecraftAutoLauncher.enable() : minecraftAutoLauncher.disable();
                        global.settingsStore.set('autoLaunch', checked);
                    }
                }
            ]
        },
        { type: 'separator' },
        { 
            label: global.$t('log'), 
            type: 'normal', 
            click: () => {
                shell.showItemInFolder(log.transports.file.getFile().path);
            }
        },
        { label: `${global.$t('version')}: ${version.version}`, type: 'normal' },
        { label: global.$t('quit'), type: 'normal', click: () => global.APPQuit() }
    ]);

    trayApp.on('click', () => {
        if (global.WALLET_WIN.isVisible()) {
            global.WALLET_WIN.hide();
        } else {
            global.WALLET_WIN.show();
        }
    });

    // Call this again for Linux because we modified the context menu
    trayApp.setContextMenu(contextMenu);
    global.trayApp = trayApp;

    ipcMain.on('balanceInfo', (event, _balanceInfo) => {
        const balanceInfo = JSON.parse(_balanceInfo);
        let unreceivedNum = 0;
        for (const tokenId in balanceInfo) {
            unreceivedNum += (+balanceInfo[tokenId].onroadNum || 0);
        }
        if (unreceivedNum) {
            trayApp.setTitle(unreceivedNum + '');
            trayApp.setToolTip(`You have ${unreceivedNum} unreceived transactions`);
        }
    });
}
