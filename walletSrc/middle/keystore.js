const fs = require('fs');
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

    importFile(filePath, fileName) {
        return this.isValidFile(filePath).then(({
            data
        }) => {
            data && fs.renameSync(filePath, path.join(this.folder, fileName));
            return data;
        });
    }
}

module.exports = Keystore;