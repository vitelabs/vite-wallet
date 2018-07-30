const { remote } = require('electron');
const { Account, Net, Block, Keystore, System, HttpAPIs } = remote.require('./walletSrc/middle/index.js');

window.viteWallet = {
    Account, Net, Block, System, Keystore, HttpAPIs
};
