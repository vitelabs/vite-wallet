const {app, BrowserWindow, ipcMain} = require('electron');
  
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'VITE-WALLET',
        images: true
    });

    win.loadURL(
        'data:text/html,<div class="lds-ripple"><div></div><div></div></div><style>body{background: #f1f1f1;height:100vh;margin: 0;padding: 0;display: flex;justify-content: center;align-items: center;}.lds-ripple{display:inline-block;position:relative;width:64px;height:64px;}.lds-ripple div{position: absolute;border: 4px solid #4169E1;opacity: 1;border-radius: 50%;animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;}.lds-ripple div:nth-child(2) {animation-delay: -0.5s;}@keyframes lds-ripple {0% {top: 28px;left: 28px;width: 0;height: 0;opacity: 1;}100% {top: -1px;left: -1px;width: 58px;height: 58px;opacity: 0;}}</style>'
    );
    setTimeout(() => {
        win.loadFile('wallet/dist/index.html');
        win.webContents.once('dom-ready', () => {
            win.webContents.executeJavaScript(`
                let basePath = process.cwd();
                window.walletAPI = require(basePath + '/walletAPI.js');
            `);
        });

        // ipcMain listening...
        ipcMain.on('getLocal', (event)=>{
            // send to ipcRenderer
            event.sender.send('getLocalSend', app.getLocale());
            // same as win.webContents.send
        });
    }, 1000);

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
