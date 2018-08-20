const fs = require('fs');
const path = require('path');
const { shell } = require('electron');

class Keystore {
    constructor() {
        this.folder = '';
        this.getFolder();
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
        let openF = () => {
            !fs.existsSync(this.folder) && fs.mkdirSync(this.folder);
            shell.showItemInFolder(this.folder);
        };
        
        if (this.folder) {
            openF();
            return;
        }
        
        this.getFolder.then(() => {
            openF();
        });
    }

    importFile(filePath, fileName) {
        return this.isValidFile(filePath).then((data) => {
            if (!data || !this.folder) {
                return false;
            }
            !fs.existsSync(this.folder) && fs.mkdirSync(this.folder);
            fs.renameSync(filePath, path.join(this.folder, fileName));
            return data;
        });
    }
}

module.exports = Keystore;