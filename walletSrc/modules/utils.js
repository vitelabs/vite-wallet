const fs = require('fs');
const path = require('path');

exports.getWalletList = () => {
    try {
        let dirs = fs.readdirSync(path.join(global.USER_DATA_PATH, 'wallet'));
    
        let walletList = dirs.filter(item => /\.json$/.test(item)).map(item => item.replace(/\.json$/, ''));
        return walletList;
    } catch(err) {
        console.error(err);
        return [];
    }
}