const { remote } = require('electron');
const { Account, Net, Block, Keystore } = remote.require('./walletSrc/middle/index.js');

// System APIs
const System = {
    getLocale: remote.app.getLocale
};

window.viteWallet = {
    Account, Net, Block, System, Keystore
};
