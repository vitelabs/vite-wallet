const path = require('path');
const fs = require('fs');

const { app, Menu, Tray, shell, ipcMain, nativeImage, MenuItem } = require('electron');
const log = require("electron-log");
const AutoLaunch = require('auto-launch');
const Store = require('electron-store');

const version = require('../../../package.json');
const { getWalletList } = require('../utils');

const minecraftAutoLauncher = new AutoLaunch({
    name: 'Vite Wallet'
});

let trayApp = null;
let contextMenu = null;
const logoPath = path.join(global.APP_PATH, 'icon', 'tray-logo.png');

module.exports = function() {
    trayApp = new Tray(logoPath);


    trayApp.on('click', () => {
        if (global.WALLET_WIN.isVisible()) {
            global.WALLET_WIN.hide();
        } else {
            global.WALLET_WIN.show();
        }
    });

    setMenuContext();
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
        } else {
            trayApp.setTitle('');
            trayApp.setToolTip('');
        }
    });

    ipcMain.on('notificationClick', () => {
        global.WALLET_WIN.show();
    });

    global.WALLET_WIN && global.WALLET_WIN.on('ready-to-show', () => {
        setMenuContext();
    });
}

function setMenuContext () {
    const walletListMenus = getWalletList().map(item => {
        return new MenuItem({
            label: item,
            type: 'radio',
            checked: global.settingsStore.get('currentWallet') === item,
            click: () => {
                global.WALLET_WIN.show();
                global.settingsStore.set('currentWallet', item);
                global.walletStore = new Store({
                    name: `wallet/${item}`
                });
                global.WALLET_WIN.reload();
                setMenuContext();
            }
        })
    });
    contextMenu = Menu.buildFromTemplate([
        { 
            id: 'show',
            label: global.$t('show'), 
            type: 'normal', 
            click: () => {
                global.WALLET_WIN.show();
            }
        },
        { type: 'separator' },
        {
            id: 'walletList',
            label: global.$t('walletList'),
            submenu: walletListMenus
        },
        { 
            id: 'backup',
            label: global.$t('backup'), 
            type: 'normal', 
            click: () => {
                shell.showItemInFolder(global.walletStore.path);
            }
        },
        { 
            id: 'settings',
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
            id: 'log',
            label: global.$t('log'), 
            type: 'normal', 
            click: () => {
                shell.showItemInFolder(log.transports.file.getFile().path);
            }
        },
        { label: `${global.$t('version')}: ${version.version}`, type: 'normal' },
        { label: global.$t('quit'), type: 'normal', click: () => global.APPQuit() }
    ]);
    contextMenu.on('menu-will-show', () => {
        setMenuContext();
    });
    trayApp.setContextMenu(contextMenu);
}
