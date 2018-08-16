const { app, Menu, shell } = require('electron');

module.exports = function() {
    let serverLogPath = null;
    global.goViteIPC['common.LogDir']().then((data)=>{
        serverLogPath = data;
    }).catch((err)=>{
        console.log(err);
    });

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
                        global.WALLET_WIN && global.WALLET_WIN.webContents.openDevTools();
                    } 
                },
                { 
                    label: 'log', 
                    accelerator: 'CmdOrCtrl+L', 
                    click() {
                        shell.showItemInFolder(global.LOG_PATH);
                    } 
                },
                { 
                    label: 'serverLog', 
                    accelerator: 'CmdOrCtrl+P', 
                    click() {
                        shell.showItemInFolder(serverLogPath);
                    } 
                }
            ]
        }
    ];
    Menu.setApplicationMenu( Menu.buildFromTemplate(template) );
};