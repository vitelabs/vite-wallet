const isWindows = require('~app/modules/is-windows')();
const { app } = require('electron');
const os = require('os');
const fs = require('fs');
const path = require('path');

const validityPeriod = 1000 * 60 * 60 * 24;     // Valid for 1 day
const LOG_DATE_PATH = path.join(global.LOG_PATH, 'log_date');

module.exports = {
    saveSync() {
        updateLog();
        writeServerLogSync();
    },
    add() {
        
    }
};

function updateLog() {
    let nowDate = new Date().getTime();

    !fs.existsSync(global.LOG_PATH) && fs.mkdirSync(global.LOG_PATH);
    if ( !fs.existsSync(LOG_DATE_PATH) ) {
        fs.writeFileSync(LOG_DATE_PATH, nowDate, 'utf8');
        return;
    }

    let logDate = fs.readFileSync(LOG_DATE_PATH);
    if (logDate && (nowDate - logDate) < validityPeriod) {
        return;
    }
        
    deleteAll(global.LOG_PATH);
    fs.mkdirSync(global.LOG_PATH);
    fs.writeFileSync(LOG_DATE_PATH, nowDate, 'utf8');
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

function getBaseInfo() {
    return {
        nowDate: new Date().getTime(),
        appVersion: app.getVersion(),
        appName: app.getName(),
        appMetrics: app.getAppMetrics(),
        netStatus: global.netStatus,
        chromeVersion: process.versions.chrome,
        v8Version: process.versions.v8,
        nodeVersion: process.versions.node,
        platform: os.platform(),
        isWindows
    };
}

function writeServerLogSync() {
    let nowDate = new Date().getTime();
    let nowLog = path.join(global.LOG_PATH, `/server_${nowDate}.log`);

    let serverLog = fs.readFileSync(global.SERVER_LOG_PATH);
    let baseInfo = getBaseInfo();

    fs.writeFileSync(nowLog, `${serverLog}\n\n${JSON.stringify(baseInfo)}`, 'utf8');
    fs.unlinkSync(global.SERVER_LOG_PATH);
}
