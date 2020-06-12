const store = global.walletStore;

function getFileName(name) {
    if (!name) {
        return null;
    }
    name = name.replace(':', '_');
    return name;
}

function setItem(name, str) {
    let fileName = getFileName(name);

    // VITE_WEB_WALLET_ACC_LIST contains the wallet info, for security, don't log into file.
    if (fileName !== 'VITE_WEB_WALLET_ACC_LIST') {
        console.info('setWalletStore', JSON.stringify({
            name, str
        }));
    }
    
    console.info('setWalletStore: Key', fileName);

    if (!fileName) {
        return;
    }

    try {
        store.set(fileName, str);
    } catch (err) {
        console.error(`setWalletStoreFailed ${fileName}: ${JSON.stringify(err)}`);
    }
}

function getItem(name) {
    console.info('getWalletStore', name);

    let fileName = getFileName(name);
    console.info('getWalletStore: Key', fileName);

    if (!fileName) {
        return null;
    }

    let file = '';
    try {
        file = store.get(fileName);
        
        // VITE_WEB_WALLET_ACC_LIST contains the wallet info, for security, don't log into file.
        if (fileName !== 'VITE_WEB_WALLET_ACC_LIST') {
            console.info('getWalletStore: Value', file);
        }
    } catch(err) {
        console.error(`getWalletStoreFailed: ${JSON.stringify(err)}`);
    }

    return file;
}

module.exports = {
    setItem, getItem
};