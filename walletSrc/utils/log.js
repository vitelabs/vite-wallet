const { app } = require('electron');
const fs = require('fs');
const path = require('path');

const validityPeriod = 1000 * 60 * 60 * 24;
const LOG_PATH = path.join(app.getPath('appData'), '/log');
const SERVER_LOG = '../../server.log';

module.exports = {
    save() {
        updateLog();
        let nowDate = new Date().getTime();
        
        // move server.log
        fs.writeFile(SERVER_LOG, path.join(LOG_PATH, `/server.${nowDate}.log`), () => {
            fs.unlinkSync(SERVER_LOG);
        });
    },
    add() {
        
    }
};

function updateLog() {
    let logDateFile = path.join(LOG_PATH, 'log.date');
    let nowDate = new Date().getTime();

    !fs.existsSync(LOG_PATH) && fs.mkdirSync(LOG_PATH);
    if ( !fs.existsSync(logDateFile) ) {
        fs.writeFile(logDateFile, nowDate, 'utf8');
        return;
    }

    // Valid for 1 day
    let logDate = fs.readFileSync(logDateFile);
    if ( !logDate || (nowDate - logDate) < validityPeriod) {
        return;
    }
        
    deleteAll(LOG_PATH);
    fs.mkdirSync(LOG_PATH);
    fs.writeFile(logDateFile, nowDate, 'utf8');
}

function deleteAll(dirPath) {
    if (!fs.existsSync(dirPath)) {
        return;
    }

    let files = fs.readdirSync(dirPath) || [];
    files.forEach(function (file) {
        let curPath = path.join(dirPath, file);
        if ( fs.statSync(curPath).isDirectory() ) { // recurse
            deleteAll(curPath);
            return;
        }
        fs.unlinkSync(curPath);
    });

    fs.rmdirSync(dirPath);
}
