const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const accountNameFile = path.join(app.getPath('appData'), 'viteWallet_AccountName');

module.exports = {
    readAccountNamesSync() {
        let defaultObj = {
            namesMap: {},
            nameCount: 0
        };

        let result = fs.existsSync(accountNameFile);
        // Not exists
        if (!result) {
            return defaultObj;
        }
    
        let file = fs.readFileSync(accountNameFile, {
            encoding: 'utf8'
        });

        // Ignore exception: name-list is missing if an exception occurs.
        let obj;
        try {
            obj = JSON.parse(file);
        } catch (error) {
            obj = defaultObj;
        }
        return obj || defaultObj;
    },
    writeAccountNames(__accountsMap, nameCount) {
        let namesMap = {};
        for(let address in __accountsMap) {
            namesMap[address] = __accountsMap[address].name;
        }

        fs.writeFile(accountNameFile, JSON.stringify({
            namesMap, nameCount
        }), 'utf8');
    }
};
