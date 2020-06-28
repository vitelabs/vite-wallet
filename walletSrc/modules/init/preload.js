const { remote, ipcRenderer } = require('electron');
const {
    appLocalStorage, appHttp, appI18n, touchID
} = remote.require('./walletSrc/modules/toWeb.js');


window.viteWalletStorage = appLocalStorage;
window.viteWalletRequest = appHttp;
window.viteWalletI18n = appI18n;
window.DESKTOP = true;
window.ipcRenderer = ipcRenderer;

if (process.platform === 'darwin') {
    window.touchID = touchID;
}