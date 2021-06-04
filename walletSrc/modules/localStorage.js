/*
Some key is for settings. For multi-wallet to using signle settings. So save this to desktop settings store.
*/
const settingsKeys = [
    'VITE_WEB_WALLET_lang',
    'VITE_WEB_WALLET_beginnerGuide',
    'VITE_WEB_WALLET_favoriteTickers',
    'VITE_WEB_WALLET_theme',
    'VITE_WEB_WALLET_hideZeroAssets',
    'VITE_WEB_WALLET_autoLogoutTime',
    'VITE_WEB_WALLET_currency',
    'VITE_WEB_WALLET_gate',
    'VITE_WEB_WALLET_customNodes',
    'VITE_WEB_WALLET_currentNode'
];

/* 
Some key contains security value, so don't log to file. 
*/
const ignoreLogKeys = [
    'VITE_WEB_WALLET_ACC_LIST'
];

function getKeyPath(name) {
    if (!name) {
        return null;
    }
    name = name.replace(':', '_');
    return name;
}

function setItem(name, str) {
    let keyPath = getKeyPath(name);

    // VITE_WEB_WALLET_ACC_LIST contains the wallet info, for security, don't log into file.
    if (ignoreLogKeys.indexOf(keyPath) === -1) {
        console.info('setWalletStore', JSON.stringify({
            name, str
        }));
    }
    
    console.info('setWalletStore: Key', keyPath);

    if (!keyPath) {
        return;
    }

    try {
        setValue(keyPath, str);
    } catch (err) {
        console.error(`setWalletStoreFailed ${keyPath}: ${JSON.stringify(err)}`);
    }
}

function getItem(name) {
    console.info('getWalletStore', name);

    let keyPath = getKeyPath(name);
    console.info('getWalletStore: Key', keyPath);

    if (!keyPath) {
        return null;
    }

    let file = '';
    try {
        file = getValue(keyPath);
        
        // VITE_WEB_WALLET_ACC_LIST contains the wallet info, for security, don't log into file.
        if (ignoreLogKeys.indexOf(keyPath) === -1) {
            console.info('getWalletStore: Value', file);
        }
    } catch(err) {
        console.error(`getWalletStoreFailed: ${JSON.stringify(err)}`);
    }

    return file;
}

function getValue(key) {
    if (settingsKeys.indexOf(key) > -1) {
        return global.settingsStore.get(`webWallet.${global.settingsStore.get('net')}.${key}`);
    }
    return global.walletStore.get(key);
}

function setValue(key, value) {
    if (settingsKeys.indexOf(key) > -1) {
        return global.settingsStore.set(`webWallet.${global.settingsStore.get('net')}.${key}`, value);
    }
    return global.walletStore.set(key, value);
}

module.exports = {
    setItem, getItem
};