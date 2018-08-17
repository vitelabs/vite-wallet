const fs = require('fs');
const path = require('path');
const accountNameFile = path.join(global.USER_DATA_PATH, 'viteWallet_AccountName');

module.exports = {
    readAccountFileSync() {
        let defaultObj = {
            namesMap: {},
            nameCount: 0
        };

        let file = '';
        try {
            // Not exists
            if ( !fs.existsSync(accountNameFile) ) {
                return defaultObj;
            }

            file = fs.readFileSync(accountNameFile, {
                encoding: 'utf8'
            });
        } catch(err) {
            console.log(err);
        }

        // Ignore exception: name-list is missing if an exception occurs.
        let obj;
        try {
            obj = JSON.parse(file);
        } catch (error) {
            obj = defaultObj;
        }
        return obj || defaultObj;
    },
    writeAccountFile(namesMap, nameCount, lastLoginAccount) {
        fs.writeFile(accountNameFile, JSON.stringify({
            namesMap, nameCount, lastLoginAccount
        }), 'utf8', (err)=>{
            err && console.log(err);
        });
    }
};
