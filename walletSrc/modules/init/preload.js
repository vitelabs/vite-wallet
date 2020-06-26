const { remote, ipcRenderer } = require('electron');
const {
    appLocalStorage, appHttp, appI18n, promptTouchID
} = remote.require('./walletSrc/modules/toWeb.js');


window.viteWalletStorage = appLocalStorage;
window.viteWalletRequest = appHttp;
window.viteWalletI18n = appI18n;
window.DESKTOP = true;
window.ipcRenderer = ipcRenderer;
window.promptTouchID = promptTouchID;

if (Notification.permission === "granted") {
    console.info('Notification is granted.');
} else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
        if (permission === "granted") {
            console.log('Got notification permission');
        }
        if (permission === 'default') {
            console.log('The permission request was dismissed.');
        }
        if (permission === 'denied') {
            console.log('Permission wasn\'t granted. Allow a retry.');
        }
    });
}