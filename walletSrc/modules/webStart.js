const path = require('path');
const { shell, remote } = require('electron');
const { Account, Net, Block } = remote.require('./walletSrc/middle/index.js');

// System APIs
const System = {
    openKeystore: function() {
        shell.showItemInFolder(path.join(remote.getGlobal('goFile'), '/wallet/'));
    },
    getLocale: remote.app.getLocale
};

window.viteWallet = {
    Account, Net, Block, System
};
