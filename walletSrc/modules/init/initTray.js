const path = require('path');
const fs = require('fs');

const { Menu, Tray, shell, ipcMain, dialog, systemPreferences } = require('electron');
const log = require('electron-log');
const AutoLaunch = require('auto-launch');
const Store = require('electron-store');
const moment = require('moment');

const version = require('../../../package.json');
const { getWalletList, initUpdater } = require('../utils');

const minecraftAutoLauncher = new AutoLaunch({
    name: 'Vite Wallet'
});

let trayApp = null;
let contextMenu = null;
const logoPath = path.join(global.APP_PATH, 'icon', 'tray-logo.png');

module.exports = function() {
    trayApp = new Tray(logoPath);

    if (process.platform !== 'darwin') {
        trayApp.on('click', () => {
            if (global.WALLET_WIN.isVisible()) {
                global.WALLET_WIN.hide();
            } else {
                global.WALLET_WIN.show();
            }
        });
    }

    global.trayApp = trayApp;

    setMenuContext();

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
};

function changeWallet(walletName) {
    global.settingsStore.set('currentWallet', walletName);
    global.walletStore = new Store({
        name: `wallet/${walletName}`
    });
    global.WALLET_WIN.reload();
    global.currentWallet = walletName;
}

function setMenuContext () {
    const walletListMenus = getWalletList().map(item => {
        return {
            label: item,
            type: 'radio',
            checked: global.currentWallet === item,
            click: () => {
                if (item === global.currentWallet) {
                    return;
                }
                global.WALLET_WIN.show();
                changeWallet(item);
            }
        };
    });

    const settingsSubmenu = [
        { 
            label: global.$t('autoLaunch'), 
            type: 'checkbox',
            checked: !!global.settingsStore.get('autoLaunch'),
            click: ({checked}) => {
                checked ? minecraftAutoLauncher.enable() : minecraftAutoLauncher.disable();
                global.settingsStore.set('autoLaunch', checked);
            }
        },
        {
            label: global.$t('autoUpdate'), 
            submenu: [
                {
                    label: global.$t('autoUpdateRelease'), 
                    type: 'radio',
                    checked: !global.settingsStore.get('allowPrerelease'),
                    click: () => {
                        global.settingsStore.set('allowPrerelease', false);
                        initUpdater();
                    }
                },
                {
                    label: global.$t('autoUpdatePreRelease'), 
                    type: 'radio',
                    checked: !!global.settingsStore.get('allowPrerelease'),
                    click: () => {
                        global.settingsStore.set('allowPrerelease', true);
                        initUpdater();
                    }
                }
            ]
        },
        {
            label: global.$t('net'), 
            submenu: [
                {
                    label: 'Main Net', 
                    type: 'radio',
                    checked: global.settingsStore.get('net') === 'mainnet',
                    click: () => {
                        global.settingsStore.set('net', 'mainnet');
                        global.viteEventEmitter.emit('change-net', 'mainnet');
                    }
                },
                {
                    label: 'Test Net', 
                    type: 'radio',
                    checked: global.settingsStore.get('net') === 'testnet',
                    click: () => {
                        global.settingsStore.set('net', 'testnet');
                        global.viteEventEmitter.emit('change-net', 'testnet');
                    }
                }
            ]
        }
    ];

    if (process.platform === 'darwin' && systemPreferences.canPromptTouchID()) {
        settingsSubmenu.push({
            label: global.$t('enableTouchID'), 
            type: 'checkbox',
            checked: !!global.settingsStore.get('enableTouchID'),
            click: ({checked}) => {
                if (checked) {
                    global.WALLET_WIN.show();
                    dialog.showMessageBox(global.WALLET_WIN, {
                        type: 'question',
                        buttons: [global.$t('cancel'), global.$t('yes')],
                        title: global.$t('enableTouchID'),
                        message: global.$t('enableTouchIDMessage'),
                        defaultId: 1
                    }).then(({ response }) => {
                        if (response === 1) {
                            global.settingsStore.set('enableTouchID', true);
                        } else {
                            setMenuContext();
                        }
                    });
                } else {
                    global.settingsStore.set('enableTouchID', false);
                }
            }
        });
    }

    contextMenu = Menu.buildFromTemplate([
        { 
            id: 'show',
            label: global.$t('show'), 
            type: 'normal', 
            click: () => {
                global.WALLET_WIN.show();
            }
        },
        { 
            id: 'reload',
            label: global.$t('reload'), 
            type: 'normal', 
            click: () => {
                global.WALLET_WIN.webContents.reload();
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
                global.WALLET_WIN.show();
                dialog.showSaveDialog({
                    filters: [
                        { name: 'JSON', extensions: ['json'] }
                    ],
                    defaultPath: `${global.currentWallet}.json`
                }).then(({canceled, filePath}) => {
                    if (filePath) {
                        fs.writeFileSync(filePath, fs.readFileSync(path.join(global.USER_DATA_PATH, `wallet/${global.currentWallet}.json`)));
                    }
                });
            }
        },
        { 
            id: 'import',
            label: global.$t('import'), 
            type: 'normal', 
            click: () => {
                global.WALLET_WIN.show();
                dialog.showOpenDialog({
                    filters: [
                        { name: 'JSON', extensions: ['json'] }
                    ],
                    properties: ['openFile']
                }).then(({canceled, filePaths}) => {
                    if (filePaths && filePaths[0]) {
                        let importFile = fs.readFileSync(filePaths[0]);
                        let importFilename = path.basename(filePaths[0], '.json');
                        let saveFilePath = path.join(global.USER_DATA_PATH, `wallet/${importFilename}.json`);
                        fs.access(saveFilePath, (err) => {
                            if (!err) {
                                saveFilePath = path.join(global.USER_DATA_PATH, `wallet/${importFilename}__${moment().format('MM-DD-YYYY__hh_mm_ss')}.json`);
                            }
                            fs.writeFileSync(saveFilePath, importFile);
                            changeWallet(path.basename(saveFilePath, '.json'));
                            setMenuContext();
                        });
                    }
                });
            }
        },
        { 
            id: 'showBackupFile',
            label: global.$t('showBackupFile'), 
            type: 'normal', 
            click: () => {
                shell.showItemInFolder(global.walletStore.path);
            }
        },
        { 
            id: 'settings',
            label: global.$t('settings'), 
            submenu: settingsSubmenu
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
    trayApp.setContextMenu(contextMenu);
}
