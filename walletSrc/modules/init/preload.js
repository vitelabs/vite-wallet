const { remote } = require('electron');
const {
    appLocalStorage, appHttp, appI18n
} = remote.require('./walletSrc/modules/toWeb.js');


window.viteWalletStorage = appLocalStorage;
window.viteWalletRequest = appHttp;
window.viteWalletI18n = appI18n;
window.DESKTOP = true;