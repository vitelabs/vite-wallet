const fs = require('fs');
const path = require('path');

function getFileName(name) {
    if (!name) {
        return null;
    }
    name = name.replace(':', '_');
    return path.join(global.USER_DATA_PATH, name);
}

function setItem(name, str) {
    console.log(name, str);

    let fileName = getFileName(name);
    if (!fileName) {
        return;
    }

    try {
        fs.writeFile(fileName, str, 'utf8', (err)=>{
            err && global.walletLog.error(`Write ${fileName}: ${JSON.stringify(err)}`);
        });
    } catch (err) {
        global.walletLog.error(`Write ${fileName}: ${JSON.stringify(err)}`);
    }

}

function getItem(name) {
    console.log(name);

    let fileName = getFileName(name);
    if (!fileName) {
        return null;
    }

    let file = '';
    try {
        // Not exists
        if ( !fs.existsSync(fileName) ) {
            return null;
        }

        file = fs.readFileSync(fileName, {
            encoding: 'utf8'
        });
    } catch(err) {
        global.walletLog.error(`Read account-file: ${JSON.stringify(err)}`);
    }

    console.log(file);
    return file;
}

module.exports = {
    setItem, getItem
};