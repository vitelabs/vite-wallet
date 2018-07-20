const path = require('path');
const { shell } = require('electron');

class Keystore {
    constructor() {
        this.folder = path.join(global.goFile, '/wallet/');
    }

    reloadFile() {
        return global.goViteIPC['wallet.ReloadAndFixAddressFile']();
    }

    isValidFile(path) {
        return global.goViteIPC['wallet.IsMayValidKeystoreFile'](path);
    }

    openFolder() {
        shell.showItemInFolder(this.folder);
    }
}

module.exports = Keystore;