const fs = require('fs');
const path = require('path');

// Compatible with accountNameFile. -- oldVersion 0.0.1-14(test version, no prod, 0.0.2 can delete)
const oldAccountNameFile = path.join(global.APP_DATA_PATH, 'viteWallet_AccountName');
const accountNameFile = path.join(global.USER_DATA_PATH, 'viteWallet_AccountName');
try {
    if (fs.existsSync(oldAccountNameFile) && !fs.existsSync(accountNameFile)) {
        fs.renameSync(oldAccountNameFile, accountNameFile);
    }
} catch(err) {
    console.log(err);
}

module.exports = {
    readAccountFileSync() {
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
    writeAccountFile(namesMap, nameCount, lastLoginAccount) {
        fs.writeFile(accountNameFile, JSON.stringify({
            namesMap, nameCount, lastLoginAccount
        }), 'utf8', (err)=>{
            err && console.log(err);
        });
    }
};
