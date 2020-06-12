const path = require('path');

const { app, Menu, Tray } = require('electron');

const version = require('../../../package.json');

let trayApp = null;

module.exports = function() {
    trayApp = new Tray(path.join(global.APP_PATH, 'icon', 'tray-logo.png'));
    const contextMenu = Menu.buildFromTemplate([
        { 
            label: 'Show', 
            type: 'normal', 
            click: () => {
                global.WALLET_WIN.show();
            }
        },
        { label: `Version: ${version.version}`, type: 'normal' },
        { label: 'Quit', type: 'normal', click: () => global.APPQuit() }
    ]);

    trayApp.on('click', () => global.WALLET_WIN.show());

    // Call this again for Linux because we modified the context menu
    trayApp.setContextMenu(contextMenu);
}
