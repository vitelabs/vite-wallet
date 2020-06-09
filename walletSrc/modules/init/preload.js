const { remote } = require('electron');
const {
    appLocalStorage, appHttp, appI18n
} = remote.require('./walletSrc/modules/toWeb.js');


window.viteWalletStorage = appLocalStorage;
window.viteWalletRequest = appHttp;
window.viteWalletI18n = appI18n;
window.DESKTOP = true;

// const { Analytics } = require('../modules/electron-ga');
// window.analytics = new Analytics('UA-123680072-1');
// analytics.send('event', {
//     dp: 'home'
// });