const { app, Menu, shell } = require('electron');
const log = require("electron-log");

module.exports = function() {
    let template = [
        {
            label: 'Vite Wallet',
            submenu: [
                { label: 'About Vite Wallet', selector: 'orderFrontStandardAboutPanel:' },
                { type: 'separator' },
                { 
                    label: 'Quit', 
                    accelerator: 'Command+Q', 
                    click() {
                        if (global.APPQuit) {
                            global.APPQuit();
                        } else {
                            app.quit();
                        }
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
                    label: 'Relaunch', 
                    accelerator: 'CmdOrCtrl+R', 
                    click() {
                        global.WALLET_WIN && global.WALLET_WIN.webContents.reload();
                    }
                },
                { 
                    label: 'Log', 
                    accelerator: 'CmdOrCtrl+L', 
                    click() {
                        shell.showItemInFolder(log.transports.file.getFile().path);
                    } 
                },
                {
                    label: 'Wallet File', 
                    accelerator: 'CmdOrCtrl+K', 
                    click() {
                        shell.showItemInFolder(global.walletStore.path);
                    }
                }
            ]
        }
    ];
    if (process.env.NODE_ENV === 'dev') {
        template[2].submenu.push(
            { 
                label: 'Devtool', 
                accelerator: 'CmdOrCtrl+Y', 
                click() {
                    global.WALLET_WIN && global.WALLET_WIN.webContents.openDevTools();
                } 
            }
        )
    }
    Menu.setApplicationMenu( Menu.buildFromTemplate(template) );
};