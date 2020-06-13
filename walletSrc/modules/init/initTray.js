const path = require('path');

const { app, Menu, Tray, shell } = require('electron');
const log = require("electron-log");
const AutoLaunch = require('auto-launch');

const version = require('../../../package.json');

const minecraftAutoLauncher = new AutoLaunch({
    name: 'Vite Wallet'
});

let trayApp = null;

module.exports = function() {
    trayApp = new Tray(path.join(global.APP_PATH, 'icon', 'tray-logo.png'));
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

    trayApp.on('click', () => global.WALLET_WIN.show());

    // Call this again for Linux because we modified the context menu
    trayApp.setContextMenu(contextMenu);
    global.trayApp = trayApp;
}
