const { remote } = require('electron');
const { Account, Net, Block, Keystore, System, HttpApIs } = remote.require('./walletSrc/middle/index.js');

window.viteWallet = {
    Account, Net, Block, System, Keystore, HttpApIs
};
