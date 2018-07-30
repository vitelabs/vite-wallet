const { remote } = require('electron');

// Account, Net, Block, Keystore, System, Types, TestToken
window.viteWallet = remote.require('./walletSrc/middle/index.js');
