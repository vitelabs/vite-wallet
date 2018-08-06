const isWindows = require('~app/modules/is-windows')();
const { app } = require('electron');
const os = require('os');
const fs = require('fs');
const path = require('path');

const validityPeriod = 1000 * 60 * 60 * 24;     // Valid for 1 day
const LOG_DATE_PATH = path.join(global.LOG_PATH, 'log_date');
let BASE_INFO = {
    appVersion: app.getVersion(),
    appName: app.getName(),
    appMetrics: app.getAppMetrics(),
    chromeVersion: process.versions.chrome,
    v8Version: process.versions.v8,
    nodeVersion: process.versions.node,
    platform: os.platform(),
    isWindows
};

let logDate = null;

module.exports = {
    saveSync() {
        updateLog();
        addLogSync(global.SERVER_LOG_PATH, getBaseInfo());  // append app-base-info to server-log
        addLogSync(global.CLIENT_LOG_PATH, getBaseInfo());  // append app-base-info to client-log
    },
    add(message) {
        let msg = `[${getNowDate()}] ${JSON.stringify(message)}`;
        addLogSync(global.CLIENT_LOG_PATH, msg);  // append app-base-info to client-log
    }
};

function updateLog() {
    let nowDate = new Date().getTime();

    if ( !fs.existsSync(LOG_DATE_PATH) ) {
        logDate = nowDate;
        fs.writeFileSync(LOG_DATE_PATH, nowDate, 'utf8');
        return;
    }

    logDate = logDate || fs.readFileSync(LOG_DATE_PATH);
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
    BASE_INFO.nowDate = getNowDate();
    BASE_INFO.netStatus = global.netStatus;
    return `\n\n[${getNowDate()}] ${JSON.stringify( BASE_INFO )}`;
}

function addLogSync(path, msg) {
    updateLog();

    if (!fs.existsSync(path)) {
        msg = `[${getNowDate(global.APP_START_TIME)}] start \n${msg}`; 
        fs.writeFileSync(path, msg, 'utf8');
        return;
    }

    try {
        fs.appendFileSync(path, msg, 'utf8');
    } catch(err) {
        console.log(err);
    }
}

function getNowDate(time) {
    let date = time ? new Date(time) : new Date();
    let yearFormat = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    let hourFormat = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return `${yearFormat} ${hourFormat}`;
}
