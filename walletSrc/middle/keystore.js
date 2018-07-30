const fs = require('fs');
const path = require('path');
const { shell } = require('electron');

class Keystore {
    constructor() {
        this.folder = '';
        global.goViteIPC['wallet.GetDataDir']().then((data)=>{
            this.folder = data;
        });
    }

    reloadFile() {
        return global.goViteIPC['wallet.ReloadAndFixAddressFile']();
    }

    isValidFile(path) {
        return global.goViteIPC['wallet.IsMayValidKeystoreFile'](path);
    }

    getFolder() {
        return global.goViteIPC['wallet.GetDataDir']().then((data)=>{
            this.folder = data;
            return data;
        });
    }

    openFolder() {
        if (this.folder) {
            shell.showItemInFolder(this.folder);
            return;
        }
        
        this.getFolder.then(() => {
            shell.showItemInFolder(this.folder);
        });
    }

    importFile(filePath, fileName) {
        return this.isValidFile(filePath).then((data) => {
            data && fs.renameSync(filePath, path.join(this.folder, fileName));
            return data;
        });
    }
}

module.exports = Keystore;