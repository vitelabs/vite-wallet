const path = require('path');

const { app, Menu, Tray } = require('electron');

const version = require('../../version.json');

let trayApp = null;

module.exports = function() {
    trayApp = new Tray(path.join(global.APP_PATH, 'icon', 'tray-logo.png'));
    const contextMenu = Menu.buildFromTemplate([
        { 
            label: 'Show', 
            type: 'normal', 
            click: () => {
                app.show();
            }
        },
        { label: `Version: ${version.version}`, type: 'normal' },
        { label: 'Quit', type: 'normal', click: () => app.quit()}
    ]);

    // Call this again for Linux because we modified the context menu
    trayApp.setContextMenu(contextMenu);
}
