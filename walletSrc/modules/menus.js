const { app, Menu, shell } = require('electron');

module.exports = function() {
    let template = [
        {
            label: 'ViteWallet',
            submenu: [
                { label: 'About ViteWallet', selector: 'orderFrontStandardAboutPanel:' },
                { type: 'separator' },
                { 
                    label: 'Quit', 
                    accelerator: 'Command+Q', 
                    click() { 
                        app.quit();
                    }
                }
            ]
        }, {
            label: 'Edit',
            submenu: [
                { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
                { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
                { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
                { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
                { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
            ]
        }, {
            label: 'Development',
            submenu: [
                { 
                    label: 'devtool', 
                    accelerator: 'CmdOrCtrl+Y', 
                    click() {
                        global.WALLET_WIN.webContents.openDevTools();
                    } 
                },
                { 
                    label: 'log', 
                    accelerator: 'CmdOrCtrl+L', 
                    click() {
                        shell.showItemInFolder(global.LOG_PATH);
                    } 
                }
            ]
        }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};