const {app, ipcMain} = require('electron');

// IpcMain listening...
ipcMain.on('getLocal', (event)=>{
    // send to ipcRenderer
    event.sender.send('getLocalSend', app.getLocale());
    // same as win.webContents.send
});

ipcMain.on('createAccount', (event)=>{
    // send to ipcRenderer
    event.sender.send('createAccountBack', 'createAccountBack');
    // same as win.webContents.send
});

ipcMain.on('getAccountList', (event)=>{
    // send to ipcRenderer
    event.sender.send('getAccountListBack', 'getAccountListBack');
    // same as win.webContents.send
});

ipcMain.on('syncNodes', (event)=>{
    // send to ipcRenderer
    event.sender.send('syncNodesBack', 'syncNodes');
    // same as win.webContents.send
});